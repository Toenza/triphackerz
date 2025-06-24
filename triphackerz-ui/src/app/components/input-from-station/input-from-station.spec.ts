import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFromStation } from './input-from-station';

describe('InputFromStation', () => {
  let component: InputFromStation;
  let fixture: ComponentFixture<InputFromStation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputFromStation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputFromStation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
