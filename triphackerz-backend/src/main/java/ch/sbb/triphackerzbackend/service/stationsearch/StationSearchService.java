package ch.sbb.triphackerzbackend.service.stationsearch;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import ch.sbb.triphackerzbackend.model.Station;

@Service
public class StationSearchService {
    private static final String CSV_FILE = "stops.csv";
    private static final String COMMA_DELIMITER = ",";

    private final List<Station> stations;

    public StationSearchService() {
        List<List<String>> records = readFromCsv();
        stations = mapToStations(records);
    }

    public List<Station> searchStation(String nameQuery) {
        return stations.stream()
                .filter(station -> station.getName().toLowerCase().contains(nameQuery.toLowerCase()))
                .limit(10)
                .toList();
    }

    private List<List<String>> readFromCsv() {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(new ClassPathResource(CSV_FILE).getInputStream()))) {

            return reader.lines()
                    .map(line -> Arrays.asList(line.split(COMMA_DELIMITER)))
                    .toList();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private List<Station> mapToStations(List<List<String>> records) {
        return records.stream()
                .filter(record -> record.getFirst().equals("stop_id"))
                .map(record -> new Station(
                        record.get(1), // name
                        Double.valueOf(record.get(2)), // latitude
                        Double.valueOf(record.get(3)) // longitude
                )).toList();

    }
}
