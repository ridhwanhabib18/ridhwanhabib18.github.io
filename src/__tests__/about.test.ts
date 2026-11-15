import { describe, expect, it } from 'vitest';
import { profile } from '../content/profile';
import { filterSkillGroups } from '../pages/About';

describe('About skill filter', () => {
  it('matches technology names case-insensitively and keeps only matching groups', () => {
    const filtered = filterSkillGroups('  REACT ');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].group.en).toBe('Frontend');
    expect(filtered[0].items).toContain('React');
    expect(filtered[0].items).not.toContain('TypeScript');
  });

  it('matches a category name and returns all its skills', () => {
    const filtered = filterSkillGroups('backend');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].group.en).toBe('Programming & Backend');
    expect(filtered[0].items).toEqual(profile.stack[0].items);
  });

  it('returns all skill groups for an empty query and none for an unknown query', () => {
    expect(filterSkillGroups(' ')).toEqual(profile.stack);
    expect(filterSkillGroups('no-such-skill')).toEqual([]);
  });
});
