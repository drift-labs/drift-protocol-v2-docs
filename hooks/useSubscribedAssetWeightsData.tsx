import { decodeName, SpotMarketAccount } from "@drift-labs/sdk";
import { useEffect, useState } from "react";
import { getSpotMarketAccountSusbcriber } from "../utils/spot-markets";
type AssetWeightsData = Array<
  [string, string, string, string, string, number, boolean]
>;

export const useSubscribedAssetWeightsData = (
  initialData: AssetWeightsData
): AssetWeightsData => {
  const [data, setData] = useState<AssetWeightsData>(initialData);

  useEffect(() => {
    (async () => {
      const subscription = await getSpotMarketAccountSusbcriber();
      subscription.subscribe();
      subscription.eventEmitter.on(
        "spotMarketAccountUpdate",
        (account: SpotMarketAccount) => {
          if (!data) return;
          const assetIndex = data.findIndex(
            (weight) => weight[0] === decodeName(account.name)
          );
          if (assetIndex !== -1) {
            const newValues = [
              decodeName(account.name),
              account.initialAssetWeight / 100 + "%",
              account.maintenanceAssetWeight / 100 + "%",
              account.initialLiabilityWeight / 100 + "%",
              account.maintenanceLiabilityWeight / 100 + "%",
              account.imfFactor / 1e6,
            ];
            const valuesChanged =
              JSON.stringify(data[assetIndex].slice(0, -1)) !==
              JSON.stringify(newValues);
            if (valuesChanged) {
              data[assetIndex] = [
                ...newValues,
                true,
              ] as AssetWeightsData[number];
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
  }, []);
  return data ?? [];
};

export default useSubscribedAssetWeightsData;
