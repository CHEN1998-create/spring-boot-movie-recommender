package cn.filmisle.admin.dto;

import java.util.List;

/**
 * 后台统计聚合响应（PRD 6.1 后台指标）：
 * 数据看板与推荐概览共用，一次请求返回全部指标。
 */
public record AdminStatsResponse(
        long movieCount,
        long userCount,
        /** 累计评分数 */
        long ratingCount,
        long todayRatingCount,
        long favoriteCount,
        /** 收藏率：收藏过至少一部的用户占比（%） */
        double favoriteRate,
        /** 推荐总次数 */
        long recoTotalCount,
        long todayRecoCount,
        /** 平均每次推荐结果数 */
        double avgResultCount,
        /** 推荐点击率：累计点击 / 累计推荐展示条数（%） */
        double recoCtr,
        /** 累计推荐点击次数 */
        long recoClickCount,
        /** 冷启动用户占比：评分 < 3 条的用户（%） */
        double coldStartRate,
        /** 近 7 日评分数（升序，含今日） */
        List<DayCount> weeklyRatings,
        /** 推荐策略命中分布 */
        List<StrategyCount> strategyDist,
        /** 热门标签 Top10（按评分 + 收藏行为聚合） */
        List<TagCount> hotTags,
        /** 最近 10 条推荐日志 */
        List<LogItem> recentLogs
) {

    public record DayCount(String day, long count) {
    }

    /** strategy 为中文标签：标签偏好 / 热门加权 / 冷启动补位 */
    public record StrategyCount(String strategy, long count, double percent) {
    }

    public record TagCount(String tag, long count) {
    }

    public record LogItem(long id, Long userId, String userName, String strategy, int resultCount, String time) {
    }
}
