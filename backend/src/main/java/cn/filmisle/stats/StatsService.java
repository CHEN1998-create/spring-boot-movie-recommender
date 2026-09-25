package cn.filmisle.stats;

import cn.filmisle.recommend.RecommendationClickRepository;
import cn.filmisle.recommend.RecommendationLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 统计服务：推荐点击率（CTR）为前后台共用的唯一口径。
 * CTR = 累计点击次数 / 累计推荐展示条数（recommendation_logs.result_count 求和）。
 */
@Service
public class StatsService {

    private final RecommendationClickRepository clickRepository;
    private final RecommendationLogRepository logRepository;

    public StatsService(RecommendationClickRepository clickRepository,
                        RecommendationLogRepository logRepository) {
        this.clickRepository = clickRepository;
        this.logRepository = logRepository;
    }

    /** 累计点击次数 */
    @Transactional(readOnly = true)
    public long recoClickCount() {
        return clickRepository.count();
    }

    /** 推荐点击率（%），保留 1 位小数 */
    @Transactional(readOnly = true)
    public double recoCtr() {
        long impressions = logRepository.sumResultCount();
        if (impressions == 0) {
            return 0.0;
        }
        return Math.round(clickRepository.count() * 1000.0 / impressions) / 10.0;
    }
}
