package cn.filmisle.recommend;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * 推荐点击埋点（PRD 6.1 推荐点击率指标）：
 * 用户从推荐页点击影片进入详情时上报一条。
 * 同一用户对同一影片每天只计一次（写入侧去重），避免重复刷新虚增 CTR。
 */
@Entity
@Table(name = "recommendation_clicks")
public class RecommendationClick {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public RecommendationClick() {
    }

    public RecommendationClick(Long userId, Long movieId, LocalDateTime createdAt) {
        this.userId = userId;
        this.movieId = movieId;
        this.createdAt = createdAt;
    }

    // ---------- getter / setter ----------

    public Long getId() { return id; }

    public Long getUserId() { return userId; }

    public Long getMovieId() { return movieId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
