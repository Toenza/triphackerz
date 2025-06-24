package ch.sbb.triphackerzbackend.model;

import ch.sbb.triphackerzbackend.model.recommendation.ActivityRecommendation;
import ch.sbb.triphackerzbackend.model.imagesearch.Image;

public record ActivityRecommendationResponseItem(ActivityRecommendation activityRecommendation, Image image) {
}
