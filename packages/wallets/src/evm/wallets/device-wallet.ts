import { AsyncStorage, createAsyncLocalStorage } from "../../core";
import { TWConnector } from "../interfaces/tw-connector";
import { AbstractClientWallet, WalletOptions } from "./base";
import { Chain, defaultChains, Ethereum } from "@thirdweb-dev/chains";
import { Wallet, utils } from "ethers";

export type DeviceWalletOptions = {
  chain?: Chain;
  storageType?: "asyncStore" | "credentialStore";
  storage?: AsyncStorage;
};

export type WalletData = {
  address: string;
  strategy: "mnemonic" | "privateKey" | "encryptedJson";
  data: string;
  isEncrypted: boolean;
};

export type DeviceWalletConnectionArgs = {};

const STORAGE_KEY_WALLET_DATA = "deviceWalletData";

export class DeviceWallet extends AbstractClientWallet<
  DeviceWalletOptions,
  DeviceWalletConnectionArgs
> {
  connector?: TWConnector;
  options: WalletOptions<DeviceWalletOptions>;
  #ethersWallet?: Wallet;
  #storage: AsyncStorage;

  static id = "deviceWallet";

  static meta = {
    name: "Device Wallet",
    iconURL:
      "ipfs://QmcNddbYBuQKiBFnPcxYegjrX6S6z9K1vBNzbBBUJMn2ox/device-wallet.svg",
  };

  public get walletName() {
    return "Device Wallet" as const;
  }

  constructor(options?: WalletOptions<DeviceWalletOptions>) {
    super(DeviceWallet.id, options);
    this.options = options || {};
    this.#storage = options?.storage || createAsyncLocalStorage("deviceWallet");
  }

  protected async getConnector(): Promise<TWConnector> {
    if (!this.connector) {
      const { DeviceWalletConnector } = await import(
        "../connectors/device-wallet"
      );

      if (!this.#ethersWallet) {
        throw new Error("wallet is not initialized");
      }

      this.connector = new DeviceWalletConnector({
        chain: this.options.chain || Ethereum,
        ethersWallet: this.#ethersWallet,
        chains: this.options.chains || defaultChains,
      });
    }
    return this.connector;
  }

  /**
   * creates a new random wallet
   * @returns the address of the newly created wallet
   */
  async generate() {
    if (this.#ethersWallet) {
      throw new Error("wallet is already initialized");
    }
    this.#ethersWallet = Wallet.createRandom();
    return this.#ethersWallet.address;
  }

  /**
   * create device wallet from an "encryptedJson", "privateKey" or "mnemonic"
   * @returns
   */
  async import(options: ImportOptions): Promise<string> {
    if (this.#ethersWallet) {
      throw new Error("wallet is already initialized");
    }

    if ("encryptedJson" in options) {
      this.#ethersWallet = await Wallet.fromEncryptedJson(
        options.encryptedJson,
        options.password,
      );
      return this.#ethersWallet.address;
    }

    if ("privateKey" in options) {
      if (!options.encryption && !isValidPrivateKey(options.privateKey)) {
        throw new Error("invalid private key");
      }

      const privateKey = await getDecryptor(options.encryption)(
        options.privateKey,
      );

      if (
        options.encryption &&
        (privateKey === "" || !isValidPrivateKey(privateKey))
      ) {
        throw new Error("invalid password");
      }

      this.#ethersWallet = new Wallet(privateKey);
      return this.#ethersWallet.address;
    }

    if ("mnemonic" in options) {
      if (!options.encryption && !utils.isValidMnemonic(options.mnemonic)) {
        throw new Error("invalid mnemonic");
      }

      const mnemonic = await getDecryptor(options.encryption)(options.mnemonic);

      if (
        options.encryption &&
        (mnemonic === "" || !utils.isValidMnemonic(mnemonic))
      ) {
        throw new Error("invalid password");
      }

      this.#ethersWallet = Wallet.fromMnemonic(mnemonic);
      return this.#ethersWallet.address;
    }

    throw new Error("invalid import strategy");
  }

  /**
   * initialize the wallet from saved data on storage
   * @param password - password used for encrypting the wallet
   */
  async load(options: LoadOptions): Promise<string> {
    if (this.#ethersWallet) {
      throw new Error("wallet is already initialized");
    }

    const walletData = await this.getSavedData(options.storage);

    if (!walletData) {
      throw new Error("No Saved wallet found in storage");
    }

    // strategy mismatch
    if (walletData.strategy !== options.strategy) {
      throw new Error(
        `Saved wallet data is not ${options.strategy}, it is ${walletData.strategy}`,
      );
    }

    if (options.strategy === "encryptedJson") {
      return this.import({
        encryptedJson: walletData.data,
        password: options.password,
      });
    }

    // encryption mismatch
    if (walletData.isEncrypted && !options.encryption) {
      throw new Error(
        "Saved wallet data is encrypted, but no password is provided",
      );
    }

    if (!walletData.isEncrypted && options.encryption) {
      throw new Error(
        "Saved wallet data is not encrypted, but encryption config is provided",
      );
    }

    if (options.strategy === "privateKey") {
      return this.import({
        privateKey: walletData.data,
        encryption: options.encryption,
      });
    }

    if (options.strategy === "mnemonic") {
      return this.import({
        mnemonic: walletData.data,
        encryption: options.encryption,
      });
    }

    throw new Error("invalid load strategy");
  }

  /**
   * Save the wallet data to storage
   */
  async save(options: SaveOptions): Promise<void> {
    const wallet = this.#ethersWallet;
    if (!wallet) {
      throw new Error("Wallet is not initialized");
    }

    if (options.strategy === "encryptedJson") {
      const encryptedData = await wallet.encrypt(options.password, {
        scrypt: {
          N: 1 << 32,
        },
      });

      await this.#saveData(
        {
          address: wallet.address,
          data: encryptedData,
          strategy: "encryptedJson",
          isEncrypted: true,
        },
        options.storage,
      );
    }

    if (options.strategy === "privateKey") {
      const privateKey = await getEncryptor(options.encryption)(
        wallet.privateKey,
      );

      await this.#saveData(
        {
          address: wallet.address,
          data: privateKey,
          strategy: "privateKey",
          isEncrypted: !!options.encryption,
        },
        options.storage,
      );
    }

    if (options.strategy === "mnemonic") {
      const mnemonic = await getEncryptor(options.encryption)(
        wallet.mnemonic.phrase,
      );
      await this.#saveData(
        {
          address: wallet.address,
          data: mnemonic,
          strategy: "mnemonic",
          isEncrypted: !!options.encryption,
        },
        options.storage,
      );
    }
  }

  /**
   * @returns true if wallet data is saved in storage
   */
  async isSaved() {
    const data = await this.getSavedData();
    return !!data;
  }

  /**
   * deletes the saved wallet data from storage
   */
  async deleteSaved() {
    await this.#storage.removeItem(STORAGE_KEY_WALLET_DATA);
  }

  /**
   * encrypts the wallet with given password and returns the encrypted wallet
   * @param password - password for encrypting the wallet data
   */
  async export(options: ExportOptions): Promise<string> {
    const wallet = this.#ethersWallet;
    if (!wallet) {
      throw new Error("Wallet is not initialized");
    }

    if (options.strategy === "encryptedJson") {
      return wallet.encrypt(options.password, {
        scrypt: {
          N: 1 << 32,
        },
      });
    }

    if (options.strategy === "privateKey") {
      return getEncryptor(options.encryption)(wallet.privateKey);
    }

    if (options.strategy === "mnemonic") {
      if (!wallet.mnemonic) {
        throw new Error(
          "mnemonic can not be computed if wallet is created from a private key",
        );
      }

      return getEncryptor(options.encryption)(wallet.mnemonic.phrase);
    }

    throw new Error("Invalid export strategy");
  }

  /**
   * Get the saved wallet data from storage
   */
  async getSavedData(storage?: AsyncStorage): Promise<WalletData | null> {
    const _storage = storage || this.#storage;

    const savedDataStr = await _storage.getItem(STORAGE_KEY_WALLET_DATA);
    if (!savedDataStr) {
      return null;
    }

    try {
      const savedData = JSON.parse(savedDataStr);
      if (!savedData) {
        return null;
      }

      return savedData as WalletData;
    } catch (e) {
      return null;
    }
  }

  /**
   * store the wallet data to storage
   */
  async #saveData(data: WalletData, storage?: AsyncStorage) {
    const _storage = storage || this.#storage;
    await _storage.setItem(STORAGE_KEY_WALLET_DATA, JSON.stringify(data));
  }
}

