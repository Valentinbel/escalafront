import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateClimberprofileComponent } from './create-climberprofile.component';

describe('CreateClimberprofileComponent', () => {
  let component: CreateClimberprofileComponent;
  let fixture: ComponentFixture<CreateClimberprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateClimberprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateClimberprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
