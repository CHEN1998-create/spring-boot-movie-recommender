package cn.filmisle.bootstrap;

import cn.filmisle.favorite.Favorite;
import cn.filmisle.favorite.FavoriteRepository;
import cn.filmisle.rating.Rating;
import cn.filmisle.rating.RatingRepository;
import cn.filmisle.user.User;
import cn.filmisle.user.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 行为种子数据：演示用户（陈屿 / demo@filmisle.cn）的历史评分与收藏，
 * 与前端骨架 data/user.ts 同源，保证推荐页首屏即有可解释结果。
 * 注意：这部分假想行为已包含在 movies 表种子均分口径内，
 * 故只写 ratings/favorites 行，不回写电影聚合分。
 * 幂等：演示用户不存在则创建；ratings / favorites 表为空时才导入。
 */
@Component
@Order(2)
public class BehaviorSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final FavoriteRepository favoriteRepository;
    private final PasswordEncoder passwordEncoder;

    public BehaviorSeeder(UserRepository userRepository,
                          RatingRepository ratingRepository,
                          FavoriteRepository favoriteRepository,
                          PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.ratingRepository = ratingRepository;
        this.favoriteRepository = favoriteRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        User demo = userRepository.findByEmail("demo@filmisle.cn").orElseGet(() ->
                userRepository.save(new User("demo@filmisle.cn", "陈屿", User.ROLE_ADMIN,
                        LocalDateTime.of(2026, 3, 1, 12, 0))));
        // auth 模块：演示用户补齐默认密码 demo123456（幂等，兼容旧库升级）
        if (demo.getPasswordHash() == null) {
            demo.setPasswordHash(passwordEncoder.encode(cn.filmisle.user.CurrentUserResolver.DEMO_DEFAULT_PASSWORD));
            userRepository.save(demo);
        }

        if (ratingRepository.count() == 0) {
            // [movieId, score, 月, 日, 时, 分]（与前端 myRatings 同源）
            List<Object[]> ratings = List.of(
                new Object[]{3L, 10, 9, 15, 21, 30},
                new Object[]{1L, 9, 9, 20, 23, 5},
                new Object[]{2L, 8, 9, 18, 20, 14},
                new Object[]{13L, 9, 9, 6, 22, 47},
                new Object[]{4L, 8, 9, 10, 19, 58},
                new Object[]{5L, 7, 8, 30, 21, 12}
            );
            for (Object[] r : ratings) {
                LocalDateTime at = LocalDateTime.of(2026, (Integer) r[2], (Integer) r[3], (Integer) r[4], (Integer) r[5]);
                ratingRepository.save(new Rating(demo.getId(), (Long) r[0], (Integer) r[1], at));
            }
        }

        if (favoriteRepository.count() == 0) {
            List<Object[]> favorites = List.of(
                new Object[]{3L, 9, 15, 21, 32},
                new Object[]{1L, 9, 20, 23, 8},
                new Object[]{12L, 9, 1, 15, 20},
                new Object[]{16L, 8, 25, 22, 41},
                new Object[]{8L, 8, 12, 19, 3}
            );
            for (Object[] f : favorites) {
                LocalDateTime at = LocalDateTime.of(2026, (Integer) f[1], (Integer) f[2], (Integer) f[3], (Integer) f[4]);
                favoriteRepository.save(new Favorite(demo.getId(), (Long) f[0], at));
            }
        }
    }
}
