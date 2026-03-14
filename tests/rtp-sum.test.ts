import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Calculate total RTP by summing base game RTP and all bonus feature RTP contributions.
 *
 * Total RTP = Base Game RTP + Σ(Bonus Feature RTPs)
 *
 * @param baseGameRTP - Base game RTP percentage
 * @param bonusRTPs - Array of bonus feature RTP contributions (Free Spin, Bonus Round, Multiplier, Progressive Jackpot, etc.)
 * @returns Total RTP as a percentage
 */
function calculateTotalRTP(baseGameRTP: number, bonusRTPs: number[]): number {
  const bonusSum = bonusRTPs.reduce((sum, rtp) => sum + rtp, 0);
  return baseGameRTP + bonusSum;
}

// Feature: slot-machine-expert-power, Property 3: RTP 加總不變量
describe('Property 3: RTP 加總不變量', () => {
  /**
   * Validates: Requirements 3.5
   *
   * For any game configuration with bonus features, the total RTP must equal
   * the base game RTP plus the sum of all bonus feature RTP contributions
   * (Free Spin, Bonus Round, Multiplier, Progressive Jackpot).
   */
  it('總 RTP 等於基礎遊戲 RTP 加上所有獎勵功能 RTP 之總和', () => {
    fc.assert(
      fc.property(
        // Generate base game RTP (typically 70%–95%)
        fc.double({ min: 0, max: 100, noNaN: true }),
        // Generate bonus RTP contributions array (0–4 bonus features, each 0%–20%)
        fc.array(fc.double({ min: 0, max: 20, noNaN: true }), { minLength: 0, maxLength: 4 }),
        (baseGameRTP, bonusRTPs) => {
          const totalRTP = calculateTotalRTP(baseGameRTP, bonusRTPs);

          // Verify: total RTP equals base game RTP + sum of all bonus RTPs
          const expectedTotal = baseGameRTP + bonusRTPs.reduce((a, b) => a + b, 0);
          expect(totalRTP).toBeCloseTo(expectedTotal, 10);

          // Verify: total RTP is at least as large as base game RTP (bonus RTPs are non-negative)
          expect(totalRTP).toBeGreaterThanOrEqual(baseGameRTP - 1e-10);
        }
      ),
      { numRuns: 100 }
    );
  });
});
