"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { Phone } from "lucide-react"
import { Icon } from "@iconify/react"
import { WHATSAPP_NUMBER, WA_DEFAULT_MSG } from "@/lib/constants"

const WA_HREF   = `https://wa.me/${WHATSAPP_NUMBER}?text=${WA_DEFAULT_MSG}`
const CALL_HREF = `tel:+${WHATSAPP_NUMBER}`

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-2"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          {/* WhatsApp */}
          <motion.a
            href={WA_HREF}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full bg-green-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-500/30 hover:bg-green-600 transition-colors"
          >
            <Icon icon="ph:whatsapp-logo-fill" className="h-5 w-5" />
            <span className="hidden sm:inline">Escríbenos al WhatsApp</span>
            <span className="sm:hidden">WhatsApp</span>
          </motion.a>

          {/* Llamar */}
          <motion.a
            href={CALL_HREF}
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 rounded-full border-2 border-cyan-400 bg-slate-900 px-5 py-2.5 text-sm font-bold text-cyan-300 shadow-lg shadow-cyan-400/20 hover:bg-cyan-400/10 transition-colors"
          >
            <Phone className="h-4 w-4" />
            <span className="hidden sm:inline">Llámanos ahora</span>
            <span className="sm:hidden">Llamar</span>
          </motion.a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
