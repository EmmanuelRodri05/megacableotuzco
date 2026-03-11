"use client"

import Image from "next/image"
import { Wifi, Tv, ArrowDown, Headphones, MapPin } from "lucide-react"
import { motion, type Variants, type Transition } from "framer-motion"

const FLOATING_DOTS = [
  { left: "8%",  top: "30%", delay: 0 },
  { left: "18%", top: "65%", delay: 0.6 },
  { left: "30%", top: "20%", delay: 1.1 },
  { left: "55%", top: "75%", delay: 0.3 },
  { left: "70%", top: "15%", delay: 0.9 },
  { left: "80%", top: "55%", delay: 0.5 },
  { left: "88%", top: "35%", delay: 1.4 },
  { left: "92%", top: "70%", delay: 0.2 },
]

const itemTransition: Transition = { duration: 0.55, ease: "easeOut" }
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: itemTransition },
}

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.13 } },
}

export default function Hero() {
  return (
    <section className="gradient-hero relative overflow-hidden pt-32 pb-16 md:pt-40 md:pb-24">

      {/* === Anillos de señal WiFi pulsando === */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-cyan-400/25"
            initial={{ width: 80, height: 80, opacity: 0.7 }}
            animate={{ width: [80, 700], height: [80, 700], opacity: [0.5, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, delay: i * 1.1, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* === Partículas flotantes (paquetes de datos) === */}
      <div className="pointer-events-none absolute inset-0">
        {FLOATING_DOTS.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-cyan-400/50"
            style={{ left: dot.left, top: dot.top }}
            animate={{ y: [-8, -28, -8], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2.8 + i * 0.25, repeat: Infinity, delay: dot.delay, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* === Blobs decorativos === */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-cyan-400 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:gap-16">

          {/* Logo con entrada desde la izquierda */}
          <motion.div
            className="flex flex-col items-center gap-4 lg:items-start"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Image
                src="/megacable.png"
                alt="MEGACABLE Logo"
                width={420}
                height={200}
                className="w-full max-w-xs md:max-w-sm lg:max-w-md drop-shadow-2xl"
                priority
              />
            </motion.div>
            <div className="text-center lg:text-left">
              <p className="text-lg font-medium text-cyan-300 tracking-widest uppercase">
                Otuzco &mdash; Capital de la Fe
              </p>
            </div>
          </motion.div>

          {/* Contenido con stagger */}
          <motion.div
            className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white"
            >
              <motion.span
                className="h-2 w-2 rounded-full bg-green-400"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              Conectando hogares en toda la ciudad
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-3xl font-extrabold leading-tight text-white md:text-4xl lg:text-5xl"
            >
              El mejor internet y cable{" "}
              <span className="text-cyan-400">para tu hogar</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-xl text-lg text-blue-100"
            >
              Disfruta de internet de alta velocidad y cientos de canales en HD.
              Conectividad sin interrupciones para toda la familia.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col gap-4 sm:flex-row"
            >
              <motion.a
                href="#paquetes"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full bg-white px-8 py-3.5 text-base font-bold text-blue-900 shadow-lg hover:bg-cyan-50 transition-colors"
              >
                Ver paquetes
              </motion.a>
              <motion.a
                href="#contacto"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border-2 border-cyan-400 px-8 py-3.5 text-base font-bold text-cyan-300 hover:bg-cyan-400/20 transition-colors"
              >
                Contratar ahora
              </motion.a>
            </motion.div>

            {/* Stats con entrada stagger */}
            <motion.div
              variants={itemVariants}
              className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4"
            >
              {[
                { icon: Wifi,       label: "Alta velocidad", value: "Hasta 1 Gbps"   },
                { icon: Tv,         label: "Canales HD",     value: "+80 canales"    },
                { icon: Headphones, label: "Soporte",         value: "24/7"           },
                { icon: MapPin,     label: "Cobertura",       value: "Toda la ciudad" },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.18)" }}
                  className="flex flex-col items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-white cursor-default"
                >
                  <item.icon className="h-6 w-6 text-cyan-400" />
                  <span className="text-lg font-bold">{item.value}</span>
                  <span className="text-xs text-blue-200">{item.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

        </div>
      </div>

      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/60"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="h-6 w-6" />
      </motion.div>
    </section>
  )
}
