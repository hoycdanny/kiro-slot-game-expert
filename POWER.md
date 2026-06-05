---
name: slot-machine-expert
displayName: 老虎機開發專家
description: 使 Kiro 成為老虎機遊戲開發的專業顧問，涵蓋 RNG、數學模型、認證合規與負責任遊戲
keywords:
  - slot machine
  - gambling
  - RNG
  - certification
  - GLI-11
  - responsible gaming
  - Unity
  - Cocos Creator
  - Unreal Engine
  - Godot
  - PixiJS
---

# 老虎機開發專家

歡迎使用老虎機開發專家 Power。本 Power 將使 Kiro 成為您的老虎機遊戲開發專業顧問，涵蓋 RNG 實作、數學模型設計、認證合規與負責任遊戲等核心領域。

## Onboarding

### Step 1
- prompt: 您使用哪個遊戲引擎開發老虎機？
- options:
  - Unity
  - Cocos Creator
  - Unreal Engine
  - Godot
  - HTML5/PixiJS
  - 自研引擎（Custom engine）
- variable: gameEngine

### Step 2
- prompt: 您的專案類型是什麼？
- options:
  - 瀏覽器遊戲（Browser game）
  - 原生應用（Native app）
  - 伺服器端邏輯（Server-side logic）
- variable: projectType

### Step 3
- prompt: 您的目標市場是哪個司法管轄區？（例如：Malta、UK、Ontario/Canada、Nevada/US、Macau、Philippines、其他）
- variable: targetMarket

### Step 4
- prompt: 您目前處於哪個開發階段？
- options:
  - 新專案（Starting a new project）
  - 既有專案改進（Improving an existing project）
- variable: developmentStage

## Steering

### math-model.md
- file: steering/math-model.md
- trigger: 當開發者詢問數學模型設計相關問題時觸發，包括 Paytable 設計、Reel Strip 配置、RTP 計算、Volatility 調校、Hit Frequency 計算、獎勵功能（Free Spin、Bonus Round、Multiplier、Progressive Jackpot）的 RTP 貢獻計算
- description: 數學模型設計工作流程指引，涵蓋賠率表設計、捲軸帶配置、返還率計算與波動性調校

### rng-game-logic.md
- file: steering/rng-game-logic.md
- trigger: 當開發者詢問 RNG 實作或遊戲邏輯相關問題時觸發，包括 CSPRNG 選擇、種子管理、旋轉獨立性、Spin Lifecycle 實作、規則引擎開發、審計日誌
- description: RNG 與遊戲邏輯實作工作流程指引，涵蓋密碼學安全隨機數生成器選擇、旋轉生命週期實作與規則引擎開發

### certification-prep.md
- file: steering/certification-prep.md
- trigger: 當開發者詢問認證或合規相關問題時觸發，包括 GLI-11、GLI-19 標準、認證文件準備、市場監管要求、認證時程與費用、RTP 門檻
- description: 認證準備工作流程指引，涵蓋 GLI 標準合規、文件準備、測試計畫與認證實驗室對接流程

### responsible-gaming.md
- file: steering/responsible-gaming.md
- trigger: 當開發者詢問負責任遊戲功能相關問題時觸發，包括存款限制、自我排除、會話時間限制、勝負追蹤、自動播放管控、風險訊息顯示
- description: 負責任遊戲實作工作流程指引，涵蓋玩家保護功能開發與合規檢查清單

## 技術棧建議（Tech Stack Recommendations）

依據遊戲引擎與專案類型，以下為 2026 年適用的老虎機開發技術棧建議。

### 遊戲引擎與主要語言映射

| 遊戲引擎 | 主要語言 | 適用場景 |
|----------|---------|---------|
| Unity | C# | 跨平台 2D/3D 老虎機，支援 iOS、Android、WebGL、桌面平台 |
| Cocos Creator | TypeScript | 輕量級跨平台與 H5 老虎機，適合行動端與瀏覽器 |
| Unreal Engine | C++/Blueprint | 高品質 3D 老虎機，適合需要頂級視覺效果的專案 |
| Godot | GDScript/C# | 獨立開發與原型驗證，開源且輕量 |
| HTML5/PixiJS | JavaScript/TypeScript | 純瀏覽器老虎機，無需安裝即可遊玩 |

### 伺服器端技術棧

