import { ModalFooter } from "../../base/modal/ModalFooter";
import { ModalHeaderTextClose } from "../../base/modal/ModalHeaderTextClose";
import { ChooseWalletContent } from "./ChooseWalletContent";
import { SupportedWallet } from "@thirdweb-dev/react-core";
import { ReactNode } from "react";
import { View } from "react-native";

export type ChooseWalletProps = {
  headerText?: ReactNode | string;
  subHeaderText?: ReactNode | string;
  footer?: ReactNode;
  onChooseWallet: (wallet: SupportedWallet) => void;
  onClose: () => void;
  wallets: SupportedWallet[];
};

export function ChooseWallet({
  headerText = "Choose your Wallet",
  subHeaderText,
  wallets,
  footer,
  onChooseWallet,
  onClose,
}: ChooseWalletProps) {
  return (
    <View>
      <ModalHeaderTextClose
        onClose={onClose}
        headerText={headerText}
        subHeaderText={subHeaderText}
      />
      <ChooseWalletContent wallets={wallets} onChooseWallet={onChooseWallet} />
      {footer ? footer : <ModalFooter footer={"Need help getting started?"} />}
    </View>
  );
}
