package cn.filmisle.me.dto;

import java.time.LocalDateTime;

/** 我的收藏记录（对齐前端 MyFavorite 类型） */
public record MeFavoriteResponse(
        Long movieId,
        LocalDateTime favoritedAt
) {
}
