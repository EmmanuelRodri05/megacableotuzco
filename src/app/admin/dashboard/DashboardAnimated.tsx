"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Package, Tag, MessageSquare, TrendingUp } from "lucide-react"
import { fadeInUp, staggerContainerFast, mountProps } from "@/lib/animations"

type Stat = {
  label: string
  value: number
  color: string
  href: string
  iconName: "Package" | "Tag" | "MessageSquare" | "TrendingUp"
}

type Mensaje = {
  id: string
  nombre: string
  email: string
  telefono: string | null
  servicioInteres: string | null
  mensaje: string
  leido: boolean
  createdAt: string
}

const ICONS = { Package, Tag, MessageSquare, TrendingUp }

/* Contador animado de 0 → value */
function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true
    const duration = 900
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value])

  return <span>{display}</span>
}

export default function DashboardAnimated({ stats, mensajesRecientes }: { stats: Stat[]; mensajesRecientes: Mensaje[] }) {
  return (
    <>
      {/* Stats cards con stagger + contador */}
      <motion.div
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={staggerContainerFast}
        {...mountProps}
      >
        {stats.map((stat) => {
          const Icon = ICONS[stat.iconName]
          return (
            <motion.div key={stat.label} variants={fadeInUp}>
              <motion.div
                whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(0,0,0,0.3)" }}
                transition={{ duration: 0.2 }}
              >
                <Link
                  href={stat.href}
                  className="flex items-center gap-4 rounded-2xl bg-slate-800 p-5 border border-slate-700 hover:border-slate-600 transition-colors"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">
                      <AnimatedCounter value={stat.value} />
                    </p>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Mensajes recientes con stagger */}
      <motion.div
        className="mt-6 rounded-2xl bg-slate-800 p-6 border border-slate-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut", delay: 0.35 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Mensajes recientes</h2>
          <Link href="/admin/mensajes" className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline">
            Ver todos
          </Link>
        </div>

        {mensajesRecientes.length === 0 ? (
          <p className="text-slate-500 text-sm">No hay mensajes aun</p>
        ) : (
          <motion.div
            className="flex flex-col gap-3"
            variants={staggerContainerFast}
            initial="hidden"
            animate="visible"
          >
            {mensajesRecientes.map((m) => (
              <motion.div
                key={m.id}
                variants={fadeInUp}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.18 }}
                className="flex items-start justify-between gap-4 rounded-xl border border-slate-700 bg-slate-700/30 p-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-white text-sm">{m.nombre}</p>
                    {!m.leido && (
                      <span className="rounded-full bg-red-900/50 px-2 py-0.5 text-xs font-medium text-red-400">
                        Nuevo
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{m.email}</p>
                  <p className="mt-1 text-sm text-slate-300 truncate">{m.mensaje}</p>
                </div>
                <p className="text-xs text-slate-500 shrink-0">
                  {new Date(m.createdAt).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </>
  )
}
