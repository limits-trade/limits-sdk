// Core Trading Types
export type Tif = 'Alo' | 'Ioc' | 'Gtc' | 'FrontendMarket';
export type TriggerType = 'tp' | 'sl';
export type LimitOrder = { tif: Tif };
export type TriggerOrder = { triggerPx: string | number; isMarket: boolean; tpsl: TriggerType };
export type Grouping = 'na' | 'normalTpsl' | 'positionTpsl';
export type OrderType = { limit?: LimitOrder; trigger?: TriggerOrder };
export type Cloid = string;
export type OidOrCloid = number | Cloid;

export enum ActionType {
  ORDER = 'order',
  CANCEL = 'cancel',
  MODIFY = 'modify',
}

// Signature Types
export interface Signature {
  r: string;
  s: string;
  v: number;
}

// Builder Type
export interface Builder {
  address: string;
  fee: number;
}

// Order Request Types
export interface OrderRequest {
  orderId?: string; // Optional pre-generated orderId for TWAP tracking
  userAddress: string;
  privateKey?: string; // Optional since we fetch from database
  coin: string;
  is_buy: boolean;
  sz: number | string;
  reduce_only: boolean;
  limit_px?: number | string;
  order_type?: OrderType;
  cloid?: string;
  grouping?: Grouping;
  builder?: Builder;
  threshold?: number;
}

export interface Order extends BaseOrder {
  coin: string;
  is_buy: boolean;
  sz: number | string;
  limit_px: number | string;
  order_type: OrderType;
  reduce_only: boolean;
  cloid?: Cloid;
  orders?: undefined;
}

export interface OrderWire {
  a: number;
  b: boolean;
  p: string;
  s: string;
  r: boolean;
  t: OrderType;
  c?: string;
}

// Action Types
export type OrderAction = {
  grouping: Grouping;
  orders: Array<OrderWire>;
  type: string;
};

export interface CancelAction {
  type: 'cancel';
  cancels: Array<{ a: number; o: number }>;
}

export interface ModifyAction {
  type: 'batchModify';
  modifies: Array<{
    oid: number | string;
    order: OrderWire;
  }>;
}

// Leverage Types
export interface HyperLiquidLeverageWire {
  type: 'updateLeverage';
  asset: number;
  isCross: boolean;
  leverage: number;
}

export type LeverageRequest = {
  userAddress: string;
  privateKey?: string; // Optional since we fetch from database
  coin: string;
  leverage: number;
  leverageType: 'cross' | 'isolated';
};

// TWAP Types
export type TwapRequest = {
  userAddress: string;
  privateKey?: string;
  token: string;
  size: string;
  frequency: string; // always in minutes 
  runtime: string; // always in minutes 
  randomize: boolean;
  isBuy: boolean;
  threshold: number;
};

export interface TwapOrder {
  id: string;
  userAddress: string;
  token: string;
  totalSize: number;
  orderSize: number;
  frequency: number; // in minutes
  runtime: number; // in minutes
  randomize: boolean;
  isBuy: boolean;
  status: 'created' | 'active' | 'completed' | 'cancelled';
  createdAt: Date;
  scheduledOrders: TwapScheduledOrder[];
}

export interface TwapScheduledOrder {
  id: string;
  twapId: string;
  userAddress: string;
  orderIndex: number;
  size: number;
  scheduledAt: Date;
  status: 'pending' | 'executed' | 'failed' | 'cancelled';
  orderId?: string;
  actualExecutedAt?: Date;
  price?: number;
}

// Hyperliquid Request/Response Types
export type HyperliquidRequest = {
  action: OrderAction | CancelAction | ModifyAction | HyperLiquidLeverageWire;
  nonce: number;
  signature: Signature;
  vaultAddress?: string | null;
};

export type HyperliquidResponse<T> = {
  data: T;
};

export type HyperliquidOrderResponse = {
  status: string;
  response: {
    type: string;
    data: {
      statuses: Array<{
        resting: {
          oid: number;
        };
      }>;
    };
  };
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
}

export interface VerifyKeysResponse {
  verified: boolean;
  userAddress: string;
  message: string;
}

export interface VerifyCodeRequest {
  userAddress: string;
  inviteCode: string;
}

export interface VerifyCodeResponse {
  verified: boolean;
  userAddress: string;
  message: string;
}

// Base Types
interface BaseOrder {
  privateKey: string;
  vaultAddress?: string;
  grouping?: Grouping;
  builder?: Builder;
}

// Domain Types
export const phantomDomain = {
  name: 'Exchange',
  version: '1',
  chainId: 1337,
  verifyingContract: '0x0000000000000000000000000000000000000000',
} as const;

export const agentTypes = {
  Agent: [
    { name: 'source', type: 'string' },
    { name: 'connectionId', type: 'bytes32' },
  ],
} as const;

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface OrderResponse extends ApiResponse {
  order?: OrderRequest;
}

export interface BatchOrderResponse extends ApiResponse {
  data?: {
    total: number;
    successful: number;
    failed: number;
    results: Array<{
      index: number;
      success: boolean;
      data?: unknown;
      order: OrderRequest;
    }>;
    errors: Array<{
      index: number;
      success: boolean;
      error: string;
      order: OrderRequest;
    }>;
  };
}

export interface LeverageResponse extends ApiResponse {
  order?: LeverageRequest;
}

export interface TwapResponse extends ApiResponse {
  // TWAP-specific response data will be in the data field
}

// Batch Order Types
export interface BatchOrderRequest {
  orders: OrderRequest[];
}

// SDK Configuration Types
export interface LimitsSDKConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// Error Types
export interface SDKError extends Error {
  code?: string;
  status?: number;
  response?: unknown;
}
