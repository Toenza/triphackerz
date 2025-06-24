package ch.sbb.triphackerzbackend.model.imagesearch;

import java.util.List;

public record ImageSearchResult(
        List<Image> items
) {
}
