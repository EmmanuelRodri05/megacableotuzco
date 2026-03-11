"use client"

import { Tag, Clock, Zap, CalendarDays } from "lucide-react"
import { motion } from "framer-motion"

type Oferta = {
  id: string
  descuento: number
  precioOferta: number
  descripcion: string
  fechaFin: string | null
  velocidadPromo: string | null
  duracionMeses: number | null
  paquete: {
    nombre: string
    tipo: string
    precio: number
    velocidad: string | null
  }
}

export default function OfertasSection({ ofertas }: { ofertas: Oferta[] }) {
  if (ofertas.length === 0) return null

  return (
    <section id="ofertas" className="bg-gradient-to-br from-slate-900 to-blue-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Encabezado con entrada */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-orange-500/20 px-4 py-2 text-orange-300">
            <Tag className="h-4 w-4" />
            <span className="text-sm font-semibold">Ofertas por tiempo limitado</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white md:text-4xl">
            Ofertas <span className="text-orange-400">Especiales</span>
          </h2>
          <p className="mt-3 text-blue-200">
            Aprovecha nuestros descuentos exclusivos antes de que terminen
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ofertas.map((oferta, i) => (
            <motion.div
              key={oferta.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.1 }}
              whileHover={{
                y: -8,
                boxShadow: "0 24px 48px rgba(249,115,22,0.2)",
                transition: { duration: 0.25 },
              }}
              className="card-hover relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 p-6 backdrop-blur-sm"
            >
              {/* Badge de descuento con pulso */}
              <motion.div
                className="absolute right-0 top-0 rounded-bl-2xl bg-orange-500 px-4 py-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-lg font-extrabold text-white">-{oferta.descuento}%</span>
              </motion.div>

              <h3 className="mt-4 text-xl font-bold text-white">{oferta.paquete.nombre}</h3>
              <p className="mt-2 text-sm text-blue-200">{oferta.descripcion}</p>

              <div className="my-5">
                <span className="text-slate-400 line-through">S/ {oferta.paquete.precio.toFixed(2)}/mes</span>
                <div className="text-3xl font-extrabold text-orange-400">
                  S/ {oferta.precioOferta.toFixed(2)}
                  <span className="text-sm font-normal text-slate-400"> /mes</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {oferta.duracionMeses && (
                  <div className="flex items-center gap-2 text-sm text-cyan-300">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span>
                      Precio promocional por{" "}
                      <span className="font-bold">{oferta.duracionMeses} mes{oferta.duracionMeses > 1 ? "es" : ""}</span>
                    </span>
                  </div>
                )}

                {oferta.velocidadPromo && (
                  <div className="flex items-center gap-2 text-sm text-green-300">
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <Zap className="h-4 w-4 shrink-0" />
                    </motion.div>
                    <span>
                      {oferta.paquete.velocidad && (
                        <span className="text-slate-400 line-through mr-1">{oferta.paquete.velocidad}</span>
                      )}
                      <span className="font-bold">{oferta.velocidadPromo}</span>
                      {" "}durante la promo
                    </span>
                  </div>
                )}

                {oferta.fechaFin && (
                  <div className="flex items-center gap-2 text-sm text-blue-300">
                    <Clock className="h-4 w-4 shrink-0" />
                    <span>
                      Hasta: {new Date(oferta.fechaFin).toLocaleDateString("es-PE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>

              <motion.a
                href="#contacto"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="mt-5 block w-full rounded-full bg-orange-500 py-2.5 text-center text-sm font-bold text-white hover:bg-orange-600 transition-colors"
              >
                Aprovechar oferta
              </motion.a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
