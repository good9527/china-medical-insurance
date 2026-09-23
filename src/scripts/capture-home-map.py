import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 1. Desktop overview
        context = browser.new_context(viewport={"width": 1440, "height": 920})
        page = context.new_page()
        page.goto("http://localhost:5175/#/pages/home/index")
        page.wait_for_timeout(2500)
        page.screenshot(path="C:/Users/19901/.gemini/antigravity/brain/ab264cee-a783-46c6-9006-711cd2f6a1e3/home_map_unified_overview.png")
        print("Unified overview captured.")

        # 2. Select Tianshui (reproducing user's test case)
        search_input = page.locator(".map-search-input input")
        if search_input.is_visible():
            search_input.fill("天水")
            page.wait_for_timeout(800)
            suggest_item = page.locator(".suggest-item").first
            if suggest_item.is_visible():
                suggest_item.click()
                page.wait_for_timeout(1000)
                page.screenshot(path="C:/Users/19901/.gemini/antigravity/brain/ab264cee-a783-46c6-9006-711cd2f6a1e3/home_map_tianshui_clean.png")
                print("Tianshui clean view captured.")

        # 3. Test Mouse Wheel Zoom
        viewport_el = page.locator(".svg-viewport")
        if viewport_el.is_visible():
            box = viewport_el.bounding_box()
            # Scroll wheel at center
            page.mouse.move(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
            page.mouse.wheel(0, -300) # zoom in
            page.wait_for_timeout(600)
            page.screenshot(path="C:/Users/19901/.gemini/antigravity/brain/ab264cee-a783-46c6-9006-711cd2f6a1e3/home_map_wheel_zoomed.png")
            print("Mouse wheel zoom captured.")

        # 4. Mobile view
        mobile_ctx = browser.new_context(viewport={"width": 375, "height": 812}, is_mobile=True)
        m_page = mobile_ctx.new_page()
        m_page.goto("http://localhost:5175/#/pages/home/index")
        m_page.wait_for_timeout(2500)
        m_page.screenshot(path="C:/Users/19901/.gemini/antigravity/brain/ab264cee-a783-46c6-9006-711cd2f6a1e3/home_map_mobile_clean.png")
        print("Mobile clean view captured.")

        browser.close()

if __name__ == "__main__":
    run()
