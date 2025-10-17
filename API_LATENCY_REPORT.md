# API Latency Report for https://apis.iflow.cn/v1

## Summary
This report provides information about the IP address, location, and latency measurements for the API endpoint `https://apis.iflow.cn/v1`.

## Domain Resolution
- **Domain**: apis.iflow.cn
- **IP Address**: 47.246.167.163 (Note: IP may vary due to load balancing/CDN)
- **Organization**: Alibaba (US) Technology Co., Ltd.
- **ISP**: Alibaba (US) Technology Co., Ltd.
- **ASN**: AS45102

## Location Information
Based on IP geolocation services:
- **Country**: Singapore (SG)
- **Region**: North West
- **City**: Singapore
- **Coordinates**: Latitude 1.35208, Longitude 103.82
- **Timezone**: Asia/Singapore
- **Postal Code**: 858877

## SSL Certificate Information
From the SSL certificate presented by the server:
- **Subject**: *.iflow.cn
- **Organization**: Alibaba (China) Technology Co., Ltd.
- **Location**: ZheJiang, HangZhou, China
- **Issuer**: GlobalSign GCC R3 OV TLS CA 2024

Note: There appears to be a discrepancy between the certificate location (China) and IP geolocation (Singapore). This is common with cloud providers that have global infrastructure.

## Latency Measurements
Three consecutive tests were performed to measure different aspects of the connection:

### Test 1
- DNS Lookup: 0.002694s
- TCP Connection: 0.078520s
- SSL Handshake: 0.164321s
- Time to First Byte (TTFB): 0.443362s
- **Total Time**: 0.444321s

### Test 2
- DNS Lookup: 0.003430s
- TCP Connection: 0.059333s
- SSL Handshake: 0.120675s
- Time to First Byte (TTFB): 0.368884s
- **Total Time**: 0.368935s

### Test 3
- DNS Lookup: 0.002925s
- TCP Connection: 0.065988s
- SSL Handshake: 0.132970s
- Time to First Byte (TTFB): 0.379877s
- **Total Time**: 0.379965s

## Performance Analysis
- **Average Total Response Time**: ~0.398 seconds
- **Fastest Response**: 0.369 seconds
- **Slowest Response**: 0.444 seconds
- **DNS Lookup Time**: < 0.01 seconds (excellent)
- **Connection Establishment**: ~0.06-0.08 seconds (good)
- **SSL Handshake**: ~0.12-0.16 seconds (acceptable)
- **Server Processing Time** (TTFB - Connection Time): ~0.28-0.31 seconds

## Conclusion
The API endpoint `https://apis.iflow.cn/v1` is hosted on Alibaba infrastructure in Singapore. The latency performance is generally good with average response times under 0.4 seconds. The slight discrepancy between certificate location and IP geolocation indicates Alibaba's cloud infrastructure is being used, which is common for global services.

## Testing Methodology
All tests were conducted using curl with timing measurements:
- `time_namelookup`: Time for DNS lookup
- `time_connect`: Time for TCP connection establishment
- `time_appconnect`: Time for SSL/TLS handshake
- `time_starttransfer`: Time to first byte (TTFB)
- `time_total`: Total time for the request

## Scripts Used
A bash script (`api-latency-test.sh`) was created to automate testing:
```bash
#!/bin/bash
# Script performs DNS resolution, location lookup, and 3 consecutive latency tests
```

The script utilizes:
- `curl` for HTTP requests and timing
- `ip-api.com` for geolocation data
- `jq` for JSON parsing
