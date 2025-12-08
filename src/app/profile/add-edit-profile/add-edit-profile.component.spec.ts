import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProfileComponent as AddEditProfileComponent } from './add-edit-profile.component';

describe('CreateprofileComponent', () => {
  let component: AddEditProfileComponent;
  let fixture: ComponentFixture<AddEditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
