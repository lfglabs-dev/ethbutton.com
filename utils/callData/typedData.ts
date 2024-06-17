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

const typesV2 = {
  StarknetDomain: [
    { name: "name", type: "shortstring" },
    { name: "version", type: "shortstring" },
    { name: "chainId", type: "shortstring" },
    { name: "revision", type: "shortstring" },
  ],
  OutsideExecution: [
    { name: "Caller", type: "ContractAddress" },
    { name: "Nonce", type: "felt" },
    { name: "Execute After", type: "u128" },
    { name: "Execute Before", type: "u128" },
    { name: "Calls", type: "Call*" },
  ],
  Call: [
    { name: "To", type: "ContractAddress" },
    { name: "Selector", type: "selector" },
    { name: "Calldata", type: "felt*" },
  ],
};

export function getDomainV2(chainId: string) {
  return {
    name: "Account.execute_from_outside",
    version: "2",
    chainId: chainId,
    revision: "1",
  };
}

export function getTypedDataV2(outsideExecution: OutsideExecution) {
  const chainId =
    process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? "SN_SEPOLIA" : "SN_MAIN";
  return {
    types: typesV2,
    primaryType: "OutsideExecution",
    domain: getDomainV2(chainId),
    message: {
      Caller: outsideExecution.caller,
      Nonce: outsideExecution.nonce,
      "Execute After": outsideExecution.execute_after,
      "Execute Before": outsideExecution.execute_before,
      Calls: outsideExecution.calls.map((call) => {
        return {
          To: call.to,
          Selector: call.selector,
          Calldata: call.calldata,
        };
      }),
    },
  };
}
