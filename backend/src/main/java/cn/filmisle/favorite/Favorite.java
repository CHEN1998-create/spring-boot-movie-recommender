package cn.filmisle.favorite;

import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * 收藏实体（PRD favorites 表）。
 * 业务规则：一个用户对一部电影只收藏一次（唯一约束，重复收藏幂等）。
 */
@Entity
@Table(name = "favorites", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "movie_id"}))
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "movie_id", nullable = false)
    private Long movieId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Favorite() {
    }

    public Favorite(Long userId, Long movieId, LocalDateTime createdAt) {
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
