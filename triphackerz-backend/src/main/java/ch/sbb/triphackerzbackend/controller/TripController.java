package ch.sbb.triphackerzbackend.controller;

import java.time.Duration;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.sbb.triphackerzbackend.model.ActivityRecommendationResponseItem;
import ch.sbb.triphackerzbackend.model.Station;
import ch.sbb.triphackerzbackend.model.imagesearch.Image;
import ch.sbb.triphackerzbackend.model.imagesearch.ImageSearchResult;
import ch.sbb.triphackerzbackend.model.recommendation.ActivityRecommendation;
import ch.sbb.triphackerzbackend.service.ActivityRecommendationService;
import ch.sbb.triphackerzbackend.service.imagesearch.ImageSearchService;
import ch.sbb.triphackerzbackend.service.stationsearch.StationSearchService;
import lombok.AllArgsConstructor;
import lombok.SneakyThrows;

@RestController
@RequestMapping("/api/trip")
@AllArgsConstructor
public class TripController {
    private StationSearchService stationSearchService;
    private ActivityRecommendationService activityRecommendationService;
    private final ImageSearchService imageService;

    @SneakyThrows
    @GetMapping("/search")
    public List<ActivityRecommendationResponseItem> searchTrip(@RequestParam Double sourceLongitude,
            @RequestParam Double sourceLatitude,
            @RequestParam Integer maxTravelTime,
            @RequestParam String[] activities){
        List<String> stationNamesForRecommendation = this.stationSearchService.getStationsWithinOf(sourceLatitude, sourceLongitude, Duration.ofMinutes(maxTravelTime)).stream()
                .map(Station::getName)
                .toList();

        return Arrays.stream(activities)
                .parallel()
                .map(activity -> {
                    List<ActivityRecommendation> activityRecommendations = this.activityRecommendationService.getActivityRecommendations(activity, stationNamesForRecommendation, 5);
                    return activityRecommendations.stream()
                            .map(activityRecommendation -> {
                                ImageSearchResult imageResult = imageService.getImagesForActiviy(activity, activityRecommendation.activity());
                                Image image = null;
                                if (imageResult != null) {
                                    image = imageResult.items().getFirst();
                                }
                                return new ActivityRecommendationResponseItem(activityRecommendation, image);
                            })
                            .toList();
                })
                .flatMap(Collection::stream)
                .toList();
    }
}
