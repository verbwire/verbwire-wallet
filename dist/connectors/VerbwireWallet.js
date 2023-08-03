"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerbwireWallet = void 0;
const EventEmitter = require('eventemitter3');
const units_1 = require("@ethersproject/units");
class VerbwireWallet extends EventEmitter {
    network;
    #options = {};
    events = new EventEmitter();
    chainId = 5;
    constructor(applicationId, network, onLogin, provider = null) {
        super();
        this.applicationId = applicationId;
        this.network = network;
        this.onLogin = onLogin;
        this.loggedIn = false;
        this.pendingAction = null;
        this.pendingData = null;
        this.addedEventListener = false;
        this.connectionStatus = 'disconnected';
        // Add a state to store the transaction data
        this.transactionData = null;
        this.chain = network.id;
        this.#options.chainId = network.id;
        // Add message listener
        this.handleMessage = this.handleMessage.bind(this);
        // Check if window is defined (we are in browser)
        if (typeof window !== 'undefined') {
            window.addEventListener('message', this.handleMessage);
            this.addedEventListener = true;
        }
    }
    // Add a connect method that returns a new instance of VerbwireWallet with the new provider
    connect(provider) {
        return this;
    }
    async onChainChanged() {
    }
    // Add a signTransaction method that returns the signed transaction data
    async signTransaction(transaction) {
        return this.signMessage(transaction);
    }
    async enable() {
    }
    async getBalance() {
        return 0;
    }
    async getTransactionCount() {
        return 0;
    }
    async call(transaction, blockTag) {
        return 0;
    }
    async getChainId() {
        return this.#options.chainId;
    }
    async getChain() {
        return 5;
    }
    async getGasPrice() {
        return 0;
    }
    async resolveName() {
        return 0;
    }
    async checkTransaction() {
        return 0;
    }
    async populateTransaction() {
        return 0;
    }
    async watchAsset(asset) {
        return true;
    }
    toJSON() {
        return this;
    }
    handleMessage(event) {
        try {
            // Check the origin of the message to ensure it's from the expected source
            if (event.origin !== 'https://auth.verbwire.com') {
                console.log("Received message from unexpected origin: ", event.origin);
                return;
            }
            // Process the received data
            //console.log('Data received from iframe:', event.data);
            const action = event.data.action;
            // Interact with local storage for GET_VALUE, SET_VALUE, DELETE_VALUE actions
            if (['GET_VALUE', 'SET_VALUE', 'DELETE_VALUE'].includes(action)) {
                const keyName = event.data.message.keyName;
                const identifier = event.data.message.identifier;
                if (action === 'SET_VALUE') {
                    try {
                        const { identifier, keyName, value } = event.data.message;
                        localStorage.setItem(keyName, JSON.stringify(value));
                        // send back the response
                        this.sendMessageToIframe('storageResponse', { identifier: identifier, response: "OK" });
                    }
                    catch (e) {
                        console.error('Error setting value in localStorage: ', e);
                        // if an error occurs while setting the value, send back a response indicating the failure
                        //this.sendMessageToIframe('storageResponse', {identifier: identifier,  error: e.toString() });
                        this.sendMessageToIframe('storageResponse', {
                            identifier: identifier,
                            error: e instanceof Error ? e.toString() : 'An error occurred'
                        });
                    }
                }
                if (action === 'GET_VALUE') {
                    try {
                        const { identifier, keyName } = event.data.message;
                        //const value = JSON.parse(localStorage.getItem(keyName));
                        const storageValue = localStorage.getItem(keyName);
                        if (storageValue !== null) {
                            const value = JSON.parse(storageValue);
                            // send back the response
                            this.sendMessageToIframe('storageResponse', { identifier: identifier, response: value });
                        }
                        else {
                            // send back the response
                            this.sendMessageToIframe('storageResponse', { identifier: identifier, response: null });
                        }
                    }
                    catch (e) {
                        console.error('Error getting value from localStorage: ', e);
                        // if an error occurs while getting the value, send back a response indicating the failure
                        //this.sendMessageToIframe('storageResponse', {identifier: identifier,  error: e.toString() });
                        this.sendMessageToIframe('storageResponse', {
                            identifier: identifier,
                            error: e instanceof Error ? e.toString() : 'An error occurred'
                        });
                    }
                }
                if (action === 'DELETE_VALUE') {
                    try {
                        const { identifier, keyName } = event.data.message;
                        localStorage.removeItem(keyName);
                        // send back the response
                        this.sendMessageToIframe('storageResponse', { identifier: identifier, response: "OK" });
                    }
                    catch (e) {
                        console.error('Error removing item from localStorage: ', e);
                        // if an error occurs while removing the item, send back a response indicating the failure
                        //this.sendMessageToIframe('storageResponse', {identifier: identifier,  error: e.toString() });
                        this.sendMessageToIframe('storageResponse', {
                            identifier: identifier,
                            error: e instanceof Error ? e.toString() : 'An error occurred'
                        });
                    }
                }
                return;
            }
            // Call onLogin callback if the specific message is received
            if (event.data.action === 'loggedIn') {
                console.log("LOGGED IN!");
                this.loggedIn = true;
                this.account = event.data.message;
                //this.connectionStatus = 'connected';
                // Notify wagmi of the account change
                this.events.emit('loggedIn', event.data.message);
                if (this.onLogin) {
                    this.onLogin(event.data.message);
                }
                // If there was a pending action, send it now
                //console.log("Pending Action: ", this.pendingAction);
                //console.log("Pending Data: ", this.pendingData);
                if (this.pendingAction) {
                    this.sendMessageToIframe(this.pendingAction, this.pendingData);
                    this.pendingAction = null;
                    this.pendingData = null;
                }
                return;
            }
            if (event.data.action === 'iframeReady') {
                // If there was a pending action, send it now
                //console.log("Pending Action: ", this.pendingAction);
                //console.log("Pending Data: ", this.pendingData);
                if (this.pendingAction && this.pendingAction === "signOut") {
                    this.sendMessageToIframe(this.pendingAction, this.pendingData);
                    this.pendingAction = null;
                    this.pendingData = null;
                }
                return;
            }
            // Close the iframe if the specific message is received
            if (event.data.action === 'signedOut') {
                this.events.emit('signedOut', event.data.message);
            }
            if (event.data.action === 'signedMessage') {
                this.events.emit('signedMessage', event.data.message);
            }
            if (event.data.action === 'signedTypedData') {
                this.events.emit('signedTypedData', event.data.message);
            }
            if (event.data.action === 'sentTransaction') {
                this.events.emit('sentTransaction', event.data.message);
            }
            // Close the iframe if the specific message is received
            if (event.data.action === 'closeIframe') {
                this.closeIframe();
            }
            // Close the iframe if the specific message is received
            if (event.data.action === 'closeIframe') {
                this.closeIframe();
            }
            // Resize the iframe if the specific message is received
            if (event.data.action === 'resizeIframe') {
                this.resizeIframe(event.data.height);
            }
        }
        catch (e) {
            console.log("HANDLE MESSAGE ERROR: ", e);
        }
    }
    closeIframe() {
        const overlay = document.querySelector('.iframe-overlay');
        if (overlay) {
            overlay.remove();
            this.loggedIn = false;
        }
    }
    openIframe() {
        const overlay = document.querySelector('.iframe-overlay');
        if (overlay) {
            // Show the overlay
            overlay.style.display = 'block';
        }
    }
    sendMessageToIframe(action, data) {
        const iframe = document.querySelector('iframe');
        if (iframe) {
            // Define a replacer function for JSON.stringify
            const replacer = (key, value) => {
                if (typeof value === 'bigint') {
                    // Convert BigInt values to string with a prefix
                    return `bigint:${value.toString()}`;
                }
                else {
                    return value;
                }
            };
            // Convert data to JSON and back to handle BigInt values
            //const safeData = JSON.parse(JSON.stringify(data, replacer));
            // Stringify the data with the replacer function
            const safeData = JSON.stringify(data, replacer);
            const message = {
                action,
                data: safeData
            };
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(message, '*');
            }
        }
    }
    resizeIframe(height) {
        //console.log("resizeIframe: ", height);
        const iframe = document.querySelector('.wallet-iframe');
        const iframeWrapper = document.querySelector('.iframe-wrapper');
        const marginTop = 25; // We assume the marginTop value you set on iframeWrapper
        const newHeight = height + marginTop + 25; // Adjust the height considering the marginTop value
        if (iframe) {
            iframe.style.height = `${newHeight}px`;
        }
        if (iframeWrapper) {
            iframeWrapper.style.height = `${newHeight}px`;
            iframeWrapper.style.marginTop = `${marginTop}px`; // Make sure the marginTop value is still applied after resizing
            iframeWrapper.style.borderRadius = '35px';
            iframeWrapper.style.overflow = 'hidden';
            iframeWrapper.style.backgroundColor = 'white';
        }
    }
    createOverlay(url) {
        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '2147483647';
        // New Additions
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        //overlay.style.alignItems = 'center';
        // End New Additions
        overlay.classList.add('iframe-overlay');
        overlay.style.overflow = 'auto';
        const iframeWrapper = document.createElement('div');
        //iframeWrapper.style.position = 'absolute';
        //iframeWrapper.style.top = '50%';
        //iframeWrapper.style.left = '50%';
        //iframeWrapper.style.transform = 'translate(-50%, -50%)';
        iframeWrapper.style.position = 'relative';
        iframeWrapper.style.maxWidth = '400px';
        iframeWrapper.style.width = '100%';
        iframeWrapper.style.height = '100%'; // Initialize to 0
        iframeWrapper.style.transition = 'height 0.3s ease'; // Add transition
        iframeWrapper.style.borderRadius = '35px'; // Apply border-radius to the wrapper
        iframeWrapper.style.overflow = 'hidden'; // Hide anything that exceeds the wrapper boundary
        // Additions
        iframeWrapper.style.marginTop = '25px';
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.border = 'none';
        iframe.style.width = '100%';
        iframe.style.height = '0'; // Initialize to 0
        iframe.style.transition = 'height 0.3s ease'; // Add transition
        iframe.style.overflow = 'auto';
        iframe.classList.add('wallet-iframe');
        iframeWrapper.classList.add('iframe-wrapper');
        iframeWrapper.appendChild(iframe);
        const spinner = document.createElement('div');
        spinner.style.position = 'absolute';
        spinner.style.top = '50%';
        spinner.style.left = '50%';
        spinner.style.transform = 'translate(-50%, -50%)';
        spinner.style.width = '40px';
        spinner.style.height = '40px';
        spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
        spinner.style.borderTopColor = 'black';
        spinner.style.borderRadius = '50%';
        spinner.style.animation = 'spin 1s linear infinite';
        const spinnerStyle = document.createElement('style');
        spinnerStyle.innerHTML = `
@keyframes spin {
0% {
    transform: translate(-50%, -50%) rotate(0deg);
}
100% {
    transform: translate(-50%, -50%) rotate(360deg);
}
`;
        document.head.appendChild(spinnerStyle);
        iframe.addEventListener('load', () => {
            spinner.remove();
        });
        iframeWrapper.appendChild(spinner);
        overlay.appendChild(iframeWrapper);
        return overlay;
    }
    async showWallet(action = 'loadWallet', data = {}) {
        if (this.connectionStatus === 'disconnected') {
            this.connectionStatus = 'connecting';
        }
        if (typeof window !== 'undefined' && !this.addedEventListener) {
            this.addedEventListener = true;
        }
        const chainId = await this.getChainId();
        const encodedChainId = await encodeURIComponent(chainId);
        const walletUrl = `https://auth.verbwire.com/wallet/load/${this.applicationId}?chainId=${encodedChainId}`;
        const overlay = this.createOverlay(walletUrl);
        document.body.appendChild(overlay);
        if (this.loggedIn) {
            this.sendMessageToIframe(action, data);
        }
        else {
            if (action === 'signOut') {
                this.sendMessageToIframe(action, data);
            }
            this.pendingAction = action;
            this.pendingData = data;
        }
    }
    // Specific methods for each action
    loadWallet(data = {}) {
        this.showWallet('loadWallet', data);
    }
    // Specific methods for each action
    signOut() {
        this.showWallet('signOut', {});
        // Return a Promise which resolves when the 'signedMessage' event is emitted
        return new Promise((resolve, reject) => {
            // Wait for the 'signedMessage' event and resolve the promise with the signature
            this.events.once('signedOut', () => {
                console.log("In the signedOut event listener");
                this.connectionStatus = 'disconnected';
                this.account = null;
                this.closeIframe();
                resolve();
            });
            // Reject the promise if the timeout expires
            setTimeout(() => {
                reject(new Error('Timeout waiting for signout'));
            }, 60000 * 5); // 5 minute timeout
        });
    }
    signMessage(data = {}) {
        const { message } = data;
        //console.log("Data: ", data);
        if (message) {
            this.showWallet('signMessage', { message: message });
        }
        else {
            this.showWallet('signMessage', { message: data });
        }
        // Return a Promise which resolves when the 'signedMessage' event is emitted
        return new Promise((resolve, reject) => {
            // Wait for the 'signedMessage' event and resolve the promise with the signature
            this.events.once('signedMessage', (signature) => {
                console.log("Signature returned from provider:", signature);
                resolve(signature);
            });
            setTimeout(() => {
                reject(new Error('Timeout waiting for signature'));
            }, 60000 * 5); // 5 minute timeout
        });
    }
    signTypedData(data) {
        const { message } = data;
        //console.log("Data: ", JSON.stringify(data, null, 2));
        this.showWallet('signTypedData', data);
        // Return a Promise which resolves when the 'signedMessage' event is emitted
        return new Promise((resolve, reject) => {
            // Wait for the 'signedMessage' event and resolve the promise with the signature
            this.events.once('signedTypedData', (signature) => {
                //console.log("Signature returned from provider:", signature);
                resolve(signature);
            });
            setTimeout(() => {
                reject(new Error('Timeout waiting for signature'));
            }, 60000 * 5); // 5 minute timeout
        });
    }
    sendTransaction(options = {}) {
        const { to, value, data, from } = options;
        // Convert value from BigNumber to a regular string
        const valueInEth = (0, units_1.formatEther)(value);
        // Send the transaction request to the iframe
        this.showWallet('sendTransaction', { to: to, value: valueInEth, data: data, from: from });
        // Return a Promise which resolves when the 'signedMessage' event is emitted
        return new Promise((resolve, reject) => {
            // Wait for the 'sendTransaction' event and resolve the promise with the signature
            this.events.on('sentTransaction', (hash) => {
                //console.log("sentTransaction hash returned from provider:", hash);
                resolve(hash);
            });
        });
    }
    async writeContract(data = {}) {
        // Define a replacer function for JSON.stringify
        const replacer = (key, value) => {
            if (typeof value === 'bigint') {
                // Convert BigInt values to string with a prefix
                return `bigint:${value.toString()}`;
            }
            else {
                return value;
            }
        };
        // Send a writeContract action to the iframe and wait for the 'contractWritten' event
        this.showWallet('writeContract', data);
        // Return a Promise which resolves when the 'contractWritten' event is emitted
        return new Promise((resolve, reject) => {
            // Wait for the 'contractWritten' event and resolve the promise with the result
            this.events.on('sentTransaction', (hash) => {
                //console.log("Contract Write sentTransaction hash returned from provider:", hash);
                resolve(hash);
            });
            setTimeout(() => {
                reject(new Error('Timeout waiting for result'));
            }, 60000 * 5); // 5 minute timeout
        });
    }
    // Wagmi specific methods
    getAccount() {
        return this.account;
    }
    setAccount(account) {
        this.account = account;
    }
    getStatus() {
        return this.connectionStatus;
    }
    setStatus(status) {
        this.connectionStatus = status;
    }
    isConnecting() {
        return this.connectionStatus === 'connecting';
    }
    isConnected() {
        return this.connectionStatus === 'connected';
    }
    isAuthorized() {
        return this.connectionStatus === 'connected';
    }
    getNetwork() {
        return this.network;
    }
    async estimateGas(transaction) {
        return '10000';
    }
    async send(method, params) {
        switch (method) {
            case 'eth_sendTransaction':
                const transaction = params[0];
                return await this.sendTransaction(transaction);
            case 'eth_sign':
                const address = params[0];
                const message = params[1];
                if (address !== this.account) {
                    throw new Error('Not authorized');
                }
                return await this.signMessage({ message });
            default:
                throw new Error(`Method ${method} not supported`);
        }
    }
    getAddress() {
        return this.account;
    }
    setAddress(address) {
        this.address = address;
    }
    async switchNetwork(network) {
    }
    async switchChain(chainId) {
        this.chainId = chainId;
        this.chain = chainId;
        this.network.chainId = chainId;
        this.#options.chainId = chainId;
        this.emit('chainChanged', chainId);
        this.events.emit('chainChanged', chainId);
        return chainId;
    }
    getSigner() {
        return {
            connect: this.connect.bind(this),
            signTransaction: this.signTransaction.bind(this),
            getAddress: async () => {
                return this.account;
            },
            sendTransaction: async (transaction) => {
                return this.sendTransaction(transaction);
            },
            signMessage: async (message) => {
                return this.signMessage({ message });
            }
        };
    }
}
exports.VerbwireWallet = VerbwireWallet;
// Add event emitter functionality to your class
Object.assign(VerbwireWallet.prototype, require('events').EventEmitter.prototype);
