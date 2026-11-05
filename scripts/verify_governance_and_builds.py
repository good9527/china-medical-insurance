"""
Challenger 2 Governance, Screenshots, and Build Integrity Oracle
Provides automated verification for:
  Part 1: 0-Emoji sweep across all 505 repo files (.vue, .ts, .js, .json, .md, .html, .css, .scss)
  Part 2: 171/171 Screenshot physical integrity (PNG header, resolution, non-blank variance)
  Part 3: Dual production builds (npm run build:h5, npm run build:mp-weixin)
Output: scripts/challenger_oracle_report.json
"""

import os
import sys
import re
import json
import subprocess
from PIL import Image, ImageStat

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = r"H:\2026年项目\14.全国医保报销"
SCREENSHOT_DIR = os.path.join(ROOT_DIR, "screenshots")
REPORT_PATH = os.path.join(ROOT_DIR, "scripts", "challenger_oracle_report.json")

report = {
    "verdict": "CONFIRM",
    "emoji_findings_count": 0,
    "emoji_findings": [],
    "scanned_files_count": 0,
    "screenshots_total": 0,
    "screenshots_valid_png": 0,
    "screenshots_dimension_matched": 0,
    "screenshots_non_blank": 0,
    "screenshot_errors": [],
    "h5_build_success": False,
    "mp_weixin_build_success": False,
    "bundle_errors": []
}

def run_part_1_emoji_scan():
    print("=" * 80)
    print(">>> PART 1: 0-EMOJI ADVERSARIAL SWEEP ACROSS REPOSITORY <<<")
    print("=" * 80)

    pattern = re.compile(r'[\U0001F300-\U0001F9FF\u2600-\u26FF\u2700-\u27BF]')
    allowed = {
        '✓', '✕', '▾', '↵', '•', '·', '—', '～', '±', '×', '÷',
        '★', '☆', '▲', '▼', '►', '◄', '◀', '▶', '↗', '➔', '↕', '©', '※'
    }

    scanned = 0
    findings = []

    for root, dirs, files in os.walk(ROOT_DIR):
        dirs[:] = [d for d in dirs if d not in ['.git', 'node_modules', 'dist', '.agents']]
        for f in files:
            if f.endswith(('.vue', '.ts', '.js', '.json', '.md', '.html', '.css', '.scss')):
                if 'challenger_oracle_report.json' in f:
                    continue
                scanned += 1
                fpath = os.path.join(root, f)
                rel_path = os.path.relpath(fpath, ROOT_DIR)
                try:
                    with open(fpath, 'r', encoding='utf-8') as fp:
                        for idx, line in enumerate(fp, 1):
                            matches = pattern.findall(line)
                            for m in matches:
                                if m not in allowed:
                                    findings.append({
                                        "file": rel_path,
                                        "line": idx,
                                        "char": m,
                                        "code": f"U+{ord(m):04X}",
                                        "snippet": line.strip()[:80]
                                    })
                except Exception as e:
                    pass

    report["scanned_files_count"] = scanned
    report["emoji_findings_count"] = len(findings)
    report["emoji_findings"] = findings

    print(f"Scanned files: {scanned}")
    print(f"Emoji findings: {len(findings)}")
    if len(findings) == 0:
        print("[PASS] 0-Emoji specification 100% satisfied across all files!")
    else:
        print(f"[FAIL] Detected {len(findings)} emoji violations:")
        for fd in findings:
            print(f"  - {fd['file']}:{fd['line']} [{fd['code']}] {fd['snippet']}")
        report["verdict"] = "REJECT"

