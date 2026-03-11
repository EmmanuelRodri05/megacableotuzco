"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, inViewProps } from "@/lib/animations"
import { PHONE_DISPLAY, EMAIL, ADDRESS, HOURS, SOCIAL } from "@/lib/constants"
import { Icon } from "@iconify/react"

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-slate-400">
      <div className="mx-auto max-w-7xl">

        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          {...inViewProps}
        >
          {/* Marca */}
          <motion.div variants={fadeInUp}>
            <div className="mb-4">
              <Image src="/megacable.png" alt="MEGACABLE" width={160} height={70} className="h-12 w-auto object-contain" />
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Conectando hogares con el mejor servicio de internet y cable de toda la ciudad.
            </p>
            {/* Redes sociales */}
            <div className="flex items-center gap-3">
              <motion.a
                href={SOCIAL.facebook} target="_blank" rel="noopener noreferrer"
                aria-label="Facebook"
                whileHover={{ scale: 1.15, color: "#60a5fa" }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-blue-600 hover:text-white transition-colors"
              >
                <Icon icon="ph:facebook-logo-fill" className="h-5 w-5" />
              </motion.a>
              <motion.a
                href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                aria-label="Instagram"
                whileHover={{ scale: 1.15 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:text-white transition-colors"
              >
                <Icon icon="ph:instagram-logo-fill" className="h-5 w-5" />
              </motion.a>
              <motion.a
                href={SOCIAL.whatsapp} target="_blank" rel="noopener noreferrer"
                aria-label="WhatsApp"
                whileHover={{ scale: 1.15 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-green-600 hover:text-white transition-colors"
              >
                <Icon icon="ph:whatsapp-logo-fill" className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Paquetes */}
          <motion.div variants={fadeInUp}>
            <h4 className="mb-4 font-semibold text-white">Paquetes</h4>
            <ul className="flex flex-col gap-2 text-sm">
              {["Cable Estándar", "Cable Full HD", "Internet", "Paquete Dúo"].map((item) => (
                <li key={item}>
                  <a href="#paquetes" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contacto */}
          <motion.div variants={fadeInUp}>
            <h4 className="mb-4 font-semibold text-white">Contacto</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li className="flex items-start gap-2">
                <Icon icon="ph:phone-fill" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <a href={`tel:${PHONE_DISPLAY}`} className="hover:text-white transition-colors">{PHONE_DISPLAY}</a>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="ph:envelope-fill" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <a href={`mailto:${EMAIL}`} className="hover:text-white transition-colors">{EMAIL}</a>
              </li>
              <li className="flex items-start gap-2">
                <Icon icon="ph:map-pin-fill" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                <span>{ADDRESS}</span>
              </li>
            </ul>
          </motion.div>

          {/* Horario */}
          <motion.div variants={fadeInUp}>
            <h4 className="mb-4 font-semibold text-white">Atención</h4>
            <ul className="flex flex-col gap-2 text-sm">
              {HOURS.map((h) => (
                <li key={h} className="flex items-start gap-2">
                  <Icon icon="ph:clock-fill" className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <h4 className="mb-3 font-semibold text-white text-sm">Legal</h4>
              <ul className="flex flex-col gap-1.5 text-sm">
                <li><a href="/terminos" className="hover:text-white transition-colors">Términos y condiciones</a></li>
                <li><a href="/privacidad" className="hover:text-white transition-colors">Política de privacidad</a></li>
              </ul>
            </div>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-10 border-t border-slate-800 pt-6 text-center text-sm"
          variants={fadeInUp}
          {...inViewProps}
        >
          <p>&copy; {new Date().getFullYear()} MEGACABLE Otuzco. Todos los derechos reservados.</p>
        </motion.div>
      </div>
    </footer>
  )
}
