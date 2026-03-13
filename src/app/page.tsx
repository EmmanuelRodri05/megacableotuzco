import { prisma } from "@/lib/prisma"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import StatsSection from "@/components/StatsSection"
import PorQueNosotros from "@/components/PorQueNosotros"
import PaquetesSection from "@/components/PaquetesSection"
import ComoContratar from "@/components/ComoContratar"
import OfertasSection from "@/components/OfertasSection"
import ContactoSection from "@/components/ContactoSection"
import WhatsAppButton from "@/components/WhatsAppButton"
import Footer from "@/components/Footer"

export const revalidate = 60

async function getPaquetes() {
  return prisma.paquete.findMany({
    where: { activo: true },
    include: {
      oferta: {
        where: { activo: true },
        select: { descuento: true, precioOferta: true, descripcion: true, velocidadPromo: true },
      },
    },
    orderBy: { precio: "asc" },
  })
}

async function getOfertas() {
  return prisma.oferta.findMany({
    where: {
      activo: true,
      OR: [{ fechaFin: null }, { fechaFin: { gte: new Date() } }],
    },
    include: {
      paquete: {
        select: { nombre: true, tipo: true, precio: true, velocidad: true },
      },
    },
    orderBy: { descuento: "desc" },
  })
}

export default async function Home() {
  const [paquetes, ofertas] = await Promise.all([getPaquetes(), getOfertas()])

  const paquetesData = paquetes.map((p) => ({ ...p, oferta: p.oferta ?? null }))
  const ofertasData  = ofertas.map((o) => ({ ...o, fechaFin: o.fechaFin ? o.fechaFin.toISOString() : null }))

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <PorQueNosotros />
        <PaquetesSection paquetes={paquetesData} />
        <ComoContratar />
        <OfertasSection ofertas={ofertasData} />
        <ContactoSection />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
