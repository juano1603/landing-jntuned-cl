import Image from "next/image";

import { enlaceWhatsapp, negocio } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="section-shell flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Image src="/logo-jntuned.png" alt="JNTUNED" width={120} height={23} className="h-5 w-auto opacity-70" />
          <address className="text-xs text-slate-500 not-italic">Temuco, Araucanía, Chile</address>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs tracking-wider text-slate-500 uppercase">
          <a href={negocio.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            Instagram
          </a>
          <a href={enlaceWhatsapp()} target="_blank" rel="noopener noreferrer" className="hover:text-white">
            WhatsApp
          </a>
          <a href="https://southdev.cl" target="_blank" rel="noopener" className="inline-flex items-center gap-1.5 hover:text-white">
            <svg viewBox="0 0 24 21" width="10" height="9" aria-hidden="true">
              <path d="M12 0 24 21H0z" fill="#6fa285" />
            </svg>
            Web por SurDev
          </a>
          <span>© {new Date().getFullYear()} JNTUNED</span>
        </div>
      </div>
    </footer>
  );
}
