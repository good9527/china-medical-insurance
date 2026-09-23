import time
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # 1. Desktop overview
        context = browser.new_context(viewport={"width": 1440, "height": 920})
        page = context.new_page()
        page.goto("http://localhost:5174/#/pages/home/index")
        page.wait_for_timeout(3000)
        page.screenshot(path="C:/Users/19901/.gemini/antigravity/brain/ab264cee-a783-46c6-9006-711cd2f6a1e3/home_map_desktop_overview.png")
        print("Desktop overview captured.")

        # 2. Search and select Chengdu
        search_input = page.locator(".map-search-input input")
        if search_input.is_visible():
            search_input.fill("成都")
            page.wait_for_timeout(800)
            suggest_item = page.locator(".suggest-item").first
            if suggest_item.is_visible():
                suggest_item.click()
                page.wait_for_timeout(1000)
                # Scroll slightly to show full bento card
                page.evaluate("window.scrollBy(0, 160)")
                page.wait_for_timeout(500)
                page.screenshot(path="C:/Users/19901/.gemini/antigravity/brain/ab264cee-a783-46c6-9006-711cd2f6a1e3/home_map_city_selected.png")
                print("City selected card captured.")

        # 3. Test clicking '查看本市政策详情 ↗'
        page.goto("http://localhost:5174/#/pages/home/index")
        page.wait_for_timeout(1000)
        search_input = page.locator(".map-search-input input")
        search_input.fill("成都")
        page.wait_for_timeout(800)
        page.locator(".suggest-item").first.click()
        page.wait_for_timeout(800)
        page.locator(".btn-policy").first.click()
        page.wait_for_timeout(1500)
        page.screenshot(path="C:/Users/19901/.gemini/antigravity/brain/ab264cee-a783-46c6-9006-711cd2f6a1e3/home_map_jumped_to_policy.png")
        print("Jump to policy captured.")

        # 4. Test clicking '进行该市报销估算 ↗'
        page.goto("http://localhost:5174/#/pages/home/index")
        page.wait_for_timeout(1000)
        search_input = page.locator(".map-search-input input")
        search_input.fill("成都")
        page.wait_for_timeout(800)
        page.locator(".suggest-item").first.click()
        page.wait_for_timeout(800)
        page.locator(".btn-calc").first.click()
        page.wait_for_timeout(1500)
        page.screenshot(path="C:/Users/19901/.gemini/antigravity/brain/ab264cee-a783-46c6-9006-711cd2f6a1e3/home_map_jumped_to_calc.png")
        print("Jump to calc captured.")

        # 4. Mobile view
        mobile_ctx = browser.new_context(viewport={"width": 375, "height": 812}, is_mobile=True)
        m_page = mobile_ctx.new_page()
        m_page.goto("http://localhost:5174/#/pages/home/index")
        m_page.wait_for_timeout(3000)
        m_page.screenshot(path="C:/Users/19901/.gemini/antigravity/brain/ab264cee-a783-46c6-9006-711cd2f6a1e3/home_map_mobile_view.png")
        print("Mobile view captured.")

        browser.close()

if __name__ == "__main__":
    run()
