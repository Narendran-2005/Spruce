# 🌲 Spruce - Hybrid Post-Quantum Secure Messaging Demo

A comprehensive demonstration of hybrid cryptographic systems combining post-quantum cryptography with classical cryptography for secure messaging across a three-laptop demo setup.

## 🏗️ Architecture Overview

### System Components
- **Frontend**: React + Vite + TailwindCSS (Two client instances)
- **Backend**: Spring Boot 3.x with Java 17+ (Server/Controller)
- **Database**: H2 in-memory database
- **Cryptography**: Hybrid PQC + Classical algorithms

### Cryptographic Stack
- **X25519**: Elliptic-curve Diffie-Hellman for key agreement
- **Kyber**: Post-quantum Key Encapsulation Mechanism (simulated)
- **Dilithium**: Post-quantum Digital Signature (simulated)
- **AES-GCM**: Symmetric encryption for message confidentiality
- **SHA-256 + HKDF**: Session key derivation

## 🖥️ Three-Laptop Demo Setup

### Hardware Configuration
| Laptop | Role | Functionality | Port |
|--------|------|---------------|------|
| **Laptop 1** | Client A (Vasanth) | Sender client | 3000 |
| **Laptop 2** | Client B (Yokesh) | Receiver client | 3001 |
| **Laptop 3** | Server | Backend + Admin | 8080 |

## 🚀 Quick Start

### Prerequisites
- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **Maven** (for backend build)

### Automated Setup
```bash
# Run the setup script
setup-demo.bat
```

### Manual Setup

1. **Start Backend Server (Laptop 3)**:
   ```bash
   start-backend.bat
   # OR manually:
   cd backend
   mvn spring-boot:run
   ```

2. **Start Client A (Laptop 1 - Vasanth)**:
   ```bash
   start-frontend.bat
   # OR manually:
   cd frontend
   npm install
   npm run dev
   ```

3. **Start Client B (Laptop 2 - Yokesh)**:
   ```bash
   start-frontend-b.bat
   # OR manually:
   cd frontend
   npm install
   npm run dev -- --port 3001
   ```

4. **Start Admin Console (Laptop 3)**:
   ```bash
   start-admin.bat
   # Opens http://localhost:3000/admin
   ```

## 🎯 Demo Flow

### 1. User Registration
- **Client A**: Register user `vasanth` with password `password123`
- **Client B**: Register user `yokesh` with password `password123`
- **System**: Generates X25519, Kyber, and Dilithium key pairs locally

### 2. Hybrid Handshake
- **Client A**: Initiates chat with `yokesh`
- **System**: Performs hybrid key exchange:
  - Ephemeral X25519 key generation
  - Kyber encapsulation with recipient's public key
  - Dilithium signature of handshake data
  - HKDF session key derivation

### 3. Encrypted Messaging
- **Client A**: Sends encrypted message using AES-GCM
- **Client B**: Receives and decrypts message automatically
- **System**: Logs all cryptographic operations

### 4. Admin Monitoring
- **Admin Console**: Real-time system logs and statistics
- **Logs**: Comprehensive cryptographic operation tracking
- **Stats**: Message queues, handshake status, user activity

## 🔐 Security Features

### Cryptographic Operations
- ✅ **Forward Secrecy**: Ephemeral X25519 keys
- ✅ **Post-Quantum Security**: Kyber KEM + Dilithium signatures
- ✅ **End-to-End Encryption**: AES-GCM message encryption
- ✅ **Key Isolation**: Private keys never leave client devices
- ✅ **Authentication**: Dilithium signature verification

### System Security
- ✅ **No Server Decryption**: Server only relays encrypted data
- ✅ **Local Key Storage**: Private keys stored in browser localStorage
- ✅ **Session Management**: Secure handshake protocols
- ✅ **Message Integrity**: AES-GCM authentication

## 📊 Admin Console Features

### Real-time Monitoring
- **System Logs**: Live cryptographic operation tracking
- **Statistics**: Message queues, handshake status, user activity
- **Performance**: Real-time system metrics
- **Security**: Cryptographic operation verification

