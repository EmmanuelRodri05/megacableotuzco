import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/../auth"

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const { id } = await params
    const body = await req.json()
    const { nombre, tipo, descripcion, precio, velocidad, caracteristicas, activo } = body

    const paquete = await prisma.paquete.update({
      where: { id },
      data: {
        ...(nombre && { nombre }),
        ...(tipo && { tipo }),
        ...(descripcion && { descripcion }),
        ...(precio !== undefined && { precio: Number(precio) }),
        ...(velocidad !== undefined && { velocidad }),
        ...(caracteristicas && { caracteristicas }),
        ...(activo !== undefined && { activo }),
      },
    })

    return NextResponse.json(paquete)
  } catch {
    return NextResponse.json({ error: "Error al actualizar paquete" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const { id } = await params
    await prisma.paquete.delete({ where: { id } })
    return NextResponse.json({ message: "Paquete eliminado" })
  } catch {
    return NextResponse.json({ error: "Error al eliminar paquete" }, { status: 500 })
  }
}
