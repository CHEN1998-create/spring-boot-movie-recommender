package cn.filmisle.rating;

import cn.filmisle.common.ResourceNotFoundException;
import cn.filmisle.movie.Movie;
import cn.filmisle.movie.MovieRepository;
import cn.filmisle.rating.dto.RatingResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 评分业务：upsert 评分 + 电影聚合分（rating / ratingCount）增量维护。
 * 聚合口径：movies 表已有的 rating/ratingCount 视为平台基线（含种子假想评分人），
 * 真实评分以增量方式并入，保证演示时均分不会因少量评分剧烈跳变、评分人数可见增长。
 */
@Service
public class RatingService {

    private final RatingRepository ratingRepository;
    private final MovieRepository movieRepository;

    public RatingService(RatingRepository ratingRepository, MovieRepository movieRepository) {
        this.ratingRepository = ratingRepository;
        this.movieRepository = movieRepository;
    }

    /** 提交评分（同片重复评分覆盖旧分） */
    @Transactional
    public RatingResponse rate(Long userId, Long movieId, int score) {
        Movie movie = movieRepository.findById(movieId)
                .orElseThrow(() -> new ResourceNotFoundException("电影", movieId));

        LocalDateTime now = LocalDateTime.now();
        Rating rating = ratingRepository.findByUserIdAndMovieId(userId, movieId).orElse(null);
        if (rating != null) {
            applyReRate(movie, rating.getScore(), score);
            rating.setScore(score);
            rating.setUpdatedAt(now);
        } else {
            rating = new Rating(userId, movieId, score, now);
            applyFirstRate(movie, score);
        }
        ratingRepository.save(rating);
        movieRepository.save(movie);

        return new RatingResponse(
                movieId,
                score,
                rating.getCreatedAt(),
                movie.getRating() == null ? null : movie.getRating().doubleValue(),
                movie.getRatingCount()
        );
    }

    /** 我的某部电影评分（未评返回 null） */
    @Transactional(readOnly = true)
    public Integer myScore(Long userId, Long movieId) {
        return ratingRepository.findByUserIdAndMovieId(userId, movieId)
                .map(Rating::getScore).orElse(null);
    }

    /** 我的评分历史（个人中心） */
    @Transactional(readOnly = true)
    public List<Rating> myRatings(Long userId) {
        return ratingRepository.findByUserIdOrderByUpdatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Rating> byUser(Long userId) {
        return ratingRepository.findByUserId(userId);
    }

    // ---------- 聚合分维护 ----------

    /** 首次评分：人数 +1，均分按基线人数加权并入 */
    private void applyFirstRate(Movie movie, int score) {
        long count = nvlCount(movie);
        BigDecimal rating = nvlRating(movie);
        movie.setRatingCount(count + 1);
        movie.setRating(blend(rating, BigDecimal.valueOf(count), BigDecimal.valueOf(score)));
    }

    /** 重复评分：人数不变，均分按「减旧分加新分」修正 */
    private void applyReRate(Movie movie, int oldScore, int newScore) {
        long count = nvlCount(movie);
        BigDecimal rating = nvlRating(movie);
        if (count <= 0) {
            movie.setRating(BigDecimal.valueOf(newScore));
            return;
        }
        BigDecimal delta = BigDecimal.valueOf(newScore - oldScore);
        BigDecimal next = rating.multiply(BigDecimal.valueOf(count)).add(delta)
                .divide(BigDecimal.valueOf(count), 1, RoundingMode.HALF_UP);
        movie.setRating(clamp(next));
    }

    private BigDecimal blend(BigDecimal rating, BigDecimal count, BigDecimal score) {
        if (count.signum() <= 0) {
            return score.setScale(1, RoundingMode.HALF_UP);
        }
        return clamp(rating.multiply(count).add(score).divide(count.add(BigDecimal.ONE), 1, RoundingMode.HALF_UP));
    }

    private BigDecimal nvlRating(Movie movie) {
        return movie.getRating() == null ? BigDecimal.ZERO : movie.getRating();
    }

    private long nvlCount(Movie movie) {
        return movie.getRatingCount() == null ? 0L : movie.getRatingCount();
    }

    private BigDecimal clamp(BigDecimal v) {
        if (v.doubleValue() < 0) return BigDecimal.ZERO.setScale(1);
        if (v.doubleValue() > 10) return BigDecimal.TEN.setScale(1);
        return v;
    }
}
