# 老虎機開發專家 Kiro Power

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

## 安裝方式

1. 將本專案資料夾放入 Kiro Powers 目錄
2. 在 Kiro 中啟用此 Power
3. 依照 Onboarding 步驟選擇遊戲引擎、專案類型、目標市場與開發階段

## 專案結構

```
├── POWER.md                          # Power 主定義檔（進入點）
├── steering/
│   ├── math-model.md                 # 數學模型設計指引
│   ├── rng-game-logic.md             # RNG 與遊戲邏輯指引
│   ├── certification-prep.md         # 認證準備指引
│   └── responsible-gaming.md         # 負責任遊戲指引
├── tests/                            # 屬性測試（fast-check + vitest）
│   ├── power-md-structure.test.ts    # 屬性 1：POWER.md 結構完整性
│   ├── hit-frequency.test.ts         # 屬性 2：Hit Frequency 公式
│   ├── rtp-sum.test.ts               # 屬性 3：RTP 加總不變量
│   ├── virtual-reel-mapping.test.ts  # 屬性 4：Virtual Reel 映射
│   ├── audit-log-completeness.test.ts# 屬性 5：審計日誌完整性
│   ├── low-rtp-warning.test.ts       # 屬性 6：低 RTP 警告
│   ├── session-net-winloss.test.ts   # 屬性 7：淨盈虧計算
│   ├── engine-techstack-mapping.test.ts # 屬性 8：技術棧映射
│   └── reference-entry-validity.test.ts # 屬性 9：參考資料有效性
├── package.json
├── tsconfig.json
└── vitest.config.ts
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
| Unity | C# | `System.Security.Cryptography` |
| Cocos Creator | TypeScript | Web Crypto API / Node.js crypto |
| Unreal Engine | C++/Blueprint | OpenSSL `RAND_bytes` |
| Godot | GDScript/C# | `Crypto` class |
| HTML5/PixiJS | JS/TS | Web Crypto API |

## 執行測試

```bash
npm install
npx vitest --run
```

共 9 個測試檔案、13 個屬性測試，驗證數學模型公式、資料結構完整性與映射一致性。

## 授權

本 Power 中的知識內容均標註 2024–2026 年間的公開資料來源，詳見 POWER.md 參考資料區塊。
