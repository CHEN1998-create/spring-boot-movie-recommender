package cn.filmisle.rating;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * 评分实体（PRD ratings 表）。
 * 业务规则：每个用户对同一电影只保留一条评分（唯一约束 + upsert）。
 */
@Entity
@Table(name = "ratings", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "movie_id"}))
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    /** 1-10 分 */
    @Column(nullable = false)
    private Integer score;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Rating() {
    }

    public Rating(Long userId, Long movieId, Integer score, LocalDateTime now) {
        this.userId = userId;
        this.movieId = movieId;
        this.score = score;
        this.createdAt = now;
        this.updatedAt = now;
    }

    // ---------- getter / setter ----------

    public Long getId() { return id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getMovieId() { return movieId; }
    public void setMovieId(Long movieId) { this.movieId = movieId; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
