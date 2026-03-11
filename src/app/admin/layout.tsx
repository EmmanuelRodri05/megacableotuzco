"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { LayoutDashboard, Package, Tag, MessageSquare, LogOut, Menu, ExternalLink, X } from "lucide-react"
import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch("/api/admin/mensajes-count")
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(data.count)
        }
      } catch {}
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/paquetes", label: "Paquetes", icon: Package },
    { href: "/admin/ofertas", label: "Ofertas", icon: Tag },
    { href: "/admin/mensajes", label: "Mensajes", icon: MessageSquare, badge: unreadCount },
  ]

  if (pathname === "/admin/login") return <>{children}</>

  return (
    <div className="flex min-h-screen bg-slate-900">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-950 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-4">
          <Image
            src="/megacable.png"
            alt="MEGACABLE"
            width={130}
            height={55}
            className="h-9 w-auto object-contain"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-slate-500 hover:text-white transition-colors md:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item, i) => {
            const Icon = item.icon
            const active = pathname.startsWith(item.href)
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06, ease: "easeOut" }}
              >
                <Link
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-red-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <motion.span
                      key={item.badge}
                      initial={{ scale: 0.6 }}
                      animate={{ scale: 1 }}
                      className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white"
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </motion.span>
                  ) : null}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        <div className="absolute bottom-4 left-0 right-0 flex flex-col gap-1 px-4">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Ver sitio
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between border-b border-slate-700 bg-slate-800 px-6 md:px-8">
          <button
            className="text-slate-400 hover:text-white md:hidden transition-colors"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-2 ml-auto">
            <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <span className="text-sm font-medium text-slate-300 hidden sm:block">Administrador</span>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
