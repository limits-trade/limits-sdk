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
} from './types';

export class LimitsSDK {
  private httpClient: HttpClient;

  constructor(config: LimitsSDKConfig = {}) {
    const defaultConfig: LimitsSDKConfig = {
      baseURL: 'https://app.limits.trade',
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
   * Update leverage for a trading pair
   * @param leverageRequest - The leverage update details
   * @returns Promise with leverage response
   */
  async updateLeverage(leverageRequest: LeverageRequest): Promise<LeverageResponse> {
    return this.httpClient.post<LeverageResponse>('/leverage', leverageRequest);
  }

  // Account Connection and Verification Methods

  /**
   * Connect a user to the platform
   * @param connectRequest - User connection details
   * @returns Promise with connection response
   */
  async connectUser(connectRequest: ConnectUserRequest): Promise<ConnectUserResponse> {
    const response = await this.httpClient.post<ApiResponse<ConnectUserResponse>>('/connect', connectRequest);
    return response.data as ConnectUserResponse;
  }

  /**
   * Verify user keys
   * @param verifyRequest - Key verification details
   * @returns Promise with verification response
   */
  async verifyUser(verifyRequest: VerifyKeysRequest): Promise<VerifyKeysResponse> {
    const response = await this.httpClient.put<ApiResponse<VerifyKeysResponse>>('/connect', verifyRequest);
    return response.data as VerifyKeysResponse;
  }

  /**
   * Verify a device
   * @param verifyRequest - Device verification details
   * @returns Promise with device verification response
   */
  async verifyDevice(verifyRequest: VerifyDeviceRequest): Promise<VerifyDeviceResponse> {
    const response = await this.httpClient.post<ApiResponse<VerifyDeviceResponse>>('/verifyDevice', verifyRequest);
    return response.data as VerifyDeviceResponse;
  }

  // Signature Generation Methods

  /**
   * Generate EIP-712 signature data for different request types
   * @param signatureType - The type of signature (createOrder, updateLeverage, etc.)
   * @param request - The request object containing the data to sign
   * @returns SignatureData object with domain, types, and message for EIP-712 signing
   */
  generateSignatureData(request: GenerateSignatureRequest): SignatureData {
    const domain = {
      name: 'LimitsTrade',
      version: '1',
      chainId: request.chainId,
    };

    switch (request.signatureType) {
      case 'createOrder':
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
            userAddress: request.userAddress,
            coin: request.coin,
            nonce: request.nonce,
            isBuy: request.isBuy,
            reduceOnly: request.reduceOnly,
          },
        };

      case 'updateLeverage':
        return {
          domain,
          types: {
            VerifyLeverage: [
              { name: 'userAddress', type: 'string' },
              { name: 'coin', type: 'string' },
              { name: 'nonce', type: 'unit64' },
              { name: 'leverage', type: 'uint64' },
              { name: 'isCross', type: 'bool' },
            ],
          },
          message: {
            userAddress: request.userAddress,
            coin: request.coin,
            nonce: request.nonce,
            leverage: request.leverage,
            leverageType: request.isCross,
          },
        };
      case 'verifyDevice':
        return {
          domain,
          types: {
            VerifyDevice: [
              { name: 'userAddress', type: 'string' },
              { name: 'agentAddress', type: 'string' },
              { name: 'nonce', type: 'unit64' },
            ],
          },
          message: {
            userAddress: request.userAddress,
            agentAddress: request.agentAddress,
            nonce: request.nonce,
          },
        };
      default:
        throw new Error(`Unsupported signature type: ${request.signatureType}`);
    }
  }
}
