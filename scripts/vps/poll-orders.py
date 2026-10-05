#!/usr/bin/env python3
"""Call the website's authenticated order reconciler. Never log the secret."""
import json
import os
import sys
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

url = os.environ.get('ORDER_RECONCILE_URL', '')
secret = os.environ.get('CRON_SECRET', '')
if not url.startswith('https://') or not secret:
    sys.exit('Configure HTTPS ORDER_RECONCILE_URL and CRON_SECRET.')
try:
    with urlopen(Request(url, headers={'Authorization': 'Bearer ' + secret}), timeout=290) as response:
        result = json.load(response)
    print(json.dumps(result))
    if result.get('reviews', 0):
        sys.exit('Payment matches need manual review. Run the order status command.')
except (HTTPError, URLError, TimeoutError):
    sys.exit('Order reconciliation failed. Check website job logs and retry; credentials omitted.')
