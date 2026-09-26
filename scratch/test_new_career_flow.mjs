// Test script for 5-Slot Multi-Save System and 3-Step Character Creation Flow
const storage = {};
global.localStorage = {
  getItem: (k) => storage[k] || null,
  setItem: (k, v) => { storage[k] = String(v); },
  removeItem: (k) => { delete storage[k]; },
  clear: () => { Object.keys(storage).forEach(k => delete storage[k]); }
};

const makeElement = (id = '') => ({
  id,
  value: 'Hoàng Sơn',
  textContent: '',
  innerText: '',
  innerHTML: '',
  dataset: {},
  title: '',
  style: {},
  classList: { add: () => {}, remove: () => {}, contains: () => false, toggle: () => {} },
  setAttribute: () => {},
  removeAttribute: () => {},
  appendChild: () => {},
  insertBefore: () => {},
  querySelector: () => null,
  querySelectorAll: () => [],
  firstChild: null,
  parentNode: null,
  addEventListener: () => {}
});

const elementsCache = {
  screenSetup: makeElement('screenSetup'),
  screenDashboard: makeElement('screenDashboard'),
  btnConfirmCreatePlayer: makeElement('btnConfirmCreatePlayer'),
  btnStartCareer: makeElement('btnStartCareer'),
  btnLoadCareer: makeElement('btnLoadCareer'),
  btnShowSlotsList: makeElement('btnShowSlotsList'),
  saveSlotsPillsBar: makeElement('saveSlotsPillsBar'),
  slotActiveStatusNote: makeElement('slotActiveStatusNote'),
  saveSlotsModalList: makeElement('saveSlotsModalList'),
  modalSaveSlots: makeElement('modalSaveSlots'),
  inputPlayerName: makeElement('inputPlayerName'),
  careerLog: makeElement('careerLog')
};

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
    return [];
  },
  querySelector: (selector) => {
    if (selector === '.nationality-option.selected') return { dataset: { nat: 'VN' } };
    if (selector === '.position-option.selected') return { dataset: { pos: 'FW' } };
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

async function runTest() {
  console.log('=== TEST 1: Check 5 Slots Info in Initial State ===');
  const main = await import('../js/main.js');
  const storageMod = await import('../js/storage.js');

  const initialSlots = storageMod.getSaveSlotsInfo();
  console.log('Total slots returned:', initialSlots.length);
  if (initialSlots.length !== 5) {
    throw new Error(`Expected 5 slots, got ${initialSlots.length}`);
  }

  initialSlots.forEach(s => {
    console.log(`Slot ${s.slotId}: ${s.name} | isEmpty: ${s.isEmpty}`);
    if (!s.isEmpty || s.name !== 'Trống (Empty Slot)') {
      throw new Error(`Slot ${s.slotId} should be empty initially`);
    }
  });

  console.log('\n=== TEST 2: Button states when all slots are empty ===');
  main.updateStartScreenButtons();
  console.log('btnLoadCareer display (expect none):', elements.btnLoadCareer.style.display);
  if (elements.btnLoadCareer.style.display !== 'none') {
    throw new Error('btnLoadCareer should be hidden when all slots are empty');
  }

  console.log('\n=== TEST 3: BƯỚC 1: Prepare New Career in Slot 2 ===');
  elements.inputPlayerName.value = 'Different Name Before Reset';
  const prepared = main.prepareNewCareer(2);
  console.log('prepareNewCareer returned:', prepared);
  console.log('Current active slot (expect 2):', storageMod.getCurrentSaveSlot());
  console.log('inputPlayerName reset value (expect Hoàng Sơn):', elements.inputPlayerName.value);
  console.log('ScreenSetup display (expect flex - STAY on setup):', elements.screenSetup.style.display);
  console.log('ScreenDashboard display (expect none - NOT jumped into game):', elements.screenDashboard.style.display);

  if (storageMod.getCurrentSaveSlot() !== 2) {
    throw new Error('Active slot should be 2');
  }
  if (elements.screenDashboard.style.display === 'flex') {
    throw new Error('Game should NOT jump to dashboard in Step 1!');
  }

  console.log('\n=== TEST 4: BƯỚC 2 & 3: Confirm and Start Career for Slot 2 ===');
  elements.inputPlayerName.value = 'Nguyễn Quang Hải';
  main.confirmAndStartCareer();

  console.log('ScreenDashboard display (expect flex - now in game):', elements.screenDashboard.style.display);
  console.log('Player name:', main.getPlayer().name);

  // Check storage for Slot 2
  const slot2Key = 'football_career_save_slot_2';
  const slot2Raw = localStorage.getItem(slot2Key);
  console.log('Data in football_career_save_slot_2 exists:', Boolean(slot2Raw));
  if (!slot2Raw) {
    throw new Error('Slot 2 was not saved');
  }

  const slot2Parsed = JSON.parse(slot2Raw);
  if (slot2Parsed.player.name !== 'Nguyễn Quang Hải') {
    throw new Error('Player name in Slot 2 mismatch');
  }

  console.log('\n=== TEST 5: Create player in Slot 4 ===');
  main.prepareNewCareer(4);
  elements.inputPlayerName.value = 'Đoàn Văn Hậu';
  main.confirmAndStartCareer();

  const slot4Raw = localStorage.getItem('football_career_save_slot_4');
  console.log('Data in football_career_save_slot_4 exists:', Boolean(slot4Raw));
  if (!slot4Raw) {
    throw new Error('Slot 4 was not saved');
  }

  const updatedSlots = storageMod.getSaveSlotsInfo();
  console.log('Slot 2 name:', updatedSlots[1].name);
  console.log('Slot 4 name:', updatedSlots[3].name);
  if (updatedSlots[1].name !== 'Nguyễn Quang Hải' || updatedSlots[3].name !== 'Đoàn Văn Hậu') {
    throw new Error('Slots data mismatch');
  }

  console.log('\n=== TEST 6: Overwrite Slot 2 with confirmation cancel ===');
  global.window.confirm = () => false; // User cancels overwrite
  const prepareResult = main.prepareNewCareer(2);
  console.log('prepareNewCareer with cancel confirm returned (expect false):', prepareResult);
  if (prepareResult !== false) {
    throw new Error('prepareNewCareer should return false when overwrite is cancelled');
  }

  console.log('\n=== TEST 7: Overwrite Slot 2 with confirmation OK ===');
  global.window.confirm = () => true; // User confirms overwrite
  main.prepareNewCareer(2);
  elements.inputPlayerName.value = 'Lương Xuân Trường';
  main.confirmAndStartCareer();
  if (typeof elements.btnConfirmOverwrite?.onclick === 'function') {
    elements.btnConfirmOverwrite.onclick({ preventDefault: () => {} });
  }

  const slot2New = storageMod.getSaveSlotsInfo().find(s => s.slotId === 2);
  console.log('Slot 2 new player name (expect Lương Xuân Trường):', slot2New.name);
  if (slot2New.name !== 'Lương Xuân Trường') {
    throw new Error('Slot 2 was not overwritten properly');
  }

  console.log('\n=== TEST 8: Load Game from Slot 4 ===');
  main.loadCareer(4);
  console.log('Loaded player from slot 4 (expect Đoàn Văn Hậu):', main.getPlayer().name);
  if (main.getPlayer().name !== 'Đoàn Văn Hậu') {
    throw new Error('Loaded player from slot 4 mismatch');
  }

  console.log('\n=== TEST 9: Delete Slot 4 ===');
  storageMod.deleteSaveSlot(4);
  const slotsAfterDelete = storageMod.getSaveSlotsInfo();
  console.log('Slot 4 after delete isEmpty (expect true):', slotsAfterDelete[3].isEmpty);
  if (!slotsAfterDelete[3].isEmpty) {
    throw new Error('Slot 4 should be empty after deletion');
  }

  console.log('\n✅ ALL 9 MULTI-SLOT & CREATION FLOW TESTS PASSED 100%!');
}

runTest().catch(e => {
  console.error('❌ TEST FAILED:', e);
  process.exit(1);
});
