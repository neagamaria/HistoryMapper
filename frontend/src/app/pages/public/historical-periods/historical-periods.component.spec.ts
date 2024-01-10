import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalPeriodsComponent } from './historical-periods.component';

describe('HistoricalPeriodsComponent', () => {
  let component: HistoricalPeriodsComponent;
  let fixture: ComponentFixture<HistoricalPeriodsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalPeriodsComponent]
    });
    fixture = TestBed.createComponent(HistoricalPeriodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
