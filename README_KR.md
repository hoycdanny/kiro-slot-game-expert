# 슬롯머신 개발 전문가 Kiro Power

[English](README.md) | [繁體中文](README_ZH.md) | [简体中文](README_CN.md) | [日本語](README_JP.md) | [한국어](README_KR.md)

Kiro를 슬롯머신 개발의 컴플라이언스 어드바이저로 전환합니다. 26개 관할권의 규제 제약, RNG 구현, 수학 모델 설계와 검증, 인증 컴플라이언스, 책임 있는 게임을 다룹니다.

> **언어 안내**: README는 5개 언어로 제공됩니다. Steering 파일(도메인 지식)은 번체 중국어로 작성되어 있으나 **법률 및 기술 용어는 의도적으로 영문을 유지**합니다. `RTS 14D`, `GlüStV §22a(6)`, `AGCO Standard 2.18`, `GLI-11 §3.2.2` 같은 조항 번호는 원문 그대로 두었습니다. 법령 원문을 조회하거나 시험기관과 소통할 때 해당 문자열이 그대로 필요하기 때문입니다. Steering 파일의 언어와 무관하게 Power는 여러분의 언어로 응답합니다.

> **중요 고지**: 대한민국에서 온라인 카지노 및 슬롯은 **불법**입니다. 도박은 형법 제246조 및 제247조에 따라 처벌되며, 복권, 스포츠토토, 경마, 내국인 출입이 허용된 1개 카지노 등 국가가 허가한 예외만 인정됩니다. 해외에서 도박하는 한국인에게도 역외 적용됩니다. 규제 강화는 계속되고 있으며, 약 2026년 4월까지 진행된 경찰의 7개월 사이버 도박 단속에서 2,319명이 검거되고 1,746건이 적발되어 1,072억 원이 압수되었습니다. **기술적 컴플라이언스로 법적 지위 문제를 해결할 수는 없습니다.** 본 Power는 이러한 상황을 명시적으로 경고합니다.

## 용어 설명

| 용어 | 설명 |
|------|------|
| **Kiro Power** | Kiro IDE의 확장 모듈. 문서 정의를 통해 Kiro에 특정 도메인의 전문 지식을 부여합니다 |
| **POWER.md** | Power의 주 정의 파일. 메타데이터, 온보딩 단계, 지시 설정을 포함하며 Kiro가 이 Power를 읽어 들이는 진입점입니다 |
| **Steering** | 워크플로 가이드 파일. `steering/` 디렉터리에 위치하며, 특정 주제를 질문하면 해당 가이드가 자동으로 로드됩니다 |
| **Onboarding** | Power 설치 후의 초기 안내 절차. 게임 엔진, 프로젝트 유형 등을 확인해 더 정확한 제안을 제공합니다 |
| **RNG** | 난수 생성기(Random Number Generator). 슬롯머신의 핵심 구성요소로 매 스핀의 무작위 결과를 생성합니다 |
| **CSPRNG** | 암호학적으로 안전한 난수 생성기(Cryptographically Secure PRNG). 게임 산업 보안 기준을 충족하는 유일한 RNG 구현 방식입니다 |
| **RTP** | 환수율(Return to Player). 플레이어가 장기 평균으로 돌려받는 비율. 96%는 $100 베팅당 평균 $96 환급을 의미합니다 |
| **Volatility** | 변동성. 슬롯의 위험 수준을 나타내는 지표로, 고변동성은 큰 당첨이지만 빈도가 낮고 저변동성은 작은 당첨이지만 빈도가 높습니다 |
| **Hit Frequency** | 적중 빈도. 한 번의 스핀에서 당첨 조합이 발생할 확률입니다 |
| **Paytable** | 배당표. 각 심볼 조합에 대응하는 배당 배수를 정의합니다 |
| **Reel Strip** | 릴 스트립. 각 릴의 심볼 배열 순서와 개수를 정의합니다 |
| **Virtual Reel** | 가상 릴. 가중치 매핑으로 각 심볼의 실제 출현 확률을 제어하며, RTP와 변동성 조정의 핵심 장치입니다 |
| **Spin Lifecycle** | 스핀 라이프사이클. 플레이어가 스핀을 누른 시점부터 결과 표시까지의 전체 처리 흐름(총 6단계) |
| **PAR Sheet** | Probability and Accounting Report. 수학 모델의 공식 문서이며 시험기관과 규제기관 심사의 핵심 자료입니다 |
| **GLI-11** | Gaming Laboratories International이 발행한 전자 게임 기기 기술 표준. 전 세계에서 가장 널리 채택된 슬롯머신 인증 표준입니다 |
| **GLI-19** | GLI가 발행한 원격 게임 시스템(RGS) 기술 표준. 온라인 슬롯에 적용됩니다 |
| **fast-check** | TypeScript/JavaScript용 속성 기반 테스트(Property-Based Testing) 라이브러리. 대량의 무작위 테스트 케이스를 자동 생성해 프로그램의 정확성을 검증합니다 |

