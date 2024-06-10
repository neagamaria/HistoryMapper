import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouteInfoComponent } from './route-info.component';

describe('RouteInfoComponent', () => {
  let component: RouteInfoComponent;
  let fixture: ComponentFixture<RouteInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouteInfoComponent]
    });
    fixture = TestBed.createComponent(RouteInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
