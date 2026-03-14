# 負責任遊戲功能實作工作流程指引

本指引涵蓋老虎機負責任遊戲功能的完整實作工作流程，包括存款限制、自我排除機制、會話時間限制、勝負追蹤、自動播放管控與風險訊息顯示。所有功能均以保護玩家為核心目標，並符合主要司法管轄區的監管要求。

---

## 1. 存款限制功能

### 1.1 功能概述

存款限制（Deposit Limits / Betting Limits）允許玩家主動設定每日、每週或每月的投注上限，防止過度消費。此功能為多數司法管轄區的強制要求，尤其在英國（UKGC）與安大略省（AGCO）市場。

### 1.2 限制類型

| 限制類型 | 週期 | 說明 |
|----------|------|------|
| 每日限制 | 24 小時 | 自設定時刻起算的 24 小時內投注總額上限 |
| 每週限制 | 7 天 | 自設定時刻起算的 7 天內投注總額上限 |
| 每月限制 | 30 天 | 自設定時刻起算的 30 天內投注總額上限 |

### 1.3 實作指引

#### 資料模型

```typescript
interface BettingLimit {
  playerId: string;
  limitType: 'daily' | 'weekly' | 'monthly';
  limitAmount: number;       // 上限金額
  currentSpent: number;      // 當前週期已投注金額
  periodStart: string;       // 週期起始時間（ISO 8601）
  periodEnd: string;         // 週期結束時間（ISO 8601）
  createdAt: string;         // 設定時間
  updatedAt: string;         // 最後更新時間
}
```

#### 核心邏輯

1. **設定限制**：玩家可隨時設定或降低投注上限，降低限制立即生效
2. **提高限制**：提高投注上限需經過冷卻期（建議 24–72 小時），防止衝動決策
3. **投注檢查**：每次旋轉前檢查投注金額是否超過剩餘額度
4. **週期重置**：週期結束時自動重置已投注金額計數器
5. **多層級限制**：若同時設定每日與每月限制，取最嚴格的限制生效

#### 投注前驗證虛擬碼

```typescript
function validateBet(playerId: string, betAmount: number): boolean {
  const limits = getPlayerLimits(playerId);
  for (const limit of limits) {
    if (limit.currentSpent + betAmount > limit.limitAmount) {
      notifyPlayer(playerId, `已達到${limit.limitType}投注上限`);
      return false;
    }
  }
  return true;
}
```

#### UI 設計建議

| 元素 | 說明 |
|------|------|
| 限制設定入口 | 在帳戶設定或遊戲選單中提供明顯的入口 |
| 剩餘額度顯示 | 在遊戲介面中顯示當前週期的剩餘可投注額度 |
| 接近上限提醒 | 當已投注金額達到上限的 80% 時，顯示提醒訊息 |
| 達到上限通知 | 達到上限時，明確告知玩家並阻止進一步投注 |
| 歷史記錄 | 提供限制設定與變更的歷史記錄查詢 |

### 1.4 合規要求

| 市場 | 特定要求 |
|------|----------|
| 英國（UKGC） | 強制要求提供存款限制功能，首次註冊時必須提示設定 |
| 馬爾他（MGA） | 必須提供存款限制選項 |
| 安大略省（AGCO） | 必須提供存款限制，且須在註冊流程中提示 |
| 瑞典 | 強制要求，且有國家級存款限制系統（Spelpaus） |


---

## 2. 自我排除機制

### 2.1 功能概述

自我排除（Self-Exclusion）允許玩家主動暫停或永久停止遊戲存取。此機制是負責任遊戲的核心功能，為所有主要司法管轄區的強制要求。

### 2.2 排除類型

| 排除類型 | 期限 | 說明 |
|----------|------|------|
| 暫時冷靜期 | 24 小時–30 天 | 短期暫停，到期後自動恢復存取 |
| 中期排除 | 1–6 個月 | 中期暫停，到期後需玩家主動申請恢復 |
| 長期排除 | 6–12 個月 | 長期暫停，到期後需經過冷卻期方可恢復 |
| 永久排除 | 無限期 | 永久停止遊戲存取，不可逆轉或需極嚴格的恢復流程 |

