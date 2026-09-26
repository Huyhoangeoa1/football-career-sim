// Test script for Overwrite Confirmation Modal and Safety Checks
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
  console.log('--- STARTING OVERWRITE MODAL TESTS ---');

  const main = await import('../js/main.js');
  const storageMod = await import('../js/storage.js');
  const uiMod = await import('../js/ui.js');

  // Spy on localStorage.removeItem to verify clearCupCache calls
  const removedKeys = [];
  const origRemoveItem = global.localStorage.removeItem;
  global.localStorage.removeItem = (k) => {
    removedKeys.push(k);
    origRemoveItem(k);
  };

  // Pre-populate Slot 1 with existing career data
  const oldPlayer = {
    name: 'Nguyễn Văn Quyết',
    age: 28,
    position: 'ST',
    seasonsPlayed: 3,
    currentClub: { name: 'Hà Nội FC' },
    careerStats: { matches: 50, goals: 30, assists: 15, cleanSheets: 0, saves: 0, tackles: 5 },
    currentSeasonStats: { matches: 10, goals: 8, assists: 4, cleanSheets: 0, saves: 0, tackles: 1 },
    seasonHistory: [],
    injury: { isInjured: false },
    tactic: 'BALANCED'
  };
  storageMod.saveGame(oldPlayer, 1);
  storageMod.setCurrentSaveSlot(1);

  // Set cup cache dummy data to verify clearCupCache removes it
  localStorage.setItem('save_slot_1_cup', JSON.stringify({ cupData: 'old_cup' }));
  localStorage.setItem('fcs_cup_cache_1', JSON.stringify({ cache: 'old_cache' }));

  // TEST 1: Check occupied slot detection
  console.log('\n[TEST 1] Occupied Slot Detection:');
  const slots = storageMod.getSaveSlotsInfo();
  const slot1 = slots.find(s => s.slotId === 1);
  console.log(`Slot 1 name: "${slot1.name}", isEmpty: ${slot1.isEmpty}`);
  assert.strictEqual(slot1.isEmpty, false);
  assert.strictEqual(slot1.name, 'Nguyễn Văn Quyết');
  assert.strictEqual(slot1.club, 'Hà Nội FC');
  console.log('✓ Slot 1 correctly recognized as occupied with old career details.');

  // TEST 2: Clicking confirmAndStartCareer on occupied slot must NOT create player immediately, must open modal
  console.log('\n[TEST 2] Modal Trigger on Occupied Slot:');
  getOrCreateElement('inputPlayerName').value = 'Khuất Văn Khang';
  main.confirmAndStartCareer();

  const modal = getOrCreateElement('modalOverwriteWarning');
  console.log(`Modal active class present: ${modal.classList.contains('active')}`);
  console.log(`Modal display style: ${modal.style.display}`);
  assert.strictEqual(modal.classList.contains('active'), true);
  assert.strictEqual(modal.style.display, 'flex');

  // Verify modal fields
  assert.strictEqual(getOrCreateElement('overwriteSlotNumText').textContent, 'Slot 1');
  assert.strictEqual(getOrCreateElement('overwriteOldName').textContent, 'Nguyễn Văn Quyết');
  assert.strictEqual(getOrCreateElement('overwriteOldClub').textContent, 'Hà Nội FC');
  assert.strictEqual(getOrCreateElement('overwriteOldAge').textContent, '28 tuổi');
  assert.strictEqual(getOrCreateElement('overwriteOldSeason').textContent, 'Mùa 4');
  console.log('✓ Modal opened and populated correctly with old player info.');

  // Verify that old data in Slot 1 was NOT modified yet
  const slot1DataCheck = storageMod.loadGame(1);
  assert.strictEqual(slot1DataCheck.player.name, 'Nguyễn Văn Quyết');
  console.log('✓ Slot 1 player data was preserved (no premature overwrite).');

  // TEST 3: User cancels via Cancel button
  console.log('\n[TEST 3] Cancel Overwrite:');
  const btnCancel = getOrCreateElement('btnCancelOverwrite');
  assert.strictEqual(typeof btnCancel.onclick, 'function');
  btnCancel.onclick({ preventDefault: () => {} });

  console.log(`Modal active class after cancel: ${modal.classList.contains('active')}`);
  console.log(`Modal display after cancel: ${modal.style.display}`);
  assert.strictEqual(modal.classList.contains('active'), false);
  assert.strictEqual(modal.style.display, 'none');

  // Verify data is STILL old player
  const slot1StillOld = storageMod.loadGame(1);
  assert.strictEqual(slot1StillOld.player.name, 'Nguyễn Văn Quyết');
  console.log('✓ Modal closed cleanly on cancel, preserving old career.');

  // TEST 4: User confirms overwrite via Confirm button
  console.log('\n[TEST 4] Confirm Overwrite & Safety Cup Cache Clearance:');
  // Trigger creation again
  main.confirmAndStartCareer();
  assert.strictEqual(modal.classList.contains('active'), true);

  const btnConfirm = getOrCreateElement('btnConfirmOverwrite');
  assert.strictEqual(typeof btnConfirm.onclick, 'function');
  btnConfirm.onclick({ preventDefault: () => {} });

  // Modal must be closed
  assert.strictEqual(modal.classList.contains('active'), false);

  // Cup cache must have been cleared for Slot 1 before new player creation
  assert.ok(removedKeys.includes('save_slot_1_cup'));
  assert.ok(removedKeys.includes('fcs_cup_cache_1'));
  console.log('✓ clearCupCache(1) was executed and cup cache keys were cleared.');

  // Slot 1 must now have the NEW player
  const slot1New = storageMod.loadGame(1);
  console.log(`New Player in Slot 1: "${slot1New.player.name}"`);
  assert.strictEqual(slot1New.player.name, 'Khuất Văn Khang');
  console.log('✓ Slot 1 successfully overwritten with new career.');

  // TEST 5: Normal creation on an EMPTY slot proceeds directly without modal
  console.log('\n[TEST 5] Empty Slot Direct Creation (No Modal):');
  storageMod.setCurrentSaveSlot(3);
  const slot3 = storageMod.getSaveSlotsInfo().find(s => s.slotId === 3);
  assert.strictEqual(slot3.isEmpty, true);

  getOrCreateElement('inputPlayerName').value = 'Nguyễn Đình Bắc';
  // Ensure modal is not active
  modal.classList.remove('active');
  modal.style.display = 'none';

  main.confirmAndStartCareer();

  // Modal should NOT have been opened
  assert.strictEqual(modal.classList.contains('active'), false);
  assert.strictEqual(modal.style.display, 'none');

  // Slot 3 should now have new player directly
  const slot3Data = storageMod.loadGame(3);
  console.log(`Player created in Slot 3: "${slot3Data.player.name}"`);
  assert.strictEqual(slot3Data.player.name, 'Nguyễn Đình Bắc');
  console.log('✓ Direct creation on empty slot worked seamlessly without modal interruption.');

  console.log('\n=============================================');
  console.log('🎉 ALL OVERWRITE MODAL TESTS PASSED 100%! 🎉');
  console.log('=============================================');
}

runTests().catch(err => {
  console.error('❌ Test failed with error:', err);
  process.exit(1);
});
