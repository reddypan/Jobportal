import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewapplicantsComponent } from './viewapplicants.component';

describe('ViewapplicantsComponent', () => {
  let component: ViewapplicantsComponent;
  let fixture: ComponentFixture<ViewapplicantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewapplicantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewapplicantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
