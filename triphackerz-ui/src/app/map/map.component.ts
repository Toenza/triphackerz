import {Component, Input, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {Location} from '../models/location.model';

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

  constructor() {
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
    const marker = L.marker([this.startLocation.latitude, this.startLocation.longitude]).addTo(this.map);
    marker.bindPopup('Start Location').openPopup();

    // Add markers for destination locations
    this.destinations.forEach(destination => {
      const destMarker = L.marker([destination.latitude, destination.longitude]).addTo(this.map);
      destMarker.bindPopup('Destination Location');
    });
  }

}
