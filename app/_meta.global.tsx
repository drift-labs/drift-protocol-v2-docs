import { MetaRecord } from "nextra";

const META: MetaRecord = {
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
          "wallet-setup": {
            "title": "Wallet Setup",
            "items": {
              "phantom-setup": " Phantom",
              "metamask-setup": "MetaMask",
              "bot-wallet-setup": "Bot Wallet",
              "wallet-faq": "Wallet FAQ"
            }
          },
          "passwordless-login": "Passwordless and Social Login",
          "cross-collateral-deposits": "Cross-collateral deposits",
          "managing-subaccount": "Managing Subaccount",
          "delegated-accounts": "Delegated Accounts",
          "versioned-transactions": "Versioned Transactions",
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
          "what-is-borrow-lend": "What is Borrow & Lend?",
          "supply-borrow-apy": "Supply & Borrow APY",
          "borrow-interest-rate": "Borrow Interest Rate",
          "borrow-lend-faq": "Borrow & Lend FAQ",
          "rewards": "Collateral Rewards",
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
      "risk-and-safety": "Risk and Safety",
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
      "tutorial-bots": {
        "title": "Tutorial Bots",
        "items": {
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
};

export default META;
