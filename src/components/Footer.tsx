"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { fadeInUp, staggerContainer, inViewProps } from "@/lib/animations"

export default function Footer() {
  return (
    <footer className="bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 text-slate-400">
      <div className="mx-auto max-w-7xl">

        {/* Columnas con stagger */}
        <motion.div
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          {...inViewProps}
        >
          {/* Marca */}
          <motion.div variants={fadeInUp}>
            <div className="mb-4">
              <Image
                src="/megacable.png"
                alt="MEGACABLE"
                width={160}
                height={70}
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-sm leading-relaxed">
              Conectando hogares con el mejor servicio de internet y cable de toda la ciudad.
            </p>
          </motion.div>

          {/* Paquetes */}
          <motion.div variants={fadeInUp}>
            <h4 className="mb-4 font-semibold text-white">Paquetes</h4>
            <ul className="flex flex-col gap-2 text-sm">
              {["Cable Estandar", "Cable Full HD", "Internet", "Paquete Duo"].map((item) => (
                <li key={item}>
                  <a href="#paquetes" className="hover:text-white transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Atención */}
          <motion.div variants={fadeInUp}>
            <h4 className="mb-4 font-semibold text-white">Atención</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li>Lunes - Sábado: 8:00 am - 1:00 pm</li>
              <li>Lunes - Sábado: 3:00 pm - 7:00 pm</li>
              <li className="mt-2">
                <a href="tel:+51930854814" className="hover:text-white transition-colors">+51 930 854 814</a>
              </li>
            </ul>
          </motion.div>

          {/* Legal */}
          <motion.div variants={fadeInUp}>
            <h4 className="mb-4 font-semibold text-white">Legal</h4>
            <ul className="flex flex-col gap-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          className="mt-10 border-t border-slate-800 pt-6 text-center text-sm"
          variants={fadeInUp}
          {...inViewProps}
        >
          <p>&copy; {new Date().getFullYear()} MEGACABLE. Todos los derechos reservados.</p>
          <p className="mt-1">
            <Link href="/admin/login" className="text-slate-600 hover:text-slate-500 text-xs">
              Acceso administrador
            </Link>
          </p>
        </motion.div>
      </div>
    </footer>
  )
}
