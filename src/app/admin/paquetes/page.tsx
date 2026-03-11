"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, X, Check, Wifi, Tv, Package, Star } from "lucide-react"
import toast from "react-hot-toast"

type TipoPaquete = "CABLE_ESTANDAR" | "CABLE_FULL_HD" | "INTERNET" | "DUO"

type Paquete = {
  id: string
  nombre: string
  tipo: TipoPaquete
  descripcion: string
  precio: number
  velocidad: string | null
  caracteristicas: string[]
  activo: boolean
  oferta: { id: string } | null
}

const tipoLabels: Record<TipoPaquete, string> = {
  CABLE_ESTANDAR: "Cable Estandar",
  CABLE_FULL_HD: "Cable Full HD",
  INTERNET: "Internet",
  DUO: "Duo (Internet + Cable Full HD)",
}

const tipoIcons: Record<TipoPaquete, React.ElementType> = {
  CABLE_ESTANDAR: Tv,
  CABLE_FULL_HD: Star,
  INTERNET: Wifi,
  DUO: Package,
}

const emptyForm = {
  nombre: "",
  tipo: "INTERNET" as TipoPaquete,
  descripcion: "",
  precio: "",
  velocidad: "",
  caracteristicas: "",
  activo: true,
}

export default function PaquetesAdminPage() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchPaquetes = async () => {
    const res = await fetch("/api/paquetes")
    const data = await res.json()
    setPaquetes(data)
    setLoading(false)
  }

  useEffect(() => { fetchPaquetes() }, [])

  const openCreate = () => {
    setEditId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (p: Paquete) => {
    setEditId(p.id)
    setForm({
      nombre: p.nombre,
      tipo: p.tipo,
      descripcion: p.descripcion,
      precio: String(p.precio),
      velocidad: p.velocidad || "",
      caracteristicas: p.caracteristicas.join("\n"),
      activo: p.activo,
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.nombre || !form.descripcion || !form.precio) {
      toast.error("Completa los campos obligatorios")
      return
    }
    setSaving(true)
    const payload = {
      nombre: form.nombre,
      tipo: form.tipo,
      descripcion: form.descripcion,
      precio: Number(form.precio),
      velocidad: form.velocidad || null,
      caracteristicas: form.caracteristicas.split("\n").filter((c) => c.trim()),
      activo: form.activo,
    }

    const url = editId ? `/api/paquetes/${editId}` : "/api/paquetes"
    const method = editId ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      toast.success(editId ? "Paquete actualizado" : "Paquete creado")
      setShowModal(false)
      fetchPaquetes()
    } else {
      toast.error("Error al guardar")
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este paquete?")) return
    const res = await fetch(`/api/paquetes/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Paquete eliminado")
      fetchPaquetes()
    } else {
      toast.error("Error al eliminar")
    }
  }

  const toggleActivo = async (p: Paquete) => {
    if (p.activo && p.oferta) {
      const ok = confirm(
        `⚠️ Este paquete tiene una oferta activa.\n\nDesactivarlo ocultará también la oferta del sitio público.\n\n¿Deseas continuar?`
      )
      if (!ok) return
    }
    await fetch(`/api/paquetes/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !p.activo }),
    })
    fetchPaquetes()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Paquetes</h1>
          <p className="mt-1 text-slate-400">Gestiona todos los paquetes de servicios</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nuevo paquete
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>
      ) : (
        <div className="mt-6 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 bg-slate-700/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-3">Paquete</th>
                <th className="px-6 py-3 hidden md:table-cell">Tipo</th>
                <th className="px-6 py-3">Precio</th>
                <th className="px-6 py-3 hidden sm:table-cell">Estado</th>
                <th className="px-6 py-3 hidden sm:table-cell">Oferta</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {paquetes.map((p) => {
                const Icon = tipoIcons[p.tipo]
                return (
                  <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900/50">
                          <Icon className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">{p.nombre}</p>
                          {p.velocidad && <p className="text-xs text-slate-400">{p.velocidad}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-slate-400">{tipoLabels[p.tipo]}</td>
                    <td className="px-6 py-4 font-semibold text-white">S/ {p.precio.toFixed(2)}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <button onClick={() => toggleActivo(p)}>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.activo ? "bg-green-900/40 text-green-400" : "bg-slate-700 text-slate-400"}`}>
                          {p.activo ? "Activo" : "Inactivo"}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {p.oferta ? (
                        <span className="rounded-full bg-orange-900/40 px-2.5 py-1 text-xs font-semibold text-orange-400">Con oferta</span>
                      ) : (
                        <span className="text-xs text-slate-500">Sin oferta</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-900/40 hover:text-blue-400 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(p.id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">{editId ? "Editar paquete" : "Nuevo paquete"}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Nombre *</label>
                <input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500" placeholder="Ej: Internet 100 Mbps" />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Tipo *</label>
                <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoPaquete })}
                  className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500">
                  {Object.entries(tipoLabels).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">Descripcion *</label>
                <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} rows={2}
                  className="w-full resize-none rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Precio (S/) *</label>
                  <input type="number" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500" placeholder="0.00" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Velocidad</label>
                  <input value={form.velocidad} onChange={(e) => setForm({ ...form, velocidad: e.target.value })}
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500" placeholder="Ej: 100 Mbps" />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-300">
                  Caracteristicas <span className="text-slate-500 font-normal">(una por linea)</span>
                </label>
                <textarea value={form.caracteristicas} onChange={(e) => setForm({ ...form, caracteristicas: e.target.value })} rows={4}
                  className="w-full resize-none rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  placeholder={"Router WiFi incluido\nSoporte tecnico 24/7\nInstalacion gratuita"} />
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" id="activo" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                  className="h-4 w-4 rounded" />
                <label htmlFor="activo" className="text-sm font-medium text-slate-300">Paquete activo (visible al publico)</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-slate-600 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors">
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  {saving ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
