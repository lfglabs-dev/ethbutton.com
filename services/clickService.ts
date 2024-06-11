import { OutsideExecution } from "@/constants/types";
import { getOutsideCall } from "@/utils/callData/typedData";
import { Call } from "starknet";

export const getOutsideExecution = (
  nonce: number,
  execute_before: number
): OutsideExecution => {
  return {
    caller: process.env.NEXT_PUBLIC_OPERATOR_ADDR as string,
    nonce,
    execute_after: 0,
    execute_before,
    calls: getCall().map((call) => getOutsideCall(call)),
  };
};

const getCall = (): Call[] => {
  return [
    {
      contractAddress: process.env.NEXT_PUBLIC_ETH_BUTTON_CONTRACT as string,
      entrypoint: "reset_btn_from_starknet",
      calldata: [],
    },
  ];
};
