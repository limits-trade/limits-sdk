// Order Request Types
export interface LimitsOrderRequest {
    orderId?: string;
    userAddress: string;
    coin: string;
    isBuy: boolean;
    sz: number | string;
    reduceOnly: boolean;
    cloid?: string;
    threshold?: number;
    nonce: number;
    r: string;
    s: string;
    v: number;
    chainId: number;
    vaultAddress?: string;
}

// Leverage Types
export type LeverageRequest = {
    userAddress: string;
    coin: string;
    leverage: number;
    isCross: boolean;
    nonce: number;
    r: string;
    s: string;
    v: number;
    chainId: number;
};

// Connection and Verification Types
export interface ConnectUserRequest {
    userAddress: string;
    deviceAddress: string;
}

export interface ConnectUserResponse {
    userAddress: string;
    hypeApiAddress: string;
}

export interface VerifyDeviceRequest {
    userAddress: string;
    agentAddress: string;
    nonce: number;
    r: string,
    s: string,
    v: number,
    chainId: number;
}

export interface VerifyDeviceResponse {
    verified: boolean;
    userAddress: string;
}

export interface VerifyKeysRequest {
    userAddress: string;
    agentAddress: string;
    nonce: number;
    validity?: number;
    r: string,
    s: string,
    v: number,
    chainId: number;
}

export interface VerifyKeysResponse {
    verified: boolean;
    userAddress: string;
    message: string;
}

// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    message: string;
    data?: T;
    error?: string;
}

export interface OrderResponse extends ApiResponse {
    order?: LimitsOrderRequest;
}

export interface LeverageResponse extends ApiResponse {
    order?: LeverageRequest;
}

// SDK Configuration Types
export interface LimitsSDKConfig {
    baseURL?: string;
    timeout?: number;
    headers?: Record<string, string>;
}

// Error Types
export interface SDKError extends Error {
    code?: string;
    status?: number;
    response?: unknown;
}

// EIP-712 Signature Types
export type SignatureType = 'createOrder' | 'updateLeverage' | 'verifyDevice';

export interface EIP712Domain {
    name: string;
    version: string;
    chainId: number;
}

export interface EIP712Types {
    [key: string]: Array<{ name: string; type: string }>;
}

export interface SignatureData {
    domain: EIP712Domain;
    types: EIP712Types;
    message: Record<string, any>;
}


export interface GenerateSignatureRequest {
    userAddress: string;
    coin?: string;
    nonce: number;
    chainId: number;
    signatureType: SignatureType;
    agentAddress?: string;
    isBuy?: boolean;
    reduceOnly?: boolean;
    leverage?: number;
    isCross?: boolean;
    vaultAddress?: string;
}


export type HyperliquidPermitTypes = {
    [typeName: string]: { name: string; type: string }[];
};

export type HyperliquidDomain = {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: string;
};

export type HyperliquidPermitMessage = {
    type: string;
    hyperliquidChain: string;
    signatureChainId: number;
    maxFeeRate?: string;
    builder?: string;
    agentAddress?: string;
    agentName?: string;
    nonce: number;
};


export interface HyperliquidAction {
    type: string;
    hyperliquidChain: string;
    signatureChainId: string;
    agentAddress?: string;
    agentName?: string;
    nonce: number;
    maxFeeRate?: string;
    builder?: string;
}
export interface Signature {
    r: string;
    s: string;
    v: number;
}

export interface HyperliquidRequest {
    action: HyperliquidAction;
    nonce: number;
    signature: Signature;
}

export interface HyperliquidResponse {
    status: string;
    response?: any;
    error?: string;
}


export const BUILDER_FEE_ADDRESS = '0x746337a98821e1e38AA2bAd0e77900d98B80609e';
export const BUILDER_FEE = '0.1%';
export const API_URL = "https://api.hyperliquid.xyz";
export const EXCHANGE_ENDPOINT = "/exchange";
export const INFO_ENDPOINT = "/info";