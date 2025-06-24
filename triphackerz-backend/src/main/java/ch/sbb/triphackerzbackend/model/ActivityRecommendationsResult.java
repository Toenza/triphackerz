package ch.sbb.triphackerzbackend.model;

import java.util.List;

public record ActivityRecommendationsResult(
        List<ActivityRecommendation> activityRecommendations
) {
}
