import { Component } from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from "@angular/material/autocomplete";
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {FormControl, ReactiveFormsModule} from "@angular/forms";
import {map, Observable, startWith} from 'rxjs';

@Component({
  selector: 'app-input-from-station',
    imports: [
        AsyncPipe,
        MatAutocomplete,
        MatAutocompleteTrigger,
        MatFormField,
        MatInput,
        MatLabel,
        MatOption,
        ReactiveFormsModule
    ],
  templateUrl: './input-from-station.html',
  styleUrl: './input-from-station.scss'
})
export class InputFromStation {
  formControl = new FormControl('');
  autocompleteOptions: string[] = ['Station 1', 'Station 2', 'Station 3'];
  filteredAutocompleteOptions: Observable<string[]> | undefined;

  ngOnInit() {
    this.filteredAutocompleteOptions = this.formControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.autocompleteOptions.filter(option => option.toLowerCase().includes(filterValue));
  }

}
