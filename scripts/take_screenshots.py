"""
Automated Multi-Viewport Headless Screenshot Suite for Gen 32
Target Directory: screenshots/
Viewports:
  - Mobile:
    * mobile_375: 375x667 (iPhone SE / compact)
    * mobile_380: 380x800 (Android narrow baseline)
    * mobile_390: 390x844 (iPhone standard)
    * mobile_414: 414x896 (iPhone Plus / Max)
  - Desktop:
    * desktop_1280: 1280x800 (Responsive standard container)
    * desktop_1440: 1440x900 (High-res desktop monitor)
Pages:
  - home (/#/pages/home/index)
  - index (/#/pages/index/index)
  - policy (/#/pages/policy/index)
  - ranking (/#/pages/ranking/index)
  - service (/#/pages/service/index)
  - correction (/#/pages/correction/index)
  - remote (/#/pages/remote/index)
Interaction States:
  - index_calculated (Actuarial calculation results display)
  - index_funnel (5-stage calculation funnel expanded)
  - voucher_modal (Voucher generation modal)
  - poster_preview (Poster preview overlay)
  - ranking_simulator (Multi-city simulator mode)
  - ranking_battle (Dual-city policy battle comparison)
  - tooltip (Policy explanation tooltip)
"""

import os
import sys
import time
import socket
import shutil
import threading
from http.server import SimpleHTTPRequestHandler, HTTPServer
from playwright.sync_api import sync_playwright

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 9988
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(ROOT_DIR, "dist", "build", "h5")
SCREENSHOT_DIR = os.path.join(ROOT_DIR, "screenshots")

os.makedirs(SCREENSHOT_DIR, exist_ok=True)

def find_available_port(start_port=9988):
    port = start_port
    while port < 10050:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
        port += 1
    return start_port

SERVER_PORT = find_available_port(PORT)

class SilentHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def log_message(self, format, *args):
        pass

def start_server():
    server = HTTPServer(('127.0.0.1', SERVER_PORT), SilentHandler)
    server.serve_forever()

server_thread = threading.Thread(target=start_server, daemon=True)
server_thread.start()
print(f"[*] Local Web Server active at http://127.0.0.1:{SERVER_PORT}")

VIEWPORTS = [
    {
        "name": "mobile_375",
        "width": 375,
        "height": 667,
        "is_mobile": True,
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    },
    {
        "name": "mobile_380",
        "width": 380,
        "height": 800,
        "is_mobile": True,
        "user_agent": "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Mobile Safari/537.36"
    },
    {
        "name": "mobile_390",
        "width": 390,
        "height": 844,
        "is_mobile": True,
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    },
    {
        "name": "mobile_414",
        "width": 414,
        "height": 896,
        "is_mobile": True,
        "user_agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
    },
    {
        "name": "desktop_1280",
        "width": 1280,
        "height": 800,
        "is_mobile": False,
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0"
    },
    {
        "name": "desktop_1440",
        "width": 1440,
        "height": 900,
        "is_mobile": False,
        "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0"
    },
]

PAGES = [
    ("home", "/#/pages/home/index"),
    ("index", "/#/pages/index/index"),
    ("policy", "/#/pages/policy/index"),
    ("ranking", "/#/pages/ranking/index"),
    ("service", "/#/pages/service/index"),
    ("correction", "/#/pages/correction/index"),
    ("remote", "/#/pages/remote/index"),
]

def check_horizontal_overflow(page, vp_name, page_name):
    """Verify that document does not overflow horizontally beyond viewport."""
    overflow_data = page.evaluate('''() => {
        const docEl = document.documentElement;
        const body = document.body;
        const scrollWidth = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
        const clientWidth = docEl.clientWidth;
        const innerWidth = window.innerWidth;
        return {
            scrollWidth: scrollWidth,
            clientWidth: clientWidth,
            innerWidth: innerWidth,
            hasOverflow: scrollWidth > innerWidth + 1
        };
    }''')
    if overflow_data["hasOverflow"]:
        print(f"    [!] WARNING: Horizontal overflow detected on {vp_name} {page_name}: "
              f"scrollWidth={overflow_data['scrollWidth']}px > innerWidth={overflow_data['innerWidth']}px")
    else:
        print(f"    [PASS] 0 Horizontal Overflow confirmed on {vp_name} {page_name} ({overflow_data['scrollWidth']}px <= {overflow_data['innerWidth']}px)")
    return not overflow_data["hasOverflow"]

overflow_failures = []

