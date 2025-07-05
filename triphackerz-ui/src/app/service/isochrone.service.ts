import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import moment from 'moment';
import {TravelTimeApiService} from './travel-time/travel-time-api.service';
import {TimeMapRequest} from './travel-time/time-map-request';
import {GeoJSON} from 'geojson';

@Injectable({
    providedIn: 'root'
})
export class IsochroneService {

    private readonly travelTimeService = inject(TravelTimeApiService);


    public getIsochrone(lat: number, lng: number, duration: moment.Duration): Observable<GeoJSON> {
        const request: TimeMapRequest = {
            arrival_searches: {
                one_to_many: [
                    {
                        id: 'req to lat lng',
                        coords: {
                            lat: lat,
                            lng: lng
                        },
                        arrival_time_period: 'weekday_morning',
                        travel_time: duration.asSeconds(), // In seconds. Max is 3 hours (10800)
                        transportation: {
                            type: 'public_transport'
                        },
                        level_of_detail: {
                            scale_type: 'simple',
                            level: 'lowest'
                        }
                    }
                ]
            }
        };
        return this.travelTimeService.getTimeMapAsGeoJSON(request);
    }
}
