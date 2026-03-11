import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/../auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const ofertas = await prisma.oferta.findMany({
      include: { paquete: { select: { nombre: true, precio: true, tipo: true, velocidad: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(ofertas)
  } catch {
    return NextResponse.json({ error: "Error al obtener ofertas" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const body = await req.json()
    const { paqueteId, descuento, precioOferta, descripcion, fechaFin, velocidadPromo, duracionMeses } = body

    if (!paqueteId || descuento === undefined || !precioOferta || !descripcion) {
      return NextResponse.json({ error: "Campos requeridos incompletos" }, { status: 400 })
    }

    const existente = await prisma.oferta.findUnique({ where: { paqueteId } })
    if (existente) {
      return NextResponse.json({ error: "Este paquete ya tiene una oferta activa" }, { status: 400 })
    }

    const oferta = await prisma.oferta.create({
      data: {
        paqueteId,
        descuento: Number(descuento),
        precioOferta: Number(precioOferta),
        descripcion,
        fechaFin: fechaFin ? new Date(fechaFin) : null,
        velocidadPromo: velocidadPromo || null,
        duracionMeses: duracionMeses ? Number(duracionMeses) : null,
      },
    })

    return NextResponse.json(oferta, { status: 201 })
  } catch {
    return NextResponse.json({ error: "Error al crear oferta" }, { status: 500 })
  }
}