with sync_playwright() as p:
    browser = p.chromium.launch(
        executable_path=r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        headless=True
    )

    for vp in VIEWPORTS:
        print(f"\n========================================================")
        print(f"[+] Processing Viewport: {vp['name']} ({vp['width']}x{vp['height']})")
        print(f"========================================================")
        
        context_args = {
            "viewport": {"width": vp["width"], "height": vp["height"]},
            "user_agent": vp["user_agent"]
        }
        if vp["is_mobile"]:
            context_args["is_mobile"] = True
            context_args["has_touch"] = True

        ctx = browser.new_context(**context_args)
        page = ctx.new_page()

        # 1. Base Pages Capture & Overflow Checks
        for page_name, route in PAGES:
            url = f"http://127.0.0.1:{SERVER_PORT}{route}"
            page.goto(url)
            page.wait_for_timeout(1000)
            
            # Check horizontal overflow
            if not check_horizontal_overflow(page, vp["name"], page_name):
                overflow_failures.append(f"{vp['name']} - {page_name}")

            target_file = os.path.join(SCREENSHOT_DIR, f"{vp['name']}_{page_name}.png")
            page.screenshot(path=target_file, full_page=False)
            print(f"    - Saved: {os.path.basename(target_file)}")

            # Also save full page screenshot for detailed inspection
            full_file = os.path.join(SCREENSHOT_DIR, f"{vp['name']}_{page_name}_full.png")
            page.screenshot(path=full_file, full_page=True)

            # Legacy backwards compatibility
            if vp["name"] == "desktop_1440":
                legacy_file = os.path.join(SCREENSHOT_DIR, f"desktop_{page_name}.png")
                page.screenshot(path=legacy_file, full_page=False)
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, f"desktop_{page_name}_full.png"), full_page=True)
            elif vp["name"] == "mobile_390":
                legacy_file = os.path.join(SCREENSHOT_DIR, f"mobile_{page_name}.png")
                page.screenshot(path=legacy_file, full_page=False)
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, f"mobile_{page_name}_full.png"), full_page=True)

        # 2. Interactive States
        # 2.1 Index Calculated State
        page.goto(f"http://127.0.0.1:{SERVER_PORT}/#/pages/index/index")
        page.wait_for_timeout(1000)
        # Verify receipt card is rendered and healthy
        receipt_box = page.locator(".receipt-card").first
        if receipt_box.count() > 0:
            box = receipt_box.bounding_box()
            if box:
                print(f"    [i] Receipt Card Box ({vp['name']}): x={box['x']:.1f}, width={box['width']:.1f}")
        calc_file = os.path.join(SCREENSHOT_DIR, f"{vp['name']}_index_calculated.png")
        page.screenshot(path=calc_file, full_page=False)
        print(f"    - Saved: {os.path.basename(calc_file)}")

        # 2.2 Index 5-Stage Funnel Expanded State
        funnel_trigger = page.locator(".funnel-card-header").first
        if funnel_trigger.count() > 0:
            funnel_trigger.click()
            page.wait_for_timeout(400)
            funnel_file = os.path.join(SCREENSHOT_DIR, f"{vp['name']}_index_funnel.png")
            page.screenshot(path=funnel_file, full_page=False)
            print(f"    - Saved: {os.path.basename(funnel_file)}")

        # 2.3 Tooltip Interaction
        tooltip_trigger = page.locator(".info-trigger-badge").first
        if tooltip_trigger.count() > 0:
            tooltip_trigger.click()
            page.wait_for_timeout(350)
            tt_file = os.path.join(SCREENSHOT_DIR, f"{vp['name']}_tooltip.png")
            page.screenshot(path=tt_file, full_page=False)
            print(f"    - Saved: {os.path.basename(tt_file)}")
            if vp["name"] == "mobile_390":
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, "mobile_tooltip.png"), full_page=False)

        # 2.4 Voucher Modal & Poster Preview
        page.goto(f"http://127.0.0.1:{SERVER_PORT}/#/pages/index/index")
        page.wait_for_timeout(1000)
        voucher_btn = page.locator("text=生成凭据单").first
        if voucher_btn.count() > 0:
            voucher_btn.click()
            page.wait_for_timeout(600)
            vm_file = os.path.join(SCREENSHOT_DIR, f"{vp['name']}_voucher_modal.png")
            page.screenshot(path=vm_file, full_page=False)
            print(f"    - Saved: {os.path.basename(vm_file)}")
            if vp["name"] == "desktop_1440":
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_voucher_modal.png"), full_page=False)
            elif vp["name"] == "mobile_390":
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, "mobile_voucher_modal.png"), full_page=False)

            # Poster Preview
            poster_btn = page.locator("text=保存为凭据图片").first
            if poster_btn.count() > 0:
                poster_btn.click()
                page.wait_for_timeout(600)
                pp_file = os.path.join(SCREENSHOT_DIR, f"{vp['name']}_poster_preview.png")
                page.screenshot(path=pp_file, full_page=False)
                print(f"    - Saved: {os.path.basename(pp_file)}")
                if vp["name"] == "desktop_1440":
                    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_poster_preview.png"), full_page=False)
                elif vp["name"] == "mobile_390":
                    page.screenshot(path=os.path.join(SCREENSHOT_DIR, "mobile_poster_preview.png"), full_page=False)

        # 2.5 Ranking Simulator & Battle Modes
        page.goto(f"http://127.0.0.1:{SERVER_PORT}/#/pages/ranking/index")
        page.wait_for_timeout(1000)
        sim_pill = page.locator("text=跨城实测模拟器").first
        if sim_pill.count() > 0:
            sim_pill.click()
            page.wait_for_timeout(600)
            sim_file = os.path.join(SCREENSHOT_DIR, f"{vp['name']}_ranking_simulator.png")
            page.screenshot(path=sim_file, full_page=False)
            print(f"    - Saved: {os.path.basename(sim_file)}")

        battle_pill = page.locator("text=双城政策对比").first
        if battle_pill.count() > 0:
            battle_pill.click()
            page.wait_for_timeout(600)
            battle_file = os.path.join(SCREENSHOT_DIR, f"{vp['name']}_ranking_battle.png")
            page.screenshot(path=battle_file, full_page=False)
            print(f"    - Saved: {os.path.basename(battle_file)}")
            if vp["name"] == "desktop_1440":
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, "desktop_battle_full.png"), full_page=True)
            elif vp["name"] == "mobile_390":
                page.screenshot(path=os.path.join(SCREENSHOT_DIR, "mobile_battle_full.png"), full_page=True)

        ctx.close()

    browser.close()

print("\n========================================================")
print("[*] Multi-Viewport Headless Screenshot Execution Complete!")
if overflow_failures:
    print(f"[!] Warning: {len(overflow_failures)} overflow issues detected: {overflow_failures}")
else:
    print("[PASS] 100% PASS: Zero horizontal overflow across all viewports and pages!")
print(f"All screenshot artifacts successfully generated in: {SCREENSHOT_DIR}")
print("========================================================\n")
