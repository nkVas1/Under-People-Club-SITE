'use client'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface IntroProps {
  onComplete: () => void
}

export default function IntroOverlay({ onComplete }: IntroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-play после 2 сек или по клику
    const timer = setTimeout(() => {
      handleStart()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const handleStart = () => {
    if (!containerRef.current || !logoRef.current) return

    const tl = gsap.timeline({
      onComplete: () => {
        if (containerRef.current) containerRef.current.style.display = 'none'
        onComplete()
      }
    })

    tl.to(logoRef.current, {
      duration: 1.5,
      scaleY: 3,
      scaleX: 0.8,
      opacity: 0,
      filter: 'blur(20px)',
      ease: 'power2.in',
      y: 200
    })
    .to(containerRef.current, {
      duration: 0.5,
      backgroundColor: '#000',
      opacity: 0
    }, '-=0.5')
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer transition-all overflow-hidden"
      onClick={handleStart}
    >
      {/* 🔴 НОВЫЙ БЛОК: Атмосферный фон */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 transition-opacity duration-1000 group-hover:opacity-40"
        style={{ 
          backgroundImage: 'url(/img/intro_background.png)',
          filter: 'brightness(0.4) contrast(1.2) saturate(1.3)'
        }}
      />
      
      {/* Виньетка для фокуса на центре */}
      <div 
        className="absolute inset-0 bg-gradient-radial from-transparent via-black/20 to-black/90"
      />
      
      {/* Шумовой оверлей для гранжа */}
      <div 
        className="absolute inset-0 bg-[url('/textures/noise.png')] opacity-10 mix-blend-overlay pointer-events-none"
      />

      <div ref={logoRef} className="relative group z-10">
        <h1 className="text-9xl font-black tracking-tighter text-white select-none transition-all duration-1000 group-hover:text-blood font-display drop-shadow-[0_0_30px_rgba(138,3,3,0.8)]">
          UP
        </h1>
        <div className="absolute inset-0 bg-blood blur-3xl opacity-30 animate-pulse rounded-full pointer-events-none group-hover:opacity-50 transition-opacity duration-1000" />

        <p className="absolute -bottom-10 left-0 w-full text-center text-xs tracking-[0.5em] text-gray-500 animate-pulse font-mono">
          [CLICK TO ENTER]
        </p>

        {/* 🔴 НОВЫЙ БЛОК: Сканирующая линия */}
        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-blood to-transparent opacity-50 animate-pulse" />
      </div>
    </div>
  )
}
