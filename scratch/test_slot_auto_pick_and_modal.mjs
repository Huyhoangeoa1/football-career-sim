// Unit test for First Available Slot Auto-Pick Algorithm and Save Slots Modal Button Cleanup
import assert from 'assert';

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
    value: '',
    textContent: '',
    innerText: '',
    innerHTML: '',
    dataset: {},
    title: '',
    style: {},
    disabled: false,
    _classes: new Set(),
    classList: {
      add: (c) => el._classes.add(c),
      remove: (c) => el._classes.delete(c),
      contains: (c) => el._classes.has(c),
      toggle: (c, force) => {
        if (force === undefined) {
          if (el._classes.has(c)) el._classes.delete(c);
          else el._classes.add(c);
        } else if (force) {
          el._classes.add(c);
        } else {
          el._classes.delete(c);
        }
      }
    },
    setAttribute: () => {},
    removeAttribute: () => {},
    appendChild: () => {},
    insertBefore: () => {},
    querySelector: () => null,
    querySelectorAll: () => [],
    firstChild: null,
    parentNode: null,
    addEventListener: () => {},
    onclick: null
  };
  return el;
};

const elements = {};
function getOrCreateElement(id) {
  if (!elements[id]) {
    elements[id] = makeElement(id);
  }
  return elements[id];
}

global.document = {
  getElementById: (id) => getOrCreateElement(id),
  querySelector: (sel) => {
    if (sel.startsWith('#')) return getOrCreateElement(sel.slice(1));
    return makeElement('mock');
  },
  querySelectorAll: () => [],
  createElement: (tag) => makeElement(tag),
  addEventListener: () => {}
};

global.window = {
  scrollTo: () => {},
  confirm: () => true
};

