package cn.filmisle.me.dto;

/** 我与某部电影的交互状态（详情页回显初始态：是否已评分 / 已收藏） */
public record InteractionResponse(
        Long movieId,
        Integer myScore,
        boolean favorited
) {
}
