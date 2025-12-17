# Limits SDK

A TypeScript SDK for interacting with the Limits trading platform API. This SDK provides type-safe methods for trading operations, account management, and device verification.

## Features

- 🔒 **Type Safety**: Full TypeScript support with comprehensive type definitions
- 🚀 **Easy to Use**: Simple, intuitive API for core trading operations
- **Error Handling**: Comprehensive error handling with detailed error types
- 🌐 **HTTP Client**: Built-in HTTP client with request/response interceptors
- 📚 **Well Documented**: Extensive documentation and examples

## Installation

```bash
npm i @limits-trade/limits-sdk
```

## Quick Start

```typescript
import { LimitsSDK } from '@limits-trade/limits-sdk';
import { ethers } from 'ethers';

// Initialize the SDK with default configuration
const sdk = new LimitsSDK();

// Setup your device wallet
const devicePk = ethers.Wallet.createRandom().privateKey;
// Make sure you store the device private key as its used for all actions
const device = new ethers.Wallet(devicePrivateKey);
const deviceAddress = device.address;

async function quickStart() {
  const userAddress = '0x1234567890123456789012345678901234567890';

  // Step 1 (Optional): Assign CLOID for volume tracking
  let cloid: string;

  const cloidResult = await sdk.assignCloid({ address: userAddress });
  cloid = cloidResult.data.cloid;

  // Step 2: Connect user
  const connectionResult = await sdk.connectUser({
    userAddress,
    deviceAddress: deviceAddress,
  });

  // Step 2.5
  // Approve BuilderFee and Agent
  // Please refer to examples/basic-usage.ts

  // Step 3: Verify user keys (required before trading)
  const verifyResult = await sdk.verifyUser({
    userAddress,
    agentAddress: connectionResult.hypeApiAddress,
    nonce: Date.now(),
    r: '0xabc123...', // From approveAgent signature
    s: '0xdef456...', // From approveAgent signature
    v: 27,
    chainId: 1,
  });

  // Step 4: Create an order
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
    isBuy: true,
    sz: 1.0,
    reduceOnly: false,
    nonce: orderNonce,
    r,
    s,
    v,
    chainId: 1,
    cloid, // Include CLOID if assigned for volume tracking
  });
}
```

## API Reference

### Trading Operations

#### Create Order

Before creating orders, ensure you've connected and verified your device using `connectUser()` and `verifyUser()`. The device private key from that flow must be used to sign order requests.

```typescript
// First, sign the order data with your device private key using EIP-712
// Use the domain, types, and message structure shown in Quick Start
const signature = await wallet.signTypedData(domain, types, message);
const { r, s, v } = ethers.utils.splitSignature(signature);

const orderResult = await sdk.createOrder({
  userAddress: '0x...',
  coin: 'BTC',
  isBuy: true,
  sz: 1.0,
  reduceOnly: false,
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

#### Create Batch Orders

Create multiple orders in a single request with validation and leverage parameters:

```typescript
// First, generate signature data for batch orders
const nonce = Date.now();
const signatureData = sdk.generateSignatureData({
  signatureType: 'createOrders',
  userAddress: '0x...',
  nonce,
  chainId: 1,
  orders: [
    {
      coin: 'BTC',
      isBuy: true,
      reduceOnly: false,
    },
    {
      coin: 'ETH',
      isBuy: false,
      reduceOnly: false,
    },
  ],
});

// Sign with your device private key
const signature = await device.signTypedData(
  signatureData.domain,
  signatureData.types,
  signatureData.message
);
const sig = ethers.Signature.from(signature);
const { r, s, v } = sig;

// Create the batch order request
const batchOrderResult = await sdk.createOrders({
  userAddress: '0x...',
  validateOrder: true,
  validationParams: {
    leverage: 10,
    managementInterval: 3000,
    builderFee: 15,
    builderAddress: '0x746337a98821e1e38AA2bAd0e77900d98B80609e',
    takerFallbackInterval: 60000,
  },
  nonce,
  r,
  s,
  v,
  chainId: 1,
  orders: [
    {
      coin: 'BTC',
      cloid: '0x4c494d495470a25c11944846c4cf3bb1',
      isBuy: true,
      sz: '0.00022',
      reduceOnly: false,
    },
    {
      coin: 'ETH',
      cloid: '0x4c494d495470a25c11944846c4cf3bb2',
      isBuy: false,
      sz: '0.01',
      reduceOnly: false,
    },
  ],
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
  deviceAddress: 'your-device-address',
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
  v: 27, // From approveAgent signature
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
  isBuy: true,
  reduceOnly: false,
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
  isCross: true,
  chainId: 1,
};

const leverageSignatureData = sdk.generateSignatureData(
  'updateLeverage',
  leverageData
);

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
  baseURL?: string; // Optional, defaults to 'http://localhost:3001/dmp'
  timeout?: number; // Optional, defaults to 30000ms
  headers?: Record<string, string>; // Optional custom headers
}

