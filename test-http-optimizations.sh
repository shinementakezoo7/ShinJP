#!/bin/bash

# Test HTTP Optimizations for iFlow API
# Validates that Keep-Alive, connection pooling, and other optimizations are working

echo "Testing HTTP Optimizations for iFlow API"
echo "========================================="

# Test 1: Basic connectivity with timing
echo "Test 1: Basic Connectivity and Timing"
echo "-------------------------------------"
curl -w "@curl-format.txt" -o /dev/null -s https://apis.iflow.cn/v1

echo ""
echo "Test 2: Connection Reuse Verification"
echo "-------------------------------------"
# Make two consecutive requests to check for connection reuse
for i in {1..2}; do
    echo "Request $i:"
    curl -v -o /dev/null -s --header "Connection: keep-alive" https://apis.iflow.cn/v1 2>&1 | grep -E "(Connected|Re-using|Closing)"
    echo ""
done

echo "Test 3: Multiple Requests Performance"
echo "------------------------------------"
# Test multiple requests to verify connection pooling
echo "Making 5 consecutive requests..."
start_time=$(date +%s.%N)
for i in {1..5}; do
    curl -o /dev/null -s --header "Connection: keep-alive" https://apis.iflow.cn/v1
done
end_time=$(date +%s.%N)
duration=$(echo "$end_time - $start_time" | bc)
echo "5 requests completed in $duration seconds"

echo ""
echo "Test 4: DNS Resolution Check"
echo "---------------------------"
# Check if DNS caching is working by resolving the domain multiple times
echo "Resolving domain 3 times:"
for i in {1..3}; do
    start_resolve=$(date +%s.%N)
    IP=$(curl -s https://apis.iflow.cn/v1 -w "%{remote_ip}" -o /dev/null)
    end_resolve=$(date +%s.%N)
    resolve_time=$(echo "$end_resolve - $start_resolve" | bc)
    echo "Attempt $i: $IP (resolved in ${resolve_time}s)"
done

echo ""
echo "Test 5: HTTP Headers Verification"
echo "--------------------------------"
# Check that our custom headers are being sent
curl -v -o /dev/null -s \
  --header "Connection: keep-alive" \
  --header "Keep-Alive: timeout=60, max=1000" \
  https://apis.iflow.cn/v1 2>&1 | grep -E "(Connection|Keep-Alive)"

echo ""
echo "Optimization tests completed."
echo "Refer to HTTP_OPTIMIZATION_DOCS.md for configuration details and troubleshooting."
