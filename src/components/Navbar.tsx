"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navBase = scrolled
    ? "bg-slate-900/95 backdrop-blur-sm shadow-lg"
    : "bg-transparent"

  const linkColor = "text-white/90 hover:text-white"

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBase}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center">
            <div className="flex flex-col leading-tight">
              <span className="text-2xl font-extrabold tracking-tight">
                <span className="text-red-500">MEGA</span><span className="text-cyan-400">CABLE</span>
              </span>
              <span className="text-[10px] font-semibold tracking-widest text-white/60 uppercase">
                Otuzco &mdash; Capital de la Fe
              </span>
            </div>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#paquetes" className={`text-sm font-medium transition-colors ${linkColor}`}>
              Paquetes
            </a>
            <a href="#ofertas" className={`text-sm font-medium transition-colors ${linkColor}`}>
              Ofertas
            </a>
            <a href="#contacto" className={`text-sm font-medium transition-colors ${linkColor}`}>
              Contacto
            </a>
            <a
              href="#contacto"
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Contratar ahora
            </a>
          </div>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abrir menú"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-white/10 bg-slate-900/95 backdrop-blur-sm px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a href="#paquetes" className="text-sm font-medium text-white/90" onClick={() => setIsOpen(false)}>
              Paquetes
            </a>
            <a href="#ofertas" className="text-sm font-medium text-white/90" onClick={() => setIsOpen(false)}>
              Ofertas
            </a>
            <a href="#contacto" className="text-sm font-medium text-white/90" onClick={() => setIsOpen(false)}>
              Contacto
            </a>
            <a
              href="#contacto"
              className="rounded-full bg-red-600 px-5 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setIsOpen(false)}
            >
              Contratar ahora
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
