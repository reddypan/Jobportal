import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteworkexperienceComponent } from './deleteworkexperience.component';

describe('DeleteworkexperienceComponent', () => {
  let component: DeleteworkexperienceComponent;
  let fixture: ComponentFixture<DeleteworkexperienceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteworkexperienceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteworkexperienceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
