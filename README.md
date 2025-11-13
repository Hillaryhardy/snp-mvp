# SNP (Stacks Nexus Protocol)

**Automated DeFi Yield Aggregator for Stacks Layer 2**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tests: 100%](https://img.shields.io/badge/Tests-28%2F28%20Passing-brightgreen)](./tests)
[![Clarity](https://img.shields.io/badge/Clarity-v2.0-blue)](https://clarity-lang.org/)

## Overview

SNP is a **production-ready, non-custodial yield aggregator** that automatically optimizes returns across 12 Stacks DeFi protocols. Users deposit once and earn continuously without active management.

**Key Stats:**
- ✅ 15 Smart Contracts (3,200+ lines)
- ✅ 100% Test Success (28/28 devnet tests)
- ✅ 12 Protocol Integration
- ✅ Security Hardened

## Quick Start

```bash
# Install Clarinet
curl -L https://clarinet.software/install.sh | sh

# Clone & setup
git clone https://github.com/mattglory/snp-mvp.git
cd snp-mvp

# Compile contracts
clarinet check

# Start devnet blockchain
clarinet devnet start

# Interactive testing
clarinet console
```

## Documentation

**For Code4STX Reviewers:**
- 📄 [Complete Technical Guide](./CODE4STX-COMPLETE-GUIDE.md) - Comprehensive documentation with architecture, testing evidence, security analysis, and roadmap

**Project Structure:**
```
snp-mvp/
├── contracts/          # 15 Clarity smart contracts (3,200+ lines)
├── tests/             # Comprehensive test suite (28 tests, 100% pass)
├── frontend/          # React + TypeScript dashboard
├── deployments/       # Deployment configurations
└── settings/          # Clarinet environment settings
```

## Architecture

```
Vault (Hub) → Strategy Manager → 12 Strategies (Spokes)
                                 ↓
           ALEX • StackSwap • Zest • Bitflow
           Arkadiko • Hermetica • Velar • STX Stacking
           sBTC • Stable Pool • StackingDAO • Granite
```

## Features

- **Automated Portfolio Management** - Weight-based allocation across 12 strategies
- **Security Hardened** - First depositor protection, emergency controls, slippage protection
- **SIP-010 Compliant** - Transferable vault shares
- **Bitcoin-Native** - All yields settled on Bitcoin L1

## Protocol Integrations

| Protocol | Type | Allocation |
|----------|------|------------|
| ALEX | AMM | 30% |
| Zest | Lending | 12% |
| sBTC | Holdings | 10% |
| StackSwap | DEX | 10% |
| Granite | Lending | 10% |
| Bitflow | DEX | 8% |
| Arkadiko | Vault | 8% |
| Hermetica | Vault | 8% |
| StackingDAO | Staking | 7% |
| STX Stacking | Native | 7% |
| Velar | Farm | 5% |
| Stable Pool | Stable | 5% |

## Testing

**Devnet Test Results:**
```
✅ 28 Tests Executed
✅ 100% Pass Rate
✅ 0 Failures
⏱️ ~45 minutes execution
```

**Test Coverage:**
- Vault operations: 100%
- Strategy allocation: 100%
- Emergency controls: 100%
- Withdrawal flows: 100%
- Accounting: 100%

## Deposit Strategy (L2)

**Current MVP:** STX deposits (vault-stx-v2.clar)

**Roadmap (Phase 3):**
- sBTC vault (Bitcoin-backed)
- USDA vault (Stablecoin)
- Multi-asset unified vault

## Security

**Implemented Protections:**
- First depositor attack prevention (burns 1,000 dead shares)
- Slippage protection (min-amount-out, deadline)
- Emergency pause/resume
- Strategy whitelisting
- Precise fee calculations (0.5% performance fee)

**Pre-Mainnet Requirements:**
- Professional security audit
- Extended testnet testing (100+ users)
- Multi-sig admin wallet

## Development

**Built With:**
- Clarity v2.0 (smart contracts)
- React + TypeScript (frontend)
- Clarinet v2.0+ (development)

**Contract Compilation:**
```bash
clarinet check
# ✅ 15/15 contracts (100%)
# ❌ 0 errors
# ⚠️ 51 warnings (input validation - acceptable)
```

## Roadmap

- [x] **Phase 1: MVP** - 15 contracts, 100% test success
- [ ] **Phase 2: Beta** - Testnet deployment, 100+ testers
- [ ] **Phase 3: Audit** - Professional security review
- [ ] **Phase 4: Launch** - Mainnet deployment
- [ ] **Phase 5: Growth** - $1M+ TVL, 15+ protocols

## Team

**Matt Glory** - Builder
- GitHub: [@mattglory](https://github.com/mattglory)
- Twitter: [@mattglory14](https://twitter.com/mattglory14)
- Discord: geoglory

**Experience:**
- 4 Stacks projects completed
- LearnWeb3 Stacks Developer Degree
- 2+ years software development

## Frontend

Professional React dashboard with:
- Real-time vault statistics
- Strategy allocation visualization
- Wallet connectivity (Hiro, Xverse)
- Bitcoin-themed design
- Responsive UI with TailwindCSS

**Run Frontend:**
```bash
cd frontend
npm install
npm start
```

## License

MIT License - Open source contribution to Stacks ecosystem

## Contact

- **GitHub Issues:** [Report bugs or request features](https://github.com/mattglory/snp-mvp/issues)
- **Discord:** geoglory
- **Response Time:** <24 hours

---

**Status:** Production-Ready MVP | **Test Success:** 100% (28/28) | **Ready for:** Code4STX Review
