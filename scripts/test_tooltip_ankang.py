import asyncio
import os
from playwright.async_api import async_playwright

ARTIFACT_DIR = r"C:\Users\19901\.gemini\antigravity\brain\ab264cee-a783-46c6-9006-711cd2f6a1e3"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # Use a realistic viewport like user's browser
        context = await browser.new_context(viewport={"width": 1440, "height": 900})
        page = await context.new_page()

        await page.goto("http://localhost:5173/", wait_until="networkidle")
        await page.wait_for_timeout(800)

        # 找到安康市多边形
        # 安康市 cityCode: 610900
        # Hover over Ankang
        print(">>> 寻找并悬浮在安康市 (610900)...")
        # 直接找到 path 并 hover
        ankang_path = page.locator("path.city-path").nth(150) # 或通过搜索聚焦
        # 也可以在搜索框输入安康
        search_input = page.locator(".map-search-input input")
        await search_input.fill("安康")
        await page.wait_for_timeout(300)
        sug = page.locator(".suggest-item", has_text="安康市")
        if await sug.count() > 0:
            print(">>> 点击定位安康市...")
            await sug.click()
            await page.wait_for_timeout(700)
            
            # 关闭弹出的 activeCity 卡片以测试 hover tooltip
            close_btn = page.locator(".dock-close-btn")
            if await close_btn.count() > 0:
                await close_btn.click()
                await page.wait_for_timeout(300)

        # 此时安康在视野中心偏上，我们移动鼠标到中央以触发 hover
        stage = page.locator(".svg-viewport")
        box = await stage.bounding_box()
        if box:
            hover_x = box["x"] + box["width"] * 0.5
            hover_y = box["y"] + box["height"] * 0.42
            await page.mouse.move(hover_x, hover_y)
            await page.wait_for_timeout(400)

        tooltip = page.locator(".map-hover-tooltip")
        if await tooltip.count() > 0 and await tooltip.is_visible():
            t_box = await tooltip.bounding_box()
            print(f"[OK] Tooltip detected! width={t_box['width']}, height={t_box['height']}")
            text = await tooltip.inner_text()
            print(f"[OK] Tooltip text:\n{text}")
            
            # 严格断言：Tooltip 必须是标准横向矩形，宽度应远大于高度 (width > 150 且 height < 100)
            assert t_box['width'] > 160, f"Tooltip width {t_box['width']} is too narrow!"
            assert t_box['height'] < 90, f"Tooltip height {t_box['height']} is too tall (deformed)!"
            print("[PASS] Tooltip retains its perfect horizontal shape!")
        else:
            print("Hovering on map paths directly...")
            # 遍历 hover 几个 path
            paths = page.locator("path.city-path")
            count = await paths.count()
            for i in range(100, 105):
                p_item = paths.nth(i)
                p_box = await p_item.bounding_box()
                if p_box and p_box["width"] > 10:
                    await page.mouse.move(p_box["x"] + p_box["width"]/2, p_box["y"] + p_box["height"]/2)
                    await page.wait_for_timeout(200)
                    if await tooltip.is_visible():
                        t_box = await tooltip.bounding_box()
                        print(f"[OK] Path {i} Tooltip width={t_box['width']}, height={t_box['height']}")
                        assert t_box['width'] > 160
                        assert t_box['height'] < 90
                        break

        screenshot_path = os.path.join(ARTIFACT_DIR, "tooltip_fixed_ankang.png")
        await page.screenshot(path=screenshot_path)
        print(f"[OK] Saved screenshot: {screenshot_path}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
