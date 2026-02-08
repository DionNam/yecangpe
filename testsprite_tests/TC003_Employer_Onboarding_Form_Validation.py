import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:3000/", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Enter a valid company name in the company name field and submit the form.
        frame = context.pages[-1]
        # Enter a valid company name '테스트회사' in the name input field
        elem = frame.locator('xpath=html/body/main/div/div[2]/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('테스트회사')
        

        frame = context.pages[-1]
        # Click the '다음' (Next) button to submit the form
        elem = frame.locator('xpath=html/body/main/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Test leaving the company name empty and submit the form to verify validation error for missing company name.
        frame = context.pages[-1]
        # Clear the company name input field to test validation for empty company name
        elem = frame.locator('xpath=html/body/main/div/div[2]/form/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('')
        

        frame = context.pages[-1]
        # Enter a valid email to isolate company name validation
        elem = frame.locator('xpath=html/body/main/div/div[2]/form/div[2]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('test@example.com')
        

        frame = context.pages[-1]
        # Enter a valid phone number to isolate company name validation
        elem = frame.locator('xpath=html/body/main/div/div[2]/form/div[3]/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('010-1234-5678')
        

        frame = context.pages[-1]
        # Click the '다음' (Next) button to submit the form with empty company name
        elem = frame.locator('xpath=html/body/main/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=PRD 생성 시작하기').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=정보를 입력하고 PRD 생성을 시작하세요').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=이름').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=이름을 입력해주세요').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=이메일전화번호').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=입력 정보를 확인해주세요').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=다음').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    