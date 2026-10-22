import { Component, computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";

type Respuesta = "si" | "no";

interface Unidad {
  id: number;
  placa: string;
  detalle: string;
}

interface Pregunta {
  id: number;
  texto: string;
}

@Component({
  imports: [],
  selector: "app-checklist",
  styleUrl: "./checklist.css",
  templateUrl: "./checklist.html",
})
export class Checklist {
  private router = inject(Router);

  fecha = new Date().toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Datos de ejemplo (luego vendrán de la API)
  unidades: Unidad[] = [
    { id: 1, placa: "ABC-123", detalle: "Tracto Volvo FH" },
    { id: 2, placa: "DEF-456", detalle: "Camión Hino 500" },
    { id: 3, placa: "GHI-789", detalle: "Tracto Scania R450" },
    { id: 4, placa: "JKL-012", detalle: "Camión Mercedes Actros" },
  ];

  preguntas: Pregunta[] = [
    {
      id: 1,
      texto:
        "¿Los neumáticos presentan desgaste excesivo, cortes, grietas o deformaciones?",
    },
    {
      id: 2,
      texto:
        "¿Las ruedas o sus tuercas presentan daños visibles o están flojas?",
    },
    {
      id: 3,
      texto:
        "¿El nivel de aceite del motor es inadecuado?",
    },
    {
      id: 4,
      texto:
        "¿El nivel de refrigerante es inadecuado o hay fugas visibles?",
    },
    {
      id: 5,
      texto:
        "¿Los frenos o la dirección presentan ruidos, vibraciones o anomalías?",
    },
    {
      id: 6,
      texto:
        "¿Los frenos y la dirección funcionan correctamente, sin ruidos, vibraciones ni anomalías evidentes?",
    },
  ];

  unidadId = signal<number | null>(null);
  resp = signal<Record<number, Respuesta>>({});
  foto = signal<string | null>(null);
  enviado = signal(false);

  unidad = computed(
    () => this.unidades.find((u) => u.id === this.unidadId()) ?? null,
  );
  respondidas = computed(() => Object.keys(this.resp()).length);
  progreso = computed(() => (this.respondidas() / this.preguntas.length) * 100);

  observados = computed(
    () => this.preguntas.filter((p) => this.estado(p) === "bad").length,
  );
  conformes = computed(
    () => this.preguntas.filter((p) => this.estado(p) === "ok").length,
  );

  completo = computed(() => this.respondidas() === this.preguntas.length);

  /** Sí = problema (rojo) · No = conforme (verde) · null = sin responder */
  estado(p: Pregunta): "ok" | "bad" | null {
    const r = this.resp()[p.id];
    if (!r) return null;
    return r === "si" ? "bad" : "ok";
  }

  elegirUnidad(e: Event) {
    const v = (e.target as HTMLSelectElement).value;
    this.unidadId.set(v ? Number(v) : null);
    this.resp.set({});
    this.foto.set(null);
  }

  responder(id: number, r: Respuesta) {
    this.resp.update((m) => ({ ...m, [id]: r }));
  }

  subirFoto(e: Event) {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => this.foto.set(reader.result as string);
    reader.readAsDataURL(file);
    input.value = ""; // permite volver a elegir el mismo archivo
  }

  quitarFoto() {
    this.foto.set(null);
  }

  enviar() {
    if (this.completo()) this.enviado.set(true);
  }

  nuevo() {
    this.unidadId.set(null);
    this.resp.set({});
    this.foto.set(null);
    this.enviado.set(false);
  }

  salir() {
    this.router.navigate(["/login"]);
  }
}
