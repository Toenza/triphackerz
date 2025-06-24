package ch.sbb.triphackerzbackend.service.imagesearch;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import ch.sbb.triphackerzbackend.model.imagesearch.ImageSearchResult;
import ch.sbb.triphackerzbackend.model.recommendation.Activity;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class ImageSearchServiceImpl implements ImageSearchService {

    public static final String GOOGLE_BASE_URL = "https://www.googleapis.com";
    private final WebClient webClient;
    @Value("${app.google.search.api-key}")
    private String apiKey;
    @Value("${app.google.search.ctx}")
    private String cx;


    public ImageSearchServiceImpl(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(GOOGLE_BASE_URL).build();
    }


    @Override
    public ImageSearchResult getImagesForActiviy(String topic, Activity activity) {
        String query = "%s %s %s".formatted("", activity.name(), activity.city());
        return this.webClient.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/customsearch/v1")
                        .queryParam("key", apiKey)
                        .queryParam("cx", cx)
                        .queryParam("searchType", "image")
                        .queryParam("imgType", "photo")
                        //.queryParam("imgSize", "large")
                        .queryParam("q", query)
                        .build())
                .retrieve().bodyToMono(ImageSearchResult.class).block();
    }
}
