# Verbwire Wallet Library

[![npm version](https://badge.fury.io/js/verbwire-wallet.svg)](https://badge.fury.io/js/verbwire-wallet) [![Downloads](https://img.shields.io/npm/dm/verbwire-wallet.svg)](https://www.npmjs.com/package/verbwire-wallet) [![Try on RunKit](https://badge.runkitcdn.com/verbwire-wallet.svg)](https://runkit.com/npm/verbwire-wallet)

The official Verbwire wallet client library for the [Verbwire API][1], the [Wagmi Library][12] as well as [Rainbowkit][14].

The Verbwire Wallet is a secure non-custodial web-based digital asset wallet that allows anyone with an email to easily interact with the blockchain. No downloads, seed phrases, or complicated processes.

This library provides a connector for the Verbwire Wallet that is fully compatible with both wagmi and rainbowkit. Easily integrate with existing projects.



## Table of Contents

- [Table of Contents](#table-of-contents)
- [Install](#install)
- [Getting Started](#getting-started)
- [Wagmi Instructions](#wagmi-instructions)
- [Rainbowkit Instructions](#rainbowkit-instructions)
- [Optional - Verbwire Wallet Stream](#optional-verbwire-wallet-stream)
- [License](#license)

## Install

Install via npm in the console

```console
$ npm install verbwire-wallet
```

## Getting Started

The Verbwire wallet library works with either wagmi directly or Rainbowkit.

Utilizing this library requires you to have wagmi or Rainbowkit installed and configured. Additionally you will need to create a Verbwire Wallet Application in the [Verbwire Dashboard][13].

## Wagmi instructions

After installing the Verbwire Wallet library and wagmi, import the VerbwireWalletConnector:

```js
import { VerbwireWalletConnector } from "verbwire-wallet";

import { publicProvider } from "wagmi/providers/public";
import { polygonMumbai, arbitrumGoerli, goerli, polygon } from "wagmi/chains";
```

Add the VerbwireWalletConnector to the list of wagmi connectors in your application. Be sure to configure the connector with your Verbwire Wallet Application ID obtained via the [Verbwire Dashboard][13].

```js
const { chains, publicClient } = configureChains(
  [polygonMumbai, arbitrumGoerli, mainnet, goerli, polygon],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors: [new VerbwireWalletConnector({
    chains,
    options: {
      name: 'Wallet Integration',
      network: polygonMumbai,
      applicationId: 'YOUR_VERBWIRE_WALLET_APPLICATION_ID',
    },
  }),],
});
```

Now you can utilize the Verbwire Wallet as you would any other in your project (Metamask, etc.) This library is fully compatible with all wagmi hooks.

## Rainbowkit Instructions

After installing the Verbwire Wallet library and wagmi, import the VerbwireWalletConnector:

Wrap your application in the VerbwireWalletStreamContextProvider.

```js
import { VerbwireWalletRainbowkit } from 'verbwire-wallet'
```

Add the VerbwireWalletRainbowkit connector to the list of rainbowkit connectors in your application. Be sure to configure the connector with your Verbwire Wallet Application ID obtained via the [Verbwire Dashboard][13].

```js
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
    metaMaskWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { VerbwireWalletRainbowkit } from 'verbwire-wallet'
import { goerli } from 'wagmi/chains';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    goerli,

    //...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [goerli] : []),
  ],
  [
      infuraProvider({apiKey: "YOUR_INFURA_KEY"}),
      publicProvider(),
  ]
);

const connectors = connectorsForWallets([
    {
        groupName: 'Recommended',
        wallets: [
            metaMaskWallet({ chains }),
            VerbwireWalletRainbowkit({ chains, applicationId: 'YOUR_VERBWIRE_WALLET_APPLICATION_ID', network: goerli }),
        ],
    },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiConfig config={wagmiConfig}>
            <RainbowKitProvider chains={chains}>
                <Component {...pageProps} />
            </RainbowKitProvider>
        </WagmiConfig>
    );
}
```


## Optional - Verbwire Wallet Stream

You can also install the optional [Verbwire Wallet Stream][15] library with wagmi/rainbowkit. This library allows the streaming of connection events for all compatible wagmi/rainbowkit wallets (including, but not limited to, the Verbwire Wallet). All connection and user statistics are then available on the Verbwire dashboard as well as via the Verbwire API.

## License

[MIT][9]

[1]: https://verbwire.com
[2]: https://docs.verbwire.com/
[3]: https://www.verbwire.com/dashboard/apikeys
[5]: https://docs.verbwire.com/docs/verbwire-quickstart-guide
[6]: https://docs.verbwire.com/reference/getting-started-with-your-api
[7]: https://github.com/verbwire
[8]: https://www.verbwire.com/community
[9]: https://github.com/verbwire/verbwire-js/blob/master/LICENSE
[10]: mailto:support@verbwire.com
[11]: https://docs.verbwire.com/recipes
[12]: https://wagmi.sh/
[13]: https://www.verbwire.com/dashboard/walletApplications/list
[14]: https://www.rainbowkit.com/
[15]: https://github.com/verbwire/verbwire-wallet-stream
