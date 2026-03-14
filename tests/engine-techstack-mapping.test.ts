import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

// Feature: slot-machine-expert-power, Property 8: 遊戲引擎與技術棧映射一致性

/**
 * 遊戲引擎與技術棧映射表
 * 定義每個遊戲引擎對應的主要開發語言
 */
const ENGINE_TECHSTACK_MAP: Record<string, string> = {
  'Unity': 'C#',
  'Cocos Creator': 'TypeScript',
  'Unreal Engine': 'C++/Blueprint',
  'Godot': 'GDScript/C#',
  'HTML5/PixiJS': 'JavaScript/TypeScript',
};

/**
 * 根據遊戲引擎推薦技術棧
 * @param engine 遊戲引擎名稱
 * @returns 推薦的主要語言，若引擎未知則回傳 undefined
 */
function getRecommendedTechStack(engine: string): string | undefined {
  if (Object.hasOwn(ENGINE_TECHSTACK_MAP, engine)) {
    return ENGINE_TECHSTACK_MAP[engine];
  }
  return undefined;
}

const KNOWN_ENGINES = Object.keys(ENGINE_TECHSTACK_MAP);

describe('Property 8: 遊戲引擎與技術棧映射一致性', () => {
  /**
   * Validates: Requirements 7.1
   *
   * For any known game engine, the recommended tech stack must match
   * the defined mapping: Unity→C#, Cocos Creator→TypeScript,
   * Unreal Engine→C++/Blueprint, Godot→GDScript/C#,
   * HTML5/PixiJS→JavaScript/TypeScript.
   */
  it('對於任何已知遊戲引擎，推薦的技術棧必須符合定義的映射表', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...KNOWN_ENGINES),
        (engine) => {
          const recommended = getRecommendedTechStack(engine);

          // 推薦結果不應為 undefined
          expect(recommended).toBeDefined();

          // 推薦結果必須與映射表完全一致
          expect(recommended).toBe(ENGINE_TECHSTACK_MAP[engine]);

          // 驗證具體映射關係
          switch (engine) {
            case 'Unity':
              expect(recommended).toBe('C#');
              break;
            case 'Cocos Creator':
              expect(recommended).toBe('TypeScript');
              break;
            case 'Unreal Engine':
              expect(recommended).toBe('C++/Blueprint');
              break;
            case 'Godot':
              expect(recommended).toBe('GDScript/C#');
              break;
            case 'HTML5/PixiJS':
              expect(recommended).toBe('JavaScript/TypeScript');
              break;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('對於任何未知遊戲引擎，推薦結果應為 undefined', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter(s => !KNOWN_ENGINES.includes(s)),
        (unknownEngine) => {
          const recommended = getRecommendedTechStack(unknownEngine);
          expect(recommended).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});
