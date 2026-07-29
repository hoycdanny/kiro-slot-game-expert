# 老虎機開發專家 Kiro Power

[English](README.md) | [繁體中文](README_ZH.md) | [简体中文](README_CN.md) | [日本語](README_JP.md) | [한국어](README_KR.md)

使 Kiro 成為老虎機遊戲開發的合規顧問，涵蓋 26 個司法管轄區的法規約束、RNG 實作、數學模型設計與驗證、認證合規與負責任遊戲。

> **關於語言**：README 提供 5 種語言。Steering 指引以繁體中文撰寫，但**刻意保留英文法律與技術術語**——像 `RTS 14D`、`GlüStV §22a(6)`、`AGCO Standard 2.18`、`GLI-11 §3.2.2` 這類條號一律原文保留，因為你需要用這些字串去調閱法源、以及跟測試實驗室對話。不論 Steering 用什麼語言，Power 都會以你的語言回應。

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

- 🌍 **司法管轄區合規矩陣** — 26 個市場的產品硬約束對照：最小遊戲循環時間、投注上限、autoplay、turbo/slam stop、jackpot、多局同時進行、RTP 下限、資料落地、稽核保存期，每項都附法源條號與信心等級
- 🧭 **顧問參與流程** — 需求釐清 → 合規落差評估 → 風險登記冊 → 修復路線圖 → 交付物，含 B2B／B2C／平台商責任邊界矩陣
- 🎰 **數學模型設計** — Paytable 設計、Reel Strip 配置、RTP 計算、Volatility 調校、Hit Frequency 計算
- 🔬 **數學模型驗證** — Monte Carlo 樣本量由目標精度與實測 σ 反推（而非沿用慣例數字）、理論值與模擬值一致性判定、PAR sheet 十五章節規格、八類常見驗證失敗原因
- 🔐 **RNG 與遊戲邏輯** — CSPRNG 選擇（各引擎）、種子管理、Spin Lifecycle 六階段、規則引擎、審計日誌
- 🖧 **平台與系統層合規** — GLI-19 系統範圍、伺服器端決定結果、斷線與未完成局處理、錢包幂等性、game recall、監管機關中央系統整合（LUGAS、OASIS、Spelpaus、CRUKS、ROFUS、GAMSTOP、iGO、SAFE/TamperToken）
- 📋 **認證準備** — GLI-11/GLI-19 合規、七項認證文件、實驗室選擇、時程與費用預估
- 🔁 **變更管理與重新認證** — 變更分類框架、哪些變更會觸發重新送測、建置與認證綁定管理、法規變動追蹤
- 🚨 **事故與故障處理** — 事故分級、先停後修與證據保全、玩家補償判定、監管機關通報
- 🛡️ **負責任遊戲** — 存款限制、自我排除、會話時間限制、勝負追蹤、自動播放管控、風險訊息顯示
- 🔍 **AML/KYC 與資料保護** — 年齡分級、帳戶狀態機，以及博彩長期保存義務與資料保護最小化要求的衝突處理
- ⛔ **禁止市場登記冊** — 明確警示線上老虎機不合法的市場（澳洲、日本、韓國、新加坡、印度、南非），而不是讓人以為認證可以解決法律地位問題

## 這個 Power 的定位

**這是合規顧問，不是程式碼產生器。** 當你要求某個功能，它會先告訴你這個功能在你的目標市場是否合法，再給你合規的實作方式。

| | Accelerator（加速器） | 本 Power（Expert 顧問） |
|---|---|---|
| 被問到功能 | 直接實作 | 先問這個功能在目標市場合法嗎 |
| 被問到數字 | 給一個可用的值 | 給值 **＋ 信心等級 ＋ 法源 ＋ 查證方式** |
| 成功標準 | 東西動起來了 | 你知道自己承擔什麼風險 |

每個法規數值都標註信心等級：`HIGH`（已從官方法規原文確認）、`MEDIUM`（權威次級來源）、`UNVERIFIED`（**未確認，絕不填猜測值**）。

合規顧問寫錯一個數字，比留白更糟——留白會觸發查證，錯誤數字會直接進入產品規格，直到送測才被發現。

## 架構

