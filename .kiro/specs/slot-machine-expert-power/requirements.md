# 需求文件：老虎機開發專家 Kiro Power

## 簡介

本功能為一個 Kiro Power，安裝後將使 Kiro 成為老虎機遊戲開發的專業顧問。此 Power 涵蓋 RNG 實作、數學模型設計、認證合規、負責任遊戲等業界核心知識，以 2025-2026 年最新標準指導開發者完成從概念到認證的完整老虎機開發流程。

## 詞彙表

- **Power**：Kiro 的擴充功能模組，透過 POWER.md 檔案定義指令與知識，安裝後賦予 Kiro 特定領域的專業能力
- **POWER.md**：Power 的主要定義檔案，包含 frontmatter 元資料、Onboarding 步驟與 Steering 指令
- **Steering**：Power 中的工作流程指引檔案，放置於 steering/ 目錄下，用於引導特定開發情境
- **RNG**：隨機數生成器（Random Number Generator），老虎機核心元件，負責產生不可預測的隨機結果
- **PRNG**：偽隨機數生成器（Pseudo-Random Number Generator），使用演算法產生統計上隨機的數列
- **CSPRNG**：密碼學安全偽隨機數生成器（Cryptographically Secure PRNG），符合遊戲業界安全標準的 RNG 實作
- **RTP**：返還率（Return to Player），長期統計平均回報百分比，如 96% 表示每投注 $100 平均回報 $96
- **Volatility**：波動性，衡量老虎機風險等級的指標，決定獎金大小與頻率的分佈
- **Hit_Frequency**：命中頻率，任一次旋轉產生獲勝組合的機率百分比
- **Virtual_Reel**：虛擬捲軸，使用加權映射系統的邏輯捲軸，用於控制符號出現機率
- **Paytable**：賠率表，定義各符號組合對應獎金倍數的對照表
- **Reel_Strip**：捲軸帶，定義每個捲軸上符號排列順序與數量的配置
- **GLI-11**：Gaming Laboratories International 發布的電子遊戲機技術標準，全球最廣泛採用
- **GLI-19**：GLI 發布的遠端遊戲伺服器（RGS）技術標準
- **Payline**：賠線，捲軸上判定獲勝組合的連線路徑
- **Wild**：百搭符號，可替代其他符號形成獲勝組合的特殊符號
- **Scatter**：散佈符號，不需在賠線上即可觸發獎勵的特殊符號
- **Multiplier**：乘數，將獎金按倍數放大的遊戲機制
- **Free_Spin**：免費旋轉，不需投注即可進行的旋轉回合
- **Bonus_Round**：獎勵回合，由特定條件觸發的額外遊戲階段
- **Progressive_Jackpot**：累積獎金，隨玩家投注持續累積的大獎池
- **Spin_Lifecycle**：旋轉生命週期，從玩家發送旋轉請求到返回結果的完整處理流程
- **Certification_Lab**：認證測試實驗室，如 GLI、BMM Testlabs、eCOGRA、iTech Labs 等第三方機構
- **Responsible_Gaming**：負責任遊戲，保護玩家的功能與機制，包含存款限制、自我排除等

## 需求

### 需求 1：Power 檔案結構

**使用者故事：** 身為開發者，我希望此 Power 遵循 Kiro Power 標準檔案結構，以便正確安裝與運作。

#### 驗收條件

1. THE Power SHALL 包含一個 POWER.md 檔案，其中含有 frontmatter 區塊（name、displayName、description、keywords 欄位）與 Steering 指令區塊
2. THE Power SHALL 包含一個 steering/ 目錄，其中含有針對不同老虎機開發工作流程的指引檔案
3. WHEN 開發者安裝此 Power，THE Power SHALL 透過 Onboarding 步驟引導開發者確認遊戲引擎（Unity、Cocos Creator、Unreal Engine、Godot、HTML5/PixiJS、自研引擎）、專案類型（瀏覽器遊戲、原生應用、伺服器端邏輯）與目標市場

