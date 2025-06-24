import {Component, EventEmitter, inject, OnInit, Output} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {debounceTime, distinctUntilChanged, filter, switchMap} from 'rxjs/operators';
import {Station} from '../../models/station.model';
import {StationsAutocompleteService} from '../../service/stations-autocomplete.service';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {MatFormField, MatInputModule, MatLabel} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

@Component({
  selector: 'app-input-from-station',
  templateUrl: './input-from-station.html',
  styleUrl: './input-from-station.scss',
  imports: [
    ReactiveFormsModule,
    MatAutocompleteTrigger,
    MatLabel,
    MatFormField,
    MatFormFieldModule,
    MatInputModule,
    MatAutocomplete,
    MatOption
  ]
})
export class InputFromStation implements OnInit {
  private service = inject(StationsAutocompleteService);
  station = new FormControl('');
  possibleStations: Array<Station> = [];

  @Output() stationChanged = new EventEmitter<Station>();

  ngOnInit() {
    this.station.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(value => {
        if (!value || value.length < 3) {
          this.possibleStations = [];
          return false;
        }
        return true;
      }),
      switchMap((value: string | null) => {
        console.log('value', value);
        return this.service.getStations(value || '')
      })
    ).subscribe({
      next: (stations: Station[]) => {
        this.possibleStations = stations;
      },
      error: (err) => {
        console.log("err", err);
        this.possibleStations = [];
      }
    });
  }

  onSelectionChanged(selection: Station) {
    this.stationChanged.emit(selection);
  }

  displayFn(station: Station) {
    return station?.name;
  }
}
