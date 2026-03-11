"use client"

import Image from "next/image"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, Eye, EyeOff } from "lucide-react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { fadeInUp, scaleIn, staggerContainer, mountProps } from "@/lib/animations"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.ok) {
      toast.success("Bienvenido al panel de administracion")
      router.push("/admin/dashboard")
      router.refresh()
    } else {
      toast.error("Credenciales incorrectas")
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">

      {/* Anillos de señal — mismo lenguaje visual que el Hero */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-red-500/15"
            initial={{ width: 60, height: 60, opacity: 0.6 }}
            animate={{ width: [60, 500], height: [60, 500], opacity: [0.4, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: i * 1.6, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Blobs decorativos */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-red-600/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo + título con entrada */}
        <motion.div
          className="mb-8 flex flex-col items-center"
          variants={staggerContainer}
          {...mountProps}
        >
          <motion.div variants={scaleIn}>
            <Image
              src="/megacable.png"
              alt="MEGACABLE"
              width={220}
              height={95}
              className="h-20 w-auto object-contain drop-shadow-md"
              priority
            />
          </motion.div>
          <motion.h1 variants={fadeInUp} className="mt-4 text-xl font-bold text-white">
            Panel de Administracion
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-1 text-sm text-slate-400">
            Ingresa tus credenciales para continuar
          </motion.p>
        </motion.div>

        {/* Card del formulario */}
        <motion.div
          className="rounded-2xl border border-slate-700 bg-slate-800/80 backdrop-blur-sm p-8 shadow-xl"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp}>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@megacable.pe"
                required
                className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-shadow"
              />
            </motion.div>

            <motion.div variants={fadeInUp}>
              <label className="mb-1.5 block text-sm font-medium text-slate-300">Contraseña</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-600 bg-slate-700/50 px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? "Iniciando sesion..." : "Iniciar sesion"}
              </motion.button>
            </motion.div>
          </motion.form>
        </motion.div>
      </div>
    </div>
  )
}
