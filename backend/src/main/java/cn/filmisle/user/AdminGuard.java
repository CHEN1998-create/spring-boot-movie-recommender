package cn.filmisle.user;

import cn.filmisle.common.ForbiddenException;
import org.springframework.stereotype.Component;

/**
 * 管理端守卫（PRD：管理员接口必须单独鉴权）。
 * JWT 上线后身份由 JwtAuthInterceptor 注入，管理端只认 JWT；非管理员 403。
 */
@Component
public class AdminGuard {

    /** 校验请求者为管理员，非管理员抛 403 */
    public User requireAdmin(User user) {
        if (!User.ROLE_ADMIN.equals(user.getRole())) {
            throw new ForbiddenException("需要管理员权限");
        }
        return user;
    }
}
