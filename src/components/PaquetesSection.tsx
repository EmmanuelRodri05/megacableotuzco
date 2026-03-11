"use client"

import { useState, useMemo } from "react"
import { Check } from "lucide-react"
import { Icon } from "@iconify/react"
import AnimatedSection from "./AnimatedSection"
import { motion, AnimatePresence } from "framer-motion"
import { WHATSAPP_NUMBER } from "@/lib/constants"

function waLink(paquete: Paquete): string {
  const precio = paquete.oferta ? paquete.oferta.precioOferta : paquete.precio
  const velocidadMostrada = paquete.oferta?.velocidadPromo || paquete.velocidad
  let msg = `Hola, estoy interesado en el paquete *${paquete.nombre}*`
  if (velocidadMostrada) msg += ` (${velocidadMostrada})`
  msg += ` a *S/ ${precio.toFixed(2)}/mes*`
  if (paquete.oferta) msg += ` con ${paquete.oferta.descuento}% de descuento`
  msg += `. ¿Me pueden dar más información para contratarlo?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

type TipoPaquete = "CABLE_ESTANDAR" | "CABLE_FULL_HD" | "INTERNET" | "DUO"
type Paquete = {
  id: string; nombre: string; tipo: TipoPaquete; descripcion: string
  precio: number; velocidad: string | null; caracteristicas: string[]
  oferta: { descuento: number; precioOferta: number; descripcion: string; velocidadPromo: string | null } | null
}

const tipoConfig: Record<TipoPaquete, {
  label: string; icon: string; accent: string
  iconBg: string; iconColor: string; badgeBg: string; badgeText: string
}> = {
  INTERNET:       { label: "Internet",             icon: "ph:wifi-high-fill",    accent: "border-t-green-500",  iconBg: "bg-green-100",  iconColor: "#16a34a", badgeBg: "bg-green-100",  badgeText: "text-green-700"  },
  CABLE_ESTANDAR: { label: "Cable Estándar",        icon: "ph:television-fill",   accent: "border-t-blue-500",   iconBg: "bg-blue-100",   iconColor: "#1d4ed8", badgeBg: "bg-blue-100",   badgeText: "text-blue-700"   },
  CABLE_FULL_HD:  { label: "Cable Full HD",         icon: "ph:monitor-play-fill", accent: "border-t-purple-500", iconBg: "bg-purple-100", iconColor: "#7c3aed", badgeBg: "bg-purple-100", badgeText: "text-purple-700" },
  DUO:            { label: "Dúo Internet + Cable",  icon: "ph:broadcast-fill",    accent: "border-t-orange-500", iconBg: "bg-orange-100", iconColor: "#ea580c", badgeBg: "bg-orange-100", badgeText: "text-orange-700" },
}

export default function PaquetesSection({ paquetes }: { paquetes: Paquete[] }) {
  const [filtro, setFiltro] = useState<TipoPaquete | "TODOS">("TODOS")
  const filtrados = filtro === "TODOS" ? paquetes : paquetes.filter((p) => p.tipo === filtro)

  const conteo = useMemo(() => ({
    TODOS:          paquetes.length,
    INTERNET:       paquetes.filter((p) => p.tipo === "INTERNET").length,
    CABLE_ESTANDAR: paquetes.filter((p) => p.tipo === "CABLE_ESTANDAR").length,
    CABLE_FULL_HD:  paquetes.filter((p) => p.tipo === "CABLE_FULL_HD").length,
    DUO:            paquetes.filter((p) => p.tipo === "DUO").length,
  }), [paquetes])

  const tabLabels = [
    { value: "TODOS" as const,          label: "Todos",          icon: "ph:squares-four-fill"   },
    { value: "CABLE_ESTANDAR" as const, label: "Cable Estándar", icon: "ph:television-fill"     },
    { value: "CABLE_FULL_HD" as const,  label: "Cable Full HD",  icon: "ph:monitor-play-fill"   },
    { value: "INTERNET" as const,       label: "Internet",       icon: "ph:wifi-high-fill"      },
    { value: "DUO" as const,            label: "Dúo",            icon: "ph:broadcast-fill"      },
  ]

  return (
    <section id="paquetes" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-slate-800 md:text-4xl">
              Nuestros <span className="text-blue-700">Paquetes</span>
            </h2>
            <p className="mt-3 text-lg text-slate-500">Elige el paquete perfecto para ti y tu familia</p>
          </div>
        </AnimatedSection>

        {/* Tabs con conteo */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {tabLabels.map((tab) => {
            const isActive = filtro === tab.value
            const count = conteo[tab.value]
            if (tab.value !== "TODOS" && count === 0) return null
            return (
              <motion.button
                key={tab.value}
                onClick={() => setFiltro(tab.value)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isActive ? "bg-blue-700 text-white shadow-md shadow-blue-200" : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
                }`}
              >
                <Icon icon={tab.icon} className="h-4 w-4" />
                {tab.label}
                <span className={`rounded-full px-1.5 text-xs font-bold ${isActive ? "bg-white/25 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {count}
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Grid con AnimatePresence — key = filtro para re-animar al cambiar */}
        <AnimatePresence mode="wait">
          {filtrados.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 text-center">
              <Icon icon="ph:package-fill" className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <p className="text-slate-500">No hay paquetes disponibles en esta categoría.</p>
              <button onClick={() => setFiltro("TODOS")} className="mt-3 text-sm text-blue-600 hover:underline">Ver todos los paquetes</button>
            </motion.div>
          ) : (
            <motion.div
              key={filtro}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {filtrados.map((paquete, i) => {
                const cfg = tipoConfig[paquete.tipo]
                const tieneOferta = paquete.oferta !== null
                const esInternet  = paquete.tipo === "INTERNET" || paquete.tipo === "DUO"
                const delay       = Math.min(i, 4) * 0.08

                if (tieneOferta) return (
                  <motion.div
                    key={paquete.id}
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.38, ease: "easeOut", delay }}
                    whileHover={{ y: -8, boxShadow: "0 28px 56px rgba(0,0,0,0.35)" }}
                    className="relative flex flex-col rounded-2xl bg-gradient-to-b from-slate-800 to-slate-900 border border-slate-700 p-6 shadow-xl overflow-hidden"
                  >
                    <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-10" style={{ background: cfg.iconColor }} />
                    <div className="absolute top-0 left-0 right-0 flex items-center justify-center bg-gradient-to-r from-orange-500 to-orange-400 py-1.5">
                      <Icon icon="ph:star-fill" className="h-3.5 w-3.5 text-white mr-1.5" />
                      <span className="text-xs font-bold text-white uppercase tracking-widest">Plan Recomendado · -{paquete.oferta?.descuento}%</span>
                    </div>
                    <div className="mt-7 flex flex-col items-center text-center">
                      <motion.div className="mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10" whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Icon icon={cfg.icon} width={44} height={44} style={{ color: cfg.iconColor }} />
                      </motion.div>
                      <span className={`mb-2 rounded-full px-3 py-0.5 text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}>{cfg.label}</span>
                      <h3 className="text-xl font-bold text-white">{paquete.nombre}</h3>
                      <p className="mt-1 text-sm text-slate-300">{paquete.descripcion}</p>
                      {paquete.velocidad && esInternet && (
                        <div className="mt-3 flex flex-col items-center gap-1">
                          {paquete.oferta?.velocidadPromo ? (
                            <>
                              {/* Velocidad base tachada */}
                              <div className="flex items-center gap-1.5 text-slate-400">
                                <Icon icon="ph:wifi-high-fill" className="h-4 w-4" />
                                <span className="text-lg font-semibold line-through">{paquete.velocidad}</span>
                              </div>
                              {/* Velocidad promocional destacada */}
                              <div className="flex items-center gap-2">
                                <Icon icon="ph:lightning-fill" className="h-5 w-5 text-orange-400" />
                                <span className="text-3xl font-extrabold text-white leading-none">{paquete.oferta.velocidadPromo}</span>
                              </div>
                              <span className="text-xs font-semibold text-orange-300 uppercase tracking-wide">¡Velocidad aumentada!</span>
                            </>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Icon icon="ph:wifi-high-fill" className="h-5 w-5 text-green-400" />
                              <span className="text-3xl font-extrabold text-white leading-none">{paquete.velocidad}</span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="mt-4">
                        <span className="text-sm text-slate-400 line-through">S/ {paquete.precio.toFixed(2)}/mes</span>
                        <div className="text-4xl font-extrabold text-orange-400 leading-tight">
                          S/ {paquete.oferta?.precioOferta.toFixed(2)}<span className="text-base font-normal text-slate-400"> /mes</span>
                        </div>
                        <p className="mt-1 text-xs text-orange-300">{paquete.oferta?.descripcion}</p>
                      </div>
                    </div>
                    <div className="my-5 border-t border-slate-700" />
                    <ul className="flex flex-col gap-2 flex-1">
                      {paquete.caracteristicas.map((c, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-300">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />{c}
                        </li>
                      ))}
                    </ul>
                    <motion.a href={waLink(paquete)} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="mt-6 flex items-center justify-center gap-2 rounded-full bg-green-500 py-3 text-sm font-bold text-white hover:bg-green-600 transition-colors">
                      <Icon icon="ph:whatsapp-logo-fill" className="h-4 w-4" />Contratar por WhatsApp
                    </motion.a>
                  </motion.div>
                )

                return (
                  <motion.div
                    key={paquete.id}
                    initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.38, ease: "easeOut", delay }}
                    whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(0,0,0,0.10)" }}
                    className={`relative flex flex-col rounded-2xl bg-white border-t-4 ${cfg.accent} border border-slate-100 p-6 shadow-sm`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <motion.div className={`mb-4 flex h-20 w-20 items-center justify-center rounded-2xl ${cfg.iconBg}`} whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Icon icon={cfg.icon} width={44} height={44} style={{ color: cfg.iconColor }} />
                      </motion.div>
                      <span className={`mb-2 rounded-full px-3 py-0.5 text-xs font-semibold ${cfg.badgeBg} ${cfg.badgeText}`}>{cfg.label}</span>
                      <h3 className="text-xl font-bold text-slate-800">{paquete.nombre}</h3>
                      <p className="mt-1 text-sm text-slate-500">{paquete.descripcion}</p>
                      {paquete.velocidad && esInternet && (
                        <div className="mt-3 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2">
                          <Icon icon="ph:wifi-high-fill" className="h-5 w-5 text-green-600" />
                          <span className="text-2xl font-extrabold text-green-700">{paquete.velocidad}</span>
                        </div>
                      )}
                      <div className="mt-4">
                        <div className="text-4xl font-extrabold text-slate-800 leading-tight">
                          S/ {paquete.precio.toFixed(2)}<span className="text-base font-normal text-slate-400"> /mes</span>
                        </div>
                      </div>
                    </div>
                    <div className="my-5 border-t border-slate-100" />
                    <ul className="flex flex-col gap-2 flex-1">
                      {paquete.caracteristicas.map((c, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-slate-600">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{c}
                        </li>
                      ))}
                    </ul>
                    <motion.a href={waLink(paquete)} target="_blank" rel="noopener noreferrer" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      className="mt-6 flex items-center justify-center gap-2 rounded-full bg-green-600 py-3 text-sm font-bold text-white hover:bg-green-700 transition-colors">
                      <Icon icon="ph:whatsapp-logo-fill" className="h-4 w-4" />Contratar por WhatsApp
                    </motion.a>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA fallback */}
        <AnimatedSection>
          <div className="mt-12 text-center">
            <p className="text-slate-500 text-sm">
              ¿No encuentras lo que buscas?{" "}
              <a href="#contacto" className="font-semibold text-blue-700 hover:underline">Escríbenos y te asesoramos</a>
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
