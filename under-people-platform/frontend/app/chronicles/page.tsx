import Timeline from '@/components/chronicles/Timeline';
import BackButton from '@/components/ui/BackButton';

export default function ChroniclesPage() {
  return (
    <main className="min-h-screen bg-black">
      <BackButton />
      <Timeline />
    </main>
  );
}
