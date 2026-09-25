package cn.filmisle.auth;

import cn.filmisle.auth.dto.AuthResponse;
import cn.filmisle.auth.dto.LoginRequest;
import cn.filmisle.auth.dto.RegisterRequest;
import cn.filmisle.auth.dto.UserView;
import cn.filmisle.common.UnauthorizedException;
import cn.filmisle.user.User;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/**
 * 认证接口：POST /api/auth/register、POST /api/auth/login、GET /api/auth/me。
 * 前端持有 JWT（Authorization: Bearer），X-User-Id 演示头已全面退役。
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /** 注册（默认 USER 角色，注册成功即登录） */
    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    /** 登录 */
    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }

    /** 用 token 换当前身份（前端启动时校验登录态） */
    @GetMapping("/me")
    public UserView me(@RequestHeader(value = "Authorization", required = false) String authorization) {
        User user = authService.verifyToken(extractBearer(authorization));
        return new UserView(user.getId(), user.getEmail(), user.getNickname(), user.getRole());
    }

    static String extractBearer(String authorization) {
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            throw new UnauthorizedException("未登录，请先登录");
        }
        return authorization.substring(7).trim();
    }
}
