import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import * as CryptoJS from 'crypto-js';
import {Builder, Parser} from 'xml2js';

export interface OjpRoute {
  duration: number;
  distance: number;
  itinerary: any;
}

@Injectable({
  providedIn: 'root'
})
export class OjpService {
  private apiUrl = 'https://api.opentransportdata.swiss/ojp20';
  private token = ''; // your token here
  private secret = ''; // your secret here

  constructor(private http: HttpClient) {
  }

  private generateSignature(requestBody: any): string {
    const stringBody = JSON.stringify(requestBody);
    // Create the signature using HMAC SHA256
    const signature = CryptoJS.HmacSHA256(stringBody, this.secret).toString(CryptoJS.enc.Hex);
    return signature;
  }

  private convertToXML(obj: any): string {
    const builder = new Builder();
    return builder.buildObject(obj);
  }

  private parseXMLResponse(response: string): Observable<OjpRoute> {
    const parser = new Parser({explicitArray: false});
    return new Observable(observer => {
      parser.parseString(response, (err, result) => {
        if (err) {
          observer.error(err);
        } else {
          observer.next(result);
          observer.complete();
        }
      });
    });
  }

  getPublicTransportRoutes(start: { latitude: number; longitude: number }, destination: {
    latitude: number;
    longitude: number
  }): Observable<Observable<OjpRoute>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });

    // Construct the request body according to OJP 2.0 specifications
    const body = {
      from: {
        latitude: start.latitude,
        longitude: start.longitude
      },
      to: {
        latitude: destination.latitude,
        longitude: destination.longitude
      }
      // Other parameters as needed
    };

    // Generate the signature
    console.log('body: ' + body.from.latitude + ' and ' + body.to.latitude);
    const signature = this.generateSignature(body);
    headers.set('X-Signature', signature); // Add the signature to the headers

    return this.http.post(this.apiUrl, body, {headers, responseType: 'text'}).pipe( // Set responseType to 'text'
      map(response => {
        console.log(response);
        return this.parseXMLResponse(response);
      })
    );
  }
}
