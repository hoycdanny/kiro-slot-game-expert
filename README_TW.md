# 老虎機開發專家 Kiro Power

[English](README.md) | [繁體中文](README_TW.md)

使 Kiro 成為老虎機遊戲開發的專業顧問，涵蓋 RNG 實作、數學模型設計、認證合規與負責任遊戲。

## 名詞解釋

| 名詞 | 說明 |
|------|------|
| **Kiro Power** | Kiro IDE 的擴充功能模組，透過文件定義讓 Kiro 具備特定領域的專業知識 |
| **POWER.md** | Power 的主定義檔，包含元資料、引導步驟與指令設定，是 Kiro 讀取此 Power 的進入點 |
| **Steering** | 工作流程指引檔案，放在 `steering/` 目錄下，當你向 Kiro 提問特定主題時會自動載入對應的指引 |
| **Onboarding** | 安裝 Power 後的初始引導流程，Kiro 會詢問你的遊戲引擎、專案類型等資訊，以提供更精準的建議 |
| **RNG** | 隨機數生成器（Random Number Generator），老虎機的核心元件，負責產生每次旋轉的隨機結果 |
| **CSPRNG** | 密碼學安全的隨機數生成器（Cryptographically Secure PRNG），符合遊戲產業安全標準的 RNG 實作方式 |
| **RTP** | 返還率（Return to Player），玩家長期平均能拿回的百分比，例如 96% 表示每投注 $100 平均回報 $96 |
| **Volatility** | 波動性，衡量老虎機的風險等級——高波動代表大獎但不常中，低波動代表小獎但常中 |
| **Hit Frequency** | 命中頻率，任一次旋轉產生獲勝組合的機率百分比 |
| **Paytable** | 賠率表，定義各符號組合對應的獎金倍數 |
| **Reel Strip** | 捲軸帶，定義每個捲軸上符號的排列順序與數量 |
| **Virtual Reel** | 虛擬捲軸，透過加權映射控制每個符號的實際出現機率，是調整 RTP 與波動性的關鍵機制 |
| **Spin Lifecycle** | 旋轉生命週期，從玩家按下旋轉到顯示結果的完整處理流程（共六個階段） |
| **GLI-11** | Gaming Laboratories International 發布的電子遊戲機技術標準，全球最廣泛採用的老虎機認證標準 |
| **GLI-19** | GLI 發布的遠端遊戲伺服器（RGS）技術標準，適用於線上老虎機 |
| **fast-check** | TypeScript/JavaScript 的屬性測試（Property-Based Testing）函式庫，用於自動生成大量隨機測試案例驗證程式正確性 |

## 功能特色

- 🎰 **數學模型設計** — Paytable 設計、Reel Strip 配置、RTP 計算、Volatility 調校、Hit Frequency 計算
- 🔐 **RNG 與遊戲邏輯** — CSPRNG 選擇（各引擎）、種子管理、Spin Lifecycle 六階段、規則引擎、審計日誌
- 📋 **認證準備** — GLI-11/GLI-19 合規、七項認證文件準備、市場監管資訊、時程與費用預估
- 🛡️ **負責任遊戲** — 存款限制、自我排除、會話時間限制、勝負追蹤、自動播放管控、風險訊息顯示
- 🌍 **多市場支援** — UK、Malta、Ontario、Nevada、New Jersey、Sweden、Denmark、Philippines 等

## 架構

```
Developer (Natural Language)
    → AI Layer (Intent Understanding & Planning)
        → Slot Machine Expert Power (Domain Knowledge)
            → Certified Game Implementation

Slot Machine Expert (Intelligence Layer)
├── POWER.md          → Main document defining workflows & references
├── steering/         → 4 domain knowledge files
├── templates/        → Reusable configuration templates
│   ├── paytable/     → Paytable templates (by volatility)
│   ├── reel-strip/   → Virtual reel configurations
│   ├── certification/→ GLI submission checklists
│   └── market-profiles/ → Regulatory market profiles
├── hooks/            → IDE automation hooks
└── tests/            → Property-based tests (fast-check + vitest)
```

## 安裝方式

### Step 1 — 安裝 Power

開啟 Kiro → 左側面板點擊 Powers 圖示 → 點擊 "+" → 選擇 "Add Custom Power" → 選擇本專案根目錄

### Step 2 — 安裝自動引導 Hook（建議）

此 Hook 確保 AI 在每次對話時自動載入 Power 並選擇正確的 Steering File：

