"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  fadeInUp, fadeInLeft, fadeInRight,
  staggerContainer, inViewProps, mountProps,
} from "@/lib/animations"

const WHATSAPP_NUMBER = "51930854814"
const PHONE_NUMBER = "+51 930 854 814"
const WHATSAPP_MSG = encodeURIComponent("Hola, me comunico de MEGACABLE Otuzco. Quisiera recibir información sobre los paquetes y planes disponibles. ¿Me pueden ayudar?")

const SERVICIOS = [
  { value: "", label: "Selecciona un servicio (opcional)" },
  { value: "INTERNET", label: "Internet" },
  { value: "CABLE_ESTANDAR", label: "Cable Estándar" },
  { value: "CABLE_FULL_HD", label: "Cable Full HD" },
  { value: "DUO", label: "Dúo (Internet + Cable Full HD)" },
  { value: "INFO", label: "Solo información" },
]

const schema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresa un email valido"),
  telefono: z.string().optional(),
  servicioInteres: z.string().optional(),
  mensaje: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

type FormData = z.infer<typeof schema>

const INFO_CARDS = [
  {
    bg: "bg-blue-100",
    iconColor: "text-blue-700",
    icon: Phone,
    title: "Teléfono",
    content: (
      <a href={`tel:${"+51930854814"}`} className="text-blue-600 hover:underline">{PHONE_NUMBER}</a>
    ),
  },
  {
    bg: "bg-green-100",
    iconColor: "text-green-600",
    icon: null, // WhatsApp SVG
    title: "WhatsApp",
    content: (
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-600 hover:underline"
      >
        Escríbenos por WhatsApp
      </a>
    ),
  },
  {
    bg: "bg-orange-100",
    iconColor: "text-orange-600",
    icon: MapPin,
    title: "Horario de atención",
    content: (
      <>
        <p className="text-slate-500 text-sm">Lunes a Sábado: 8:00 am - 1:00 pm</p>
        <p className="text-slate-500 text-sm">Lunes a Sábado: 3:00 pm - 7:00 pm</p>
      </>
    ),
  },
  {
    bg: "bg-blue-100",
    iconColor: "text-blue-700",
    icon: Mail,
    title: "Email",
    content: (
      <a href="mailto:contacto@megacable.pe" className="text-blue-600 hover:underline text-sm">
        contacto@megacable.pe
      </a>
    ),
  },
]

export default function ContactoSection() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        router.push("/gracias")
      } else {
        alert("Error al enviar el mensaje. Intentalo de nuevo.")
      }
    } catch {
      alert("Error de conexion. Intentalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">

        {/* Encabezado */}
        <motion.div
          className="mb-12 text-center"
          variants={fadeInUp}
          {...inViewProps}
        >
          <h2 className="text-3xl font-extrabold text-slate-800 md:text-4xl">
            <span className="text-blue-700">Contáctanos</span>
          </h2>
          <p className="mt-3 text-lg text-slate-500">
            Estamos listos para ayudarte a elegir el mejor paquete
          </p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Columna izquierda — info cards con stagger */}
          <motion.div
            className="flex flex-col gap-6"
            variants={staggerContainer}
            {...inViewProps}
          >
            <motion.h3 variants={fadeInLeft} className="text-xl font-bold text-slate-800">
              Información de contacto
            </motion.h3>

            {/* Teléfono */}
            <motion.div
              variants={fadeInLeft}
              whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(59,130,246,0.12)" }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Phone className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">Teléfono</p>
                <a href={`tel:${PHONE_NUMBER}`} className="text-blue-600 hover:underline">{PHONE_NUMBER}</a>
              </div>
            </motion.div>

            {/* WhatsApp */}
            <motion.div
              variants={fadeInLeft}
              whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(34,197,94,0.12)" }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100">
                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-700">WhatsApp</p>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                  Escríbenos por WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Horario */}
            <motion.div
              variants={fadeInLeft}
              whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(249,115,22,0.12)" }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <MapPin className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">Horario de atención</p>
                <p className="text-slate-500 text-sm">Lunes a Sábado: 8:00 am - 1:00 pm</p>
                <p className="text-slate-500 text-sm">Lunes a Sábado: 3:00 pm - 7:00 pm</p>
              </div>
            </motion.div>

            {/* Email */}
            <motion.div
              variants={fadeInLeft}
              whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(59,130,246,0.12)" }}
              transition={{ duration: 0.2 }}
              className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">Email</p>
                <a href="mailto:contacto@megacable.pe" className="text-blue-600 hover:underline text-sm">contacto@megacable.pe</a>
              </div>
            </motion.div>
          </motion.div>

          {/* Columna derecha — formulario entra desde la derecha */}
          <motion.div
            className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            variants={fadeInRight}
            {...inViewProps}
          >
            <h3 className="mb-6 text-xl font-bold text-slate-800">Envíanos un mensaje</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.1 }}>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nombre completo *</label>
                <input {...register("nombre")} placeholder="Tu nombre"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-shadow" />
                {errors.nombre && <p className="mt-1 text-xs text-red-500">{errors.nombre.message}</p>}
              </motion.div>

              <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.17 }}>
                <label className="mb-1 block text-sm font-medium text-slate-700">Email *</label>
                <input {...register("email")} type="email" placeholder="tu@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-shadow" />
                {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
              </motion.div>

              <motion.div
                variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.24 }}
                className="grid grid-cols-2 gap-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
                  <input {...register("telefono")} placeholder="+51 999 999 999"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-shadow" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Servicio de interés</label>
                  <select {...register("servicioInteres")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-shadow">
                    {SERVICIOS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.31 }}>
                <label className="mb-1 block text-sm font-medium text-slate-700">Mensaje *</label>
                <textarea {...register("mensaje")} rows={4}
                  placeholder="¿En qué paquete estás interesado? ¿Tienes alguna pregunta?"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-shadow" />
                {errors.mensaje && <p className="mt-1 text-xs text-red-500">{errors.mensaje.message}</p>}
              </motion.div>

              <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.38 }}>
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60 transition-colors"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {loading ? "Enviando..." : "Enviar mensaje"}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
