"use client";

import { useEffect, useState } from "react";

type MarginRow = {
  index: number;
  name: string;
  initial: string;
  maintenance: string;
  imfFactor: number;
};

type HighLeverageRow = {
  index: number;
  name: string;
  initial: string;
  maintenance: string;
};

type MarginData = {
  perpMarginData: MarginRow[];
  highLeverageMarkets: HighLeverageRow[];
};

let cachedData: MarginData | null = null;
let cachedPromise: Promise<MarginData> | null = null;

function decodeName(name: number[]) {
  return name.map((charCode) => String.fromCharCode(charCode)).join("").trim();
}

async function fetchMarginData(): Promise<MarginData> {
  const res = await fetch(
    "https://mainnet-beta.api.drift.trade/stats/perpMarketAccounts"
  );
  const data = await res.json();

  const perpMarginData: MarginRow[] = [];
  const highLeverageMarkets: HighLeverageRow[] = [];

  data.result.forEach((market: any, index: number) => {
    if ("prediction" in market.contractType) return;

    const name = decodeName(market.name);
    const initRatio = market.marginRatioInitial / 1e4;
    const maintRatio = market.marginRatioMaintenance / 1e4;
    const imf = +(market.imfFactor / 1e6).toFixed(6);

    perpMarginData.push({
      index,
      name,
      initial: `${(initRatio * 100).toFixed(2)}% / ${(1 / initRatio).toFixed(
        0
      )}x`,
      maintenance: `${(maintRatio * 100).toFixed(2)}% / ${(
        1 / maintRatio
      ).toFixed(0)}x`,
      imfFactor: imf,
    });

    if (market.highLeverageMarginRatioInitial > 0) {
      const hlInit = market.highLeverageMarginRatioInitial / 1e4;
      const hlMaint = market.highLeverageMarginRatioMaintenance / 1e4;

      highLeverageMarkets.push({
        index,
        name,
        initial: `${(hlInit * 100).toFixed(2)}% / ${(1 / hlInit).toFixed(0)}x`,
        maintenance: `${(hlMaint * 100).toFixed(2)}% / ${(
          1 / hlMaint
        ).toFixed(0)}x`,
      });
    }
  });

  return { perpMarginData, highLeverageMarkets };
}

function useMarginData() {
  const [data, setData] = useState<MarginData | null>(cachedData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedData) return;
    if (!cachedPromise) {
      cachedPromise = fetchMarginData();
    }
    cachedPromise
      .then((result) => {
        cachedData = result;
        setData(result);
      })
      .catch((err) => setError(err));
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

export function PerpMarginTable() {
  const { data } = useMarginData();
  const headings = [
    "Index",
    "Perpetuals",
    "Initial Margin (Ratio / Leverage)",
    "Maintenance Margin (Ratio / Leverage)",
    "IMF Factor",
  ];

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
          data.perpMarginData.map((row) => (
            <tr key={row.index}>
              <td>{row.index}</td>
              <td>{row.name}</td>
              <td>{row.initial}</td>
              <td>{row.maintenance}</td>
              <td>{row.imfFactor}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}

export function HighLeverageTable() {
  const { data } = useMarginData();
  const headings = [
    "Index",
    "Perpetuals",
    "High Leverage Initial (Ratio / Leverage)",
    "High Leverage Maintenance (Ratio / Leverage)",
  ];

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
          data.highLeverageMarkets.map((row) => (
            <tr key={row.index}>
              <td>{row.index}</td>
              <td>{row.name}</td>
              <td>{row.initial}</td>
              <td>{row.maintenance}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
