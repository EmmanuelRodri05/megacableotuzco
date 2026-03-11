"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { fadeInUp, staggerContainer, inViewProps } from "@/lib/animations"

const PASOS = [
  {
    num: "01",
    icon: "ph:magnifying-glass-fill",
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
    title: "Elige tu paquete",
    desc: "Revisa nuestros planes de internet, cable y dúo. Filtra por tipo y elige el que mejor se adapte a tu hogar y presupuesto.",
  },
  {
    num: "02",
    icon: "ph:whatsapp-logo-fill",
    color: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-200",
    title: "Contáctanos por WhatsApp",
    desc: "Escríbenos directamente con el botón de tu paquete favorito. Te responderemos de inmediato para coordinar la instalación.",
  },
  {
    num: "03",
    icon: "ph:wrench-fill",
    color: "text-orange-600",
    bg: "bg-orange-100",
    border: "border-orange-200",
    title: "Instalación en tu hogar",
    desc: "Nuestro equipo técnico local visita tu casa y deja todo listo. ¡En pocas horas estarás disfrutando de tu nuevo servicio!",
  },
]

export default function ComoContratar() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-5xl">

        <motion.div className="mb-14 text-center" variants={fadeInUp} {...inViewProps}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-blue-700">
            <Icon icon="ph:list-numbers-fill" className="h-4 w-4" />
            <span className="text-sm font-semibold">Proceso simple</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 md:text-4xl">
            ¿Cómo <span className="text-blue-700">contratar?</span>
          </h2>
          <p className="mt-3 text-slate-500 max-w-lg mx-auto">
            En 3 pasos sencillos tienes internet y cable funcionando en tu hogar.
          </p>
        </motion.div>

        {/* Pasos */}
        <motion.div
          className="relative flex flex-col gap-8 md:flex-row md:gap-0"
          variants={staggerContainer}
          {...inViewProps}
        >
          {/* Línea conectora (solo desktop) */}
          <div className="absolute top-8 left-0 right-0 hidden h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-orange-200 md:block" style={{ top: "2.5rem" }} />

          {PASOS.map((paso, i) => (
            <motion.div
              key={paso.num}
              variants={fadeInUp}
              custom={i}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.2 }}
              className="relative flex flex-1 flex-col items-center text-center px-6"
            >
              {/* Número + ícono */}
              <div className="relative mb-5">
                <motion.div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 ${paso.border} ${paso.bg} shadow-sm`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon icon={paso.icon} className={`h-8 w-8 ${paso.color}`} />
                </motion.div>
                {/* Badge número */}
                <span className={`absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full ${paso.bg} border ${paso.border} text-xs font-bold ${paso.color}`}>
                  {paso.num}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-800">{paso.title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xs">{paso.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div className="mt-14 text-center" variants={fadeInUp} {...inViewProps}>
          <motion.a
            href="#paquetes"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-blue-700 px-8 py-3.5 text-base font-bold text-white hover:bg-blue-800 transition-colors shadow-lg shadow-blue-200"
          >
            <Icon icon="ph:rocket-launch-fill" className="h-5 w-5" />
            Empezar ahora
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
