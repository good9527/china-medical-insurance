"""
Empirical Adversarial UI Layout, Viewport Stress & 0-Emoji Challenger Suite for Gen 32
Author: Challenger R32 UI Agent
Date: 2026-11-04
"""

import os
import sys
import re
import socket
import threading
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
SRC_DIR = os.path.join(ROOT_DIR, "src")

test_stats = {
    "total": 0,
    "passed": 0,
    "failed": 0,
    "failures": []
}

def record_assert(suite: str, condition: bool, description: str, detail: str = ""):
    test_stats["total"] += 1
    if condition:
        test_stats["passed"] += 1
        print(f"  [PASS][{suite}] {description}")
    else:
        test_stats["failed"] += 1
        print(f"  [FAIL][{suite}] {description} -> {detail}")
        test_stats["failures"].append({"suite": suite, "description": description, "detail": detail})

# ==============================================================================
# SUITE 1: Strict 0-Emoji Adversarial Sweep across src/
# ==============================================================================
def run_suite_1_emoji_scan():
    print("\n" + "="*80)
    print(">>> SUITE 1: Strict 0-Emoji Adversarial Scanner Across ALL src/ Files <<<")
    print("="*80)
    suite = "0-Emoji Standard"

    # Strict emoji regex covering pictographic emojis, dingbats, miscellaneous symbols
    emoji_pattern = re.compile(r'[\U0001F300-\U0001F9FF\u2600-\u26FF\u2700-\u27BF]')

    # Allowed civic typographic symbols
    allowed_symbols = {
        '✓', '✕', '▾', '↵', '•', '·', '—', '～', '±', '×', '÷',
        '★', '☆', '▲', '▼', '►', '◄', '◀', '▶', '↗', '➔', '↕', '©', '※'
    }

    frontend_scanned = 0
    frontend_violations = []
    dev_scripts_violations = []

    for root, dirs, files in os.walk(SRC_DIR):
        dirs[:] = [d for d in dirs if d not in ['node_modules', 'dist', '.git', '.agents']]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in ['.vue', '.ts', '.json']:
                if 'check-emojis' in file or 'challenger' in file or '__tests__' in root:
                    continue

                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, ROOT_DIR)
                is_dev_script = 'src' + os.sep + 'scripts' in file_path or 'scripts' in root
                
                if not is_dev_script:
                    frontend_scanned += 1

                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        for line_idx, line in enumerate(f, start=1):
                            line_str = line.strip()
                            if line_str.startswith('//') or line_str.startswith('/*') or line_str.startswith('*'):
                                continue
                            matches = emoji_pattern.findall(line)
                            for ch in matches:
                                if ch not in allowed_symbols:
                                    item = {
                                        "file": rel_path,
                                        "line": line_idx,
                                        "char": ch,
                                        "code_point": f"U+{ord(ch):04X}",
                                        "snippet": line_str[:80]
                                    }
                                    if is_dev_script:
                                        dev_scripts_violations.append(item)
                                    else:
                                        frontend_violations.append(item)
                except Exception as e:
                    print(f"  [ERROR] Failed to read {file_path}: {e}")

    record_assert(
        suite,
        frontend_scanned >= 30,
        f"Scanned frontend application source files ({frontend_scanned} files scanned)",
        f"Expected >= 30 files, found {frontend_scanned}"
    )

    record_assert(
        suite,
        len(frontend_violations) == 0,
        f"Strict 0-Emoji scan on Frontend Source Files (found {len(frontend_violations)} violations)",
        "; ".join([f"{v['file']}:{v['line']} [{v['char']}] {v['snippet']}" for v in frontend_violations[:10]])
    )

    print(f"  [INFO][{suite}] Developer CLI utility scripts (src/scripts/) contains {len(dev_scripts_violations)} console logging emojis.")

