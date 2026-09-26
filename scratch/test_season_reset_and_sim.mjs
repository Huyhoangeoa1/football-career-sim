import { createInitialPlayer } from '../js/state.js';
import { 
  initSeasonScheduleAndTable, 
  simulateMatchdayRound, 
  initLeagueTopScorers,
  initLeagueTopAssists,
  updateLeagueTopAssists,
  initGoldenShoeTracker,
  advanceGoldenShoeRound,
  updateGoldenShoeTracker,
  initBallonDorRankings,
  advanceBallonDorRound,
  updateBallonDorRankings,
  getGoldenShoeRankings,
  getBallonDorPowerRankings,
  calculateBallonDorScore,
  isSameClub
} from '../js/engine.js';
import { YOUTH_ACADEMIES } from '../js/data.js';

console.log("=================================================================");
console.log("TEST 1: RESET TO 0 AT ROUND 0 / SEASON START (ACADEMY)");
console.log("=================================================================");

const player = createInitialPlayer("Hoàng Sơn", "VN", "FW");
player.academy = YOUTH_ACADEMIES.find(a => a.id === "bayern_junior") || YOUTH_ACADEMIES[0];
initSeasonScheduleAndTable(player);

// 1. Check League Top Scorers
console.log("\nChecking Top Scorers at Round 0:");
player.leagueTopScorers.forEach(s => {
  if (s.goals !== 0) throw new Error(`Top Scorer ${s.name} has non-zero goals: ${s.goals}`);
});
console.log(`✅ All ${player.leagueTopScorers.length} top scorers have exactly 0 goals!`);

// 2. Check League Top Assists
console.log("\nChecking Top Assists at Round 0:");
if (!player.leagueTopAssists || player.leagueTopAssists.length === 0) {
  throw new Error("player.leagueTopAssists is missing or empty!");
}
player.leagueTopAssists.forEach(s => {
  if (s.assists !== 0) throw new Error(`Top Assist ${s.name} has non-zero assists: ${s.assists}`);
});
console.log(`✅ All ${player.leagueTopAssists.length} top playmakers have exactly 0 assists!`);

// 3. Check Golden Shoe Tracker
console.log("\nChecking Golden Shoe Tracker at Round 0:");
if (!player.goldenShoeTracker || player.goldenShoeTracker.length === 0) {
  throw new Error("player.goldenShoeTracker is missing or empty!");
}
player.goldenShoeTracker.forEach(s => {
  console.log(` - ${s.name} (${s.club}): ${s.goals} goals, ${s.points} pts`);
  if (s.goals !== 0 || s.points !== 0) {
    throw new Error(`Golden Shoe candidate ${s.name} has non-zero goals (${s.goals}) or points (${s.points})!`);
  }
});
console.log("✅ All Golden Shoe candidates (including Haaland, Mbappé) start at 0 goals (0.0 pts)!");

// 4. Check Ballon d'Or
console.log("\nChecking Ballon d'Or Rankings at Round 0:");
if (!player.ballonDorRankings || player.ballonDorRankings.length === 0) {
  throw new Error("player.ballonDorRankings is missing or empty!");
}
const pBdor = player.ballonDorRankings.find(r => r.isPlayer);
const expectedInitialScore = Number(((player.avgRating || 7.0) * 5).toFixed(1));
console.log(`Player bdorScore: ${pBdor.score}, expected Base Rating * 5 = ${expectedInitialScore}`);
if (pBdor.score !== expectedInitialScore) {
  throw new Error(`Player bdorScore mismatch: got ${pBdor.score}, expected ${expectedInitialScore}`);
}
player.ballonDorRankings.forEach(s => {
  console.log(` - #${s.rank} ${s.name}: ${s.score} pts (isPlayer: ${s.isPlayer})`);
  if (s.score <= 0) throw new Error(`Ballon d'Or candidate ${s.name} has score <= 0`);
});
console.log("✅ Ballon d'Or Power Rankings properly initialized based on Base Rating * 5!");

console.log("\n=================================================================");
console.log("TEST 2: DYNAMIC UPDATES AFTER MATCHDAY ROUND");
console.log("=================================================================");

// Player scores 2 goals and 1 assist in match 1
const curFixture = player.currentSeasonFixtures[0];
const isPlayerHome = curFixture.playerMatch.isPlayerHome;
const interactiveResult = {
  success: true,
  homeScore: isPlayerHome ? 3 : 0,
  awayScore: isPlayerHome ? 0 : 3,
  playerGoals: 2,
  playerAssists: 1,
  playerStats: { goals: 2, assists: 1, cleanSheets: 0, saves: 0, tackles: 2 },
  impact: { rating: 8.5, xG: 1.2, growth: {} }
};

player.avgRating = 8.5;
simulateMatchdayRound(player, false, interactiveResult);

console.log("After Round 1:");
console.log("Player Season Goals:", player.currentSeasonStats.goals);
console.log("Player Season Assists:", player.currentSeasonStats.assists);

