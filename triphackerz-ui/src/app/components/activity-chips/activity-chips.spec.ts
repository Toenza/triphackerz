import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityChips } from './activity-chips';

describe('ActivityChips', () => {
  let component: ActivityChips;
  let fixture: ComponentFixture<ActivityChips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityChips]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityChips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
