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
npm install limits-sdk
```

## Quick Start

```typescript
import { LimitsSDK } from "limits-sdk";
import { ethers } from "ethers";

// Initialize the SDK with default configuration
const sdk = new LimitsSDK();

// Setup your device wallet
const devicePrivateKey = ethers.Wallet.createRandom().privateKey;
// Make sure you store the device private key as its used for all actions
const device = new ethers.Wallet(devicePrivateKey);
const deviceAddress = device.address;

async function quickStart() {
  const userAddress = "0x1234567890123456789012345678901234567890";

  // Step 1: Connect user
  const connectionResult = await sdk.connectUser({
    userAddress,
    deviceAddress: deviceAddress,
  });

  // Step 1.5
  // Approve BuilderFee and Agent
  // Please refer to examples/basic-usage.ts

  // Step 2: Verify user keys (required before trading)
  const verifyResult = await sdk.verifyUser({
    userAddress,
    agentAddress: connectionResult.hypeApiAddress,
    nonce: Date.now(),
    r: "0xabc123...", // From approveAgent signature
    s: "0xdef456...", // From approveAgent signature
    v: 27,
    chainId: 1,
  });

  // Step 3: Create an order
  const orderNonce = Date.now();

  // Generate EIP-712 signature data using the SDK helper
  const signatureData = sdk.generateSignatureData({
    userAddress,
    coin: "BTC",
    nonce: orderNonce,
    chainId: 1,
    signatureType: "createOrder",
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
    coin: "BTC",
    is_buy: true,
    sz: 1.0,
    reduce_only: false,
    nonce: orderNonce,
    r,
    s,
    v,
    chainId: 1,
  });
}
```

See [Basic Usage](./examples/basic-usage.ts) for more details.

## TL;DR - How it works

A **User** authorizes a **Device** (an Ethereum wallet acting as a client) to trade on Hyperliquid on their behalf through the Limits SDK.

The setup follows these key steps:

1. **Connect User** – Link the user’s wallet address to a device address.
2. **Approve Builder Fee** – The user signs a permit allowing the SDK to handle builder fees on Hyperliquid.
3. **Approve Agent & Verify User** – The user signs an agent permit, then verifies that the device is authorized to act for them.
4. **Verify Device** – Final check confirming the device identity before further operations.
5. **Set Leverage** – The verified device adjusts account settings like leverage or margin mode.
6. **Place Orders** – The device signs and submits orders to Hyperliquid using its private key.

## 💡 FAQ

### ❓ What is a Device?

In our SDK, a **Device** represents a _client instance_ — similar to an agent in Hyperliquid’s terminology.
A Device is essentially an **Ethereum wallet** that holds a **public** and **private key pair**, which function as your **public** and **secret API keys** within the system.

Each Device acts as an authenticated entity that can interact with the network — whether it’s **a browser**, **backend service**, or **automation script**.

In short, a Device is the **identity and access key** your application uses to securely communicate with our platform.

### ❓ What is a User?

A **User** is the account owner whose funds, positions, and orders are managed through the SDK.
Each user is identified by their **Ethereum wallet address** controlling the Hyperliquid account and can authorize one or more Devices to act on their behalf.

### ❓ What is a Builder Fee Permit?

Before a user can interact with the Hyperliquid protocol through the SDK, they must grant permission for builder fees.
This is done by submitting a **Builder Fee Permit**, signed by the **User wallet**. It’s the first step in initializing a secure connection to the network.

### ❓ What does `verifyUser` do?

`verifyUser` links the **User wallet** and **Device wallet** on-chain.
It proves that the Device is authorized to act on behalf of the User by validating a signed message (using both key pairs).
This step must be completed before any trading or leverage operations.

### ❓ What is `verifyDevice` for?

`verifyDevice` ensures that the Device itself has valid credentials and can securely interact with the SDK and Hyperliquid API.
Think of it as confirming the Device’s identity after initial setup or when reconnecting.

### ❓ Why do I need to sign multiple permits (builder fee, agent, device)?

Each signature serves a different purpose:

- Builder Fee Permit → Approves SDK fees for using Hyperliquid.
- Agent Permit → Grants the SDK the right to act as a Hyperliquid agent.
- Device Verification → Confirms your Device identity and ties it to your user wallet.
  These steps ensure strong authentication and minimize the attack surface.

### ❓ Can I reuse the same Device for multiple users?

Yes, but it’s generally **not recommended** for production environments.
Each user should ideally have a dedicated Device wallet to maintain clear key separation and simplify permission management.

### ❓ How should I store Device private keys?

Treat Device keys like API secrets:

- Never commit them to source control.
- Use secure key storage (e.g., environment variables, AWS Secrets Manager, HashiCorp Vault).

## Usage

### Create Order

Before creating orders, ensure you've connected and verified your device using `connectUser()` and `verifyUser()`. The device private key from that flow must be used to sign order requests.

```typescript
// First, sign the order data with your device private key using EIP-712
// Use the domain, types, and message structure shown in Quick Start
const signature = await wallet.signTypedData(domain, types, message);
const { r, s, v } = ethers.utils.splitSignature(signature);

