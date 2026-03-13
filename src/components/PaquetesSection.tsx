"use client"

import { useState, useMemo } from "react"
import { Check, ChevronLeft, ChevronRight, Phone, ChevronDown } from "lucide-react"
import { Icon } from "@iconify/react"
import AnimatedSection from "./AnimatedSection"
import { motion, AnimatePresence } from "framer-motion"
import { WHATSAPP_NUMBER } from "@/lib/constants"

/* ─── helpers ─────────────────────────────────────────────────── */
function waLink(paquete: Paquete): string {
  const precio = paquete.oferta ? paquete.oferta.precioOferta : paquete.precio
  const vel    = paquete.oferta?.velocidadPromo || paquete.velocidad
  let msg = `Hola, quiero contratar *${paquete.nombre}*`
  if (vel) msg += ` (${vel})`
  msg += ` a *S/ ${precio.toFixed(2)}/mes*. ¿Me pueden ayudar?`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`
}

/* ─── types ────────────────────────────────────────────────────── */
type TipoPaquete = "CABLE_ESTANDAR" | "CABLE_FULL_HD" | "INTERNET" | "DUO"
type Paquete = {
  id: string; nombre: string; tipo: TipoPaquete; descripcion: string
  precio: number; velocidad: string | null; caracteristicas: string[]
  recomendado: boolean
  oferta: { descuento: number; precioOferta: number; descripcion: string; velocidadPromo: string | null } | null
}

const tipoConfig: Record<TipoPaquete, { label: string; icon: string; color: string; light: string; dark: string }> = {
  INTERNET:       { label: "Internet Fibra",      icon: "ph:wifi-high-fill",    color: "#16a34a", light: "bg-green-50  border-green-200",  dark: "bg-green-500"  },
  CABLE_ESTANDAR: { label: "Cable Estándar",       icon: "ph:television-fill",   color: "#1d4ed8", light: "bg-blue-50   border-blue-200",   dark: "bg-blue-600"   },
  CABLE_FULL_HD:  { label: "Cable Full HD",        icon: "ph:monitor-play-fill", color: "#7c3aed", light: "bg-purple-50 border-purple-200", dark: "bg-purple-600" },
  DUO:            { label: "Dúo Internet + Cable", icon: "ph:broadcast-fill",    color: "#ea580c", light: "bg-orange-50 border-orange-200", dark: "bg-orange-500" },
}

const TAB_ORDER = ["TODOS", "CABLE_ESTANDAR", "CABLE_FULL_HD", "INTERNET", "DUO"]

/* ─── card individual ──────────────────────────────────────────── */
function PaqueteCard({ paquete }: { paquete: Paquete }) {
  const [open, setOpen] = useState(false)
  const cfg        = tipoConfig[paquete.tipo]
  const esInternet = paquete.tipo === "INTERNET" || paquete.tipo === "DUO"
  const tieneOferta = !!paquete.oferta || paquete.recomendado

  return (
    <div className={`flex flex-col rounded-2xl overflow-hidden border shadow-sm hover:shadow-xl transition-shadow duration-300 ${tieneOferta ? "bg-slate-900 border-orange-400/50" : "bg-white border-slate-200"}`}>

      {/* Banner "Plan Recomendado" */}
      {tieneOferta && (
        <div className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 to-orange-400 py-2">
          <Icon icon="ph:star-fill" className="h-3.5 w-3.5 text-white" />
          <span className="text-xs font-extrabold text-white uppercase tracking-widest">
            {paquete.oferta ? `Plan Recomendado · -${paquete.oferta.descuento}%` : "⭐ Plan Recomendado"}
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-6">
        {/* Badge tipo */}
        <div className="mb-4 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${tieneOferta ? "bg-white/10 border-white/20 text-white" : cfg.light.split(" ")[0] + " " + cfg.light.split(" ")[1]}`}
            style={{ color: tieneOferta ? undefined : cfg.color }}
          >
            <Icon icon={cfg.icon} className="h-3.5 w-3.5" />
            {cfg.label}
          </span>
        </div>

        {/* Nombre + descripción */}
        <h3 className={`text-xl font-extrabold ${tieneOferta ? "text-white" : "text-slate-800"}`}>{paquete.nombre}</h3>
        <p className={`mt-1 text-sm leading-relaxed line-clamp-2 ${tieneOferta ? "text-slate-300" : "text-slate-500"}`}>{paquete.descripcion}</p>

        {/* Velocidad */}
        {paquete.velocidad && esInternet && (
          <div className="mt-4">
            {paquete.oferta?.velocidadPromo ? (
              <div className="flex flex-col gap-0.5">
                <div className={`flex items-center gap-1.5 text-sm line-through ${tieneOferta ? "text-slate-500" : "text-slate-400"}`}>
                  <Icon icon="ph:wifi-high-fill" className="h-4 w-4" />
                  <span className="font-semibold">{paquete.velocidad}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon icon="ph:lightning-fill" className="h-5 w-5 text-orange-400" />
                  <span className="text-3xl font-extrabold text-orange-400 leading-none">{paquete.oferta.velocidadPromo}</span>
                  <span className="text-xs font-semibold text-orange-300 uppercase">¡Aumentada!</span>
                </div>
              </div>
            ) : (
              <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 ${tieneOferta ? "bg-white/10" : "bg-green-50"}`}>
                <Icon icon="ph:wifi-high-fill" className="h-5 w-5" style={{ color: cfg.color }} />
                <span className="text-2xl font-extrabold" style={{ color: tieneOferta ? "#4ade80" : cfg.color }}>{paquete.velocidad}</span>
              </div>
            )}
          </div>
        )}

        {/* Precio */}
        <div className="mt-4">
          {paquete.oferta ? (
            <>
              <span className="text-sm text-slate-500 line-through">S/ {paquete.precio.toFixed(2)}/mes</span>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-orange-400 leading-none">S/ {paquete.oferta.precioOferta.toFixed(2)}</span>
                <span className="text-sm text-slate-400">/mes</span>
              </div>
              {paquete.oferta.descripcion && <p className="mt-1 text-xs text-orange-300">{paquete.oferta.descripcion}</p>}
            </>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className={`text-5xl font-extrabold leading-none ${tieneOferta ? "text-white" : "text-slate-800"}`}>S/ {paquete.precio.toFixed(2)}</span>
              <span className="text-sm text-slate-400">/mes</span>
            </div>
          )}
        </div>

        {/* Divisor */}
        <div className={`my-5 border-t ${tieneOferta ? "border-slate-700" : "border-slate-100"}`} />

        {/* Botones CTA */}
        <div className="flex gap-2.5">
          <a
            href={`tel:+${WHATSAPP_NUMBER}`}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-full border py-2.5 text-sm font-bold transition-colors ${
              tieneOferta
                ? "border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white"
                : "border-slate-200 text-slate-600 hover:border-slate-400 hover:text-slate-800"
            }`}
          >
            <Phone className="h-3.5 w-3.5" />
            Llamar
          </a>
          <a
            href={waLink(paquete)}
            target="_blank" rel="noopener noreferrer"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-green-500 py-2.5 text-sm font-bold text-white hover:bg-green-600 transition-colors"
          >
            <Icon icon="ph:whatsapp-logo-fill" className="h-4 w-4" />
            WhatsApp
          </a>
        </div>

        {/* Ver detalles desplegable */}
        <button
          onClick={() => setOpen(!open)}
          className={`mt-4 flex items-center justify-center gap-1.5 text-sm font-medium transition-colors ${
            tieneOferta ? "text-slate-400 hover:text-white" : "text-slate-400 hover:text-slate-700"
          }`}
        >
          Ver detalles
          <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="h-4 w-4" />
          </motion.span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.ul
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mt-3 flex flex-col gap-1.5"
            >
              {paquete.caracteristicas.map((c, j) => (
                <li key={j} className={`flex items-start gap-2 text-sm ${tieneOferta ? "text-slate-300" : "text-slate-600"}`}>
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />{c}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ─── carousel desktop (3 tarjetas visibles) ───────────────────── */
function DesktopCarousel({ paquetes }: { paquetes: Paquete[] }) {
  const [page, setPage]   = useState(0)
  const [dir,  setDir]    = useState(1)
  const PER_PAGE          = 3
  const totalPages        = Math.ceil(paquetes.length / PER_PAGE)
  const slice             = paquetes.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  // Reset page when package list changes (tab switch resets via key prop on parent)
  const goPage = (next: number, direction: number) => {
    setDir(direction)
    setPage(next)
  }

  if (paquetes.length === 0) return null

  // If 3 or fewer, just render the grid without carousel controls
  if (paquetes.length <= PER_PAGE) {
    return (
      <div className="grid gap-6 grid-cols-3">
        {paquetes.map((p) => <PaqueteCard key={p.id} paquete={p} />)}
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Prev arrow */}
      <button
        onClick={() => goPage(page - 1, -1)}
        disabled={page === 0}
        className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Cards */}
      <div className="overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            variants={{
              enter:  (d: number) => ({ x: d * 80, opacity: 0 }),
              center: { x: 0, opacity: 1, transition: { duration: 0.3 } },
              exit:   (d: number) => ({ x: -d * 80, opacity: 0, transition: { duration: 0.2 } }),
            }}
            initial="enter" animate="center" exit="exit"
            className="grid gap-6 grid-cols-3"
          >
            {slice.map((p) => <PaqueteCard key={p.id} paquete={p} />)}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Next arrow */}
      <button
        onClick={() => goPage(page + 1, 1)}
        disabled={page === totalPages - 1}
        className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots */}
      <div className="mt-6 flex justify-center gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            onClick={() => goPage(i, i > page ? 1 : -1)}
            className={`h-2 rounded-full transition-all duration-300 ${i === page ? "w-6 bg-blue-600" : "w-2 bg-slate-300"}`}
          />
        ))}
      </div>
    </div>
  )
}

