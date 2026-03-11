"use client"

import { useEffect, useState } from "react"
import { Plus, Trash2, Loader2, X, Check, ToggleLeft, ToggleRight, Zap, CalendarDays, Pencil } from "lucide-react"
import toast from "react-hot-toast"

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
  duracionMeses: "",
}

export default function OfertasAdminPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([])
  const [paquetes, setPaquetes] = useState<Paquete[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchData = async () => {
    const [oRes, pRes] = await Promise.all([fetch("/api/ofertas"), fetch("/api/paquetes")])
    const [oData, pData] = await Promise.all([oRes.json(), pRes.json()])
    setOfertas(oData)
    setPaquetes(pData)
    setLoading(false)
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

  const handleEdit = (o: Oferta) => {
    setEditingId(o.id)
    setForm({
      paqueteId: o.paqueteId,
      descuento: String(o.descuento),
      precioOferta: String(o.precioOferta),
      descripcion: o.descripcion,
      fechaFin: o.fechaFin ? o.fechaFin.split("T")[0] : "",
      velocidadPromo: o.velocidadPromo ?? "",
      duracionMeses: o.duracionMeses ? String(o.duracionMeses) : "",
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
      duracionMeses: form.duracionMeses ? Number(form.duracionMeses) : null,
    }

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
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta oferta?")) return
    const res = await fetch(`/api/ofertas/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Oferta eliminada")
      fetchData()
    } else {
      toast.error("Error al eliminar")
    }
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

  return (
    <div>
      <div className="flex items-center justify-between">
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
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
      ) : ofertas.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-slate-800 p-12 text-center border border-slate-700">
          <p className="text-slate-400">No hay ofertas creadas aun.</p>
          <button onClick={() => setShowModal(true)} className="mt-4 text-sm font-semibold text-cyan-400 hover:underline">
            Crear primera oferta
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ofertas.map((o) => (
            <div key={o.id} className={`rounded-2xl border bg-slate-800 p-5 ${o.activo ? "border-orange-500/30" : "border-slate-700 opacity-60"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-block rounded-full bg-orange-900/50 px-3 py-1 text-xs font-bold text-orange-400">
                    -{o.descuento}% DESCUENTO
                  </span>
                  <h3 className="mt-2 font-bold text-white">{o.paquete.nombre}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{o.descripcion}</p>
                </div>
                <button onClick={() => toggleActivo(o.id, o.activo)} className="text-slate-400 hover:text-slate-600">
                  {o.activo ? <ToggleRight className="h-6 w-6 text-orange-500" /> : <ToggleLeft className="h-6 w-6" />}
                </button>
              </div>

              <div className="mt-3">
                <span className="text-sm text-slate-400 line-through">S/ {o.paquete.precio.toFixed(2)}</span>
                <span className="ml-2 text-xl font-bold text-orange-500">S/ {o.precioOferta.toFixed(2)}/mes</span>
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
                <p className="mt-1 text-xs text-slate-400">
                  Vence: {new Date(o.fechaFin).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              )}

              <div className="mt-4 flex justify-end gap-2">
                <button onClick={() => handleEdit(o)} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-blue-400 hover:bg-blue-900/30 transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                  Editar
                </button>
                <button onClick={() => handleDelete(o.id)} className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-900/30 transition-colors">
                  <Trash2 className="h-3.5 w-3.5" />
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8 overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-xl my-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Editar oferta" : "Nueva oferta"}
              </h2>
              <button onClick={handleClose} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
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
                    <option key={p.id} value={p.id}>{p.nombre} - S/ {p.precio.toFixed(2)}</option>
                  ))}
                </select>
                {editingId && (
                  <p className="mt-1 text-xs text-slate-400">El paquete no se puede cambiar al editar.</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Descuento (%) *</label>
                  <input type="number" min="1" max="99" value={form.descuento}
                    onChange={(e) => handleDescuentoChange(e.target.value)}
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500" placeholder="Ej: 20" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Precio con descuento *</label>
                  <input type="number" value={form.precioOferta}
                    onChange={(e) => setForm({ ...form, precioOferta: e.target.value })}
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500" placeholder="0.00" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Duracion del precio promocional (meses)</label>
                <input type="number" min="1" max="36" value={form.duracionMeses}
                  onChange={(e) => setForm({ ...form, duracionMeses: e.target.value })}
                  className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  placeholder="Ej: 6 (el cliente paga este precio por 6 meses)" />
              </div>

              {tieneVelocidad && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Velocidad promocional
                    {selectedPaquete?.velocidad && (
                      <span className="ml-1 text-xs text-slate-500 font-normal">(velocidad base: {selectedPaquete.velocidad})</span>
                    )}
                  </label>
                  <input value={form.velocidadPromo}
                    onChange={(e) => setForm({ ...form, velocidadPromo: e.target.value })}
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    placeholder="Ej: 300 Mbps" />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Descripcion de la oferta *</label>
                <input value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  placeholder="Ej: Oferta de verano por tiempo limitado" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Fecha de vencimiento (opcional)</label>
                <input type="date" value={form.fechaFin} onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
                  className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500" />
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={handleClose}
                  className="flex-1 rounded-xl border border-slate-600 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {saving ? "Guardando..." : editingId ? "Guardar cambios" : "Crear oferta"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
