package com.bowling.bowling_diary.place.client;

import com.bowling.bowling_diary.place.dto.response.KakaoKeywordSearchResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.net.URI;

@Component
public class KakaoPlaceClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${kakao.rest-api-key}")
    private String restApiKey;

    public KakaoKeywordSearchResponse searchNearbyBowlingAlleys(
            BigDecimal latitude,
            BigDecimal longitude,
            int radius
    ) {

        URI uri = UriComponentsBuilder
                .fromUriString("https://dapi.kakao.com/v2/local/search/keyword.json")
                .queryParam("query", "볼링장")
                .queryParam("x", longitude)
                .queryParam("y", latitude)
                .queryParam("radius", radius)
                .queryParam("sort", "distance")
                .build()
                .encode()
                .toUri();

        HttpHeaders headers = new HttpHeaders();

        headers.set("Authorization", "KakaoAK " + restApiKey);

        HttpEntity<Void> request = new HttpEntity<>(headers);

        ResponseEntity<KakaoKeywordSearchResponse> response =
                restTemplate.exchange(
                        uri,
                        HttpMethod.GET,
                        request,
                        KakaoKeywordSearchResponse.class
                );

        return response.getBody();
    }

}