### 2.3 實作指引

#### 資料模型

```typescript
interface SelfExclusion {
  playerId: string;
  exclusionType: 'cooldown' | 'medium' | 'long' | 'permanent';
  startDate: string;         // 排除開始時間（ISO 8601）
  endDate: string | null;    // 排除結束時間（永久排除為 null）
  reason: string;            // 玩家自述原因（選填）
  status: 'active' | 'expired' | 'revoked';
  createdAt: string;
}
```

#### 核心邏輯

1. **啟動排除**：玩家申請後立即生效，不可延遲
2. **存取阻斷**：排除期間阻止所有遊戲操作（登入、投注、存款）
3. **行銷停止**：排除期間停止所有促銷郵件與推播通知
4. **恢復流程**：
   - 暫時冷靜期：到期後自動恢復
   - 中期/長期排除：到期後需玩家主動申請，並經過 24 小時冷卻期
   - 永久排除：不可恢復，或需聯繫客服並經過嚴格審核（依市場規範）
5. **跨平台同步**：若營運商擁有多個遊戲平台，排除應跨平台生效

#### 登入檢查虛擬碼

```typescript
function checkExclusion(playerId: string): boolean {
  const exclusion = getActiveExclusion(playerId);
  if (!exclusion) return true; // 無排除，允許存取

  if (exclusion.exclusionType === 'permanent') {
    denyAccess(playerId, '您已永久自我排除，無法存取遊戲');
    return false;
  }

  if (new Date() < new Date(exclusion.endDate!)) {
    const remaining = calculateRemainingTime(exclusion.endDate!);
    denyAccess(playerId, `自我排除中，剩餘 ${remaining}`);
    return false;
  }

  return true; // 排除已到期
}
```

#### UI 設計建議

| 元素 | 說明 |
|------|------|
| 排除入口 | 在帳戶設定中提供明顯的自我排除選項 |
| 期限選擇 | 提供多種排除期限供玩家選擇 |
| 確認步驟 | 啟動前需二次確認，說明排除的影響與恢復條件 |
| 排除狀態 | 排除期間登入時顯示排除狀態與剩餘時間 |
| 求助資訊 | 提供問題遊戲求助熱線與資源連結 |

### 2.4 合規要求

| 市場 | 特定要求 |
|------|----------|
| 英國（UKGC） | 必須整合 GamStop 全國自我排除系統 |
| 馬爾他（MGA） | 必須提供至少 6 個月的自我排除選項 |
| 安大略省（AGCO） | 必須整合 ConnexOntario 自我排除系統 |
| 瑞典 | 必須整合 Spelpaus 國家級自我排除系統 |
| 丹麥 | 必須整合 ROFUS 國家級自我排除系統 |


---

## 3. 會話時間限制功能

### 3.1 功能概述

會話時間限制（Session Time Limits）在玩家持續遊戲達到設定時間時發出提醒，幫助玩家意識到遊戲時間的流逝，防止過度沉迷。

### 3.2 提醒機制類型

| 機制類型 | 說明 |
|----------|------|
| 固定間隔提醒 | 每隔固定時間（如 30 分鐘、60 分鐘）發出提醒 |
| 玩家自訂提醒 | 玩家自行設定遊戲時間上限，到達時發出提醒 |
| 強制中斷 | 達到時間上限後強制暫停遊戲，需玩家確認後方可繼續 |
| 強制登出 | 達到最大時間上限後強制登出，需等待冷卻期後方可重新登入 |

### 3.3 實作指引

#### 資料模型

```typescript
interface SessionTimeConfig {
  playerId: string;
  reminderInterval: number;   // 提醒間隔（分鐘）
  maxSessionDuration: number; // 最大會話時長（分鐘），0 表示無上限
  cooldownAfterMax: number;   // 達到上限後的冷卻期（分鐘）
}

interface SessionTracker {
  sessionId: string;
  playerId: string;
  startTime: string;          // 會話開始時間（ISO 8601）
  totalPlayTime: number;      // 累計遊戲時間（秒）
  lastReminderAt: number;     // 上次提醒時的累計時間（秒）
  isActive: boolean;
}
```

#### 核心邏輯

