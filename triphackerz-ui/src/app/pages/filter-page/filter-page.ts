import {MatInputModule} from '@angular/material/input';
import {MatChipsModule} from '@angular/material/chips';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Component} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {ActivityChips} from '../../components/activity-chips/activity-chips';
import {MaxTravelTime} from '../../components/max-travel-time/max-travel-time';
import {InputFromStation} from '../../components/input-from-station/input-from-station';

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
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      from: [''],
      max_travel_time: [''],
      activities: [[]],
    });
  }

  // getFormValues & submit
  getFormValues(){

  }
}
