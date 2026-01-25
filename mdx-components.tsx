import { useMDXComponents as useDocsMDXComponents } from "nextra-theme-docs";
import {
  AdjustedPerpMarketFeesTable,
  AdjustedSpotMarketFeesTable,
  FeeTiersTable,
  PerpFeeStructureTable,
  SpotFeeStructureTable,
} from "./components/data/TradingFeesTables";
import { HighLeverageTable, PerpMarginTable } from "./components/data/MarginTables";
import {
  OtherPerpFeesTable,
  OtherSpotFeesTable,
} from "./components/data/OtherTradingFeesTables";
import {
  AssetWeightsTable,
  LTVTable,
} from "./components/data/CrossCollateralTables";

export function useMDXComponents(components?: Record<string, unknown>) {
  return useDocsMDXComponents({
    AdjustedPerpMarketFeesTable,
    AdjustedSpotMarketFeesTable,
    FeeTiersTable,
    PerpFeeStructureTable,
    SpotFeeStructureTable,
    PerpMarginTable,
    HighLeverageTable,
    OtherPerpFeesTable,
    OtherSpotFeesTable,
    AssetWeightsTable,
    LTVTable,
    ...components,
  });
}
