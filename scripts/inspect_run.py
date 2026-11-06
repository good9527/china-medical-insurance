import urllib.request
import json
import sys
import os
import subprocess
import re

run_id = sys.argv[1] if len(sys.argv) > 1 else "42250290352"

def get_token():
    if os.environ.get("GH_TOKEN"):
        return os.environ.get("GH_TOKEN")
    try:
        url = subprocess.check_output(["git", "config", "remote.origin.url"], text=True).strip()
        m = re.search(r":([^:@]+)@github\.com", url)
        if m:
            return m.group(1)
    except Exception:
        pass
    return None

token = get_token()
url = f"https://api.github.com/repos/good9527/china-medical-insurance/actions/runs/{run_id}/jobs"
headers = {"User-Agent": "Antigravity-CI-Checker"}
if token:
    headers["Authorization"] = f"token {token}"

req = urllib.request.Request(url, headers=headers)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
    for j in data.get('jobs', []):
        print(f"Job: {j['name']} | Conclusion: {j['conclusion']}")
        for s in j.get('steps', []):
            if s.get('conclusion') == 'failure' or s.get('status') == 'completed':
                print(f"  Step: {s['name']} -> {s.get('conclusion')}")
except Exception as e:
    print(f"Error: {e}")
