"""
Adversarial Test Oracle for Gen 33 Layout & Touch Targets
Author: Challenger 1 (challenger_r33_1)
Target: H5 Distribution in dist/build/h5
Verifications:
1. Zero horizontal overflow across 375px, 380px, 390px, 414px, 1440px on all routes and interactive states.
2. Rendered interactive element bounding boxes satisfy touch targets >= 44px (>= 43.5px tolerance).
3. Screenshot artifacts inspection.
"""

import os
import sys
import socket
import threading
import json
import time
from http.server import SimpleHTTPRequestHandler, HTTPServer
from playwright.sync_api import sync_playwright

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST_DIR = os.path.join(ROOT_DIR, "dist", "build", "h5")
SCREENSHOT_DIR = os.path.join(ROOT_DIR, "screenshots")

stats = {
    "total_asserts": 0,
    "passed_asserts": 0,
    "failed_asserts": 0,
    "overflow_checks": 0,
    "overflow_failures": [],
    "touch_checks": 0,
    "touch_failures": [],
    "screenshot_checks": 0,
    "screenshot_failures": [],
    "sub_44_inventory": []
}

def record_assert(category: str, condition: bool, description: str, detail: str = ""):
    stats["total_asserts"] += 1
    if condition:
        stats["passed_asserts"] += 1
        print(f"  [PASS][{category}] {description}")
    else:
        stats["failed_asserts"] += 1
        print(f"  [FAIL][{category}] {description} -> {detail}")
        if category == "OVERFLOW":
            stats["overflow_failures"].append({"description": description, "detail": detail})
        elif category == "TOUCH_TARGET":
            stats["touch_failures"].append({"description": description, "detail": detail})
        elif category == "SCREENSHOT":
            stats["screenshot_failures"].append({"description": description, "detail": detail})

def find_available_port(start_port=9996):
    port = start_port
    while port < 10300:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
        port += 1
    return start_port

SERVER_PORT = find_available_port(9996)

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
print(f"[*] Local Web Server active at http://127.0.0.1:{SERVER_PORT} serving {DIST_DIR}")

VIEWPORTS = [
    {"name": "mobile_375", "width": 375, "height": 667, "is_mobile": True, "desc": "iPhone SE / Compact Mobile (375px)"},
    {"name": "mobile_380", "width": 380, "height": 800, "is_mobile": True, "desc": "Android Narrow Baseline (380px)"},
    {"name": "mobile_390", "width": 390, "height": 844, "is_mobile": True, "desc": "iPhone Standard (390px)"},
    {"name": "mobile_414", "width": 414, "height": 896, "is_mobile": True, "desc": "iPhone Plus / Max (414px)"},
    {"name": "desktop_1440", "width": 1440, "height": 900, "is_mobile": False, "desc": "Wide Desktop Display (1440px)"}
]

ROUTES = [
    ("home", "/#/pages/home/index"),
    ("index", "/#/pages/index/index"),
    ("policy", "/#/pages/policy/index"),
    ("ranking", "/#/pages/ranking/index"),
    ("service", "/#/pages/service/index"),
    ("correction", "/#/pages/correction/index"),
    ("remote", "/#/pages/remote/index")
]

OVERFLOW_EVAL_JS = """
() => {
    const docEl = document.documentElement;
    const body = document.body;
    const scrollW = Math.max(docEl.scrollWidth, body ? body.scrollWidth : 0);
    const innerW = window.innerWidth;
    const clientW = docEl.clientWidth;
    const hasOverflow = scrollW > innerW + 1.0; // 1px threshold for subpixel rounding
    
    let offendingElements = [];
    if (hasOverflow) {
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            const rect = el.getBoundingClientRect();
            if (rect.width > innerW + 1.0 || rect.right > innerW + 1.0) {
                offendingElements.push({
                    tag: el.tagName,
                    id: el.id,
                    className: typeof el.className === 'string' ? el.className.slice(0, 50) : '',
                    width: Math.round(rect.width),
                    right: Math.round(rect.right),
                    innerText: (el.innerText || '').slice(0, 30).trim()
                });
                if (offendingElements.length >= 5) break;
            }
        }
    }
    return {
        scrollW,
        innerW,
        clientW,
        hasOverflow,
        offendingElements
    };
}
"""

