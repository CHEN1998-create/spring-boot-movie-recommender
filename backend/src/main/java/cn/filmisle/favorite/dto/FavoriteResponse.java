package cn.filmisle.favorite.dto;

import java.time.LocalDateTime;

/** 收藏操作响应体：favorited 表示操作后的最终状态 */
public record FavoriteResponse(
        Long movieId,
        boolean favorited,
        LocalDateTime favoritedAt
) {
}
