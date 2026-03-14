# 實作計畫：老虎機開發專家 Kiro Power

## 概述

本計畫將老虎機開發專家 Power 的設計轉化為可執行的編碼任務。所有交付物均為文件檔案（POWER.md 與四個 Steering 指引檔），搭配 TypeScript 屬性測試（fast-check）驗證九項正確性屬性。任務按照依賴順序排列：先建立核心結構，再逐步填充各 Steering 內容，最後整合與驗證。

## 任務

- [x] 1. 建立 POWER.md 主定義檔骨架
  - [x] 1.1 建立 POWER.md 檔案，撰寫 frontmatter 區塊（name、displayName、description、keywords 欄位，keywords 須包含 slot machine、gambling、RNG、certification、GLI-11、responsible gaming、Unity、Cocos Creator、Unreal Engine、Godot、PixiJS）
    - _需求：1.1_
  - [x] 1.2 撰寫 Onboarding 區塊，定義四個引導步驟：遊戲引擎選擇（Unity / Cocos Creator / Unreal Engine / Godot / HTML5/PixiJS / 自研引擎）、專案類型（瀏覽器遊戲 / 原生應用 / 伺服器端邏輯）、目標市場、開發階段
    - _需求：1.3_
  - [x] 1.3 撰寫 Steering 指令區塊，宣告四個 Steering 檔案的觸發條件與用途（math-model.md、rng-game-logic.md、certification-prep.md、responsible-gaming.md）
    - _需求：1.2, 8.1, 8.2, 8.3, 8.4_
  - [x] 1.4 撰寫參考資料區塊，列出所有知識來源的 URL 與發布年份（限 2024–2026 年）
    - _需求：9.1, 9.3_

- [x] 2. 建立測試基礎設施與 POWER.md 結構驗證
  - [x] 2.1 初始化 TypeScript 測試專案，安裝 fast-check 與測試框架（vitest 或 jest），建立測試目錄結構
    - _需求：無（基礎設施）_
  - [x]* 2.2 撰寫屬性測試：POWER.md 結構完整性（屬性 1）
    - **屬性 1：POWER.md 結構完整性**
    - 生成隨機 frontmatter 內容，驗證解析後必含 name、displayName、description、keywords 四個欄位，且至少包含一個 Steering 指令
    - **驗證需求：1.1**
  - [x]* 2.3 撰寫屬性測試：參考資料條目有效性（屬性 9）
    - **屬性 9：參考資料條目有效性**
    - 生成隨機參考條目，驗證必含有效 URL 且年份在 2024–2026 範圍內
    - **驗證需求：9.1, 9.3**

- [x] 3. 檢查點 - 確認 POWER.md 結構與測試
  - 確保所有測試通過，如有疑問請詢問使用者。

- [x] 4. 撰寫 steering/math-model.md 數學模型設計指引
  - [x] 4.1 建立 steering/math-model.md，撰寫 Paytable 設計指引（符號組合定義、獎金倍數設定、RTP 驗算方法，RTP 範圍 94%–98%）
    - _需求：3.1_
  - [x] 4.2 撰寫 Reel Strip 配置指引（Virtual Reel 加權映射系統、符號權重分配方法）
    - _需求：3.2_
  - [x] 4.3 撰寫 Hit Frequency 計算指引（公式：(總獲勝組合 ÷ 總可能組合) × 100）
    - _需求：3.3_
  - [x] 4.4 撰寫 Volatility 調校指引（高波動：大獎低頻、低波動：小獎高頻、中波動：平衡分佈的符號權重分佈策略）
    - _需求：3.4_
  - [x] 4.5 撰寫獎勵功能設計指引（Free Spin、Bonus Round、Multiplier、Progressive Jackpot 的 RTP 貢獻計算）
    - _需求：3.5_
  - [x]* 4.6 撰寫屬性測試：Hit Frequency 計算公式不變量（屬性 2）
    - **屬性 2：Hit Frequency 計算公式不變量**
    - 生成隨機捲軸配置（符號數量、獲勝組合），驗證計算結果等於 (總獲勝組合數 ÷ 總可能組合數) × 100，且結果在 0–100 之間
    - **驗證需求：3.3**
  - [x]* 4.7 撰寫屬性測試：RTP 加總不變量（屬性 3）
    - **屬性 3：RTP 加總不變量**
    - 生成隨機基礎 RTP 與多個獎勵 RTP 值，驗證總 RTP 等於基礎遊戲 RTP 加上所有獎勵功能 RTP 之總和
    - **驗證需求：3.5**

