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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black cursor-pointer transition-all"
      onClick={handleStart}
    >
      <div ref={logoRef} className="relative group">
        <h1 className="text-9xl font-black tracking-tighter text-white select-none transition-all duration-1000 group-hover:text-blood font-display">
          UP
        </h1>
        <div className="absolute inset-0 bg-blood blur-3xl opacity-20 animate-pulse rounded-full pointer-events-none" />

        <p className="absolute -bottom-10 left-0 w-full text-center text-xs tracking-[0.5em] text-gray-500 animate-pulse font-mono">
          [CLICK TO ENTER]
        </p>
      </div>
    </div>
  )
}
