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
} from './types';

export class LimitsSDK {
  private httpClient: HttpClient;

  constructor(config: LimitsSDKConfig = {}) {
    const defaultConfig: LimitsSDKConfig = {
      baseURL: 'http://localhost:3001/dmp',
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
}
