import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TripSearchService {
    private http = inject(HttpClient);

    constructor() { }

    searchTrip(sourceLongitude: number, sourceLatitude: number, maxTravelTime: number, activities: string[]): Observable<ActivityRecommendationResponseItem[]> {
        const options = {
            params:
                new HttpParams().set('sourceLongitude', sourceLongitude.toString())
                    .set('sourceLatitude', sourceLatitude.toString())
                    .set('maxTravelTime', maxTravelTime.toString())
                    .set('activities', activities.join(','))
        };

        return this.http.get<ActivityRecommendationResponseItem[]>('/api/trip/search', options);
    }
}

export interface Location {
    latitude: number;
    longitude: number;
}

export interface Activity {
    name: string;
    description: string;
    city: string;
    location: Location;
}


export interface ActivityRecommendation {
    activity: Activity;
    rating: number;
}

export interface Image {
    title: string;
    link: string;
    snippet: string;
}

export interface ActivityRecommendationResponseItem {
    activityRecommendation: ActivityRecommendation;
    image: Image;
}
