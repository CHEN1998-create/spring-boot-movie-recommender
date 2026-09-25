package cn.filmisle.recommend;

import cn.filmisle.recommend.dto.RecommendationResponse;
import cn.filmisle.user.CurrentUserResolver;
import cn.filmisle.user.User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 推荐接口（PRD：GET /api/recommendations）。
 * 用户身份：X-User-Id 请求头，缺省回落演示用户。
 */
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;
    private final CurrentUserResolver currentUserResolver;

    public RecommendationController(RecommendationService recommendationService,
                                    CurrentUserResolver currentUserResolver) {
        this.recommendationService = recommendationService;
        this.currentUserResolver = currentUserResolver;
    }

    @GetMapping
    public RecommendationResponse recommendations(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader) {
        User user = currentUserResolver.resolve(userIdHeader);
        return recommendationService.recommend(user.getId());
    }
}
