package cn.filmisle.favorite;

import cn.filmisle.favorite.dto.FavoriteResponse;
import cn.filmisle.user.CurrentUserResolver;
import cn.filmisle.user.User;
import org.springframework.web.bind.annotation.*;

/**
 * 收藏接口（PRD：POST /api/movies/:id/favorite、DELETE /api/movies/:id/favorite）。
 * 用户身份：X-User-Id 请求头，缺省回落演示用户。
 */
@RestController
@RequestMapping("/api/movies/{movieId}/favorite")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final CurrentUserResolver currentUserResolver;

    public FavoriteController(FavoriteService favoriteService, CurrentUserResolver currentUserResolver) {
        this.favoriteService = favoriteService;
        this.currentUserResolver = currentUserResolver;
    }

    @PostMapping
    public FavoriteResponse favorite(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader,
                                     @PathVariable Long movieId) {
        User user = currentUserResolver.resolve(userIdHeader);
        Favorite f = favoriteService.favorite(user.getId(), movieId);
        return new FavoriteResponse(movieId, true, f.getCreatedAt());
    }

    @DeleteMapping
    public FavoriteResponse unfavorite(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader,
                                       @PathVariable Long movieId) {
        User user = currentUserResolver.resolve(userIdHeader);
        Favorite removed = favoriteService.unfavorite(user.getId(), movieId);
        return new FavoriteResponse(movieId, false, removed == null ? null : removed.getCreatedAt());
    }
}
