package cn.filmisle.common;

/** 409 资源冲突（如注册邮箱已存在） */
public class ConflictException extends RuntimeException {

    public ConflictException(String message) {
        super(message);
    }
}
