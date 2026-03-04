const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
(async () => {
    console.log('Reading procedures...');
    const dataPath = path.join(__dirname, 'public', 'data', 'procedimientos.json');
    const procs = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const outDir = path.join(__dirname, 'public', 'tupa-capturas');
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }
    console.log('Launching headless browser...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--allow-file-access-from-files', '--disable-web-security']
    });
    const page = await browser.newPage();
    console.log('Navigating to local PDF renderer...');
    const rendererPath = 'file:///' + path.join(__dirname, 'public', 'render_pdf.html').replace(/\\/g, '/');
    await page.goto(rendererPath, { waitUntil: 'networkidle0' });
    const pdfUrl = 'file:///' + path.join(__dirname, 'public', 'TUPA-2025-MDNCH.pdf').replace(/\\/g, '/');
    const pageToProcs = {};
    let totalAssigned = 0;
    for (const p of procs) {
        if (!p.pdf_pagina) continue;
        const pNum = Number(p.pdf_pagina);
        if (!pageToProcs[pNum]) pageToProcs[pNum] = [];
        pageToProcs[pNum].push(p.codigo);
        totalAssigned++;
    }
    const pagesToRender = Object.keys(pageToProcs).map(Number).sort((a, b) => a - b);
    let count = 0;
    console.log(`Found ${pagesToRender.length} unique pages covering ${totalAssigned} procedures.`);
    console.log('Starting screenshot generation...');
    for (const pageNum of pagesToRender) {
        try {
            const dimensions = await page.evaluate(async (url, num) => {
                return await window.renderPage(url, num);
            }, pdfUrl, pageNum);
            await page.setViewport({ width: Math.floor(dimensions.width), height: Math.floor(dimensions.height) });
            await new Promise(r => setTimeout(r, 100));
            const element = await page.$('#pdf-canvas');
            const buffer = await element.screenshot({ type: 'png' });
            for (const codigo of pageToProcs[pageNum]) {
                const imgPath = path.join(outDir, `${codigo}.png`);
                fs.writeFileSync(imgPath, buffer);
            }
            count++;
            if (count % 20 === 0 || count === pagesToRender.length) {
                console.log(`✅ Processed ${count} / ${pagesToRender.length} pages...`);
            }
        } catch (e) {
            console.error(`❌ Failed on page ${pageNum}:`, e);
        }
    }
    await browser.close();
    console.log('🎉 Done! Generated screenshots for all procedures.');
})();