1. **會話開始**：玩家開始遊戲時啟動計時器
2. **持續追蹤**：記錄累計遊戲時間（不含閒置時間）
3. **間隔提醒**：每達到提醒間隔時顯示提醒訊息
4. **提醒內容**：顯示已遊戲時間、當前淨盈虧金額、繼續或停止的選項
5. **強制中斷**：達到最大時長時暫停遊戲，等待玩家確認
6. **冷卻期**：達到強制登出條件後，需等待冷卻期方可重新登入

#### 時間提醒虛擬碼

```typescript
function checkSessionTime(tracker: SessionTracker, config: SessionTimeConfig): void {
  const elapsedMinutes = tracker.totalPlayTime / 60;
  const timeSinceLastReminder = tracker.totalPlayTime - tracker.lastReminderAt;

  // 間隔提醒
  if (timeSinceLastReminder >= config.reminderInterval * 60) {
    showTimeReminder(tracker.playerId, {
      playTime: elapsedMinutes,
      netWinLoss: getSessionNetWinLoss(tracker.sessionId),
    });
    tracker.lastReminderAt = tracker.totalPlayTime;
  }

  // 強制中斷
  if (config.maxSessionDuration > 0 && elapsedMinutes >= config.maxSessionDuration) {
    pauseGame(tracker.playerId, '已達到遊戲時間上限');
  }
}
```

#### UI 設計建議

| 元素 | 說明 |
|------|------|
| 時間設定入口 | 在帳戶設定或遊戲開始前提供時間限制設定 |
| 遊戲時鐘 | 在遊戲介面中顯示當前會話的遊戲時間（可選顯示/隱藏） |
| 提醒彈窗 | 提醒時顯示彈窗，包含遊戲時間、淨盈虧與繼續/停止按鈕 |
| 強制暫停畫面 | 達到上限時顯示全螢幕暫停畫面，需玩家主動確認 |
| 冷卻倒數 | 強制登出後顯示冷卻期倒數計時 |

### 3.4 合規要求

| 市場 | 特定要求 |
|------|----------|
| 英國（UKGC） | 必須提供遊戲時間提醒，建議每 60 分鐘提醒一次 |
| 瑞典 | 強制要求每 60 分鐘顯示遊戲時間與淨盈虧 |
| 安大略省（AGCO） | 必須提供遊戲時間提醒功能 |
| 挪威 | 強制每 60 分鐘中斷，且每日最長遊戲時間限制 |


---

## 4. 勝負追蹤功能

### 4.1 功能概述

勝負追蹤（Win/Loss Tracking）向玩家即時顯示當前會話的淨盈虧金額，幫助玩家清楚了解自己的財務狀況，做出理性的遊戲決策。

### 4.2 淨盈虧計算

**核心公式**

```
淨盈虧金額 = Σ(所有獎金) - Σ(所有投注金額)
netAmount = Σ(wins) - Σ(bets)
```

- 正值表示玩家盈利
- 負值表示玩家虧損
- 零值表示持平

**計算範例**

| 旋轉 | 投注金額 | 獎金 | 累計投注 | 累計獎金 | 淨盈虧 |
|------|----------|------|----------|----------|--------|
| 1 | $1.00 | $0.00 | $1.00 | $0.00 | -$1.00 |
| 2 | $1.00 | $2.50 | $2.00 | $2.50 | +$0.50 |
| 3 | $1.00 | $0.00 | $3.00 | $2.50 | -$0.50 |
| 4 | $2.00 | $10.00 | $5.00 | $12.50 | +$7.50 |
| 5 | $2.00 | $0.00 | $7.00 | $12.50 | +$5.50 |

### 4.3 實作指引

#### 資料模型

```typescript
interface SessionWinLossTracker {
  sessionId: string;
  playerId: string;
  totalBets: number;          // 累計投注金額
  totalWins: number;          // 累計獎金金額
  netAmount: number;          // 淨盈虧 = totalWins - totalBets
  spinCount: number;          // 旋轉次數
  sessionStart: string;       // 會話開始時間（ISO 8601）
}
```

#### 核心邏輯

