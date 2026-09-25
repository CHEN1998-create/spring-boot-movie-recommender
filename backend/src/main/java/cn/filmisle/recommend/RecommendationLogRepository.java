package cn.filmisle.recommend;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface RecommendationLogRepository extends JpaRepository<RecommendationLog, Long> {

    /** 最近 N 条推荐日志（后台推荐概览） */
    List<RecommendationLog> findTop10ByOrderByCreatedAtDesc();

    /** 某时间点之后的推荐次数（后台：今日推荐次数） */
    long countByCreatedAtAfter(LocalDateTime time);

    /** 按策略统计推荐次数（后台：策略命中分布，策略为中文标签） */
    long countByStrategy(String strategy);

    /** 平均每次推荐结果数 */
    @Query("select coalesce(avg(l.resultCount), 0) from RecommendationLog l")
    double avgResultCount();

    /** 累计推荐展示条数（CTR 分母：点击数 / 展示条数） */
    @Query("select coalesce(sum(l.resultCount), 0) from RecommendationLog l")
    long sumResultCount();
}