// Verify Top Scorers: Player has 2 goals
const pScorer = player.leagueTopScorers.find(s => s.isPlayer);
if (pScorer.goals !== 2) throw new Error(`Player top scorer goals = ${pScorer.goals}, expected 2`);
console.log("✅ Top Scorers updated: player has 2 goals");

// Verify Top Assists: Player has 1 assist, AI rivals have realistic assists
const pAssist = player.leagueTopAssists.find(s => s.isPlayer);
if (pAssist.assists !== 1) throw new Error(`Player top assists = ${pAssist.assists}, expected 1`);
console.log("✅ Top Assists updated: player has 1 assist");
console.log("Top 5 Assists list:");
player.leagueTopAssists.slice(0, 5).forEach(a => console.log(` #${a.rank} ${a.name}: ${a.assists} assists`));

// Verify Golden Shoe Tracker:
// Academy factor = 1.0. Goals = 2, Points = 2.0
const pShoe = player.goldenShoeTracker.find(s => s.isPlayer);
console.log("Golden Shoe Player Row:", pShoe);
if (pShoe.goals !== 2 || pShoe.points !== 2.0) {
  throw new Error(`Golden Shoe player row mismatch: got ${pShoe.goals} goals, ${pShoe.points} pts`);
}
console.log("Golden Shoe Top 5:");
player.goldenShoeTracker.slice(0, 5).forEach(s => {
  console.log(` #${s.rank} ${s.name} (${s.club}): ${s.goals} goals, ${s.points} pts`);
  if (!s.isPlayer && s.goals > 1) {
    throw new Error(`AI Star ${s.name} increased by more than 1 goal in a single round! (${s.goals} goals)`);
  }
});
console.log("✅ Golden Shoe dynamically updated with 0-1 goals for European stars!");

// Verify Ballon d'Or:
// Formula: score = ((player.avgRating || 7.0) * 5) + (goals * 0.8) + (assists * 0.5) + (teamWins * 0.5)
const teamWins = (player.leagueTable || []).find(t => isSameClub(t, player.club) || isSameClub(t, player.academy))?.won || 0;
const expectedScore = calculateBallonDorScore({
  line: 'FW',
  avgRating: 8.5,
  goals: 2,
  assists: 1,
  teamWins: teamWins,
  trophies: [],
  fame: player.fame || 0
});
const pBdorAfter = player.ballonDorRankings.find(r => r.isPlayer);
console.log(`Ballon d'Or player score: ${pBdorAfter.score}, expected: ${expectedScore} (Wins: ${teamWins})`);
if (pBdorAfter.score !== expectedScore) {
  throw new Error(`Ballon d'Or score mismatch: got ${pBdorAfter.score}, expected ${expectedScore}`);
}
console.log("Ballon d'Or Top 5:");
player.ballonDorRankings.slice(0, 5).forEach(b => {
  console.log(` #${b.rank} ${b.name}: ${b.score} pts`);
});
console.log("✅ Ballon d'Or Power Score formula verified accurately!");

console.log("\n=================================================================");
console.log("TEST 3: MULTIPLE ROUNDS SIMULATION (5 ROUNDS)");
console.log("=================================================================");

for (let r = 2; r <= 5; r++) {
  const fix = player.currentSeasonFixtures[player.currentFixtureIndex];
  const isHome = fix.playerMatch.isPlayerHome;
  const res = {
    success: true,
    homeScore: isHome ? 2 : 1,
    awayScore: isHome ? 1 : 2,
    playerGoals: 1,
    playerAssists: 1,
    playerStats: { goals: 1, assists: 1, cleanSheets: 0, saves: 0, tackles: 1 },
    impact: { rating: 8.0, xG: 0.9, growth: {} }
  };
  simulateMatchdayRound(player, false, res);
}

console.log(`After Round 5:`);
console.log(`Player Goals: ${player.currentSeasonStats.goals}, Assists: ${player.currentSeasonStats.assists}`);
console.log(`Golden Shoe Leader: #${player.goldenShoeTracker[0].rank} ${player.goldenShoeTracker[0].name} - ${player.goldenShoeTracker[0].goals} goals (${player.goldenShoeTracker[0].points} pts)`);
console.log(`Ballon d'Or Leader: #${player.ballonDorRankings[0].rank} ${player.ballonDorRankings[0].name} - ${player.ballonDorRankings[0].score} pts`);

// Ensure sorting order
for (let i = 0; i < player.goldenShoeTracker.length - 1; i++) {
  if (player.goldenShoeTracker[i].points < player.goldenShoeTracker[i+1].points) {
    throw new Error(`Golden Shoe tracker not sorted descending at index ${i}`);
  }
}
for (let i = 0; i < player.ballonDorRankings.length - 1; i++) {
  if (player.ballonDorRankings[i].score < player.ballonDorRankings[i+1].score) {
    throw new Error(`Ballon d'Or rankings not sorted descending at index ${i}`);
  }
}

console.log("\nALL VERIFICATIONS PASSED SUCCESSFULLY! 🚀");
