const puppeteer = require('puppeteer');

(async () => {
    // Start browser
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set mobile viewport (iPhone 12/13 Pro size)
    await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2 });

    // Test Home
    console.log('Testing Home on Mobile...');
    await page.goto('http://localhost:5182/', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'public/mobile_home.png', fullPage: true });

    // Test Search
    console.log('Testing Search on Mobile...');
    await page.goto('http://localhost:5182/buscar', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'public/mobile_buscar.png', fullPage: true });

    // Test Detail
    console.log('Testing Detail on Mobile...');
    await page.goto('http://localhost:5182/tramite/defensa-civil-evaluacion-de-condiciones-de-seguridad-en-espectaculos-publicos-deportivos-y-no-deportivos-con-aforo-hasta-tres-mil-3000-personas', { waitUntil: 'networkidle0' });
    await page.screenshot({ path: 'public/mobile_detalle.png', fullPage: true });

    console.log('Screenshots saved to public/ folder.');
    await browser.close();
})();
