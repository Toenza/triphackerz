package ch.sbb.triphackerzbackend.service.imagesearch;

import ch.sbb.triphackerzbackend.model.imagesearch.ImageSearchResult;
import ch.sbb.triphackerzbackend.model.recommendation.Activity;

public interface ImageSearchService {

    ImageSearchResult getImagesForActiviy(String topic, Activity activityRecommendation);
}
