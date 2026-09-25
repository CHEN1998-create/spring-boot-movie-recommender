package cn.filmisle.recommend;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * 推荐日志（PRD recommendation_logs 表）：每次生成推荐落一条，
 * 供后台「推荐概览」统计策略分布与结果量。
 */
@Entity
@Table(name = "recommendation_logs")
public class RecommendationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** 标签偏好 / 热门加权 / 冷启动补位 */
    @Column(nullable = false, length = 50)
    private String strategy;

    @Column(name = "result_count", nullable = false)
    private Integer resultCount;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public RecommendationLog() {
    }

    public RecommendationLog(Long userId, String strategy, Integer resultCount, LocalDateTime createdAt) {
        this.userId = userId;
        this.strategy = strategy;
        this.resultCount = resultCount;
        this.createdAt = createdAt;
    }

    // ---------- getter / setter ----------

    public Long getId() { return id; }

    public Long getUserId() { return userId; }

    public String getStrategy() { return strategy; }

    public Integer getResultCount() { return resultCount; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
