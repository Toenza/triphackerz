package ch.sbb.triphackerzbackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.sbb.triphackerzbackend.model.DummyResponse;

@RestController
@RequestMapping("/api")
public class TravelSearchController {

    @GetMapping("/search")
    public DummyResponse searchTrip(@RequestParam Double sourceLongitude,
            @RequestParam Double sourceLatitude,
            @RequestParam Integer maxTravelTime,
            @RequestParam String[] activities) {
        return new DummyResponse("I will search for trips from source at ("
                + sourceLongitude + ", " + sourceLatitude
                + ") with max travel time of " + maxTravelTime
                + " minutes and activities: " + String.join(", ", activities));
    }
}
