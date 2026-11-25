import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('crea la aplicación', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('muestra el punto de salida del enrutador', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const raiz = fixture.nativeElement as HTMLElement;
    expect(raiz.querySelector('router-outlet')).toBeTruthy();
  });
});
