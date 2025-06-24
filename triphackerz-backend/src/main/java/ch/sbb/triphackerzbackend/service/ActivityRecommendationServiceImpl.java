package ch.sbb.triphackerzbackend.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import ch.sbb.triphackerzbackend.model.recommendation.ActivityRecommendation;
import ch.sbb.triphackerzbackend.model.recommendation.ActivityRecommendationsResult;
import ch.sbb.triphackerzbackend.model.recommendation.CityRecommendationResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityRecommendationServiceImpl implements ActivityRecommendationService {

    public static final String ACTIVITY_PROMPT_PATTERN = """
            You are an expert in finding leisure activities in Switzerland. You will receive a request for an activity and a list of cities. Based on this information, you will provide concrete suggestions for where to do this activity in the specified cities.
            You will only return results that are well-known. You will only return activities that are available in the specified city. If the activity can be found at a specific address, building, or establishment, you will return the name of that place. If you cannot find such an activity for a city, you will ignore it.
            If you find the same activity (location) for multiple cities, you will return it only once with the most suitable city.
            If possible, include the location with latitude and longitude. If there is nothing available or you are unsure, use the location data of the city.
            Rate the specific activities based on popularity and recognition on a scale from 1 to 5.
            
            Activity: {activity}
            List of cities: {cities}
            """;

    public static final String CITY_PROMPT_PATTERN = """
            From the following list of cities or train stations, choose the top 20 cities according to the following categories:
            City size, name recognition, well known landmarks or tourist attractions.
            
            If less than 20 cities are provided, simply return the provided cities.
            
            Cities: {cities}
            """;
    private final ChatClient openAiChatClient;


    @Override
    public List<ActivityRecommendation> getActivityRecommendations(String activity, List<String> cities, int maxResult) {
        ActivityRecommendationsResult activityRecommendations = openAiChatClient.prompt()
                .user(u -> u.text(ACTIVITY_PROMPT_PATTERN)
                        .param("activity", activity)
                        .param("cities", String.join(", ", cities)))
                .call()
                .entity(ActivityRecommendationsResult.class);
        if (activityRecommendations == null || activityRecommendations.activityRecommendations() == null) {
            return List.of();
        }
        return activityRecommendations.activityRecommendations().stream().sorted(Comparator.comparingInt(ActivityRecommendation::rating).reversed()).limit(maxResult).toList();
    }

    @Override
    public List<String> getCitiesForRecommendation(List<String> cities) {
        CityRecommendationResult cityRecommendation = openAiChatClient.prompt()
                .user(u -> u.text(CITY_PROMPT_PATTERN)
                        .param("cities", String.join(", ", cities)))
                .call()
                .entity(CityRecommendationResult.class);

        if (cityRecommendation == null || cityRecommendation.cities() == null) {
            return List.of();
        }
        return cityRecommendation.cities();
    }
}
