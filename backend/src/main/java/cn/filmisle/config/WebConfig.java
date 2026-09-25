package cn.filmisle.config;

import cn.filmisle.auth.CurrentUserArgumentResolver;
import cn.filmisle.auth.JwtAuthInterceptor;
import cn.filmisle.user.CurrentUserResolver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.PathResourceResolver;

import java.io.IOException;
import java.util.List;

/**
 * 跨域配置 + JWT 认证管线（拦截器 / @CurrentUser 参数解析）+ 一体化静态托管。
 * 部署形态：前端构建产物放在 ./public（容器内 /app/public），后端同域直接托管，
 * SPA 前端路由（/admin、/movies/:id 等）刷新时回落 index.html。
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final JwtAuthInterceptor jwtAuthInterceptor;
    private final CurrentUserResolver currentUserResolver;

    @Value("${STATIC_DIR:./public}")
    private String staticDir;

    public WebConfig(JwtAuthInterceptor jwtAuthInterceptor, CurrentUserResolver currentUserResolver) {
        this.jwtAuthInterceptor = jwtAuthInterceptor;
        this.currentUserResolver = currentUserResolver;
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(jwtAuthInterceptor).addPathPatterns("/api/**");
    }

    @Override
    public void addArgumentResolvers(List<HandlerMethodArgumentResolver> resolvers) {
        resolvers.add(new CurrentUserArgumentResolver(currentUserResolver));
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("file:" + staticDir + "/", "classpath:/static/")
                .resourceChain(true)
                .addResolver(new PathResourceResolver() {
                    @Override
                    protected Resource getResource(String resourcePath, Resource location) throws IOException {
                        Resource requested = location.createRelative(resourcePath);
                        if (requested.exists() && requested.isReadable()) {
                            return requested;
                        }
                        // API 请求不回落静态页，交回默认错误处理（保持 JSON 语义）
                        if (resourcePath.startsWith("api/")) {
                            return null;
                        }
                        // SPA 回落：直接刷新 /admin、/movies/1 等前端路由时返回 index.html
                        Resource index = location.createRelative("index.html");
                        return index.exists() && index.isReadable() ? index : null;
                    }
                });
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PATCH", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