1. **會話初始化**：新會話開始時，所有計數器歸零
2. **每次旋轉更新**：
   - `totalBets += betAmount`
   - `totalWins += winAmount`
   - `netAmount = totalWins - totalBets`
   - `spinCount += 1`
3. **即時顯示**：每次旋轉後立即更新介面上的淨盈虧顯示
4. **會話結束**：記錄最終淨盈虧至玩家歷史記錄

#### 淨盈虧更新虛擬碼

```typescript
function updateSessionWinLoss(
  tracker: SessionWinLossTracker,
  betAmount: number,
  winAmount: number
): void {
  tracker.totalBets += betAmount;
  tracker.totalWins += winAmount;
  tracker.netAmount = tracker.totalWins - tracker.totalBets;
  tracker.spinCount += 1;

  updateUI(tracker.playerId, {
    netAmount: tracker.netAmount,
    totalBets: tracker.totalBets,
    totalWins: tracker.totalWins,
  });
}
```

#### UI 設計建議

| 元素 | 說明 |
|------|------|
| 淨盈虧顯示 | 在遊戲介面中持續顯示當前會話的淨盈虧金額 |
| 顏色編碼 | 盈利顯示綠色、虧損顯示紅色、持平顯示灰色 |
| 更新頻率 | 每次旋轉後即時更新 |
| 詳細資訊 | 點擊可展開查看累計投注、累計獎金與旋轉次數 |
| 歷史記錄 | 提供過往會話的淨盈虧歷史查詢 |

### 4.4 合規要求

| 市場 | 特定要求 |
|------|----------|
| 英國（UKGC） | 2025 年起強制要求在自動播放期間顯示淨盈虧 |
| 瑞典 | 強制要求在時間提醒中包含淨盈虧資訊 |
| 丹麥 | 建議在遊戲介面中顯示淨盈虧 |


---

## 5. 自動播放管控

### 5.1 功能概述

自動播放（Autoplay）允許玩家設定連續自動旋轉，無需每次手動點擊。由於自動播放可能導致玩家失去對投注行為的控制，多個司法管轄區已對此功能實施嚴格限制或完全禁止。

### 5.2 各市場自動播放規範

| 市場 | 規範 | 說明 |
|------|------|------|
| 英國（UKGC） | 嚴格限制 | 2025 年起：每次自動旋轉間須顯示淨盈虧、須設定損失上限、每次旋轉最少間隔 2.5 秒 |
| 瑞典 | 完全禁止 | 自 2019 年起禁止所有形式的自動播放 |
| 挪威 | 完全禁止 | 禁止自動播放功能 |
| 比利時 | 完全禁止 | 禁止自動播放功能 |
| 西班牙 | 嚴格限制 | 須設定自動旋轉次數上限與損失上限 |
| 馬爾他（MGA） | 允許（有條件） | 須提供停止條件設定（損失上限、獲勝上限、旋轉次數上限） |
| 安大略省（AGCO） | 允許（有條件） | 須提供停止條件設定 |

### 5.3 實作指引

#### 自動播放配置模型

```typescript
interface AutoplayConfig {
  enabled: boolean;           // 是否啟用自動播放
  maxSpins: number;           // 最大自動旋轉次數
  lossLimit: number;          // 損失上限（達到後自動停止）
  winLimit: number;           // 獲勝上限（達到後自動停止）
  stopOnFeature: boolean;     // 觸發獎勵功能時是否停止
  stopOnBalanceBelow: number; // 餘額低於此值時停止
  spinInterval: number;       // 旋轉間隔（毫秒），最少 2500ms（英國市場）
}
```

#### 核心邏輯

1. **市場檢測**：根據玩家所在市場決定自動播放的可用性
2. **完全禁止市場**：隱藏自動播放按鈕，移除所有相關 UI 元素
3. **嚴格限制市場**：
   - 強制設定損失上限
   - 每次旋轉間顯示淨盈虧
   - 確保旋轉間隔符合最低要求
4. **允許市場**：提供完整的停止條件設定介面
5. **自動停止檢查**：每次自動旋轉後檢查所有停止條件

#### 自動播放控制虛擬碼

