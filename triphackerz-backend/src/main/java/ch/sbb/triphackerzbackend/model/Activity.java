package ch.sbb.triphackerzbackend.model;

import lombok.NonNull;

public record Activity(
        @NonNull
        String name,
        @NonNull
        String description,
        @NonNull
        String city
) {
}
