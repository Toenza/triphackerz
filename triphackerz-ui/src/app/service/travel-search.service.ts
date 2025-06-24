import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TravelSearchService {
  private http = inject(HttpClient);

  constructor() { }

  searchTrip(sourceLongitude: number, sourceLatitude: number, maxTravelTime: number, activities: string[]): Observable<DummyResponse> {
    const options = {
      params:
        new HttpParams().set('sourceLongitude', sourceLongitude.toString())
          .set('sourceLatitude', sourceLatitude.toString())
          .set('maxTravelTime', maxTravelTime.toString())
          .set('activities', activities.join(',')),
    }

    return this.http.get<DummyResponse>('/api/search', options);
  }
}

export interface DummyResponse {
  message: string;
}
