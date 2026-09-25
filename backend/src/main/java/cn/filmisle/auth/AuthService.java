package cn.filmisle.auth;

import cn.filmisle.auth.dto.AuthResponse;
import cn.filmisle.auth.dto.LoginRequest;
import cn.filmisle.auth.dto.RegisterRequest;
import cn.filmisle.auth.dto.UserView;
import cn.filmisle.common.ConflictException;
import cn.filmisle.common.UnauthorizedException;
import cn.filmisle.user.User;
import cn.filmisle.user.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/** 注册 / 登录 / token 换身份 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.email().trim().toLowerCase();
        if (userRepository.findByEmail(email).isPresent()) {
            throw new ConflictException("该邮箱已注册，请直接登录");
        }
        User user = new User(email, request.nickname().trim(), User.ROLE_USER, LocalDateTime.now());
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user = userRepository.save(user);
        return toResponse(user);
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.email().trim().toLowerCase();
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null || user.getPasswordHash() == null
                || !passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("邮箱或密码不正确");
        }
        return toResponse(user);
    }

    /** token 换当前身份（供前端启动时校验登录态） */
    @Transactional(readOnly = true)
    public User verifyToken(String token) {
        Long userId = jwtService.verifyAndGetUserId(token);
        return userRepository.findById(userId)
                .orElseThrow(() -> new UnauthorizedException("登录已失效，请重新登录"));
    }

    private AuthResponse toResponse(User user) {
        String token = jwtService.issue(user.getId(), user.getEmail(), user.getRole());
        return new AuthResponse(token, new UserView(user.getId(), user.getEmail(), user.getNickname(), user.getRole()));
    }
}