/* ─── carousel móvil ───────────────────────────────────────────── */
function CarouselMobile({ paquetes }: { paquetes: Paquete[] }) {
  const [idx, setIdx]   = useState(0)
  const [dir, setDir]   = useState(1)
  const total           = paquetes.length

  const go = (next: number, direction: number) => {
    setDir(direction)
    setIdx((next + total) % total)
  }

  if (total === 0) return null

  return (
    <div className="relative">
      <div className="overflow-hidden px-1 pb-2">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={idx}
            custom={dir}
            variants={{ enter: (d: number) => ({ x: d * 80, opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d: number) => ({ x: -d * 80, opacity: 0 }) }}
            initial="enter" animate="center" exit="exit"
            transition={{ duration: 0.3 }}
          >
            <PaqueteCard paquete={paquetes[idx]} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Flechas */}
      {total > 1 && (
        <>
          <button onClick={() => go(idx - 1, -1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors z-10">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => go(idx + 1, 1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors z-10">
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dots */}
      {total > 1 && (
        <div className="mt-5 flex justify-center gap-1.5">
          {paquetes.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > idx ? 1 : -1)}
              className={`h-2 rounded-full transition-all duration-300 ${i === idx ? "w-6 bg-blue-600" : "w-2 bg-slate-300"}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── sección principal ────────────────────────────────────────── */
const slideVariants = {
  enter: (dir: number) => ({ x: dir * 60, opacity: 0 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  exit:  (dir: number) => ({ x: -dir * 60, opacity: 0, transition: { duration: 0.2 } }),
}

export default function PaquetesSection({ paquetes }: { paquetes: Paquete[] }) {
  const [filtro, setFiltro]       = useState<TipoPaquete | "TODOS">("TODOS")
  const [direction, setDirection] = useState(1)
  const filtrados = filtro === "TODOS" ? paquetes : paquetes.filter((p) => p.tipo === filtro)

  const handleTabChange = (newFiltro: TipoPaquete | "TODOS") => {
    const from = TAB_ORDER.indexOf(filtro)
    const to   = TAB_ORDER.indexOf(newFiltro)
    setDirection(to >= from ? 1 : -1)
    setFiltro(newFiltro)
  }

  const conteo = useMemo(() => ({
    TODOS:          paquetes.length,
    INTERNET:       paquetes.filter((p) => p.tipo === "INTERNET").length,
    CABLE_ESTANDAR: paquetes.filter((p) => p.tipo === "CABLE_ESTANDAR").length,
    CABLE_FULL_HD:  paquetes.filter((p) => p.tipo === "CABLE_FULL_HD").length,
    DUO:            paquetes.filter((p) => p.tipo === "DUO").length,
  }), [paquetes])

  const tabLabels = [
    { value: "TODOS"          as const, label: "Todos",          icon: "ph:squares-four-fill"   },
    { value: "INTERNET"       as const, label: "Internet",       icon: "ph:wifi-high-fill"      },
    { value: "CABLE_ESTANDAR" as const, label: "Cable Estándar", icon: "ph:television-fill"     },
    { value: "CABLE_FULL_HD"  as const, label: "Cable Full HD",  icon: "ph:monitor-play-fill"   },
    { value: "DUO"            as const, label: "Dúo",            icon: "ph:broadcast-fill"      },
  ]

  return (
    <section id="paquetes" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="mx-auto max-w-7xl">

        {/* Encabezado */}
        <AnimatedSection>
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700">
              Planes y Precios
            </span>
            <h2 className="text-3xl font-extrabold text-slate-800 md:text-4xl">
              Elige el paquete <span className="text-blue-700">perfecto para ti</span>
            </h2>
            <p className="mt-3 text-lg text-slate-500">Sin contratos largos. Instalación gratuita. Disponible en toda la ciudad.</p>
          </div>
        </AnimatedSection>

        {/* Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2">
          {tabLabels.map((tab) => {
            const isActive = filtro === tab.value
            const count    = conteo[tab.value]
            if (tab.value !== "TODOS" && count === 0) return null
            return (
              <motion.button
                key={tab.value}
                onClick={() => handleTabChange(tab.value)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-blue-700 text-white shadow-md shadow-blue-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
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

        {/* Contenido con AnimatePresence */}
        <AnimatePresence mode="wait" custom={direction}>
          {filtrados.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 text-center">
              <Icon icon="ph:package-fill" className="mx-auto mb-4 h-16 w-16 text-slate-300" />
              <p className="text-slate-500">No hay paquetes en esta categoría.</p>
              <button onClick={() => handleTabChange("TODOS")} className="mt-3 text-sm text-blue-600 hover:underline">Ver todos</button>
            </motion.div>
          ) : (
            <motion.div key={filtro} custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit">
              {/* Móvil: carousel */}
              <div className="lg:hidden px-4">
                <CarouselMobile paquetes={filtrados} />
              </div>
              {/* Desktop: carousel */}
              <div className="hidden lg:block px-6">
                <DesktopCarousel key={filtro} paquetes={filtrados} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
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
