package com.bowling.bowling_diary.place.service;

import com.bowling.bowling_diary.place.client.KakaoPlaceClient;
import com.bowling.bowling_diary.place.dto.request.NearbyPlaceRequest;
import com.bowling.bowling_diary.place.dto.response.KakaoKeywordSearchResponse;
import com.bowling.bowling_diary.place.dto.response.PlaceResponse;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class PlaceService {

    private final KakaoPlaceClient kakaoPlaceClient;

    public PlaceService(KakaoPlaceClient kakaoPlaceClient) {
        this.kakaoPlaceClient = kakaoPlaceClient;
    }

    public List<PlaceResponse> getNearbyBowlingAlleys(NearbyPlaceRequest request) {
        int radius = request.radius() != null ? request.radius() : 3000;

        KakaoKeywordSearchResponse kakaoResponse =
                kakaoPlaceClient.searchNearbyBowlingAlleys(
                        request.latitude(),
                        request.longitude(),
                        radius
                );
        return kakaoResponse.documents().stream()
                .map(this::toPlaceResponse)
                .toList();
    }

    private PlaceResponse toPlaceResponse(KakaoKeywordSearchResponse.Place place) {

        String address = place.roadAddressName();
        if(address == null || address.isBlank()) {
            address = place.addressName();
        }

        return new PlaceResponse(
                place.id(),
                place.placeName(),
                address,
                new BigDecimal(place.y()),
                new BigDecimal(place.x()),
                Integer.valueOf(place.distance()),
                place.placeUrl()
        );
    }
}
