# スロットマシン開発エキスパート Kiro Power

[English](README.md) | [繁體中文](README_ZH.md) | [简体中文](README_CN.md) | [日本語](README_JP.md) | [한국어](README_KR.md)

Kiro をスロットマシン開発のコンプライアンスアドバイザーに変換します。26 の法域における規制上の制約、RNG 実装、数学モデルの設計と検証、認証コンプライアンス、責任あるゲーミングをカバーします。

> **言語について**：README は 5 言語で提供しています。Steering ファイル（ドメイン知識）は繁体字中国語で記述されていますが、**法律用語と技術用語は意図的に英語のまま保持**しています。`RTS 14D`、`GlüStV §22a(6)`、`AGCO Standard 2.18`、`GLI-11 §3.2.2` のような条項番号は原文どおり残してあります。法令原本を参照するときや試験機関とやり取りするときに、その文字列がそのまま必要になるためです。Steering ファイルの言語にかかわらず、Power はあなたの言語で応答します。

> **重要な注意**：日本では、**海外のライセンスを保有する事業者であっても、日本国内からオンラインカジノで賭博を行うことは刑法 185 条・186 条により犯罪です**。2025 年 9 月 25 日施行の令和 7 年法律第 76 号により、日本国内の者を違法賭博に誘引する情報のオンライン発信、新たなオンラインカジノサイト・アプリの開設や運営、いわゆる「リーチサイト」、アフィリエイトリンク、SNS でのプロモーションが禁止されました。**刑事上のリスクは運営だけでなくマーケティングやアフィリエイト活動にも及びます。** 本 Power はこの法的状況を明示的に警告します。技術的なコンプライアンスによって法的地位の問題を解決することはできません。

## 用語解説

| 用語 | 説明 |
|------|------|
| **Kiro Power** | Kiro IDE の拡張モジュール。ドキュメント定義により Kiro に特定領域の専門知識を付与します |
| **POWER.md** | Power の主定義ファイル。メタデータ、オンボーディング手順、指示設定を含み、Kiro がこの Power を読み込む入口です |
| **Steering** | ワークフローガイドファイル。`steering/` ディレクトリに配置され、特定のトピックを質問すると対応するガイドが自動的に読み込まれます |
| **Onboarding** | Power インストール後の初期ガイドフロー。ゲームエンジンやプロジェクト種別を確認し、より的確な提案を行います |
| **RNG** | 乱数生成器（Random Number Generator）。スロットマシンの中核コンポーネントで、各スピンのランダムな結果を生成します |
| **CSPRNG** | 暗号学的に安全な乱数生成器（Cryptographically Secure PRNG）。ゲーム業界のセキュリティ基準を満たす唯一の RNG 実装方式です |
| **RTP** | 還元率（Return to Player）。プレイヤーが長期平均で取り戻せる割合。96% であれば $100 の賭けに対し平均 $96 の払戻しを意味します |
| **Volatility** | ボラティリティ。スロットのリスク水準を示す指標。高ボラティリティは大当たりだが頻度が低く、低ボラティリティは小当たりだが頻度が高いことを意味します |
| **Hit Frequency** | 的中頻度。1 回のスピンで当たりの組み合わせが発生する確率です |
| **Paytable** | 配当表。各シンボル組み合わせに対応する配当倍率を定義します |
| **Reel Strip** | リールストリップ。各リール上のシンボルの並び順と個数を定義します |
| **Virtual Reel** | 仮想リール。重み付けマッピングにより各シンボルの実際の出現確率を制御する仕組みで、RTP とボラティリティ調整の要となります |
| **Spin Lifecycle** | スピンライフサイクル。プレイヤーがスピンを押してから結果表示までの完全な処理フロー（全 6 段階） |
| **PAR Sheet** | Probability and Accounting Report。数学モデルの正式文書であり、試験機関と規制当局の審査における中核資料です |
| **GLI-11** | Gaming Laboratories International が発行する電子ゲーミング機器の技術標準。世界で最も広く採用されているスロットマシン認証標準です |
| **GLI-19** | GLI が発行するリモートゲーミングシステム（RGS）の技術標準。オンラインスロットに適用されます |
| **fast-check** | TypeScript/JavaScript のプロパティベーステストライブラリ。大量のランダムなテストケースを自動生成してプログラムの正しさを検証します |

## 主な機能

