package cn.filmisle.movie.dto;

import java.util.List;

/** 电影列表响应：分页结构，前端 MovieListPage 直接消费 */
public record MovieListResponse(
        List<MovieResponse> items,
        long total,
        int page,
        int pageSize
) {
}
