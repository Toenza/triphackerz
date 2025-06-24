import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Station} from '../models/station.model';

@Injectable({
  providedIn: 'root'
})
export class StationsAutocompleteService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {
  }

  public getStations(name: string | null): Observable<Station[]> {
    let params = new HttpParams();
    if (name) {
      params = params.set('name', name);
    }
    return this.http.get(`${this.apiUrl}/api/station/search`, {params}) as Observable<Station[]>;
  }
}
