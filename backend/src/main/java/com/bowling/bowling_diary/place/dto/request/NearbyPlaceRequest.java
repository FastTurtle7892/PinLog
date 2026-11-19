package com.bowling.bowling_diary.place.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record NearbyPlaceRequest(

        @NotNull(message = "위도는 필수입니다.")
        @DecimalMin(value = "-90.0", message = "위도는 -90 이상이어야 합니다.")
        @DecimalMax(value = "+90.0", message = "위도는 90 이하이어야 합니다.")
        BigDecimal latitude,

        @NotNull(message = "경도는 필수입니다.")
        @DecimalMin(value = "-180.0", message = "경도는 -180 이상이어야 합니다.")
        @DecimalMax(value = "+180.0", message = "경도는 180 이하이어야 합니다.")
        BigDecimal longitude,

        @Min(1) @Max(20000)
        Integer radius
) { }
