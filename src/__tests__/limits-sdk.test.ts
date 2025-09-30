import { LimitsSDK } from '../limits-sdk';
import { HttpClient } from '../http-client';

// Mock the HttpClient
jest.mock('../http-client');

describe('LimitsSDK', () => {
  let sdk: LimitsSDK;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    sdk = new LimitsSDK({ baseURL: 'https://api.example.com' });
    mockHttpClient = (sdk as any).httpClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Trading Methods', () => {
    describe('createOrder', () => {
      it('should create a single order', async () => {
        const orderRequest = {
          userAddress: '0x123',
          coin: 'BTC',
          is_buy: true,
          sz: 1,
          reduce_only: false,
        };

        const mockResponse = {
          success: true,
          message: 'Order created successfully',
          data: { orderId: '123' },
        };

        mockHttpClient.post.mockResolvedValue(mockResponse);

        const result = await sdk.createOrder(orderRequest);

        expect(mockHttpClient.post).toHaveBeenCalledWith('/order', orderRequest);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('createBatchOrders', () => {
      it('should create multiple orders', async () => {
        const batchRequest = {
          orders: [
            {
              userAddress: '0x123',
              coin: 'BTC',
              is_buy: true,
              sz: 1,
              reduce_only: false,
            },
            {
              userAddress: '0x456',
              coin: 'ETH',
              is_buy: false,
              sz: 2,
              reduce_only: false,
            },
          ],
        };

        const mockResponse = {
          success: true,
          message: 'Batch orders created successfully',
          data: {
            total: 2,
            successful: 2,
            failed: 0,
            results: [],
            errors: [],
          },
        };

        mockHttpClient.post.mockResolvedValue(mockResponse);

        const result = await sdk.createBatchOrders(batchRequest);

        expect(mockHttpClient.post).toHaveBeenCalledWith('/batchOrder', batchRequest);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('updateLeverage', () => {
      it('should update leverage', async () => {
        const leverageRequest = {
          userAddress: '0x123',
          coin: 'BTC',
          leverage: 10,
          leverageType: 'cross' as const,
        };

        const mockResponse = {
          success: true,
          message: 'Leverage updated successfully',
          data: { leverage: 10 },
        };

        mockHttpClient.post.mockResolvedValue(mockResponse);

        const result = await sdk.updateLeverage(leverageRequest);

        expect(mockHttpClient.post).toHaveBeenCalledWith('/leverage', leverageRequest);
        expect(result).toEqual(mockResponse);
      });
    });

    describe('createTwapOrder', () => {
      it('should create a TWAP order', async () => {
        const twapRequest = {
          userAddress: '0x123',
          token: 'BTC',
          size: '1.0',
          frequency: '5',
          runtime: '60',
          randomize: true,
          isBuy: true,
          threshold: 0.01,
        };

        const mockResponse = {
          success: true,
          message: 'TWAP order created successfully',
          data: { twapId: 'twap123' },
        };

        mockHttpClient.post.mockResolvedValue(mockResponse);

        const result = await sdk.createTwapOrder(twapRequest);

        expect(mockHttpClient.post).toHaveBeenCalledWith('/twap', twapRequest);
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe('Connection Methods', () => {
    describe('connectUser', () => {
      it('should connect a user', async () => {
        const connectRequest = {
          userAddress: '0x123',
          devicePublicKey: 'pubkey123',
        };

        const mockResponse = {
          success: true,
          message: 'User connected successfully',
          data: {
            userAddress: '0x123',
            hypePublicKey: 'hype123',
          },
        };

        mockHttpClient.post.mockResolvedValue(mockResponse);

        const result = await sdk.connectUser(connectRequest);

        expect(mockHttpClient.post).toHaveBeenCalledWith('/connect', connectRequest);
        expect(result).toEqual(mockResponse.data);
      });
    });

    describe('verifyKeys', () => {
      it('should verify keys', async () => {
        const verifyRequest = {
          userAddress: '0x123',
          agentAddress: '0x456',
        };

        const mockResponse = {
          success: true,
          message: 'Keys verified successfully',
          data: {
            verified: true,
            userAddress: '0x123',
            message: 'Keys are valid',
          },
        };

        mockHttpClient.put.mockResolvedValue(mockResponse);

        const result = await sdk.verifyKeys(verifyRequest);

        expect(mockHttpClient.put).toHaveBeenCalledWith('/connect', verifyRequest);
        expect(result).toEqual(mockResponse.data);
      });
    });
  });

});
