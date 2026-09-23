import os
import time
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
from playwright.sync_api import sync_playwright

PORT = 9987
DIST_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist", "build", "h5")

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def log_message(self, format, *args):
        pass

server = HTTPServer(('127.0.0.1', PORT), Handler)
server_thread = threading.Thread(target=server.serve_forever, daemon=True)
server_thread.start()

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        headless=True
    )
    page = browser.new_page()
    page.goto(f"http://127.0.0.1:{PORT}/#/pages/home/index")
    page.wait_for_timeout(2000)

    # 1. Check initial transform
    t0 = page.eval_on_selector('.map-root-g', 'el => el.getAttribute("transform")')
    print('Initial transform:', t0)

    # 2. Move mouse over the map
    el = page.query_selector('.svg-viewport')
    box = el.bounding_box()
    mx = box['x'] + box['width'] * 0.5
    my = box['y'] + box['height'] * 0.5
    page.mouse.move(mx, my)

    # 3. Test 往前滚 (scroll up, deltaY < 0 -> 放大)
    print("Testing 往前滚 (scroll up, zoom in)...")
    page.mouse.wheel(0, -300)
    page.wait_for_timeout(300)
    t1 = page.eval_on_selector('.map-root-g', 'el => el.getAttribute("transform")')
    print('After 往前滚 (zoom in):', t1)

    # 4. Test 往前滚 again (zoom in more)
    page.mouse.wheel(0, -300)
    page.wait_for_timeout(300)
    t2 = page.eval_on_selector('.map-root-g', 'el => el.getAttribute("transform")')
    print('After 2nd 往前滚 (zoom in more):', t2)

    # 5. Test 往后滚 (scroll down, deltaY > 0 -> 缩小)
    print("Testing 往后滚 (scroll down, zoom out)...")
    page.mouse.wheel(0, 300)
    page.wait_for_timeout(300)
    t3 = page.eval_on_selector('.map-root-g', 'el => el.getAttribute("transform")')
    print('After 往后滚 (zoom out):', t3)

    # 6. Test clicking "复位全景"
    print("Testing clicking 复位全景...")
    page.locator('.map-reset-btn').click()
    page.wait_for_timeout(400)
    t4 = page.eval_on_selector('.map-root-g', 'el => el.getAttribute("transform")')
    print('After 复位全景:', t4)

    # Take screenshot of zoomed in
    page.mouse.wheel(0, -500)
    page.wait_for_timeout(500)
    page.screenshot(path="screenshots/home_wheel_zoomed.png")

    # Take screenshot after reset
    page.locator('.map-reset-btn').click()
    page.wait_for_timeout(500)
    page.screenshot(path="screenshots/home_after_reset_clicked.png")

    browser.close()

print("All tests completed successfully!")