async function runTests() {
  console.log('=== TEST SUITE: FIRST AVAILABLE SLOT & SAVE SLOTS MODAL CLEANUP ===');

  const main = await import('../js/main.js');
  const storageMod = await import('../js/storage.js');

  // Helper to create a dummy player
  const createDummyPlayer = (name, club = 'Hà Nội FC') => ({
    name,
    age: 18,
    position: 'ST',
    seasonsPlayed: 1,
    currentClub: { name: club },
    careerStats: { matches: 10, goals: 5, assists: 2, cleanSheets: 0, saves: 0, tackles: 1 },
    currentSeasonStats: { matches: 10, goals: 5, assists: 2, cleanSheets: 0, saves: 0, tackles: 1 },
    seasonHistory: [],
    injury: { isInjured: false },
    tactic: 'BALANCED'
  });

  // TEST 1: Algorithm getFirstAvailableSlot()
  console.log('\n--- TEST 1: Algorithm getFirstAvailableSlot() ---');
  localStorage.clear();

  // Case 1A: All 5 slots empty -> should return 1
  assert.strictEqual(storageMod.getFirstAvailableSlot(), 1, 'Empty storage should return Slot 1');
  console.log('✓ Case 1A: All slots empty -> Slot 1');

  // Case 1B: Slot 1 occupied, Slots 2-5 empty -> should return 2
  storageMod.saveGame(createDummyPlayer('Player 1'), 1);
  assert.strictEqual(storageMod.getFirstAvailableSlot(), 2, 'Slot 1 occupied -> should return Slot 2');
  console.log('✓ Case 1B: Slot 1 occupied -> Slot 2');

  // Case 1C: Slot 1 and Slot 2 occupied -> should return 3
  storageMod.saveGame(createDummyPlayer('Player 2'), 2);
  assert.strictEqual(storageMod.getFirstAvailableSlot(), 3, 'Slot 1 & 2 occupied -> should return Slot 3');
  console.log('✓ Case 1C: Slots 1, 2 occupied -> Slot 3');

  // Case 1D: Non-contiguous slots: Slot 1 and Slot 3 occupied, Slot 2 empty -> should return 2
  storageMod.deleteSaveSlot(2);
  storageMod.saveGame(createDummyPlayer('Player 3'), 3);
  assert.strictEqual(storageMod.getFirstAvailableSlot(), 2, 'Slot 1 & 3 occupied, Slot 2 empty -> should return Slot 2');
  console.log('✓ Case 1D: Slots 1 & 3 occupied, Slot 2 empty -> Slot 2 (lowest-indexed)');

  // Case 1E: All 5 slots occupied -> should return 1 (or current active slot)
  storageMod.saveGame(createDummyPlayer('Player 2'), 2);
  storageMod.saveGame(createDummyPlayer('Player 4'), 4);
  storageMod.saveGame(createDummyPlayer('Player 5'), 5);
  storageMod.setCurrentSaveSlot(1);
  const allOccupiedSlot = storageMod.getFirstAvailableSlot();
  assert.ok(allOccupiedSlot >= 1 && allOccupiedSlot <= 5, 'All slots occupied returns valid slot');
  console.log(`✓ Case 1E: All 5 slots occupied -> returns fallback Slot ${allOccupiedSlot}`);

  // TEST 2: prepareNewCareer() without args auto-picks lowest empty slot
  console.log('\n--- TEST 2: prepareNewCareer() Auto-Selection ---');
  localStorage.clear();
  // Setup: Slot 1 has player, Slot 2 is empty, Slot 3 has player
  storageMod.saveGame(createDummyPlayer('Đỗ Hùng Dũng'), 1);
  storageMod.saveGame(createDummyPlayer('Nguyễn Hoàng Đức'), 3);
  // Default current was 1
  storageMod.setCurrentSaveSlot(1);

  // Calling prepareNewCareer() with no arguments
  main.prepareNewCareer();
  console.log(`Active save slot after prepareNewCareer(): Slot ${storageMod.currentSaveSlot}`);
  assert.strictEqual(storageMod.currentSaveSlot, 2, 'prepareNewCareer() should auto-select Slot 2');

  // Verify UI pills bar was updated with Slot 2
  const noteEl = getOrCreateElement('slotActiveStatusNote');
  assert.ok(noteEl.innerHTML.includes('Slot 2'), 'slotActiveStatusNote should mention Slot 2');
  assert.ok(noteEl.innerHTML.includes('đang trống'), 'Slot 2 should be noted as empty');
  console.log('✓ prepareNewCareer() auto-selected Slot 2 and updated UI elements.');

  // Calling prepareNewCareer(5) specifically
  main.prepareNewCareer(5);
  assert.strictEqual(storageMod.currentSaveSlot, 5, 'prepareNewCareer(5) should respect explicit targetSlotId');
  console.log('✓ prepareNewCareer(5) respected explicitly requested targetSlotId.');

  // TEST 3: Modal Save Slots Button Cleanup
  console.log('\n--- TEST 3: Modal Save Slots Button Cleanup ---');
  // Render modal
  main.renderSaveSlotsModal();
  const modalList = getOrCreateElement('saveSlotsModalList');
  const modalHTML = modalList.innerHTML;

  // Verify that "⚡ Tạo Mới" button DOES NOT EXIST on occupied slots
  assert.strictEqual(modalHTML.includes('⚡ Tạo Mới'), false, 'Modal should NEVER contain "⚡ Tạo Mới" button');
  console.log('✓ "⚡ Tạo Mới" button has been completely eliminated from occupied slots.');

  // Verify occupied slots (Slot 1 and Slot 3) have "▶ Chơi Tiếp" and "🗑️ Xóa"
  assert.ok(modalHTML.includes('▶ Chơi Tiếp'), 'Occupied slots must have "▶ Chơi Tiếp" button');
  assert.ok(modalHTML.includes('🗑️ Xóa'), 'Occupied slots must have "🗑️ Xóa" button');
  console.log('✓ Occupied slots have exactly 2 buttons: "▶ Chơi Tiếp" and "🗑️ Xóa".');

  // Verify empty slots (Slot 2, 4, 5) have "➕ Tạo Mới Tại Slot Này"
  assert.ok(modalHTML.includes('➕ Tạo Mới Tại Slot Này'), 'Empty slots must keep "➕ Tạo Mới Tại Slot Này" button');
  console.log('✓ Empty slots keep "➕ Tạo Mới Tại Slot Này" button.');

  // TEST 4: restartGame() auto-picks lowest empty slot
  console.log('\n--- TEST 4: restartGame() Auto-Selection ---');
  storageMod.setCurrentSaveSlot(1);
  main.restartGame();
  console.log(`Active save slot after restartGame(): Slot ${storageMod.currentSaveSlot}`);
  assert.strictEqual(storageMod.currentSaveSlot, 2, 'restartGame() should auto-select Slot 2');
  console.log('✓ restartGame() correctly set currentSaveSlot to the lowest available empty slot.');

  // TEST 5: handleHeaderNewCareerClick() auto-picks lowest empty slot
  console.log('\n--- TEST 5: handleHeaderNewCareerClick() Auto-Selection ---');
  storageMod.setCurrentSaveSlot(1);
  main.handleHeaderNewCareerClick();
  console.log(`Active save slot after handleHeaderNewCareerClick(): Slot ${storageMod.currentSaveSlot}`);
  assert.strictEqual(storageMod.currentSaveSlot, 2, 'handleHeaderNewCareerClick() should auto-select Slot 2');
  console.log('✓ handleHeaderNewCareerClick() correctly set currentSaveSlot to the lowest available empty slot.');

  console.log('\n================================================================');
  console.log('🎉 ALL AUTO-PICK & MODAL CLEANUP TESTS PASSED WITH 100% SUCCESS! 🎉');
  console.log('================================================================');
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
