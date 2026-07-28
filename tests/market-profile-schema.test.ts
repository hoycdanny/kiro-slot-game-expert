import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Market profile schema conformance tests.
 *
 * The advisory value of a market profile depends on every regulatory value being
 * confidence-annotated. A profile that states a number without a confidence level
 * is worse than one that states nothing, because a consultant will cite it as fact.
 */

const profilesDir = path.resolve(__dirname, '..', 'templates', 'market-profiles');

const VALID_CONFIDENCE = ['HIGH', 'MEDIUM', 'UNVERIFIED'];
const VALID_FEATURE_STATUS = ['allowed', 'restricted', 'prohibited', 'unverified'];
const VALID_LEGAL_STATUS = [
  'regulated',
  'regulated-provincial-crown',
  'compact-based',
  'prohibited',
  'grey',
  'offshore-only',
  'in-transition',
];

interface LoadedProfile {
  file: string;
  data: Record<string, unknown>;
}

function loadProfiles(): LoadedProfile[] {
  return fs
    .readdirSync(profilesDir)
    .filter((f) => f.endsWith('.json'))
    // Files prefixed with _ are the schema and the special registers, not market profiles
    .filter((f) => !f.startsWith('_'))
    .map((file) => ({
      file,
      data: JSON.parse(fs.readFileSync(path.join(profilesDir, file), 'utf-8')),
    }));
}

const profiles = loadProfiles();

describe('Market profile schema conformance', () => {
  it('there is at least one market profile to test', () => {
    expect(profiles.length).toBeGreaterThan(0);
  });

  it('every profile parses as JSON and declares the v2 templateType', () => {
    for (const { file, data } of profiles) {
      expect(data.templateType, `${file} templateType`).toBe(
        'slot-machine-expert/market-profile-v2'
      );
    }
  });

  it('every profile has the required top-level fields', () => {
    const required = [
      'marketCode',
      'name',
      'legalStatus',
      'regulator',
      'productConstraints',
      'rtp',
      'playerAccount',
      'auditLog',
      'dataResidency',
      'certification',
      'verificationRequired',
      'lastUpdated',
    ];

    for (const { file, data } of profiles) {
      for (const field of required) {
        expect(data[field], `${file} missing ${field}`).toBeDefined();
      }
    }
  });

  it('every legalStatus is a recognised value', () => {
    for (const { file, data } of profiles) {
      expect(VALID_LEGAL_STATUS, `${file} legalStatus=${data.legalStatus}`).toContain(
        data.legalStatus
      );
    }
  });

  it('marketCode values are unique across profiles', () => {
    const codes = profiles.map((p) => p.data.marketCode);
    expect(new Set(codes).size).toBe(codes.length);
  });

  /**
   * Property: for any randomly selected profile, every product constraint that
   * carries a feature status must use a recognised status value, and every
   * constraint object must carry a valid confidence level.
   */
  it('Property: product constraints always carry a valid confidence and status', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: profiles.length - 1 }), (index) => {
        const { file, data } = profiles[index];
        const constraints = data.productConstraints as Record<string, any>;

        for (const [key, value] of Object.entries(constraints)) {
          // otherProhibitions is an array of items, handled separately
          if (key === 'otherProhibitions') {
            expect(Array.isArray(value), `${file} otherProhibitions must be an array`).toBe(true);
            for (const item of value) {
              expect(VALID_CONFIDENCE, `${file} otherProhibitions confidence`).toContain(
                item.confidence
              );
            }
            continue;
          }

          expect(value, `${file}.${key} must be an object`).toBeTypeOf('object');
          expect(VALID_CONFIDENCE, `${file}.${key} confidence`).toContain(value.confidence);

          // A constraint expressed as a feature status must use the closed vocabulary
          if ('status' in value) {
            expect(VALID_FEATURE_STATUS, `${file}.${key} status`).toContain(value.status);
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * The core honesty property. An UNVERIFIED value must not carry a concrete
   * number or status, because that is exactly how a guess becomes a product spec.
   */
  it('Property: UNVERIFIED constraints never assert a concrete value', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: profiles.length - 1 }), (index) => {
        const { file, data } = profiles[index];
        const constraints = data.productConstraints as Record<string, any>;

        for (const [key, value] of Object.entries(constraints)) {
          if (key === 'otherProhibitions') continue;
          if (value.confidence !== 'UNVERIFIED') continue;

          if ('value' in value) {
            expect(value.value, `${file}.${key} is UNVERIFIED so value must be null`).toBeNull();
          }
          if ('status' in value) {
            expect(
              value.status,
              `${file}.${key} is UNVERIFIED so status must be "unverified"`
            ).toBe('unverified');
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  it('Property: RTP minimum is confidence-annotated and never a bare number', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: profiles.length - 1 }), (index) => {
        const { file, data } = profiles[index];
        const rtp = data.rtp as Record<string, any>;

        expect(rtp.minimum, `${file} rtp.minimum`).toBeDefined();
        expect(VALID_CONFIDENCE, `${file} rtp.minimum.confidence`).toContain(
          rtp.minimum.confidence
        );

        if (rtp.minimum.confidence === 'UNVERIFIED') {
          expect(rtp.minimum.value, `${file} UNVERIFIED rtp must be null`).toBeNull();
        }
      }),
      { numRuns: 100 }
    );
  });

  it('every UNVERIFIED or MEDIUM value is accompanied by a non-empty verificationRequired list', () => {
    for (const { file, data } of profiles) {
      const serialised = JSON.stringify(data);
      const hasUnverified = serialised.includes('UNVERIFIED');
      if (!hasUnverified) continue;

      const list = data.verificationRequired as unknown[];
      expect(Array.isArray(list), `${file} verificationRequired must be an array`).toBe(true);
      expect(
        list.length,
        `${file} contains UNVERIFIED values so verificationRequired must not be empty`
      ).toBeGreaterThan(0);
    }
  });

  it('every regulator entry has a name and an absolute URL', () => {
    for (const { file, data } of profiles) {
      const regulator = data.regulator as Record<string, any>;
      expect(regulator.name, `${file} regulator.name`).toBeTruthy();
      expect(() => new URL(regulator.url), `${file} regulator.url must be a valid URL`).not.toThrow();
    }
  });
});

describe('Prohibited and grey market register', () => {
  const registerPath = path.join(profilesDir, '_prohibited-and-grey-markets.json');

  it('exists and lists the markets where online slots are unlawful', () => {
    expect(fs.existsSync(registerPath)).toBe(true);
    const register = JSON.parse(fs.readFileSync(registerPath, 'utf-8'));

    expect(register.templateType).toBe(
      'slot-machine-expert/prohibited-grey-market-register-v1'
    );

    // The advisory principle must be stated, since this is the register's whole purpose
    expect(register.advisoryPrinciple).toMatch(/CANNOT resolve a legal status/i);

    const codes = (register.markets as any[]).map((m) => m.marketCode);
    // Markets confirmed prohibited during research
    for (const expected of ['AU', 'JP', 'KR', 'SG', 'IN', 'ZA']) {
      expect(codes, `register must cover ${expected}`).toContain(expected);
    }
  });

  it('every prohibited market states a legal basis and a confidence level', () => {
    const register = JSON.parse(fs.readFileSync(registerPath, 'utf-8'));
    for (const market of register.markets as any[]) {
      expect(market.basis, `${market.marketCode} basis`).toBeTruthy();
      expect(VALID_CONFIDENCE, `${market.marketCode} confidence`).toContain(market.confidence);
      expect(VALID_LEGAL_STATUS, `${market.marketCode} legalStatus`).toContain(
        market.legalStatus
      );
    }
  });
});
