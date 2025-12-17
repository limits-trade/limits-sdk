import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { LimitsSDKConfig, SDKError } from './types';

export class HttpClient {
  private client: AxiosInstance;

  constructor(config: LimitsSDKConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    // Add request interceptor for logging (optional)
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // You can add request logging here if needed
        return config;
      },
      (error: any) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: any) => {
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): SDKError {
    const sdkError = new Error() as SDKError;

    if (error.response) {
      // Server responded with error status
      sdkError.message =
        error.response.data?.message ||
        error.response.data?.error ||
        error.message;
      sdkError.status = error.response.status;
      sdkError.response = error.response.data;
      sdkError.code =
        error.response.data?.code || `HTTP_${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response received
      sdkError.message = 'Network error - no response received';
      sdkError.code = 'NETWORK_ERROR';
    } else {
      // Something else happened
      sdkError.message = error.message || 'Unknown error occurred';
      sdkError.code = 'UNKNOWN_ERROR';
    }

    return sdkError;
  }

  async get<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, {
      params: data,
      ...config,
    });
    return response.data;
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(
      url,
      data,
      config
    );
    return response.data;
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data, config);
    return response.data;
  }
}
