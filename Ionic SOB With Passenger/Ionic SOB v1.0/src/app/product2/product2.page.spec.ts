import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Product2Page } from './product2.page';

describe('Product2Page', () => {
  let component: Product2Page;
  let fixture: ComponentFixture<Product2Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Product2Page ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Product2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
