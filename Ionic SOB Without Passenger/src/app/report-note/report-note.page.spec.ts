import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportNotePage } from './report-note.page';

describe('ReportNotePage', () => {
  let component: ReportNotePage;
  let fixture: ComponentFixture<ReportNotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportNotePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
