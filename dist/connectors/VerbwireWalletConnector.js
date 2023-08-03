"use strict";
// VerbwireWalletConnector.js
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerbwireWalletConnector = void 0;
const connectors_1 = require("./base/connectors");
const VerbwireWallet_1 = require("./VerbwireWallet");
const eventemitter3_1 = __importDefault(require("eventemitter3"));
class VerbwireWalletConnector extends connectors_1.Connector {
    id = 'VerbwireWallet';
    name = 'VerbwireWallet';
    ready = true;
    provider;
    #account = null;
    events = new eventemitter3_1.default();
    applicationId;
    network;
    onLogin;
    constructor({ chains, options }) {
        super({ chains, options });
        this.applicationId = options.applicationId;
        this.network = options.network;
        this.onLogin = (account) => {
            this.#account = account;
        };
        if (!this.provider) {
            this.provider = new VerbwireWallet_1.VerbwireWallet(this.applicationId, this.network, this.onLogin);
        }
    }
    async saveProviderToLocalStorage() {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }
    }
    async saveAccountToLocalStorage() {
        if (typeof window !== 'undefined') {
            let storageObject = {
                account: await this.provider.getAccount(),
                isConnected: true,
                chainId: null,
            };
            let chainId = await this.provider.getChainId();
            //console.log("Chain ID: " + chainId);
            if (chainId) {
                storageObject.chainId = chainId;
            }
            localStorage.setItem('verbwire-wallet', JSON.stringify(storageObject));
        }
    }
    async updateChainIdInLocalStorage(chainId) {
        if (typeof window !== 'undefined') {
            let item = localStorage.getItem('verbwire-wallet');
            if (item !== null) {
                let storageObject = JSON.parse(item);
                let chainId = await this.provider.getChainId();
                if (chainId) {
                    storageObject.chainId = chainId;
                }
                localStorage.setItem('verbwire-wallet', JSON.stringify(storageObject));
            }
        }
    }
    async deleteLocalStorage() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('verbwire-wallet');
        }
    }
    async getDataFromLocalStorage() {
        if (typeof window !== 'undefined') {
            let item = localStorage.getItem('verbwire-wallet');
            if (item !== null) {
                let storageObject = JSON.parse(item);
                if (storageObject) {
                    return storageObject;
                }
            }
            return null;
        }
    }
    async getAccount() {
        if (this.provider) {
            const account = await this.provider.getAccount();
            // Ensure the account address starts with '0x'
            //const address = account.address.startsWith('0x') ? account.address : `0x${account.address}`;
            const address = account.address;
            return address;
        }
        else {
            console.log("Provider does not exist...");
        }
        throw new Error('Provider not initialized');
    }
    async getStatus() {
        if (this.provider) {
            return this.provider.getStatus();
        }
        else {
            return 'disconnected';
        }
    }
    async isConnecting() {
    }
    async isConnected() {
        if (this.provider) {
            return this.provider.isConnected();
        }
        else {
            return false;
        }
    }
    async getProvider() {
        if (!this.provider) {
            throw new Error('Provider not initialized');
        }
        return this.provider;
    }
    async onDisconnect() {
    }
    async connect(config) {
        if (this.provider) {
            if (!this.provider.isConnected()) {
                const loginPromise = new Promise((resolve) => {
                    this.provider.events.once('loggedIn', resolve);
                });
                await this.provider.loadWallet();
                await loginPromise;
                // Connect Event Listeners
                this.provider.on('accountsChanged', this.onAccountsChanged);
                const account = await this.provider.getAccount();
                this.saveAccountToLocalStorage();
                const data = {
                    account: account,
                    chain: {
                        id: await this.provider.getChainId(),
                        unsupported: false,
                    },
                    provider: this.provider,
                };
                return new Promise((res) => setTimeout(() => res(data), 100));
            }
            else {
                const account = await this.provider.getAccount();
                const data = {
                    account: account,
                    chain: {
                        id: await this.provider.getChainId(),
                        unsupported: false,
                    },
                    provider: this.provider,
                };
                return new Promise((res) => setTimeout(() => res(data), 100));
            }
        }
        else {
            throw new Error('Provider not initialized');
        }
    }
    async disconnect() {
        if (this.provider) {
            await this.provider.signOut();
            await this.deleteLocalStorage();
        }
    }
    async signMessage(message) {
        if (this.provider) {
            this.provider.signMessage(message); // Send message to be signed
            this.provider.events.on('signedMessage', () => {
            });
            // Wait for the 'signedMessage' event to be emitted and return the signature
            return new Promise((resolve, reject) => {
                // Wait for the 'signedMessage' event and resolve the promise with the signature
                this.provider.events.once('signedMessage', (signature) => {
                    resolve(signature);
                });
                setTimeout(() => {
                    reject(new Error('Timeout waiting for signature'));
                }, 60000 * 5); // 5 minute timeout
            });
        }
        else {
            throw new Error('Provider not initialized');
        }
    }
    onAccountsChanged = (accounts) => {
        this.emit('change', { account: this.provider.getAccount() });
    };
    async getSigner() {
        if (this.provider) {
            return this.provider;
        }
        else {
            throw new Error('Provider not initialized');
        }
    }
    async changeSigner(signer) {
        if (this.provider) {
            this.provider;
        }
        else {
            throw new Error('Provider not initialized');
        }
    }
    async networkNameToChainId(networkName) {
        if (typeof networkName === 'number')
            return networkName;
        if (networkName !== undefined) {
            switch (networkName.toLowerCase()) {
                case 'ethereum':
                    return 1;
                case 'mainnet':
                    return 1;
                case 'ropsten':
                    return 3;
                case 'rinkeby':
                    return 4;
                case 'goerli':
                    return 5;
                case 'kovan':
                    return 42;
                default:
                    //throw new Error(`Unknown network name: ${networkName}`);
                    return 1;
            }
        }
        else {
            //throw new Error(`Unknown network name: ${networkName}`);
            return 1;
        }
    }
    async switchNetwork(networkName) {
    }
    async switchChain(chainId) {
        if (!this.provider) {
            throw new Error('Provider not set');
        }
        await this.provider.switchChain(chainId);
        await this.updateChainIdInLocalStorage(chainId);
        this.emit('change', { chain: { id: chainId, unsupported: false } });
        return (this.chains.find((x) => x.id === chainId) ?? {
            id: chainId,
            name: `Chain ${chainId}`,
            network: `${chainId}`,
            nativeCurrency: { name: 'Ether', decimals: 18, symbol: 'ETH' },
            rpcUrls: { default: { http: [''] }, public: { http: [''] } },
        });
    }
    async switchToNetwork(chainId, chainName, nativeCurrency, rpcUrls, blockExplorerUrls) {
    }
    async onChainChanged(chain) {
    }
    async getChainId() {
        if (this.provider) {
            const chainId = await this.provider.getChainId();
            return chainId;
        }
        else {
            throw new Error('Provider not initialized');
        }
    }
    // Sign a transaction
    async signTransaction(transaction) {
        return await this.provider.signTransaction(transaction);
    }
    // Send a transaction
    async sendTransaction(transaction) {
        return await this.provider.sendTransaction(transaction);
    }
    // Get the count of transactions sent by the account
    async getTransactionCount() {
        return await this.provider.getTransactionCount();
    }
    // Estimate the gas needed to send a transaction
    async estimateGas(transaction) {
        return await this.provider.estimateGas(transaction);
    }
    // Call a read-only method on a smart contract
    async call(transaction) {
        return await this.provider.call(transaction);
    }
    // Get the current gas price
    async getGasPrice() {
        return await this.provider.getGasPrice();
    }
    // Get the account's balance
    async getBalance() {
        return await this.provider.getBalance();
    }
    async getWalletClient({ chainId }) {
        return this.provider;
    }
    async signTypedData(typedData) {
        return await this.provider.signTypedData(typedData);
    }
    async isAuthorized() {
        let vwStorageObject = await this.getDataFromLocalStorage();
        if (vwStorageObject && vwStorageObject.isConnected) {
            this.provider.setStatus("connected");
            if (vwStorageObject.account) {
                this.provider.setAccount(vwStorageObject.account);
                this.provider.setAddress(vwStorageObject.account);
                this.#account = vwStorageObject.account;
            }
            if (vwStorageObject.chainId) {
                this.provider.switchChain(vwStorageObject.chainId);
            }
            return await this.provider.isAuthorized();
        }
        else {
            console.log("Not connected");
            return false;
        }
    }
}
exports.VerbwireWalletConnector = VerbwireWalletConnector;
