'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import BackButton from '@/components/ui/BackButton';

type ActiveTab = 'scanner' | 'stats';

export default function OverseerPage() {
  const { user } = useAuthStore();
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('scanner');
  const [accessDenied, setAccessDenied] = useState(false);

  // Security check: Only admins (role === 'elder')
  useEffect(() => {
    // Simple client-side check (for now)
    // In production: Use middleware or JWT validation on backend
    if (user && user.role !== 'elder' && user.username !== 'CyberStalker') {
      setAccessDenied(true);
    }
  }, [user]);

  if (accessDenied) {
    return (
      <main className="min-h-screen bg-[#100000] text-red-500 font-mono p-6 flex items-center justify-center">
        <div className="border-2 border-red-500 p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold uppercase mb-4">ACCESS DENIED</h1>
          <p className="text-xs mb-6 text-red-400">
            This terminal is restricted to authorized personnel only.
          </p>
          <BackButton />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#100000] text-red-500 font-mono">
      <BackButton />

      {/* Noise overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none mix-blend-overlay">
        <div className="w-full h-full bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22><filter id=%22noise%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22/></filter><rect width=%22100%22 height=%22100%22 fill=%22%23fff%22 filter=%22url(%23noise)%22/></svg>')]" />
      </div>

      <div className="container mx-auto p-6 relative z-10">
        {/* Header */}
        <header className="mt-8 mb-8 border-b-2 border-red-900 pb-6 flex justify-between items-end">
          <div>
            <h1 className="text-5xl md:text-6xl font-black uppercase tracking-wider">
              OVERSEER
            </h1>
            <p className="text-red-700 font-mono text-xs mt-2 tracking-[0.2em]">TERMINAL // ADMIN CONTROL</p>
          </div>
          <div className="text-right text-xs border border-red-900 p-3 bg-black/50">
            <p className="text-white">OPERATOR: <span className="text-red-500 font-bold">{user?.username || 'UNKNOWN'}</span></p>
            <p className="text-white">ACCESS: <span className="text-green-500 font-bold">ROOT</span></p>
            <p className="text-red-700">LEVEL: {user?.role?.toUpperCase() || 'GUEST'}</p>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-red-900 pb-4">
          <button
            onClick={() => setActiveTab('scanner')}
            className={`px-6 py-2 border font-mono text-sm font-bold uppercase transition-all ${
              activeTab === 'scanner'
                ? 'bg-red-900/50 text-white border-red-500 shadow-lg shadow-red-900/50'
                : 'border-red-900 text-red-700 hover:text-red-500'
            }`}
          >
            📡 QR SCANNER
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-2 border font-mono text-sm font-bold uppercase transition-all ${
              activeTab === 'stats'
                ? 'bg-red-900/50 text-white border-red-500 shadow-lg shadow-red-900/50'
                : 'border-red-900 text-red-700 hover:text-red-500'
            }`}
          >
            📊 STATISTICS
          </button>
        </div>

        {/* Content */}
        <div className="border-2 border-red-900 bg-black/50 min-h-[500px] p-8">
          {activeTab === 'scanner' && (
            <div className="space-y-6">
              <div className="border-2 border-red-700 p-6 bg-red-900/5">
                <h2 className="text-lg font-bold uppercase mb-4">QR CODE SCANNER</h2>

                {/* Placeholder for QR reader */}
                <div className="w-full max-w-md mx-auto aspect-square border-4 border-red-500 bg-black/50 flex items-center justify-center rounded-lg overflow-hidden">
                  <div className="text-center">
                    <p className="text-xs text-red-700 mb-4">📷 QR SCANNER PLACEHOLDER</p>
                    <p className="text-xs text-red-500 opacity-50">
                      Install html5-qrcode to enable live scanning.
                      <br />
                      For demo: Click button below to simulate scan.
                    </p>
                    <button
                      onClick={() => setScanResult('ref_code_demo_12345')}
                      className="mt-4 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition-all text-xs font-bold"
                    >
                      SIMULATE SCAN
                    </button>
                  </div>
                </div>
              </div>

              {/* Scan Result */}
              {scanResult && (
                <div className="border-2 border-green-500 p-6 bg-green-900/10 animate-pulse">
                  <h3 className="text-xs text-green-500 font-bold uppercase mb-3">✓ SCAN RESULT</h3>
                  <div className="space-y-3">
                    <div className="font-mono text-lg text-white bg-black/30 p-3 border border-green-500">
                      {scanResult}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <p className="text-xs text-green-600 uppercase mb-1">Status</p>
                        <p className="text-sm font-bold text-white">VALID TICKET</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase mb-1">User</p>
                        <p className="text-sm font-bold text-white">CyberStalker#666</p>
                      </div>
                      <div>
                        <p className="text-xs text-green-600 uppercase mb-1">Entry Time</p>
                        <p className="text-sm font-bold text-white">{new Date().toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 px-4 py-2 bg-green-700 text-white font-bold uppercase text-sm hover:bg-green-600 transition-colors">
                        ✓ ALLOW ENTRY
                      </button>
                      <button
                        onClick={() => setScanResult(null)}
                        className="flex-1 px-4 py-2 bg-red-700 text-white font-bold uppercase text-sm hover:bg-red-600 transition-colors"
                      >
                        ✕ DENY / RESET
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold uppercase">GLOBAL STATISTICS</h2>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Members', value: '1,337', color: 'red' },
                  { label: 'Tickets Sold', value: '245', color: 'red' },
                  { label: 'Revenue (Est.)', value: '367k ₽', color: 'red' },
                ].map((stat) => (
                  <div key={stat.label} className={`bg-${stat.color}-900/10 p-6 border-2 border-${stat.color}-900`}>
                    <h3 className="text-xs uppercase text-red-700 font-bold mb-3">{stat.label}</h3>
                    <p className="text-4xl font-black text-white">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Activity Log */}
              <div className="border-2 border-red-900 p-6 bg-red-900/5">
                <h3 className="text-sm font-bold uppercase mb-4 text-red-500">Recent Entries</h3>
                <div className="space-y-2 text-xs font-mono">
                  {[
                    { time: '23:45:12', user: 'CyberStalker', action: 'ENTRY GRANTED' },
                    { time: '23:42:08', user: 'NeonRaven', action: 'ENTRY GRANTED' },
                    { time: '23:38:45', user: 'GhostWalker', action: 'ENTRY DENIED (INVALID)' },
                    { time: '23:35:22', user: 'ShadowMind', action: 'ENTRY GRANTED' },
                    { time: '23:31:56', user: 'CrypticEye', action: 'ENTRY GRANTED' },
                  ].map((log, idx) => (
                    <div key={idx} className="flex justify-between border-b border-red-900/30 py-2 text-red-700 hover:text-red-500 transition-colors">
                      <span>{log.time}</span>
                      <span className="flex-1 mx-4 text-center">{log.user}</span>
                      <span className={log.action.includes('DENIED') ? 'text-red-600' : 'text-green-600'}>
                        {log.action}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Info */}
              <div className="border-2 border-red-900 p-4 bg-red-900/5 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="text-red-700">UPTIME</p>
                  <p className="text-white font-bold">12h 34m</p>
                </div>
                <div>
                  <p className="text-red-700">EVENTS TODAY</p>
                  <p className="text-white font-bold">3/5</p>
                </div>
                <div>
                  <p className="text-red-700">BANDWIDTH</p>
                  <p className="text-white font-bold">234.5 MB</p>
                </div>
                <div>
                  <p className="text-red-700">SYSTEM STATUS</p>
                  <p className="text-green-500 font-bold">OPERATIONAL</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-xs text-red-700 border-t border-red-900 pt-4">
          <p>OVERSEER TERMINAL v1.0 // CLASSIFIED MATERIAL // DO NOT DISTRIBUTE</p>
        </footer>
      </div>
    </main>
  );
}
