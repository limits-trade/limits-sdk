import { LimitsSDK } from '../src';
import { ethers } from 'ethers';

// Initialize the SDK with default localhost configuration
const sdk = new LimitsSDK();

async function basicTradingExample(): Promise<void> {
    const userAddress = '0x1234567890123456789012345678901234567890';
    const devicePk = 'your-device-private-key';
    const device = new ethers.Wallet(devicePk);

    try {
        console.log('🚀 Starting basic trading example...\n');

        // 1. Connect user first
        console.log('📱 Connecting user...');
        const connectionResult = await sdk.connectUser({
            userAddress,
            devicePublicKey: 'your-device-public-key',
        });
        console.log('✅ User connected:', connectionResult);
        console.log();

        // 2. Verify user keys
        console.log('🔑 Verifying user keys...');
        const verifyResult = await sdk.verifyUser({
            userAddress,
            agentAddress: '0x9876543210987654321098765432109876543210',
            nonce: Date.now(),
            r: '0xabc123def456789abc123def456789abc123def456789abc123def456789abc123',
            s: '0xdef456abc789123def456abc789123def456abc789123def456abc789123def456',
            v: 27,
            chainId: 1,
        });
        console.log('✅ User keys verified:', verifyResult);
        console.log();

        // 3. Set leverage
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
        console.log();

        // 4. Create an order
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
            is_buy: true,
            sz: 0.1,
            reduce_only: false,
            nonce: orderNonce.toString(),
            r: orderSig.r,
            s: orderSig.s,
            v: orderSig.v,
            chainId: 1,
            threshold: 0.01,
        });
        console.log('✅ Order created:', orderResult);
        console.log();

        // 5. Verify device
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
        console.log();

        console.log('🎉 All operations completed successfully!');

    } catch (error) {
        console.error('❌ Error occurred:', error);

        // Type-safe error handling
        if (error instanceof Error) {
            const sdkError = error as any;
            if (sdkError.status) {
                console.error(`HTTP Status: ${sdkError.status}`);
            }
            if (sdkError.response) {
                console.error('Response data:', sdkError.response);
            }
        }
    }
}

// Run examples
if (require.main === module) {
    (async () => {
        await basicTradingExample();
        console.log('\n' + '='.repeat(50) + '\n');
    })();
}
