import {AfterViewInit, Component, inject} from '@angular/core';
import {IsochroneService} from './service/isochrone.service';
import moment from 'moment';
import {HttpClient} from '@angular/common/http';
import * as Leaflet from 'leaflet';
import {take} from 'rxjs';
import {RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    providers: [IsochroneService, HttpClient],
    templateUrl: './app.html',
    styleUrl: './app.scss'
})
export class App implements AfterViewInit {
    private readonly isochroneService = inject(IsochroneService);
    private map!: Leaflet.Map;
    private pin = Leaflet.marker({lat: 0, lng: 0});
    private isocrone!: Leaflet.Layer;

    ngAfterViewInit() {
        this.initMap();
    }

    private readonly MAP_CENTER: Leaflet.LatLng = Leaflet.latLng({lat: 47.396548, lng: 8.49436});

    initMap() {
        this.map = Leaflet.map('map').setView(this.MAP_CENTER, 13);
        Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(this.map);
        this.map.on('click', (e) => {
            const coord = e.latlng;
            this.dropPin(coord.lat, coord.lng);
        });
    }

    dropPin(lat: number, lng: number) {
        if (this.pin) {
            this.map.removeLayer(this.pin);
        }
        if (this.isocrone) {
            this.map.removeLayer(this.isocrone);
        }

        this.pin = Leaflet.marker({lat, lng});
        this.pin.addTo(this.map);
        this.isochroneService.getIsochrone(lat, lng, moment.duration(1, 'hour'))
            .pipe(take(1))
            .subscribe(result => {
                this.isocrone = Leaflet.geoJSON(result);
                this.isocrone.addTo(this.map);
            });
    }
}
