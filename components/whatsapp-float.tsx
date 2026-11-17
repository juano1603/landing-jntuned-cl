import { IconoWhatsapp } from "@/components/iconos";
import { enlaceWhatsapp } from "@/lib/site";

export function WhatsappFloat() {
  return (
    <a
      href={enlaceWhatsapp()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir a JNTUNED por WhatsApp"
      className="fixed right-5 bottom-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <IconoWhatsapp className="size-7" />
    </a>
  );
}
