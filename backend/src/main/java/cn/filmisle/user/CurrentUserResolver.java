package cn.filmisle.user;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

/**
 * 当前用户解析（演示阶段方案，auth 模块上线后由 JWT 鉴权替换）：
 * - 请求头 X-User-Id 能匹配到用户 → 使用该用户（支持多浏览器各自建档演示个性化差异）；
 * - 缺失或无效 → 回落到演示用户（demo@filmisle.cn，懒创建）。
 */
@Component
public class CurrentUserResolver {

    public static final String USER_HEADER = "X-User-Id";
    public static final String DEMO_EMAIL = "demo@filmisle.cn";

    private final UserRepository userRepository;

    public CurrentUserResolver(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public User resolve(String userIdHeader) {
        if (StringUtils.hasText(userIdHeader)) {
            try {
                Long id = Long.valueOf(userIdHeader.trim());
                return userRepository.findById(id).orElseGet(this::demoUser);
            } catch (NumberFormatException ignored) {
                // 非法头值按未登录处理
            }
        }
        return demoUser();
    }

    /** 演示用户：种子数据写入行为记录的归属者，懒创建保证单库可重复初始化 */
    private User demoUser() {
        return userRepository.findByEmail(DEMO_EMAIL).orElseGet(() ->
                userRepository.save(new User(DEMO_EMAIL, "陈屿", User.ROLE_ADMIN, LocalDateTime.now())));
    }
}