| 技術 | 語言 | 適用場景 |
|------|------|---------|
| Python (Flask/FastAPI) | Python | 伺服器端邏輯與數學模型模擬，適合 RTP 驗算與統計分析 |
| Node.js (Express/Socket.io) | JavaScript/TypeScript | 多人即時功能，適合即時通訊、排行榜與多人遊戲同步 |

### 引擎專屬專案結構範本

#### Unity (C#)

```
Assets/
├── Scripts/
│   ├── Core/
│   │   ├── SlotMachine.cs          # 主遊戲控制器
│   │   ├── ReelController.cs       # 捲軸控制邏輯
│   │   └── SpinManager.cs          # 旋轉生命週期管理
│   ├── RNG/
│   │   └── CryptoRNG.cs            # System.Security.Cryptography 封裝
│   ├── Math/
│   │   ├── PaytableConfig.cs       # 賠率表配置
│   │   └── RTPCalculator.cs        # RTP 計算引擎
│   └── UI/
│       ├── SlotUI.cs               # 遊戲介面
│       └── ResponsibleGaming.cs    # 負責任遊戲 UI
├── Resources/
│   ├── ReelStrips/                  # 捲軸帶配置 JSON
│   └── Paytables/                   # 賠率表配置 JSON
└── Plugins/                         # 第三方套件
```

最佳實踐：
- 使用 `System.Security.Cryptography.RNGCryptoServiceProvider` 作為 CSPRNG
- 將數學模型配置外部化為 ScriptableObject 或 JSON，便於調整與認證審查
- 使用 Unity Addressables 管理資源載入

#### Cocos Creator (TypeScript)

```
assets/
├── scripts/
│   ├── core/
│   │   ├── SlotMachine.ts          # 主遊戲控制器
│   │   ├── ReelController.ts       # 捲軸控制邏輯
│   │   └── SpinManager.ts          # 旋轉生命週期管理
│   ├── rng/
│   │   └── WebCryptoRNG.ts         # Web Crypto API 封裝
│   ├── math/
│   │   ├── PaytableConfig.ts       # 賠率表配置
│   │   └── RTPCalculator.ts        # RTP 計算引擎
│   └── ui/
│       ├── SlotUI.ts               # 遊戲介面
│       └── ResponsibleGaming.ts    # 負責任遊戲 UI
├── resources/
│   ├── reel-strips/                 # 捲軸帶配置 JSON
│   └── paytables/                   # 賠率表配置 JSON
└── extensions/                      # 自訂擴充
```

最佳實踐：
- 使用 `crypto.getRandomValues()` (Web Crypto API) 作為瀏覽器端 CSPRNG
- 伺服器端使用 Node.js `crypto.randomBytes()` 產生 RNG
- 善用 Cocos Creator 的元件系統（Component）組織遊戲邏輯

#### Unreal Engine (C++/Blueprint)

```
Source/
├── SlotMachine/
│   ├── Core/
│   │   ├── SlotGameMode.cpp/.h     # 遊戲模式控制
│   │   ├── ReelActor.cpp/.h        # 捲軸 Actor
│   │   └── SpinSubsystem.cpp/.h    # 旋轉子系統
│   ├── RNG/
│   │   └── CryptoRNGComponent.cpp/.h # OpenSSL CSPRNG 封裝
│   ├── Math/
│   │   ├── PaytableDataAsset.cpp/.h  # 賠率表資料資產
│   │   └── RTPCalculator.cpp/.h      # RTP 計算引擎
│   └── UI/
│       └── SlotHUD.cpp/.h            # UMG 遊戲介面
Content/
├── Blueprints/                       # Blueprint 視覺腳本
├── DataTables/                       # 資料表（賠率、捲軸帶）
└── UI/                               # UMG Widget 資源
```

最佳實踐：
- 核心數學邏輯使用 C++ 實作以確保效能，UI 與動畫可使用 Blueprint
- 使用 OpenSSL 函式庫整合 CSPRNG（避免僅依賴 `FMath::RandRange`）
- 使用 DataTable 管理賠率表與捲軸帶配置

#### Godot (GDScript/C#)

