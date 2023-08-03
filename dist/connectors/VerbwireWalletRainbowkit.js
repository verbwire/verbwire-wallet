"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerbwireWalletRainbowkit = void 0;
const VerbwireWalletConnector_1 = require("./VerbwireWalletConnector");
const VerbwireWalletRainbowkit = ({ chains, applicationId, network }) => ({
    id: 'VerbwireWallet',
    name: 'Verbwire',
    iconUrl: 'https://static.verbwire.com/images/VerbwireIcon.svg',
    iconBackground: '#fff',
    downloadUrls: {
        browserExtension: '',
    },
    createConnector: () => {
        const connector = new VerbwireWalletConnector_1.VerbwireWalletConnector({
            chains,
            options: {
                name: 'VerbwireWallet',
                network: network,
                applicationId: applicationId,
            },
        });
        return {
            connector: connector,
        };
    },
});
exports.VerbwireWalletRainbowkit = VerbwireWalletRainbowkit;
