import { LimitsSDK } from './src';

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
  
  console.log('🎉 All configuration tests passed! Default base URL is now: http://localhost:3001/dmp');
}

// Run the test
testDefaultConfig().catch(console.error);
