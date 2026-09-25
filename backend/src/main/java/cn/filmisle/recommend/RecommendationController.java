package cn.filmisle.recommend;

import cn.filmisle.recommend.dto.RecommendationResponse;
import cn.filmisle.user.CurrentUserResolver;
import cn.filmisle.user.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 推荐接口（PRD：GET /api/recommendations）。
 * 用户身份：X-User-Id 请求头，缺省回落演示用户。
 */
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final CurrentUserResolver currentUserResolver;
    private final RecommendationClickRepository clickRepository;

    public RecommendationController(RecommendationService recommendationService,
                                    CurrentUserResolver currentUserResolver,
                                    RecommendationClickRepository clickRepository) {
        this.recommendationService = recommendationService;
        this.currentUserResolver = currentUserResolver;
        this.clickRepository = clickRepository;
    }

    @GetMapping
    public RecommendationResponse recommendations(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader) {
        User user = currentUserResolver.resolve(userIdHeader);
        return recommendationService.recommend(user.getId());
    }

    /**
     * 推荐点击上报（PRD 6.1 推荐点击率数据源）。
     * 幂等：同一用户对同一影片每天只计一次，重复上报返回 204 且不落库。
     */
    @PostMapping("/{movieId}/click")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void reportClick(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader,
                            @PathVariable Long movieId) {
        User user = currentUserResolver.resolve(userIdHeader);
        LocalDateTime dayStart = LocalDate.now().atStartOfDay();
        if (clickRepository.existsByUserIdAndMovieIdAndCreatedAtAfter(user.getId(), movieId, dayStart)) {
            return;
        }
        clickRepository.save(new RecommendationClick(user.getId(), movieId, LocalDateTime.now()));
    }
}
