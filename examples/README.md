# Examples

This directory contains usage examples for the Limits SDK.

## Basic Usage

```typescript
import { LimitsSDK } from 'limits-sdk';

// Initialize the SDK
const sdk = new LimitsSDK({
  baseURL: 'https://api.your-platform.com',
  timeout: 30000,
  headers: {
    'X-API-Key': 'your-api-key', // if required
  },
});

// Example: Create Order
async function createOrder() {
  try {
    const result = await sdk.createOrder({
      userAddress: '0x1234567890123456789012345678901234567890',
      coin: 'BTC',
      is_buy: true,
      sz: 1.0,
      reduce_only: false,
      nonce: '123456',
      r: '0xabc123',
      s: '0xdef456',
      v: 27,
      chainId: 1,
      orderId: 'optional-order-id', // Optional
      cloid: 'custom-client-order-id', // Optional
      threshold: 0.01, // Optional
    });
    
    console.log('Order created:', result);
  } catch (error) {
    console.error('Error creating order:', error);
  }
}

// Example: Update leverage
async function updateLeverage() {
  try {
    const result = await sdk.updateLeverage({
      userAddress: '0x1234567890123456789012345678901234567890',
      coin: 'BTC',
      leverage: 10,
      leverageType: 'cross',
      privateKey: 'optional-private-key', // Optional
    });
    
    console.log('Leverage updated:', result);
  } catch (error) {
    console.error('Error updating leverage:', error);
  }
}

// Example: Connect user
async function connectUser() {
  try {
    const result = await sdk.connectUser({
      userAddress: '0x1234567890123456789012345678901234567890',
      devicePublicKey: 'your-device-public-key',
    });
    
    console.log('User connected:', result);
  } catch (error) {
    console.error('Error connecting user:', error);
  }
}

// Example: Verify user keys
async function verifyUser() {
  try {
    const result = await sdk.verifyUser({
      userAddress: '0x1234567890123456789012345678901234567890',
      agentAddress: '0x9876543210987654321098765432109876543210',
      nonce: '789012',
      r: '0xabc789',
      s: '0xdef012',
      v: 28,
      chainId: 1,
    });
    
    console.log('User verified:', result);
  } catch (error) {
    console.error('Error verifying user:', error);
  }
}

// Example: Verify device
async function verifyDevice() {
  try {
    const result = await sdk.verifyDevice({
      signature: '0xsignature123',
      nonce: '345678',
      agentAddress: '0x9876543210987654321098765432109876543210',
      userAddress: '0x1234567890123456789012345678901234567890',
      chainId: 1, // Optional
    });
    
    console.log('Device verified:', result);
  } catch (error) {
    console.error('Error verifying device:', error);
  }
}
```

## Error Handling

```typescript
import { SDKError } from 'limits-sdk';

async function handleErrors() {
  try {
    const result = await sdk.createOrder({
      userAddress: '0x1234567890123456789012345678901234567890',
      coin: 'BTC',
      is_buy: true,
      sz: 1.0,
      reduce_only: false,
      nonce: '123456',
      r: '0xabc123',
      s: '0xdef456',
      v: 27,
      chainId: 1,
    });
    
    console.log('Order created successfully:', result);
  } catch (error) {
    if (error instanceof Error) {
      const sdkError = error as SDKError;
      
      console.error('Error details:');
      console.error('Message:', sdkError.message);
      console.error('Code:', sdkError.code);
      console.error('Status:', sdkError.status);
      console.error('Response:', sdkError.response);
      
      // Handle specific error types
      if (sdkError.status === 400) {
        console.error('Bad request - check your parameters');
      } else if (sdkError.status === 401) {
        console.error('Unauthorized - check your API credentials');
      } else if (sdkError.code === 'NETWORK_ERROR') {
        console.error('Network error - check your connection');
      }
    }
  }
}
```

## TypeScript Types

```typescript
import { 
  LimitsOrderRequest, 
  LeverageRequest,
  ConnectUserRequest,
  VerifyDeviceRequest,
  VerifyKeysRequest,
} from 'limits-sdk';

// Example of using types for better development experience
const orderRequest: LimitsOrderRequest = {
  userAddress: '0x1234567890123456789012345678901234567890',
  coin: 'BTC',
  is_buy: true,
  sz: 1.0,
  reduce_only: false,
  nonce: '123456',
  r: '0xabc123',
  s: '0xdef456',
  v: 27,
  chainId: 1,
  orderId: 'my-order-id', // Optional
  cloid: 'my-custom-order-id', // Optional
  threshold: 0.01, // Optional
};

const leverageRequest: LeverageRequest = {
  userAddress: '0x1234567890123456789012345678901234567890',
  coin: 'BTC',
  leverage: 10,
  leverageType: 'cross',
  privateKey: 'optional-private-key', // Optional
};

const connectRequest: ConnectUserRequest = {
  userAddress: '0x1234567890123456789012345678901234567890',
  devicePublicKey: 'device-public-key',
};

const verifyKeysRequest: VerifyKeysRequest = {
  userAddress: '0x1234567890123456789012345678901234567890',
  agentAddress: '0x9876543210987654321098765432109876543210',
  nonce: '789012',
  r: '0xabc789',
  s: '0xdef012',
  v: 28,
  chainId: 1,
};

const verifyDeviceRequest: VerifyDeviceRequest = {
  signature: '0xsignature123',
  nonce: '345678',
  agentAddress: '0x9876543210987654321098765432109876543210',
  userAddress: '0x1234567890123456789012345678901234567890',
  chainId: 1, // Optional
};
```
