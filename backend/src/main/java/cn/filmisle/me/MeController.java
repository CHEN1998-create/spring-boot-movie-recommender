package cn.filmisle.me;

import cn.filmisle.favorite.FavoriteService;
import cn.filmisle.me.dto.*;
import cn.filmisle.rating.RatingService;
import cn.filmisle.recommend.RecommendationService;
import cn.filmisle.user.CurrentUserResolver;
import cn.filmisle.user.User;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

/**
 * 个人中心接口（PRD：GET /api/me/profile 等）。
 * profile 同时承担"前端会话建立"职责：首次调用返回演示用户 id，
 * 前端将其持久化并在后续请求中通过 X-User-Id 回传。
 */
@RestController
@RequestMapping("/api/me")
public class MeController {

    private static final DateTimeFormatter DAY = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    private final CurrentUserResolver currentUserResolver;
    private final RatingService ratingService;
    private final FavoriteService favoriteService;
    private final RecommendationService recommendationService;

    public MeController(CurrentUserResolver currentUserResolver,
                        RatingService ratingService,
                        FavoriteService favoriteService,
                        RecommendationService recommendationService) {
        this.currentUserResolver = currentUserResolver;
        this.ratingService = ratingService;
        this.favoriteService = favoriteService;
        this.recommendationService = recommendationService;
    }

    @GetMapping("/profile")
    public MeProfileResponse profile(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader) {
        User user = currentUserResolver.resolve(userIdHeader);
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
    public List<MeRatingResponse> myRatings(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader) {
        User user = currentUserResolver.resolve(userIdHeader);
        return ratingService.myRatings(user.getId()).stream()
                .map(r -> new MeRatingResponse(r.getMovieId(), r.getScore(), r.getUpdatedAt()))
                .toList();
    }

    @GetMapping("/favorites")
    public List<MeFavoriteResponse> myFavorites(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader) {
        User user = currentUserResolver.resolve(userIdHeader);
        return favoriteService.myFavorites(user.getId()).stream()
                .map(f -> new MeFavoriteResponse(f.getMovieId(), f.getCreatedAt()))
                .toList();
    }

    /** 我与某部电影的交互状态（详情页回显） */
    @GetMapping("/interaction/{movieId}")
    public InteractionResponse interaction(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader,
                                           @PathVariable Long movieId) {
        User user = currentUserResolver.resolve(userIdHeader);
        return new InteractionResponse(
                movieId,
                ratingService.myScore(user.getId(), movieId),
                favoriteService.isFavorited(user.getId(), movieId)
        );
    }
}
