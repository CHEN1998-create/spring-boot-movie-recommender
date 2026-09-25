package cn.filmisle.movie.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

/** 电影新增 / 编辑请求体（后台管理用） */
public record MovieRequest(
        @NotBlank(message = "片名不能为空") @Size(max = 200) String title,
        @Size(max = 200) String originalTitle,
        @Min(value = 1888, message = "年份不合法") @Max(value = 2100, message = "年份不合法") Integer year,
        @Min(value = 1, message = "时长需大于 0") Integer duration,
        @Size(max = 100) String director,
        /** 主演，用 / 或逗号分隔 */
        String cast,
        @Size(max = 100) String region,
        @Size(max = 2000) String summary,
        List<String> tags,
        /** 海报链接，为空则按片名自动生成占位海报 */
        @Size(max = 500) String posterUrl
) {
}
