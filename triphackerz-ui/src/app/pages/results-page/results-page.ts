import {Component, inject, signal, WritableSignal} from '@angular/core';
import {MapComponent} from '../../map/map.component';
import {Location} from '../../models/location.model';
import {Activity, ActivityRecommendationResponseItem, TripSearchService} from '../../service/trip-search.service';
import {MatCardModule} from '@angular/material/card';
import {ActivatedRoute} from '@angular/router';
import {finalize} from 'rxjs';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatButton} from '@angular/material/button';

@Component({
    selector: 'app-results-page',
    imports: [
        MapComponent,
        MatCardModule,
        MatProgressSpinner,
        MatButton
    ],
    templateUrl: './results-page.html',
    styleUrl: './results-page.scss'
})
export class ResultsPage {
    private readonly searchTripService = inject(TripSearchService);
    results: WritableSignal<ActivityRecommendationResponseItem[]> = signal([]);
    isLoading: WritableSignal<boolean> = signal(false);


    startLocation: Location | undefined;
    destinations: Location[] | undefined;

    constructor(private readonly _activatedRoute: ActivatedRoute) {
        this._activatedRoute.queryParams.subscribe(
            params => {
                console.log('queryParams', params);
                this.startLocation = {longitude: parseFloat(params['lng']), latitude: parseFloat(params['lat'])};
                this.isLoading.set(true);
                this.searchTripService.searchTrip(params['lng'], params['lat'], 30, params['activities'])
                    .pipe(finalize(() => this.isLoading.set(false)))
                    .subscribe(res => {
                        this.results.set(res);
                        this.destinations = res.map(
                            result => result.activityRecommendation.activity.location
                        );
                    });
            });
    }


    onShowConnectionClick(activity: Activity) {
        const origin = `{"type":"COORDINATES","label":"Your Station","value":"[${this.startLocation!.longitude},${this.startLocation!.latitude}]"}`;
        const destination = `{"type":"COORDINATES","label":"${activity.name}","value":"[${activity.location.longitude},${activity.location.latitude}]"}`;
        const url = `https://www.sbb.ch/en?stops=[${encodeURIComponent(origin)},${encodeURIComponent(destination)}]`;
        window.open(url, '_blank');
    }
}
