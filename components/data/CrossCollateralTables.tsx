"use client";

import { useMemo } from "react";
import useSubscribedCrossCollateralDepositsData from "../../hooks/useSubscribedCrossCollatteralDepositsData";
import modStyles from "../../content/protocol/getting-started/getting-started.module.css";

export function AssetWeightsTable({ poolId }: { poolId: number }) {
  const headings = [
    "Asset",
    "Initial Asset Weight",
    "Maintenance Asset Weight",
    "Initial Liability Weight",
    "Maintenance Liability Weight",
    "IMF Factor",
  ];

  const { weightData } = useSubscribedCrossCollateralDepositsData();

  const poolWeightData = useMemo(
    () => weightData?.filter((row) => row.poolId === poolId),
    [weightData, poolId]
  );

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
        {poolWeightData && poolWeightData.length > 0 ? (
          poolWeightData.map((row, i) => (
            <tr
              key={i}
              className={row.flashUpdate ? modStyles.flashUpdate : ""}
            >
              <td>{row.asset}</td>
              <td>{row.initialAssetWeight}</td>
              <td>{row.maintenanceAssetWeight}</td>
              <td>{row.initialLiabilityWeight}</td>
              <td>{row.maintenanceLiabilityWeight}</td>
              <td>{row.imfFactor}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headings.length}>
              <div className={modStyles.loading}>Loading...</div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export function LTVTable({ poolId }: { poolId: number }) {
  const headings = ["Asset", "Initial LTV", "Max LTV"];

  const { ltvData } = useSubscribedCrossCollateralDepositsData();
  const poolLTVData = useMemo(
    () => ltvData?.filter((row) => row.poolId === poolId),
    [ltvData, poolId]
  );

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
        {poolLTVData && poolLTVData.length > 0 ? (
          poolLTVData.map((row, i) => (
            <tr
              key={i}
              className={row.flashUpdate ? modStyles.flashUpdate : ""}
            >
              <td>{row.asset}</td>
              <td>{row.initialLTV}</td>
              <td>{row.maxLTV}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={headings.length}>
              <div className={modStyles.loading}>Loading...</div>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
