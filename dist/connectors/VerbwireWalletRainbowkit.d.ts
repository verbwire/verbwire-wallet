import { Chain, Wallet } from '@rainbow-me/rainbowkit';
export interface WalletOptions {
    chains: Chain[];
    applicationId: string;
    network: any;
}
export declare const VerbwireWalletRainbowkit: ({ chains, applicationId, network }: WalletOptions) => Wallet;