### Log Categories
- `[INFO]`: General system information
- `[HANDSHAKE]`: Key exchange operations
- `[SIGNATURE]`: Digital signature operations
- `[SESSION]`: Session key establishment
- `[MESSAGE]`: Message encryption/decryption
- `[CRYPTO]`: Cryptographic operations

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/register` - User registration with public keys
- `POST /api/auth/login` - User authentication
- `GET /api/auth/check-username/{username}` - Username availability

### Key Management
- `GET /api/keys/{username}` - Get user public keys
- `GET /api/keys/verify/{username}` - Verify user existence

### Messaging
- `POST /api/messages/send` - Send encrypted message
- `GET /api/messages/receive/{username}` - Receive messages
- `DELETE /api/messages/clear/{username}` - Clear message queue
- `POST /api/messages/handshake` - Send handshake data
- `GET /api/messages/handshake/{username}` - Receive handshake data

### Admin
- `GET /api/admin/logs` - Get system logs
- `GET /api/admin/stats` - Get system statistics
- `POST /api/admin/reset` - Reset system data

## 🧪 Testing the Demo

### Expected Log Output
```
[INFO] Registered user: vasanth | Keys: X25519, Kyber, Dilithium
[INFO] Registered user: yokesh | Keys: X25519, Kyber, Dilithium
[HANDSHAKE] Ephemeral X25519 key received from vasanth
[HANDSHAKE] Kyber ciphertext transmitted
[SIGNATURE] Dilithium signature verified successfully
[SESSION] Shared hybrid session established successfully!
[ENCRYPTION] Message encrypted using session key
[DECRYPTION] Message decrypted successfully at receiver end
```

### Demo Verification
1. **Key Generation**: Verify all three key pairs are generated
2. **Handshake**: Confirm hybrid key exchange completes
3. **Encryption**: Verify messages are encrypted before transmission
4. **Decryption**: Confirm messages decrypt correctly at receiver
5. **Logging**: Check admin console shows all operations

## 📁 Project Structure

```
Spruce/
├── backend/                 # Spring Boot backend
│   ├── src/main/java/com/spruce/
│   │   ├── controller/      # REST controllers
│   │   ├── service/        # Business logic
│   │   ├── model/          # Data models
│   │   ├── repository/     # Data access
│   │   └── config/         # Configuration
│   └── src/main/resources/
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API and crypto services
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils/          # Utility functions
│   └── public/
├── logs/                   # System logs
├── start-*.bat            # Demo startup scripts
└── setup-demo.bat        # Automated setup
```

## 🎓 Educational Value

This demo showcases:
- **Hybrid Cryptography**: Classical + Post-quantum algorithms
- **Key Exchange Protocols**: Secure session establishment
- **Message Security**: End-to-end encrypted communication
- **System Architecture**: Modular, scalable design
- **Security Monitoring**: Real-time cryptographic operations
- **Forward Secrecy**: Ephemeral key usage
- **Authentication**: Digital signature verification

## 🚨 Important Notes

- **Demo Purpose**: This is for educational demonstration only
- **Simulated PQC**: Kyber/Dilithium are simulated for browser compatibility
- **Production Use**: Real implementations require actual PQC libraries
- **Key Storage**: Private keys stored in browser localStorage (demo only)
- **Network Security**: Demo uses localhost (not production-ready)

## 🔧 Troubleshooting

### Common Issues
- **Port Conflicts**: Ensure ports 3000, 3001, 8080 are available
- **Java Version**: Requires Java 17+ for Spring Boot 3.x
- **Node.js Version**: Requires Node.js 18+ for modern features
- **CORS Errors**: Ensure backend is running on port 8080
- **Dependencies**: Run `npm install` and `mvn clean install`

### Debug Steps
1. Check all services are running on correct ports
2. Verify browser console for JavaScript errors
3. Check backend logs for server errors
4. Ensure all dependencies are installed
5. Clear browser cache and localStorage if needed

## 📚 Further Reading

- [Post-Quantum Cryptography](https://csrc.nist.gov/projects/post-quantum-cryptography)
- [WebCrypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)
- [Spring Boot Security](https://spring.io/guides/gs/securing-web/)
- [React Hooks](https://reactjs.org/docs/hooks-intro.html)
