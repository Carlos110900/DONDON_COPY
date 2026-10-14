import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Involved } from './involved';

describe('Involved', () => {
  let component: Involved;
  let fixture: ComponentFixture<Involved>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Involved],
    }).compileComponents();

    fixture = TestBed.createComponent(Involved);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
