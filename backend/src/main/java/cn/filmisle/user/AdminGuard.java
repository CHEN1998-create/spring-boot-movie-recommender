package cn.filmisle.user;

import cn.filmisle.common.ForbiddenException;
import org.springframework.stereotype.Component;

/**
 * 管理端守卫（PRD：管理员接口必须单独鉴权）。
 * auth 模块上线前沿用 X-User-Id 头识别身份，校验角色必须为 ADMIN。
 */
@Component
public class AdminGuard {

    private final CurrentUserResolver currentUserResolver;

    public AdminGuard(CurrentUserResolver currentUserResolver) {
        this.currentUserResolver = currentUserResolver;
    }

    /** 校验请求者为管理员，非管理员抛 403 */
    public User requireAdmin(String userIdHeader) {
        User user = currentUserResolver.resolve(userIdHeader);
        if (!User.ROLE_ADMIN.equals(user.getRole())) {
            throw new ForbiddenException("需要管理员权限");
        }
        return user;
    }
}