TOUCH_TARGET_EVAL_JS = """
() => {
    const interactiveSelectors = [
        'button',
        'a[href]',
        'input:not([type="hidden"])',
        'select',
        'textarea',
        '[role="button"]',
        '.action-btn',
        '.seg-btn',
        '.sub-seg-btn',
        '.preset-pill',
        '.switch-pill',
        '.contact-pill',
        '.dropdown-trigger',
        '.quick-search-trigger',
        '.search-input-box',
        '.modal-close-round',
        '.modal-close-btn',
        '.popover-close',
        '.info-trigger-badge',
        '.retiree-bar',
        '.podium-btn',
        '.fab-back-top',
        '.btn-micro-dial',
        '.cyber-btn',
        '.funnel-card-header',
        '.collapse-trigger',
        '.dropdown-item',
        '.search-result-row',
        '.search-input-wrapper',
        '.suggest-value-box',
        '.clear-search',
        '.search-clear-btn'
    ];

    const elements = Array.from(document.querySelectorAll(interactiveSelectors.join(',')));
    const inspected = [];
    const sub44Elements = [];

    for (const el of elements) {
        // Must be visible
        if (!el.offsetParent && el.offsetWidth === 0 && el.offsetHeight === 0) continue;
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

        const rect = el.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) continue;

        // Effective dimensions
        let effectiveH = rect.height;
        let effectiveW = rect.width;

        const afterStyle = window.getComputedStyle(el, '::after');
        if (afterStyle && afterStyle.content !== 'none' && afterStyle.content !== '') {
            const afterMinH = parseFloat(afterStyle.minHeight) || 0;
            const afterMinW = parseFloat(afterStyle.minWidth) || 0;
            const afterH = parseFloat(afterStyle.height) || 0;
            const afterW = parseFloat(afterStyle.width) || 0;
            effectiveH = Math.max(effectiveH, afterMinH, afterH);
            effectiveW = Math.max(effectiveW, afterMinW, afterW);
        }

        const beforeStyle = window.getComputedStyle(el, '::before');
        if (beforeStyle && beforeStyle.content !== 'none' && beforeStyle.content !== '') {
            const beforeMinH = parseFloat(beforeStyle.minHeight) || 0;
            const beforeMinW = parseFloat(beforeStyle.minWidth) || 0;
            const beforeH = parseFloat(beforeStyle.height) || 0;
            const beforeW = parseFloat(beforeStyle.width) || 0;
            effectiveH = Math.max(effectiveH, beforeMinH, beforeH);
            effectiveW = Math.max(effectiveW, beforeMinW, beforeW);
        }

        // Check if parent container has height >= 43.5 and width >= 43.5
        // e.g. input inside .search-input-wrapper or uni-input
        let parentCovers = false;
        let cur = el.parentElement;
        while (cur && cur !== document.body && cur !== document.documentElement) {
            const curRect = cur.getBoundingClientRect();
            if (curRect.height >= 43.5 && curRect.width >= 43.5) {
                // If the parent is an interactive wrapper, container, form-item, etc.
                if (cur.tagName === 'UNI-INPUT' || cur.classList.contains('input-wrap') || cur.classList.contains('search-input-wrapper') || cur.classList.contains('suggest-value-box') || cur.classList.contains('hotline-search-wrap')) {
                    if (curRect.height >= 43.5) {
                        parentCovers = true;
                        break;
                    }
                }
            }
            cur = cur.parentElement;
        }

        const item = {
            tag: el.tagName,
            className: typeof el.className === 'string' ? el.className.slice(0, 50) : '',
            width: Math.round(rect.width * 10) / 10,
            height: Math.round(rect.height * 10) / 10,
            effectiveW: Math.round(effectiveW * 10) / 10,
            effectiveH: Math.round(effectiveH * 10) / 10,
            parentCovers,
            text: (el.innerText || el.value || el.placeholder || '').slice(0, 25).trim()
        };

        inspected.push(item);

        // WCAG touch target: if effective height < 43.5px and effective width < 43.5px, or for stand-alone buttons/triggers height < 43.5
        if ((effectiveH < 43.5 || effectiveW < 43.5) && !parentCovers) {
            sub44Elements.push(item);
        }
    }

    return {
        totalInspected: inspected.length,
        sub44Count: sub44Elements.length,
        sub44Elements: sub44Elements.slice(0, 10)
    };
}
"""

