const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('https://leetcode.com/accounts/login/');
  await page.waitForLoadState('networkidle');
  
  // New selectors
  await page.fill('input[name="login"]', process.env.LEETCODE_EMAIL);
  await page.fill('input[name="password"]', process.env.LEETCODE_PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(5000);
  
  const cookies = await context.cookies();
  const session = cookies.find(c => c.name === 'LEETCODE_SESSION');
  const csrf = cookies.find(c => c.name === 'csrftoken');
  
  console.log('Session found:', !!session);
  console.log('CSRF found:', !!csrf);
  
  const https = require('https');
  const data = JSON.stringify({ 
    LEETCODE_SESSION: session?.value, 
    csrftoken: csrf?.value 
  });
  
  const url = new URL(process.env.N8N_WEBHOOK_URL);
  const options = { 
    hostname: url.hostname, 
    path: url.pathname, 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  };
  
  const req = https.request(options, res => console.log('Webhook Status:', res.statusCode));
  req.write(data);
  req.end();
  
  await browser.close();
  console.log('Done!');
})();
