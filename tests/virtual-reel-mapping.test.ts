import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Virtual Reel entry representing a symbol and its weight.
 */
interface VirtualReelEntry {
  symbol: string;
  weight: number;
}

/**
 * Maps an RNG value to a symbol using the Virtual Reel weighted mapping.
 *
 * The function iterates through the virtual reel entries, accumulating weights.
 * When the cumulative weight exceeds the RNG value, the corresponding symbol is returned.
 *
 * @param rngValue - The RNG output value (0 to totalWeight - 1)
 * @param virtualReel - Array of virtual reel entries with symbol and weight
 * @returns The mapped symbol string
 */
function mapToSymbol(rngValue: number, virtualReel: VirtualReelEntry[]): string {
  let cumulative = 0;
  for (const entry of virtualReel) {
    cumulative += entry.weight;
    if (rngValue < cumulative) {
      return entry.symbol;
    }
  }
  // Safety fallback: return last symbol
  return virtualReel[virtualReel.length - 1].symbol;
}

/**
 * Maps an RNG value to a reel stop index (0-based position in the reel strip).
 *
 * @param rngValue - The RNG output value (0 to totalWeight - 1)
 * @param virtualReel - Array of virtual reel entries with symbol and weight
 * @returns The index of the matched entry in the virtual reel (0 to virtualReel.length - 1)
 */
function mapToReelStopIndex(rngValue: number, virtualReel: VirtualReelEntry[]): number {
  let cumulative = 0;
  for (let i = 0; i < virtualReel.length; i++) {
    cumulative += virtualReel[i].weight;
    if (rngValue < cumulative) {
      return i;
    }
  }
  return virtualReel.length - 1;
}

// Feature: slot-machine-expert-power, Property 4: Virtual Reel 映射有效性
describe('Property 4: Virtual Reel 映射有效性', () => {
  /**
   * Validates: Requirements 4.3
   *
   * For any RNG output value and Virtual Reel weight configuration,
   * the mapping function must produce a reel stop position within the
   * valid index range (0 to reelStrip.length - 1).
   */

  // Arbitrary for a single VirtualReelEntry with positive integer weight
  const virtualReelEntryArb = fc.record({
    symbol: fc.stringOf(fc.constantFrom('A', 'K', 'Q', 'J', '10', 'WILD', 'SCATTER', '7', 'DIAMOND', 'BELL'), { minLength: 1, maxLength: 3 }),
    weight: fc.integer({ min: 1, max: 100 }),
  });

  // Arbitrary for a non-empty virtual reel (1 to 15 entries)
  const virtualReelArb = fc.array(virtualReelEntryArb, { minLength: 1, maxLength: 15 });

  it('mapToReelStopIndex 產生的索引落在有效範圍內（0 至 reelStrip.length - 1）', () => {
    fc.assert(
      fc.property(
        virtualReelArb,
        (virtualReel) => {
          const totalWeight = virtualReel.reduce((sum, e) => sum + e.weight, 0);

          // Generate an RNG value in valid range [0, totalWeight)
          for (const rngValue of [0, Math.floor(totalWeight / 2), totalWeight - 1]) {
            const index = mapToReelStopIndex(rngValue, virtualReel);
            expect(index).toBeGreaterThanOrEqual(0);
            expect(index).toBeLessThan(virtualReel.length);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('mapToSymbol 對任意有效 RNG 值返回虛擬捲軸中存在的符號', () => {
    fc.assert(
      fc.property(
        virtualReelArb,
        fc.integer({ min: 0, max: 999999 }),
        (virtualReel, rawRng) => {
          const totalWeight = virtualReel.reduce((sum, e) => sum + e.weight, 0);
          const rngValue = rawRng % totalWeight; // Constrain to valid range

          const symbol = mapToSymbol(rngValue, virtualReel);
          const allSymbols = virtualReel.map(e => e.symbol);
          expect(allSymbols).toContain(symbol);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('mapToReelStopIndex 對隨機 RNG 值與隨機權重配置均產生有效索引', () => {
    fc.assert(
      fc.property(
        virtualReelArb,
        fc.integer({ min: 0, max: 999999 }),
        (virtualReel, rawRng) => {
          const totalWeight = virtualReel.reduce((sum, e) => sum + e.weight, 0);
          const rngValue = rawRng % totalWeight;

          const index = mapToReelStopIndex(rngValue, virtualReel);

          // Index must be within valid range
          expect(index).toBeGreaterThanOrEqual(0);
          expect(index).toBeLessThanOrEqual(virtualReel.length - 1);

          // The mapped symbol must match the entry at the returned index
          const symbol = mapToSymbol(rngValue, virtualReel);
          expect(symbol).toBe(virtualReel[index].symbol);
        }
      ),
      { numRuns: 100 }
    );
  });
});
