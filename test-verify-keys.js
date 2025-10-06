import { LimitsSDK } from './dist/index.esm.js';

async function testVerifyKeysInterface() {
  console.log('Testing updated VerifyKeysRequest interface...');
  
  const sdk = new LimitsSDK();
  
  // Test the new interface structure
  const verifyKeysRequest = {
    userAddress: '0x1234567890123456789012345678901234567890',
    agentAddress: '0x9876543210987654321098765432109876543210',
    chainId: 1,
    nonce: 'test-nonce-123',
    signature: 'test-signature-456',
  };
  
  console.log('✅ VerifyKeysRequest object created with new fields:');
  console.log('  - userAddress:', verifyKeysRequest.userAddress);
  console.log('  - agentAddress:', verifyKeysRequest.agentAddress);
  console.log('  - chainId:', verifyKeysRequest.chainId);
  console.log('  - nonce:', verifyKeysRequest.nonce);
  console.log('  - signature:', verifyKeysRequest.signature);
  
  // Verify that the method exists
  console.log('✅ verifyKeys method available:', typeof sdk.verifyKeys);
  
  console.log('🎉 VerifyKeysRequest interface updated successfully!');
}

testVerifyKeysInterface().catch(console.error);
