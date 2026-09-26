import { createInitialPlayer } from '../js/state.js';
import { 
  initSeasonScheduleAndTable, 
  simulateMatchdayRound, 
  updateGoldenShoeTracker, 
  calculateGoldenShoe,
  updateBallonDorRankings,
  getGoldenShoeRankings,
  getBallonDorPowerRankings,
  isSameClub
} from '../js/engine.js';
import { YOUTH_ACADEMIES } from '../js/data.js';

console.log("=== TEST 1: INITIALIZATION & GOLDEN SHOE (YOUTH ACADEMY) ===");
const player = createInitialPlayer("Hoàng Sơn", "VN", "FW");
player.academy = YOUTH_ACADEMIES.find(a => a.id === "bayern_junior") || YOUTH_ACADEMIES[0];
initSeasonScheduleAndTable(player);

console.log("Initial Golden Shoe tracker length:", player.goldenShoeTracker.length);
console.log("Initial Top 5 Golden Shoe:");
player.goldenShoeTracker.forEach((s, idx) => {
  console.log(` #${idx + 1} ${s.name} (${s.club}): ${s.goals} goals (${s.points} pts) [isPlayer: ${s.isPlayer}]`);
});

// Verify player row
const pShoeRow = player.goldenShoeTracker.find(r => r.isPlayer);
if (!pShoeRow) throw new Error("Player shoe row not found!");
console.log("Player goals:", pShoeRow.goals, "| Player points:", pShoeRow.points);

// Verify superstars exist and have 0 goals and points at round 0
const superstars = ['Erling Haaland', 'Kylian Mbappé', 'Harry Kane', 'Lamine Yamal'];
superstars.forEach(name => {
  const star = player.goldenShoeTracker.find(r => r.name === name);
  if (!star) throw new Error(`Superstar ${name} not found in Golden Shoe tracker!`);
  if (star.goals !== 0 || star.points !== 0) throw new Error(`Superstar ${name} does not start at 0 goals!`);
  console.log(` ✅ ${name}: ${star.goals} goals, ${star.points} pts`);
});

// Verify sort order
for (let i = 0; i < player.goldenShoeTracker.length - 1; i++) {
  if (player.goldenShoeTracker[i].points < player.goldenShoeTracker[i + 1].points) {
    throw new Error(`Golden Shoe list not sorted descending by points at index ${i}`);
  }
}
console.log("✅ Golden Shoe list sorted descending by points correctly!");

console.log("\n=== TEST 2: BALLON D'OR POWER RANKINGS ===");
console.log("Initial Ballon d'Or list length:", player.ballonDorRankings.length);
console.log("Player bdorScore:", player.bdorScore);
console.log("Ballon d'Or Rankings:");
player.ballonDorRankings.forEach((b, idx) => {
  console.log(` #${idx + 1} ${b.name} (${b.club}): ${b.score} pts [isPlayer: ${b.isPlayer}]`);
});

const pBdorRow = player.ballonDorRankings.find(r => r.isPlayer);
if (!pBdorRow) throw new Error("Player Ballon d'Or row not found!");
if (pBdorRow.score !== player.bdorScore) throw new Error(`Player row score ${pBdorRow.score} !== player.bdorScore ${player.bdorScore}`);

// Verify sort order
for (let i = 0; i < player.ballonDorRankings.length - 1; i++) {
  if (player.ballonDorRankings[i].score < player.ballonDorRankings[i + 1].score) {
    throw new Error(`Ballon d'Or list not sorted descending by score at index ${i}`);
  }
}
console.log("✅ Ballon d'Or list sorted descending by score correctly!");

console.log("\n=== TEST 3: SIMULATE MATCHDAY ROUND AND VERIFY UPDATES ===");
// Player scores 3 goals and 1 assist in a match
const curFixture = player.currentSeasonFixtures[0];
const isPlayerHome = curFixture.playerMatch.isPlayerHome;
const interactiveResult = {
  success: true,
  homeScore: isPlayerHome ? 4 : 1,
  awayScore: isPlayerHome ? 1 : 4,
  playerGoals: 3,
  playerAssists: 1,
  playerStats: { goals: 3, assists: 1, cleanSheets: 0, saves: 0, tackles: 1 },
  impact: { rating: 8.8, xG: 1.5, growth: {} }
};

player.avgRating = 8.8;
simulateMatchdayRound(player, false, interactiveResult);

console.log("After Round 1:");
console.log("Player currentSeasonStats goals:", player.currentSeasonStats.goals);
console.log("Player currentSeasonStats assists:", player.currentSeasonStats.assists);
console.log("Player avgRating:", player.avgRating);

const myClubWins = (player.leagueTable || []).find(t => isSameClub(t, player.club) || isSameClub(t, player.academy))?.won || 0;
console.log("Player club league wins:", myClubWins);

// Check expected bdorScore formula:
// const bdorScore = Number(((avgRating * 5) + (totalG * 0.8) + (totalA * 0.5) + (teamWins * 0.5)).toFixed(1));
const expectedBdor = Number(((8.8 * 5) + (3 * 0.8) + (1 * 0.5) + (myClubWins * 0.5)).toFixed(1));
console.log("Calculated player.bdorScore:", player.bdorScore, "| Expected:", expectedBdor);
if (player.bdorScore !== expectedBdor) {
  throw new Error(`bdorScore mismatch: got ${player.bdorScore}, expected ${expectedBdor}`);
}
console.log("✅ bdorScore formula matched exactly!");

// Check Golden Shoe:
// For youth: factor = 1.0; playerGoals = 3; points = 3.0
const updatedShoeRow = player.goldenShoeTracker.find(r => r.isPlayer);
console.log("Updated player Golden Shoe row:", updatedShoeRow);
if (updatedShoeRow.goals !== 3 || updatedShoeRow.points !== 3.0) {
  throw new Error(`Golden shoe player row incorrect: got ${updatedShoeRow.goals} goals, ${updatedShoeRow.points} pts`);
}
console.log("✅ Golden Shoe player row goals & points updated accurately!");

console.log("\n=== TEST 4: PRO LEAGUE FACTOR (FACTOR = 2.0) ===");
const proPlayer = createInitialPlayer("Hoàng Sơn Pro", "VN", "FW");
proPlayer.isPro = true;
proPlayer.tier = 1;
proPlayer.currentClub = { id: 'real_madrid', name: 'Real Madrid' };
proPlayer.currentSeasonStats = { goals: 5, assists: 2, matches: 4 };
proPlayer.avgRating = 8.2;
initSeasonScheduleAndTable(proPlayer);
proPlayer.currentSeasonStats.goals = 5;

updateGoldenShoeTracker(proPlayer);
updateBallonDorRankings(proPlayer);

const proShoeRow = proPlayer.goldenShoeTracker.find(r => r.isPlayer);
console.log("Pro Player Golden Shoe row:", proShoeRow);
// 5 goals * 2.0 factor = 10.0 pts
if (proShoeRow.points !== 10.0) {
  throw new Error(`Pro player factor 2.0 failed: got ${proShoeRow.points} pts, expected 10.0`);
}
console.log("✅ Pro league factor = 2.0 verified successfully!");

console.log("\nALL TESTS PASSED! 🎉");
