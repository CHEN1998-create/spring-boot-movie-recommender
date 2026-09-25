package cn.filmisle.me.dto;

import java.time.LocalDateTime;

/** 我的评分记录（对齐前端 MyRating 类型） */
public record MeRatingResponse(
        Long movieId,
        Integer score,
        LocalDateTime ratedAt
) {
}
