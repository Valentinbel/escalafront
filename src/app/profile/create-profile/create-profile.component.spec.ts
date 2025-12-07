import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProfileComponent as CreateProfileComponent } from './create-profile.component';

describe('CreateprofileComponent', () => {
  let component: CreateProfileComponent;
  let fixture: ComponentFixture<CreateProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
