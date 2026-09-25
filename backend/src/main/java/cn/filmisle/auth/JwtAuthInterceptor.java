package cn.filmisle.auth;

import cn.filmisle.user.User;
import cn.filmisle.user.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.nio.charset.StandardCharsets;

/**
 * JWT 认证拦截器：
 * - 携带合法 Bearer token → 解析并加载用户放入 request attribute；
 * - token 无效（伪造 / 过期 / 用户已删除）→ 401 拒绝；
 * - /api/admin/** 无 token → 401（管理端只认 JWT，X-User-Id 演示机制不再放行管理端）；
 * - 其余无 token 请求放行，由 @CurrentUser 解析器回落演示用户（游客可浏览演示）。
 */
@Component
public class JwtAuthInterceptor implements HandlerInterceptor {

    public static final String ATTR_USER = "jwtCurrentUser";

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthInterceptor(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {
            try {
                Long userId = jwtService.verifyAndGetUserId(authorization.substring(7).trim());
                User user = userRepository.findById(userId).orElse(null);
                if (user == null) {
                    return reject(response, "登录已失效，请重新登录");
                }
                request.setAttribute(ATTR_USER, user);
            } catch (Exception e) {
                return reject(response, e.getMessage() == null ? "登录已失效，请重新登录" : e.getMessage());
            }
        }
        if (request.getRequestURI().startsWith("/api/admin/") && request.getAttribute(ATTR_USER) == null) {
            return reject(response, "管理端接口需要 JWT 登录（Authorization: Bearer <token>）");
        }
        return true;
    }

    private boolean reject(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"status\":401,\"message\":\"" + message + "\"}");
        response.getWriter().flush();
        return false;
    }
}