```
project/
├── scripts/
│   ├── core/
│   │   ├── slot_machine.gd         # 主遊戲控制器
│   │   ├── reel_controller.gd      # 捲軸控制邏輯
│   │   └── spin_manager.gd         # 旋轉生命週期管理
│   ├── rng/
│   │   └── crypto_rng.gd           # Godot Crypto class 封裝
│   ├── math/
│   │   ├── paytable_config.gd      # 賠率表配置
│   │   └── rtp_calculator.gd       # RTP 計算引擎
│   └── ui/
│       ├── slot_ui.gd              # 遊戲介面
│       └── responsible_gaming.gd   # 負責任遊戲 UI
├── resources/
│   ├── reel_strips/                 # 捲軸帶配置資源
│   └── paytables/                   # 賠率表配置資源
└── addons/                          # 第三方插件
```

最佳實踐：
- 使用 Godot 內建 `Crypto` 類別產生安全隨機數
- 善用 Godot 的信號（Signal）系統處理旋轉事件流
- 使用 Resource 類別管理遊戲配置資料

#### HTML5/PixiJS (JavaScript/TypeScript)

```
src/
├── core/
│   ├── SlotMachine.ts              # 主遊戲控制器
│   ├── ReelController.ts           # 捲軸控制邏輯
│   └── SpinManager.ts              # 旋轉生命週期管理
├── rng/
│   └── WebCryptoRNG.ts             # Web Crypto API 封裝
├── math/
│   ├── PaytableConfig.ts           # 賠率表配置
│   └── RTPCalculator.ts            # RTP 計算引擎
├── rendering/
│   ├── ReelRenderer.ts             # PixiJS 捲軸渲染
│   └── SymbolSprite.ts             # 符號精靈管理
├── ui/
│   ├── SlotUI.ts                   # 遊戲介面
│   └── ResponsibleGaming.ts        # 負責任遊戲 UI
├── config/
│   ├── reel-strips.json            # 捲軸帶配置
│   └── paytable.json               # 賠率表配置
└── index.ts                         # 應用程式進入點
```

最佳實踐：
- 使用 `window.crypto.getRandomValues()` 作為 CSPRNG
- 使用 PixiJS 的 `Ticker` 系統管理捲軸動畫更新
- 使用 Webpack 或 Vite 進行模組打包與最佳化

### 引擎專屬 RNG 整合方式

| 遊戲引擎 | CSPRNG 整合方式 | 備註 |
|----------|----------------|------|
| Unity | `System.Security.Cryptography.RNGCryptoServiceProvider` | 產生 byte 陣列後轉換為所需數值範圍 |
| Cocos Creator | `crypto.getRandomValues()` (瀏覽器) / `crypto.randomBytes()` (Node.js) | 瀏覽器端與伺服器端使用不同 API |
| Unreal Engine | OpenSSL `RAND_bytes()` 整合 | 避免僅使用 `FMath::RandRange`（非密碼學安全） |
| Godot | `Crypto.generate_random_bytes()` | Godot 4.x 內建密碼學安全隨機數生成 |
| HTML5/PixiJS | `window.crypto.getRandomValues()` | 所有現代瀏覽器均支援 Web Crypto API |
| 伺服器端 (Python) | `os.urandom()` / `secrets` 模組 | 用於伺服器端 RNG 邏輯 |
| 伺服器端 (Node.js) | `crypto.randomBytes()` | 用於即時多人遊戲的伺服器端 RNG |

### 2026 年老虎機開發趨勢

1. **AI 個性化內容**：利用機器學習分析玩家行為，動態調整遊戲主題、音效與獎勵頻率，提供個人化遊戲體驗。AI 可用於自動生成符號美術資源與動畫，加速開發流程。

2. **AR 沉浸式體驗**：透過擴增實境技術，將老虎機遊戲融入玩家的實體環境。支援 ARKit (iOS) 與 ARCore (Android) 的引擎（如 Unity、Unreal Engine）將成為 AR 老虎機的首選開發平台。

3. **區塊鏈可證明公平機制（Provably Fair）**：使用區塊鏈技術記錄每次旋轉的 RNG 種子與結果雜湊值，讓玩家可獨立驗證遊戲公平性。智能合約可自動執行獎金發放，提升透明度與信任度。

4. **雲端遊戲（Cloud Gaming）**：將遊戲運算移至雲端伺服器，玩家透過串流方式遊玩，降低終端裝置的硬體需求。適合高品質 3D 老虎機在低階裝置上的部署。

5. **No-Code 建構工具**：視覺化拖放式老虎機建構平台興起，讓非技術人員也能快速建立與調整老虎機遊戲。開發者可專注於核心數學模型與 RNG 邏輯，將 UI 與主題設計交由 No-Code 工具處理。

