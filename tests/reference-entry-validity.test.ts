import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Helper: Parse reference entries from POWER.md
 */
interface ReferenceEntry {
  title: string;
  url: string;
  year: number;
}

function parseReferences(rawContent: string): ReferenceEntry[] {
  // Normalize line endings to \n for cross-platform compatibility
  const content = rawContent.replace(/\r\n/g, '\n');
  const refSection = content.match(/## 參考資料（References）\s*\n([\s\S]*?)$/);
  if (!refSection) return [];

  const entries: ReferenceEntry[] = [];
  const lines = refSection[1].split('\n');

  let currentTitle = '';
  for (const line of lines) {
    // Match numbered entries like "1. Gaming Laboratories..."
    const titleMatch = line.match(/^\d+\.\s+(.+)/);
    if (titleMatch) {
      currentTitle = titleMatch[1].trim();
      continue;
    }

    const urlMatch = line.match(/^\s+-\s+URL:\s*(.+)/);
    if (urlMatch) {
      // Look ahead for year
      const idx = lines.indexOf(line);
      const yearLine = lines[idx + 1];
      const yearMatch = yearLine?.match(/發布年份[：:]\s*(\d{4})/);

      if (yearMatch) {
        entries.push({
          title: currentTitle,
          url: urlMatch[1].trim(),
          year: parseInt(yearMatch[1], 10),
        });
      }
    }
  }

  return entries;
}

/**
 * Helper: Validate a URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

const powerMdPath = path.resolve(__dirname, '..', 'POWER.md');
const powerMdContent = fs.readFileSync(powerMdPath, 'utf-8');
const references = parseReferences(powerMdContent);

// Feature: slot-machine-expert-power, Property 9: 參考資料條目有效性
describe('Property 9: 參考資料條目有效性', () => {
  /**
   * Validates: Requirements 9.1, 9.3
   *
   * For any reference entry in the POWER.md references section,
   * it must contain a valid URL and a year within 2024-2026 range.
   */
  it('every reference entry must have a valid URL and year in 2024-2026', () => {
    // Ensure we actually have references to test
    expect(references.length).toBeGreaterThan(0);

    fc.assert(
      fc.property(
        // Generate random index to pick a reference entry
        fc.integer({ min: 0, max: references.length - 1 }),
        (index) => {
          const entry = references[index];

          // Must contain a valid URL
          expect(isValidUrl(entry.url)).toBe(true);

          // Year must be within 2024-2026 range (inclusive)
          expect(entry.year).toBeGreaterThanOrEqual(2024);
          expect(entry.year).toBeLessThanOrEqual(2026);
        }
      ),
      { numRuns: 100 }
    );
  });
});
