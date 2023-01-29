import { Abi } from "../../schema";
import { ContractWrapper } from "./contract-wrapper";
import { BaseContract, CallOverrides } from "ethers";

/**
 * Allows overriding transaction behavior for this contract
 * @public
 */
export class ContractInterceptor<
  TContract extends BaseContract,
  TAbi extends Abi | readonly unknown[] = Abi,
> {
  private contractWrapper;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  /**
   * The next transaction executed will add/replace any overrides passed via the passed in hook.
   * @remarks Overridden values will be applied to the next transaction executed.
   * @example
   * ```javascript
   * contract.interceptor.overrideNextTransaction(() => ({
   *   gasLimit: 3000000,
   * }));
   * ```
   * @param hook - the hook to add or replace any CallOverrides (gas limit, gas price, nonce, from, value, etc...)
   * @public
   */
  public overrideNextTransaction(hook: () => CallOverrides) {
    this.contractWrapper.withTransactionOverride(hook);
  }
}
