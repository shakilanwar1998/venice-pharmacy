import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsPage } from './deals.page';

describe('DealsPage', () => {
  let component: DealsPage;
  let fixture: ComponentFixture<DealsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DealsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DealsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
