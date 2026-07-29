# Slot Machine Expert — Kiro Power

[English](README.md) | [繁體中文](README_ZH.md) | [简体中文](README_CN.md) | [日本語](README_JP.md) | [한국어](README_KR.md)

> Note on language availability: README files are available in 5 languages. Steering files
> (domain knowledge) are written in Traditional Chinese, deliberately retaining
> English legal and technical terms — clause references such as `RTS 14D`,
> `GlüStV §22a(6)`, `AGCO Standard 2.18` and `GLI-11 §3.2.2` are kept verbatim because you
> need those exact strings to retrieve the source instrument and to talk to a test
> laboratory. The Power responds in your language regardless of the steering file language.
> If you hit a language barrier, please open an issue.

Transform your IDE into a slot machine game development expert consultant. This Power provides AI-assisted guidance on RNG implementation, mathematical model design, regulatory certification compliance, and responsible gaming — covering the full development lifecycle from concept to GLI certification.

> Key Concepts:
>
> • **CSPRNG** (Cryptographically Secure Pseudo-Random Number Generator): The only acceptable RNG type for certified slot machines
> • **RTP** (Return to Player): Long-term statistical average payout percentage (industry standard: 94%–98%)
> • **GLI-11**: Global standard for electronic gaming devices in casinos
> • **GLI-19**: Global standard for interactive/remote gaming systems (online slots)
> • **Virtual Reel**: Weighted mapping system that controls actual symbol probabilities, independent of physical reel layout

## What this Power is

This is a **compliance advisor**, not a code generator. When you ask for a feature, it first tells you whether that feature is lawful in your target markets, then shows you a compliant way to build it.

That distinction shapes every answer:

| | Accelerator | This Power (Expert) |
|---|---|---|
| Asked for a feature | Implements it | Asks whether it is lawful in your market first |
| Asked for a number | Gives a usable value | Gives the value **plus a confidence level, the legal source, and how to verify it** |
| Success looks like | It works | You know what risk you are carrying |

Every regulatory value carries a confidence level: `HIGH` (read from the official instrument), `MEDIUM` (authoritative secondary source), or `UNVERIFIED` (**not confirmed — never guessed**). A compliance advisor that invents a number is worse than one that leaves a blank, because a blank triggers verification while a wrong number goes straight into a product spec.

## Features

- 🌍 **Jurisdiction Matrix** — Per-market hard constraints across 26 markets: minimum game cycle time, stake caps, autoplay, turbo/slam stop, jackpots, multi-game, RTP floors, data residency, retention periods — each with legal citation and confidence level
- 🧭 **Advisory Workflow** — Five-phase engagement: intake, gap assessment, risk register, remediation roadmap, deliverables. Includes a B2B/B2C/platform responsibility matrix
- 🎰 **Math Model Design** — Paytable design, reel strip configuration, RTP calculation, volatility tuning, hit frequency, bonus feature RTP contribution
- 🔬 **Math Verification** — Monte Carlo sample size derived from target precision and measured sigma (not folklore), theoretical-vs-simulated reconciliation, 15-section PAR sheet spec, eight common verification failure modes
- 🔐 **RNG & Game Logic** — CSPRNG selection per engine, seed management, 6-stage spin lifecycle, rule engine, audit logging
- 🖧 **Platform & Systems** — GLI-19 system scope, server-authoritative outcomes, disconnect recovery, wallet idempotency, game recall, regulator central-system integrations (LUGAS, OASIS, Spelpaus, CRUKS, ROFUS, GAMSTOP, iGO, SAFE/TamperToken)
- 📋 **Certification Prep** — GLI-11/GLI-19 compliance, 7 certification documents, lab selection, timeline & cost estimates
- 🔁 **Change Management** — Change classification framework, which changes trigger recertification, build-to-certification mapping, regulatory change tracking
- 🚨 **Incident Handling** — Severity classification, stop-preserve-scope-then-fix sequencing, player remediation, regulator notification
- 🛡️ **Responsible Gaming** — Deposit limits, self-exclusion, session limits, win/loss tracking, autoplay controls, risk messaging
- 🔍 **AML/KYC & Data Protection** — Age tiering, account state machine, and the conflict between gambling retention duties and data-protection minimisation
- ⛔ **Prohibited market register** — Explicitly warns where online slots are unlawful (Australia, Japan, South Korea, Singapore, India, South Africa) instead of implying certification can make entry possible
- 🎮 **Multi-Engine** — Unity, Cocos Creator, Unreal Engine, Godot, HTML5/PixiJS with engine-specific CSPRNG guidance

