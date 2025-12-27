'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * Это catch-all redirect для старых ссылок с [code]
 * Перенаправляет на [referralCode]
 */
export default function OldProfileRedirect({ params }: { params: { code: string } }) {
  const router = useRouter();

  useEffect(() => {
    // Перенаправляем на новый путь с referralCode
    router.replace(`/u/${params.code}`);
  }, [params.code, router]);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-400">Перенаправление...</p>
      </div>
    </div>
  );
}
