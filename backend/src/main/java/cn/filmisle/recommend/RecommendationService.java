package cn.filmisle.recommend;

import cn.filmisle.favorite.Favorite;
import cn.filmisle.favorite.FavoriteRepository;
import cn.filmisle.movie.Movie;
import cn.filmisle.movie.MovieRepository;
import cn.filmisle.rating.Rating;
import cn.filmisle.rating.RatingRepository;
import cn.filmisle.recommend.dto.RecommendationItemResponse;
import cn.filmisle.recommend.dto.RecommendationResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 推荐服务：第一版可解释推荐算法（PRD 第 7 节）。
 *
 * 行为画像：
 *   - 评分 ≥ 7 视为正向信号，权重 (score-6)/4，即 7→0.25、8→0.5、9→0.75、10→1.0；
 *   - 收藏视为强正向信号，权重 1.0；
 *   - 同片多信号取较大值；正向行为影片的标签累加得到用户「标签偏好权重表」。
 *
 * 候选打分（0-1 归一化，已过滤用户评过/收藏过的影片）：
 *   score = 0.62 × 标签匹配度 + 0.25 × 影片质量(均分/10) + 0.13 × 热度(log 评分人数归一)
 *
 * 策略分级（与前端徽章对应 tag / hot / cold-start）：
 *   - 行为记录 < 3 条 → 冷启动：按站内口碑补位；
 *   - 标签匹配度 > 0 → 标签偏好（主策略），理由引用用户高分/收藏影片；
 *   - 其余 → 热门加权兜底。
 *
 * 每次生成写入 recommendation_logs（策略取结果集主导策略），TopN=10 或当前可用最大值。
 */
@Service
public class RecommendationService {

    /** 触发冷启动的行为记录阈值 */
    private static final int COLD_START_THRESHOLD = 3;
    /** TopN 数量 */
    private static final int TOP_N = 10;
    /** 打分权重：标签 / 质量 / 热度 */
    private static final double W_TAG = 0.62, W_QUALITY = 0.25, W_HOT = 0.13;

    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;
    private final MovieRepository movieRepository;
    private final RecommendationLogRepository logRepository;

    public RecommendationService(RatingRepository ratingRepository,
                                 FavoriteRepository favoriteRepository,
                                 MovieRepository movieRepository,
                                 RecommendationLogRepository logRepository) {
        this.ratingRepository = ratingRepository;
        this.favoriteRepository = favoriteRepository;
        this.movieRepository = movieRepository;
        this.logRepository = logRepository;
    }

    @Transactional
    public RecommendationResponse recommend(Long userId) {
        List<Rating> ratings = ratingRepository.findByUserId(userId);
        List<Favorite> favorites = favoriteRepository.findByUserId(userId);
        List<Movie> allMovies = movieRepository.findAll();
        Map<Long, Movie> movieIndex = allMovies.stream()
                .collect(Collectors.toMap(Movie::getId, m -> m));

        // ---- 1. 行为画像 ----
        Map<Long, Double> likedMovieWeight = likedMovieWeights(ratings, favorites);
        Map<String, Double> tagWeights = buildTagWeights(allMovies, likedMovieWeight);
        Set<Long> interacted = new HashSet<>();
        ratings.forEach(r -> interacted.add(r.getMovieId()));
        favorites.forEach(f -> interacted.add(f.getMovieId()));

        boolean coldStart = ratings.size() + favorites.size() < COLD_START_THRESHOLD;

        // ---- 2. 候选打分 ----
        double maxRatingCount = Math.max(1, allMovies.stream()
                .mapToLong(m -> m.getRatingCount() == null ? 0 : m.getRatingCount()).max().orElse(1));

        List<Scored> scored = new ArrayList<>();
        boolean anyTagHit = false;
        for (Movie m : allMovies) {
            if (interacted.contains(m.getId())) {
                continue;
            }
            // 标签匹配度：命中偏好标签的权重和做平滑归一（sum/(sum+2)），避免强偏好 saturate 拉不开差距
            List<Map.Entry<String, Double>> matched = m.tagNames().stream()
                    .filter(t -> tagWeights.getOrDefault(t, 0.0) > 0)
                    .sorted(Comparator.comparingDouble((String t) -> tagWeights.get(t)).reversed())
                    .map(t -> Map.entry(t, tagWeights.get(t)))
                    .toList();
            double rawTagSum = matched.stream().mapToDouble(Map.Entry::getValue).sum();
            double tagScore = rawTagSum / (rawTagSum + 2.0);
            double quality = (m.getRating() == null ? 0 : m.getRating().doubleValue()) / 10.0;
            long count = m.getRatingCount() == null ? 0 : m.getRatingCount();
            double hot = Math.log10(count + 1) / Math.log10(maxRatingCount + 1);
            double score = round2(W_TAG * tagScore + W_QUALITY * quality + W_HOT * hot);

            String strategy;
            String reason;
            if (coldStart) {
                strategy = "cold-start";
                reason = String.format("补位推荐：你的评分记录还较少，先从这部站内均分 %.1f 的口碑片开始建立偏好",
                        m.getRating() == null ? 0 : m.getRating().doubleValue());
            } else if (tagScore > 0) {
                strategy = "tag";
                anyTagHit = true;
                reason = tagReason(m, matched, ratings, favorites, movieIndex);
            } else {
                strategy = "hot";
                reason = String.format("站内热度之选：%d 人评分、均分 %.1f，大众口碑扎实，适合补充你的片单",
                        count, m.getRating() == null ? 0 : m.getRating().doubleValue());
            }
            scored.add(new Scored(m, score, strategy, reason,
                    matched.stream().map(Map.Entry::getKey).toList()));
        }

        scored.sort(Comparator.comparingDouble((Scored s) -> s.score).reversed());
        List<Scored> top = scored.stream().limit(TOP_N).toList();

        // ---- 3. 推荐日志（后台推荐概览数据源） ----
        String dominant = coldStart ? "冷启动补位" : (anyTagHit ? "标签偏好" : "热门加权");
        logRepository.save(new RecommendationLog(userId, dominant, top.size(), LocalDateTime.now()));

        return new RecommendationResponse(
                top.stream().map(s -> new RecommendationItemResponse(
                        s.movie.getId(),
                        s.movie.getTitle(),
                        s.movie.getPosterUrl(),
                        s.movie.getYear(),
                        s.movie.getRegion(),
                        s.movie.getRating() == null ? null : s.movie.getRating().doubleValue(),
                        s.movie.tagNames(),
                        s.score,
                        s.reason,
                        s.matchedTags,
                        s.strategy
                )).toList(),
                new RecommendationResponse.PreferenceSummary(
                        topTags(userId, 3),
                        ratings.size(),
                        favorites.size()
                )
        );
    }