- [x] 5. 撰寫 steering/rng-game-logic.md RNG 與遊戲邏輯指引
  - [x] 5.1 建立 steering/rng-game-logic.md，撰寫 CSPRNG 選擇指引（各引擎推薦：Unity → System.Security.Cryptography、Cocos Creator → Web Crypto API / Node.js crypto、Unreal Engine → FMath::RandRange + OpenSSL、Godot → Crypto class、HTML5/PixiJS → Web Crypto API、伺服器端 → os.urandom / crypto.randomBytes）
    - _需求：2.1_
  - [x] 5.2 撰寫種子管理與旋轉獨立性指引（熵值來源、種子更新策略、確保每次旋轉結果獨立）
    - _需求：2.2, 2.4_
  - [x] 5.3 撰寫 Spin Lifecycle 六階段實作指引（接收旋轉請求→RNG 產生輸出→映射捲軸停止位置→規則評估→獎勵解析→結果返回與日誌記錄），包含投注驗證與會話憑證檢查
    - _需求：4.1, 4.2_
  - [x] 5.4 撰寫規則引擎指引（Payline 匹配、Wild 替代規則、Scatter 觸發條件、Multiplier 套用的評估順序）
    - _需求：4.4_
  - [x] 5.5 撰寫審計日誌指引（日誌格式、必要欄位：時間戳記、投注金額、RNG 輸出、最終結果、獎金金額，儲存策略）
    - _需求：4.5_
  - [x] 5.6 撰寫第三方測試實驗室驗證準備指引（GLI、iTech Labs、eCOGRA、BMM Testlabs）
    - _需求：2.3_
  - [x]* 5.7 撰寫屬性測試：Virtual Reel 映射有效性（屬性 4）
    - **屬性 4：Virtual Reel 映射有效性**
    - 生成隨機 RNG 值與權重配置，驗證映射函數產生的捲軸停止位置落在有效索引範圍內（0 至 reelStrip.length - 1）
    - **驗證需求：4.3**
  - [x]* 5.8 撰寫屬性測試：審計日誌欄位完整性（屬性 5）
    - **屬性 5：審計日誌欄位完整性**
    - 生成隨機旋轉資料，驗證產生的日誌包含 timestamp、betAmount、rngOutput、visibleSymbols、winLines、totalWin 所有必要欄位
    - **驗證需求：4.5**

- [x] 6. 檢查點 - 確認數學模型與 RNG 指引及測試
  - 確保所有測試通過，如有疑問請詢問使用者。

- [x] 7. 撰寫 steering/certification-prep.md 認證準備指引
  - [x] 7.1 建立 steering/certification-prep.md，撰寫 GLI-11 與 GLI-19 合規要求說明
    - _需求：5.1_
  - [x] 7.2 撰寫認證文件準備指引（七項文件：RNG 驗證報告、RTP 準確性證明、功能邏輯說明、Paytable 驗算、負責任博弈 UX 設計、錯誤處理機制、審計日誌格式）
    - _需求：5.2_
  - [x] 7.3 撰寫市場監管資訊（各司法管轄區監管機構：Malta Gaming Authority、UK Gambling Commission、AGCO 等，及特定合規要求）
    - _需求：5.3_
  - [x] 7.4 撰寫認證時程與費用指引（標準老虎機 2–4 個月、複雜遊戲 4–6 個月、單一司法管轄區 $35,000–$140,000）
    - _需求：5.4_
  - [x] 7.5 撰寫 RTP 門檻警告機制說明（RTP < 92% 時的市場限制提醒）
    - _需求：5.5_
  - [x]* 7.6 撰寫屬性測試：低 RTP 警告觸發（屬性 6）
    - **屬性 6：低 RTP 警告觸發**
    - 生成隨機 RTP 值（0%–100%），驗證 < 92% 時觸發警告、≥ 92% 時不觸發
    - **驗證需求：5.5**

