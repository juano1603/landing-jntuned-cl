"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Aparición al entrar en pantalla. Envuelve contenido de Server Components
 * sin convertirlos en componentes de cliente.
 */
export function Revelar({
  children,
  className,
  retraso = 0,
  desde = "abajo",
}: {
  children: React.ReactNode;
  className?: string;
  retraso?: number;
  desde?: "abajo" | "izquierda" | "derecha";
}) {
  const reducir = useReducedMotion();
  const inicial = desde === "izquierda" ? { x: -20 } : desde === "derecha" ? { x: 20 } : { y: 16 };

  return (
    <motion.div
      className={className}
      initial={reducir ? false : { opacity: 0, ...inicial }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: retraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
