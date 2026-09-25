import { Pill } from '@/components/Pill';
import { experience, skillsFull } from '@/lib/projects';

export const metadata = { title: 'Bio — Luke Searle' };

export default function BioPage() {
  return (
    <section className="mx-auto grid max-w-[1280px] gap-x-20 gap-y-14 px-[clamp(20px,4vw,48px)] py-[clamp(48px,8vw,96px)] [grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr))]">
      <div className="relative self-start bg-slate-900 [aspect-ratio:4/5]">
        <div className="absolute inset-0 flex items-center justify-center text-[13px] text-slate-500">
          Portrait
        </div>
      </div>
      <div className="flex flex-col gap-12">
        <div>
          <h1 className="m-0 text-[clamp(36px,5vw,56px)] font-semibold tracking-[-0.04em] text-white">
            Bio
          </h1>
          <div className="mt-6 flex max-w-[620px] flex-col gap-[18px] text-pretty text-[17px] leading-[1.7] text-slate-300">
            <p className="m-0">
              Luke Searle is a director and filmmaker whose work moves between narrative fiction,
              commercials and music video. His films favour small, specific characters and long,
              patient takes.
            </p>
            <p className="m-0">
              He began making shorts under the name On Tap Films, writing, shooting and cutting his
              own work before moving into directing for brands and artists. His short films have
              screened at festivals in the UK and abroad.
            </p>
            <p className="m-0">He is currently developing his first feature.</p>
          </div>
        </div>
        <div>
          <h2 className="mb-3 mt-0 text-[13px] font-medium text-slate-500">Selected experience</h2>
          <div className="flex flex-col">
            {experience.map((e) => (
              <div
                key={`${e.year}-${e.title}`}
                className="grid gap-4 border-t border-white/[0.06] py-3.5 text-[15px] [grid-template-columns:64px_1fr_auto]"
              >
                <span className="tabular-nums text-slate-500">{e.year}</span>
                <span className="text-slate-100">{e.title}</span>
                <span className="text-slate-400">{e.role}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="mb-3.5 mt-0 text-[13px] font-medium text-slate-500">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skillsFull.map((s) => (
              <Pill key={s}>{s}</Pill>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
