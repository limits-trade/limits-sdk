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

// Initialize the SDK with default configuration
const sdk = new LimitsSDK();

// Or initialize with custom configuration
const sdk = new LimitsSDK({
  baseURL: 'https://api.your-platform.com', // Optional, defaults to http://localhost:3001/dmp
  timeout: 30000,
  headers: {
    'Authorization': 'Bearer your-token', // if required
  },
});

// Create an order
const result = await sdk.createOrder({
  userAddress: '0x1234567890123456789012345678901234567890',
  coin: 'BTC',
  is_buy: true,
  sz: 1.0,
  reduce_only: false,
  nonce: '123456',
  r: '0xabc',
  s: '0xdef',
  v: 27,
  chainId: 1,
});
```

## API Reference

### Trading Operations

#### Create Order

```typescript
const orderResult = await sdk.createOrder({
  userAddress: '0x...',
  coin: 'BTC',
  is_buy: true,
  sz: 1.0,
  reduce_only: false,
  nonce: '123456',
  r: '0xabc',
  s: '0xdef',
  v: 27,
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
  leverageType: 'cross', // 'cross' or 'isolated'
  privateKey: 'optional-private-key', // Optional
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

```typescript
const verifyResult = await sdk.verifyUser({
  userAddress: '0x...',
  agentAddress: '0x...',
  nonce: 'nonce-string',
  r: '0xabc',
  s: '0xdef',
  v: 27,
  chainId: 1,
});
```

#### Verify Device

```typescript
const deviceVerifyResult = await sdk.verifyDevice({
  signature: 'signature-string',
  nonce: 'nonce-string',
  agentAddress: '0x...',
  userAddress: '0x...',
  chainId: 1, // Optional
});
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

// Custom configuration
const sdk = new LimitsSDK({
  baseURL: 'https://api.your-platform.com',
  timeout: 30000, // 30 seconds
  headers: {
    'Authorization': 'Bearer your-token',
    'X-API-Key': 'your-api-key',
  },
});
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
