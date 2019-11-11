import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteeducationComponent } from './deleteeducation.component';

describe('DeleteeducationComponent', () => {
  let component: DeleteeducationComponent;
  let fixture: ComponentFixture<DeleteeducationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteeducationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteeducationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
