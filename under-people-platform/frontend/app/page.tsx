'use client'
import { useState } from 'react'
import IntroOverlay from '@/components/intro/IntroOverlay'
import ColumnNav from '@/components/layout/ColumnNav'

export default function Home() {
  const [introFinished, setIntroFinished] = useState(false)

  return (
    <main className="h-screen w-screen bg-black overflow-hidden">
      {!introFinished && (
        <IntroOverlay onComplete={() => setIntroFinished(true)} />
      )}
      
      <ColumnNav show={introFinished} />
      
      <footer className="fixed bottom-4 right-4 text-[10px] text-zinc-700 font-mono z-10">
        © 2025 UNDER PEOPLE CLUB • ODINLAB STUDIOS [BUILD 0.1]
      </footer>
    </main>
  )
}