- [x] 8. 撰寫 steering/responsible-gaming.md 負責任博弈指引
  - [x] 8.1 建立 steering/responsible-gaming.md，撰寫存款限制功能指引（每日/每週/每月投注上限）
    - _需求：6.1_
  - [x] 8.2 撰寫自我排除機制指引（暫停與永久停止遊戲存取）
    - _需求：6.2_
  - [x] 8.3 撰寫會話時間限制功能指引（持續遊戲時間提醒機制）
    - _需求：6.3_
  - [x] 8.4 撰寫勝負追蹤功能指引（即時淨盈虧金額顯示）
    - _需求：6.4_
  - [x] 8.5 撰寫自動播放管控指引（依市場規範調整或移除自動播放機制）
    - _需求：6.5_
  - [x] 8.6 撰寫風險訊息顯示指引（RTP 百分比與博弈風險提示的 UI 指引）
    - _需求：6.6_
  - [x]* 8.7 撰寫屬性測試：會話淨盈虧計算不變量（屬性 7）
    - **屬性 7：會話淨盈虧計算不變量**
    - 生成隨機旋轉序列（投注與獎金），驗證淨額等於 Σ(wins) - Σ(bets)
    - **驗證需求：6.4**

- [x] 9. 檢查點 - 確認認證與負責任博弈指引及測試
  - 確保所有測試通過，如有疑問請詢問使用者。

- [x] 10. 補充 POWER.md 技術棧建議與整合驗證
  - [x] 10.1 在 POWER.md 或相關 Steering 中補充技術棧建議內容（Unity/C# 用於跨平台 2D/3D、Cocos Creator/TypeScript 用於輕量級 H5、Unreal Engine/C++/Blueprint 用於高品質 3D、Godot/GDScript/C# 用於獨立開發、HTML5/PixiJS/JS/TS 用於純瀏覽器、Python 用於伺服器端、Node.js 用於多人即時功能）
    - _需求：7.1, 7.2_
  - [x] 10.2 補充 2026 年趨勢資訊（AI 個性化內容、AR 沉浸式體驗、區塊鏈可證明公平機制、雲端遊戲、No-Code 建構工具）
    - _需求：7.3_
  - [x]* 10.3 撰寫屬性測試：遊戲引擎與技術棧映射一致性（屬性 8）
    - **屬性 8：遊戲引擎與技術棧映射一致性**
    - 生成隨機遊戲引擎類型，驗證推薦結果符合定義的映射表（Unity→C#、Cocos Creator→TypeScript、Unreal Engine→C++/Blueprint、Godot→GDScript/C#、HTML5/PixiJS→JavaScript/TypeScript）
    - **驗證需求：7.1**

- [x] 11. 最終檢查點 - 全面驗證
  - 確保所有測試通過，驗證所有 Steering 檔案存在且非空，確認 POWER.md 結構完整，如有疑問請詢問使用者。

## 備註

- 標記 `*` 的任務為選擇性任務，可跳過以加速 MVP 交付
- 每個任務均標註對應的需求編號，確保可追溯性
- 檢查點確保增量驗證，及早發現問題
- 屬性測試使用 TypeScript + fast-check，驗證九項正確性屬性
- 單元測試驗證特定範例與邊界條件
- 本 Power 為純文件型，所有任務均為建立或修改 Markdown 檔案與 TypeScript 測試檔案
