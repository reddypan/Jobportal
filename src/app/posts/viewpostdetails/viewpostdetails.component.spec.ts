import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpostdetailsComponent } from './viewpostdetails.component';

describe('ViewpostdetailsComponent', () => {
  let component: ViewpostdetailsComponent;
  let fixture: ComponentFixture<ViewpostdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewpostdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewpostdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