    /** 用户偏好标签 TopN（个人中心 / 推荐页摘要共用） */
    @Transactional(readOnly = true)
    public List<String> topTags(Long userId, int limit) {
        Map<Long, Double> liked = likedMovieWeights(
                ratingRepository.findByUserId(userId), favoriteRepository.findByUserId(userId));
        if (liked.isEmpty()) {
            return List.of();
        }
        Map<String, Double> tagWeights = buildTagWeights(movieRepository.findAll(), liked);
        return tagWeights.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(limit)
                .map(Map.Entry::getKey)
                .toList();
    }

    // ---------- 内部方法 ----------

    /** 正向行为 → 电影权重：评分 (score-6)/4（score≥7），收藏 1.0，同片取较大值 */
    private Map<Long, Double> likedMovieWeights(List<Rating> ratings, List<Favorite> favorites) {
        Map<Long, Double> weights = new HashMap<>();
        for (Rating r : ratings) {
            if (r.getScore() != null && r.getScore() >= 7) {
                weights.merge(r.getMovieId(), (r.getScore() - 6) / 4.0, Math::max);
            }
        }
        for (Favorite f : favorites) {
            weights.merge(f.getMovieId(), 1.0, Math::max);
        }
        return weights;
    }

    /** 电影权重 → 标签偏好权重表 */
    private Map<String, Double> buildTagWeights(List<Movie> allMovies, Map<Long, Double> likedMovieWeight) {
        Map<String, Double> tagWeights = new HashMap<>();
        for (Movie m : allMovies) {
            Double w = likedMovieWeight.get(m.getId());
            if (w == null) {
                continue;
            }
            for (String tag : m.tagNames()) {
                tagWeights.merge(tag, w, Double::sum);
            }
        }
        return tagWeights;
    }

    /**
     * 标签偏好理由：引用与候选共享命中标签、且用户权重最高的正向行为影片（评分或收藏）。
     */
    private String tagReason(Movie candidate,
                             List<Map.Entry<String, Double>> matched,
                             List<Rating> ratings,
                             List<Favorite> favorites,
                             Map<Long, Movie> movieIndex) {
        String tagText = String.join("、",
                matched.stream().limit(2).map(Map.Entry::getKey).toList());

        Map<Long, Double> liked = likedMovieWeights(ratings, favorites);
        Movie bestRef = null;
        double bestW = -1;
        int bestRefScore = -1;
        for (Map.Entry<Long, Double> e : liked.entrySet()) {
            Movie ref = movieIndex.get(e.getKey());
            if (ref == null || Objects.equals(ref.getId(), candidate.getId())) {
                continue;
            }
            boolean sharesTag = ref.tagNames().stream()
                    .anyMatch(t -> matched.stream().anyMatch(m -> m.getKey().equals(t)));
            if (!sharesTag) {
                continue;
            }
            int rs = ratings.stream()
                    .filter(r -> r.getMovieId().equals(ref.getId()))
                    .map(Rating::getScore)
                    .findFirst()
                    .orElse(0);
            // 参照优先级：行为权重高者；权重相同则评分高者更有说服力
            if (e.getValue() > bestW || (e.getValue() == bestW && rs > bestRefScore)) {
                bestW = e.getValue();
                bestRefScore = rs;
                bestRef = ref;
            }
        }
        if (bestRef == null) {
            return String.format("你偏好的%s题材中，这部口碑与热度俱佳，值得一试", tagText);
        }
        final Movie ref = bestRef;
        boolean refFavorited = favorites.stream().anyMatch(f -> f.getMovieId().equals(ref.getId()));
        int refScore = ratings.stream()
                .filter(r -> r.getMovieId().equals(ref.getId()))
                .map(Rating::getScore)
                .findFirst()
                .orElse(0);

        if (refFavorited && refScore >= 7) {
            return String.format("你收藏过并给《%s》打了 %d 分，这部同属%s题材，与你的口味高度吻合",
                    bestRef.getTitle(), refScore, tagText);
        }
        if (refFavorited) {
            return String.format("你收藏过《%s》，这部同属%s题材，大概率也对你的胃口",
                    bestRef.getTitle(), tagText);
        }
        return String.format("你给《%s》打了 %d 分，同属%s题材，标签偏好强关联推荐",
                bestRef.getTitle(), refScore, tagText);
    }

    private static double round2(double v) {
        return Math.round(v * 100) / 100.0;
    }

    private record Scored(Movie movie, double score, String strategy, String reason, List<String> matchedTags) {
    }
}
