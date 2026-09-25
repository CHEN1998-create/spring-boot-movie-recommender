package cn.filmisle.stats.dto;

/**
 * 公开站点概览（游客可访问，首页 Hero 展示用）：
 * 只暴露站点规模类指标，不含用户行为明细。
 */
public record PublicOverviewResponse(
        long movieCount,
        long userCount,
        long todayRatingCount,
        /** 推荐点击率（%） */
        double recoCtr
) {
}
