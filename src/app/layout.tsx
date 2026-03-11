import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"
import { BUSINESS_NAME, PHONE_DISPLAY, ADDRESS, EMAIL } from "@/lib/constants"

const inter = Inter({ subsets: ["latin"] })

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "https://megacableperu.com"

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MEGACABLE - Internet y Cable para tu hogar | Otuzco",
    template: "%s | MEGACABLE Otuzco",
  },
  description:
    "Descubre los mejores paquetes de internet y cable de MEGACABLE en Otuzco. Conexión estable, alta velocidad y canales Full HD para tu hogar.",
  keywords: ["internet otuzco", "cable tv otuzco", "megacable", "paquetes internet", "fibra óptica", "television cable", "la libertad"],
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: BASE_URL,
    siteName: BUSINESS_NAME,
    title: "MEGACABLE - Internet y Cable | Otuzco",
    description: "Los mejores paquetes de internet y cable en Otuzco. Conexión estable, alta velocidad y canales Full HD.",
    images: [{ url: "/megacable.png", width: 400, height: 200, alt: "MEGACABLE Otuzco" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MEGACABLE - Internet y Cable | Otuzco",
    description: "Los mejores paquetes de internet y cable para tu hogar en Otuzco.",
    images: ["/megacable.png"],
  },
  robots: { index: true, follow: true },
}

/* JSON-LD LocalBusiness — mejora el resultado en Google para búsquedas locales */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "InternetCafé",
  name: BUSINESS_NAME,
  description: "Proveedor de internet y cable TV en Otuzco, La Libertad, Perú.",
  url: BASE_URL,
  telephone: PHONE_DISPLAY,
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    streetAddress: ADDRESS,
    addressLocality: "Otuzco",
    addressRegion: "La Libertad",
    addressCountry: "PE",
  },
  openingHoursSpecification: [
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "08:00", closes: "13:00" },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"], opens: "15:00", closes: "19:00" },
  ],
  sameAs: [
    "https://www.facebook.com/megacableotuzco",
    "https://www.instagram.com/megacableotuzco",
  ],
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="es">
      <body className={`${inter.className} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}
