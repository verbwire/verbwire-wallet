declare const EventEmitter: any;
export declare class VerbwireWallet extends EventEmitter {
    #private;
    network: any;
    events: any;
    chainId: number;
    constructor(applicationId: any, network: any, onLogin: any, provider?: null);
    connect(provider: any): this;
    onChainChanged(): Promise<void>;
    signTransaction(transaction: any): Promise<unknown>;
    enable(): Promise<void>;
    getBalance(): Promise<number>;
    getTransactionCount(): Promise<number>;
    call(transaction: any, blockTag: any): Promise<number>;
    getChainId(): Promise<any>;
    getChain(): Promise<number>;
    getGasPrice(): Promise<number>;
    resolveName(): Promise<number>;
    checkTransaction(): Promise<number>;
    populateTransaction(): Promise<number>;
    watchAsset(asset: any): Promise<boolean>;
    toJSON(): this;
    handleMessage(event: any): void;
    closeIframe(): void;
    openIframe(): void;
    sendMessageToIframe(action: any, data: any): void;
    resizeIframe(height: any): void;
    createOverlay(url: any): HTMLDivElement;
    showWallet(action?: string, data?: {}): Promise<void>;
    loadWallet(data?: {}): void;
    signOut(): Promise<void>;
    signMessage(data?: {
        message?: string;
    }): Promise<unknown>;
    signTypedData(data: any): Promise<unknown>;
    sendTransaction(options?: {
        to?: string;
        value?: any;
        data?: any;
        from?: string;
    }): Promise<unknown>;
    writeContract(data?: {}): Promise<unknown>;
    getAccount(): any;
    setAccount(account: any): void;
    getStatus(): any;
    setStatus(status: any): void;
    isConnecting(): boolean;
    isConnected(): boolean;
    isAuthorized(): boolean;
    getNetwork(): any;
    estimateGas(transaction: any): Promise<string>;
    send(method: any, params: any): Promise<unknown>;
    getAddress(): any;
    setAddress(address: any): void;
    switchNetwork(network: any): Promise<void>;
    switchChain(chainId: any): Promise<any>;
    getSigner(): any;
}
export {};
