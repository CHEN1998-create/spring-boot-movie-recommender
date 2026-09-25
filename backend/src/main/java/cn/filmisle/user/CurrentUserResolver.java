package cn.filmisle.user;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 演示身份兜底（auth 模块上线后职责收窄）：
 * 请求未携带 JWT 时，@CurrentUser 参数解析器回落到演示用户（demo@filmisle.cn），
 * 保证游客可浏览与演示。登录后的身份由 JwtAuthInterceptor 注入，与本项目无关。
 */
@Component
public class CurrentUserResolver {

    public static final String DEMO_EMAIL = "demo@filmisle.cn";
    public static final String DEMO_DEFAULT_PASSWORD = "demo123456";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public CurrentUserResolver(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /** 演示用户：种子数据写入行为记录的归属者，懒创建保证单库可重复初始化 */
    @Transactional
    public User demoUser() {
        return userRepository.findByEmail(DEMO_EMAIL).orElseGet(() -> {
            User demo = new User(DEMO_EMAIL, "陈屿", User.ROLE_ADMIN, LocalDateTime.now());
            demo.setPasswordHash(passwordEncoder.encode(DEMO_DEFAULT_PASSWORD));
            return userRepository.save(demo);
        });
    }
}
