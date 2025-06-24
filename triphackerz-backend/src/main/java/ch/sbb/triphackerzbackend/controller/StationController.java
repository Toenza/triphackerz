package ch.sbb.triphackerzbackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.sbb.triphackerzbackend.model.Station;
import ch.sbb.triphackerzbackend.service.stationsearch.StationSearchService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/station")
@AllArgsConstructor
public class StationController {
    private final StationSearchService stationSearchService;

    @GetMapping("/search")
    public List<Station> searchStation(@RequestParam String name) {
        return stationSearchService.searchStation(name);
    }
}
