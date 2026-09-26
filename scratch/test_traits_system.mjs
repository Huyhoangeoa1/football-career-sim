import assert from 'node:assert';
import { createInitialPlayer } from '../js/state.js';
import { getWeakFootModifier, getSkillMovesBonus, createDecisionMoment } from '../js/matchEngine.js';
import { FW_MF_MOMENT_BANK, generateMomentsForMatch } from '../js/events.js';
import { toggleSubscription } from '../js/store.js';
import { LIFESTYLE_CATALOG } from '../js/data.js';

console.log('--- TEST 1: Default Player & Attributes ---');
const pDefault = createInitialPlayer('Nguyen Van A', 'VN', 'ST');
assert.strictEqual(pDefault.preferredFoot, 'Right', 'preferredFoot default should be Right');
assert.strictEqual(pDefault.weakFoot, 4, 'weakFoot default for ST should be 4');
assert.strictEqual(pDefault.skillMoves, 3, 'skillMoves default for ST should be 3');
assert.strictEqual(pDefault.weakFootTrainProgress, 0, 'weakFootTrainProgress should be 0');
assert.strictEqual(pDefault.skillMovesTrainProgress, 0, 'skillMovesTrainProgress should be 0');

const pGK = createInitialPlayer('Tran Van B', 'VN', 'GK');
assert.strictEqual(pGK.weakFoot, 2, 'weakFoot default for GK should be 2');
assert.strictEqual(pGK.skillMoves, 1, 'skillMoves default for GK should be 1');

const pDF = createInitialPlayer('Le Van C', 'VN', 'CB');
assert.strictEqual(pDF.weakFoot, 3, 'weakFoot default for CB should be 3');
assert.strictEqual(pDF.skillMoves, 2, 'skillMoves default for CB should be 2');
console.log('✓ Test 1 passed: State defaults for all positions are correct.');

console.log('--- TEST 2: Weak Foot Modifier Calculations ---');
assert.strictEqual(getWeakFootModifier(2, true), -0.25, '< 3 stars weak foot penalty must be -25%');
assert.strictEqual(getWeakFootModifier(1, true), -0.25, '1 star weak foot penalty must be -25%');
assert.strictEqual(getWeakFootModifier(3, true), -0.10, '3 stars weak foot penalty must be -10%');
assert.strictEqual(getWeakFootModifier(4, true), -0.05, '4 stars weak foot penalty must be -5%');
assert.strictEqual(getWeakFootModifier(5, true), 0, '5 stars weak foot (two-footed) must have 0 penalty');
assert.strictEqual(getWeakFootModifier(2, false), 0, 'Not in weak foot situation must have 0 modifier');
console.log('✓ Test 2 passed: getWeakFootModifier adheres 100% to rules.');

console.log('--- TEST 3: Skill Moves Bonus Calculations ---');
assert.strictEqual(getSkillMovesBonus(1), 0, '1 star skill moves has 0 bonus');
assert.strictEqual(getSkillMovesBonus(2), 0, '2 star skill moves has 0 bonus');
assert.strictEqual(getSkillMovesBonus(3), 0, '3 star skill moves has 0 bonus');
assert.strictEqual(getSkillMovesBonus(4), 0.10, '4 star skill moves has +10% bonus');
assert.strictEqual(getSkillMovesBonus(5), 0.15, '5 star skill moves has +15% bonus');
assert.strictEqual(getSkillMovesBonus(6), 0.25, '6 star Trickster+ has +25% bonus');
console.log('✓ Test 3 passed: getSkillMovesBonus adheres 100% to rules.');

console.log('--- TEST 4: Lifestyle sub_freestyle_coach in Store ---');
const subCoach = LIFESTYLE_CATALOG.subscriptions.find(s => s.id === 'sub_freestyle_coach');
assert.ok(subCoach, 'sub_freestyle_coach must exist in LIFESTYLE_CATALOG.subscriptions');
assert.strictEqual(subCoach.icon, '🪄');

const pTestSub = createInitialPlayer('Freestyle Tester', 'VN', 'LW');
pTestSub.money = 10000000;
pTestSub.skillMoves = 5;

const resSub = toggleSubscription(pTestSub, 'sub_freestyle_coach', true);
assert.strictEqual(resSub.success, true, 'Subscribing to sub_freestyle_coach should succeed');
assert.strictEqual(pTestSub.skillMoves, 6, 'Subscribing must elevate skillMoves to 6⭐ Trickster+');

