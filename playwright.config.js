// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    baseURL: process.env.AVIDA_ED_BASE_URL || 'http://127.0.0.1:8123',
    trace: 'retain-on-failure'
  },
  webServer: process.env.AVIDA_ED_BASE_URL ? undefined : {
    command: 'python3 -m http.server 8123',
    url: 'http://127.0.0.1:8123',
    reuseExistingServer: true,
    timeout: 10000
  }
});