## 주요 기능

- 🌍 **관할권 컴플라이언스 매트릭스** — 26개 시장의 제품 필수 제약 대조: 최소 게임 사이클 시간, 베팅 상한, autoplay, turbo/slam stop, 잭팟, 다중 게임 동시 플레이, RTP 하한, 데이터 현지화, 감사 로그 보존 기간. 각 항목에 법적 근거와 신뢰도 등급 표기
- 🧭 **어드바이저리 워크플로** — 요구사항 정리 → 컴플라이언스 격차 평가 → 리스크 등록부 → 시정 로드맵 → 산출물. B2B／B2C／플랫폼 사업자 책임 경계 매트릭스 포함
- 🎰 **수학 모델 설계** — Paytable 설계, Reel Strip 구성, RTP 계산, 변동성 조정, 적중 빈도 산출, 보너스 기능의 RTP 기여도
- 🔬 **수학 모델 검증** — 몬테카를로 표본 크기를 목표 정밀도와 실측 σ에서 역산(관행적 수치를 그대로 쓰지 않음), 이론값과 시뮬레이션값의 정합 판정, PAR sheet 15개 장 구성 규격, 흔한 8가지 검증 실패 원인
- 🔐 **RNG 및 게임 로직** — 엔진별 CSPRNG 선정, 시드 관리, 스핀 라이프사이클 6단계, 룰 엔진, 감사 로그
- 🖧 **플랫폼 및 시스템 계층 컴플라이언스** — GLI-19 시스템 범위, 서버 측 결과 결정, 연결 끊김 및 미완료 라운드 처리, 지갑 멱등성, game recall, 규제기관 중앙 시스템 연동(LUGAS, OASIS, Spelpaus, CRUKS, ROFUS, GAMSTOP, iGO, SAFE/TamperToken)
- 📋 **인증 준비** — GLI-11/GLI-19 컴플라이언스, 7종 인증 문서, 시험기관 선정, 기간 및 비용 추정
- 🔁 **변경 관리 및 재인증** — 변경 분류 프레임워크, 어떤 변경이 재신청을 유발하는지, 빌드와 인증의 연결 관리, 규제 변경 추적
- 🚨 **사고 및 결함 대응** — 심각도 분류, 중지 → 증거 보전 → 영향 범위 확정 → 수정 순서, 플레이어 보상 판단, 규제기관 보고
- 🛡️ **책임 있는 게임** — 입금 한도, 자기 배제, 세션 시간 제한, 손익 추적, autoplay 통제, 위험 안내 표시
- 🔍 **AML/KYC 및 데이터 보호** — 연령별 구분, 계정 상태 머신, 그리고 도박 규제의 장기 보존 의무와 데이터 보호의 최소화 원칙 간 충돌 처리
- ⛔ **금지 시장 등록부** — 온라인 슬롯이 불법인 시장(호주, 일본, **대한민국**, 싱가포르, 인도, 남아프리카공화국)을 명시적으로 경고합니다. 인증으로 진입이 가능해지는 것처럼 시사하지 않습니다
- 🎮 **멀티 엔진 지원** — Unity, Cocos Creator, Unreal Engine, Godot, HTML5/PixiJS. 엔진별 CSPRNG 가이드 제공

## 이 Power의 위치

