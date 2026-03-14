# 老虎機開發專家 Kiro Power

使 Kiro 成為老虎機遊戲開發的專業顧問，涵蓋 RNG 實作、數學模型設計、認證合規與負責任博弈。

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
│   └── responsible-gaming.md         # 負責任博弈指引
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
| `responsible-gaming.md` | 詢問負責任博弈功能 | 存款限制、自我排除、會話時間限制、勝負追蹤、自動播放管控、風險訊息顯示 |

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
