package cn.filmisle.auth;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/** 注入当前登录用户：JWT 身份优先，无 token 时回落演示用户（管理端接口由拦截器强制要求 JWT） */
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentUser {
}
