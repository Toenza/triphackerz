import {Component, Input, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {Location} from '../models/location.model';
import {OjpRoute, OjpService} from '../service/ojp.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {

  map: any;
  @Input()
  startLocation: Location = {latitude: 46.949026808315736, longitude: 7.439949741053424}; // default value
  @Input()
  destinations: Location[] = [
    {latitude: 46.94816653207459, longitude: 7.459474396895817}, // default value
    {latitude: 46.9429048241674, longitude: 7.443830980779374} // default value
  ];

  constructor(private ojpService: OjpService) {
  }

  ngOnInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map').setView([this.startLocation.latitude, this.startLocation.longitude], 13); // Set initial coordinates and zoom level

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Add a marker for the start location
    const startIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background-color: red; border-radius: 50%; width: 20px; height: 20px;"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    L.marker([this.startLocation.latitude, this.startLocation.longitude], {icon: startIcon}).addTo(this.map);

    // Add markers for destination locations
    //this.destinations.forEach(destination => {
    //  L.marker([destination.latitude, destination.longitude]).addTo(this.map);
    //});
    this.destinations.forEach(destination => {
      console.log('check following destination: ' + destination.latitude + ' and ' + destination.longitude)
      this.ojpService.getPublicTransportRoutes(this.startLocation, destination).subscribe((route: Observable<OjpRoute>) => {
        console.log('Route found:', route);
        L.marker([destination.latitude, destination.longitude]).addTo(this.map);
      }, (error: any) => {
        console.error('Error fetching route:', error);
      });
    });
  }

}
