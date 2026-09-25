package cn.filmisle.rating;

import cn.filmisle.rating.dto.RatingRequest;
import cn.filmisle.rating.dto.RatingResponse;
import cn.filmisle.user.CurrentUserResolver;
import cn.filmisle.user.User;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/**
 * 评分接口（PRD：POST /api/movies/:id/ratings）。
 * 用户身份：X-User-Id 请求头，缺省回落演示用户。
 */
@RestController
@RequestMapping("/api/movies/{movieId}/ratings")
public class RatingController {

    private final RatingService ratingService;
    private final CurrentUserResolver currentUserResolver;

    public RatingController(RatingService ratingService, CurrentUserResolver currentUserResolver) {
        this.ratingService = ratingService;
        this.currentUserResolver = currentUserResolver;
    }

    @PostMapping
    public RatingResponse rate(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader,
                               @PathVariable Long movieId,
                               @Valid @RequestBody RatingRequest request) {
        User user = currentUserResolver.resolve(userIdHeader);
        return ratingService.rate(user.getId(), movieId, request.score());
    }

    /** 我的评分（未评返回 score=null，供详情页回显初始态） */
    @GetMapping
    public RatingResponse myRating(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader,
                                   @PathVariable Long movieId) {
        User user = currentUserResolver.resolve(userIdHeader);
        Integer score = ratingService.myScore(user.getId(), movieId);
        return new RatingResponse(movieId, score, null, null, null);
    }
}
