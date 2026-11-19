package com.bowling.bowling_diary.place.dto.response;

import java.math.BigDecimal;

public record PlaceResponse(

        String placeId,
        String name,
        String address,
        BigDecimal latitude,
        BigDecimal longitude,
        Integer distanceMeters,
        String placeUrl
) { }
