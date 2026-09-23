import os
import time
import threading
import shutil
from http.server import SimpleHTTPRequestHandler, HTTPServer
from playwright.sync_api import sync_playwright

PORT = 9993
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist", "build", "h5")
SCREENSHOT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "screenshots")
ARTIFACT_DIR = r"C:\Users\19901\.gemini\antigravity\brain\ab264cee-a783-46c6-9006-711cd2f6a1e3"

os.makedirs(SCREENSHOT_DIR, exist_ok=True)

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def log_message(self, format, *args):
        pass

server = HTTPServer(('127.0.0.1', PORT), Handler)
server_thread = threading.Thread(target=server.serve_forever, daemon=True)
server_thread.start()
print(f"Server started at http://127.0.0.1:{PORT}")

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        headless=True
    )

    # 1. Desktop full overview
    ctx = browser.new_context(viewport={"width": 1440, "height": 960})
    page = ctx.new_page()
    url = f"http://127.0.0.1:{PORT}/#/pages/home/index"
    page.goto(url)
    page.wait_for_timeout(1800)

    # 1.1 Overview screenshot showing provincial dashed lines
    p1 = os.path.join(SCREENSHOT_DIR, "home_province_dashed_overview.png")
    page.screenshot(path=p1)
    if os.path.exists(ARTIFACT_DIR):
        shutil.copy(p1, os.path.join(ARTIFACT_DIR, "home_province_dashed_overview.png"))
    print("Captured overview screenshot")

    # 1.2 Zoom in on central China (Sichuan/Shaanxi/Hubei/Hunan)
    # Click zoom button twice
    zoom_btn = page.locator(".zoom-btn").first
    zoom_btn.click()
    page.wait_for_timeout(400)
    zoom_btn.click()
    page.wait_for_timeout(600)
    p2 = os.path.join(SCREENSHOT_DIR, "home_province_dashed_zoomed.png")
    page.screenshot(path=p2)
    if os.path.exists(ARTIFACT_DIR):
        shutil.copy(p2, os.path.join(ARTIFACT_DIR, "home_province_dashed_zoomed.png"))
    print("Captured zoomed screenshot")

    # 1.3 Select a city (e.g. 成都市) by clicking or searching to show active overlay over dashed lines
    search_input = page.locator(".map-search-input input")
    search_input.fill("四川")
    page.wait_for_timeout(600)
    p3 = os.path.join(SCREENSHOT_DIR, "home_province_search_sichuan.png")
    page.screenshot(path=p3)
    if os.path.exists(ARTIFACT_DIR):
        shutil.copy(p3, os.path.join(ARTIFACT_DIR, "home_province_search_sichuan.png"))

    # Click first suggested city (成都市)
    page.locator(".suggest-item").first.click()
    page.wait_for_timeout(800)
    p4 = os.path.join(SCREENSHOT_DIR, "home_province_chengdu_selected.png")
    page.screenshot(path=p4)
    if os.path.exists(ARTIFACT_DIR):
        shutil.copy(p4, os.path.join(ARTIFACT_DIR, "home_province_chengdu_selected.png"))
    print("Captured Chengdu selected screenshot")

    ctx.close()

    # 2. Mobile view (390 x 844)
    mobile_ctx = browser.new_context(
        viewport={"width": 390, "height": 844},
        user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
    )
    mobile_page = mobile_ctx.new_page()
    mobile_page.goto(url)
    mobile_page.wait_for_timeout(1800)
    p5 = os.path.join(SCREENSHOT_DIR, "home_province_dashed_mobile.png")
    mobile_page.screenshot(path=p5)
    if os.path.exists(ARTIFACT_DIR):
        shutil.copy(p5, os.path.join(ARTIFACT_DIR, "home_province_dashed_mobile.png"))
    print("Captured mobile screenshot")
    mobile_ctx.close()

    browser.close()

print("All screenshots captured successfully!")
