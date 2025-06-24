import {Component, inject, signal, WritableSignal} from '@angular/core';
import {MapComponent} from '../../map/map.component';
import {Location} from '../../models/location.model';
import {ActivityRecommendationResponseItem, TripSearchService} from '../../service/trip-search.service';
import {MatCardModule} from '@angular/material/card';
import {ActivatedRoute} from '@angular/router';
import {finalize} from 'rxjs';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-results-page',
  imports: [
    MapComponent,
    MatCardModule,
        MatProgressSpinner
    ],
    templateUrl: './results-page.html',
    styleUrl: './results-page.scss'
})
export class ResultsPage {
  private searchTripService = inject(TripSearchService);
    results: WritableSignal<ActivityRecommendationResponseItem[]> = signal([]);
    isLoading: WritableSignal<boolean> = signal(false);

  constructor(private _activatedRoute: ActivatedRoute) {
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

  startLocation: Location | undefined;
  destinations: Location[] | undefined;

}
