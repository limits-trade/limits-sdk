# Limits SDK

A TypeScript SDK for interacting with the Limits trading platform API. This SDK provides type-safe methods for trading operations, account management, and device verification.

## Features

- 🔒 **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🚀 **Easy to Use**: Simple, intuitive API for core trading operations
-  **Error Handling**: Comprehensive error handling with detailed error types
- 🌐 **HTTP Client**: Built-in HTTP client with request/response interceptors
- 📚 **Well Documented**: Extensive documentation and examples

## Installation

```bash
npm install limits-sdk
```

## Quick Start

```typescript
import { LimitsSDK } from 'limits-sdk';
import { ethers } from 'ethers';

// Initialize the SDK with default configuration
const sdk = new LimitsSDK();

// Setup your device wallet
const devicePrivateKey = 'your-device-private-key';
const device = new ethers.Wallet(devicePrivateKey);

async function quickStart() {
  const userAddress = '0x1234567890123456789012345678901234567890';
  
  // Step 1: Connect user
  const connectionResult = await sdk.connectUser({
    userAddress,
    devicePublicKey: device.publicKey,
  });
  
  // Step 2: Verify user keys (required before trading)
  const verifyResult = await sdk.verifyUser({
    userAddress,
    agentAddress: '0x9876543210987654321098765432109876543210',
    nonce: Date.now(),
    r: '0xabc123...', // From approveAgent signature
    s: '0xdef456...', // From approveAgent signature
    v: 27,
    chainId: 1,
  });

  // Step 3: Create an order
  const orderNonce = Date.now();
  
  // Generate EIP-712 signature data using the SDK helper
  const signatureData = sdk.generateSignatureData({
    userAddress,
    coin: 'BTC',
    nonce: orderNonce,
    chainId: 1,
    signatureType: 'createOrder',
    isBuy: true,
    reduceOnly: false,
  });

  // Sign the typed data with your device private key to get r, s, v values
  const signature = await device.signTypedData(
    signatureData.domain,
    signatureData.types,
    signatureData.message
  );
  const { r, s, v } = ethers.Signature.from(signature);

  // Create the order
  const result = await sdk.createOrder({
    userAddress,
    coin: 'BTC',
    is_buy: true,
    sz: 1.0,
    reduce_only: false,
    nonce: orderNonce.toString(),
    r,
    s,
    v,
    chainId: 1,
  });
}
```

## API Reference

### Trading Operations

#### Create Order

Before creating orders, ensure you've connected and verified your device using `connectUser()` and `verifyDevice()`. The device private key from that flow must be used to sign order requests.

```typescript
// First, sign the order data with your device private key using EIP-712
// Use the domain, types, and message structure shown in Quick Start
const signature = await wallet.signTypedData(domain, types, message);
const { r, s, v } = ethers.utils.splitSignature(signature);

const orderResult = await sdk.createOrder({
  userAddress: '0x...',
  coin: 'BTC',
  is_buy: true,
  sz: 1.0,
  reduce_only: false,
  nonce: 123456,
  r: r, // From EIP-712 signature above
  s: s, // From EIP-712 signature above
  v: v, // From EIP-712 signature above
  chainId: 1,
  orderId: 'optional-order-id', // Optional
  cloid: 'custom-client-order-id', // Optional
  threshold: 0.01, // Optional
});
```

#### Update Leverage

```typescript
const leverageResult = await sdk.updateLeverage({
  userAddress: '0x...',
  coin: 'BTC',
  leverage: 10,
  isCross: true,
  nonce
  r: '',
  s: '',
  v: 27
  chainId: 1
});
```

### Account Management

#### Connect User

```typescript
const connectResult = await sdk.connectUser({
  userAddress: '0x...',
  devicePublicKey: 'your-device-public-key',
});
```

#### Verify User Keys

**Important**: The `r`, `s`, `v` signature parameters required for `verifyUser` are generated during the `approveAgent` process. Use the same signature that you send to the Hyperliquid API `approveAgent` endpoint.

```typescript
const verifyResult = await sdk.verifyUser({
  userAddress: '0x...',
  agentAddress: '0x...',
  nonce: number,
  r: '0xabc', // From approveAgent signature
  s: '0xdef', // From approveAgent signature
  v: 27,      // From approveAgent signature
  chainId: 1,
});
```

#### Verify Device

This endpoint exists to make sure that the user device key matches the device key stored on our side.

```typescript
const deviceVerifyResult = await sdk.verifyDevice({
  signature: 'signature-string',
  nonce: number,
  agentAddress: '0x...',
  userAddress: '0x...',
  chainId: 1,
});
```

### Signature Generation

The SDK provides a helper method to generate EIP-712 signature data for different request types:

#### Generate Signature Data

```typescript
// For create order requests
const orderData = {
  nonce: 123456,
  coin: 'BTC',
  is_buy: true,
  reduce_only: false,
  userAddress: '0x...',
  chainId: 1,
};

const signatureData = sdk.generateSignatureData('createOrder', orderData);
// Returns: { domain, types, message } for EIP-712 signing

// For update leverage requests
const leverageData = {
  userAddress: '0x...',
  coin: 'BTC',
  leverage: 10,
  leverageType: 'cross',
  chainId: 1,
};

const leverageSignatureData = sdk.generateSignatureData('updateLeverage', leverageData);

// Use with ethers.js or similar library
const signature = await wallet.signTypedData(
  signatureData.domain,
  signatureData.types,
  signatureData.message
);

const { r, s, v } = ethers.utils.splitSignature(signature);
```

## Types

The SDK exports all types used in the API:

```typescript
import {
  LimitsOrderRequest,
  LeverageRequest,
  ConnectUserRequest,
  VerifyDeviceRequest,
  VerifyKeysRequest,
  OrderResponse,
  LeverageResponse,
  ConnectUserResponse,
  VerifyDeviceResponse,
  VerifyKeysResponse,
  LimitsSDKConfig,
  SDKError,
  SignatureType,
  SignatureData,
  EIP712Domain,
  EIP712Types,
} from 'limits-sdk';
```

## Error Handling

The SDK provides detailed error information:

```typescript
import { SDKError } from 'limits-sdk';

try {
  const result = await sdk.createOrder(orderRequest);
} catch (error) {
  if (error instanceof Error) {
    const sdkError = error as SDKError;
    
    console.error('Error:', sdkError.message);
    console.error('Code:', sdkError.code);
    console.error('Status:', sdkError.status);
    console.error('Response:', sdkError.response);
  }
}
```

## Configuration

```typescript
interface LimitsSDKConfig {
  baseURL?: string;  // Optional, defaults to 'http://localhost:3001/dmp'
  timeout?: number;  // Optional, defaults to 30000ms
  headers?: Record<string, string>; // Optional custom headers
}

// Default configuration
const sdk = new LimitsSDK();


```

## Examples

Check out the [examples](./examples) directory for more detailed usage examples:

- [Basic Usage](./examples/basic-usage.ts) - Simple trading operations
- [Advanced Usage](./examples/advanced-usage.ts) - Advanced features and error handling

## API Endpoints

The SDK covers the core API endpoints:

- `POST /order` - Create single order
- `POST /leverage` - Update leverage
- `POST /connect` - Connect user
- `PUT /connect` - Verify user keys
- `POST /verifyDevice` - Verify device

## Development

### Building

```bash
npm run build
```

### Testing

```bash
npm test
npm run test:watch
```

### Linting

```bash
npm run lint
npm run lint:fix
```

### Type Checking

```bash
npm run typecheck
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please contact the development team or create an issue in the repository.
