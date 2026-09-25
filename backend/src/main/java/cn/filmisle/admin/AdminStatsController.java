package cn.filmisle.admin;

import cn.filmisle.admin.dto.AdminStatsResponse;
import cn.filmisle.user.AdminGuard;
import cn.filmisle.user.CurrentUserResolver;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 管理端统计接口（PRD 页面 7 / 9：数据看板 + 推荐概览）。
 * 管理员专属：X-User-Id 对应用户角色必须为 ADMIN，否则 403。
 */
@RestController
@RequestMapping("/api/admin")
public class AdminStatsController {

    private final AdminStatsService adminStatsService;
    private final AdminGuard adminGuard;

    public AdminStatsController(AdminStatsService adminStatsService, AdminGuard adminGuard) {
        this.adminStatsService = adminStatsService;
        this.adminGuard = adminGuard;
    }

    /** GET /api/admin/stats —— 后台全部统计指标 */
    @GetMapping("/stats")
    public AdminStatsResponse stats(@RequestHeader(value = CurrentUserResolver.USER_HEADER, required = false) String userIdHeader) {
        adminGuard.requireAdmin(userIdHeader);
        return adminStatsService.stats();
    }
}
