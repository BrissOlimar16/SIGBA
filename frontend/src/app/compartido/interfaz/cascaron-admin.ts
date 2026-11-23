import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MENSAJES } from '../../nucleo/mensajes.es';
import { BarraLateralComponent } from './barra-lateral';
import { BarraSuperiorComponent } from './barra-superior';
import { PieComponent } from './pie';
import { IconoComponent } from '../../nucleo/iconos/icono';

@Component({
  selector: 'app-cascaron-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    BarraLateralComponent,
    BarraSuperiorComponent,
    PieComponent,
    IconoComponent,
  ],
  template: `<div class="flex min-h-screen flex-col bg-fondo text-texto">
    <app-barra-lateral [abierta]="menuAbierto()" (cerrar)="menuAbierto.set(false)" />
    @if (menuAbierto()) {
      <button
        type="button"
        class="fixed inset-0 z-30 bg-black/30 lg:hidden"
        aria-label="Cerrar menú"
        (click)="menuAbierto.set(false)"
      ></button>
    }

    <div class="flex min-w-0 flex-1 flex-col lg:pl-72">
      <app-barra-superior (abrirMenu)="menuAbierto.set(true)" />
      <main class="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 sm:px-5 lg:px-8 lg:py-7">
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div class="min-w-0">
            <div class="mb-2 flex items-center gap-2 text-xs font-semibold text-primario">
              <span class="size-1.5 rounded-full bg-acento"></span>{{ MENSAJES.nombreCompleto }}
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-texto sm:text-[26px]">
              {{ MENSAJES.navegacion[0] }}
            </h1>
            <p class="mt-1.5 text-sm text-texto-suave">{{ MENSAJES.fechaLarga }}</p>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="flex h-10 items-center gap-2 rounded-control border border-borde bg-superficie px-3 text-sm font-medium text-texto-suave"
            >
              <app-icono nombre="calendario" [tamano]="16" />{{ MENSAJES.fecha }}
            </span>
          </div>
        </div>
        <router-outlet />
      </main>
      <app-pie />
    </div>
  </div>`,
})
export class CascaronAdmin {
  protected readonly MENSAJES = MENSAJES;
  protected readonly menuAbierto = signal(false);
}
