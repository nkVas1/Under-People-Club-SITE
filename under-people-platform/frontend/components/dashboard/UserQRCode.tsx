'use client';
import QRCode from 'react-qr-code';

export default function UserQRCode({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative group p-4 bg-white rounded-sm w-fit mx-auto border-4 border-white hover:border-[#8A0303] transition-colors duration-500">
      <QRCode 
        value={value}
        size={150}
        fgColor="#000000"
        bgColor="#FFFFFF"
        level="M"
      />
      {/* Декоративные элементы сканера */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#8A0303] opacity-0 group-hover:opacity-100 animate-[scan_1.5s_linear_infinite] pointer-events-none" />
      <p className="text-center text-[10px] font-mono mt-2 uppercase tracking-widest text-black font-bold">
        {label}
      </p>
    </div>
  );
}
