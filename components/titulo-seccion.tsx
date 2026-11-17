/** Antetítulo + título grande de cada sección, con un hueco a la derecha para un enlace. */
export function TituloSeccion({
  id,
  antetitulo,
  titulo,
  children,
  as: Etiqueta = "h2",
}: {
  id: string;
  antetitulo: string;
  titulo: string;
  children?: React.ReactNode;
  as?: "h1" | "h2";
}) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 sm:mb-14">
      <div>
        <p className="eyebrow mb-2">{antetitulo}</p>
        <Etiqueta id={id} className="section-title">
          {titulo}
        </Etiqueta>
      </div>
      {children}
    </div>
  );
}
