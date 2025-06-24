package ch.sbb.triphackerzbackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import ch.sbb.triphackerzbackend.model.Station;
import ch.sbb.triphackerzbackend.service.stationsearch.StationSearchService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/station")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class StationController {
    private final StationSearchService stationSearchService;

    @GetMapping("/search")
    public List<Station> searchStation(@RequestParam String name) {
        return stationSearchService.searchStation(name);
    }
}
