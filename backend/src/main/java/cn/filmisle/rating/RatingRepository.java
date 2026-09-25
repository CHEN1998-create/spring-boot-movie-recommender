package cn.filmisle.rating;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByUserIdAndMovieId(Long userId, Long movieId);

    List<Rating> findByUserIdOrderByUpdatedAtDesc(Long userId);

    List<Rating> findByUserId(Long userId);

    long countByMovieId(Long movieId);

    /** 某时间点之后的评分数（后台 / 首页：今日评分数） */
    long countByCreatedAtAfter(LocalDateTime time);

    /** 某时间点之后的评分（后台：近 7 日趋势） */
    List<Rating> findByCreatedAtAfter(LocalDateTime time);

    /** 每用户评分条数（后台：冷启动用户占比，评分 < 3 条视为冷启动） */
    @Query("select r.userId, count(r) from Rating r group by r.userId")
    List<Object[]> countGroupByUser();
}
