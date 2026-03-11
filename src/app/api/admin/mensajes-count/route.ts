import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/../auth"

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ count: 0 }, { status: 401 })

  const count = await prisma.contacto.count({ where: { leido: false } })
  return NextResponse.json({ count })
}
