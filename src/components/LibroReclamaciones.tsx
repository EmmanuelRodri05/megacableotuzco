"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, FileText, AlertTriangle, CheckCircle2 } from "lucide-react"
import { BUSINESS_NAME } from "@/lib/constants"

type FormState = {
  tipo: "RECLAMO" | "QUEJA"
  nombre: string
  dni: string
  email: string
  telefono: string
  descripcion: string
}

const INITIAL: FormState = {
  tipo: "RECLAMO",
  nombre: "",
  dni: "",
  email: "",
  telefono: "",
  descripcion: "",
}

export default function LibroReclamaciones() {
  const [open, setOpen]       = useState(false)
  const [form, setForm]       = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.descripcion) {
      setError("Por favor completa los campos obligatorios.")
      return
    }
    setLoading(true)
    try {
      const mensaje = `[${form.tipo}] DNI: ${form.dni || "—"} | Tel: ${form.telefono || "—"}\n\n${form.descripcion}`
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono || undefined,
          servicioInteres: `Libro de Reclamaciones - ${form.tipo}`,
          mensaje,
        }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      setForm(INITIAL)
    } catch {
      setError("Ocurrió un error al enviar. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTimeout(() => { setSuccess(false); setError("") }, 300)
  }

  return (
    <>
      {/* Botón disparador */}
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
      >
        <FileText className="h-4 w-4" />
        Libro de Reclamaciones
      </button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={handleClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="relative z-10 w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl overflow-y-auto max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/20">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Libro de Reclamaciones</h2>
                  <p className="text-xs text-slate-400">{BUSINESS_NAME} — Conforme al D.S. N° 011-2011-PCM</p>
                </div>
              </div>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center gap-4 py-8 text-center"
                >
                  <CheckCircle2 className="h-16 w-16 text-green-400" />
                  <div>
                    <p className="text-lg font-bold text-white">Reclamo registrado</p>
                    <p className="mt-1 text-sm text-slate-400">
                      Hemos recibido tu reclamo. Nos comunicaremos contigo en un plazo máximo de 30 días calendario.
                    </p>
                  </div>
                  <button
                    onClick={handleClose}
                    className="rounded-full bg-slate-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-600 transition-colors"
                  >
                    Cerrar
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Tipo */}
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold text-slate-300">Tipo de registro *</label>
                    <div className="flex gap-3">
                      {(["RECLAMO", "QUEJA"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm((p) => ({ ...p, tipo: t }))}
                          className={`flex-1 rounded-xl border py-2.5 text-sm font-semibold transition-colors ${
                            form.tipo === t
                              ? "border-red-500 bg-red-500/10 text-red-400"
                              : "border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-600"
                          }`}
                        >
                          {t === "RECLAMO" ? "Reclamo" : "Queja"}
                        </button>
                      ))}
                    </div>
                    <p className="mt-1.5 text-xs text-slate-500">
                      {form.tipo === "RECLAMO"
                        ? "Reclamo: disconformidad con el servicio o producto."
                        : "Queja: malestar con la atención o el personal."}
                    </p>
                  </div>

                  {/* Nombre + DNI */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">Nombre completo *</label>
                      <input
                        name="nombre" value={form.nombre} onChange={handleChange}
                        placeholder="Tu nombre"
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">DNI</label>
                      <input
                        name="dni" value={form.dni} onChange={handleChange}
                        placeholder="12345678" maxLength={8}
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Email + Teléfono */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">Email *</label>
                      <input
                        name="email" type="email" value={form.email} onChange={handleChange}
                        placeholder="correo@ejemplo.com"
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-300">Teléfono</label>
                      <input
                        name="telefono" value={form.telefono} onChange={handleChange}
                        placeholder="930 854 814"
                        className="w-full rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-300">Descripción del problema *</label>
                    <textarea
                      name="descripcion" value={form.descripcion} onChange={handleChange}
                      rows={4} placeholder="Describe detalladamente tu reclamo o queja..."
                      className="w-full resize-none rounded-xl bg-slate-800 border border-slate-700 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                    />
                  </div>

                  {error && (
                    <p className="rounded-lg bg-red-900/30 border border-red-800 px-3 py-2 text-xs text-red-400">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 rounded-full bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {loading ? (
                      <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />Enviando...</>
                    ) : (
                      "Registrar reclamo"
                    )}
                  </button>

                  <p className="text-center text-xs text-slate-500">
                    Tu {form.tipo.toLowerCase()} será atendido en un plazo máximo de 30 días calendario conforme a la normativa peruana.
                  </p>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
