import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Template validity across every template category.
 *
 * Templates are the consultant's deliverables. A malformed template is discovered
 * at the worst possible moment: when a client is waiting for a deliverable.
 */

const repoRoot = path.resolve(__dirname, '..');
const templatesDir = path.join(repoRoot, 'templates');

interface LoadedTemplate {
  relPath: string;
  category: string;
  data: Record<string, unknown>;
}

function walkJson(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkJson(full));
    else if (entry.name.endsWith('.json')) out.push(full);
  }
  return out;
}

const templates: LoadedTemplate[] = walkJson(templatesDir).map((abs) => {
  const relPath = path.relative(repoRoot, abs);
  return {
    relPath,
    category: path.basename(path.dirname(abs)),
    data: JSON.parse(fs.readFileSync(abs, 'utf-8')),
  };
});

describe('Template validity', () => {
  it('there are templates to test', () => {
    expect(templates.length).toBeGreaterThan(0);
  });

  it('every template file is valid JSON', () => {
    // Parsing already happened at load time; this asserts the load produced objects
    for (const t of templates) {
      expect(t.data, `${t.relPath} did not parse to an object`).toBeTypeOf('object');
      expect(t.data).not.toBeNull();
    }
  });

  /**
   * Property: every template declares a namespaced, versioned templateType.
   * Without it, a template cannot be identified or migrated.
   */
  it('Property: every template declares a namespaced versioned templateType', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: templates.length - 1 }), (index) => {
        const t = templates[index];
        const templateType = t.data.templateType as string | undefined;

        expect(templateType, `${t.relPath} missing templateType`).toBeDefined();
        expect(typeof templateType).toBe('string');
        expect(
          templateType!.startsWith('slot-machine-expert/'),
          `${t.relPath} templateType must be namespaced: ${templateType}`
        ).toBe(true);
        expect(
          /-v\d+$|-schema-v\d+$/.test(templateType!),
          `${t.relPath} templateType must be versioned: ${templateType}`
        ).toBe(true);
      }),
      { numRuns: 100 }
    );
  });

  it('all expected template categories are present', () => {
    const categories = new Set(templates.map((t) => t.category));
    for (const expected of ['market-profiles', 'certification', 'advisory', 'paytable', 'reel-strip']) {
      expect(categories, `missing template category: ${expected}`).toContain(expected);
    }
  });

  it('the consultant deliverable set is complete', () => {
    const expectedFiles = [
      'templates/advisory/compliance-gap-assessment.json',
      'templates/advisory/risk-register.json',
      'templates/advisory/market-entry-roadmap.json',
      'templates/advisory/incident-report.json',
      'templates/certification/par-sheet.json',
      'templates/certification/rng-submission-package.json',
      'templates/certification/change-management-request.json',
      'templates/certification/gli-submission-checklist.json',
      'templates/market-profiles/_schema.json',
    ];
    for (const f of expectedFiles) {
      expect(fs.existsSync(path.join(repoRoot, f)), `missing deliverable template: ${f}`).toBe(
        true
      );
    }
  });

  /**
   * Market profiles deliberately SHARE a templateType, because they are many
   * instances of one shape. Every other template is a distinct document type and
   * must therefore have its own templateType.
   */
  it('all market profiles share one templateType while other templates are distinct', () => {
    const marketProfileTypes = new Set(
      templates
        .filter((t) => t.category === 'market-profiles' && !path.basename(t.relPath).startsWith('_'))
        .map((t) => t.data.templateType)
    );
    expect(marketProfileTypes.size, 'market profiles must share a single templateType').toBe(1);

    const otherTypes = templates
      .filter((t) => t.category !== 'market-profiles')
      .map((t) => t.data.templateType);
    expect(
      new Set(otherTypes).size,
      'non-market-profile templates must each have a distinct templateType'
    ).toBe(otherTypes.length);
  });
});

