# Slot Machine Expert — Kiro Power

[English](README.md) | [繁體中文](README_TW.md)

> Note on language availability: README is available in English and Traditional Chinese.
> Steering files (domain knowledge) are in Traditional Chinese with industry-standard
> English terminology. The Power responds in the developer's preferred language.

Transform your IDE into a slot machine game development expert consultant. This Power provides AI-assisted guidance on RNG implementation, mathematical model design, regulatory certification compliance, and responsible gaming — covering the full development lifecycle from concept to GLI certification.

> Key Concepts:
>
> • **CSPRNG** (Cryptographically Secure Pseudo-Random Number Generator): The only acceptable RNG type for certified slot machines
> • **RTP** (Return to Player): Long-term statistical average payout percentage (industry standard: 94%–98%)
> • **GLI-11**: Global standard for electronic gaming devices in casinos
> • **GLI-19**: Global standard for interactive/remote gaming systems (online slots)
> • **Virtual Reel**: Weighted mapping system that controls actual symbol probabilities, independent of physical reel layout

## Features

- 🎰 **Math Model Design** — Paytable design, reel strip configuration, RTP calculation, volatility tuning, hit frequency analysis, bonus feature RTP contribution
- 🔐 **RNG & Game Logic** — CSPRNG selection (per engine), seed management, 6-stage spin lifecycle, rule engine, audit logging
- 📋 **Certification Prep** — GLI-11/GLI-19 compliance, 7 certification documents, market regulatory info, timeline & cost estimates
- 🛡️ **Responsible Gaming** — Deposit limits, self-exclusion, session time limits, win/loss tracking, autoplay controls, risk messages
- 🌍 **Multi-Market Support** — UK, Malta, Ontario, Nevada, New Jersey, Sweden, Denmark, Philippines, and more
- 🎮 **Multi-Engine** — Unity, Cocos Creator, Unreal Engine, Godot, HTML5/PixiJS with engine-specific CSPRNG guidance

## Architecture

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
│   └── market-profiles/ → Regulatory market profiles (UK, Malta, Ontario)
├── hooks/            → IDE automation hooks
└── tests/            → Property-based tests (fast-check + vitest)
```

## Prerequisites

- [Kiro IDE](https://kiro.dev/docs/getting-started/installation) installed
- Node.js 18+ (for development/testing of this Power only)

## Installation

### Step 1 — Install this Power in Kiro

Open Kiro → Left panel click Powers icon → Click "+" → Select "Add Custom Power" → Select this project's root directory

### Step 2 — Install Auto-Guidance Hook (Recommended)

This hook ensures the AI automatically loads the correct Steering File before processing each request:

```bash
mkdir -p .kiro/hooks
cp hooks/pre-slot-tool.kiro.hook .kiro/hooks/
```

Without this hook, you may need to manually remind the AI to use expert knowledge.

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
npm test              # Run all tests (13 property-based tests)
npx tsc --noEmit     # TypeScript type checking
```

## Project Structure

```
kiro-slot-game-expert/
├── POWER.md                          # Power main definition (entry point)
├── steering/
│   ├── math-model.md                 # Math model design guide
│   ├── rng-game-logic.md             # RNG & game logic guide
│   ├── certification-prep.md         # Certification prep guide
│   └── responsible-gaming.md         # Responsible gaming guide
├── templates/
│   ├── paytable/                     # Paytable templates
│   ├── reel-strip/                   # Virtual reel configurations
│   ├── certification/                # GLI submission checklists
│   └── market-profiles/              # Market regulatory profiles
├── hooks/
│   └── pre-slot-tool.kiro.hook       # Auto-guidance hook
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

See POWER.md for the complete list of 24 verified references.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| AI not responding as expert | Ensure hook is copied to `.kiro/hooks/` directory |
| Tests failing | Run `npm install` then retry `npm test` |
| TypeScript type errors | Run `npx tsc --noEmit` after `npm install` |

## Security

See [CONTRIBUTING.md](CONTRIBUTING.md#security-issue-notifications) for security issue reporting.

## License

MIT License. See the [LICENSE](LICENSE) file.
