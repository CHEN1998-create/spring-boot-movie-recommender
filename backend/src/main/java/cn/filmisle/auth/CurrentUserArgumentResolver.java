package cn.filmisle.auth;

import cn.filmisle.user.CurrentUserResolver;
import cn.filmisle.user.User;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import jakarta.servlet.http.HttpServletRequest;

/** @CurrentUser User user 参数解析：JWT 身份优先，无 token 回落演示用户 */
public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {

    private final CurrentUserResolver currentUserResolver;

    public CurrentUserArgumentResolver(CurrentUserResolver currentUserResolver) {
        this.currentUserResolver = currentUserResolver;
    }

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return parameter.hasParameterAnnotation(CurrentUser.class)
                && User.class.isAssignableFrom(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
                                  NativeWebRequest webRequest, WebDataBinderFactory binderFactory) {
        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
        Object user = request == null ? null : request.getAttribute(JwtAuthInterceptor.ATTR_USER);
        return user != null ? user : currentUserResolver.demoUser();
    }
}
