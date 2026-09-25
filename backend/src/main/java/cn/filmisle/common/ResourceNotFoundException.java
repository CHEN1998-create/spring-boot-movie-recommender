package cn.filmisle.common;

/** 资源不存在异常 → 全局处理为 404 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String resource, Object id) {
        super(String.format("%s 不存在（id=%s）", resource, id));
    }
}
