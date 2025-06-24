import { Component } from '@angular/core';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";

@Component({
  selector: 'app-max-travel-time',
    imports: [
        MatFormField,
        MatInput,
        MatLabel
    ],
  templateUrl: './max-travel-time.html',
  styleUrl: './max-travel-time.scss'
})
export class MaxTravelTime {

}
