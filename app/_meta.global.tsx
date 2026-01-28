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
          "understanding-drift": "Understanding Drift",
          "drift-amm": "Drift AMM",
          "decentralized-orderbook": "Decentralized Orderbook",
          "keepers": {
            "title": "Keepers",
            "items": {
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
          "perpetuals-trading": "Perpetuals Trading",
          "what-are-perpetual-futures": "What are Perpetual Futures?",
          "funding-rates": "Funding Rates",
          "spot-margin-trading": "What is Spot Margin Trading?",
          "spot-faq": "Spot FAQ",
          "margin": "Margin",
          "order-types": "Order Types",
          "all-order-types": "All Order Types",
          "advanced-orders-faq": "Advanced Orders FAQ",
          "account-health": "Health Breakdown",
          "auction-parameters": "Auction Parameters",
          "trading-fees": "Trading Fees",
          "other-trading-fees": "Other Trading Fees",
          "fee-pool": "Fee Pool",
          "versioned-transactions": "Versioned Transactions",
          "block-conditions": "Block Conditions",
          "oracles": "Oracles"
        }
      },
      "profit-loss": {
        "title": "Profit & Loss (P&L)",
        "items": {
          "profit-loss-intro": "Introduction to Profit & Loss",
          "accounting-settlement": "Accounting and Settlement",
          "what-is-unsettled-profit-loss": "What is unsettled P&L?",
          "profit-loss-pool": "P&L Pool"
        }
      },
      "liquidations": {
        "title": "Liquidations",
        "items": {
          "liquidations": "What is Liquidation?",
          "liquidation-engine": "Liquidation Engine",
          "liquidators": "Liquidators"
        }
      },
      "lend-borrow": {
        "title": "Lend & Borrow",
        "items": {
          "what-is-lend-borrow": "What is lending and borrowing?",
          "supply-borrow-apy": "Supply & Borrow APY",
          "borrow-interest-rate": "Borrow Interest Rate",
          "lend-borrow-faq": "Lend & Borrow FAQ",
          "rewards": "Collateral Rewards"
        }
      },
      "amplify": {
        "title": "Amplify",
        "items": {
          "how-it-works": "How it Works",
          "opening-a-position": "Opening a Position",
          "monitoring-a-position": "Monitoring a Position",
          "closing-a-position": "Closing a Position",
          "risk": "Risk"
        }
      },
      "market-makers": {
        "title": "Market Makers",
        "items": {
          "market-maker-participation": "Market Maker Participation",
          "maker-rebate-fees": "Maker Rebate Fees",
          "rewards-program": "Market Maker Reward Program"
        }
      },
      "insurance-fund": {
        "title": "Insurance Fund",
        "items": {
          "insurance-fund-intro": "Introduction to Insurance Fund",
          "insurance-fund-staking": "Insurance Fund Staking"
        }
      },
      "sdk-documentation": "SDK Documentation",
      "partnerships": {
        "title": "Partnerships",
        "items": {
          "DBC": "🛠️ Drift Builder Codes",
          "referral-link": "💌 Referral Link"
        }
      },
      "historical-data": {
        "title": "Historical Data",
        "items": {
          "historical-data-v1": "Historical Data v1",
          "historical-data-v2": "Historical Data v2",
          "historical-data-glossary": "Historical Data Glossary"
        }
      },
      "risk-and-safety": {
        "title": "Risk and Safety",
        "items": {
          "delisting-process": "Delisting Process",
          "protocol-guard-rails": "Protocol Guard Rails",
          "risk-parameters": "Risk Parameters"
        }
      },
      "drift-safety-module": "Drift Safety Module",
      "security": {
        "title": "Security",
        "items": {
          "audits": "Audits",
          "bug-bounty": "Bug Bounty",
          "risks": "Risks"
        }
      },
      "glossary": "Glossary",
      "additional-resources-data": "Additional Resources and Data",
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
      "contributing-to-drift": {
        "title": "Contribute",
        "type": "page"
      },
      "contact": {
        "title": "Contact ↗",
        "type": "page",
        "href": "https://twitter.com/DriftProtocol"
      }
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
      }
    }
  }
} as MetaRecord;

export default META;
