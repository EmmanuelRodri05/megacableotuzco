"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Loader2, X, Check, ToggleLeft, ToggleRight, Zap, CalendarDays, Pencil, Clock } from "lucide-react"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp, staggerContainerFast } from "@/lib/animations"
import ConfirmDialog from "@/components/admin/ConfirmDialog"

type Paquete = { id: string; nombre: string; precio: number; tipo: string; velocidad: string | null }
type Oferta = {
  id: string
  paqueteId: string
  descuento: number
  precioOferta: number
  descripcion: string
  fechaFin: string | null
  velocidadPromo: string | null
  duracionMeses: number | null
  activo: boolean
  paquete: { nombre: string; precio: number; tipo: string; velocidad: string | null }
}

const emptyForm = {
  paqueteId: "",
  descuento: "",
  precioOferta: "",
  descripcion: "",
  fechaFin: "",
  velocidadPromo: "",
  duracion: "",
  duracionTipo: "meses" as "dias" | "meses",
}

type DialogState = {
  title: string
  message: string
  variant: "danger" | "warning"
  onConfirm: () => void
}

/** Calcula fecha de vencimiento sumando días o meses desde hoy (hora Perú) */
function calcularFechaFin(valor: string, tipo: "dias" | "meses"): string {
  const n = parseInt(valor)
  if (!valor || isNaN(n) || n <= 0) return ""
  const todayStr = new Date().toLocaleDateString("en-CA", { timeZone: "America/Lima" })
  const [y, m, d] = todayStr.split("-").map(Number)
  const fecha = new Date(Date.UTC(y, m - 1, d))
  if (tipo === "dias") {
    fecha.setUTCDate(fecha.getUTCDate() + n)
  } else {
    fecha.setUTCMonth(fecha.getUTCMonth() + n)
  }
  return fecha.toISOString().split("T")[0]
}

