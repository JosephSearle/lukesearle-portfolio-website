import { Still } from '@/components/Still';
import { VideoPlayer } from '@/components/VideoPlayer';
import { catLabel, findProject, neighbours, sortedProjects } from '@/lib/projects';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamicParams = false;

export function generateStaticParams() {
  return sortedProjects.map((p) => ({ slug: p.slug }));
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) notFound();
  const { prev, next } = neighbours(project.slug);
  const facts: [string, string][] = [
    ['Year', project.year],
    ['Format', `${catLabel(project.category)} · ${project.runtime}`],
    ['Role', project.role],
    ['Status', project.status],
  ];

  return (
    <article>
      <div className="relative min-h-[280px] w-full bg-slate-900 [aspect-ratio:2.39/1]">
        <Still media={project.hero} priority />
      </div>
      <div className="mx-auto grid max-w-[1280px] gap-x-20 gap-y-10 px-[clamp(20px,4vw,48px)] py-[clamp(40px,6vw,72px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr))]">
        <div>
          <Link
            href={`/work?filter=${project.category}`}
            className="text-[13px] !text-slate-500 hover:!text-sky-400"
          >
            ← {catLabel(project.category)}
          </Link>
          <h1 className="mb-0 mt-3.5 text-[clamp(36px,5vw,56px)] font-semibold leading-[1.05] tracking-[-0.04em] text-white">
            {project.title}
          </h1>
          <p className="mt-5 max-w-[560px] text-pretty text-lg leading-relaxed text-slate-300">
            {project.logline}
          </p>
        </div>
        <dl className="m-0 grid self-end gap-x-8 gap-y-3 text-sm [grid-template-columns:auto_1fr]">
          {facts.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="text-slate-500">{k}</dt>
              <dd className="m-0 text-slate-200">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      {project.videos.length > 0 && (
        <div className="mx-auto flex max-w-[1280px] flex-col gap-6 px-[clamp(20px,4vw,48px)] pb-[clamp(40px,6vw,72px)]">
          {project.videos.map((v) => (
            <div key={v.src ?? v.url} className="aspect-video w-full overflow-hidden bg-slate-900">
              <VideoPlayer video={v} fallbackTitle={project.title} />
            </div>
          ))}
        </div>
      )}
      {project.stills.length > 0 && (
        <div className="grid gap-0.5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
          {project.stills.map((s) => (
            <div key={s.src} className="relative aspect-video bg-slate-900">
              <Still media={s} />
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-between gap-5 border-b border-white/[0.06] px-[clamp(20px,4vw,48px)] py-8 text-sm">
        <Link href={`/work/${prev.slug}`} className="!text-slate-400 hover:!text-white">
          ← {prev.title}
        </Link>
        <Link href={`/work/${next.slug}`} className="text-right !text-slate-400 hover:!text-white">
          {next.title} →
        </Link>
      </div>
    </article>
  );
}
