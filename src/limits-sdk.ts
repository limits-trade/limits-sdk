import { HttpClient } from './http-client';
import {
  LimitsSDKConfig,
  OrderResponse,
  LeverageRequest,
  LeverageResponse,
  ConnectUserRequest,
  ConnectUserResponse,
  VerifyDeviceRequest,
  VerifyDeviceResponse,
  VerifyKeysRequest,
  VerifyKeysResponse,
  ApiResponse,
  LimitsOrderRequest,
  SignatureData,
  GenerateSignatureRequest,
  HyperliquidPermitTypes,
  HyperliquidPermitMessage,
  HyperliquidDomain,
  BUILDER_FEE,
  BUILDER_FEE_ADDRESS,
  HyperliquidResponse,
  HyperliquidAction,
  HyperliquidRequest,
  API_URL,
  EXCHANGE_ENDPOINT,
  BatchLimitsOrderRequest,
  BatchOrderResponse,
  GenerateSignatureRequestV2,
} from './types';
import { Signature } from 'ethers';

export class LimitsSDK {
  private httpClient: HttpClient;

  constructor(config: LimitsSDKConfig = {}) {
    const defaultConfig: LimitsSDKConfig = {
      baseURL: 'https://api.limits.trade/dmp',
      timeout: 30000,
      ...config,
    };

    this.httpClient = new HttpClient(defaultConfig);
  }

  // Trading Methods

  /**
   * Create a single order
   * @param orderRequest - The order details
   * @returns Promise with order response
   */
  async createOrder(orderRequest: LimitsOrderRequest): Promise<OrderResponse> {
    return this.httpClient.post<OrderResponse>('/order', orderRequest);
  }

  /**
   * Create orders
   * @param ordersRequest - The order details
   * @returns Promise with orders response
   */
  async createOrders(
    ordersRequest: BatchLimitsOrderRequest
  ): Promise<BatchOrderResponse> {
    return this.httpClient.post<BatchOrderResponse>('/orders', ordersRequest);
  }

  /**
   * Update leverage for a trading pair
   * @param leverageRequest - The leverage update details
   * @returns Promise with leverage response
   */
  async updateLeverage(
    leverageRequest: LeverageRequest
  ): Promise<LeverageResponse> {
    return this.httpClient.post<LeverageResponse>('/leverage', leverageRequest);
  }

  // Account Connection and Verification Methods

  /**
   * Connect a user to the platform
   * @param connectRequest - User connection details
   * @returns Promise with connection response
   */
  async connectUser(
    connectRequest: ConnectUserRequest
  ): Promise<ConnectUserResponse> {
    const response = await this.httpClient.post<
      ApiResponse<ConnectUserResponse>
    >('/connect', connectRequest);
    return response.data as ConnectUserResponse;
  }

  /**
   * Verify user keys
   * @param verifyRequest - Key verification details
   * @returns Promise with verification response
   */
  async verifyUser(
    verifyRequest: VerifyKeysRequest
  ): Promise<VerifyKeysResponse> {
    const response = await this.httpClient.put<ApiResponse<VerifyKeysResponse>>(
      '/connect',
      verifyRequest
    );
    return response.data as VerifyKeysResponse;
  }

  /**
   * Verify a device
   * @param verifyRequest - Device verification details
   * @returns Promise with device verification response
   */
  async verifyDevice(
    verifyRequest: VerifyDeviceRequest
  ): Promise<VerifyDeviceResponse> {
    const response = await this.httpClient.post<
      ApiResponse<VerifyDeviceResponse>
    >('/verifyDevice', verifyRequest);
    return response.data as VerifyDeviceResponse;
  }

  /**
   * Assign a CLOID (Client Order ID) to an address
   * @param assignRequest - The assignment request with address and optional cloid
   * @returns Promise with assignment response
   */
  async assignCloid(assignRequest: {
    address: string;
    cloid?: string;
  }): Promise<{
    success: boolean;
    message: string;
    data: {
      address: string;
      cloid?: string;
    };
  }> {
    return this.httpClient.post('/assignCloid', assignRequest);
  }

  /**
   * Get the CLOID (Client Order ID) for an address
   * @param address - The Ethereum address to get CLOID for
   * @returns Promise with CLOID retrieval response
   */
  async getCloid(address: string): Promise<{
    success: boolean;
    message: string;
    data: {
      address: string;
      cloid?: string;
    };
  }> {
    return this.httpClient.get(`/getCloid/${address}`);
  }