```bash
mkdir -p .kiro/hooks
cp hooks/pre-slot-tool.kiro.hook .kiro/hooks/
```

### Step 3 — 驗證連線

在 Kiro 中輸入任何老虎機相關問題（如「幫我設計一個 96% RTP 的 5×3 老虎機數學模型」）。若 AI 以專業方式回應，表示安裝成功。

## 使用方式

安裝後直接用自然語言提問。AI 會自動載入對應的 Steering File 並以專家角色回應。

### 可以問什麼？

| 領域 | 範例問題 |
|------|----------|
| 數學模型 | 「設計一個中波動 96% RTP 的賠率表」「計算 Free Spin 的 RTP 貢獻」 |
| RNG | 「Unity 中如何正確實作 CSPRNG？」「審計日誌需要哪些欄位？」 |
| 認證 | 「準備 GLI-11 認證需要哪些文件？」「英國市場有什麼特殊要求？」 |
| 負責任遊戲 | 「如何實作存款限制功能？」「自動播放在瑞典市場的規範是什麼？」 |

## 專案結構

```
kiro-slot-game-expert/
├── POWER.md                          # Power 主定義檔（進入點）
├── steering/
│   ├── math-model.md                 # 數學模型設計指引
│   ├── rng-game-logic.md             # RNG 與遊戲邏輯指引
│   ├── certification-prep.md         # 認證準備指引
│   └── responsible-gaming.md         # 負責任遊戲指引
├── templates/
│   ├── paytable/                     # 賠率表模板
│   ├── reel-strip/                   # 虛擬捲軸配置模板
│   ├── certification/                # 認證提交清單
│   └── market-profiles/              # 市場監管配置檔
├── hooks/
│   └── pre-slot-tool.kiro.hook       # 自動引導 Hook
├── tests/                            # 屬性測試（fast-check + vitest）
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── LICENSE
├── CONTRIBUTING.md
└── CODE_OF_CONDUCT.md
```

## Steering 指引說明

| 檔案 | 觸發時機 | 涵蓋內容 |
|------|----------|----------|
| `math-model.md` | 詢問數學模型相關問題 | Paytable 設計、Reel Strip 配置、RTP 計算、Volatility 調校、Hit Frequency、獎勵功能 RTP 貢獻 |
| `rng-game-logic.md` | 詢問 RNG 或遊戲邏輯 | CSPRNG 選擇（各引擎）、種子管理、Spin Lifecycle 六階段、規則引擎、審計日誌 |
| `certification-prep.md` | 詢問認證或合規 | GLI-11/GLI-19 標準、七項認證文件、市場監管資訊、時程與費用、RTP 門檻警告 |
| `responsible-gaming.md` | 詢問負責任遊戲功能 | 存款限制、自我排除、會話時間限制、勝負追蹤、自動播放管控、風險訊息顯示 |

## 支援的遊戲引擎

| 引擎 | 語言 | CSPRNG |
|------|------|--------|
| Unity | C# | `System.Security.Cryptography.RandomNumberGenerator` |
| Cocos Creator | TypeScript | Web Crypto API / Node.js `crypto` |
| Unreal Engine | C++/Blueprint | OpenSSL `RAND_bytes` |
| Godot | GDScript/C# | `Crypto` class |
| HTML5/PixiJS | JS/TS | Web Crypto API (`crypto.getRandomValues`) |

## 執行測試

```bash
npm install
npm test              # 執行所有測試
npx tsc --noEmit     # TypeScript 型別檢查
```

共 9 個測試檔案、13 個屬性測試，驗證數學模型公式、資料結構完整性與映射一致性。

## 疑難排解

| 問題 | 解決方案 |
|------|----------|
| AI 未以專家模式回應 | 確認 Hook 已複製到 `.kiro/hooks/` 目錄 |
| 測試失敗 | 執行 `npm install` 後重試 `npm test` |
| TypeScript 型別錯誤 | 執行 `npx tsc --noEmit`，確認已安裝依賴 |

## 安全性

請參閱 [CONTRIBUTING.md](CONTRIBUTING.md#security-issue-notifications) 了解安全問題通報方式。

## 授權

MIT License。詳見 [LICENSE](LICENSE) 檔案。

本 Power 中的知識內容均標註官方資料來源，詳見 POWER.md 參考資料區塊。所有 URL 均經人工驗證指向官方機構正式頁面。
