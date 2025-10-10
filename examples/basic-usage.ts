import { LimitsSDK } from '../src';
import { ethers } from 'ethers';
// Initialize the SDK with default localhost configuration
const sdk = new LimitsSDK();

// Or initialize with custom configuration
// const sdk = new LimitsSDK({
//   baseURL: 'https://api.your-platform.com',
//   timeout: 30000,
//   headers: {
//     'Authorization': 'Bearer your-jwt-token', // if required
//   },
// });

async function basicTradingExample(): Promise<void> {
    const userAddress = '0x1234567890123456789012345678901234567890';
    const devicePk = 'your-device-private-key';
    const user = new ethers.Wallet(devicePk);

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

        // 2. Set leverage
        console.log('⚖️ Setting cross leverage to 10x for BTC...');
        const leverageResult = await sdk.updateLeverage({
            userAddress,
            coin: 'BTC',
            leverage: 10,
            isCross: true,
        });
        console.log('✅ Leverage set:', leverageResult);
        console.log();

        // 3. Create an order
        console.log('💰 Creating buy order for 0.1 BTC...');
        const nonce = Date.now();

        const domain = {
            name: 'LimitsTrade',
            version: '1',
            chainId: 1,
        };

        const types = {
            VerifyOrder: [
                { name: 'nonce', type: 'unit64' },
                { name: 'coin', type: 'string' },
                { name: 'isBuy', type: 'bool' },
                { name: 'reduceOnly', type: 'bool' },
                { name: 'userAddress', type: 'string' },
            ],
        };

        const message = {
            nonce,
            coin: 'BTC',
            isBuy: true,
            reduceOnly: false,
            userAddress,
        };

        const signature = await user.signTypedData(domain, types, message);
        const sig = ethers.Signature.from(signature);
        const { r, s, v } = sig;

        const orderResult = await sdk.createOrder({
            userAddress,
            coin: 'BTC',
            is_buy: true,
            sz: 0.1,
            reduce_only: false,
            nonce: Date.now().toString(),
            r,
            s,
            v,
            chainId: 1,
            threshold: 0.01,
        });
        console.log('✅ Order created:', orderResult);
        console.log();

        // 4. Verify user keys
        console.log('� Verifying user keys...');
        const verifyResult = await sdk.verifyUser({
            userAddress,
            agentAddress: '0x9876543210987654321098765432109876543210',
            nonce: Date.now().toString(),
            r: '0xabc123def456789abc123def456789abc123def456789abc123def456789abc123',
            s: '0xdef456abc789123def456abc789123def456abc789123def456abc789123def456',
            v: 27,
            chainId: 1,
        });
        console.log('✅ User keys verified:', verifyResult);
        console.log();

        // 5. Verify device
        console.log('� Verifying device...');
        const deviceResult = await sdk.verifyDevice({
            signature: '0xdevicesignature123',
            nonce: Date.now().toString(),
            agentAddress: '0x9876543210987654321098765432109876543210',
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

async function leverageManagementExample(): Promise<void> {
    const userAddress = '0x1234567890123456789012345678901234567890';

    try {
        console.log('🚀 Starting leverage management example...\n');

        // Set cross leverage for multiple coins
        const coins = ['BTC', 'ETH', 'SOL'];
        const leverages = [10, 15, 20];

        for (let i = 0; i < coins.length; i++) {
            console.log(`⚖️ Setting ${leverages[i]}x cross leverage for ${coins[i]}...`);
            const result = await sdk.updateLeverage({
                userAddress,
                coin: coins[i],
                leverage: leverages[i],
                leverageType: 'cross',
            });
            console.log(`✅ ${coins[i]} leverage set:`, result);
        }

        // Set isolated leverage for specific trading
        console.log('🎯 Setting 25x isolated leverage for BTC...');
        const isolatedResult = await sdk.updateLeverage({
            userAddress,
            coin: 'BTC',
            leverage: 25,
            leverageType: 'isolated',
        });
        console.log('✅ Isolated leverage set:', isolatedResult);

    } catch (error) {
        console.error('❌ Leverage management error:', error);
    }
}

// Run examples
if (require.main === module) {
    (async () => {
        await basicTradingExample();
        console.log('\n' + '='.repeat(50) + '\n');
        await leverageManagementExample();
    })();
}
