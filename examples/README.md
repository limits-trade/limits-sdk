# Examples

This directory contains usage examples for the Limits SDK.

## Basic Usage

```typescript
import { LimitsSDK } from 'limits-sdk';
import { ethers } from 'ethers';

// Initialize the SDK with default localhost configuration
const sdk = new LimitsSDK();

async function basicTradingExample(): Promise<void> {
    const devicePk = ethers.Wallet.createRandom().privateKey;
    // Make sure you store the device private key as its used for all actions 

    const privateKey = 'your-private-key';
    const device = new ethers.Wallet(devicePk);
    const wallet = new ethers.Wallet(privateKey);
    const userAddress = wallet.address;
    const deviceAddress = device.address;

    try {
        console.log('🚀 Starting basic trading example...\n');

        // 1. Connect user first
        console.log('📱 Connecting user...');
        const connectionResult = await sdk.connectUser({
            userAddress,
            deviceAddress: deviceAddress,
        });
        console.log('✅ User connected:', connectionResult);

        // 2. Submit Builder Fee Permit to Hyperliquid
        const nonceForBuilder = Date.now();
        const permit = sdk.getHyperliquidPermit('approveBuilderFee', nonceForBuilder, 1n);
        const feeTypedData = sdk.createHyperliquidTypedData(permit.types, permit.message, 1n);
        const permitSignature = await wallet.signTypedData(
            feeTypedData.domain,
            permit.types,
            permit.message
        );
        const permitResult = await sdk.submitHLPermit(permit, permitSignature, 1);
        console.log('✅ Builder fee permit submitted:', permitResult);

        // 3. Submit Agent Permit to Hyperliquid and verify user
        const nonceForAgent = Date.now();
        const agentPermit = sdk.getHyperliquidPermit('approveAgent', nonceForAgent, 1n);
        const agentTypedData = sdk.createHyperliquidTypedData(agentPermit.types, agentPermit.message, 1n);
        const agentSignature = await wallet.signTypedData(
            agentTypedData.domain,
            agentPermit.types,
            agentPermit.message
        );
        const agentResult = await sdk.submitHLPermit(agentPermit, agentSignature, 1);
        console.log('✅ Agent permit submitted:', agentResult);

        const sig = ethers.Signature.from(agentSignature);
        const verifyResult = await sdk.verifyUser({
            userAddress,
            agentAddress: connectionResult.hypeApiAddress,
            nonce: nonceForAgent,
            r: sig.r,
            s: sig.s,
            v: sig.v,
            chainId: 1,
        });
        console.log('✅ User keys verified:', verifyResult);

        // 4. Set leverage
        console.log('⚖️ Setting cross leverage to 10x for BTC...');
        const leverageNonce = Date.now();
        const leverageSignatureData = sdk.generateSignatureData({
            userAddress,
            coin: 'BTC',
            nonce: leverageNonce,
            chainId: 1,
            signatureType: 'updateLeverage',
            leverage: 10,
            isCross: true,
        });

        const leverageSignature = await device.signTypedData(
            leverageSignatureData.domain,
            leverageSignatureData.types,
            leverageSignatureData.message
        );
        const leverageSig = ethers.Signature.from(leverageSignature);

        const leverageResult = await sdk.updateLeverage({
            userAddress,
            coin: 'BTC',
            leverage: 10,
            isCross: true,
            r: leverageSig.r,
            s: leverageSig.s,
            v: leverageSig.v,
            nonce: leverageNonce,
            chainId: 1,
        });
        console.log('✅ Leverage set:', leverageResult);

        // 5. Create an order
        console.log('💰 Creating buy order for 0.1 BTC...');
        const orderNonce = Date.now();

        const orderSignatureData = sdk.generateSignatureData({
            userAddress,
            coin: 'BTC',
            nonce: orderNonce,
            chainId: 1,
            signatureType: 'createOrder',
            isBuy: true,
            reduceOnly: false,
        });

        const orderSignature = await device.signTypedData(
            orderSignatureData.domain,
            orderSignatureData.types,
            orderSignatureData.message
        );
        const orderSig = ethers.Signature.from(orderSignature);

        const orderResult = await sdk.createOrder({
            userAddress,
            coin: 'BTC',
            isBuy: true,
            sz: 0.1,
            reduceOnly: false,
            nonce: orderNonce,
            r: orderSig.r,
            s: orderSig.s,
            v: orderSig.v,
            chainId: 1,
            threshold: 0.01,
        });
        console.log('✅ Order created:', orderResult);

        // 6. Verify device
        console.log('🔐 Verifying device...');
        const deviceNonce = Date.now();
        const agentAddress = '0x9876543210987654321098765432109876543210';

        const deviceSignatureData = sdk.generateSignatureData({
            userAddress,
            agentAddress,
            nonce: deviceNonce,
            chainId: 1,
            signatureType: 'verifyDevice',
        });

        const deviceSignature = await device.signTypedData(
            deviceSignatureData.domain,
            deviceSignatureData.types,
            deviceSignatureData.message
        );
        const deviceSig = ethers.Signature.from(deviceSignature);

        const deviceResult = await sdk.verifyDevice({
            r: deviceSig.r,
            s: deviceSig.s,
            v: deviceSig.v,
            nonce: deviceNonce,
            agentAddress,
            userAddress,
            chainId: 1,
        });
        console.log('✅ Device verified:', deviceResult);

        console.log('🎉 All operations completed successfully!');

    } catch (error) {
        console.error('❌ Error occurred:', error);
    }
}

// Run the example
basicTradingExample();
```

