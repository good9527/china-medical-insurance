import urllib.request
import json
import os
import subprocess
import re

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
url = "https://api.github.com/repos/good9527/china-medical-insurance/actions/runs?per_page=12"
headers = {"User-Agent": "Antigravity-CI-Checker"}
if token:
    headers["Authorization"] = f"token {token}"

req = urllib.request.Request(url, headers=headers)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        for r in data.get('workflow_runs', []):
            print(f"ID: {r['id']} | {r['name']} | Status: {r['status']} | Conclusion: {r['conclusion']} | SHA: {r['head_sha'][:7]} | Date: {r['created_at']}")
except Exception as e:
    print(f"Error: {e}")
