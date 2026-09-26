import assert from 'assert';
import { createInitialPlayer, resetPlayerState } from '../js/state.js';
import { generateInitialSubStats, rollInitialFootAndSkills, SUB_STATS_CONFIG } from '../js/data.js';

console.log('=== TEST SUITE: RANDOM INITIAL PLAYER CREATION (1,000 SIMULATIONS) ===\n');

// 1. Test generateInitialSubStats directly
console.log('--- 1. Testing generateInitialSubStats helper ---');
const subStatsSample = generateInitialSubStats(55, 60);
const allSubKeys = [];
for (const g of Object.values(SUB_STATS_CONFIG)) {
  for (const s of g.stats) {
    allSubKeys.push(s.key);
  }
}
assert.strictEqual(allSubKeys.length, 29, 'Total sub-stats must be exactly 29');
for (const key of allSubKeys) {
  assert.ok(subStatsSample[key] !== undefined, `subStats.${key} must be defined`);
  assert.ok(Number.isInteger(subStatsSample[key]), `subStats.${key} must be an integer`);
  assert.ok(subStatsSample[key] >= 55 && subStatsSample[key] <= 60, `subStats.${key} (${subStatsSample[key]}) must be in [55, 60]`);
}
console.log('✓ generateInitialSubStats correctly populates all 29 sub-stats in [55, 60].');

// 2. Test rollInitialFootAndSkills helper
console.log('\n--- 2. Testing rollInitialFootAndSkills helper ---');
const rollSample = rollInitialFootAndSkills();
assert.ok(['Right', 'Left'].includes(rollSample.preferredFootSide), 'preferredFootSide must be Right or Left');
assert.strictEqual(rollSample.preferredFoot, rollSample.preferredFootSide, 'preferredFoot alias matches preferredFootSide');
assert.ok(rollSample.preferredFootStars >= 1 && rollSample.preferredFootStars <= 5, 'preferredFootStars in [1, 5]');
assert.ok(rollSample.weakFoot >= 1 && rollSample.weakFoot <= rollSample.preferredFootStars, 'weakFoot in [1, preferredFootStars]');
assert.ok(rollSample.skillMoves >= 1 && rollSample.skillMoves <= 4, 'skillMoves in [1, 4]');
console.log('✓ rollInitialFootAndSkills returned valid trait boundaries.');

// 3. 1,000 Iteration Simulation of createInitialPlayer
console.log('\n--- 3. Running 1,000-Iteration Monte Carlo Simulation ---');

const ITERATIONS = 1000;
let rightCount = 0;
let leftCount = 0;

const prefStarsDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
const weakFootDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
const skillMovesDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
const ovrDistribution = {};

for (let i = 0; i < ITERATIONS; i++) {
  const p = createInitialPlayer(`Rookie_${i}`, 'VN', 'ST');

  // Verify all 29 subStats in [55, 60]
  assert.strictEqual(Object.keys(p.subStats).length, 29, `Iteration ${i}: Must have 29 subStats`);
  for (const [key, val] of Object.entries(p.subStats)) {
    assert.ok(
      Number.isInteger(val) && val >= 55 && val <= 60,
      `Iteration ${i}: subStat ${key} = ${val} is not an integer in [55, 60]`
    );
  }

  // Verify Preferred Foot Side (50/50)
  assert.ok(
    p.preferredFootSide === 'Right' || p.preferredFootSide === 'Left',
    `Iteration ${i}: preferredFootSide must be Right or Left`
  );
  assert.strictEqual(
    p.preferredFoot,
    p.preferredFootSide,
    `Iteration ${i}: preferredFoot alias must match preferredFootSide`
  );
  if (p.preferredFootSide === 'Right') rightCount++;
  else leftCount++;

  // Verify Preferred Foot Stars (1 - 5)
  assert.ok(
    p.preferredFootStars >= 1 && p.preferredFootStars <= 5,
    `Iteration ${i}: preferredFootStars (${p.preferredFootStars}) must be in [1, 5]`
  );
  prefStarsDistribution[p.preferredFootStars]++;

  // Verify Weak Foot: MUST be <= preferredFootStars
  assert.ok(
    p.weakFoot >= 1 && p.weakFoot <= p.preferredFootStars,
    `Iteration ${i}: VIOLATION: weakFoot (${p.weakFoot}) exceeds preferredFootStars (${p.preferredFootStars})`
  );
  weakFootDistribution[p.weakFoot]++;

  // Verify Skill Moves: MUST be <= 4 (NEVER 5 or 6 at creation)
  assert.ok(
    p.skillMoves >= 1 && p.skillMoves <= 4,
    `Iteration ${i}: VIOLATION: skillMoves (${p.skillMoves}) must be between 1 and 4`
  );
  skillMovesDistribution[p.skillMoves]++;

  // Verify Face Stats match SubStats
  for (const [groupKey, groupConf] of Object.entries(SUB_STATS_CONFIG)) {
    const sum = groupConf.stats.reduce((acc, s) => acc + p.subStats[s.key], 0);
    const expectedAvg = Math.round(sum / groupConf.stats.length);
    assert.strictEqual(
      p.stats[groupKey],
      expectedAvg,
      `Iteration ${i}: Face stat ${groupKey} (${p.stats[groupKey]}) does not match subStats average (${expectedAvg})`
    );
  }

  // Verify OVR in rookie academy range (56 - 59)
  assert.ok(
    p.ovr >= 55 && p.ovr <= 60,
    `Iteration ${i}: OVR ${p.ovr} out of expected rookie range [55, 60]`
  );
  assert.strictEqual(p.baseRating, p.ovr, `Iteration ${i}: baseRating must equal ovr`);

  ovrDistribution[p.ovr] = (ovrDistribution[p.ovr] || 0) + 1;
}

