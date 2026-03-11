import { prisma } from "@/lib/prisma"
import MensajesClient from "./MensajesClient"

export default async function MensajesPage() {
  const mensajes = await prisma.contacto.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mensajes de contacto</h1>
          <p className="mt-1 text-slate-400">
            {mensajes.filter((m) => !m.leido).length} mensajes sin leer de {mensajes.length} totales
          </p>
        </div>
      </div>

      <MensajesClient mensajes={mensajes.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))} />
    </div>
  )
}
