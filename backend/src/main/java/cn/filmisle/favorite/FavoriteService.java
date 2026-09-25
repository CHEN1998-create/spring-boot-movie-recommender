package cn.filmisle.favorite;

import cn.filmisle.common.ResourceNotFoundException;
import cn.filmisle.movie.MovieRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/** 收藏业务：收藏 / 取消收藏（幂等）+ 我的收藏查询 */
@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final MovieRepository movieRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, MovieRepository movieRepository) {
        this.favoriteRepository = favoriteRepository;
        this.movieRepository = movieRepository;
    }

    /** 收藏：重复收藏幂等返回已有记录 */
    @Transactional
    public Favorite favorite(Long userId, Long movieId) {
        if (!movieRepository.existsById(movieId)) {
            throw new ResourceNotFoundException("电影", movieId);
        }
        return favoriteRepository.findByUserIdAndMovieId(userId, movieId)
                .orElseGet(() -> favoriteRepository.save(new Favorite(userId, movieId, LocalDateTime.now())));
    }

    /** 取消收藏：未收藏时幂等返回 null */
    @Transactional
    public Favorite unfavorite(Long userId, Long movieId) {
        Favorite favorite = favoriteRepository.findByUserIdAndMovieId(userId, movieId).orElse(null);
        if (favorite != null) {
            favoriteRepository.delete(favorite);
        }
        return favorite;
    }

    @Transactional(readOnly = true)
    public boolean isFavorited(Long userId, Long movieId) {
        return favoriteRepository.findByUserIdAndMovieId(userId, movieId).isPresent();
    }

    @Transactional(readOnly = true)
    public List<Favorite> myFavorites(Long userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional(readOnly = true)
    public List<Favorite> byUser(Long userId) {
        return favoriteRepository.findByUserId(userId);
    }
}
