"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const NAV_LINKS = [
  { label: "Paquetes", href: "#paquetes", section: "paquetes" },
  { label: "Ofertas",  href: "#ofertas",  section: "ofertas"  },
  { label: "Contacto", href: "#contacto", section: "contacto" },
]

export default function Navbar() {
  const [isOpen,   setIsOpen]   = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active,   setActive]   = useState("")

  /* Detectar scroll para cambiar fondo */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  /* IntersectionObserver: highlight del link según sección visible */
  useEffect(() => {
    const observers: IntersectionObserver[] = []
    NAV_LINKS.forEach(({ section }) => {
      const el = document.getElementById(section)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActive(section) },
        { rootMargin: "-40% 0px -55% 0px" }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  const navBase = scrolled
    ? "bg-slate-900/95 backdrop-blur-sm shadow-lg"
    : "bg-transparent"

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBase}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
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

          {/* Links desktop con indicador activo */}
          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-sm font-medium transition-colors ${
                  active === link.section ? "text-cyan-400" : "text-white/90 hover:text-white"
                }`}
              >
                {link.label}
                {active === link.section && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-cyan-400"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            ))}
            <a
              href="#contacto"
              className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
            >
              Contratar ahora
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil con AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden border-t border-white/10 bg-slate-900/95 backdrop-blur-sm md:hidden"
          >
            <motion.div
              className="flex flex-col gap-1 px-4 py-4"
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
            >
              {NAV_LINKS.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                  onClick={(e) => {
                    e.preventDefault()
                    setIsOpen(false)
                    setTimeout(() => {
                      document.getElementById(link.section)?.scrollIntoView({ behavior: "smooth" })
                    }, 280)
                  }}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    active === link.section
                      ? "bg-cyan-400/10 text-cyan-400"
                      : "text-white/90 hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contacto"
                variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                onClick={(e) => {
                  e.preventDefault()
                  setIsOpen(false)
                  setTimeout(() => {
                    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })
                  }, 280)
                }}
                className="mt-2 rounded-full bg-red-600 px-5 py-2.5 text-center text-sm font-semibold text-white"
              >
                Contratar ahora
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
