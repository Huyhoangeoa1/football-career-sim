import { FAME_TIERS, getFameTier, clampStats, calculatePostMatchImpact } from '../js/playerEngine.js';
import { calculateTransfermarktValue } from '../js/transferEngine.js';

console.log('=== TEST 1: FAME_TIERS & getFameTier ===');
console.assert(FAME_TIERS.length === 9, `Expected 9 tiers, got ${FAME_TIERS.length}`);

// Test tier 1
const t1_0 = getFameTier(0);
console.assert(t1_0.tierIndex === 1, `Expected tier 1, got ${t1_0.tierIndex}`);
console.assert(t1_0.title === "Tân Binh Vô Danh", `Got ${t1_0.title}`);
console.assert(t1_0.badge === "⚪", `Got ${t1_0.badge}`);
console.assert(t1_0.progressPercent === 0, `Got progress ${t1_0.progressPercent}`);
console.assert(t1_0.nextTierPoints === 200, `Got nextTierPoints ${t1_0.nextTierPoints}`);

const t1_100 = getFameTier(100);
console.assert(t1_100.progressPercent === 50, `Expected 50%, got ${t1_100.progressPercent}`);

// Test tier 2
const t2 = getFameTier(350);
console.assert(t2.tierIndex === 2 && t2.badge === "🟢" && t2.title === "Mầm Non Triển Vọng", `Tier 2 mismatch: ${JSON.stringify(t2)}`);
console.assert(t2.progressPercent === 50, `Expected 50% for 350 in [200, 500), got ${t2.progressPercent}`);

// Test tier 3
const t3 = getFameTier(750);
console.assert(t3.tierIndex === 3 && t3.badge === "🔵" && t3.title === "Thần Đồng Trẻ Tuổi", `Tier 3 mismatch: ${JSON.stringify(t3)}`);

// Test tier 4
const t4 = getFameTier(1500);
console.assert(t4.tierIndex === 4 && t4.badge === "🟣" && t4.title === "Ngôi Sao Quốc Nội", `Tier 4 mismatch: ${JSON.stringify(t4)}`);

// Test tier 5
const t5 = getFameTier(3000);
console.assert(t5.tierIndex === 5 && t5.badge === "🟡" && t5.title === "Tên Tuổi Châu Lục", `Tier 5 mismatch: ${JSON.stringify(t5)}`);

// Test tier 6
const t6 = getFameTier(5500);
console.assert(t6.tierIndex === 6 && t6.badge === "🟠" && t6.title === "Đẳng Cấp Thế Giới", `Tier 6 mismatch: ${JSON.stringify(t6)}`);

// Test tier 7
const t7 = getFameTier(9500);
console.assert(t7.tierIndex === 7 && t7.badge === "🔴" && t7.title === "Siêu Sao Toàn Cầu", `Tier 7 mismatch: ${JSON.stringify(t7)}`);

// Test tier 8
const t8 = getFameTier(16000);
console.assert(t8.tierIndex === 8 && t8.badge === "👑" && t8.title === "Biểu Tượng Đương Đại", `Tier 8 mismatch: ${JSON.stringify(t8)}`);

// Test tier 9 (GOAT)
const t9 = getFameTier(25000);
console.assert(t9.tierIndex === 9 && t9.badge === "🌌" && t9.title.includes("GOAT"), `Tier 9 mismatch: ${JSON.stringify(t9)}`);
console.assert(t9.progressPercent === 100, `Expected 100% progress for GOAT, got ${t9.progressPercent}`);
console.assert(t9.nextTierTitle === null, `Expected nextTierTitle null, got ${t9.nextTierTitle}`);

console.log('✅ TEST 1 passed: All 9 Fame Tiers verified successfully.');

console.log('\n=== TEST 2: clampStats unclamp Fame ===');
const dummyPlayer = {
  fame: 28500,
  stamina: 150,
  stam: 150,
  morale: 120,
  form: 110,
  pace: 88,
  shooting: 92,
  passing: 85,
  dribbling: 90,
  defending: 40,
  physical: 80
};
clampStats(dummyPlayer);
console.assert(dummyPlayer.fame === 28500, `Expected fame 28500, got ${dummyPlayer.fame}`);
console.assert(dummyPlayer.stamina === 100, `Expected stamina clamped to 100, got ${dummyPlayer.stamina}`);
console.assert(dummyPlayer.morale === 99, `Expected morale clamped to 99, got ${dummyPlayer.morale}`);
console.assert(dummyPlayer.form === 99, `Expected form clamped to 99, got ${dummyPlayer.form}`);
console.log('✅ TEST 2 passed: Fame is uncapped while other stats remain clamped.');

