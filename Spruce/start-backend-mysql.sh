#!/bin/bash

echo "========================================"
echo "   Spruce Backend - MySQL Configuration"
echo "========================================"
echo

# Check if MySQL service is running
echo "Checking MySQL service..."
if ! systemctl is-active --quiet mysql; then
    echo "ERROR: MySQL service is not running"
    echo "Please start MySQL service first:"
    echo "  sudo systemctl start mysql"
    echo "  or"
    echo "  sudo service mysql start"
    exit 1
fi

echo "MySQL service is running ✓"
echo

# Set MySQL environment variables
echo "Setting MySQL configuration..."
export MYSQL_URL=jdbc:mysql://localhost:3306/spruce_db
export MYSQL_DRIVER=com.mysql.cj.jdbc.Driver
export MYSQL_USERNAME=spruce_user
export MYSQL_PASSWORD=spruce_password_2024
export MYSQL_DDL_AUTO=update
export MYSQL_DIALECT=org.hibernate.dialect.MySQL8Dialect

echo "Database URL: $MYSQL_URL"
echo "Username: $MYSQL_USERNAME"
echo

# Navigate to backend directory
cd backend

echo "Starting Spruce Backend with MySQL..."
echo
echo "Backend will be available at: http://localhost:8080"
echo "Admin console: http://localhost:8080/admin"
echo "API endpoints: http://localhost:8080/api"
echo

# Start the backend
mvn spring-boot:run

echo
echo "Backend stopped."






