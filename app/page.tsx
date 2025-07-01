import { redirect } from 'next/navigation';
import { MainLayout } from '@/modules/layout/main-layout';
import { PlaygroundForm, PlaygroundResults } from '@/modules/playground/playground';

export default function Home() {
  if (!process.env.FAL_KEY) {
    redirect('/missing-key');
  }

  return (
    <MainLayout sidebar={<PlaygroundForm />}>
      <PlaygroundResults />
    </MainLayout>
  );
}