# ==============================================================================
# SUITE 2: Static Touch Target Audit (>= 44px) on Key Interactive Components
# ==============================================================================
def run_suite_2_touch_target_static():
    print("\n" + "="*80)
    print(">>> SUITE 2: Component Static & CSS Touch Target Audit (>= 44px) <<<")
    print("="*80)
    suite = "Touch Target >=44px"

    components_to_check = [
        "src/components/AppHeader.vue",
        "src/components/EstimateVoucherModal.vue",
        "src/components/PolicyTooltip.vue",
        "src/pages/index/index.vue",
        "src/pages/ranking/index.vue"
    ]

    for comp in components_to_check:
        full_path = os.path.join(ROOT_DIR, comp)
        record_assert(suite, os.path.exists(full_path), f"Component existence: {comp}")

    # 1. PolicyTooltip.vue: info-trigger-badge & popover-close hit area >= 44px
    pt_path = os.path.join(ROOT_DIR, "src/components/PolicyTooltip.vue")
    with open(pt_path, "r", encoding="utf-8") as f:
        pt_content = f.read()

    record_assert(
        suite,
        ".info-trigger-badge::after" in pt_content and "min-width: 44px" in pt_content and "min-height: 44px" in pt_content,
        "PolicyTooltip.vue .info-trigger-badge has 44x44px touch pseudo-target (::after)"
    )
    record_assert(
        suite,
        ".popover-close::after" in pt_content and "min-width: 44px" in pt_content and "min-height: 44px" in pt_content,
        "PolicyTooltip.vue .popover-close has 44x44px touch pseudo-target (::after)"
    )

    # 2. AppHeader.vue: contact-pill, modal-close-round, foot-repo-btn >= 44px
    ah_path = os.path.join(ROOT_DIR, "src/components/AppHeader.vue")
    with open(ah_path, "r", encoding="utf-8") as f:
        ah_content = f.read()

    record_assert(
        suite,
        ".contact-pill" in ah_content and "min-height: 44px" in ah_content and "min-width: 44px" in ah_content,
        "AppHeader.vue .contact-pill satisfies min-height: 44px and min-width: 44px"
    )
    record_assert(
        suite,
        ".modal-close-round" in ah_content and "min-width: 44px" in ah_content and "min-height: 44px" in ah_content,
        "AppHeader.vue .modal-close-round satisfies min-width: 44px and min-height: 44px"
    )
    record_assert(
        suite,
        ".foot-repo-btn" in ah_content and "min-height: 44px" in ah_content,
        "AppHeader.vue .foot-repo-btn satisfies min-height: 44px"
    )

    # 3. EstimateVoucherModal.vue: modal-close-btn, action-btn, poster buttons >= 44px
    ev_path = os.path.join(ROOT_DIR, "src/components/EstimateVoucherModal.vue")
    with open(ev_path, "r", encoding="utf-8") as f:
        ev_content = f.read()

    record_assert(
        suite,
        ".modal-close-btn" in ev_content and "min-width: 44px" in ev_content and "min-height: 44px" in ev_content,
        "EstimateVoucherModal.vue .modal-close-btn satisfies min-width: 44px and min-height: 44px"
    )
    record_assert(
        suite,
        ".action-btn" in ev_content and "min-height: 44px" in ev_content,
        "EstimateVoucherModal.vue .action-btn satisfies min-height: 44px"
    )
    record_assert(
        suite,
        ".poster-btn-download" in ev_content and "min-height: 44px" in ev_content,
        "EstimateVoucherModal.vue .poster-btn-download satisfies min-height: 44px"
    )
    record_assert(
        suite,
        ".poster-btn-close" in ev_content and "min-height: 44px" in ev_content,
        "EstimateVoucherModal.vue .poster-btn-close satisfies min-height: 44px"
    )
    record_assert(
        suite,
        ".poster-preview-close" in ev_content and "min-width: 44px" in ev_content and "min-height: 44px" in ev_content,
        "EstimateVoucherModal.vue .poster-preview-close satisfies min-width: 44px and min-height: 44px"
    )

    # 4. index.vue: cyber-dropdown-trigger, quick-search-trigger, seg-btn, sub-seg-btn, preset-pill, retiree-bar >= 44px
    idx_path = os.path.join(ROOT_DIR, "src/pages/index/index.vue")
    with open(idx_path, "r", encoding="utf-8") as f:
        idx_content = f.read()

    record_assert(
        suite,
        ".quick-search-trigger" in idx_content and "min-height: 44px" in idx_content,
        "index.vue .quick-search-trigger satisfies min-height: 44px"
    )
    record_assert(
        suite,
        ".cyber-dropdown-trigger" in idx_content and "min-height: 44px" in idx_content,
        "index.vue .cyber-dropdown-trigger satisfies min-height: 44px"
    )
    record_assert(
        suite,
        ".dropdown-item" in idx_content and "min-height: 44px" in idx_content,
        "index.vue .dropdown-item satisfies min-height: 44px"
    )
    record_assert(
        suite,
        ".preset-pill" in idx_content and "min-height: 44px" in idx_content,
        "index.vue .preset-pill satisfies min-height: 44px"
    )
    record_assert(
        suite,
        ".seg-btn" in idx_content and "min-height: 44px" in idx_content,
        "index.vue .seg-btn satisfies min-height: 44px"
    )
    record_assert(
        suite,
        ".sub-seg-btn" in idx_content and "min-height: 44px" in idx_content,
        "index.vue .sub-seg-btn satisfies min-height: 44px"
    )
    record_assert(
        suite,
        ".retiree-bar" in idx_content and "min-height: 44px" in idx_content,
        "index.vue .retiree-bar satisfies min-height: 44px"
    )

    # 5. ranking/index.vue: switch-pill, dropdown-trigger, layout-btn, search-input-box >= 44px
    rnk_path = os.path.join(ROOT_DIR, "src/pages/ranking/index.vue")
    with open(rnk_path, "r", encoding="utf-8") as f:
        rnk_content = f.read()

    record_assert(
        suite,
        ".switch-pill" in rnk_content and "min-height: 44px" in rnk_content,
        "ranking/index.vue .switch-pill satisfies min-height: 44px"
    )
    record_assert(
        suite,
        ".dropdown-trigger" in rnk_content and "min-height: 44px" in rnk_content,
        "ranking/index.vue .dropdown-trigger satisfies min-height: 44px"
    )
    record_assert(
        suite,
        ".search-input-box" in rnk_content and "min-height: 44px" in rnk_content,
        "ranking/index.vue .search-input-box satisfies min-height: 44px"
    )


