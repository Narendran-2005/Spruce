# Spruce Demo Guide

## 🌲 Three-Laptop Demo Setup

This guide walks you through setting up and running the Spruce hybrid post-quantum secure messaging demo across three laptops.

## 📋 Prerequisites

### Software Requirements
- **Java 17+** (for backend)
- **Node.js 18+** (for frontend)
- **Maven** (for backend build)
- **Modern web browser** (Chrome, Firefox, Edge)

### Hardware Setup
- **Laptop 1 (Client A - Vasanth)**: Primary client for sending messages
- **Laptop 2 (Client B - Yokesh)**: Secondary client for receiving messages  
- **Laptop 3 (Server)**: Backend server and admin console

## 🚀 Quick Start

### Step 1: Start the Backend Server (Laptop 3)

```bash
# Navigate to project directory
cd D:\Projects\Spruce

# Start the backend server
start-backend.bat
```

**Expected Output:**
```
🌲 Spruce Backend Server Started Successfully!
📡 Server running on: http://localhost:8080
🔐 Hybrid Post-Quantum Cryptography Demo Ready
📊 Admin logs available at: http://localhost:8080/api/admin/logs
```

### Step 2: Start Client A (Laptop 1 - Vasanth)

```bash
# Navigate to project directory
cd D:\Projects\Spruce

# Start the first client
start-frontend.bat
```

**Expected Output:**
```
Client will be available at: http://localhost:3000
```

### Step 3: Start Client B (Laptop 2 - Yokesh)

```bash
# Navigate to project directory
cd D:\Projects\Spruce

# Start the second client
start-frontend-b.bat
```

**Expected Output:**
```
Client B will be available at: http://localhost:3001
```

### Step 4: Start Admin Console (Laptop 3)

```bash
# Navigate to project directory
cd D:\Projects\Spruce

# Start admin console
start-admin.bat
```

**Expected Output:**
```
Admin console will be available at: http://localhost:3000/admin
```

## 🎯 Demo Flow

### 1. User Registration

**On Client A (Vasanth):**
1. Open http://localhost:3000
2. Click "Register here"
3. Enter username: `vasanth`
4. Enter password: `password123`
5. Wait for cryptographic key generation
6. Click "Create Account"

**On Client B (Yokesh):**
1. Open http://localhost:3001
2. Click "Register here"
3. Enter username: `yokesh`
4. Enter password: `password123`
5. Wait for cryptographic key generation
6. Click "Create Account"

### 2. Secure Handshake

**On Client A (Vasanth):**
1. Login with credentials
2. In "Start Chat" section, enter recipient: `yokesh`
3. Click "Start Secure Chat"
4. Observe handshake process in status indicators

**On Client B (Yokesh):**
1. Login with credentials
2. Wait for incoming handshake
3. Observe automatic handshake completion
4. Status should show "Session Established"

### 3. Encrypted Messaging

**On Client A (Vasanth):**
1. Type a message in the input field
2. Press Enter or click "Send"
3. Message appears in chat with encryption indicators

**On Client B (Yokesh):**
1. Observe incoming encrypted message
2. Message automatically decrypts and displays
3. Reply with a message

### 4. Admin Monitoring

**On Admin Console:**
1. Open http://localhost:3000/admin
2. Observe real-time logs showing:
   - User registrations
   - Handshake processes
   - Message encryption/decryption
   - System statistics

## 🔍 Expected Log Output

The admin console should display logs like:

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

## 🛠️ Troubleshooting

### Backend Issues
- **Port 8080 in use**: Change port in `backend/src/main/resources/application.yml`
- **Java not found**: Install Java 17+ and add to PATH
- **Maven not found**: Install Maven and add to PATH

### Frontend Issues
- **Port 3000/3001 in use**: Kill existing processes or change ports
- **Node.js not found**: Install Node.js 18+ and add to PATH
- **Dependencies fail**: Delete `node_modules` and run `npm install` again

### Network Issues
- **CORS errors**: Ensure backend is running on port 8080
- **API connection failed**: Check backend server status
- **Handshake fails**: Verify both clients are registered

## 📊 Demo Features Demonstrated

### Cryptographic Operations
- ✅ **X25519 Key Generation**: Ephemeral key pairs for forward secrecy
- ✅ **Kyber KEM**: Post-quantum key encapsulation mechanism
- ✅ **Dilithium Signatures**: Post-quantum digital signatures
- ✅ **AES-GCM Encryption**: Symmetric encryption for message confidentiality
- ✅ **HKDF Key Derivation**: Secure session key derivation

### Security Features
- ✅ **Forward Secrecy**: Ephemeral X25519 keys
- ✅ **Post-Quantum Security**: Kyber + Dilithium algorithms
- ✅ **End-to-End Encryption**: Messages encrypted on client, relayed by server
- ✅ **Authentication**: Dilithium signature verification
- ✅ **Key Isolation**: Private keys never leave client devices

### System Features
- ✅ **Real-time Logging**: Comprehensive system monitoring
- ✅ **Admin Console**: Live system statistics and logs
- ✅ **Multi-client Support**: Concurrent user sessions
- ✅ **Message Queuing**: Reliable message delivery
- ✅ **Session Management**: Secure handshake protocols

## 🎓 Educational Value

This demo showcases:
- **Hybrid Cryptography**: Combining classical and post-quantum algorithms
- **Key Exchange Protocols**: Secure session establishment
- **Message Security**: End-to-end encrypted communication
- **System Architecture**: Modular, scalable design
- **Security Monitoring**: Real-time cryptographic operations

## 📝 Notes

- All cryptographic operations are logged for educational purposes
- Private keys are stored locally and never transmitted
- The server only relays encrypted data, never decrypts messages
- Demo uses simulated Kyber/Dilithium for browser compatibility
- Production implementations would use actual PQC libraries








