import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataState } from './data-state';

describe('DataState', () => {
  let component: DataState;
  let fixture: ComponentFixture<DataState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataState],
    }).compileComponents();

    fixture = TestBed.createComponent(DataState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
