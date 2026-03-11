import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/../auth"

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const { id } = await params
    const contacto = await prisma.contacto.update({
      where: { id },
      data: { leido: true },
    })
    return NextResponse.json(contacto)
  } catch {
    return NextResponse.json({ error: "Error al actualizar mensaje" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 })

  try {
    const { id } = await params
    await prisma.contacto.delete({ where: { id } })
    return NextResponse.json({ message: "Mensaje eliminado" })
  } catch {
    return NextResponse.json({ error: "Error al eliminar mensaje" }, { status: 500 })
  }
}