console.log('\n=== TEST 3: Post-Match Impact Fame Points ===');
const matchPlayer = {
  fame: 500,
  stamina: 80,
  stam: 80,
  morale: 80,
  form: 75,
  positionGroup: 'ATTACKER',
  age: 18,
  ovr: 75,
  potential: 88
};
const simData = {
  liveRating: 8.8,
  playerStats: {
    goals: 2,
    assists: 1
  },
  xG: {
    player: 1.2
  }
};
const impact = calculatePostMatchImpact(simData, matchPlayer);
console.log('Post-match impact deltaFame:', impact.deltaFame, 'New player fame:', matchPlayer.fame);
console.assert(impact.deltaFame >= 5 && impact.deltaFame <= 30, `deltaFame ${impact.deltaFame} not in [5, 30]`);
console.assert(matchPlayer.fame === 500 + impact.deltaFame, `Player fame did not increase by deltaFame`);
console.log('✅ TEST 3 passed: Post-match awards +5 to +30 Fame points.');

console.log('\n=== TEST 4: Transfermarkt Market Value Stability ===');
const superstar = {
  age: 24,
  fame: 25000, // GOAT level fame
  contractYearsRemaining: 4,
  positionGroup: 'ATTACKER',
  position: 'ST',
  stats: { pac: 95, sho: 95, pas: 92, dri: 94, def: 50, phy: 85 },
  form: 80,
  morale: 85,
  currentClub: {
    power: 90,
    league: { tierLevel: 4 }
  }
};
const goatVal = calculateTransfermarktValue(superstar);
console.log(`GOAT Player (25k Fame, 94 OVR) Market Value: €${(goatVal / 1000000).toFixed(1)}M`);
console.assert(goatVal <= 350000000, `Market value exceeded 350M cap: ${goatVal}`);
console.assert(goatVal >= 250000000, `Market value unexpectedly low: ${goatVal}`);

const wonderkid = {
  age: 17,
  fame: 800,
  contractYearsRemaining: 3,
  positionGroup: 'ATTACKER',
  position: 'ST',
  stats: { pac: 80, sho: 75, pas: 70, dri: 78, def: 40, phy: 68 },
  form: 70,
  morale: 75,
  currentClub: {
    power: 70,
    league: { tierLevel: 3 }
  }
};
const wkVal = calculateTransfermarktValue(wonderkid);
console.log(`Wonderkid (800 Fame, 72 OVR, 17yo) Market Value: €${(wkVal / 1000000).toFixed(1)}M`);
console.assert(wkVal >= 30000000 && wkVal <= 100000000, `Wonderkid valuation unexpected: ${wkVal}`);
console.log('✅ TEST 4 passed: Valuation scales smoothly without inflating into billions.');

console.log('\n=== TEST 5: Legacy Save Migration (x10 Fame) ===');
import('../js/storage.js').then(({ _migrate }) => {
  const legacyData = {
    fame: 85,
    attr1: 15,
    attr2: 15,
    attr3: 15,
    attr4: 15
  };
  _migrate(legacyData);
  console.assert(legacyData.fame === 850, `Expected fame 850, got ${legacyData.fame}`);

  const rookieData = {
    fame: 10,
    attr1: 15,
    attr2: 15,
    attr3: 15,
    attr4: 15
  };
  _migrate(rookieData);
  console.assert(rookieData.fame === 100, `Expected fame 100, got ${rookieData.fame}`);

  const alreadyMigrated = {
    fame: 3500,
    attr1: 20,
    attr2: 20,
    attr3: 20,
    attr4: 20
  };
  _migrate(alreadyMigrated);
  console.assert(alreadyMigrated.fame === 3500, `Expected fame 3500 to stay unchanged, got ${alreadyMigrated.fame}`);
  console.log('✅ TEST 5 passed: Legacy save migration multiplies fame <= 100 by 10 correctly.');
});
