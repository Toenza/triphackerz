package ch.sbb.triphackerzbackend.model.recommendation;

import java.util.List;

public record CityRecommendationResult(
        List<String> cities
) {
}
