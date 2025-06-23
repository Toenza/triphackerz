import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class IsochroneService {
  private http = inject(HttpClient);

  constructor() { }

  public getIsochrone(lat: number, lng: number, duration: moment.Duration): Observable<any> {
    return this.http.post('https://api.traveltimeapp.com/v4/time-map/fast', {
      "arrival_searches": {
        "one_to_many":[
          {
            "id": "req to lat lng",
            "coords": {
              "lat": lat,
              "lng": lng
            },
            "arrival_time_period": "weekday_morning",
            "travel_time": duration.asSeconds(), // In seconds. Max is 3 hours (10800)
            "transportation": {
              "type": "public_transport"
            },
            "level_of_detail": {
              "scale_type": "simple",
              "level": "lowest"
            }
          }
        ]
      }
    }, {
      headers: new HttpHeaders({
        'Accept': 'application/geo+json',
        'X-Application-Id': 'REPLACE-ME',
        'X-Api-Key': 'REPLACE-ME'
        })
    });
  }
}
