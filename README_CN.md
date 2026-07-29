# 老虎机开发专家 Kiro Power

[English](README.md) | [繁體中文](README_ZH.md) | [简体中文](README_CN.md) | [日本語](README_JP.md) | [한국어](README_KR.md)

让 Kiro 成为老虎机游戏开发的合规顾问，涵盖 26 个司法管辖区的法规约束、RNG 实现、数学模型设计与验证、认证合规与负责任游戏。

> **关于语言**：README 提供 5 种语言。Steering 指南以繁体中文撰写，但**刻意保留英文法律与技术术语**——像 `RTS 14D`、`GlüStV §22a(6)`、`AGCO Standard 2.18`、`GLI-11 §3.2.2` 这类条号一律原文保留，因为你需要用这些字符串去调阅法源、以及和测试实验室沟通。无论 Steering 用什么语言，Power 都会用你的语言回应。

## 名词解释

| 名词 | 说明 |
|------|------|
| **Kiro Power** | Kiro IDE 的扩展模块，通过文档定义让 Kiro 具备特定领域的专业知识 |
| **POWER.md** | Power 的主定义文件，包含元数据、引导步骤与指令配置，是 Kiro 读取此 Power 的入口 |
| **Steering** | 工作流程指南文件，放在 `steering/` 目录下，当你向 Kiro 提问特定主题时会自动加载对应指南 |
| **Onboarding** | 安装 Power 后的初始引导流程，Kiro 会询问你的游戏引擎、项目类型等信息，以提供更精准的建议 |
| **RNG** | 随机数生成器（Random Number Generator），老虎机的核心组件，负责产生每次旋转的随机结果 |
| **CSPRNG** | 密码学安全的随机数生成器（Cryptographically Secure PRNG），符合游戏行业安全标准的 RNG 实现方式 |
| **RTP** | 返还率（Return to Player），玩家长期平均能拿回的百分比，例如 96% 表示每投注 $100 平均回报 $96 |
| **Volatility** | 波动性，衡量老虎机的风险等级——高波动代表大奖但不常中，低波动代表小奖但常中 |
| **Hit Frequency** | 命中频率，任一次旋转产生获胜组合的概率百分比 |
| **Paytable** | 赔率表，定义各符号组合对应的奖金倍数 |
| **Reel Strip** | 卷轴带，定义每个卷轴上符号的排列顺序与数量 |
| **Virtual Reel** | 虚拟卷轴，通过加权映射控制每个符号的实际出现概率，是调整 RTP 与波动性的关键机制 |
| **Spin Lifecycle** | 旋转生命周期，从玩家按下旋转到显示结果的完整处理流程（共六个阶段） |
| **PAR Sheet** | Probability and Accounting Report，数学模型的正式文档，是测试实验室与监管机构审查的核心材料 |
| **GLI-11** | Gaming Laboratories International 发布的电子游戏机技术标准，全球最广泛采用的老虎机认证标准 |
| **GLI-19** | GLI 发布的远端游戏服务器（RGS）技术标准，适用于线上老虎机 |
| **fast-check** | TypeScript/JavaScript 的属性测试（Property-Based Testing）库，用于自动生成大量随机测试用例验证程序正确性 |

## 功能特色

