import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import * as CryptoJS from 'crypto-js';
import {Builder, Parser} from 'xml2js';
import {now} from 'moment';
import {Station} from '../models/station.model';

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


  getPublicTransportRoutes(start: Station, destination: Station): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/xml'
    });

    // Construct the request body according to OJP 2.0 specifications
    const date = new Date().toISOString();
    const body = `
                <OJP xmlns="http://www.vdv.de/ojp" xmlns:siri="http://www.siri.org.uk/siri" version="2.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                    <OJPRequest>
                        <siri:ServiceRequest>
                            <siri:RequestTimestamp>${date}</siri:RequestTimestamp>
                            <siri:RequestorRef>TripHackerz</siri:RequestorRef>
                            <OJPTripRequest>
                                <siri:RequestTimestamp>${date}</siri:RequestTimestamp>
                                <siri:MessageIdentifier>TripHackerzYeah</siri:MessageIdentifier>
                                <Origin>
                                    <PlaceRef>
                                        <siri:StopPointRef>${start.id}</siri:StopPointRef>
                                        <Name>
                                            <Text>${start.name}</Text>
                                        </Name>
                                    </PlaceRef>
                                    <DepArrTime>${date}</DepArrTime>
                                </Origin>
                                <Destination>
                                    <PlaceRef>
                                        <siri:StopPointRef>${destination.id}</siri:StopPointRef>
                                        <Name>
                                            <Text>${destination.name}</Text>
                                        </Name>
                                    </PlaceRef>
                                </Destination>
                                <Params>
                                    <NumberOfResults>1</NumberOfResults>
                                    <IncludeIntermediateStops>false</IncludeIntermediateStops>
                                </Params>
                            </OJPTripRequest>
                        </siri:ServiceRequest>
                    </OJPRequest>
                </OJP>`;

    // Generate the signature
    console.log('body', body);
    const signature = this.generateSignature(body);
    headers.set('X-Signature', signature); // Add the signature to the headers

    return this.http.post(this.apiUrl, body, {headers, responseType: 'text'})
      .pipe( // Set responseType to 'text'
      map(response => {
        console.log('reponse from ojp', response);
        return response
      })
    );
  }

  getPolyline(journeyRef: string): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/xml'
    });

    // Construct the request body according to OJP 2.0 specifications
    const date = new Date().toISOString();
    const body = `
                    <OJP version="2.0" xsi:schemaLocation="http://www.vdv.de/ojp OJP_changes_for_v1.1/OJP.xsd" xmlns="http://www.vdv.de/ojp" xmlns:siri="http://www.siri.org.uk/siri" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
                        <OJPRequest>
                            <siri:ServiceRequest>
                                <siri:RequestTimestamp>${date}</siri:RequestTimestamp>
                                <siri:RequestorRef>MENTZRegTest</siri:RequestorRef>
                                <OJPTripInfoRequest>
                                    <siri:RequestTimestamp>${date}</siri:RequestTimestamp>
                                    <siri:MessageIdentifier>TIR-1a</siri:MessageIdentifier>
                                    <JourneyRef>${journeyRef}</JourneyRef>
                                    <OperatingDayRef>${date}</OperatingDayRef>
                                   <Params>
                                        <IncludeTrackProjection>true</IncludeTrackProjection>
                                   </Params>
                                </OJPTripInfoRequest>
                            </siri:ServiceRequest>
                        </OJPRequest>
                        </OJP>`;

    // Generate the signature
    const signature = this.generateSignature(body);
    headers.set('X-Signature', signature); // Add the signature to the headers

    return this.http.post(this.apiUrl, body, {headers, responseType: 'text'})
      .pipe( // Set responseType to 'text'
        map(response => {
          console.log('reponse from track projection call', response);
          return response
        })
      );
  }
}
