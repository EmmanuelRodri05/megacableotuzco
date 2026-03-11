"use client"

import Link from "next/link"
import { CheckCircle, Home, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { fadeInUp, scaleIn, staggerContainer, mountProps } from "@/lib/animations"

export default function GraciasContent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">

      {/* Anillos de celebración (verde) */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-green-500/20"
            initial={{ width: 80, height: 80, opacity: 0.6 }}
            animate={{ width: [80, 600], height: [80, 600], opacity: [0.5, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, delay: i * 1.1, ease: "easeOut" }}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-green-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <motion.div
        className="relative w-full max-w-md text-center"
        variants={staggerContainer}
        {...mountProps}
      >
        {/* Ícono con rebote */}
        <motion.div
          variants={scaleIn}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-900/40 ring-2 ring-green-500/30"
        >
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
          >
            <CheckCircle className="h-10 w-10 text-green-400" />
          </motion.div>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="text-3xl font-extrabold text-white">
          ¡Mensaje recibido!
        </motion.h1>

        <motion.p variants={fadeInUp} className="mt-3 text-slate-400 text-lg">
          Gracias por contactarnos. Un asesor se comunicará contigo a la brevedad.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="mt-4 rounded-2xl border border-slate-700 bg-slate-800/60 p-5 text-sm text-slate-400"
        >
          <p>Tiempo de respuesta estimado: <span className="font-semibold text-white">menos de 24 horas</span></p>
          <p className="mt-1">Revisa tu bandeja de entrada o espera nuestra llamada.</p>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white hover:bg-red-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              Volver al inicio
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/#contacto"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-600 px-6 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <MessageSquare className="h-4 w-4" />
              Enviar otro mensaje
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}
