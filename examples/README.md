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

// Example: Update leverage
async function updateLeverage() {
  try {
    const result = await sdk.updateLeverage({
      userAddress: '0x1234567890123456789012345678901234567890',
      coin: 'BTC',
      leverage: 10,
      leverageType: 'cross',
    });
    
    console.log('Leverage updated:', result);
  } catch (error) {
    console.error('Error updating leverage:', error);
  }
}

// Example: Create TWAP order
async function createTwapOrder() {
  try {
    const result = await sdk.createTwapOrder({
      userAddress: '0x1234567890123456789012345678901234567890',
      token: 'BTC',
      size: '1.0',
      frequency: '5',   // 5 minutes
      runtime: '60',    // 60 minutes total
      randomize: true,
      isBuy: true,
      threshold: 0.01,
    });
    
    console.log('TWAP order created:', result);
  } catch (error) {
    console.error('Error creating TWAP order:', error);
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
```

## Batch Operations

```typescript
// Example: Create multiple orders at once
async function createBatchOrders() {
  try {
    const result = await sdk.createBatchOrders({
      orders: [
        {
          userAddress: '0x1234567890123456789012345678901234567890',
          coin: 'BTC',
          is_buy: true,
          sz: 1.0,
          reduce_only: false,
        },
        {
          userAddress: '0x1234567890123456789012345678901234567890',
          coin: 'ETH',
          is_buy: false,
          sz: 2.5,
          reduce_only: false,
          limit_px: 3000,
          order_type: {
            limit: { tif: 'Gtc' },
          },
        },
      ],
    });
    
    console.log('Batch orders result:', result);
    console.log(`Successful orders: ${result.data?.successful}`);
    console.log(`Failed orders: ${result.data?.failed}`);
  } catch (error) {
    console.error('Error creating batch orders:', error);
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
  OrderRequest, 
  TwapRequest, 
  LeverageRequest,
  OrderType,
  Grouping 
} from 'limits-sdk';

// Example of using types for better development experience
const orderRequest: OrderRequest = {
  userAddress: '0x1234567890123456789012345678901234567890',
  coin: 'BTC',
  is_buy: true,
  sz: 1.0,
  reduce_only: false,
  limit_px: 50000,
  order_type: {
    limit: { tif: 'Gtc' }
  } as OrderType,
  grouping: 'na' as Grouping,
  cloid: 'my-custom-order-id',
};

const twapRequest: TwapRequest = {
  userAddress: '0x1234567890123456789012345678901234567890',
  token: 'BTC',
  size: '1.0',
  frequency: '5',
  runtime: '60',
  randomize: true,
  isBuy: true,
  threshold: 0.01,
};

const leverageRequest: LeverageRequest = {
  userAddress: '0x1234567890123456789012345678901234567890',
  coin: 'BTC',
  leverage: 10,
  leverageType: 'cross',
};
```
