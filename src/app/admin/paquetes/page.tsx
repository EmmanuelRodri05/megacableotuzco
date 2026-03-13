"use client"

import { useEffect, useState } from "react"
import { Plus, Pencil, Trash2, Loader2, X, Check, Wifi, Tv, Package, Star } from "lucide-react"
import toast from "react-hot-toast"
import { motion, AnimatePresence } from "framer-motion"
import { fadeInUp, staggerContainerFast } from "@/lib/animations"
import ConfirmDialog from "@/components/admin/ConfirmDialog"

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
  recomendado: boolean
  oferta: { id: string } | null
}

const tipoLabels: Record<TipoPaquete, string> = {
  CABLE_ESTANDAR: "Cable Estándar",
  CABLE_FULL_HD: "Cable Full HD",
  INTERNET: "Internet",
  DUO: "Dúo (Internet + Cable Full HD)",
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
  recomendado: false,
}

type DialogState = {
  title: string
  message: string
  variant: "danger" | "warning"
  onConfirm: () => void
}

export default function PaquetesAdminPage() {
  const [paquetes, setPaquetes] = useState<Paquete[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [dialog, setDialog] = useState<DialogState | null>(null)

  const fetchPaquetes = async () => {
    try {
      const res = await fetch("/api/paquetes")
      if (!res.ok) throw new Error()
      const data = await res.json()
      setPaquetes(data)
    } catch {
      toast.error("Error al cargar paquetes")
    } finally {
      setLoading(false)
    }
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
      recomendado: !!p.recomendado,
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
      recomendado: form.recomendado,
    }
    const url = editId ? `/api/paquetes/${editId}` : "/api/paquetes"
    const method = editId ? "PUT" : "POST"
    try {
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
    } catch {
      toast.error("Error de red. Intenta nuevamente.")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (id: string) => {
    setDialog({
      title: "Eliminar paquete",
      message: "¿Estás seguro de que quieres eliminar este paquete? Esta acción no se puede deshacer.",
      variant: "danger",
      onConfirm: async () => {
        setDialog(null)
        const res = await fetch(`/api/paquetes/${id}`, { method: "DELETE" })
        if (res.ok) {
          toast.success("Paquete eliminado")
          fetchPaquetes()
        } else {
          toast.error("Error al eliminar")
        }
      },
    })
  }

  const toggleActivo = (p: Paquete) => {
    if (p.activo && p.oferta) {
      setDialog({
        title: "Desactivar paquete",
        message: `Este paquete tiene una oferta activa.\n\nDesactivarlo ocultará también la oferta del sitio público.\n\n¿Deseas continuar?`,
        variant: "warning",
        onConfirm: async () => {
          setDialog(null)
          await fetch(`/api/paquetes/${p.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ activo: !p.activo }),
          })
          fetchPaquetes()
        },
      })
      return
    }
    fetch(`/api/paquetes/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activo: !p.activo }),
    }).then((res) => {
      if (res.ok) fetchPaquetes()
      else toast.error("Error al actualizar estado")
    })
  }

  const toggleRecomendado = async (p: Paquete) => {
    const res = await fetch(`/api/paquetes/${p.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recomendado: !p.recomendado }),
    })
    if (res.ok) { toast.success(p.recomendado ? 'Recomendación quitada' : 'Marcado como recomendado'); fetchPaquetes() }
    else toast.error('Error al actualizar')
  }

  return (
    <div>
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
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
      </motion.div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      ) : (
        <motion.div
          className="mt-6 rounded-2xl bg-slate-800 border border-slate-700 overflow-x-auto"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        >
          <table className="w-full text-sm">
            <thead className="border-b border-slate-700 bg-slate-700/50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-6 py-3">Paquete</th>
                <th className="px-6 py-3 hidden md:table-cell">Tipo</th>
                <th className="px-6 py-3">Precio</th>
                <th className="px-6 py-3 hidden sm:table-cell">Estado</th>
                <th className="px-6 py-3 hidden sm:table-cell">Oferta</th>
                <th className="px-6 py-3 hidden sm:table-cell text-center">Destacado</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <motion.tbody
              className="divide-y divide-slate-700"
              variants={staggerContainerFast}
              initial="hidden"
              animate="visible"
            >
              {paquetes.map((p) => {
                const Icon = tipoIcons[p.tipo]
                return (
                  <motion.tr
                    key={p.id}
                    variants={fadeInUp}
                    className="hover:bg-slate-700/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900/50">
                          <Icon className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5"><p className="font-semibold text-white">{p.nombre}</p>{p.recomendado && <span className="rounded-full bg-orange-900/40 px-1.5 py-0.5 text-xs font-bold text-orange-400">★</span>}</div>
                          {p.velocidad && <p className="text-xs text-slate-400">{p.velocidad}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell text-slate-400">{tipoLabels[p.tipo]}</td>
                    <td className="px-6 py-4 font-semibold text-white">S/ {p.precio.toFixed(2)}</td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <button onClick={() => toggleActivo(p)}>
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                            p.activo ? "bg-green-900/40 text-green-400" : "bg-slate-700 text-slate-400"
                          }`}
                        >
                          {p.activo ? "Activo" : "Inactivo"}
                        </span>
                      </button>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      {p.oferta ? (
                        <span className="rounded-full bg-orange-900/40 px-2.5 py-1 text-xs font-semibold text-orange-400">
                          Con oferta
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Sin oferta</span>
                      )}
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-center">
                      <button onClick={() => toggleRecomendado(p)} title={p.recomendado ? 'Quitar recomendación' : 'Marcar como recomendado'}
                        className={`rounded-lg p-1.5 transition-colors ${p.recomendado ? 'text-orange-400 bg-orange-900/30 hover:bg-orange-900/50' : 'text-slate-500 hover:text-orange-400 hover:bg-orange-900/20'}`}>
                        <Star className={`h-4 w-4 ${p.recomendado ? 'fill-orange-400' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(p)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-blue-900/40 hover:text-blue-400 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-900/40 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </motion.tbody>
          </table>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl bg-slate-800 border border-slate-700 p-6 shadow-xl max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.24, ease: "easeOut" }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">
                  {editId ? "Editar paquete" : "Nuevo paquete"}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Nombre *</label>
                  <input
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    placeholder="Ej: Internet 100 Mbps"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Tipo *</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => setForm({ ...form, tipo: e.target.value as TipoPaquete })}
                    className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white outline-none focus:border-blue-500"
                  >
                    {Object.entries(tipoLabels).map(([val, label]) => (
                      <option key={val} value={val}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">Descripción *</label>
                  <textarea
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    rows={2}
                    className="w-full resize-none rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">Precio (S/) *</label>
                    <input
                      type="number"
                      value={form.precio}
                      onChange={(e) => setForm({ ...form, precio: e.target.value })}
                      className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-300">Velocidad</label>
                    <input
                      value={form.velocidad}
                      onChange={(e) => setForm({ ...form, velocidad: e.target.value })}
                      className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                      placeholder="Ej: 100 Mbps"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-300">
                    Características{" "}
                    <span className="text-slate-500 font-normal">(una por línea)</span>
                  </label>
                  <textarea
                    value={form.caracteristicas}
                    onChange={(e) => setForm({ ...form, caracteristicas: e.target.value })}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-blue-500"
                    placeholder={"Router WiFi incluido\nSoporte técnico 24/7\nInstalación gratuita"}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="activo" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="h-4 w-4 rounded" />
                  <label htmlFor="activo" className="text-sm font-medium text-slate-300">Paquete activo (visible al público)</label>
                </div>
                <div className="flex items-start gap-2">
                  <input type="checkbox" id="recomendado" checked={!!form.recomendado} onChange={(e) => setForm({ ...form, recomendado: e.target.checked })} className="mt-0.5 h-4 w-4 rounded accent-orange-500" />
                  <label htmlFor="recomendado" className="cursor-pointer">
                    <span className="text-sm font-medium text-slate-300">⭐ Marcar como Plan Recomendado</span>
                    <p className="text-xs text-slate-500">Se muestra con banner naranja en la página pública</p>
                  </label>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-xl border border-slate-600 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {saving ? "Guardando..." : "Guardar"}
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
        confirmLabel={dialog?.variant === "warning" ? "Sí, desactivar" : "Eliminar"}
        onConfirm={dialog?.onConfirm ?? (() => {})}
        onCancel={() => setDialog(null)}
      />
    </div>
  )
}
