export interface Networks {
  [key: number]: string;
}
export const walletConnectSupportedNetworks: Networks = {
  // Add your network rpc URL here
  1: "https://ethereumnode.defiterm.io",
  3: "https://ethereumnode.defiterm-dev.net",
};

// Network chain ids
export const supportedMetamaskNetworks = [1, 3, 4, 5, 42];

export const ALBT_TOKEN_ADDRESS = "0xc6869a93ef55e1d8ec8fdcda89c9d93616cf0a72";
export const US_ELECTION_ADDRESS = "0x67140de6eF31614A89D9353b27cd23CE62E068bb";

export const RINKEBY_ETHERSCAN_URL = "https://rinkeby.etherscan.io/";
