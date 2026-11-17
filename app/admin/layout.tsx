import type { Metadata, Viewport } from "next";
import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";

import { auth, signOut } from "@/auth";
import { BarraInferior } from "@/app/admin/barra-inferior";
import { MarcaPanel } from "@/app/admin/marca-panel";
import { RegistrarServiceWorker } from "@/app/admin/registrar-sw";

export const metadata: Metadata = {
  title: "Panel",
  // El panel nunca se indexa; robots.txt además lo bloquea.
  robots: { index: false, follow: false },
  // App instalable: el manifest solo se enlaza desde el panel, así el sitio
  // público no ofrece "instalar" a los clientes.
  manifest: "/admin-app/manifest.webmanifest",
  appleWebApp: { capable: true, title: "JNTUNED Panel", statusBarStyle: "black-translucent" },
  icons: { apple: "/admin-app/apple-touch-logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#07090d",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const sesion = await auth();

  return (
    <div className="bg-ink min-h-dvh">
      <RegistrarServiceWorker />

      {sesion?.user && (
        <header className="border-hairline bg-ink/85 sticky top-0 z-30 border-b pt-[env(safe-area-inset-top)] backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4">
            <Link href="/admin/productos" className="flex items-center gap-3">
              <MarcaPanel />
              <span className="bg-brand/15 text-brand-bright rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase">
                Panel
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/"
                target="_blank"
                className="text-suave hidden h-10 items-center gap-2 rounded-full px-4 text-sm transition-colors hover:bg-white/5 hover:text-white md:inline-flex"
              >
                <ExternalLink className="size-4" /> Ver el sitio
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/admin/login" });
                }}
              >
                <button
                  type="submit"
                  className="text-suave inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm transition-colors hover:bg-white/5 hover:text-white"
                >
                  <LogOut className="size-4" /> <span className="hidden sm:inline">Salir</span>
                </button>
              </form>
            </div>
          </div>
        </header>
      )}

      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-32 sm:pt-10 md:pb-16">{children}</main>

      {sesion?.user && <BarraInferior />}
    </div>
  );
}
