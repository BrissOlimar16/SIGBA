import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TerminalPagina } from './terminal.pagina';
import { MENSAJES } from '../../nucleo/mensajes.es';

describe('TerminalPagina', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalPagina],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('muestra la pantalla de espera', () => {
    const fixture = TestBed.createComponent(TerminalPagina);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;
    expect(raiz.textContent).toContain(MENSAJES.terminal.paseCredencial);
  });

  it('cambia al resultado aprobado', async () => {
    const fixture = TestBed.createComponent(TerminalPagina);
    fixture.detectChanges();
    const raiz = fixture.nativeElement as HTMLElement;
    const boton = [...raiz.querySelectorAll('button')].find((item) =>
      item.textContent?.includes(MENSAJES.terminal.verAprobado),
    );
    expect(boton).toBeTruthy();
    boton?.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(raiz.textContent).toContain(MENSAJES.terminal.aprobadoTitulo);
  });
});
