package ch.sbb.triphackerzbackend.controller;

import ch.sbb.triphackerzbackend.model.Station;
import ch.sbb.triphackerzbackend.service.stationsearch.StationSearchService;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.sbb.triphackerzbackend.model.DummyResponse;

import java.io.IOException;
import java.time.Duration;
import java.util.List;

@RestController
@RequestMapping("/api/trip")
@AllArgsConstructor
public class TripController {
    private StationSearchService stationSearchService;

    @SneakyThrows
    @GetMapping("/search")
    public DummyResponse searchTrip(@RequestParam Double sourceLongitude,
            @RequestParam Double sourceLatitude,
            @RequestParam Integer maxTravelTime,
            @RequestParam String[] activities){
        List<Station> stationsWithinOf = this.stationSearchService.getStationsWithinOf(sourceLatitude, sourceLongitude, Duration.ofMinutes(maxTravelTime));
        return new DummyResponse("I will search for trips from source at ("
                + sourceLongitude + ", " + sourceLatitude
                + ") with max travel time of " + maxTravelTime
                + " minutes and activities: " + String.join(", ", activities));
    }
}
