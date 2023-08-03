import type { Chain } from '../chain';
import { default as EventEmitter } from 'eventemitter3';
import type { Address } from 'viem';
import { Storage, WalletClient } from './types';
export type ConnectorData = {
    account?: Address;
    chain?: {
        id: number;
        unsupported: boolean;
    };
};
export interface ConnectorEvents {
    change(data: ConnectorData): void;
    connect(data: ConnectorData): void;
    message({ type, data }: {
        type: string;
        data?: unknown;
    }): void;
    disconnect(): void;
    error(error: Error): void;
}
export declare abstract class Connector<Provider = any, Options = any> extends EventEmitter<ConnectorEvents> {
    /** Unique connector id */
    abstract readonly id: string;
    /** Connector name */
    abstract readonly name: string;
    /** Chains connector supports */
    readonly chains: Chain[];
    /** Options to use with connector */
    readonly options: Options;
    /** Connector storage. */
    protected storage?: Storage;
    /** Whether connector is usable */
    abstract readonly ready: boolean;
    constructor({ chains, options, }: {
        chains?: Chain[];
        options: Options;
    });
    abstract connect(config?: {
        chainId?: number;
    }): Promise<Required<ConnectorData>>;
    abstract disconnect(): Promise<void>;
    abstract getAccount(): Promise<Address>;
    abstract getChainId(): Promise<number>;
    abstract getProvider(config?: {
        chainId?: number;
    }): Promise<Provider>;
    abstract getWalletClient(config?: {
        chainId?: number;
    }): Promise<WalletClient>;
    abstract isAuthorized(): Promise<boolean>;
    switchChain?(chainId: number): Promise<Chain>;
    watchAsset?(asset: {
        address: string;
        decimals?: number;
        image?: string;
        symbol: string;
    }): Promise<boolean>;
    protected abstract onAccountsChanged(accounts: Address[]): void;
    protected abstract onChainChanged(chain: number | string): void;
    protected abstract onDisconnect(error: Error): void;
    protected getBlockExplorerUrls(chain: Chain): string[] | undefined;
    protected isChainUnsupported(chainId: number): boolean;
    setStorage(storage: Storage): void;
}
