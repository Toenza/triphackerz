package ch.sbb.triphackerzbackend.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class Station {
    private String id;
    private String name;
    private Double latitude;
    private Double longitude;
}