// Default configuration
const sdk = new LimitsSDK();
```

## Examples

Check out the [examples](./examples) directory for more detailed usage examples:

- [Basic Usage](./examples/basic-usage.ts) - Simple trading operations

## Integrations

### Client Order ID (CLOID) Management

Client Order IDs (CLOIDs) are used to track integrations and associate trading volume with specific partners on the Hyperliquid core. When orders are submitted with a CLOID, they can be tracked for volume attribution and rewards distribution.

#### What is a CLOID?

- A CLOID is a 128-bit hexadecimal identifier used to track integration volume
- It associates trading activity with specific integrators for rewards distribution
- CLOIDs can be auto-generated by the system or provided by the integrator
- Once assigned to an address, all orders from that address will use the assigned CLOID
- The CLOID must be passed in the `placeOrder` request for correct volume tracking on Hyperliquid

#### Assign CLOID

Assign a CLOID to an address for volume tracking and rewards distribution:

```typescript
// Option 1: Let the system generate a CLOID
const assignResult = await sdk.assignCloid({
  address: '0x1234567890123456789012345678901234567890',
});

// Option 2: Provide your own 128-bit hex CLOID
const customCloid = '0x' + 'a'.repeat(32); // 128-bit hex string
const assignResult = await sdk.assignCloid({
  address: '0x1234567890123456789012345678901234567890',
  cloid: customCloid,
});

// Response structure
interface AssignCloidResponse {
  success: boolean;
  message: string;
  data: {
    address: string;
    cloid?: string;
  };
}
```

#### Get CLOID

Retrieve the assigned CLOID for an Ethereum address:

```typescript
const cloidResult = await sdk.getCloid(
  '0x1234567890123456789012345678901234567890'
);

// Response structure
interface GetCloidResponse {
  success: boolean;
  message: string;
  data: {
    address: string;
    cloid?: string; // undefined if no CLOID is assigned
  };
}
```

#### Integration Workflow

1. **Assign CLOID**: Use `assignCloid()` to associate a CLOID with user addresses
2. **Track Volume**: All orders from addresses with assigned CLOIDs will be tracked
3. **Rewards Distribution**: Volume attribution enables proper rewards distribution to integrators

```typescript
// Complete integration workflow
async function setupIntegration() {
  const userAddress = '0x1234567890123456789012345678901234567890';

  // Step 1: Assign CLOID for tracking
  const assignResult = await sdk.assignCloid({
    address: userAddress,
    // cloid: customCloid // Optional: provide your own CLOID
  });

  if (assignResult.success) {
    console.log(`CLOID assigned: ${assignResult.data.cloid}`);

    // Step 2: Verify assignment
    const cloidResult = await sdk.getCloid(userAddress);
    console.log(`Retrieved CLOID: ${cloidResult.data.cloid}`);

    // Step 3: All subsequent orders from this address will be tracked
    // ... proceed with normal order creation workflow
  }
}
```

#### Error Handling

```typescript
try {
  const result = await sdk.assignCloid({
    address: '0x1234567890123456789012345678901234567890',
  });

  if (!result.success) {
    console.error('Assignment failed:', result.message);
    // Handle business logic errors (e.g., CLOID already assigned)
  }
} catch (error) {
  console.error('Request failed:', error.message);
  // Handle network/validation errors
}
```

#### CLOID Requirements

- **Format**: 128-bit hexadecimal string (32 hex characters after '0x')
- **Uniqueness**: Each CLOID should be unique across the system
- **Persistence**: Once assigned, CLOIDs remain associated with the address
- **Usage**: All orders from addresses with CLOIDs will include the CLOID for tracking

## API Endpoints

The SDK covers the core API endpoints:

- `POST /order` - Create single order
- `POST /leverage` - Update leverage
- `POST /connect` - Connect user
- `PUT /connect` - Verify user keys
- `POST /verifyDevice` - Verify device
- `POST /assignCloid` - Assign CLOID to address
- `GET /getCloid/:address` - Get CLOID for address

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
