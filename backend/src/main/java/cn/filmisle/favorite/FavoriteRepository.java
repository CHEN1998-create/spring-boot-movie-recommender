package cn.filmisle.favorite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserIdAndMovieId(Long userId, Long movieId);

    List<Favorite> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<Favorite> findByUserId(Long userId);

    long countByMovieId(Long movieId);

    /** 收藏过至少一部影片的用户数（后台：收藏率） */
    @Query("select count(distinct f.userId) from Favorite f")
    long countDistinctUsers();
}
