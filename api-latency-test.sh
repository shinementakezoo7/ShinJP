#!/bin/bash

# API Latency Test Script
# Tests latency to apis.iflow.cn from different locations

echo "API Latency Test for https://apis.iflow.cn/v1"
echo "============================================"

# Get IP address and basic info
echo "Resolving domain..."
IP=$(curl -s https://apis.iflow.cn/v1 -w "%{remote_ip}" -o /dev/null)
echo "IP Address: $IP"

# Get location information
echo ""
echo "Location Information:"
echo "-------------------"
LOCATION_INFO=$(curl -s "http://ip-api.com/json/$IP")
echo "$LOCATION_INFO" | jq '.'

# Test latency
echo ""
echo "Latency Test Results:"
echo "--------------------"
for i in {1..3}; do
    echo "Test $i:"
    curl -w "@curl-format.txt" -o /dev/null -s https://apis.iflow.cn/v1
    echo ""
done

echo "Average latency test completed."
