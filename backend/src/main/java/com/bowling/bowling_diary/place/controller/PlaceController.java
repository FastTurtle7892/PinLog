package com.bowling.bowling_diary.place.controller;

import com.bowling.bowling_diary.place.dto.request.NearbyPlaceRequest;
import com.bowling.bowling_diary.place.dto.response.PlaceResponse;
import com.bowling.bowling_diary.place.service.PlaceService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/bowling-alleys")
public class PlaceController {

    private final PlaceService placeService;
    public PlaceController(PlaceService placeService) {
        this.placeService = placeService;
    }

    @GetMapping("/nearby")
    public List<PlaceResponse> getNearbyBowlingAlleys(
            // ModelAttribute -> 요청에 들어온 값을 Java 객체의 필드에 맞춰 묶어주는 어노테이션
            @Valid @ModelAttribute NearbyPlaceRequest request
    ){
        return placeService.getNearbyBowlingAlleys(request);
    }
}
