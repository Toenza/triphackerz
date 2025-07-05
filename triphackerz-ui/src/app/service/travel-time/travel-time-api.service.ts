import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {APP_CONFIG} from '../../app.config';
import {Observable} from 'rxjs';
import {TimeMapRequest} from './time-map-request';
import {GeoJSON} from 'geojson';

@Injectable({
    providedIn: 'root'
})
export class TravelTimeApiService {

    private readonly http = inject(HttpClient);
    private readonly appConfig = inject(APP_CONFIG);

    public getTimeMapAsGeoJSON(request: TimeMapRequest): Observable<GeoJSON> {
        return this.http.post<GeoJSON>('https://api.traveltimeapp.com/v4/time-map/fast', request, {
            headers: new HttpHeaders({
                'Accept': 'application/geo+json',
                'X-Application-Id': this.appConfig.traveltime.appId,
                'X-Api-Key': this.appConfig.traveltime.apiKey
            })
        });
    }

}
