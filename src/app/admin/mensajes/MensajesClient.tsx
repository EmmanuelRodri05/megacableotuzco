"use client"

import { useState, useMemo } from "react"
import { Mail, Phone, CheckCheck, Trash2, Eye, Search } from "lucide-react"
import toast from "react-hot-toast"

type Mensaje = {
  id: string
  nombre: string
  email: string
  telefono: string | null
  servicioInteres: string | null
  mensaje: string
  leido: boolean
  createdAt: string
}

const SERVICIO_LABELS: Record<string, string> = {
  INTERNET: "Internet",
  CABLE_ESTANDAR: "Cable Estándar",
  CABLE_FULL_HD: "Cable Full HD",
  DUO: "Dúo",
  INFO: "Solo info",
}

export default function MensajesClient({ mensajes: inicial }: { mensajes: Mensaje[] }) {
  const [mensajes, setMensajes] = useState(inicial)
  const [selected, setSelected] = useState<Mensaje | null>(null)
  const [search, setSearch] = useState("")
  const [filtro, setFiltro] = useState<"TODOS" | "NO_LEIDOS" | "LEIDOS">("TODOS")

  const filtrados = useMemo(() => {
    return mensajes.filter((m) => {
      const matchSearch =
        !search ||
        m.nombre.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.mensaje.toLowerCase().includes(search.toLowerCase())
      const matchFiltro =
        filtro === "TODOS" ||
        (filtro === "NO_LEIDOS" && !m.leido) ||
        (filtro === "LEIDOS" && m.leido)
      return matchSearch && matchFiltro
    })
  }, [mensajes, search, filtro])

  const marcarLeido = async (id: string) => {
    await fetch(`/api/contacto/${id}`, { method: "PATCH" })
    setMensajes((prev) => prev.map((m) => (m.id === id ? { ...m, leido: true } : m)))
    if (selected?.id === id) setSelected((prev) => prev ? { ...prev, leido: true } : null)
    toast.success("Marcado como leido")
  }

  const eliminar = async (id: string) => {
    if (!confirm("¿Eliminar este mensaje?")) return
    await fetch(`/api/contacto/${id}`, { method: "DELETE" })
    setMensajes((prev) => prev.filter((m) => m.id !== id))
    if (selected?.id === id) setSelected(null)
    toast.success("Mensaje eliminado")
  }

  const abrirMensaje = (m: Mensaje) => {
    setSelected(m)
    if (!m.leido) marcarLeido(m.id)
  }

  const noLeidos = mensajes.filter((m) => !m.leido).length

  return (
    <div className="mt-6">
      {/* Search + Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o mensaje..."
            className="w-full rounded-xl border border-slate-700 bg-slate-800 pl-9 pr-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex gap-2">
          {(["TODOS", "NO_LEIDOS", "LEIDOS"] as const).map((f) => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors ${
                filtro === f ? "bg-red-600 text-white" : "bg-slate-800 text-slate-400 border border-slate-700 hover:text-white"
              }`}>
              {f === "TODOS" ? `Todos (${mensajes.length})` : f === "NO_LEIDOS" ? `Sin leer (${noLeidos})` : `Leídos (${mensajes.length - noLeidos})`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden">
          {filtrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Mail className="h-12 w-12 mb-3 opacity-30" />
              <p>{search ? "Sin resultados para tu búsqueda" : "No hay mensajes"}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {filtrados.map((m) => (
                <div key={m.id} onClick={() => abrirMensaje(m)}
                  className={`cursor-pointer px-5 py-4 transition-colors ${selected?.id === m.id ? "bg-blue-900/30" : "hover:bg-slate-700/40"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        {!m.leido && <span className="h-2 w-2 rounded-full bg-blue-500 shrink-0" />}
                        <p className={`text-sm truncate ${!m.leido ? "font-bold text-white" : "font-medium text-slate-400"}`}>{m.nombre}</p>
                        {m.servicioInteres && (
                          <span className="hidden sm:inline-block rounded-full bg-slate-700 px-2 py-0.5 text-xs text-slate-400">
                            {SERVICIO_LABELS[m.servicioInteres] ?? m.servicioInteres}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{m.email}</p>
                      <p className="mt-1 text-xs text-slate-400 truncate">{m.mensaje}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <p className="text-xs text-slate-500">
                        {new Date(m.createdAt).toLocaleDateString("es-PE", { day: "numeric", month: "short" })}
                      </p>
                      <div className="flex gap-1">
                        {!m.leido && (
                          <button onClick={(e) => { e.stopPropagation(); marcarLeido(m.id) }}
                            className="rounded p-1 text-slate-500 hover:text-blue-400 hover:bg-blue-900/30 transition-colors">
                            <CheckCheck className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button onClick={(e) => { e.stopPropagation(); eliminar(m.id) }}
                          className="rounded p-1 text-slate-500 hover:text-red-400 hover:bg-red-900/30 transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl bg-slate-800 border border-slate-700">
          {selected ? (
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-white">{selected.nombre}</h3>
                  <p className="text-sm text-slate-400">
                    {new Date(selected.createdAt).toLocaleDateString("es-PE", {
                      weekday: "long", day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selected.servicioInteres && (
                    <span className="rounded-full bg-blue-900/40 px-2.5 py-1 text-xs font-medium text-blue-400">
                      {SERVICIO_LABELS[selected.servicioInteres] ?? selected.servicioInteres}
                    </span>
                  )}
                  {selected.leido && (
                    <span className="flex items-center gap-1 rounded-full bg-green-900/40 px-3 py-1 text-xs font-medium text-green-400">
                      <CheckCheck className="h-3 w-3" /> Leído
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 mb-5">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Mail className="h-4 w-4 text-slate-500" />
                  <a href={`mailto:${selected.email}`} className="text-cyan-400 hover:underline">{selected.email}</a>
                </div>
                {selected.telefono && (
                  <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Phone className="h-4 w-4 text-slate-500" />
                    <a href={`tel:${selected.telefono}`} className="text-cyan-400 hover:underline">{selected.telefono}</a>
                  </div>
                )}
              </div>

              <div className="rounded-xl bg-slate-700/50 p-4">
                <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">{selected.mensaje}</p>
              </div>

              <div className="mt-5 flex gap-3">
                <a href={`mailto:${selected.email}`}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors">
                  <Mail className="h-4 w-4" />
                  Responder por email
                </a>
                <button onClick={() => eliminar(selected.id)}
                  className="flex items-center gap-2 rounded-xl border border-red-800 px-4 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-900/30 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Eye className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Selecciona un mensaje para verlo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
