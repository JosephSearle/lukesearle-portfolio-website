import { Pill } from '@/components/Pill';
import { WorkGrid } from '@/components/WorkGrid';
import { skills } from '@/lib/projects';
import Link from 'next/link';
import { Suspense } from 'react';

export default function Home() {
  return (
    <>
      <section className="grid items-end gap-x-16 gap-y-10 px-[clamp(20px,4vw,48px)] pb-[clamp(40px,6vw,72px)] pt-[clamp(56px,10vw,120px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),1fr))]">
        <div>
          <h1 className="m-0 text-[clamp(40px,6vw,72px)] font-semibold leading-none tracking-[-0.04em] text-white">
            Luke Searle
          </h1>
          <p className="mt-5 max-w-[520px] text-pretty text-lg leading-relaxed text-slate-400">
            Director and filmmaker working across narrative, commercial and music video.
            Character-first stories, shot with restraint.
          </p>
        </div>
        <div className="flex flex-col items-start gap-3.5">
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
          </div>
          <Link href="/bio" className="text-sm !text-sky-400 hover:!text-sky-300">
            Read full bio →
          </Link>
        </div>
      </section>
      <Suspense>
        <WorkGrid full={false} />
      </Suspense>
    </>
  );
}
