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
          "drift-amm": "",
          "decentralized-orderbook": "",
          "keepers": {
            "title": "Keepers",
            "items": {
              "index": "",
              "keepers-dlob-faq": "",
              "keeper-incentives": "",
            },
          },
          "matching-engine": "",
          "jit-faq": "",
          "revenue-pool": "",
          "optimizations": "",
        }
      },
      "getting-started": {
        "title": "Getting Started",
        "items": {
          "wallet-setup": {
            "title": "Wallet Setup",
            "items": {
              "index": "",
              "phantom-wallet": "",
              "metamask": "",
              "passwordless-login": "",
              "bot-wallet": "",
            },
          },
          "cross-collateral-deposits": "",
          "managing-subaccounts": "",
          "delegated-accounts": "",
          "withdraw-and-close-account": ""
        }
      },
      "trading": {
        "title": "Trading",
        "items": {
          "market-specs": "",
          "prelaunch-markets": "",
          "perpetuals-trading": {
            "title": "Perpetuals Trading",
            "items": {
              "index": "",
              "perpetuals-trading": "",
              "auction-parameters": "",
              "funding-rates": "",
            }
          },
          "spot-trading": "Spot Trading",
          "margin": {
            "title": "Margin",
            "items": {
              "index": "",
              "per-market-leverage": "",
              "account-health": "",
            },
          },
          "profit-loss": {
            "title": "Profit & Loss (P&L)",
            "items": {
              "index": "",
              "accounting-settlement": "",
              "unsettled-profit-loss": "",
              "profit-loss-pool": ""
            }
          },
          "order-types": {
            "title": "Order Types",
            "items": {
              "index": "",
              "advanced-order-types": "",
              "advanced-orders-faq": "",
            },
          },
          "liquidations": {
            "title": "Liquidations",
            "items": {
              "index": "",
              "liquidation-engine": "",
              "liquidators": ""
            }
          },
          "trading-fees": {
            "title": "Trading Fees",
            "items": {
              "index": "",
              "fee-pool": "",
              "other-trading-fees": "",
            }
          },
          "versioned-transactions": "",
          "oracles": "",
          "block-conditions": "",
        }
      },
      "borrow-lend": {
        "title": "Borrow & Lend",
        "items": {
          "index": "",
          "borrow-interest-rate": "",
          "isolated-pools": "",
          "borrow-lend-faq": "",
          "rewards": "",
          "borrow-lend-apy": "",
          "amplify": {
            "title": "Amplify",
            "items": {
              "index": "",
              "opening-a-position": "",
              "monitoring-a-position": "",
              "closing-a-position": "",
              "risk": ""
            }
          },
        }
      },
      "market-makers": {
        "title": "Market Makers",
        "items": {
          "market-maker-participation": "",
          "maker-fee-rebate": "",
        }
      },
      "insurance-fund": {
        "title": "Insurance Fund",
        "items": {
          "index": "",
          "insurance-fund-staking": ""
        }
      },
      "referral-links": "",
      "risk-and-safety": {
        "title": "Risk and Safety",
        "items": {
          "risk-parameters": "",
          "delisting-process": "",
          "protocol-guard-rails": "",
          "audits": "",
          "bug-bounty": "",
          "risks": "",
          "drift-safety-module": "",
        }
      },
      "glossary": "",
      "--- Legal": {
        "title": "LEGAL",
        "type": "separator"
      },
      "legal-and-regulations": {
        "title": "Legal and Regulations",
        "items": {
          "terms-of-use": "",
          "disclaimer": "",
          "privacy-policy": "",
          "competition-terms": ""
        }
      },
    }
  },
  "developers": {
    "title": "Developers",
    "type": "page",
    "items": {
      "drift-sdk": {
        "title": "Drift SDK",
        "items": {
          "setup": "Setup",
          "precision-and-types": "Precision & types",
          "deposits-withdrawals": "Deposits & withdrawals",
          "transfers": "Transfers",
          "users": "Users",
          "markets": "Markets",
          "orders": "Orders",
          "pnl-risk": "PnL & risk",
          "events": "Events",
          "swaps": "Swaps",
          "swift": "Swift",
          "builder-codes": "Builder codes"
        }
      },
      "data-api": {
        "title": "Data API",
        "items": {
          "index": "",
          "glossary": ""
        }
      },
      "--- guides": {
        "title": "GUIDES",
        "type": "separator"
      },
      "market-makers": {
        "title": "Market Makers",
        "items": {
          "normal-mm": "Normal MM",
          "orderbook": "Orderbook & DLOB",
          "jit-only": "JIT-only MM",
          "swift-order-feed": "Swift order feed",
          "swift-place-and-make": "Swift place-and-make",
          "indicative-quotes": "Indicative quotes",
          "bot-architecture": "Bot architecture patterns"
        }
      },
      "vault-managers": {
        "title": "Vault Managers",
        "items": {
          "index": "Overview"
        }
      },
      "bots": {
        "title": "Bots",
        "items": {
          "bot-template": "Bot template",
          "keeper-bots": {
            "title": "Keeper Bots",
            "items": {
              "order-matching-bot": "Tutorial: Order Matching Bot",
              "order-trigger-bot": "Tutorial: Order Trigger Bot",
              "liquidation-bot": "Tutorial: Order Liquidation Bot"
            }
          },
          "trading-bots": {
            "title": "Trading Bots",
            "items": {
              "jit-trading-bot": "Tutorial: JIT Maker Bot"
            }
          },
          "liquidator-bots": {
            "title": "Liquidator Bots",
            "items": {
              "index": "Overview"
            }
          },
          "rpc-providers": "RPC Providers"
        }
      },
      "ecosystem-builders": {
        "title": "Ecosystem Builders",
        "items": {
          "index": "Overview",
        }
      },
      "traders": {
        "title": "Traders",
        "items": {
          "index": "Overview",
        }
      },
      "builder-codes": "Builder Codes",
      "--- Contribute": {
        "title": "CONTRIBUTE",
        "type": "separator"
      },
      "contributing-to-drift": "Contributing to Drift"
    }
  }
} as MetaRecord;

export default META;
