import type { Variants } from "framer-motion"

/** Elemento entra desde abajo con fade — uso general */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.48, ease: "easeOut" } },
}

/** Elemento entra desde la izquierda */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.48, ease: "easeOut" } },
}

/** Elemento entra desde la derecha */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.48, ease: "easeOut" } },
}

/** Scale + fade — para modales, tarjetas destacadas */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.93 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.42, ease: "easeOut" } },
}

/** Contenedor que escalonea sus hijos (público — 0.1s entre items) */
export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

/** Contenedor admin — más rápido y sutil (0.07s entre items) */
export const staggerContainerFast: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

/** Props comunes para viewport de whileInView */
export const inViewProps = {
  initial: "hidden" as const,
  whileInView: "visible" as const,
  viewport: { once: true, margin: "-50px" },
}

/** Props de entrada inmediata (no whileInView — para páginas completas como login) */
export const mountProps = {
  initial: "hidden" as const,
  animate: "visible" as const,
}
