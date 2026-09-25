export const metadata = { title: 'Contact — Luke Searle' };

const label = 'mb-1.5 text-[13px] text-slate-500';

export default function ContactPage() {
  return (
    <section className="mx-auto flex max-w-[1280px] flex-col gap-16 px-[clamp(20px,4vw,48px)] py-[clamp(64px,12vw,160px)]">
      <div>
        <h1 className="m-0 text-[13px] font-medium text-slate-500">Contact</h1>
        <a
          href="mailto:hello@lukesearle.com"
          className="mt-4 inline-block text-[clamp(32px,6vw,72px)] font-semibold leading-[1.05] tracking-[-0.04em]"
        >
          hello@lukesearle.com
        </a>
      </div>
      <div className="grid gap-8 text-[15px] leading-[1.7] [grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))]">
        <div>
          <div className={label}>Representation</div>
          <div className="text-slate-200">
            Agent name
            <br />
            Agency
          </div>
        </div>
        <div>
          <div className={label}>Based in</div>
          <div className="text-slate-200">City, Country</div>
        </div>
        <div>
          <div className={label}>Elsewhere</div>
          <div className="flex flex-col">
            <span>Vimeo</span>
            <span>Instagram</span>
            <span>IMDb</span>
          </div>
        </div>
      </div>
    </section>
  );
}