```
Developer (Natural Language)
    → AI Layer (Intent Understanding & Planning)
        → Slot Machine Expert Power (Domain Knowledge)
            → 風險知情的決策，然後才是合規實作

Slot Machine Expert (Intelligence Layer)
├── POWER.md              → 定義工作流程與參考資料的主文件
├── steering/             → 12 份領域知識指引
├── templates/
│   ├── market-profiles/  → 26 個市場設定檔 + schema + 禁止市場登記冊
│   ├── certification/    → PAR sheet、RNG 送測包、變更申請、GLI 檢查清單
│   ├── advisory/         → 落差評估、風險登記冊、路線圖、事故通報
│   ├── paytable/         → 賠率表範本（依波動性）
│   └── reel-strip/       → 虛擬捲軸配置
├── hooks/                → IDE 自動化 hook
└── tests/                → 屬性測試（fast-check + vitest）
```

## 市場覆蓋

**已建立設定檔的受監管市場**：英國（UKGC）、德國（GGL）、瑞典（Spelinspektionen）、丹麥（Spillemyndigheden）、馬爾他（MGA）、安大略（AGCO）、內華達、紐澤西、密西根、賓州、西維吉尼亞、康乃迪克、德拉瓦、美國部落 Class III、巴西（SPA）、菲律賓（PAGCOR）、希臘、比利時、義大利、西班牙、荷蘭、羅馬尼亞、葡萄牙、曼島、直布羅陀、古拉索（LOK）、哥倫比亞、秘魯、Kahnawà:ke

**標示為禁止或灰色**：澳洲、日本、韓國、新加坡、印度、南非、墨西哥、哥斯大黎加

各設定檔深度不一。**未能取得官方來源的市場以「研究骨架」形式提供，明確標記 `UNVERIFIED` 並附查證清單**，而不是填入看起來合理的數字。

## 安裝方式

### Step 1 — 安裝 Power

開啟 Kiro → 左側面板點擊 Powers 圖示 → 點擊 "+" → 選擇 "Add Custom Power" → 選擇本專案根目錄

### Step 2 — 安裝自動引導 Hook（建議）

此 Hook 會把問題導向正確的 Steering File，並強制顧問行為準則：先確認司法管轄區、不把未驗證的法規數值當成事實、主動提出紅旗風險。

提供兩種格式，依你的 Kiro 版本擇一安裝：

```bash
mkdir -p .kiro/hooks

# 現行 agent hook 格式（v1 schema：version + hooks[] + UserPromptSubmit）
cp hooks/slot-expert-guidance.json .kiro/hooks/

# 舊格式，供讀取 .kiro.hook 的舊版 Kiro 使用
cp hooks/pre-slot-tool.kiro.hook .kiro/hooks/
```

**只裝一個**。不確定的話先用 `slot-expert-guidance.json`，再確認 Power 是否會自動啟動。

