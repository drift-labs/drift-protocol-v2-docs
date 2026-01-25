"use client";

import { useEffect, useMemo, useState } from "react";

type FeeTier = {
  tier: number | string;
  volume: string;
  driftStaked: string;
};

type TradingFeesData = {
  perpFeeAdjustmentData: Array<[string, string]>;
  spotFeeAdjustmentData: Array<[string, string]>;
  perpFeeStructureData: Array<Array<string | number>>;
  spotFeeStructureData: Array<Array<string | number>>;
  feeTiers: FeeTier[];
};

let cachedData: TradingFeesData | null = null;
let cachedPromise: Promise<TradingFeesData> | null = null;

function decodeName(name: number[]) {
  return name.map((charCode) => String.fromCharCode(charCode)).join("").trim();
}

async function fetchTradingFeesData(): Promise<TradingFeesData> {
  const [perpMarketsRes, spotMarketsRes, feeStructureRes] = await Promise.all([
    fetch("https://mainnet-beta.api.drift.trade/stats/perpMarketAccounts"),
    fetch("https://mainnet-beta.api.drift.trade/stats/spotMarketAccounts"),
    fetch("https://mainnet-beta.api.drift.trade/stats/feeStructure"),
  ]);

  const [perpMarkets, spotMarkets, feeStructure] = await Promise.all([
    perpMarketsRes.json(),
    spotMarketsRes.json(),
    feeStructureRes.json(),
  ]);

  const adjustedFeePerpMarkets = perpMarkets.result.filter(
    (perpMarket: { feeAdjustment: number }) => perpMarket.feeAdjustment !== 0
  );

  const perpFeeAdjustmentData = adjustedFeePerpMarkets.map(
    (perpMarket: { name: number[]; feeAdjustment: number }) => [
      decodeName(perpMarket.name),
      `${perpMarket.feeAdjustment > 0 ? "+" : ""}${perpMarket.feeAdjustment}%${
        perpMarket.feeAdjustment > 0 ? " (premium)" : " (discount)"
      }`,
    ]
  );

  const adjustedFeeSpotMarkets = spotMarkets.result.filter(
    (spotMarket: { feeAdjustment: number }) => spotMarket.feeAdjustment !== 0
  );

  const spotFeeAdjustmentData = adjustedFeeSpotMarkets.map(
    (spotMarket: { name: number[]; feeAdjustment: number }) => [
      decodeName(spotMarket.name),
      `${spotMarket.feeAdjustment > 0 ? "+" : ""}${spotMarket.feeAdjustment}%${
        spotMarket.feeAdjustment > 0 ? " (premium)" : " (discount)"
      }`,
    ]
  );

  const responseData = feeStructure.result;
  const perpFeeTiers = responseData.perpFeeStructure.feeTiers.filter(
    (feeTier: { makerRebateNumerator: number }) =>
      feeTier.makerRebateNumerator !== 0
  );
  const spotFeeTiers = responseData.spotFeeStructure.feeTiers.filter(
    (feeTier: { makerRebateNumerator: number }) =>
      feeTier.makerRebateNumerator !== 0
  );

  const feeTiers: FeeTier[] = [
    { tier: 1, volume: "0", driftStaked: "0" },
    { tier: 2, volume: "2M", driftStaked: "1K" },
    { tier: 3, volume: "10M", driftStaked: "10K" },
    { tier: 4, volume: "20M", driftStaked: "25K" },
    { tier: 5, volume: "80M", driftStaked: "100K" },
    { tier: "VIP", volume: "200M", driftStaked: "120K" },
  ];

  const perpFeeStructureData = perpFeeTiers.map(
    (
      feeTier: {
        makerRebateNumerator: number;
        makerRebateDenominator: number;
        feeNumerator: number;
        feeDenominator: number;
        refereeFeeNumerator: number;
        refereeFeeDenominator: number;
        referrerRewardNumerator: number;
        referrerRewardDenominator: number;
      },
      index: number
    ) => [
      index + 1,
      `${
        Math.round(
          -(feeTier.makerRebateNumerator / feeTier.makerRebateDenominator) *
            1e4
        )
      } bps`,
      `${
        Math.round((feeTier.feeNumerator / feeTier.feeDenominator) * 1e4)
      } bps`,
      `${
        Math.round(
          (feeTier.refereeFeeNumerator / feeTier.refereeFeeDenominator) * 100
        )
      }%`,
      `${
        Math.round(
          (feeTier.referrerRewardNumerator /
            feeTier.referrerRewardDenominator) *
            100
        )
      }%`,
      `${
        Math.round(
          (responseData.perpFeeStructure.fillerRewardStructure.rewardNumerator /
            responseData.perpFeeStructure.fillerRewardStructure
              .rewardDenominator) *
            100
        )
      }%`,
    ]
  );

  if (perpFeeStructureData.length > 0) {
    perpFeeStructureData[perpFeeStructureData.length - 1][0] = "VIP";
  }

  const spotFeeStructureData = spotFeeTiers.map(
    (
      feeTier: {
        makerRebateNumerator: number;
        makerRebateDenominator: number;
        feeNumerator: number;
        feeDenominator: number;
        refereeFeeNumerator: number;
        refereeFeeDenominator: number;
        referrerRewardNumerator: number;
        referrerRewardDenominator: number;
      },
      index: number
    ) => [
      index + 1,
      `${
        Math.round(
          -(feeTier.makerRebateNumerator / feeTier.makerRebateDenominator) *
            1e4
        )
      } bps`,
      `${
        Math.round((feeTier.feeNumerator / feeTier.feeDenominator) * 1e4)
      } bps`,
      `${
        Math.round(
          (feeTier.refereeFeeNumerator / feeTier.refereeFeeDenominator) * 100
        )
      }%`,
      `${
        Math.round(
          (feeTier.referrerRewardNumerator /
            feeTier.referrerRewardDenominator) *
            100
        )
      }%`,
      `${
        Math.round(
          (responseData.spotFeeStructure.fillerRewardStructure.rewardNumerator /
            responseData.spotFeeStructure.fillerRewardStructure
              .rewardDenominator) *
            100
        )
      }%`,
    ]
  );

  if (spotFeeStructureData.length > 0) {
    spotFeeStructureData[spotFeeStructureData.length - 1][0] = "VIP";
  }

  return {
    perpFeeAdjustmentData,
    spotFeeAdjustmentData,
    perpFeeStructureData,
    spotFeeStructureData,
    feeTiers,
  };
}

