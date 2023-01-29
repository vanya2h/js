import { BigNumberish, BytesLike } from "ethers";

declare module 'abitype' {
  export interface Config {
    BigIntType: BigNumberish
    AddressType: string
    BytesType: BytesLike
  }
}