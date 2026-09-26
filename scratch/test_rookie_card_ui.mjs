// Test script for Split-Screen Character Creation, 10-Academy Selection & Real-Time Fut Rookie Card
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

const makeElement = (id = '') => {
  const el = {
    id,
    value: 'Hoàng Sơn',
    textContent: '',
    innerText: '',
    _innerHTML: '',
    get innerHTML() { return this._innerHTML; },
    set innerHTML(val) {
      this._innerHTML = val;
      if (val === '') this.children = [];
    },
    dataset: {},
    title: '',
    style: {},
    children: [],
  classList: {
    classes: new Set(),
    add(c) { this.classes.add(c); },
    remove(c) { this.classes.delete(c); },
    contains(c) { return this.classes.has(c); },
    toggle(c) { this.classes.has(c) ? this.classes.delete(c) : this.classes.add(c); }
  },
  setAttribute(k, v) { this.dataset[k.replace('data-', '')] = v; },
  removeAttribute() {},
  appendChild(child) { this.children.push(child); child.parentNode = this; },
  insertBefore() {},
  querySelector(sel) { return null; },
  querySelectorAll(sel) { return []; },
  firstChild: null,
  addEventListener() {}
  };
  return el;
};

const elementsCache = {};
const elements = new Proxy(elementsCache, {
  get: (target, prop) => {
    if (!target[prop]) {
      target[prop] = makeElement(prop);
    }
    return target[prop];
  }
});

global.document = {
  readyState: 'complete',
  body: makeElement('body'),
  addEventListener: () => {},
  getElementById: (id) => elements[id],
  createElement: (tag) => makeElement(tag),
  querySelectorAll: (selector) => {
    if (selector === '.view-screen') return [elements.screenSetup, elements.screenDashboard];
    if (selector === '.nationality-option') return elements.nationalityGrid.children || [];
    if (selector === '.academy-option') return elements.academyGrid.children || [];
    if (selector === '.position-option') return elements.positionGrid.children || [];
    return [];
  },
  querySelector: (selector) => {
    if (selector === '.nationality-option.selected') {
      return elements.nationalityGrid.children.find(c => c.classList.contains('selected')) || null;
    }
    if (selector === '.academy-option.selected') {
      return elements.academyGrid.children.find(c => c.classList.contains('selected')) || null;
    }
    if (selector === '.position-option.selected') {
      return elements.positionGrid.children.find(c => c.classList.contains('selected')) || null;
    }
    return null;
  }
};

global.window = {
  localStorage: global.localStorage,
  document: global.document,
  confirm: () => true,
  scrollTo: () => {},
  addEventListener: () => {}
};

