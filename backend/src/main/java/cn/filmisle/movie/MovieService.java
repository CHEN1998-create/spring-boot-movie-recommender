package cn.filmisle.movie;

import cn.filmisle.common.ResourceNotFoundException;
import cn.filmisle.movie.dto.MovieListResponse;
import cn.filmisle.movie.dto.MovieRequest;
import cn.filmisle.movie.dto.MovieResponse;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/** 电影业务：搜索 / 详情 / 管理 CRUD */
@Service
public class MovieService {

    private final MovieRepository movieRepository;
    private final MovieTagRepository movieTagRepository;

    public MovieService(MovieRepository movieRepository, MovieTagRepository movieTagRepository) {
        this.movieRepository = movieRepository;
        this.movieTagRepository = movieTagRepository;
    }

    /**
     * 电影列表：kw 关键词（中文名/外文名模糊匹配）+ tag 标签筛选 + sort 排序 + 分页。
     * sort 取值：rating（默认，综合评分）| year（最新上映）| count（评分人数）
     */
    @Transactional(readOnly = true)
    public MovieListResponse search(String kw, String tag, int page, int pageSize, String sort) {
        Specification<Movie> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (kw != null && !kw.isBlank()) {
                String like = "%" + kw.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("originalTitle")), like)
                ));
            }
            if (tag != null && !tag.isBlank()) {
                predicates.add(root.join("tags").get("tag").in(tag.trim()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Sort sortSpec = switch (sort == null ? "rating" : sort) {
            case "year" -> Sort.by(Sort.Direction.DESC, "year");
            case "count" -> Sort.by(Sort.Direction.DESC, "ratingCount");
            default -> Sort.by(Sort.Direction.DESC, "rating");
        };

        int p = Math.max(page, 1);
        int size = Math.min(Math.max(pageSize, 1), 50);
        Pageable pageable = PageRequest.of(p - 1, size, sortSpec);

        Page<Movie> result = movieRepository.findAll(spec, pageable);
        return new MovieListResponse(
                result.getContent().stream().map(MovieResponse::from).toList(),
                result.getTotalElements(),
                p,
                size
        );
    }

    /** 详情 */
    @Transactional(readOnly = true)
    public MovieResponse getDetail(Long id) {
        return MovieResponse.from(findMovie(id));
    }

    /** 全部去重标签（列表页筛选栏） */
    @Transactional(readOnly = true)
    public List<String> allTags() {
        return movieTagRepository.findDistinctTags();
    }

    /** 新增电影（管理接口） */
    @Transactional
    public MovieResponse create(MovieRequest req) {
        Movie movie = new Movie();
        movie.setCreatedAt(LocalDateTime.now());
        applyRequest(movie, req);
        return MovieResponse.from(movieRepository.save(movie));
    }

    /** 编辑电影（管理接口） */
    @Transactional
    public MovieResponse update(Long id, MovieRequest req) {
        Movie movie = findMovie(id);
        applyRequest(movie, req);
        return MovieResponse.from(movieRepository.save(movie));
    }

    /** 下架电影（管理接口） */
    @Transactional
    public void delete(Long id) {
        if (!movieRepository.existsById(id)) {
            throw new ResourceNotFoundException("电影", id);
        }
        movieRepository.deleteById(id);
    }

    // ---------- 内部方法 ----------

    private Movie findMovie(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("电影", id));
    }

    private void applyRequest(Movie movie, MovieRequest req) {
        movie.setTitle(req.title());
        movie.setOriginalTitle(blankToDefault(req.originalTitle(), req.title()));
        movie.setYear(req.year());
        movie.setDuration(req.duration());
        movie.setDirector(blankToDefault(req.director(), "未知"));
        movie.setCastNames(req.cast());
        movie.setRegion(blankToDefault(req.region(), "未知"));
        movie.setSummary(req.summary());
        movie.setPosterUrl(req.posterUrl() == null || req.posterUrl().isBlank()
                ? placeholderPoster(req.title()) : req.posterUrl());
        movie.setUpdatedAt(LocalDateTime.now());
        movie.replaceTags(req.tags());
    }

    private String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
    }

    /** 占位海报：与前端相同的文生图服务按片名生成 */
    private String placeholderPoster(String title) {
        String prompt = URLEncoder.encode(
                title + " cinematic movie poster, portrait composition, dramatic lighting, film grain",
                StandardCharsets.UTF_8);
        return "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=" + prompt + "&image_size=portrait_4_3";
    }
}
