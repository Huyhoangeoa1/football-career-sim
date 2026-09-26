import { calculateMatchPerformanceBonus, calculatePostMatchImpact, FAME_EARNINGS_MULTIPLIERS } from '../js/playerEngine.js';

console.log('=== TEST 1: FAME_EARNINGS_MULTIPLIERS ===');
console.assert(FAME_EARNINGS_MULTIPLIERS[1] === 1.00, 'Tier 1 must be 1.00x');
console.assert(FAME_EARNINGS_MULTIPLIERS[2] === 1.10, 'Tier 2 must be 1.10x');
console.assert(FAME_EARNINGS_MULTIPLIERS[3] === 1.25, 'Tier 3 must be 1.25x');
console.assert(FAME_EARNINGS_MULTIPLIERS[4] === 1.45, 'Tier 4 must be 1.45x');
console.assert(FAME_EARNINGS_MULTIPLIERS[5] === 1.70, 'Tier 5 must be 1.70x');
console.assert(FAME_EARNINGS_MULTIPLIERS[6] === 2.00, 'Tier 6 must be 2.00x');
console.assert(FAME_EARNINGS_MULTIPLIERS[7] === 2.50, 'Tier 7 must be 2.50x');
console.assert(FAME_EARNINGS_MULTIPLIERS[8] === 3.00, 'Tier 8 must be 3.00x');
console.assert(FAME_EARNINGS_MULTIPLIERS[9] === 4.00, 'Tier 9 must be 4.00x');
console.log('✅ TEST 1 passed: All 9 Fame multipliers verified.');

console.log('\n=== TEST 2: Academy Stage Attacker Performance Bonus ===');
const academyPlayer = {
  isAcademyStage: true,
  position: 'ST',
  positionGroup: 'ATTACKER',
  salary: 1500,
  fame: 600, // Tier 3: Wonderkid -> 1.25x (+25%)
  money: 5000
};
const academySim = {
  isPlayerHome: true,
  homeScore: 3,
  awayScore: 1,
  playerStats: {
    goals: 2,
    assists: 1,
    cleanSheets: 0,
    saves: 0
  }
};
const acEarn = calculateMatchPerformanceBonus(academySim, academyPlayer);
console.log('Academy Attacker Earnings:', acEarn);
// Base: 50, Goals (10%): 2 * 150 = 300, Assists (5%): 1 * 75 = 75.
// Raw: 50 + 300 + 75 = 425.
// Fame Tier 3 (+25%): 425 * 0.25 = 106.25 -> 106.
// Total: 531.
console.assert(acEarn.baseFee === 50, `Expected baseFee 50, got ${acEarn.baseFee}`);
console.assert(acEarn.goalBonus === 300, `Expected goalBonus 300, got ${acEarn.goalBonus}`);
console.assert(acEarn.assistBonus === 75, `Expected assistBonus 75, got ${acEarn.assistBonus}`);
console.assert(acEarn.cleanSheetBonus === 0, `Attacker should not receive cleanSheetBonus`);
console.assert(acEarn.fameMultiplier === 1.25, `Expected fameMultiplier 1.25, got ${acEarn.fameMultiplier}`);
console.assert(acEarn.rawEarnings === 425, `Expected rawEarnings 425, got ${acEarn.rawEarnings}`);
console.assert(acEarn.fameBonusAmount === 106, `Expected fameBonusAmount 106, got ${acEarn.fameBonusAmount}`);
console.assert(acEarn.totalEarned === 531, `Expected totalEarned 531, got ${acEarn.totalEarned}`);
console.assert(academyPlayer.money === 5000 + 531, `Player money not credited correctly: ${academyPlayer.money}`);
console.log('✅ TEST 2 passed: Academy performance rates and Tier 3 Fame multiplier calculated correctly.');