function useTradingFeesData() {
  const [data, setData] = useState<TradingFeesData | null>(cachedData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedData) return;
    if (!cachedPromise) {
      cachedPromise = fetchTradingFeesData();
    }
    cachedPromise
      .then((result) => {
        cachedData = result;
        setData(result);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  return { data, error };
}

function LoadingRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan}>Loading...</td>
    </tr>
  );
}

export function PerpFeeStructureTable() {
  const headings = [
    "Tier",
    "Maker Fee",
    "Taker Fee",
    "Referree Taker Discount",
    "Referrer Reward",
    "Filler Reward",
  ];
  const { data } = useTradingFeesData();

  return (
    <table>
      <thead>
        <tr>
          {headings.map((heading) => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!data ? (
          <LoadingRow colSpan={headings.length} />
        ) : (
          data.perpFeeStructureData.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export function SpotFeeStructureTable() {
  const headings = [
    "Tier",
    "Maker Fee",
    "Taker Fee",
    "Referree Taker Discount",
    "Referrer Reward",
    "Filler Reward",
  ];
  const { data } = useTradingFeesData();

  return (
    <table>
      <thead>
        <tr>
          {headings.map((heading) => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!data ? (
          <LoadingRow colSpan={headings.length} />
        ) : (
          data.spotFeeStructureData.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export function FeeTiersTable() {
  const headings = ["Tier", "Required 30D Volume"];
  const { data } = useTradingFeesData();

  return (
    <table>
      <thead>
        <tr>
          {headings.map((heading) => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!data ? (
          <LoadingRow colSpan={headings.length} />
        ) : (
          data.feeTiers.map((row, i) => (
            <tr key={i}>
              <td>{row.tier}</td>
              <td>{row.volume}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export function AdjustedPerpMarketFeesTable() {
  const headings = ["Market", "Fee Adjustment"];
  const { data } = useTradingFeesData();

  return (
    <table>
      <thead>
        <tr>
          {headings.map((heading) => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!data ? (
          <LoadingRow colSpan={headings.length} />
        ) : (
          data.perpFeeAdjustmentData.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export function AdjustedSpotMarketFeesTable() {
  const headings = ["Market", "Fee Adjustment"];
  const { data } = useTradingFeesData();

  return (
    <table>
      <thead>
        <tr>
          {headings.map((heading) => (
            <th key={heading}>{heading}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {!data ? (
          <LoadingRow colSpan={headings.length} />
        ) : (
          data.spotFeeAdjustmentData.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j}>{cell}</td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