沒有安裝 Hook 時，你可能需要手動提醒 AI 使用專家知識。

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
├── steering/                         # 12 份領域知識指引
│   ├── jurisdiction-matrix.md        # 司法管轄區合規矩陣
│   ├── advisory-engagement.md        # 顧問參與流程
│   ├── math-model.md                 # 數學模型設計
│   ├── math-verification.md          # 數學模型驗證與 PAR sheet
│   ├── rng-game-logic.md             # RNG 與遊戲邏輯
│   ├── platform-systems-compliance.md# 平台與系統層合規
│   ├── certification-prep.md         # 認證準備
│   ├── responsible-gaming.md         # 負責任遊戲
│   ├── change-management-recert.md   # 變更管理與重新認證
│   ├── incident-malfunction-handling.md # 事故與故障處理
│   ├── aml-kyc-player-account.md     # AML/KYC 與玩家帳戶
│   └── data-protection-privacy.md    # 資料保護與隱私
├── templates/
│   ├── paytable/                     # 賠率表模板
│   ├── reel-strip/                   # 虛擬捲軸配置模板
│   ├── certification/                # PAR sheet、RNG 送測包、變更申請、GLI 檢查清單
│   ├── advisory/                     # 落差評估、風險登記冊、路線圖、事故通報
│   └── market-profiles/              # 26 個市場設定檔 + _schema + 禁止市場登記冊
├── hooks/
│   ├── slot-expert-guidance.json     # 自動引導 Hook（現行 v1 格式）
│   └── pre-slot-tool.kiro.hook       # 自動引導 Hook（舊格式）
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
| `jurisdiction-matrix.md` | 詢問特定市場或跨市場合規差異 | 逐市場產品硬約束對照、資料信心等級制度、跨市場架構策略（最嚴共同基準／能力旗標／市場專屬版本）、測試實驗室市場接受度、查證 SOP |
| `advisory-engagement.md` | 尋求合規諮詢、市場進入評估、落差分析 | 顧問五階段流程、B2B／B2C／平台商責任邊界、五種常見客戶情境應對、必須主動提出的警示 |
| `math-model.md` | 詢問數學模型相關問題 | Paytable 設計、Reel Strip 配置、RTP 計算、Volatility 調校、Hit Frequency、獎勵功能 RTP 貢獻 |
| `math-verification.md` | 詢問 RTP 驗證、模擬樣本量、PAR sheet | 理論 RTP 計算、Monte Carlo 樣本量推導、信賴區間判定、投注配置矩陣、八類常見驗證失敗原因 |
| `rng-game-logic.md` | 詢問 RNG 或遊戲邏輯 | CSPRNG 選擇（各引擎）、種子管理、Spin Lifecycle 六階段、規則引擎、審計日誌 |
| `platform-systems-compliance.md` | 詢問系統層合規 | GLI-19 系統範圍、伺服器端決定結果、斷線復原、錢包幂等性、game recall、中央系統整合、資料落地部署拓撲 |
| `certification-prep.md` | 詢問認證或合規 | GLI-11/GLI-19 標準、七項認證文件、市場監管資訊、時程與費用、RTP 門檻警告 |
| `responsible-gaming.md` | 詢問負責任遊戲功能 | 存款限制、自我排除、會話時間限制、勝負追蹤、自動播放管控、風險訊息顯示 |
| `change-management-recert.md` | 詢問認證後變更、是否需重新送測 | 變更分類框架、易誤判為呈現層的變更、各市場通報要求、建置與認證對應表、法規變動追蹤 |
| `incident-malfunction-handling.md` | 詢問故障處理、事故分級、玩家補償 | 事故分類、先停後修程序、證據保全清單、玩家補償判定、監管通報、預防性設計 |
| `aml-kyc-player-account.md` | 詢問年齡驗證、KYC、AML、帳戶狀態 | 各市場最低年齡（18／19／21）與年齡分級投注上限、帳戶狀態機、洗錢風險模式、跨營運商限額、支付約束 |
| `data-protection-privacy.md` | 詢問 GDPR、個資、保存與刪除衝突 | 資料分類與差異化生命週期、法律依據選擇、跨境傳輸、控制者／處理者角色、資安標準對應 |

### 兩項值得注意的更正

本次研究發現兩個業界廣泛流傳但無法證實的說法：

1. **馬爾他「最低 RTP 92%」無法在任何 MGA 現行文件中確認**，且 MGA 已發布政策文件探討調整為 85%。本 Power 將馬爾他最低 RTP 記為 `UNVERIFIED`，不重複該數字。
2. **NIST 自身立場是 SP 800-22 不應用於評估密碼學 RNG**，但它仍被普遍引用為博彩 RNG 合規依據。本 Power 指出此落差，而非沿用。

另也揭露 **GLI 與 iTech Labs 自 2023 年 5 月起屬同一企業集團**——當市場或合約要求實驗室獨立性時，這一點很重要。

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

共 13 個測試檔案、59 個測試，驗證數學模型公式、資料結構完整性、映射一致性，以及三項防漂移約束：市場設定檔 schema（標為 `UNVERIFIED` 的欄位不得帶具體數值）、POWER.md 與 steering 檔案的註冊一致性、hook 與 steering 的同步（新增 steering 忘記更新 hook 會直接測試失敗）。

## 疑難排解

| 問題 | 解決方案 |
|------|----------|
| AI 未以專家模式回應 | 確認已複製一個 Hook 到 `.kiro/hooks/`。若 `pre-slot-tool.kiro.hook` 沒有觸發，你的 Kiro 版本可能需要 v1 schema，改用 `slot-expert-guidance.json` |
| 測試失敗 | 執行 `npm install` 後重試 `npm test` |
| TypeScript 型別錯誤 | 執行 `npx tsc --noEmit`，確認已安裝依賴 |

## 安全性

請參閱 [CONTRIBUTING.md](CONTRIBUTING.md#security-issue-notifications) 了解安全問題通報方式。

## 授權

MIT License。詳見 [LICENSE](LICENSE) 檔案。

本 Power 中的知識內容均標註官方資料來源，詳見 POWER.md 參考資料區塊。所有 URL 均經人工驗證指向官方機構正式頁面。
