/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { ITWFee, ITWFeeInterface } from "../ITWFee";
import type { Provider } from "@ethersproject/providers";
import { Contract, Signer, utils } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_proxy",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_type",
        type: "uint256",
      },
    ],
    name: "getFeeInfo",
    outputs: [
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "bps",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class ITWFee__factory {
  static readonly abi = _abi;
  static createInterface(): ITWFeeInterface {
    return new utils.Interface(_abi) as ITWFeeInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ITWFee {
    return new Contract(address, _abi, signerOrProvider) as ITWFee;
  }
}