### 需求 2：RNG 實作指導

**使用者故事：** 身為老虎機開發者，我希望獲得符合業界標準的 RNG 實作指導，以確保遊戲結果的隨機性與公平性。

#### 驗收條件

1. WHEN 開發者請求 RNG 相關指導，THE Power SHALL 提供 CSPRNG 實作建議，包含適用於目標平台的密碼學安全演算法選擇
2. THE Power SHALL 指導開發者確保每次旋轉結果獨立於前次旋轉結果
3. WHEN 開發者實作 RNG 模組，THE Power SHALL 建議納入第三方測試實驗室（GLI、iTech Labs、eCOGRA、BMM Testlabs）的驗證準備措施
4. THE Power SHALL 指導開發者實作 RNG 種子管理機制，確保種子來源具備足夠的熵值

### 需求 3：數學模型設計指導

**使用者故事：** 身為老虎機開發者，我希望獲得數學模型設計的專業指導，以建立精確的賠率與獎金結構。

#### 驗收條件

1. WHEN 開發者設計 Paytable，THE Power SHALL 指導開發者定義各符號組合的獎金倍數，並驗算整體 RTP 落在 94% 至 98% 的業界標準範圍內
2. WHEN 開發者配置 Reel_Strip，THE Power SHALL 指導開發者使用 Virtual_Reel 加權映射系統，為每個符號分配適當權重
3. THE Power SHALL 指導開發者計算 Hit_Frequency，使用公式：(總獲勝組合 ÷ 總可能組合) × 100
4. WHEN 開發者選擇目標 Volatility 等級，THE Power SHALL 提供對應的符號權重分佈建議（高波動：大獎低頻、低波動：小獎高頻、中波動：平衡分佈）
5. WHEN 開發者設計獎勵功能（Free_Spin、Bonus_Round、Multiplier、Progressive_Jackpot），THE Power SHALL 指導開發者將獎勵功能的預期貢獻納入整體 RTP 計算

### 需求 4：Spin 生命週期實作指導

**使用者故事：** 身為老虎機開發者，我希望獲得完整的旋轉生命週期實作指導，以確保每次旋轉的處理流程正確且可追蹤。

#### 驗收條件

1. THE Power SHALL 指導開發者實作完整的 Spin_Lifecycle，涵蓋六個階段：接收旋轉請求、RNG 產生輸出、映射捲軸停止位置、規則評估、獎勵解析、結果返回與日誌記錄
2. WHEN 開發者實作旋轉請求階段，THE Power SHALL 指導開發者驗證投注詳情與會話憑證
3. WHEN RNG 輸出映射至捲軸停止位置，THE Power SHALL 指導開發者依據 Virtual_Reel 權重配置進行正確映射
4. WHEN 規則評估階段執行，THE Power SHALL 指導開發者依序檢查 Payline 匹配、Wild 替代規則、Scatter 觸發條件與 Multiplier 套用
5. THE Power SHALL 指導開發者為每次旋轉記錄完整的審計日誌，包含時間戳記、投注金額、RNG 輸出、最終結果與獎金金額


### 需求 5：認證與合規指導

**使用者故事：** 身為老虎機開發者，我希望獲得認證與合規的完整指導，以確保遊戲能通過第三方測試實驗室的審核。

#### 驗收條件

1. WHEN 開發者詢問認證相關問題，THE Power SHALL 提供 GLI-11（電子遊戲機標準）與 GLI-19（遠端遊戲伺服器標準）的合規要求說明
2. THE Power SHALL 指導開發者準備認證測試所需的文件，涵蓋 RNG 驗證報告、RTP 準確性證明、功能邏輯說明、Paytable 驗算、負責任遊戲 UX 設計、錯誤處理機制與審計日誌格式
3. WHEN 開發者選定目標市場，THE Power SHALL 提供該司法管轄區的監管機構資訊（如 Malta Gaming Authority、UK Gambling Commission、AGCO）與特定合規要求
4. THE Power SHALL 告知開發者認證時程預估（標準老虎機 2 至 4 個月、複雜遊戲 4 至 6 個月）與費用範圍（單一司法管轄區 $35,000 至 $140,000）
5. IF 開發者的 RTP 設定低於 92%，THEN THE Power SHALL 發出警告，說明某些市場禁止 RTP 低於此門檻