export default function OfertasAdminPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [paquetes, setPaquetes] = useState<Paquete[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [dialog, setDialog] = useState<DialogState | null>(null)

  const fetchData = async () => {
    try {
      const [oRes, pRes] = await Promise.all([fetch("/api/ofertas"), fetch("/api/paquetes")])
      if (!oRes.ok || !pRes.ok) throw new Error()
      const [oData, pData] = await Promise.all([oRes.json(), pRes.json()])
      setOfertas(oData)
      setPaquetes(pData)
    } catch {
      toast.error("Error al cargar datos")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const handlePaqueteChange = (paqueteId: string) => {
    const paquete = paquetes.find((p) => p.id === paqueteId)
    if (!paquete) return
    const nuevoPrecio = form.descuento
      ? (paquete.precio * (1 - Number(form.descuento) / 100)).toFixed(2)
      : ""
    setForm({ ...form, paqueteId, precioOferta: nuevoPrecio, velocidadPromo: "" })
  }

  const handleDescuentoChange = (descuento: string) => {
    const paquete = paquetes.find((p) => p.id === form.paqueteId)
    const nuevoPrecio = paquete && descuento
      ? (paquete.precio * (1 - Number(descuento) / 100)).toFixed(2)
      : ""
    setForm({ ...form, descuento, precioOferta: nuevoPrecio })
  }

  const handleDuracionChange = (duracion: string) => {
    const fechaFin = calcularFechaFin(duracion, form.duracionTipo)
    setForm({ ...form, duracion, fechaFin })
  }

  const handleDuracionTipoChange = (duracionTipo: "dias" | "meses") => {
    const fechaFin = calcularFechaFin(form.duracion, duracionTipo)
    setForm({ ...form, duracionTipo, fechaFin })
  }

  const handleEdit = (o: Oferta) => {
    setEditingId(o.id)
    setForm({
      paqueteId: o.paqueteId,
      descuento: String(o.descuento),
      precioOferta: String(o.precioOferta),
      descripcion: o.descripcion,
      fechaFin: o.fechaFin ? o.fechaFin.split("T")[0] : "",
      velocidadPromo: o.velocidadPromo ?? "",
      duracion: o.duracionMeses ? String(o.duracionMeses) : "",
      duracionTipo: "meses",
    })
    setShowModal(true)
  }

  const handleClose = () => {
    setShowModal(false)
    setEditingId(null)
    setForm(emptyForm)
  }

  const selectedPaquete = paquetes.find((p) => p.id === form.paqueteId)
  const tieneVelocidad = selectedPaquete && (selectedPaquete.tipo === "INTERNET" || selectedPaquete.tipo === "DUO")

  const handleSave = async () => {
    if (!form.paqueteId || !form.descuento || !form.precioOferta || !form.descripcion) {
      toast.error("Completa todos los campos obligatorios")
      return
    }
    setSaving(true)
    const payload = {
      paqueteId: form.paqueteId,
      descuento: Number(form.descuento),
      precioOferta: Number(form.precioOferta),
      descripcion: form.descripcion,
      fechaFin: form.fechaFin || null,
      velocidadPromo: form.velocidadPromo || null,
      // Solo guardamos duracionMeses si la unidad es meses (para mostrar "por X meses" en la tarjeta)
      duracionMeses: (form.duracion && form.duracionTipo === "meses") ? Number(form.duracion) : null,
    }
    try {
      const res = editingId
        ? await fetch(`/api/ofertas/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })
        : await fetch("/api/ofertas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          })

      if (res.ok) {
        toast.success(editingId ? "Oferta actualizada" : "Oferta creada exitosamente")
        handleClose()
        fetchData()
      } else {
        const err = await res.json()
        toast.error(err.error || "Error al guardar oferta")
      }
    } catch {
      toast.error("Error de red. Intenta nuevamente.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: string) => {
    setDialog({
      title: "Eliminar oferta",
      message: "¿Estás seguro de que quieres eliminar esta oferta? Esta acción no se puede deshacer.",
      variant: "danger",
      onConfirm: async () => {
        setDialog(null)
        const res = await fetch(`/api/ofertas/${id}`, { method: "DELETE" })
        if (res.ok) {
          toast.success("Oferta eliminada")
          fetchData()
        } else {
          toast.error("Error al eliminar")
        }
      },
    })
  }

  const toggleActivo = async (id: string, activo: boolean) => {
    await fetch(`/api/ofertas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !activo }),
    })
    fetchData()
  }

  const paquetesSinOferta = paquetes.filter((p) => !ofertas.find((o) => o.paqueteId === p.id))
  const paquetesEnModal = editingId
    ? paquetes.filter((p) => p.id === form.paqueteId)
    : paquetesSinOferta

  const todayPeru = new Date().toLocaleDateString("en-CA", { timeZone: "America/Lima" })

  return (
    <div>
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Ofertas</h1>
          <p className="mt-1 text-slate-400">Gestiona descuentos y promociones en paquetes</p>
        </div>
        <button
          onClick={() => { setForm(emptyForm); setEditingId(null); setShowModal(true) }}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nueva oferta
        </button>
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      ) : ofertas.length === 0 ? (
        <motion.div
          className="mt-8 rounded-2xl bg-slate-800 p-12 text-center border border-slate-700"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <p className="text-slate-400">No hay ofertas creadas aún.</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-4 text-sm font-semibold text-cyan-400 hover:underline"
          >
            Crear primera oferta
          </button>
        </motion.div>
      ) : (
        <motion.div
          className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          variants={staggerContainerFast}
          initial="hidden"
          animate="visible"
        >
          {ofertas.map((o) => {
            const isExpired = o.fechaFin && o.fechaFin.split("T")[0] < todayPeru
            return (
              <motion.div
                key={o.id}
                variants={fadeInUp}
                className={`rounded-2xl border bg-slate-800 p-5 ${
                  o.activo ? "border-orange-500/30" : "border-slate-700 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-block rounded-full bg-orange-900/50 px-3 py-1 text-xs font-bold text-orange-400">
                        -{o.descuento}% DESCUENTO
                      </span>
                      {isExpired && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-900/50 px-2.5 py-1 text-xs font-bold text-red-400">
                          <Clock className="h-3 w-3" />
                          Vencida
                        </span>
                      )}
                      {!o.activo && !isExpired && (
                        <span className="inline-block rounded-full bg-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-400">
                          Inactiva
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-bold text-white">{o.paquete.nombre}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{o.descripcion}</p>
                  </div>
                  <button
                    onClick={() => toggleActivo(o.id, o.activo)}
                    className="text-slate-400 hover:text-slate-200 transition-colors ml-2 shrink-0"
                  >
                    {o.activo ? (
                      <ToggleRight className="h-6 w-6 text-orange-500" />
                    ) : (
                      <ToggleLeft className="h-6 w-6" />
                    )}
                  </button>
                </div>

                <div className="mt-3">
                  <span className="text-sm text-slate-400 line-through">S/ {o.paquete.precio.toFixed(2)}</span>
                  <span className="ml-2 text-xl font-bold text-orange-500">
                    S/ {o.precioOferta.toFixed(2)}/mes
                  </span>
                </div>

                {o.duracionMeses && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-cyan-400 font-medium">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Precio promocional por {o.duracionMeses} mes{o.duracionMeses > 1 ? "es" : ""}
                  </div>
                )}

                {o.velocidadPromo && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-green-400 font-medium">
                    <Zap className="h-3.5 w-3.5" />
                    Velocidad promo: {o.velocidadPromo}
                    {o.paquete.velocidad && (
                      <span className="text-slate-500 font-normal"> (base: {o.paquete.velocidad})</span>
                    )}
                  </div>
                )}

                {o.fechaFin && (
                  <p className={`mt-1 text-xs ${isExpired ? "text-red-400" : "text-slate-400"}`}>
                    Vence: {new Date(o.fechaFin).toLocaleDateString("es-PE", {
                      timeZone: "UTC", day: "numeric", month: "short", year: "numeric",
                    })}
                  </p>
                )}

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    onClick={() => handleEdit(o)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-900/30 transition-colors"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(o.id)}
                    className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-900/30 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Eliminar
                  </button>
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-full max-w-md rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-xl my-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">
                  {editingId ? "Editar oferta" : "Nueva oferta"}
                </h2>
                <button onClick={handleClose} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {/* Paquete */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Paquete *</label>
                  <select
                    value={form.paqueteId}
                    onChange={(e) => handlePaqueteChange(e.target.value)}
                    disabled={!!editingId}
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500 disabled:opacity-50"
                  >
                    <option value="">Selecciona un paquete</option>
                    {paquetesEnModal.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nombre} - S/ {p.precio.toFixed(2)}
                      </option>
                    ))}
                  </select>
                  {editingId && (
                    <p className="mt-1 text-xs text-slate-400">El paquete no se puede cambiar al editar.</p>
                  )}
                </div>

                {/* Descuento y precio */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">Descuento (%) *</label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={form.descuento}
                      onChange={(e) => handleDescuentoChange(e.target.value)}
                      className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      placeholder="Ej: 20"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">Precio con descuento *</label>
                    <input
                      type="number"
                      value={form.precioOferta}
                      onChange={(e) => setForm({ ...form, precioOferta: e.target.value })}
                      className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Duración con toggle días/meses */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Duración del precio promocional
                    <span className="ml-1 text-xs font-normal text-slate-500">(calcula la fecha de vencimiento)</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="1"
                      max={form.duracionTipo === "dias" ? "365" : "36"}
                      value={form.duracion}
                      onChange={(e) => handleDuracionChange(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-orange-500"
                      placeholder={form.duracionTipo === "dias" ? "Ej: 5" : "Ej: 3"}
                    />
                    <div className="flex overflow-hidden rounded-xl border border-slate-600">
                      <button
                        type="button"
                        onClick={() => handleDuracionTipoChange("dias")}
                        className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
                          form.duracionTipo === "dias"
                            ? "bg-orange-500 text-white"
                            : "bg-slate-700/50 text-slate-400 hover:text-white"
                        }`}
                      >
                        Días
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuracionTipoChange("meses")}
                        className={`px-4 py-2.5 text-sm font-semibold transition-colors ${
                          form.duracionTipo === "meses"
                            ? "bg-orange-500 text-white"
                            : "bg-slate-700/50 text-slate-400 hover:text-white"
                        }`}
                      >
                        Meses
                      </button>
                    </div>
                  </div>
                </div>

                {/* Fecha de vencimiento (auto o manual) */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Fecha de vencimiento
                    <span className="ml-1.5 text-xs font-normal text-slate-500">
                      {form.duracion
                        ? "— calculada automáticamente (puedes editarla)"
                        : "— opcional, ingresa manualmente"}
                    </span>
                  </label>
                  <input
                    type="date"
                    value={form.fechaFin}
                    onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                  />
                </div>

                {/* Velocidad promo (solo Internet/Dúo) */}
                {tieneVelocidad && (
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">
                      Velocidad promocional
                      {selectedPaquete?.velocidad && (
                        <span className="ml-1 text-xs text-slate-500 font-normal">
                          (velocidad base: {selectedPaquete.velocidad})
                        </span>
                      )}
                    </label>
                    <input
                      value={form.velocidadPromo}
                      onChange={(e) => setForm({ ...form, velocidadPromo: e.target.value })}
                      className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      placeholder="Ej: 300 Mbps"
                    />
                  </div>
                )}

                {/* Descripción */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Descripción de la oferta *</label>
                  <input
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    placeholder="Ej: Oferta de verano por tiempo limitado"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleClose}
                    className="flex-1 rounded-xl border border-slate-600 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60 transition-colors"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear oferta"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!dialog}
        title={dialog?.title}
        message={dialog?.message ?? ""}
        variant={dialog?.variant ?? "danger"}
        confirmLabel="Eliminar"
        onConfirm={dialog?.onConfirm ?? (() => {})}
        onCancel={() => setDialog(null)}
      />
    </div>
  )
}