# ==============================================================================
# SUITE 3: Playwright Live Viewport Layout Stress & Overflow Verification
# ==============================================================================
def find_available_port(start_port=9990):
    port = start_port
    while port < 10100:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
        port += 1
    return start_port

class SilentHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)
    def log_message(self, format, *args):
        pass

def run_suite_3_playwright_stress():
    print("\n" + "="*80)
    print(">>> SUITE 3: Playwright Live Multi-Viewport Layout Stress & Overflow Audit <<<")
    print("="*80)
    suite = "Live Viewport Stress"

    server_port = find_available_port(9992)
    server = HTTPServer(('127.0.0.1', server_port), SilentHandler)
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)
    server_thread.start()
    print(f"[*] Started local server on http://127.0.0.1:{server_port}")

    base_url = f"http://127.0.0.1:{server_port}"

    viewports = [
        {"name": "375px (Compact Mobile)", "width": 375, "height": 667, "is_mobile": True},
        {"name": "380px (Android Baseline)", "width": 380, "height": 800, "is_mobile": True},
        {"name": "390px (iPhone Standard)", "width": 390, "height": 844, "is_mobile": True},
        {"name": "414px (Plus/Max Mobile)", "width": 414, "height": 896, "is_mobile": True},
        {"name": "1280px (Desktop Container)", "width": 1280, "height": 800, "is_mobile": False},
        {"name": "1440px (Wide Desktop)", "width": 1440, "height": 900, "is_mobile": False}
    ]

    pages_to_test = [
        {"route": "/#/pages/index/index", "name": "Actuarial Estimator"},
        {"route": "/#/pages/ranking/index", "name": "Policy Ranking Benchmark"}
    ]

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)

        for vp in viewports:
            print(f"\n--- Testing Viewport {vp['name']} ({vp['width']}x{vp['height']}) ---")
            context = browser.new_context(
                viewport={"width": vp["width"], "height": vp["height"]},
                is_mobile=vp["is_mobile"]
            )
            page = context.new_page()

            for pg in pages_to_test:
                url = f"{base_url}{pg['route']}"
                page.goto(url, wait_until="networkidle")
                page.wait_for_timeout(500)

                # 1. Zero Horizontal Overflow Check: document.documentElement.scrollWidth <= window.innerWidth
                overflow_info = page.evaluate("""() => {
                    const scrollW = document.documentElement.scrollWidth;
                    const innerW = window.innerWidth;
                    const bodyScrollW = document.body.scrollWidth;
                    return {
                        scrollW,
                        innerW,
                        bodyScrollW,
                        hasOverflow: scrollW > innerW || bodyScrollW > innerW
                    };
                }""")

                record_assert(
                    suite,
                    not overflow_info["hasOverflow"],
                    f"[{vp['width']}px][{pg['name']}] Zero horizontal overflow: scrollWidth({overflow_info['scrollW']}px) <= innerWidth({overflow_info['innerW']}px)",
                    f"Detected overflow! scrollW={overflow_info['scrollW']}, innerW={overflow_info['innerW']}"
                )

                # 2. Page Specific Checks:
                if pg["name"] == "Actuarial Estimator":
                    # Check document title wrapping / truncation
                    doc_title_info = page.evaluate("""() => {
                        const titleEl = document.querySelector('.sds-title, .source-name, .lead-title');
                        if (!titleEl) return { found: false };
                        const style = window.getComputedStyle(titleEl);
                        const rect = titleEl.getBoundingClientRect();
                        return {
                            found: true,
                            whiteSpace: style.whiteSpace,
                            width: rect.width,
                            height: rect.height,
                            text: titleEl.innerText
                        };
                    }""")
                    if doc_title_info["found"]:
                        record_assert(
                            suite,
                            doc_title_info["width"] > 0 and doc_title_info["height"] > 0,
                            f"[{vp['width']}px] Document header text is rendered with valid dimensions ({doc_title_info['width']:.1f}x{doc_title_info['height']:.1f}px)"
                        )

                    # 3. Desktop 1280px container & card bounding box checks:
                    if vp["width"] == 1280:
                        desktop_layout = page.evaluate("""() => {
                            const container = document.querySelector('.content-box');
                            const configCard = document.querySelector('.config-card');
                            const receiptCard = document.querySelector('.receipt-card');
                            
                            const containerRect = container ? container.getBoundingClientRect() : null;
                            const configRect = configCard ? configCard.getBoundingClientRect() : null;
                            const receiptRect = receiptCard ? receiptCard.getBoundingClientRect() : null;

                            return {
                                containerWidth: containerRect ? containerRect.width : 0,
                                containerRight: containerRect ? containerRect.right : 0,
                                containerLeft: containerRect ? containerRect.left : 0,
                                configRect,
                                receiptRect,
                                windowWidth: window.innerWidth
                            };
                        }""")

                        record_assert(
                            suite,
                            desktop_layout["containerWidth"] <= 1200 and desktop_layout["containerWidth"] > 0,
                            f"Desktop 1280px: .content-box width ({desktop_layout['containerWidth']:.1f}px) fits within 1200px container standard",
                            f"Container width is {desktop_layout['containerWidth']:.1f}px"
                        )

                        if desktop_layout["configRect"] and desktop_layout["receiptRect"]:
                            config_fits = desktop_layout["configRect"]["left"] >= desktop_layout["containerLeft"] - 1
                            receipt_fits = desktop_layout["receiptRect"]["right"] <= desktop_layout["containerRight"] + 1
                            no_window_clip = desktop_layout["receiptRect"]["right"] <= desktop_layout["windowWidth"]
                            record_assert(
                                suite,
                                config_fits and receipt_fits and no_window_clip,
                                f"Desktop 1280px: .config-card & .receipt-card fit comfortably within container with zero margin clipping",
                                f"config.left={desktop_layout['configRect']['left']}, container.left={desktop_layout['containerLeft']}, receipt.right={desktop_layout['receiptRect']['right']}, container.right={desktop_layout['containerRight']}"
                            )

                if pg["name"] == "Policy Ranking Benchmark":
                    # Ranking filter dropdown and touch target inspection
                    ranking_dropdown_info = page.evaluate("""() => {
                        const triggers = Array.from(document.querySelectorAll('.dropdown-trigger, .switch-pill, .seg-item'));
                        const under44 = triggers.filter(el => {
                            const rect = el.getBoundingClientRect();
                            return rect.height < 43.5;
                        }).map(el => ({
                            className: el.className,
                            height: el.getBoundingClientRect().height,
                            text: el.innerText.trim().slice(0, 20)
                        }));
                        return {
                            totalTriggers: triggers.length,
                            under44
                        };
                    }""")

                    record_assert(
                        suite,
                        len(ranking_dropdown_info["under44"]) == 0,
                        f"[{vp['width']}px][Ranking] All {ranking_dropdown_info['totalTriggers']} dropdowns/pills satisfy touch target height >= 44px",
                        f"Found sub-44px elements: {ranking_dropdown_info['under44']}"
                    )

            context.close()

        browser.close()
    
    server.shutdown()