describe('PAR sheet template completeness', () => {
  const parSheet = JSON.parse(
    fs.readFileSync(path.join(repoRoot, 'templates/certification/par-sheet.json'), 'utf-8')
  );

  it('contains all fifteen numbered sections', () => {
    const sectionKeys = Object.keys(parSheet).filter((k) => /^section\d+_/.test(k));
    expect(sectionKeys.length).toBe(15);

    // Sections must be numbered 1..15 with no gaps
    const numbers = sectionKeys
      .map((k) => parseInt(k.match(/^section(\d+)_/)![1], 10))
      .sort((a, b) => a - b);
    expect(numbers).toEqual(Array.from({ length: 15 }, (_, i) => i + 1));
  });

  it('includes the wager configuration matrix, the most commonly omitted section', () => {
    expect(parSheet.section14_wagerConfigurationMatrix).toBeDefined();
    expect(parSheet.section14_wagerConfigurationMatrix.lowestWagerRtp).toBeDefined();
    expect(parSheet.section14_wagerConfigurationMatrix.notes).toMatch(/all wager configurations/i);
  });

  it('includes maximum-prize probability, required for Germany and Brazil', () => {
    expect(parSheet.section10_volatility.probabilityOfMaximumPrize).toBeDefined();
    expect(parSheet.section10_volatility.notes).toMatch(/22a\(3\)/);
  });

  it('includes effective hit frequency, needed for the celebration prohibitions', () => {
    expect(parSheet.section9_hitFrequency.effectiveHitFrequency).toBeDefined();
    expect(parSheet.section9_hitFrequency.notes).toMatch(/14F|2\.20/);
  });

  it('binds the document to a specific build hash', () => {
    expect(parSheet.section1_gameIdentification.buildHash).toBeDefined();
    expect(parSheet.section1_gameIdentification.hashDigestBits).toBeDefined();
  });
});

describe('RNG submission package correctness', () => {
  const pkg = JSON.parse(
    fs.readFileSync(
      path.join(repoRoot, 'templates/certification/rng-submission-package.json'),
      'utf-8'
    )
  );

  it('lists only the statistical tests actually named in GLI-11 v3.0 / GLI-19 v3.0', () => {
    const named = (pkg.statisticalTesting.candidateTests as any[]).map((t) => t.test);
    expect(named).toEqual([
      'Total Distribution / Chi-square',
      'Overlaps',
      "Coupon Collector's",
      'Runs',
      'Interplay Correlation',
      'Serial Correlation',
      'Duplicates',
    ]);
  });

  it('explicitly flags KS, poker and gap tests as not GLI-mandated', () => {
    const notRequired = pkg.statisticalTesting.testsNotRequiredByGli;
    expect(notRequired).toBeDefined();
    expect(notRequired.note).toMatch(/NOT named in GLI-11/i);
    expect(notRequired).toHaveProperty('kolmogorovSmirnov');
    expect(notRequired).toHaveProperty('poker');
    expect(notRequired).toHaveProperty('gap');
  });

  it('carries the NIST SP 800-22 warning about cryptographic RNG assessment', () => {
    const sp22 = pkg.standardsBasis.nist.sp800_22_rev1a;
    expect(sp22.warning).toMatch(/rejecting the use of this suite/i);
  });

  it('records SP 800-90C as final, completing the 800-90 series', () => {
    expect(pkg.standardsBasis.nist.sp800_90c.date).toBe('2025-09');
  });

  it('states the 10,000 outcome sample size only for physical devices, not software RNGs', () => {
    const s = pkg.statisticalTesting.sampleSize;
    expect(s.softwareRngRequirement).toMatch(/No fixed sample size/i);
    expect(s.physicalDeviceRequirement).toMatch(/10,000/);
  });

  it('warns that GLI and iTech Labs are not independent of each other', () => {
    expect(pkg.submission.labAccreditationNotes).toMatch(/same corporate group/i);
  });
});
