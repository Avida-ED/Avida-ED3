const { test, expect } = require('@playwright/test');

const instsetCfg = [
  'INSTSET heads_default:hw_type=0',
  'INST nop-A',
  'INST nop-B',
  'INST nop-C',
  'INST if-n-equ',
  'INST if-less',
  'INST if-label',
  'INST mov-head',
  'INST jmp-head',
  'INST get-head',
  'INST set-flow',
  'INST shift-r',
  'INST shift-l',
  'INST inc',
  'INST dec',
  'INST push',
  'INST pop',
  'INST swap-stk',
  'INST swap',
  'INST add',
  'INST sub',
  'INST nand',
  'INST h-copy',
  'INST h-alloc',
  'INST h-divide',
  'INST IO',
  'INST h-search'
].join('\n');

const baseConfig = [
  'WORLD_X 30',
  'WORLD_Y 30',
  'WORLD_GEOMETRY 1',
  'COPY_MUT_PROB 0.02',
  'DIVIDE_INS_PROB 0.0',
  'DIVIDE_DEL_PROB 0.0',
  'OFFSPRING_SIZE_RANGE 1.0',
  'BIRTH_METHOD 0',
  'RANDOM_SEED -1',
  '#include instset.cfg'
].join('\n');

const environmentCfg = [
  'REACTION  NOT  not   process:value=1.0:type=pow  requisite:max_count=1',
  'REACTION  NAND nand  process:value=1.0:type=pow  requisite:max_count=1',
  'REACTION  AND  and   process:value=2.0:type=pow  requisite:max_count=1',
  'REACTION  ORN  orn   process:value=2.0:type=pow  requisite:max_count=1',
  'REACTION  OR   or    process:value=3.0:type=pow  requisite:max_count=1',
  'REACTION  ANDN andn  process:value=3.0:type=pow  requisite:max_count=1',
  'REACTION  NOR  nor   process:value=4.0:type=pow  requisite:max_count=1',
  'REACTION  XOR  xor   process:value=4.0:type=pow  requisite:max_count=1',
  'REACTION  EQU  equ   process:value=5.0:type=pow  requisite:max_count=1'
].join('\n');

test('worker imports an ED3 config and returns grid and population data', async ({ page }) => {
  await page.goto('/AvidaED.html?avidaTest=1');
  await page.evaluate(() => window.avidaTest.waitForReady());

  await page.evaluate(({ avidaCfg, environment, instset }) => {
    window.avidaTest.clearMessages();
    window.avidaTest.importExpression([
      { name: 'avida.cfg', data: avidaCfg },
      { name: 'environment.cfg', data: environment },
      { name: 'instset.cfg', data: instset }
    ]);
  }, { avidaCfg: baseConfig, environment: environmentCfg, instset: instsetCfg });

  const importResponse = await page.evaluate(() => {
    return window.avidaTest.waitForMessage((message) =>
      message && message.type === 'response' && message.request && message.request.name === 'importExpr'
    );
  });
  expect(importResponse.success).toBe(true);

  await page.evaluate(() => {
    window.avidaTest.clearMessages();
    window.avidaTest.send({ type: 'addEvent', name: 'webGridData', start: 'begin', interval: 1 });
    window.avidaTest.send({ type: 'addEvent', name: 'webPopulationStats', start: 'now', interval: 1 });
    window.avidaTest.sendData();
    window.avidaTest.send({ type: 'stepUpdate' });
  });

  const grid = await page.evaluate(() => {
    return window.avidaTest.waitForMessage((message) =>
      message && message.type === 'data' && message.name === 'webGridData'
    );
  });
  expect(typeof grid.update).toBe('number');

  const stats = await page.evaluate(() => {
    return window.avidaTest.waitForMessage((message) =>
      message && message.type === 'data' && message.name === 'webPopulationStats'
    );
  });
  expect(typeof stats.update).toBe('number');

  const errors = await page.evaluate(() => window.avidaTest.state.errors);
  expect(errors).toEqual([]);
});
