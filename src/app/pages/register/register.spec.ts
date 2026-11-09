import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Register } from './register';

describe('Register', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Register],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const valid = {
    name: 'A',
    email: 'ana@example.com',
    password: '12345678',
    confirm: '12345678',
    accepted: true,
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('acepta un nombre de 1 carácter pero no uno en blanco', () => {
    component.form.patchValue({ name: 'A' });
    expect(component.form.controls.name.valid).toBe(true);

    component.form.patchValue({ name: '   ' });
    expect(component.form.controls.name.hasError('blank')).toBe(true);
  });

  it('exige contraseña de al menos 8 caracteres', () => {
    component.form.patchValue({ password: '1234567' });

    expect(component.form.controls.password.hasError('minlength')).toBe(true);
  });

  it('marca error si las contraseñas no coinciden y lo quita al corregir', () => {
    component.form.patchValue({ ...valid, confirm: 'otra-clave' });
    expect(component.form.controls.confirm.hasError('mismatch')).toBe(true);

    component.form.patchValue({ confirm: '12345678' });
    expect(component.form.controls.confirm.hasError('mismatch')).toBe(false);
  });

  it('exige aceptar las condiciones', () => {
    component.form.patchValue({ ...valid, accepted: false });

    expect(component.form.controls.accepted.hasError('required')).toBe(true);
    expect(component.form.invalid).toBe(true);
  });

  it('es válido con todos los datos correctos', () => {
    component.form.patchValue(valid);

    expect(component.form.valid).toBe(true);
  });
});
