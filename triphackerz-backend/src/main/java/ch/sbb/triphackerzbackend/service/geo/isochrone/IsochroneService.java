package ch.sbb.triphackerzbackend.service.geo.isochrone;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.time.Duration;

@Service
@Slf4j
public class IsochroneService {
    private final RestClient restClient;
    private final String BASE_URL = "https://api.traveltimeapp.com";
    private final String ISOCHRONE_ENDPOINT = "/v4/time-map/fast";

    public IsochroneService(RestClient.Builder restClientBuilder) throws IOException {
        this.restClient = restClientBuilder.baseUrl(BASE_URL).build();
        log.info("IsochroneService created");
    }

    public String getIsochrone(Double lat, Double lng, Duration maxTravelTime) {
        String json = STR."""
                  {
                  "arrival_searches": {
                    "one_to_many":[
                      {
                        "id": "req to lat lng",
                        "coords": {
                          "lat": \{lat},
                          "lng": \{lng}
                        },
                        "arrival_time_period": "weekday_morning",
                        "travel_time": \{maxTravelTime.getSeconds()},
                        "transportation": {
                          "type": "public_transport"
                        },
                        "level_of_detail": {
                          "scale_type": "simple",
                          "level": "lowest"
                        }
                      }
                    ]
                  }
                }
                """;

        return this.restClient.post()
                .uri(ISOCHRONE_ENDPOINT)
                .contentType(MediaType.APPLICATION_JSON)
                .body(json)
                .header("Accept", "application/geo+json")
                .header("X-Application-Id", System.getenv("appid"))
                .header("X-Api-Key", System.getenv("apikey"))
                .retrieve()
                .body(String.class);
    }
}
