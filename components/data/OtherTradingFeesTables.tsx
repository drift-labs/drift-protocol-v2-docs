"use client";

import { useEffect, useState } from "react";

type OtherFeesData = {
  otherPerpFeesData: Array<[string, number, number]>;
  otherSpotFeesData: Array<[string, number, number, number]>;
};

let cachedData: OtherFeesData | null = null;
let cachedPromise: Promise<OtherFeesData> | null = null;

function decodeName(name: number[]) {
  return name.map((charCode) => String.fromCharCode(charCode)).join("").trim();
}

async function fetchOtherFeesData(): Promise<OtherFeesData> {
  const [perpRes, spotRes] = await Promise.all([
    fetch("https://mainnet-beta.api.drift.trade/stats/perpMarketAccounts"),
    fetch("https://mainnet-beta.api.drift.trade/stats/spotMarketAccounts"),
  ]);

  const [perpData, spotData] = await Promise.all([
    perpRes.json(),
    spotRes.json(),
  ]);

  const otherPerpFeesData = perpData.result
    .filter((market: any) => !("prediction" in market.contractType))
    .map((market: any) => {
      const name = decodeName(market.name);
      const liquidatorFee = market.liquidatorFee / 1e6;
      const insuranceFee = market.ifLiquidationFee / 1e6;

      return [name, liquidatorFee, insuranceFee] as [string, number, number];
    });

  const otherSpotFeesData = spotData.result.map((market: any) => {
    const name = decodeName(market.name);
    const liquidatorFee = market.liquidatorFee / 1e6;
    const insuranceFee = market.ifLiquidationFee / 1e6;
    const borrowRateFee = market.insuranceFund.totalFactor / 1e6;

    return [name, liquidatorFee, insuranceFee, borrowRateFee] as [
      string,
      number,
      number,
      number
    ];
  });

  return { otherPerpFeesData, otherSpotFeesData };
}

function useOtherFeesData() {
  const [data, setData] = useState<OtherFeesData | null>(cachedData);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (cachedData) return;
    if (!cachedPromise) {
      cachedPromise = fetchOtherFeesData();
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

export function OtherPerpFeesTable() {
  const headings = ["Market", "Liquidator Fee", "Insurance Fee"];
  const { data } = useOtherFeesData();

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
          data.otherPerpFeesData.map((row, i) => (
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

export function OtherSpotFeesTable() {
  const headings = [
    "Market",
    "Liquidator Fee",
    "Insurance Fee",
    "Borrow Rate Fee",
  ];
  const { data } = useOtherFeesData();

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
          data.otherSpotFeesData.map((row, i) => (
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
