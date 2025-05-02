import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import driftIDL from "../types/idl/drift.json";
import {
  DelistedMarketSetting,
  DRIFT_PROGRAM_ID,
  WebSocketDriftClientAccountSubscriber,
} from "@drift-labs/sdk";

export const getSpotMarketAccountSusbcriber = async () => {
  return new WebSocketDriftClientAccountSubscriber(
    getDriftProgram(),
    [],
    [],
    [],
    true,
    DelistedMarketSetting.Unsubscribe,
    undefined,
    "confirmed"
  );
};

const getDriftProgram = () => {
  const connection = new Connection(process.env.NEXT_PUBLIC_RPC_URL!);
  const provider = new AnchorProvider(
    connection,
    // @ts-ignore
    null, // we won't sign any tx so this should be fine
    {
      commitment: "confirmed",
    }
  );
  return new Program(
    driftIDL as Idl,
    new PublicKey(DRIFT_PROGRAM_ID),
    provider
  );
};
