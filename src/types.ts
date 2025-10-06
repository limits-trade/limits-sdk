// Order Request Types
export interface LimitsOrderRequest {
    orderId?: string;
    userAddress: string;
    coin: string;
    is_buy: boolean;
    sz: number | string;
    reduce_only: boolean;
    cloid?: string;
    threshold?: number;
    nonce: string;
    r: string;
    s: string;
    v: number;
    chainId: number;
}

// Leverage Types
export type LeverageRequest = {
    userAddress: string;
    privateKey?: string;
    coin: string;
    leverage: number;
    leverageType: 'cross' | 'isolated';
};

// Connection and Verification Types
export interface ConnectUserRequest {
    userAddress: string;
    devicePublicKey: string;
}

export interface ConnectUserResponse {
    userAddress: string;
    hypePublicKey: string;
}

export interface VerifyDeviceRequest {
    signature: string;
    nonce: string;
    agentAddress: string;
    userAddress: string;
    chainId?: number;
}

export interface VerifyDeviceResponse {
    verified: boolean;
    userAddress: string;
}

export interface VerifyKeysRequest {
    userAddress: string;
    agentAddress: string;
    nonce: string;
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