  // ...existing code...

  // Signature Generation Methods

  /**
   * Generate EIP-712 signature data for different request types
   * @param request - The request object containing the data to sign (V1 format)
   * @returns SignatureData object with domain, types, and message for EIP-712 signing
   */
  generateSignatureData(request: GenerateSignatureRequest): SignatureData;
  /**
   * Generate EIP-712 signature data for different request types
   * @param request - The request object containing the data to sign (V2 format)
   * @returns SignatureData object with domain, types, and message for EIP-712 signing
   */
  generateSignatureData(request: GenerateSignatureRequestV2): SignatureData;
  generateSignatureData(
    request: GenerateSignatureRequest | GenerateSignatureRequestV2
  ): SignatureData {
    const domain = {
      name: 'LimitsTrade',
      version: '1',
      chainId: request.chainId,
    };

    switch (request.signatureType) {
      case 'createOrder': {
        const req = request as GenerateSignatureRequest;
        if (
          !req.coin ||
          req.isBuy === undefined ||
          req.reduceOnly === undefined
        ) {
          throw new Error(
            'Invalid createOrder request: missing required properties (coin, isBuy, reduceOnly)'
          );
        }
        return {
          domain,
          types: {
            VerifyOrder: [
              { name: 'userAddress', type: 'string' },
              { name: 'coin', type: 'string' },
              { name: 'nonce', type: 'uint64' },
              { name: 'isBuy', type: 'bool' },
              { name: 'reduceOnly', type: 'bool' },
            ],
          },
          message: {
            userAddress: req.userAddress,
            coin: req.coin,
            nonce: req.nonce,
            isBuy: req.isBuy,
            reduceOnly: req.reduceOnly,
          },
        };
      }
      case 'createOrders': {
        const req = request as GenerateSignatureRequestV2;
        if (!req.orders || req.orders.length === 0) {
          throw new Error(
            'Invalid createOrders request: missing or empty orders array'
          );
        }
        return {
          domain,
          types: {
            OrderDetails: [
              { name: 'coin', type: 'string' },
              { name: 'isBuy', type: 'bool' },
              { name: 'reduceOnly', type: 'bool' },
            ],
            VerifyOrders: [
              { name: 'userAddress', type: 'string' },
              { name: 'nonce', type: 'uint64' },
              { name: 'orders', type: 'OrderDetails[]' },
            ],
          },
          message: {
            userAddress: req.userAddress,
            nonce: req.nonce,
            orders: req.orders.map((order) => ({
              coin: order.coin,
              isBuy: order.isBuy,
              reduceOnly: order.reduceOnly,
            })),
          },
        };
      }
      case 'updateLeverage': {
        if (request.leverage === undefined || request.isCross === undefined) {
          throw new Error(
            'Invalid updateLeverage request: missing required properties (leverage, isCross)'
          );
        }
        const coin = (request as GenerateSignatureRequest).coin;
        if (!coin) {
          throw new Error(
            'Invalid updateLeverage request: missing coin property'
          );
        }
        return {
          domain,
          types: {
            VerifyLeverage: [
              { name: 'userAddress', type: 'string' },
              { name: 'coin', type: 'string' },
              { name: 'nonce', type: 'uint64' },
              { name: 'leverage', type: 'uint64' },
              { name: 'isCross', type: 'bool' },
            ],
          },
          message: {
            userAddress: request.userAddress,
            coin: coin,
            nonce: request.nonce,
            leverage: request.leverage,
            isCross: request.isCross,
          },
        };
      }
      case 'verifyDevice': {
        if (!request.agentAddress) {
          throw new Error('Invalid verifyDevice request: missing agentAddress');
        }
        return {
          domain,
          types: {
            VerifyDevice: [
              { name: 'userAddress', type: 'string' },
              { name: 'agentAddress', type: 'string' },
              { name: 'nonce', type: 'uint64' },
            ],
          },
          message: {
            userAddress: request.userAddress,
            agentAddress: request.agentAddress,
            nonce: request.nonce,
          },
        };
      }
      default:
        throw new Error(
          `Unsupported signature type: ${(request as any).signatureType}`
        );
    }
  }

