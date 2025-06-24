package ch.sbb.triphackerzbackend.service.stationsearch;

import java.io.*;
import java.time.Duration;
import java.util.*;

import ch.sbb.triphackerzbackend.service.geo.isochrone.IsochroneService;
import org.geotools.geojson.geom.GeometryJSON;
import org.geotools.geometry.jts.JTSFactoryFinder;
import org.locationtech.jts.geom.*;
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
    private final List<Point> points;
    private final MultiPoint allPoints;
    private final IsochroneService isochroneService;

    public StationSearchService(IsochroneService isochroneService) {
        this.isochroneService = isochroneService;
        List<List<String>> records = readFromCsv();
        this.stations = this.mapToStations(records);
        GeometryFactory geometryFactory = JTSFactoryFinder.getGeometryFactory();
        this.points = stations.stream().map(
                station -> {
                    Coordinate coordinate = new Coordinate(station.getLongitude(), station.getLatitude());
                    Point point = geometryFactory.createPoint(coordinate);
                    point.setUserData(station.getName());
                    return point;
                }
        ).toList();
        this.allPoints = new MultiPoint(this.points.toArray(Point[]::new), geometryFactory);
    }

    public List<Station> searchStation(String nameQuery) {
        return stations.stream()
                .filter(station -> station.getName().toLowerCase().contains(nameQuery.toLowerCase()))
                .limit(10)
                .toList();
    }

    public List<Station> getStationsWithinOf(Double lat, Double lng, Duration maxTravelTime) throws IOException {
        String json = this.isochroneService.getIsochrone(lat, lng, maxTravelTime);
        GeometryJSON gjson = new GeometryJSON();
        Reader reader = new StringReader(json);
        MultiPolygon multiPolygon = gjson.readMultiPolygon(reader);
        Geometry intersection = multiPolygon.intersection(allPoints);
        List<Coordinate> coordinates = Arrays.stream(intersection.getCoordinates()).toList();
        List<Station> list = coordinates.stream().map(
                coordinate -> this.stations.stream().filter(
                        station -> station.getLongitude() == coordinate.x && station.getLatitude() == coordinate.y
                ).findFirst().orElse(null)
        ).filter(Objects::nonNull).toList();

        return list;
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