- 🌍 **司法管辖区合规矩阵** — 26 个市场的产品硬约束对照：最小游戏循环时间、投注上限、autoplay、turbo/slam stop、jackpot、多局同时进行、RTP 下限、数据本地化、审计保存期，每项都附法源条号与置信等级
- 🧭 **顾问参与流程** — 需求梳理 → 合规差距评估 → 风险登记册 → 修复路线图 → 交付物，含 B2B／B2C／平台商责任边界矩阵
- 🎰 **数学模型设计** — Paytable 设计、Reel Strip 配置、RTP 计算、Volatility 调校、Hit Frequency 计算
- 🔬 **数学模型验证** — Monte Carlo 样本量由目标精度与实测 σ 反推（而非沿用惯例数字）、理论值与模拟值一致性判定、PAR sheet 十五章节规格、八类常见验证失败原因
- 🔐 **RNG 与游戏逻辑** — CSPRNG 选择（各引擎）、种子管理、Spin Lifecycle 六阶段、规则引擎、审计日志
- 🖧 **平台与系统层合规** — GLI-19 系统范围、服务器端决定结果、断线与未完成局处理、钱包幂等性、game recall、监管机构中央系统集成（LUGAS、OASIS、Spelpaus、CRUKS、ROFUS、GAMSTOP、iGO、SAFE/TamperToken）
- 📋 **认证准备** — GLI-11/GLI-19 合规、七项认证文档、实验室选择、时间与费用预估
- 🔁 **变更管理与重新认证** — 变更分类框架、哪些变更会触发重新送测、构建与认证绑定管理、法规变动跟踪
- 🚨 **事故与故障处理** — 事故分级、先停后修与证据保全、玩家补偿判定、监管机构报告
- 🛡️ **负责任游戏** — 存款限制、自我排除、会话时间限制、盈亏追踪、自动旋转管控、风险提示显示
- 🔍 **AML/KYC 与数据保护** — 年龄分级、账户状态机，以及博彩长期保存义务与数据保护最小化要求的冲突处理
- ⛔ **禁止市场登记册** — 明确警示线上老虎机不合法的市场（澳大利亚、日本、韩国、新加坡、印度、南非），而不是让人以为认证可以解决法律地位问题
- 🎮 **多引擎支持** — Unity、Cocos Creator、Unreal Engine、Godot、HTML5/PixiJS，各引擎专属 CSPRNG 指引

## 这个 Power 的定位

**这是合规顾问，不是代码生成器。** 当你要求某个功能时，它会先告诉你这个功能在你的目标市场是否合法，再给你合规的实现方式。

| | Accelerator（加速器） | 本 Power（Expert 顾问） |
|---|---|---|
| 被问到功能 | 直接实现 | 先问这个功能在目标市场合法吗 |
| 被问到数字 | 给一个可用的值 | 给值 **＋ 置信等级 ＋ 法源 ＋ 核实方式** |
| 成功标准 | 东西跑起来了 | 你知道自己承担什么风险 |

每个法规数值都标注置信等级：`HIGH`（已从官方法规原文确认）、`MEDIUM`（权威二手来源）、`UNVERIFIED`（**未确认，绝不填猜测值**）。

合规顾问写错一个数字，比留空更糟——留空会触发核实，错误数字会直接进入产品规格，直到送测才被发现。

## 架构

```
Developer (Natural Language)
    → AI Layer (Intent Understanding & Planning)
        → Slot Machine Expert Power (Domain Knowledge)
            → 风险知情的决策，然后才是合规实现

Slot Machine Expert (Intelligence Layer)
├── POWER.md              → 定义工作流程与参考资料的主文档
├── steering/             → 12 份领域知识指南
├── templates/
│   ├── market-profiles/  → 26 个市场配置文件 + schema + 禁止市场登记册
│   ├── certification/    → PAR sheet、RNG 送测包、变更申请、GLI 检查清单
│   ├── advisory/         → 差距评估、风险登记册、路线图、事故报告
│   ├── paytable/         → 赔率表模板（按波动性）
│   └── reel-strip/       → 虚拟卷轴配置
├── hooks/                → IDE 自动化 hook
└── tests/                → 属性测试（fast-check + vitest）
```

## 市场覆盖

**已建立配置文件的受监管市场**：英国（UKGC）、德国（GGL）、瑞典（Spelinspektionen）、丹麦（Spillemyndigheden）、马耳他（MGA）、安大略（AGCO）、内华达、新泽西、密歇根、宾夕法尼亚、西弗吉尼亚、康涅狄格、特拉华、美国部落 Class III、巴西（SPA）、菲律宾（PAGCOR）、希腊、比利时、意大利、西班牙、荷兰、罗马尼亚、葡萄牙、马恩岛、直布罗陀、库拉索（LOK）、哥伦比亚、秘鲁、Kahnawà:ke

**标示为禁止或灰色**：澳大利亚、日本、韩国、新加坡、印度、南非、墨西哥、哥斯达黎加

各配置文件深度不一。**未能取得官方来源的市场以「研究骨架」形式提供，明确标记 `UNVERIFIED` 并附核实清单**，而不是填入看起来合理的数字。

