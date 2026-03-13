"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import { Icon } from "@iconify/react"

const STATS = [
  { value: 500, suffix: "+", label: "Clientes activos",       icon: "ph:users-three-fill",  color: "text-cyan-400",   bg: "bg-cyan-400/10"   },
  { value: 8,   suffix: "+", label: "Años de experiencia",    icon: "ph:calendar-fill",      color: "text-blue-400",   bg: "bg-blue-400/10"   },
  { value: 80,  suffix: "+", label: "Canales HD disponibles", icon: "ph:television-fill",    color: "text-purple-400", bg: "bg-purple-400/10" },
  { value: 100, suffix: "%", label: "Cobertura en Otuzco",     icon: "ph:cell-tower-fill",   color: "text-green-400",  bg: "bg-green-400/10"  },
]

function Counter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true
    const duration = 1400
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(eased * value))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value])

  return <>{display}{suffix}</>
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-80px" })

  return (
    <section ref={ref} className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          className="grid grid-cols-2 gap-6 lg:grid-cols-4"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
              whileHover={{ y: -4 }}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.bg}`}>
                <Icon icon={stat.icon} className={`h-6 w-6 ${stat.color}`} />
              </div>
              <p className={`text-4xl font-extrabold ${stat.color}`}>
                <Counter value={stat.value} suffix={stat.suffix} inView={inView} />
              </p>
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
