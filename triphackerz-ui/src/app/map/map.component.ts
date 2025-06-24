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
    const startIcon = L.divIcon({
      className: 'custom-marker',
      html: '<div style="background-color: red; border-radius: 50%; width: 20px; height: 20px;"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    L.marker([this.startLocation.latitude, this.startLocation.longitude], {icon: startIcon}).addTo(this.map);

    // Add markers for destination locations
    this.destinations.forEach(destination => {
      L.marker([destination.latitude, destination.longitude]).addTo(this.map);
    });
  }

  createColoredMarkerIcon(color: string) {
    // Create an HTML canvas element
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 25; // Width of the canvas
    canvas.height = 41; // Height of the canvas

    // Draw the default Leaflet marker shape
    if (context != null) {
      context.fillStyle = color; // Set the desired color
      context.beginPath();
      context.moveTo(12.5, 0); // Top of the marker
      context.lineTo(25, 41); // Bottom right
      context.lineTo(0, 41); // Bottom left
      context.closePath();
      context.fill();
    }

    // Return the created icon
    return L.icon({
      iconUrl: canvas.toDataURL(), // Convert canvas to image URL
      iconSize: [25, 41], // Size of the icon
      iconAnchor: [12.5, 41] // Anchor point of the icon
    });
  }

}
