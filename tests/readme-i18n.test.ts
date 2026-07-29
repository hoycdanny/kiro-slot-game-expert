import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * README internationalisation consistency.
 *
 * Multi-language READMEs drift in two predictable ways: a new language file is
 * added but the switcher in the other files is not updated, and counts stated in
 * one language fall out of step with the repository. Both are tested here.
 */

const repoRoot = path.resolve(__dirname, '..');

const EXPECTED_READMES = [
  { file: 'README.md', label: 'English' },
  { file: 'README_ZH.md', label: '繁體中文' },
  { file: 'README_CN.md', label: '简体中文' },
  { file: 'README_JP.md', label: '日本語' },
  { file: 'README_KR.md', label: '한국어' },
];

const readmes = EXPECTED_READMES.map(({ file, label }) => ({
  file,
  label,
  content: fs.existsSync(path.join(repoRoot, file))
    ? fs.readFileSync(path.join(repoRoot, file), 'utf-8').replace(/\r\n/g, '\n')
    : null,
}));

// Counts derived from the repository itself, so the assertions cannot go stale
const steeringCount = fs
  .readdirSync(path.join(repoRoot, 'steering'))
  .filter((f) => f.endsWith('.md')).length;

const marketProfileCount = fs
  .readdirSync(path.join(repoRoot, 'templates', 'market-profiles'))
  .filter((f) => f.endsWith('.json') && !f.startsWith('_')).length;

describe('README internationalisation', () => {
  it('all five language READMEs exist', () => {
    for (const r of readmes) {
      expect(r.content, `${r.file} is missing`).not.toBeNull();
    }
  });

  /**
   * Property: every README must link to every other README. A one-way switcher
   * strands readers in a language they did not choose.
   */
  it('Property: every README links to every language version', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: readmes.length - 1 }),
        fc.integer({ min: 0, max: EXPECTED_READMES.length - 1 }),
        (sourceIndex, targetIndex) => {
          const source = readmes[sourceIndex];
          const target = EXPECTED_READMES[targetIndex];

          expect(
            source.content,
            `${source.file} must link to ${target.file} as [${target.label}]`
          ).toContain(`[${target.label}](${target.file})`);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('the language switcher sits on the second non-empty line of every README', () => {
    for (const r of readmes) {
      const lines = r.content!.split('\n').filter((l) => l.trim().length > 0);
      expect(lines[1], `${r.file} switcher placement`).toContain('](README.md)');
    }
  });

  it('no README references the retired README_TW.md filename', () => {
    for (const r of readmes) {
      expect(r.content, `${r.file} still references README_TW.md`).not.toContain('README_TW.md');
    }
    expect(
      fs.existsSync(path.join(repoRoot, 'README_TW.md')),
      'README_TW.md was renamed to README_ZH.md and should no longer exist'
    ).toBe(false);
  });

  /**
   * Counts are stated in prose across five languages. Derive them from the repo
   * so a structural change cannot silently leave four translations wrong.
   */
  it('every README states the correct steering file count', () => {
    for (const r of readmes) {
      expect(
        r.content,
        `${r.file} must state the steering count of ${steeringCount}`
      ).toMatch(new RegExp(`${steeringCount}\\s*(domain knowledge|份|个|のドメイン|개 도메인)`));
    }
  });

  it('every README states the correct market profile count', () => {
    for (const r of readmes) {
      expect(
        r.content,
        `${r.file} must state the market profile count of ${marketProfileCount}`
      ).toContain(String(marketProfileCount));
    }
  });

  it('every README carries the confidence level vocabulary', () => {
    for (const r of readmes) {
      for (const level of ['HIGH', 'MEDIUM', 'UNVERIFIED']) {
        expect(r.content, `${r.file} must document confidence level ${level}`).toContain(level);
      }
    }
  });

  it('every README warns about the prohibited markets', () => {
    for (const r of readmes) {
      expect(r.content, `${r.file} must include the prohibited market warning`).toMatch(/⛔/);
    }
  });

  it('every README carries the Malta 92% and NIST SP 800-22 corrections', () => {
    for (const r of readmes) {
      expect(r.content, `${r.file} must include the Malta 92% correction`).toContain('92%');
      expect(r.content, `${r.file} must include the SP 800-22 correction`).toContain('800-22');
    }
  });

  /**
   * The Japanese and Korean editions target jurisdictions where online slots are
   * unlawful. Those readers need the prohibition stated in their own language up
   * front, not buried in an English market table.
   */
  it('the Japanese and Korean READMEs state their own jurisdiction prohibition prominently', () => {
    const jp = readmes.find((r) => r.file === 'README_JP.md')!;
    expect(jp.content, 'README_JP.md must cite the Japanese Penal Code articles').toMatch(/185/);
    expect(jp.content, 'README_JP.md must reference the 2025 amendment').toMatch(/2025/);

    const kr = readmes.find((r) => r.file === 'README_KR.md')!;
    expect(kr.content, 'README_KR.md must cite the Korean Criminal Act articles').toMatch(/246/);
    expect(kr.content, 'README_KR.md must state the prohibition').toMatch(/불법/);
  });
});
