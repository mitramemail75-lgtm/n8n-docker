const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  await page.goto('https://leetcode.com/accounts/login/');
  await page.waitForTimeout(2000);
  
  await page.fill('#id_login', process.env.LEETCODE_EMAIL);
  await page.fill('#id_password', process.env.LEETCODE_PASSWORD);
  await page.click('#btnSignin');
  await page.waitForTimeout(3000);
  
  const cookies = await page.context().cookies();
  const session = cookies.find(c => c.name === 'LEETCODE_SESSION');
  const csrf = cookies.find(c => c.name === 'csrftoken');
  
  const https = require('https');
  const data = JSON.stringify({ 
    LEETCODE_SESSION: session.value, 
    csrftoken: csrf.value 
  });
  
  const url = new URL(process.env.N8N_WEBHOOK_URL);
  const options = { 
    hostname: url.hostname, 
    path: url.pathname, 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
  };
  
  const req = https.request(options, res => console.log('Status:', res.statusCode));
  req.write(data);
  req.end();
  
  await browser.close();
  console.log('Done!');
})();
