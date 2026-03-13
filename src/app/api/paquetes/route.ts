import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/../auth"

export async function GET() {
  try {
    const paquetes = await prisma.paquete.findMany({
      include: { oferta: true },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(paquetes)
  } catch {
    return NextResponse.json({ error: "Error al obtener paquetes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const { nombre, tipo, descripcion, precio, velocidad, caracteristicas } = body

    if (!nombre || !tipo || !descripcion || !precio) {
      return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 })
    }

    const { recomendado } = body
    const paquete = await prisma.paquete.create({
      data: { nombre, tipo, descripcion, precio: Number(precio), velocidad: velocidad || null, caracteristicas: caracteristicas || [], recomendado: !!recomendado },
    })

    return NextResponse.json(paquete, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al crear paquete" }, { status: 500 })
  }
}
