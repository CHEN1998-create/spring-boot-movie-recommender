package cn.filmisle.favorite;

import cn.filmisle.auth.CurrentUser;
import cn.filmisle.favorite.dto.FavoriteResponse;
import cn.filmisle.user.User;
import org.springframework.web.bind.annotation.*;

/**
 * 收藏接口（PRD：POST /api/movies/:id/favorite、DELETE /api/movies/:id/favorite）。
 * 身份：JWT（Authorization: Bearer），无 token 时回落演示用户。
 */
@RestController
@RequestMapping("/api/movies/{movieId}/favorite")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping
    public FavoriteResponse favorite(@CurrentUser User user,
                                     @PathVariable Long movieId) {
        Favorite f = favoriteService.favorite(user.getId(), movieId);
        return new FavoriteResponse(movieId, true, f.getCreatedAt());
    }

    @DeleteMapping
    public FavoriteResponse unfavorite(@CurrentUser User user,
                                       @PathVariable Long movieId) {
        Favorite removed = favoriteService.unfavorite(user.getId(), movieId);
        return new FavoriteResponse(movieId, false, removed == null ? null : removed.getCreatedAt());
    }
}
