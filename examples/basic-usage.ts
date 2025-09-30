import { LimitsSDK } from '../src';

// Initialize the SDK
const sdk = new LimitsSDK({
  baseURL: 'https://api.your-platform.com',
  timeout: 30000,
  headers: {
    'Authorization': 'Bearer your-jwt-token', // if required
  },
});

async function basicTradingExample(): Promise<void> {
  const userAddress = '0x1234567890123456789012345678901234567890';

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
      leverageType: 'cross',
    });
    console.log('✅ Leverage set:', leverageResult);
    console.log();

    // 3. Create a market buy order
    console.log('💰 Creating market buy order for 0.1 BTC...');
    const marketBuyResult = await sdk.createOrder({
      userAddress,
      coin: 'BTC',
      is_buy: true,
      sz: 0.1,
      reduce_only: false,
    });
    console.log('✅ Market buy order created:', marketBuyResult);
    console.log();

    // 4. Create a limit sell order
    console.log('📈 Creating limit sell order for 0.05 BTC at $55,000...');
    const limitSellResult = await sdk.createOrder({
      userAddress,
      coin: 'BTC',
      is_buy: false,
      sz: 0.05,
      limit_px: 55000,
      reduce_only: false,
      order_type: {
        limit: { tif: 'Gtc' },
      },
    });
    console.log('✅ Limit sell order created:', limitSellResult);
    console.log();

    // 5. Create a TWAP order
    console.log('🔄 Creating TWAP order for 1 BTC over 60 minutes...');
    const twapResult = await sdk.createTwapOrder({
      userAddress,
      token: 'BTC',
      size: '1.0',
      frequency: '5',   // Execute every 5 minutes
      runtime: '60',    // Run for 60 minutes total
      randomize: true,  // Add randomization to timing
      isBuy: true,
      threshold: 0.01,  // 1% threshold
    });
    console.log('✅ TWAP order created:', twapResult);
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

async function batchTradingExample(): Promise<void> {
  const userAddress = '0x1234567890123456789012345678901234567890';

  try {
    console.log('🚀 Starting batch trading example...\n');

    // Create multiple orders in a single batch
    console.log('📦 Creating batch orders...');
    const batchResult = await sdk.createBatchOrders({
      orders: [
        {
          userAddress,
          coin: 'BTC',
          is_buy: true,
          sz: 0.1,
          reduce_only: false,
        },
        {
          userAddress,
          coin: 'ETH',
          is_buy: true,
          sz: 2.0,
          reduce_only: false,
          limit_px: 3000,
          order_type: {
            limit: { tif: 'Gtc' },
          },
        },
        {
          userAddress,
          coin: 'SOL',
          is_buy: false,
          sz: 10,
          reduce_only: true, // Close existing position
        },
      ],
    });

    console.log('✅ Batch orders result:', batchResult);
    console.log(`📊 Summary: ${batchResult.data?.successful}/${batchResult.data?.total} orders successful`);
    
    if (batchResult.data?.errors && batchResult.data.errors.length > 0) {
      console.log('⚠️ Failed orders:');
      batchResult.data.errors.forEach((error, index) => {
        console.log(`  Order ${error.index}: ${error.error}`);
      });
    }

  } catch (error) {
    console.error('❌ Batch trading error:', error);
  }
}

// Run examples
if (require.main === module) {
  (async () => {
    await basicTradingExample();
    console.log('\n' + '='.repeat(50) + '\n');
    await batchTradingExample();
  })();
}