  getHyperliquidDomain(chainId: BigInt): HyperliquidDomain {
    const domain = {
      name: 'HyperliquidSignTransaction',
      version: '1',
      chainId: Number(chainId),
      verifyingContract: '0x0000000000000000000000000000000000000000',
    };
    return domain;
  }

  getHyperliquidPermit(
    type: string,
    nonce: number,
    chainId: BigInt,
    agentAddress?: string
  ): { types: HyperliquidPermitTypes; message: HyperliquidPermitMessage } {
    let types: HyperliquidPermitTypes;
    const signatureChainId = Number(chainId);
    let message: HyperliquidPermitMessage = {
      type,
      hyperliquidChain: 'Mainnet',
      signatureChainId,
      nonce: nonce,
    };

    if (type === 'approveBuilderFee') {
      message = {
        ...message,
        maxFeeRate: BUILDER_FEE,
        builder: BUILDER_FEE_ADDRESS.toLowerCase(),
      };

      types = {
        ['HyperliquidTransaction:ApproveBuilderFee']: [
          { name: 'hyperliquidChain', type: 'string' },
          { name: 'maxFeeRate', type: 'string' },
          { name: 'builder', type: 'address' },
          { name: 'nonce', type: 'uint64' },
        ],
      };
    } else {
      const validUntil = nonce + 15552000000;
      message = {
        ...message,
        agentAddress: agentAddress || BUILDER_FEE_ADDRESS.toLowerCase(), // Use provided agentAddress or fallback
        agentName: `Limits valid_until ${validUntil}`,
      };

      types = {
        ['HyperliquidTransaction:ApproveAgent']: [
          { name: 'hyperliquidChain', type: 'string' },
          { name: 'agentAddress', type: 'address' },
          { name: 'agentName', type: 'string' },
          { name: 'nonce', type: 'uint64' },
        ],
      };
    }

    return { types, message };
  }

  /**
   * Create EIP-712 typed data for Hyperliquid trading actions
   */
  createHyperliquidTypedData(
    types: HyperliquidPermitTypes,
    message: HyperliquidPermitMessage,
    chainId: BigInt
  ) {
    const domain = this.getHyperliquidDomain(chainId);
    return {
      domain,
      types: {
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
        ...types,
      },
      primaryType: Object.keys(types)[0], // Use the first type as primary
      message,
    };
  }

  /**
   * Submit agent permit to Hyperliquid
   */
  async submitHLPermit(
    permit: {
      types: HyperliquidPermitTypes;
      message: HyperliquidPermitMessage;
    },
    signature: string,
    chainId: number
  ): Promise<HyperliquidResponse> {
    try {
      // Parse the signature into r, s, v components
      const sig = Signature.from(signature);

      const action: HyperliquidAction = {
        type: permit.message.type,
        hyperliquidChain: permit.message.hyperliquidChain,
        signatureChainId: this.toBeHex(chainId),
        nonce: permit.message.nonce,
      };

      // Add type-specific fields
      if (permit.message.type === 'approveBuilderFee') {
        action.maxFeeRate = permit.message.maxFeeRate;
        action.builder = permit.message.builder;
      } else if (permit.message.agentAddress && permit.message.agentName) {
        action.agentAddress = permit.message.agentAddress;
        action.agentName = permit.message.agentName;
      }

      const hyperRequest: HyperliquidRequest = {
        action,
        nonce: permit.message.nonce,
        signature: {
          r: sig.r,
          s: sig.s,
          v: sig.v,
        },
      };

      return await this.callHyperApi(EXCHANGE_ENDPOINT, hyperRequest);
    } catch (error) {
      console.error('Failed to submit agent permit:', error);
      return {
        status: 'error',
        error:
          error instanceof Error ? error.message : 'Failed to submit permit',
      };
    }
  }

  /**
   * Call Hyperliquid API with signed permit data
   */
  private async callHyperApi(
    endpoint: string,
    request: HyperliquidRequest
  ): Promise<HyperliquidResponse> {
    try {
      const response = await fetch(API_URL + endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'omit', // equivalent to withCredentials: false
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          status: 'error',
          error:
            data.error || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        status: 'success',
        response: data,
      };
    } catch (error) {
      console.error('Hyperliquid API call failed:', error);
      return {
        status: 'error',
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private toBeHex(value: number | BigInt): string {
    return '0x' + value.toString(16);
  }
}
