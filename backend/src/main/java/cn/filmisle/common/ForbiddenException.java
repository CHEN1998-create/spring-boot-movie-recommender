package cn.filmisle.common;

/** 403 无权限（管理端接口鉴权失败时抛出） */
public class ForbiddenException extends RuntimeException {

    public ForbiddenException(String message) {
        super(message);
    }
}
