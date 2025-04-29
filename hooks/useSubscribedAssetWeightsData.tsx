import {
  calculateAssetWeight,
  calculateLiabilityWeight,
  decodeName,
  DriftClientAccountSubscriber,
  SpotMarketAccount,
  StrictOraclePrice,
  ZERO,
} from "@drift-labs/sdk";
import { useEffect, useRef, useState } from "react";
import { getSpotMarketAccountSusbcriber } from "../utils/spot-markets";

type AssetWeightsData = [string, string, string, string, string, number];
type AssetWeightTableData = [
  string,
  string,
  string,
  string,
  string,
  number,
  boolean
];
type AssetWeightTableDataArray = Array<AssetWeightTableData>;

export const useSubscribedAssetWeightsData = (
  initialData: AssetWeightTableDataArray
): AssetWeightTableDataArray => {
  const [data, setData] = useState<AssetWeightTableDataArray>(initialData);
  const subscriptionRef = useRef<DriftClientAccountSubscriber | null>(null);

  // initial fetch
  useEffect(() => {
    (async () => {
      const subscription = await getSpotMarketAccountSusbcriber();
      await subscription.subscribe();
      subscriptionRef.current = subscription;
      const accounts = subscription.getSpotMarketAccountsAndSlots();
      if (!accounts) return;
      const newData = accounts
        .filter((account) => account.data.poolId === 0)
        .sort((a, b) => a.data.marketIndex - b.data.marketIndex)
        .map((account) =>
          getWeightDataFromAccount(account.data, subscriptionRef.current!)
        );
      setData(newData.map((data) => [...data, false]));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!subscriptionRef.current) return;
      subscriptionRef.current.eventEmitter.on(
        "spotMarketAccountUpdate",
        (account: SpotMarketAccount) => {
          if (!data) return;
          const marketName = decodeName(account.name);
          const assetIndex = data.findIndex(
            (weight) => weight[0] === marketName
          );
          if (assetIndex !== -1) {
            const newValues = getWeightDataFromAccount(
              account,
              subscriptionRef.current
            );
            const valuesChanged =
              JSON.stringify(data[assetIndex].slice(0, -1)) !==
              JSON.stringify(newValues);
            if (valuesChanged) {
              data[assetIndex] = [...newValues, true] as AssetWeightTableData;
              setData([...data]);
              setTimeout(() => {
                data[assetIndex][6] = false;
                setData([...data]);
              }, 1000);
            }
          }
        }
      );
    })();
  }, [!!subscriptionRef.current]);
  return data ?? [];
};

const getWeightDataFromAccount = (
  account: SpotMarketAccount,
  subscription: DriftClientAccountSubscriber
): AssetWeightsData => {
  const marketName = decodeName(account.name);
  const oraclePriceData = subscription.getOraclePriceDataAndSlotForSpotMarket(
    account.marketIndex
  ).data;

  const strictOraclePrice = new StrictOraclePrice(
    oraclePriceData?.price ?? ZERO
  );

  const scaledInitialAssetWeight = calculateAssetWeight(
    ZERO,
    strictOraclePrice.current,
    account,
    "Initial"
  );

  const scaledMaintenanceAssetWeight = calculateAssetWeight(
    ZERO,
    strictOraclePrice.current,
    account,
    "Maintenance"
  );

  const scaledInitialLiabilityWeight = calculateLiabilityWeight(
    ZERO,
    account,
    "Initial"
  );

  const scaledMaintenanceLiabilityWeight = calculateLiabilityWeight(
    ZERO,
    account,
    "Maintenance"
  );

  return [
    marketName,
    scaledInitialAssetWeight
      ? Math.floor(scaledInitialAssetWeight / 100) + "%"
      : (account.initialAssetWeight / 100).toFixed(0) + "%",
    scaledMaintenanceAssetWeight
      ? Math.floor(scaledMaintenanceAssetWeight / 100) + "%"
      : (account.maintenanceAssetWeight / 100).toFixed(0) + "%",
    scaledInitialLiabilityWeight
      ? Math.floor(scaledInitialLiabilityWeight / 100) + "%"
      : (account.initialLiabilityWeight / 100).toFixed(0) + "%",
    scaledMaintenanceLiabilityWeight
      ? Math.floor(scaledMaintenanceLiabilityWeight / 100) + "%"
      : (account.maintenanceLiabilityWeight / 100).toFixed(0) + "%",
    account.imfFactor / 1e6,
  ];
};

export default useSubscribedAssetWeightsData;
