import { calculateMatchPerformanceBonus } from '../js/playerEngine.js';
import { simulateMatchdayRound } from '../js/engine.js';
import { formatSalary } from '../js/ui.js';
import { ALL_CLUBS } from '../js/data.js';

console.log('--- TEST 1: formatSalary helper ---');
console.log('formatSalary(300):', formatSalary(300));
console.log('formatSalary(85000):', formatSalary(85000));
if (formatSalary(300) !== '€300 / week') throw new Error('formatSalary(300) failed');
if (formatSalary(85000) !== '€85,000 / week') throw new Error('formatSalary(85000) failed');
console.log('✅ TEST 1 passed!');

console.log('\n--- TEST 2: calculateMatchPerformanceBonus for Academy Attacker ---');
const academyPlayer = {
  name: 'Young Prospect',
  position: 'ST',
  positionGroup: 'ATTACKER',
  salary: 300,
  isAcademyStage: true,
  fame: 50,
  money: 1000
};
const academyStats = {
  goals: 2,
  assists: 1,
  saves: 0,
  cleanSheets: 0,
  isPlayerHome: true,
  homeScore: 3,
  awayScore: 1
};
const acBonus = calculateMatchPerformanceBonus(academyPlayer, academyStats, 'WIN');
console.log('Academy ST Bonus:', {
  weeklyWage: acBonus.weeklyWage,
  baseFee: acBonus.baseFee,
  goalBonus: acBonus.goalBonus,
  goalsCount: acBonus.goalsCount,
  assistBonus: acBonus.assistBonus,
  totalEarned: acBonus.totalEarned
});
// 10% of 300 = 30 per goal -> 2 goals = 60
// 5% of 300 = 15 per assist -> 1 assist = 15
if (acBonus.goalBonus !== 60) throw new Error(`Expected goalBonus 60, got ${acBonus.goalBonus}`);
if (acBonus.assistBonus !== 15) throw new Error(`Expected assistBonus 15, got ${acBonus.assistBonus}`);
if (acBonus.weeklyWage !== 300) throw new Error(`Expected weeklyWage 300, got ${acBonus.weeklyWage}`);
console.log('✅ TEST 2 passed!');

console.log('\n--- TEST 3: calculateMatchPerformanceBonus for Pro Midfielder ---');
const proMidfielder = {
  name: 'Star Playmaker',
  position: 'CAM',
  positionGroup: 'MIDFIELDER',
  salary: 85000,
  isAcademyStage: false,
  fame: 1500, // Tier 4
  money: 500000
};
const midSim = {
  playerStats: {
    goals: 1,
    assists: 2,
    saves: 0,
    cleanSheets: 0
  },
  isPlayerHome: true,
  homeScore: 4,
  awayScore: 2
};
const midBonus = calculateMatchPerformanceBonus(midSim, proMidfielder);
console.log('Pro CAM Bonus:', {
  weeklyWage: midBonus.weeklyWage,
  baseFee: midBonus.baseFee,
  goalBonus: midBonus.goalBonus,
  assistBonus: midBonus.assistBonus,
  fameMultiplier: midBonus.fameMultiplier,
  totalEarned: midBonus.totalEarned
});
// For midfielder: 10% assist (8,500 each * 2 = 17,000), 5% goal (4,250 * 1 = 4,250)
if (midBonus.assistBonus !== 17000) throw new Error(`Expected assistBonus 17000, got ${midBonus.assistBonus}`);
if (midBonus.goalBonus !== 4250) throw new Error(`Expected goalBonus 4250, got ${midBonus.goalBonus}`);
console.log('✅ TEST 3 passed!');

console.log('\n--- TEST 4: calculateMatchPerformanceBonus for Defender & Goalkeeper ---');
const proGK = {
  name: 'Safe Hands',
  position: 'GK',
  positionGroup: 'GOALKEEPER',
  salary: 50000,
  isAcademyStage: false,
  fame: 800,
  money: 100000
};
const gkSim = {
  playerStats: {
    goals: 0,
    assists: 0,
    saves: 5,
    cleanSheets: 1
  },
  isPlayerHome: true,
  homeScore: 1,
  awayScore: 0
};
const gkBonus = calculateMatchPerformanceBonus(gkSim, proGK);
console.log('Pro GK Bonus:', {
  cleanSheetBonus: gkBonus.cleanSheetBonus,
  saveBonus: gkBonus.saveBonus,
  savesCount: gkBonus.savesCount,
  totalEarned: gkBonus.totalEarned
});
// Clean sheet: 10% of 50,000 = 5,000
// 5 saves: 1% of 50,000 = 500 * 5 = 2,500
if (gkBonus.cleanSheetBonus !== 5000) throw new Error(`Expected cleanSheetBonus 5000, got ${gkBonus.cleanSheetBonus}`);
if (gkBonus.saveBonus !== 2500) throw new Error(`Expected saveBonus 2500, got ${gkBonus.saveBonus}`);
console.log('✅ TEST 4 passed!');

console.log('\n--- TEST 5: Weekly Wage Payout in simulateMatchdayRound ---');
const manCity = ALL_CLUBS.find(c => c.id === 'man_city');
console.log('Man City weekly salary in data.js:', manCity.salary);
if (manCity.salary !== 600000) throw new Error(`Expected Man City weekly wage 600,000, got ${manCity.salary}`);

const matchPlayer = {
  name: 'Rising Star',
  position: 'ST',
  positionGroup: 'ATTACKER',
  salary: 85000,
  money: 100000,
  isAcademyStage: false,
  currentClub: manCity,
  currentFixtureIndex: 0,
  currentSeasonFixtures: [
    {
      stageName: 'Vòng 1',
      competitionName: 'Premier League',
      competitionType: 'DOMESTIC_LEAGUE',
      isCompleted: false,
      playerMatch: {
        isPlayed: false,
        isPlayerHome: true,
        homeClub: manCity,
        awayClub: { name: 'Everton', power: 75 },
        stadium: 'Etihad Stadium'
      }
    }
  ],
  careerStats: { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 }
};

const initialMoney = matchPlayer.money;
const roundOutcome = simulateMatchdayRound(matchPlayer, true, null);
console.log('Round simulated, weeklySalary:', roundOutcome.weeklySalary, 'matchEarnings totalEarned:', roundOutcome.matchEarnings.totalEarned);
console.log('Player money before:', initialMoney, 'after:', matchPlayer.money);
const moneyDiff = matchPlayer.money - initialMoney;
// Difference should be exactly weeklySalary (85,000) + matchEarnings.totalEarned
if (moneyDiff !== 85000 + roundOutcome.matchEarnings.totalEarned) {
  throw new Error(`Expected moneyDiff ${85000 + roundOutcome.matchEarnings.totalEarned}, got ${moneyDiff}`);
}
console.log('✅ TEST 5 passed!');

console.log('\nALL TESTS PASSED 100%!');
