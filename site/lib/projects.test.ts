import { describe, expect, it } from 'vitest';
import { catLabel, filterProjects, isFilterKey, neighbours, sortedProjects } from './projects';

describe('projects', () => {
  it('is sorted newest first', () => {
    const years = sortedProjects.map((p) => p.year);
    expect(years).toEqual([...years].sort().reverse());
  });

  it('filters by category and returns everything for "all"', () => {
    expect(filterProjects('short').every((p) => p.category === 'short')).toBe(true);
    expect(filterProjects('all')).toHaveLength(sortedProjects.length);
  });

  it('wraps prev/next around the ends', () => {
    const first = sortedProjects[0];
    const last = sortedProjects[sortedProjects.length - 1];
    expect(neighbours(first.slug).prev.slug).toBe(last.slug);
    expect(neighbours(last.slug).next.slug).toBe(first.slug);
  });

  it('labels categories and validates filter keys', () => {
    expect(catLabel('music')).toBe('Music videos');
    expect(isFilterKey('feature')).toBe(true);
    expect(isFilterKey('nope')).toBe(false);
  });
});
