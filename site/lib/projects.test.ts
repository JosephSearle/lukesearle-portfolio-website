import { describe, expect, it } from 'vitest';
import { catLabel, filterProjects, isFilterKey, neighbours, sortedProjects } from './projects';

describe('projects', () => {
  it('sorts newest first', () => {
    expect(sortedProjects[0].year).toBe('2027');
  });

  it('filters by category and returns everything for "all"', () => {
    expect(filterProjects('short').every((p) => p.cat === 'short')).toBe(true);
    expect(filterProjects('all')).toHaveLength(sortedProjects.length);
  });

  it('wraps prev/next around the ends', () => {
    const first = sortedProjects[0];
    const last = sortedProjects[sortedProjects.length - 1];
    expect(neighbours(first.id).prev.id).toBe(last.id);
    expect(neighbours(last.id).next.id).toBe(first.id);
  });

  it('labels categories and validates filter keys', () => {
    expect(catLabel('music')).toBe('Music videos');
    expect(isFilterKey('feature')).toBe(true);
    expect(isFilterKey('nope')).toBe(false);
  });
});
