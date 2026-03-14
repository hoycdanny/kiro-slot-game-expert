# RNG 與遊戲邏輯實作工作流程指引

本指引涵蓋老虎機 RNG（隨機數生成器）實作與遊戲邏輯的完整工作流程，包括 CSPRNG 選擇、種子管理、旋轉獨立性、Spin Lifecycle 六階段實作、規則引擎開發與審計日誌設計。

---

## 1. CSPRNG 選擇

### 1.1 為何需要 CSPRNG

老虎機的隨機數生成器必須使用密碼學安全偽隨機數生成器（CSPRNG），而非一般的 PRNG（如 `Math.random()`、`System.Random`）。原因如下：

- **不可預測性**：CSPRNG 的輸出無法從先前的輸出推導，防止玩家或攻擊者預測結果
- **認證要求**：GLI-11 與 GLI-19 標準明確要求 RNG 必須通過統計隨機性測試（如 Diehard、NIST SP 800-22）
- **法規合規**：各司法管轄區（Malta、UK、Ontario 等）均要求使用經認證的 RNG

> ⚠️ **嚴禁使用** `Math.random()`、`System.Random`、`rand()` 等非密碼學安全的隨機數生成器於任何影響遊戲結果的邏輯中。

### 1.2 各引擎推薦 CSPRNG

| 遊戲引擎 / 平台 | 推薦 CSPRNG | 說明 |
|------------------|-------------|------|
| **Unity** | `System.Security.Cryptography.RNGCryptoServiceProvider` 或 `RandomNumberGenerator` | .NET 內建的 CSPRNG，跨平台支援良好 |
| **Cocos Creator** | Web Crypto API (`crypto.getRandomValues`) / Node.js `crypto.randomBytes` | 瀏覽器端使用 Web Crypto API；伺服器端使用 Node.js crypto 模組 |
| **Unreal Engine** | `FMath::RandRange` + OpenSSL `RAND_bytes` | 遊戲邏輯可用 FMath 輔助，關鍵 RNG 輸出應使用 OpenSSL |
| **Godot** | `Crypto` class (`Crypto.generate_random_bytes`) | Godot 4.x 內建的密碼學安全隨機數生成器 |
| **HTML5 / PixiJS** | Web Crypto API (`crypto.getRandomValues`) | W3C 標準，所有現代瀏覽器均支援 |
| **伺服器端（Python）** | `os.urandom` / `secrets` 模組 | Python 3.6+ 建議使用 `secrets` 模組 |
| **伺服器端（Node.js）** | `crypto.randomBytes` / `crypto.randomInt` | Node.js 內建密碼學安全隨機數 |

### 1.3 各引擎實作範例

