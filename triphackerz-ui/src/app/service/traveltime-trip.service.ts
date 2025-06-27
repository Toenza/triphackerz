import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {APP_CONFIG} from '../app.config';

@Injectable({
    providedIn: 'root'
})
export class TraveltimeTripService {
    private readonly http = inject(HttpClient);
    private readonly appConfig = inject(APP_CONFIG);

    constructor() {
    }

    public getTrip(lat1: number, lng1: number, lat2: number, lng2: number, time: Date): Observable<any> {
        const body = {
            'locations': [
                {
                    'id': 'point-from',
                    'coords': {
                        'lng': lng1,
                        'lat': lat1
                    }
                },
                {
                    'id': 'point-to-1',
                    'coords': {
                        'lng': lng2,
                        'lat': lat2
                    }
                }
            ],
            'departure_searches': [
                {
                    'id': 'departure-search',
                    'transportation': {
                        'type': 'public_transport',
                        'disable_border_crossing': false
                    },
                    'departure_location_id': 'point-from',
                    'arrival_location_ids': [
                        'point-to-1'
                    ],
                    'departure_time': time,
                    'properties': [
                        'travel_time',
                        'route'
                    ],
                    'range': {
                        'enabled': true,
                        'max_results': 1,
                        'width': 900
                    },
                    'snapping': {
                        'penalty': 'enabled',
                        'accept_roads': 'both_drivable_and_walkable'
                    }
                }
            ]
        };

        return this.http.post('https://api.traveltimeapp.com/v4/routes', body, {
            headers: new HttpHeaders({
                'Accept': 'application/json',
                'X-Application-Id': this.appConfig.traveltime.appId,
                'X-Api-Key': this.appConfig.traveltime.apiKey
            })
        });
    }
}
