"use client";

import {
  Camera,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  FileText,
  ImagePlus,
  Loader2,
  Package,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { ESTADO_INICIAL, type EstadoFormulario } from "@/app/admin/estado";
import { CATEGORIAS } from "@/lib/categorias";
import { MAX_SUBIDA, comprimirFoto, megas } from "@/lib/media/comprimir-foto";
import { cn } from "@/lib/utils";

type Accion = (estado: EstadoFormulario, datos: FormData) => Promise<EstadoFormulario>;

export type ValoresProducto = {
  nombre?: string;
  marca?: string;
  categoria?: string;
  resumen?: string;
  descripcion?: string | null;
  precio?: number | null;
  precioAnterior?: number | null;
  estado?: string;
  destacado?: boolean;
  nuevo?: boolean;
  orden?: number;
  seoTitulo?: string | null;
  seoDescripcion?: string | null;
  palabrasClave?: string[];
};

const MARCAS = ["FuelTech", "AEM", "Turbosmart", "PSR", "Garrett", "Maxpeedingrods", "Tactrix", "RaceTec", "Bosch"];

// text-base (16 px) evita que el iPhone haga zoom al tocar un campo.
const claseInput =
  "bg-ink border-hairline focus:border-brand h-12 w-full rounded-xl border px-4 text-base text-white outline-none transition-colors placeholder:text-white/25 [color-scheme:dark]";

const miles = new Intl.NumberFormat("es-CL");
const conPuntos = (v: string) => {
  const d = v.replace(/\D/g, "");
  return d ? miles.format(Number(d)) : "";
};

type FotoNueva = { archivo: File; url: string };

export function FormularioProducto({
  accion,
  valores = {},
  existentes = [],
  nuevo,
}: {
  accion: Accion;
  valores?: ValoresProducto;
  existentes?: { id: string; url: string }[];
  nuevo: boolean;
}) {
  const [estado, enviar] = useActionState(accion, ESTADO_INICIAL);
  const errores = estado.erroresPorCampo ?? {};

  const [conservadas, setConservadas] = useState(existentes);
  const [nuevas, setNuevas] = useState<FotoNueva[]>([]);
  const inputFotos = useRef<HTMLInputElement>(null);
  const [preparando, setPreparando] = useState(false);

  const n = (v: number | null | undefined) => (v == null ? "" : miles.format(v));
  const [precio, setPrecio] = useState(n(valores.precio));
  const [precioAnterior, setPrecioAnterior] = useState(n(valores.precioAnterior));
  const [estadoProducto, setEstadoProducto] = useState(valores.estado ?? "DISPONIBLE");
  const [nombre, setNombre] = useState(valores.nombre ?? "");
  const [resumen, setResumen] = useState(valores.resumen ?? "");
  const [seoTitulo, setSeoTitulo] = useState(valores.seoTitulo ?? "");
  const [seoDescripcion, setSeoDescripcion] = useState(valores.seoDescripcion ?? "");

  // El input real (name="fotos") siempre refleja la lista acumulada: elegir
  // fotos varias veces suma, no reemplaza.
  useEffect(() => {
    if (!inputFotos.current) return;
    const dt = new DataTransfer();
    nuevas.forEach((f) => dt.items.add(f.archivo));
    inputFotos.current.files = dt.files;
  }, [nuevas]);

  // Si hay error, lleva la vista arriba para que se vea el aviso.
  useEffect(() => {
    if (estado.error) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [estado]);

  function mover(i: number, delta: number) {
    setConservadas((lista) => {
      const j = i + delta;
      if (j < 0 || j >= lista.length) return lista;
      const copia = [...lista];
      [copia[i], copia[j]] = [copia[j], copia[i]];
      return copia;
    });
  }

  const totalFotos = conservadas.length + nuevas.length;
  // Vista previa del resultado en Google (lo mismo que genera la ficha si el campo va vacío).
  const tituloGoogle = `${seoTitulo.trim() || `${nombre || "Producto"} en Temuco · Venta e instalación`} | JNTUNED`;
  const descripcionGoogle = seoDescripcion.trim() || `${nombre || "Producto"} en Temuco: ${resumen}`;

  return (
    <form
      action={enviar}
      onSubmit={(e) => {
        if (preparando) {
          e.preventDefault();
          toast("Espera un segundo: todavía se están preparando las fotos.");
          return;
        }
        const total = nuevas.reduce((a, f) => a + f.archivo.size, 0);
        if (total > MAX_SUBIDA) {
          e.preventDefault();
          toast.error(`Las fotos nuevas pesan ${megas(total)} MB y el máximo por vez es ${megas(MAX_SUBIDA)} MB.`, {
            description: "Quita algunas, guarda y después agrega las demás editando el producto.",
          });
        }
      }}
      className="space-y-5"
    >
      {estado.error && (
        <p role="alert" className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {estado.error}
        </p>
      )}

      <Seccion
        icono={<Camera className="size-5" />}
        titulo="Fotos"
        ayuda="La primera es la portada. Se ven mejor con fondo blanco."
        extra={totalFotos > 0 ? `${totalFotos} ${totalFotos === 1 ? "foto" : "fotos"}` : undefined}
      >
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {conservadas.map((f, i) => (
            <li key={f.id} className="relative aspect-square overflow-hidden rounded-2xl bg-white">
              <input type="hidden" name="existentes" value={f.id} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt="" className="size-full object-contain p-2" />
              {i === 0 && <Etiqueta className="bg-brand">Portada</Etiqueta>}
              <BotonFoto
                onClick={() => setConservadas((l) => l.filter((x) => x.id !== f.id))}
                etiqueta="Quitar foto"
                className="absolute top-1.5 right-1.5"
              >
                <X className="size-4" />
              </BotonFoto>
              {conservadas.length > 1 && (
                <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between">
                  <BotonFoto onClick={() => mover(i, -1)} etiqueta="Mover antes" deshabilitado={i === 0}>
                    <ChevronLeft className="size-4" />
                  </BotonFoto>
                  <BotonFoto onClick={() => mover(i, 1)} etiqueta="Mover después" deshabilitado={i === conservadas.length - 1}>
                    <ChevronRight className="size-4" />
                  </BotonFoto>
                </div>
              )}
            </li>
          ))}

          {nuevas.map((f, i) => (
            <li key={f.url} className="relative aspect-square overflow-hidden rounded-2xl bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.url} alt="" className="size-full object-contain p-2" />
              {conservadas.length === 0 && i === 0 ? (
                <Etiqueta className="bg-brand">Portada</Etiqueta>
              ) : (
                <Etiqueta className="bg-emerald-500">Nueva</Etiqueta>
              )}
              <BotonFoto
                onClick={() => {
                  URL.revokeObjectURL(f.url);
                  setNuevas((l) => l.filter((x) => x.url !== f.url));
                }}
                etiqueta="Quitar foto"
                className="absolute top-1.5 right-1.5"
              >
                <X className="size-4" />
              </BotonFoto>
            </li>
          ))}

          <li className={cn(totalFotos === 0 && "col-span-2 sm:col-span-3 lg:col-span-4")}>
            <label
              className={cn(
                "border-hairline hover:border-brand text-suave hover:text-brand-bright flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed text-center text-sm font-medium transition-colors",
                totalFotos === 0 ? "py-12" : "aspect-square",
              )}
            >
              <span className="bg-brand/15 text-brand-bright grid size-12 place-items-center rounded-2xl">
                <ImagePlus className="size-6" />
              </span>
              {preparando ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Preparando fotos…
                </span>
              ) : totalFotos === 0 ? (
                "Agregar fotos del producto"
              ) : (
                "Agregar más"
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                disabled={preparando}
                onChange={async (e) => {
                  const originales = Array.from(e.target.files ?? []);
                  e.target.value = "";
                  if (!originales.length) return;
                  setPreparando(true);
                  try {
                    const archivos = await Promise.all(originales.map(comprimirFoto));
                    setNuevas((l) => [...l, ...archivos.map((archivo) => ({ archivo, url: URL.createObjectURL(archivo) }))]);
                  } finally {
                    setPreparando(false);
                  }
                }}
              />
            </label>
          </li>
        </ul>
        <input ref={inputFotos} type="file" name="fotos" multiple hidden aria-hidden tabIndex={-1} />
      </Seccion>

      <Seccion icono={<Package className="size-5" />} titulo="El producto">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="nombre" label="Nombre" errores={errores.nombre} ayuda="Como lo busca la gente: «FuelTech FT450», «Turbo GT3076R».">
            <input
              id="nombre"
              name="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="FuelTech FT450"
              className={claseInput}
            />
          </Campo>
          <Campo id="marca" label="Marca" errores={errores.marca}>
            <input id="marca" name="marca" list="lista-marcas" defaultValue={valores.marca} required placeholder="FuelTech" className={claseInput} />
            <datalist id="lista-marcas">
              {MARCAS.map((m) => (
                <option key={m} value={m} />
              ))}
            </datalist>
          </Campo>
          <Campo id="categoria" label="Categoría">
            <select id="categoria" name="categoria" defaultValue={valores.categoria ?? "ECU_FUELTECH"} className={claseInput}>
              {Object.entries(CATEGORIAS).map(([v, c]) => (
                <option key={v} value={v}>
                  {c.label}
                </option>
              ))}
            </select>
          </Campo>
          <Campo id="resumen" label="Resumen" errores={errores.resumen} ayuda={`Una línea para la tarjeta (${resumen.length}/140).`}>
            <input
              id="resumen"
              name="resumen"
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              maxLength={140}
              required
              placeholder="Pantalla touch, control de boost y datalogger."
              className={claseInput}
            />
          </Campo>
        </div>
      </Seccion>

      <Seccion icono={<CircleDollarSign className="size-5" />} titulo="Precio y estado">
        <div className="grid gap-4 sm:grid-cols-2">
          <Campo id="precio" label="Precio" opcional errores={errores.precio} ayuda="Déjalo vacío y en el sitio dice «Consultar precio».">
            <div className="relative">
              <span className="text-suave pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg">$</span>
              <input
                id="precio"
                name="precio"
                inputMode="numeric"
                value={precio}
                onChange={(e) => setPrecio(conPuntos(e.target.value))}
                placeholder="Consultar precio"
                className={cn(claseInput, "font-display h-14 pl-9 text-2xl font-bold")}
              />
            </div>
          </Campo>
          <Campo id="precioAnterior" label="Precio anterior" opcional errores={errores.precioAnterior} ayuda="Si lo rebajaste, pon el antiguo: se muestra tachado.">
            <div className="relative">
              <span className="text-suave pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-lg">$</span>
              <input
                id="precioAnterior"
                name="precioAnterior"
                inputMode="numeric"
                value={precioAnterior}
                onChange={(e) => setPrecioAnterior(conPuntos(e.target.value))}
                placeholder="899.900"
                className={cn(claseInput, "h-14 pl-9 text-lg")}
              />
            </div>
          </Campo>
        </div>

        <p className="text-suave mt-5 mb-2 text-xs font-medium">Estado</p>
        <input type="hidden" name="estado" value={estadoProducto} />
        <div className="bg-ink grid grid-cols-3 gap-1 rounded-2xl p-1" role="radiogroup" aria-label="Estado">
          {(
            [
              ["DISPONIBLE", "Disponible", "bg-emerald-500 text-white"],
              ["A_PEDIDO", "A pedido", "bg-amber-400 text-ink"],
              ["AGOTADO", "Agotado", "bg-white text-ink"],
            ] as const
          ).map(([valor, label, activo]) => (
            <button
              key={valor}
              type="button"
              role="radio"
              aria-checked={estadoProducto === valor}
              onClick={() => setEstadoProducto(valor)}
              className={cn(
                "h-11 rounded-xl text-sm font-bold transition-colors",
                estadoProducto === valor ? activo : "text-suave hover:text-white",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <Interruptor name="destacado" label="Destacado" detalle="Sale primero en la portada" defecto={valores.destacado ?? false} />
          <Interruptor name="nuevo" label="Nuevo" detalle="Muestra la etiqueta «Nuevo»" defecto={valores.nuevo ?? false} />
          <Campo id="orden" label="Orden" opcional ayuda="Menor número, más arriba.">
            <input id="orden" name="orden" inputMode="numeric" maxLength={3} defaultValue={valores.orden ?? ""} placeholder="0" className={claseInput} />
          </Campo>
        </div>
      </Seccion>

      <Seccion icono={<FileText className="size-5" />} titulo="Descripción" ayuda="Opcional, pero ayuda a vender y a salir en Google.">
        <textarea
          id="descripcion"
          name="descripcion"
          rows={6}
          defaultValue={valores.descripcion ?? ""}
          placeholder="Para qué motores sirve, qué incluye, si lo instalamos…"
          className={cn(claseInput, "h-auto py-3")}
        />
      </Seccion>

      <details className="bg-graphite border-hairline group rounded-3xl border p-5 sm:p-6" open={Boolean(valores.seoTitulo || valores.seoDescripcion)}>
        <summary className="flex cursor-pointer list-none items-center gap-3">
          <span className="bg-brand/15 text-brand-bright grid size-10 shrink-0 place-items-center rounded-xl">
            <Search className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="font-display block text-lg font-bold text-white uppercase">Google (opcional)</span>
            <span className="text-suave block text-sm">Si lo dejas vacío, se arma solo con el nombre y el resumen.</span>
          </span>
          <ChevronDown className="text-suave size-5 transition-transform group-open:rotate-180" />
        </summary>

        <div className="mt-5 space-y-4">
          {/* Vista previa del resultado de búsqueda */}
          <div className="rounded-2xl bg-white p-4">
            <p className="text-xs text-[#4d5156]">jntuned.cl › productos</p>
            <p className="mt-1 truncate text-lg text-[#1a0dab]">{tituloGoogle}</p>
            <p className="line-clamp-2 text-sm text-[#4d5156]">{descripcionGoogle}</p>
          </div>

          <Campo id="seoTitulo" label="Título en Google" opcional errores={errores.seoTitulo} ayuda={`${seoTitulo.length}/70`}>
            <input
              id="seoTitulo"
              name="seoTitulo"
              value={seoTitulo}
              onChange={(e) => setSeoTitulo(e.target.value)}
              maxLength={70}
              placeholder={`${nombre || "FuelTech FT450"} en Temuco · Venta e instalación`}
              className={claseInput}
            />
          </Campo>
          <Campo id="seoDescripcion" label="Descripción en Google" opcional errores={errores.seoDescripcion} ayuda={`${seoDescripcion.length}/160`}>
            <textarea
              id="seoDescripcion"
              name="seoDescripcion"
              rows={3}
              value={seoDescripcion}
              onChange={(e) => setSeoDescripcion(e.target.value)}
              maxLength={160}
              placeholder="Venta de FuelTech FT450 en Temuco con instalación y mapa a medida. Despacho a todo Chile."
              className={cn(claseInput, "h-auto py-3")}
            />
          </Campo>
          <Campo
            id="palabrasClave"
            label="Cómo te buscan"
            opcional
            errores={errores.palabrasClave}
            ayuda="Una por línea (máx. 10). Se usan en el texto de la ficha y en las fotos, por ejemplo «FuelTech FT450 Chile»."
          >
            <textarea
              id="palabrasClave"
              name="palabrasClave"
              rows={3}
              defaultValue={(valores.palabrasClave ?? []).join("\n")}
              placeholder={"FuelTech FT450 Chile\ncomprar FuelTech Temuco"}
              className={cn(claseInput, "h-auto py-3")}
            />
          </Campo>
        </div>
      </details>

      {/* Barra fija de guardar, con margen para la barra de gestos del celular */}
      <div className="border-hairline bg-ink/90 sticky bottom-0 z-20 -mx-4 flex items-center gap-3 border-t px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-xl">
        <Link
          href="/admin/productos"
          className="border-hairline inline-flex h-13 items-center justify-center rounded-2xl border px-5 text-sm font-semibold text-white"
        >
          Cancelar
        </Link>
        <BotonGuardar nuevo={nuevo} conFotos={nuevas.length > 0} />
      </div>
    </form>
  );
}

function BotonGuardar({ nuevo, conFotos }: { nuevo: boolean; conFotos: boolean }) {
  const { pending } = useFormStatus();
  // Subir y procesar varias fotos toma unos segundos: sin estado de carga,
  // se vuelve a apretar y se duplica el producto.
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-brand hover:bg-brand-light inline-flex h-13 flex-1 items-center justify-center gap-2 rounded-2xl px-6 text-base font-bold text-white transition-colors disabled:opacity-70"
    >
      {pending ? (
        <>
          <Loader2 className="size-5 animate-spin" /> {conFotos ? "Subiendo fotos…" : "Guardando…"}
        </>
      ) : nuevo ? (
        "Publicar producto"
      ) : (
        "Guardar cambios"
      )}
    </button>
  );
}

function Seccion({
  icono,
  titulo,
  ayuda,
  extra,
  children,
}: {
  icono: React.ReactNode;
  titulo: string;
  ayuda?: string;
  extra?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-graphite border-hairline rounded-3xl border p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="bg-brand/15 text-brand-bright grid size-10 shrink-0 place-items-center rounded-xl">{icono}</span>
        <div className="min-w-0 flex-1">
          <h2 className="font-display flex items-center justify-between gap-2 text-lg font-bold text-white uppercase">
            {titulo}
            {extra && <span className="text-suave font-sans text-xs font-medium normal-case">{extra}</span>}
          </h2>
          {ayuda && <p className="text-suave text-sm">{ayuda}</p>}
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Campo({
  id,
  label,
  ayuda,
  opcional,
  errores,
  children,
}: {
  id: string;
  label: string;
  ayuda?: string;
  opcional?: boolean;
  errores?: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-suave block text-xs font-medium">
        {label} {opcional && <span className="text-white/30">(opcional)</span>}
      </label>
      {children}
      {ayuda && <p className="text-suave text-xs">{ayuda}</p>}
      {errores?.map((e) => (
        <p key={e} role="alert" className="text-xs text-red-300">
          {e}
        </p>
      ))}
    </div>
  );
}

/** Casilla con aspecto de interruptor de celular (sigue siendo un checkbox nativo). */
function Interruptor({ name, label, detalle, defecto }: { name: string; label: string; detalle: string; defecto: boolean }) {
  return (
    <label className="bg-ink border-hairline has-[:checked]:border-brand/50 flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-4 transition-colors">
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="text-suave block text-xs">{detalle}</span>
      </span>
      <input type="checkbox" name={name} defaultChecked={defecto} className="peer sr-only" />
      <span className="peer-checked:bg-brand relative h-7 w-12 shrink-0 rounded-full bg-white/15 transition-colors after:absolute after:top-1 after:left-1 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-white" />
    </label>
  );
}

function Etiqueta({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={cn("absolute top-2 left-2 rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white", className)}>
      {children}
    </span>
  );
}

function BotonFoto({
  onClick,
  etiqueta,
  deshabilitado,
  className,
  children,
}: {
  onClick: () => void;
  etiqueta: string;
  deshabilitado?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={deshabilitado}
      aria-label={etiqueta}
      title={etiqueta}
      className={cn(
        "hover:bg-brand grid size-9 place-items-center rounded-full bg-black/70 text-white backdrop-blur transition-colors disabled:opacity-30",
        className,
      )}
    >
      {children}
    </button>
  );
}
