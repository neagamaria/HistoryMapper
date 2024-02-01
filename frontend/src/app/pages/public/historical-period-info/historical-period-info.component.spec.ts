import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalPeriodInfoComponent } from './historical-period-info.component';

describe('HistoricalPeriodInfoComponent', () => {
  let component: HistoricalPeriodInfoComponent;
  let fixture: ComponentFixture<HistoricalPeriodInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoricalPeriodInfoComponent]
    });
    fixture = TestBed.createComponent(HistoricalPeriodInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