type DecryptOptions =
  | {
      decrypt?: (message: string, password: string) => Promise<string>;
      password: string;
    }
  | false;

type EncryptOptions =
  | {
      encrypt?: (message: string, password: string) => Promise<string>;
      password: string;
    }
  | false;

type ImportOptions =
  | {
      privateKey: string;
      encryption: DecryptOptions;
    }
  | {
      mnemonic: string;
      encryption: DecryptOptions;
    }
  | {
      encryptedJson: string;
      password: string;
    };

type LoadOptions =
  | {
      strategy: "encryptedJson";
      password: string;
      storage?: AsyncStorage;
    }
  | {
      strategy: "privateKey";
      storage?: AsyncStorage;
      encryption: DecryptOptions;
    }
  | {
      strategy: "mnemonic";
      storage?: AsyncStorage;
      encryption: DecryptOptions;
    };

type SaveOptions =
  | { strategy: "encryptedJson"; password: string; storage?: AsyncStorage }
  | {
      strategy: "privateKey";
      encryption: EncryptOptions;
      storage?: AsyncStorage;
    }
  | {
      strategy: "mnemonic";
      encryption: EncryptOptions;
      storage?: AsyncStorage;
    };

type ExportOptions =
  | { strategy: "encryptedJson"; password: string }
  | {
      strategy: "privateKey";
      encryption: EncryptOptions;
    }
  | {
      strategy: "mnemonic";
      encryption: EncryptOptions;
    };

async function defaultEncrypt(message: string, password: string) {
  const cryptoJS = (await import("crypto-js")).default;
  return cryptoJS.AES.encrypt(message, password).toString();
}

async function defaultDecrypt(message: string, password: string) {
  const cryptoJS = (await import("crypto-js")).default;
  return cryptoJS.AES.decrypt(message, password).toString(cryptoJS.enc.Utf8);
}

/**
 * if encryption object is provided
 *  - return the encryption.decrypt function if given, else return the default decrypt function
 * if encryption object is not provided
 * - return a noop function
 * @returns
 */
function getDecryptor(encryption: DecryptOptions | undefined) {
  const noop = async (msg: string) => msg;
  return encryption
    ? (msg: string) =>
        (encryption.decrypt || defaultDecrypt)(msg, encryption.password)
    : noop;
}

/**
 * if encryption object is provided
 *  - return the encryption.encrypt function if given, else return the default encrypt function
 * if encryption object is not provided
 * - return a noop function
 * @returns
 */
function getEncryptor(encryption: EncryptOptions | undefined) {
  const noop = async (msg: string) => msg;
  return encryption
    ? (msg: string) =>
        (encryption.encrypt || defaultEncrypt)(msg, encryption.password)
    : noop;
}

function isValidPrivateKey(value: string) {
  return value.match(/^(0x)?[0-9a-f]{64}$/i);
}
