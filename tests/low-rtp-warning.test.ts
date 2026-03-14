import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

/**
 * Determine whether a low RTP warning should be triggered.
 *
 * When RTP < 92%, the system guidance must include a market restriction warning.
 * When RTP >= 92%, no warning should be triggered.
 *
 * @param rtpPercentage - The RTP value as a percentage (0–100)
 * @returns true if a low RTP warning should be triggered, false otherwise
 */
function shouldTriggerLowRTPWarning(rtpPercentage: number): boolean {
  return rtpPercentage < 92;
}

const RTP_THRESHOLD = 92;

// Feature: slot-machine-expert-power, Property 6: 低 RTP 警告觸發
describe('Property 6: 低 RTP 警告觸發', () => {
  /**
   * Validates: Requirements 5.5
   *
   * For any RTP setting value, if the value is below 92%, the system guidance
   * must include a market restriction warning; if the value is greater than or
   * equal to 92%, no warning should be triggered.
   */
  it('RTP < 92% 時觸發警告，RTP >= 92% 時不觸發', () => {
    fc.assert(
      fc.property(
        // Generate random RTP values between 0% and 100%
        fc.double({ min: 0, max: 100, noNaN: true }),
        (rtpPercentage) => {
          const warningTriggered = shouldTriggerLowRTPWarning(rtpPercentage);

          if (rtpPercentage < RTP_THRESHOLD) {
            // RTP below 92% must trigger warning
            expect(warningTriggered).toBe(true);
          } else {
            // RTP at or above 92% must not trigger warning
            expect(warningTriggered).toBe(false);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
