package cn.filmisle.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** 注册请求 */
public record RegisterRequest(
        @NotBlank(message = "邮箱不能为空")
        @Email(message = "邮箱格式不正确")
        String email,
        @NotBlank(message = "密码不能为空")
        @Size(min = 6, max = 64, message = "密码长度需在 6-64 位之间")
        String password,
        @NotBlank(message = "昵称不能为空")
        @Size(max = 50, message = "昵称过长")
        String nickname) {
}
