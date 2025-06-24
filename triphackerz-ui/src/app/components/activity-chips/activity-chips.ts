import {Component, effect, inject, output, signal} from '@angular/core';
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from "@angular/material/chips";
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {MatFormField, MatLabel} from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-activity-chips',
    imports: [
        MatChipGrid,
        MatChipInput,
        MatChipRemove,
        MatChipRow,
        MatFormField,
        MatIcon,
        MatLabel
    ],
  templateUrl: './activity-chips.html',
  styleUrl: './activity-chips.scss'
})

export class ActivityChips {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly recommendedActivities = signal(['Hiking', 'Swimming', 'Sightseeing', 'Wellness']);
  readonly chipsChanged = output<string[]>();
  activitiesEffect = effect(() => {
    const acts = this.recommendedActivities();
    this.chipsChanged.emit(acts);
  });

  announcer = inject(LiveAnnouncer);
  addOnBlur = true;

  addActivityToInput(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.recommendedActivities.update((keywords: string[]) => [...keywords, value]);
    }
  }

  removeActivity(keyword: string) {
    this.recommendedActivities.update(keywords => {
      const index = keywords.indexOf(keyword);
      console.log(keyword)
      if (index < 0) {
        return keywords;
      }
      keywords.splice(index, 1);
      this.announcer.announce(`Removed ${keyword} from template form`);
      return [...keywords];
    });
  }
}
