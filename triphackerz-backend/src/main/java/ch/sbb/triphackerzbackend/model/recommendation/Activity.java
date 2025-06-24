package ch.sbb.triphackerzbackend.model.recommendation;

import lombok.NonNull;

public record Activity(
        @NonNull
        String name,
        @NonNull
        String description,
        @NonNull
        String city,
        Location location
) {
}
