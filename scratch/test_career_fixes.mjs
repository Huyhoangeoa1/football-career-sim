import { createInitialPlayer } from '../js/state.js';
import { 
  initSeasonScheduleAndTable, 
  simulateMatchdayRound, 
  isClubMatch, 
  getPlayerActiveClub,
  initLeagueTopScorers
} from '../js/engine.js';
import { REAL_RIVAL_SCORERS, YOUTH_ACADEMIES, YOUTH_LEAGUE_CLUBS } from '../js/data.js';

console.log("=== 1. TEST YOUTH ACADEMY & TOP SCORERS DATA ===");
console.log("Total Youth Academies:", YOUTH_ACADEMIES.length);
console.log("Total Youth League Clubs:", YOUTH_LEAGUE_CLUBS.length);
console.log("Total Youth Scorers in REAL_RIVAL_SCORERS:", REAL_RIVAL_SCORERS.YOUTH_LEAGUE.length);

// Ensure no Premier League players in YOUTH_LEAGUE
const badScorers = REAL_RIVAL_SCORERS.YOUTH_LEAGUE.filter(s => 
  s.name === "Erling Haaland" || s.name === "Bukayo Saka" || s.name === "Cole Palmer" || s.name === "Mohamed Salah" || s.name === "Alexander Isak"
);
console.log("Premier League players in YOUTH_LEAGUE (must be 0):", badScorers.length);
if (badScorers.length > 0) throw new Error("Found EPL players in YOUTH_LEAGUE!");

// Check player initialization
const player = createInitialPlayer("Hoàng Sơn", "VN", "FW");
// Force academy to Bayern Campus for this test
player.academy = YOUTH_ACADEMIES.find(a => a.id === "bayern_junior") || YOUTH_ACADEMIES[0];
initSeasonScheduleAndTable(player);

console.log("\n=== 2. TEST TOP SCORERS INITIALIZATION FOR ACADEMY ===");
console.log("Scorers count in player.leagueTopScorers:", player.leagueTopScorers.length);
const playerInScorers = player.leagueTopScorers.find(s => s.isPlayer);
console.log("Player in scorers list:", playerInScorers.name, "| Club:", playerInScorers.clubName, "| Goals:", playerInScorers.goals);
const seniorInPlayerList = player.leagueTopScorers.filter(s => 
  s.name === "Erling Haaland" || s.name === "Bukayo Saka" || s.name === "Cole Palmer"
);
console.log("Senior players in player.leagueTopScorers (must be 0):", seniorInPlayerList.length);
if (seniorInPlayerList.length > 0) throw new Error("Senior players found in youth top scorers!");

console.log("\nTop 5 Scorers before matches:");
player.leagueTopScorers.slice(0, 5).forEach((s, idx) => {
  console.log(` ${idx + 1}. ${s.name} (${s.clubName || s.clubCode}): ${s.goals} goals [isPlayer: ${s.isPlayer}]`);
});

console.log("\n=== 3. TEST LEAGUE TABLE INITIALIZATION ===");
console.log("Teams in player.leagueTable:", player.leagueTable.length);
const playerTeamInTable = player.leagueTable.find(t => isClubMatch(t, player.academy));
console.log("Player's team found in table:", playerTeamInTable ? playerTeamInTable.clubName : "NOT FOUND!");
if (!playerTeamInTable) throw new Error("Player's club not found in league table!");

console.log("\n=== 4. TEST INTERACTIVE MATCH ARENA (SIMULATE 90-MIN MATCH) ===");
const curFixture = player.currentSeasonFixtures[player.currentFixtureIndex || 0];
const isPlayerHome = curFixture.playerMatch.isPlayerHome;

// Simulate player scoring 2 goals and winning 3-1
const interactiveResult = {
  success: true,
  homeScore: isPlayerHome ? 3 : 1,
  awayScore: isPlayerHome ? 1 : 3,
  playerGoals: 2,
  playerAssists: 1,
  playerStats: {
    goals: 2,
    assists: 1,
    cleanSheets: 0,
    saves: 0,
    tackles: 2
  },
  impact: {
    rating: 8.8,
    xG: 1.4
  }
};

