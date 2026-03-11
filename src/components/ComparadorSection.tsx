"use client"

import { Check, X, Wifi, Tv, Star, Package } from "lucide-react"
import AnimatedSection from "./AnimatedSection"
import { WHATSAPP_NUMBER } from "@/lib/constants"

type TipoPaquete = "CABLE_ESTANDAR" | "CABLE_FULL_HD" | "INTERNET" | "DUO"

type PaqueteComparador = {
  id: string
  nombre: string
  tipo: TipoPaquete
  precio: number
  velocidad: string | null
  caracteristicas: string[]
  oferta: { precioOferta: number; descuento: number } | null
}

const tipoConfig: Record<TipoPaquete, { label: string; icon: React.ElementType; color: string; headerBg: string }> = {
  CABLE_ESTANDAR: { label: "Cable Estándar", icon: Tv, color: "text-blue-600", headerBg: "bg-blue-50" },
  CABLE_FULL_HD: { label: "Cable Full HD", icon: Star, color: "text-purple-600", headerBg: "bg-purple-50" },
  INTERNET: { label: "Internet", icon: Wifi, color: "text-green-600", headerBg: "bg-green-50" },
  DUO: { label: "Dúo", icon: Package, color: "text-orange-600", headerBg: "bg-orange-50" },
}

/* Fixed feature rows shown in comparison */
const FEATURE_ROWS = [
  "Instalación gratuita",
  "Router WiFi incluido",
  "Soporte técnico 24/7",
  "Sin permanencia",
  "Television HD",
  "Internet incluido",
]

function hasFeature(paquete: PaqueteComparador, feature: string): boolean {
  const combined = [
    ...paquete.caracteristicas,
    paquete.tipo === "DUO" || paquete.tipo === "INTERNET" ? "internet incluido" : "",
  ].join(" ").toLowerCase()
  const featureNorm = feature.toLowerCase()
    .replace(/é/g, "e").replace(/á/g, "a").replace(/ó/g, "o").replace(/ú/g, "u").replace(/í/g, "i")
  return combined.includes(featureNorm)
    || (feature === "Television HD" && (paquete.tipo === "CABLE_FULL_HD" || paquete.tipo === "DUO"))
    || (feature === "Internet incluido" && (paquete.tipo === "INTERNET" || paquete.tipo === "DUO"))
    || feature === "Instalación gratuita"
}

export default function ComparadorSection({ paquetes }: { paquetes: PaqueteComparador[] }) {
  if (paquetes.length < 2) return null

  const shown = paquetes.slice(0, 4)

  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-slate-800 md:text-4xl">
              Compara nuestros <span className="text-blue-700">Paquetes</span>
            </h2>
            <p className="mt-3 text-lg text-slate-500">
              Encuentra el plan que mejor se adapta a lo que necesitas
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 w-40">
                    Características
                  </th>
                  {shown.map((p) => {
                    const config = tipoConfig[p.tipo]
                    const Icon = config.icon
                    return (
                      <th key={p.id} className={`px-6 py-5 text-center ${config.headerBg}`}>
                        <div className="flex flex-col items-center gap-2">
                          <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm`}>
                            <Icon className={`h-5 w-5 ${config.color}`} />
                          </div>
                          <span className={`text-sm font-bold ${config.color}`}>{config.label}</span>
                          <span className="text-xs font-medium text-slate-600">{p.nombre}</span>
                          {p.oferta ? (
                            <div className="text-center">
                              <span className="text-xs text-slate-400 line-through">S/ {p.precio.toFixed(2)}</span>
                              <div className={`text-lg font-extrabold text-orange-500`}>S/ {p.oferta.precioOferta.toFixed(2)}</div>
                              <span className="text-xs text-slate-500">/mes</span>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className={`text-lg font-extrabold ${config.color}`}>S/ {p.precio.toFixed(2)}</div>
                              <span className="text-xs text-slate-500">/mes</span>
                            </div>
                          )}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Velocidad row */}
                <tr className="border-b border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-700">Velocidad</td>
                  {shown.map((p) => (
                    <td key={p.id} className="px-6 py-4 text-center">
                      {p.velocidad ? (
                        <span className="font-semibold text-green-600">{p.velocidad}</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Feature rows */}
                {FEATURE_ROWS.map((feature, i) => (
                  <tr key={feature} className={`border-b border-slate-100 ${i % 2 === 0 ? "" : "bg-slate-50/50"}`}>
                    <td className="px-6 py-4 font-medium text-slate-700">{feature}</td>
                    {shown.map((p) => {
                      const has = hasFeature(p, feature)
                      return (
                        <td key={p.id} className="px-6 py-4 text-center">
                          {has ? (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-green-100 mx-auto">
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 mx-auto">
                              <X className="h-3.5 w-3.5 text-slate-400" />
                            </span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {/* CTA row */}
                <tr>
                  <td className="px-6 py-5" />
                  {shown.map((p) => {
                    const config = tipoConfig[p.tipo]
                    return (
                      <td key={p.id} className="px-6 py-5 text-center">
                        <a
                          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hola, estoy interesado en el paquete *${p.nombre}* a *S/ ${(p.oferta ? p.oferta.precioOferta : p.precio).toFixed(2)}/mes*. ¿Me pueden dar más información?`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block rounded-full bg-green-600 px-5 py-2 text-xs font-bold text-white hover:bg-green-700 transition-colors">
                          Contratar
                        </a>
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
