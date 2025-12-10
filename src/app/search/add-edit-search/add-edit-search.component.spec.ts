import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSearchComponent } from './add-edit-search.component';

describe('AddEditSearchComponent', () => {
  let component: AddEditSearchComponent;
  let fixture: ComponentFixture<AddEditSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
