-- Spruce Project MySQL Database Setup
-- Run this script as MySQL root user

-- Create database
CREATE DATABASE IF NOT EXISTS spruce_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Create dedicated user for Spruce
CREATE USER IF NOT EXISTS 'spruce_user'@'localhost' 
IDENTIFIED BY 'spruce_password_2024';

-- Grant all privileges on spruce_db to spruce_user
GRANT ALL PRIVILEGES ON spruce_db.* TO 'spruce_user'@'localhost';

-- Flush privileges to ensure changes take effect
FLUSH PRIVILEGES;

-- Switch to the new database
USE spruce_db;

-- Display success message
SELECT 'Spruce database and user created successfully!' as status;

-- Show database information
SELECT 
    'Database' as info_type,
    'spruce_db' as name,
    'utf8mb4_unicode_ci' as collation;

-- Show user information
SELECT 
    'User' as info_type,
    'spruce_user' as username,
    'localhost' as host,
    'spruce_db.*' as privileges;

-- Instructions for next steps
SELECT 'Next steps:' as instructions
UNION ALL
SELECT '1. Run: start-backend-mysql.bat (Windows) or start-backend-mysql.sh (Linux/Mac)'
UNION ALL
SELECT '2. Backend will automatically create tables'
UNION ALL
SELECT '3. Access admin console at: http://localhost:8080/admin';






