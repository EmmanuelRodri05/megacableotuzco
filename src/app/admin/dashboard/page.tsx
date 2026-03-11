import { prisma } from "@/lib/prisma"
import DashboardCharts from "./DashboardCharts"
import DashboardAnimated from "./DashboardAnimated"

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export default async function DashboardPage() {
  const [totalPaquetes, totalOfertas, totalMensajes, mensajesSinLeer] = await Promise.all([
    prisma.paquete.count({ where: { activo: true } }),
    prisma.oferta.count({ where: { activo: true } }),
    prisma.contacto.count(),
    prisma.contacto.count({ where: { leido: false } }),
  ])

  const [mensajesRecientes, todosMensajes] = await Promise.all([
    prisma.contacto.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.contacto.findMany({ select: { createdAt: true, leido: true }, orderBy: { createdAt: "asc" } }),
  ])

  const now = new Date()
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const nextD = new Date(d.getFullYear(), d.getMonth() + 1, 1)
    const inMonth = todosMensajes.filter((m) => m.createdAt >= d && m.createdAt < nextD)
    return {
      mes: MESES[d.getMonth()],
      total: inMonth.length,
      sinLeer: inMonth.filter((m) => !m.leido).length,
    }
  })

  const stats = [
    { label: "Paquetes activos",  value: totalPaquetes,     iconName: "Package"       as const, color: "bg-blue-600",   href: "/admin/paquetes" },
    { label: "Ofertas activas",   value: totalOfertas,      iconName: "Tag"           as const, color: "bg-orange-500", href: "/admin/ofertas"  },
    { label: "Mensajes totales",  value: totalMensajes,     iconName: "MessageSquare" as const, color: "bg-green-600",  href: "/admin/mensajes" },
    { label: "Sin leer",          value: mensajesSinLeer,   iconName: "TrendingUp"    as const, color: "bg-red-600",    href: "/admin/mensajes" },
  ]

  const mensajesSerializados = mensajesRecientes.map((m) => ({
    ...m,
    createdAt: m.createdAt.toISOString(),
  }))

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      <p className="mt-1 text-slate-400">Resumen general del sistema</p>

      <DashboardAnimated stats={stats} mensajesRecientes={mensajesSerializados} />

      <DashboardCharts data={chartData} />
    </div>
  )
}
