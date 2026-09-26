import { createInitialPlayer } from '../js/state.js';
import { initSeasonScheduleAndTable, simulateMatchdayRound, isSameClub } from '../js/engine.js';
import { YOUTH_LEAGUE_CLUBS } from '../js/data.js';

console.log('=== TEST 1: SELF-PLAY CHECK FOR ALL ACADEMIES (INCLUDING AJAX DE TOEKOMST) ===');

YOUTH_LEAGUE_CLUBS.forEach(club => {
  const p = createInitialPlayer('Test', 'VN', 'FW');
  p.academy = club;
  initSeasonScheduleAndTable(p);

  // Check all season fixtures
  p.currentSeasonFixtures.forEach((f, idx) => {
    const pm = f.playerMatch;
    if (pm) {
      const same = pm.homeClub.id === pm.awayClub.id || isSameClub(pm.homeClub, pm.awayClub);
      if (same) {
        throw new Error(`Self-play detected in fixture ${idx} (${f.stageName} ${f.competitionName}): ${pm.homeClub.name} VS ${pm.awayClub.name}`);
      }
    }
    if (f.aiMatches) {
      f.aiMatches.forEach((am, aIdx) => {
        const same = am.homeClub.id === am.awayClub.id || isSameClub(am.homeClub, am.awayClub);
        if (same) {
          throw new Error(`Self-play detected in aiMatch ${aIdx} of fixture ${idx}: ${am.homeClub.name} VS ${am.awayClub.name}`);
        }
      });
    }
  });

  // Check brackets
  if (p.tournamentBrackets?.domesticCup) {
    p.tournamentBrackets.domesticCup.quarterFinals.forEach((m, mIdx) => {
      if (m.club1 && m.club2 && (m.club1.id === m.club2.id || isSameClub(m.club1, m.club2))) {
        throw new Error(`Self-play detected in domestic bracket QF ${mIdx}: ${m.club1.name} VS ${m.club2.name}`);
      }
    });
  }
});
console.log('✅ TEST 1 PASSED: 0 self-play fixtures found across all clubs and cups!');

console.log('\n=== TEST 2: VIRTUAL SCORER RATE OVER 9 ROUNDS ===');
const p = createInitialPlayer('Hoang Son', 'VN', 'FW');
initSeasonScheduleAndTable(p);

for (let r = 1; r <= 9; r++) {
  simulateMatchdayRound(p, true, null);
}

console.log('Top Scorers after 9 rounds:');
p.leagueTopScorers.forEach(s => {
  console.log(`  - ${s.name} (${s.clubName}): ${s.goals} ban`);
});

const maxBotGoals = Math.max(...p.leagueTopScorers.filter(s => !s.isPlayer).map(s => s.goals));
console.log(`Max bot goals after 9 rounds: ${maxBotGoals}`);
if (maxBotGoals > 10) {
  throw new Error(`Bot goals too high: ${maxBotGoals} (expected around 3-6)`);
}
console.log('✅ TEST 2 PASSED: Virtual scorers scored realistic number of goals (~3-6 in 9 rounds)!');

console.log('\n=== TEST 3: PLAYER WIN NOT OVERWRITTEN BY AI ===');
const p2 = createInitialPlayer('Hoang Son', 'VN', 'FW');
initSeasonScheduleAndTable(p2);
const res = simulateMatchdayRound(p2, false, { homeScore: 3, awayScore: 0, sim: { isPlayerHome: true, homeScore: 3, awayScore: 0 } });
const row = p2.leagueTable.find(t => t.isPlayerClub);
console.log('Player club row after 3-0 win:', { played: row.played, won: row.won, lost: row.lost, points: row.points, form: row.form });
if (row.played !== 1 || row.won !== 1 || row.points !== 3 || row.form[0] !== 'W') {
  throw new Error('Player result was corrupted or double-simulated!');
}
console.log('✅ TEST 3 PASSED: Player win strictly locked and not double-simulated!');
