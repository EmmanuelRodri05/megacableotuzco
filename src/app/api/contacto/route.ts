import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().optional(),
  servicioInteres: z.string().optional(),
  mensaje: z.string().min(10),
})

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const adminKey = searchParams.get("key")
  if (adminKey !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  try {
    const contactos = await prisma.contacto.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(contactos)
  } catch {
    return NextResponse.json({ error: "Error al obtener mensajes" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)

    const contacto = await prisma.contacto.create({ data })
    return NextResponse.json(contacto, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Datos invalidos", details: err.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Error al guardar mensaje" }, { status: 500 })
  }
}
