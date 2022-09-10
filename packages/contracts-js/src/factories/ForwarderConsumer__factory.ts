/* Autogenerated file. Do not edit manually. */

/* tslint:disable */

/* eslint-disable */
import type {
  ForwarderConsumer,
  ForwarderConsumerInterface,
} from "../ForwarderConsumer";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "trustedForwarder",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "caller",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "forwarder",
        type: "address",
      },
    ],
    name: "isTrustedForwarder",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "setCaller",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60a060405234801561001057600080fd5b5060405161024338038061024383398101604081905261002f91610040565b6001600160a01b0316608052610070565b60006020828403121561005257600080fd5b81516001600160a01b038116811461006957600080fd5b9392505050565b6080516101b2610091600039600081816060015261010b01526101b26000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c8063013c5f3914610046578063572b6c0514610050578063fc9c8d39146100a5575b600080fd5b61004e6100d0565b005b61009061005e36600461014c565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0390811691161490565b60405190151581526020015b60405180910390f35b6000546100b8906001600160a01b031681565b6040516001600160a01b03909116815260200161009c565b6100d8610107565b6000805473ffffffffffffffffffffffffffffffffffffffff19166001600160a01b0392909216919091179055565b60007f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316331415610147575060131936013560601c90565b503390565b60006020828403121561015e57600080fd5b81356001600160a01b038116811461017557600080fd5b939250505056fea26469706673582212203033bcb03d6adbf03a6c43b3ca4d4fb9215d10897a78f3dd600cb3516d0f953464736f6c634300080c0033";

type ForwarderConsumerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: ForwarderConsumerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class ForwarderConsumer__factory extends ContractFactory {
  constructor(...args: ForwarderConsumerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    trustedForwarder: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ForwarderConsumer> {
    return super.deploy(
      trustedForwarder,
      overrides || {}
    ) as Promise<ForwarderConsumer>;
  }
  override getDeployTransaction(
    trustedForwarder: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(trustedForwarder, overrides || {});
  }
  override attach(address: string): ForwarderConsumer {
    return super.attach(address) as ForwarderConsumer;
  }
  override connect(signer: Signer): ForwarderConsumer__factory {
    return super.connect(signer) as ForwarderConsumer__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ForwarderConsumerInterface {
    return new utils.Interface(_abi) as ForwarderConsumerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ForwarderConsumer {
    return new Contract(address, _abi, signerOrProvider) as ForwarderConsumer;
  }
}