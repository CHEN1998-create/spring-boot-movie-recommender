package cn.filmisle.common;

/** 401 未认证（无效/过期 JWT、密码错误、登录态指向的用户不存在时抛出） */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
