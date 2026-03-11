import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import bcrypt from "bcryptjs"

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Iniciando seed de la base de datos...")

  // Crear admin
  const adminPassword = await bcrypt.hash("admin123", 12)
  await prisma.admin.upsert({
    where: { email: "admin@megacable.pe" },
    update: {},
    create: {
      email: "admin@megacable.pe",
      password: adminPassword,
      nombre: "Administrador",
    },
  })
  console.log("Admin creado: admin@megacable.pe / admin123")

  // Paquetes Cable Estandar
  const cable1 = await prisma.paquete.upsert({
    where: { id: "cable-est-basico" },
    update: {},
    create: {
      id: "cable-est-basico",
      nombre: "Cable Estandar Basico",
      tipo: "CABLE_ESTANDAR",
      descripcion: "Accede a los canales mas populares con imagen de calidad estandar.",
      precio: 49.9,
      caracteristicas: [
        "+80 canales nacionales e internacionales",
        "Canales de noticias y deportes",
        "Instalacion gratuita",
        "Control remoto incluido",
      ],
    },
  })

  const cable2 = await prisma.paquete.upsert({
    where: { id: "cable-est-plus" },
    update: {},
    create: {
      id: "cable-est-plus",
      nombre: "Cable Estandar Plus",
      tipo: "CABLE_ESTANDAR",
      descripcion: "Mayor variedad de canales con entretenimiento para toda la familia.",
      precio: 69.9,
      caracteristicas: [
        "+120 canales nacionales e internacionales",
        "Canales infantiles y de peliculas",
        "Canales de deportes premium",
        "Instalacion gratuita",
        "Soporte tecnico incluido",
      ],
    },
  })

  // Paquetes Cable Full HD
  const hd1 = await prisma.paquete.upsert({
    where: { id: "cable-hd-basico" },
    update: {},
    create: {
      id: "cable-hd-basico",
      nombre: "Cable Full HD",
      tipo: "CABLE_FULL_HD",
      descripcion: "Disfruta de imagen nítida en alta definicion con los mejores canales.",
      precio: 89.9,
      caracteristicas: [
        "+100 canales en Full HD",
        "Canales premium de peliculas y series",
        "Canales deportivos HD",
        "Decoder HD incluido",
        "Instalacion gratuita",
      ],
    },
  })

  const hd2 = await prisma.paquete.upsert({
    where: { id: "cable-hd-premium" },
    update: {},
    create: {
      id: "cable-hd-premium",
      nombre: "Cable Full HD Premium",
      tipo: "CABLE_FULL_HD",
      descripcion: "La mejor experiencia en television con canales exclusivos en Full HD.",
      precio: 119.9,
      caracteristicas: [
        "+150 canales en Full HD",
        "Canales 4K disponibles",
        "Paquetes de deportes internacionales",
        "Canales de cine exclusivos",
        "2 decoders HD incluidos",
        "Soporte prioritario 24/7",
      ],
    },
  })

  // Paquetes Internet
  const int1 = await prisma.paquete.upsert({
    where: { id: "internet-50" },
    update: {},
    create: {
      id: "internet-50",
      nombre: "Internet 50 Mbps",
      tipo: "INTERNET",
      descripcion: "Velocidad ideal para navegar, redes sociales y streaming en HD.",
      precio: 59.9,
      velocidad: "50 Mbps",
      caracteristicas: [
        "Velocidad de descarga: 50 Mbps",
        "Velocidad de subida: 10 Mbps",
        "Router WiFi incluido",
        "IP fija opcional",
        "Sin limite de datos",
      ],
    },
  })

  const int2 = await prisma.paquete.upsert({
    where: { id: "internet-100" },
    update: {},
    create: {
      id: "internet-100",
      nombre: "Internet 100 Mbps",
      tipo: "INTERNET",
      descripcion: "Perfecta para familias con varios dispositivos conectados simultáneamente.",
      precio: 79.9,
      velocidad: "100 Mbps",
      caracteristicas: [
        "Velocidad de descarga: 100 Mbps",
        "Velocidad de subida: 20 Mbps",
        "Router WiFi doble banda",
        "Conexion estable garantizada",
        "Sin limite de datos",
        "Instalacion gratuita",
      ],
    },
  })

  const int3 = await prisma.paquete.upsert({
    where: { id: "internet-300" },
    update: {},
    create: {
      id: "internet-300",
      nombre: "Internet 300 Mbps",
      tipo: "INTERNET",
      descripcion: "Alta velocidad para gaming, streaming 4K y trabajo desde casa.",
      precio: 109.9,
      velocidad: "300 Mbps",
      caracteristicas: [
        "Velocidad de descarga: 300 Mbps",
        "Velocidad de subida: 50 Mbps",
        "Router WiFi 6 incluido",
        "Baja latencia para gaming",
        "Sin limite de datos",
        "Soporte tecnico 24/7",
      ],
    },
  })

  const int4 = await prisma.paquete.upsert({
    where: { id: "internet-600" },
    update: {},
    create: {
      id: "internet-600",
      nombre: "Internet 600 Mbps",
      tipo: "INTERNET",
      descripcion: "Maxima velocidad para hogares con alta demanda digital.",
      precio: 149.9,
      velocidad: "600 Mbps",
      caracteristicas: [
        "Velocidad de descarga: 600 Mbps",
        "Velocidad de subida: 100 Mbps",
        "Router WiFi 6 mesh incluido",
        "Cobertura total del hogar",
        "Sin limite de datos",
        "IP fija incluida",
        "Soporte VIP 24/7",
      ],
    },
  })

  // Paquetes Duo
  const duo1 = await prisma.paquete.upsert({
    where: { id: "duo-basico" },
    update: {},
    create: {
      id: "duo-basico",
      nombre: "Duo Basico",
      tipo: "DUO",
      descripcion: "Internet de 100 Mbps + Cable Full HD en un solo paquete con ahorro garantizado.",
      precio: 139.9,
      velocidad: "100 Mbps",
      caracteristicas: [
        "Internet 100 Mbps sin limite",
        "+100 canales Full HD",
        "Router WiFi doble banda",
        "Decoder HD incluido",
        "Ahorro de S/ 30 vs contratar por separado",
        "Instalacion gratuita",
      ],
    },
  })

  const duo2 = await prisma.paquete.upsert({
    where: { id: "duo-premium" },
    update: {},
    create: {
      id: "duo-premium",
      nombre: "Duo Premium",
      tipo: "DUO",
      descripcion: "Internet de alta velocidad 300 Mbps + Cable Full HD Premium, la mejor combinacion.",
      precio: 189.9,
      velocidad: "300 Mbps",
      caracteristicas: [
        "Internet 300 Mbps sin limite",
        "+150 canales Full HD y 4K",
        "Router WiFi 6 incluido",
        "2 decoders HD incluidos",
        "Ahorro de S/ 40 vs contratar por separado",
        "Canales deportivos y peliculas premium",
        "Soporte prioritario 24/7",
      ],
    },
  })

  console.log("Paquetes creados exitosamente")
  console.log("Seed completado!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