console.log('\n=== TEST 3: Professional Goalkeeper Clean Sheet & Saves ===');
const proGK = {
  isAcademyStage: false,
  position: 'GK',
  positionGroup: 'GOALKEEPER',
  salary: 100000, // 100k/week
  fame: 4500, // Tier 6: World-Class -> 2.0x (+100%)
  money: 500000
};
const gkSim = {
  isPlayerHome: false,
  homeScore: 0,
  awayScore: 2,
  playerStats: {
    goals: 0,
    assists: 0,
    cleanSheets: 1,
    saves: 6
  }
};
const gkEarn = calculateMatchPerformanceBonus(gkSim, proGK);
console.log('Pro GK Earnings:', gkEarn);
// Base: 100k * 0.03 = 3000.
// Clean sheet (10%): 100k * 0.10 = 10000.
// Saves (1% per save): 6 * 1000 = 6000.
// Raw: 3000 + 10000 + 6000 = 19000.
// Fame Tier 6 (+100%): 19000 * 1.0 = 19000.
// Total: 38000.
console.assert(gkEarn.cleanSheetBonus === 10000, `Expected cleanSheetBonus 10000, got ${gkEarn.cleanSheetBonus}`);
console.assert(gkEarn.saveBonus === 6000, `Expected saveBonus 6000, got ${gkEarn.saveBonus}`);
console.assert(gkEarn.fameMultiplier === 2.0, `Expected fameMultiplier 2.0, got ${gkEarn.fameMultiplier}`);
console.assert(gkEarn.totalEarned === 38000, `Expected totalEarned 38000, got ${gkEarn.totalEarned}`);
console.assert(proGK.money === 500000 + 38000, `Pro GK money mismatch: ${proGK.money}`);
console.log('✅ TEST 3 passed: Goalkeeper clean sheet & saves bonus with 2.0x multiplier.');

console.log('\n=== TEST 4: Hat-trick & GOAT Tier 9 (4.0x Multiplier) ===');
const goatPlayer = {
  isAcademyStage: false,
  position: 'ST',
  positionGroup: 'ATTACKER',
  salary: 500000, // 500k/week superstar
  fame: 22000, // Tier 9: GOAT -> 4.0x (+300%)
  money: 20000000
};
const hatTrickSim = {
  liveRating: 9.8,
  isPlayerHome: true,
  homeScore: 4,
  awayScore: 0,
  playerStats: {
    goals: 3,
    assists: 1,
    cleanSheets: 1, // Attacker doesn't get clean sheet bonus
    saves: 0
  },
  xG: { player: 1.8 }
};
const goatImpact = calculatePostMatchImpact(hatTrickSim, goatPlayer);
console.log('GOAT Hat-trick Impact matchEarnings:', goatImpact.matchEarnings);
// Base (3%): 500k * 0.03 = 15000.
// Goals (x3, 10%): 3 * (500k * 0.10 = 50000) = 150000.
// Assist (x1, 5%): 500k * 0.05 = 25000.
// Hat-trick bonus (10%): 500k * 0.10 = 50000.
// Raw: 15000 + 150000 + 25000 + 50000 = 240000.
// Fame Tier 9 (+300%): 240000 * 3.0 = 720000.
// Total: 960000.
console.assert(goatImpact.matchEarnings.goalsCount === 3, `Expected 3 goals, got ${goatImpact.matchEarnings.goalsCount}`);
console.assert(goatImpact.matchEarnings.hatTrickBonus === 50000, `Expected hatTrickBonus 50000, got ${goatImpact.matchEarnings.hatTrickBonus}`);
console.assert(goatImpact.matchEarnings.fameMultiplier === 4.0, `Expected fameMultiplier 4.0, got ${goatImpact.matchEarnings.fameMultiplier}`);
console.assert(goatImpact.matchEarnings.fameBonusAmount === 720000, `Expected fameBonusAmount 720000, got ${goatImpact.matchEarnings.fameBonusAmount}`);
console.assert(goatImpact.matchEarnings.totalEarned === 960000, `Expected totalEarned 960000, got ${goatImpact.matchEarnings.totalEarned}`);
console.assert(goatPlayer.money === 20000000 + 960000, `Player money mismatch: ${goatPlayer.money}`);
console.log('✅ TEST 4 passed: Hat-trick and GOAT 4.0x (+300%) multiplier verified.');
