import { RawArgs, num } from "starknet";

export enum NetworkType {
  starknet = "Starknet",
  evm = "Evm",
}

export type IconProps = {
  color: string;
  width: string;
  secondColor?: string;
  className?: string;
};

export type RemainingClicks = {
  whitelisted: boolean;
  eligibilityAmt?: number;
  domainClicks?: number;
  domainStatus?: Record<string, boolean>;
  evmBlacklisted?: boolean;
};

export type FullId = {
  id: string;
  domain?: string;
  domain_expiry?: number;
};

export interface OutsideExecution {
  caller: string;
  nonce: num.BigNumberish;
  execute_after: num.BigNumberish;
  execute_before: num.BigNumberish;
  calls: OutsideCall[];
}

export interface OutsideCall {
  to: string;
  selector: num.BigNumberish;
  calldata: RawArgs;
}

export type EthToken = {
  eth_addr: string;
  token: string;
};

export interface GetDeploymentDataResult {
  address: string; // Represented as 'felt252'
  class_hash: string; // Represented as 'felt252'
  salt: string; // Represented as 'felt252'
  calldata: string[]; // Array of 'felt252', length := calldata_len
}