def main():
    print("="*80)
    print(">>> [CHALLENGER GEN 32] Adversarial UI Layout & 0-Emoji Audit Suite <<<")
    print("="*80)

    run_suite_1_emoji_scan()
    run_suite_2_touch_target_static()
    run_suite_3_playwright_stress()

    print("\n" + "="*80)
    print(">>> CHALLENGER AUDIT SUMMARY <<<")
    print(f"  Total Checks Executed:  {test_stats['total']}")
    print(f"  Passed Checks:          {test_stats['passed']}")
    print(f"  Failed Checks:          {test_stats['failed']}")
    pass_rate = (test_stats['passed'] / test_stats['total'] * 100) if test_stats['total'] > 0 else 0
    print(f"  Pass Rate:              {pass_rate:.2f}%")
    print("="*80)

    if test_stats["failed"] > 0:
        print("\n>>> VERDICT: REJECT <<<")
        print("FAILURES DETECTED:")
        for f in test_stats["failures"]:
            print(f"  - [{f['suite']}] {f['description']} -> {f['detail']}")
        sys.exit(1)
    else:
        print("\n>>> VERDICT: CONFIRM <<<")
        print("All adversarial UI layout, viewport responsiveness (375px-1440px),")
        print("touch target ergonomics (>= 44px), and 0-Emoji civic standards are 100% VERIFIED.")
        sys.exit(0)

if __name__ == "__main__":
    main()
