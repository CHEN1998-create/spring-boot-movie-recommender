package cn.filmisle.admin;

import cn.filmisle.admin.dto.AdminStatsResponse;
import cn.filmisle.favorite.FavoriteRepository;
import cn.filmisle.movie.MovieRepository;
import cn.filmisle.rating.Rating;
import cn.filmisle.rating.RatingRepository;
import cn.filmisle.recommend.RecommendationLog;
import cn.filmisle.recommend.RecommendationLogRepository;
import cn.filmisle.stats.StatsService;
import cn.filmisle.user.User;
import cn.filmisle.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 后台统计服务（PRD 6.1）。
 * 数据量为演示级（几十部影片 / 几百条行为），聚合直接在内存完成；
 * 数据量增长后再下沉为 SQL 聚合或定时快照。
 */
@Service
public class AdminStatsService {

    private static final DateTimeFormatter DAY_FMT = DateTimeFormatter.ofPattern("MM-dd");
    private static final DateTimeFormatter TIME_FMT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    /** 与推荐策略中文标签一致（RecommendationLog.strategy） */
    private static final List<String> STRATEGIES = List.of("标签偏好", "热门加权", "冷启动补位");
    /** 评分少于该条数视为冷启动用户 */
    private static final long COLD_START_THRESHOLD = 3;

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;
    private final RecommendationLogRepository logRepository;
    private final StatsService statsService;

    public AdminStatsService(MovieRepository movieRepository,
                             UserRepository userRepository,
                             RatingRepository ratingRepository,
                             FavoriteRepository favoriteRepository,
                             RecommendationLogRepository logRepository,
                             StatsService statsService) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.ratingRepository = ratingRepository;
        this.favoriteRepository = favoriteRepository;
        this.logRepository = logRepository;
        this.statsService = statsService;
    }

    @Transactional(readOnly = true)
    public AdminStatsResponse stats() {
        LocalDate today = LocalDate.now();
        LocalDateTime dayStart = today.atStartOfDay();

        // ---- 基础量 ----
        long movieCount = movieRepository.count();
        long userCount = userRepository.count();
        long ratingCount = ratingRepository.count();
        long todayRatingCount = ratingRepository.countByCreatedAtAfter(dayStart);
        long favoriteCount = favoriteRepository.count();

        // ---- 比率指标 ----
        long favoriteUsers = favoriteRepository.countDistinctUsers();
        double favoriteRate = percent(favoriteUsers, userCount);

        List<Object[]> ratingRows = ratingRepository.countGroupByUser();
        long coldStartUsers = ratingRows.stream()
                .filter(row -> ((Number) row[1]).longValue() < COLD_START_THRESHOLD)
                .count();
        double coldStartRate = percent(coldStartUsers, userCount);

        // ---- 近 7 日评分趋势 ----
        List<AdminStatsResponse.DayCount> weeklyRatings = weeklyRatingTrend(today);

        // ---- 推荐效果 ----
        long recoTotalCount = logRepository.count();
        long todayRecoCount = logRepository.countByCreatedAtAfter(dayStart);
        double avgResultCount = Math.round(logRepository.avgResultCount() * 10) / 10.0;
        double recoCtr = statsService.recoCtr();
        long recoClickCount = statsService.recoClickCount();
        List<AdminStatsResponse.StrategyCount> strategyDist = strategyDistribution(recoTotalCount);
        List<AdminStatsResponse.LogItem> recentLogs = recentLogs();

        return new AdminStatsResponse(
                movieCount,
                userCount,
                ratingCount,
                todayRatingCount,
                favoriteCount,
                favoriteRate,
                recoTotalCount,
                todayRecoCount,
                avgResultCount,
                recoCtr,
                recoClickCount,
                coldStartRate,
                weeklyRatings,
                strategyDist,
                hotTags(),
                recentLogs
        );
    }

    // ---------- 内部方法 ----------

    /** 近 7 日每日新增评分数（按 ratings.created_at 聚合） */
    private List<AdminStatsResponse.DayCount> weeklyRatingTrend(LocalDate today) {
        LocalDateTime start = today.minusDays(6).atStartOfDay();
        Map<LocalDate, Long> byDay = ratingRepository.findByCreatedAtAfter(start).stream()
                .collect(Collectors.groupingBy(r -> r.getCreatedAt().toLocalDate(), Collectors.counting()));

        List<AdminStatsResponse.DayCount> result = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate d = today.minusDays(i);
            result.add(new AdminStatsResponse.DayCount(d.format(DAY_FMT), byDay.getOrDefault(d, 0L)));
        }
        return result;
    }

    /** 三级策略命中次数与占比（全部推荐日志） */
    private List<AdminStatsResponse.StrategyCount> strategyDistribution(long total) {
        List<AdminStatsResponse.StrategyCount> dist = new ArrayList<>();
        for (String strategy : STRATEGIES) {
            long count = logRepository.countByStrategy(strategy);
            dist.add(new AdminStatsResponse.StrategyCount(strategy, count, percent(count, total)));
        }
        return dist;
    }

    /** 热门标签 Top10：用户评分 + 收藏行为落到影片标签上的热度 */
    private List<AdminStatsResponse.TagCount> hotTags() {
        Map<Long, Long> movieHits = new HashMap<>();
        for (Rating r : ratingRepository.findAll()) {
            movieHits.merge(r.getMovieId(), 1L, Long::sum);
        }
        favoriteRepository.findAll().forEach(f -> movieHits.merge(f.getMovieId(), 1L, Long::sum));

        Map<String, Long> tagCounts = new HashMap<>();
        movieRepository.findAll().forEach(m -> {
            long hits = movieHits.getOrDefault(m.getId(), 0L);
            if (hits == 0) {
                return;
            }
            m.getTags().forEach(t -> tagCounts.merge(t.getTag(), hits, Long::sum));
        });

        return tagCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(10)
                .map(e -> new AdminStatsResponse.TagCount(e.getKey(), e.getValue()))
                .toList();
    }

    /** 最近 10 条推荐日志，附带用户昵称 */
    private List<AdminStatsResponse.LogItem> recentLogs() {
        Map<Long, String> names = userRepository.findAll().stream()
                .collect(Collectors.toMap(User::getId, User::getNickname, (a, b) -> a));
        return logRepository.findTop10ByOrderByCreatedAtDesc().stream()
                .map(log -> new AdminStatsResponse.LogItem(
                        log.getId(),
                        log.getUserId(),
                        names.getOrDefault(log.getUserId(), "用户#" + log.getUserId()),
                        log.getStrategy(),
                        log.getResultCount(),
                        log.getCreatedAt().format(TIME_FMT)
                ))
                .toList();
    }

    /** 占比（%），保留 1 位小数 */
    private double percent(long part, long total) {
        if (total == 0) {
            return 0.0;
        }
        return Math.round(part * 1000.0 / total) / 10.0;
    }
}
