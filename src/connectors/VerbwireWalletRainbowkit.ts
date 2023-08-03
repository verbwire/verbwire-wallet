import { Chain, Wallet } from '@rainbow-me/rainbowkit';

import { VerbwireWalletConnector } from "./VerbwireWalletConnector";

export interface WalletOptions {
    chains: Chain[];
    applicationId: string;
    network: any;
}

export const VerbwireWalletRainbowkit = ({ chains, applicationId, network }: WalletOptions): Wallet => ({
    id: 'VerbwireWallet',
    name: 'Verbwire',
    iconUrl: 'https://static.verbwire.com/images/VerbwireIcon.svg',
    iconBackground: '#fff',
    downloadUrls: {
        browserExtension: '',
    },
    createConnector: () => {

        const connector = new VerbwireWalletConnector({
            chains,
            options: {
                name: 'VerbwireWallet',
                network: network,
                applicationId: applicationId,
            },
        });

        return {
            connector: connector as any,
        };
    },
});