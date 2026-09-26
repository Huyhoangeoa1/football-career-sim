import fs from 'fs';

const content = fs.readFileSync('js/engine.js', 'utf8');
const lines = content.split('\n');

const simulateMatchdayCode = lines.slice(4264, 5006).join('\n');

const newEngineHeader = `/* =========================================================================
   FOOTBALL CAREER SIMULATOR — SIMULATION & CALCULATION ENGINE (CENTRAL HUB)
   Re-export toàn bộ module con & Điều phối vòng lặp Matchday Round
   ========================================================================= */

// 1. Dữ liệu hệ thống
export {
  LIFESTYLE_CATALOG,
  ALL_CLUBS,
  SPONSORSHIPS_DATA,
  AGENTS_DATA,
  LEAGUE_TEAMS_MAP,
  REAL_RIVAL_SCORERS,
  YOUTH_RIVAL_SCORERS,
  YOUTH_ACADEMIES,
  YOUTH_LEAGUE_CLUBS,
  UEFA_YOUTH_LEAGUE_CLUBS,
  UEFA_YOUTH_LEAGUE_CONFIG,
  LEAGUES_DATA,
  NATIONAL_TEAMS_DATA,
  POSITION_CONFIG
} from './data.js';

// 2. Player Engine
export {
  TACTIC_CONFIG,
  applyTacticalModifiers,
  INJURY_TYPES,
  rollInjuryChance,
  getOverallPower,
  calculateNetWorth,
  clampStats,
  addTrophy,
  calculateDynamicGrowth,
  calculatePostMatchImpact,
  calculatePlayerGoatScore,
  updateManagerTrustAndRole
} from './playerEngine.js';

// 3. Media & Chronicle Engine
export {
  generateRichMatchNarrative,
  generateMediaInteractionNarrative,
  generateSkillBreakthroughNarrative,
  getRandomAcademyLifeSnippet,
  logCareerEvent,
  addCareerLog,
  recordChronicleMilestone,
  updateCompetitionTier
} from './mediaEngine.js';

// 4. Transfer Engine
export {
  calculateTransfermarktValue,
  getTransferWindowStatus,
  generateTransferOffers,
  generateLoanOffers,
  evaluateContractNegotiation
} from './transferEngine.js';

// 5. Cup Engine
export {
  isSameClub,
  isClubMatch,
  simulateAIFixture,
  getPlayerActiveClub,
  initYouthLeagueGroups,
  updateGroupRow,
  sortGroupTable,
  processYouthLeagueGroupMatchday,
  initTournamentBrackets,
  advanceTournamentBracket,
  initContinentalGroupTable,
  updateContinentalGroupTable,
  initCupCompetition,
  resetAllCupCompetitions,
  advanceCupStage,
  recordCupMatchResult,
  initUYLGroupStage,
  simulateUYLGroupStageRound,
  determineUYLQualifiedTeams,
  checkDomesticCupSchedule,
  simulateDomesticCupRound,
  syncCupResultsToDOM,
  renderCupDrawUI,
  formatCupRoundName,
  generateTournamentBracket
} from './cupEngine.js';

// 6. Match Engine
export {
  getPlayerLine,
  XG_VALUES,
  RATING_DELTAS,
  applyLiveRatingDelta,
  initMatchTimeline,
  generateMatchEvents,
  createDeepMatchSimulation,
  createDecisionMoment,
  rollArenaEvent,
  simulateTickProgress,
  runMatchArena
} from './matchEngine.js';

// 7. Season & League Engine
export {
  getPhase2MatchOpponent,
  updateRivalStats,
  evaluateBallonDor,
  evaluateAnnualAwards,
  simulateSeasonRound,
  simulateAcademyRound,
  checkNationalTeamCallUp,
  generateSeasonFixtures,
  createNationalTeamFixture,
  initLeagueTable,
  updateLeagueTable,
  initLeagueTopScorers,
  updateLeagueTopScorers,
  YOUTH_RIVAL_ASSIST_POOL,
  initLeagueTopAssists,
  updateLeagueTopAssists,
  SUPERSTAR_SHOE_CANDIDATES,
  initGoldenShoeTracker,
  advanceGoldenShoeRound,
  updateGoldenShoeTracker,
  calculateGoldenShoe,
  SUPERSTAR_BDOR_CANDIDATES,
  initBallonDorRankings,
  advanceBallonDorRound,
  updateBallonDorRankings,
  getGoldenShoeRankings,
  getBallonDorPowerRankings,
  syncIndividualTrackersDOM,
  initSeasonScheduleAndTable,
  checkSummerTournamentEligibility,
  initSummerTournament,
  advanceSummerTournamentMatch
} from './seasonEngine.js';

/* =========================================================================
   LOCAL IMPORTS FOR MATCHDAY ORCHESTRATION
   ========================================================================= */
import {
  rollInjuryChance,
  calculatePostMatchImpact,
  calculateDynamicGrowth,
  updateManagerTrustAndRole
} from './playerEngine.js';

import {
  generateRichMatchNarrative,
  logCareerEvent,
  recordChronicleMilestone
} from './mediaEngine.js';

import {
  isSameClub,
  simulateAIFixture
} from './cupEngine.js';

import {
  updateLeagueTable,
  updateLeagueTopScorers,
  updateLeagueTopAssists,
  advanceGoldenShoeRound,
  advanceBallonDorRound,
  syncIndividualTrackersDOM,
  initSeasonScheduleAndTable,
  simulateSeasonRound,
  simulateAcademyRound,
  checkSummerTournamentEligibility,
  initSummerTournament
} from './seasonEngine.js';
`;

const finalNewEngine = `${newEngineHeader}\n${simulateMatchdayCode}\n`;

fs.writeFileSync('js/engine.js.new', finalNewEngine, 'utf8');
fs.copyFileSync('js/engine.js.new', 'scratch/temp-engine.js');
console.log('Successfully wrote js/engine.js.new with lines:', finalNewEngine.split('\n').length);
