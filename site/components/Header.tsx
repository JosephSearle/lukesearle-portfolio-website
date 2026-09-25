'use client';

import { categories, sortedProjects } from '@/lib/projects';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navLink = 'transition-colors duration-150 hover:text-white';

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const active = (path: string) =>
    (path === '/' ? pathname === '/' : pathname.startsWith(path)) ? 'text-white' : 'text-slate-400';
  const close = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-slate-950/80 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-6 px-[clamp(20px,4vw,48px)] py-5">
        <Link href="/" className="text-[15px] font-semibold tracking-[0.02em] !text-white">
          Luke Searle
        </Link>
        <nav className="flex items-center gap-[clamp(16px,3vw,36px)] text-sm">
          <Link href="/" className={`${navLink} ${active('/')}`}>
            Home
          </Link>
          <div className="relative" onMouseEnter={() => setMenuOpen(true)} onMouseLeave={close}>
            <button
              type="button"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
              className={`flex items-center gap-1.5 ${navLink} ${active('/work')}`}
            >
              Work
              <svg
                width="14"
                height="14"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            {menuOpen && (
              <div className="absolute -right-4 top-full w-[min(340px,86vw)] pt-3.5">
                <div className="max-h-[70vh] overflow-auto rounded-xl border border-white/[0.08] bg-slate-900 p-2 shadow-menu">
                  <Link
                    href="/work"
                    onClick={close}
                    className="block rounded-lg px-3 py-2.5 text-sm font-medium !text-white hover:bg-white/5"
                  >
                    All work
                  </Link>
                  {categories.map((c) => {
                    const items = sortedProjects.filter((p) => p.cat === c.key);
                    if (items.length === 0) return null;
                    return (
                      <div key={c.key} className="mt-1.5 border-t border-white/[0.06] pt-1.5">
                        <Link
                          href={`/work?filter=${c.key}`}
                          onClick={close}
                          className="block px-3 pb-1 pt-2 text-xs font-medium !text-slate-400 hover:!text-sky-400"
                        >
                          {c.label}
                        </Link>
                        {items.map((p) => (
                          <Link
                            key={p.id}
                            href={`/work/${p.id}`}
                            onClick={close}
                            className="flex justify-between gap-4 rounded-lg px-3 py-[7px] text-sm !text-slate-200 hover:bg-white/5 hover:!text-white"
                          >
                            <span>{p.title}</span>
                            <span className="tabular-nums text-slate-500">{p.year}</span>
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <Link href="/bio" className={`${navLink} ${active('/bio')}`}>
            Bio
          </Link>
          <Link href="/contact" className={`${navLink} ${active('/contact')}`}>
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
