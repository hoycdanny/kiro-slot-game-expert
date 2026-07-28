import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Steering registration consistency.
 *
 * A steering file that exists on disk but is not registered in POWER.md is dead
 * weight: Kiro will never load it. A registration that points at a missing file
 * is a broken Power. Both failures are silent, so they are tested here.
 */

const repoRoot = path.resolve(__dirname, '..');
const steeringDir = path.join(repoRoot, 'steering');
const powerMdPath = path.join(repoRoot, 'POWER.md');

const powerMd = fs.readFileSync(powerMdPath, 'utf-8').replace(/\r\n/g, '\n');

function steeringFilesOnDisk(): string[] {
  return fs
    .readdirSync(steeringDir)
    .filter((f) => f.endsWith('.md'))
    .sort();
}

interface Registration {
  heading: string;
  file: string;
  trigger?: string;
  description?: string;
}

function parseRegistrations(): Registration[] {
  const section = powerMd.match(/## Steering\s*\n([\s\S]*?)(?=\n## )/);
  if (!section) return [];

  const blocks = section[1].split(/\n(?=### )/).filter((b) => b.trim().startsWith('###'));

  return blocks.map((block) => {
    const heading = (block.match(/^###\s+(.+)$/m) ?? [, ''])[1].trim();
    const file = (block.match(/^-\s+file:\s*(.+)$/m) ?? [, ''])[1].trim();
    const trigger = (block.match(/^-\s+trigger:\s*(.+)$/m) ?? [, undefined])[1]?.trim();
    const description = (block.match(/^-\s+description:\s*(.+)$/m) ?? [, undefined])[1]?.trim();
    return { heading, file, trigger, description };
  });
}

const onDisk = steeringFilesOnDisk();
const registrations = parseRegistrations();

describe('Steering registration consistency', () => {
  it('POWER.md declares at least one steering directive', () => {
    expect(registrations.length).toBeGreaterThan(0);
  });

  it('every registered steering file exists on disk', () => {
    for (const reg of registrations) {
      const abs = path.join(repoRoot, reg.file);
      expect(fs.existsSync(abs), `registered but missing: ${reg.file}`).toBe(true);
    }
  });

  it('every steering file on disk is registered in POWER.md', () => {
    const registeredBasenames = registrations.map((r) => path.basename(r.file)).sort();
    for (const file of onDisk) {
      expect(registeredBasenames, `on disk but not registered in POWER.md: ${file}`).toContain(
        file
      );
    }
  });

  it('no steering file is registered twice', () => {
    const files = registrations.map((r) => r.file);
    expect(new Set(files).size).toBe(files.length);
  });

  /**
   * Property: for any registration, the trigger and description must both be
   * present and substantive. A registration without a trigger will not fire
   * reliably, which makes the guidance effectively unreachable.
   */
  it('Property: every registration has a substantive trigger and description', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: registrations.length - 1 }), (index) => {
        const reg = registrations[index];

        expect(reg.file, `${reg.heading} file`).toBeTruthy();
        expect(reg.file.startsWith('steering/'), `${reg.heading} file path`).toBe(true);

        expect(reg.trigger, `${reg.heading} trigger`).toBeDefined();
        expect(reg.trigger!.length, `${reg.heading} trigger too short`).toBeGreaterThan(20);

        expect(reg.description, `${reg.heading} description`).toBeDefined();
        expect(reg.description!.length, `${reg.heading} description too short`).toBeGreaterThan(10);
      }),
      { numRuns: 100 }
    );
  });

  it('the registration heading matches the referenced filename', () => {
    for (const reg of registrations) {
      expect(reg.heading, `heading/file mismatch for ${reg.file}`).toBe(path.basename(reg.file));
    }
  });

  it('every steering file is non-trivial and has a top-level heading', () => {
    for (const file of onDisk) {
      const content = fs.readFileSync(path.join(steeringDir, file), 'utf-8');
      expect(content.length, `${file} is suspiciously short`).toBeGreaterThan(500);
      expect(content, `${file} needs a level-1 heading`).toMatch(/^#\s+.+/m);
    }
  });
});

describe('Cross-reference integrity', () => {
  /**
   * The steering set is designed to cross-reference: the jurisdiction matrix points
   * at the market profiles, the advisory workflow points at the templates. A broken
   * relative reference sends the consultant to a file that does not exist.
   */
  it('every steering/*.md referenced from another steering file exists', () => {
    for (const file of onDisk) {
      const content = fs.readFileSync(path.join(steeringDir, file), 'utf-8');
      const refs = content.match(/`([a-z0-9-]+\.md)`/g) ?? [];
      for (const raw of refs) {
        const name = raw.replace(/`/g, '');
        expect(onDisk, `${file} references missing steering file ${name}`).toContain(name);
      }
    }
  });

  it('every templates/ path referenced from a steering file exists', () => {
    for (const file of onDisk) {
      const content = fs.readFileSync(path.join(steeringDir, file), 'utf-8');
      const refs = content.match(/templates\/[a-z0-9-]+\/[a-z0-9-]+\.json/g) ?? [];
      for (const ref of refs) {
        expect(
          fs.existsSync(path.join(repoRoot, ref)),
          `${file} references missing template ${ref}`
        ).toBe(true);
      }
    }
  });
});
