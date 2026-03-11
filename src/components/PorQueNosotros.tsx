"use client"

import { motion } from "framer-motion"
import { Icon } from "@iconify/react"
import { fadeInUp, scaleIn, staggerContainer, inViewProps } from "@/lib/animations"

const RAZONES = [
  {
    icon: "ph:lightning-fill",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    title: "Conexión estable 24/7",
    desc: "Infraestructura robusta que garantiza conectividad continua sin cortes inesperados.",
  },
  {
    icon: "ph:headset-fill",
    color: "text-green-400",
    bg: "bg-green-400/10",
    title: "Soporte técnico local",
    desc: "Nuestro equipo está en Otuzco. Atención rápida y personalizada cuando más lo necesitas.",
  },
  {
    icon: "ph:currency-dollar-fill",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    title: "Precios accesibles",
    desc: "Planes desde precios competitivos adaptados a las necesidades de cada familia.",
  },
  {
    icon: "ph:television-simple-fill",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    title: "Cable Full HD",
    desc: "Disfruta de cientos de canales en alta definición con la mejor calidad de imagen.",
  },
  {
    icon: "ph:map-pin-fill",
    color: "text-red-400",
    bg: "bg-red-400/10",
    title: "Cobertura en toda la ciudad",
    desc: "Llegamos a todos los barrios y sectores de Otuzco con señal de calidad.",
  },
  {
    icon: "ph:shield-check-fill",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    title: "Empresa de confianza",
    desc: "Años brindando servicio a las familias otuzcanas con transparencia y compromiso.",
  },
]

export default function PorQueNosotros() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="mx-auto max-w-7xl">

        {/* Encabezado */}
        <motion.div className="mb-14 text-center" variants={fadeInUp} {...inViewProps}>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-cyan-500/15 px-4 py-2 text-cyan-300">
            <Icon icon="ph:star-four-fill" className="h-4 w-4" />
            <span className="text-sm font-semibold">¿Por qué elegirnos?</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            El mejor servicio de <span className="text-cyan-400">Otuzco</span>
          </h2>
          <p className="mt-3 text-slate-400 max-w-xl mx-auto">
            Somos una empresa local comprometida con conectar a las familias otuzcanas con la mejor tecnología.
          </p>
        </motion.div>

        {/* Grid de razones */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainer}
          {...inViewProps}
        >
          {RAZONES.map((item) => (
            <motion.div
              key={item.title}
              variants={scaleIn}
              whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
              transition={{ duration: 0.2 }}
              className="flex gap-4 rounded-2xl border border-white/8 bg-white/5 p-6 backdrop-blur-sm"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.bg}`}>
                <Icon icon={item.icon} className={`h-6 w-6 ${item.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-white">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA central */}
        <motion.div className="mt-14 text-center" variants={fadeInUp} {...inViewProps}>
          <motion.a
            href="#paquetes"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-500 px-8 py-3.5 text-base font-bold text-white hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-900/30"
          >
            <Icon icon="ph:arrow-right-bold" className="h-5 w-5" />
            Ver nuestros paquetes
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
