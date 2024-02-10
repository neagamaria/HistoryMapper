import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HelloMenuComponent } from './hello-menu.component';

describe('HelloMenuComponent', () => {
  let component: HelloMenuComponent;
  let fixture: ComponentFixture<HelloMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HelloMenuComponent]
    });
    fixture = TestBed.createComponent(HelloMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
