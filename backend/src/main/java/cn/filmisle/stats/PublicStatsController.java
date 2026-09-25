package cn.filmisle.stats;

import cn.filmisle.movie.MovieRepository;
import cn.filmisle.rating.RatingRepository;
import cn.filmisle.stats.dto.PublicOverviewResponse;
import cn.filmisle.user.UserRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

/**
 * 公开统计接口（无登录态，游客可访问）：
 * 首页 Hero 区站点规模指标；管理员侧明细统计见 GET /api/admin/stats。
 */
@RestController
@RequestMapping("/api/stats")
public class PublicStatsController {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final StatsService statsService;

    public PublicStatsController(MovieRepository movieRepository,
                                 UserRepository userRepository,
                                 RatingRepository ratingRepository,
                                 StatsService statsService) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
        this.ratingRepository = ratingRepository;
        this.statsService = statsService;
    }

    /** GET /api/stats/overview —— 首页公开指标 */
    @GetMapping("/overview")
    public PublicOverviewResponse overview() {
        return new PublicOverviewResponse(
                movieRepository.count(),
                userRepository.count(),
                ratingRepository.countByCreatedAtAfter(LocalDate.now().atStartOfDay()),
                statsService.recoCtr()
        );
    }
}
