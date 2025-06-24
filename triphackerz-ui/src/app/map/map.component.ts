import {Component, Input, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {OjpService} from '../service/ojp.service';
import {take} from 'rxjs';
import {Station} from '../models/station.model';
import {LatLng} from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  map: any;
  @Input() startLocation: Station = {} as Station;
  @Input() destinations: Station[] = [];

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
      this.ojpService.getPublicTransportRoutes(this.startLocation, destination)
        .pipe(take(1))
        .subscribe((response: string) => {
          console.log('Route found:', response);
          L.marker([destination.latitude, destination.longitude]).addTo(this.map);

          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response, "text/xml");
          const elements = xmlDoc.getElementsByTagName('JourneyRef');

          const el = elements[0];
          const journeyRef: string = el.textContent ?? "";
          console.log('journey ref ', journeyRef);
          this.ojpService.getPolyline(journeyRef).subscribe((res: string) => {
            const xmlDocPolyline = parser.parseFromString(res, "text/xml");
            const elementsLinkProjection = xmlDocPolyline.getElementsByTagName('LinkProjection')[0];
            const positions = elementsLinkProjection.getElementsByTagName('Position');
            console.log('elementsLinkProjection', elementsLinkProjection);
            const el = (Array.from(positions)).map((position: Element) => {
              const longitude = position.getElementsByTagName('siri:Longitude')[0].textContent;
              const latitude = position.getElementsByTagName('siri:Latitude')[0].textContent;
              const lat = parseFloat(latitude || '0');
              const lng = parseFloat(longitude || '0');
              return new LatLng(lat, lng);
            });
            console.log('el', el);
            const polyline = L.polyline(el.flat());
            console.log('polyline', polyline);
            polyline.addTo(this.map);
          });
          /*
          console.log('route', response);
          const xmlDoc = parser.parseFromString(response, "text/xml");
          console.log('xml', xmlDoc);
          // const trip = xmlDoc.getElementsByTagName;
          const elements = xmlDoc.getElementsByTagName('GeoPosition');
          console.log('elements', elements);
          const el = (Array.from(elements)).map((element: Element) => {
            const longitude = element.getElementsByTagName('siri:Longitude')[0].textContent;
            const latitude = element.getElementsByTagName('siri:Latitude')[0].textContent;
            const lat = parseFloat(latitude || '0');
            const lng = parseFloat(longitude || '0');
            return new LatLng(lat, lng);
          });
          console.log('el', el);
          const polyline = L.polyline(el.flat());
          console.log('polyline', polyline);
          polyline.addTo(this.map);

           */

        }, (error: any) => {
          console.error('Error fetching route:', error);
        });
    });
  }

}
