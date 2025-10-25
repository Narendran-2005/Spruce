# Multi-System Spruce Demo Setup

This guide shows how to run the Spruce post-quantum messaging demo across multiple systems.

## 🖥️ **System Requirements**

### **System 1: Server (Backend)**
- **OS:** Windows/Linux/Mac
- **Requirements:** Java 17+, Maven, MySQL
- **Ports:** 8080 (Backend API)
- **Role:** Central server, database, admin console

### **System 2: Client A**
- **OS:** Windows/Linux/Mac  
- **Requirements:** Node.js 18+, npm
- **Ports:** 3000 (Frontend)
- **Role:** First messaging client

### **System 3: Client B**
- **OS:** Windows/Linux/Mac
- **Requirements:** Node.js 18+, npm
- **Ports:** 3001 (Frontend)
- **Role:** Second messaging client

## 🚀 **Setup Instructions**

### **Step 1: Server System Setup**

**1.1 Install Prerequisites:**
```bash
# Install Java 17+
# Install Maven
# Install MySQL
# Clone Spruce project
```

**1.2 Configure MySQL:**
```bash
# Run database setup
setup-mysql-fixed.bat

# Or manually:
mysql -u root -p < setup-mysql-db.sql
```

**1.3 Start Server:**
```bash
# Start the backend server
start-server.bat
```

**1.4 Note Server IP:**
```bash
# Find your server IP address
ipconfig | findstr "IPv4"
# Example: 192.168.1.100
```

### **Step 2: Client A Setup**

**2.1 Install Prerequisites:**
```bash
# Install Node.js 18+
# Clone Spruce project (or copy frontend folder)
```

**2.2 Install Dependencies:**
```bash
cd frontend
npm install
```

**2.3 Start Client A:**
```bash
# Run from Spruce root directory
start-client-a.bat

# When prompted, enter server IP (e.g., 192.168.1.100)
```

**2.4 Access Client A:**
- **URL:** `http://[CLIENT_A_IP]:3000`
- **Example:** `http://192.168.1.101:3000`

### **Step 3: Client B Setup**

**3.1 Install Prerequisites:**
```bash
# Install Node.js 18+
# Clone Spruce project (or copy frontend folder)
```

**3.2 Install Dependencies:**
```bash
cd frontend
npm install
```

**3.3 Start Client B:**
```bash
# Run from Spruce root directory
start-client-b.bat

# When prompted, enter server IP (e.g., 192.168.1.100)
```

**3.4 Access Client B:**
- **URL:** `http://[CLIENT_B_IP]:3001`
- **Example:** `http://192.168.1.102:3001`

## 🔧 **Configuration Files**

### **Server Configuration**
- **File:** `backend/src/main/resources/application-server.yml`
- **Features:** Network access, CORS, MySQL
- **Port:** 8080

### **Client Configuration**
- **Environment Variable:** `VITE_API_BASE_URL`
- **Default:** `http://localhost:8080/api`
- **Multi-system:** `http://[SERVER_IP]:8080/api`

## 🌐 **Network Configuration**

### **Firewall Rules**
**Server System:**
- Allow inbound on port 8080
- Allow MySQL connections (port 3306)

**Client Systems:**
- Allow inbound on ports 3000/3001
- Allow outbound to server port 8080

### **Network Discovery**
```bash
# Find server IP
ping [server_hostname]

# Test connectivity
telnet [server_ip] 8080

# Test API
curl http://[server_ip]:8080/api/admin/stats
```

## 📱 **Demo Flow**

### **1. Registration Phase**
1. **Client A:** Register user "Alice"
2. **Client B:** Register user "Bob"
3. **Server:** Verify users in database

### **2. Handshake Phase**
1. **Client A:** Initiate handshake with "Bob"
2. **Server:** Relay handshake data
3. **Client B:** Complete handshake
4. **Server:** Log handshake process

### **3. Messaging Phase**
1. **Client A:** Send encrypted message to "Bob"
2. **Server:** Relay encrypted message
3. **Client B:** Receive and decrypt message
4. **Server:** Log message exchange

### **4. Admin Monitoring**
1. **Server:** Access admin console
2. **URL:** `http://[SERVER_IP]:8080/admin`
3. **View:** Real-time logs, user stats, message queues

## 🔍 **Troubleshooting**

### **Common Issues**

**1. Connection Refused**
```bash
# Check if server is running
curl http://[server_ip]:8080/api/admin/stats

# Check firewall
telnet [server_ip] 8080
```

**2. CORS Errors**
- Verify server CORS configuration
- Check client API URL setting
- Ensure correct server IP

**3. Database Connection**
```bash
# Test MySQL connection
mysql -u spruce_user -p spruce_db

# Check server logs
tail -f logs/spruce-server.log
```

**4. Frontend Not Loading**
```bash
# Check Node.js version
node --version

# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install
```

### **Debug Commands**

**Server Debug:**
```bash
# Check server status
netstat -an | findstr :8080

# Check MySQL
mysql -u spruce_user -p spruce_db -e "SHOW TABLES;"

# View logs
tail -f logs/spruce-server.log
```

**Client Debug:**
```bash
# Check frontend status
netstat -an | findstr :3000
netstat -an | findstr :3001

# Test API connection
curl http://[server_ip]:8080/api/admin/stats
```

## 📊 **Monitoring & Logs**

### **Server Logs**
- **File:** `logs/spruce-server.log`
- **Database:** `logs` table in MySQL
- **Admin Console:** `http://[SERVER_IP]:8080/admin`

### **Client Logs**
- **Browser Console:** F12 → Console
- **Network Tab:** F12 → Network
- **API Calls:** Monitor in Network tab

## 🎯 **Quick Start Commands**

### **Server System:**
```bash
# 1. Setup MySQL
setup-mysql-fixed.bat

# 2. Start server
start-server.bat
```

### **Client Systems:**
```bash
# 1. Install dependencies
cd frontend && npm install

# 2. Start client
start-client-a.bat  # or start-client-b.bat
```

## 🔐 **Security Notes**

1. **Network Security:** Use VPN or secure network
2. **Firewall:** Configure appropriate rules
3. **Passwords:** Change default MySQL passwords
4. **SSL:** Consider HTTPS for production
5. **Access Control:** Limit admin console access

## 📈 **Performance Tips**

1. **Server:** Use SSD for MySQL
2. **Network:** Use wired connections
3. **Clients:** Close unnecessary applications
4. **Monitoring:** Watch server resources

Your multi-system Spruce demo is now ready! 🚀







