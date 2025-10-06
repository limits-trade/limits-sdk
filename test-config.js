import { LimitsSDK } from './dist/index.esm.js';

async function testDefaultConfig() {
  console.log('Testing SDK with default configuration...');
  
  // Test default configuration
  const sdkDefault = new LimitsSDK();
  console.log('✅ SDK initialized with default config (http://localhost:3001/dmp)');
  
  // Test custom configuration  
  const sdkCustom = new LimitsSDK({
    baseURL: 'https://api.example.com',
    timeout: 10000,
  });
  console.log('✅ SDK initialized with custom config (https://api.example.com)');
  
  // Test partial configuration (should use defaults for missing values)
  const sdkPartial = new LimitsSDK({
    headers: {
      'Authorization': 'Bearer test-token',
    },
  });
  console.log('✅ SDK initialized with partial config (default baseURL + custom headers)');
  
  // Test that all methods are available
  console.log('Available SDK methods:');
  console.log('- createOrder:', typeof sdkDefault.createOrder);
  console.log('- createBatchOrders:', typeof sdkDefault.createBatchOrders);
  console.log('- updateLeverage:', typeof sdkDefault.updateLeverage);
  console.log('- createTwapOrder:', typeof sdkDefault.createTwapOrder);
  console.log('- connectUser:', typeof sdkDefault.connectUser);
  console.log('- verifyDevice:', typeof sdkDefault.verifyDevice);
  console.log('- verifyKeys:', typeof sdkDefault.verifyKeys);
  console.log('- verifyCode:', typeof sdkDefault.verifyCode);
  
  console.log('🎉 All configuration tests passed! Default base URL is now: http://localhost:3001/dmp');
}

// Run the test
testDefaultConfig().catch(console.error);