## 前置需求

- 已安装 [Kiro IDE](https://kiro.dev/docs/getting-started/installation)
- Node.js 18+（仅用于本 Power 的开发与测试）

## 安装方式

### Step 1 — 安装 Power

打开 Kiro → 左侧面板点击 Powers 图标 → 点击 "+" → 选择 "Add Custom Power" → 选择本项目根目录

### Step 2 — 安装自动引导 Hook（建议）

此 Hook 会把问题导向正确的 Steering File，并强制顾问行为准则：先确认司法管辖区、不把未核实的法规数值当成事实、主动提出红旗风险。

提供两种格式，按你的 Kiro 版本择一安装：

```bash
mkdir -p .kiro/hooks

# 现行 agent hook 格式（v1 schema：version + hooks[] + UserPromptSubmit）
cp hooks/slot-expert-guidance.json .kiro/hooks/

# 旧格式，供读取 .kiro.hook 的旧版 Kiro 使用
cp hooks/pre-slot-tool.kiro.hook .kiro/hooks/
```

**只装一个**。不确定的话先用 `slot-expert-guidance.json`，再确认 Power 是否会自动启动。

没有安装 Hook 时，你可能需要手动提醒 AI 使用专家知识。

### Step 3 — 验证安装

在 Kiro 中输入任何老虎机相关问题（如「帮我设计一个 96% RTP 的 5×3 老虎机数学模型」）。若 AI 以专业方式回应并引用 GLI 标准，表示安装成功。

## 使用方式

安装后直接用自然语言提问。AI 会自动加载对应的 Steering File 并以专家角色回应。

### 可以问什么？

| 领域 | 示例问题 |
|------|----------|
| 数学模型 | 「设计一个中波动 96% RTP 的赔率表」「计算 Free Spin 的 RTP 贡献」「配置总权重 128 的虚拟卷轴」 |
| RNG | 「Unity 中如何正确实现 CSPRNG？」「审计日志需要哪些字段？」「Spin Lifecycle 六阶段是什么？」 |
| 认证 | 「准备 GLI-11 认证需要哪些文档？」「英国市场有什么特殊要求？」「认证时间和费用预估？」 |
| 负责任游戏 | 「如何实现存款限制功能？」「自动旋转在瑞典市场的规范是什么？」「会话时间提醒的最佳实践？」 |

### 示例工作流：设计一套完整的老虎机数学模型

```
1. 「我要做一个面向英国市场的 5×3、20 条赔付线老虎机，
    请设计一个 96% RTP 的中波动数学模型。」

2. 「配置全部 5 个卷轴的虚拟卷轴权重表。」

3. 「计算命中频率并对照目标区间验证。」

4. 「设计 3 个以上 Scatter 触发的 Free Spin 奖励，
    分别给 10/15/20 次免费旋转与 2x/3x/5x 倍数。」

5. 「验证总 RTP：基础游戏 + 免费旋转 + Scatter 赔付。」

6. 「按 GLI-11 认证检查清单逐项过一遍这款游戏。」
```

## 支持的游戏引擎

| 引擎 | 语言 | CSPRNG |
|------|------|--------|
| Unity | C# | `System.Security.Cryptography.RandomNumberGenerator` |
| Cocos Creator | TypeScript | Web Crypto API / Node.js `crypto` |
| Unreal Engine | C++/Blueprint | OpenSSL `RAND_bytes` |
| Godot | GDScript/C# | `Crypto` class |
| HTML5/PixiJS | JS/TS | Web Crypto API (`crypto.getRandomValues`) |

## 项目结构

```
kiro-slot-game-expert/
├── POWER.md                          # Power 主定义文件（入口）
├── steering/                         # 12 份领域知识指南
│   ├── jurisdiction-matrix.md        # 司法管辖区合规矩阵
│   ├── advisory-engagement.md        # 顾问参与流程
│   ├── math-model.md                 # 数学模型设计
│   ├── math-verification.md          # 数学模型验证与 PAR sheet
│   ├── rng-game-logic.md             # RNG 与游戏逻辑
│   ├── platform-systems-compliance.md# 平台与系统层合规
│   ├── certification-prep.md         # 认证准备
│   ├── responsible-gaming.md         # 负责任游戏
│   ├── change-management-recert.md   # 变更管理与重新认证
│   ├── incident-malfunction-handling.md # 事故与故障处理
│   ├── aml-kyc-player-account.md     # AML/KYC 与玩家账户
│   └── data-protection-privacy.md    # 数据保护与隐私
├── templates/
│   ├── paytable/                     # 赔率表模板
│   ├── reel-strip/                   # 虚拟卷轴配置模板
│   ├── certification/                # PAR sheet、RNG 送测包、变更申请、GLI 检查清单
│   ├── advisory/                     # 差距评估、风险登记册、路线图、事故报告
│   └── market-profiles/              # 26 个市场配置文件 + _schema + 禁止市场登记册
├── hooks/
│   ├── slot-expert-guidance.json     # 自动引导 Hook（现行 v1 格式）
│   └── pre-slot-tool.kiro.hook       # 自动引导 Hook（旧格式）
├── tests/                            # 属性测试（fast-check + vitest）
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── LICENSE
├── CONTRIBUTING.md
└── CODE_OF_CONDUCT.md
```

## Steering 指南说明

| 文件 | 触发时机 | 涵盖内容 |
|------|----------|----------|
| `jurisdiction-matrix.md` | 询问特定市场或跨市场合规差异 | 逐市场产品硬约束对照、数据置信等级制度、跨市场架构策略（最严共同基准／能力标志／市场专属版本）、测试实验室市场接受度、核实 SOP |
| `advisory-engagement.md` | 寻求合规咨询、市场进入评估、差距分析 | 顾问五阶段流程、B2B／B2C／平台商责任边界、五种常见客户情境应对、必须主动提出的警示 |
| `math-model.md` | 询问数学模型相关问题 | Paytable 设计、Reel Strip 配置、RTP 计算、Volatility 调校、Hit Frequency、奖励功能 RTP 贡献 |
| `math-verification.md` | 询问 RTP 验证、模拟样本量、PAR sheet | 理论 RTP 计算、Monte Carlo 样本量推导、置信区间判定、投注配置矩阵、八类常见验证失败原因 |
| `rng-game-logic.md` | 询问 RNG 或游戏逻辑 | CSPRNG 选择（各引擎）、种子管理、Spin Lifecycle 六阶段、规则引擎、审计日志 |
| `platform-systems-compliance.md` | 询问系统层合规 | GLI-19 系统范围、服务器端决定结果、断线恢复、钱包幂等性、game recall、中央系统集成、数据本地化部署拓扑 |
| `certification-prep.md` | 询问认证或合规 | GLI-11/GLI-19 标准、七项认证文档、市场监管信息、时间与费用、RTP 门槛警告 |
| `responsible-gaming.md` | 询问负责任游戏功能 | 存款限制、自我排除、会话时间限制、盈亏追踪、自动旋转管控、风险提示显示 |
| `change-management-recert.md` | 询问认证后变更、是否需重新送测 | 变更分类框架、易误判为表现层的变更、各市场报告要求、构建与认证对应表、法规变动跟踪 |
| `incident-malfunction-handling.md` | 询问故障处理、事故分级、玩家补偿 | 事故分类、先停后修流程、证据保全清单、玩家补偿判定、监管报告、预防性设计 |
| `aml-kyc-player-account.md` | 询问年龄验证、KYC、AML、账户状态 | 各市场最低年龄（18／19／21）与年龄分级投注上限、账户状态机、洗钱风险模式、跨运营商限额、支付约束 |
| `data-protection-privacy.md` | 询问 GDPR、个人信息、保存与删除冲突 | 数据分类与差异化生命周期、法律依据选择、跨境传输、控制者／处理者角色、信息安全标准对应 |

## 官方参考资料

本 Power 的领域知识全部来自经核实的官方文档：

| 来源 | URL | 领域 |
|------|-----|------|
| GLI Standards (GLI-11/GLI-19) | https://gaminglabs.com/gli-standards/ | 认证标准 |
| UKGC Remote Technical Standards (RTS) | https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards | 英国产品约束 |
| 德国 GlüStV 2021 §22a | https://www.gesetze-bayern.de/Content/Document/StVGlueStV2021-22a | 虚拟老虎机约束 |
| 瑞典 Spellag (2018:1138) | https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/spellag-20181138_sfs-2018-1138/ | 瑞典法规 |
| 丹麦认证方案 | https://spillemyndigheden.dk/en-us/businesses-and-associations/games-which-require-a-licence/online-casino/certification-programme-for-online-casino | SCP.00–SCP.07 |
| AGCO Registrar's Standards | https://www.agco.ca/en/lottery-and-gaming/guides/registrars-standards-internet-gaming | 安大略产品约束 |
| Malta Gaming Authority | https://www.mga.org.mt/ | 欧盟法规 |
| Nevada Gaming Control Board | https://gaming.nv.gov | Regulation 14 |
| Connecticut DCP Gaming | https://portal.ct.gov/gaming | 美国州级技术标准 |
| NIST SP 800-90A Rev.1 | https://csrc.nist.gov/pubs/sp/800/90/a/r1/final | RNG 标准 |
| NIST SP 800-90C | https://csrc.nist.gov/pubs/sp/800/90/c/final | RBG 构造（2025-09 定稿） |
| NIST 修订 SP 800-22 的决定 | https://csrc.nist.gov/News/2022/decision-to-revise-nist-sp-800-22-rev-1a | ⚠️ 拒绝用于评估密码学 RNG |
| W3C Web Crypto API | https://www.w3.org/TR/WebCryptoAPI/ | 浏览器 CSPRNG |
| 巴西 SPA / Ministério da Fazenda | https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas | 巴西法规 |
| Curaçao Gaming Authority | https://gamingcontrolcuracao.org | LOK 转轨 |
| PAGCOR | https://www.pagcor.ph | 菲律宾法规 |
| ACMA / Interactive Gambling Act 2001 | https://www.legislation.gov.au/C2004A00851 | ⛔ 澳大利亚禁令 |
| GamStop (UK) | https://www.gamstop.co.uk/ | 自我排除 |

完整清单见 POWER.md 参考资料区块。

### 两项值得注意的更正

本次研究发现两个业界广泛流传但无法证实的说法：

1. **马耳他「最低 RTP 92%」无法在任何 MGA 现行文件中确认**，且 MGA 已发布政策文件探讨调整为 85%。本 Power 将马耳他最低 RTP 记为 `UNVERIFIED`，不重复该数字。
2. **NIST 自身立场是 SP 800-22 不应用于评估密码学 RNG**，但它仍被普遍引用为博彩 RNG 合规依据。本 Power 指出此落差，而非沿用。

另外也披露 **GLI 与 iTech Labs 自 2023 年 5 月起属同一企业集团**——当市场或合同要求实验室独立性时，这一点很重要。

## 执行测试

```bash
npm install
npm test              # 执行所有测试
npx tsc --noEmit     # TypeScript 类型检查
```

共 13 个测试文件、59 个测试，验证数学模型公式、数据结构完整性、映射一致性，以及三项防漂移约束：市场配置文件 schema（标为 `UNVERIFIED` 的字段不得带具体数值）、POWER.md 与 steering 文件的注册一致性、hook 与 steering 的同步（新增 steering 忘记更新 hook 会直接测试失败）。

## 疑难排解

| 问题 | 解决方案 |
|------|----------|
| AI 未以专家模式回应 | 确认已复制一个 Hook 到 `.kiro/hooks/`。若 `pre-slot-tool.kiro.hook` 没有触发，你的 Kiro 版本可能需要 v1 schema，改用 `slot-expert-guidance.json` |
| 测试失败 | 执行 `npm install` 后重试 `npm test` |
| TypeScript 类型错误 | 执行 `npx tsc --noEmit`，确认已安装依赖 |

## 安全性

请参阅 [CONTRIBUTING.md](CONTRIBUTING.md#security-issue-notifications) 了解安全问题报告方式。

## 许可证

MIT License。详见 [LICENSE](LICENSE) 文件。

本 Power 中的知识内容均标注官方资料来源，详见 POWER.md 参考资料区块。所有 URL 均经人工核实指向官方机构正式页面。
