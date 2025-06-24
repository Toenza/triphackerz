package ch.sbb.triphackerzbackend.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import ch.sbb.triphackerzbackend.model.recommendation.ActivityRecommendation;
import ch.sbb.triphackerzbackend.model.recommendation.ActivityRecommendationsResult;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityRecommendationServiceImpl implements ActivityRecommendationService {

    public static final String PROMPT_PATTERN = """
            Du bist ein Experte bei der Suche nach Freizeitaktivitäten in der Schweiz. Du bekommst einen Wunsch für eine Aktivität und eine Liste von Städten. Du gibst anhand dieser Informationen konkrete Vorschläge, wo man diese Aktivität in den vorgegebenen Städten machen kann.
            Du gibst nur Ergebnisse zurück, die wirklich bekannt sind. Du gibst nur Aktivitäten zurück, die in dieser Stadt verfügbar sind. Wenn die Aktivität an einer Adresse, Gebäude oder Lokalität zu finden ist, dann gibst du den Namen davon zurück. Wenn du für eine Stadt keine solche Aktivität findest, ignorierst du sie.
            Falls möglich, füge die Location mit Latitude und Longitude hinzu. Wenn es nichts gibt oder du dir unsicher bist, nimm die Location der Stadt.
            Die konkreten Aktivitäten bewertest du nach Beliebtheit und Bekanntheit in einem Wert von 1 bis 5.
            
            Aktivität: {activity}
            Liste von Städten: {cities}
            """;
    private final ChatClient openAiChatClient;


    @Override
    public List<ActivityRecommendation> getActivityRecommendations(String activity, List<String> cities, int maxResult) {
        ActivityRecommendationsResult activityRecommendations = openAiChatClient.prompt()
                .user(u -> u.text(PROMPT_PATTERN)
                        .param("activity", activity)
                        .param("cities", String.join(", ", cities)))
                .call()
                .entity(ActivityRecommendationsResult.class);
        if (activityRecommendations == null || activityRecommendations.activityRecommendations() == null) {
            return List.of();
        }
        return activityRecommendations.activityRecommendations().stream().sorted(Comparator.comparingInt(ActivityRecommendation::rating).reversed()).limit(maxResult).toList();
    }
}