## 參考資料（References）

以下為本 Power 所引用的知識來源。所有 URL 均指向官方機構的正式公開頁面，經人工驗證可達。

### 認證標準與測試實驗室

1. **Gaming Laboratories International — GLI Standards（含 GLI-11 & GLI-19）**
   - URL: https://gaminglabs.com/gli-standards/
   - 說明: GLI 標準統一下載入口。GLI-11 v3.1 為電子遊戲機技術標準，GLI-19 v3.0 為互動式遊戲系統標準。PDF 可免費下載。
   - 驗證狀態: ✅ 官方頁面確認可達

2. **Gaming Laboratories International — RNG Testing Technical Specifications**
   - URL: https://gaminglabs.com/getting-started/technical-specifications-for-rng-testing/
   - 說明: GLI 針對 RNG 提交測試的技術規格要求，含硬體與軟體需求。
   - 驗證狀態: ✅ 官方頁面確認可達

3. **Gaming Laboratories International — Gaming Security Framework (GLI-GSF)**
   - URL: https://gaminglabs.com/gaming-security-framework-gli-gsf/
   - 說明: 2024 年發布的遊戲安全框架，涵蓋線上與實體遊戲的安全控制要求。
   - 驗證狀態: ✅ 官方頁面確認可達

4. **BMM Testlabs — Gaming Test Laboratory & Certification**
   - URL: https://bmm.com/
   - 說明: 全球最資深的遊戲測試實驗室（成立於 1981 年），提供 RNG 測試、遊戲數學審查、平台安全認證等服務。2024 年獲 VIXIO 全球監管獎「年度測試服務商」。
   - 驗證狀態: ✅ 官方網站確認可達

5. **iTech Labs — Independent Testing Laboratory**
   - URL: https://itechlabs.com/
   - 說明: 澳洲獨立測試實驗室，專精 RNG 評估與線上遊戲認證。已認證超過 10 種程式語言的 RNG 實作。
   - 驗證狀態: ✅ 官方網站確認可達

6. **eCOGRA — eCommerce Online Gaming Regulation and Assurance**
   - URL: https://ecogra.org/ecogra-certification/
   - 說明: 獨立認證機構，提供 eGAP（eCOGRA Generally Accepted Practices）認證。符合 ISO/IEC 17025:2017、ISO/IEC 17020:2012 標準。
   - 驗證狀態: ✅ 官方頁面確認可達

### 監管機構

7. **UK Gambling Commission — Remote Gambling and Software Technical Standards (RTS)**
   - URL: https://www.gamblingcommission.gov.uk/licensees-and-businesses/lccp/1/2
   - 說明: 英國博彩委員會的遠端遊戲技術標準，含 LCCP 條件 2.3.1 技術標準要求。2025 年新增存款限制與速度限制更新。
   - 驗證狀態: ✅ 官方頁面確認可達

8. **Malta Gaming Authority (MGA) — Remote Gaming Services**
   - URL: https://www.mga.org.mt/remote-gaming/
   - 說明: 馬爾他博彩管理局的遠端遊戲服務牌照資訊，含 B2C 與 B2B 牌照要求。
   - 驗證狀態: ✅ 官方頁面確認可達

9. **Alcohol and Gaming Commission of Ontario (AGCO) — iGaming Standards**
   - URL: https://www.agco.ca/en/lottery-and-gaming/standards-acts-and-regulations-internet-gaming
   - 說明: 安大略省網路遊戲標準、法案與規例，含營運商與供應商技術合規要求。
   - 驗證狀態: ✅ 官方頁面確認可達

### 密碼學與隨機數標準

10. **NIST SP 800-90A Rev. 1 — Recommendation for Random Number Generation Using Deterministic Random Bit Generators**
    - URL: https://csrc.nist.gov/pubs/sp/800/90/a/r1/final
    - 說明: 美國國家標準與技術研究院發布的確定性隨機位元生成器推薦標準。規定基於雜湊函數與區塊密碼的 DRBG 機制。2015 年發布最終版。
    - 驗證狀態: ✅ NIST 官方頁面確認可達

11. **NIST — Random Bit Generation Project**
    - URL: https://csrc.nist.gov/Projects/Random-Bit-Generation
    - 說明: NIST 隨機位元生成專案總覽，含 SP 800-90 系列所有相關文件（90A/90B/90C）。
    - 驗證狀態: ✅ NIST 官方頁面確認可達