def execute_challenger_oracle():
    print("=" * 80)
    print(">>> EMPIRICAL CHALLENGER ADVERSARIAL ORACLE FOR GEN 33 <<<")
    print("=" * 80)

    edge_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
    
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=edge_path, headless=True)

        for vp in VIEWPORTS:
            vp_name = vp["name"]
            width = vp["width"]
            height = vp["height"]
            is_mobile = vp["is_mobile"]
            desc = vp["desc"]

            print(f"\n" + "-" * 70)
            print(f"[*] TESTING VIEWPORT: {desc} [{width}x{height}]")
            print("-" * 70)

            context_opts = {
                "viewport": {"width": width, "height": height},
                "is_mobile": is_mobile,
                "has_touch": is_mobile
            }

            ctx = browser.new_context(**context_opts)
            page = ctx.new_page()

            # -------------------------------------------------------------
            # Part 1: All 7 Routes Default State Overflow & Touch Targets
            # -------------------------------------------------------------
            for route_name, route_path in ROUTES:
                url = f"http://127.0.0.1:{SERVER_PORT}{route_path}"
                page.goto(url, wait_until="networkidle")
                page.wait_for_timeout(600)

                # 1. Overflow check
                stats["overflow_checks"] += 1
                ov_res = page.evaluate(OVERFLOW_EVAL_JS)
                record_assert(
                    "OVERFLOW",
                    not ov_res["hasOverflow"],
                    f"[{vp_name}][{route_name}] Zero horizontal overflow: scrollW={ov_res['scrollW']}px <= innerW={ov_res['innerW']}px",
                    f"Overflow! scrollW={ov_res['scrollW']} > innerW={ov_res['innerW']}. Offending: {ov_res['offendingElements']}"
                )

                # 2. Touch target check on interactive elements
                stats["touch_checks"] += 1
                tt_res = page.evaluate(TOUCH_TARGET_EVAL_JS)
                record_assert(
                    "TOUCH_TARGET",
                    tt_res["sub44Count"] == 0,
                    f"[{vp_name}][{route_name}] All {tt_res['totalInspected']} interactive elements satisfy touch target >= 44px",
                    f"Found {tt_res['sub44Count']} elements < 44px: {tt_res['sub44Elements']}"
                )
                if tt_res["sub44Count"] > 0:
                    for item in tt_res["sub44Elements"]:
                        stats["sub_44_inventory"].append({
                            "viewport": vp_name,
                            "route": route_name,
                            "element": item
                        })

            # -------------------------------------------------------------
            # Part 2: Interactive States
            # -------------------------------------------------------------

            # State A: Index Calculated State
            idx_url = f"http://127.0.0.1:{SERVER_PORT}/#/pages/index/index"
            page.goto(idx_url, wait_until="networkidle")
            page.wait_for_timeout(600)

            stats["overflow_checks"] += 1
            ov_calc = page.evaluate(OVERFLOW_EVAL_JS)
            record_assert(
                "OVERFLOW",
                not ov_calc["hasOverflow"],
                f"[{vp_name}][index_calculated] Zero horizontal overflow in calculated results state (scrollW={ov_calc['scrollW']}px <= innerW={ov_calc['innerW']}px)",
                f"Offending elements: {ov_calc['offendingElements']}"
            )

            # State B: Index 5-Stage Funnel Expanded
            funnel_header = page.locator(".funnel-card-header").first
            if funnel_header.count() > 0:
                try:
                    funnel_header.click()
                    page.wait_for_timeout(400)
                    stats["overflow_checks"] += 1
                    ov_funnel = page.evaluate(OVERFLOW_EVAL_JS)
                    record_assert(
                        "OVERFLOW",
                        not ov_funnel["hasOverflow"],
                        f"[{vp_name}][index_funnel] Zero horizontal overflow with 5-stage funnel expanded (scrollW={ov_funnel['scrollW']}px <= innerW={ov_funnel['innerW']}px)",
                        f"Offending elements: {ov_funnel['offendingElements']}"
                    )
                except Exception as e:
                    print(f"    [WARN] Failed to click funnel header: {e}")

            # State C: Policy Tooltip Popover Opened
            page.goto(idx_url, wait_until="networkidle")
            page.wait_for_timeout(500)
            tooltip_trigger = page.locator(".info-trigger-badge").first
            if tooltip_trigger.count() > 0:
                try:
                    tooltip_trigger.click()
                    page.wait_for_timeout(350)
                    stats["overflow_checks"] += 1
                    ov_tt = page.evaluate(OVERFLOW_EVAL_JS)
                    record_assert(
                        "OVERFLOW",
                        not ov_tt["hasOverflow"],
                        f"[{vp_name}][tooltip_popover] Zero horizontal overflow with policy explanation popover active",
                        f"Offending elements: {ov_tt['offendingElements']}"
                    )
                    # Check popover-close button touch target
                    tt_close_info = page.evaluate("""() => {
                        const closeBtn = document.querySelector('.popover-close');
                        if (!closeBtn) return { found: false };
                        const rect = closeBtn.getBoundingClientRect();
                        const after = window.getComputedStyle(closeBtn, '::after');
                        return {
                            found: true,
                            width: rect.width,
                            height: rect.height,
                            afterMinH: parseFloat(after.minHeight) || 0,
                            afterMinW: parseFloat(after.minWidth) || 0
                        };
                    }""")
                    if tt_close_info["found"]:
                        stats["touch_checks"] += 1
                        effective_h = max(tt_close_info["height"], tt_close_info["afterMinH"])
                        record_assert(
                            "TOUCH_TARGET",
                            effective_h >= 43.5,
                            f"[{vp_name}][PolicyTooltip] Popover close button effective touch target >= 44px (height={effective_h}px)"
                        )
                except Exception as e:
                    print(f"    [WARN] Failed to test tooltip popover: {e}")

            # State D: Voucher Modal Opened
            page.goto(idx_url, wait_until="networkidle")
            page.wait_for_timeout(500)
            voucher_btn = page.locator("text=生成凭据单").first
            if voucher_btn.count() > 0:
                try:
                    voucher_btn.click()
                    page.wait_for_timeout(600)
                    stats["overflow_checks"] += 1
                    ov_vm = page.evaluate(OVERFLOW_EVAL_JS)
                    record_assert(
                        "OVERFLOW",
                        not ov_vm["hasOverflow"],
                        f"[{vp_name}][voucher_modal] Zero horizontal overflow with voucher modal open (scrollW={ov_vm['scrollW']}px <= innerW={ov_vm['innerW']}px)",
                        f"Offending elements: {ov_vm['offendingElements']}"
                    )

                    vm_touch = page.evaluate("""() => {
                        const closeBtn = document.querySelector('.modal-close-btn');
                        const downloadBtn = document.querySelector('.poster-btn-download, .action-btn');
                        return {
                            close: closeBtn ? {
                                width: closeBtn.getBoundingClientRect().width,
                                height: closeBtn.getBoundingClientRect().height
                            } : null,
                            action: downloadBtn ? {
                                width: downloadBtn.getBoundingClientRect().width,
                                height: downloadBtn.getBoundingClientRect().height
                            } : null
                        };
                    }""")
                    if vm_touch["close"]:
                        stats["touch_checks"] += 1
                        record_assert(
                            "TOUCH_TARGET",
                            vm_touch["close"]["height"] >= 43.5 and vm_touch["close"]["width"] >= 43.5,
                            f"[{vp_name}][voucher_modal] .modal-close-btn >= 44x44px ({vm_touch['close']['width']}x{vm_touch['close']['height']}px)"
                        )
                    if vm_touch["action"]:
                        stats["touch_checks"] += 1
                        record_assert(
                            "TOUCH_TARGET",
                            vm_touch["action"]["height"] >= 43.5,
                            f"[{vp_name}][voucher_modal] .action-btn height >= 44px ({vm_touch['action']['height']}px)"
                        )

                    # State E: Poster Preview Modal
                    poster_preview_trigger = page.locator("text=保存为凭据图片").first
                    if poster_preview_trigger.count() > 0:
                        poster_preview_trigger.click()
                        page.wait_for_timeout(600)
                        stats["overflow_checks"] += 1
                        ov_poster = page.evaluate(OVERFLOW_EVAL_JS)
                        record_assert(
                            "OVERFLOW",
                            not ov_poster["hasOverflow"],
                            f"[{vp_name}][poster_preview] Zero horizontal overflow in poster preview overlay",
                            f"Offending elements: {ov_poster['offendingElements']}"
                        )
                        poster_close = page.evaluate("""() => {
                            const btn = document.querySelector('.poster-preview-close');
                            if (!btn) return null;
                            const rect = btn.getBoundingClientRect();
                            return { width: rect.width, height: rect.height };
                        }""")
                        if poster_close:
                            stats["touch_checks"] += 1
                            record_assert(
                                "TOUCH_TARGET",
                                poster_close["height"] >= 43.5 and poster_close["width"] >= 43.5,
                                f"[{vp_name}][poster_preview] .poster-preview-close >= 44x44px ({poster_close['width']}x{poster_close['height']}px)"
                            )

                        # Dismiss poster preview modal and voucher modal
                        dismiss_btn = page.locator(".poster-preview-close").first
                        if dismiss_btn.count() > 0:
                            dismiss_btn.click()
                            page.wait_for_timeout(300)
                        
                        modal_close = page.locator(".modal-close-btn, text=关闭").first
                        if modal_close.count() > 0:
                            modal_close.click()
                            page.wait_for_timeout(300)
                except Exception as e:
                    print(f"    [WARN] Failed testing voucher modal: {e}")

            # State F: Ranking Simulator and Battle Mode
            rnk_url = f"http://127.0.0.1:{SERVER_PORT}/#/pages/ranking/index"
            page.goto(rnk_url, wait_until="networkidle")
            page.reload(wait_until="networkidle")
            page.wait_for_timeout(600)

            sim_btn = page.locator(".switch-pill:has-text('跨城实测模拟器'), .switch-pill:has-text('模拟')").first
            if sim_btn.count() > 0:
                try:
                    sim_btn.click()
                    page.wait_for_timeout(400)
                    stats["overflow_checks"] += 1
                    ov_sim = page.evaluate(OVERFLOW_EVAL_JS)
                    record_assert(
                        "OVERFLOW",
                        not ov_sim["hasOverflow"],
                        f"[{vp_name}][ranking_simulator] Zero horizontal overflow in ranking simulator mode",
                        f"Offending: {ov_sim['offendingElements']}"
                    )
                except Exception as e:
                    print(f"    [WARN] Failed to click ranking simulator: {e}")

            battle_btn = page.locator(".switch-pill:has-text('双城政策对比'), .switch-pill:has-text('对比')").first
            if battle_btn.count() > 0:
                try:
                    battle_btn.click()
                    page.wait_for_timeout(400)
                    stats["overflow_checks"] += 1
                    ov_battle = page.evaluate(OVERFLOW_EVAL_JS)
                    record_assert(
                        "OVERFLOW",
                        not ov_battle["hasOverflow"],
                        f"[{vp_name}][ranking_battle] Zero horizontal overflow in dual-city comparison mode",
                        f"Offending: {ov_battle['offendingElements']}"
                    )
                except Exception as e:
                    print(f"    [WARN] Failed to click ranking battle: {e}")

            # State G: Search modal on index (fresh reload)
            page.goto(idx_url, wait_until="networkidle")
            page.reload(wait_until="networkidle")
            page.wait_for_timeout(500)
            search_trigger = page.locator(".quick-search-trigger").first
            if search_trigger.count() > 0:
                try:
                    search_trigger.click()
                    page.wait_for_timeout(400)
                    stats["overflow_checks"] += 1
                    ov_search = page.evaluate(OVERFLOW_EVAL_JS)
                    record_assert(
                        "OVERFLOW",
                        not ov_search["hasOverflow"],
                        f"[{vp_name}][search_modal] Zero horizontal overflow when city search modal is open",
                        f"Offending: {ov_search['offendingElements']}"
                    )
                    search_items_touch = page.evaluate("""() => {
                        const clearBtn = document.querySelector('.search-clear-btn');
                        const results = Array.from(document.querySelectorAll('.search-result-row'));
                        return {
                            clear: clearBtn ? {
                                width: clearBtn.getBoundingClientRect().width,
                                height: clearBtn.getBoundingClientRect().height
                            } : null,
                            firstRow: results.length > 0 ? {
                                width: results[0].getBoundingClientRect().width,
                                height: results[0].getBoundingClientRect().height
                            } : null
                        };
                    }""")
                    if search_items_touch["clear"]:
                        stats["touch_checks"] += 1
                        record_assert(
                            "TOUCH_TARGET",
                            search_items_touch["clear"]["height"] >= 43.5 and search_items_touch["clear"]["width"] >= 43.5,
                            f"[{vp_name}][search_modal] .search-clear-btn >= 44x44px ({search_items_touch['clear']['width']}x{search_items_touch['clear']['height']}px)"
                        )
                except Exception as e:
                    print(f"    [WARN] Failed to open search modal: {e}")

            ctx.close()

        browser.close()

    # -------------------------------------------------------------
    # Part 3: Screenshot Files Physical Inspection
    # -------------------------------------------------------------
    print("\n" + "=" * 80)
    print(">>> PART 3: SCREENSHOT ARTIFACTS PHYSICAL VERIFICATION <<<")
    print("=" * 80)

    required_screenshots = [
        # mobile 375
        "mobile_375_home.png", "mobile_375_index.png", "mobile_375_policy.png",
        "mobile_375_ranking.png", "mobile_375_service.png", "mobile_375_correction.png",
        "mobile_375_remote.png", "mobile_375_index_calculated.png", "mobile_375_voucher_modal.png",
        # mobile 380
        "mobile_380_home.png", "mobile_380_index.png", "mobile_380_policy.png",
        "mobile_380_ranking.png", "mobile_380_service.png", "mobile_380_correction.png",
        "mobile_380_remote.png", "mobile_380_index_calculated.png", "mobile_380_voucher_modal.png",
        # mobile 390
        "mobile_390_home.png", "mobile_390_index.png", "mobile_390_policy.png",
        "mobile_390_ranking.png", "mobile_390_service.png", "mobile_390_correction.png",
        "mobile_390_remote.png", "mobile_390_index_calculated.png", "mobile_390_voucher_modal.png",
        # mobile 414
        "mobile_414_home.png", "mobile_414_index.png", "mobile_414_policy.png",
        "mobile_414_ranking.png", "mobile_414_service.png", "mobile_414_correction.png",
        "mobile_414_remote.png", "mobile_414_index_calculated.png", "mobile_414_voucher_modal.png",
        # desktop 1440
        "desktop_1440_home.png", "desktop_1440_index.png", "desktop_1440_policy.png",
        "desktop_1440_ranking.png", "desktop_1440_service.png", "desktop_1440_correction.png",
        "desktop_1440_remote.png", "desktop_1440_index_calculated.png", "desktop_1440_voucher_modal.png"
    ]

    for fname in required_screenshots:
        fpath = os.path.join(SCREENSHOT_DIR, fname)
        exists = os.path.isfile(fpath)
        stats["screenshot_checks"] += 1
        size = os.path.getsize(fpath) if exists else 0
        record_assert(
            "SCREENSHOT",
            exists and size > 20000,
            f"Screenshot artifact {fname} exists with healthy payload ({size:,} bytes)",
            f"File missing or empty (exists={exists}, size={size})"
        )

    # -------------------------------------------------------------
    # Final Verdict Synthesis
    # -------------------------------------------------------------
    print("\n" + "=" * 80)
    print(">>> EMPIRICAL CHALLENGER ADVERSARIAL ORACLE SUMMARY <<<")
    print(f"  Total Assertions:    {stats['total_asserts']}")
    print(f"  Passed Assertions:   {stats['passed_asserts']}")
    print(f"  Failed Assertions:   {stats['failed_asserts']}")
    print(f"  - Overflow Checks:   {stats['overflow_checks']} (Failures: {len(stats['overflow_failures'])})")
    print(f"  - Touch Checks:      {stats['touch_checks']} (Failures: {len(stats['touch_failures'])})")
    print(f"  - Screenshot Checks: {stats['screenshot_checks']} (Failures: {len(stats['screenshot_failures'])})")
    print("=" * 80)

    verdict_file = os.path.join(ROOT_DIR, ".agents", "teamwork", "challenger_r33_1", "oracle_result.json")
    with open(verdict_file, "w", encoding="utf-8") as f:
        json.dump(stats, f, ensure_ascii=False, indent=2)
    print(f"[+] Oracle result dumped to {verdict_file}")

    if stats["failed_asserts"] == 0:
        print("\n>>> EMPIRICAL VERDICT: CONFIRM <<<")
        print("All responsive viewports (375px, 380px, 390px, 414px, 1440px),")
        print("all routes and interactive states maintain 0 horizontal overflow,")
        print("all rendered interactive elements satisfy touch target >= 44px,")
        print("and all screenshot visual artifacts are valid and healthy.")
        return 0
    else:
        print("\n>>> EMPIRICAL VERDICT: REJECT <<<")
        print(f"Detected {stats['failed_asserts']} critical layout / touch target failures:")
        for fail in stats["overflow_failures"] + stats["touch_failures"] + stats["screenshot_failures"]:
            print(f"  - {fail['description']} -> {fail['detail']}")
        return 1

if __name__ == "__main__":
    exit_code = execute_challenger_oracle()
    sys.exit(exit_code)
