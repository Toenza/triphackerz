import {Component, inject, Input, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {LatLng, PolylineOptions} from 'leaflet';
import {Location} from '../models/location.model';
import {TraveltimeTripService} from '../service/traveltime-trip.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  map: any;
  @Input() startLocation: Location = {} as Location;
  @Input() destinations: Location[] = [];
  private travelTimeService = inject(TraveltimeTripService);

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
      console.log('check following destination: ' + destination.latitude + ' and ' + destination.longitude);
      this.travelTimeService.getTrip(
        this.startLocation.latitude,
        this.startLocation.longitude,
        destination.latitude,
        destination.longitude,
        new Date()
      ).subscribe(trip => {
        L.marker([destination.latitude, destination.longitude]).addTo(this.map);
        let parts = trip.results[0].locations[0].properties[0].route.parts;
        const ptParts = parts.filter((part: any) => part.type === 'public_transport');
        const polyline = ptParts.map((ptPart: any) => {
          const coords: LatLng[] = ptPart.coords;
          let pairwise: LatLng[][] = [];
          for (let i = 0; i < coords.length - 1; i++) {
            pairwise.push([this.getLatLng(coords, i), this.getLatLng(coords, i+1)]);
          }
          return pairwise;
        });
        const randomColor = '#'+(Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');
        L.polyline(polyline, {
          color: randomColor
        } as PolylineOptions).addTo(this.map);
      });
    });
  }

  private getLatLng(coords: LatLng[], i: number) {
    return new LatLng(coords[i].lat, coords[i].lng);
  }
}
