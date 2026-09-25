package cn.filmisle.user;

import cn.filmisle.common.UnauthorizedException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;

/**
 * 当前用户解析（演示阶段方案，auth 模块上线后由 JWT 鉴权替换）：
 * - 请求头缺失或为空 → 回落到演示用户（demo@filmisle.cn，懒创建），保证游客可浏览；
 * - 请求头有值但无法匹配用户（伪造 / 已失效）→ 401 拒绝，防止借 demo 管理员身份越权。
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
                return userRepository.findById(id)
                        .orElseThrow(() -> new UnauthorizedException("用户不存在或登录已失效，请重新进入演示身份"));
            } catch (NumberFormatException ignored) {
                // 非法头值同样视为无效身份
                throw new UnauthorizedException("用户身份无效，请重新进入演示身份");
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
