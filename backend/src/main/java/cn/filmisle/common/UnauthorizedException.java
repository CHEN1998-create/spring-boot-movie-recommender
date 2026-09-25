package cn.filmisle.common;

/** 401 未认证（X-User-Id 指向的用户不存在或已失效时抛出） */
public class UnauthorizedException extends RuntimeException {

    public UnauthorizedException(String message) {
        super(message);
    }
}
