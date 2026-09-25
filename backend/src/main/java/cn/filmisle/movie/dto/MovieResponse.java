package cn.filmisle.movie.dto;

import cn.filmisle.movie.Movie;

import java.time.LocalDateTime;
import java.util.List;

/** 电影响应体：字段与前端 types.ts 的 Movie 接口对齐 */
public record MovieResponse(
        Long id,
        String title,
        String originalTitle,
        Integer year,
        Integer duration,
        String director,
        List<String> cast,
        String region,
        String summary,
        List<String> tags,
        Double rating,
        Long ratingCount,
        String posterUrl,
        LocalDateTime createdAt
) {
    public static MovieResponse from(Movie m) {
        List<String> cast = m.getCastNames() == null || m.getCastNames().isBlank()
                ? List.of()
                : List.of(m.getCastNames().split("\\s*[/,，]\\s*"));
        return new MovieResponse(
                m.getId(),
                m.getTitle(),
                m.getOriginalTitle(),
                m.getYear(),
                m.getDuration(),
                m.getDirector(),
                cast,
                m.getRegion(),
                m.getSummary(),
                m.tagNames(),
                m.getRating() == null ? null : m.getRating().doubleValue(),
                m.getRatingCount(),
                m.getPosterUrl(),
                m.getCreatedAt()
        );
    }
}
