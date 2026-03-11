import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"),
  title: {
    default: "MEGACABLE - Internet y Cable para tu hogar",
    template: "%s | MEGACABLE",
  },
  description:
    "Descubre los mejores paquetes de internet y cable de MEGACABLE. Conexión estable, alta velocidad y canales Full HD para tu hogar.",
  keywords: ["internet", "cable", "megacable", "paquetes", "fibra óptica", "television"],
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "MEGACABLE",
    title: "MEGACABLE - Internet y Cable para tu hogar",
    description:
      "Descubre los mejores paquetes de internet y cable. Conexión estable, alta velocidad y canales Full HD.",
    images: [{ url: "/megacable.png", width: 400, height: 200, alt: "MEGACABLE" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MEGACABLE - Internet y Cable para tu hogar",
    description: "Los mejores paquetes de internet y cable para tu hogar.",
    images: ["/megacable.png"],
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}
