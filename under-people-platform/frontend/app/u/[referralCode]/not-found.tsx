'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-black uppercase mb-4 text-[#8A0303]">404</h1>
        <h2 className="text-2xl font-bold uppercase mb-6 tracking-wider">Profile Not Found</h2>
        
        <p className="text-zinc-400 text-sm mb-8 font-mono">
          The user profile you're looking for doesn't exist or the referral code is invalid.
        </p>
        
        <a
          href="/"
          className="inline-block bg-[#8A0303] hover:bg-red-700 text-white px-8 py-3 font-mono uppercase tracking-wider transition-colors"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}
