import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOptionsMenuComponent } from './map-options-menu.component';

describe('MapOptionsMenuComponent', () => {
  let component: MapOptionsMenuComponent;
  let fixture: ComponentFixture<MapOptionsMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MapOptionsMenuComponent]
    });
    fixture = TestBed.createComponent(MapOptionsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
