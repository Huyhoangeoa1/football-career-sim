import { readFileSync } from 'fs';
import { NATIONALITIES_DATA, POSITION_CONFIG, YOUTH_ACADEMIES } from '../js/data.js';

// Mock browser global objects for Node test environment
global.window = global;
global.document = {
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  addEventListener: () => {}
};
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};

const files = [
  './js/data.js',
  './js/state.js',
  './js/engine.js',
  './js/ui.js',
  './js/main.js'
];

for (const f of files) {
  try {
    await import(`.${f}`);
    console.log(`✅ Loaded ${f} successfully!`);
  } catch (err) {
    console.error(`❌ Failed to import ${f}:`, err);
    process.exit(1);
  }
}

// Check index.html elements
const html = readFileSync('./index.html', 'utf-8');

// 1. Check inputPlayerName
if (html.includes('value="Hoàng Sơn"')) {
  throw new Error('index.html still has value="Hoàng Sơn" in input!');
}
if (!html.includes('placeholder="Nhập họ và tên cầu thủ..."')) {
  throw new Error('index.html missing placeholder="Nhập họ và tên cầu thủ..."');
}
console.log('✅ inputPlayerName verified in index.html (no default name value, correct placeholder)');

// 2. Check region filter tabs in index.html
if (!html.includes('id="natRegionTabs"') || !html.includes('data-region="ASIA"')) {
  throw new Error('index.html missing #natRegionTabs or regional pills');
}
console.log('✅ natRegionTabs verified in index.html');

// 3. Check 4-line position tabs in index.html
if (!html.includes('id="posLineTabs"') || !html.includes('data-line="GK"') || !html.includes('data-line="DF"')) {
  throw new Error('index.html missing #posLineTabs or line pills');
}
console.log('✅ posLineTabs verified in index.html');

// 4. Check rookieCardName default
if (html.includes('<div class="rookie-name-ribbon" id="rookieCardName">HOÀNG SƠN</div>')) {
  throw new Error('Rookie card still displays hardcoded HOÀNG SƠN!');
}
if (!html.includes('<div class="rookie-name-ribbon" id="rookieCardName">TÂN BINH VÔ DANH</div>')) {
  throw new Error('Rookie card should have TÂN BINH VÔ DANH placeholder!');
}
console.log('✅ rookieCardName ribbon verified in index.html');

console.log('\n🎉 ALL DOM & INTEGRATION CHECKS PASSED!');
