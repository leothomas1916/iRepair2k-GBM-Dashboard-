import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push('CONSOLE ERROR: ' + msg.text());
  });
  page.on('pageerror', error => errors.push('PAGE ERROR: ' + error.message));
  
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await new Promise(r => setTimeout(r, 1000));
  
  // Select the first service
  await page.click('button[id^="service-"]');
  
  // click generate button
  await page.click('button[type="submit"]');
  await new Promise(r => setTimeout(r, 6000));
  
  console.log('--- ERRORS START ---');
  errors.forEach(e => console.log(e));
  console.log('--- ERRORS END ---');
  
  const hasErrorToast = await page.evaluate(() => {
    return document.body.innerHTML.includes('Failed to fetch');
  });
  console.log('Has Error Toast:', hasErrorToast);
  
  await browser.close();
})();