const resUnsub = toggleSubscription(pTestSub, 'sub_freestyle_coach', false);
assert.strictEqual(resUnsub.success, true, 'Unsubscribing should succeed');
assert.strictEqual(pTestSub.skillMoves, 5, 'Unsubscribing must revert skillMoves to 5⭐');
console.log('✓ Test 4 passed: sub_freestyle_coach lifecycle works cleanly.');

console.log('--- TEST 5: Match Decision Moments (Weak Foot & Skill Moves) ---');
const pMoments = createInitialPlayer('Moment Maestro', 'VN', 'ST');
pMoments.skillMoves = 6;
pMoments.weakFoot = 5;

const decMoment = createDecisionMoment(pMoments, 45, false);
assert.ok(decMoment.choices && decMoment.choices.length > 0, 'Decision moment must have choices');
console.log(`Generated moment: "${decMoment.title}" with ${decMoment.choices.length} choices`);
decMoment.choices.forEach((c, idx) => {
  console.log(`  Choice ${idx + 1}: ${c.text} | StatHint: ${c.statHint} | SuccessChance: ${(c.successChance * 100).toFixed(1)}%`);
});
console.log('✓ Test 5 passed: createDecisionMoment generates valid, enhanced choices.');

console.log('--- TEST 6: FW_MF_MOMENT_BANK & generateMomentsForMatch Filtering ---');
const tricksterMoment = FW_MF_MOMENT_BANK.find(m => m.id === 'MOMENT_TRICKSTER_MASTER');
assert.ok(tricksterMoment, 'MOMENT_TRICKSTER_MASTER must be in FW_MF_MOMENT_BANK');
assert.strictEqual(tricksterMoment.minSkillMoves, 6, 'MOMENT_TRICKSTER_MASTER minSkillMoves must be 6');

const wfMoment = FW_MF_MOMENT_BANK.find(m => m.id === 'MOMENT_WEAK_FOOT_FINISH');
assert.ok(wfMoment, 'MOMENT_WEAK_FOOT_FINISH must be in FW_MF_MOMENT_BANK');

// Player with 3 stars skill moves should never get MOMENT_TRICKSTER_MASTER
for (let i = 0; i < 50; i++) {
  const pLowSm = createInitialPlayer('Low Skill', 'VN', 'FW');
  pLowSm.skillMoves = 3;
  const moments = generateMomentsForMatch(pLowSm, {});
  const hasTrickster = moments.some(m => m.id === 'MOMENT_TRICKSTER_MASTER');
  assert.strictEqual(hasTrickster, false, '3-star skill moves player must never receive MOMENT_TRICKSTER_MASTER');
}
console.log('✓ Test 6 passed: Exclusive 6⭐ moments are strictly gated by skillMoves.');

console.log('--- TEST 7: Legacy Save Backwards Compatibility & Migration (_migrate) ---');
import { _migrate } from '../js/storage.js';
const legacySave = {
  name: 'Old Star Player',
  position: 'ST',
  season: 2,
  age: 20,
  attr1: 75,
  attr2: 70
};

const migrated = _migrate(legacySave);
assert.strictEqual(migrated.preferredFoot, 'Right', 'Legacy save should migrate preferredFoot to Right');
assert.strictEqual(migrated.weakFoot, 4, 'Legacy ST save should migrate weakFoot to 4');
assert.strictEqual(migrated.skillMoves, 3, 'Legacy ST save should migrate skillMoves to 3');
assert.strictEqual(migrated.weakFootTrainProgress, 0, 'Legacy save should init weakFootTrainProgress to 0');
assert.strictEqual(migrated.skillMovesTrainProgress, 0, 'Legacy save should init skillMovesTrainProgress to 0');

const legacyGk = { name: 'Old GK', position: 'GK' };
const migratedGk = _migrate(legacyGk);
assert.strictEqual(migratedGk.weakFoot, 2, 'Legacy GK save should migrate weakFoot to 2');
assert.strictEqual(migratedGk.skillMoves, 1, 'Legacy GK save should migrate skillMoves to 1');
console.log('✓ Test 7 passed: _migrate seamlessly backfills preferredFoot, weakFoot and skillMoves.');

console.log('--- ALL TRAITS SYSTEM TESTS PASSED SUCCESSFULLY! ---');
