import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('es inválido si el formulario está vacío', () => {
    expect(component.form.invalid).toBe(true);
  });

  it('valida formato de correo y mínimo 8 caracteres en la contraseña', () => {
    component.form.patchValue({ email: 'no-es-correo', password: '1234567' });

    expect(component.form.controls.email.hasError('email')).toBe(true);
    expect(component.form.controls.password.hasError('minlength')).toBe(true);
  });

  it('es válido con correo y contraseña correctos', () => {
    component.form.patchValue({ email: 'ana@example.com', password: '12345678' });

    expect(component.form.valid).toBe(true);
  });
});
