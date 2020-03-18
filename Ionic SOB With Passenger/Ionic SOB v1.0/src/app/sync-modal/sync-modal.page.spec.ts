import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncModalPage } from './sync-modal.page';

describe('SyncModalPage', () => {
  let component: SyncModalPage;
  let fixture: ComponentFixture<SyncModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SyncModalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