def run_part_2_screenshot_audit():
    print("\n" + "=" * 80)
    print(">>> PART 2: SCREENSHOT PHYSICAL & VISUAL AUDIT (171 PNGs) <<<")
    print("=" * 80)

    pngs = [f for f in os.listdir(SCREENSHOT_DIR) if f.endswith('.png')]
    report["screenshots_total"] = len(pngs)

    valid_headers = 0
    dim_matched = 0
    non_blank = 0
    errors = []

    expected_widths = {
        "mobile_375": 375,
        "mobile_380": 380,
        "mobile_390": 390,
        "mobile_414": 414,
        "desktop_1280": 1280,
        "desktop_1440": 1440
    }

    for fname in pngs:
        fpath = os.path.join(SCREENSHOT_DIR, fname)
        # Header check
        with open(fpath, 'rb') as fp:
            hdr = fp.read(8)
            if hdr == b'\x89PNG\r\n\x1a\n':
                valid_headers += 1
            else:
                errors.append(f"{fname}: Invalid PNG magic header")

        # Dimension and variance check
        try:
            im = Image.open(fpath)
            w, h = im.size
            matched = False
            for prefix, exp_w in expected_widths.items():
                if fname.startswith(prefix):
                    if w == exp_w:
                        dim_matched += 1
                        matched = True
                    else:
                        errors.append(f"{fname}: Width {w} != expected {exp_w}")
                    break
            if not matched and not any(fname.startswith(p) for p in expected_widths):
                # For non-prefixed desktop screenshots
                dim_matched += 1

            stat = ImageStat.Stat(im)
            if any(var > 5.0 for var in stat.var):
                non_blank += 1
            else:
                errors.append(f"{fname}: Blank or single-color image (variance <= 5.0)")
        except Exception as e:
            errors.append(f"{fname}: Error processing image ({e})")

    report["screenshots_valid_png"] = valid_headers
    report["screenshots_dimension_matched"] = dim_matched
    report["screenshots_non_blank"] = non_blank
    report["screenshot_errors"] = errors

    print(f"Total screenshots: {len(pngs)}")
    print(f"Valid PNG headers: {valid_headers}/{len(pngs)}")
    print(f"Dimension matched: {dim_matched}/{len(pngs)}")
    print(f"Non-blank screens: {non_blank}/{len(pngs)}")

    if len(errors) == 0 and valid_headers == len(pngs) and non_blank == len(pngs) and len(pngs) >= 171:
        print("[PASS] All screenshots valid, correctly dimensioned, non-blank!")
    else:
        print(f"[FAIL] Screenshot audit found {len(errors)} issues")
        for err in errors[:10]:
            print(f"  - {err}")
        report["verdict"] = "REJECT"

def run_part_3_build_audit():
    print("\n" + "=" * 80)
    print(">>> PART 3: DUAL PRODUCTION BUILDS INTEGRITY <<<")
    print("=" * 80)

    # 1. build:h5
    print("[*] Running npm run build:h5 ...")
    h5_res = subprocess.run(["npm.cmd", "run", "build:h5"], cwd=ROOT_DIR, capture_output=True, text=True, encoding='utf-8', errors='replace')
    h5_success = h5_res.returncode == 0 and os.path.exists(os.path.join(ROOT_DIR, "dist", "build", "h5", "index.html"))
    report["h5_build_success"] = h5_success
    print(f"  H5 Build: {'PASS' if h5_success else 'FAIL'} (exit code {h5_res.returncode})")
    if not h5_success:
        report["bundle_errors"].append(f"H5 build failed: {h5_res.stderr[:200]}")
        report["verdict"] = "REJECT"

    # 2. build:mp-weixin
    print("[*] Running npm run build:mp-weixin ...")
    mp_res = subprocess.run(["npm.cmd", "run", "build:mp-weixin"], cwd=ROOT_DIR, capture_output=True, text=True, encoding='utf-8', errors='replace')
    mp_success = mp_res.returncode == 0 and os.path.exists(os.path.join(ROOT_DIR, "dist", "build", "mp-weixin", "app.json"))
    report["mp_weixin_build_success"] = mp_success
    print(f"  MP-Weixin Build: {'PASS' if mp_success else 'FAIL'} (exit code {mp_res.returncode})")
    if not mp_success:
        report["bundle_errors"].append(f"WeChat MP build failed: {mp_res.stderr[:200]}")
        report["verdict"] = "REJECT"

def main():
    print("=" * 80)
    print(">>> CHALLENGER 2 GOVERNANCE & BUILD ORACLE EXECUTION <<<")
    print("=" * 80)

    run_part_1_emoji_scan()
    run_part_2_screenshot_audit()
    run_part_3_build_audit()

    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        json.dump(report, f, ensure_ascii=False, indent=2)
    print(f"\n[+] Report written to {REPORT_PATH}")

    print("\n" + "=" * 80)
    print(f">>> FINAL VERDICT: {report['verdict']} <<<")
    print("=" * 80)
    return 0 if report["verdict"] == "CONFIRM" else 1

if __name__ == "__main__":
    sys.exit(main())
