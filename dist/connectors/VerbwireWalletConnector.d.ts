import { Connector, ConnectorData } from "./base/connectors";
import EventEmitter from "eventemitter3";
export declare class VerbwireWalletConnector extends Connector {
    #private;
    id: string;
    name: string;
    ready: boolean;
    private provider;
    events: EventEmitter<string | symbol, any>;
    applicationId: string;
    network: any;
    onLogin: Function;
    constructor({ chains, options }: {
        chains: any;
        options: any;
    });
    saveProviderToLocalStorage(): Promise<void>;
    saveAccountToLocalStorage(): Promise<void>;
    updateChainIdInLocalStorage(chainId: any): Promise<void>;
    deleteLocalStorage(): Promise<void>;
    getDataFromLocalStorage(): Promise<any>;
    getAccount(): Promise<any>;
    getStatus(): Promise<any>;
    isConnecting(): Promise<void>;
    isConnected(): Promise<any>;
    getProvider(): Promise<any>;
    onDisconnect(): Promise<void>;
    connect(config?: {
        chainId?: number | undefined;
    }): Promise<Required<ConnectorData>>;
    disconnect(): Promise<void>;
    signMessage(message: any): Promise<unknown>;
    onAccountsChanged: (accounts: any) => void;
    getSigner(): Promise<any>;
    changeSigner(signer: any): Promise<void>;
    networkNameToChainId(networkName: any): Promise<number>;
    switchNetwork(networkName: any): Promise<void>;
    switchChain(chainId: any): Promise<import("./base/chain").Chain | {
        id: any;
        name: string;
        network: string;
        nativeCurrency: {
            name: string;
            decimals: number;
            symbol: string;
        };
        rpcUrls: {
            default: {
                http: string[];
            };
            public: {
                http: string[];
            };
        };
    }>;
    switchToNetwork(chainId: any, chainName: any, nativeCurrency: any, rpcUrls: any, blockExplorerUrls: any): Promise<void>;
    onChainChanged(chain: any): Promise<void>;
    getChainId(): Promise<any>;
    signTransaction(transaction: any): Promise<any>;
    sendTransaction(transaction: any): Promise<any>;
    getTransactionCount(): Promise<any>;
    estimateGas(transaction: any): Promise<any>;
    call(transaction: any): Promise<any>;
    getGasPrice(): Promise<any>;
    getBalance(): Promise<any>;
    getWalletClient({ chainId }: {
        chainId: any;
    }): Promise<any>;
    signTypedData(typedData: any): Promise<any>;
    isAuthorized(): Promise<any>;
}
