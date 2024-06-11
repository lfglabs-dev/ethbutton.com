import { OutsideCall, OutsideExecution } from "@/constants/types";
import { Call, hash, shortString } from "starknet";

const types = {
  StarkNetDomain: [
    { name: "name", type: "felt" },
    { name: "version", type: "felt" },
    { name: "chainId", type: "felt" },
  ],
  OutsideExecution: [
    { name: "caller", type: "felt" },
    { name: "nonce", type: "felt" },
    { name: "execute_after", type: "felt" },
    { name: "execute_before", type: "felt" },
    { name: "calls_len", type: "felt" },
    { name: "calls", type: "OutsideCall*" },
  ],
  OutsideCall: [
    { name: "to", type: "felt" },
    { name: "selector", type: "felt" },
    { name: "calldata_len", type: "felt" },
    { name: "calldata", type: "felt*" },
  ],
};

export function getDomain(chainId: string) {
  return {
    name: "Account.execute_from_outside",
    version: "1",
    chainId: chainId,
  };
}

export function getOutsideCall(call: Call): OutsideCall {
  return {
    to: call.contractAddress,
    selector: hash.getSelectorFromName(call.entrypoint),
    calldata: call.calldata ?? [],
  };
}

export function getTypedData(outsideExecution: OutsideExecution) {
  const chainId =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true"
      ? shortString.encodeShortString("SN_SEPOLIA")
      : shortString.encodeShortString("SN_MAIN");
  return {
    types: types,
    primaryType: "OutsideExecution",
    domain: getDomain(chainId),
    message: {
      ...outsideExecution,
      calls_len: outsideExecution.calls.length,
      calls: outsideExecution.calls.map((call) => {
        return {
          ...call,
          calldata_len: call.calldata.length,
          calldata: call.calldata,
        };
      }),
    },
  };
}
