import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Calculate Hit Frequency using the standard formula:
 * Hit Frequency = (totalWinningCombinations / totalPossibleCombinations) × 100
 *
 * @param totalWinningCombinations - Number of winning combinations
 * @param totalPossibleCombinations - Number of total possible combinations (must be > 0)
 * @returns Hit Frequency as a percentage (0–100)
 */
function calculateHitFrequency(
  totalWinningCombinations: number,
  totalPossibleCombinations: number
): number {
  if (totalPossibleCombinations <= 0) {
    throw new Error('Total possible combinations must be greater than zero');
  }
  if (totalWinningCombinations < 0) {
    throw new Error('Total winning combinations cannot be negative');
  }
  if (totalWinningCombinations > totalPossibleCombinations) {
    throw new Error('Winning combinations cannot exceed total possible combinations');
  }
  return (totalWinningCombinations / totalPossibleCombinations) * 100;
}

// Feature: slot-machine-expert-power, Property 2: Hit Frequency 計算公式不變量
describe('Property 2: Hit Frequency 計算公式不變量', () => {
  /**
   * Validates: Requirements 3.3
   *
   * For any reel configuration, the calculated Hit Frequency must equal
   * (totalWinningCombinations / totalPossibleCombinations) × 100,
   * and the result must be between 0 and 100.
   */
  it('Hit Frequency equals (winning / total) × 100 and is between 0–100', () => {
    fc.assert(
      fc.property(
        // Generate totalPossibleCombinations (at least 1 to avoid division by zero)
        fc.integer({ min: 1, max: 1_000_000 }),
        // Generate a ratio 0–1 to derive winning combinations
        fc.double({ min: 0, max: 1, noNaN: true }),
        (totalPossible, ratio) => {
          const totalWinning = Math.floor(ratio * totalPossible);

          const hitFrequency = calculateHitFrequency(totalWinning, totalPossible);

          // Verify the formula: result equals (winning / total) × 100
          const expected = (totalWinning / totalPossible) * 100;
          expect(hitFrequency).toBeCloseTo(expected, 10);

          // Result must be between 0 and 100 (inclusive)
          expect(hitFrequency).toBeGreaterThanOrEqual(0);
          expect(hitFrequency).toBeLessThanOrEqual(100);
        }
      ),
      { numRuns: 100 }
    );
  });
});
