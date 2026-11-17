"use client";

import { useEffect } from "react";

/** Registra el service worker del panel (lo que lo hace instalable como app). */
export function RegistrarServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator) || process.env.NODE_ENV !== "production") return;
    navigator.serviceWorker.register("/admin-sw.js", { scope: "/admin/" }).catch(() => {});
  }, []);
  return null;
}
