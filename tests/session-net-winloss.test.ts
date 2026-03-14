import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Represents a single spin in a session with a bet amount and win amount.
 */
interface Spin {
  betAmount: number;
  winAmount: number;
}

/**
 * Calculate the session net win/loss from a sequence of spins.
 *
 * Net Amount = Σ(wins) - Σ(bets)
 *
 * @param spins - Array of spins, each with betAmount and winAmount
 * @returns The net win/loss amount for the session
 */
function calculateSessionNetWinLoss(spins: Spin[]): number {
  let totalBets = 0;
  let totalWins = 0;
  for (const spin of spins) {
    totalBets += spin.betAmount;
    totalWins += spin.winAmount;
  }
  return totalWins - totalBets;
}

// Feature: slot-machine-expert-power, Property 7: 會話淨盈虧計算不變量
describe('Property 7: 會話淨盈虧計算不變量', () => {
  /**
   * Validates: Requirements 6.4
   *
   * For any spin sequence, the session net win/loss amount must equal
   * the sum of all wins minus the sum of all bets:
   * netAmount = Σ(wins) - Σ(bets)
   */
  it('淨盈虧金額等於所有獎金總和減去所有投注金額總和', () => {
    const spinArb = fc.record({
      betAmount: fc.double({ min: 0.01, max: 10000, noNaN: true }),
      winAmount: fc.double({ min: 0, max: 100000, noNaN: true }),
    });

    fc.assert(
      fc.property(
        fc.array(spinArb, { minLength: 1, maxLength: 200 }),
        (spins: Spin[]) => {
          const netAmount = calculateSessionNetWinLoss(spins);

          // Independently compute expected value
          const totalWins = spins.reduce((sum, s) => sum + s.winAmount, 0);
          const totalBets = spins.reduce((sum, s) => sum + s.betAmount, 0);
          const expected = totalWins - totalBets;

          expect(netAmount).toBeCloseTo(expected, 5);
        }
      ),
      { numRuns: 100 }
    );
  });
});
