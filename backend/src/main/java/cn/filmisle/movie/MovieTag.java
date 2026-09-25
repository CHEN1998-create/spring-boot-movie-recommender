package cn.filmisle.movie;

import jakarta.persistence.*;

/** 电影标签（PRD movie_tags 表） */
@Entity
@Table(
        name = "movie_tags",
        uniqueConstraints = @UniqueConstraint(name = "uk_movie_tag", columnNames = {"movie_id", "tag"})
)
public class MovieTag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(nullable = false, length = 50)
    private String tag;

    public MovieTag() {
    }

    public MovieTag(Movie movie, String tag) {
        this.movie = movie;
        this.tag = tag;
    }

    public Long getId() { return id; }

    public Movie getMovie() { return movie; }

    public String getTag() { return tag; }
    public void setTag(String tag) { this.tag = tag; }
}
