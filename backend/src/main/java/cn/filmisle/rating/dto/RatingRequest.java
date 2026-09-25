package cn.filmisle.rating.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

/** 提交评分请求体：1-10 分（前端星级组件 5 星映射为 2 分/星） */
public record RatingRequest(
        @NotNull(message = "评分不能为空")
        @Min(value = 1, message = "评分最低 1 分")
        @Max(value = 10, message = "评分最高 10 分")
        Integer score
) {
}
