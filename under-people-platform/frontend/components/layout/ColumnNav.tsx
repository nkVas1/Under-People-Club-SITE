'use client'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const SECTIONS = [
  { id: 1, title: 'УБЕЖИЩЕ', label: 'Sanctuary', color: 'bg-[#111]', href: '/shelter' },
  { id: 2, title: 'АРСЕНАЛ', label: 'Arsenal', color: 'bg-[#1a0505]', href: '/arsenal' },
  { id: 3, title: 'ХРОНИКИ', label: 'Chronicles', color: 'bg-[#0f0f0f]', href: '/chronicles' },
  { id: 4, title: 'РЕЙД', label: 'Raid', color: 'bg-[#210000]', href: '/raid' },
  { id: 5, title: 'СВЯЗЬ', label: 'Network', color: 'bg-[#0a0a0a]', href: '/network' },
]

export default function ColumnNav({ show }: { show: boolean }) {
  const columnsRef = useRef<(HTMLDivElement | null)[]>([])
  const [, setActiveSection] = useState<number | null>(null)

  useEffect(() => {
    if (show) {
      gsap.fromTo(
        columnsRef.current,
        {
          x: '-100%',
          opacity: 0,
          skewX: 20
        },
        {
          duration: 0.8,
          x: '0%',
          opacity: 1,
          skewX: 0,
          stagger: 0.1,
          ease: 'power4.out'
        }
      )
    }
  }, [show])

  return (
    <div className="flex w-full h-screen overflow-hidden bg-black">
      {SECTIONS.map((section, index) => (
        <div
          key={section.id}
          ref={el => { columnsRef.current[index] = el }}
          className={`relative flex-1 h-full border-r border-[#333] ${section.color}
            transition-all duration-500 ease-out hover:flex-[2] hover:bg-blood group cursor-pointer overflow-hidden`}
          onClick={() => setActiveSection(section.id)}
        >
          {/* Декоративная вертикальная линия слева */}
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-blood to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

          {/* Вертикальный текст */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap">
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold tracking-widest text-zinc-600 group-hover:text-white transition-colors uppercase font-display">
                {section.title}
              </h2>
              <span className="text-[10px] text-zinc-700 group-hover:text-zinc-400 transition-colors mt-2 font-mono tracking-widest">
                [{section.label}]
              </span>
            </div>
          </div>

          {/* Затемнение при наведении */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity bg-black mix-blend-multiply" />

          {/* Сканирующая линия */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-blood opacity-0 group-hover:opacity-100 animate-scan-fast" />
        </div>
      ))}
    </div>
  )
}
