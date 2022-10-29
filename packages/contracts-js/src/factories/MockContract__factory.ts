/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type { MockContract, MockContractInterface } from "../MockContract";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BytesLike,
  BigNumberish,
  Overrides,
} from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_name",
        type: "bytes32",
      },
      {
        internalType: "uint8",
        name: "_version",
        type: "uint8",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "contractType",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "contractVersion",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5060405161012838038061012883398101604081905261002f9161004d565b6000919091556001805460ff191660ff909216919091179055610083565b6000806040838503121561006057600080fd5b82519150602083015160ff8116811461007857600080fd5b809150509250929050565b6097806100916000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c8063a0a8e460146037578063cb2ef6f7146051575b600080fd5b60015460405160ff90911681526020015b60405180910390f35b600054604051908152602001604856fea2646970667358221220d7e9142cc8bb5589c84cab72aec278640ef5ed2cccfab7f663dc7e355de40a6964736f6c634300080c0033";

type MockContractConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MockContractConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MockContract__factory extends ContractFactory {
  constructor(...args: MockContractConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _name: BytesLike,
    _version: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<MockContract> {
    return super.deploy(
      _name,
      _version,
      overrides || {}
    ) as Promise<MockContract>;
  }
  override getDeployTransaction(
    _name: BytesLike,
    _version: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(_name, _version, overrides || {});
  }
  override attach(address: string): MockContract {
    return super.attach(address) as MockContract;
  }
  override connect(signer: Signer): MockContract__factory {
    return super.connect(signer) as MockContract__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MockContractInterface {
    return new utils.Interface(_abi) as MockContractInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): MockContract {
    return new Contract(address, _abi, signerOrProvider) as MockContract;
  }
}