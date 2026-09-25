package cn.filmisle.rating;

import cn.filmisle.auth.CurrentUser;
import cn.filmisle.rating.dto.RatingRequest;
import cn.filmisle.rating.dto.RatingResponse;
import cn.filmisle.user.User;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

/**
 * 评分接口（PRD：POST /api/movies/:id/ratings）。
 * 身份：JWT（Authorization: Bearer），无 token 时回落演示用户。
 */
@RestController
@RequestMapping("/api/movies/{movieId}/ratings")
public class RatingController {

    private final RatingService ratingService;

    public RatingController(RatingService ratingService) {
        this.ratingService = ratingService;
    }

    @PostMapping
    public RatingResponse rate(@CurrentUser User user,
                               @PathVariable Long movieId,
                               @Valid @RequestBody RatingRequest request) {
        return ratingService.rate(user.getId(), movieId, request.score());
    }

    /** 我的评分（未评返回 score=null，供详情页回显初始态） */
    @GetMapping
    public RatingResponse myRating(@CurrentUser User user,
                                   @PathVariable Long movieId) {
        Integer score = ratingService.myScore(user.getId(), movieId);
        return new RatingResponse(movieId, score, null, null, null);
    }
}