- 🌍 **法域コンプライアンスマトリクス** — 26 市場の製品上の必須制約を対照：最小ゲームサイクル時間、賭け金上限、autoplay、turbo/slam stop、ジャックポット、複数ゲーム同時プレイ、RTP 下限、データローカライゼーション、監査ログ保存期間。各項目に法令引用と信頼度レベルを付記
- 🧭 **アドバイザリーワークフロー** — 要件整理 → コンプライアンスギャップ評価 → リスク登録簿 → 是正ロードマップ → 成果物。B2B／B2C／プラットフォーム事業者の責任境界マトリクスを含む
- 🎰 **数学モデル設計** — Paytable 設計、Reel Strip 構成、RTP 計算、ボラティリティ調整、的中頻度算出、ボーナス機能の RTP 寄与度
- 🔬 **数学モデル検証** — モンテカルロのサンプルサイズを目標精度と実測 σ から逆算（慣習的な数値をそのまま使わない）、理論値とシミュレーション値の整合判定、PAR sheet 15 章構成の仕様、よくある 8 種類の検証失敗原因
- 🔐 **RNG とゲームロジック** — エンジン別の CSPRNG 選定、シード管理、スピンライフサイクル 6 段階、ルールエンジン、監査ログ
- 🖧 **プラットフォーム・システム層のコンプライアンス** — GLI-19 のシステム範囲、サーバー側での結果決定、切断および未完了ラウンドの処理、ウォレットの冪等性、game recall、規制当局の中央システム連携（LUGAS、OASIS、Spelpaus、CRUKS、ROFUS、GAMSTOP、iGO、SAFE/TamperToken）
- 📋 **認証準備** — GLI-11/GLI-19 コンプライアンス、7 種の認証文書、試験機関の選定、期間と費用の見積り
- 🔁 **変更管理と再認証** — 変更分類フレームワーク、どの変更が再申請を要するか、ビルドと認証の紐付け管理、規制変更の追跡
- 🚨 **インシデントと不具合対応** — 重大度分類、停止 → 証拠保全 → 影響範囲確定 → 修正の順序、プレイヤー補償の判断、規制当局への報告
- 🛡️ **責任あるゲーミング** — 入金限度額、自己排除、セッション時間制限、損益の追跡、autoplay の管理、リスク表示
- 🔍 **AML/KYC とデータ保護** — 年齢に応じた区分、アカウント状態遷移、およびギャンブリング規制の長期保存義務とデータ保護の最小化原則との衝突の扱い
- ⛔ **禁止市場登録簿** — オンラインスロットが違法な市場（オーストラリア、**日本**、韓国、シンガポール、インド、南アフリカ）を明示的に警告します。認証によって参入が可能になるかのような示唆はしません
- 🎮 **マルチエンジン対応** — Unity、Cocos Creator、Unreal Engine、Godot、HTML5/PixiJS。エンジンごとの CSPRNG ガイダンス付き

## この Power の位置づけ

**これはコンプライアンスアドバイザーであり、コードジェネレーターではありません。** ある機能を求めると、まずその機能が対象市場で合法かどうかを伝え、その上で適法な実装方法を示します。

| | Accelerator（加速ツール） | 本 Power（Expert アドバイザー） |
|---|---|---|
| 機能を求められたとき | そのまま実装する | まず対象市場で合法かを確認する |
| 数値を求められたとき | 使える値を提示する | 値 **＋ 信頼度レベル ＋ 法的根拠 ＋ 確認方法** を提示する |
| 成功の定義 | 動くこと | 自分が負っているリスクを把握していること |

すべての規制値には信頼度レベルが付きます。`HIGH`（公的法令原文で確認済み）、`MEDIUM`（信頼できる二次情報）、`UNVERIFIED`（**未確認。推測値は決して記入しない**）。

コンプライアンスアドバイザーが数値を 1 つ間違えることは、空欄にするより悪い結果を招きます。空欄は確認作業を促しますが、誤った数値はそのまま製品仕様に入り込み、認証申請時になって初めて発覚します。

## アーキテクチャ

```
Developer (Natural Language)
    → AI Layer (Intent Understanding & Planning)
        → Slot Machine Expert Power (Domain Knowledge)
            → リスクを踏まえた判断、その後に適法な実装

Slot Machine Expert (Intelligence Layer)
├── POWER.md              → ワークフローと参考資料を定義する主文書
├── steering/             → 12 のドメイン知識ガイド
├── templates/
│   ├── market-profiles/  → 26 市場のコンプライアンスプロファイル + schema + 禁止市場登録簿
│   ├── certification/    → PAR sheet、RNG 申請パッケージ、変更申請、GLI チェックリスト
│   ├── advisory/         → ギャップ評価、リスク登録簿、ロードマップ、インシデント報告
│   ├── paytable/         → 配当表テンプレート（ボラティリティ別）
│   └── reel-strip/       → 仮想リール構成
├── hooks/                → IDE 自動化フック
└── tests/                → プロパティベーステスト（fast-check + vitest）
```

