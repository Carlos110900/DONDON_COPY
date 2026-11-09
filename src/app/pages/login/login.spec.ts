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
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Session } from '../../shared/services/session';

import { Login } from './login';

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
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

  it('no llama a la API si el formulario es inválido', () => {
    component.submit();

    http.expectNone(`${environment.authUrl}/auth/login`);
  });

  it('guarda la sesión con el rol que devuelve la API', () => {
    component.form.patchValue({ email: 'ana@example.com', password: '12345678' });
    component.submit();

    http.expectOne(`${environment.authUrl}/auth/login`).flush({
      success: true,
      token: 'jwt-de-prueba',
      user: { id: '1', name: 'Ana', email: 'ana@example.com', role: 'publisher' },
    });

    const session = TestBed.inject(Session);
    expect(session.role()).toBe('publisher');
    expect(session.token()).toBe('jwt-de-prueba');
  });
});