12. **W3C — Web Cryptography API (W3C Recommendation)**
    - URL: https://www.w3.org/TR/WebCryptoAPI/
    - 說明: W3C 標準，定義瀏覽器端密碼學操作 JavaScript API，含 `crypto.getRandomValues()` 安全隨機數生成。2017 年成為 W3C Recommendation，2025 年推出 Level 2 Working Draft。
    - 驗證狀態: ✅ W3C 官方頁面確認可達

13. **W3C — Web Cryptography API Level 2 (Working Draft 2025)**
    - URL: https://www.w3.org/TR/2025/WD-WebCryptoAPI-20250422/
    - 說明: Web Crypto API 第二版工作草案，擴充新的密碼學原語與演算法支援。
    - 驗證狀態: ✅ W3C 官方頁面確認可達

### 遊戲引擎官方文件

14. **Microsoft .NET — System.Security.Cryptography Namespace**
    - URL: https://learn.microsoft.com/en-us/dotnet/api/system.security.cryptography
    - 說明: Unity 使用的 C# CSPRNG 實作來源。含 `RandomNumberGenerator` 類別（取代已棄用的 `RNGCryptoServiceProvider`）。
    - 驗證狀態: ✅ Microsoft Learn 確認可達

15. **Cocos Creator — Official Documentation**
    - URL: https://docs.cocos.com/creator/manual/en/
    - 說明: Cocos Creator 官方開發文件，含 TypeScript 元件系統、資源管理與跨平台部署。
    - 驗證狀態: ✅ 官方文件確認可達

16. **Epic Games — Unreal Engine Documentation**
    - URL: https://dev.epicgames.com/documentation/en-us/unreal-engine/
    - 說明: Unreal Engine 官方文件入口，含 C++ API、Blueprint 系統與平台部署指引。
    - 驗證狀態: ✅ 官方文件確認可達

17. **Godot Engine — Crypto Class Reference**
    - URL: https://docs.godotengine.org/en/stable/classes/class_crypto.html
    - 說明: Godot 4.x 內建的 `Crypto` 類別，提供 `generate_random_bytes()` 方法生成密碼學安全隨機數。
    - 驗證狀態: ✅ 官方文件確認可達

18. **PixiJS — Official Guides**
    - URL: https://pixijs.com/guides
    - 說明: PixiJS HTML5 渲染框架官方指引，適用於瀏覽器端老虎機開發。
    - 驗證狀態: ✅ 官方文件確認可達

### 負責任遊戲與玩家保護

19. **GamCare — National Gambling Support Service (UK)**
    - URL: https://www.gamcare.org.uk/
    - 說明: 英國國家博彩支援服務，提供免費諮詢與治療轉介。UKGC 強制要求營運商提供此連結。
    - 驗證狀態: ✅ 官方網站確認可達

20. **BeGambleAware — UK Gambling Support**
    - URL: https://www.begambleaware.org/
    - 說明: 英國博彩意識慈善機構，提供資訊、建議與支援。UKGC 要求營運商顯示此連結。
    - 驗證狀態: ✅ 官方網站確認可達

21. **GamStop — UK National Self-Exclusion Scheme**
    - URL: https://www.gamstop.co.uk/
    - 說明: 英國國家級自我排除系統，所有持 UKGC 牌照的營運商必須整合。
    - 驗證狀態: ✅ 官方網站確認可達

22. **Spelpaus — Swedish National Self-Exclusion (Spelinspektionen)**
    - URL: https://www.spelpaus.se/
    - 說明: 瑞典國家級自我排除系統，所有持瑞典牌照的營運商必須整合。
    - 驗證狀態: ✅ 官方網站確認可達

23. **National Council on Problem Gambling (NCPG) — USA**
    - URL: https://www.ncpgambling.org/
    - 說明: 美國國家問題博彩委員會，營運 1-800-522-4700 全國求助熱線。
    - 驗證狀態: ✅ 官方網站確認可達

### 附加產業資源

24. **Slotegrator — Game Certification Purpose & Process (2026)**
    - URL: https://slotegrator.pro/analytical_articles/seals-of-approval-gain-players-trust-with-certified-games/
    - 說明: 老虎機認證流程的產業分析文章，涵蓋 eCOGRA、BMM、GLI、iTechLabs 等實驗室的角色與流程。
    - 驗證狀態: ✅ 發布日期 2026 年，確認可達
