import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private http = inject(HttpClient);

  constructor() { }

  test(): Observable<string> {
    return this.http.get('/api/test', { responseType: 'text' });
  }
}
