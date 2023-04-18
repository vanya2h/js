import { CustomChain } from "../types/any-evm/chains";

export const ERROR_SUBSTRINGS = [
  "eip-155",
  "protected",
  "invalid chain id for signer",
  "chain id none",
  "chain_id mismatch",
  "recovered sender mismatch",
  "transaction hash mismatch",
  "chainid no support",
];

export const ERROR_SUBSTRINGS_COMPOSITE = [
  ["account", "not found"],
  ["wrong", "chainid"],
];

export const CUSTOM_GAS_FOR_CHAIN: Record<number, CustomChain> = {
  // eslint-disable-next-line no-useless-computed-key
  [5001]: {
    name: "Mantle Testnet",
    gasPrice: 1,
  },
  // eslint-disable-next-line no-useless-computed-key
  [71402]: {
    name: "Godwoken Mainnet",
    gasPrice: 40_000 * 10 ** 9,
  },
};

export function matchError(error: string): boolean {
  const errorIndex = ERROR_SUBSTRINGS.findIndex((substring) =>
    error.includes(substring),
  );

  const compositeErrorIndex = ERROR_SUBSTRINGS_COMPOSITE.findIndex((arr) => {
    let foundError = true;
    arr.forEach((substring) => {
      foundError &&= error.includes(substring);
    });

    return foundError;
  });

  return errorIndex !== -1 || compositeErrorIndex !== -1;
}