async function testRookieCard() {
  console.log('=== TEST 1: Render 10 Youth Academies ===');
  const { YOUTH_ACADEMIES } = await import('../js/data.js');
  const ui = await import('../js/ui.js');
  const main = await import('../js/main.js');
  const state = await import('../js/state.js');

  console.log('Total academies in data:', YOUTH_ACADEMIES.length);
  if (YOUTH_ACADEMIES.length !== 10) {
    throw new Error(`Expected 10 academies, got ${YOUTH_ACADEMIES.length}`);
  }

  ui.renderAcademyOptions(YOUTH_ACADEMIES, 'pvf_academy', (id) => main.selectAcademy(id));
  console.log('Academies rendered into #academyGrid:', elements.academyGrid.children.length);
  if (elements.academyGrid.children.length !== 10) {
    throw new Error(`Expected 10 academy elements rendered, got ${elements.academyGrid.children.length}`);
  }

  console.log('\n=== TEST 2: Real-Time Preview for Default FW ===');
  elements.inputPlayerName.value = 'Nguyễn Hoàng Sơn';
  ui.updateRookieCardPreview({ name: 'Nguyễn Hoàng Sơn', pos: 'FW', natId: 'VN', academyId: 'pvf_academy' });

  console.log('Rookie OVR (expect 55):', elements.rookieCardOvr.textContent);
  console.log('Rookie POS (expect ST):', elements.rookieCardPos.textContent);
  console.log('Rookie Name (expect NGUYỄN HOÀNG SƠN):', elements.rookieCardName.textContent);
  console.log('Rookie Flag (expect 🇻🇳):', elements.rookieCardNationFlag.textContent);
  console.log('Rookie Club (expect Học Viện Trẻ PVF Football Academy):', elements.rookieCardClubName.textContent);

  if (Number(elements.rookieCardOvr.textContent) !== 55) throw new Error('FW OVR should be 55');
  if (elements.rookieCardPos.textContent !== 'ST') throw new Error('FW position tag should be ST');
  if (elements.rookieCardName.textContent !== 'NGUYỄN HOÀNG SƠN') throw new Error('Name did not update properly');

  console.log('\n=== TEST 3: Real-Time Preview Switch to GK at Bayern Campus ===');
  main.selectPosition('GK');
  main.selectAcademy('bayern_junior');
  main.selectNationality('GER');

  console.log('Rookie OVR (expect 55):', elements.rookieCardOvr.textContent);
  console.log('Rookie POS (expect GK):', elements.rookieCardPos.textContent);
  console.log('Rookie Flag (expect 🇩🇪):', elements.rookieCardNationFlag.textContent);
  console.log('Rookie Club (expect FC Bayern Campus):', elements.rookieCardClubName.textContent);
  console.log('Rookie Stats rendered:', elements.rookieCardStats.innerHTML.includes('DIV') && elements.rookieCardStats.innerHTML.includes('REF'));

  if (Number(elements.rookieCardOvr.textContent) !== 55) throw new Error('GK OVR should be 55');
  if (elements.rookieCardPos.textContent !== 'GK') throw new Error('GK position tag should be GK');
  if (!elements.rookieCardStats.innerHTML.includes('DIV')) throw new Error('GK stats should include DIV');

  console.log('\n=== TEST 4: Real-Time Preview Switch to MF at La Masia ===');
  main.selectPosition('MF');
  main.selectAcademy('la_masia');
  main.selectNationality('ESP');

  console.log('Rookie OVR (expect 55):', elements.rookieCardOvr.textContent);
  console.log('Rookie POS (expect CAM):', elements.rookieCardPos.textContent);
  console.log('Rookie Flag (expect 🇪🇸):', elements.rookieCardNationFlag.textContent);
  console.log('Rookie Club (expect La Masia):', elements.rookieCardClubName.textContent);
  console.log('Rookie Stats has PAS & DRI:', elements.rookieCardStats.innerHTML.includes('PAS') && elements.rookieCardStats.innerHTML.includes('DRI'));

  if (Number(elements.rookieCardOvr.textContent) !== 55) throw new Error('MF OVR should be 55');
  if (elements.rookieCardPos.textContent !== 'CAM') throw new Error('MF position tag should be CAM');

  console.log('\n=== TEST 5: Create Player with Chosen Academy (La Masia) ===');
  elements.inputPlayerName.value = 'Lamine Wonderkid';
  // Mark selected academy in mock DOM
  elements.academyGrid.children.forEach(c => {
    if (c.dataset.academy === 'la_masia') {
      c.classList.add('selected');
    } else {
      c.classList.remove('selected');
    }
  });

  main.confirmAndStartCareer();
  const player = state.getPlayer();
  console.log('Created Player Name:', player.name);
  console.log('Created Player Academy:', player.academy.name);
  console.log('Created Player Position:', player.position);
  console.log('Created Player Card Theme:', player.cardTheme);
  console.log('Created Player OVR / Base Rating:', player.ovr, player.baseRating);

  if (player.name !== 'Lamine Wonderkid') throw new Error('Player name mismatch');
  if (player.academy.id !== 'la_masia') throw new Error('Player academy should be la_masia');
  if (player.cardTheme !== 'future') throw new Error(`Player cardTheme should be future, got ${player.cardTheme}`);
  if (player.ovr !== 55 || player.baseRating !== 55) throw new Error(`Player OVR / BaseRating should be 55, got ${player.ovr} / ${player.baseRating}`);

  console.log('\n=== TEST 6: Compact Save Slots Selector Bar Rendering ===');
  main.renderSaveSlotsSelectorBar();
  console.log('Pills bar innerHTML has Slot 1:', elements.saveSlotsPillsBar.innerHTML.includes('Slot 1'));
  console.log('CTA button text:', elements.btnConfirmCreatePlayer.textContent);

  if (!elements.saveSlotsPillsBar.innerHTML.includes('Slot 1')) throw new Error('Slot 1 missing from pills');
  if (!elements.btnConfirmCreatePlayer.textContent.includes('KÝ HỢP ĐỒNG')) throw new Error('CTA text missing expected label');

  console.log('\n🎉 ALL ROOKIE CARD & SPLIT-SCREEN TESTS PASSED 100%!');
}

testRookieCard().catch(err => {
  console.error('❌ TEST FAILED:', err);
  process.exit(1);
});