```typescript
function shouldStopAutoplay(
  config: AutoplayConfig,
  state: { spinsCompleted: number; netLoss: number; netWin: number; balance: number; featureTriggered: boolean }
): { stop: boolean; reason: string } {
  if (state.spinsCompleted >= config.maxSpins)
    return { stop: true, reason: '已達到自動旋轉次數上限' };
  if (state.netLoss >= config.lossLimit)
    return { stop: true, reason: '已達到損失上限' };
  if (state.netWin >= config.winLimit)
    return { stop: true, reason: '已達到獲勝上限' };
  if (config.stopOnFeature && state.featureTriggered)
    return { stop: true, reason: '觸發獎勵功能，自動播放已暫停' };
  if (state.balance < config.stopOnBalanceBelow)
    return { stop: true, reason: '餘額不足' };
  return { stop: false, reason: '' };
}
```

#### UI 設計建議

| 元素 | 說明 |
|------|------|
| 市場適配 | 根據玩家市場動態顯示或隱藏自動播放功能 |
| 設定面板 | 啟動前顯示完整的停止條件設定面板 |
| 進度顯示 | 自動播放期間顯示已完成旋轉次數與剩餘次數 |
| 淨盈虧顯示 | 每次自動旋轉後更新並顯示淨盈虧（英國市場強制） |
| 即時停止 | 提供明顯的「停止自動播放」按鈕 |
| 停止原因 | 自動停止時顯示停止原因 |

### 5.4 市場適配策略

```
if (market === 'SE' || market === 'NO' || market === 'BE') {
  // 完全禁止：移除自動播放功能
  removeAutoplayFeature();
} else if (market === 'GB') {
  // 嚴格限制：強制損失上限、淨盈虧顯示、最低旋轉間隔
  enableAutoplayWithStrictLimits();
} else if (market === 'ES') {
  // 嚴格限制：旋轉次數上限與損失上限
  enableAutoplayWithLimits();
} else {
  // 允許（有條件）：提供完整停止條件設定
  enableAutoplayWithConditions();
}
```

> ⚠️ **重要提醒**：若目標市場禁止自動播放，務必完全移除相關功能與 UI 元素，而非僅隱藏按鈕。認證測試實驗室會檢查程式碼中是否存在被隱藏的自動播放邏輯。


---

## 6. 風險訊息顯示

### 6.1 功能概述

風險訊息顯示（Risk Message Display）在遊戲介面中向玩家展示 RTP 百分比與遊戲風險提示，確保玩家在充分知情的情況下進行遊戲。

### 6.2 必要顯示內容

#### RTP 百分比顯示

| 顯示項目 | 說明 |
|----------|------|
| 理論 RTP | 遊戲的理論返還率百分比（如「本遊戲的理論 RTP 為 96.5%」） |
| RTP 說明 | 簡要解釋 RTP 的含義（如「RTP 表示長期統計平均回報百分比」） |
| 波動性等級 | 遊戲的波動性等級（高/中/低） |
| 最高獎金 | 單次旋轉可能獲得的最高獎金倍數 |

#### 遊戲風險提示

| 提示類型 | 範例文字 |
|----------|----------|
| 一般風險提示 | 「遊戲具有風險，請量力而為」 |
| 虧損提醒 | 「長期而言，遊戲的預期結果為虧損」 |
| 成癮警告 | 「遊戲可能導致成癮，如需協助請撥打求助熱線」 |
| 年齡限制 | 「本遊戲僅限 18 歲（或 21 歲）以上人士」 |
| 求助資訊 | 「如果您覺得遊戲已影響您的生活，請聯繫 [求助機構名稱]」 |

### 6.3 實作指引

#### 顯示位置與時機

| 位置/時機 | 說明 |
|-----------|------|
| 遊戲載入畫面 | 在遊戲載入時顯示 RTP 與風險提示 |
| 遊戲資訊頁面 | 在遊戲規則/資訊頁面中詳細列出 RTP 與所有風險提示 |
| 遊戲介面常駐 | 在遊戲介面中提供可存取的資訊按鈕（如 "i" 圖示） |
| 會話提醒 | 在時間提醒彈窗中包含風險提示 |
| 大額投注時 | 當投注金額超過一定閾值時顯示額外風險提示 |

#### 風險訊息配置模型

