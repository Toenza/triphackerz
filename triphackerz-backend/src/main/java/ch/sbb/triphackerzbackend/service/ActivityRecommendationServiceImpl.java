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
            Du bist ein Experte bei der Suche nach Freizeitaktivitäten in der Schweiz. Du bekommst einen Wunsch für eine Aktivität und eine Liste von Städten. Du gibst anhand dieser Informationen konkrete Vorschläge, wo man diese Aktivität in den vorgegebenen Städten machen kann.
            Du gibst nur Ergebnisse zurück, die wirklich bekannt sind. Du gibst nur Aktivitäten zurück, die in dieser Stadt verfügbar sind. Wenn die Aktivität an einer Adresse, Gebäude oder Lokalität zu finden ist, dann gibst du den Namen davon zurück. Wenn du für eine Stadt keine solche Aktivität findest, ignorierst du sie.
            Wenn du die selbe Aktivität für mehrere Städte findest, gibst du sie nur einmal mit der am besten passenden Stadt zurück.
            Falls möglich, füge die Location mit Latitude und Longitude hinzu. Wenn es nichts gibt oder du dir unsicher bist, nimm die Location der Stadt.
            Die konkreten Aktivitäten bewertest du nach Beliebtheit und Bekanntheit in einem Wert von 1 bis 5.
            
            Aktivität: {activity}
            Liste von Städten: {cities}
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
