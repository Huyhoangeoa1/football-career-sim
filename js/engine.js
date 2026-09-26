/* =========================================================================
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
  calculateMatchPerformanceBonus,
  FAME_EARNINGS_MULTIPLIERS,
  calculatePlayerGoatScore,
  updateManagerTrustAndRole,
  recoverStaminaBetweenMatches
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
  updateCompetitionTier,
  addMediaReaction,
  ensurePlayerMediaFeed,
  triggerMatchRatingMedia,
  triggerMvpAwardMedia,
  triggerTrophyWinMedia,
  triggerBallonDorMedia
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
  initCupIndividualTrackers,
  recordCupMatchContributions
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
  simulateTickProgress
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
  calculateBallonDorScore,
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
  TACTIC_CONFIG,
  rollInjuryChance,
  calculatePostMatchImpact,
  calculateMatchPerformanceBonus,
  FAME_EARNINGS_MULTIPLIERS,
  calculateDynamicGrowth,
  updateManagerTrustAndRole,
  addTrophy,
  recoverStaminaBetweenMatches
} from './playerEngine.js';

import {
  generateRichMatchNarrative,
  logCareerEvent,
  recordChronicleMilestone,
  getRandomAcademyLifeSnippet,
  triggerMatchRatingMedia
} from './mediaEngine.js';

import {
  getPlayerLine
} from './matchEngine.js';

import {
  isSameClub,
  isClubMatch,
  getPlayerActiveClub,
  simulateAIFixture,
  processYouthLeagueGroupMatchday,
  advanceTournamentBracket,
  updateContinentalGroupTable,
  initCupIndividualTrackers,
  recordCupMatchContributions
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

/**
 * Khởi tạo sự nghiệp mới (Init Career / Start New Game)
 * Bắt buộc xóa trắng và tạo mới hoàn toàn tournamentData, cupBracket, groupStageData.
 */
export function initCareer(player) {
  if (!player) return null;
  initSeasonScheduleAndTable(player);
  initCupIndividualTrackers(player, 'domestic');
  initCupIndividualTrackers(player, 'continental');
  return player;
}

export function startNewGame(player) {
  return initCareer(player);
}

/**
 * Thực hiện mô phỏng một vòng đấu (Matchday Simulation Loop)
 * @param {object} player 
 * @param {boolean} isQuickSim 
 * @param {object|null} interactiveResult 
 * @returns {object} kết quả chi tiết của vòng đấu
 */
