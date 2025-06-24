package ch.sbb.triphackerzbackend.model.recommendation;

import java.util.List;

public record ActivityRecommendationsResult(
        List<ActivityRecommendation> activityRecommendations
) {
}
