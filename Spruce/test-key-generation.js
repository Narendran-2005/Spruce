// Test key generation
import { cryptoService } from './frontend/src/services/cryptoService.js';

async function testKeyGeneration() {
    console.log('Testing key generation...');
    
    try {
        const keys = await cryptoService.generateKeyPair();
        console.log('✅ Key generation successful!');
        console.log('X25519 Public Key length:', keys.x25519PublicKey.length);
        console.log('Kyber Public Key length:', keys.kyberPublicKey.length);
        console.log('Dilithium Public Key length:', keys.dilithiumPublicKey.length);
        
        // Test if keys are valid base64
        const testDecode = (key) => {
            try {
                atob(key);
                return true;
            } catch {
                return false;
            }
        };
        
        console.log('X25519 key is valid base64:', testDecode(keys.x25519PublicKey));
        console.log('Kyber key is valid base64:', testDecode(keys.kyberPublicKey));
        console.log('Dilithium key is valid base64:', testDecode(keys.dilithiumPublicKey));
        
    } catch (error) {
        console.error('❌ Key generation failed:', error);
    }
}

testKeyGeneration();

