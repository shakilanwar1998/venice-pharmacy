import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPatientPage } from './add-patient.page';

describe('AddPatientPage', () => {
  let component: AddPatientPage;
  let fixture: ComponentFixture<AddPatientPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPatientPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPatientPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
