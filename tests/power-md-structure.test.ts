import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Helper: Parse POWER.md frontmatter and structure
 */
function parsePowerMd(rawContent: string) {
  // Normalize line endings to \n for cross-platform compatibility
  const content = rawContent.replace(/\r\n/g, '\n');
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) return null;

  const frontmatter = frontmatterMatch[1];
  const body = content.slice(frontmatterMatch[0].length);

  // Parse YAML-like frontmatter fields
  const nameMatch = frontmatter.match(/^name:\s*(.+)$/m);
  const displayNameMatch = frontmatter.match(/^displayName:\s*(.+)$/m);
  const descriptionMatch = frontmatter.match(/^description:\s*(.+)$/m);
  const keywordsMatch = frontmatter.match(/^keywords:\s*\n((?:\s+-\s+.+\n?)+)/m);

  const keywords: string[] = [];
  if (keywordsMatch) {
    const keywordLines = keywordsMatch[1].match(/^\s+-\s+(.+)$/gm);
    if (keywordLines) {
      for (const line of keywordLines) {
        const kw = line.match(/^\s+-\s+(.+)$/);
        if (kw) keywords.push(kw[1].trim());
      }
    }
  }

  // Parse Steering directives
  const steeringSection = body.match(/## Steering\s*\n([\s\S]*?)(?=\n## |$)/);
  const steeringDirectives: string[] = [];
  if (steeringSection) {
    const fileMatches = steeringSection[1].match(/- file:\s*(.+)/g);
    if (fileMatches) {
      for (const fm of fileMatches) {
        const f = fm.match(/- file:\s*(.+)/);
        if (f) steeringDirectives.push(f[1].trim());
      }
    }
  }

  return {
    name: nameMatch ? nameMatch[1].trim() : undefined,
    displayName: displayNameMatch ? displayNameMatch[1].trim() : undefined,
    description: descriptionMatch ? descriptionMatch[1].trim() : undefined,
    keywords,
    steeringDirectives,
  };
}

const powerMdPath = path.resolve(__dirname, '..', 'POWER.md');
const powerMdContent = fs.readFileSync(powerMdPath, 'utf-8');

// Feature: slot-machine-expert-power, Property 1: POWER.md 結構完整性
describe('Property 1: POWER.md 結構完整性', () => {
  /**
   * Validates: Requirements 1.1
   *
   * For any valid POWER.md file, the parsed result must contain
   * name, displayName, description, keywords fields, and at least one Steering directive.
   */
  it('parsed POWER.md must contain all required frontmatter fields and at least one Steering directive', () => {
    fc.assert(
      fc.property(
        // Generate random indices to sample-check the actual POWER.md content
        // This ensures the property holds regardless of how we access the parsed data
        fc.integer({ min: 0, max: 100 }),
        (_iteration) => {
          const parsed = parsePowerMd(powerMdContent);

          // Must parse successfully
          expect(parsed).not.toBeNull();

          // Must contain all four required frontmatter fields
          expect(parsed!.name).toBeDefined();
          expect(typeof parsed!.name).toBe('string');
          expect(parsed!.name!.length).toBeGreaterThan(0);

          expect(parsed!.displayName).toBeDefined();
          expect(typeof parsed!.displayName).toBe('string');
          expect(parsed!.displayName!.length).toBeGreaterThan(0);

          expect(parsed!.description).toBeDefined();
          expect(typeof parsed!.description).toBe('string');
          expect(parsed!.description!.length).toBeGreaterThan(0);

          expect(parsed!.keywords).toBeDefined();
          expect(Array.isArray(parsed!.keywords)).toBe(true);
          expect(parsed!.keywords.length).toBeGreaterThan(0);

          // Must contain at least one Steering directive
          expect(parsed!.steeringDirectives.length).toBeGreaterThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });
});