console.log('✅ 1,000 iterations passed all strict integrity assertions!');

// 4. Output Statistical Distributions
console.log('\n--- 4. Statistical Distributions over 1,000 Players ---');
console.log(`Preferred Foot Side: Right = ${rightCount} (${(rightCount/10).toFixed(1)}%), Left = ${leftCount} (${(leftCount/10).toFixed(1)}%) [Target: 50% / 50%]`);

console.log('\nPreferred Foot Stars (Target: 1⭐: 10%, 2⭐: 25%, 3⭐: 40%, 4⭐: 20%, 5⭐: 5%):');
for (let s = 1; s <= 5; s++) {
  console.log(`  ${s}⭐: ${prefStarsDistribution[s]} (${(prefStarsDistribution[s]/10).toFixed(1)}%)`);
}

console.log('\nWeak Foot Stars:');
for (let s = 1; s <= 5; s++) {
  console.log(`  ${s}⭐: ${weakFootDistribution[s]} (${(weakFootDistribution[s]/10).toFixed(1)}%)`);
}

console.log('\nSkill Moves Stars (Target: 1⭐: 30%, 2⭐: 45%, 3⭐: 20%, 4⭐: 5%, 5⭐/6⭐: 0%):');
for (let s = 1; s <= 6; s++) {
  console.log(`  ${s}⭐: ${skillMovesDistribution[s]} (${(skillMovesDistribution[s]/10).toFixed(1)}%)`);
}
assert.strictEqual(skillMovesDistribution[5], 0, '5⭐ Skill Moves must be strictly 0 at creation');
assert.strictEqual(skillMovesDistribution[6], 0, '6⭐ Skill Moves must be strictly 0 at creation');

console.log('\nRookie OVR Distribution:');
for (const [ovr, count] of Object.entries(ovrDistribution).sort((a,b) => Number(a[0]) - Number(b[0]))) {
  console.log(`  OVR ${ovr}: ${count} (${(count/10).toFixed(1)}%)`);
}

// 5. Verify resetPlayerState preserves calculated OVR
console.log('\n--- 5. Testing resetPlayerState integration ---');
const resetP = resetPlayerState('Reset Rookie', 'VN', 'ST');
assert.ok(resetP.ovr >= 55 && resetP.ovr <= 60, `resetPlayerState OVR must be in [55, 60], got ${resetP.ovr}`);
assert.strictEqual(resetP.baseRating, resetP.ovr, 'baseRating equals calculated OVR');
assert.ok(resetP.weakFoot <= resetP.preferredFootStars, 'weakFoot <= preferredFootStars');
assert.ok(resetP.skillMoves <= 4, 'skillMoves <= 4');
console.log(`✓ resetPlayerState successfully created player with OVR ${resetP.ovr}, ${resetP.preferredFootStars}⭐/${resetP.weakFoot}⭐ foot, ${resetP.skillMoves}⭐ skills.`);

console.log('\n🎉 ALL 1,000 RANDOM CREATION TESTS PASSED 100%!');