**이것은 컴플라이언스 어드바이저이며 코드 생성기가 아닙니다.** 어떤 기능을 요청하면, 먼저 그 기능이 대상 시장에서 합법인지 알려주고 그다음에 적법한 구현 방법을 제시합니다.

| | Accelerator(가속 도구) | 본 Power(Expert 어드바이저) |
|---|---|---|
| 기능을 요청받을 때 | 바로 구현한다 | 먼저 대상 시장에서 합법인지 확인한다 |
| 수치를 요청받을 때 | 사용 가능한 값을 제시한다 | 값 **＋ 신뢰도 등급 ＋ 법적 근거 ＋ 확인 방법**을 제시한다 |
| 성공의 정의 | 동작하는 것 | 자신이 감수하는 리스크를 아는 것 |

모든 규제 수치에는 신뢰도 등급이 부여됩니다. `HIGH`(공식 법령 원문에서 확인), `MEDIUM`(신뢰할 수 있는 2차 출처), `UNVERIFIED`(**미확인. 추측값은 결코 기입하지 않음**).

컴플라이언스 어드바이저가 수치 하나를 틀리는 것은 공란으로 두는 것보다 나쁩니다. 공란은 확인 작업을 유발하지만, 잘못된 수치는 그대로 제품 규격에 들어가 인증 제출 시점에야 발견됩니다.

## 아키텍처

```
Developer (Natural Language)
    → AI Layer (Intent Understanding & Planning)
        → Slot Machine Expert Power (Domain Knowledge)
            → 리스크를 인지한 의사결정, 그다음에 적법한 구현

Slot Machine Expert (Intelligence Layer)
├── POWER.md              → 워크플로와 참고 자료를 정의하는 주 문서
├── steering/             → 12개 도메인 지식 가이드
├── templates/
│   ├── market-profiles/  → 26개 시장 컴플라이언스 프로필 + schema + 금지 시장 등록부
│   ├── certification/    → PAR sheet, RNG 제출 패키지, 변경 신청, GLI 체크리스트
│   ├── advisory/         → 격차 평가, 리스크 등록부, 로드맵, 사고 보고
│   ├── paytable/         → 배당표 템플릿(변동성별)
│   └── reel-strip/       → 가상 릴 구성
├── hooks/                → IDE 자동화 훅
└── tests/                → 속성 기반 테스트(fast-check + vitest)
```

## 시장 커버리지

**프로필이 구축된 규제 시장**: 영국(UKGC), 독일(GGL), 스웨덴(Spelinspektionen), 덴마크(Spillemyndigheden), 몰타(MGA), 온타리오(AGCO), 네바다, 뉴저지, 미시간, 펜실베이니아, 웨스트버지니아, 코네티컷, 델라웨어, 미국 부족 Class III, 브라질(SPA), 필리핀(PAGCOR), 그리스, 벨기에, 이탈리아, 스페인, 네덜란드, 루마니아, 포르투갈, 맨섬, 지브롤터, 퀴라소(LOK), 콜롬비아, 페루, Kahnawà:ke

**금지 또는 회색 지대로 표시**: 호주, 일본, **대한민국**, 싱가포르, 인도, 남아프리카공화국, 멕시코, 코스타리카

프로필의 상세도는 서로 다릅니다. **공식 출처에 도달하지 못한 시장은 `UNVERIFIED`를 명시하고 확인 체크리스트를 첨부한 「리서치 스켈레톤」 형태로 제공**합니다. 그럴듯해 보이는 수치로 채우지 않습니다.

## 사전 요구사항

