package cn.filmisle.rating.dto;

import java.time.LocalDateTime;

/**
 * 评分响应体：除我的评分外，附带维护后的电影聚合分，
 * 前端详情页可直接用返回值刷新「片屿均分 / 评分人数」，无需再查一次详情。
 */
public record RatingResponse(
        Long movieId,
        Integer score,
        LocalDateTime ratedAt,
        Double movieRating,
        Long movieRatingCount
) {
}
