'use client';

import { catLabel, categories, filterProjects, isFilterKey } from '@/lib/projects';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ImageSlot } from './ImageSlot';

/** Project grid. On /work the filter comes from ?filter=; on the home page it is always "all". */
export function WorkGrid({ full }: { full: boolean }) {
  const params = useSearchParams();
  const raw = params.get('filter');
  const filter = full && isFilterKey(raw) ? raw : 'all';
  const list = filterProjects(filter);
  const title = filter === 'all' ? 'Work' : catLabel(filter);
  const tabs = [{ key: 'all', label: 'All' }, ...categories];

  return (
    <section>
      <div
        className={`flex flex-wrap items-end justify-between gap-5 border-t border-white/[0.06] ${
          full
            ? 'px-[clamp(20px,4vw,48px)] pb-7 pt-[clamp(48px,7vw,88px)]'
            : 'px-[clamp(20px,4vw,48px)] pb-5 pt-7'
        }`}
      >
        <h2
          className={`m-0 font-semibold tracking-[-0.03em] text-white ${
            full ? 'text-[clamp(32px,4vw,48px)]' : 'text-xl'
          }`}
        >
          {title}
        </h2>
        <div className="flex flex-wrap gap-1">
          {tabs.map((t) => (
            <Link
              key={t.key}
              href={t.key === 'all' ? '/work' : `/work?filter=${t.key}`}
              className={`rounded-full px-3 py-1.5 text-[13px] transition-colors duration-150 hover:!text-white ${
                filter === t.key ? 'bg-white/[0.08] !text-white' : '!text-slate-400'
              }`}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="grid gap-0.5 [grid-template-columns:repeat(auto-fill,minmax(min(100%,480px),1fr))]">
        {list.map((p) => (
          <article key={p.id} className="flex flex-col bg-slate-950">
            <div className="relative aspect-video bg-slate-900">
              <ImageSlot label={`Still — ${p.title}`} />
            </div>
            <Link
              href={`/work/${p.id}`}
              className="flex items-baseline justify-between gap-4 px-[clamp(20px,2vw,24px)] pb-[26px] pt-3.5 transition-colors duration-150 hover:!text-sky-400"
            >
              <span className="text-[15px] font-medium">{p.title}</span>
              <span className="whitespace-nowrap text-[13px] text-slate-500">
                {catLabel(p.cat)} · {p.year}
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