- [Kiro IDE](https://kiro.dev/docs/getting-started/installation) 설치
- Node.js 18 이상(본 Power의 개발 및 테스트 용도로만 필요)

## 설치 방법

### Step 1 — Power 설치

Kiro 실행 → 좌측 패널의 Powers 아이콘 클릭 → "+" 클릭 → "Add Custom Power" 선택 → 본 프로젝트 루트 디렉터리 선택

### Step 2 — 자동 안내 훅 설치(권장)

이 훅은 각 질문을 적절한 Steering File로 라우팅하고 어드바이저리 원칙을 강제합니다. 즉 먼저 관할권을 확인하고, 미확인 규제 수치를 사실로 진술하지 않으며, 레드 플래그를 능동적으로 지적합니다.

두 가지 형식이 포함되어 있습니다. 사용 중인 Kiro 버전에 맞는 것을 선택하세요.

```bash
mkdir -p .kiro/hooks

# 현행 agent hook 형식(v1 schema: version + hooks[] + UserPromptSubmit)
cp hooks/slot-expert-guidance.json .kiro/hooks/

# 구 형식(.kiro.hook을 읽는 구 버전 Kiro용)
cp hooks/pre-slot-tool.kiro.hook .kiro/hooks/
```

**하나만** 설치하세요. 판단이 어렵다면 먼저 `slot-expert-guidance.json`을 사용하고 Power가 자동으로 활성화되는지 확인하세요.

훅을 설치하지 않으면 전문 지식을 사용하도록 AI에게 수동으로 상기시켜야 할 수 있습니다.

### Step 3 — 설치 확인

Kiro에서 슬롯머신 관련 질문을 입력하세요(예: "RTP 96%, 중간 변동성 5×3 슬롯의 수학 모델을 설계해줘"). AI가 GLI 표준을 인용하며 전문적으로 응답하면 설치가 완료된 것입니다.

## 사용 방법

설치 후에는 자연어로 대화하면 됩니다. AI가 해당 Steering File을 자동으로 로드해 슬롯머신 개발 전문가로서 응답합니다.

### 무엇을 물어볼 수 있나요?

| 영역 | 질문 예시 |
|------|-----------|
| 수학 모델 | "중간 변동성 RTP 96% 배당표를 설계해줘", "Free Spin의 RTP 기여도를 계산해줘", "총 가중치 128의 가상 릴을 구성해줘" |
| RNG | "Unity에서 CSPRNG를 올바르게 구현하는 방법은?", "감사 로그에 필요한 필드는?", "스핀 라이프사이클 6단계란?" |
| 인증 | "GLI-11 인증에는 어떤 문서가 필요해?", "영국 시장의 특별 요건은?", "인증 기간과 비용 추정치는?" |
| 책임 있는 게임 | "입금 한도 기능은 어떻게 구현해?", "스웨덴 시장의 autoplay 규제는?", "세션 시간 알림의 베스트 프랙티스는?" |

### 워크플로 예시: 슬롯 수학 모델 전체 설계

```
1. "영국 시장을 겨냥한 5×3, 20 페이라인 슬롯을 만들려고 합니다.
    RTP 96%의 중간 변동성 수학 모델을 설계해주세요."

2. "5개 릴 전체의 가상 릴 가중치 테이블을 구성해주세요."

3. "적중 빈도를 산출하고 목표 구간과 대조해 검증해주세요."

4. "Scatter 3개 이상으로 발동하는 Free Spin을 설계해주세요.
    10/15/20회 프리스핀과 2x/3x/5x 배수로."

5. "총 RTP를 검증해주세요: 베이스 게임 + 프리스핀 + Scatter 배당."

6. "이 게임에 대해 GLI-11 인증 체크리스트를 처음부터 점검해주세요."
```

## 지원 게임 엔진

| 엔진 | 언어 | CSPRNG |
|------|------|--------|
| Unity | C# | `System.Security.Cryptography.RandomNumberGenerator` |
| Cocos Creator | TypeScript | Web Crypto API / Node.js `crypto` |
| Unreal Engine | C++/Blueprint | OpenSSL `RAND_bytes` |
| Godot | GDScript/C# | `Crypto` 클래스 |
| HTML5/PixiJS | JS/TS | Web Crypto API (`crypto.getRandomValues`) |

## Steering 가이드 목록

| 파일 | 발동 시점 | 다루는 내용 |
|------|-----------|-------------|
| `jurisdiction-matrix.md` | 특정 시장 또는 시장 간 컴플라이언스 차이 | 시장별 제품 필수 제약 대조, 데이터 신뢰도 등급 제도, 시장 간 아키텍처 전략(최엄격 공통 기준／기능 플래그／시장 전용 빌드), 시험기관의 시장 수용성, 확인 SOP |
| `advisory-engagement.md` | 컴플라이언스 상담, 시장 진입 평가, 격차 분석 | 어드바이저리 5단계 프로세스, B2B／B2C／플랫폼 사업자 책임 경계, 흔한 5가지 고객 시나리오 대응, 능동적으로 제시해야 할 경고 |
| `math-model.md` | 수학 모델 관련 질문 | Paytable 설계, Reel Strip 구성, RTP 계산, 변동성 조정, 적중 빈도, 보너스 기능의 RTP 기여도 |
| `math-verification.md` | RTP 검증, 시뮬레이션 표본 크기, PAR sheet | 이론 RTP 계산, 몬테카를로 표본 크기 도출, 신뢰구간 판정, 베팅 구성 매트릭스, 흔한 8가지 검증 실패 원인 |
| `rng-game-logic.md` | RNG 또는 게임 로직 | CSPRNG 선정(엔진별), 시드 관리, 스핀 라이프사이클 6단계, 룰 엔진, 감사 로그 |
| `platform-systems-compliance.md` | 시스템 계층 컴플라이언스 | GLI-19 시스템 범위, 서버 측 결과 결정, 연결 끊김 복구, 지갑 멱등성, game recall, 중앙 시스템 연동, 데이터 현지화 배포 토폴로지 |
| `certification-prep.md` | 인증 또는 컴플라이언스 | GLI-11/GLI-19 표준, 7종 인증 문서, 시장 규제 정보, 기간과 비용, RTP 하한 경고 |
| `responsible-gaming.md` | 책임 있는 게임 기능 | 입금 한도, 자기 배제, 세션 시간 제한, 손익 추적, autoplay 통제, 위험 안내 표시 |
| `change-management-recert.md` | 인증 후 변경, 재인증 필요 여부 | 변경 분류 프레임워크, 표현 계층으로 오판하기 쉬운 변경, 시장별 보고 요건, 빌드와 인증 대응표, 규제 변경 추적 |
| `incident-malfunction-handling.md` | 결함 대응, 사고 심각도, 플레이어 보상 | 사고 분류, 중지 후 수정 절차, 증거 보전 체크리스트, 플레이어 보상 판단, 규제기관 보고, 예방적 설계 |
| `aml-kyc-player-account.md` | 연령 확인, KYC, AML, 계정 상태 | 시장별 최소 연령(18／19／21)과 연령별 베팅 상한, 계정 상태 머신, 자금세탁 위험 패턴, 사업자 간 한도, 결제 제약 |
| `data-protection-privacy.md` | GDPR, 개인정보, 보존과 삭제의 충돌 | 데이터 분류와 생애주기 차별화, 법적 근거 선택, 국외 이전, 관리자／처리자 역할, 정보보안 표준 대응 |

## 공식 참고 자료

본 Power의 도메인 지식은 모두 검증된 공식 문서에 기반합니다.

| 출처 | URL | 영역 |
|------|-----|------|
| GLI Standards (GLI-11/GLI-19) | https://gaminglabs.com/gli-standards/ | 인증 표준 |
| UKGC Remote Technical Standards (RTS) | https://www.gamblingcommission.gov.uk/standards/remote-gambling-and-software-technical-standards | 영국 제품 제약 |
| 독일 GlüStV 2021 §22a | https://www.gesetze-bayern.de/Content/Document/StVGlueStV2021-22a | 가상 슬롯 제약 |
| 스웨덴 Spellag (2018:1138) | https://www.riksdagen.se/sv/dokument-och-lagar/dokument/svensk-forfattningssamling/spellag-20181138_sfs-2018-1138/ | 스웨덴 법규 |
| 덴마크 인증 프로그램 | https://spillemyndigheden.dk/en-us/businesses-and-associations/games-which-require-a-licence/online-casino/certification-programme-for-online-casino | SCP.00–SCP.07 |
| AGCO Registrar's Standards | https://www.agco.ca/en/lottery-and-gaming/guides/registrars-standards-internet-gaming | 온타리오 제품 제약 |
| Malta Gaming Authority | https://www.mga.org.mt/ | EU 법규 |
| Nevada Gaming Control Board | https://gaming.nv.gov | Regulation 14 |
| Connecticut DCP Gaming | https://portal.ct.gov/gaming | 미국 주 단위 기술 표준 |
| NIST SP 800-90A Rev.1 | https://csrc.nist.gov/pubs/sp/800/90/a/r1/final | RNG 표준 |
| NIST SP 800-90C | https://csrc.nist.gov/pubs/sp/800/90/c/final | RBG 구성(2025-09 최종본) |
| NIST의 SP 800-22 개정 결정 | https://csrc.nist.gov/News/2022/decision-to-revise-nist-sp-800-22-rev-1a | ⚠️ 암호용 RNG 평가 용도 부정 |
| W3C Web Crypto API | https://www.w3.org/TR/WebCryptoAPI/ | 브라우저 CSPRNG |
| 브라질 SPA / Ministério da Fazenda | https://www.gov.br/fazenda/pt-br/composicao/orgaos/secretaria-de-premios-e-apostas | 브라질 법규 |
| Curaçao Gaming Authority | https://gamingcontrolcuracao.org | LOK 전환 |
| PAGCOR | https://www.pagcor.ph | 필리핀 법규 |
| ACMA / Interactive Gambling Act 2001 | https://www.legislation.gov.au/C2004A00851 | ⛔ 호주 금지 |
| GamStop (UK) | https://www.gamstop.co.uk/ | 자기 배제 |

전체 목록은 POWER.md의 참고 자료 섹션을 확인하세요.

### 알아둘 두 가지 정정

본 Power를 위한 리서치에서, 업계에 널리 퍼져 있으나 근거를 확인할 수 없었던 주장이 두 건 발견되었습니다.

1. **몰타의 "최소 RTP 92%"는 현행 MGA 문서 어디에서도 확인할 수 없었습니다.** 나아가 MGA는 85%로의 조정을 검토하는 정책 문서를 공개했습니다. 본 Power는 몰타의 최소 RTP를 `UNVERIFIED`로 기록하고 이 수치를 반복하지 않습니다.
2. **NIST 자신의 입장은 SP 800-22를 암호학적 RNG 평가에 사용해서는 안 된다는 것입니다.** 그럼에도 이 문서는 여전히 게이밍 RNG 컴플라이언스 근거로 널리 인용됩니다. 본 Power는 이 불일치를 그대로 따르지 않고 명시적으로 지적합니다.

또한 **GLI와 iTech Labs는 2023년 5월부터 동일 기업 그룹에 속합니다**. 시장이나 계약이 시험기관의 독립성을 요구하는 경우 이 점이 중요합니다.

## 테스트 실행

```bash
npm install
npm test              # 모든 테스트 실행
npx tsc --noEmit     # TypeScript 타입 검사
```

13개 테스트 파일, 59개 테스트로 수학 모델 수식, 데이터 구조 완전성, 매핑 일관성, 그리고 세 가지 드리프트 방지 제약을 검증합니다. 즉 시장 프로필 schema(`UNVERIFIED`로 표시된 필드에 구체적 값을 두지 않음), POWER.md와 steering 파일의 등록 정합성, 훅과 steering의 동기화(steering을 추가하고 훅 갱신을 잊으면 테스트가 실패함)입니다.

## 문제 해결

| 문제 | 해결 방법 |
|------|-----------|
| AI가 전문가로 응답하지 않음 | 훅이 `.kiro/hooks/`에 복사되었는지 확인하세요. `pre-slot-tool.kiro.hook`이 발동하지 않으면 사용 중인 Kiro가 v1 schema를 요구할 가능성이 높으므로 `slot-expert-guidance.json`을 사용하세요 |
| 테스트 실패 | `npm install` 실행 후 `npm test`를 다시 시도하세요 |
| TypeScript 타입 오류 | `npm install` 후 `npx tsc --noEmit`을 실행하세요 |

## 보안

보안 문제 신고 방법은 [CONTRIBUTING.md](CONTRIBUTING.md#security-issue-notifications)를 참조하세요.

## 라이선스

MIT License. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

본 Power의 지식 내용은 모두 공식 출처를 명기하고 있습니다. 자세한 내용은 POWER.md의 참고 자료 섹션을 확인하세요. 모든 URL은 공식 기관의 정식 페이지를 가리키도록 사람이 직접 확인했습니다.
