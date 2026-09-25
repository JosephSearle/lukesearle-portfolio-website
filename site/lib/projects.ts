export type CategoryKey = 'feature' | 'short' | 'commercial' | 'music' | 'dev';

export type Project = {
  id: string;
  title: string;
  cat: CategoryKey;
  year: string;
  runtime: string;
  role: string;
  status: string;
  logline: string;
};

export const categories: { key: CategoryKey; label: string }[] = [
  { key: 'feature', label: 'Features' },
  { key: 'short', label: 'Shorts' },
  { key: 'commercial', label: 'Commercials' },
  { key: 'music', label: 'Music videos' },
  { key: 'dev', label: 'In development' },
];

export const projects: Project[] = [
  {
    id: 'p1',
    title: 'Low Tide',
    cat: 'dev',
    year: '2027',
    runtime: 'Feature',
    role: 'Writer / Director',
    status: 'In development',
    logline:
      'A fisherman’s daughter returns to the coast town she left, to settle a debt nobody will name.',
  },
  {
    id: 'p2',
    title: 'The Quiet Hours',
    cat: 'feature',
    year: '2025',
    runtime: '94 min',
    role: 'Director',
    status: 'Festival run',
    logline:
      'Over one night shift, a hospital porter and an insomniac patient build an unlikely truce.',
  },
  {
    id: 'p3',
    title: 'Paper Houses',
    cat: 'short',
    year: '2024',
    runtime: '14 min',
    role: 'Writer / Director',
    status: 'Completed',
    logline:
      'Two brothers dismantle their late father’s house, room by room, and argue about what stays.',
  },
  {
    id: 'p4',
    title: 'Northbound',
    cat: 'short',
    year: '2022',
    runtime: '11 min',
    role: 'Director / Editor',
    status: 'Completed',
    logline: 'A hitchhiker and a driver who won’t say where she’s going.',
  },
  {
    id: 'p5',
    title: 'Still Water',
    cat: 'short',
    year: '2020',
    runtime: '8 min',
    role: 'Director / DoP',
    status: 'Completed',
    logline: 'A swimmer trains alone through a closed winter.',
  },
  {
    id: 'p6',
    title: 'Field Notes',
    cat: 'commercial',
    year: '2025',
    runtime: '60 sec',
    role: 'Director',
    status: 'Released',
    logline: 'Brand film for an outdoor clothing label.',
  },
  {
    id: 'p7',
    title: 'First Light',
    cat: 'commercial',
    year: '2023',
    runtime: '30 sec',
    role: 'Director',
    status: 'Released',
    logline: 'Broadcast spot for a regional rail operator.',
  },
  {
    id: 'p8',
    title: 'Glasshouse',
    cat: 'music',
    year: '2024',
    runtime: '4 min',
    role: 'Director',
    status: 'Released',
    logline: 'Single-take performance video.',
  },
];

export const skills = ['Directing', 'Writing', 'Cinematography', 'Editing', 'Colour'];

export const skillsFull = [
  'Directing',
  'Screenwriting',
  'Cinematography',
  'Editing',
  'Colour grading',
  'Casting',
  'Working with actors',
  'Storyboarding',
  'Premiere Pro',
  'DaVinci Resolve',
];

export const experience = [
  { year: '2025', title: 'The Quiet Hours', role: 'Director' },
  { year: '2025', title: 'Field Notes — brand film', role: 'Director' },
  { year: '2024', title: 'Paper Houses', role: 'Writer / Director' },
  { year: '2024', title: 'Glasshouse — music video', role: 'Director' },
  { year: '2022', title: 'Northbound', role: 'Director / Editor' },
];

export function catLabel(key: string): string {
  return categories.find((c) => c.key === key)?.label ?? key;
}

/** Newest first, matching the design's sort. */
export const sortedProjects: Project[] = [...projects].sort((a, b) => b.year.localeCompare(a.year));

export function filterProjects(filter: string): Project[] {
  return filter === 'all' ? sortedProjects : sortedProjects.filter((p) => p.cat === filter);
}

export function isFilterKey(value: string | null | undefined): value is CategoryKey {
  return categories.some((c) => c.key === value);
}

export function neighbours(id: string): { prev: Project; next: Project } {
  const idx = Math.max(
    0,
    sortedProjects.findIndex((p) => p.id === id),
  );
  const n = sortedProjects.length;
  return { prev: sortedProjects[(idx - 1 + n) % n], next: sortedProjects[(idx + 1) % n] };
}
