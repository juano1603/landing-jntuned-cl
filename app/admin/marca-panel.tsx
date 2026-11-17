import Image from "next/image";

/** Logo JNTUNED (gris claro sobre transparente: luce bien en el fondo oscuro del panel). */
export function MarcaPanel({ grande = false }: { grande?: boolean }) {
  return (
    <Image
      src="/logo-jntuned.png"
      alt="JNTUNED"
      width={grande ? 260 : 120}
      height={grande ? 50 : 23}
      priority
      className={grande ? "h-10 w-auto" : "h-5 w-auto"}
    />
  );
}
