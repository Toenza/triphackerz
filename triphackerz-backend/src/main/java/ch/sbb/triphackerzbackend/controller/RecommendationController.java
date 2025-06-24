package ch.sbb.triphackerzbackend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ch.sbb.triphackerzbackend.model.ActivityRecommendationResponseItem;
import ch.sbb.triphackerzbackend.model.imagesearch.Image;
import ch.sbb.triphackerzbackend.model.imagesearch.ImageSearchResult;
import ch.sbb.triphackerzbackend.model.recommendation.ActivityRecommendation;
import ch.sbb.triphackerzbackend.service.ActivityRecommendationService;
import ch.sbb.triphackerzbackend.service.imagesearch.ImageSearchService;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/recommendation")
@AllArgsConstructor
public class RecommendationController {
    private final ActivityRecommendationService service;
    private final ImageSearchService imageService;

    @GetMapping("/search")
    public List<ActivityRecommendationResponseItem> searchRecommendations(@RequestParam String topic, @RequestParam List<String> cities, @RequestParam Integer maxResult) {
        List<ActivityRecommendation> activities = service.getActivityRecommendations(topic, cities, maxResult);
        return activities.parallelStream()
                .map(activityRecommendation -> {
                    ImageSearchResult imageResult = imageService.getImagesForActiviy(topic, activityRecommendation.activity());
                    Image image = null;
                    if (imageResult != null) {
                        image = imageResult.items().getFirst();
                    }
                    return new ActivityRecommendationResponseItem(activityRecommendation, image);
                }).toList();
    }
}
