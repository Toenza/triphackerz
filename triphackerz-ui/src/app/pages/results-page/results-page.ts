import {Component, signal, WritableSignal} from '@angular/core';
import {MapComponent} from '../../map/map.component';
import {Location} from '../../models/location.model';
import {ActivityRecommendationResponseItem} from '../../service/trip-search.service';

@Component({
  selector: 'app-results-page',
  imports: [
    MapComponent
  ],
  templateUrl: './results-page.html',
  styleUrl: './results-page.scss'
})
export class ResultsPage {

    // TODO here we have to set the start location to set the marker on the map
    startLocation: Location = {latitude: 46.949026808315736, longitude: 7.439949741053424}; // default start location
    // TODO here we have to set all the destinations to set the marker on the map
    destinations: Location[] = [
        {latitude: 46.94816653207459, longitude: 7.459474396895817}, // default value
        {latitude: 46.9429048241674, longitude: 7.443830980779374} // default value
    ];

    results: WritableSignal<ActivityRecommendationResponseItem[]> = signal([]);

}
