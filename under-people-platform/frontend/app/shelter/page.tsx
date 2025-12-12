import ShelterProfile from '@/components/dashboard/ShelterProfile';
import BackButton from '@/components/ui/BackButton';

export default function ShelterPage() {
  return (
    <main className="min-h-screen w-full bg-[#050505] text-white selection:bg-[#8A0303] selection:text-white">
      <div className="fixed inset-0 bg-[url('/textures/noise.png')] opacity-5 pointer-events-none z-50" />
      <BackButton />
      
      <div className="pt-24 px-4 md:px-12 h-full">
        <ShelterProfile />
      </div>
    </main>
  );
}
