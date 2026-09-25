package cn.filmisle.movie;

import cn.filmisle.movie.dto.MovieRequest;
import cn.filmisle.movie.dto.MovieResponse;
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
 * 管理端电影接口（PRD：POST/PATCH /api/admin/movies）。
 * TODO: auth 模块完成后加管理员 JWT 鉴权（当前骨架阶段先放开）
 */
@RestController
@RequestMapping("/api/admin/movies")
public class AdminMovieController {

    private final MovieService movieService;

    public AdminMovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    /** 新增电影 */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MovieResponse create(@Valid @RequestBody MovieRequest request) {
        return movieService.create(request);
    }

    /** 编辑电影 */
    @PatchMapping("/{id}")
    public MovieResponse update(@PathVariable Long id, @Valid @RequestBody MovieRequest request) {
        return movieService.update(id, request);
    }

    /** 下架电影（前端管理页「下架」按钮） */
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        movieService.delete(id);
    }
}
