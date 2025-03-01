import { useThirdwebWallet } from "@thirdweb-dev/react-core";

export function useSupportedWallet(id: string) {
  const context = useThirdwebWallet();
  const wallet = context?.wallets.find((_wallet) => _wallet.id === id);
  if (!wallet) {
    throw new Error(`Wallet with id "${id}" is not supported`);
  }
  return wallet;
}