**Unity (C#)**

```csharp
using System.Security.Cryptography;

public static class SlotRNG
{
    private static readonly RandomNumberGenerator _rng = RandomNumberGenerator.Create();

    public static int GetSecureRandom(int minInclusive, int maxExclusive)
    {
        byte[] bytes = new byte[4];
        _rng.GetBytes(bytes);
        uint value = BitConverter.ToUInt32(bytes, 0);
        return (int)(minInclusive + (value % (uint)(maxExclusive - minInclusive)));
    }
}
```

**Cocos Creator / HTML5 / PixiJS (TypeScript)**

```typescript
function getSecureRandom(min: number, max: number): number {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % (max - min));
}
```

**Unreal Engine (C++)**

```cpp
#include <openssl/rand.h>

int32 GetSecureRandom(int32 Min, int32 Max)
{
    uint32 RandomValue;
    RAND_bytes(reinterpret_cast<unsigned char*>(&RandomValue), sizeof(RandomValue));
    return Min + (RandomValue % (Max - Min));
}
```

**Godot (GDScript)**

```gdscript
var crypto = Crypto.new()

func get_secure_random(min_val: int, max_val: int) -> int:
    var bytes = crypto.generate_random_bytes(4)
    var value = bytes.decode_u32(0)
    return min_val + (value % (max_val - min_val))
```

**伺服器端 Python**

```python
import secrets

def get_secure_random(min_val: int, max_val: int) -> int:
    return secrets.randbelow(max_val - min_val) + min_val
```

**伺服器端 Node.js**

```typescript
import { randomInt } from 'crypto';

function getSecureRandom(min: number, max: number): number {
  return randomInt(min, max);
}
```


---

## 2. 種子管理

### 2.1 熵值來源

CSPRNG 的安全性取決於種子（Seed）的熵值品質。以下為各平台建議的熵值來源：

| 平台 | 熵值來源 | 說明 |
|------|----------|------|
| 伺服器端（Linux） | `/dev/urandom` | 核心級熵池，結合硬體中斷、磁碟 I/O 時序等 |
| 伺服器端（Windows） | `CryptGenRandom` / BCrypt | 系統級密碼學隨機數提供者 |
| 瀏覽器端 | `crypto.getRandomValues` | 由瀏覽器從作業系統熵池取得 |
| 硬體 RNG（HSM） | 專用硬體模組 | 最高安全等級，適用於高監管市場 |

**熵值品質要求**

- 種子長度至少 128 位元（16 bytes），建議 256 位元（32 bytes）
- 種子必須來自作業系統級的熵池，不可使用時間戳記、玩家 ID 等可預測資訊作為唯一種子來源
- 符合 NIST SP 800-90A 標準的熵值要求

### 2.2 種子更新策略

| 策略 | 說明 | 適用場景 |
|------|------|----------|
| **每次旋轉重新取種** | 每次旋轉從系統熵池取得新種子 | 最高安全性，適用於伺服器端 |
| **定期重新播種** | 每 N 次旋轉或每 T 秒重新播種 | 效能與安全性的平衡 |
| **會話級種子** | 每個玩家會話使用獨立種子 | 適用於需要會話隔離的場景 |

**建議做法**

1. 伺服器端邏輯：採用「每次旋轉重新取種」策略，直接從 `os.urandom` 或 `crypto.randomBytes` 取得隨機數
2. 客戶端邏輯：關鍵 RNG 運算應在伺服器端執行；若必須在客戶端產生隨機數，應使用 Web Crypto API 並在伺服器端驗證
3. 避免使用固定種子（Hard-coded Seed），除非用於測試環境

### 2.3 種子儲存與保護

- 種子不應以明文儲存於日誌、資料庫或客戶端
- 若需記錄種子用於審計，應使用加密儲存並限制存取權限
- 種子傳輸應透過 TLS 加密通道

---

## 3. 旋轉獨立性

### 3.1 獨立性原則

每次旋轉的結果必須獨立於前次旋轉結果。這意味著：

- 前一次旋轉的結果（獲勝或落敗）不影響下一次旋轉的機率分佈
- 玩家的投注金額變化不影響 RNG 輸出
- 連續旋轉之間不存在任何統計相關性

### 3.2 實作要點

**確保獨立性的做法**

1. **不重用 RNG 狀態**：每次旋轉使用獨立的 CSPRNG 呼叫，不依賴前次旋轉的內部狀態
2. **不實作「補償機制」**：禁止根據前次結果調整下次旋轉的機率（如「連續 N 次未中獎後提高中獎率」）
3. **不使用循環序列**：禁止使用預先生成的固定結果序列循環播放
4. **統計驗證**：使用自相關測試（Autocorrelation Test）驗證連續旋轉結果之間無統計相關性

**違反獨立性的常見錯誤**

| 錯誤做法 | 問題 | 正確做法 |
|----------|------|----------|
| 根據前次結果調整權重 | 違反獨立性，無法通過認證 | 每次旋轉使用固定的權重配置 |
| 使用遞增計數器作為種子 | 結果可預測 | 使用系統熵池取得種子 |
| 預生成結果池循環使用 | 結果有限且可預測 | 每次旋轉即時產生隨機數 |
| 共用 PRNG 實例跨會話 | 不同玩家的結果可能相互影響 | 每個會話使用獨立的 RNG 實例或直接從熵池取得 |

### 3.3 認證測試要求

認證實驗室會執行以下測試驗證旋轉獨立性：

- **序列相關性測試**：驗證連續 N 次旋轉結果之間的相關係數接近 0
- **卡方檢定**：驗證結果分佈符合預期的均勻分佈
- **遊程測試（Runs Test）**：驗證結果序列中的遊程長度符合隨機預期
- **NIST SP 800-22 測試套件**：包含 15 項統計隨機性測試


---

## 4. Spin Lifecycle 六階段實作

Spin Lifecycle（旋轉生命週期）定義了從玩家發送旋轉請求到返回結果的完整處理流程，共分為六個階段。

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 階段 1       │───▶│ 階段 2       │───▶│ 階段 3       │
│ 接收旋轉請求  │    │ RNG 產生輸出  │    │ 映射捲軸停止  │
│              │    │              │    │ 位置          │
└─────────────┘    └─────────────┘    └─────────────┘
                                            │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ 階段 6       │◀───│ 階段 5       │◀───│ 階段 4       │
│ 結果返回與    │    │ 獎勵解析     │    │ 規則評估      │
│ 日誌記錄     │    │              │    │              │
└─────────────┘    └─────────────┘    └─────────────┘
```

### 4.1 階段 1：接收旋轉請求

本階段負責接收並驗證玩家的旋轉請求。

**投注驗證**

| 驗證項目 | 說明 | 失敗處理 |
|----------|------|----------|
| 投注金額範圍 | 確認投注金額在允許的最小值與最大值之間 | 返回錯誤碼，拒絕旋轉 |
| 投注賠線數 | 確認選擇的賠線數在有效範圍內 | 返回錯誤碼，拒絕旋轉 |
| 餘額充足性 | 確認玩家餘額 ≥ 投注金額 × 投注賠線數 | 返回餘額不足錯誤 |
| 投注格式 | 確認投注金額為有效數值（正數、無溢位） | 返回格式錯誤 |

**會話憑證檢查**

| 檢查項目 | 說明 | 失敗處理 |
|----------|------|----------|
| 會話有效性 | 驗證 Session Token 未過期且未被撤銷 | 要求重新登入 |
| 玩家身份 | 確認會話對應的玩家 ID 有效 | 返回身份驗證錯誤 |
| 自我排除狀態 | 確認玩家未處於自我排除期間 | 返回帳戶限制錯誤 |
| 存款限制 | 確認本次投注不超過玩家設定的投注上限 | 返回限制超額錯誤 |
| 併發控制 | 確認同一玩家無其他進行中的旋轉 | 返回併發錯誤或排隊等待 |

**虛擬碼**

```typescript
async function stage1_receiveSpinRequest(request: SpinRequest): Promise<ValidatedRequest> {
  // 驗證會話憑證
  const session = await validateSession(request.sessionToken);
  if (!session.valid) throw new Error('INVALID_SESSION');

  // 檢查自我排除與存款限制
  await checkPlayerRestrictions(session.playerId);

  // 驗證投注詳情
  validateBetAmount(request.betAmount, request.betLines);

  // 檢查餘額
  const balance = await getPlayerBalance(session.playerId);
  const totalBet = request.betAmount * request.betLines;
  if (balance < totalBet) throw new Error('INSUFFICIENT_BALANCE');

  // 扣除投注金額（先扣後算）
  await deductBalance(session.playerId, totalBet);

  return { ...request, session, totalBet, balanceBefore: balance };
}
```

### 4.2 階段 2：RNG 產生輸出

本階段使用 CSPRNG 為每個捲軸產生獨立的隨機數值。

**實作要點**

- 為每個捲軸產生一個獨立的隨機數值
- 隨機數值的範圍應對應該捲軸的 Virtual Reel 總權重（例如 0–127）
- 使用第 1 節中推薦的 CSPRNG 實作

**虛擬碼**

```typescript
function stage2_generateRNGOutput(reelCount: number, reelConfigs: ReelStripConfig[]): number[] {
  const rngOutputs: number[] = [];
  for (let i = 0; i < reelCount; i++) {
    const totalWeight = reelConfigs[i].totalWeight;
    rngOutputs.push(getSecureRandom(0, totalWeight));
  }
  return rngOutputs;
}
```

### 4.3 階段 3：映射捲軸停止位置

本階段將 RNG 輸出值透過 Virtual Reel 權重表映射為實際的捲軸停止位置與可見符號。

**映射函數**

```typescript
function mapToSymbol(rngValue: number, virtualReel: VirtualReelEntry[]): string {
  let cumulative = 0;
  for (const entry of virtualReel) {
    cumulative += entry.weight;
    if (rngValue < cumulative) {
      return entry.symbol;
    }
  }
  // 安全回退：返回最後一個符號
  return virtualReel[virtualReel.length - 1].symbol;
}

function stage3_mapReelStops(
  rngOutputs: number[],
  reelConfigs: ReelStripConfig[]
): { reelStops: number[]; visibleSymbols: string[][] } {
  const reelStops: number[] = [];
  const visibleSymbols: string[][] = [];

  for (let i = 0; i < rngOutputs.length; i++) {
    const stopIndex = mapToStopIndex(rngOutputs[i], reelConfigs[i]);
    reelStops.push(stopIndex);
    // 取得該停止位置上下各一行的可見符號（3×N 矩陣）
    visibleSymbols.push(getVisibleSymbols(stopIndex, reelConfigs[i]));
  }

  return { reelStops, visibleSymbols };
}
```

**注意事項**

- 映射結果必須落在有效索引範圍內（0 至 reelStrip.length - 1）
- Virtual Reel 總權重不應為零
- 映射函數應具備確定性：相同的 RNG 值與權重配置必須產生相同的結果

### 4.4 階段 4：規則評估

詳見第 5 節「規則引擎」。

### 4.5 階段 5：獎勵解析

本階段根據規則評估結果計算最終獎金。

**處理流程**

1. 彙總所有獲勝賠線的獎金
2. 套用 Multiplier（若有觸發）
3. 檢查是否觸發 Free Spin 或 Bonus Round
4. 計算總獎金金額

**虛擬碼**

```typescript
function stage5_resolveRewards(
  winLines: WinLine[],
  multiplier: number,
  bonusTriggered: boolean
): RewardResult {
  let totalWin = winLines.reduce((sum, line) => sum + line.payout, 0);

  // 套用乘數
  totalWin *= multiplier;

  return {
    totalWin,
    winLines,
    multiplier,
    bonusTriggered,
    freeSpinsAwarded: bonusTriggered ? calculateFreeSpins() : 0,
  };
}
```

### 4.6 階段 6：結果返回與日誌記錄

本階段將結果返回給玩家，並記錄完整的審計日誌。

**處理流程**

1. 更新玩家餘額（加上獎金）
2. 組裝旋轉結果回應
3. 寫入審計日誌（詳見第 6 節）
4. 返回結果給客戶端

**虛擬碼**

```typescript
async function stage6_returnResult(
  validatedRequest: ValidatedRequest,
  rngOutputs: number[],
  reelStops: number[],
  visibleSymbols: string[][],
  rewards: RewardResult
): Promise<SpinResponse> {
  // 更新餘額
  const balanceAfter = validatedRequest.balanceBefore
    - validatedRequest.totalBet + rewards.totalWin;
  await updateBalance(validatedRequest.session.playerId, balanceAfter);

  // 寫入審計日誌
  await writeAuditLog({
    spinId: generateSpinId(),
    timestamp: new Date().toISOString(),
    sessionId: validatedRequest.session.sessionId,
    playerId: validatedRequest.session.playerId,
    betAmount: validatedRequest.betAmount,
    betLines: validatedRequest.betLines,
    rngOutput: rngOutputs,
    reelStops,
    visibleSymbols,
    winLines: rewards.winLines,
    totalWin: rewards.totalWin,
    bonusTriggered: rewards.bonusTriggered,
    balanceBefore: validatedRequest.balanceBefore,
    balanceAfter,
  });

  // 返回結果
  return {
    visibleSymbols,
    winLines: rewards.winLines,
    totalWin: rewards.totalWin,
    bonusTriggered: rewards.bonusTriggered,
    freeSpinsAwarded: rewards.freeSpinsAwarded,
    balanceAfter,
  };
}
```


---

## 5. 規則引擎

規則引擎負責 Spin Lifecycle 的第 4 階段——規則評估。評估順序至關重要，必須嚴格按照以下順序執行。

### 5.1 評估順序

```
Step 1: Wild 替代 → Step 2: Payline 匹配 → Step 3: Scatter 觸發 → Step 4: Multiplier 套用
```

> ⚠️ 評估順序不可更改。Wild 替代必須在 Payline 匹配之前完成，Multiplier 必須在獎金計算之後套用。

### 5.2 Step 1：Wild 替代規則

Wild（百搭）符號可替代其他符號形成獲勝組合。

**基本規則**

- Wild 可替代除 Scatter 外的所有普通符號
- Wild 本身也可形成獲勝組合（如 5 個 Wild 為最高獎金）
- 替代時，Wild 視為被替代符號中獎金最高的那個

**Wild 變體**

| 類型 | 說明 | 實作要點 |
|------|------|----------|
| Standard Wild | 替代所有普通符號 | 最基本的 Wild 實作 |
| Expanding Wild | 出現時擴展覆蓋整個捲軸 | 在 Payline 匹配前先擴展符號矩陣 |
| Sticky Wild | 在 Free Spin 期間保持位置 | 需維護 Wild 位置狀態 |
| Stacked Wild | 以堆疊形式出現（連續多個位置） | 在 Reel Strip 中連續放置 Wild |
| Multiplier Wild | 替代時額外套用乘數 | 在 Step 4 中處理額外乘數 |

**虛擬碼**

```typescript
function applyWildSubstitution(
  visibleSymbols: string[][],
  wildSymbol: string = 'WILD'
): string[][] {
  // Wild 替代在原始矩陣上標記，不改變實際符號
  // Payline 匹配時會將 Wild 視為任意符號
  return visibleSymbols; // Wild 處理在 Payline 匹配邏輯中整合
}
```

### 5.3 Step 2：Payline 匹配

Payline（賠線）定義了捲軸上判定獲勝組合的連線路徑。

**匹配規則**

1. 從最左側捲軸開始，向右連續匹配相同符號（Left-to-Right）
2. Wild 符號視為匹配任何普通符號
3. 最少需匹配 3 個連續符號才算獲勝（可依遊戲設定調整）
4. 每條 Payline 獨立評估，同一次旋轉可在多條 Payline 上獲勝

**Payline 定義範例（5×3 捲軸）**

```typescript
// 每條 Payline 定義為各捲軸上的行位置（0=上、1=中、2=下）
const paylines: number[][] = [
  [1, 1, 1, 1, 1], // 中間橫線
  [0, 0, 0, 0, 0], // 上方橫線
  [2, 2, 2, 2, 2], // 下方橫線
  [0, 1, 2, 1, 0], // V 形
  [2, 1, 0, 1, 2], // 倒 V 形
];
```

**匹配虛擬碼**

```typescript
function evaluatePayline(
  payline: number[],
  visibleSymbols: string[][],
  paytable: Paytable,
  wildSymbol: string = 'WILD'
): WinLine | null {
  const symbols: string[] = payline.map((row, col) => visibleSymbols[col][row]);

  // 從左至右尋找最長連續匹配
  const firstSymbol = symbols[0] === wildSymbol ? findFirstNonWild(symbols) : symbols[0];
  if (!firstSymbol) return null; // 全部是 Wild 的情況另外處理

  let matchCount = 0;
  for (const sym of symbols) {
    if (sym === firstSymbol || sym === wildSymbol) {
      matchCount++;
    } else {
      break;
    }
  }

  if (matchCount < 3) return null; // 未達最低匹配數

  const payout = paytable.getPayout(firstSymbol, matchCount);
  return {
    lineId: payline.id,
    symbols: symbols.slice(0, matchCount),
    matchCount,
    multiplier: 1, // 基礎乘數，Step 4 可能調整
    payout,
  };
}
```

### 5.4 Step 3：Scatter 觸發條件

Scatter（散佈）符號不需在 Payline 上，出現在任意位置即可觸發。

**觸發規則**

| Scatter 數量 | 觸發效果 |
|-------------|----------|
| 2 個 | 通常無獎勵（部分遊戲給予小額獎金） |
| 3 個 | 觸發 Free Spin（如 10 次免費旋轉） |
| 4 個 | 觸發更多 Free Spin（如 15 次） |
| 5 個 | 觸發最多 Free Spin（如 20 次）+ 額外獎金 |

**實作要點**

- Scatter 計數在所有捲軸的所有可見位置中進行
- Scatter 觸發的獎勵獨立於 Payline 獎金
- Scatter 獎金通常以總投注金額（而非單線投注）的倍數計算
- Free Spin 期間可重新觸發（Retrigger）

**虛擬碼**

```typescript
function evaluateScatter(
  visibleSymbols: string[][],
  scatterSymbol: string = 'SCATTER'
): ScatterResult {
  let count = 0;
  for (const reel of visibleSymbols) {
    for (const symbol of reel) {
      if (symbol === scatterSymbol) count++;
    }
  }

  return {
    count,
    triggered: count >= 3,
    freeSpins: count >= 5 ? 20 : count >= 4 ? 15 : count >= 3 ? 10 : 0,
    scatterPayout: getScatterPayout(count),
  };
}
```

### 5.5 Step 4：Multiplier 套用

Multiplier（乘數）在所有獎金計算完成後套用。

**套用規則**

1. 基礎乘數為 1x（無額外乘數）
2. 若觸發 Multiplier Wild，該賠線獎金乘以 Wild 的乘數值
3. 若處於 Free Spin 期間且有全局乘數，所有獎金乘以全局乘數
4. 多個乘數的疊加方式依遊戲設計決定（相乘或相加）

**虛擬碼**

```typescript
function applyMultipliers(
  winLines: WinLine[],
  globalMultiplier: number = 1
): WinLine[] {
  return winLines.map(line => ({
    ...line,
    payout: line.payout * line.multiplier * globalMultiplier,
  }));
}
```

### 5.6 完整規則評估流程

```typescript
function stage4_evaluateRules(
  visibleSymbols: string[][],
  paylines: number[][],
  paytable: Paytable
): EvaluationResult {
  // Step 1: Wild 替代（在 Payline 匹配中整合處理）

  // Step 2: Payline 匹配
  const winLines: WinLine[] = [];
  for (const payline of paylines) {
    const result = evaluatePayline(payline, visibleSymbols, paytable);
    if (result) winLines.push(result);
  }

  // Step 3: Scatter 觸發
  const scatterResult = evaluateScatter(visibleSymbols);

  // Step 4: Multiplier 套用
  const finalWinLines = applyMultipliers(winLines);

  return {
    winLines: finalWinLines,
    scatterResult,
    totalWin: finalWinLines.reduce((sum, l) => sum + l.payout, 0)
      + scatterResult.scatterPayout,
  };
}
```


---

## 6. 審計日誌

審計日誌是認證合規的關鍵要素，記錄每次旋轉的完整資訊，供第三方測試實驗室與監管機構審查。

### 6.1 日誌格式

建議使用結構化 JSON 格式，便於解析與查詢：

```typescript
interface SpinAuditLog {
  spinId: string;             // 唯一旋轉識別碼（UUID v4）
  timestamp: string;          // ISO 8601 時間戳記（含時區）
  sessionId: string;          // 會話識別碼
  playerId: string;           // 玩家識別碼
  betAmount: number;          // 單線投注金額
  betLines: number;           // 投注賠線數
  rngOutput: number[];        // RNG 原始輸出值（每個捲軸一個）
  reelStops: number[];        // 捲軸停止位置索引
  visibleSymbols: string[][]; // 可見符號矩陣（columns × rows）
  winLines: WinLine[];        // 獲勝賠線詳情
  totalWin: number;           // 總獎金金額
  bonusTriggered: boolean;    // 是否觸發獎勵回合
  balanceBefore: number;      // 旋轉前餘額
  balanceAfter: number;       // 旋轉後餘額
}

interface WinLine {
  lineId: number;             // 賠線編號
  symbols: string[];          // 匹配符號
  matchCount: number;         // 匹配數量
  multiplier: number;         // 適用乘數
  payout: number;             // 該線獎金
}
```

### 6.2 必要欄位說明

| 欄位 | 類型 | 必要性 | 說明 |
|------|------|--------|------|
| `spinId` | string | 必要 | 全局唯一識別碼，用於追蹤與查詢 |
| `timestamp` | string | **必要** | ISO 8601 格式，精確到毫秒，含時區資訊 |
| `sessionId` | string | 必要 | 關聯玩家會話，用於會話級審計 |
| `playerId` | string | 必要 | 關聯玩家身份，用於玩家級審計 |
| `betAmount` | number | **必要** | 記錄投注金額，用於 RTP 驗算 |
| `betLines` | number | 必要 | 記錄投注賠線數 |
| `rngOutput` | number[] | **必要** | 記錄 RNG 原始輸出，用於結果重現與驗證 |
| `reelStops` | number[] | 必要 | 記錄捲軸停止位置，用於映射驗證 |
| `visibleSymbols` | string[][] | **必要** | 記錄最終顯示的符號矩陣 |
| `winLines` | WinLine[] | **必要** | 記錄所有獲勝賠線的詳細資訊 |
| `totalWin` | number | **必要** | 記錄總獎金金額，用於 RTP 驗算 |
| `bonusTriggered` | boolean | 必要 | 記錄是否觸發獎勵回合 |
| `balanceBefore` | number | 必要 | 旋轉前餘額，用於資金流追蹤 |
| `balanceAfter` | number | 必要 | 旋轉後餘額，用於資金流追蹤 |

> 標記為 **必要** 的欄位為認證實驗室審查的核心欄位，缺少任何一個將導致認證失敗。

### 6.3 日誌範例

```json
{
  "spinId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "timestamp": "2025-07-15T14:30:00.123Z",
  "sessionId": "sess-001-xyz",
  "playerId": "player-12345",
  "betAmount": 0.50,
  "betLines": 20,
  "rngOutput": [42, 87, 15, 103, 61],
  "reelStops": [3, 7, 1, 9, 5],
  "visibleSymbols": [
    ["K", "WILD", "A"],
    ["WILD", "WILD", "Q"],
    ["K", "K", "10"],
    ["A", "J", "K"],
    ["Q", "10", "A"]
  ],
  "winLines": [
    {
      "lineId": 1,
      "symbols": ["K", "WILD", "K", "A"],
      "matchCount": 3,
      "multiplier": 1,
      "payout": 7.50
    }
  ],
  "totalWin": 7.50,
  "bonusTriggered": false,
  "balanceBefore": 100.00,
  "balanceAfter": 97.50
}
```

### 6.4 儲存策略

| 策略 | 說明 | 適用場景 |
|------|------|----------|
| **即時寫入資料庫** | 每次旋轉完成後立即寫入 | 高監管市場（UK、Malta） |
| **批次寫入** | 累積 N 筆後批次寫入 | 效能敏感的高流量場景 |
| **雙寫策略** | 同時寫入主資料庫與備份儲存 | 需要高可用性的場景 |
| **事件串流** | 寫入 Kafka/RabbitMQ 等訊息佇列 | 微服務架構 |

**儲存要求**

- **保留期限**：依司法管轄區要求，通常至少保留 5 年（UK 要求 3 年、Malta 要求 5 年）
- **不可篡改性**：日誌寫入後不可修改或刪除，建議使用 Append-Only 儲存
- **加密儲存**：包含玩家資訊的日誌應加密儲存（AES-256 或同等級）
- **存取控制**：僅授權人員可存取審計日誌，需記錄存取日誌
- **備份策略**：至少維護一份異地備份

**效能考量**

- 審計日誌寫入不應阻塞旋轉結果的返回（使用非同步寫入）
- 建議使用寫入緩衝區（Write Buffer）降低 I/O 壓力
- 為 `spinId`、`timestamp`、`playerId` 建立索引，加速查詢


---

## 7. 第三方測試實驗室驗證準備

### 7.1 主要認證實驗室

| 實驗室 | 總部 | 主要服務市場 | 特色 |
|--------|------|-------------|------|
| **GLI（Gaming Laboratories International）** | 美國 | 全球（北美、歐洲、亞太） | 全球最大的博弈測試實驗室，制定 GLI-11/GLI-19 標準 |
| **iTech Labs** | 澳洲 | 歐洲、亞太、拉丁美洲 | 專精 RNG 測試與線上博弈認證 |
| **eCOGRA** | 英國 | 歐洲（UK、Malta、Gibraltar） | 獨立的公平性認證機構，提供「Safe and Fair」認證標章 |
| **BMM Testlabs** | 美國 | 全球（北美、歐洲、亞太） | 歷史悠久的博弈測試實驗室，提供全方位認證服務 |

### 7.2 RNG 驗證測試項目

認證實驗室會對 RNG 執行以下測試：

**統計隨機性測試**

| 測試名稱 | 說明 | 標準 |
|----------|------|------|
| NIST SP 800-22 測試套件 | 15 項統計測試（頻率測試、遊程測試、矩陣秩測試等） | 所有測試 p-value > 0.01 |
| Diehard 測試 | 多項隨機性測試（生日間距、重疊排列等） | 所有測試通過 |
| 卡方檢定 | 驗證結果分佈符合預期 | p-value > 0.01 |
| 序列相關性測試 | 驗證連續輸出無相關性 | 相關係數 < 0.05 |

**RNG 實作審查**

- 原始碼審查：確認使用 CSPRNG 而非一般 PRNG
- 種子管理審查：確認種子來源具備足夠熵值
- 獨立性審查：確認每次旋轉結果獨立
- 映射審查：確認 RNG 輸出到符號的映射正確且公平

### 7.3 提交文件清單

準備認證時，需向測試實驗室提交以下與 RNG 及遊戲邏輯相關的文件：

| 文件 | 內容 | 格式建議 |
|------|------|----------|
| RNG 技術說明書 | CSPRNG 演算法選擇、種子管理機制、熵值來源 | PDF / Word |
| RNG 原始碼 | 完整的 RNG 模組原始碼 | 原始碼檔案 |
| 映射邏輯說明 | Virtual Reel 權重表與映射函數說明 | PDF + 原始碼 |
| 規則引擎說明 | Payline 定義、Wild/Scatter 規則、Multiplier 邏輯 | PDF |
| RTP 計算報告 | 理論 RTP 計算過程與蒙地卡羅模擬結果 | PDF + 試算表 |
| 審計日誌格式說明 | 日誌欄位定義與範例 | PDF |
| 自測報告 | 內部執行的統計隨機性測試結果 | PDF |

### 7.4 自測建議

在提交認證前，建議先執行以下自測：

1. **RNG 統計測試**：使用 NIST SP 800-22 測試套件，產生至少 100 萬個隨機數進行測試
2. **RTP 模擬驗證**：執行至少 1,000 萬次旋轉的蒙地卡羅模擬，確認實際 RTP 與理論值誤差 < 0.5%
3. **獨立性驗證**：對連續 10 萬次旋轉結果執行自相關測試
4. **映射驗證**：驗證所有 RNG 輸出值均能正確映射到有效的捲軸位置
5. **邊界測試**：測試 RNG 輸出的最小值（0）與最大值（totalWeight - 1）的映射結果
6. **審計日誌完整性**：驗證每次旋轉均產生包含所有必要欄位的審計日誌