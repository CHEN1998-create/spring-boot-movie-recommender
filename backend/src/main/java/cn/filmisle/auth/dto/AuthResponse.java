package cn.filmisle.auth.dto;

/** 注册 / 登录成功响应：token + 用户视图 */
public record AuthResponse(String token, UserView user) {
}
