"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connector = void 0;
const eventemitter3_1 = __importDefault(require("eventemitter3"));
const chains_1 = require("viem/chains");
class Connector extends eventemitter3_1.default {
    /** Chains connector supports */
    chains;
    /** Options to use with connector */
    options;
    /** Connector storage. */
    storage;
    constructor({ chains = [chains_1.mainnet, chains_1.goerli], options, }) {
        super();
        this.chains = chains;
        this.options = options;
    }
    getBlockExplorerUrls(chain) {
        const { default: blockExplorer, ...blockExplorers } = chain.blockExplorers ?? {};
        if (blockExplorer)
            return [
                blockExplorer.url,
                ...Object.values(blockExplorers).map((x) => x.url),
            ];
    }
    isChainUnsupported(chainId) {
        return !this.chains.some((x) => x.id === chainId);
    }
    setStorage(storage) {
        this.storage = storage;
    }
}
exports.Connector = Connector;