const outcome1 = simulateMatchdayRound(player, false, interactiveResult);

console.log("Match 1 Result:", outcome1.homeScore, "-", outcome1.awayScore);
console.log("Player goals scored in match:", outcome1.playerGoals);
console.log("player.currentSeasonStats.goals:", player.currentSeasonStats.goals);
console.log("player.totalCareerGoals:", player.totalCareerGoals);

if (player.currentSeasonStats.goals !== 2) {
  throw new Error(`Expected currentSeasonStats.goals to be 2, got ${player.currentSeasonStats.goals}`);
}
if (player.totalCareerGoals !== 2) {
  throw new Error(`Expected totalCareerGoals to be 2, got ${player.totalCareerGoals}`);
}

const updatedPlayerTeam = player.leagueTable.find(t => isClubMatch(t, player.academy));
console.log("\nPlayer Team Table Stats after Match 1:");
console.log(` Played: ${updatedPlayerTeam.played} (matches: ${updatedPlayerTeam.matches})`);
console.log(` Won: ${updatedPlayerTeam.won}, Drawn: ${updatedPlayerTeam.drawn}, Lost: ${updatedPlayerTeam.lost}`);
console.log(` GF: ${updatedPlayerTeam.gf}, GA: ${updatedPlayerTeam.ga}, GD: ${updatedPlayerTeam.gd}`);
console.log(` Points: ${updatedPlayerTeam.points}`);
console.log(` Form: ${updatedPlayerTeam.recentForm.join('-')}`);

if (updatedPlayerTeam.played !== 1) throw new Error(`Expected played=1, got ${updatedPlayerTeam.played}`);
if (updatedPlayerTeam.won !== 1 && updatedPlayerTeam.drawn !== 1) throw new Error(`Expected won=1 or drawn=1, got won=${updatedPlayerTeam.won}`);
if (updatedPlayerTeam.points < 1) throw new Error(`Expected points >= 1, got ${updatedPlayerTeam.points}`);

const updatedPlayerInScorers = player.leagueTopScorers.find(s => s.isPlayer);
console.log("\nPlayer in Top Scorers after Match 1:");
console.log(` Name: ${updatedPlayerInScorers.name} | Goals: ${updatedPlayerInScorers.goals} | Rank: ${updatedPlayerInScorers.rank}`);
if (updatedPlayerInScorers.goals !== 2) throw new Error(`Expected player goals in scorers list=2, got ${updatedPlayerInScorers.goals}`);

console.log("\n=== 5. TEST CLUB MATCH HISTORY FILTER LOGIC ===");
const myClub = getPlayerActiveClub(player);
const myClubHistory = player.currentSeasonFixtures.filter(f => {
  const pMatch = f.playerMatch;
  if (!pMatch) return false;
  const hasMyClub = isClubMatch(pMatch.homeClub, myClub) || isClubMatch(pMatch.awayClub, myClub) || pMatch.isPlayerHome !== undefined;
  const isPlayed = Boolean(f.isCompleted || pMatch.isPlayed || pMatch.result);
  return hasMyClub && isPlayed;
});

console.log("My Club History Matches Count:", myClubHistory.length);
if (myClubHistory.length !== 1) throw new Error(`Expected 1 match in myClubHistory, got ${myClubHistory.length}`);
const m = myClubHistory[0];
console.log(` Match: ${m.stageName} • ${m.competitionName}`);
console.log(` ${m.playerMatch.homeClub.name} ${m.playerMatch.result.homeScore} - ${m.playerMatch.result.awayScore} ${m.playerMatch.awayClub.name}`);
console.log(` Contribution: ⚽ ${m.playerMatch.result.playerGoals} Bàn thắng | 👟 ${m.playerMatch.result.playerAssists} Kiến tạo | ⭐ Rating: ${m.playerMatch.result.rating.toFixed(1)}`);

console.log("\n🎉 ALL 3 DATA ARCHITECTURE TESTS PASSED 100%!");
