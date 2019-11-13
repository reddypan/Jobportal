import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewapplicantsprofileComponent } from './viewapplicantsprofile.component';

describe('ViewapplicantsprofileComponent', () => {
  let component: ViewapplicantsprofileComponent;
  let fixture: ComponentFixture<ViewapplicantsprofileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewapplicantsprofileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewapplicantsprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