## 対応市場

**プロファイル整備済みの規制市場**：英国（UKGC）、ドイツ（GGL）、スウェーデン（Spelinspektionen）、デンマーク（Spillemyndigheden）、マルタ（MGA）、オンタリオ（AGCO）、ネバダ、ニュージャージー、ミシガン、ペンシルベニア、ウェストバージニア、コネチカット、デラウェア、米国部族 Class III、ブラジル（SPA）、フィリピン（PAGCOR）、ギリシャ、ベルギー、イタリア、スペイン、オランダ、ルーマニア、ポルトガル、マン島、ジブラルタル、キュラソー（LOK）、コロンビア、ペルー、Kahnawà:ke

**禁止またはグレーとして明示**：オーストラリア、**日本**、韓国、シンガポール、インド、南アフリカ、メキシコ、コスタリカ

プロファイルの記載密度には差があります。**公的情報源に到達できなかった市場は、`UNVERIFIED` を明示したうえで確認事項リストを添えた「リサーチスケルトン」として提供**しています。もっともらしい数値で埋めることはしません。

## 前提条件

- [Kiro IDE](https://kiro.dev/docs/getting-started/installation) がインストール済み
- Node.js 18 以上（本 Power の開発・テスト用のみ）

## インストール

### Step 1 — Power のインストール

Kiro を開く → 左パネルの Powers アイコンをクリック → 「+」をクリック → 「Add Custom Power」を選択 → 本プロジェクトのルートディレクトリを選択

### Step 2 — 自動ガイダンスフックのインストール（推奨）

このフックは各質問を適切な Steering File にルーティングし、アドバイザリーの原則を強制します。すなわち、まず法域を確認する、未確認の規制値を事実として述べない、レッドフラグを能動的に指摘する、という 3 点です。

2 つの形式を同梱しています。お使いの Kiro のバージョンに合うものを選んでください。

```bash
mkdir -p .kiro/hooks

# 現行の agent hook 形式（v1 schema：version + hooks[] + UserPromptSubmit）
cp hooks/slot-expert-guidance.json .kiro/hooks/

# 旧形式（.kiro.hook を読み込む旧バージョンの Kiro 用）
cp hooks/pre-slot-tool.kiro.hook .kiro/hooks/
```

**いずれか 1 つだけ**をインストールしてください。判断がつかない場合は、まず `slot-expert-guidance.json` を使い、Power が自動的に有効化されるか確認してください。

フックを入れない場合、専門知識を使うよう AI に手動でリマインドする必要が生じることがあります。

### Step 3 — インストールの確認

Kiro でスロットマシンに関する質問を入力してください（例：「RTP 96%、中ボラティリティの 5×3 スロットの数学モデルを設計して」）。AI が GLI 標準を引用しながら専門的に応答すれば、インストールは成功です。

## 使い方

インストール後は自然言語で話しかけるだけです。AI が該当する Steering File を自動的に読み込み、スロットマシン開発の専門家として応答します。

### どんなことを聞けるか

| 領域 | 質問例 |
|------|--------|
| 数学モデル | 「中ボラティリティ RTP 96% の配当表を設計して」「Free Spin の RTP 寄与度を計算して」「総重み 128 の仮想リールを構成して」 |
| RNG | 「Unity で CSPRNG を正しく実装する方法は？」「監査ログに必要なフィールドは？」「スピンライフサイクルの 6 段階とは？」 |
| 認証 | 「GLI-11 認証にはどの文書が必要？」「英国市場の特別な要件は？」「認証の期間と費用の目安は？」 |
| 責任あるゲーミング | 「入金限度額の実装方法は？」「スウェーデン市場の autoplay 規制は？」「セッション時間リマインダーのベストプラクティスは？」 |

### ワークフロー例：スロットの数学モデルを一式設計する

```
1. 「英国市場向けに 5×3、20 ペイラインのスロットを作ります。
    RTP 96% の中ボラティリティ数学モデルを設計してください。」

2. 「5 リールすべての仮想リール重みテーブルを構成してください。」

3. 「的中頻度を算出し、目標レンジと照合して検証してください。」

4. 「Scatter 3 個以上で発動する Free Spin を設計してください。
    10/15/20 回のフリースピンと 2x/3x/5x の倍率で。」

5. 「合計 RTP を検証：ベースゲーム + フリースピン + Scatter 配当。」

6. 「このゲームについて GLI-11 認証チェックリストを一通り確認してください。」
```

## 対応ゲームエンジン

| エンジン | 言語 | CSPRNG |
|----------|------|--------|
| Unity | C# | `System.Security.Cryptography.RandomNumberGenerator` |
| Cocos Creator | TypeScript | Web Crypto API / Node.js `crypto` |
| Unreal Engine | C++/Blueprint | OpenSSL `RAND_bytes` |
| Godot | GDScript/C# | `Crypto` クラス |
| HTML5/PixiJS | JS/TS | Web Crypto API (`crypto.getRandomValues`) |

## Steering ガイド一覧

| ファイル | 発動タイミング | 内容 |
|----------|----------------|------|
| `jurisdiction-matrix.md` | 特定市場または市場横断のコンプライアンス差異 | 市場別の製品必須制約、データ信頼度レベル制度、市場横断アーキテクチャ戦略（最厳格共通基準／ケイパビリティフラグ／市場専用ビルド）、試験機関の市場受容性、確認 SOP |
| `advisory-engagement.md` | コンプライアンス相談、市場参入評価、ギャップ分析 | アドバイザリー 5 段階プロセス、B2B／B2C／プラットフォーム事業者の責任境界、よくある 5 つの顧客シナリオ、能動的に指摘すべき警告 |
| `math-model.md` | 数学モデルに関する質問 | Paytable 設計、Reel Strip 構成、RTP 計算、ボラティリティ調整、的中頻度、ボーナス機能の RTP 寄与度 |
| `math-verification.md` | RTP 検証、シミュレーションのサンプルサイズ、PAR sheet | 理論 RTP 計算、モンテカルロのサンプルサイズ導出、信頼区間による判定、賭け金構成マトリクス、よくある 8 種類の検証失敗原因 |
| `rng-game-logic.md` | RNG またはゲームロジック | CSPRNG 選定（エンジン別）、シード管理、スピンライフサイクル 6 段階、ルールエンジン、監査ログ |
| `platform-systems-compliance.md` | システム層のコンプライアンス | GLI-19 のシステム範囲、サーバー側での結果決定、切断からの復旧、ウォレットの冪等性、game recall、中央システム連携、データローカライゼーションと配置構成 |
| `certification-prep.md` | 認証やコンプライアンス | GLI-11/GLI-19 標準、7 種の認証文書、市場規制情報、期間と費用、RTP 下限の警告 |
| `responsible-gaming.md` | 責任あるゲーミング機能 | 入金限度額、自己排除、セッション時間制限、損益の追跡、autoplay の管理、リスク表示 |
| `change-management-recert.md` | 認証後の変更、再認証の必要性 | 変更分類フレームワーク、表示層と誤認されやすい変更、市場別の報告要件、ビルドと認証の対応表、規制変更の追跡 |
| `incident-malfunction-handling.md` | 不具合対応、インシデント重大度、プレイヤー補償 | インシデント分類、停止 → 証拠保全の手順、証拠保全チェックリスト、プレイヤー補償の判断、規制当局への報告、予防的設計 |
| `aml-kyc-player-account.md` | 年齢確認、KYC、AML、アカウント状態 | 市場別の最低年齢（18／19／21）と年齢別賭け金上限、アカウント状態遷移、マネーロンダリングのリスクパターン、事業者横断の限度額、決済上の制約 |
| `data-protection-privacy.md` | GDPR、個人データ、保存と削除の衝突 | データ分類とライフサイクルの差異化、法的根拠の選択、越境移転、管理者／処理者の役割、情報セキュリティ標準の対応 |

## 公式参考資料

本 Power のドメイン知識はすべて、検証済みの公的文書に基づいています。

| 情報源 | URL | 領域 |
|--------|-----|------|
| GLI Standards (GLI-11/GLI-19) | https://gaminglabs.com/gli-standards/ | 認証標準 |
| UKGC Remote Technical Standards (RTS) | https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards | 英国の製品制約 |
| ドイツ GlüStV 2021 §22a | https://www.gesetze-bayern.de/Content/Document/StVGlueStV2021-22a | 仮想スロットの制約 |
| スウェーデン Spellag (2018:1138) | https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/spellag-20181138_sfs-2018-1138/ | スウェーデン法規 |
| デンマーク認証プログラム | https://spillemyndigheden.dk/en-us/businesses-and-associations/games-which-require-a-licence/online-casino/certification-programme-for-online-casino | SCP.00–SCP.07 |
| AGCO Registrar's Standards | https://www.agco.ca/en/lottery-and-gaming/guides/registrars-standards-internet-gaming | オンタリオの製品制約 |
| Malta Gaming Authority | https://www.mga.org.mt/ | EU 法規 |
| Nevada Gaming Control Board | https://gaming.nv.gov | Regulation 14 |
| Connecticut DCP Gaming | https://portal.ct.gov/gaming | 米国州レベルの技術標準 |
| NIST SP 800-90A Rev.1 | https://csrc.nist.gov/pubs/sp/800/90/a/r1/final | RNG 標準 |
| NIST SP 800-90C | https://csrc.nist.gov/pubs/sp/800/90/c/final | RBG 構成（2025-09 最終版） |
| NIST による SP 800-22 改訂の決定 | https://csrc.nist.gov/News/2022/decision-to-revise-nist-sp-800-22-rev-1a | ⚠️ 暗号用 RNG 評価への使用を否定 |
| W3C Web Crypto API | https://www.w3.org/TR/WebCryptoAPI/ | ブラウザの CSPRNG |
| ブラジル SPA / Ministério da Fazenda | https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas | ブラジル法規 |
| Curaçao Gaming Authority | https://gamingcontrolcuracao.org | LOK への移行 |
| PAGCOR | https://www.pagcor.ph | フィリピン法規 |
| ACMA / Interactive Gambling Act 2001 | https://www.legislation.gov.au/C2004A00851 | ⛔ オーストラリアの禁止 |
| GamStop (UK) | https://www.gamstop.co.uk/ | 自己排除 |

完全な一覧は POWER.md の参考資料セクションを参照してください。

### 知っておくべき 2 つの訂正

本 Power のためのリサーチで、業界に広く流布しているものの裏付けが取れなかった主張が 2 件見つかりました。

1. **マルタの「最低 RTP 92%」は、現行のいずれの MGA 文書でも確認できませんでした。** さらに MGA は 85% への変更を検討する政策文書を公表しています。本 Power はマルタの最低 RTP を `UNVERIFIED` として記録し、この数値を繰り返しません。
2. **NIST 自身の立場は、SP 800-22 を暗号学的 RNG の評価に用いるべきではないというものです。** それにもかかわらず、同文書はゲーミング RNG のコンプライアンス根拠として今も広く引用されています。本 Power はこの齟齬をそのまま踏襲せず、明示的に指摘します。

また、**GLI と iTech Labs は 2023 年 5 月以降、同一の企業グループに属しています**。市場や契約が試験機関の独立性を要求する場合、この点が重要になります。

## テストの実行

```bash
npm install
npm test              # すべてのテストを実行
npx tsc --noEmit     # TypeScript の型チェック
```

13 のテストファイル、59 のテストで、数学モデルの数式、データ構造の完全性、マッピングの一貫性、および 3 つのドリフト防止制約を検証します。すなわち、市場プロファイルの schema（`UNVERIFIED` と記されたフィールドに具体値を持たせない）、POWER.md と steering ファイルの登録整合性、フックと steering の同期（steering を追加してフックの更新を忘れるとテストが失敗する）です。

## トラブルシューティング

| 問題 | 解決方法 |
|------|----------|
| AI が専門家として応答しない | フックが `.kiro/hooks/` にコピーされているか確認してください。`pre-slot-tool.kiro.hook` が発動しない場合、お使いの Kiro は v1 schema を要求している可能性があります。`slot-expert-guidance.json` を使ってください |
| テストが失敗する | `npm install` を実行してから `npm test` を再試行してください |
| TypeScript の型エラー | `npm install` 後に `npx tsc --noEmit` を実行してください |

## セキュリティ

セキュリティ問題の報告方法は [CONTRIBUTING.md](CONTRIBUTING.md#security-issue-notifications) を参照してください。

## ライセンス

MIT License。詳細は [LICENSE](LICENSE) ファイルを参照してください。

本 Power の知識内容はすべて公的な情報源を明記しています。詳細は POWER.md の参考資料セクションを参照してください。すべての URL は公的機関の正式ページを指すことを人手で確認済みです。
