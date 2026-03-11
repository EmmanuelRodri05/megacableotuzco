"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Clock, Mail, Phone, Send, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import toast from "react-hot-toast"
import { Icon } from "@iconify/react"
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer, inViewProps } from "@/lib/animations"
import { WHATSAPP_NUMBER, PHONE_DISPLAY, EMAIL, HOURS, SOCIAL } from "@/lib/constants"

const WHATSAPP_MSG = encodeURIComponent("Hola, me comunico de MEGACABLE Otuzco. Quisiera recibir información sobre los paquetes y planes disponibles. ¿Me pueden ayudar?")

const SERVICIOS = [
  { value: "", label: "Selecciona un servicio (opcional)" },
  { value: "INTERNET",       label: "Internet"                    },
  { value: "CABLE_ESTANDAR", label: "Cable Estándar"              },
  { value: "CABLE_FULL_HD",  label: "Cable Full HD"               },
  { value: "DUO",            label: "Dúo (Internet + Cable Full HD)" },
  { value: "INFO",           label: "Solo información"            },
]

const schema = z.object({
  nombre:         z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email:          z.string().email("Ingresa un email válido"),
  telefono:       z.string().optional(),
  servicioInteres: z.string().optional(),
  mensaje:        z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
})

type FormData = z.infer<typeof schema>

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
        toast.error("Error al enviar el mensaje. Inténtalo de nuevo.")
      }
    } catch {
      toast.error("Error de conexión. Inténtalo de nuevo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contacto" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="mx-auto max-w-7xl">

        {/* Encabezado */}
        <motion.div className="mb-12 text-center" variants={fadeInUp} {...inViewProps}>
          <h2 className="text-3xl font-extrabold text-slate-800 md:text-4xl">
            <span className="text-blue-700">Contáctanos</span>
          </h2>
          <p className="mt-3 text-lg text-slate-500">Estamos listos para ayudarte a elegir el mejor paquete</p>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-2">

          {/* Columna izquierda — info con stagger */}
          <motion.div className="flex flex-col gap-6" variants={staggerContainer} {...inViewProps}>
            <motion.h3 variants={fadeInLeft} className="text-xl font-bold text-slate-800">Información de contacto</motion.h3>

            {/* Teléfono */}
            <motion.div variants={fadeInLeft} whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(59,130,246,0.12)" }} transition={{ duration: 0.2 }}
              className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Phone className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">Teléfono</p>
                <a href={`tel:${PHONE_DISPLAY}`} className="text-blue-600 hover:underline">{PHONE_DISPLAY}</a>
              </div>
            </motion.div>

            {/* WhatsApp */}
            <motion.div variants={fadeInLeft} whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(34,197,94,0.12)" }} transition={{ duration: 0.2 }}
              className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-green-100">
                <Icon icon="ph:whatsapp-logo-fill" className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">WhatsApp</p>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline">
                  Escríbenos por WhatsApp
                </a>
              </div>
            </motion.div>

            {/* Horario */}
            <motion.div variants={fadeInLeft} whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(249,115,22,0.12)" }} transition={{ duration: 0.2 }}
              className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">Horario de atención</p>
                {HOURS.map((h) => <p key={h} className="text-slate-500 text-sm">{h}</p>)}
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={fadeInLeft} whileHover={{ x: 4, boxShadow: "0 4px 20px rgba(59,130,246,0.12)" }} transition={{ duration: 0.2 }}
              className="flex items-start gap-4 rounded-xl border border-slate-100 bg-slate-50 p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-5 w-5 text-blue-700" />
              </div>
              <div>
                <p className="font-semibold text-slate-700">Email</p>
                <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline text-sm">{EMAIL}</a>
              </div>
            </motion.div>

            {/* Redes sociales */}
            <motion.div variants={fadeInLeft} className="flex items-center gap-3 pt-2">
              <span className="text-sm font-medium text-slate-600">Síguenos:</span>
              <a href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-blue-600 hover:text-white transition-colors">
                <Icon icon="ph:facebook-logo-fill" className="h-5 w-5" />
              </a>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-pink-600 hover:text-white transition-colors">
                <Icon icon="ph:instagram-logo-fill" className="h-5 w-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* Columna derecha — formulario */}
          <motion.div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm" variants={fadeInRight} {...inViewProps}>
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

              <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.24 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Teléfono</label>
                  <input {...register("telefono")} type="tel" placeholder="+51 999 999 999"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-shadow" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Servicio de interés</label>
                  <select {...register("servicioInteres")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-shadow">
                    {SERVICIOS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </motion.div>

              <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.31 }}>
                <label className="mb-1 block text-sm font-medium text-slate-700">Mensaje *</label>
                <textarea {...register("mensaje")} rows={4} placeholder="¿En qué paquete estás interesado? ¿Tienes alguna pregunta?"
                  className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-shadow" />
                {errors.mensaje && <p className="mt-1 text-xs text-red-500">{errors.mensaje.message}</p>}
              </motion.div>

              {/* Aviso de privacidad */}
              <p className="text-xs text-slate-400">
                Al enviar este formulario aceptas que tus datos sean usados para atender tu consulta, conforme a la Ley 29733 de Protección de Datos Personales.
              </p>

              <motion.div variants={fadeInUp} initial="hidden" animate="visible" transition={{ delay: 0.38 }}>
                <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 py-3 text-sm font-bold text-white hover:bg-blue-800 disabled:opacity-60 transition-colors">
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
