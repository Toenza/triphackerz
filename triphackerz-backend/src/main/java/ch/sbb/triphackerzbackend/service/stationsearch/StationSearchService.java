package ch.sbb.triphackerzbackend.service.stationsearch;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import ch.sbb.triphackerzbackend.model.Station;

@Service
public class StationSearchService {
    private static final String CSV_FILE = "stops.csv";

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

            CSVParser csvParser = new CSVParser(reader,
                    CSVFormat.DEFAULT.builder()
                            .setQuote('"')
                            .setIgnoreEmptyLines(true)
                            .build());

            List<List<String>> records = new ArrayList<>();
            for (CSVRecord record : csvParser) {
                List<String> values = new ArrayList<>();
                record.forEach(values::add);
                records.add(values);
            }
            return records;
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private List<Station> mapToStations(List<List<String>> records) {
        return records.stream()
                .filter(record -> !record.get(1).equals("stop_name"))
                .map(record -> new Station(
                        record.getFirst(), // id
                        record.get(1), // name
                        Double.valueOf(record.get(2)), // latitude
                        Double.valueOf(record.get(3)) // longitude
                )).toList();

    }
}
