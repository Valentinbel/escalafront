import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClimberprofileComponent } from './climberprofile.component';

describe('ClimberprofileComponent', () => {
  let component: ClimberprofileComponent;
  let fixture: ComponentFixture<ClimberprofileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClimberprofileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClimberprofileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