const orderResult = await sdk.createOrder({
  userAddress: "0x...",
  coin: "BTC",
  is_buy: true,
  sz: 1.0,
  reduce_only: false,
  nonce: 123456,
  r: r, // From EIP-712 signature above
  s: s, // From EIP-712 signature above
  v: v, // From EIP-712 signature above
  chainId: 1,
  orderId: "optional-order-id", // Optional
  cloid: "custom-client-order-id", // Optional
  threshold: 0.01, // Optional
});
```

### Update Leverage

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

### Connect User

```typescript
const connectResult = await sdk.connectUser({
  userAddress: "0x...",
  devicePublicKey: "your-device-public-key",
});
```

### Verify User Keys

**Important**: The `r`, `s`, `v` signature parameters required for `verifyUser` are generated during the `approveAgent` process. Use the same signature that you send to the Hyperliquid API `approveAgent` endpoint.

```typescript
const verifyResult = await sdk.verifyUser({
  userAddress: "0x...",
  agentAddress: "0x...",
  nonce: number,
  r: "0xabc", // From approveAgent signature
  s: "0xdef", // From approveAgent signature
  v: 27, // From approveAgent signature
  chainId: 1,
});
```

### Verify Device

This endpoint exists to make sure that the user device key matches the device key stored on our side.

```typescript
const deviceVerifyResult = await sdk.verifyDevice({
  signature: "signature-string",
  nonce: number,
  agentAddress: "0x...",
  userAddress: "0x...",
  chainId: 1,
});
```

### Generate Signature Data

The SDK provides a helper method to generate EIP-712 signature data for different request types:

```typescript
// For create order requests
const orderData = {
  nonce: 123456,
  coin: "BTC",
  is_buy: true,
  reduce_only: false,
  userAddress: "0x...",
  chainId: 1,
};

const signatureData = sdk.generateSignatureData("createOrder", orderData);
// Returns: { domain, types, message } for EIP-712 signing

// For update leverage requests
const leverageData = {
  userAddress: "0x...",
  coin: "BTC",
  leverage: 10,
  leverageType: "cross",
  chainId: 1,
};

const leverageSignatureData = sdk.generateSignatureData(
  "updateLeverage",
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
} from "limits-sdk";
```

## Error Handling

The SDK provides detailed error information:

```typescript
import { SDKError } from "limits-sdk";

try {
  const result = await sdk.createOrder(orderRequest);
} catch (error) {
  if (error instanceof Error) {
    const sdkError = error as SDKError;

    console.error("Error:", sdkError.message);
    console.error("Code:", sdkError.code);
    console.error("Status:", sdkError.status);
    console.error("Response:", sdkError.response);
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
