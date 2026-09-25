package cn.filmisle.me.dto;

import java.util.List;

/** 个人中心档案 + 行为摘要（个人中心头部与推荐页「偏好摘要」共用） */
public record MeProfileResponse(
        Long id,
        String nickname,
        String email,
        String role,
        String joinedAt,
        long ratedCount,
        long favoriteCount,
        List<String> topTags
) {
}