## Architecture

```
Developer (Natural Language)
    → AI Layer (Intent Understanding & Planning)
        → Slot Machine Expert Power (Domain Knowledge)
            → Risk-informed decision, then compliant implementation

Slot Machine Expert (Intelligence Layer)
├── POWER.md              → Main document defining workflows & references
├── steering/             → 12 domain knowledge files
│   ├── jurisdiction-matrix.md          → Cross-market technical constraints
│   ├── advisory-engagement.md          → Consultant workflow & responsibility boundaries
│   ├── math-model.md                   → Model design
│   ├── math-verification.md            → Verification & PAR sheet
│   ├── rng-game-logic.md               → RNG & spin lifecycle
│   ├── platform-systems-compliance.md  → RGS, wallet, central systems
│   ├── certification-prep.md           → GLI standards & documents
│   ├── responsible-gaming.md           → Player protection features
│   ├── change-management-recert.md     → Change control & recertification
│   ├── incident-malfunction-handling.md→ Incident & malfunction response
│   ├── aml-kyc-player-account.md       → AML/KYC & account lifecycle
│   └── data-protection-privacy.md      → GDPR & retention conflicts
├── templates/
│   ├── market-profiles/  → 26 market compliance profiles + schema + prohibited register
│   ├── certification/    → PAR sheet, RNG submission package, change request, GLI checklist
│   ├── advisory/         → Gap assessment, risk register, roadmap, incident report
│   ├── paytable/         → Paytable templates (by volatility)
│   └── reel-strip/       → Virtual reel configurations
├── hooks/                → IDE automation hooks
└── tests/                → Property-based tests (fast-check + vitest)
```

## Market coverage

**Regulated, with verified constraints:** United Kingdom (UKGC), Germany (GGL), Sweden (Spelinspektionen), Denmark (Spillemyndigheden), Malta (MGA), Ontario (AGCO), Nevada, New Jersey, Michigan, Pennsylvania, West Virginia, Connecticut, Delaware, US Tribal Class III, Brazil (SPA), Philippines (PAGCOR), Greece, Belgium, Italy, Spain, Netherlands, Romania, Portugal, Isle of Man, Gibraltar, Curaçao (LOK), Colombia, Peru, Kahnawà:ke

**Flagged as prohibited or grey:** Australia, Japan, South Korea, Singapore, India, South Africa, Mexico, Costa Rica

Profiles vary in depth. Markets where official sources could not be reached are shipped as **research skeletons with explicit `UNVERIFIED` markers and a verification checklist**, rather than filled in with plausible-looking numbers.

## Prerequisites

