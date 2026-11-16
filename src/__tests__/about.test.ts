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

  it('narrows to one category and combines it with a search', () => {
    const frontend = filterSkillGroups('', 'Frontend');
    expect(frontend).toHaveLength(1);
    expect(frontend[0].items).toContain('React');
    expect(filterSkillGroups('react', 'Frontend')[0].items).toContain('React');
    expect(filterSkillGroups('react', 'Programming & Backend')).toEqual([]);
  });

  it('lists core technologies that are really in the skills section, once each', () => {
    const all = profile.stack.flatMap((g) => g.items);
    for (const core of profile.coreSkills) {
      expect(all.some((item) => item === core || item.startsWith(`${core} `) || item.startsWith(`${core} (`)), core).toBe(true);
    }
    expect(new Set(profile.coreSkills).size).toBe(profile.coreSkills.length);
    expect(profile.coreSkills.length).toBeLessThanOrEqual(6);
  });

  it('returns all skill groups for an empty query and none for an unknown query', () => {
    expect(filterSkillGroups(' ')).toEqual(profile.stack);
    expect(filterSkillGroups('no-such-skill')).toEqual([]);
  });
});
