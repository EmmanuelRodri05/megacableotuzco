import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/../auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const { descuento, precioOferta, descripcion, fechaFin, activo, velocidadPromo, duracionMeses } = body

    const oferta = await prisma.oferta.update({
      where: { id },
      data: {
        ...(descuento !== undefined && { descuento: Number(descuento) }),
        ...(precioOferta !== undefined && { precioOferta: Number(precioOferta) }),
        ...(descripcion && { descripcion }),
        ...(fechaFin !== undefined && { fechaFin: fechaFin ? new Date(fechaFin) : null }),
        ...(activo !== undefined && { activo }),
        ...(velocidadPromo !== undefined && { velocidadPromo: velocidadPromo || null }),
        ...(duracionMeses !== undefined && { duracionMeses: duracionMeses ? Number(duracionMeses) : null }),
      },
    })

    return NextResponse.json(oferta)
  } catch {
    return NextResponse.json({ error: "Error al actualizar oferta" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const { id } = await params
    await prisma.oferta.delete({ where: { id } })
    return NextResponse.json({ message: "Oferta eliminada" })
  } catch {
    return NextResponse.json({ error: "Error al eliminar oferta" }, { status: 500 })
  }
}