## Error Handling

```typescript
import { LimitsSDK } from 'limits-sdk';
import { ethers } from 'ethers';

const sdk = new LimitsSDK();

async function handleErrors() {
  const devicePk = 'your-device-private-key';
  const privateKey = 'your-private-key';
  const device = new ethers.Wallet(devicePk);
  const wallet = new ethers.Wallet(privateKey);
  const userAddress = wallet.address;

  try {
    // Example: Create an order with proper signature generation
    const orderNonce = Date.now();
    
    const orderSignatureData = sdk.generateSignatureData({
      userAddress,
      coin: 'BTC',
      nonce: orderNonce,
      chainId: 1,
      signatureType: 'createOrder',
      isBuy: true,
      reduceOnly: false,
    });

    const orderSignature = await device.signTypedData(
      orderSignatureData.domain,
      orderSignatureData.types,
      orderSignatureData.message
    );
    const orderSig = ethers.Signature.from(orderSignature);

    const result = await sdk.createOrder({
      userAddress,
      coin: 'BTC',
      isBuy: true,
      sz: 0.1,
      reduceOnly: false,
      nonce: orderNonce,
      r: orderSig.r,
      s: orderSig.s,
      v: orderSig.v,
      chainId: 1,
      threshold: 0.01,
    });
    
    console.log('Order created successfully:', result);
  } catch (error) {
    console.error('❌ Error occurred:', error);
    
    if (error instanceof Error) {
      const sdkError = error as any;
      
      console.error('Error details:');
      console.error('Message:', sdkError.message);
      
      if (sdkError.code) {
        console.error('Code:', sdkError.code);
      }
      
      if (sdkError.status) {
        console.error('Status:', sdkError.status);
        
        // Handle specific HTTP status codes
        if (sdkError.status === 400) {
          console.error('Bad request - check your parameters');
        } else if (sdkError.status === 401) {
          console.error('Unauthorized - check your API credentials');
        } else if (sdkError.status === 403) {
          console.error('Forbidden - insufficient permissions');
        } else if (sdkError.status >= 500) {
          console.error('Server error - try again later');
        }
      }
      
      if (sdkError.response) {
        console.error('Response:', sdkError.response);
      }
      
      // Handle specific error types
      if (sdkError.code === 'NETWORK_ERROR') {
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
import { ethers } from 'ethers';

// Example of using types for better development experience
const sdk = new LimitsSDK();
const userAddress = '0x1234567890123456789012345678901234567890';
const deviceAddress = '0x9876543210987654321098765432109876543210';
const agentAddress = '0x1111111111111111111111111111111111111111';

// Connect user request
const connectRequest: ConnectUserRequest = {
  userAddress,
  deviceAddress,
};

// Order request with signature generation
const orderNonce = Date.now();
const orderSignatureData = sdk.generateSignatureData({
  userAddress,
  coin: 'BTC',
  nonce: orderNonce,
  chainId: 1,
  signatureType: 'createOrder',
  isBuy: true,
  reduceOnly: false,
});

// After signing with device wallet
const orderSig = ethers.Signature.from('0x...' /* signature from device */);
const orderRequest: LimitsOrderRequest = {
  userAddress,
  coin: 'BTC',
  isBuy: true,
  sz: 0.1,
  reduceOnly: false,
  nonce: orderNonce,
  r: orderSig.r,
  s: orderSig.s,
  v: orderSig.v,
  chainId: 1,
  threshold: 0.01, // Optional
  orderId: 'my-order-id', // Optional
  cloid: 'my-custom-order-id', // Optional
};

// Leverage request with signature generation
const leverageNonce = Date.now();
const leverageSignatureData = sdk.generateSignatureData({
  userAddress,
  coin: 'BTC',
  nonce: leverageNonce,
  chainId: 1,
  signatureType: 'updateLeverage',
  leverage: 10,
  isCross: true,
});

// After signing with device wallet
const leverageSig = ethers.Signature.from('0x...' /* signature from device */);
const leverageRequest: LeverageRequest = {
  userAddress,
  coin: 'BTC',
  leverage: 10,
  isCross: true,
  r: leverageSig.r,
  s: leverageSig.s,
  v: leverageSig.v,
  nonce: leverageNonce,
  chainId: 1,
};

// Verify user keys request
const verifyKeysNonce = Date.now();
const verifyKeysSig = ethers.Signature.from('0x...' /* signature from user wallet */);
const verifyKeysRequest: VerifyKeysRequest = {
  userAddress,
  agentAddress,
  nonce: verifyKeysNonce,
  r: verifyKeysSig.r,
  s: verifyKeysSig.s,
  v: verifyKeysSig.v,
  chainId: 1,
};

// Verify device request
const deviceNonce = Date.now();
const deviceSig = ethers.Signature.from('0x...' /* signature from device wallet */);
const verifyDeviceRequest: VerifyDeviceRequest = {
  r: deviceSig.r,
  s: deviceSig.s,
  v: deviceSig.v,
  nonce: deviceNonce,
  agentAddress,
  userAddress,
  chainId: 1,
};

// Hyperliquid permit types
const builderFeePermit = sdk.getHyperliquidPermit('approveBuilderFee', Date.now(), 1n, connectionResult.hypeApiAddress);
const agentPermit = sdk.getHyperliquidPermit('approveAgent', Date.now(), 1n);

// Typed data for signing
const typedData = sdk.createHyperliquidTypedData(
  agentPermit.types, 
  agentPermit.message, 
  1n
);
```
