package cn.filmisle.recommend;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface RecommendationClickRepository extends JpaRepository<RecommendationClick, Long> {

    /** 同用户同影片当日是否已点击（写入去重） */
    boolean existsByUserIdAndMovieIdAndCreatedAtAfter(Long userId, Long movieId, LocalDateTime time);
}
