// Example for Node.js environment
import { LimitsSDK } from 'limits-sdk';

// Configuration for production environment
const productionConfig = {
  baseURL: 'https://api.limits.io',
  timeout: 30000,
  headers: {
    'Authorization': 'Bearer your-production-token',
    'X-API-Version': '1.0',
  },
};

// Configuration for development environment
const developmentConfig = {
  baseURL: 'https://api-dev.limits.io',
  timeout: 60000, // Longer timeout for dev
  headers: {
    'Authorization': 'Bearer your-dev-token',
    'X-API-Version': '1.0',
  },
};

// Initialize SDK based on environment
const sdk = new LimitsSDK(
  process.env.NODE_ENV === 'production' ? productionConfig : developmentConfig
);

export { sdk };

// Advanced usage with error handling and retry logic
export class TradingService {
  private sdk: LimitsSDK;
  private maxRetries = 3;

  constructor(config: any) {
    this.sdk = new LimitsSDK(config);
  }

  async executeOrderWithRetry(orderRequest: any, retries = 0): Promise<any> {
    try {
      return await this.sdk.createOrder(orderRequest);
    } catch (error: any) {
      if (retries < this.maxRetries && this.isRetryableError(error)) {
        console.log(`Retrying order execution, attempt ${retries + 1}`);
        await this.delay(Math.pow(2, retries) * 1000); // Exponential backoff
        return this.executeOrderWithRetry(orderRequest, retries + 1);
      }
      throw error;
    }
  }

  private isRetryableError(error: any): boolean {
    // Retry on network errors or 5xx status codes
    return (
      error.code === 'NETWORK_ERROR' ||
      (error.status && error.status >= 500 && error.status < 600)
    );
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async placeLimitOrder(
    userAddress: string,
    symbol: string,
    side: 'buy' | 'sell',
    quantity: number,
    price: number
  ) {
    const orderRequest = {
      userAddress,
      coin: symbol,
      is_buy: side === 'buy',
      sz: quantity,
      limit_px: price,
      reduce_only: false,
      order_type: {
        limit: { tif: 'Gtc' as const },
      },
    };

    return this.executeOrderWithRetry(orderRequest);
  }

  async closePosition(userAddress: string, symbol: string, quantity: number) {
    const orderRequest = {
      userAddress,
      coin: symbol,
      is_buy: false, // Assuming we're closing a long position
      sz: quantity,
      reduce_only: true,
    };

    return this.executeOrderWithRetry(orderRequest);
  }
}
