import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreMapsComponent } from './explore-maps.component';

describe('ExploreMapsComponent', () => {
  let component: ExploreMapsComponent;
  let fixture: ComponentFixture<ExploreMapsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExploreMapsComponent]
    });
    fixture = TestBed.createComponent(ExploreMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
