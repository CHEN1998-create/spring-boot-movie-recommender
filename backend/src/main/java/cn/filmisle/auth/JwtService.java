package cn.filmisle.auth;

import cn.filmisle.common.UnauthorizedException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 签发与校验（HS256，无状态）。
 * claims: sub=用户 id，email、role 为冗余信息（权限判定仍以数据库为准）。
 */
@Service
public class JwtService {

    private final SecretKey key;
    private final long expireMillis;

    public JwtService(@Value("${jwt.secret}") String secret,
                      @Value("${jwt.expire-hours}") long expireHours) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expireMillis = expireHours * 3600_000L;
    }

    public String issue(Long userId, String email, String role) {
        Date now = new Date();
        return Jwts.builder()
                .subject(String.valueOf(userId))
                .claim("email", email)
                .claim("role", role)
                .issuedAt(now)
                .expiration(new Date(now.getTime() + expireMillis))
                .signWith(key)
                .compact();
    }

    /** 校验签名与有效期，返回用户 id；无效 token 抛 401 */
    public Long verifyAndGetUserId(String token) {
        try {
            Claims claims = Jwts.parser().verifyWith(key).build()
                    .parseSignedClaims(token).getPayload();
            return Long.valueOf(claims.getSubject());
        } catch (JwtException | IllegalArgumentException e) {
            throw new UnauthorizedException("登录已失效，请重新登录");
        }
    }
}
