import {AfterViewInit, Component, inject, OnInit} from '@angular/core';
import {IsochroneService} from './service/isochrone.service';
import moment from 'moment';
import {HttpClient} from '@angular/common/http';
import * as Leaflet from 'leaflet';
import {Observable, take} from 'rxjs';
import {DummyResponse, TripSearchService} from './service/trip-search.service';
import {AsyncPipe, JsonPipe} from '@angular/common';
import {MapComponent} from './map/map.component';
import {Location} from './models/location.model';
import {MatToolbar} from '@angular/material/toolbar';
import {RouterLink, RouterOutlet} from '@angular/router';
import {OjpService} from './service/ojp.service';

@Component({
  selector: 'app-root',
  imports: [AsyncPipe, JsonPipe, MapComponent, MatToolbar, RouterLink, RouterOutlet],
  providers: [IsochroneService, HttpClient, OjpService],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit {
  // TODO here we have to set the start location to set the marker on the map

  startLocation: Location = {latitude: 46.949026808315736, longitude: 7.439949741053424}; // default start location
  // TODO here we have to set all the destinations to set the marker on the map
  destinations: Location[] = [
    {latitude: 46.94816653207459, longitude: 7.459474396895817}, // default value
    {latitude: 46.9429048241674, longitude: 7.443830980779374} // default value
  ];

  private testService = inject(TripSearchService);
  private isochroneService = inject(IsochroneService);
  private map!: Leaflet.Map;
  private pin = Leaflet.marker({lat: 0, lng: 0});
  private isocrone!: Leaflet.Layer;

  test$: Observable<DummyResponse> | undefined;

  ngOnInit() {
    this.test$ = this.testService.searchTrip(8.49436, 47.396548, 60, ['hiking', 'swimming']);
  }

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
    this.isochroneService.getIsochrone(lat, lng, moment.duration(1, "hour"))
      .pipe(take(1))
      .subscribe(isochrone => {
        this.isocrone = Leaflet.geoJSON(isochrone);
        this.isocrone.addTo(this.map);
      });
  }
}
