package cn.filmisle.auth.dto;

/** 登录用户视图（不含密码散列） */
public record UserView(Long id, String email, String nickname, String role) {
}
