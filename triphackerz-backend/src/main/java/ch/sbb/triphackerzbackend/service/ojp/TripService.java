package ch.sbb.triphackerzbackend.service.ojp;

import ch.sbb.triphackerzbackend.model.Station;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.util.Date;

@Service
@Slf4j
public class TripService {
    private final RestClient restClient;
    private final String BASE_URL = "https://api.opentransportdata.swiss/ojp20";

    private String token = "eyJvcmciOiI2NDA2NTFhNTIyZmEwNTAwMDEyOWJiZTEiLCJpZCI6IjkzY2QzNzI2MDI5MDRmYTNhN2U0ZDA4OTY1ZmYwYjJmIiwiaCI6Im11cm11cjEyOCJ9";
    private String secret = "6153aaa40dd7259c3e720abe2cb4b471";

    public TripService(RestClient.Builder restClientBuilder) throws IOException {
        this.restClient = restClientBuilder.baseUrl(BASE_URL).build();
        log.info("OJP TripService created");
    }

    public String getTripPolyline(Station start, Station end, Date when) {
        String timeStamp = new Date().toInstant().toString();
        String xml = STR."""
                <?xml version="1.0" encoding="UTF-8"?>
                <OJP xmlns="http://www.vdv.de/ojp" xmlns:siri="http://www.siri.org.uk/siri" version="2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.vdv.de/ojp ../../../../OneDrive/01_Dokumente/OJP%20OpenJourneyPlanner/OJP_changes_for_v1.1/OJP.xsd">
                    <OJPRequest>
                        <siri:ServiceRequest>
                            <siri:RequestTimestamp>\{timeStamp}</siri:RequestTimestamp>
                            <siri:RequestorRef>TripHackerz</siri:RequestorRef>
                            <OJPTripRequest>
                                <siri:RequestTimestamp>\{timeStamp}</siri:RequestTimestamp>
                                <siri:MessageIdentifier>TripHackerzYeah</siri:MessageIdentifier>
                                <Origin>
                                    <PlaceRef>
                                        <siri:StopPointRef>\{start.getId()}</siri:StopPointRef>
                                        <Name>
                                            <Text>\{start.getName()}</Text>
                                        </Name>
                                    </PlaceRef>
                                    <DepArrTime>\{when.toInstant().toString()}</DepArrTime>
                                </Origin>
                                <Destination>
                                    <PlaceRef>
                                        <siri:StopPointRef>\{end.getId()}</siri:StopPointRef>
                                        <Name>
                                            <Text>\{end.getId()}</Text>
                                        </Name>
                                    </PlaceRef>
                                </Destination>
                                <Params>
                                    <NumberOfResults>3</NumberOfResults>
                                    <IncludeIntermediateStops>false</IncludeIntermediateStops>
                                </Params>
                            </OJPTripRequest>
                        </siri:ServiceRequest>
                    </OJPRequest>
                </OJP>
                """;

        return this.restClient.post()
                .contentType(MediaType.APPLICATION_XML)
                .body(xml)
                .header("Accept", "application/geo+json")
                .header("Authorization", "Bearer " + this.token)
                .header("X-", System.getenv("apikey"))
                .retrieve()
                .body(String.class);
    }
}
