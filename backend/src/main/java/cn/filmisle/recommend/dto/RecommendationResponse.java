package cn.filmisle.recommend.dto;

import java.util.List;

/** 推荐页响应体：TopN 结果 + 偏好摘要（页头「为什么推给你」） */
public record RecommendationResponse(
        List<RecommendationItemResponse> items,
        PreferenceSummary summary
) {

    public record PreferenceSummary(
            List<String> topTags,
            long ratedCount,
            long favoriteCount
    ) {
    }
}
