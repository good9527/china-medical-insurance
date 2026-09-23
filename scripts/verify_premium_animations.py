import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACT_DIR = r"C:\Users\19901\.gemini\antigravity\brain\ab264cee-a783-46c6-9006-711cd2f6a1e3"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        print(">>> 导航至 http://localhost:5173/ ...")
        await page.goto("http://localhost:5173/", wait_until="networkidle")
        await page.wait_for_timeout(1000)

        # 1. 初始页面全景截图（捕获入场完成后的高级质感）
        overview_path = os.path.join(ARTIFACT_DIR, "home_premium_overview.png")
        await page.screenshot(path=overview_path)
        print(f"[OK] Saved overview: {overview_path}")

        # 2. 切换图层指标至【职工三级住院比】
        print(">>> 点击切换指标至【职工三级住院比】...")
        inpatient_chip = page.locator(".dim-chip").nth(1)
        await inpatient_chip.click()
        # 等待液态颜色平滑过渡 0.45s 结束
        await page.wait_for_timeout(600)
        metric_switched_path = os.path.join(ARTIFACT_DIR, "home_metric_switched.png")
        await page.screenshot(path=metric_switched_path)
        print(f"[OK] Saved metric switched: {metric_switched_path}")

        # 3. 悬浮在地图区域探索统筹区探针 Tooltip
        print(">>> 鼠标悬浮在地图区域，触发磨砂玻璃探针 Tooltip...")
        # 移动到地图中心位置
        stage = page.locator(".svg-viewport")
        box = await stage.bounding_box()
        if box:
            # 探测四川/遂宁附近 (大约中心略偏左下)
            hover_x = box["x"] + box["width"] * 0.52
            hover_y = box["y"] + box["height"] * 0.58
            await page.mouse.move(hover_x, hover_y)
            await page.wait_for_timeout(300)
            tooltip_path = os.path.join(ARTIFACT_DIR, "home_hover_tooltip.png")
            await page.screenshot(path=tooltip_path)
            print(f"[OK] Saved tooltip: {tooltip_path}")

        # 4. 点击标杆统筹区【深圳市 91.6】触发航拍镜头推进与 Bento 卡片弹性升起
        print(">>> 点击标杆统筹区【深圳市 91.6】...")
        bench_sz = page.locator(".bench-item", has_text="深圳市")
        await bench_sz.click()
        # 等待运镜 0.52s 与卡片弹性升起 0.36s
        await page.wait_for_timeout(700)
        dock_active_path = os.path.join(ARTIFACT_DIR, "home_dock_active.png")
        await page.screenshot(path=dock_active_path)
        print(f"[OK] Saved dock active: {dock_active_path}")

        # 5. 点击右上角【复位全景】按钮
        print(">>> 点击【复位全景】按钮...")
        reset_btn = page.locator(".map-reset-btn")
        await reset_btn.click()
        await page.wait_for_timeout(700)
        reset_path = os.path.join(ARTIFACT_DIR, "home_after_reset.png")
        await page.screenshot(path=reset_path)
        print(f"[OK] Saved reset: {reset_path}")

        # 6. 点击【数据来源与合规说明 ↗】查看合规模态框弹性展开
        print(">>> 点击【数据来源与合规说明 ↗】...")
        source_badge = page.locator(".hero-badge-pill")
        await source_badge.click()
        await page.wait_for_timeout(400)
        modal_path = os.path.join(ARTIFACT_DIR, "home_source_modal_premium.png")
        await page.screenshot(path=modal_path)
        print(f"[OK] Saved modal: {modal_path}")

        await browser.close()
        print(">>> 全部高级感视觉与动效测试完成！")

if __name__ == "__main__":
    asyncio.run(main())
