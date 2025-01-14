import type { Chain } from "../src/types";
export default {
  "name": "PulseChain Testnet v2b",
  "shortName": "t2bpls",
  "chain": "t2bPLS",
  "chainId": 941,
  "networkId": 941,
  "infoURL": "https://pulsechain.com/",
  "rpc": [
    "https://pulsechain-testnet-v2b.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.v2b.testnet.pulsechain.com/",
    "wss://rpc.v2b.testnet.pulsechain.com/"
  ],
  "faucets": [
    "https://faucet.v2b.testnet.pulsechain.com/"
  ],
  "nativeCurrency": {
    "name": "Test Pulse",
    "symbol": "tPLS",
    "decimals": 18
  },
  "testnet": true,
  "slug": "pulsechain-testnet-v2b"
} as const satisfies Chain;