```typescript
interface RiskMessageConfig {
  gameId: string;
  rtpPercentage: number;       // 理論 RTP 百分比
  volatility: 'high' | 'medium' | 'low';
  maxWinMultiplier: number;    // 最高獎金倍數
  market: string;              // 目標市場代碼
  messages: RiskMessage[];     // 風險訊息列表
}

interface RiskMessage {
  type: 'general' | 'loss' | 'addiction' | 'age' | 'helpline';
  text: string;                // 訊息文字
  locale: string;              // 語言代碼
  displayLocation: ('loading' | 'info' | 'ingame' | 'reminder')[];
  mandatory: boolean;          // 是否為強制顯示
}
```

#### UI 設計建議

| 元素 | 說明 |
|------|------|
| RTP 標示 | 清晰標示 RTP 百分比，使用易於理解的語言 |
| 風險提示樣式 | 使用醒目但不干擾遊戲體驗的樣式（如底部橫幅） |
| 多語言支援 | 根據玩家語言偏好顯示對應語言的風險訊息 |
| 求助連結 | 提供可點擊的求助機構連結（如 GamCare、Gamblers Anonymous） |
| 無障礙設計 | 確保風險訊息符合 WCAG 2.1 AA 標準（對比度、字體大小） |

### 6.4 各市場求助資源

| 市場 | 求助機構 | 聯繫方式 |
|------|----------|----------|
| 英國 | GamCare | www.gamcare.org.uk / 0808 8020 133 |
| 英國 | BeGambleAware | www.begambleaware.org |
| 馬爾他 | Responsible Gaming Foundation | www.rgf.org.mt |
| 加拿大 | ConnexOntario | www.connexontario.ca / 1-866-531-2600 |
| 瑞典 | Stödlinjen | www.stodlinjen.se / 020-819 100 |
| 美國 | National Council on Problem Gambling | www.ncpgambling.org / 1-800-522-4700 |
| 國際 | Gamblers Anonymous | www.gamblersanonymous.org |

### 6.5 合規要求

| 市場 | 特定要求 |
|------|----------|
| 英國（UKGC） | 強制顯示 RTP、必須提供 GamCare/BeGambleAware 連結 |
| 馬爾他（MGA） | 須在遊戲規則中標示 RTP |
| 安大略省（AGCO） | 須在遊戲資訊中提供 RTP 範圍 |
| 瑞典 | 強制顯示風險訊息與求助連結 |
| 丹麥 | 強制顯示 RTP 與 ROFUS 自我排除系統連結 |

> ⚠️ **重要提醒**：風險訊息的文字內容應由法律顧問審核，確保符合各目標市場的具體措辭要求。部分市場對風險訊息的字體大小、顯示位置與措辭有明確規定。


---

## 7. 負責任遊戲功能檢查清單

實作負責任遊戲功能後，請使用以下檢查清單確認所有必要功能均已完成：

- [ ] 存款限制：每日/每週/每月投注上限設定與驗證
- [ ] 存款限制：降低限制立即生效、提高限制需冷卻期
- [ ] 自我排除：暫停與永久停止機制
- [ ] 自我排除：排除期間阻止所有遊戲操作與行銷通知
- [ ] 自我排除：跨平台同步（如適用）
- [ ] 會話時間限制：遊戲時間提醒機制
- [ ] 會話時間限制：提醒中包含淨盈虧資訊
- [ ] 勝負追蹤：即時淨盈虧金額顯示
- [ ] 勝負追蹤：淨盈虧計算正確（netAmount = Σ(wins) - Σ(bets)）
- [ ] 自動播放管控：依目標市場啟用、限制或禁止
- [ ] 自動播放管控：禁止市場完全移除功能（非僅隱藏）
- [ ] 風險訊息：RTP 百分比顯示
- [ ] 風險訊息：遊戲風險提示與求助連結
- [ ] 風險訊息：多語言支援（依目標市場）
- [ ] 年齡驗證：確保未成年人無法存取遊戲
- [ ] 所有功能的 UI 截圖或線框圖（供認證文件使用）

> 💡 **建議**：在認證提交前，由內部品質保證團隊逐項驗證上述清單，並記錄每項功能的測試結果。
