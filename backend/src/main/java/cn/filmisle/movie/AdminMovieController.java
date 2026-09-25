package cn.filmisle.movie;

import cn.filmisle.auth.CurrentUser;
import cn.filmisle.movie.dto.MovieRequest;
import cn.filmisle.movie.dto.MovieResponse;
import cn.filmisle.user.AdminGuard;
import cn.filmisle.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 管理端电影接口（PRD：POST/PATCH/DELETE /api/admin/movies）。
 * 管理员专属：仅接受 JWT（拦截器强制），角色必须为 ADMIN，否则 403。
 */
@RestController
@RequestMapping("/api/admin/movies")
public class AdminMovieController {

    private final MovieService movieService;
    private final AdminGuard adminGuard;

    public AdminMovieController(MovieService movieService, AdminGuard adminGuard) {
        this.movieService = movieService;
        this.adminGuard = adminGuard;
    }

    /** 新增电影 */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MovieResponse create(@CurrentUser User user,
                                @Valid @RequestBody MovieRequest request) {
        adminGuard.requireAdmin(user);
        return movieService.create(request);
    }

    /** 编辑电影 */
    @PatchMapping("/{id}")
    public MovieResponse update(@CurrentUser User user,
                                @PathVariable Long id,
                                @Valid @RequestBody MovieRequest request) {
        adminGuard.requireAdmin(user);
        return movieService.update(id, request);
    }

    /** 下架电影（前端管理页「下架」按钮） */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@CurrentUser User user,
                       @PathVariable Long id) {
        adminGuard.requireAdmin(user);
        movieService.delete(id);
    }
}