export function simulateMatchdayRound(player, isQuickSim = false, interactiveResult = null) {
  if (!player.currentSeasonFixtures || player.currentSeasonFixtures.length === 0) {
    initSeasonScheduleAndTable(player);
  }

  // Đảm bảo trỏ đến fixture hợp lệ chưa hoàn thành
  let curIdx = player.currentFixtureIndex || 0;
  while (
    curIdx < player.currentSeasonFixtures.length &&
    (player.currentSeasonFixtures[curIdx].isCompleted || 
     player.currentSeasonFixtures[curIdx].completed ||
     player.currentSeasonFixtures[curIdx].isEliminated ||
     player.currentSeasonFixtures[curIdx].playerMatch?.isPlayed ||
     player.currentSeasonFixtures[curIdx].playerMatch?.completed)
  ) {
    curIdx++;
  }
  player.currentFixtureIndex = curIdx;
  player.fixtureIndex = curIdx;

  if (curIdx >= player.currentSeasonFixtures.length) {
    return { isSeasonFinished: true };
  }

  // Đảm bảo không bao giờ để thể lực bắt đầu trận bị kẹt ở mức kiệt sức (<= 15%)
  if ((player.stam !== undefined && player.stam <= 15) || (player.stamina !== undefined && player.stamina <= 15)) {
    recoverStaminaBetweenMatches(player);
  }

  const roundData = player.currentSeasonFixtures[curIdx];
  const pMatch = roundData.playerMatch;
  const match = pMatch || {};
  if (match) {
    if (!match.homeTeam && match.homeClub) match.homeTeam = match.homeClub;
    if (!match.awayTeam && match.awayClub) match.awayTeam = match.awayClub;
  }
  if (!player.club) {
    player.club = player.currentClub || player.academy || getPlayerActiveClub(player) || match.homeTeam;
  }

  // 1. PHÂN BIỆT TIẾN TRÌNH TRẬN ĐẤU (LEAGUE VS CUP VS ĐTQG)
  const isNationalMatch = Boolean(
    roundData.type === 'NATIONAL_TEAM' ||
    roundData.isNationalTeam ||
    roundData.competitionType === 'NATIONAL_TEAM' ||
    match.type === 'NATIONAL_TEAM' ||
    match.isNationalTeam ||
    match.competitionType === 'NATIONAL_TEAM'
  );

  const isContinentalCup = !isNationalMatch && Boolean(
    match.competitionType === 'UCL' ||
    match.competitionType === 'CONTINENTAL' ||
    roundData.competitionType === 'UCL' ||
    roundData.competitionType === 'CONTINENTAL' ||
    (roundData.stageName && (roundData.stageName.includes('Youth League') || roundData.stageName.includes('C1 Trẻ') || roundData.stageName.includes('Châu Âu') || roundData.stageName.includes('Champions League'))) ||
    (match.stage && (match.stage.includes('Youth League') || match.stage.includes('C1 Trẻ') || match.stage.includes('Châu Âu') || match.stage.includes('Champions League'))) ||
    (roundData.competitionName && (roundData.competitionName.includes('Youth League') || roundData.competitionName.includes('Champions League') || roundData.competitionName.includes('C1')))
  );

  const isDomesticCup = !isNationalMatch && !isContinentalCup && Boolean(
    match.isCup ||
    match.competitionType === 'cup' ||
    match.competitionType === 'DOMESTIC_CUP' ||
    roundData.isCup ||
    roundData.competitionType === 'cup' ||
    roundData.competitionType === 'DOMESTIC_CUP' ||
    (roundData.stageName && (roundData.stageName.includes('Cúp') || roundData.stageName.includes('Cúp Trẻ') || roundData.stageName.includes('Cúp Quốc Gia'))) ||
    (match.stage && (match.stage.includes('Cúp') || match.stage.includes('Cúp Trẻ') || match.stage.includes('Cúp Quốc Gia'))) ||
    (roundData.competitionType !== 'LEAGUE' && (
      (roundData.stageName && (roundData.stageName.includes('Kết') || roundData.stageName.includes('Vòng 1/8') || roundData.stageName.includes('Vòng 1/16') || roundData.stageName.includes('Vòng 1/32'))) ||
      (roundData.stage && roundData.stage.includes('Kết'))
    ))
  );

  const isCupMatch = isContinentalCup || isDomesticCup;
  const cupCompType = isContinentalCup ? 'continental' : (isDomesticCup ? 'domestic' : null);
  const isLeagueMatch = !isNationalMatch && !isCupMatch && roundData.competitionType === 'LEAGUE';

  // 1. ÁP DỤNG TIỀN TRẬN ĐẤU (PRE-MATCH PREPARATION)
  const prepUsed = player.preMatchPrep || 'NONE';
  let prepMsg = "";
  if (prepUsed === 'REST') {
    player.stam = Math.min(100, (player.stam !== undefined ? player.stam : 70) + 28);
    player.stamina = player.stam;
    prepMsg = "🛏️ Dưỡng sức hoàn toàn (+28% Thể lực).";
  } else if (prepUsed === 'VIDEO_ANALYSIS') {
    prepMsg = "📹 Soi băng hình chiến thuật (+0.3 Match Rating, tăng độ nhạy bén).";
  } else if (prepUsed === 'LIGHT_TRAIN') {
    player.form = Math.min(100, (player.form !== undefined ? player.form : 60) + 10);
    player.stam = Math.max(15, (player.stam !== undefined ? player.stam : 70) - 8);
    player.stamina = player.stam;
    prepMsg = "🏃 Khởi động làm nóng (+10 Phong độ, -8% Thể lực).";
  } else if (prepUsed === 'INTENSE_DRILL') {
    player.form = Math.min(100, (player.form !== undefined ? player.form : 60) + 20);
    player.morale = Math.min(100, (player.morale !== undefined ? player.morale : 70) + 15);
    player.stam = Math.max(15, (player.stam !== undefined ? player.stam : 70) - 18);
    player.stamina = player.stam;
    prepMsg = "🎯 Tập chuyên sâu cường độ cao (+20 Phong độ, +15 Tinh thần, -18% Thể lực).";
  }
  player.preMatchPrep = 'NONE';

  // 2. MÔ PHỎNG TRẬN ĐẤU CỦA NGƯỜI CHƠI
  const matchResult = interactiveResult || {};
  const sim = matchResult.sim || {};

  let homeScore = 0;
  let awayScore = 0;
  let pGoals = 0, pAssists = 0, pCS = 0, pSaves = 0, pTackles = 0;
  let matchRating = 6.8;
  let matchXG = 0.0;
  let matchDesc = "";

  if (interactiveResult) {
    // Kết quả trả về từ Match Center Arena tương tác 90 phút
    homeScore = Number(matchResult.homeScore ?? sim.homeScore ?? 0);
    awayScore = Number(matchResult.awayScore ?? sim.awayScore ?? 0);

    const pStats = interactiveResult.playerStats || sim.playerStats || {};
    pGoals = Number(pStats.goals ?? matchResult.playerGoals ?? matchResult.goals ?? 0);
    pAssists = Number(pStats.assists ?? matchResult.playerAssists ?? matchResult.assists ?? 0);
    pSaves = Number(pStats.saves ?? matchResult.playerSaves ?? matchResult.saves ?? 0);
    pTackles = Number(pStats.tackles ?? matchResult.playerTackles ?? matchResult.tackles ?? 0);
    matchRating = Number(interactiveResult.impact?.rating ?? matchResult.rating ?? 7.2);
    if (prepUsed === 'VIDEO_ANALYSIS') {
      matchRating = Number(Math.min(10.0, matchRating + 0.3).toFixed(1));
    }
    matchXG = Number(interactiveResult.impact?.xG ?? matchResult.xG ?? 0.45);
    matchDesc = `Trận cầu kết thúc với tỷ số ${homeScore} - ${awayScore}. Live Rating: ${matchRating.toFixed(1)}.`;
  } else {
    // Mô phỏng nhanh (Quick Sim)
    const simScore = simulateAIFixture(match.homeTeam || match.homeClub, match.awayTeam || match.awayClub);
    homeScore = Number(simScore.homeScore ?? 0);
    awayScore = Number(simScore.awayScore ?? 0);
  }

  // Lấy chính xác tỷ số cuối cùng của trận đấu:
  const finalHome = Number(matchResult.homeScore ?? sim.homeScore ?? homeScore ?? 0);
  const finalAway = Number(matchResult.awayScore ?? sim.awayScore ?? awayScore ?? 0);

  // Xác định điểm đội mình và đội bạn:
  const isHome = Boolean(sim?.isPlayerHome ?? matchResult?.isPlayerHome ?? (match?.isPlayerHome !== undefined ? match.isPlayerHome : true));
  const myGoals = isHome ? finalHome : finalAway;
  const oppGoals = isHome ? finalAway : finalHome;

  // Phân định kết quả tuyệt đối bằng số:
  let outcome = 'D';
  if (myGoals > oppGoals) outcome = 'W';
  else if (myGoals < oppGoals) outcome = 'L';
  else outcome = 'D';

  // Trận Cúp loại trực tiếp (Tứ Kết, Bán Kết, Chung Kết, Knockout): Bắt buộc phân định thắng thua
  const isKnockoutMatch = isCupMatch && (!roundData.stageName || !roundData.stageName.includes("Vòng Bảng"));
  let isPenalties = false;
  if (isKnockoutMatch && outcome === 'D') {
    isPenalties = true;
    const winProb = Math.min(0.85, Math.max(0.15, 0.5 + ((player.morale || 70) - 70) * 0.005 + ((player.form || 60) - 60) * 0.005));
    outcome = (Math.random() < winProb) ? 'W' : 'L';
  }

  let playerTeamGoals = myGoals;
  let oppTeamGoals = oppGoals;
  let isPlayerWin = outcome === 'W';
  let isDraw = outcome === 'D';

  if (interactiveResult) {
    const pStats = interactiveResult.playerStats || sim.playerStats || {};
    pCS = pStats.cleanSheets !== undefined ? pStats.cleanSheets : (interactiveResult.cleanSheets !== undefined ? interactiveResult.cleanSheets : (oppGoals === 0 ? 1 : 0));
  } else {
    const ovr = Math.round((player.attr1 + player.attr2 + player.attr3 + player.attr4) / 4);
    const formBonus = ((player.form || 60) - 60) * 0.01;
    const tactic = player.tactic || 'BALANCED';
    const tacticCfg = TACTIC_CONFIG[tactic] || TACTIC_CONFIG.BALANCED;
    const tacticGoalMult = tacticCfg.goalMult || 1.0;
    const tacticAssistMult = tacticCfg.assistMult || 1.0;
    const tacticTackleMult = tacticCfg.tackleMult || 1.0;
    const tacticCleanSheetMult = tacticCfg.cleanSheetMult || 1.0;

    const isYouth = Boolean(player.isAcademyStage);
    const youthBonus = isYouth ? 0.28 : 0;

    const pLine = getPlayerLine(player);

    if (pLine === "FW") {
      if (playerTeamGoals > 0) {
        const goalProb = Math.min(0.85, (ovr / 100 * 0.55 + formBonus + youthBonus) * tacticGoalMult);
        pGoals = Math.min(playerTeamGoals, Math.random() < goalProb ? (Math.random() < 0.40 && playerTeamGoals >= 2 ? 2 : 1) : 0);
        const assistProb = Math.min(0.70, (0.32 + youthBonus * 0.4) * tacticAssistMult);
        pAssists = Math.min(playerTeamGoals - pGoals, Math.random() < assistProb ? 1 : 0);
      }
      matchXG = Number((pGoals * 0.65 + (Math.random() * 0.4)).toFixed(2));
      const baseQuickRating = 6.4 + Math.random() * 0.4;
      matchRating = Number((baseQuickRating + pGoals * 1.3 + pAssists * 0.7 + (isPlayerWin ? 0.4 : 0)).toFixed(1));
    } else if (pLine === "MF") {
      if (playerTeamGoals > 0) {
        pGoals = Math.random() < (0.28 + youthBonus * 0.3) * tacticGoalMult ? 1 : 0;
        pAssists = Math.min(playerTeamGoals - pGoals, Math.random() < (0.45 + youthBonus * 0.3) * tacticAssistMult ? 1 : 0);
      }
      pTackles = Math.floor((Math.floor(Math.random() * 4) + 2) * tacticTackleMult);
      matchXG = Number((pGoals * 0.5 + 0.2).toFixed(2));
      const baseQuickRating = 6.4 + Math.random() * 0.4;
      matchRating = Number((baseQuickRating + pGoals * 1.1 + pAssists * 0.9 + pTackles * 0.2 + (isPlayerWin ? 0.4 : 0)).toFixed(1));
    } else if (pLine === "DF") {
      pCS = (oppTeamGoals === 0 || (oppTeamGoals === 1 && Math.random() < (tacticCleanSheetMult - 1.0) * 0.30)) ? 1 : 0;
      pTackles = Math.floor((Math.floor(Math.random() * 5) + 3) * tacticTackleMult);
      pGoals = Math.random() < 0.08 ? 1 : 0;
      const baseQuickRating = 6.3 + Math.random() * 0.4;
      matchRating = Number((baseQuickRating + pCS * 1.2 + pTackles * 0.25 - oppTeamGoals * 0.3).toFixed(1));
    } else {
      // GK
      pCS = (oppTeamGoals === 0 || (oppTeamGoals === 1 && Math.random() < (tacticCleanSheetMult - 1.0) * 0.30)) ? 1 : 0;
      pSaves = Math.floor(Math.random() * 6) + 3;
      const baseQuickRating = 6.3 + Math.random() * 0.4;
      matchRating = Number((baseQuickRating + pCS * 1.3 + pSaves * 0.2 - oppTeamGoals * 0.4).toFixed(1));
    }

    matchRating = Math.max(4.5, Math.min(10.0, matchRating));
    if (prepUsed === 'VIDEO_ANALYSIS') {
      matchRating = Number(Math.min(10.0, matchRating + 0.3).toFixed(1));
    }
  }

  // TẠO VĂN XUÔI NHẬT KÝ SỰ NGHIỆP PHONG PHÚ & CHỐNG LẶP NGUYÊN VĂN (RICH IMMERSIVE NARRATIVE)
  const richMatchNarrative = generateRichMatchNarrative(player, {
    homeScore: finalHome,
    awayScore: finalAway,
    myGoals,
    oppGoals,
    outcome,
    isPlayerWin,
    isDraw,
    isKnockoutMatch,
    isPenalties,
    matchRating,
    playerGoals: pGoals,
    playerAssists: pAssists,
    playerCleanSheets: pCS,
    playerSaves: pSaves,
    playerTackles: pTackles,
    roundData,
    pMatch
  });

  matchDesc = richMatchNarrative.body;

  // Bổ sung xen kẽ các mẩu nhật ký sinh hoạt nhỏ ngẫu nhiên theo tuần/tháng (~32% cơ hội)
  let academyLifeSnippet = null;
  if (Math.random() < 0.32) {
    academyLifeSnippet = getRandomAcademyLifeSnippet(player);
  }

  // Tiêu hao thể lực theo chiến thuật (chỉ trừ thêm khi quick sim; trận interactive đã trừ theo inMatchStamina)
  if (!interactiveResult) {
    const tactic = player.tactic || 'BALANCED';
    const tacticCfg = TACTIC_CONFIG[tactic] || TACTIC_CONFIG.BALANCED;
    const baseStamCost = 12;
    const stamCost = Math.round(baseStamCost * (tacticCfg.stamCostMult || 1.0));
    player.stam = Math.max(15, (player.stam || 80) - stamCost);
    player.stamina = player.stam;
  }

  // 2. ĐÁNH DẤU VÀ KHÓA KẾT QUẢ TRẬN CỦA NGƯỜI CHƠI
  pMatch.isPlayed = true;
  pMatch.completed = true;
  pMatch.homeScore = finalHome;
  pMatch.awayScore = finalAway;
  pMatch.result = {
    homeScore: finalHome,
    awayScore: finalAway,
    scoreStr: `${finalHome} - ${finalAway}`,
    playerGoals: pGoals,
    playerAssists: pAssists,
    playerCleanSheets: pCS,
    playerSaves: pSaves,
    playerTackles: pTackles,
    rating: matchRating,
    xG: matchXG,
    isPenalties
  };

  roundData.isPlayed = true;
  roundData.completed = true;
  roundData.homeScore = finalHome;
  roundData.awayScore = finalAway;
  roundData.isCompleted = true;

  // 3. MÔ PHỎNG NỀN TẢNG (BACKGROUND SIMULATION CHO CÁC CẶP ĐẤU MÁY AI vs AI)
  // CHẶN TUYỆT ĐỐI KHÔNG MÔ PHỎNG LẠI TRẬN CỦA NGƯỜI CHƠI
  const roundScorerEvents = [];
  const userClub = player.club || player.currentClub || player.academy;
  if (roundData.aiMatches && Array.isArray(roundData.aiMatches)) {
    roundData.aiMatches.forEach(m => {
      const homeTeam = m.homeTeam || m.homeClub;
      const awayTeam = m.awayTeam || m.awayClub;

      // 1. Chặn mô phỏng trùng lặp trận của người chơi:
      const isPlayerMatch = Boolean(
        m.isPlayerMatch ||
        m.isPlayed ||
        (userClub && (isSameClub(homeTeam, userClub) || isSameClub(awayTeam, userClub))) ||
        (player.club && (isSameClub(homeTeam, player.club) || isSameClub(awayTeam, player.club))) ||
        (player.academy && (isSameClub(homeTeam, player.academy) || isSameClub(awayTeam, player.academy))) ||
        (player.currentClub && (isSameClub(homeTeam, player.currentClub) || isSameClub(awayTeam, player.currentClub)))
      );

      // Nếu trận này ĐÃ ĐƯỢC ĐÁ bởi người chơi hoặc chứa CLB người chơi:
      // BỎ QUA NGAY (return), TUYỆT ĐỐI KHÔNG random lại tỷ số của trận này nữa.
      if (isPlayerMatch) {
        m.isPlayed = true;
        m.completed = true;
        m.homeScore = finalHome;
        m.awayScore = finalAway;
        return;
      }

      // Chỉ mô phỏng ngẫu nhiên kết quả cho các cặp đấu giữa các máy (AI vs AI)
      const res = simulateAIFixture(homeTeam, awayTeam);
      m.isPlayed = true;
      m.completed = true;
      m.homeScore = res.homeScore;
      m.awayScore = res.awayScore;
      // Cập nhật BXH cho các trận đấu giải VĐQG (TUYỆT ĐỐI KHÔNG CỘNG NẾU LÀ CÚP)
      if (isLeagueMatch && player.leagueTable) {
        updateLeagueTable(player.leagueTable, homeTeam, awayTeam, res.homeScore, res.awayScore);
      }
      if (res.homeScore > 0) roundScorerEvents.push({ club: homeTeam, goals: res.homeScore });
      if (res.awayScore > 0) roundScorerEvents.push({ club: awayTeam, goals: res.awayScore });
    });
  }

  // Cập nhật BXH cho trận đấu của người chơi nếu là giải VĐQG (TUYỆT ĐỐI KHÔNG cộng điểm vào player.leagueTable nếu là trận Cúp)
  if (isLeagueMatch && player.leagueTable) {
    if (!player.club) {
      player.club = player.currentClub || player.academy || (isHome ? (match.homeTeam || match.homeClub) : (match.awayTeam || match.awayClub));
    }
    const playerClubRow = (player.leagueTable || []).find(t => t.isPlayerClub || isSameClub(t, player.club) || isSameClub(t, player.academy));
    if (playerClubRow) {
      playerClubRow.played = (playerClubRow.played || playerClubRow.matches || 0) + 1;
      playerClubRow.gf = (playerClubRow.gf || 0) + myGoals;
      playerClubRow.ga = (playerClubRow.ga || 0) + oppGoals;
      playerClubRow.gd = playerClubRow.gf - playerClubRow.ga;
      if (outcome === 'W') {
        playerClubRow.won = (playerClubRow.won || 0) + 1;
        playerClubRow.points = (playerClubRow.points || 0) + 3;
        playerClubRow.form = ['W', ...(playerClubRow.form || playerClubRow.recentForm || []).slice(0, 4)];
      } else if (outcome === 'D') {
        playerClubRow.drawn = (playerClubRow.drawn || 0) + 1;
        playerClubRow.points = (playerClubRow.points || 0) + 1;
        playerClubRow.form = ['D', ...(playerClubRow.form || playerClubRow.recentForm || []).slice(0, 4)];
      } else {
        playerClubRow.lost = (playerClubRow.lost || 0) + 1;
        playerClubRow.form = ['L', ...(playerClubRow.form || playerClubRow.recentForm || []).slice(0, 4)];
      }
      playerClubRow.recentForm = playerClubRow.form;
      playerClubRow.matches = playerClubRow.played;
    }

    const oppClub = match.opponent || (isHome ? (match.awayTeam || match.awayClub) : (match.homeTeam || match.homeClub));
    const oppClubRow = (player.leagueTable || []).find(t => t !== playerClubRow && !t.isPlayerClub && (isSameClub(t, oppClub) || isClubMatch(t, oppClub)));
    if (oppClubRow) {
      oppClubRow.played = (oppClubRow.played || oppClubRow.matches || 0) + 1;
      oppClubRow.gf = (oppClubRow.gf || 0) + oppGoals;
      oppClubRow.ga = (oppClubRow.ga || 0) + myGoals;
      oppClubRow.gd = oppClubRow.gf - oppClubRow.ga;
      if (outcome === 'L') {
        oppClubRow.won = (oppClubRow.won || 0) + 1;
        oppClubRow.points = (oppClubRow.points || 0) + 3;
        oppClubRow.form = ['W', ...(oppClubRow.form || oppClubRow.recentForm || []).slice(0, 4)];
      } else if (outcome === 'D') {
        oppClubRow.drawn = (oppClubRow.drawn || 0) + 1;
        oppClubRow.points = (oppClubRow.points || 0) + 1;
        oppClubRow.form = ['D', ...(oppClubRow.form || oppClubRow.recentForm || []).slice(0, 4)];
      } else {
        oppClubRow.lost = (oppClubRow.lost || 0) + 1;
        oppClubRow.form = ['L', ...(oppClubRow.form || oppClubRow.recentForm || []).slice(0, 4)];
      }
      oppClubRow.recentForm = oppClubRow.form;
      oppClubRow.matches = oppClubRow.played;
    }

    // Sắp xếp player.leagueTable theo: Điểm > Hiệu số (gd) > Bàn thắng (gf)
    player.leagueTable.sort((a, b) => {
      if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
      if ((b.gd || 0) !== (a.gd || 0)) return (b.gd || 0) - (a.gd || 0);
      return (b.gf || 0) - (a.gf || 0);
    });

    if (oppGoals > 0 && oppClub) {
      roundScorerEvents.push({ club: oppClub, goals: oppGoals });
    }
  }

  // Dù là trận Cup hay League, BẮT BUỘC cộng dồn ngay thành tích cá nhân của người chơi:
  const matchGoals = pGoals;
  const matchAssists = pAssists;
  player.goals = (player.goals || 0) + matchGoals;
  player.assists = (player.assists || 0) + matchAssists;
  if (!player.currentSeasonStats) player.currentSeasonStats = { goals: 0, assists: 0, matches: 0 };
  player.currentSeasonStats.goals += matchGoals;
  player.currentSeasonStats.assists += matchAssists;
  player.currentSeasonStats.matches += 1;
  player.totalMatches = (player.totalMatches || 0) + 1;
  player.currentSeasonStats.cleanSheets = (player.currentSeasonStats.cleanSheets || 0) + pCS;
  player.currentSeasonStats.saves = (player.currentSeasonStats.saves || 0) + pSaves;
  player.currentSeasonStats.tackles = (player.currentSeasonStats.tackles || 0) + pTackles;

  // Cập nhật thống kê Đội Tuyển Quốc Gia nếu là trận đấu quốc tế
  if (isNationalMatch) {
    player.intlCaps = (player.intlCaps || 0) + 1;
    player.intlGoals = (player.intlGoals || 0) + matchGoals;
    if (roundData.stageName && roundData.stageName.includes("Chung Kết") && isPlayerWin) {
      player.trophiesTotal = (player.trophiesTotal || 0) + 1;
      if (!player.trophiesTally) player.trophiesTally = {};
      const tName = roundData.competitionName || "Cúp Quốc Tế";
      player.trophiesTally[tName] = (player.trophiesTally[tName] || 0) + 1;
      player.fame = Math.min(100, (player.fame || 50) + 20);
      logCareerEvent(player, "TROPHY_WIN", {
        title: `VÔ ĐỊCH ${tName.toUpperCase()}!`,
        body: `🏆 Khoảnh khắc vĩ đại! Bạn cùng Đội Tuyển Quốc Gia nâng cao chiếc cúp vô địch ${tName}!`,
        type: "trophy-win"
      });
    }
  }

  // Cập nhật BXH Cúp Châu Âu nếu là Vòng Bảng C1/C2 hoặc UEFA Youth League
  if (roundData.competitionType === 'UCL' && roundData.stageName && roundData.stageName.includes("Vòng Bảng")) {
    if (player.isAcademyStage) {
      processYouthLeagueGroupMatchday(player, roundData, homeScore, awayScore, pMatch);
    } else if (player.continentalGroupTable && player.continentalGroupTable.length === 4) {
      updateContinentalGroupTable(player.continentalGroupTable, pMatch.homeClub.id, pMatch.awayClub.id, homeScore, awayScore);

      // Mô phỏng trận đấu còn lại giữa 2 đội cùng bảng
      const otherClubs = player.continentalGroupTable.filter(c => c.clubId !== pMatch.homeClub.id && c.clubId !== pMatch.awayClub.id);
      if (otherClubs.length === 2) {
        const c1 = ALL_CLUBS.find(c => c.id === otherClubs[0].clubId) || otherClubs[0];
        const c2 = ALL_CLUBS.find(c => c.id === otherClubs[1].clubId) || otherClubs[1];
        const res = simulateAIFixture(c1, c2);
        updateContinentalGroupTable(player.continentalGroupTable, otherClubs[0].clubId, otherClubs[1].clubId, res.homeScore, res.awayScore);
      }
    }
  }

  // 2. Xử lý riêng biệt khi là trận Cúp (isCup || stage || competitionType === 'cup'):
  if (isCupMatch) {
    const compType = isContinentalCup ? 'continental' : 'domestic';
    recordCupMatchContributions(player, compType, {
      roundData,
      match,
      pMatch,
      homeScore: finalHome,
      awayScore: finalAway,
      aiMatches: roundData.aiMatches || [],
      roundScorerEvents
    }, {
      goals: pGoals,
      assists: pAssists,
      playerGoals: pGoals,
      playerAssists: pAssists,
      cleanSheets: pCS,
      saves: pSaves,
      tackles: pTackles,
      rating: matchRating
    });

    // 1. Tìm trận đấu hiện tại trong cupFixtures / tournamentData và gán hoàn tất:
    if (player.cupFixtures && Array.isArray(player.cupFixtures)) {
      const cMatch = player.cupFixtures.find(m => 
        m.id === pMatch.id || 
        m.stage === roundData.stageName || 
        m.stageName === roundData.stageName ||
        (!m.isPlayed && !m.completed)
      );
      if (cMatch) {
        cMatch.isPlayed = true;
        cMatch.completed = true;
        cMatch.homeScore = finalHome;
        cMatch.awayScore = finalAway;
      }
    }

    if (player.tournamentData) {
      const tourList = Array.isArray(player.tournamentData) 
        ? player.tournamentData 
        : (player.tournamentData.fixtures || player.tournamentData.matches || []);
      const tMatch = tourList.find(m => 
        m.id === pMatch.id || 
        m.stage === roundData.stageName || 
        m.stageName === roundData.stageName ||
        (!m.isPlayed && !m.completed)
      );
      if (tMatch) {
        tMatch.isPlayed = true;
        tMatch.completed = true;
        tMatch.homeScore = finalHome;
        tMatch.awayScore = finalAway;
      }
    }

    const stageStr = roundData.stageName || roundData.stage || match.stage || "";
    const isSemiFinal = stageStr.includes("Bán Kết");
    const isQuarterFinal = stageStr.includes("Tứ Kết");

    // Cập nhật Sơ đồ phân nhánh Cúp (Tournament Brackets)
    if (player.tournamentBrackets) {
      const isYouth = Boolean(player.isAcademyStage);
      const activeClub = isYouth ? player.academy : (player.currentClub || ALL_CLUBS[0]);

      if ((roundData.competitionType === 'DOMESTIC_CUP' || (!roundData.competitionType && !stageStr.includes("Châu Âu") && !stageStr.includes("Youth League"))) && player.tournamentBrackets.domesticCup) {
        advanceTournamentBracket(player.tournamentBrackets.domesticCup, stageStr || "Bán Kết", {
          homeScore,
          awayScore,
          isPlayerHome: pMatch.isPlayerHome,
          isWin: isPlayerWin
        }, activeClub);
      } else if ((roundData.competitionType === 'UCL' || stageStr.includes("Châu Âu") || stageStr.includes("Youth League") || stageStr.includes("C1 Trẻ")) && player.tournamentBrackets.continentalCup) {
        advanceTournamentBracket(player.tournamentBrackets.continentalCup, stageStr || "Bán Kết", {
          homeScore,
          awayScore,
          isPlayerHome: pMatch.isPlayerHome,
          isWin: isPlayerWin
        }, activeClub);
      }
    }

    // Nếu người chơi thắng Tứ Kết: Đẩy vào Bán Kết
    if (isQuarterFinal && isPlayerWin) {
      player.cupStage = 'semi';
      if (player.tournamentData && typeof player.tournamentData === 'object') {
        player.tournamentData.cupStage = 'semi';
      }
      const upcomingSemi = (player.currentSeasonFixtures || []).slice(curIdx + 1).find(f => 
        f.competitionType === roundData.competitionType && 
        ((f.stageName && f.stageName.includes("Bán Kết")) || (f.stage && f.stage.includes("Bán Kết")))
      );
      if (upcomingSemi) {
        const bracket = roundData.competitionType === 'UCL' ? player.tournamentBrackets?.continentalCup : player.tournamentBrackets?.domesticCup;
        const userClub = player.club || player.currentClub || player.academy;
        let rivalClub = null;
        if (bracket?.semiFinals) {
          const pSF = bracket.semiFinals.find(sf => isSameClub(sf.club1, userClub) || isSameClub(sf.club2, userClub));
          if (pSF) {
            rivalClub = isSameClub(pSF.club1, userClub) ? pSF.club2 : pSF.club1;
          }
        }
        if (rivalClub && upcomingSemi.playerMatch) {
          upcomingSemi.playerMatch.opponent = rivalClub;
          if (upcomingSemi.playerMatch.isPlayerHome) {
            upcomingSemi.playerMatch.awayClub = rivalClub;
          } else {
            upcomingSemi.playerMatch.homeClub = rivalClub;
          }
        }
      }
    }

    // Nếu người chơi thắng Bán Kết: Cập nhật trạng thái vòng cúp (cupStage = 'final') và đẩy đội người chơi vào trận Chung Kết
    if (isSemiFinal) {
      if (isPlayerWin) {
        player.cupStage = 'final';
        if (player.tournamentData && typeof player.tournamentData === 'object') {
          player.tournamentData.cupStage = 'final';
        }
        // Đẩy đối thủ vào trận Chung Kết sắp tới trong lịch thi đấu
        const upcomingFinal = (player.currentSeasonFixtures || []).slice(curIdx + 1).find(f => 
          f.competitionType === roundData.competitionType &&
          ((f.stageName && f.stageName.includes("Chung Kết")) || 
           (f.stage && f.stage.includes("Chung Kết")))
        );
        if (upcomingFinal) {
          const bracket = roundData.competitionType === 'UCL' ? player.tournamentBrackets?.continentalCup : player.tournamentBrackets?.domesticCup;
          const userClub = player.club || player.currentClub || player.academy;
          let rivalClub = null;
          if (bracket?.final) {
            rivalClub = (bracket.final.club1 && !isSameClub(bracket.final.club1, userClub)) 
              ? bracket.final.club1 
              : bracket.final.club2;
          }
          if (rivalClub && upcomingFinal.playerMatch) {
            upcomingFinal.playerMatch.opponent = rivalClub;
            if (upcomingFinal.playerMatch.isPlayerHome) {
              upcomingFinal.playerMatch.awayClub = rivalClub;
            } else {
              upcomingFinal.playerMatch.homeClub = rivalClub;
            }
          }
        }
      } else {
        // Thua Bán Kết -> Dừng bước ở Cúp, hủy các trận cúp sau đó của giải đấu này
        player.cupStage = 'eliminated';
        if (player.tournamentData && typeof player.tournamentData === 'object') {
          player.tournamentData.cupStage = 'eliminated';
        }
        const futureCupFixtures = (player.currentSeasonFixtures || []).slice(curIdx + 1).filter(f => 
          f.competitionType === roundData.competitionType && 
          ((f.stageName && (f.stageName.includes("Chung Kết") || f.stageName.includes("Bán Kết"))) ||
           (f.stage && (f.stage.includes("Chung Kết") || f.stage.includes("Bán Kết"))))
        );
        futureCupFixtures.forEach(f => {
          f.isEliminated = true;
          f.isCompleted = true;
          f.completed = true;
          if (f.playerMatch) {
            f.playerMatch.isPlayed = true;
            f.playerMatch.completed = true;
            f.playerMatch.isEliminated = true;
          }
        });
      }
    } else if (isQuarterFinal && !isPlayerWin) {
      player.cupStage = 'eliminated';
      const futureCupFixtures = (player.currentSeasonFixtures || []).slice(curIdx + 1).filter(f => 
        f.competitionType === roundData.competitionType && 
        ((f.stageName && (f.stageName.includes("Bán Kết") || f.stageName.includes("Chung Kết"))) ||
         (f.stage && (f.stage.includes("Bán Kết") || f.stage.includes("Chung Kết"))))
      );
      futureCupFixtures.forEach(f => {
        f.isEliminated = true;
        f.isCompleted = true;
        f.completed = true;
        if (f.playerMatch) {
          f.playerMatch.isPlayed = true;
          f.playerMatch.completed = true;
          f.playerMatch.isEliminated = true;
        }
      });
    }

    // Nếu thắng trận Chung Kết
    if (stageStr.includes("Chung Kết") && isPlayerWin) {
      player.cupStage = 'champion';
      if (player.isAcademyStage && (roundData.competitionType === 'UCL' || stageStr.includes("Youth League") || stageStr.includes("C1 Trẻ"))) {
        player.wonYouthC1 = true;
        addTrophy(player, "UEFA Youth League (Cúp C1 Trẻ)");
        recordChronicleMilestone(player, 'FIRST_C1_TITLE', {
          title: "Vô Địch UEFA Youth League",
          desc: "Đăng quang ngôi vô địch Cúp C1 Trẻ châu Âu (UEFA Youth League) cùng học viện!"
        });
      }
    }
  }

  // 4. CẬP NHẬT DANH SÁCH VUA PHÁ LƯỚI & VUA KIẾN TẠO THỜI GIAN THỰC (KỂ CẢ TRẬN CÚP)
  if (player.leagueTopScorers) {
    updateLeagueTopScorers(player.leagueTopScorers, pGoals, roundScorerEvents, player);
  }
  updateLeagueTopAssists(player);

  // 5. CẬP NHẬT STATS SỰ NGHIỆP & MÙA GIẢI
  player.totalCareerMatches = (player.totalCareerMatches || 0) + 1;
  player.totalCareerGoals = (player.totalCareerGoals || 0) + pGoals;
  player.totalCareerAssists = (player.totalCareerAssists || 0) + pAssists;
  player.totalCareerCleanSheets = (player.totalCareerCleanSheets || 0) + pCS;
  player.totalCareerSaves = (player.totalCareerSaves || 0) + pSaves;
  player.totalCareerTackles = (player.totalCareerTackles || 0) + pTackles;

  player.clubMatches = (player.clubMatches || 0) + 1;
  player.clubGoals = (player.clubGoals || 0) + pGoals;
  player.clubAssists = (player.clubAssists || 0) + pAssists;

  // Thống kê ĐTQG nếu là trận quốc tế
  if (roundData.competitionType === 'NATIONAL_TEAM') {
    player.intlCaps = (player.intlCaps || 0) + 1;
    player.intlGoals = (player.intlGoals || 0) + pGoals;
    player.intlCleanSheets = (player.intlCleanSheets || 0) + pCS;
  }

  if (player.careerStats) {
    player.careerStats.matches = player.totalCareerMatches;
    player.careerStats.goals = player.totalCareerGoals;
    player.careerStats.assists = player.totalCareerAssists;
    player.careerStats.cleanSheets = player.totalCareerCleanSheets;
    player.careerStats.saves = player.totalCareerSaves;
    player.careerStats.tackles = player.totalCareerTackles;
  }

  // Cập nhật điểm đánh giá trung bình mùa giải (Average Match Rating)
  player.seasonRatingsSum = (player.seasonRatingsSum || 0) + matchRating;
  player.seasonRatingsCount = (player.seasonRatingsCount || 0) + 1;
  player.avgRating = Number((player.seasonRatingsSum / player.seasonRatingsCount).toFixed(2));
  if (player.currentSeasonStats) {
    player.currentSeasonStats.avgRating = player.avgRating;
  }

  // 6. CẬP NHẬT DANH HIỆU CÁ NHÂN: CHIẾC GIÀY VÀNG & TOP 5 QUẢ BÓNG VÀNG
  advanceGoldenShoeRound(player);
  advanceBallonDorRound(player);

  // 7. ĐỒNG BỘ GIAO DIỆN (UI)
  if (typeof window !== 'undefined') {
    if (typeof window.renderLiveLeagueTable === 'function') window.renderLiveLeagueTable(player);
    if (typeof window.renderTopScorers === 'function') window.renderTopScorers(player);
    if (typeof window.renderGoldenShoeTracker === 'function') window.renderGoldenShoeTracker(player);
    if (typeof window.renderBallonDorTracker === 'function') window.renderBallonDorTracker(player);
  }
  if (typeof syncIndividualTrackersDOM === 'function') {
    syncIndividualTrackersDOM(player);
  }

  // Cập nhật Niềm Tin HLV & Vai Trò Đội Hình
  const trustInfo = updateManagerTrustAndRole(player, matchRating, prepUsed);

  // Kích hoạt Họp báo Truyền Thông sau trận cầu đinh hoặc màn thể hiện đột biến
  const shouldTriggerPress = Boolean(
    pMatch.isBigMatch || 
    pMatch.isDerby || 
    roundData.competitionType === 'NATIONAL_TEAM' || 
    matchRating >= 8.5 || 
    matchRating < 5.8
  );
  if (shouldTriggerPress) {
    player.pressConferencePending = {
      stageName: roundData.stageName,
      competitionName: roundData.competitionName,
      homeName: pMatch.homeClub.name,
      awayName: pMatch.awayClub.name,
      homeScore,
      awayScore,
      rating: matchRating,
      goals: pGoals,
      assists: pAssists,
      isWin: isPlayerWin,
      isDerby: pMatch.isDerby,
      isBigMatch: pMatch.isBigMatch
    };
  }

  // Kích hoạt Dư Luận & Mạng Xã Hội (Media Feed) khi có màn trình diễn xuất thần
  if (matchRating >= 9.0 || pGoals >= 3 || (pGoals >= 2 && pAssists >= 1) || (pCS > 0 && pSaves >= 6)) {
    triggerMatchRatingMedia(player, {
      rating: matchRating,
      goals: pGoals,
      assists: pAssists,
      saves: pSaves,
      tackles: pTackles,
      cleanSheets: pCS,
      stadium: pMatch?.stadium,
      roundName: roundData?.stageName || roundData?.competitionName || `Vòng ${(curIdx || 0) + 1}`
    });
  }

  // Lương theo tuần (1 tuần lương / vòng matchday)
  const isAcademy = Boolean(player.isAcademyStage);
  const weeklyWage = Math.max(0, Number(player.salary) || (isAcademy ? 300 : 5000));
  player.salary = weeklyWage;
  player.money = (player.money || 0) + weeklyWage;

  // Đánh dấu vòng đấu hoàn thành & tăng chỉ số vòng
  roundData.isCompleted = true;
  roundData.completed = true;
  roundData.isPlayed = true;
  pMatch.isPlayed = true;
  pMatch.completed = true;

  player.currentFixtureIndex = curIdx + 1;
  // Đảm bảo biến trỏ trận kế tiếp (currentMatch / fixtureIndex) chuyển sang trận đấu tiếp theo (không trỏ lại trận cũ):
  while (
    player.currentFixtureIndex < player.currentSeasonFixtures.length &&
    (
      player.currentSeasonFixtures[player.currentFixtureIndex].isCompleted ||
      player.currentSeasonFixtures[player.currentFixtureIndex].completed ||
      player.currentSeasonFixtures[player.currentFixtureIndex].isEliminated ||
      player.currentSeasonFixtures[player.currentFixtureIndex].playerMatch?.isPlayed ||
      player.currentSeasonFixtures[player.currentFixtureIndex].playerMatch?.completed
    )
  ) {
    player.currentFixtureIndex++;
  }

  player.fixtureIndex = player.currentFixtureIndex;
  player.currentMatch = player.currentSeasonFixtures[player.currentFixtureIndex]?.playerMatch || null;

  // HỒI PHỤC THỂ LỰC TỰ NHIÊN GIỮA CÁC TRẬN ĐẤU (BETWEEN-MATCH STAMINA RECOVERY)
  // Sau khi kết thúc vòng đấu, cầu thủ bước vào tuần nghỉ ngơi chuẩn bị cho trận đấu tiếp theo
  const recoveryInfo = recoverStaminaBetweenMatches(player);

  // Kiểm tra chấn thương sau mỗi trận
  const injuryRoll = rollInjuryChance(player);

  // 8. TÍNH TOÁN HIỆU SUẤT TRẬN ĐẤU & TIỀN THƯỞNG (MATCH PERFORMANCE BONUSES & IMPACT)
  let impact = interactiveResult?.impact;
  if (!impact) {
    const simContext = {
      liveRating: matchRating,
      homeScore: finalHome,
      awayScore: finalAway,
      isPlayerHome: isHome,
      outcome,
      playerStats: {
        goals: pGoals,
        assists: pAssists,
        cleanSheets: pCS,
        saves: pSaves,
        tackles: pTackles,
        shots: pGoals + Math.floor(Math.random() * 2),
        onTarget: pGoals
      },
      xG: {
        player: matchXG
      },
      inMatchStamina: player.stam || 80,
      isPlayerOnBench: false
    };
    impact = calculatePostMatchImpact(simContext, player);
  }

  const matchEarnings = impact?.matchEarnings || null;
  if (pMatch.result) {
    pMatch.result.matchEarnings = matchEarnings;
    pMatch.result.weeklySalary = weeklyWage;
  }

  // Tăng trưởng chỉ số theo phong độ (Dynamic Growth - FC Style)
  const growth = impact?.growth || calculateDynamicGrowth(player, matchRating, {
    goals: pGoals,
    assists: pAssists,
    cleanSheets: pCS,
    tackles: pTackles,
    saves: pSaves
  });

  const isLastFixture = player.currentFixtureIndex >= player.currentSeasonFixtures.length;

  return {
    isSeasonFinished: isLastFixture,
    roundData,
    playerMatchResult: pMatch.result,
    outcome,
    homeScore,
    awayScore,
    playerGoals: pGoals,
    playerAssists: pAssists,
    playerCleanSheets: pCS,
    playerSaves: pSaves,
    playerTackles: pTackles,
    matchRating,
    matchDesc,
    richMatchNarrative,
    academyLifeSnippet,
    prepMsg,
    injuryData: injuryRoll,
    trustInfo,
    pressConferencePending: player.pressConferencePending,
    growth,
    matchEarnings,
    weeklySalary: weeklyWage,
    impact,
    recoveryInfo
  };
}

