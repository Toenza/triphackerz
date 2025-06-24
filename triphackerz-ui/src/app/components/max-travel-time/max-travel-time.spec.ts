import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxTravelTime } from './max-travel-time';

describe('MaxTravelTime', () => {
  let component: MaxTravelTime;
  let fixture: ComponentFixture<MaxTravelTime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaxTravelTime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaxTravelTime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
