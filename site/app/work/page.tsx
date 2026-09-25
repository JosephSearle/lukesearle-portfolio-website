import { WorkGrid } from '@/components/WorkGrid';
import { Suspense } from 'react';

export const metadata = { title: 'Work — Luke Searle' };

export default function WorkPage() {
  return (
    <Suspense>
      <WorkGrid full />
    </Suspense>
  );
}
