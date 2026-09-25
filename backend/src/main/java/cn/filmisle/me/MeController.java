package cn.filmisle.me;

import cn.filmisle.auth.CurrentUser;
import cn.filmisle.favorite.FavoriteService;
import cn.filmisle.me.dto.*;
import cn.filmisle.rating.RatingService;
import cn.filmisle.recommend.RecommendationService;
import cn.filmisle.user.User;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 个人中心接口（PRD：GET /api/me/profile 等）。
 * 身份：JWT（Authorization: Bearer），无 token 时回落演示用户。
 */
@RestController
@RequestMapping("/api/me")
public class MeController {

    private static final DateTimeFormatter DAY = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final RatingService ratingService;
    private final FavoriteService favoriteService;
    private final RecommendationService recommendationService;

    public MeController(RatingService ratingService,
                        FavoriteService favoriteService,
                        RecommendationService recommendationService) {
        this.ratingService = ratingService;
        this.favoriteService = favoriteService;
        this.recommendationService = recommendationService;
    }

    @GetMapping("/profile")
    public MeProfileResponse profile(@CurrentUser User user) {
        return new MeProfileResponse(
                user.getId(),
                user.getNickname(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt().format(DAY),
                ratingService.myRatings(user.getId()).size(),
                favoriteService.myFavorites(user.getId()).size(),
                recommendationService.topTags(user.getId(), 3)
        );
    }

    @GetMapping("/ratings")
    public List<MeRatingResponse> myRatings(@CurrentUser User user) {
        return ratingService.myRatings(user.getId()).stream()
                .map(r -> new MeRatingResponse(r.getMovieId(), r.getScore(), r.getUpdatedAt()))
                .toList();
    }

    @GetMapping("/favorites")
    public List<MeFavoriteResponse> myFavorites(@CurrentUser User user) {
        return favoriteService.myFavorites(user.getId()).stream()
                .map(f -> new MeFavoriteResponse(f.getMovieId(), f.getCreatedAt()))
                .toList();
    }

    /** 我与某部电影的交互状态（详情页回显） */
    @GetMapping("/interaction/{movieId}")
    public InteractionResponse interaction(@CurrentUser User user,
                                           @PathVariable Long movieId) {
        return new InteractionResponse(
                movieId,
                ratingService.myScore(user.getId(), movieId),
                favoriteService.isFavorited(user.getId(), movieId)
        );
    }
}
