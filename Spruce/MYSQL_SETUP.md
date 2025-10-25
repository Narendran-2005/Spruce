# MySQL Setup Guide for Spruce Project

This guide will help you set up a separate MySQL database specifically for the Spruce post-quantum messaging demo.

## Prerequisites
- MySQL Server installed and running
- MySQL Workbench or command-line access
- Java 17+ and Maven installed

## Step 1: Create a New Database

### Option A: Using MySQL Workbench
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Right-click in the Navigator panel → "Create Schema"
4. Name: `spruce_db`
5. Collation: `utf8mb4_unicode_ci`
6. Click "Apply"

### Option B: Using Command Line
```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE spruce_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create a dedicated user for Spruce
CREATE USER 'spruce_user'@'localhost' IDENTIFIED BY 'spruce_password_2024';

-- Grant privileges
GRANT ALL PRIVILEGES ON spruce_db.* TO 'spruce_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
SELECT User, Host FROM mysql.user WHERE User = 'spruce_user';
```

## Step 2: Configure Spruce Backend

### Environment Variables Setup

Create a `.env` file in the backend directory:

```bash
# MySQL Configuration
MYSQL_URL=jdbc:mysql://localhost:3306/spruce_db
MYSQL_DRIVER=com.mysql.cj.jdbc.Driver
MYSQL_USERNAME=spruce_user
MYSQL_PASSWORD=spruce_password_2024
MYSQL_DDL_AUTO=update
MYSQL_DIALECT=org.hibernate.dialect.MySQL8Dialect

# Optional: Logging
LOG_LEVEL=INFO
```

### Windows Batch Script
Create `start-backend-mysql.bat`:

```batch
@echo off
echo Starting Spruce Backend with MySQL...

REM Set MySQL environment variables
set MYSQL_URL=jdbc:mysql://localhost:3306/spruce_db
set MYSQL_DRIVER=com.mysql.cj.jdbc.Driver
set MYSQL_USERNAME=spruce_user
set MYSQL_PASSWORD=spruce_password_2024
set MYSQL_DDL_AUTO=update
set MYSQL_DIALECT=org.hibernate.dialect.MySQL8Dialect

REM Start the backend
cd backend
mvn spring-boot:run

pause
```

### Linux/Mac Script
Create `start-backend-mysql.sh`:

```bash
#!/bin/bash
echo "Starting Spruce Backend with MySQL..."

# Set MySQL environment variables
export MYSQL_URL=jdbc:mysql://localhost:3306/spruce_db
export MYSQL_DRIVER=com.mysql.cj.jdbc.Driver
export MYSQL_USERNAME=spruce_user
export MYSQL_PASSWORD=spruce_password_2024
export MYSQL_DDL_AUTO=update
export MYSQL_DIALECT=org.hibernate.dialect.MySQL8Dialect

# Start the backend
cd backend
mvn spring-boot:run
```

## Step 3: Test the Connection

### 1. Start MySQL Service
```bash
# Windows (as Administrator)
net start mysql

# Linux/Mac
sudo systemctl start mysql
# or
sudo service mysql start
```

### 2. Test Database Connection
```sql
-- Connect to the new database
mysql -u spruce_user -p spruce_db

-- Test with a simple query
SELECT 'Spruce Database Connected Successfully!' as status;
```

### 3. Run Spruce Backend
```bash
# Using the batch script (Windows)
start-backend-mysql.bat

# Or manually with environment variables
cd backend
set MYSQL_URL=jdbc:mysql://localhost:3306/spruce_db
set MYSQL_USERNAME=spruce_user
set MYSQL_PASSWORD=spruce_password_2024
mvn spring-boot:run
```

## Step 4: Verify Tables Creation

Once the backend starts, it will automatically create the required tables:

```sql
-- Connect to spruce_db
mysql -u spruce_user -p spruce_db

-- Check tables
SHOW TABLES;

-- Expected tables:
-- - users
-- - logs
-- - message_packets (if using JPA for messages)

-- Check table structure
DESCRIBE users;
DESCRIBE logs;
```

## Step 5: Database Management

### Backup Database
```bash
# Create backup
mysqldump -u spruce_user -p spruce_db > spruce_backup_$(date +%Y%m%d).sql

# Restore from backup
mysql -u spruce_user -p spruce_db < spruce_backup_20241222.sql
```

### Monitor Database
```sql
-- Check database size
SELECT 
    table_schema AS 'Database',
    ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)'
FROM information_schema.tables 
WHERE table_schema = 'spruce_db'
GROUP BY table_schema;

-- Check recent logs
SELECT * FROM logs ORDER BY timestamp DESC LIMIT 10;

-- Check registered users
SELECT username, created_at FROM users;
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Check if MySQL service is running
   - Verify port 3306 is not blocked
   - Check firewall settings

2. **Access Denied**
   - Verify username/password
   - Check user privileges
   - Ensure user can connect from localhost

3. **Database Not Found**
   - Verify database name spelling
   - Check if database was created successfully
   - Ensure user has access to the database

4. **Driver Issues**
   - Ensure MySQL Connector/J is in classpath
   - Check Maven dependencies
   - Verify driver version compatibility

### Useful Commands

```bash
# Check MySQL status
mysqladmin -u root -p status

# List all databases
mysql -u root -p -e "SHOW DATABASES;"

# Check MySQL version
mysql --version

# Reset password (if needed)
mysql -u root -p
ALTER USER 'spruce_user'@'localhost' IDENTIFIED BY 'new_password';
```

## Security Recommendations

1. **Use Strong Passwords**: Change default passwords
2. **Limit Privileges**: Only grant necessary permissions
3. **Network Security**: Use localhost connections only
4. **Regular Backups**: Schedule automated backups
5. **Monitor Access**: Check connection logs regularly

## Next Steps

1. Run the setup script: `./start-backend-mysql.bat`
2. Access the admin console: `http://localhost:8080/admin`
3. Check logs in the database: `SELECT * FROM logs ORDER BY timestamp DESC;`
4. Test user registration and messaging features

Your Spruce project is now ready with persistent MySQL storage!
