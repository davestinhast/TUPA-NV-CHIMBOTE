const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Desktop View for Dashboard
    await page.setViewport({ width: 1280, height: 1200 });

    console.log('Testing Dashboard...');
    await page.goto('http://localhost:5182/dashboard', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'public/dashboard_view.png' });

    // Home View to see A11y Widget
    console.log('Testing A11y Widget on Home...');
    await page.goto('http://localhost:5182/', { waitUntil: 'networkidle0' });
    await page.waitForSelector('.a11y-toggle', { timeout: 10000 });
    // Scroll down a bit to see it floating
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.screenshot({ path: 'public/a11y_widget_view.png' });

    // Click A11y widget to see it open
    console.log('Opening A11y Panel...');
    await page.click('.a11y-toggle');
    await page.waitForSelector('.a11y-panel', { visible: true, timeout: 5000 });
    await page.screenshot({ path: 'public/a11y_panel_open.png' });

    console.log('Fase 9 screenshots saved to public/');
    await browser.close();
})();
