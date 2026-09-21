import os
import sys
import time
import subprocess
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
from playwright.sync_api import sync_playwright

PORT = 9988
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist", "build", "h5")
SCREENSHOT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "screenshots")

os.makedirs(SCREENSHOT_DIR, exist_ok=True)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def log_message(self, format, *args):
        pass

def run_server():
    server = HTTPServer(('127.0.0.1', PORT), Handler)
    server.serve_forever()

server_thread = threading.Thread(target=run_server, daemon=True)
server_thread.start()
print(f"HTTP Server started on http://127.0.0.1:{PORT}")

PAGES = [
    ("home", "/#/pages/index/index"),
    ("policy", "/#/pages/policy/index"),
    ("ranking", "/#/pages/ranking/index"),
    ("service", "/#/pages/service/index"),
    ("correction", "/#/pages/correction/index"),
    ("remote", "/#/pages/remote/index"),
]

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        headless=True
    )
    
    # 1. Desktop screenshots
    print("Capturing Desktop screens...")
    desktop_context = browser.new_context(viewport={"width": 1440, "height": 900})
    desktop_page = desktop_context.new_page()
    for name, path in PAGES:
        url = f"http://127.0.0.1:{PORT}{path}"
        print(f"Navigating desktop to {url}")
        desktop_page.goto(url)
        desktop_page.wait_for_timeout(1000)
        desktop_page.screenshot(path=os.path.join(SCREENSHOT_DIR, f"desktop_{name}.png"), full_page=False)
        desktop_page.screenshot(path=os.path.join(SCREENSHOT_DIR, f"desktop_{name}_full.png"), full_page=True)

    # Desktop voucher modal capture
    desktop_page.goto(f"http://127.0.0.1:{PORT}/#/pages/index/index")
    desktop_page.wait_for_timeout(1000)
    desktop_page.locator("text=生成凭据单").first.click()
    desktop_page.wait_for_timeout(600)
    desktop_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_voucher_modal.png"), full_page=False)

    desktop_context.close()

    # 2. Mobile screenshots
    print("Capturing Mobile screens...")
    mobile_context = browser.new_context(
        viewport={"width": 390, "height": 844},
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1",
        is_mobile=True,
        has_touch=True
    )
    mobile_page = mobile_context.new_page()
    for name, path in PAGES:
        url = f"http://127.0.0.1:{PORT}{path}"
        print(f"Navigating mobile to {url}")
        mobile_page.goto(url)
        mobile_page.wait_for_timeout(1000)
        mobile_page.screenshot(path=os.path.join(SCREENSHOT_DIR, f"mobile_{name}.png"), full_page=False)
        mobile_page.screenshot(path=os.path.join(SCREENSHOT_DIR, f"mobile_{name}_full.png"), full_page=True)

    # Mobile voucher modal capture
    mobile_page.goto(f"http://127.0.0.1:{PORT}/#/pages/index/index")
    mobile_page.wait_for_timeout(1000)
    mobile_page.locator("text=生成凭据单").first.click()
    mobile_page.wait_for_timeout(600)
    mobile_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "mobile_voucher_modal.png"), full_page=False)

    mobile_context.close()
    browser.close()

print("All screenshots taken successfully!")
