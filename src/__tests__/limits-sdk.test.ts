import { LimitsSDK } from "../limits-sdk";
import { HttpClient } from "../http-client";

// Mock the HttpClient
jest.mock("../http-client");

describe("LimitsSDK", () => {
  let sdk: LimitsSDK;
  let mockHttpClient: jest.Mocked<HttpClient>;

  beforeEach(() => {
    sdk = new LimitsSDK();
    mockHttpClient = (sdk as any).httpClient;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Trading Methods", () => {
    describe("createOrder", () => {
      it("should create a single order", async () => {
        const orderRequest = {
          userAddress: "0x123",
          coin: "BTC",
          is_buy: true,
          sz: 1,
          reduce_only: false,
          nonce: 123456,
          r: "0xabc",
          s: "0xdef",
          v: 27,
          chainId: 1,
        };

        const mockResponse = {
          success: true,
          message: "Order created successfully",
          data: { orderId: "123" },
        };

        mockHttpClient.post.mockResolvedValue(mockResponse);

        const result = await sdk.createOrder(orderRequest);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
          "/order",
          orderRequest
        );
        expect(result).toEqual(mockResponse);
      });
    });

    describe("updateLeverage", () => {
      it("should update leverage", async () => {
        const leverageRequest = {
          userAddress: "0x123",
          coin: "BTC",
          leverage: 10,
          isCross: true,
          r: "0xabc",
          s: "0xdef",
          v: 27,
          nonce: 789,
          chainId: 1,
        };

        const mockResponse = {
          success: true,
          message: "Leverage updated successfully",
          data: { leverage: 10 },
        };

        mockHttpClient.post.mockResolvedValue(mockResponse);

        const result = await sdk.updateLeverage(leverageRequest);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
          "/leverage",
          leverageRequest
        );
        expect(result).toEqual(mockResponse);
      });
    });
  });

  describe("Connection and Verification Methods", () => {
    describe("connectUser", () => {
      it("should connect a user", async () => {
        const connectRequest = {
          userAddress: "0x123",
          devicePublicKey: "pubkey123",
          deviceAddress: "0xdeviceAddress",
        };

        const mockResponse = {
          success: true,
          message: "User connected successfully",
          data: {
            userAddress: "0x123",
            hypeApiAddress: "hype123",
          },
        };

        mockHttpClient.post.mockResolvedValue(mockResponse);

        const result = await sdk.connectUser(connectRequest);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
          "/connect",
          connectRequest
        );
        expect(result).toEqual(mockResponse.data);
      });
    });

    describe("verifyUser", () => {
      it("should verify user keys", async () => {
        const verifyRequest = {
          userAddress: "0x123",
          agentAddress: "0x456",
          nonce: 789,
          r: "0xabc",
          s: "0xdef",
          v: 27,
          chainId: 1,
        };

        const mockResponse = {
          success: true,
          message: "Keys verified successfully",
          data: {
            verified: true,
            userAddress: "0x123",
            message: "Keys are valid",
          },
        };

        mockHttpClient.put.mockResolvedValue(mockResponse);

        const result = await sdk.verifyUser(verifyRequest);

        expect(mockHttpClient.put).toHaveBeenCalledWith(
          "/connect",
          verifyRequest
        );
        expect(result).toEqual(mockResponse.data);
      });
    });

    describe("verifyDevice", () => {
      it("should verify a device", async () => {
        const verifyRequest = {
          signature: "0xsignature",
          nonce: 789,
          agentAddress: "0x456",
          userAddress: "0x123",
          chainId: 1,
          r: "0xabc",
          s: "0xdef",
          v: 27,
        };

        const mockResponse = {
          success: true,
          message: "Device verified successfully",
          data: {
            verified: true,
            userAddress: "0x123",
          },
        };

        mockHttpClient.post.mockResolvedValue(mockResponse);

        const result = await sdk.verifyDevice(verifyRequest);

        expect(mockHttpClient.post).toHaveBeenCalledWith(
          "/verifyDevice",
          verifyRequest
        );
        expect(result).toEqual(mockResponse.data);
      });
    });
  });
});
