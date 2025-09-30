import { HttpClient } from './http-client';
import {
  LimitsSDKConfig,
  OrderRequest,
  OrderResponse,
  BatchOrderRequest,
  BatchOrderResponse,
  LeverageRequest,
  LeverageResponse,
  TwapRequest,
  TwapResponse,
  ConnectUserRequest,
  ConnectUserResponse,
  VerifyDeviceRequest,
  VerifyDeviceResponse,
  VerifyKeysRequest,
  VerifyKeysResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ApiResponse,
} from './types';

export class LimitsSDK {
  private httpClient: HttpClient;

  constructor(config: LimitsSDKConfig) {
    this.httpClient = new HttpClient(config);
  }

  // Trading Methods

  /**
   * Create a single order
   * @param orderRequest - The order details
   * @returns Promise with order response
   */
  async createOrder(orderRequest: OrderRequest): Promise<OrderResponse> {
    return this.httpClient.post<OrderResponse>('/order', orderRequest);
  }

  /**
   * Create multiple orders in a batch
   * @param batchRequest - Array of orders to create
   * @returns Promise with batch order response
   */
  async createBatchOrders(batchRequest: BatchOrderRequest): Promise<BatchOrderResponse> {
    return this.httpClient.post<BatchOrderResponse>('/batchOrder', batchRequest);
  }

  /**
   * Update leverage for a trading pair
   * @param leverageRequest - The leverage update details
   * @returns Promise with leverage response
   */
  async updateLeverage(leverageRequest: LeverageRequest): Promise<LeverageResponse> {
    return this.httpClient.post<LeverageResponse>('/leverage', leverageRequest);
  }

  /**
   * Create a TWAP (Time-Weighted Average Price) order
   * @param twapRequest - The TWAP order details
   * @returns Promise with TWAP response
   */
  async createTwapOrder(twapRequest: TwapRequest): Promise<TwapResponse> {
    return this.httpClient.post<TwapResponse>('/twap', twapRequest);
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
  async verifyKeys(verifyRequest: VerifyKeysRequest): Promise<VerifyKeysResponse> {
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

  /**
   * Verify an invite code
   * @param verifyRequest - Code verification details
   * @returns Promise with code verification response
   */
  async verifyCode(verifyRequest: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    const response = await this.httpClient.post<ApiResponse<VerifyCodeResponse>>('/verifyCode', verifyRequest);
    return response.data as VerifyCodeResponse;
  }
}
