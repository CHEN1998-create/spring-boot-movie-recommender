package cn.filmisle.movie;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 电影实体（PRD movies 表）。
 * 说明：
 * - rating / ratingCount 为聚合冗余字段，由评分模块（后续）在写入评分时维护；
 * - castNames 暂以分隔符存储主演，后续如需按演员检索可拆出独立演员表。
 */
@Entity
@Table(name = "movies")
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "片名不能为空")
    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 200)
    private String originalTitle;

    /** 上映年份（year 为 H2 保留字，列名对齐 PRD 用 release_year） */
    @Column(name = "release_year")
    private Integer year;

    /** 片长（分钟） */
    private Integer duration;

    @Column(length = 100)
    private String director;

    @Column(name = "cast_names", length = 500)
    private String castNames;

    @Column(length = 100)
    private String region;

    @Column(length = 2000)
    private String summary;

    /** 平台均分（0-10），聚合冗余字段 */
    @Column(precision = 3, scale = 1)
    private BigDecimal rating;

    @Column(name = "rating_count")
    private Long ratingCount;

    @Column(name = "poster_url", length = 500)
    private String posterUrl;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /** 标签（PRD movie_tags 表，一对多） */
    @OneToMany(mappedBy = "movie", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovieTag> tags = new ArrayList<>();

    public Movie() {
    }

    // ---------- 标签便捷方法 ----------

    public void replaceTags(List<String> tagNames) {
        tags.clear();
        if (tagNames != null) {
            tagNames.stream()
                    .filter(t -> t != null && !t.isBlank())
                    .map(String::trim)
                    .distinct()
                    .forEach(t -> tags.add(new MovieTag(this, t)));
        }
    }

    public List<String> tagNames() {
        return tags.stream().map(MovieTag::getTag).toList();
    }

    // ---------- getter / setter ----------

    public Long getId() { return id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getOriginalTitle() { return originalTitle; }
    public void setOriginalTitle(String originalTitle) { this.originalTitle = originalTitle; }

    public Integer getYear() { return year; }
    public void setYear(Integer year) { this.year = year; }

    public Integer getDuration() { return duration; }
    public void setDuration(Integer duration) { this.duration = duration; }

    public String getDirector() { return director; }
    public void setDirector(String director) { this.director = director; }

    public String getCastNames() { return castNames; }
    public void setCastNames(String castNames) { this.castNames = castNames; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public Long getRatingCount() { return ratingCount; }
    public void setRatingCount(Long ratingCount) { this.ratingCount = ratingCount; }

    public String getPosterUrl() { return posterUrl; }
    public void setPosterUrl(String posterUrl) { this.posterUrl = posterUrl; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<MovieTag> getTags() { return tags; }
}
