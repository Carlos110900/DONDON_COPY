import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';

import { FormField } from './form-field';

describe('FormField', () => {
  let component: FormField;
  let fixture: ComponentFixture<FormField>;
  let control: FormControl<string | null>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormField],
    }).compileComponents();

    control = new FormControl('', Validators.required);
    fixture = TestBed.createComponent(FormField);
    fixture.componentRef.setInput('control', control);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('no muestra error hasta que el control se toca', () => {
    expect(fixture.nativeElement.querySelector('.error')).toBeNull();
  });

  it('muestra el error cuando el control es inválido y fue tocado', async () => {
    control.markAsTouched();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.error')?.textContent).toContain('obligatorio');
  });
});
