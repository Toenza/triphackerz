package ch.sbb.triphackerzbackend.service;

import java.util.List;

import ch.sbb.triphackerzbackend.model.recommendation.ActivityRecommendation;

public interface ActivityRecommendationService {

    List<ActivityRecommendation> getActivityRecommendations(String activity, List<String> cities, int maxResult);

}
