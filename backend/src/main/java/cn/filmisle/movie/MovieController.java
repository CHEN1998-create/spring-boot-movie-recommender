package cn.filmisle.movie;

import cn.filmisle.movie.dto.MovieListResponse;
import cn.filmisle.movie.dto.MovieResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** 前台电影接口：列表（搜索/筛选/排序/分页）、详情、标签（PRD 接口草案） */
@RestController
@RequestMapping("/api")
public class MovieController {

    private final MovieService movieService;

    public MovieController(MovieService movieService) {
        this.movieService = movieService;
    }

    /** GET /api/movies?kw=&tag=&page=&pageSize=&sort= */
    @GetMapping("/movies")
    public MovieListResponse list(
            @RequestParam(required = false) String kw,
            @RequestParam(required = false) String tag,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "12") int pageSize,
            @RequestParam(required = false) String sort) {
        return movieService.search(kw, tag, page, pageSize, sort);
    }

    /** GET /api/movies/{id} */
    @GetMapping("/movies/{id}")
    public MovieResponse detail(@PathVariable Long id) {
        return movieService.getDetail(id);
    }

    /** GET /api/tags —— 全站去重标签，供列表页筛选栏 */
    @GetMapping("/tags")
    public List<String> tags() {
        return movieService.allTags();
    }
}