- [Kiro IDE](https://kiro.dev/docs/getting-started/installation) installed
- Node.js 18+ (for development/testing of this Power only)

## Installation

### Step 1 — Install this Power in Kiro

Open Kiro → Left panel click Powers icon → Click "+" → Select "Add Custom Power" → Select this project's root directory

### Step 2 — Install Auto-Guidance Hook (Recommended)

This hook routes each question to the right Steering File and enforces the advisory posture: confirm the jurisdiction first, never state an unverified regulatory value as fact, and surface red flags proactively.

Two formats are shipped. Use the one matching your Kiro version:

```bash
mkdir -p .kiro/hooks

# Current agent-hook format (v1 schema: version + hooks[] + UserPromptSubmit)
cp hooks/slot-expert-guidance.json .kiro/hooks/

# Legacy format, for older Kiro builds that read .kiro.hook files
cp hooks/pre-slot-tool.kiro.hook .kiro/hooks/
```

Install only one. If you are unsure, start with `slot-expert-guidance.json` and check whether the Power activates automatically.

Without a hook, you may need to manually remind the AI to use expert knowledge.

### Verify Installation

Type any slot machine development question in Kiro (e.g., "Design a 96% RTP medium volatility 5×3 slot math model"). If the AI responds with expert-level guidance referencing GLI standards, the installation is successful.

## Usage

Once installed, just talk to Kiro in natural language. The AI will automatically activate the Power, load the relevant Steering File, and respond as a slot machine development expert.

### What Can You Ask?

| Domain | Example Questions |
|--------|-------------------|
| Math Model | "Design a paytable for medium volatility 96% RTP", "Calculate Free Spin RTP contribution", "Set up a virtual reel with 128 total weight" |
| RNG | "How to implement CSPRNG in Unity?", "What fields are required in the audit log?", "Show me the 6-stage spin lifecycle" |
| Certification | "What documents do I need for GLI-11 certification?", "What are the UK market requirements?", "Estimated certification timeline and cost?" |
| Responsible Gaming | "How to implement deposit limits?", "What are Sweden's autoplay restrictions?", "Show me session time reminder best practices" |

### Example Workflow: Design a Complete Slot Game Math Model

```
1. "I'm building a 5×3 slot with 20 paylines targeting the UK market. 
    Design a medium volatility math model with 96% RTP."

2. "Set up the virtual reel weight tables for all 5 reels."

3. "Calculate the hit frequency and verify against target range."

4. "Design a Free Spin bonus triggered by 3+ Scatters, 
    with 10/15/20 free spins and 2x/3x/5x multipliers."

5. "Verify total RTP: base game + free spins + scatter pays."

6. "Run through the GLI-11 certification checklist for this game."
```

## Supported Game Engines

| Engine | Language | CSPRNG |
|--------|----------|--------|
| Unity | C# | `System.Security.Cryptography.RandomNumberGenerator` |
| Cocos Creator | TypeScript | Web Crypto API / Node.js `crypto` |
| Unreal Engine | C++/Blueprint | OpenSSL `RAND_bytes` |
| Godot | GDScript/C# | `Crypto` class |
| HTML5/PixiJS | JS/TS | Web Crypto API (`crypto.getRandomValues`) |

## Development

```bash
npm install
npm test              # Run all tests (14 suites, 69 tests)
npx tsc --noEmit     # TypeScript type checking
```

## Project Structure

```
kiro-slot-game-expert/
├── POWER.md                          # Power main definition (entry point)
├── steering/                         # 12 domain knowledge guides
│   ├── jurisdiction-matrix.md        # Cross-market technical constraints
│   ├── advisory-engagement.md        # Consultant workflow
│   ├── math-model.md                 # Math model design
│   ├── math-verification.md          # Verification & PAR sheet
│   ├── rng-game-logic.md             # RNG & game logic
│   ├── platform-systems-compliance.md# Platform & systems compliance
│   ├── certification-prep.md         # Certification prep
│   ├── responsible-gaming.md         # Responsible gaming
│   ├── change-management-recert.md   # Change management & recertification
│   ├── incident-malfunction-handling.md # Incident & malfunction handling
│   ├── aml-kyc-player-account.md     # AML/KYC & player account
│   └── data-protection-privacy.md    # Data protection & privacy
├── templates/
│   ├── paytable/                     # Paytable templates
│   ├── reel-strip/                   # Virtual reel configurations
│   ├── certification/                # PAR sheet, RNG submission, change request, GLI checklist
│   ├── advisory/                     # Gap assessment, risk register, roadmap, incident report
│   └── market-profiles/              # 26 market profiles + _schema + prohibited register
├── hooks/
│   ├── slot-expert-guidance.json     # Auto-guidance hook (current v1 format)
│   └── pre-slot-tool.kiro.hook       # Auto-guidance hook (legacy format)
├── tests/                            # Property-based tests (fast-check + vitest)
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── LICENSE
├── CONTRIBUTING.md
└── CODE_OF_CONDUCT.md
```

## Official References

All domain knowledge in this Power is sourced from verified official documentation:

| Source | URL | Domain |
|--------|-----|--------|
| GLI Standards (GLI-11/GLI-19) | https://gaminglabs.com/gli-standards/ | Certification Standards |
| UKGC Technical Standards | https://www.gamblingcommission.gov.uk/ | UK Regulation |
| Malta Gaming Authority | https://www.mga.org.mt/ | EU Regulation |
| AGCO iGaming Standards | https://www.agco.ca/ | Ontario Regulation |
| NIST SP 800-90A Rev.1 | https://csrc.nist.gov/pubs/sp/800/90/a/r1/final | RNG Standards |
| W3C Web Crypto API | https://www.w3.org/TR/WebCryptoAPI/ | Browser CSPRNG |
| BMM Testlabs | https://bmm.com/ | Testing Lab |
| iTech Labs | https://itechlabs.com/ | Testing Lab |
| eCOGRA | https://ecogra.org/ecogra-certification/ | Testing Lab |
| GamStop (UK) | https://www.gamstop.co.uk/ | Self-Exclusion |
| UKGC Remote Technical Standards (RTS) | https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards | UK product constraints |
| German GlüStV 2021 §22a | https://www.gesetze-bayern.de/Content/Document/StVGlueStV2021-22a | Virtual slot constraints |
| Swedish Spellag (2018:1138) | https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/spellag-20181138_sfs-2018-1138/ | Sweden regulation |
| Danish certification programme | https://spillemyndigheden.dk/en-us/businesses-and-associations/games-which-require-a-licence/online-casino/certification-programme-for-online-casino | SCP.00–SCP.07 |
| AGCO Registrar's Standards for Internet Gaming | https://www.agco.ca/en/lottery-and-gaming/guides/registrars-standards-internet-gaming | Ontario product constraints |
| Nevada Gaming Control Board | https://gaming.nv.gov | Regulation 14 |
| Connecticut DCP Gaming | https://portal.ct.gov/gaming | US state technical standards |
| NIST SP 800-90C | https://csrc.nist.gov/pubs/sp/800/90/c/final | RBG constructions (final 2025-09) |
| NIST decision to revise SP 800-22 | https://csrc.nist.gov/News/2022/decision-to-revise-nist-sp-800-22-rev-1a | ⚠️ Rejects use for crypto RNG assessment |
| Brazil SPA / Ministério da Fazenda | https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas | Brazil regulation |
| Curaçao Gaming Authority | https://gamingcontrolcuracao.org | LOK transition |
| PAGCOR | https://www.pagcor.ph | Philippines regulation |
| ACMA / Interactive Gambling Act 2001 | https://www.legislation.gov.au/C2004A00851 | ⛔ Australia prohibition |

See POWER.md for the complete reference list.

### Two corrections worth knowing

Research for this Power surfaced two claims that circulate widely in the industry and could not be substantiated:

1. **Malta's "92% minimum RTP" could not be confirmed** in any current MGA instrument, and the MGA has published a policy paper contemplating 85%. This Power records Malta's minimum RTP as `UNVERIFIED` rather than repeating the figure.
2. **NIST's own position is that SP 800-22 should not be used to assess cryptographic RNGs**, yet it is still commonly cited as a gaming RNG compliance basis. This Power flags that mismatch instead of propagating it.

It also discloses that **GLI and iTech Labs have been the same corporate group since May 2023**, which matters whenever a market or contract requires laboratory independence.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| AI not responding as expert | Ensure a hook is copied to `.kiro/hooks/`. If `pre-slot-tool.kiro.hook` does not fire, your Kiro build likely expects the v1 schema — use `slot-expert-guidance.json` instead |
| Tests failing | Run `npm install` then retry `npm test` |
| TypeScript type errors | Run `npx tsc --noEmit` after `npm install` |

## Security

See [CONTRIBUTING.md](CONTRIBUTING.md#security-issue-notifications) for security issue reporting.

## License

MIT License. See the [LICENSE](LICENSE) file.
