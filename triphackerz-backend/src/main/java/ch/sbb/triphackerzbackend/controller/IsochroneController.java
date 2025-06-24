package ch.sbb.triphackerzbackend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IsochroneController {

    @GetMapping("/isochrone")
    public String getIsochrone(
            @RequestParam(required = false) final Integer zugnummer
    ) {
        return "Hello World!";
    }
}
