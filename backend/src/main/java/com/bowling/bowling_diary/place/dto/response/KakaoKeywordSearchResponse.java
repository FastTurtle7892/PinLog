package com.bowling.bowling_diary.place.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

// 결과값으로 받아온 값에는 있지만 해당 클래스에 없는 json 필드는 무시해라
@JsonIgnoreProperties(ignoreUnknown = true)
public record KakaoKeywordSearchResponse(
        Meta meta,
        List<Place> documents
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Meta(
            @JsonProperty("is_end") boolean isEnd
    ) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Place(
            String id,
            @JsonProperty("place_name") String placeName,
            @JsonProperty("address_name") String addressName,
            @JsonProperty("road_address_name") String roadAddressName,
            String x,
            String y,
            String distance,
            @JsonProperty("place_url") String placeUrl
    ) {}
}
