import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Component, inject} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ActivityChips} from '../../components/activity-chips/activity-chips';
import {MaxTravelTime} from '../../components/max-travel-time/max-travel-time';
import {InputFromStation} from '../../components/input-from-station/input-from-station';
import {Station} from '../../models/station.model';
import {Router} from '@angular/router';

@Component({
  selector: 'app-filter-page',
  imports: [ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule, ActivityChips, MaxTravelTime, InputFromStation],
  templateUrl: './filter-page.html',
  styleUrl: './filter-page.scss'
})

export class FilterPage {
  fromInput: Station = {} as Station;
  maxTravelTimeInput: number = 0;
  activities: string[] = [];
  readonly route = inject(Router);

  handleStationChange(data: Station) {
    this.fromInput = data;
  }

  handleMaxTimeChange(data: number) {
    this.maxTravelTimeInput = data;
  }

  async search() {
    await this.route.navigate(['/results'], {
      queryParams: {
        lat: this.fromInput.latitude,
        lng: this.fromInput.longitude,
        maxDuration: this.maxTravelTimeInput,
        activities: this.activities
      }
    });
  }
}
