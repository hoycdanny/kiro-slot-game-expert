import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Hook / steering synchronisation.
 *
 * The auto-guidance hook is what routes a user question to the right steering
 * file. When a steering file is added but the hook is not updated, that guidance
 * becomes unreachable and the failure is completely silent - the Power simply
 * answers without the knowledge it has on disk. That is the exact defect this
 * suite exists to prevent.
 */

const repoRoot = path.resolve(__dirname, '..');
const steeringDir = path.join(repoRoot, 'steering');
const hooksDir = path.join(repoRoot, 'hooks');

const steeringFiles = fs
  .readdirSync(steeringDir)
  .filter((f) => f.endsWith('.md'))
  .sort();

interface LoadedHook {
  file: string;
  raw: string;
  prompt: string;
}

function extractPrompt(raw: string): string {
  const parsed = JSON.parse(raw);

  // v1 agent-hook format: { version, hooks: [ { action: { type, prompt } } ] }
  if (Array.isArray(parsed.hooks)) {
    return parsed.hooks
      .map((h: any) => h.action?.prompt ?? '')
      .join('\n');
  }

  // legacy .kiro.hook format: { when, then: { type, prompt } }
  return parsed.then?.prompt ?? '';
}

const hooks: LoadedHook[] = fs
  .readdirSync(hooksDir)
  .filter((f) => f.endsWith('.kiro.hook') || f.endsWith('.json'))
  .map((file) => {
    const raw = fs.readFileSync(path.join(hooksDir, file), 'utf-8');
    return { file, raw, prompt: extractPrompt(raw) };
  });

describe('Hook and steering synchronisation', () => {
  it('there is at least one hook shipped', () => {
    expect(hooks.length).toBeGreaterThan(0);
  });

  it('every hook file is valid JSON with a non-empty prompt', () => {
    for (const hook of hooks) {
      expect(() => JSON.parse(hook.raw), `${hook.file} must be valid JSON`).not.toThrow();
      expect(hook.prompt.length, `${hook.file} has an empty prompt`).toBeGreaterThan(100);
    }
  });

  /**
   * The core property: every steering file on disk must be routable from every
   * shipped hook. If this fails, guidance exists but will never be loaded.
   */
  it('Property: every steering file is referenced by every hook', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: hooks.length - 1 }),
        fc.integer({ min: 0, max: steeringFiles.length - 1 }),
        (hookIndex, steeringIndex) => {
          const hook = hooks[hookIndex];
          const steering = steeringFiles[steeringIndex];

          expect(
            hook.prompt,
            `${hook.file} does not route to ${steering}; that steering file is unreachable`
          ).toContain(steering);
        }
      ),
      { numRuns: 200 }
    );
  });

  it('every hook enforces the three non-negotiable advisory rules', () => {
    for (const hook of hooks) {
      expect(hook.prompt, `${hook.file} must require asking for the jurisdiction`).toMatch(
        /JURISDICTION FIRST/i
      );
      expect(hook.prompt, `${hook.file} must forbid guessing regulatory values`).toMatch(
        /NEVER GUESS A NUMBER/i
      );
      expect(hook.prompt, `${hook.file} must disclaim legal advice`).toMatch(
        /DO NOT GIVE LEGAL ADVICE/i
      );
    }
  });

  it('every hook lists the confidence levels', () => {
    for (const hook of hooks) {
      for (const level of ['HIGH', 'MEDIUM', 'UNVERIFIED']) {
        expect(hook.prompt, `${hook.file} must mention confidence level ${level}`).toContain(level);
      }
    }
  });

  it('every hook lists the immediate red flags', () => {
    for (const hook of hooks) {
      expect(hook.prompt, `${hook.file} must flag non-cryptographic RNG`).toMatch(
        /Math\.random|non-cryptographic/i
      );
      expect(hook.prompt, `${hook.file} must flag client-side outcome determination`).toMatch(
        /client/i
      );
    }
  });

  it('every hook carries the proactive warnings that clients most often get wrong', () => {
    for (const hook of hooks) {
      // GLI certification is not multi-market compliance
      expect(hook.prompt, `${hook.file} must warn that GLI certification is not market compliance`)
        .toMatch(/GLI-19 4\.9\.2/);
      // Malta 92% is unverified
      expect(hook.prompt, `${hook.file} must warn about the Malta 92% figure`).toMatch(/92%/);
      // Prohibited markets
      expect(hook.prompt, `${hook.file} must warn about prohibited markets`).toMatch(
        /PROHIBITED in Australia/i
      );
    }
  });

  it('the v1 agent-hook format file uses the documented schema', () => {
    const v1 = hooks.find((h) => h.file.endsWith('.json'));
    expect(v1, 'a hook in the current v1 agent-hook format must be shipped').toBeDefined();

    const parsed = JSON.parse(v1!.raw);
    expect(parsed.version).toBe('v1');
    expect(Array.isArray(parsed.hooks)).toBe(true);
    expect(parsed.hooks[0].trigger).toBe('UserPromptSubmit');
    expect(parsed.hooks[0].action.type).toBe('agent');
    expect(parsed.hooks[0].name).toBeTruthy();
  });
});
