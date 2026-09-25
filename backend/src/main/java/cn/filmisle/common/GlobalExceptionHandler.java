package cn.filmisle.common;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/** 全局异常处理：统一错误响应格式 {message, errors?} */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /** 403 无权限（管理端接口鉴权失败） */
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Map<String, Object>> handleForbidden(ForbiddenException ex) {
        return body(HttpStatus.FORBIDDEN, ex.getMessage(), null);
    }

    /** 404 资源不存在 */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return body(HttpStatus.NOT_FOUND, ex.getMessage(), null);
    }

    /** 400 参数校验失败 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> fieldErrors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(fe -> fieldErrors.put(fe.getField(), fe.getDefaultMessage()));
        return body(HttpStatus.BAD_REQUEST, "参数校验失败", Map.of("fields", fieldErrors));
    }

    /** 500 兜底 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleOther(Exception ex) {
        return body(HttpStatus.INTERNAL_SERVER_ERROR, "服务器内部错误：" + ex.getMessage(), null);
    }

    private ResponseEntity<Map<String, Object>> body(HttpStatus status, String message, Map<String, Object> extra) {
        Map<String, Object> resp = new HashMap<>();
        resp.put("status", status.value());
        resp.put("message", message);
        if (extra != null) {
            resp.putAll(extra);
        }
        return ResponseEntity.status(status).body(resp);
    }
}
