package cn.filmisle.recommend.dto;

import java.util.List;

/** 推荐条目：内嵌影片展示字段，前端无需再反查电影详情 */
public record RecommendationItemResponse(
        Long movieId,
        String title,
        String posterUrl,
        Integer year,
        String region,
        Double rating,
        List<String> tags,
        Double score,
        String reason,
        List<String> matchedTags,
        String strategy
) {
}
