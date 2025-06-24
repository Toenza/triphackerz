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
  @Output() maxTravelTimeChanged = new EventEmitter<number>();
  maxTravelTime: string = "01:00:00";
  min: string = "00:00:00";
  max: string = "03:00:00";

  onSelectionChanged(selection: any) {
    const timeString: string = selection.target.value;
    const strings = timeString.split(':');
    const minutes = parseInt(strings[0]) * 60 + parseInt(strings[1]);
    this.maxTravelTimeChanged.emit(minutes);
  }
}
