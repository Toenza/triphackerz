import {Component, inject, signal, WritableSignal} from '@angular/core';
import {MapComponent} from '../../map/map.component';
import {Location} from '../../models/location.model';
import {ActivityRecommendationResponseItem, TripSearchService} from '../../service/trip-search.service';
import {MatCardModule} from '@angular/material/card';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-results-page',
    imports: [
        MapComponent,
        MatCardModule
    ],
    templateUrl: './results-page.html',
    styleUrl: './results-page.scss'
})
export class ResultsPage {
    private searchTripService = inject(TripSearchService);

    constructor(private _activatedRoute: ActivatedRoute) {
        this._activatedRoute.queryParams.subscribe(
            params => {
                console.log('queryParams', params);
                this.searchTripService.searchTrip(params['lng'], params['lat'], 60, ['in einem see oder fluss schwimmen'])
                    .subscribe(res => this.results.set(res));
            });
    }

    // TODO here we have to set the start location to set the marker on the map
    startLocation: Location = {latitude: 47.40264826377085, longitude: 8.49324703902625}; // default start location
    // TODO here we have to set all the destinations to set the marker on the map
    destinations: Location[] = [
        {latitude: 46.94816653207459, longitude: 7.459474396895817}, // default value
        {latitude: 46.9429048241674, longitude: 7.643830980779374}, // default value
        {latitude: 46.8429048241674, longitude: 7.244830980779374} // default value
    ];

    results: WritableSignal<ActivityRecommendationResponseItem[]> = signal([]);

}