### 需求 6：負責任遊戲功能指導

**使用者故事：** 身為老虎機開發者，我希望獲得負責任遊戲功能的實作指導，以保護玩家並符合監管要求。

#### 驗收條件

1. THE Power SHALL 指導開發者實作存款限制功能，允許玩家設定每日、每週或每月的投注上限
2. THE Power SHALL 指導開發者實作自我排除機制，允許玩家暫停或永久停止遊戲存取
3. THE Power SHALL 指導開發者實作會話時間限制功能，在玩家持續遊戲達到設定時間時發出提醒
4. THE Power SHALL 指導開發者實作勝負追蹤功能，向玩家即時顯示當前會話的淨盈虧金額
5. WHEN 開發者的目標市場限制或禁止自動播放功能，THE Power SHALL 指導開發者依據該市場規範調整或移除自動播放機制
6. THE Power SHALL 指導開發者在遊戲介面中顯示風險訊息，包含 RTP 百分比與遊戲風險提示

### 需求 7：技術棧建議

**使用者故事：** 身為老虎機開發者，我希望獲得適合 2026 年的技術棧建議，以選擇最佳的開發工具與框架。

#### 驗收條件

1. WHEN 開發者開始新專案，THE Power SHALL 依據遊戲引擎與專案類型提供技術棧建議：Unity (C#) 用於跨平台 2D/3D 老虎機、Cocos Creator (TypeScript) 用於輕量級跨平台與 H5 老虎機、Unreal Engine (C++/Blueprint) 用於高品質 3D 老虎機、Godot (GDScript/C#) 用於獨立開發與原型驗證、HTML5/PixiJS (JavaScript/TypeScript) 用於純瀏覽器老虎機、Python 用於伺服器端邏輯與數學模型模擬、Node.js 用於多人與即時功能
2. WHEN 開發者選定遊戲引擎與技術棧，THE Power SHALL 提供該引擎的專案結構範本、最佳實踐建議與引擎特定的 RNG 整合方式
3. WHEN 開發者詢問 2026 年趨勢，THE Power SHALL 提供 AI 個性化內容、AR 沉浸式體驗、區塊鏈可證明公平機制、雲端遊戲與 No-Code 建構工具等最新趨勢資訊

### 需求 8：Steering 工作流程覆蓋

**使用者故事：** 身為老虎機開發者，我希望此 Power 針對不同開發階段提供專屬的工作流程指引，以在各階段獲得精準的協助。

#### 驗收條件

1. THE Power SHALL 提供數學模型設計工作流程指引，涵蓋 Paytable 設計、Reel_Strip 配置、RTP 計算與 Volatility 調校
2. THE Power SHALL 提供 RNG 與遊戲邏輯實作工作流程指引，涵蓋 CSPRNG 選擇、Spin_Lifecycle 實作與規則引擎開發
3. THE Power SHALL 提供認證準備工作流程指引，涵蓋文件準備、測試計畫與認證實驗室對接流程
4. THE Power SHALL 提供負責任遊戲實作工作流程指引，涵蓋玩家保護功能開發與合規檢查清單

### 需求 9：資料來源標註

**使用者故事：** 身為老虎機開發者，我希望此 Power 提供的知識附有可靠資料來源，以便我驗證資訊的準確性。

#### 驗收條件

1. THE Power SHALL 在 POWER.md 中包含參考資料區塊，列出所有知識來源的 URL 與發布年份
2. WHEN 開發者詢問特定技術標準或數據，THE Power SHALL 在回應中標註資訊來源
3. THE Power SHALL 僅引用 2024 年至 2026 年間發布的資料來源，確保知識的時效性
