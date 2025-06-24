import {Component, EventEmitter, Output} from '@angular/core';
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
  @Output() maxTravelTimeChanged = new EventEmitter<any>();
  maxTravelTime: string = "01:00";

  onSelectionChanged(selection) {
    this.maxTravelTimeChanged.emit(selection.target.value);
  }
}
