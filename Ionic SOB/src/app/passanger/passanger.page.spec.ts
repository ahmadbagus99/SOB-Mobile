import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PassangerPage } from './passanger.page';

describe('PassangerPage', () => {
  let component: PassangerPage;
  let fixture: ComponentFixture<PassangerPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PassangerPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PassangerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
