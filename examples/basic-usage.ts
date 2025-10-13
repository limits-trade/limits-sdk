import { LimitsSDK } from '../src';
import { ethers } from 'ethers';

// Initialize the SDK with default localhost configuration
const sdk = new LimitsSDK();

async function basicTradingExample(): Promise<void> {
    const devicePk = 'your-device-private-key';
    const privateKey = 'your-private-key';
    const device = new ethers.Wallet(devicePk);
    const wallet = new ethers.Wallet(privateKey);
    const userAddress = wallet.address
    const deviceAddress = device.address;

    try {
        console.log('🚀 Starting basic trading example...\n');

        // 1. Connect user first
        console.log('📱 Connecting user...');
        const connectionResult = await sdk.connectUser({
            userAddress,
            devicePublicKey: deviceAddress,
        });
        console.log('✅ User connected:', connectionResult);
        console.log();

        // 2. Submit Builder Fee Permit to HL
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

        // 3-4. Submit Agent Permit to HL and verifyUser
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
        console.log('🔑 Verifying user keys...');
        const verifyResult = await sdk.verifyUser({
            userAddress,
            agentAddress: connectionResult.hypePublicKey,
            nonce: nonceForAgent,
            r: sig.r,
            s: sig.s,
            v: sig.v,
            chainId: 1,
        });
        console.log('✅ User keys verified:', verifyResult);
        console.log();

        // 5. Set leverage
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

        // 6. Create an order
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

        // 7. Verify device
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
