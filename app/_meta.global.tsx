import { MetaRecord } from "nextra";

const META = {
  "protocol": {
    "title": "Drift Protocol",
    "type": "page",
    "items": {
      "index": "Drift Overview",
      "about-v3": {
        "title": "About Drift v3",
        "items": {
          "index": "Understanding Drift",
          "drift-amm": "Drift AMM",
          "decentralized-orderbook": "Decentralized Orderbook",
          "keepers": {
            "title": "Keepers",
            "items": {
              "index": "What are Keepers?",
              "keepers-dlob-faq": "Keepers & DLOB FAQ",
              "keeper-incentives": "Keeper Incentives",
            },
          },
          "matching-engine": "Matching Engine",
          "jit-faq": "Just-in-Time (JIT) FAQ",
          "revenue-pool": "Revenue Pool",
          "optimizations": "Optimizations",
        }
      },
      "getting-started": {
        "title": "Getting Started",
        "items": {
          "cross-collateral-deposits": "Cross-collateral deposits",
          "managing-subaccount": "Managing Subaccount",
          "delegated-accounts": "Delegated Accounts",
          "withdraw-and-close-account": "Withdraw and Close Account"
        }
      },
      "trading": {
        "title": "Trading",
        "items": {
          "market-specs": "Market Specs",
          "prelaunch-markets": "Prelaunch Markets",
          "perpetuals-trading": {
            "title": "Perpetuals Trading",
            "items": {
              "index": "What are Perpetual Futures?",
              "perpetuals-trading": "Perpetuals Trading",
              "auction-parameters": "Auction Parameters",
              "funding-rates": "Funding Rates",
            }
          },
          "spot-trading": "Spot Trading",
          "margin": {
            "title": "Margin",
            "items": {
              "index": "Margin",
              "per-market-leverage": "Per-Market Leverage",
              "account-health": "Account Health",
            },
          },
          "profit-loss": {
            "title": "Profit & Loss (P&L)",
            "items": {
              "index": "Introduction to Profit & Loss",
              "accounting-settlement": "Accounting and Settlement",
              "what-is-unsettled-profit-loss": "What is unsettled P&L?",
              "profit-loss-pool": "P&L Pool"
            }
          },
          "order-types": {
            "title": "Order Types",
            "items": {
              "index": "Basic Order Types",
              "advanced-order-types": "Advanced Order Types",
              "advanced-orders-faq": "Advanced Orders FAQ",
            },
          },
          "liquidations": {
            "title": "Liquidations",
            "items": {
              "index": "What is Liquidation?",
              "liquidation-engine": "Liquidation Engine",
              "liquidators": "Liquidators"
            }
          },
          "trading-fees": {
            "title": "Trading Fees",
            "items": {
              "index": "Fee Structure",
              "fee-pool": "Fee Pool",
              "other-trading-fees": "Other Trading Fees",
            }
          },
          "versioned-transactions": "Versioned Transactions",
          "oracles": "Oracles",
          "block-conditions": "Block Conditions",
        }
      },
      "borrow-lend": {
        "title": "Borrow & Lend",
        "items": {
          "index": "What is Borrow & Lend?",
          "borrow-interest-rate": "Borrow Interest Rate",
          "isolated-pools": "Isolated Pools",
          "borrow-lend-faq": "Borrow & Lend FAQ",
          "rewards": "Rewards",
          "borrow-lend-apy": "Borrow & Lend APY",
          "amplify": {
            "title": "Amplify",
            // "asIndexPage": true,
            "items": {
              // "index": "How it Works",
              "opening-a-position": "Opening a Position",
              "monitoring-a-position": "Monitoring a Position",
              "closing-a-position": "Closing a Position",
              "risk": "Risk"
            }
          },
        }
      },
      "market-makers": {
        "title": "Market Makers",
        "items": {
          "market-maker-participation": "Market Maker Participation",
          "maker-fee-rebate": "Maker Fee Rebate",
        }
      },
      "insurance-fund": {
        "title": "Insurance Fund",
        "items": {
          "index": "What is the Insurance Fund?",
          "insurance-fund-staking": "Insurance Fund Staking"
        }
      },
      "referral-links": "Referral Links",
      "historical-data": {
        "title": "Historical Data",
        "items": {
          "historical-data-api": "Historical Data API",
          "historical-data-glossary": "Historical Data Glossary"
        }
      },
      "risk-and-safety": {
        "title": "Risk and Safety",
        "items": {
          "risk-parameters": "Risk Parameters",
          "delisting-process": "Delisting Process",
          "protocol-guard-rails": "Protocol Guard Rails",
        }
      },
      "security": {
        "title": "Security",
        "items": {
          "audits": "Audits",
          "bug-bounty": "Bug Bounty",
          "risks": "Risks"
        }
      },
      "drift-safety-module": "Drift Safety Module",
      "glossary": "Glossary",
      "--- Legal": {
        "title": "LEGAL",
        "type": "separator"
      },
      "legal-and-regulations": {
        "title": "Legal and Regulations",
        "items": {
          "terms-of-use": "Terms of Use",
          "disclaimer": "Disclaimer",
          "privacy-policy": "Privacy Policy",
          "competition-terms": "Competition Terms"
        }
      },
    }
  },
  "developers": {
    "title": "Developers",
    "type": "page",
    "items": {
      "typescript-sdk": {
        "title": "TypeScript SDK",
        "items": {
          "setup": "Setup",
          "precision-and-types": "Precision & types",
          "deposits-withdrawals": "Deposits & withdrawals",
          "transfers": "Transfers",
          "users": "Users",
          "orders": "Orders",
          "markets": "Markets",
          "pnl-risk": "PnL & risk",
          "swift": "Swift",
          "builder-codes": "Builder codes",
          "events": "Events",
          "swaps": "Swaps"
        }
      },
      "mm-workflow": {
        "title": "MM workflow",
        "items": {
          "normal-mm": "Normal MM",
          "orderbook": "Orderbook & DLOB",
          "jit-only": "JIT-only MM",
          "swift-order-feed": "Swift order feed",
          "swift-place-and-make": "Swift place-and-make",
          "indicative-quotes": "Indicative quotes"
        }
      },
      "vaults-workflow": {
        "title": "Vaults workflow",
        "items": {
          "index": "Overview"
        }
      },
      "tutorial-bots": {
        "title": "Tutorial Bots",
        "items": {
          "bot-template": "Bot template",
          "keeper-bots": {
            "title": "Keeper Bots",
            "items": {
              "tutorial-order-matching-bot": "Tutorial: Order Matching Bot",
              "tutorial-order-trigger-bot": "Tutorial: Order Trigger Bot",
              "tutorial-liquidation-bot": "Tutorial: Order Liquidation Bot"
            }
          },
          "trading-bots": {
            "title": "Trading Bots",
            "items": {
              "tutorial-jit-trading-bot": "Tutorial: JIT Maker Bot"
            }
          },
          "rpc-providers": "RPC Providers"
        }
      },
      "builder-codes": "Builder Codes",
      "sdk-documentation": "SDK Documentation",
      "contributing-to-drift": "Contributing to Drift"
    }
  }
} as MetaRecord;

export default META;
