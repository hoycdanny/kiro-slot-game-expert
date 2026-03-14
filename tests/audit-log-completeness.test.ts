import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Represents a single winning payline result.
 */
interface WinLine {
  lineId: number;
  symbols: string[];
  matchCount: number;
  multiplier: number;
  payout: number;
}

/**
 * Represents a complete spin audit log entry.
 */
interface SpinAuditLog {
  spinId: string;
  timestamp: string;
  sessionId: string;
  playerId: string;
  betAmount: number;
  betLines: number;
  rngOutput: number[];
  reelStops: number[];
  visibleSymbols: string[][];
  winLines: WinLine[];
  totalWin: number;
  bonusTriggered: boolean;
  balanceBefore: number;
  balanceAfter: number;
}

/**
 * Generates a spin audit log from spin data.
 * This function simulates the audit log generation at the end of a spin lifecycle.
 */
function generateAuditLog(spinData: {
  betAmount: number;
  betLines: number;
  rngOutput: number[];
  visibleSymbols: string[][];
  winLines: WinLine[];
  totalWin: number;
  balanceBefore: number;
}): SpinAuditLog {
  return {
    spinId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    sessionId: `sess-${Date.now()}`,
    playerId: `player-${Math.floor(Math.random() * 100000)}`,
    betAmount: spinData.betAmount,
    betLines: spinData.betLines,
    rngOutput: spinData.rngOutput,
    reelStops: spinData.rngOutput.map(v => v % 30),
    visibleSymbols: spinData.visibleSymbols,
    winLines: spinData.winLines,
    totalWin: spinData.totalWin,
    bonusTriggered: spinData.winLines.some(l => l.symbols.includes('SCATTER')),
    balanceBefore: spinData.balanceBefore,
    balanceAfter: spinData.balanceBefore - (spinData.betAmount * spinData.betLines) + spinData.totalWin,
  };
}

// Feature: slot-machine-expert-power, Property 5: 審計日誌欄位完整性
describe('Property 5: 審計日誌欄位完整性', () => {
  /**
   * Validates: Requirements 4.5
   *
   * For any spin audit log entry, it must contain all required fields:
   * timestamp, betAmount, rngOutput, visibleSymbols, winLines, and totalWin.
   */

  const symbolArb = fc.constantFrom('A', 'K', 'Q', 'J', '10', 'WILD', 'SCATTER', '7', 'DIAMOND', 'BELL');

  const winLineArb = fc.record({
    lineId: fc.integer({ min: 1, max: 25 }),
    symbols: fc.array(symbolArb, { minLength: 3, maxLength: 5 }),
    matchCount: fc.integer({ min: 3, max: 5 }),
    multiplier: fc.integer({ min: 1, max: 10 }),
    payout: fc.double({ min: 0, max: 10000, noNaN: true }),
  });

  const spinDataArb = fc.record({
    betAmount: fc.double({ min: 0.01, max: 1000, noNaN: true }),
    betLines: fc.integer({ min: 1, max: 50 }),
    rngOutput: fc.array(fc.integer({ min: 0, max: 255 }), { minLength: 3, maxLength: 5 }),
    visibleSymbols: fc.array(
      fc.array(symbolArb, { minLength: 3, maxLength: 3 }),
      { minLength: 3, maxLength: 5 }
    ),
    winLines: fc.array(winLineArb, { minLength: 0, maxLength: 5 }),
    totalWin: fc.double({ min: 0, max: 50000, noNaN: true }),
    balanceBefore: fc.double({ min: 0, max: 1000000, noNaN: true }),
  });

  it('產生的審計日誌包含所有必要欄位：timestamp、betAmount、rngOutput、visibleSymbols、winLines、totalWin', () => {
    fc.assert(
      fc.property(spinDataArb, (spinData) => {
        const log = generateAuditLog(spinData);

        // Verify all required fields exist and have correct types
        expect(log).toHaveProperty('timestamp');
        expect(typeof log.timestamp).toBe('string');
        expect(log.timestamp.length).toBeGreaterThan(0);

        expect(log).toHaveProperty('betAmount');
        expect(typeof log.betAmount).toBe('number');

        expect(log).toHaveProperty('rngOutput');
        expect(Array.isArray(log.rngOutput)).toBe(true);
        expect(log.rngOutput.length).toBeGreaterThan(0);

        expect(log).toHaveProperty('visibleSymbols');
        expect(Array.isArray(log.visibleSymbols)).toBe(true);
        expect(log.visibleSymbols.length).toBeGreaterThan(0);

        expect(log).toHaveProperty('winLines');
        expect(Array.isArray(log.winLines)).toBe(true);

        expect(log).toHaveProperty('totalWin');
        expect(typeof log.totalWin).toBe('number');
      }),
      { numRuns: 100 }
    );
  });

  it('審計日誌的 timestamp 為有效的 ISO 8601 格式', () => {
    fc.assert(
      fc.property(spinDataArb, (spinData) => {
        const log = generateAuditLog(spinData);
        const parsed = new Date(log.timestamp);
        expect(parsed.toISOString()).toBe(log.timestamp);
      }),
      { numRuns: 100 }
    );
  });
});
