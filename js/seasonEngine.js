/**
 * SEASON ENGINE
 * Quản lý chuyển giao mùa giải (Season Transition), tăng tuổi, đôn lên Đội 1 (First Team),
 * trao giải thưởng cuối mùa (Golden Boy, Quả bóng vàng, Chiếc giày vàng),
 * tạo lịch thi đấu mới và quản lý giải đấu quốc tế mùa hè (Summer Tournament).
 */

import {
  ALL_CLUBS,
  LEAGUE_TEAMS_MAP,
  REAL_RIVAL_SCORERS,
  YOUTH_RIVAL_SCORERS,
  NATIONAL_TEAMS_DATA,
  YOUTH_LEAGUE_CLUBS,
  LIFESTYLE_CATALOG,
  SPONSORSHIPS_DATA,
  AGENTS_DATA
} from './data.js';
import { getOverallPower, addTrophy, clampStats, applyTacticalModifiers, recoverStaminaBetweenMatches, processAnnualSponsorshipPayout } from './playerEngine.js';
import { calculateTransfermarktValue } from './transferEngine.js';
import { logCareerEvent, addCareerLog, recordChronicleMilestone, updateCompetitionTier, addMediaReaction } from './mediaEngine.js';
import {
  isSameClub,
  isClubMatch,
  getPlayerActiveClub,
  simulateAIFixture,
  initYouthLeagueGroups,
  initTournamentBrackets,
  initContinentalGroupTable,
  awardCupVictory,
  recordCupMatchResult,
  advanceCupStage,
  evaluateAndAwardCupAwards,
  getCupTournamentNames,
  initCupIndividualTrackers,
  calculateTournamentMvpScore
} from './cupEngine.js';
import { getPlayer } from './state.js';

// Xác định tuyến thi đấu theo 11 vị trí chuẩn trên sân
function getPlayerLine(playerOrPos) {
  const pos = (typeof playerOrPos === 'string' ? playerOrPos : (playerOrPos?.position || '')).trim().toUpperCase();

  // 1. Thủ môn (1 vị trí)
  if (pos === 'GK') return 'GK';

  // 2. Hàng hậu vệ (3 vị trí chính: CB, LB, RB)
  if (['CB', 'LB', 'RB'].includes(pos)) return 'DF';

  // 3. Tuyến giữa (4 vị trí chính: CDM, CM, CAM, LM, RM)
  if (['CDM', 'CM', 'CAM', 'LM', 'RM'].includes(pos)) return 'MF';

  // 4. Hàng tiền đạo (3 vị trí chính: ST, LW, RW hoặc CF)
  if (['ST', 'CF', 'LW', 'RW'].includes(pos)) return 'FW';

  // Dự phòng an toàn
  return 'FW';
}

export function getPhase2MatchOpponent(player) {
  const currentClub = player.currentClub;
  const currentLeague = currentClub ? currentClub.league : null;
  const rival = player.rival;

  // 1. Giai đoạn Học viện trẻ (Youth Academy - Tuổi 16)
  if (player.isAcademyStage || !currentClub) {
    const acCountry = player.academy ? (player.academy.country || "Tây Ban Nha") : "Tây Ban Nha";
    const acId = player.academy ? player.academy.id : "";
    let chosenOpponent = { name: "La Fábrica U19 (Real Madrid)", icon: "👑", title: "Đại Chiến Mini-Clásico Trẻ (Tây Ban Nha)" };

    if (acCountry === "Pháp" || acId === "clairefontaine") {
      const frClubs = [
        { name: "Olympique Lyonnais U19", icon: "🦁" },
        { name: "Olympique Marseille U19", icon: "⚪" },
        { name: "AS Monaco Academy U19", icon: "🇲🇨" },
        { name: "Stade Rennais Youth U19", icon: "🔴⚫" }
      ];
      const c = frClubs[Math.floor(Math.random() * frClubs.length)];
      chosenOpponent = { name: c.name, icon: c.icon, title: `Đại Chiến Học Viện Trẻ Nước Pháp (U19 Championnat National)` };
    } else if (acCountry === "Anh" || acId === "carrington" || acId === "cobham") {
      const enClubs = [
        { name: "Arsenal Hale End U19", icon: "🔴" },
        { name: "Manchester City EDS U19", icon: "🔵" },
        { name: "Liverpool Academy U19", icon: "🔴" },
        { name: "Chelsea Cobham U19", icon: "🔵" },
        { name: "Carrington U19 (Manchester United)", icon: "👹" }
      ];
      const avail = enClubs.filter(e => !player.academy || !player.academy.name.includes(e.name.split(' ')[0]));
      const c = avail[Math.floor(Math.random() * avail.length)] || enClubs[0];
      chosenOpponent = { name: c.name, icon: c.icon, title: `Đại Chiến Học Viện Nước Anh (U19 Premier League Cup)` };
    } else if (acCountry === "Tây Ban Nha" || acId === "la_masia" || acId === "castilla") {
      const esClubs = [
        { name: "La Fábrica U19 (Real Madrid)", icon: "👑" },
        { name: "La Masia U19 (FC Barcelona)", icon: "🔵🔴" },
        { name: "Atlético Madrid Juvenil A", icon: "🔴⚪" }
      ];
      const avail = esClubs.filter(e => !player.academy || !player.academy.name.includes(e.name.split(' ')[0]));
      const c = avail[Math.floor(Math.random() * avail.length)] || esClubs[0];
      chosenOpponent = { name: c.name, icon: c.icon, title: `Đại Chiến Mini-Clásico Trẻ (División de Honor Juvenil)` };
    } else if (acCountry === "Đức" || acId === "bayern_junior") {
      const deClubs = [
        { name: "Borussia Dortmund U19", icon: "🟡" },
        { name: "Schalke Knappenschmiede U19", icon: "🔵" },
        { name: "Bayer Leverkusen U19", icon: "🔴" }
      ];
      const c = deClubs[Math.floor(Math.random() * deClubs.length)];
      chosenOpponent = { name: c.name, icon: c.icon, title: `Đại Chiến Học Viện Trẻ Nước Đức (U19 Bundesliga)` };
    } else if (acCountry === "Bồ Đào Nha" || acId === "benfica_campus" || acId === "pvf_academy") {
      const ptClubs = [
        { name: "Sporting CP Alcochete U19", icon: "🦁" },
        { name: "SL Benfica Seixal U19", icon: "🦅" },
        { name: "FC Porto Dragon Force U19", icon: "🐉" }
      ];
      const avail = ptClubs.filter(p => !player.academy || !player.academy.name.includes(p.name.split(' ')[0]));
      const c = avail[Math.floor(Math.random() * avail.length)] || ptClubs[0];
      chosenOpponent = { name: c.name, icon: c.icon, title: `Đại Chiến Học Viện Danh Tiếng Bồ Đào Nha (Nacional Juniores)` };
    } else if (acCountry === "Hà Lan" || acId === "ajax_academy") {
      const nlClubs = [
        { name: "Feyenoord Varkenoord U19", icon: "🔴⚪" },
        { name: "PSV Eindhoven Academy U19", icon: "🔴⚪" }
      ];
      const c = nlClubs[Math.floor(Math.random() * nlClubs.length)];
      chosenOpponent = { name: c.name, icon: c.icon, title: `Đại Chiến Triết Lý Học Viện Hà Lan (Eredivisie U19)` };
    }

    return {
      opponentName: chosenOpponent.name,
      opponentClubName: chosenOpponent.name,
      opponentIcon: chosenOpponent.icon,
      matchTitle: chosenOpponent.title,
      isRivalClash: true,
      rivalPlayerName: rival ? rival.name : "Đối Thủ Kình Địch"
    };
  }

  // 2. Nếu Bạn và Kình Địch CÙNG GIẢI ĐẤU nhưng KHÁC CLB (Ví dụ: Barca vs Real Madrid) ➔ Đối thủ chính là CLB của Kình địch!
  const rivalClubObj = ALL_CLUBS.find(c => (rival?.club && (c.name === rival.club || c.id === rival.club || c.name.includes(rival.club) || rival.club.includes(c.name))));
  const isSameLeagueDiffClub = rivalClubObj && currentLeague && rivalClubObj.league?.id === currentLeague.id && rivalClubObj.id !== currentClub.id;

  if (isSameLeagueDiffClub && rival) {
    let title = "Đại Chiến Trận Cầu Đinh Quốc Nội";
    if ((currentClub.id === "barca" && rivalClubObj.id === "real_madrid") || (currentClub.id === "real_madrid" && rivalClubObj.id === "barca")) {
      title = "Siêu Kinh Điển El Clásico (Rực Lửa Tây Ban Nha)";
    } else if ((currentClub.id === "man_city" && rivalClubObj.id === "man_utd") || (currentClub.id === "man_utd" && rivalClubObj.id === "man_city")) {
      title = "Derby Thành Manchester (Đại Chiến Nước Anh)";
    } else if ((currentClub.id === "inter" && rivalClubObj.id === "ac_milan") || (currentClub.id === "ac_milan" && rivalClubObj.id === "inter")) {
      title = "Derby della Madonnina (Kinh Điển Thành Milan)";
    } else if (currentLeague.id === "PREMIER_LEAGUE") {
      title = `Đại Chiến Ngôi Đầu Ngoại Hạng Anh vs ${rivalClubObj.name}`;
    }

    return {
      opponentName: `${rivalClubObj.name} (${rival.name})`,
      opponentClubName: rivalClubObj.name,
      opponentIcon: rivalClubObj.icon,
      matchTitle: title,
      isRivalClash: true,
      rivalPlayerName: rival.name
    };
  }

  // 2.5. Các giải đấu chuyên biệt (Bồ Đào Nha, Hà Lan)
  if (currentClub.id === "sporting" || currentClub.id === "benfica" || currentClub.id === "braga") {
    const ptClubs = [
      { id: "benfica", name: "SL Benfica", icon: "🦅", power: 79 },
      { id: "porto", name: "FC Porto", icon: "🐉", power: 80 },
      { id: "sporting", name: "Sporting CP", icon: "🟢⚪", power: 77 },
      { id: "braga", name: "SC Braga", icon: "🔴⚪", power: 70 }
    ].filter(c => c.id !== currentClub.id);
    const selectedOpponent = ptClubs[Math.floor(Math.random() * ptClubs.length)] || ptClubs[0];
    let ptTitle = `Đại Chiến Quốc Nội Bồ Đào Nha vs ${selectedOpponent.name}`;
    if ((currentClub.id === "sporting" && selectedOpponent.id === "benfica") || (currentClub.id === "benfica" && selectedOpponent.id === "sporting")) {
      ptTitle = "Derby de Lisboa (Siêu Kinh Điển Thủ Đô Bồ Đào Nha)";
    } else if (selectedOpponent.id === "porto") {
      ptTitle = "O Clássico (Đại Chiến Bồ Đào Nha vs FC Porto)";
    }
    return {
      opponentName: selectedOpponent.name,
      opponentClubName: selectedOpponent.name,
      opponentIcon: selectedOpponent.icon,
      matchTitle: ptTitle,
      isRivalClash: true,
      rivalPlayerName: rival ? rival.name : "Đối Thủ Kình Địch"
    };
  }

  if (currentClub.id === "ajax" || currentClub.id === "feyenoord" || currentClub.id === "az_alkmaar") {
    const nlClubs = [
      { id: "ajax", name: "Ajax Amsterdam", icon: "⚪🔴", power: 76 },
      { id: "feyenoord", name: "Feyenoord Rotterdam", icon: "🔴⚪", power: 72 },
      { id: "psv", name: "PSV Eindhoven", icon: "🔴⚪", power: 75 },
      { id: "az_alkmaar", name: "AZ Alkmaar", icon: "🔴", power: 69 }
    ].filter(c => c.id !== currentClub.id);
    const selectedOpponent = nlClubs[Math.floor(Math.random() * nlClubs.length)] || nlClubs[0];
    let nlTitle = `Đại Chiến Hà Lan vs ${selectedOpponent.name}`;
    if ((currentClub.id === "ajax" && selectedOpponent.id === "feyenoord") || (currentClub.id === "feyenoord" && selectedOpponent.id === "ajax")) {
      nlTitle = "De Klassieker (Siêu Kinh Điển Hà Lan: Ajax vs Feyenoord)";
    }
    return {
      opponentName: selectedOpponent.name,
      opponentClubName: selectedOpponent.name,
      opponentIcon: selectedOpponent.icon,
      matchTitle: nlTitle,
      isRivalClash: true,
      rivalPlayerName: rival ? rival.name : "Đối Thủ Kình Địch"
    };
  }

  // 3. Nếu Bạn và Kình Địch KHÁC GIẢI ĐẤU hoặc CÙNG THI ĐẤU CHO 1 CLB ➔ Bắt buộc chọn CLB kình địch cùng giải quốc nội của bạn
  const sameLeagueClubs = ALL_CLUBS.filter(c => c.league?.id === currentLeague?.id && c.id !== currentClub.id);
  const topRivalClubs = sameLeagueClubs.sort((a, b) => b.power - a.power).slice(0, 4);
  const selectedOpponent = topRivalClubs[Math.floor(Math.random() * topRivalClubs.length)] || sameLeagueClubs[0] || { name: "CLB Kình Địch Quốc Nội", icon: "⚔️", power: 85 };

  let domesticMatchTitle = `Trận Cầu Đinh ${currentLeague?.name || "Giải VĐQG"}`;
  if (currentLeague?.id === "PREMIER_LEAGUE") {
    if (selectedOpponent.id === "man_city" || selectedOpponent.id === "arsenal" || selectedOpponent.id === "liverpool") {
      domesticMatchTitle = `Đại Chiến Siêu Cường Ngoại Hạng Anh vs ${selectedOpponent.name}`;
    } else if (selectedOpponent.id === "man_utd" || selectedOpponent.id === "chelsea" || selectedOpponent.id === "tottenham") {
      domesticMatchTitle = `Đại Chiến Big Match Xứ Sương Mù vs ${selectedOpponent.name}`;
    }
  } else if (currentLeague?.id === "LA_LIGA") {
    if ((currentClub.id === "barca" && selectedOpponent.id === "real_madrid") || (currentClub.id === "real_madrid" && selectedOpponent.id === "barca")) {
      domesticMatchTitle = "Siêu Kinh Điển El Clásico (Tây Ban Nha)";
    } else if (selectedOpponent.id === "atletico") {
      domesticMatchTitle = `Đại Chiến Rực Lửa Madrid vs Atletico Madrid`;
    }
  } else if (currentLeague?.id === "SERIE_A") {
    if ((currentClub.id === "inter" && selectedOpponent.id === "juventus") || (currentClub.id === "juventus" && selectedOpponent.id === "inter")) {
      domesticMatchTitle = "Derby d'Italia (Siêu Kinh Điển Nước Ý)";
    } else if ((currentClub.id === "inter" && selectedOpponent.id === "ac_milan") || (currentClub.id === "ac_milan" && selectedOpponent.id === "inter")) {
      domesticMatchTitle = "Derby della Madonnina (Thành Milan)";
    } else if (currentClub.id === "roma" && selectedOpponent.id === "juventus") {
      domesticMatchTitle = "Đại Chiến Rực Lửa vs Juventus";
    } else {
      domesticMatchTitle = `Đại Chiến Derby Serie A vs ${selectedOpponent.name}`;
    }
  } else if (currentLeague?.id === "BUNDESLIGA") {
    if ((currentClub.id === "bayern" && selectedOpponent.id === "dortmund") || (currentClub.id === "dortmund" && selectedOpponent.id === "bayern")) {
      domesticMatchTitle = "Der Klassiker (Siêu Kinh Điển Nước Đức)";
    } else {
      domesticMatchTitle = `Đại Chiến Đỉnh Cao Bundesliga vs ${selectedOpponent.name}`;
    }
  } else if (currentLeague?.id === "LIGUE_1") {
    if ((currentClub.id === "psg" && selectedOpponent.id === "marseille") || (currentClub.id === "marseille" && selectedOpponent.id === "psg")) {
      domesticMatchTitle = "Le Classique (Siêu Kinh Điển Nước Pháp)";
    } else {
      domesticMatchTitle = `Đại Chiến Ngôi Đầu Ligue 1 vs ${selectedOpponent.name}`;
    }
  }

  const isCoTeammate = Boolean(rival && currentClub && (rival.club === currentClub.name || rival.club.includes(currentClub.name) || currentClub.name.includes(rival.club)));

  return {
    opponentName: selectedOpponent.name,
    opponentClubName: selectedOpponent.name,
    opponentIcon: selectedOpponent.icon || "⚔️",
    matchTitle: domesticMatchTitle,
    isRivalClash: !isCoTeammate,
    rivalPlayerName: isCoTeammate ? `${rival.name} (Đồng đội sát cánh)` : (rival ? rival.name : "Ngôi sao đối phương")
  };
}

export function updateRivalStats(player, playerWonBallonDorThisSeason = false, seasonTrophiesWonList = []) {
  if (!player.rival) return "";

  const isSameClub = Boolean(
    player.currentClub &&
    player.rival &&
    (
      player.rival.club === player.currentClub.name ||
      player.rival.club === player.currentClub.id ||
      player.currentClub.name.includes(player.rival.club) ||
      player.rival.club.includes(player.currentClub.name)
    )
  );

  // TẬP THỂ: Nếu cùng CLB, số cúp đạt được PHẢI BẰNG NHAU 100%
  const seasonTrophies = isSameClub ? seasonTrophiesWonList.length : Math.floor(Math.random() * 3 + 1);

  // Lấy số bàn trong mùa của kình địch
  let finalSeasonGoals = player.rival.seasonGoals || 0;
  let finalSeasonAssists = player.rival.seasonAssists || 0;

  if (finalSeasonGoals === 0) {
    // Nếu bấm skip cả mùa
    finalSeasonGoals = Math.floor(Math.random() * 16) + 35; // 35 đến 50 bàn
    finalSeasonAssists = Math.floor(Math.random() * 6) + 10;
  }

  // CHỈ CỘNG DỒN VÀO SỰ NGHIỆP 1 LẦN DUY NHẤT KHI KẾT THÚC MÙA
  player.rival.careerGoals = (player.rival.careerGoals || 0) + finalSeasonGoals;
  player.rival.careerAssists = (player.rival.careerAssists || 0) + finalSeasonAssists;
  player.rival.careerTrophies = (player.rival.careerTrophies || 0) + seasonTrophies;

  // Reset số liệu mùa cho mùa giải tiếp theo
  player.rival.seasonGoals = 0;
  player.rival.seasonAssists = 0;

  let wonBD = false;
  if (!playerWonBallonDorThisSeason && Math.random() < 0.60) {
    player.rival.careerBallonDor = (player.rival.careerBallonDor || 0) + 1;
    player.rival.ballonDor = player.rival.careerBallonDor;
    wonBD = true;
  }

  if (isSameClub) {
    return `${player.rival.name} (${player.rival.club} - Đồng đội cùng CLB): ⚽ ${finalSeasonGoals} bàn, 🎯 ${finalSeasonAssists} kiến tạo | Đoạt ${seasonTrophies} cúp (Cùng CLB) | QBV: ${wonBD ? "🏆 Đoạt Quả Bóng Vàng" : "Top 3 Thế Giới"}`;
  }

  return `${player.rival.name} (${player.rival.club}): ⚽ ${finalSeasonGoals} bàn, 🎯 ${finalSeasonAssists} kiến tạo | Đoạt ${seasonTrophies} cúp | QBV: ${wonBD ? "🏆 Đoạt Quả Bóng Vàng" : "Top 3 Thế Giới"}`;
}

/* =========================================================================
   2.5 MATCH ENGINE (TÁCH SANG js/matchEngine.js)
   ========================================================================= */


/**
 * Cơ chế phát triển cầu thủ động theo phong độ thi đấu (Dynamic Performance Growth - FC Style)
 * @param {object} player 
 * @param {number} matchRating 
 * @param {object} stats { goals, assists, cleanSheets, tackles, saves }
 * @returns {object} Chi tiết tăng trưởng EXP và đột phá chỉ số
 */

export function evaluateBallonDor(player, seasonTrophiesList = [], seasonG, seasonA, seasonCS, seasonSV, isUnderdogMiracle = false) {
  // Cập nhật bảng xếp hạng với danh hiệu và kỳ tích thực tế của mùa giải
  updateBallonDorRankings(player, seasonTrophiesList, isUnderdogMiracle);

  const powerRankings = player.ballonDorRankings || [];
  let rankNumber = 99;
  let playerWonBallonDor = false;
  let rankText = "";
  let totalScore = 0;

  const playerEntryIdx = powerRankings.findIndex(item => item.isPlayer);
  if (playerEntryIdx !== -1) {
    rankNumber = playerEntryIdx + 1;
    totalScore = parseFloat(powerRankings[playerEntryIdx].score) || 0;
  }

  if (rankNumber === 1) {
    playerWonBallonDor = true;
    player.ballonDorWins = (player.ballonDorWins || 0) + 1;
    player.ballonDorTop3 = (player.ballonDorTop3 || 0) + 1;
    player.ballonDorTop30 = (player.ballonDorTop30 || 0) + 1;
    addTrophy(player, "Quả Bóng Vàng (Ballon d'Or)");
    if (Array.isArray(seasonTrophiesList) && !seasonTrophiesList.includes("Quả Bóng Vàng (Ballon d'Or)")) {
      seasonTrophiesList.push("Quả Bóng Vàng (Ballon d'Or)");
    }
    player.fame = (player.fame || 0) + 2500;
    rankText = `🏆 VÔ ĐỊCH QUẢ BÓNG VÀNG (Ballon d'Or Winner #${player.ballonDorWins})`;
  } else if (rankNumber === 2) {
    player.ballonDorTop3 = (player.ballonDorTop3 || 0) + 1;
    player.ballonDorTop30 = (player.ballonDorTop30 || 0) + 1;
    player.fame = (player.fame || 0) + 1000;
    const winnerName = powerRankings[0]?.name || (player.rival ? player.rival.name : 'Siêu sao đối thủ');
    rankText = `🥈 Quả Bóng Bạc (Hạng 2 / Ballon d'Or 2nd - ${winnerName} về nhất)`;
  } else if (rankNumber === 3) {
    player.ballonDorTop3 = (player.ballonDorTop3 || 0) + 1;
    player.ballonDorTop30 = (player.ballonDorTop30 || 0) + 1;
    player.fame = (player.fame || 0) + 600;
    rankText = "🥉 Quả Bóng Đồng (Hạng 3 / Ballon d'Or 3rd)";
  } else if (rankNumber <= 30) {
    player.ballonDorTop30 = (player.ballonDorTop30 || 0) + 1;
    rankText = `Hạng ${rankNumber} / Top 30 Quả Bóng Vàng`;
  } else {
    rankText = "Ngoài Top 30 Quả Bóng Vàng";
  }

  return { text: rankText, won: playerWonBallonDor, rankNumber, totalScore };
}

export function evaluateAnnualAwards(player, seasonGoals, seasonLeagueGoals, seasonCleanSheets, isUnderdogMiracle, ballonDorResult) {
  let awardsWon = [];
  const ovr = getOverallPower(player);

  // 1. Chiếc Giày Vàng Châu Âu (European Golden Shoe)
  const goldenShoeList = updateGoldenShoeTracker(player);
  const isTopGoldenShoe = goldenShoeList.length > 0 && goldenShoeList[0].isPlayer;
  const pLine = getPlayerLine(player);
  if ((pLine === "FW" || pLine === "MF") && (isTopGoldenShoe || seasonLeagueGoals >= 28 || seasonGoals >= 32)) {
    player.goldenShoeWins = (player.goldenShoeWins || 0) + 1;
    addTrophy(player, "Chiếc Giày Vàng Châu Âu (Golden Shoe)");
    player.fame = (player.fame || 0) + 500;
    awardsWon.push("👟 Chiếc Giày Vàng Châu Âu");
  }

  // 2. FIFA The Best
  if (ballonDorResult.won || (ballonDorResult.rankNumber <= 2 && Math.random() < 0.65) || (isUnderdogMiracle && Math.random() < 0.8)) {
    player.fifaTheBestWins = (player.fifaTheBestWins || 0) + 1;
    addTrophy(player, "FIFA The Best - Cầu Thủ Xuất Sắc Nhất");
    player.fame = (player.fame || 0) + 600;
    awardsWon.push("🌟 FIFA The Best");
  }

  // 3. Găng Tay Vàng Châu Âu
  if (pLine === "GK" && seasonCleanSheets >= 20) {
    player.goldenGloveWins = (player.goldenGloveWins || 0) + 1;
    addTrophy(player, "Găng Tay Vàng Châu Âu (Golden Glove)");
    player.fame = (player.fame || 0) + 400;
    awardsWon.push("🧤 Găng Tay Vàng Châu Âu");
  }

  // 4. Đội Hình Tiêu Biểu Thế Giới (FIFPRO World 11)
  if (ovr >= 82 && (ballonDorResult.rankNumber <= 15 || seasonGoals >= 25 || seasonCleanSheets >= 16)) {
    player.fifproWorld11Wins = (player.fifproWorld11Wins || 0) + 1;
    player.fame = (player.fame || 0) + 300;
    awardsWon.push("🏅 FIFPRO World 11");
  }

  return awardsWon;
}


export function simulateSeasonRound(player, actionTitle, actionReport) {
  const curYear = player.year || (2026 + player.seasonsPlayed);

  // Lương đã được chi trả hàng tuần qua từng vòng đấu (simulateMatchdayRound)

  // Subscriptions billing
  let subsReportText = "";
  for (let i = player.subscriptions.length - 1; i >= 0; i--) {
    const subId = player.subscriptions[i];
    const subObj = LIFESTYLE_CATALOG.subscriptions.find(s => s.id === subId);
    if (subObj) {
      if (player.money >= subObj.costYearly) {
        player.money -= subObj.costYearly;
      } else {
        player.subscriptions.splice(i, 1);
        if (subId === "sub_freestyle_coach" && player.skillMoves > 5) {
          player.skillMoves = 5;
        }
        subsReportText += ` [Hết tiền duy trì ${subObj.name}]`;
      }
    }
  }

  if (player.subscriptions.includes("sub_pr")) {
    player.fame = (player.fame || 0) + 50;
  }

  if (player.subscriptions.includes("sub_cryo")) {
    player.stam = 99;
    player.stamina = 99;
  } else {
    recoverStaminaBetweenMatches(player);
  }

  // Investment yields
  let totalYield = 0;
  player.assets.forEach(astId => {
    const ast = LIFESTYLE_CATALOG.assets.find(a => a.id === astId);
    if (ast && ast.annualYieldRate) {
      totalYield += Math.round(ast.cost * ast.annualYieldRate);
    }
  });
  if (totalYield > 0) player.money += totalYield;

  const previousMarketValue = player.marketValue;
  const ovr = getOverallPower(player);
  const clubPower = player.currentClub.power;
  const curLeague = player.currentClub.league;
  const compTier = updateCompetitionTier(player);

  // ──── APPLY TACTICAL MODIFIERS & TIER DIFFICULTY ────────────────────────
  const { adjustedRating: combinedRating, cfg: tacticCfg } = applyTacticalModifiers(player, (ovr * 0.45) + (clubPower * 0.55));
  const scoreNormalized_base = (ovr * 0.45) + (clubPower * 0.55); // raw for league rank

  let seasonReportRows = [];
  let seasonTrophiesWonList = [];
  let seasonMatches = 0, seasonGoals = 0, seasonAssists = 0, seasonCleanSheets = 0, seasonSaves = 0, seasonTackles = 0;
  let annualCaps = 0, intlGoalsThisYear = 0, intlAssistsThisYear = 0, intlCleanSheetsThisYear = 0, intlSavesThisYear = 0, intlTacklesThisYear = 0;

  let wonLeagueThisYear = false;
  let wonMainCupThisYear = false;
  let wonEuroC1ThisYear = false;
  let wonEuroC2ThisYear = false;

  // 1. [GIẢI VĐQG - DOMESTIC LEAGUE]
  const pLine = getPlayerLine(player);
  const totalLeagueFixtures = curLeague.totalTeams === 20 ? 38 : (curLeague.totalTeams === 18 ? 34 : 26);
  let lMatches = Math.max(26, Math.min(totalLeagueFixtures, Math.floor(totalLeagueFixtures - ((100 - player.stam) / 100) * 8 + (Math.random() * 3))));
  let lGoals = 0, lAssists = 0, lCS = 0, lSaves = 0, lTackles = 0;

  if (pLine === "FW") {
    let goalBuff = player.equipment.includes("eq_boots") ? 3 : 0;
    if (ovr >= 88 && player.form >= 75 && clubPower >= 85) {
      lGoals = Math.floor((28 + (ovr - 88) * 1.6 + Math.random() * 10) * tacticCfg.goalMult) + goalBuff;
      lAssists = Math.floor((8 + Math.random() * 9) * tacticCfg.assistMult);
    } else if (ovr >= 78) {
      lGoals = Math.floor((16 + (ovr - 78) * 1.1 + Math.random() * 7) * tacticCfg.goalMult) + goalBuff;
      lAssists = Math.floor((5 + Math.random() * 6) * tacticCfg.assistMult);
    } else {
      lGoals = Math.max(3, Math.floor((combinedRating / 100) * 16 + Math.random() * 5) * tacticCfg.goalMult) + goalBuff;
      lAssists = Math.max(1, Math.floor((combinedRating / 100) * 7 + Math.random() * 3));
    }

    // Áp dụng độ khó phòng thủ theo Tier:
    if (compTier.currentTier === 1 && ovr < 80) {
      lGoals = Math.max(2, Math.floor(lGoals * 0.85)); // Tier 1 hậu vệ gắt gao
    } else if (compTier.currentTier === 3) {
      lGoals = Math.floor(lGoals * 1.15); // Tier 3 giải phóng chân sút
    }
  } else if (pLine === "MF") {
    if (ovr >= 88) {
      lGoals = Math.floor((10 + Math.random() * 10) * tacticCfg.goalMult);
      lAssists = Math.floor((14 + Math.random() * 11) * tacticCfg.assistMult);
    } else {
      lGoals = Math.max(2, Math.floor((combinedRating / 100) * 9 + Math.random() * 4));
      lAssists = Math.max(3, Math.floor((combinedRating / 100) * 14 + Math.random() * 6));
    }
    if (compTier.currentTier === 1 && ovr < 80) {
      lAssists = Math.max(2, Math.floor(lAssists * 0.88));
    } else if (compTier.currentTier === 3) {
      lAssists = Math.floor(lAssists * 1.12);
    }
  } else if (pLine === "DF") {
    lCS = Math.max(4, Math.floor((combinedRating / 100) * (15 + Math.random() * 7) * tacticCfg.cleanSheetMult));
    lTackles = Math.max(45, Math.floor((combinedRating / 100) * (70 + Math.random() * 30)));
    lGoals = Math.floor(Math.random() * 4);
    lAssists = Math.floor(Math.random() * 4);
    if (compTier.currentTier === 1 && ovr < 80) {
      lCS = Math.max(2, Math.floor(lCS * 0.85));
    }
  } else {
    // GK
    let gloveBuff = player.equipment.includes("eq_gloves") ? 2 : 0;
    lCS = Math.max(5, Math.floor((combinedRating / 100) * (16 + Math.random() * 8) * tacticCfg.cleanSheetMult)) + gloveBuff;
    lSaves = Math.max(40, Math.floor((combinedRating / 100) * (85 + Math.random() * 35))) + (gloveBuff * 4);
    if (compTier.currentTier === 1 && ovr < 80) {
      lCS = Math.max(3, Math.floor(lCS * 0.85));
    }
  }

  const rawRating = scoreNormalized_base; // dùng base rating cho xếp hạng, không bị tactic skew
  let scoreNormalized = Math.min(99, Math.max(20, rawRating + (Math.random() * 14 - 7)));
  let simulatedRank = Math.max(1, Math.min(curLeague.totalTeams, Math.round(curLeague.totalTeams - (scoreNormalized / 100) * (curLeague.totalTeams - 1))));

  if (clubPower >= 90 && scoreNormalized >= 88 && Math.random() < 0.55) {
    simulatedRank = 1;
  } else if (clubPower >= 82 && scoreNormalized >= 82 && simulatedRank > 4 && Math.random() < 0.5) {
    simulatedRank = Math.floor(Math.random() * 3) + 2;
  }

  // Nếu người chơi thực sự thi đấu qua hệ thống Matchday:
  const hasMatchdayStats = Boolean(
    player.currentSeasonStats && 
    (player.currentSeasonStats.matches > 0 || player.currentSeasonStats.goals > 0)
  );

  if (hasMatchdayStats && player.leagueTable && Array.isArray(player.leagueTable) && player.leagueTable.length > 0) {
    const activeClub = getPlayerActiveClub ? getPlayerActiveClub(player) : (player.academy || player.currentClub);
    const myClub = player.club || activeClub;
    const playerClubRow = player.leagueTable.find(t => 
      t.isPlayerClub || 
      isSameClub(t, player.club) || 
      (myClub && isSameClub(t, myClub)) || 
      isSameClub(t, player.currentClub) || 
      isSameClub(t, player.academy)
    );
    if (playerClubRow) {
      simulatedRank = player.leagueTable.indexOf(playerClubRow) + 1;
    }
  }

  let lStatStr = pLine === "GK"
    ? `${lMatches} trận | 🧤 ${lCS} sạch lưới, ${lSaves} cứu thua`
    : (pLine === "DF" ? `${lMatches} trận | 🛡️ ${lTackles} tắc bóng, ${lCS} sạch lưới` : `${lMatches} trận | ⚽ ${lGoals} bàn, 🎯 ${lAssists} kiến tạo`);

  let lResultText = `Hạng ${simulatedRank}/${curLeague.totalTeams} (${lStatStr})`;
  if (simulatedRank === 1) {
    addTrophy(player, curLeague.domesticLeagueCup);
    player.trophiesCount = (player.trophiesCount || 0) + 1;
    if (!seasonTrophiesWonList.includes(curLeague.domesticLeagueCup)) {
      seasonTrophiesWonList.push(curLeague.domesticLeagueCup);
    }
    player.fame += 500;
    wonLeagueThisYear = true;
    lResultText = `🏆 VÔ ĐỊCH ${curLeague.name} (Hạng 1) — ${lStatStr}`;
  } else if (simulatedRank === 2) {
    lResultText = `🥈 Á Quân (Hạng 2/${curLeague.totalTeams}) — ${lStatStr}`;
  } else if (simulatedRank <= 4) {
    lResultText = `🥉 Hạng ${simulatedRank}/${curLeague.totalTeams} (Top 4) — ${lStatStr}`;
  }
  if (simulatedRank <= 4) player.top4Finishes += 1;

  seasonMatches += lMatches; seasonGoals += lGoals; seasonAssists += lAssists;
  seasonCleanSheets += lCS; seasonSaves += lSaves; seasonTackles += lTackles;
  seasonReportRows.push({ icon: "🏆", title: "[Giải VĐQG]", text: lResultText });

  // Đánh giá CẦU THỦ XUẤT SẮC NHẤT GIẢI VĐQG (Player of the Season / League MVP)
  const lgMvpTitle = `Cầu Thủ Xuất Sắc Nhất ${curLeague.name || "VĐQG"}`;
  const isLeagueChamp = simulatedRank === 1;
  const isLeagueRunnerUp = simulatedRank === 2;
  const leagueMvpScore = calculateTournamentMvpScore({
    matches: lMatches,
    goals: lGoals,
    assists: lAssists,
    cleanSheets: lCS,
    tackles: lTackles,
    saves: lSaves,
    avgRating: player.lastSeasonAvgRating || 0
  }, player.position, isLeagueChamp, isLeagueRunnerUp, { isLeague: true });

  const aiBenchmarkLeagueMvp = 132; // Mốc điểm chuẩn AI League: 120 – 145 điểm
  const minLeagueMatches = Math.ceil((curLeague.totalMatches || 38) * 0.6);
  if (leagueMvpScore >= aiBenchmarkLeagueMvp && lMatches >= minLeagueMatches) {
    if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
    if (!player.seasonTrophiesWonThisYear.includes(lgMvpTitle)) {
      player.seasonTrophiesWonThisYear.push(lgMvpTitle);
      addTrophy(player, lgMvpTitle);
      player.trophiesCount = (player.trophiesCount || 0) + 1;
      player.careerTrophies = (player.careerTrophies || 0) + 1;
      seasonTrophiesWonList.push(lgMvpTitle);
      player.fame += 1000;
      player.morale = Math.min(100, (player.morale || 70) + 10);
      if (!player.individualAwards) player.individualAwards = [];
      player.individualAwards.push({
        id: `league_mvp_${player.year || 2026}`,
        name: lgMvpTitle,
        year: player.year || 2026,
        age: player.age || 17,
        stat: `${leagueMvpScore} điểm MVP`,
        icon: "🏅"
      });
      seasonReportRows.push({
        icon: "🏅",
        title: "[Cầu Thủ Xuất Sắc Nhất Mùa]",
        text: `🥇 ${lgMvpTitle.toUpperCase()} (${leagueMvpScore} điểm MVP!)`
      });
      recordChronicleMilestone(player, 'MVP_AWARD', {
        title: lgMvpTitle,
        desc: `Giành danh hiệu ${lgMvpTitle} với ${leagueMvpScore} điểm MVP!`,
        badge: "🏅 CẦU THỦ XUẤT SẮC NHẤT",
        badgeColor: "gold",
        category: "individual",
        icon: "🏅"
      });
    }
  }

  // Tuyển chọn Đội Hình Tiêu Biểu Mùa Giải (Team of the Season - TOTS 4-3-3)
  const totsResult = generateTeamOfTheSeason(player, curLeague?.id || curLeague?.name, player.leagueTable);
  if (totsResult && totsResult.playerIncluded) {
    seasonReportRows.push({
      icon: "🌟",
      title: "[Đội Hình Tiêu Biểu (TOTS)]",
      text: `🌟 Vinh danh trong Đội Hình Tiêu Biểu ${totsResult.tournamentName} (Sơ đồ 4-3-3 | ${totsResult.playerMvpScore} điểm MVP)!`
    });
  }

  // 2. [CÚP QUỐC GIA CHÍNH]
  let mcMatches = 0, mcGoals = 0, mcAssists = 0, mcCS = 0, mcSaves = 0, mcTackles = 0;
  const cupPowerRoll = combinedRating + (Math.random() * 20 - 10);
  let mcResult = "";

  if (cupPowerRoll >= 91 && Math.random() < 0.65) {
    mcMatches = Math.floor(Math.random() * 3) + 6;
    mcResult = `🏆 VÔ ĐỊCH ${curLeague.domesticCup}!`;
    addTrophy(player, curLeague.domesticCup);
    player.trophiesCount = (player.trophiesCount || 0) + 1;
    seasonTrophiesWonList.push(curLeague.domesticCup);
    player.fame += 350;
    wonMainCupThisYear = true;
  } else if (cupPowerRoll >= 80) {
    mcMatches = 6; mcResult = `🥈 Á Quân ${curLeague.domesticCup}`;
  } else if (cupPowerRoll >= 72) {
    mcMatches = 5; mcResult = `Dừng bước tại Bán kết ${curLeague.domesticCup}`;
  } else if (cupPowerRoll >= 60) {
    mcMatches = 4; mcResult = `Dừng bước tại Tứ kết ${curLeague.domesticCup}`;
  } else if (cupPowerRoll >= 45) {
    mcMatches = 2; mcResult = `Dừng bước tại Vòng 1/8 ${curLeague.domesticCup}`;
  } else {
    mcMatches = 1; mcResult = `Bị loại tại Vòng 1/16 ${curLeague.domesticCup}`;
  }

  if (pLine === "FW") {
    mcGoals = Math.max(0, Math.floor((mcMatches * 0.75) * (combinedRating / 100) + Math.random() * 3));
    mcAssists = Math.max(0, Math.floor((mcMatches * 0.35) + Math.random() * 2));
    mcResult += ` (${mcMatches} trận | ⚽ ${mcGoals} bàn, 🎯 ${mcAssists} kiến tạo)`;
  } else if (pLine === "MF") {
    mcGoals = Math.max(0, Math.floor((mcMatches * 0.4) + Math.random() * 2));
    mcAssists = Math.max(0, Math.floor((mcMatches * 0.6) + Math.random() * 2));
    mcResult += ` (${mcMatches} trận | ⚽ ${mcGoals} bàn, 🎯 ${mcAssists} kiến tạo)`;
  } else if (pLine === "DF") {
    mcCS = Math.max(0, Math.floor(mcMatches * 0.45));
    mcTackles = Math.floor(mcMatches * 3.5);
    mcResult += ` (${mcMatches} trận | 🛡️ ${mcTackles} tắc bóng, ${mcCS} sạch lưới)`;
  } else {
    mcCS = Math.max(0, Math.floor(mcMatches * 0.5));
    mcSaves = Math.floor(mcMatches * 4.2);
    mcResult += ` (${mcMatches} trận | 🧤 ${mcCS} sạch lưới, ${mcSaves} cứu thua)`;
  }

  seasonMatches += mcMatches; seasonGoals += mcGoals; seasonAssists += mcAssists;
  seasonCleanSheets += mcCS; seasonSaves += mcSaves; seasonTackles += mcTackles;
  seasonReportRows.push({ icon: "🛡️", title: "[Cúp Quốc Gia]", text: mcResult });

  // Đánh giá Vua Phá Lưới & Vua Kiến Tạo & MVP Cúp Quốc Gia
  const dCupName = curLeague.domesticCup || "Cúp Quốc Gia";
  const dScorerTitle = `Vua Phá Lưới ${dCupName}`;
  const dPlaymakerTitle = `Vua Kiến Tạo ${dCupName}`;
  const dCupMvpTitle = `Cầu Thủ Xuất Sắc Nhất ${dCupName}`;

  if (mcGoals >= 5) {
    if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
    if (!player.seasonTrophiesWonThisYear.includes(dScorerTitle)) {
      player.seasonTrophiesWonThisYear.push(dScorerTitle);
      addTrophy(player, dScorerTitle);
      seasonTrophiesWonList.push(dScorerTitle);
      player.fame += 500;
      player.morale = Math.min(100, (player.morale || 70) + 8);
      seasonReportRows.push({ icon: "👟", title: "[Vua Phá Lưới Cúp QG]", text: `🥇 VUA PHÁ LƯỚI ${dCupName} (${mcGoals} bàn thắng!)` });
    }
  }
  if (mcAssists >= 4) {
    if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
    if (!player.seasonTrophiesWonThisYear.includes(dPlaymakerTitle)) {
      player.seasonTrophiesWonThisYear.push(dPlaymakerTitle);
      addTrophy(player, dPlaymakerTitle);
      seasonTrophiesWonList.push(dPlaymakerTitle);
      player.fame += 350;
      player.morale = Math.min(100, (player.morale || 70) + 6);
      seasonReportRows.push({ icon: "🎯", title: "[Vua Kiến Tạo Cúp QG]", text: `🎯 VUA KIẾN TẠO ${dCupName} (${mcAssists} kiến tạo!)` });
    }
  }

  const isDomesticCupChamp = mcResult.includes("VÔ ĐỊCH");
  const isDomesticCupRunnerUp = mcResult.includes("Á Quân");
  const dCupMvpScore = calculateTournamentMvpScore({
    matches: mcMatches,
    goals: mcGoals,
    assists: mcAssists,
    cleanSheets: mcCS,
    tackles: mcTackles,
    saves: mcSaves,
    avgRating: player.lastSeasonAvgRating || 0
  }, player.position, isDomesticCupChamp, isDomesticCupRunnerUp, { isCup: true });

  if (dCupMvpScore >= 92 && mcMatches >= 3) {
    if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
    if (!player.seasonTrophiesWonThisYear.includes(dCupMvpTitle)) {
      player.seasonTrophiesWonThisYear.push(dCupMvpTitle);
      addTrophy(player, dCupMvpTitle);
      player.trophiesCount = (player.trophiesCount || 0) + 1;
      player.careerTrophies = (player.careerTrophies || 0) + 1;
      seasonTrophiesWonList.push(dCupMvpTitle);
      player.fame += 750;
      player.morale = Math.min(100, (player.morale || 70) + 10);
      if (!player.individualAwards) player.individualAwards = [];
      player.individualAwards.push({
        id: `domestic_cup_mvp_${player.year || 2026}`,
        name: dCupMvpTitle,
        year: player.year || 2026,
        age: player.age || 17,
        stat: `${dCupMvpScore} điểm MVP`,
        icon: "🏅"
      });
      seasonReportRows.push({
        icon: "🏅",
        title: "[Cầu Thủ XS Nhất Cúp QG]",
        text: `🥇 ${dCupMvpTitle.toUpperCase()} (${dCupMvpScore} điểm MVP!)`
      });
      recordChronicleMilestone(player, 'MVP_AWARD', {
        title: dCupMvpTitle,
        desc: `Giành danh hiệu ${dCupMvpTitle} với ${dCupMvpScore} điểm MVP!`,
        badge: "🏅 CẦU THỦ XUẤT SẮC NHẤT",
        badgeColor: "gold",
        category: "individual",
        icon: "🏅"
      });
    }
  }

  // 3. [CÚP LIÊN ĐOÀN - LEAGUE CUP]
  if (curLeague.leagueCup) {
    let lcMatches = 0, lcGoals = 0, lcAssists = 0, lcCS = 0, lcSaves = 0, lcTackles = 0;
    const lcRoll = combinedRating + (Math.random() * 20 - 10);
    let lcResult = "";

    if (lcRoll >= 91 && Math.random() < 0.60) {
      lcMatches = 6;
      lcResult = `🏆 VÔ ĐỊCH ${curLeague.leagueCup}!`;
      addTrophy(player, curLeague.leagueCup);
      seasonTrophiesWonList.push(curLeague.leagueCup);
      player.fame += 200;
    } else if (lcRoll >= 78) {
      lcMatches = 5; lcResult = `🥈 Á Quân ${curLeague.leagueCup}`;
    } else if (lcRoll >= 68) {
      lcMatches = 4; lcResult = `Bán kết ${curLeague.leagueCup}`;
    } else if (lcRoll >= 52) {
      lcMatches = 3; lcResult = `Tứ kết ${curLeague.leagueCup}`;
    } else {
      lcMatches = 1; lcResult = `Vòng loại ${curLeague.leagueCup}`;
    }

    if (pLine === "FW") {
      lcGoals = Math.max(0, Math.floor(lcMatches * 0.7 + Math.random() * 2));
      lcAssists = Math.max(0, Math.floor(lcMatches * 0.3 + Math.random() * 2));
      lcResult += ` (${lcMatches} trận | ⚽ ${lcGoals} bàn, 🎯 ${lcAssists} kiến tạo)`;
    } else if (pLine === "MF") {
      lcGoals = Math.max(0, Math.floor(lcMatches * 0.35 + Math.random() * 2));
      lcAssists = Math.max(0, Math.floor(lcMatches * 0.5 + Math.random() * 2));
      lcResult += ` (${lcMatches} trận | ⚽ ${lcGoals} bàn, 🎯 ${lcAssists} kiến tạo)`;
    } else if (pLine === "DF") {
      lcCS = Math.max(0, Math.floor(lcMatches * 0.4));
      lcTackles = Math.floor(lcMatches * 3.2);
      lcResult += ` (${lcMatches} trận | 🛡️ ${lcTackles} tắc bóng, ${lcCS} sạch lưới)`;
    } else {
      lcCS = Math.max(0, Math.floor(lcMatches * 0.45));
      lcSaves = Math.floor(lcMatches * 3.8);
      lcResult += ` (${lcMatches} trận | 🧤 ${lcCS} sạch lưới, ${lcSaves} cứu thua)`;
    }

    seasonMatches += lcMatches; seasonGoals += lcGoals; seasonAssists += lcAssists;
    seasonCleanSheets += lcCS; seasonSaves += lcSaves; seasonTackles += lcTackles;
    seasonReportRows.push({ icon: "🥉", title: "[Cúp Liên Đoàn]", text: lcResult });
  }

  // 4. [SIÊU CÚP QUỐC GIA]
  const isSuperCupEligible = player.wonLeagueLastSeason || player.wonMainCupLastSeason || (curLeague.id === "LA_LIGA" && player.lastSeasonLeagueRank <= 2);

  if (isSuperCupEligible) {
    let sMatches = 1, sGoals = 0, sAssists = 0, sCS = 0, sSaves = 0, sTackles = 0;
    const sRoll = combinedRating + (Math.random() * 18 - 9);
    let sResult = "";

    if (sRoll >= 85 && Math.random() < 0.65) {
      sResult = `🏆 VÔ ĐỊCH ${curLeague.domesticSuperCup}!`;
      addTrophy(player, curLeague.domesticSuperCup);
      seasonTrophiesWonList.push(curLeague.domesticSuperCup);
      player.fame += 200;
    } else {
      sResult = `🥈 Á Quân ${curLeague.domesticSuperCup}`;
    }

    if (pLine === "FW") {
      sGoals = Math.random() < 0.75 ? 1 : 2;
      sAssists = Math.random() < 0.5 ? 1 : 0;
      sResult += ` (1 trận | ⚽ ${sGoals} bàn, 🎯 ${sAssists} kiến tạo)`;
    } else if (pLine === "MF") {
      sGoals = Math.random() < 0.4 ? 1 : 0;
      sAssists = Math.random() < 0.7 ? 1 : 0;
      sResult += ` (1 trận | ⚽ ${sGoals} bàn, 🎯 ${sAssists} kiến tạo)`;
    } else if (pLine === "DF") {
      sCS = sRoll >= 85 ? 1 : 0; sTackles = 4;
      sResult += ` (1 trận | 🛡️ 4 tắc bóng, ${sCS} sạch lưới)`;
    } else {
      sCS = sRoll >= 85 ? 1 : 0; sSaves = 5;
      sResult += ` (1 trận | 🧤 ${sCS} sạch lưới, 5 cứu thua)`;
    }

    seasonMatches += sMatches; seasonGoals += sGoals; seasonAssists += sAssists;
    seasonCleanSheets += sCS; seasonSaves += sSaves; seasonTackles += sTackles;
    seasonReportRows.push({ icon: "⚡", title: "[Siêu Cúp QG]", text: sResult });
  }

  // 5. [CÚP CHÂU ÂU]: C1 / C2 / C3
  let eMatches = 0, eGoals = 0, eAssists = 0, eCS = 0, eSaves = 0, eTackles = 0;
  let eResult = "";

  if (player.currentEuroStatus === "C1") {
    const c1Name = curLeague.continentalC1;
    const reachesFinal = player.seasonCupReachesFinal !== undefined ? player.seasonCupReachesFinal : (combinedRating >= 84 || Math.random() < 0.60);

    if (reachesFinal) {
      const c1WinRoll = combinedRating + (Math.random() * 16 - 8);
      if (c1WinRoll >= 88 && Math.random() < 0.60) {
        eMatches = 15;
        eResult = `🏆 VÔ ĐỊCH ${c1Name}! Đỉnh cao Châu Âu`;
        addTrophy(player, c1Name);
        seasonTrophiesWonList.push(c1Name);
        player.fame += 800;
        wonEuroC1ThisYear = true;
      } else {
        eMatches = 14;
        eResult = `🥈 Á Quân ${c1Name} (Thua sát nút Chung kết)`;
      }
    } else {
      eMatches = 12;
      eResult = `Dừng bước tại Bán kết ${c1Name}`;
    }

    if (pLine === "FW") {
      eGoals = Math.max(2, Math.floor((eMatches * 0.85) * (combinedRating / 100) + Math.random() * 4));
      eAssists = Math.max(1, Math.floor((eMatches * 0.35) + Math.random() * 2));
      eResult += ` (${eMatches} trận | ⚽ ${eGoals} bàn, 🎯 ${eAssists} kiến tạo)`;
    } else if (pLine === "MF") {
      eGoals = Math.max(1, Math.floor((eMatches * 0.4) + Math.random() * 2));
      eAssists = Math.max(1, Math.floor((eMatches * 0.55) + Math.random() * 3));
      eResult += ` (${eMatches} trận | ⚽ ${eGoals} bàn, 🎯 ${eAssists} kiến tạo)`;
    } else if (pLine === "DF") {
      eCS = Math.max(1, Math.floor(eMatches * 0.45));
      eTackles = Math.floor(eMatches * 3.8);
      eResult += ` (${eMatches} trận | 🛡️ ${eTackles} tắc bóng, ${eCS} sạch lưới)`;
    } else {
      eCS = Math.max(1, Math.floor(eMatches * 0.5));
      eSaves = Math.floor(eMatches * 4.5);
      eResult += ` (${eMatches} trận | 🧤 ${eCS} sạch lưới, ${eSaves} cứu thua)`;
    }

    player.uclGoals = (player.uclGoals || 0) + eGoals;

    seasonMatches += eMatches; seasonGoals += eGoals; seasonAssists += eAssists;
    seasonCleanSheets += eCS; seasonSaves += eSaves; seasonTackles += eTackles;
    seasonReportRows.push({ icon: "🌍", title: `[Cúp C1 Châu Lục]`, text: eResult });

  } else if (player.currentEuroStatus === "C2") {
    const c2Name = curLeague.continentalC2;
    const reachesFinal = player.seasonCupReachesFinal !== undefined ? player.seasonCupReachesFinal : (combinedRating >= 78 || Math.random() < 0.60);

    if (reachesFinal) {
      const c2Roll = combinedRating + (Math.random() * 16 - 8);
      if (c2Roll >= 82 && Math.random() < 0.60) {
        eMatches = 15;
        eResult = `🏆 VÔ ĐỊCH ${c2Name}!`;
        addTrophy(player, c2Name);
        seasonTrophiesWonList.push(c2Name);
        player.fame += 400;
        wonEuroC2ThisYear = true;
      } else {
        eMatches = 14;
        eResult = `🥈 Á Quân ${c2Name}`;
      }
    } else {
      eMatches = 12;
      eResult = `Dừng bước tại Bán kết ${c2Name}`;
    }

    if (pLine === "FW") {
      eGoals = Math.max(2, Math.floor((eMatches * 0.8) * (combinedRating / 100) + Math.random() * 3));
      eAssists = Math.max(1, Math.floor((eMatches * 0.35) + Math.random() * 2));
      eResult += ` (${eMatches} trận | ⚽ ${eGoals} bàn, 🎯 ${eAssists} kiến tạo)`;
    } else if (pLine === "MF") {
      eGoals = Math.max(1, Math.floor((eMatches * 0.35) + Math.random() * 2));
      eAssists = Math.max(1, Math.floor((eMatches * 0.5) + Math.random() * 2));
      eResult += ` (${eMatches} trận | ⚽ ${eGoals} bàn, 🎯 ${eAssists} kiến tạo)`;
    } else if (pLine === "DF") {
      eCS = Math.max(1, Math.floor(eMatches * 0.4));
      eTackles = Math.floor(eMatches * 3.5);
      eResult += ` (${eMatches} trận | 🛡️ ${eTackles} tắc bóng, ${eCS} sạch lưới)`;
    } else {
      eCS = Math.max(1, Math.floor(eMatches * 0.45));
      eSaves = Math.floor(eMatches * 4.2);
      eResult += ` (${eMatches} trận | 🧤 ${eCS} sạch lưới, ${eSaves} cứu thua)`;
    }

    seasonMatches += eMatches; seasonGoals += eGoals; seasonAssists += eAssists;
    seasonCleanSheets += eCS; seasonSaves += eSaves; seasonTackles += eTackles;
    seasonReportRows.push({ icon: "🌍", title: `[Cúp C2 Châu Lục]`, text: eResult });

  } else if (player.currentEuroStatus === "C3") {
    const c3Roll = combinedRating + (Math.random() * 16 - 8);
    const c3Name = curLeague.continentalC3;

    if (c3Roll >= 78) {
      eMatches = 13;
      eResult = `🏆 VÔ ĐỊCH ${c3Name}!`;
      addTrophy(player, c3Name);
      seasonTrophiesWonList.push(c3Name);
      player.fame += 250;
    } else if (c3Roll >= 70) {
      eMatches = 12; eResult = `🥈 Á Quân ${c3Name}`;
    } else {
      eMatches = 6; eResult = `Dừng bước tại Vòng Bảng ${c3Name}`;
    }

    if (pLine === "FW") {
      eGoals = Math.max(1, Math.floor((eMatches * 0.75) * (combinedRating / 100) + Math.random() * 3));
      eAssists = Math.max(1, Math.floor((eMatches * 0.3) + Math.random() * 2));
      eResult += ` (${eMatches} trận | ⚽ ${eGoals} bàn, 🎯 ${eAssists} kiến tạo)`;
    } else if (pLine === "MF") {
      eGoals = Math.max(1, Math.floor((eMatches * 0.3) + Math.random() * 2));
      eAssists = Math.max(1, Math.floor((eMatches * 0.45) + Math.random() * 2));
      eResult += ` (${eMatches} trận | ⚽ ${eGoals} bàn, 🎯 ${eAssists} kiến tạo)`;
    } else if (pLine === "DF") {
      eCS = Math.max(1, Math.floor(eMatches * 0.4));
      eTackles = Math.floor(eMatches * 3.5);
      eResult += ` (${eMatches} trận | 🛡️ ${eTackles} tắc bóng, ${eCS} sạch lưới)`;
    } else {
      eCS = Math.max(1, Math.floor(eMatches * 0.45));
      eSaves = Math.floor(eMatches * 4.0);
      eResult += ` (${eMatches} trận | 🧤 ${eCS} sạch lưới, ${eSaves} cứu thua)`;
    }

    seasonMatches += eMatches; seasonGoals += eGoals; seasonAssists += eAssists;
    seasonCleanSheets += eCS; seasonSaves += eSaves; seasonTackles += eTackles;
    seasonReportRows.push({ icon: "🌍", title: `[Cúp C3 Châu Lục]`, text: eResult });
  }

  // Đánh giá Vua Phá Lưới & Vua Kiến Tạo Cúp Châu Âu
  if (player.currentEuroStatus === "C1") {
    const c1Name = curLeague.continentalC1 || "UEFA Champions League";
    const c1ScorerTitle = "Vua Phá Lưới UEFA Champions League";
    const c1PlaymakerTitle = "Vua Kiến Tạo UEFA Champions League";
    if (eGoals >= 10) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(c1ScorerTitle)) {
        player.seasonTrophiesWonThisYear.push(c1ScorerTitle);
        addTrophy(player, c1ScorerTitle);
        seasonTrophiesWonList.push(c1ScorerTitle);
        player.fame += 800;
        player.morale = Math.min(100, (player.morale || 70) + 10);
        seasonReportRows.push({ icon: "👟", title: "[Vua Phá Lưới UCL]", text: `🥇 VUA PHÁ LƯỚI ${c1Name} (${eGoals} bàn thắng!)` });
      }
    }
    if (eAssists >= 6) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(c1PlaymakerTitle)) {
        player.seasonTrophiesWonThisYear.push(c1PlaymakerTitle);
        addTrophy(player, c1PlaymakerTitle);
        seasonTrophiesWonList.push(c1PlaymakerTitle);
        player.fame += 600;
        player.morale = Math.min(100, (player.morale || 70) + 8);
        seasonReportRows.push({ icon: "🎯", title: "[Vua Kiến Tạo UCL]", text: `🎯 VUA KIẾN TẠO ${c1Name} (${eAssists} kiến tạo!)` });
      }
    }
    const isC1Champ = eResult.includes("VÔ ĐỊCH");
    const isC1RunnerUp = eResult.includes("Á Quân");
    const c1MvpTitle = "Cầu Thủ Xuất Sắc Nhất UEFA Champions League";
    const c1MvpScore = calculateTournamentMvpScore({
      matches: eMatches,
      goals: eGoals,
      assists: eAssists,
      cleanSheets: eCS,
      tackles: eTackles,
      saves: eSaves,
      avgRating: player.lastSeasonAvgRating || 0
    }, player.position, isC1Champ, isC1RunnerUp, { isCup: true });

    if (c1MvpScore >= 122 && eMatches >= 7) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(c1MvpTitle)) {
        player.seasonTrophiesWonThisYear.push(c1MvpTitle);
        addTrophy(player, c1MvpTitle);
        player.trophiesCount = (player.trophiesCount || 0) + 1;
        player.careerTrophies = (player.careerTrophies || 0) + 1;
        seasonTrophiesWonList.push(c1MvpTitle);
        player.fame += 1200;
        player.morale = Math.min(100, (player.morale || 70) + 10);
        if (!player.individualAwards) player.individualAwards = [];
        player.individualAwards.push({
          id: `ucl_mvp_${player.year || 2026}`,
          name: c1MvpTitle,
          year: player.year || 2026,
          age: player.age || 17,
          stat: `${c1MvpScore} điểm MVP`,
          icon: "🏅"
        });
        seasonReportRows.push({
          icon: "🏅",
          title: "[Cầu Thủ XS Nhất UCL]",
          text: `🥇 ${c1MvpTitle.toUpperCase()} (${c1MvpScore} điểm MVP!)`
        });
        recordChronicleMilestone(player, 'MVP_AWARD', {
          title: c1MvpTitle,
          desc: `Giành danh hiệu ${c1MvpTitle} với ${c1MvpScore} điểm MVP!`,
          badge: "🏅 CẦU THỦ XUẤT SẮC NHẤT",
          badgeColor: "gold",
          category: "individual",
          icon: "🏅"
        });
      }
    }
  } else if (player.currentEuroStatus === "C2") {
    const c2Name = curLeague.continentalC2 || "UEFA Europa League";
    const c2ScorerTitle = "Vua Phá Lưới UEFA Europa League";
    const c2PlaymakerTitle = "Vua Kiến Tạo UEFA Europa League";
    const c2MvpTitle = "Cầu Thủ Xuất Sắc Nhất UEFA Europa League";
    if (eGoals >= 8) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(c2ScorerTitle)) {
        player.seasonTrophiesWonThisYear.push(c2ScorerTitle);
        addTrophy(player, c2ScorerTitle);
        seasonTrophiesWonList.push(c2ScorerTitle);
        player.fame += 650;
        player.morale = Math.min(100, (player.morale || 70) + 8);
        seasonReportRows.push({ icon: "👟", title: "[Vua Phá Lưới UEL]", text: `🥇 VUA PHÁ LƯỚI ${c2Name} (${eGoals} bàn thắng!)` });
      }
    }
    if (eAssists >= 5) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(c2PlaymakerTitle)) {
        player.seasonTrophiesWonThisYear.push(c2PlaymakerTitle);
        addTrophy(player, c2PlaymakerTitle);
        seasonTrophiesWonList.push(c2PlaymakerTitle);
        player.fame += 500;
        player.morale = Math.min(100, (player.morale || 70) + 7);
        seasonReportRows.push({ icon: "🎯", title: "[Vua Kiến Tạo UEL]", text: `🎯 VUA KIẾN TẠO ${c2Name} (${eAssists} kiến tạo!)` });
      }
    }

    const isC2Champ = eResult.includes("VÔ ĐỊCH");
    const isC2RunnerUp = eResult.includes("Á Quân");
    const c2MvpScore = calculateTournamentMvpScore({
      matches: eMatches,
      goals: eGoals,
      assists: eAssists,
      cleanSheets: eCS,
      tackles: eTackles,
      saves: eSaves,
      avgRating: player.lastSeasonAvgRating || 0
    }, player.position, isC2Champ, isC2RunnerUp, { isCup: true });

    if (c2MvpScore >= 108 && eMatches >= 6) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(c2MvpTitle)) {
        player.seasonTrophiesWonThisYear.push(c2MvpTitle);
        addTrophy(player, c2MvpTitle);
        player.trophiesCount = (player.trophiesCount || 0) + 1;
        player.careerTrophies = (player.careerTrophies || 0) + 1;
        seasonTrophiesWonList.push(c2MvpTitle);
        player.fame += 850;
        player.morale = Math.min(100, (player.morale || 70) + 9);
        if (!player.individualAwards) player.individualAwards = [];
        player.individualAwards.push({
          id: `uel_mvp_${player.year || 2026}`,
          name: c2MvpTitle,
          year: player.year || 2026,
          age: player.age || 17,
          stat: `${c2MvpScore} điểm MVP`,
          icon: "🏅"
        });
        seasonReportRows.push({
          icon: "🏅",
          title: "[Cầu Thủ XS Nhất UEL]",
          text: `🥇 ${c2MvpTitle.toUpperCase()} (${c2MvpScore} điểm MVP!)`
        });
        recordChronicleMilestone(player, 'MVP_AWARD', {
          title: c2MvpTitle,
          desc: `Giành danh hiệu ${c2MvpTitle} với ${c2MvpScore} điểm MVP!`,
          badge: "🏅 CẦU THỦ XUẤT SẮC NHẤT",
          badgeColor: "gold",
          category: "individual",
          icon: "🏅"
        });
      }
    }
  } else if (player.currentEuroStatus === "C3") {
    const c3Name = curLeague.continentalC3 || "UEFA Conference League";
    const c3ScorerTitle = "Vua Phá Lưới UEFA Conference League";
    const c3PlaymakerTitle = "Vua Kiến Tạo UEFA Conference League";
    const c3MvpTitle = "Cầu Thủ Xuất Sắc Nhất UEFA Conference League";
    if (eGoals >= 7) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(c3ScorerTitle)) {
        player.seasonTrophiesWonThisYear.push(c3ScorerTitle);
        addTrophy(player, c3ScorerTitle);
        seasonTrophiesWonList.push(c3ScorerTitle);
        player.fame += 500;
        player.morale = Math.min(100, (player.morale || 70) + 7);
        seasonReportRows.push({ icon: "👟", title: "[Vua Phá Lưới UECL]", text: `🥇 VUA PHÁ LƯỚI ${c3Name} (${eGoals} bàn thắng!)` });
      }
    }
    if (eAssists >= 4) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(c3PlaymakerTitle)) {
        player.seasonTrophiesWonThisYear.push(c3PlaymakerTitle);
        addTrophy(player, c3PlaymakerTitle);
        seasonTrophiesWonList.push(c3PlaymakerTitle);
        player.fame += 400;
        player.morale = Math.min(100, (player.morale || 70) + 6);
        seasonReportRows.push({ icon: "🎯", title: "[Vua Kiến Tạo UECL]", text: `🎯 VUA KIẾN TẠO ${c3Name} (${eAssists} kiến tạo!)` });
      }
    }

    const isC3Champ = eResult.includes("VÔ ĐỊCH");
    const isC3RunnerUp = eResult.includes("Á Quân");
    const c3MvpScore = calculateTournamentMvpScore({
      matches: eMatches,
      goals: eGoals,
      assists: eAssists,
      cleanSheets: eCS,
      tackles: eTackles,
      saves: eSaves,
      avgRating: player.lastSeasonAvgRating || 0
    }, player.position, isC3Champ, isC3RunnerUp, { isCup: true });

    if (c3MvpScore >= 98 && eMatches >= 5) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(c3MvpTitle)) {
        player.seasonTrophiesWonThisYear.push(c3MvpTitle);
        addTrophy(player, c3MvpTitle);
        player.trophiesCount = (player.trophiesCount || 0) + 1;
        player.careerTrophies = (player.careerTrophies || 0) + 1;
        seasonTrophiesWonList.push(c3MvpTitle);
        player.fame += 700;
        player.morale = Math.min(100, (player.morale || 70) + 8);
        if (!player.individualAwards) player.individualAwards = [];
        player.individualAwards.push({
          id: `uecl_mvp_${player.year || 2026}`,
          name: c3MvpTitle,
          year: player.year || 2026,
          age: player.age || 17,
          stat: `${c3MvpScore} điểm MVP`,
          icon: "🏅"
        });
        seasonReportRows.push({
          icon: "🏅",
          title: "[Cầu Thủ XS Nhất UECL]",
          text: `🥇 ${c3MvpTitle.toUpperCase()} (${c3MvpScore} điểm MVP!)`
        });
        recordChronicleMilestone(player, 'MVP_AWARD', {
          title: c3MvpTitle,
          desc: `Giành danh hiệu ${c3MvpTitle} với ${c3MvpScore} điểm MVP!`,
          badge: "🏅 CẦU THỦ XUẤT SẮC NHẤT",
          badgeColor: "gold",
          category: "individual",
          icon: "🏅"
        });
      }
    }
  }

  // 6. [SIÊU CÚP CHÂU ÂU & FIFA CLUB WORLD CUP]
  if (player.wonEuroC1LastSeason || player.wonEuroC2LastSeason) {
    let uscMatches = 1, uscGoals = 0, uscAssists = 0, uscCS = 0, uscSaves = 0, uscTackles = 0;
    const uscRoll = combinedRating + (Math.random() * 16 - 8);
    let uscResult = "";

    if (uscRoll >= 86 && Math.random() < 0.65) {
      uscResult = `🏆 VÔ ĐỊCH Siêu Cúp Châu Âu (UEFA Super Cup)!`;
      addTrophy(player, "Siêu Cúp Châu Âu (UEFA Super Cup)");
      seasonTrophiesWonList.push("Siêu Cúp Châu Âu (UEFA Super Cup)");
      player.fame += 200;
    } else {
      uscResult = `🥈 Á Quân Siêu Cúp Châu Âu`;
    }

    if (pLine === "FW") {
      uscGoals = Math.random() < 0.75 ? 1 : 2;
      uscAssists = Math.random() < 0.5 ? 1 : 0;
      uscResult += ` (1 trận | ⚽ ${uscGoals} bàn, 🎯 ${uscAssists} kiến tạo)`;
    } else if (pLine === "MF") {
      uscGoals = Math.random() < 0.4 ? 1 : 0;
      uscAssists = Math.random() < 0.7 ? 1 : 0;
      uscResult += ` (1 trận | ⚽ ${uscGoals} bàn, 🎯 ${uscAssists} kiến tạo)`;
    } else if (pLine === "DF") {
      uscCS = uscRoll >= 86 ? 1 : 0; uscTackles = 4;
      uscResult += ` (1 trận | 🛡️ 4 tắc bóng, ${uscCS} sạch lưới)`;
    } else {
      uscCS = uscRoll >= 86 ? 1 : 0; uscSaves = 5;
      uscResult += ` (1 trận | 🧤 ${uscCS} sạch lưới, 5 cứu thua)`;
    }

    seasonMatches += uscMatches; seasonGoals += uscGoals; seasonAssists += uscAssists;
    seasonCleanSheets += uscCS; seasonSaves += uscSaves; seasonTackles += uscTackles;
    seasonReportRows.push({ icon: "⭐", title: "[Siêu Cúp Châu Âu]", text: uscResult });
  }

  if (player.wonEuroC1LastSeason || (curYear % 4 === 1 && combinedRating >= 84)) {
    let cwcMatches = 4, cwcGoals = 0, cwcAssists = 0, cwcCS = 0, cwcSaves = 0, cwcTackles = 0;
    const cwcRoll = combinedRating + (Math.random() * 16 - 8);
    let cwcResult = "";

    if (cwcRoll >= 88 && Math.random() < 0.65) {
      cwcResult = `🏆 VÔ ĐỊCH FIFA Club World Cup (Cúp Thế Giới Các CLB)!`;
      addTrophy(player, "FIFA Club World Cup");
      seasonTrophiesWonList.push("FIFA Club World Cup");
      player.fame += 350;
    } else {
      cwcResult = `🥈 Á Quân FIFA Club World Cup`;
    }

    if (pLine === "FW") {
      cwcGoals = Math.floor(Math.random() * 4) + 3;
      cwcAssists = Math.floor(Math.random() * 3) + 1;
      cwcResult += ` (${cwcMatches} trận | ⚽ ${cwcGoals} bàn, 🎯 ${cwcAssists} kiến tạo)`;
    } else if (pLine === "MF") {
      cwcGoals = Math.floor(Math.random() * 3) + 1;
      cwcAssists = Math.floor(Math.random() * 3) + 2;
      cwcResult += ` (${cwcMatches} trận | ⚽ ${cwcGoals} bàn, 🎯 ${cwcAssists} kiến tạo)`;
    } else if (pLine === "DF") {
      cwcCS = Math.floor(Math.random() * 2) + 2;
      cwcTackles = 12;
      cwcResult += ` (${cwcMatches} trận | 🛡️ 12 tắc bóng, ${cwcCS} sạch lưới)`;
    } else {
      cwcCS = Math.floor(Math.random() * 2) + 2;
      cwcSaves = 16;
      cwcResult += ` (${cwcMatches} trận | 🧤 ${cwcCS} sạch lưới, 16 cứu thua)`;
    }

    seasonMatches += cwcMatches; seasonGoals += cwcGoals; seasonAssists += cwcAssists;
    seasonCleanSheets += cwcCS; seasonSaves += cwcSaves; seasonTackles += cwcTackles;
    seasonReportRows.push({ icon: "🌐", title: "[FIFA Club World Cup]", text: cwcResult });
  }

  // 7. [ĐỘI TUYỂN QUỐC GIA (ĐTQG)] - HIGH EFFICIENCY FOR GOAT FW (115 - 145 GOALS)
  const isCalledUp = (ovr >= 70 && player.form >= 60);
  if (isCalledUp) {
    annualCaps = Math.floor(Math.random() * 3) + 8; // 8 - 10 matches
    player.intlCaps += annualCaps;

    intlGoalsThisYear = 0;
    intlCleanSheetsThisYear = 0;
    if (pLine === "FW") {
      if (ovr >= 88 && player.form >= 75) {
        intlGoalsThisYear = Math.floor(annualCaps * (0.80 + (ovr - 88) * 0.012 + Math.random() * 0.15));
        intlGoalsThisYear = Math.min(annualCaps + 2, Math.max(6, intlGoalsThisYear));
      } else if (ovr >= 78) {
        intlGoalsThisYear = Math.max(4, Math.floor(annualCaps * (0.60 + Math.random() * 0.15)));
      } else {
        intlGoalsThisYear = Math.max(2, Math.floor((ovr / 100) * (annualCaps * 0.55)));
      }
    } else if (pLine === "MF") {
      intlGoalsThisYear = Math.floor((ovr / 100) * (annualCaps * 0.45));
    } else {
      intlCleanSheetsThisYear = Math.max(2, Math.floor((ovr / 100) * (annualCaps * 0.60)));
      player.intlCleanSheets += intlCleanSheetsThisYear;
    }

    intlAssistsThisYear = pLine === "MF" ? Math.floor(annualCaps * 0.45) : (pLine === "FW" ? Math.floor(annualCaps * 0.25) : 0);
    intlSavesThisYear = pLine === "GK" ? Math.floor(annualCaps * 4.2) : 0;
    intlTacklesThisYear = pLine === "DF" ? Math.floor(annualCaps * 3.5) : 0;

    let tourneyName = "";
    let isMajorYear = false;
    if (curYear % 4 === 0) {
      tourneyName = "FIFA World Cup"; isMajorYear = true;
    } else if ((curYear - 2) % 4 === 0) {
      if (player.nationality.region === "UEFA") { tourneyName = "UEFA European Championship (Euro)"; isMajorYear = true; }
      else if (player.nationality.region === "CONMEBOL") { tourneyName = "Copa América"; isMajorYear = true; }
    } else if ((curYear - 3) % 4 === 0 && player.nationality.region === "ASIA") {
      tourneyName = "AFC Asian Cup"; isMajorYear = true;
    }

    let intlResultText = "";
    if (isMajorYear) {
      let tPower = ovr + (player.morale * 0.2) + (Math.random() * 16 - 8);

      if (pLine === "FW") {
        if (tPower >= 74) {
          intlGoalsThisYear = (ovr >= 88 && player.form >= 75)
            ? (Math.floor(Math.random() * 4) + 6)
            : (Math.floor(Math.random() * 3) + 4);
        } else {
          intlGoalsThisYear = Math.floor(Math.random() * 3) + 3;
        }
      }

      let intlDesc = pLine === "GK" || pLine === "DF" ? `${intlCleanSheetsThisYear} sạch lưới` : `${intlGoalsThisYear} bàn, ${intlAssistsThisYear} kiến tạo`;

      if (tPower >= 94 && Math.random() < 0.55) {
        addTrophy(player, tourneyName);
        seasonTrophiesWonList.push(tourneyName);
        player.fame += 1200;
        intlResultText = `🏆 VÔ ĐỊCH ${tourneyName} ${curYear}! (${annualCaps} trận | ⚽ ${intlDesc})`;
      } else if (tPower >= 82) {
        intlResultText = `🥈 Á Quân ${tourneyName} ${curYear} (${annualCaps} trận | ${intlDesc})`;
      } else if (tPower >= 74) {
        intlResultText = `Bán kết ${tourneyName} ${curYear} (${annualCaps} trận | ${intlDesc})`;
      } else if (tPower >= 65) {
        intlResultText = `Tứ kết ${tourneyName} ${curYear} (${annualCaps} trận | ${intlDesc})`;
      } else {
        intlResultText = `Vòng bảng ${tourneyName} ${curYear} (${annualCaps} trận | ${intlDesc})`;
      }

      // Đánh giá Vua Phá Lưới & Vua Kiến Tạo giải đấu ĐTQG
      if (tourneyName) {
        const intlScorerTitle = `Vua Phá Lưới ${tourneyName}`;
        const intlPlaymakerTitle = `Vua Kiến Tạo ${tourneyName}`;
        if (intlGoalsThisYear >= 6) {
          if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
          if (!player.seasonTrophiesWonThisYear.includes(intlScorerTitle)) {
            player.seasonTrophiesWonThisYear.push(intlScorerTitle);
            addTrophy(player, intlScorerTitle);
            seasonTrophiesWonList.push(intlScorerTitle);
            player.fame += 800;
            player.morale = Math.min(100, (player.morale || 70) + 10);
            seasonReportRows.push({ icon: "👟", title: `[Vua Phá Lưới ${tourneyName}]`, text: `🥇 VUA PHÁ LƯỚI ${tourneyName} (${intlGoalsThisYear} bàn thắng!)` });
          }
        }
        if (intlAssistsThisYear >= 4) {
          if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
          if (!player.seasonTrophiesWonThisYear.includes(intlPlaymakerTitle)) {
            player.seasonTrophiesWonThisYear.push(intlPlaymakerTitle);
            addTrophy(player, intlPlaymakerTitle);
            seasonTrophiesWonList.push(intlPlaymakerTitle);
            player.fame += 600;
            player.morale = Math.min(100, (player.morale || 70) + 8);
            seasonReportRows.push({ icon: "🎯", title: `[Vua Kiến Tạo ${tourneyName}]`, text: `🎯 VUA KIẾN TẠO ${tourneyName} (${intlAssistsThisYear} kiến tạo!)` });
          }
        }

        const isIntlChamp = intlResultText.includes("VÔ ĐỊCH");
        const isIntlRunnerUp = intlResultText.includes("Á Quân");
        const intlMvpTitle = (tourneyName.includes("World Cup"))
          ? "Quả Bóng Vàng FIFA World Cup (World Cup Best Player)"
          : `Cầu Thủ Xuất Sắc Nhất ${tourneyName}`;

        const intlMvpScore = calculateTournamentMvpScore({
          matches: annualCaps,
          goals: intlGoalsThisYear,
          assists: intlAssistsThisYear,
          cleanSheets: intlCleanSheetsThisYear,
          tackles: intlTacklesThisYear,
          saves: intlSavesThisYear,
          avgRating: player.lastSeasonAvgRating || 0
        }, player.position, isIntlChamp, isIntlRunnerUp, { isCup: true });

        const aiBenchmarkIntlMvp = tourneyName.includes("World Cup") ? 115 : 108; // World Cup / EURO: 100 – 125 điểm
        if (intlMvpScore >= aiBenchmarkIntlMvp && annualCaps >= 4) {
          if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
          if (!player.seasonTrophiesWonThisYear.includes(intlMvpTitle)) {
            player.seasonTrophiesWonThisYear.push(intlMvpTitle);
            addTrophy(player, intlMvpTitle);
            player.trophiesCount = (player.trophiesCount || 0) + 1;
            player.careerTrophies = (player.careerTrophies || 0) + 1;
            seasonTrophiesWonList.push(intlMvpTitle);
            player.fame += 1200;
            player.morale = Math.min(100, (player.morale || 70) + 10);
            if (!player.individualAwards) player.individualAwards = [];
            player.individualAwards.push({
              id: `intl_mvp_${player.year || 2026}`,
              name: intlMvpTitle,
              year: player.year || 2026,
              age: player.age || 17,
              stat: `${intlMvpScore} điểm MVP`,
              icon: "🏅"
            });
            seasonReportRows.push({
              icon: "🏅",
              title: `[Cầu Thủ XS Nhất ${tourneyName}]`,
              text: `🥇 ${intlMvpTitle.toUpperCase()} (${intlMvpScore} điểm MVP!)`
            });
            recordChronicleMilestone(player, 'MVP_AWARD', {
              title: intlMvpTitle,
              desc: `Giành danh hiệu ${intlMvpTitle} với ${intlMvpScore} điểm MVP!`,
              badge: "🏅 CẦU THỦ XUẤT SẮC NHẤT",
              badgeColor: "gold",
              category: "individual",
              icon: "🏅"
            });
          }
        }
      }
    } else {
      if (pLine === "FW") {
        if (ovr >= 88 && player.form >= 75) {
          intlGoalsThisYear = Math.floor(annualCaps * (0.75 + (ovr - 88) * 0.01 + Math.random() * 0.12));
          intlGoalsThisYear = Math.min(10, Math.max(6, intlGoalsThisYear));
        } else if (ovr >= 78) {
          intlGoalsThisYear = Math.max(3, Math.floor(annualCaps * (0.50 + Math.random() * 0.12)));
        } else {
          intlGoalsThisYear = Math.max(1, Math.floor((ovr / 100) * (annualCaps * 0.45)));
        }
      }

      let subName = player.nationality.subTourney || "Vòng Loại Quốc Tế";
      if (pLine === "GK" || pLine === "DF") {
        intlResultText = `${subName} (${annualCaps} trận | 🧤 ${intlCleanSheetsThisYear} trận sạch lưới)`;
      } else {
        intlResultText = `${subName} (${annualCaps} trận | ⚽ ${intlGoalsThisYear} bàn, ${intlAssistsThisYear} kiến tạo)`;
      }
    }

    player.intlGoals += intlGoalsThisYear;
    player.totalCareerGoals += intlGoalsThisYear;

    seasonMatches += annualCaps;
    seasonGoals += intlGoalsThisYear;
    seasonAssists += intlAssistsThisYear;
    seasonCleanSheets += intlCleanSheetsThisYear;
    seasonSaves += intlSavesThisYear;
    seasonTackles += intlTacklesThisYear;

    seasonReportRows.push({ icon: "🚩", title: `[ĐTQG ${player.nationality.name}]`, text: intlResultText });
  }

  // Đồng bộ toàn bộ thống kê và cúp vô địch thực tế từ các giải đấu matchday
  if (hasMatchdayStats) {
    seasonMatches = player.currentSeasonStats.matches || seasonMatches;
    seasonGoals = player.currentSeasonStats.goals !== undefined ? player.currentSeasonStats.goals : seasonGoals;
    seasonAssists = player.currentSeasonStats.assists !== undefined ? player.currentSeasonStats.assists : seasonAssists;
    seasonCleanSheets = player.currentSeasonStats.cleanSheets !== undefined ? player.currentSeasonStats.cleanSheets : seasonCleanSheets;
    seasonSaves = player.currentSeasonStats.saves !== undefined ? player.currentSeasonStats.saves : seasonSaves;
    seasonTackles = player.currentSeasonStats.tackles !== undefined ? player.currentSeasonStats.tackles : seasonTackles;

    const domesticWinner = player.tournamentBrackets?.domesticCup?.winner;
    const isDomesticChamp = (player.cupStage === 'champion' && (player.currentSeasonFixtures || []).some(f => f.competitionType === 'DOMESTIC_CUP')) || 
      (domesticWinner && (isSameClub(domesticWinner, player.club) || isSameClub(domesticWinner, player.currentClub)));
    if (isDomesticChamp) {
      wonMainCupThisYear = true;
      addTrophy(player, curLeague.domesticCup);
      if (!seasonTrophiesWonList.includes(curLeague.domesticCup)) seasonTrophiesWonList.push(curLeague.domesticCup);
    }

    const euroWinner = player.tournamentBrackets?.continentalCup?.winner;
    const isEuroChamp = player.wonYouthC1 || player.wonUCL || 
      (euroWinner && (isSameClub(euroWinner, player.club) || isSameClub(euroWinner, player.currentClub)));
    if (isEuroChamp) {
      wonEuroC1ThisYear = true;
      const euroName = player.isAcademyStage 
        ? "UEFA Youth League (Cúp C1 Trẻ)" 
        : (player.currentEuroStatus === "C2" ? "UEFA Europa League" : "UEFA Champions League");
      addTrophy(player, euroName);
      if (!seasonTrophiesWonList.includes(euroName)) seasonTrophiesWonList.push(euroName);
    }

    // Chấm giải thưởng cá nhân cho các Cúp từ dữ liệu cupTrackers thời gian thực
    const cupAwards = evaluateAndAwardCupAwards(player, 'all', { seasonTrophiesWonList });
    if (cupAwards?.domestic?.wonScorer) {
      seasonReportRows.push({ icon: "👟", title: "[Vua Phá Lưới Cúp QG]", text: `🥇 ${cupAwards.domestic.topScorerTitle} (${cupAwards.domestic.playerGoals} bàn thắng!)` });
    }
    if (cupAwards?.domestic?.wonPlaymaker) {
      seasonReportRows.push({ icon: "🎯", title: "[Vua Kiến Tạo Cúp QG]", text: `🎯 ${cupAwards.domestic.topPlaymakerTitle} (${cupAwards.domestic.playerAssists} kiến tạo!)` });
    }
    if (cupAwards?.domestic?.wonMvp) {
      seasonReportRows.push({ icon: "🏅", title: "[Cầu Thủ XS Nhất Cúp QG]", text: `🥇 ${cupAwards.domestic.mvpTitle} (${cupAwards.domestic.playerMvpScore} điểm MVP!)` });
    }
    if (cupAwards?.continental?.wonScorer) {
      seasonReportRows.push({ icon: "👟", title: "[Vua Phá Lưới Cúp Châu Âu]", text: `🥇 ${cupAwards.continental.topScorerTitle} (${cupAwards.continental.playerGoals} bàn thắng!)` });
    }
    if (cupAwards?.continental?.wonPlaymaker) {
      seasonReportRows.push({ icon: "🎯", title: "[Vua Kiến Tạo Cúp Châu Âu]", text: `🎯 ${cupAwards.continental.topPlaymakerTitle} (${cupAwards.continental.playerAssists} kiến tạo!)` });
    }
    if (cupAwards?.continental?.wonMvp) {
      seasonReportRows.push({ icon: "🏅", title: "[Cầu Thủ XS Nhất Cúp Châu Âu]", text: `🥇 ${cupAwards.continental.mvpTitle} (${cupAwards.continental.playerMvpScore} điểm MVP!)` });
    }
  }

  // Underdog Miracle Check
  const isUnderdogClub = (player.currentClub && (player.currentClub.league.tierLevel <= 2 || player.currentClub.power <= 80));
  const isUnderdogMiracle = isUnderdogClub && (wonLeagueThisYear || wonEuroC1ThisYear);

  if (isUnderdogMiracle) {
    seasonReportRows.push({
      icon: "🌟",
      title: "[KỲ TÍCH LỊCH SỬ]",
      text: `Tạo nên địa chấn thế kỷ khi đưa CLB ngựa ô ${player.currentClub.name} bước lên đỉnh vinh quang! (Điểm QBV nhân x1.5)`
    });
  }

  // 8. BALLON D'OR VOTING & ANNUAL INDIVIDUAL AWARDS
  const ballonDorEval = evaluateBallonDor(player, seasonTrophiesWonList, seasonGoals, seasonAssists, seasonCleanSheets, seasonSaves, isUnderdogMiracle);
  seasonReportRows.push({ icon: "👑", title: "[Bình chọn Quả Bóng Vàng]", text: ballonDorEval.text });

  // Annual Individual Awards (Chiếc Giày Vàng, FIFA The Best, FIFPRO World 11, Găng Tay Vàng)
  const annualAwardsWon = evaluateAnnualAwards(player, seasonGoals, hasMatchdayStats ? seasonGoals : lGoals, seasonCleanSheets, isUnderdogMiracle, ballonDorEval);
  if (annualAwardsWon.length > 0) {
    seasonReportRows.push({
      icon: "🌟",
      title: "[Giải Thưởng Cá Nhân Mùa Giải]",
      text: annualAwardsWon.join(" | ")
    });
  }

  calculateTransfermarktValue(player);
  const growthVal = player.marketValue - previousMarketValue;
  const growthSign = growthVal >= 0 ? "+" : "";
  const growthText = `(Biến động: ${growthSign}${(growthVal / 1000000).toFixed(1)}M €)`;
  seasonReportRows.push({ icon: "🏷️", title: "[Định giá Transfermarkt]", text: `${(player.marketValue / 1000000).toFixed(1)}M € ${growthText}` });

  player.seasonMaxGoals = Math.max(player.seasonMaxGoals || 0, seasonGoals);

  const rivalReport = updateRivalStats(player, ballonDorEval.won, seasonTrophiesWonList);
  if (rivalReport) {
    seasonReportRows.push({ icon: "⚔️", title: "[Kình Địch Cùng Thời]", text: rivalReport });
  }

  // 9. [MÙA TỚI]: Qualification Status & Multi-Tier Prestige Climber
  let qualText = "";
  if (curLeague.id === "SAUDI_PRO") {
    if (simulatedRank === 1) {
      player.nextSeasonEuroStatus = "C1";
      qualText = "Vé dự AFC Champions League Elite (C1 Châu Á)";
      compTier.clubPrestige = Math.min(99, compTier.clubPrestige + 10);
    } else if (simulatedRank <= 3) {
      player.nextSeasonEuroStatus = "C2";
      qualText = "Vé dự AFC Champions League Two (C2 Châu Á)";
      compTier.clubPrestige = Math.min(99, compTier.clubPrestige + 5);
    } else {
      player.nextSeasonEuroStatus = "NONE";
      qualText = "Không có suất cúp Châu Á";
    }
  } else if (curLeague.id === "MLS_AMERICAS") {
    if (simulatedRank <= 2) {
      player.nextSeasonEuroStatus = "C1";
      qualText = "Vé dự CONCACAF Champions Cup / Libertadores";
      compTier.clubPrestige = Math.min(99, compTier.clubPrestige + 10);
    } else {
      player.nextSeasonEuroStatus = "NONE";
      qualText = "Không có suất Cúp Châu Lục";
    }
  } else {
    if (simulatedRank <= 4) {
      player.nextSeasonEuroStatus = "C1";
      qualText = "Đủ điều kiện dự UEFA Champions League (C1) ⭐";
      compTier.clubPrestige = Math.min(99, compTier.clubPrestige + 8);
      compTier.relegationThreat = false;
    } else if (simulatedRank === 5) {
      player.nextSeasonEuroStatus = "C2";
      qualText = "Giành vé dự UEFA Europa League (C2)";
      compTier.clubPrestige = Math.min(99, compTier.clubPrestige + 4);
      compTier.relegationThreat = false;
    } else if (simulatedRank === 6) {
      player.nextSeasonEuroStatus = "C3";
      qualText = "Giành vé dự UEFA Europa Conference League (C3)";
      compTier.clubPrestige = Math.min(99, compTier.clubPrestige + 2);
      compTier.relegationThreat = false;
    } else {
      player.nextSeasonEuroStatus = "NONE";
      qualText = "Không có vé dự cúp Châu Âu mùa sau";
    }

    // Kiểm tra Thăng hạng / Xuống hạng Đấu trường Đa Cấp Độ:
    if (compTier.currentTier === 2 && simulatedRank <= 2) {
      compTier.promotionStatus = "PROMOTED";
      compTier.clubPrestige = Math.min(99, compTier.clubPrestige + 15);
      seasonReportRows.push({
        icon: "🚀",
        title: "[THĂNG HẠNG TIER ĐỈNH CAO]",
        text: `Chiến tích vang dội đưa CLB ${player.currentClub.name} thăng hạng lên Tier 1 Đỉnh Cao Châu Âu mùa giải tới!`
      });
      recordChronicleMilestone(player, 'TIER_PROMOTION', {
        title: "Thăng Hạng Lên Đấu Trường Đỉnh Cao",
        desc: `Cán đích vị trí Á Quân/Vô Địch tại ${curLeague.name}, đưa ${player.currentClub.name} thăng hạng rực rỡ!`
      });
    } else if (compTier.currentTier === 1 && simulatedRank >= (curLeague.totalTeams - 2)) {
      compTier.relegationThreat = true;
      compTier.clubPrestige = Math.max(30, compTier.clubPrestige - 15);
      seasonReportRows.push({
        icon: "⚠️",
        title: "[CẢNH BÁO XUỐNG HẠNG]",
        text: `CLB rơi vào nhóm 3 đội cuối bảng (${simulatedRank}/${curLeague.totalTeams}). Uy tín bị tổn hại, đối mặt nguy cơ rớt xuống Tier 2!`
      });
    }
  }

  // Ghi nhận cột mốc danh hiệu nếu có
  if (wonLeagueThisYear) {
    recordChronicleMilestone(player, 'FIRST_LEAGUE_TITLE', {
      desc: `Đăng quang ngôi vô địch ${curLeague.name} cùng ${player.currentClub.name}!`
    });
  }
  if (wonEuroC1ThisYear) {
    recordChronicleMilestone(player, 'FIRST_C1_TITLE', {
      desc: `Đưa ${player.currentClub.name} bước lên đỉnh vinh quang UEFA Champions League danh giá!`
    });
  }
  if (annualAwardsWon.some(a => a.includes("Chiếc Giày Vàng"))) {
    recordChronicleMilestone(player, 'GOLDEN_SHOE', {
      desc: `Ghi ${seasonGoals} bàn thắng để đoạt Chiếc Giày Vàng Châu Âu!`
    });
  }
  if (ballonDorEval.won) {
    recordChronicleMilestone(player, 'BALLON_D_OR', {
      desc: `Bước lên ngai vàng bóng đá thế giới với Quả Bóng Vàng danh giá!`
    });
  }

  seasonReportRows.push({ icon: "🎯", title: "[Mùa Tới]", text: qualText });

  // 10. COMMIT STATS: Single Source of Truth approach
  // ─────────────────────────────────────────────────────────────────────────────────
  // seasonMatches/Goals/Assists/etc is the FINAL correct sum for this season.
  // We commit it ONCE here to careerStats and the legacy totalCareer* aliases.
  // The phase accumulator (currentSeasonStats) is used only for interim display.

  // Ensure careerStats object exists (migration safety)
  if (!player.careerStats) {
    player.careerStats = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 };
  }
  if (!player.currentSeasonStats) {
    player.currentSeasonStats = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 };
  }

  // Step A: Remove the interim phase counts that were added during the season
  player.careerStats.matches -= (player.currentSeasonStats.matches || 0);
  player.careerStats.goals -= (player.currentSeasonStats.goals || 0);
  player.careerStats.assists -= (player.currentSeasonStats.assists || 0);
  player.careerStats.cleanSheets -= (player.currentSeasonStats.cleanSheets || 0);
  player.careerStats.saves -= (player.currentSeasonStats.saves || 0);
  player.careerStats.tackles -= (player.currentSeasonStats.tackles || 0);

  // Step B: Add the definitive season totals
  player.careerStats.matches += seasonMatches;
  player.careerStats.goals += seasonGoals;
  player.careerStats.assists += seasonAssists;
  player.careerStats.cleanSheets += seasonCleanSheets;
  player.careerStats.saves += seasonSaves;
  player.careerStats.tackles += seasonTackles;

  // Clamp to non-negative
  Object.keys(player.careerStats).forEach(k => {
    player.careerStats[k] = Math.max(0, player.careerStats[k]);
  });

  // Step C: Sync legacy aliases so existing UI code still works
  player.totalCareerMatches = player.careerStats.matches;
  player.totalCareerGoals = player.careerStats.goals;
  player.totalCareerAssists = player.careerStats.assists;
  player.totalCareerCleanSheets = player.careerStats.cleanSheets;
  player.totalCareerSaves = player.careerStats.saves;
  player.totalCareerTackles = player.careerStats.tackles;

  // Step D: Club split (from career minus intl)
  player.clubMatches = Math.max(0, player.careerStats.matches - (player.intlCaps || 0));
  player.clubGoals = Math.max(0, player.careerStats.goals - (player.intlGoals || 0));
  player.clubAssists = Math.max(0, player.careerStats.assists - (player.intlAssists || 0));

  // Step E: Push season snapshot to history
  if (!player.seasonHistory) player.seasonHistory = [];
  player.seasonHistory.push({
    season: player.seasonsPlayed || 0,
    year: player.year || 2026,
    club: player.currentClub?.name || '',
    matches: seasonMatches,
    goals: seasonGoals,
    assists: seasonAssists,
    cleanSheets: seasonCleanSheets,
    trophies: seasonTrophiesWonList.slice(),
    tactic: player.tactic || 'BALANCED',
  });

  // Step F: Reset current season stats accumulator for next season
  player.currentSeasonStats = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 };

  // Apply Stam cost from tactic
  if (tacticCfg && tacticCfg.stamCostMult && tacticCfg.stamCostMult > 1) {
    const extraCost = Math.round((tacticCfg.stamCostMult - 1) * 20);
    player.stam = Math.max(5, (player.stam || 60) - extraCost);
  }

  player.wonLeagueLastSeason = wonLeagueThisYear;
  player.wonMainCupLastSeason = wonMainCupThisYear;
  player.wonEuroC1LastSeason = wonEuroC1ThisYear;
  player.wonEuroC2LastSeason = wonEuroC2ThisYear;
  player.lastSeasonLeagueRank = simulatedRank;
  player.currentEuroStatus = player.nextSeasonEuroStatus;

  const seasonTrophiesWon = seasonTrophiesWonList.length;
  player.careerTrophies = player.trophiesTotal;

  let seasonTotalSummary = "";
  if (pLine === "GK") {
    seasonTotalSummary = `Tổng ${seasonMatches} trận | 🧤 ${seasonCleanSheets} trận sạch lưới | 🛡️ ${seasonSaves} pha cứu thua | Đoạt ${seasonTrophiesWon} danh hiệu`;
  } else if (pLine === "DF") {
    seasonTotalSummary = `Tổng ${seasonMatches} trận | 🛡️ ${seasonTackles} pha tắc bóng | 🧤 ${seasonCleanSheets} trận sạch lưới | Đoạt ${seasonTrophiesWon} danh hiệu`;
  } else {
    seasonTotalSummary = `Tổng ${seasonMatches} trận | ⚽ ${seasonGoals} bàn thắng | 🎯 ${seasonAssists} kiến tạo | Đoạt ${seasonTrophiesWon} danh hiệu`;
  }

  let sponsorBonusPayout = 0;
  if (player.activeSponsor) {
    const sp = SPONSORSHIPS_DATA.find(s => s.id === player.activeSponsor);
    if (sp) {
      const activeAgent = AGENTS_DATA.find(a => a.id === (player.activeAgent || "agent_family"));
      const spMult = 1 + (activeAgent?.sponsorBoost || 0);
      const rawBonus = (seasonGoals * sp.goalBonus) + (seasonTrophiesWonList.length * sp.trophyBonus);
      sponsorBonusPayout = Math.round(rawBonus * spMult);
      player.money += sponsorBonusPayout;
    }
  }

  let finalActionReport = actionReport;
  if (totalYield > 0) finalActionReport += ` [Đầu tư sinh lời: +$${(totalYield / 1000).toFixed(0)}k]`;
  if (subsReportText) finalActionReport += subsReportText;
  if (sponsorBonusPayout > 0) finalActionReport += ` [Thưởng tài trợ: +$${(sponsorBonusPayout / 1000).toFixed(0)}k]`;

  return {
    seasonReportRows,
    seasonTotalSummary,
    finalActionReport,
    seasonMatches,
    seasonGoals,
    seasonAssists,
    seasonCleanSheets,
    seasonSaves,
    seasonTackles,
    seasonTrophiesWonList,
    seasonTrophiesWon,
    isTrophyWin: seasonTrophiesWonList.length > 0 || isUnderdogMiracle,
    ballonDorResult: ballonDorEval,
    totsResult
  };
}

/* =========================================================================
   4.5. KIỂM TRA & GHI NHẬN DANH HIỆU TẬP THỂ & CÁ NHÂN (LEAGUE & INDIVIDUAL AWARDS)
   ========================================================================= */

/**
 * Kiểm tra bảng xếp hạng VĐQG và trao cúp vô địch nếu CLB của người chơi đứng Top 1
 * Áp dụng khi hoàn thành vòng đấu cuối cùng của giải VĐQG (vòng 18/18 hoặc hết mùa)
 * @param {object} player 
 * @returns {string|null} Tên danh hiệu nếu vô địch, ngược lại null
 */
export function checkAndAwardLeagueTitle(player) {
  const p = player || (typeof getPlayer === 'function' ? getPlayer() : null) || (typeof window !== 'undefined' && window.gameState?.player);
  if (!p) return null;

  const isYouth = Boolean(p.isAcademyStage || (p.age && p.age <= 16) || p.leagueId === 'YOUTH_LEAGUE');
  const trophyName = isYouth ? "Giải VĐQG U19 Academy" : (p.currentClub?.league?.domesticLeagueCup || "Giải VĐQG");

  if (!p.seasonTrophiesWonThisYear) p.seasonTrophiesWonThisYear = [];
  if (p.seasonTrophiesWonThisYear.includes(trophyName)) return trophyName; // Đã trao trong mùa này

  const activeClub = getPlayerActiveClub ? getPlayerActiveClub(p) : (p.academy || p.club || p.currentClub);
  const table = p.leagueTable;

  let isTop1 = false;
  if (table && Array.isArray(table) && table.length > 0) {
    // Sắp xếp lại BXH chuẩn xác: Điểm > Hiệu số > Bàn thắng
    table.sort((a, b) => {
      if ((b.points || 0) !== (a.points || 0)) return (b.points || 0) - (a.points || 0);
      if ((b.gd || 0) !== (a.gd || 0)) return (b.gd || 0) - (a.gd || 0);
      return (b.gf || 0) - (a.gf || 0);
    });

    const leader = table[0];
    isTop1 = Boolean(
      leader && (
        leader.isPlayerClub ||
        leader.isPlayer ||
        isSameClub(leader, activeClub) ||
        isClubMatch(leader, activeClub) ||
        (p.club && isSameClub(leader, p.club)) ||
        (p.academy && isSameClub(leader, p.academy))
      )
    );
  } else {
    // Nếu không có bảng xếp hạng chi tiết (ví dụ trong mô phỏng một lần)
    isTop1 = true;
  }

  if (isTop1) {
    p.seasonTrophiesWonThisYear.push(trophyName);

    // 1. Gọi addTrophy
    addTrophy(p, trophyName);

    // 2. Tăng player.trophiesCount += 1
    p.trophiesCount = (p.trophiesCount || 0) + 1;
    p.careerTrophies = (p.careerTrophies || 0) + 1;
    p.wonLeagueThisSeason = true;

    // 3. Ghi log sự kiện vào Nhật Ký Sự Nghiệp (player.logs)
    if (!p.logs) p.logs = [];
    p.logs.unshift({
      year: p.year || 2026,
      age: p.age || 16,
      title: `🏆 VÔ ĐỊCH ${trophyName.toUpperCase()}!`,
      text: `Đội bóng đứng Top 1 trên bảng xếp hạng VĐQG sau vòng đấu cuối cùng và chính thức nâng cao chiếc cúp vô địch danh giá ${trophyName}!`,
      type: "trophy-win",
      timestamp: Date.now()
    });

    // 4. Ghi Biên Niên Sử (Milestones)
    recordChronicleMilestone(p, 'FIRST_LEAGUE_TITLE', {
      title: `Vô Địch ${trophyName}`,
      desc: `Cùng đội bóng thống trị bảng xếp hạng và đăng quang ngôi vô địch ${trophyName}!`,
      badge: "🏆 NHÀ VÔ ĐỊCH QUỐC GIA",
      badgeColor: "gold",
      category: "trophies",
      icon: "🏆"
    });

    return trophyName;
  }

  return null;
}

/**
 * Kiểm tra và trao danh hiệu cá nhân cuối mùa (Vua Phá Lưới & Vua Kiến Tạo)
 * @param {object} player 
 * @returns {object} { topScorer: boolean, topPlaymaker: boolean }
 */
export function checkAndAwardIndividualYouthAwards(player) {
  const p = player || (typeof getPlayer === 'function' ? getPlayer() : null) || (typeof window !== 'undefined' && window.gameState?.player);
  if (!p) return { topScorer: false, topPlaymaker: false };

  const seasonGoals = p.currentSeasonStats?.goals !== undefined ? p.currentSeasonStats.goals : (p.goals || 0);
  const seasonAssists = p.currentSeasonStats?.assists !== undefined ? p.currentSeasonStats.assists : (p.assists || 0);

  if (!p.individualAwards) p.individualAwards = [];
  if (!p.records) p.records = [];
  if (!p.seasonTrophiesWonThisYear) p.seasonTrophiesWonThisYear = [];
  if (!p.logs) p.logs = [];

  let isTopScorer = false;
  let isTopPlaymaker = false;

  // 1. Kiểm tra VUA PHÁ LƯỚI
  const topScorers = p.leagueTopScorers || [];
  if (seasonGoals > 0) {
    const otherScorers = topScorers.filter(s => !s.isPlayer);
    const maxOtherGoals = otherScorers.length > 0 ? Math.max(...otherScorers.map(s => s.goals || 0)) : 0;
    if (seasonGoals >= maxOtherGoals || (topScorers[0] && topScorers[0].isPlayer)) {
      isTopScorer = true;
    }
  }

  const topScorerTitle = "Vua Phá Lưới Giải Trẻ (Top Scorer)";
  if (isTopScorer && !p.seasonTrophiesWonThisYear.includes(topScorerTitle)) {
    p.seasonTrophiesWonThisYear.push(topScorerTitle);
    addTrophy(p, topScorerTitle);
    p.trophiesCount = (p.trophiesCount || 0) + 1;
    p.careerTrophies = (p.careerTrophies || 0) + 1;

    p.individualAwards.push({
      id: `top_scorer_${p.year || 2026}`,
      name: topScorerTitle,
      year: p.year || 2026,
      age: p.age || 16,
      stat: `${seasonGoals} bàn thắng`,
      icon: "👟"
    });

    p.records.push({
      id: `top_scorer_${p.year || 2026}`,
      title: topScorerTitle,
      holder: p.name || "Cầu thủ",
      value: `${seasonGoals} bàn thắng`,
      year: p.year || 2026
    });

    p.logs.unshift({
      year: p.year || 2026,
      age: p.age || 16,
      title: `🥇 ${topScorerTitle.toUpperCase()}!`,
      text: `Đứng đầu danh sách ghi bàn giải đấu với ${seasonGoals} bàn thắng! Vinh dự nhận danh hiệu cá nhân Vua Phá Lưới danh giá!`,
      type: "trophy-win",
      timestamp: Date.now()
    });

    recordChronicleMilestone(p, 'GOLDEN_SHOE', {
      title: topScorerTitle,
      desc: `Giành danh hiệu Vua Phá Lưới giải trẻ với ${seasonGoals} bàn thắng!`,
      badge: "👟 VUA PHÁ LƯỚI",
      badgeColor: "gold",
      category: "individual",
      icon: "👟"
    });
  }

  // 2. Kiểm tra VUA KIẾN TẠO
  const topAssists = p.leagueTopAssists || [];
  if (seasonAssists > 0) {
    const otherAssists = topAssists.filter(s => !s.isPlayer);
    const maxOtherAssists = otherAssists.length > 0 ? Math.max(...otherAssists.map(s => s.assists || 0)) : 0;
    if (seasonAssists >= maxOtherAssists || (topAssists[0] && topAssists[0].isPlayer)) {
      isTopPlaymaker = true;
    }
  }

  const playmakerTitle = "Vua Kiến Tạo Giải Trẻ (Top Playmaker)";
  if (isTopPlaymaker && !p.seasonTrophiesWonThisYear.includes(playmakerTitle)) {
    p.seasonTrophiesWonThisYear.push(playmakerTitle);
    addTrophy(p, playmakerTitle);
    p.trophiesCount = (p.trophiesCount || 0) + 1;
    p.careerTrophies = (p.careerTrophies || 0) + 1;

    p.individualAwards.push({
      id: `top_playmaker_${p.year || 2026}`,
      name: playmakerTitle,
      year: p.year || 2026,
      age: p.age || 16,
      stat: `${seasonAssists} kiến tạo`,
      icon: "🎯"
    });

    p.records.push({
      id: `top_playmaker_${p.year || 2026}`,
      title: playmakerTitle,
      holder: p.name || "Cầu thủ",
      value: `${seasonAssists} kiến tạo`,
      year: p.year || 2026
    });

    p.logs.unshift({
      year: p.year || 2026,
      age: p.age || 16,
      title: `🎯 ${playmakerTitle.toUpperCase()}!`,
      text: `Đứng đầu danh sách kiến tạo giải đấu với ${seasonAssists} pha dọn cỗ thành bàn! Vinh dự nhận danh hiệu cá nhân Vua Kiến Tạo giải trẻ!`,
      type: "trophy-win",
      timestamp: Date.now()
    });

    recordChronicleMilestone(p, 'PLAYMAKER_AWARD', {
      title: playmakerTitle,
      desc: `Giành danh hiệu Vua Kiến Tạo giải trẻ với ${seasonAssists} đường kiến tạo thành bàn!`,
      badge: "🎯 VUA KIẾN TẠO",
      badgeColor: "gold",
      category: "individual",
      icon: "🎯"
    });
  }

  // 3. Kiểm tra CẦU THỦ XUẤT SẮC NHẤT GIẢI TRẺ U19 (MVP)
  const isChampion = Boolean(p.wonLeagueThisSeason || (p.seasonTrophiesWonThisYear || []).includes("Giải VĐQG U19 Academy"));
  const secondTable = p.leagueTable && p.leagueTable[1];
  const activeClub = getPlayerActiveClub(p);
  const isRunnerUp = !isChampion && Boolean(
    secondTable && (
      secondTable.isPlayerClub ||
      isSameClub(secondTable, activeClub) ||
      (p.club && isSameClub(secondTable, p.club)) ||
      (p.academy && isSameClub(secondTable, p.academy))
    )
  );

  const playedLeagueMatches = (p.currentSeasonStats?.matches !== undefined) ? p.currentSeasonStats.matches : 22;
  const leagueCleanSheets = p.currentSeasonStats?.cleanSheets || 0;
  const leagueTackles = p.currentSeasonStats?.tackles || 0;
  const leagueSaves = p.currentSeasonStats?.saves || 0;

  const youthMvpScore = calculateTournamentMvpScore({
    matches: playedLeagueMatches,
    goals: seasonGoals,
    assists: seasonAssists,
    cleanSheets: leagueCleanSheets,
    tackles: leagueTackles,
    saves: leagueSaves,
    avgRating: p.lastSeasonAvgRating || p.matchRating || 0
  }, p.position, isChampion, isRunnerUp, { isLeague: true });

  const aiBenchmarkYouthMvp = 118; // Mốc điểm chuẩn AI giải trẻ 115 - 130 điểm
  const hasMinMatches = playedLeagueMatches >= 13; // >= 60% của 22 trận
  const isTopMvp = (youthMvpScore >= aiBenchmarkYouthMvp) && hasMinMatches;

  const mvpTitle = "Cầu Thủ Xuất Sắc Nhất Giải Trẻ U19";
  if (isTopMvp && !p.seasonTrophiesWonThisYear.includes(mvpTitle)) {
    p.seasonTrophiesWonThisYear.push(mvpTitle);
    addTrophy(p, mvpTitle);
    p.trophiesCount = (p.trophiesCount || 0) + 1;
    p.careerTrophies = (p.careerTrophies || 0) + 1;
    p.fame = (p.fame || 0) + 600;
    p.morale = Math.min(100, (p.morale || 70) + 10);

    p.individualAwards.push({
      id: `youth_mvp_${p.year || 2026}`,
      name: mvpTitle,
      year: p.year || 2026,
      age: p.age || 16,
      stat: `${youthMvpScore} điểm MVP`,
      icon: "🏅"
    });

    p.records.push({
      id: `youth_mvp_${p.year || 2026}`,
      title: mvpTitle,
      holder: p.name || "Cầu thủ",
      value: `${youthMvpScore} điểm MVP`,
      year: p.year || 2026
    });

    p.logs.unshift({
      year: p.year || 2026,
      age: p.age || 16,
      title: `🏅 ${mvpTitle.toUpperCase()}!`,
      text: `Màn trình diễn áp đảo toàn diện với ${youthMvpScore} điểm MVP đưa bạn lên đỉnh vinh quang với danh hiệu Cầu Thủ Xuất Sắc Nhất Giải Trẻ U19! (+600 Fame)`,
      type: "trophy-win",
      timestamp: Date.now()
    });

    recordChronicleMilestone(p, 'MVP_AWARD', {
      title: mvpTitle,
      desc: `Giành danh hiệu Cầu Thủ Xuất Sắc Nhất Giải Trẻ U19 với ${youthMvpScore} điểm MVP!`,
      badge: "🏅 CẦU THỦ XUẤT SẮC NHẤT",
      badgeColor: "gold",
      category: "individual",
      icon: "🏅"
    });
  }

  return { topScorer: isTopScorer, topPlaymaker: isTopPlaymaker, mvp: isTopMvp };
}

/* =========================================================================
   4.6. ĐỘI HÌNH TIÊU BIỂU MÙA GIẢI / GIẢI ĐẤU (TEAM OF THE SEASON - TOTS 4-3-3)
   ========================================================================= */

export const TOTS_LEAGUE_CANDIDATES = {
  PREMIER_LEAGUE: {
    GK: [
      { name: "David Raya", club: "Arsenal FC", rating: 8.6, baseCleanSheets: 16, baseSaves: 95 },
      { name: "Alisson Becker", club: "Liverpool FC", rating: 8.7, baseCleanSheets: 17, baseSaves: 110 },
      { name: "Ederson", club: "Manchester City", rating: 8.6, baseCleanSheets: 16, baseSaves: 90 },
      { name: "Emiliano Martínez", club: "Aston Villa", rating: 8.5, baseCleanSheets: 14, baseSaves: 125 }
    ],
    DF: [
      { name: "Joško Gvardiol", club: "Manchester City", slot: "LB", rating: 8.6, baseCS: 16, baseTk: 65, baseG: 3, baseA: 4 },
      { name: "Andrew Robertson", club: "Liverpool FC", slot: "LB", rating: 8.5, baseCS: 15, baseTk: 70, baseG: 1, baseA: 7 },
      { name: "William Saliba", club: "Arsenal FC", slot: "CB", rating: 8.8, baseCS: 18, baseTk: 85, baseG: 2, baseA: 1 },
      { name: "Virgil van Dijk", club: "Liverpool FC", slot: "CB", rating: 8.9, baseCS: 17, baseTk: 90, baseG: 4, baseA: 2 },
      { name: "Gabriel Magalhães", club: "Arsenal FC", slot: "CB", rating: 8.6, baseCS: 17, baseTk: 80, baseG: 4, baseA: 0 },
      { name: "Rúben Dias", club: "Manchester City", slot: "CB", rating: 8.7, baseCS: 16, baseTk: 78, baseG: 1, baseA: 1 },
      { name: "Trent Alexander-Arnold", club: "Liverpool FC", slot: "RB", rating: 8.7, baseCS: 15, baseTk: 60, baseG: 3, baseA: 11 },
      { name: "Ben White", club: "Arsenal FC", slot: "RB", rating: 8.5, baseCS: 17, baseTk: 75, baseG: 2, baseA: 4 },
      { name: "Pedro Porro", club: "Tottenham", slot: "RB", rating: 8.4, baseCS: 11, baseTk: 82, baseG: 3, baseA: 7 }
    ],
    MF: [
      { name: "Rodri", club: "Manchester City", slot: "CM", rating: 9.1, baseG: 8, baseA: 9, baseTk: 92 },
      { name: "Kevin De Bruyne", club: "Manchester City", slot: "LCM", rating: 9.0, baseG: 7, baseA: 18, baseTk: 45 },
      { name: "Martin Ødegaard", club: "Arsenal FC", slot: "RCM", rating: 8.8, baseG: 11, baseA: 14, baseTk: 55 },
      { name: "Declan Rice", club: "Arsenal FC", slot: "LCM", rating: 8.7, baseG: 7, baseA: 9, baseTk: 88 },
      { name: "Alexis Mac Allister", club: "Liverpool FC", slot: "CM", rating: 8.6, baseG: 6, baseA: 8, baseTk: 78 },
      { name: "Cole Palmer", club: "Chelsea FC", slot: "RCM", rating: 8.9, baseG: 22, baseA: 11, baseTk: 35 },
      { name: "Bruno Fernandes", club: "Manchester United", slot: "CM", rating: 8.5, baseG: 10, baseA: 12, baseTk: 60 }
    ],
    FW: [
      { name: "Erling Haaland", club: "Manchester City", slot: "ST", rating: 9.2, baseG: 29, baseA: 5 },
      { name: "Mohamed Salah", club: "Liverpool FC", slot: "RW", rating: 9.0, baseG: 23, baseA: 13 },
      { name: "Phil Foden", club: "Manchester City", slot: "LW", rating: 8.9, baseG: 19, baseA: 10 },
      { name: "Bukayo Saka", club: "Arsenal FC", slot: "RW", rating: 8.8, baseG: 16, baseA: 12 },
      { name: "Alexander Isak", club: "Newcastle United", slot: "ST", rating: 8.7, baseG: 21, baseA: 4 },
      { name: "Son Heung-min", club: "Tottenham", slot: "LW", rating: 8.6, baseG: 17, baseA: 9 },
      { name: "Ollie Watkins", club: "Aston Villa", slot: "ST", rating: 8.6, baseG: 19, baseA: 13 }
    ]
  },
  LA_LIGA: {
    GK: [
      { name: "Thibaut Courtois", club: "Real Madrid", rating: 8.9, baseCleanSheets: 18, baseSaves: 105 },
      { name: "Marc-André ter Stegen", club: "FC Barcelona", rating: 8.7, baseCleanSheets: 17, baseSaves: 98 },
      { name: "Jan Oblak", club: "Atletico Madrid", rating: 8.6, baseCleanSheets: 15, baseSaves: 115 },
      { name: "Unai Simón", club: "Athletic Bilbao", rating: 8.5, baseCleanSheets: 16, baseSaves: 100 }
    ],
    DF: [
      { name: "Ferland Mendy", club: "Real Madrid", slot: "LB", rating: 8.5, baseCS: 17, baseTk: 68, baseG: 1, baseA: 2 },
      { name: "Alejandro Balde", club: "FC Barcelona", slot: "LB", rating: 8.4, baseCS: 15, baseTk: 62, baseG: 1, baseA: 5 },
      { name: "Antonio Rüdiger", club: "Real Madrid", slot: "CB", rating: 8.9, baseCS: 19, baseTk: 88, baseG: 3, baseA: 1 },
      { name: "Pau Cubarsí", club: "FC Barcelona", slot: "CB", rating: 8.6, baseCS: 16, baseTk: 80, baseG: 1, baseA: 2 },
      { name: "Ronald Araújo", club: "FC Barcelona", slot: "CB", rating: 8.7, baseCS: 16, baseTk: 85, baseG: 2, baseA: 1 },
      { name: "Éder Militão", club: "Real Madrid", slot: "CB", rating: 8.7, baseCS: 17, baseTk: 82, baseG: 2, baseA: 0 },
      { name: "Dani Carvajal", club: "Real Madrid", slot: "RB", rating: 8.8, baseCS: 18, baseTk: 76, baseG: 3, baseA: 6 },
      { name: "Jules Koundé", club: "FC Barcelona", slot: "RB", rating: 8.6, baseCS: 16, baseTk: 79, baseG: 2, baseA: 4 }
    ],
    MF: [
      { name: "Jude Bellingham", club: "Real Madrid", slot: "LCM", rating: 9.2, baseG: 21, baseA: 11, baseTk: 65 },
      { name: "Federico Valverde", club: "Real Madrid", slot: "RCM", rating: 8.9, baseG: 8, baseA: 9, baseTk: 84 },
      { name: "Pedri", club: "FC Barcelona", slot: "CM", rating: 8.8, baseG: 6, baseA: 12, baseTk: 60 },
      { name: "Eduardo Camavinga", club: "Real Madrid", slot: "LCM", rating: 8.6, baseG: 3, baseA: 6, baseTk: 86 },
      { name: "Frenkie de Jong", club: "FC Barcelona", slot: "CM", rating: 8.7, baseG: 4, baseA: 8, baseTk: 70 },
      { name: "Rodrigo De Paul", club: "Atletico Madrid", slot: "RCM", rating: 8.5, baseG: 5, baseA: 8, baseTk: 75 }
    ],
    FW: [
      { name: "Vinícius Júnior", club: "Real Madrid", slot: "LW", rating: 9.3, baseG: 24, baseA: 12 },
      { name: "Kylian Mbappé", club: "Real Madrid", slot: "ST", rating: 9.3, baseG: 31, baseA: 8 },
      { name: "Lamine Yamal", club: "FC Barcelona", slot: "RW", rating: 9.0, baseG: 14, baseA: 16 },
      { name: "Robert Lewandowski", club: "FC Barcelona", slot: "ST", rating: 8.9, baseG: 25, baseA: 7 },
      { name: "Rodrygo", club: "Real Madrid", slot: "RW", rating: 8.7, baseG: 15, baseA: 9 },
      { name: "Antoine Griezmann", club: "Atletico Madrid", slot: "LW", rating: 8.8, baseG: 18, baseA: 12 },
      { name: "Nico Williams", club: "Athletic Bilbao", slot: "LW", rating: 8.6, baseG: 12, baseA: 14 }
    ]
  },
  SERIE_A: {
    GK: [
      { name: "Yann Sommer", club: "Inter Milan", rating: 8.8, baseCleanSheets: 19, baseSaves: 92 },
      { name: "Mike Maignan", club: "AC Milan", rating: 8.7, baseCleanSheets: 15, baseSaves: 108 },
      { name: "Michele Di Gregorio", club: "Juventus", rating: 8.6, baseCleanSheets: 16, baseSaves: 112 }
    ],
    DF: [
      { name: "Federico Dimarco", club: "Inter Milan", slot: "LB", rating: 8.7, baseCS: 18, baseTk: 62, baseG: 5, baseA: 8 },
      { name: "Theo Hernández", club: "AC Milan", slot: "LB", rating: 8.6, baseCS: 14, baseTk: 72, baseG: 5, baseA: 6 },
      { name: "Alessandro Bastoni", club: "Inter Milan", slot: "CB", rating: 8.8, baseCS: 19, baseTk: 84, baseG: 2, baseA: 4 },
      { name: "Bremer", club: "Juventus", slot: "CB", rating: 8.7, baseCS: 17, baseTk: 88, baseG: 3, baseA: 0 },
      { name: "Benjamin Pavard", club: "Inter Milan", slot: "CB", rating: 8.6, baseCS: 18, baseTk: 80, baseG: 1, baseA: 2 },
      { name: "Denzel Dumfries", club: "Inter Milan", slot: "RB", rating: 8.6, baseCS: 17, baseTk: 74, baseG: 4, baseA: 6 },
      { name: "Giovanni Di Lorenzo", club: "SSC Napoli", slot: "RB", rating: 8.5, baseCS: 15, baseTk: 76, baseG: 2, baseA: 5 }
    ],
    MF: [
      { name: "Nicolò Barella", club: "Inter Milan", slot: "RCM", rating: 8.9, baseG: 6, baseA: 9, baseTk: 82 },
      { name: "Hakan Çalhanoğlu", club: "Inter Milan", slot: "CM", rating: 8.9, baseG: 13, baseA: 8, baseTk: 75 },
      { name: "Teun Koopmeiners", club: "Juventus", slot: "LCM", rating: 8.7, baseG: 12, baseA: 7, baseTk: 66 },
      { name: "Henrikh Mkhitaryan", club: "Inter Milan", slot: "LCM", rating: 8.6, baseG: 5, baseA: 8, baseTk: 62 }
    ],
    FW: [
      { name: "Lautaro Martínez", club: "Inter Milan", slot: "ST", rating: 9.1, baseG: 26, baseA: 6 },
      { name: "Marcus Thuram", club: "Inter Milan", slot: "LW", rating: 8.7, baseG: 16, baseA: 9 },
      { name: "Rafael Leão", club: "AC Milan", slot: "LW", rating: 8.8, baseG: 15, baseA: 11 },
      { name: "Ademola Lookman", club: "Atalanta", slot: "RW", rating: 8.8, baseG: 17, baseA: 8 },
      { name: "Dušan Vlahović", club: "Juventus", slot: "ST", rating: 8.6, baseG: 18, baseA: 4 },
      { name: "Khvicha Kvaratskhelia", club: "SSC Napoli", slot: "RW", rating: 8.7, baseG: 13, baseA: 10 }
    ]
  },
  BUNDESLIGA: {
    GK: [
      { name: "Lukáš Hrádecký", club: "Bayer Leverkusen", rating: 8.8, baseCleanSheets: 18, baseSaves: 94 },
      { name: "Manuel Neuer", club: "Bayern Munich", rating: 8.7, baseCleanSheets: 15, baseSaves: 96 },
      { name: "Gregor Kobel", club: "Borussia Dortmund", rating: 8.7, baseCleanSheets: 15, baseSaves: 115 }
    ],
    DF: [
      { name: "Alejandro Grimaldo", club: "Bayer Leverkusen", slot: "LB", rating: 9.0, baseCS: 17, baseTk: 65, baseG: 10, baseA: 13 },
      { name: "Alphonso Davies", club: "Bayern Munich", slot: "LB", rating: 8.6, baseCS: 14, baseTk: 70, baseG: 2, baseA: 6 },
      { name: "Jonathan Tah", club: "Bayer Leverkusen", slot: "CB", rating: 8.8, baseCS: 18, baseTk: 86, baseG: 4, baseA: 1 },
      { name: "Nico Schlotterbeck", club: "Borussia Dortmund", slot: "CB", rating: 8.6, baseCS: 15, baseTk: 88, baseG: 2, baseA: 3 },
      { name: "Dayot Upamecano", club: "Bayern Munich", slot: "CB", rating: 8.6, baseCS: 15, baseTk: 82, baseG: 1, baseA: 0 },
      { name: "Jeremie Frimpong", club: "Bayer Leverkusen", slot: "RB", rating: 8.9, baseCS: 16, baseTk: 66, baseG: 9, baseA: 9 },
      { name: "Joshua Kimmich", club: "Bayern Munich", slot: "RB", rating: 8.8, baseCS: 15, baseTk: 80, baseG: 2, baseA: 10 }
    ],
    MF: [
      { name: "Florian Wirtz", club: "Bayer Leverkusen", slot: "LCM", rating: 9.2, baseG: 18, baseA: 19, baseTk: 50 },
      { name: "Granit Xhaka", club: "Bayer Leverkusen", slot: "CM", rating: 8.9, baseG: 4, baseA: 8, baseTk: 94 },
      { name: "Jamal Musiala", club: "Bayern Munich", slot: "RCM", rating: 9.0, baseG: 15, baseA: 10, baseTk: 52 },
      { name: "Julian Brandt", club: "Borussia Dortmund", slot: "RCM", rating: 8.5, baseG: 9, baseA: 12, baseTk: 44 }
    ],
    FW: [
      { name: "Harry Kane", club: "Bayern Munich", slot: "ST", rating: 9.3, baseG: 36, baseA: 10 },
      { name: "Serhou Guirassy", club: "Borussia Dortmund", slot: "ST", rating: 8.8, baseG: 26, baseA: 4 },
      { name: "Leroy Sané", club: "Bayern Munich", slot: "LW", rating: 8.7, baseG: 14, baseA: 13 },
      { name: "Michael Olise", club: "Bayern Munich", slot: "RW", rating: 8.7, baseG: 13, baseA: 11 },
      { name: "Loïs Openda", club: "RB Leipzig", slot: "LW", rating: 8.6, baseG: 24, baseA: 7 },
      { name: "Victor Boniface", club: "Bayer Leverkusen", slot: "RW", rating: 8.6, baseG: 16, baseA: 8 }
    ]
  },
  LIGUE_1: {
    GK: [
      { name: "Gianluigi Donnarumma", club: "Paris Saint-Germain", rating: 8.8, baseCleanSheets: 17, baseSaves: 102 },
      { name: "Lucas Chevalier", club: "Lille OSC", rating: 8.6, baseCleanSheets: 16, baseSaves: 110 }
    ],
    DF: [
      { name: "Nuno Mendes", club: "Paris Saint-Germain", slot: "LB", rating: 8.6, baseCS: 16, baseTk: 66, baseG: 2, baseA: 6 },
      { name: "Marquinhos", club: "Paris Saint-Germain", slot: "CB", rating: 8.8, baseCS: 18, baseTk: 85, baseG: 2, baseA: 1 },
      { name: "Willian Pacho", club: "Paris Saint-Germain", slot: "CB", rating: 8.6, baseCS: 17, baseTk: 82, baseG: 1, baseA: 0 },
      { name: "Achraf Hakimi", club: "Paris Saint-Germain", slot: "RB", rating: 8.8, baseCS: 17, baseTk: 74, baseG: 5, baseA: 8 }
    ],
    MF: [
      { name: "Vitinha", club: "Paris Saint-Germain", slot: "CM", rating: 8.9, baseG: 9, baseA: 8, baseTk: 80 },
      { name: "Warren Zaïre-Emery", club: "Paris Saint-Germain", slot: "RCM", rating: 8.7, baseG: 5, baseA: 6, baseTk: 75 },
      { name: "João Neves", club: "Paris Saint-Germain", slot: "LCM", rating: 8.7, baseG: 4, baseA: 9, baseTk: 84 }
    ],
    FW: [
      { name: "Bradley Barcola", club: "Paris Saint-Germain", slot: "LW", rating: 8.8, baseG: 18, baseA: 10 },
      { name: "Jonathan David", club: "Lille OSC", slot: "ST", rating: 8.7, baseG: 22, baseA: 6 },
      { name: "Ousmane Dembélé", club: "Paris Saint-Germain", slot: "RW", rating: 8.8, baseG: 12, baseA: 14 }
    ]
  },
  SAUDI_PRO: {
    GK: [
      { name: "Bono", club: "Al-Hilal SFC", rating: 8.8, baseCleanSheets: 18, baseSaves: 90 },
      { name: "Bento", club: "Al-Nassr FC", rating: 8.6, baseCleanSheets: 15, baseSaves: 104 }
    ],
    DF: [
      { name: "Renan Lodi", club: "Al-Hilal SFC", slot: "LB", rating: 8.5, baseCS: 16, baseTk: 65, baseG: 2, baseA: 5 },
      { name: "Kalidou Koulibaly", club: "Al-Hilal SFC", slot: "CB", rating: 8.8, baseCS: 18, baseTk: 86, baseG: 3, baseA: 0 },
      { name: "Aymeric Laporte", club: "Al-Nassr FC", slot: "CB", rating: 8.7, baseCS: 16, baseTk: 82, baseG: 3, baseA: 1 },
      { name: "Saud Abdulhamid", club: "Al-Hilal SFC", slot: "RB", rating: 8.6, baseCS: 17, baseTk: 76, baseG: 2, baseA: 7 }
    ],
    MF: [
      { name: "Rúben Neves", club: "Al-Hilal SFC", slot: "CM", rating: 8.8, baseG: 6, baseA: 11, baseTk: 80 },
      { name: "Sergej Milinković-Savić", club: "Al-Hilal SFC", slot: "LCM", rating: 8.9, baseG: 14, baseA: 12, baseTk: 70 },
      { name: "N'Golo Kanté", club: "Al-Ittihad", slot: "RCM", rating: 8.7, baseG: 3, baseA: 6, baseTk: 92 }
    ],
    FW: [
      { name: "Sadio Mané", club: "Al-Nassr FC", slot: "LW", rating: 8.7, baseG: 16, baseA: 11 },
      { name: "Cristiano Ronaldo", club: "Al-Nassr FC", slot: "ST", rating: 9.3, baseG: 35, baseA: 11 },
      { name: "Aleksandar Mitrović", club: "Al-Hilal SFC", slot: "RW", rating: 8.9, baseG: 28, baseA: 6 }
    ]
  },
  MLS_AMERICAS: {
    GK: [
      { name: "Drake Callender", club: "Inter Miami CF", rating: 8.6, baseCleanSheets: 15, baseSaves: 110 },
      { name: "Hugo Lloris", club: "Los Angeles FC", rating: 8.6, baseCleanSheets: 14, baseSaves: 105 }
    ],
    DF: [
      { name: "Jordi Alba", club: "Inter Miami CF", slot: "LB", rating: 8.7, baseCS: 14, baseTk: 64, baseG: 4, baseA: 14 },
      { name: "Walker Zimmerman", club: "Nashville SC", slot: "CB", rating: 8.5, baseCS: 15, baseTk: 85, baseG: 3, baseA: 1 },
      { name: "Miles Robinson", club: "FC Cincinnati", slot: "CB", rating: 8.5, baseCS: 16, baseTk: 82, baseG: 1, baseA: 0 },
      { name: "Sergi Palencia", club: "Los Angeles FC", slot: "RB", rating: 8.4, baseCS: 14, baseTk: 75, baseG: 1, baseA: 5 }
    ],
    MF: [
      { name: "Sergio Busquets", club: "Inter Miami CF", slot: "CM", rating: 8.8, baseG: 2, baseA: 12, baseTk: 85 },
      { name: "Riqui Puig", club: "LA Galaxy", slot: "LCM", rating: 8.7, baseG: 14, baseA: 15, baseTk: 55 },
      { name: "Luciano Acosta", club: "FC Cincinnati", slot: "RCM", rating: 8.7, baseG: 15, baseA: 16, baseTk: 45 }
    ],
    FW: [
      { name: "Denis Bouanga", club: "Los Angeles FC", slot: "LW", rating: 8.8, baseG: 23, baseA: 10 },
      { name: "Luis Suárez", club: "Inter Miami CF", slot: "ST", rating: 9.0, baseG: 25, baseA: 12 },
      { name: "Lionel Messi", club: "Inter Miami CF", slot: "RW", rating: 9.4, baseG: 26, baseA: 18 }
    ]
  },
  YOUTH_LEAGUE: {
    GK: [
      { name: "Fran González", club: "Real Madrid Castilla", rating: 8.2, baseCleanSheets: 14, baseSaves: 88 },
      { name: "Diego Kochen", club: "FC Barcelona La Masia", rating: 8.1, baseCleanSheets: 13, baseSaves: 82 },
      { name: "Elyh Harrison", club: "Man United Carrington", rating: 8.0, baseCleanSheets: 12, baseSaves: 90 }
    ],
    DF: [
      { name: "Rafael Obrador", club: "Real Madrid Castilla", slot: "LB", rating: 8.0, baseCS: 13, baseTk: 60, baseG: 1, baseA: 4 },
      { name: "Pau Cubarsí", club: "FC Barcelona La Masia", slot: "CB", rating: 8.5, baseCS: 15, baseTk: 75, baseG: 2, baseA: 1 },
      { name: "Jacobo Ramón", club: "Real Madrid Castilla", slot: "CB", rating: 8.1, baseCS: 14, baseTk: 72, baseG: 1, baseA: 0 },
      { name: "Héctor Fort", club: "FC Barcelona La Masia", slot: "RB", rating: 8.2, baseCS: 14, baseTk: 68, baseG: 2, baseA: 5 }
    ],
    MF: [
      { name: "Nico Paz", club: "Real Madrid Castilla", slot: "LCM", rating: 8.4, baseG: 12, baseA: 9, baseTk: 55 },
      { name: "Marc Bernal", club: "FC Barcelona La Masia", slot: "CM", rating: 8.3, baseG: 5, baseA: 8, baseTk: 70 },
      { name: "Ethan Nwaneri", club: "Arsenal Hale End", slot: "RCM", rating: 8.3, baseG: 11, baseA: 8, baseTk: 48 }
    ],
    FW: [
      { name: "Tyrique George", club: "Chelsea Cobham", slot: "LW", rating: 8.2, baseG: 14, baseA: 8 },
      { name: "Álvaro Rodríguez", club: "Real Madrid Castilla", slot: "ST", rating: 8.4, baseG: 19, baseA: 5 },
      { name: "Marc Guiu", club: "FC Barcelona La Masia", slot: "RW", rating: 8.3, baseG: 17, baseA: 6 }
    ]
  }
};

/**
 * Đội Hình Tiêu Biểu Mùa Giải / Giải Đấu (Team of the Season - TOTS 4-3-3)
 * @param {object} player Đối tượng người chơi
 * @param {string|object} tournamentKey Mã giải đấu hoặc tên giải
 * @param {Array} leagueTable Bảng xếp hạng giải đấu (nếu có)
 * @returns {object} Dữ liệu 11 cầu thủ xếp theo sơ đồ 4-3-3
 */
export function generateTeamOfTheSeason(player, tournamentKey, leagueTable) {
  const p = player || (typeof getPlayer === 'function' ? getPlayer() : null) || (typeof window !== 'undefined' && window.gameState?.player);
  if (!p) return null;

  const currentYear = p.year || 2026;
  if (p.lastSeasonTOTS && p.lastSeasonTOTS.year === currentYear && p.lastSeasonTOTS.lineup) {
    return p.lastSeasonTOTS;
  }

  // 1. Chuẩn hóa mã giải đấu & Tên hiển thị
  let curKey = tournamentKey;
  if (!curKey || typeof curKey !== 'string') {
    if (p.isAcademyStage || p.leagueId === 'YOUTH_LEAGUE') {
      curKey = 'YOUTH_LEAGUE';
    } else {
      curKey = p.currentClub?.league?.id || p.leagueId || 'PREMIER_LEAGUE';
    }
  }

  const TOURNAMENT_NAME_MAP = {
    PREMIER_LEAGUE: 'Premier League',
    LA_LIGA: 'La Liga',
    SERIE_A: 'Serie A',
    BUNDESLIGA: 'Bundesliga',
    LIGUE_1: 'Ligue 1',
    SAUDI_PRO: 'Saudi Pro League',
    MLS_AMERICAS: 'Major League Soccer',
    EURO_SUB: 'Liga Portugal & Eredivisie',
    YOUTH_LEAGUE: 'Giải VĐQG U19 Academy',
    UCL: 'UEFA Champions League'
  };
  const tournamentName = TOURNAMENT_NAME_MAP[curKey] || p.currentClub?.league?.name || 'Giải VĐQG';

  // 2. Phân tích bảng xếp hạng CLB
  const table = Array.isArray(leagueTable) && leagueTable.length > 0
    ? leagueTable
    : (Array.isArray(p.leagueTable) && p.leagueTable.length > 0 ? p.leagueTable : []);

  const activeClub = p.isAcademyStage ? p.academy : (p.currentClub || null);
  let isPlayerChamp = false;
  let isPlayerRunnerUp = false;

  if (table.length > 0) {
    const leader = table[0];
    const runnerUp = table[1];
    if (leader && (leader.isPlayerClub || leader.isPlayer || (activeClub && isSameClub(leader, activeClub)))) {
      isPlayerChamp = true;
    } else if (runnerUp && (runnerUp.isPlayerClub || runnerUp.isPlayer || (activeClub && isSameClub(runnerUp, activeClub)))) {
      isPlayerRunnerUp = true;
    }
  } else if (Array.isArray(p.trophies) && p.trophies.some(t => typeof t === 'string' && t.includes('Vô Địch') && t.includes(tournamentName))) {
    isPlayerChamp = true;
  }

  // 3. Chuẩn bị ứng viên AI từ bộ dữ liệu TOTS
  const rawPool = TOTS_LEAGUE_CANDIDATES[curKey] || TOTS_LEAGUE_CANDIDATES.PREMIER_LEAGUE;

  const evalAI = (c, line) => {
    let isChamp = false;
    let isRunnerUp = false;
    if (table.length > 0) {
      const cName = String(c.club || '').toLowerCase();
      if (table[0] && (table[0].clubName || table[0].name || '').toLowerCase().includes(cName)) isChamp = true;
      else if (table[1] && (table[1].clubName || table[1].name || '').toLowerCase().includes(cName)) isRunnerUp = true;
    }
    let stats = {};
    if (line === 'GK') {
      stats = { matches: 36, cleanSheets: c.baseCleanSheets, saves: c.baseSaves, avgRating: c.rating };
    } else if (line === 'DF') {
      stats = { matches: 36, cleanSheets: c.baseCS, tackles: c.baseTk, goals: c.baseG, assists: c.baseA, avgRating: c.rating };
    } else if (line === 'MF') {
      stats = { matches: 36, goals: c.baseG, assists: c.baseA, tackles: c.baseTk, avgRating: c.rating };
    } else {
      stats = { matches: 36, goals: c.baseG, assists: c.baseA, avgRating: c.rating };
    }
    const score = calculateTournamentMvpScore(stats, line, isChamp, isRunnerUp, { isLeague: true });
    let statText = "";
    if (line === 'GK') statText = `${c.baseCleanSheets} 🧤 ${c.baseSaves} 🛡️`;
    else if (line === 'DF') statText = `${c.baseCS} 🧤 ${c.baseTk} 🛡️`;
    else if (line === 'MF') statText = `${c.baseA} 🎯 ${c.baseG > 0 ? c.baseG + ' ⚽' : ''}`;
    else statText = `${c.baseG} ⚽ ${c.baseA > 0 ? c.baseA + ' 🎯' : ''}`;

    return {
      ...c,
      pos: c.slot || line,
      line,
      statText,
      mvpScore: Number(score.toFixed(1)),
      isPlayer: false
    };
  };

  const aiGK = (rawPool.GK || []).map(c => evalAI(c, 'GK'));
  const aiDF = (rawPool.DF || []).map(c => evalAI(c, 'DF'));
  const aiMF = (rawPool.MF || []).map(c => evalAI(c, 'MF'));
  const aiFW = (rawPool.FW || []).map(c => evalAI(c, 'FW'));

  // 4. Tính toán điểm số Người Chơi
  const pLine = getPlayerLine(p);
  const pPos = String(p.position || 'ST').toUpperCase();
  const pStats = {
    matches: p.currentSeasonStats?.matches || p.seasonAccumulator?.matches || (p.currentFixtureIndex != null ? p.currentFixtureIndex + 1 : 18),
    goals: p.currentSeasonStats?.goals || p.seasonAccumulator?.goals || 0,
    assists: p.currentSeasonStats?.assists || p.seasonAccumulator?.assists || 0,
    cleanSheets: p.currentSeasonStats?.cleanSheets || p.seasonAccumulator?.cs || 0,
    saves: p.currentSeasonStats?.saves || p.seasonAccumulator?.saves || 0,
    tackles: p.currentSeasonStats?.tackles || p.seasonAccumulator?.tackles || 0,
    avgRating: p.lastSeasonAvgRating || 7.5
  };
  const pMvpScore = calculateTournamentMvpScore(pStats, pLine, isPlayerChamp, isPlayerRunnerUp, { isLeague: true });

  let pStatText = "";
  if (pLine === 'GK') pStatText = `${pStats.cleanSheets} 🧤 ${pStats.saves} 🛡️`;
  else if (pLine === 'DF') pStatText = `${pStats.cleanSheets} 🧤 ${pStats.tackles} 🛡️`;
  else if (pLine === 'MF') pStatText = `${pStats.assists} 🎯 ${pStats.goals > 0 ? pStats.goals + ' ⚽' : ''}`;
  else pStatText = `${pStats.goals} ⚽ ${pStats.assists > 0 ? pStats.assists + ' 🎯' : ''}`;

  const playerCandidate = {
    name: p.name || "Bạn",
    club: p.isAcademyStage ? (p.academy?.name || "Học Viện Trẻ") : (p.currentClub?.name || "CLB"),
    pos: pPos,
    line: pLine,
    rating: Number((pStats.avgRating || 7.5).toFixed(1)),
    statText: pStatText,
    mvpScore: Number(pMvpScore.toFixed(1)),
    isPlayer: true
  };

  const hasEnoughMatches = pStats.matches >= 6;

  // 5. Tuyển chọn 11 vị trí (Sơ đồ 4-3-3: 1 GK, 4 DF, 3 MF, 3 FW)
  const lineup = {};

  // 5.1 Thủ môn (1 GK)
  const gkCandidates = [...aiGK];
  if (pLine === 'GK' && hasEnoughMatches) {
    gkCandidates.push(playerCandidate);
  }
  gkCandidates.sort((a, b) => b.mvpScore - a.mvpScore);
  lineup.gk = { ...gkCandidates[0], pos: 'GK' };

  // 5.2 Hàng hậu vệ (4 DF: LB, CB1, CB2, RB)
  const dfCandidates = [...aiDF];
  if (pLine === 'DF' && hasEnoughMatches) {
    dfCandidates.push(playerCandidate);
  }
  dfCandidates.sort((a, b) => b.mvpScore - a.mvpScore);

  const isPlayerTop4DF = pLine === 'DF' && hasEnoughMatches && dfCandidates.slice(0, 4).some(c => c.isPlayer);
  let playerAssignedSlot = null;

  if (isPlayerTop4DF) {
    if (['LB', 'LWB'].includes(pPos)) playerAssignedSlot = 'lb';
    else if (['RB', 'RWB'].includes(pPos)) playerAssignedSlot = 'rb';
    else playerAssignedSlot = 'cb1';
    lineup[playerAssignedSlot] = { ...playerCandidate, pos: pPos };
  }

  // Lấp đầy các vị trí DF còn lại
  const aiLBs = aiDF.filter(c => c.slot === 'LB');
  const aiRBs = aiDF.filter(c => c.slot === 'RB');
  const aiCBs = aiDF.filter(c => c.slot === 'CB' || (!c.slot && c.pos === 'CB'));

  if (!lineup.lb) lineup.lb = aiLBs[0] || dfCandidates.find(c => !c.isPlayer) || aiDF[0];
  if (!lineup.rb) lineup.rb = aiRBs[0] || dfCandidates.find(c => !c.isPlayer && c !== lineup.lb) || aiDF[1];
  
  const remainingCBs = aiCBs.filter(c => c !== lineup.lb && c !== lineup.rb);
  if (!lineup.cb1) lineup.cb1 = remainingCBs[0] || dfCandidates.find(c => !c.isPlayer && c !== lineup.lb && c !== lineup.rb) || aiDF[2];
  if (!lineup.cb2) lineup.cb2 = remainingCBs[1] || dfCandidates.find(c => !c.isPlayer && c !== lineup.lb && c !== lineup.rb && c !== lineup.cb1) || aiDF[3];

  // 5.3 Hàng tiền vệ (3 MF: LCM, CM, RCM)
  const mfCandidates = [...aiMF];
  if (pLine === 'MF' && hasEnoughMatches) {
    mfCandidates.push(playerCandidate);
  }
  mfCandidates.sort((a, b) => b.mvpScore - a.mvpScore);

  const isPlayerTop3MF = pLine === 'MF' && hasEnoughMatches && mfCandidates.slice(0, 3).some(c => c.isPlayer);
  if (isPlayerTop3MF) {
    let mfSlot = 'cm';
    if (['CDM', 'LM'].includes(pPos)) mfSlot = 'lcm';
    else if (['RM'].includes(pPos)) mfSlot = 'rcm';
    lineup[mfSlot] = { ...playerCandidate, pos: pPos };

    const otherMFs = mfCandidates.filter(c => !c.isPlayer);
    const slotsToFill = ['lcm', 'cm', 'rcm'].filter(s => s !== mfSlot);
    lineup[slotsToFill[0]] = { ...otherMFs[0], pos: slotsToFill[0].toUpperCase() };
    lineup[slotsToFill[1]] = { ...otherMFs[1], pos: slotsToFill[1].toUpperCase() };
  } else {
    lineup.lcm = { ...mfCandidates[0], pos: 'LCM' };
    lineup.cm = { ...mfCandidates[1], pos: 'CM' };
    lineup.rcm = { ...mfCandidates[2], pos: 'RCM' };
  }

  // 5.4 Hàng tiền đạo (3 FW: LW, ST, RW)
  const fwCandidates = [...aiFW];
  if (pLine === 'FW' && hasEnoughMatches) {
    fwCandidates.push(playerCandidate);
  }
  fwCandidates.sort((a, b) => b.mvpScore - a.mvpScore);

  const isPlayerTop3FW = pLine === 'FW' && hasEnoughMatches && fwCandidates.slice(0, 3).some(c => c.isPlayer);
  if (isPlayerTop3FW) {
    let fwSlot = 'st';
    if (pPos === 'LW') fwSlot = 'lw';
    else if (pPos === 'RW') fwSlot = 'rw';
    lineup[fwSlot] = { ...playerCandidate, pos: pPos };

    const otherFWs = fwCandidates.filter(c => !c.isPlayer);
    const slotsToFill = ['lw', 'st', 'rw'].filter(s => s !== fwSlot);
    lineup[slotsToFill[0]] = { ...otherFWs[0], pos: slotsToFill[0].toUpperCase() };
    lineup[slotsToFill[1]] = { ...otherFWs[1], pos: slotsToFill[1].toUpperCase() };
  } else {
    lineup.lw = { ...fwCandidates[0], pos: 'LW' };
    lineup.st = { ...fwCandidates[1], pos: 'ST' };
    lineup.rw = { ...fwCandidates[2], pos: 'RW' };
  }

  // 6. Kiểm tra xem Người chơi có lọt vào Đội hình tiêu biểu không
  const playerSelected = Boolean(
    (lineup.gk && lineup.gk.isPlayer) ||
    (lineup.lb && lineup.lb.isPlayer) ||
    (lineup.cb1 && lineup.cb1.isPlayer) ||
    (lineup.cb2 && lineup.cb2.isPlayer) ||
    (lineup.rb && lineup.rb.isPlayer) ||
    (lineup.lcm && lineup.lcm.isPlayer) ||
    (lineup.cm && lineup.cm.isPlayer) ||
    (lineup.rcm && lineup.rcm.isPlayer) ||
    (lineup.lw && lineup.lw.isPlayer) ||
    (lineup.st && lineup.st.isPlayer) ||
    (lineup.rw && lineup.rw.isPlayer)
  );

  // 7. Ghi nhận trạng thái, danh hiệu & truyền thông khi Người chơi lọt vào TOTS
  if (playerSelected) {
    const totsTrophyTitle = `Đội Hình Tiêu Biểu ${tournamentName}`;
    addTrophy(p, totsTrophyTitle);

    if (!p.seasonTrophiesWonThisYear) p.seasonTrophiesWonThisYear = [];
    if (!p.seasonTrophiesWonThisYear.includes(totsTrophyTitle)) {
      p.seasonTrophiesWonThisYear.push(totsTrophyTitle);
    }

    p.fame = (p.fame || 0) + 500;
    p.morale = Math.min(100, (p.morale || 70) + 5);

    if (!p.individualAwards) p.individualAwards = [];
    const awardId = `tots_${curKey}_${currentYear}`;
    if (!p.individualAwards.some(a => a.id === awardId || (a.name === totsTrophyTitle && a.year === currentYear))) {
      p.individualAwards.push({
        id: awardId,
        name: totsTrophyTitle,
        year: currentYear,
        age: p.age || 16,
        stat: `${pMvpScore.toFixed(1)} điểm MVP`,
        icon: "🌟"
      });
    }

    addMediaReaction(p, {
      category: 'AWARDS',
      badge: 'GOLD',
      source: 'Hiệp Hội Cầu Thủ & Truyền Thông',
      author: 'Hội Đồng Bình Chọn TOTS',
      role: 'Đội Hình Tiêu Biểu Mùa Giải',
      avatar: '🌟',
      headline: `CHÍNH THỨC: [Tên Cầu Thủ] được xướng tên vào Đội Hình Tiêu Biểu của giải đấu!`,
      content: `CHÍNH THỨC: [Tên Cầu Thủ] được xướng tên vào Đội Hình Tiêu Biểu của giải đấu! Một vị trí hoàn toàn xứng đáng cho phong độ phi thường xuyên suốt mùa giải.`
    });

    if (typeof recordChronicleMilestone === 'function') {
      recordChronicleMilestone(p, 'TOTS_SELECTION', {
        title: totsTrophyTitle,
        desc: `Góp mặt trong Đội Hình Tiêu Biểu Mùa Giải ${tournamentName} (Sơ đồ 4-3-3 | ${pMvpScore.toFixed(1)} điểm MVP)!`,
        badge: "🌟 ĐỘI HÌNH TIÊU BIỂU",
        badgeColor: "gold",
        category: "individual",
        icon: "🌟"
      });
    }
  }

  const totsResult = {
    tournamentKey: curKey,
    tournamentName,
    formation: "4-3-3",
    year: currentYear,
    age: p.age || 16,
    playerIncluded: playerSelected,
    playerSlot: playerSelected ? Object.keys(lineup).find(k => lineup[k].isPlayer) : null,
    playerMvpScore: Number(pMvpScore.toFixed(1)),
    lineup
  };

  p.lastSeasonTOTS = totsResult;
  return totsResult;
}

/* =========================================================================
   5. ACADEMY ROUND SIMULATION (AGE 16)
   ========================================================================= */
export function simulateAcademyRound(player, actionTitle, actionReport) {
  if (!player) return {};

  const pLine = getPlayerLine(player);
  const reachesFinal = player.seasonCupReachesFinal !== undefined ? player.seasonCupReachesFinal : true;
  const isWonYouthC1 = reachesFinal && Math.random() < 0.65;

  // 1. LẤY SỐ LIỆU THỰC TẾ NGƯỜI CHƠI ĐÃ ĐÁ TRONG SUỐT 40 VÒNG
  const curStats = player.currentSeasonStats || {};
  const playedMatches = curStats.matches || (player.currentFixtureIndex || 0);
  const playedG = curStats.goals || 0;
  const playedA = curStats.assists || 0;
  const playedCS = curStats.cleanSheets || 0;
  const playedSv = curStats.saves || 0;
  const playedTk = curStats.tackles || 0;

  // 2. TÍNH CHỈ SỐ MÔ PHỎNG NỀN
  const leagueMatches = 22;
  const cupMatches = 6;
  const uclMatches = reachesFinal ? 4 : 0;
  const simMatches = leagueMatches + cupMatches + uclMatches;

  let leagueG = 0, leagueA = 0, leagueCS = 0, leagueSv = 0, leagueTk = 0;
  let cupG = 0, cupA = 0, cupCS = 0, cupSv = 0, cupTk = 0;
  let uclG = 0, uclA = 0, uclCS = 0, uclSv = 0, uclTk = 0;

  if (pLine === "FW") {
    leagueG = 18; leagueA = 8;
    cupG = 5; cupA = 2;
    uclG = reachesFinal ? 6 : 0; uclA = reachesFinal ? 3 : 0;
  } else if (pLine === "MF") {
    leagueG = 8; leagueA = 14;
    cupG = 3; cupA = 4;
    uclG = reachesFinal ? 3 : 0; uclA = reachesFinal ? 5 : 0;
  } else if (pLine === "DF") {
    leagueG = 3; leagueA = 4; leagueCS = 12; leagueTk = 50;
    cupG = 1; cupA = 1; cupCS = 3; cupTk = 15;
    uclG = reachesFinal ? 1 : 0; uclA = reachesFinal ? 1 : 0;
    uclCS = reachesFinal ? 2 : 0; uclTk = reachesFinal ? 14 : 0;
  } else {
    leagueCS = 14; leagueSv = 65;
    cupCS = 4; cupSv = 18;
    uclCS = reachesFinal ? 2 : 0; uclSv = reachesFinal ? 20 : 0;
  }

  const simG = leagueG + cupG + uclG;
  const simA = leagueA + cupA + uclA;
  const simCS = leagueCS + cupCS + uclCS;
  const simSv = leagueSv + cupSv + uclSv;
  const simTk = leagueTk + cupTk + uclTk;

  // 3. ĐỒNG BỘ: ƯU TIÊN SỐ LIỆU BẠN TỰ ĐÁ (Tránh bị về 0 bàn / 0 kiến tạo)
  const academyMatches = Math.max(playedMatches, simMatches);
  const g = Math.max(playedG, simG);
  const a = Math.max(playedA, simA);
  const cs = Math.max(playedCS, simCS);
  const sv = Math.max(playedSv, simSv);
  const tk = Math.max(playedTk, simTk);

  // Nếu số bàn/kiến tạo thực tế cao hơn mô phỏng, cập nhật thêm vào chỉ số giải VĐQG
  if (playedG > simG) leagueG += (playedG - simG);
  if (playedA > simA) leagueA += (playedA - simA);

  // Đồng bộ lại vào dữ liệu mùa của cầu thủ
  player.currentSeasonStats = {
    matches: academyMatches,
    goals: g,
    assists: a,
    cleanSheets: cs,
    saves: sv,
    tackles: tk
  };

  const seasonTrophiesWonList = [];

  // 1. CÚP TRẺ QUỐC GIA: Trao ngay cúp vô địch
  if (typeof awardCupVictory === 'function') awardCupVictory(player, "Cúp Trẻ Quốc Gia U19");
  seasonTrophiesWonList.push("Cúp Trẻ Quốc Gia U19");

  // 2. UEFA YOUTH LEAGUE (C1 TRẺ)
  let youthC1Result = "";
  if (isWonYouthC1 || player.wonYouthC1) {
    youthC1Result = `🏆 VÔ ĐỊCH UEFA Youth League (C1 Trẻ)`;
    if (typeof awardCupVictory === 'function') awardCupVictory(player, "UEFA Youth League (Cúp C1 Trẻ)");
    seasonTrophiesWonList.push("UEFA Youth League (Cúp C1 Trẻ)");
  } else if (reachesFinal) {
    youthC1Result = `🥈 Á Quân UEFA Youth League (C1 Trẻ)`;
  } else {
    youthC1Result = `Dừng bước tại Bán kết UEFA Youth League`;
  }

  // 3. VÔ ĐỊCH GIẢI VĐQG U19 ACADEMY (Kiểm tra Top 1 BXH)
  const wonLeague = typeof checkAndAwardLeagueTitle === 'function' ? checkAndAwardLeagueTitle(player) : false;
  let isLeagueChamp = Boolean(wonLeague);
  const academyOrClub = player.academy || player.club;
  const firstTeamInTable = player.leagueTable && player.leagueTable[0];
  const isTopMatch = firstTeamInTable && (firstTeamInTable.isPlayerClub || (typeof isSameClub === 'function' && isSameClub(firstTeamInTable, academyOrClub)));

  if (!isLeagueChamp && (!player.leagueTable || player.leagueTable.length === 0 || isTopMatch)) {
    const lgTitle = "Giải VĐQG U19 Academy";
    if (typeof addTrophy === 'function') addTrophy(player, lgTitle);
    player.trophiesCount = (player.trophiesCount || 0) + 1;
    player.careerTrophies = (player.careerTrophies || 0) + 1;
    seasonTrophiesWonList.push(lgTitle);
    isLeagueChamp = true;
  } else if (wonLeague && !seasonTrophiesWonList.includes("Giải VĐQG U19 Academy")) {
    seasonTrophiesWonList.push("Giải VĐQG U19 Academy");
  }

  // 4. DANH HIỆU CÁ NHÂN (VUA PHÁ LƯỚI & VUA KIẾN TẠO)
  if (!player.currentSeasonStats) player.currentSeasonStats = { goals: 0, assists: 0, matches: 0 };
  if ((player.currentSeasonStats.goals || 0) < g) player.currentSeasonStats.goals = g;
  if ((player.currentSeasonStats.assists || 0) < a) player.currentSeasonStats.assists = a;

  const indAwards = (typeof checkAndAwardIndividualYouthAwards === 'function' ? checkAndAwardIndividualYouthAwards(player) : {}) || {};
  if (indAwards.topScorer && !seasonTrophiesWonList.includes("Vua Phá Lưới Giải Trẻ (Top Scorer)")) {
    seasonTrophiesWonList.push("Vua Phá Lưới Giải Trẻ (Top Scorer)");
  }
  if (indAwards.topPlaymaker && !seasonTrophiesWonList.includes("Vua Kiến Tạo Giải Trẻ (Top Playmaker)")) {
    seasonTrophiesWonList.push("Vua Kiến Tạo Giải Trẻ (Top Playmaker)");
  }
  if (indAwards.mvp && !seasonTrophiesWonList.includes("Cầu Thủ Xuất Sắc Nhất Giải Trẻ U19")) {
    seasonTrophiesWonList.push("Cầu Thủ Xuất Sắc Nhất Giải Trẻ U19");
  }

  // Đánh giá Vua Phá Lưới & Vua Kiến Tạo & MVP Cúp Trẻ Quốc Gia
  const dYouthG = Math.max(cupG, player.cupStats?.domesticCup?.goals || 0);
  const dYouthA = Math.max(cupA, player.cupStats?.domesticCup?.assists || 0);
  let wonYouthCupScorer = false;
  let wonYouthCupPlaymaker = false;

  if (dYouthG >= 5) {
    const tName = "Vua Phá Lưới Cúp Trẻ Quốc Gia U19";
    if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
    if (!player.seasonTrophiesWonThisYear.includes(tName)) {
      player.seasonTrophiesWonThisYear.push(tName);
      addTrophy(player, tName);
      seasonTrophiesWonList.push(tName);
      player.fame += 400;
      wonYouthCupScorer = true;
    }
  }
  if (dYouthA >= 3) {
    const tName = "Vua Kiến Tạo Cúp Trẻ Quốc Gia U19";
    if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
    if (!player.seasonTrophiesWonThisYear.includes(tName)) {
      player.seasonTrophiesWonThisYear.push(tName);
      addTrophy(player, tName);
      seasonTrophiesWonList.push(tName);
      player.fame += 300;
      wonYouthCupPlaymaker = true;
    }
  }

  const dYouthMvpScore = calculateTournamentMvpScore({
    matches: cupMatches,
    goals: dYouthG,
    assists: dYouthA,
    cleanSheets: Math.max(cupCS, player.cupStats?.domesticCup?.cleanSheets || 0),
    tackles: Math.max(cupTk, player.cupStats?.domesticCup?.tackles || 0),
    saves: Math.max(cupSv, player.cupStats?.domesticCup?.saves || 0),
    avgRating: player.lastSeasonAvgRating || 0
  }, player.position, true, false, { isCup: true });

  if (dYouthMvpScore >= 85 && cupMatches >= 3) {
    const tName = "Cầu Thủ Xuất Sắc Nhất Cúp Trẻ Quốc Gia U19";
    if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
    if (!player.seasonTrophiesWonThisYear.includes(tName)) {
      player.seasonTrophiesWonThisYear.push(tName);
      addTrophy(player, tName);
      seasonTrophiesWonList.push(tName);
      player.fame += 500;
      player.morale = Math.min(100, (player.morale || 70) + 10);
    }
  }

  // Đánh giá Vua Phá Lưới & Vua Kiến Tạo & MVP UEFA Youth League
  const uylGVal = Math.max(uclG, player.cupStats?.continentalCup?.goals || 0);
  const uylAVal = Math.max(uclA, player.cupStats?.continentalCup?.assists || 0);
  let wonUylScorer = false;
  let wonUylPlaymaker = false;

  if (uylGVal >= 6) {
    const tName = "Vua Phá Lưới UEFA Youth League";
    if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
    if (!player.seasonTrophiesWonThisYear.includes(tName)) {
      player.seasonTrophiesWonThisYear.push(tName);
      addTrophy(player, tName);
      seasonTrophiesWonList.push(tName);
      player.fame += 600;
      wonUylScorer = true;
    }
  }
  if (uylAVal >= 4) {
    const tName = "Vua Kiến Tạo UEFA Youth League";
    if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
    if (!player.seasonTrophiesWonThisYear.includes(tName)) {
      player.seasonTrophiesWonThisYear.push(tName);
      addTrophy(player, tName);
      seasonTrophiesWonList.push(tName);
      player.fame += 450;
      wonUylPlaymaker = true;
    }
  }

  const uylMvpScore = calculateTournamentMvpScore({
    matches: uclMatches,
    goals: uylGVal,
    assists: uylAVal,
    cleanSheets: Math.max(uclCS, player.cupStats?.continentalCup?.cleanSheets || 0),
    tackles: Math.max(uclTk, player.cupStats?.continentalCup?.tackles || 0),
    saves: Math.max(uclSv, player.cupStats?.continentalCup?.saves || 0),
    avgRating: player.lastSeasonAvgRating || 0
  }, player.position, isWonYouthC1, reachesFinal && !isWonYouthC1, { isCup: true });

  if (uylMvpScore >= 88 && reachesFinal) {
    const tName = "Cầu Thủ Xuất Sắc Nhất UEFA Youth League";
    if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
    if (!player.seasonTrophiesWonThisYear.includes(tName)) {
      player.seasonTrophiesWonThisYear.push(tName);
      addTrophy(player, tName);
      seasonTrophiesWonList.push(tName);
      player.fame += 650;
      player.morale = Math.min(100, (player.morale || 70) + 10);
    }
  }

  // Chấm giải thưởng cúp bổ sung nếu có dữ liệu cupTrackers
  const cupAwards = evaluateAndAwardCupAwards(player, 'all', { seasonTrophiesWonList });
  if (cupAwards?.domestic?.wonScorer) wonYouthCupScorer = true;
  if (cupAwards?.domestic?.wonPlaymaker) wonYouthCupPlaymaker = true;
  if (cupAwards?.domestic?.wonMvp && !seasonTrophiesWonList.includes(cupAwards.domestic.mvpTitle)) {
    seasonTrophiesWonList.push(cupAwards.domestic.mvpTitle);
  }
  if (cupAwards?.continental?.wonScorer) wonUylScorer = true;
  if (cupAwards?.continental?.wonPlaymaker) wonUylPlaymaker = true;
  if (cupAwards?.continental?.wonMvp && !seasonTrophiesWonList.includes(cupAwards.continental.mvpTitle)) {
    seasonTrophiesWonList.push(cupAwards.continental.mvpTitle);
  }

  const seasonTrophiesWon = seasonTrophiesWonList.length;
  player.careerTrophies = (player.careerTrophies || 0) + seasonTrophiesWon;

  // Reconcile with accumulator
  if (player.seasonAccumulator && player.seasonAccumulator.matches > 0) {
    player.totalCareerMatches = ((player.totalCareerMatches || 0) - player.seasonAccumulator.matches) + academyMatches;
    player.totalCareerGoals = ((player.totalCareerGoals || 0) - player.seasonAccumulator.goals) + g;
    player.totalCareerAssists = ((player.totalCareerAssists || 0) - player.seasonAccumulator.assists) + a;
    player.totalCareerCleanSheets = ((player.totalCareerCleanSheets || 0) - player.seasonAccumulator.cs) + cs;
    player.totalCareerSaves = ((player.totalCareerSaves || 0) - player.seasonAccumulator.saves) + sv;
    player.totalCareerTackles = ((player.totalCareerTackles || 0) - player.seasonAccumulator.tackles) + tk;

    player.clubMatches = ((player.clubMatches || 0) - player.seasonAccumulator.matches) + academyMatches;
    player.clubGoals = ((player.clubGoals || 0) - player.seasonAccumulator.goals) + g;
    player.clubAssists = ((player.clubAssists || 0) - player.seasonAccumulator.assists) + a;
  } else {
    player.totalCareerMatches = (player.totalCareerMatches || 0) + academyMatches;
    player.totalCareerGoals = (player.totalCareerGoals || 0) + g;
    player.totalCareerAssists = (player.totalCareerAssists || 0) + a;
    player.totalCareerCleanSheets = (player.totalCareerCleanSheets || 0) + cs;
    player.totalCareerSaves = (player.totalCareerSaves || 0) + sv;
    player.totalCareerTackles = (player.totalCareerTackles || 0) + tk;

    player.clubMatches = (player.clubMatches || 0) + academyMatches;
    player.clubGoals = (player.clubGoals || 0) + g;
    player.clubAssists = (player.clubAssists || 0) + a;
  }

  let academyStatText = "";
  if (pLine === "GK") {
    academyStatText = `${academyMatches} trận | 🧤 ${cs} sạch lưới, ${sv} cứu thua`;
  } else if (pLine === "DF") {
    academyStatText = `${academyMatches} trận | 🛡️ ${tk} tắc bóng, ${cs} sạch lưới`;
  } else {
    academyStatText = `${academyMatches} trận | ⚽ ${g} bàn, 🎯 ${a} kiến tạo`;
  }

  if (typeof calculateTransfermarktValue === 'function') {
    calculateTransfermarktValue(player);
  }

  const clubsList = (typeof ALL_CLUBS !== 'undefined' && Array.isArray(ALL_CLUBS)) ? ALL_CLUBS : [];
  const parentClubId = player.academy?.parentClubId;
  const parentClub = clubsList.find(c => c.id === parentClubId) || clubsList[0] || {
    name: "Borussia Dortmund",
    icon: "🟡",
    salary: 50000,
    defaultEuro: "UCL",
    league: { name: "Bundesliga", flag: "🇩🇪" }
  };

  if (player.rival) {
    const finalYouthGoals = player.rival.seasonGoals || 18;
    const finalYouthAssists = player.rival.seasonAssists || 6;
    player.rival.careerGoals = (player.rival.careerGoals || 0) + finalYouthGoals;
    player.rival.careerAssists = (player.rival.careerAssists || 0) + finalYouthAssists;
    player.rival.careerTrophies = (player.rival.careerTrophies || 0) + 1;
    player.rival.seasonGoals = 0;
    player.rival.seasonAssists = 0;
  }

  const rivalReport = `${player.rival?.name || 'Kình Địch'} (${player.rival?.club || 'CLB'}): ⚽ ${player.rival?.careerGoals || 18} bàn, 🎯 ${player.rival?.careerAssists || 6} kiến tạo | Ra mắt ấn tượng tại đội trẻ`;

  let leagueStatStr = pLine === "GK" ? `🧤 ${leagueCS} sạch lưới` : (pLine === "DF" ? `🛡️ ${leagueTk} tắc bóng, ${leagueCS} sạch lưới` : `⚽ ${leagueG} bàn, 🎯 ${leagueA} kiến tạo`);
  let cupStatStr = pLine === "GK" ? `🧤 ${cupCS} sạch lưới` : (pLine === "DF" ? `🛡️ ${cupTk} tắc bóng` : `⚽ ${cupG} bàn, 🎯 ${cupA} kiến tạo`);
  let uclStatStr = reachesFinal ? (pLine === "GK" ? `🧤 ${uclCS} sạch lưới, ${uclSv} cứu thua` : (pLine === "DF" ? `🛡️ ${uclTk} tắc bóng` : `⚽ ${uclG} bàn, 🎯 ${uclA} kiến tạo`)) : "";

  const leagueTitleText = isLeagueChamp
    ? `🏆 VÔ ĐỊCH Giải VĐQG U19 Academy (${leagueMatches} trận | ${leagueStatStr})`
    : `Tỏa sáng rực rỡ (${leagueMatches} trận | ${leagueStatStr})`;

  const reportRows = [
    { icon: "🏆", title: "[Giải VĐQG U19 Academy]", text: leagueTitleText },
    { icon: "🛡️", title: "[Cúp Trẻ Quốc Gia U19]", text: `🏆 VÔ ĐỊCH Cúp Trẻ U19 (${cupMatches} trận | ${cupStatStr})` },
    { icon: "🌍", title: "[UEFA Youth League (C1 Trẻ)]", text: reachesFinal ? `${youthC1Result} (${uclMatches} trận | ${uclStatStr})` : youthC1Result }
  ];

  if (indAwards.topScorer) {
    reportRows.push({ icon: "👟", title: "[Vua Phá Lưới]", text: `🥇 VUA PHÁ LƯỚI GIẢI TRẺ (Top Scorer) — ${player.currentSeasonStats?.goals || g} bàn thắng!` });
  }
  if (indAwards.topPlaymaker) {
    reportRows.push({ icon: "🎯", title: "[Vua Kiến Tạo]", text: `🎯 VUA KIẾN TẠO GIẢI TRẺ (Top Playmaker) — ${player.currentSeasonStats?.assists || a} kiến tạo!` });
  }
  if (wonYouthCupScorer) {
    reportRows.push({ icon: "👟", title: "[Vua Phá Lưới Cúp Trẻ]", text: `🥇 VUA PHÁ LƯỚI Cúp Trẻ Quốc Gia U19 — ${dYouthG} bàn thắng!` });
  }
  if (wonYouthCupPlaymaker) {
    reportRows.push({ icon: "🎯", title: "[Vua Kiến Tạo Cúp Trẻ]", text: `🎯 VUA KIẾN TẠO Cúp Trẻ Quốc Gia U19 — ${dYouthA} kiến tạo!` });
  }
  if (wonUylScorer) {
    reportRows.push({ icon: "👟", title: "[Vua Phá Lưới C1 Trẻ]", text: `🥇 VUA PHÁ LƯỚI UEFA Youth League — ${uylGVal} bàn thắng!` });
  }
  if (wonUylPlaymaker) {
    reportRows.push({ icon: "🎯", title: "[Vua Kiến Tạo C1 Trẻ]", text: `🎯 VUA KIẾN TẠO UEFA Youth League — ${uylAVal} kiến tạo!` });
  }

  // Đội Hình Tiêu Biểu U19 Academy (Team of the Season - TOTS 4-3-3)
  const totsResult = generateTeamOfTheSeason(player, 'YOUTH_LEAGUE', player.leagueTable);
  if (totsResult && totsResult.playerIncluded) {
    reportRows.push({
      icon: "🌟",
      title: "[Đội Hình Tiêu Biểu U19]",
      text: `🌟 Vinh danh trong Đội Hình Tiêu Biểu Giải VĐQG U19 Academy (Sơ đồ 4-3-3 | ${totsResult.playerMvpScore} điểm MVP)!`
    });
  }

  reportRows.push(
    { icon: "👑", title: "[Bình chọn Tài Năng Trẻ]", text: `Tài năng trẻ triển vọng (Chưa lọt Top 30 Quả Bóng Vàng)` },
    { icon: "🏷️", title: "[Định giá Transfermarkt]", text: `${((player.marketValue || 1000000) / 1000000).toFixed(1)}M € (Tài năng trẻ nổi bật)` },
    { icon: "⚔️", title: "[Kình Địch Cùng Thời]", text: rivalReport },
    { icon: "🎯", title: "[Mùa Tới]", text: `Được ĐÔN LÊN ĐỘI MỘT ${parentClub.name} (${parentClub.league?.name || 'VĐQG'})!` }
  );

  // Ghi nhận mốc son vào Chronicle an toàn
  if (typeof recordChronicleMilestone === 'function') {
    recordChronicleMilestone(player, 'DEBUT', {
      desc: `Chính thức ra mắt màu áo học viện ${player.academy?.name || 'đào tạo trẻ'} ở tuổi 16!`
    });
    if (g > 0) {
      recordChronicleMilestone(player, 'FIRST_GOAL', {
        desc: `Pha lập công mở tài khoản bàn thắng cá nhân đầu tiên trong sự nghiệp tại giải trẻ!`
      });
    }
    if (g >= 3) {
      recordChronicleMilestone(player, 'FIRST_HATTRICK', {
        desc: `Bùng nổ hủy diệt hàng thủ đối phương với cú Hattrick lịch sử đầu tiên!`
      });
    }
    if (isWonYouthC1) {
      recordChronicleMilestone(player, 'FIRST_C1_TITLE', {
        title: "Vô Địch UEFA Youth League",
        desc: `Cùng học viện ${player.academy?.name} bước lên đỉnh vinh quang Cúp C1 Trẻ Châu Âu!`
      });
    }
  }

  player.isAcademyStage = false;
  player.currentClub = parentClub;
  player.salary = Math.max(2500, Math.min(25000, Math.round((parentClub.salary || 50000) * 0.10)));
  player.currentEuroStatus = parentClub.defaultEuro || "NONE";
  player.seasonAccumulator = null;

  if (typeof updateCompetitionTier === 'function') {
    updateCompetitionTier(player);
  }

  // Khởi tạo mảng clubsHistory an toàn
  if (!player.clubsHistory || !Array.isArray(player.clubsHistory)) {
    player.clubsHistory = [];
  }
  const clubTag = `${parentClub.icon || '⚽'} ${parentClub.name} (${parentClub.league?.flag || '🚩'} ${parentClub.league?.name || 'VĐQG'})`;
  if (!player.clubsHistory.includes(clubTag)) {
    player.clubsHistory.push(clubTag);
  }

  player.fame = (player.fame || 0) + 150;
  player.attr1 = (player.attr1 || 50) + 3;
  player.attr2 = (player.attr2 || 50) + 3;

  return {
    reportRows,
    academyStatText,
    academyMatches,
    academyGoals: g,
    academyAssists: a,
    academyCS: cs,
    academySaves: sv,
    academyTackles: tk,
    seasonTrophiesWon,
    seasonTrophiesWonList,
    parentClub,
    totsResult
  };
}

/* =========================================================================
   6. FIXTURE-BY-FIXTURE SIMULATION ENGINE & REAL-TIME LEAGUE TABLE
   ========================================================================= */

/**
 * Kiểm tra điều kiện triệu tập Đội Tuyển Quốc Gia (National Team Call-Up) ở tuổi 17
 * - Giữ nguyên độ tuổi 16 hiện tại chỉ thi đấu cấp CLB Trẻ (U19)
 * - Khi bước sang tuổi 17: OVR >= 65 hoặc phong độ mùa trước đạt điểm cao -> player.isNationalTeamCalled = true
 * - Thêm sự kiện Career Log chuẩn xác theo yêu cầu
 * @param {object} player 
 * @returns {boolean}
 */
export function checkNationalTeamCallUp(player) {
  if (!player) return false;

  // Giữ nguyên độ tuổi 16 hiện tại chỉ thi đấu cấp CLB Trẻ (U19)
  if (player.age <= 16 || Boolean(player.isAcademyStage && player.age <= 16)) {
    player.isNationalTeamCalled = false;
    return false;
  }

  // Nếu đã được triệu tập trước đó
  if (player.isNationalTeamCalled) {
    return true;
  }

  // Khi nhân vật chuyển giao mùa giải và bước sang tuổi 17 (player.age === 17 hoặc >= 17)
  if (player.age >= 17) {
    const a1 = Number(player.attr1 || 50);
    const a2 = Number(player.attr2 || 50);
    const a3 = Number(player.attr3 || 50);
    const a4 = Number(player.attr4 || 50);
    const attrAvg = Math.round((a1 + a2 + a3 + a4) / 4);
    const overallPower = typeof getOverallPower === 'function' ? getOverallPower(player) : attrAvg;
    const currentOvr = isNaN(overallPower) ? attrAvg : Math.max(attrAvg, overallPower);

    const isHighForm = Boolean(
      (player.lastSeasonRating && player.lastSeasonRating >= 6.8) ||
      (player.lastSeasonAvgRating && player.lastSeasonAvgRating >= 6.8) ||
      (player.form && player.form >= 68) ||
      (player.academyGoals && player.academyGoals >= 8) ||
      (player.seasonAccumulator && (player.seasonAccumulator.goals >= 8 || player.seasonAccumulator.matches >= 12)) ||
      (player.fame && player.fame >= 350)
    );

    // Điều kiện: OVR >= 65 hoặc phong độ mùa trước đạt điểm cao
    if (currentOvr >= 65 || isHighForm) {
      player.isNationalTeamCalled = true;

      // Thêm sự kiện Career Log chuẩn xác
      const logBody = "🎉 CHÍNH THỨC ĐƯỢC GỌI LÊN ĐỘI TUYỂN QUỐC GIA Ở TUỔI 17! Thần đồng bóng đá bước ra vũ đài quốc tế!";
      logCareerEvent(player, "NATIONAL_TEAM_CALLUP", {
        title: "TRIỆU TẬP ĐỘI TUYỂN QUỐC GIA",
        body: logBody,
        type: "trophy-win"
      });

      return true;
    }
  }

  return false;
}

/**
 * Thuật toán Polygon Round-Robin (vòng tròn 2 lượt đi - về)
 * Sinh trọn vẹn 38 (hoặc 34) vòng giải VĐQG và xen kẽ Cúp Quốc Gia & Cúp Châu Âu.
 * Khi cầu thủ 17 tuổi trở lên và được triệu tập ĐTQG (isNationalTeamCalled):
 *  + Bổ sung 2 trận Vòng loại / Giao hữu FIFA Days xen kẽ trong mùa.
 *  + Mùa hè (cuối mùa): Chiến dịch giải đấu lớn (World Cup hoặc EURO/Copa/Asian Cup tùy quốc tịch).
 *  + Đánh dấu thuộc tính trận đấu: match.type = 'NATIONAL_TEAM' (CLB là 'CLUB').
 */
export function generateSeasonFixtures(leagueId, playerClub, euroStatus = "NONE", wonDomesticCupLastSeason = false, isAcademyStage = false, brackets = null, groupTable = null, playerNationality = null, player = null) {
  // Hỗ trợ gọi linh hoạt dạng generateSeasonFixtures(player)
  if (leagueId && typeof leagueId === 'object' && !Array.isArray(leagueId)) {
    player = leagueId;
    const isYouth = !player.isPro || player.tier === 3 || player.leagueId === 'academy' || Boolean(player.isAcademyStage || (player.age && player.age <= 16) || player.leagueId === 'YOUTH_LEAGUE') || (player.club && (player.club.isAcademy || isSameClub(player.club, { name: 'campus' })));
    isAcademyStage = isYouth;
    leagueId = player.leagueId || (isYouth ? 'YOUTH_LEAGUE' : 'PREMIER_LEAGUE');
    playerClub = getPlayerActiveClub ? getPlayerActiveClub(player) : (player.currentClub || player.academy || player.club);
    euroStatus = player.currentEuroStatus || "NONE";
    wonDomesticCupLastSeason = player.wonMainCupLastSeason || false;
    brackets = player.tournamentBrackets;
    groupTable = player.continentalGroupTable;
    playerNationality = player.nationality;
  }

  const fixtures = [];

  // Tự động kiểm tra triệu tập ĐTQG nếu có object player
  if (player) {
    checkNationalTeamCallUp(player);
  }

  const isNatEligible = Boolean(
    player &&
    player.isNationalTeamCalled &&
    player.age >= 17 &&
    !isAcademyStage
  );

  if (isAcademyStage) {
    // ─── 1. GIẢI TRẺ HỌC VIỆN (YOUTH ACADEMY FIXTURES - ĐỘ TUỔI 16 CHỈ ĐÁ CẤP CLB TRẺ) ───
    const youthClubs = YOUTH_LEAGUE_CLUBS.map(c => ({ ...c }));

    // Ensure player's youth academy is mapped
    let currentAcademyClub = youthClubs.find(c =>
      c.id === playerClub?.id ||
      c.idAlias === playerClub?.id ||
      c.name === playerClub?.name ||
      isSameClub(c, playerClub) ||
      isClubMatch(c, playerClub)
    );
    if (!currentAcademyClub) {
      if (playerClub) {
        currentAcademyClub = { ...playerClub };
        youthClubs[youthClubs.length - 1] = currentAcademyClub;
      } else {
        currentAcademyClub = youthClubs[0];
      }
    }

    const N = youthClubs.length; // 16 teams
    const teams = [...youthClubs];
    const leg1 = [];

    // Polygon Round-Robin: N - 1 = 15 vòng lượt đi
    for (let r = 0; r < N - 1; r++) {
      const roundMatches = [];
      for (let i = 0; i < N / 2; i++) {
        const t1 = teams[i];
        const t2 = teams[N - 1 - i];
        const isHome = (r + i) % 2 === 0;
        roundMatches.push({ home: isHome ? t1 : t2, away: isHome ? t2 : t1 });
      }
      leg1.push(roundMatches);
      teams.splice(1, 0, teams.pop());
    }

    const leg2 = leg1.map(rMatches => rMatches.map(m => ({ home: m.away, away: m.home })));
    const allYouthRounds = [...leg1, ...leg2]; // 30 vòng lượt đi và lượt về
    const totalLeagueRounds = allYouthRounds.length; // 30

    // Lấy 3 đối thủ trong Bảng A của UEFA Youth League
    let groupATeams = [];
    if (groupTable && Array.isArray(groupTable) && groupTable.length >= 4) {
      groupATeams = groupTable;
    } else {
      const generated = initYouthLeagueGroups(currentAcademyClub);
      groupATeams = generated.A;
    }
    const oppGroup1 = groupATeams[1] ? { id: groupATeams[1].clubId, name: groupATeams[1].clubName, code: groupATeams[1].clubCode, icon: groupATeams[1].clubIcon, power: groupATeams[1].power, stadium: groupATeams[1].stadium } : youthClubs[1];
    const oppGroup2 = groupATeams[2] ? { id: groupATeams[2].clubId, name: groupATeams[2].clubName, code: groupATeams[2].clubCode, icon: groupATeams[2].clubIcon, power: groupATeams[2].power, stadium: groupATeams[2].stadium } : youthClubs[2];
    const oppGroup3 = groupATeams[3] ? { id: groupATeams[3].clubId, name: groupATeams[3].clubName, code: groupATeams[3].clubCode, icon: groupATeams[3].clubIcon, power: groupATeams[3].power, stadium: groupATeams[3].stadium } : youthClubs[3];

    // Helper đối thủ cúp trẻ khác CLB của người chơi
    const getValidYouthOpp = (preferredIndex) => {
      let candidate = youthClubs[preferredIndex % youthClubs.length];
      if (candidate.id === currentAcademyClub.id || isSameClub(candidate, currentAcademyClub)) {
        const alternate = youthClubs.find(c => c.id !== currentAcademyClub.id && !isSameClub(c, currentAcademyClub));
        if (alternate) candidate = alternate;
      }
      return candidate;
    };

    allYouthRounds.forEach((roundMatches, rIdx) => {
      const pMatch = roundMatches.find(m =>
        isSameClub(m.home, currentAcademyClub) ||
        isSameClub(m.away, currentAcademyClub) ||
        m.home.id === currentAcademyClub.id ||
        m.away.id === currentAcademyClub.id
      ) || roundMatches[0];
      const isHome = isSameClub(pMatch.home, currentAcademyClub) || pMatch.home.id === currentAcademyClub.id;
      const opponent = isHome ? pMatch.away : pMatch.home;
      const isDerby = Boolean(currentAcademyClub.derbyRivals && currentAcademyClub.derbyRivals.includes(opponent.id));

      fixtures.push({
        roundNumber: rIdx + 1,
        type: "CLUB",
        competitionType: "LEAGUE",
        competitionName: "Giải VĐQG U19 Trẻ",
        stageName: `Vòng ${rIdx + 1}/${totalLeagueRounds}`,
        dateStr: `Vòng ${rIdx + 1}`,
        isCompleted: false,
        isNationalTeam: false,
        playerMatch: {
          id: `fix_youth_lg_${rIdx + 1}`,
          type: "CLUB",
          homeClub: pMatch.home,
          awayClub: pMatch.away,
          isPlayerHome: isHome,
          opponent: opponent,
          stadium: isHome ? (currentAcademyClub.stadium || "Sân Nhà Học Viện") : (opponent.stadium || "Sân Khách"),
          isBigMatch: isDerby || (rIdx === 0) || (rIdx === totalLeagueRounds - 1),
          isDerby: isDerby,
          isPlayed: false,
          isNationalTeam: false,
          result: null
        },
        aiMatches: roundMatches.filter(m => m !== pMatch && !isSameClub(m.home, currentAcademyClub) && !isSameClub(m.away, currentAcademyClub)).map((m, mIdx) => ({
          id: `fix_youth_ai_${rIdx + 1}_${mIdx}`,
          homeClub: m.home,
          awayClub: m.away,
          isPlayed: false,
          homeScore: null,
          awayScore: null
        }))
      });

      // SẮP XẾP ĐAN XEN KHOA HỌC CÚP QUỐC GIA & UEFA YOUTH LEAGUE (30 VÒNG):
      // - Cúp Quốc Gia: Vòng 1/8 (sau V4), Tứ Kết (sau V10), Bán Kết (sau V20), Chung Kết (sau V28)
      // - UEFA Youth League: Lượt 1 (sau V7), Lượt 2 (sau V13), Lượt 3 (sau V15 - kết thúc lượt đi), Tứ Kết (sau V23), Bán Kết (sau V26), Chung Kết (sau V30)
      if (rIdx === 3) {
        // Sau Vòng 4: Vòng 1/8 Cúp Trẻ Quốc Gia U19
        fixtures.push(createCupFixture(currentAcademyClub, "Cúp Trẻ Quốc Gia U19", "Vòng 1/8", "DOMESTIC_CUP", getValidYouthOpp(3), false));
      } else if (rIdx === 6) {
        // Sau Vòng 7: Lượt 1 Vòng Bảng UEFA Youth League
        fixtures.push(createCupFixture(currentAcademyClub, "UEFA Youth League (C1 Trẻ)", "Vòng Bảng Lượt 1", "UCL", oppGroup1, true));
      } else if (rIdx === 9) {
        // Sau Vòng 10: Tứ Kết Cúp Trẻ Quốc Gia U19
        fixtures.push(createCupFixture(currentAcademyClub, "Cúp Trẻ Quốc Gia U19", "Tứ Kết Cúp Trẻ", "DOMESTIC_CUP", getValidYouthOpp(2), true));
      } else if (rIdx === 12) {
        // Sau Vòng 13: Lượt 2 Vòng Bảng UEFA Youth League
        fixtures.push(createCupFixture(currentAcademyClub, "UEFA Youth League (C1 Trẻ)", "Vòng Bảng Lượt 2", "UCL", oppGroup2, true));
      } else if (rIdx === 14) {
        // Sau Vòng 15 (Hết lượt đi): Lượt 3 Vòng Bảng UEFA Youth League
        fixtures.push(createCupFixture(currentAcademyClub, "UEFA Youth League (C1 Trẻ)", "Vòng Bảng Lượt 3", "UCL", oppGroup3, true));
      } else if (rIdx === 19) {
        // Sau Vòng 20: Bán Kết Cúp Trẻ Quốc Gia U19
        fixtures.push(createCupFixture(currentAcademyClub, "Cúp Trẻ Quốc Gia U19", "Bán Kết Cúp Trẻ", "DOMESTIC_CUP", getValidYouthOpp(4), true));
      } else if (rIdx === 22) {
        // Sau Vòng 23: TỨ KẾT UEFA Youth League
        fixtures.push(createCupFixture(currentAcademyClub, "UEFA Youth League (C1 Trẻ)", "Tứ Kết UEFA Youth League", "UCL", { name: "Nhì Bảng B", code: "2B", icon: "🥈", power: 76, stadium: "Sân Khách Tứ Kết" }, true));
      } else if (rIdx === 25) {
        // Sau Vòng 26: BÁN KẾT UEFA Youth League
        fixtures.push(createCupFixture(currentAcademyClub, "UEFA Youth League (C1 Trẻ)", "Bán Kết UEFA Youth League", "UCL", { name: "Đối Thủ Bán Kết (Chờ Nhánh)", code: "SF", icon: "⚔️", power: 77, stadium: "Sân Trung Lập" }, true));
      } else if (rIdx === 27) {
        // Sau Vòng 28: CHUNG KẾT Cúp Trẻ Quốc Gia U19
        fixtures.push(createCupFixture(currentAcademyClub, "Cúp Trẻ Quốc Gia U19", "Chung Kết Cúp Trẻ U19", "DOMESTIC_CUP", getValidYouthOpp(5), true));
      } else if (rIdx === 29) {
        // Sau Vòng 30 (Vòng cuối mùa): ĐẠI CHUNG KẾT UEFA Youth League
        fixtures.push(createCupFixture(currentAcademyClub, "UEFA Youth League (C1 Trẻ)", "Chung Kết UEFA Youth League", "UCL", { name: "Đối Thủ Chung Kết (Chờ Nhánh)", code: "FIN", icon: "🏆", power: 78, stadium: "Sân Vận Động Colovray (Nyon)" }, true));
      }
    });

  } else {
    // ─── 2. GIẢI ĐẤU CHUYÊN NGHIỆP NGOÀI ĐỜI THẬT (SENIOR LEAGUE & CUPS) ─────────
    let clubsPool = LEAGUE_TEAMS_MAP[leagueId] ? [...LEAGUE_TEAMS_MAP[leagueId]] : null;
    if (!clubsPool || clubsPool.length < 4) {
      clubsPool = ALL_CLUBS.filter(c => c.league && c.league.id === leagueId);
    }
    if (!clubsPool || clubsPool.length < 4) {
      clubsPool = [...LEAGUE_TEAMS_MAP.PREMIER_LEAGUE];
    }

    // Đảm bảo CLB của người chơi nằm trong danh sách giải đấu
    const activePlayerClub = playerClub || clubsPool[0];
    const foundIdx = clubsPool.findIndex(c => c.id === activePlayerClub.id || c.name === activePlayerClub.name);
    if (foundIdx === -1) {
      // Thay thế CLB yếu nhất bằng CLB người chơi
      clubsPool[clubsPool.length - 1] = activePlayerClub;
    } else {
      clubsPool[foundIdx] = activePlayerClub;
    }

    const N = clubsPool.length; // 20 hoặc 18
    const teams = [...clubsPool];
    const leg1 = [];

    // Polygon Round-Robin: N - 1 vòng lượt đi
    for (let r = 0; r < N - 1; r++) {
      const roundMatches = [];
      for (let i = 0; i < N / 2; i++) {
        const t1 = teams[i];
        const t2 = teams[N - 1 - i];
        const isHome = (r + i) % 2 === 0;
        roundMatches.push({ home: isHome ? t1 : t2, away: isHome ? t2 : t1 });
      }
      leg1.push(roundMatches);
      teams.splice(1, 0, teams.pop());
    }

    // Lượt về đảo sân (home <-> away)
    const leg2 = leg1.map(rMatches => rMatches.map(m => ({ home: m.away, away: m.home })));
    const allLeagueRounds = [...leg1, ...leg2]; // 38 hoặc 34 vòng trọn vẹn
    const totalLeagueRounds = allLeagueRounds.length;

    // Tìm các đối thủ Cúp Quốc Tế & Cúp Quốc Gia
    const topEuropeanRivals = ALL_CLUBS.filter(c => (c.power || 75) >= 88 && c.id !== activePlayerClub.id);
    const domesticCupName = activePlayerClub.league?.domesticCup || "Cúp Quốc Gia";
    const euroTourneyName = euroStatus === "C1"
      ? "UEFA Champions League"
      : (euroStatus === "C2" ? "UEFA Europa League" : (euroStatus === "C3" ? "UEFA Conference League" : null));

    // Hàm helper loại bỏ đội tuyển của chính người chơi
    const isSameNationalTeam = (t, pNat) => {
      if (!t || !pNat) return false;
      if (t.id && pNat.id && String(t.id).toLowerCase() === String(pNat.id).toLowerCase()) return true;
      if (t.code && pNat.code && String(t.code).toUpperCase() === String(pNat.code).toUpperCase()) return true;
      if (t.flag && pNat.flag && t.flag === pNat.flag) return true;
      const n1 = String(t.name || '').replace(/Tuyển\s*/i, '').trim().toLowerCase();
      const n2 = String(pNat.name || '').replace(/Tuyển\s*/i, '').trim().toLowerCase();
      return n1.length > 0 && n2.length > 0 && (n1 === n2 || n1.includes(n2) || n2.includes(n1));
    };

    // Chuẩn bị đối thủ FIFA Days cho ĐTQG nếu thỏa mãn điều kiện tuổi 17+
    let natOpp1 = null, natOpp2 = null;
    if (isNatEligible && playerNationality) {
      const natRegion = playerNationality.region || "UEFA";
      const regionTeams = NATIONAL_TEAMS_DATA[natRegion] || NATIONAL_TEAMS_DATA.UEFA || [];
      const availableOpps = regionTeams.filter(t => !isSameNationalTeam(t, playerNationality));
      natOpp1 = availableOpps[0] || { name: "Đối Thủ Châu Lục 1", flag: "🚩", code: "NT1", power: 80 };
      natOpp2 = availableOpps[1] || availableOpps[0] || { name: "Đối Thủ Châu Lục 2", flag: "🚩", code: "NT2", power: 82 };
    }

    allLeagueRounds.forEach((roundMatches, rIdx) => {
      const roundNum = rIdx + 1;
      const pMatch = roundMatches.find(m =>
        isSameClub(m.home, activePlayerClub) ||
        isSameClub(m.away, activePlayerClub) ||
        m.home.id === activePlayerClub.id ||
        m.away.id === activePlayerClub.id
      ) || roundMatches[0];
      const isHome = isSameClub(pMatch.home, activePlayerClub) || pMatch.home.id === activePlayerClub.id;
      const opponent = isHome ? pMatch.away : pMatch.home;

      const isDerby = Boolean(
        (activePlayerClub.derbyRivals && activePlayerClub.derbyRivals.includes(opponent.id)) ||
        (opponent.derbyRivals && opponent.derbyRivals.includes(activePlayerClub.id))
      );
      const isBigMatch = isDerby || (opponent.power >= 85) || (roundNum === 1) || (roundNum === totalLeagueRounds);

      fixtures.push({
        roundNumber: roundNum,
        type: "CLUB",
        competitionType: "LEAGUE",
        competitionName: activePlayerClub.league?.name || "Premier League",
        stageName: `Vòng ${roundNum}/${totalLeagueRounds}`,
        dateStr: `Vòng ${roundNum}`,
        isCompleted: false,
        isNationalTeam: false,
        playerMatch: {
          id: `fix_league_${roundNum}_${pMatch.home.id}_${pMatch.away.id}`,
          type: "CLUB",
          homeClub: pMatch.home,
          awayClub: pMatch.away,
          isPlayerHome: isHome,
          opponent: opponent,
          stadium: isHome ? (activePlayerClub.stadium || "Sân Nhà") : (opponent.stadium || "Sân Khách"),
          isBigMatch: isBigMatch,
          isDerby: isDerby,
          isPlayed: false,
          isNationalTeam: false,
          result: null
        },
        aiMatches: roundMatches.filter(m => m !== pMatch && !isSameClub(m.home, activePlayerClub) && !isSameClub(m.away, activePlayerClub)).map((m, mIdx) => ({
          id: `fix_ai_${roundNum}_${mIdx}`,
          homeClub: m.home,
          awayClub: m.away,
          isPlayed: false,
          homeScore: null,
          awayScore: null
        }))
      });

      // ── XEN KẼ CÚP QUỐC GIA (MIDWEEK DOMESTIC CUP) ──
      if (roundNum === 5) {
        fixtures.push(createCupFixture(activePlayerClub, domesticCupName, "Vòng 1/32 Cúp Quốc Gia", "DOMESTIC_CUP", clubsPool[clubsPool.length - 2], false));
      } else if (roundNum === 12) {
        fixtures.push(createCupFixture(activePlayerClub, domesticCupName, "Vòng 1/16 Cúp Quốc Gia", "DOMESTIC_CUP", clubsPool[Math.floor(clubsPool.length / 2)], false));
      } else if (roundNum === 20) {
        const domQfOpp = brackets?.domesticCup?.quarterFinals?.find(m => m.isPlayerMatch)?.club2 || clubsPool[4] || clubsPool[1];
        fixtures.push(createCupFixture(activePlayerClub, domesticCupName, "Tứ Kết Cúp Quốc Gia", "DOMESTIC_CUP", domQfOpp, true));
      } else if (roundNum === 28) {
        fixtures.push(createCupFixture(activePlayerClub, domesticCupName, "Bán Kết Cúp Quốc Gia", "DOMESTIC_CUP", clubsPool[2] || clubsPool[0], true));
      } else if (roundNum === 35) {
        fixtures.push(createCupFixture(activePlayerClub, domesticCupName, "Chung Kết Cúp Quốc Gia", "DOMESTIC_CUP", clubsPool[1] || clubsPool[0], true));
      }

      // ── XEN KẼ ĐẤU TRƯỜNG CHÂU ÂU (UEFA CHAMPIONS LEAGUE / EUROPA LEAGUE) ──
      if (euroTourneyName) {
        const groupRivals = groupTable && groupTable.length >= 4 ? groupTable.filter(c => !c.isPlayer) : null;
        const uclRival1 = (groupRivals && groupRivals[0]) ? ALL_CLUBS.find(c => c.id === groupRivals[0].clubId) || groupRivals[0] : (topEuropeanRivals[0] || clubsPool[1]);
        const uclRival2 = (groupRivals && groupRivals[1]) ? ALL_CLUBS.find(c => c.id === groupRivals[1].clubId) || groupRivals[1] : (topEuropeanRivals[1] || clubsPool[2]);
        const uclRival3 = (groupRivals && groupRivals[2]) ? ALL_CLUBS.find(c => c.id === groupRivals[2].clubId) || groupRivals[2] : (topEuropeanRivals[2] || clubsPool[0]);

        if (roundNum === 3) {
          fixtures.push(createCupFixture(activePlayerClub, euroTourneyName, "Vòng Bảng Lượt 1", "UCL", uclRival1, false));
        } else if (roundNum === 7) {
          fixtures.push(createCupFixture(activePlayerClub, euroTourneyName, "Vòng Bảng Lượt 2", "UCL", uclRival2, false));
        } else if (roundNum === 11) {
          fixtures.push(createCupFixture(activePlayerClub, euroTourneyName, "Vòng Bảng Lượt 3", "UCL", uclRival3, true));
        } else if (roundNum === 15) {
          fixtures.push(createCupFixture(activePlayerClub, euroTourneyName, "Vòng Bảng Lượt 4", "UCL", uclRival2, false));
        } else if (roundNum === 18) {
          fixtures.push(createCupFixture(activePlayerClub, euroTourneyName, "Vòng Bảng Lượt 5", "UCL", uclRival1, true));
        } else if (roundNum === 22) {
          fixtures.push(createCupFixture(activePlayerClub, euroTourneyName, "Vòng Bảng Lượt 6 (Quyết Định Vé Đi Tiếp)", "UCL", uclRival3, true));
        } else if (roundNum === 25) {
          fixtures.push(createCupFixture(activePlayerClub, euroTourneyName, "Vòng 1/8 Knockout Châu Âu", "UCL", topEuropeanRivals[3] || clubsPool[1], true));
        } else if (roundNum === 30) {
          const euroQfOpp = brackets?.continentalCup?.quarterFinals?.find(m => m.isPlayerMatch)?.club2 || topEuropeanRivals[4] || clubsPool[2];
          fixtures.push(createCupFixture(activePlayerClub, euroTourneyName, "Tứ Kết Châu Âu", "UCL", euroQfOpp, true));
        } else if (roundNum === 34) {
          fixtures.push(createCupFixture(activePlayerClub, euroTourneyName, "Bán Kết Châu Âu", "UCL", topEuropeanRivals[0] || clubsPool[0], true));
        } else if (roundNum === totalLeagueRounds) {
          fixtures.push(createCupFixture(activePlayerClub, euroTourneyName, "Chung Kết Cúp Châu Âu Đỉnh Cao", "UCL", topEuropeanRivals[1] || clubsPool[1], true));
        }
      }

      // ── XEN KẼ 2 TRẬN FIFA DAYS CHO ĐỘI TUYỂN QUỐC GIA (TUỔI 17+) ──
      if (isNatEligible && playerNationality) {
        // Trận 1 (Mùa Thu): Sau vòng 10
        if (roundNum === 10 && natOpp1) {
          fixtures.push(createNationalTeamFixture(playerNationality, "FIFA Days • Vòng Loại Châu Lục", "Vòng Loại Quốc Tế - Lượt 1", natOpp1, true));
        }
        // Trận 2 (Mùa Xuân): Sau vòng 24
        else if (roundNum === 24 && natOpp2) {
          fixtures.push(createNationalTeamFixture(playerNationality, "FIFA Days • Giao Hữu Quốc Tế", "Giao Hữu Quốc Tế - Lượt 2", natOpp2, false));
        }
      }
    });

    // ── MÙA HÈ (CUỐI MÙA): CHIẾN DỊCH GIẢI ĐẤU LỚN ĐTQG (WORLD CUP HOẶC EURO/COPA/ASIAN CUP) ──
    if (isNatEligible && playerNationality) {
      const seasonYear = player?.year || 2027;
      const isWorldCup = (seasonYear % 4 === 2);
      let summerCompName = "FIFA World Cup";
      let summerPool = [];

      if (isWorldCup) {
        summerCompName = "FIFA World Cup";
        summerPool = [
          ...(NATIONAL_TEAMS_DATA.UEFA || []),
          ...(NATIONAL_TEAMS_DATA.CONMEBOL || []),
          ...(NATIONAL_TEAMS_DATA.ASIA || []),
          ...(NATIONAL_TEAMS_DATA.GLOBAL_OTHER || [])
        ].filter(t => !isSameNationalTeam(t, playerNationality));
      } else {
        const reg = playerNationality.region || "UEFA";
        if (reg === "CONMEBOL") summerCompName = "Copa América";
        else if (reg === "ASIA") summerCompName = "AFC Asian Cup";
        else if (reg === "GLOBAL_OTHER") summerCompName = "CONCACAF Gold Cup";
        else summerCompName = "UEFA EURO";

        const regTeams = NATIONAL_TEAMS_DATA[reg] || NATIONAL_TEAMS_DATA.UEFA || [];
        summerPool = regTeams.filter(t => !isSameNationalTeam(t, playerNationality));
      }

      const shuffledSummer = [...summerPool].sort(() => 0.5 - Math.random());
      const sOpp1 = shuffledSummer[0] || { name: "Đối Thủ VCK 1", flag: "🚩", code: "S1", power: 81 };
      const sOpp2 = shuffledSummer[1] || { name: "Đối Thủ VCK 2", flag: "🚩", code: "S2", power: 83 };
      const sOpp3 = shuffledSummer[2] || { name: "Đối Thủ VCK 3", flag: "🚩", code: "S3", power: 85 };
      const sOpp4 = shuffledSummer[3] || { name: "Đối Thủ Bán Kết", flag: "⭐", code: "SF", power: 87 };
      const sOpp5 = shuffledSummer[4] || { name: "Đối Thủ Chung Kết", flag: "👑", code: "FIN", power: 89 };

      fixtures.push(createNationalTeamFixture(playerNationality, summerCompName, `VCK ${summerCompName} • Vòng Bảng Lượt 1`, sOpp1, true));
      fixtures.push(createNationalTeamFixture(playerNationality, summerCompName, `VCK ${summerCompName} • Vòng Bảng Lượt 2`, sOpp2, false));
      fixtures.push(createNationalTeamFixture(playerNationality, summerCompName, `VCK ${summerCompName} • Vòng Bảng Lượt 3 (Quyết Định)`, sOpp3, true));
      fixtures.push(createNationalTeamFixture(playerNationality, summerCompName, `VCK ${summerCompName} • Bán Kết`, sOpp4, true));
      fixtures.push(createNationalTeamFixture(playerNationality, summerCompName, `VCK ${summerCompName} • Chung Kết`, sOpp5, true));
    }
  }

  // Đánh chỉ số thứ tự trận trọn vẹn (roundIndex: 0 -> M-1) và chuẩn hóa thuộc tính match.type
  fixtures.forEach((f, idx) => {
    f.roundIndex = idx;
    if (!f.type) {
      f.type = f.isNationalTeam ? 'NATIONAL_TEAM' : 'CLUB';
    }
    if (f.playerMatch) {
      if (!f.playerMatch.type) {
        f.playerMatch.type = f.type;
      }
      f.playerMatch.isNationalTeam = Boolean(f.isNationalTeam);
    }
  });

  return fixtures;
}

/**
 * Helper tạo trận đấu Đội Tuyển Quốc Gia (FIFA Days / Summer Tournament)
 * Gán thuộc tính trận đấu: match.type = 'NATIONAL_TEAM'
 */
export function createNationalTeamFixture(playerNat, compName, stageName, oppNat, isHome = true) {
  const pTeam = {
    id: playerNat.id || "nat_player",
    name: playerNat.name,
    code: playerNat.code || playerNat.id || "NT",
    icon: playerNat.flag,
    flag: playerNat.flag,
    power: playerNat.power || 82,
    stadium: playerNat.stadium || "Sân Vận Động Quốc Gia"
  };
  const oTeam = {
    id: oppNat.id || "nat_opp",
    name: oppNat.name,
    code: oppNat.code || "OPP",
    icon: oppNat.flag,
    flag: oppNat.flag,
    power: oppNat.power || 80,
    stadium: oppNat.stadium || "Sân Vận Động Quốc Tế"
  };

  const homeTeam = isHome ? pTeam : oTeam;
  const awayTeam = isHome ? oTeam : pTeam;

  return {
    roundNumber: 0,
    type: "NATIONAL_TEAM",
    competitionType: "NATIONAL_TEAM",
    competitionName: compName,
    stageName: stageName,
    dateStr: stageName,
    isCompleted: false,
    isNationalTeam: true,
    playerMatch: {
      id: `fix_nat_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: "NATIONAL_TEAM",
      homeClub: homeTeam,
      awayClub: awayTeam,
      isPlayerHome: isHome,
      opponent: oTeam,
      stadium: isHome ? pTeam.stadium : oTeam.stadium,
      isBigMatch: true,
      isDerby: false,
      isPlayed: false,
      isNationalTeam: true,
      result: null
    },
    aiMatches: []
  };
}

/**
 * Helper tạo trận đấu cúp xen kẽ
 * Gán thuộc tính trận đấu: match.type = 'CLUB'
 */
function createCupFixture(playerClub, cupName, stageName, compType, opponentClub, isBigMatch) {
  const isYouth = Boolean(
    playerClub.isAcademy ||
    (playerClub.name && (playerClub.name.includes("Academy") || playerClub.name.includes("Masia") || playerClub.name.includes("Castilla") || playerClub.name.includes("Campus") || playerClub.name.includes("Cobham") || playerClub.name.includes("Carrington") || playerClub.name.includes("Toekomst"))) ||
    (playerClub.id && (playerClub.id.includes("acad") || playerClub.id === 'la_masia' || playerClub.id === 'castilla' || playerClub.id === 'de_toekomst' || playerClub.id === 'pvf_youth' || playerClub.id === 'ajax_academy'))
  );
  const pool = isYouth ? YOUTH_LEAGUE_CLUBS : ALL_CLUBS;

  let opp = opponentClub;
  // BẮT BUỘC kiểm tra: awayTeam.id !== homeTeam.id && !isSameClub(homeTeam, awayTeam)
  if (!opp || opp.id === playerClub.id || isSameClub(playerClub, opp)) {
    const validOpps = pool.filter(c => c.id !== playerClub.id && !isSameClub(c, playerClub));
    opp = validOpps[Math.floor(Math.random() * validOpps.length)] || { id: "cup_opp", name: "Đại Kình Địch Cúp", code: "CUP", icon: "🏆", power: 84, attPower: 85, defPower: 84, stadium: "Sân Khách Cúp" };
  }

  const isHome = Math.random() < 0.5;
  const homeClub = isHome ? playerClub : opp;
  const awayClub = isHome ? opp : playerClub;

  const stadium = stageName.includes("Chung Kết")
    ? "Sân Vận Động Wembley / Quốc Gia"
    : (isHome ? (playerClub.stadium || "Sân Nhà") : (opp.stadium || "Sân Khách"));

  // Đảm bảo aiMatches trong cup fixture không chứa CLB của người chơi
  const aiPool = pool.filter(c => c.id !== playerClub.id && !isSameClub(c, playerClub) && c.id !== opp.id && !isSameClub(c, opp));
  const ai1_h = aiPool[0] || { name: "Man City", code: "MCI", icon: "👑", attPower: 94, defPower: 92 };
  const ai1_a = aiPool[1] || { name: "Arsenal FC", code: "ARS", icon: "🔴", attPower: 92, defPower: 93 };
  const ai2_h = aiPool[2] || { name: "Real Madrid", code: "RMA", icon: "👑", attPower: 95, defPower: 94 };
  const ai2_a = aiPool[3] || { name: "Bayern Munich", code: "BAY", icon: "🔴", attPower: 94, defPower: 92 };

  return {
    roundNumber: 0,
    type: "CLUB",
    competitionType: compType,
    competitionName: cupName,
    stageName: stageName,
    stage: stageName,
    isCup: true,
    isNationalTeam: false,
    dateStr: stageName,
    isCompleted: false,
    playerMatch: {
      id: `fix_cup_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      type: "CLUB",
      homeClub,
      awayClub,
      isPlayerHome: isHome,
      opponent: opp,
      stadium: stadium,
      isBigMatch: isBigMatch,
      isDerby: Boolean(playerClub.derbyRivals && playerClub.derbyRivals.includes(opp.id)),
      isPlayed: false,
      isCup: true,
      isNationalTeam: false,
      stage: stageName,
      stageName: stageName,
      competitionType: compType,
      competitionName: cupName,
      result: null
    },
    aiMatches: [
      {
        id: `fix_cup_ai_1`,
        homeClub: ai1_h,
        awayClub: ai1_a,
        isPlayed: false,
        homeScore: null,
        awayScore: null
      },
      {
        id: `fix_cup_ai_2`,
        homeClub: ai2_h,
        awayClub: ai2_a,
        isPlayed: false,
        homeScore: null,
        awayScore: null
      }
    ]
  };
}

/**
 * Khởi tạo Bảng xếp hạng giải VĐQG (16 đội cho giải Trẻ U19, 20 hoặc 18 đội cho giải Chuyên Nghiệp)
 */
export function initLeagueTable(clubsListOrPlayer, playerClub) {
  let clubsList = clubsListOrPlayer;
  let activePlayerClub = playerClub;

  // Hỗ trợ gọi linh hoạt dạng initLeagueTable(player)
  if (clubsListOrPlayer && !Array.isArray(clubsListOrPlayer) && typeof clubsListOrPlayer === 'object') {
    const player = clubsListOrPlayer;
    activePlayerClub = getPlayerActiveClub ? getPlayerActiveClub(player) : (player.currentClub || player.academy || player.club);
    const isYouth = !player.isPro || player.tier === 3 || player.leagueId === 'academy' || Boolean(player.isAcademyStage || (player.age && player.age <= 16) || player.leagueId === 'YOUTH_LEAGUE') || (player.club && (player.club.isAcademy || isSameClub(player.club, { name: 'campus' })));
    if (isYouth) {
      clubsList = YOUTH_LEAGUE_CLUBS;
    } else {
      const leagueId = player.leagueId || 'PREMIER_LEAGUE';
      clubsList = LEAGUE_TEAMS_MAP[leagueId] ? [...LEAGUE_TEAMS_MAP[leagueId]] : null;
      if (!clubsList || clubsList.length < 4) {
        clubsList = ALL_CLUBS.filter(c => c.league && c.league.id === leagueId);
      }
      if (!clubsList || clubsList.length < 4) {
        clubsList = [...LEAGUE_TEAMS_MAP.PREMIER_LEAGUE];
      }
    }
  }

  if (!clubsList || !Array.isArray(clubsList)) return [];

  // Tạo bản sao tránh làm biến đổi danh sách gốc
  const pool = clubsList.map(club => ({ ...club }));

  // Đảm bảo CLB của người chơi luôn có mặt trong bảng xếp hạng
  if (activePlayerClub) {
    const foundIdx = pool.findIndex(c =>
      c.id === activePlayerClub.id ||
      c.idAlias === activePlayerClub.id ||
      c.name === activePlayerClub.name ||
      isSameClub(c, activePlayerClub) ||
      isClubMatch(c, activePlayerClub)
    );
    if (foundIdx === -1) {
      // Thay thế CLB ở vị trí cuối để bảo toàn đúng số lượng đội của giải đấu (16 đội giải Trẻ)
      pool[pool.length - 1] = { ...activePlayerClub };
    } else {
      pool[foundIdx] = { ...pool[foundIdx], ...activePlayerClub };
    }
  }

  const table = pool.map(club => ({
    clubId: club.id,
    id: club.id,
    clubName: club.name,
    name: club.name,
    clubCode: club.code || club.name.substring(0, 3).toUpperCase(),
    clubIcon: club.icon || "⚽",
    power: club.power || 75,
    isPlayerClub: Boolean(activePlayerClub && (
      club.id === activePlayerClub.id ||
      club.idAlias === activePlayerClub.id ||
      club.name === activePlayerClub.name ||
      isSameClub(club, activePlayerClub) ||
      isClubMatch(club, activePlayerClub)
    )),
    played: 0,
    matches: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
    recentForm: [] // Mảng tối đa 5 phần tử: 'W', 'D', 'L'
  }));

  // Sắp xếp khởi điểm theo thực lực sức mạnh
  table.sort((a, b) => (b.power || 75) - (a.power || 75));
  return table;
}

/**
 * Cập nhật bảng xếp hạng sau mỗi trận đấu
 */
export function updateLeagueTable(table, homeClubOrId, awayClubOrId, homeScore, awayScore) {
  if (!table || !Array.isArray(table)) return;

  const findTeam = (clubOrId) => {
    if (!clubOrId) return null;
    return table.find(t => isSameClub(t, clubOrId) || isClubMatch(t, clubOrId));
  };

  const home = findTeam(homeClubOrId);
  const away = table.find(t => t !== home && (isSameClub(t, awayClubOrId) || isClubMatch(t, awayClubOrId))) || findTeam(awayClubOrId);
  if (!home || !away || home === away) {
    console.warn("updateLeagueTable: could not match distinct clubs", { homeClubOrId, awayClubOrId, home, away });
    return;
  }

  home.played = (home.played || home.matches || 0) + 1;
  home.matches = home.played;
  away.played = (away.played || away.matches || 0) + 1;
  away.matches = away.played;

  const hScore = Number(homeScore ?? 0);
  const aScore = Number(awayScore ?? 0);

  home.gf = (home.gf || 0) + hScore;
  home.ga = (home.ga || 0) + aScore;
  home.gd = home.gf - home.ga;

  away.gf = (away.gf || 0) + aScore;
  away.ga = (away.ga || 0) + hScore;
  away.gd = away.gf - away.ga;

  home.recentForm = home.recentForm || [];
  away.recentForm = away.recentForm || [];

  if (hScore > aScore) {
    home.won = (home.won || 0) + 1;
    home.points = (home.points || 0) + 3;
    home.recentForm.push('W');
    away.lost = (away.lost || 0) + 1;
    away.recentForm.push('L');
  } else if (hScore < aScore) {
    away.won = (away.won || 0) + 1;
    away.points = (away.points || 0) + 3;
    away.recentForm.push('W');
    home.lost = (home.lost || 0) + 1;
    home.recentForm.push('L');
  } else {
    home.drawn = (home.drawn || 0) + 1;
    home.points = (home.points || 0) + 1;
    home.recentForm.push('D');
    away.drawn = (away.drawn || 0) + 1;
    away.points = (away.points || 0) + 1;
    away.recentForm.push('D');
  }

  if (home.recentForm.length > 5) home.recentForm = home.recentForm.slice(-5);
  if (away.recentForm.length > 5) away.recentForm = away.recentForm.slice(-5);
  home.form = home.recentForm;
  away.form = away.recentForm;

  // Sắp xếp BXH: Điểm số -> Hiệu số bàn thắng (GD) -> Bàn thắng (GF)
  table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    const aName = a.clubName || a.name || "";
    const bName = b.clubName || b.name || "";
    return aName.localeCompare(bName);
  });
}

/**
 * Khởi tạo danh sách Vua Phá Lưới (Top Scorers) của giải đấu ngoài đời thực
 */
export function initLeagueTopScorers(leagueId, player) {
  if (!player) return [];
  const isAcademy = !player.isPro || player.tier === 3 || player.leagueId === 'academy' || Boolean(player.isAcademyStage || player.age <= 16 || leagueId === 'YOUTH_LEAGUE') || (player.club && (player.club.isAcademy || isSameClub(player.club, { name: 'campus' })));

  let pool = [];
  if (isAcademy) {
    pool = YOUTH_RIVAL_SCORERS || [];
  } else {
    let key = leagueId || player.currentLeagueId || player.currentClub?.league?.id || "PREMIER_LEAGUE";
    if (!REAL_RIVAL_SCORERS[key]) {
      key = "PREMIER_LEAGUE";
    }
    pool = REAL_RIVAL_SCORERS[key] || [];
  }

  const playerClub = getPlayerActiveClub(player) || (isAcademy ? { id: "bayern_junior", name: "FC Bayern Campus", code: "BAY", icon: "🔴" } : { id: "player_club", name: "CLB Chủ Quản", code: "CLB", icon: "⭐" });
  const playerClubName = playerClub.name || (player.club?.name) || "CLB Chủ Quản";
  const playerClubCode = playerClub.code || (playerClubName ? playerClubName.substring(0, 3).toUpperCase() : "CLB");
  const playerClubIcon = playerClub.icon || (isAcademy ? "🌱" : "⭐");
  const playerClubId = playerClub.id || (isAcademy ? "bayern_junior" : "player_club");

  const isStartOfSeason = (player.currentFixtureIndex === 0 || !player.currentSeasonStats || player.currentSeasonStats.matches === 0);
  const playerGoals = isStartOfSeason ? 0 : (player.currentSeasonStats?.goals || player.goals || 0);

  const list = [
    {
      name: `${player.name} (BẠN)`,
      clubId: playerClubId,
      clubName: playerClubName,
      clubCode: playerClubCode,
      clubIcon: playerClubIcon,
      goals: playerGoals,
      isPlayer: true
    }
  ];

  pool.forEach(star => {
    list.push({
      id: star.id || "",
      name: star.name,
      clubId: star.clubId || star.id || "",
      clubName: star.clubName,
      clubCode: star.clubCode || (star.clubName ? star.clubName.substring(0, 3).toUpperCase() : ""),
      clubIcon: star.clubIcon || "⚽",
      goals: 0,
      isPlayer: false,
      avgGPR: star.baseGPR || star.avgGPR || 0.55
    });
  });

  list.sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  list.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  return list;
}

/**
 * Cập nhật bảng Vua Phá Lưới sau mỗi vòng đấu (Real-time Match Sync)
 */
export function updateLeagueTopScorers(topScorers, playerGoalsAdded = 0, roundScorerEvents = [], player = null) {
  if (!topScorers || !Array.isArray(topScorers)) return;

  // 1. Cập nhật bàn thắng của người chơi (TUYỆT ĐỐI KHÔNG can thiệp hay giảm bàn thắng của người chơi)
  const playerRow = topScorers.find(s => s.isPlayer);
  if (playerRow) {
    if (player) {
      playerRow.goals = (player.currentSeasonStats?.goals !== undefined ? player.currentSeasonStats.goals : (player.goals || 0));
    } else if (playerGoalsAdded > 0) {
      playerRow.goals = (playerRow.goals || 0) + playerGoalsAdded;
    }
  }

  // 2. Mô phỏng bàn thắng cho các đối thủ ảo:
  // - Mỗi vòng đấu chỉ có khoảng 30% - 40% cơ hội 1 cầu thủ ảo ghi 1 bàn.
  // - Cực hiếm khi ghi 2 bàn (tỷ lệ < 5%), không cho phép ghi 3 bàn/vòng.
  topScorers.forEach(scorer => {
    if (scorer.isPlayer) return;

    const roll = Math.random();
    let newGoals = 0;
    if (roll < 0.05) {
      newGoals = 2; // Cực hiếm khi ghi 2 bàn (< 5%)
    } else if (roll < (scorer.baseGPR ? Math.min(0.40, Math.max(0.28, scorer.baseGPR * 0.65)) : 0.35)) {
      newGoals = 1; // Khoảng 30% - 40% cơ hội ghi 1 bàn
    }
    scorer.goals = (scorer.goals || 0) + newGoals;
  });

  // Luôn đảm bảo dòng của người chơi (isPlayer: true) phản ánh chính xác số bàn thực tế
  if (playerRow && player) {
    playerRow.goals = (player.currentSeasonStats?.goals !== undefined ? player.currentSeasonStats.goals : (player.goals || 0));
  }

  // Sắp xếp lại danh sách Vua phá lưới theo số bàn thắng giảm dần
  topScorers.sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  topScorers.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  // 3. Tự động kiểm tra danh hiệu Vô địch giải VĐQG & danh hiệu cá nhân khi hoàn thành giải VĐQG hoặc hết mùa
  const activeP = player || (typeof getPlayer === 'function' ? getPlayer() : null) || (typeof window !== 'undefined' && window.gameState?.player);
  if (activeP) {
    const isYouth = Boolean(activeP.isAcademyStage || (activeP.age && activeP.age <= 16));
    const maxLeagueRounds = isYouth ? (activeP.leagueTable?.length ? (activeP.leagueTable.length - 1) * 2 : 30) : 38;

    // Kiểm tra xem đội của người chơi đã đá đủ số vòng VĐQG chưa (30 vòng cho giải trẻ 16 đội)
    const activeClub = getPlayerActiveClub ? getPlayerActiveClub(activeP) : (activeP.academy || activeP.club || activeP.currentClub);
    const pTeamRow = (activeP.leagueTable || []).find(t => t.isPlayerClub || isSameClub(t, activeClub));
    const playedMatches = pTeamRow ? (pTeamRow.played || pTeamRow.matches || 0) : 0;

    const isFinishedLeague = playedMatches >= maxLeagueRounds ||
      (activeP.currentSeasonFixtures && (activeP.currentFixtureIndex || 0) >= activeP.currentSeasonFixtures.length);

    if (isFinishedLeague) {
      checkAndAwardLeagueTitle(activeP);
      checkAndAwardIndividualYouthAwards(activeP);
    }
  }
}

/**
 * Danh sách ứng viên kình địch kiến tạo trẻ U19
 */
export const YOUTH_RIVAL_ASSIST_POOL = [
  { id: 'alvaro_rodriguez', name: 'Álvaro Rodríguez', clubName: 'Real Madrid Castilla', clubIcon: '⚪' },
  { id: 'marc_guiu', name: 'Marc Guiu', clubName: 'FC Barcelona La Masia', clubIcon: '🔵🔴' },
  { id: 'ethan_wheatley', name: 'Ethan Wheatley', clubName: 'Man United Carrington', clubIcon: '🔴' },
  { id: 'jonah_kusi', name: 'Jonah Kusi-Asare', clubName: 'FC Bayern Campus', clubIcon: '🔴' },
  { id: 'tyrique_george', name: 'Tyrique George', clubName: 'Chelsea Cobham Academy', clubIcon: '🔵' },
  { id: 'don_konadu', name: 'Don-Angelo Konadu', clubName: 'Ajax De Toekomst', clubIcon: '⚪🔴' },
  { id: 'gustavo_varela', name: 'Gustavo Varela', clubName: 'Benfica Seixal Campus', clubIcon: '🦅' },
  { id: 'gabriel_silva', name: 'Gabriel Silva', clubName: 'Sporting CP Academy', clubIcon: '🦁' },
  { id: 'paris_brunner', name: 'Paris Brunner', clubName: 'Borussia Dortmund Youth', clubIcon: '🟡⚫' },
  { id: 'ethan_nwaneri', name: 'Ethan Nwaneri', clubName: 'Arsenal Hale End', clubIcon: '🔴⚪' },
  { id: 'joel_ndala', name: 'Joel Ndala', clubName: 'Man City CFA', clubIcon: '🩵' },
  { id: 'lorenzo_anghele', name: 'Lorenzo Anghelè', clubName: 'Juventus Primavera', clubIcon: '⚪⚫' },
  { id: 'issiaka_kamate', name: 'Issiaka Kamate', clubName: 'Inter Milan Youth', clubIcon: '🔵⚫' },
  { id: 'senny_mayulu', name: 'Senny Mayulu', clubName: 'PSG Youth Academy', clubIcon: '🔵🔴' },
  { id: 'eli_kroupi', name: 'Eli Junior Kroupi', clubName: 'INF Clairefontaine', clubIcon: '🇫🇷' },
  { id: 'le_phat', name: 'Nguyễn Lê Phát', clubName: 'PVF Football Academy', clubIcon: '🇻🇳' }
];

/**
 * Khởi tạo danh sách Vua Kiến Tạo (Top Playmakers) của giải đấu
 * ĐẦU MÙA (VÒNG 0): TẤT CẢ cầu thủ (cả người chơi và AI) BẮT BUỘC có kiến tạo = 0.
 */
export function initLeagueTopAssists(leagueId, player) {
  if (!player) return [];
  const isAcademy = !player.isPro || player.tier === 3 || player.leagueId === 'academy' || Boolean(player.isAcademyStage || player.age <= 16 || leagueId === 'YOUTH_LEAGUE') || (player.club && (player.club.isAcademy || isSameClub(player.club, { name: 'campus' })));

  const activeClub = getPlayerActiveClub ? getPlayerActiveClub(player) : (player.currentClub || player.academy || player.club);
  const pName = `${player.name || 'Hoàng Sơn'} (BẠN)`;
  const pClubName = activeClub?.name || (player.club?.name) || (isAcademy ? "FC Bayern Campus" : "CLB Chủ Quản");
  const pClubIcon = activeClub?.icon || (isAcademy ? "🔴" : "⭐");
  const pClubCode = activeClub?.code || (pClubName ? pClubName.substring(0, 3).toUpperCase() : "CLB");

  const isStartOfSeason = (player.currentFixtureIndex === 0 || !player.currentSeasonStats || player.currentSeasonStats.matches === 0);
  const playerAssists = isStartOfSeason ? 0 : (player.currentSeasonStats?.assists !== undefined ? player.currentSeasonStats.assists : (player.assists || 0));

  const list = [
    {
      id: 'player',
      name: pName,
      clubName: pClubName,
      clubIcon: pClubIcon,
      clubCode: pClubCode,
      assists: playerAssists,
      isPlayer: true
    }
  ];

  YOUTH_RIVAL_ASSIST_POOL.forEach(r => {
    list.push({
      id: r.id,
      name: r.name,
      clubName: r.clubName,
      clubIcon: r.clubIcon || "⚽",
      assists: 0,
      isPlayer: false
    });
  });

  list.sort((a, b) => {
    if (b.assists !== a.assists) return b.assists - a.assists;
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  list.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  player.leagueTopAssists = list;
  return list;
}

/**
 * Cập nhật danh sách Vua Kiến Tạo sau mỗi vòng đấu
 * - Đối thủ ảo: mỗi vòng chỉ có tỷ lệ ~20-30% có thêm 1 kiến tạo
 * - Người chơi: lấy đúng player.currentSeasonStats.assists
 */
export function updateLeagueTopAssists(player) {
  const p = player || (typeof getPlayer === 'function' ? getPlayer() : null) || (typeof window !== 'undefined' && window.gameState?.player);
  if (!p) return [];
  if (!p.leagueTopAssists || !Array.isArray(p.leagueTopAssists) || p.leagueTopAssists.length === 0) {
    initLeagueTopAssists(p.leagueId || 'YOUTH_LEAGUE', p);
  }

  const pAssists = p.currentSeasonStats?.assists !== undefined ? p.currentSeasonStats.assists : (p.assists || 0);

  p.leagueTopAssists.forEach(rival => {
    if (rival.isPlayer) {
      rival.assists = pAssists;
    } else {
      // Mỗi vòng chỉ có tỷ lệ ~20-30% một cầu thủ ảo có thêm 1 kiến tạo
      if (Math.random() < 0.25) {
        rival.assists = (rival.assists || 0) + 1;
      }
    }
  });

  const activeClub = getPlayerActiveClub ? getPlayerActiveClub(p) : (p.currentClub || p.academy || p.club);
  const playerRow = p.leagueTopAssists.find(r => r.isPlayer);
  if (playerRow) {
    playerRow.name = `${p.name || 'Hoàng Sơn'} (BẠN)`;
    playerRow.assists = pAssists;
    if (activeClub) {
      playerRow.clubName = activeClub.name || playerRow.clubName;
      playerRow.clubIcon = activeClub.icon || playerRow.clubIcon;
    }
  }

  // Sắp xếp lại danh sách Vua kiến tạo giảm dần theo số kiến tạo
  p.leagueTopAssists.sort((a, b) => {
    if (b.assists !== a.assists) return b.assists - a.assists;
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  p.leagueTopAssists.forEach((item, idx) => {
    item.rank = idx + 1;
  });

  const isYouth = Boolean(p.isAcademyStage || (p.age && p.age <= 16));
  const maxLeagueRounds = isYouth ? (p.leagueTable?.length ? (p.leagueTable.length - 1) * 2 : 30) : 38;
  const pTeamRow = (p.leagueTable || []).find(t => t.isPlayerClub || isSameClub(t, activeClub));
  const playedMatches = pTeamRow ? (pTeamRow.played || pTeamRow.matches || 0) : 0;
  const isFinishedLeague = playedMatches >= maxLeagueRounds ||
    (p.currentSeasonFixtures && (p.currentFixtureIndex || 0) >= p.currentSeasonFixtures.length);

  if (isFinishedLeague) {
    checkAndAwardLeagueTitle(p);
    checkAndAwardIndividualYouthAwards(p);
  }

  return p.leagueTopAssists;
}

/**
 * Danh sách siêu sao cạnh tranh Chiếc Giày Vàng Châu Âu
 */
export const SUPERSTAR_SHOE_CANDIDATES = [
  { id: 'haaland', name: 'Erling Haaland', club: 'Man City', flag: '🇳🇴', factor: 2.0 },
  { id: 'mbappe', name: 'Kylian Mbappé', club: 'Real Madrid', flag: '🇫🇷', factor: 2.0 },
  { id: 'kane', name: 'Harry Kane', club: 'Bayern Munich', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', factor: 2.0 },
  { id: 'yamal', name: 'Lamine Yamal', club: 'FC Barcelona', flag: '🇪🇸', factor: 2.0 }
];

/**
 * Khởi tạo bảng Chiếc Giày Vàng Châu Âu (Golden Shoe Tracker)
 * Đầu mùa tất cả cầu thủ (kể cả Haaland, Mbappé) bắt đầu từ 0 bàn (0.0 pts)
 */
export function initGoldenShoeTracker(player) {
  if (!player) return [];

  const isProClub = Boolean(player.currentClub && (player.isPro || player.tier === 1 || player.competitionTier?.currentTier === 1 || (player.leagueId && player.leagueId !== 'YOUTH_LEAGUE' && player.leagueId !== 'academy')));
  const isAcademy = !isProClub && Boolean(
    !player.isPro ||
    player.isAcademyStage ||
    player.tier === 3 ||
    player.competitionTier?.currentTier === 3 ||
    player.leagueId === 'YOUTH_LEAGUE' ||
    player.leagueId === 'academy' ||
    (player.academy && !player.currentClub) ||
    (player.club && (player.club.isAcademy || isSameClub(player.club, { name: 'campus' })))
  );
  const factor = (player.isAcademy !== undefined ? (player.isAcademy ? 1.0 : 2.0) : (isAcademy ? 1.0 : 2.0));

  const isStart = (player.currentFixtureIndex === 0 || !player.currentSeasonStats || player.currentSeasonStats.matches === 0);
  const playerGoals = isStart ? 0 : (player.currentSeasonStats?.goals || player.goals || 0);

  const activeClub = getPlayerActiveClub ? getPlayerActiveClub(player) : (player.currentClub || player.academy || player.club);
  const playerClubName = (isProClub ? (player.currentClub?.name || activeClub?.name) : (player.academy?.name || activeClub?.name)) || player.club?.name || "CLB";
  const playerName = player.name || "Hoàng Sơn";

  const shoeList = [
    {
      id: 'player',
      name: `${playerName} (BẠN)`,
      club: playerClubName,
      flag: player.nationality?.flag || "🇻🇳",
      goals: playerGoals,
      points: Number((playerGoals * factor).toFixed(1)),
      isPlayer: true
    }
  ];

  SUPERSTAR_SHOE_CANDIDATES.forEach(star => {
    shoeList.push({
      id: star.id,
      name: star.name,
      club: star.club,
      flag: star.flag,
      goals: 0,
      points: 0.0,
      isPlayer: false
    });
  });

  shoeList.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  shoeList.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  player.goldenShoeTracker = shoeList;
  player.goldenShoeRankings = shoeList;
  return shoeList;
}

/**
 * Cập nhật động bảng Chiếc Giày Vàng sau mỗi vòng đấu:
 * - Đối thủ Châu Âu (Haaland, Mbappé...): Mỗi vòng tăng ngẫu nhiên 0 - 1 bàn. Điểm = Số bàn * 2.0
 * - Người chơi (Hoàng Sơn): Số bàn = player.currentSeasonStats.goals. Điểm = Số bàn * (player.isAcademy ? 1.0 : 2.0)
 * - Sắp xếp lại danh sách Giày Vàng giảm dần theo điểm
 */
export function advanceGoldenShoeRound(player) {
  if (!player) return [];
  if (!player.goldenShoeTracker || !Array.isArray(player.goldenShoeTracker) || player.goldenShoeTracker.length === 0) {
    initGoldenShoeTracker(player);
  }

  const isProClub = Boolean(player.currentClub && (player.isPro || player.tier === 1 || player.competitionTier?.currentTier === 1 || (player.leagueId && player.leagueId !== 'YOUTH_LEAGUE' && player.leagueId !== 'academy')));
  const isAcademy = !isProClub && Boolean(
    !player.isPro ||
    player.isAcademyStage ||
    player.tier === 3 ||
    player.competitionTier?.currentTier === 3 ||
    player.leagueId === 'YOUTH_LEAGUE' ||
    player.leagueId === 'academy' ||
    (player.academy && !player.currentClub) ||
    (player.club && (player.club.isAcademy || isSameClub(player.club, { name: 'campus' })))
  );
  const factor = (player.isAcademy !== undefined ? (player.isAcademy ? 1.0 : 2.0) : (isAcademy ? 1.0 : 2.0));

  const playerGoals = player.currentSeasonStats?.goals !== undefined ? player.currentSeasonStats.goals : (player.goals || 0);
  const activeClub = getPlayerActiveClub ? getPlayerActiveClub(player) : (player.currentClub || player.academy || player.club);
  const playerClubName = (isProClub ? (player.currentClub?.name || activeClub?.name) : (player.academy?.name || activeClub?.name)) || player.club?.name || "CLB";
  const playerName = player.name || "Hoàng Sơn";

  // 1. Đối thủ Châu Âu (Haaland, Mbappé...): Mỗi vòng tăng ngẫu nhiên 0 - 1 bàn. Điểm = Số bàn * 2.0
  player.goldenShoeTracker.forEach(row => {
    if (row.isPlayer) return;
    const addGoal = Math.random() < 0.65 ? 1 : 0;
    row.goals = (row.goals || 0) + addGoal;
    row.points = Number((row.goals * 2.0).toFixed(1));
  });

  // 2. Người chơi (Hoàng Sơn): Số bàn = player.currentSeasonStats.goals. Điểm = Số bàn * (player.isAcademy ? 1.0 : 2.0)
  let playerRow = player.goldenShoeTracker.find(r => r.isPlayer);
  if (!playerRow) {
    playerRow = {
      id: 'player',
      name: `${playerName} (BẠN)`,
      club: playerClubName,
      flag: player.nationality?.flag || "🇻🇳",
      goals: playerGoals,
      points: Number((playerGoals * factor).toFixed(1)),
      isPlayer: true
    };
    player.goldenShoeTracker.push(playerRow);
  } else {
    playerRow.name = `${playerName} (BẠN)`;
    playerRow.club = playerClubName;
    playerRow.goals = playerGoals;
    playerRow.points = Number((playerGoals * factor).toFixed(1));
  }

  // 3. Sắp xếp lại danh sách Giày Vàng giảm dần theo điểm
  player.goldenShoeTracker.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  player.goldenShoeTracker.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  player.goldenShoeRankings = player.goldenShoeTracker;
  return player.goldenShoeTracker;
}

/**
 * Cập nhật bảng xếp hạng Chiếc Giày Vàng Châu Âu (Golden Shoe Tracker)
 */
export function updateGoldenShoeTracker(player) {
  if (!player) return [];
  if (!player.goldenShoeTracker || !Array.isArray(player.goldenShoeTracker) || player.goldenShoeTracker.length === 0) {
    return initGoldenShoeTracker(player);
  }

  const isProClub = Boolean(player.currentClub && (player.isPro || player.tier === 1 || player.competitionTier?.currentTier === 1 || (player.leagueId && player.leagueId !== 'YOUTH_LEAGUE' && player.leagueId !== 'academy')));
  const isAcademy = !isProClub && Boolean(
    !player.isPro ||
    player.isAcademyStage ||
    player.tier === 3 ||
    player.competitionTier?.currentTier === 3 ||
    player.leagueId === 'YOUTH_LEAGUE' ||
    player.leagueId === 'academy' ||
    (player.academy && !player.currentClub) ||
    (player.club && (player.club.isAcademy || isSameClub(player.club, { name: 'campus' })))
  );
  const factor = (player.isAcademy !== undefined ? (player.isAcademy ? 1.0 : 2.0) : (isAcademy ? 1.0 : 2.0));

  const playerGoals = player.currentSeasonStats?.goals !== undefined ? player.currentSeasonStats.goals : (player.goals || 0);
  const activeClub = getPlayerActiveClub ? getPlayerActiveClub(player) : (player.currentClub || player.academy || player.club);
  const playerClubName = (isProClub ? (player.currentClub?.name || activeClub?.name) : (player.academy?.name || activeClub?.name)) || player.club?.name || "CLB";
  const playerName = player.name || "Hoàng Sơn";

  let playerRow = player.goldenShoeTracker.find(r => r.isPlayer);
  if (playerRow) {
    playerRow.name = `${playerName} (BẠN)`;
    playerRow.club = playerClubName;
    playerRow.goals = playerGoals;
    playerRow.points = Number((playerGoals * factor).toFixed(1));
  }

  // Sắp xếp lại danh sách Giày Vàng giảm dần theo điểm
  player.goldenShoeTracker.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  player.goldenShoeTracker.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  player.goldenShoeRankings = player.goldenShoeTracker;

  if (typeof syncIndividualTrackersDOM === 'function') {
    syncIndividualTrackersDOM(player);
  }

  return player.goldenShoeTracker;
}

export const calculateGoldenShoe = updateGoldenShoeTracker;

/**
 * Danh sách siêu sao tranh cử Quả Bóng Vàng (Ballon d'Or)
 */
export const SUPERSTAR_BDOR_CANDIDATES = [
  { id: 'mbappe', name: 'Kylian Mbappé', club: 'Real Madrid', flag: '🇫🇷', line: 'FW', baseRating: 8.1, goalRate: 0.70, assistRate: 0.30, winRate: 0.72 },
  { id: 'haaland', name: 'Erling Haaland', club: 'Man City', flag: '🇳🇴', line: 'FW', baseRating: 8.0, goalRate: 0.75, assistRate: 0.18, winRate: 0.70 },
  { id: 'vinicius', name: 'Vinícius Júnior', club: 'Real Madrid', flag: '🇧🇷', line: 'FW', baseRating: 7.95, goalRate: 0.55, assistRate: 0.35, winRate: 0.72 },
  { id: 'bellingham', name: 'Jude Bellingham', club: 'Real Madrid', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', line: 'MF', baseRating: 7.9, goalRate: 0.45, assistRate: 0.40, winRate: 0.72 },
  { id: 'yamal', name: 'Lamine Yamal', club: 'FC Barcelona', flag: '🇪🇸', line: 'FW', baseRating: 7.85, goalRate: 0.35, assistRate: 0.50, winRate: 0.68 }
];

/**
 * Thuật toán tính điểm bình chọn Quả Bóng Vàng (Ballon d'Or Power Score)
 * Công bằng, toàn diện, tôn vinh màn trình diễn phi thường của mọi vị trí (FW, MF, DF, GK)
 * và kết hợp hài hòa giữa đẳng cấp cá nhân với danh hiệu tập thể đỉnh cao.
 */
export function calculateBallonDorScore(params = {}) {
  const {
    line = "FW",
    avgRating = 7.0,
    goals = 0,
    assists = 0,
    cleanSheets = 0,
    saves = 0,
    tackles = 0,
    teamWins = 0,
    trophies = [],
    isUnderdogMiracle = false,
    fame = 0
  } = params;

  // 1. Rating cá nhân trung bình (Base Match Rating)
  let score = Number(avgRating || 7.0) * 5;

  // 2. Điểm đóng góp chuyên môn theo từng vị trí (Position-specific metrics)
  if (line === "GK") {
    score += (cleanSheets * 2.2) + (saves * 0.25) + (goals * 2.5);
    if (cleanSheets >= 25) score += 30;
    else if (cleanSheets >= 20) score += 20;
    else if (cleanSheets >= 14) score += 8;
  } else if (line === "DF") {
    score += (cleanSheets * 2.0) + (tackles * 0.15) + (goals * 2.0) + (assists * 1.2);
    if (cleanSheets >= 25) score += 28;
    else if (cleanSheets >= 20) score += 18;
    else if (cleanSheets >= 14) score += 8;
  } else {
    // FW hoặc MF
    const gWeight = line === "MF" ? 1.3 : 1.2;
    const aWeight = line === "MF" ? 1.1 : 0.8;
    score += (goals * gWeight) + (assists * aWeight);
    if (goals >= 75) score += 35;
    else if (goals >= 60) score += 25;
    else if (goals >= 45) score += 15;
    else if (goals >= 30) score += 8;

    if (assists >= 25) score += 12;
    else if (assists >= 18) score += 6;
  }

  // 3. Trọng số danh hiệu tập thể đỉnh cao (Team Trophies)
  if (Array.isArray(trophies)) {
    trophies.forEach(t => {
      const name = String(t).toLowerCase();
      if (name.includes("c1") || name.includes("champions league")) {
        score += 25;
      } else if (name.includes("vô địch") || name.includes("premier league") || name.includes("la liga") || name.includes("serie a") || name.includes("bundesliga") || name.includes("ligue 1") || name.includes("giải vđqg") || name.includes("league")) {
        score += 18;
      } else if (name.includes("cúp") || name.includes("cup") || name.includes("fa cup") || name.includes("copa")) {
        score += 8;
      } else if (name.includes("world cup") || name.includes("euro") || name.includes("copa america") || name.includes("quốc tế")) {
        score += 30;
      } else {
        score += 6;
      }
    });
  }

  // Kỳ tích ngựa ô (Underdog Miracle)
  if (isUnderdogMiracle) {
    score += 20;
  }

  // 4. Số trận thắng của đội bóng (Team consistency)
  score += Math.min(20, (teamWins || 0) * 0.5);

  // 5. Danh tiếng quốc tế (Fame, có giới hạn tối đa để không áp đảo thành tích thi đấu)
  if (fame > 0) {
    score += Math.min(10, Math.round(Math.sqrt(fame) * 0.15));
  }

  return Number(score.toFixed(1));
}

/**
 * Khởi tạo Bảng Top 5 Quả Bóng Vàng (Ballon d'Or Power Rankings)
 * Đầu mùa tính dựa trên điểm đánh giá ban đầu
 */
export function initBallonDorRankings(player) {
  if (!player) return [];

  const pLine = getPlayerLine(player);
  const playerRating = Number(player.avgRating || 7.0);
  const pScore = calculateBallonDorScore({
    line: pLine,
    avgRating: playerRating,
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    saves: 0,
    tackles: 0,
    teamWins: 0,
    trophies: [],
    fame: player.fame || 0
  });
  player.bdorScore = pScore;

  const activeClub = getPlayerActiveClub ? getPlayerActiveClub(player) : (player.academy || player.currentClub);
  const playerClubName = (player.currentClub?.name || activeClub?.name || player.academy?.name || player.club?.name || "CLB");
  const playerName = player.name || "Hoàng Sơn";

  const bdorList = [
    {
      id: 'player',
      name: `${playerName} (BẠN)`,
      flag: player.nationality?.flag || "🇻🇳",
      club: playerClubName,
      score: pScore,
      isPlayer: true,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      saves: 0,
      tackles: 0,
      wins: 0
    }
  ];

  SUPERSTAR_BDOR_CANDIDATES.forEach(star => {
    const starScore = calculateBallonDorScore({
      line: star.line || "FW",
      avgRating: star.baseRating || 8.0,
      goals: 0,
      assists: 0,
      teamWins: 0,
      trophies: [],
      fame: 800
    });
    bdorList.push({
      id: star.id,
      name: star.name,
      club: star.club,
      flag: star.flag,
      score: starScore,
      isPlayer: false,
      goals: 0,
      assists: 0,
      wins: 0,
      line: star.line || 'FW',
      baseRating: star.baseRating,
      goalRate: star.goalRate,
      assistRate: star.assistRate,
      winRate: star.winRate
    });
  });

  bdorList.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  bdorList.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  player.ballonDorRankings = bdorList;
  player.ballonDorPowerRankings = bdorList;
  return bdorList.slice(0, 5);
}

/**
 * Cập nhật động bảng Quả Bóng Vàng sau mỗi vòng đấu
 */
export function advanceBallonDorRound(player) {
  if (!player) return [];
  if (!player.ballonDorRankings || !Array.isArray(player.ballonDorRankings) || player.ballonDorRankings.length === 0) {
    initBallonDorRankings(player);
  }

  // 1. Cập nhật cho đối thủ ảo
  player.ballonDorRankings.forEach(star => {
    if (star.isPlayer) return;
    const g = Math.random() < (star.goalRate || 0.7) ? 1 : 0;
    const a = Math.random() < (star.assistRate || 0.35) ? 1 : 0;
    const w = Math.random() < (star.winRate || 0.72) ? 1 : 0;
    star.goals = (star.goals || 0) + g;
    star.assists = (star.assists || 0) + a;
    star.wins = (star.wins || 0) + w;
    const starTrophies = [];
    if (star.wins >= 28) starTrophies.push("League");
    star.score = calculateBallonDorScore({
      line: star.line || "FW",
      avgRating: star.baseRating || 8.0,
      goals: star.goals,
      assists: star.assists,
      teamWins: star.wins,
      trophies: starTrophies,
      fame: 800
    });
  });

  // 2. Tính lại Power Score của người chơi
  const pLine = getPlayerLine(player);
  const avgRating = Number(
    player.avgRating || 
    (player.seasonRatingsSum && player.seasonRatingsCount ? Number((player.seasonRatingsSum / player.seasonRatingsCount).toFixed(2)) : 7.6)
  );
  const totalG = player.currentSeasonStats?.goals !== undefined ? player.currentSeasonStats.goals : (player.goals || 0);
  const totalA = player.currentSeasonStats?.assists !== undefined ? player.currentSeasonStats.assists : (player.assists || 0);
  const totalCS = player.currentSeasonStats?.cleanSheets !== undefined ? player.currentSeasonStats.cleanSheets : (player.cleanSheets || 0);
  const totalSV = player.currentSeasonStats?.saves !== undefined ? player.currentSeasonStats.saves : (player.saves || 0);
  const totalTK = player.currentSeasonStats?.tackles !== undefined ? player.currentSeasonStats.tackles : (player.tackles || 0);

  const activeClub = getPlayerActiveClub ? getPlayerActiveClub(player) : (player.academy || player.currentClub);
  const myClub = player.club || activeClub;
  const playerClubRow = (player.leagueTable || []).find(t => t.isPlayerClub || isSameClub(t, player.club) || (myClub && isSameClub(t, myClub)));
  const teamWins = playerClubRow?.won || 0;

  const currentTrophies = [];
  if (player.tournamentBrackets?.domesticCup?.winner && isSameClub(player.tournamentBrackets.domesticCup.winner, player.club)) {
    currentTrophies.push("Cúp Quốc Gia");
  }
  if (player.tournamentBrackets?.continentalCup?.winner && isSameClub(player.tournamentBrackets.continentalCup.winner, player.club)) {
    currentTrophies.push("Champions League");
  }

  const score = calculateBallonDorScore({
    line: pLine,
    avgRating,
    goals: totalG,
    assists: totalA,
    cleanSheets: totalCS,
    saves: totalSV,
    tackles: totalTK,
    teamWins,
    trophies: currentTrophies,
    fame: player.fame || 0
  });
  player.bdorScore = score;

  const playerClubName = (player.currentClub?.name || activeClub?.name || player.academy?.name || player.club?.name || "CLB");
  const playerName = player.name || "Hoàng Sơn";

  let playerRow = player.ballonDorRankings.find(r => r.isPlayer);
  if (!playerRow) {
    playerRow = {
      id: 'player',
      name: `${playerName} (BẠN)`,
      flag: player.nationality?.flag || "🇻🇳",
      club: playerClubName,
      score: score,
      isPlayer: true,
      goals: totalG,
      assists: totalA
    };
    player.ballonDorRankings.push(playerRow);
  } else {
    playerRow.name = `${playerName} (BẠN)`;
    playerRow.club = playerClubName;
    playerRow.score = score;
    playerRow.goals = totalG;
    playerRow.assists = totalA;
  }

  // 3. Sắp xếp lại thứ hạng
  player.ballonDorRankings.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  player.ballonDorRankings.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  player.ballonDorPowerRankings = player.ballonDorRankings;
  return player.ballonDorRankings.slice(0, 5);
}

/**
 * Cập nhật Bảng Top 5 Quả Bóng Vàng (Ballon d'Or Power Rankings)
 */
export function updateBallonDorRankings(player, seasonTrophiesList = [], isUnderdogMiracle = false) {
  if (!player) return [];
  if (!player.ballonDorRankings || !Array.isArray(player.ballonDorRankings) || player.ballonDorRankings.length === 0) {
    return initBallonDorRankings(player);
  }

  const pLine = getPlayerLine(player);
  const avgRating = Number(
    player.avgRating || 
    (player.seasonRatingsSum && player.seasonRatingsCount ? Number((player.seasonRatingsSum / player.seasonRatingsCount).toFixed(2)) : 7.6)
  );
  const totalG = player.currentSeasonStats?.goals !== undefined ? player.currentSeasonStats.goals : (player.goals || 0);
  const totalA = player.currentSeasonStats?.assists !== undefined ? player.currentSeasonStats.assists : (player.assists || 0);
  const totalCS = player.currentSeasonStats?.cleanSheets !== undefined ? player.currentSeasonStats.cleanSheets : (player.cleanSheets || 0);
  const totalSV = player.currentSeasonStats?.saves !== undefined ? player.currentSeasonStats.saves : (player.saves || 0);
  const totalTK = player.currentSeasonStats?.tackles !== undefined ? player.currentSeasonStats.tackles : (player.tackles || 0);

  const activeClub = getPlayerActiveClub ? getPlayerActiveClub(player) : (player.academy || player.currentClub);
  const myClub = player.club || activeClub;
  const playerClubRow = (player.leagueTable || []).find(t => t.isPlayerClub || isSameClub(t, player.club) || (myClub && isSameClub(t, myClub)));
  const teamWins = playerClubRow?.won || 0;

  const score = calculateBallonDorScore({
    line: pLine,
    avgRating,
    goals: totalG,
    assists: totalA,
    cleanSheets: totalCS,
    saves: totalSV,
    tackles: totalTK,
    teamWins,
    trophies: seasonTrophiesList,
    isUnderdogMiracle,
    fame: player.fame || 0
  });
  player.bdorScore = score;

  const playerClubName = (player.currentClub?.name || activeClub?.name || player.academy?.name || player.club?.name || "CLB");
  const playerName = player.name || "Hoàng Sơn";

  let playerRow = player.ballonDorRankings.find(r => r.isPlayer);
  if (playerRow) {
    playerRow.name = `${playerName} (BẠN)`;
    playerRow.club = playerClubName;
    playerRow.score = score;
    playerRow.goals = totalG;
    playerRow.assists = totalA;
  }

  // Sắp xếp lại thứ hạng theo điểm giảm dần
  player.ballonDorRankings.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });

  player.ballonDorRankings.forEach((row, idx) => {
    row.rank = idx + 1;
  });

  player.ballonDorPowerRankings = player.ballonDorRankings;

  if (typeof syncIndividualTrackersDOM === 'function') {
    syncIndividualTrackersDOM(player);
  }

  return player.ballonDorRankings.slice(0, 5);
}

export function getGoldenShoeRankings(player) {
  if (!player) return [];
  if (player.goldenShoeTracker && player.goldenShoeTracker.length > 0) {
    return player.goldenShoeTracker;
  }
  return updateGoldenShoeTracker(player);
}

export function getBallonDorPowerRankings(player) {
  if (!player) return [];
  if (player.ballonDorRankings && player.ballonDorRankings.length > 0) {
    return player.ballonDorRankings;
  }
  return updateBallonDorRankings(player);
}

/**
 * Đồng bộ trực tiếp giao diện hiển thị 2 bảng danh hiệu cá nhân lên DOM
 */
export function syncIndividualTrackersDOM(player) {
  if (typeof document === 'undefined') return;
  const shoeContainer = document.getElementById('liveGoldenShoeList');
  const bdorContainer = document.getElementById('liveBallonDorList');

  if (shoeContainer && player.goldenShoeTracker) {
    shoeContainer.innerHTML = '';
    player.goldenShoeTracker.slice(0, 5).forEach((item, idx) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.alignItems = 'center';
      row.style.padding = '6px 8px';
      row.style.marginBottom = '4px';
      row.style.borderRadius = '6px';
      row.style.fontSize = '0.8rem';
      row.style.background = item.isPlayer ? 'rgba(245, 158, 11, 0.18)' : (item.isRival ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)');
      if (item.isPlayer) row.style.border = '1px solid rgba(245, 158, 11, 0.5)';
      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-weight:900; font-family:'JetBrains Mono',monospace; color:${idx === 0 ? 'var(--accent-gold)' : 'var(--text-muted)'}; width:16px;">#${idx + 1}</span>
          <span style="font-weight:700; color:${item.isPlayer ? 'var(--accent-gold)' : '#fff'};">${item.name}</span>
          <span style="color:var(--text-dim); font-size:0.72rem;">(${item.club})</span>
        </div>
        <div style="font-weight:800; font-family:'JetBrains Mono',monospace; color:var(--accent-green);">
          ${item.goals} ⚽ <span style="color:var(--text-muted); font-size:0.72rem;">(${item.points} pts)</span>
        </div>
      `;
      shoeContainer.appendChild(row);
    });
  }

  if (bdorContainer && player.ballonDorRankings) {
    bdorContainer.innerHTML = '';
    player.ballonDorRankings.slice(0, 5).forEach((item, idx) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.justifyContent = 'space-between';
      row.style.alignItems = 'center';
      row.style.padding = '6px 8px';
      row.style.marginBottom = '4px';
      row.style.borderRadius = '6px';
      row.style.fontSize = '0.8rem';
      row.style.background = item.isPlayer ? 'rgba(168, 85, 247, 0.18)' : (item.isRival ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)');
      if (item.isPlayer) row.style.border = '1px solid rgba(168, 85, 247, 0.5)';
      row.innerHTML = `
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-weight:900; font-family:'JetBrains Mono',monospace; color:${idx === 0 ? 'var(--accent-gold)' : 'var(--text-muted)'}; width:16px;">#${idx + 1}</span>
          <span style="font-weight:700; color:${item.isPlayer ? 'var(--accent-purple)' : '#fff'};">${item.name}</span>
          <span style="color:var(--text-dim); font-size:0.72rem;">(${item.club})</span>
        </div>
        <div style="font-weight:800; font-family:'JetBrains Mono',monospace; color:var(--accent-gold);">
          ${item.score} <span style="color:var(--text-muted); font-size:0.72rem;">pts</span>
        </div>
      `;
      bdorContainer.appendChild(row);
    });
  }
}

/* =========================================================================
   CUP & TOURNAMENT ENGINE (TÁCH SANG js/cupEngine.js)
   ========================================================================= */


export function initSeasonScheduleAndTable(player) {
  if (!player) return;

  // 0. KIỂM TRA ĐIỀU KIỆN TRIỆU TẬP ĐTQG Ở TUỔI 17
  checkNationalTeamCallUp(player);

  // 0.1 QUYẾT TOÁN TIỀN TÀI TRỢ THƯƠNG MẠI CHO MÙA GIẢI MỚI (COMMERCIAL SPONSORSHIPS)
  processAnnualSponsorshipPayout(player);

  const isYouth = Boolean(player.isAcademyStage || (player.age <= 16 && !player.currentClub));
  const activeClub = isYouth ? player.academy : (player.currentClub || ALL_CLUBS[0]);
  const leagueId = isYouth ? "YOUTH_LEAGUE" : (activeClub.league?.id || "PREMIER_LEAGUE");

  // 1. RESET TRIỆT ĐỂ DỮ LIỆU CÚP KHI TẠO GAME MỚI / MÙA GIẢI MỚI (INIT/NEW GAME RESET)
  // Xóa trắng toàn bộ dữ liệu cũ để tránh rớt dữ liệu của save slot cũ hay localStorage cũ
  player.tournamentData = null;
  player.cupBracket = null;
  player.groupStageData = null;
  player.youthLeagueGroups = null;
  player.continentalGroupTable = null;
  player.tournamentBrackets = null;
  player.cupFixtures = [];
  player.youthLeagueEliminated = false;
  player.cupStage = 'quarter';

  // 1. Tạo Tournament Brackets & Continental Group Table mới hoàn toàn
  player.tournamentBrackets = initTournamentBrackets(
    player,
    activeClub,
    leagueId,
    player.currentEuroStatus || "NONE",
    isYouth
  );
  player.continentalGroupTable = initContinentalGroupTable(
    player,
    activeClub,
    player.currentEuroStatus || "NONE"
  );
  player.activeLeagueTableFilter = 'LEAGUE';

  // Với UEFA Youth League, tạo mới 4 bảng đấu sạch chỉ số (0 trận, 0 điểm)
  if (isYouth) {
    if (!player.youthLeagueGroups) {
      player.youthLeagueGroups = initYouthLeagueGroups(activeClub);
    }
    player.groupStageData = player.youthLeagueGroups;
  }

  // Đồng bộ cupBracket & tournamentData chuẩn vào object của player (Slot-scoped data)
  player.cupBracket = player.tournamentBrackets?.domesticCup || null;
  player.tournamentData = {
    brackets: player.tournamentBrackets,
    domesticCup: player.tournamentBrackets?.domesticCup || null,
    continentalCup: player.tournamentBrackets?.continentalCup || null,
    groupStageData: player.groupStageData || null,
    cupBracket: player.cupBracket
  };

  // Đồng bộ backup key có tiền tố slotId (Slot-scoped persistence) & dọn sạch key vô chủ
  if (typeof localStorage !== 'undefined') {
    try {
      const slotId = player.slotId || (typeof window !== 'undefined' && window.currentSaveSlot) || 1;
      localStorage.setItem(`save_slot_${slotId}_cup`, JSON.stringify(player.tournamentData));
      localStorage.removeItem('cupBracket');
      localStorage.removeItem('tournamentData');
      localStorage.removeItem('tournamentBrackets');
      localStorage.removeItem('groupStageData');
    } catch (e) { }
  }

  // 2. Tạo lịch thi đấu Round-Robin + Cúp + ĐTQG (nếu tuổi 17+)
  player.currentSeasonFixtures = generateSeasonFixtures(
    leagueId,
    activeClub,
    player.currentEuroStatus || "NONE",
    player.wonMainCupLastSeason || false,
    isYouth,
    player.tournamentBrackets,
    player.continentalGroupTable,
    player.nationality,
    player
  );
  player.currentFixtureIndex = 0;
  player.fixtureIndex = 0;
  if (player.managerTrust === undefined) player.managerTrust = 70;
  if (!player.squadRole) player.squadRole = 'KEY_PLAYER';
  player.summerTournament = null;
  player.pressConferencePending = null;

  // 2. Tạo Bảng xếp hạng giải đấu
  if (isYouth) {
    player.leagueTable = initLeagueTable(YOUTH_LEAGUE_CLUBS, activeClub);
  } else {
    let clubsPool = LEAGUE_TEAMS_MAP[leagueId] ? [...LEAGUE_TEAMS_MAP[leagueId]] : null;
    if (!clubsPool || clubsPool.length < 4) {
      clubsPool = ALL_CLUBS.filter(c => c.league && c.league.id === leagueId);
    }
    if (!clubsPool || clubsPool.length < 4) {
      clubsPool = [...LEAGUE_TEAMS_MAP.PREMIER_LEAGUE];
    }
    player.leagueTable = initLeagueTable(clubsPool, activeClub);
  }

  // 3. Tạo Bảng Vua Phá Lưới & Vua Kiến Tạo (Đầu mùa tất cả bắt đầu từ 0 bàn, 0 kiến tạo)
  player.leagueTopScorers = initLeagueTopScorers(leagueId, player);
  player.leagueTopAssists = initLeagueTopAssists(leagueId, player);

  // 4. Reset thống kê mùa giải
  player.currentSeasonStats = {
    matches: 0,
    goals: 0,
    assists: 0,
    cleanSheets: 0,
    saves: 0,
    tackles: 0
  };
  player.preMatchPrep = 'NONE';

  // Reset thống kê các giải Cúp độc lập
  player.cupStats = {
    domesticCup: { goals: 0, assists: 0, matches: 0 },
    continentalCup: { goals: 0, assists: 0, matches: 0 },
    summerTournament: { goals: 0, assists: 0, matches: 0 }
  };
  if (typeof initCupIndividualTrackers === 'function') {
    initCupIndividualTrackers(player, 'all');
  }

  // 5. Khởi tạo Bảng Chiếc Giày Vàng (0 bàn, 0.0 pts) & Top 5 Quả Bóng Vàng (Base Rating * 5)
  initGoldenShoeTracker(player);
  initBallonDorRankings(player);
}

/**
 * Khởi tạo sự nghiệp mới (Init Career / Start New Game)
 * Bắt buộc xóa trắng và tạo mới hoàn toàn tournamentData, cupBracket, groupStageData.
 */

export function checkSummerTournamentEligibility(player) {
  if (!player || player.isAcademyStage || player.age <= 16) return null;
  const year = player.year || 2026;
  if (year % 2 !== 0) return null; // Chỉ diễn ra vào năm chẵn

  const isWorldCup = (year % 4 === 2);
  if (isWorldCup) {
    return {
      type: "WORLD_CUP",
      name: "FIFA World Cup",
      icon: "🏆",
      trophyName: "FIFA World Cup"
    };
  } else {
    const reg = player.nationality?.region || "UEFA";
    let tourneyName = "UEFA Euro";
    if (reg === "CONMEBOL") tourneyName = "Copa América";
    else if (reg === "ASIA") tourneyName = "AFC Asian Cup";
    else if (reg === "GLOBAL_OTHER") tourneyName = "CONCACAF Gold Cup";

    return {
      type: "CONTINENTAL_CUP",
      name: tourneyName,
      icon: "⭐",
      trophyName: tourneyName
    };
  }
}

/**
 * Khởi tạo Vòng Chung Kết Mùa Hè (3 trận vòng bảng + Tứ kết + Bán kết + Chung kết)
 */
export function initSummerTournament(player) {
  const info = checkSummerTournamentEligibility(player);
  if (!info) return null;

  const playerNat = player.nationality || { name: "Việt Nam", flag: "🇻🇳", code: "VIE", region: "ASIA" };
  const pTeam = {
    id: playerNat.id || "nat_player",
    name: playerNat.name,
    code: playerNat.code || playerNat.id || "NT",
    icon: playerNat.flag,
    flag: playerNat.flag,
    power: playerNat.power || 82,
    stadium: playerNat.stadium || "Sân Vận Động Quốc Gia"
  };

  // Chọn đối thủ
  let oppPool = [];
  if (info.type === "WORLD_CUP") {
    const allNat = [
      ...(NATIONAL_TEAMS_DATA.UEFA || []),
      ...(NATIONAL_TEAMS_DATA.CONMEBOL || []),
      ...(NATIONAL_TEAMS_DATA.ASIA || []),
      ...(NATIONAL_TEAMS_DATA.GLOBAL_OTHER || [])
    ];
    oppPool = allNat.filter(t => t.name !== playerNat.name).sort(() => 0.5 - Math.random());
  } else {
    const reg = playerNat.region || "UEFA";
    const regTeams = NATIONAL_TEAMS_DATA[reg] || NATIONAL_TEAMS_DATA.UEFA || [];
    oppPool = regTeams.filter(t => t.name !== playerNat.name).sort(() => 0.5 - Math.random());
  }

  const groupOpponents = oppPool.slice(0, 3);
  const knockoutOpponents = oppPool.slice(3, 10);

  // Bảng đấu 4 đội (Group Stage)
  const groupTable = [
    { ...pTeam, isPlayer: true, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0 },
    ...groupOpponents.map(o => ({
      id: o.id, name: o.name, code: o.code, icon: o.flag, flag: o.flag, power: o.power || 80,
      isPlayer: false, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0
    }))
  ];

  // 3 trận vòng bảng
  const groupFixtures = [
    createNationalTeamFixture(playerNat, info.name, `Vòng Bảng Lượt 1 • ${info.name}`, groupOpponents[0], true),
    createNationalTeamFixture(playerNat, info.name, `Vòng Bảng Lượt 2 • ${info.name}`, groupOpponents[1], false),
    createNationalTeamFixture(playerNat, info.name, `Vòng Bảng Lượt 3 (Quyết Định) • ${info.name}`, groupOpponents[2], true)
  ];

  // Nhánh Knock-out Tứ kết (8 đội)
  const qfTeams = [pTeam, ...knockoutOpponents.slice(0, 7)];
  while (qfTeams.length < 8) {
    qfTeams.push({ name: `Đội Tuyển ${qfTeams.length + 1}`, code: "NT", icon: "🚩", flag: "🚩", power: 80 });
  }

  const brackets = {
    quarterFinals: [
      { id: "sum_qf1", club1: qfTeams[0], club2: qfTeams[1], score1: null, score2: null, winner: null, isPlayerMatch: true },
      { id: "sum_qf2", club1: qfTeams[2], club2: qfTeams[3], score1: null, score2: null, winner: null, isPlayerMatch: false },
      { id: "sum_qf3", club1: qfTeams[4], club2: qfTeams[5], score1: null, score2: null, winner: null, isPlayerMatch: false },
      { id: "sum_qf4", club1: qfTeams[6], club2: qfTeams[7], score1: null, score2: null, winner: null, isPlayerMatch: false }
    ],
    semiFinals: [
      { id: "sum_sf1", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false },
      { id: "sum_sf2", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false }
    ],
    final: { id: "sum_f", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false },
    champion: null
  };

  const tournament = {
    tourneyName: info.name,
    type: info.type,
    icon: info.icon,
    trophyName: info.trophyName,
    stage: "GROUP_STAGE", // 'GROUP_STAGE' | 'QUARTER_FINAL' | 'SEMI_FINAL' | 'FINAL' | 'FINISHED'
    currentMatchIndex: 0,
    groupTable,
    groupFixtures,
    brackets,
    isFinished: false,
    wonTrophy: false,
    currentFixture: groupFixtures[0]
  };

  player.summerTournament = tournament;
  return tournament;
}

/**
 * Điều phối lượt thi đấu trong VCK Mùa Hè
 */
export function advanceSummerTournamentMatch(player, isQuickSim = false, arenaResult = null) {
  const tourney = player.summerTournament;
  if (!tourney || tourney.isFinished) return null;

  const currentFix = tourney.currentFixture;
  if (!currentFix) return null;

  // Đảm bảo không bắt đầu trận quốc tế khi thể lực kiệt sức
  if ((player.stam !== undefined && player.stam <= 15) || (player.stamina !== undefined && player.stamina <= 15)) {
    recoverStaminaBetweenMatches(player);
  }

  const pMatch = currentFix.playerMatch;
  let homeScore = 0, awayScore = 0;
  let pGoals = 0, pAssists = 0, matchRating = 7.0;

  if (!isQuickSim && arenaResult) {
    homeScore = arenaResult.homeScore || 0;
    awayScore = arenaResult.awayScore || 0;
    pGoals = arenaResult.playerGoals || 0;
    pAssists = arenaResult.playerAssists || 0;
    matchRating = arenaResult.rating || 7.5;
  } else {
    // Quick sim trận quốc tế
    const pPower = pMatch.homeClub.power || 82;
    const oppPower = pMatch.opponent.power || 80;
    const diff = (pPower - oppPower) / 20;
    homeScore = Math.max(0, Math.floor(Math.random() * 3 + diff + (Math.random() < 0.4 ? 1 : 0)));
    awayScore = Math.max(0, Math.floor(Math.random() * 3 - diff + (Math.random() < 0.3 ? 1 : 0)));
    pGoals = Math.min(homeScore, Math.random() < 0.45 ? (Math.random() < 0.25 ? 2 : 1) : 0);
    pAssists = Math.min(homeScore - pGoals, Math.random() < 0.3 ? 1 : 0);
    matchRating = Number((6.2 + pGoals * 1.5 + pAssists * 0.8 + (homeScore > awayScore ? 0.5 : 0)).toFixed(1));
  }

  // Cập nhật thống kê ĐTQG
  player.intlCaps = (player.intlCaps || 0) + 1;
  player.intlGoals = (player.intlGoals || 0) + pGoals;
  player.totalCareerMatches = (player.totalCareerMatches || 0) + 1;
  player.totalCareerGoals = (player.totalCareerGoals || 0) + pGoals;
  player.totalCareerAssists = (player.totalCareerAssists || 0) + pAssists;

  // Cập nhật thống kê giải đấu mùa hè độc lập
  if (!tourney.playerStats) tourney.playerStats = { goals: 0, assists: 0, matches: 0 };
  tourney.playerStats.goals += pGoals;
  tourney.playerStats.assists += pAssists;
  tourney.playerStats.matches += 1;

  if (!player.cupStats) player.cupStats = {};
  if (!player.cupStats.summerTournament) player.cupStats.summerTournament = { goals: 0, assists: 0, matches: 0 };
  player.cupStats.summerTournament.goals += pGoals;
  player.cupStats.summerTournament.assists += pAssists;
  player.cupStats.summerTournament.matches += 1;

  // Cập nhật tiến trình theo stage
  if (tourney.stage === "GROUP_STAGE") {
    // Cập nhật bảng đấu
    const teamPlayer = tourney.groupTable.find(t => t.isPlayer);
    const teamOpp = tourney.groupTable.find(t => t.name === pMatch.opponent.name);
    if (teamPlayer && teamOpp) {
      teamPlayer.played += 1; teamOpp.played += 1;
      teamPlayer.gf += homeScore; teamPlayer.ga += awayScore;
      teamOpp.gf += awayScore; teamOpp.ga += homeScore;
      teamPlayer.gd = teamPlayer.gf - teamPlayer.ga;
      teamOpp.gd = teamOpp.gf - teamOpp.ga;
      if (homeScore > awayScore) { teamPlayer.won += 1; teamPlayer.points += 3; teamOpp.lost += 1; }
      else if (homeScore < awayScore) { teamOpp.won += 1; teamOpp.points += 3; teamPlayer.lost += 1; }
      else { teamPlayer.drawn += 1; teamOpp.drawn += 1; teamPlayer.points += 1; teamOpp.points += 1; }
    }
    tourney.groupTable.sort((a, b) => b.points - a.points || b.gd - a.gd || b.gf - a.gf);

    tourney.currentMatchIndex += 1;
    if (tourney.currentMatchIndex < 3) {
      tourney.currentFixture = tourney.groupFixtures[tourney.currentMatchIndex];
    } else {
      // Kết thúc vòng bảng -> Kiểm tra xem có lọt vào Tứ kết không (Top 2)
      const rank = tourney.groupTable.findIndex(t => t.isPlayer) + 1;
      if (rank <= 2) {
        tourney.stage = "QUARTER_FINAL";
        const qfMatch = tourney.brackets.quarterFinals[0];
        tourney.currentFixture = createNationalTeamFixture(player.nationality, tourney.tourneyName, `Tứ Kết • ${tourney.tourneyName}`, qfMatch.club2, true);
      } else {
        tourney.stage = "FINISHED";
        tourney.isFinished = true;
      }
    }
  } else if (tourney.stage === "QUARTER_FINAL") {
    const isWin = homeScore > awayScore || (homeScore === awayScore && Math.random() < 0.6);
    if (isWin) {
      tourney.stage = "SEMI_FINAL";
      const sfOpp = { name: "Tuyển Siêu Cường BK", code: "SF_OPP", flag: "⭐", power: 88 };
      tourney.currentFixture = createNationalTeamFixture(player.nationality, tourney.tourneyName, `Bán Kết • ${tourney.tourneyName}`, sfOpp, true);
    } else {
      tourney.stage = "FINISHED";
      tourney.isFinished = true;
    }
  } else if (tourney.stage === "SEMI_FINAL") {
    const isWin = homeScore > awayScore || (homeScore === awayScore && Math.random() < 0.6);
    if (isWin) {
      tourney.stage = "FINAL";
      const fOpp = { name: "Tuyển Siêu Cường CK", code: "F_OPP", flag: "👑", power: 91 };
      tourney.currentFixture = createNationalTeamFixture(player.nationality, tourney.tourneyName, `Chung Kết • ${tourney.tourneyName}`, fOpp, true);
    } else {
      tourney.stage = "FINISHED";
      tourney.isFinished = true;
    }
  } else if (tourney.stage === "FINAL") {
    const isWin = homeScore > awayScore || (homeScore === awayScore && Math.random() < 0.65);
    tourney.stage = "FINISHED";
    tourney.isFinished = true;
    if (isWin) {
      tourney.wonTrophy = true;
      tourney.brackets.champion = player.nationality;
      player.trophiesTotal = (player.trophiesTotal || 0) + 1;
      player.trophiesTally[tourney.trophyName] = (player.trophiesTally[tourney.trophyName] || 0) + 1;
      player.fame = (player.fame || 0) + 400;
    }
  }

  // Đánh giá và trao danh hiệu Vua Phá Lưới & Vua Kiến Tạo khi giải đấu mùa hè kết thúc
  if (tourney.isFinished) {
    const tGoals = tourney.playerStats?.goals || 0;
    const tAssists = tourney.playerStats?.assists || 0;
    const tName = tourney.tourneyName || "FIFA World Cup";
    const scorerTitle = `Vua Phá Lưới ${tName}`;
    const playmakerTitle = `Vua Kiến Tạo ${tName}`;

    const baselineScorerGoals = 6;
    const baselineAssistGoals = 4;

    const wonScorer = tGoals >= 5;
    const wonPlaymaker = tAssists >= 4;

    if (wonScorer) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(scorerTitle)) {
        player.seasonTrophiesWonThisYear.push(scorerTitle);
        addTrophy(player, scorerTitle);
        player.fame = (player.fame || 0) + 800;
        player.morale = Math.min(100, (player.morale || 70) + 10);

        if (!player.individualAwards) player.individualAwards = [];
        player.individualAwards.push({
          id: `summer_top_scorer_${player.year || 2026}`,
          name: scorerTitle,
          year: player.year || 2026,
          age: player.age || 16,
          stat: `${tGoals} bàn thắng`,
          icon: "👟"
        });

        if (!player.records) player.records = [];
        player.records.push({
          id: `summer_top_scorer_${player.year || 2026}`,
          title: scorerTitle,
          holder: player.name || "Cầu thủ",
          value: `${tGoals} bàn thắng`,
          year: player.year || 2026
        });

        if (!player.logs) player.logs = [];
        player.logs.unshift({
          year: player.year || 2026,
          age: player.age || 16,
          title: `🥇 ${scorerTitle.toUpperCase()}!`,
          text: `Chiếc Giày Vàng Vô Địch Thế Giới / Châu Lục! Ghi ${tGoals} bàn thắng tại ${tName} và giành danh hiệu Vua Phá Lưới danh giá nhất hành tinh! (+800 Fame)`,
          type: "trophy-win",
          timestamp: Date.now()
        });

        if (typeof recordChronicleMilestone === 'function') {
          recordChronicleMilestone(player, 'GOLDEN_SHOE', {
            title: scorerTitle,
            desc: `Vua Phá Lưới ${tName} với ${tGoals} bàn thắng!`,
            badge: "👟 VUA PHÁ LƯỚI QUỐC TẾ",
            badgeColor: "gold",
            category: "individual",
            icon: "👟"
          });
        }
      }
    }

    if (wonPlaymaker) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(playmakerTitle)) {
        player.seasonTrophiesWonThisYear.push(playmakerTitle);
        addTrophy(player, playmakerTitle);
        player.fame = (player.fame || 0) + 600;
        player.morale = Math.min(100, (player.morale || 70) + 8);

        if (!player.individualAwards) player.individualAwards = [];
        player.individualAwards.push({
          id: `summer_top_playmaker_${player.year || 2026}`,
          name: playmakerTitle,
          year: player.year || 2026,
          age: player.age || 16,
          stat: `${tAssists} kiến tạo`,
          icon: "🎯"
        });

        if (!player.records) player.records = [];
        player.records.push({
          id: `summer_top_playmaker_${player.year || 2026}`,
          title: playmakerTitle,
          holder: player.name || "Cầu thủ",
          value: `${tAssists} kiến tạo`,
          year: player.year || 2026
        });

        if (!player.logs) player.logs = [];
        player.logs.unshift({
          year: player.year || 2026,
          age: player.age || 16,
          title: `🎯 ${playmakerTitle.toUpperCase()}!`,
          text: `Vua Kiến Tạo ${tName}! Với ${tAssists} đường kiến tạo đẳng cấp, vinh dự nhận danh hiệu chân chuyền xuất sắc nhất giải đấu! (+600 Fame)`,
          type: "trophy-win",
          timestamp: Date.now()
        });

        if (typeof recordChronicleMilestone === 'function') {
          recordChronicleMilestone(player, 'PLAYMAKER_AWARD', {
            title: playmakerTitle,
            desc: `Vua Kiến Tạo ${tName} với ${tAssists} đường kiến tạo!`,
            badge: "🎯 VUA KIẾN TẠO QUỐC TẾ",
            badgeColor: "gold",
            category: "individual",
            icon: "🎯"
          });
        }
      }
    }

    // 3. Đánh giá CẦU THỦ XUẤT SẮC NHẤT GIẢI ĐẤU (TOURNAMENT MVP)
    const mvpTitle = tName.includes("World Cup")
      ? "Quả Bóng Vàng FIFA World Cup (World Cup Best Player)"
      : `Cầu Thủ Xuất Sắc Nhất ${tName}`;

    const isChamp = Boolean(tourney.wonTrophy);
    const isRunnerUp = !isChamp && Boolean(tourney.brackets?.final && tourney.brackets.final.winner && !tourney.wonTrophy);
    const summerMatches = tourney.playerStats?.matches || 0;

    const intlMvpScore = calculateTournamentMvpScore({
      matches: summerMatches,
      goals: tGoals,
      assists: tAssists,
      cleanSheets: player.cupStats?.summerTournament?.cleanSheets || 0,
      tackles: player.cupStats?.summerTournament?.tackles || 0,
      saves: player.cupStats?.summerTournament?.saves || 0,
      avgRating: player.lastSeasonAvgRating || 7.5
    }, player.position, isChamp, isRunnerUp, { isCup: true });

    const aiBenchmarkMvp = tName.includes("World Cup") ? 115 : 108; // World Cup / EURO: 100 – 125 điểm
    const wonMvp = intlMvpScore >= aiBenchmarkMvp && summerMatches >= 4;

    if (wonMvp) {
      if (!player.seasonTrophiesWonThisYear) player.seasonTrophiesWonThisYear = [];
      if (!player.seasonTrophiesWonThisYear.includes(mvpTitle)) {
        player.seasonTrophiesWonThisYear.push(mvpTitle);
        addTrophy(player, mvpTitle);
        player.fame = (player.fame || 0) + 1200;
        player.morale = Math.min(100, (player.morale || 70) + 10);

        if (!player.individualAwards) player.individualAwards = [];
        player.individualAwards.push({
          id: `summer_mvp_${player.year || 2026}`,
          name: mvpTitle,
          year: player.year || 2026,
          age: player.age || 16,
          stat: `${intlMvpScore} điểm MVP`,
          icon: "🏅"
        });

        if (!player.records) player.records = [];
        player.records.push({
          id: `summer_mvp_${player.year || 2026}`,
          title: mvpTitle,
          holder: player.name || "Cầu thủ",
          value: `${intlMvpScore} điểm MVP`,
          year: player.year || 2026
        });

        if (!player.logs) player.logs = [];
        player.logs.unshift({
          year: player.year || 2026,
          age: player.age || 16,
          title: `🏅 ${mvpTitle.toUpperCase()}!`,
          text: `Vinh quang tột đỉnh! Bạn chính thức được bầu chọn là Cầu Thủ Xuất Sắc Nhất ${tName} với ${intlMvpScore} điểm MVP vượt trội! (+1200 Fame)`,
          type: "trophy-win",
          timestamp: Date.now()
        });

        if (typeof recordChronicleMilestone === 'function') {
          recordChronicleMilestone(player, 'MVP_AWARD', {
            title: mvpTitle,
            desc: `Giành danh hiệu ${mvpTitle} với ${intlMvpScore} điểm MVP!`,
            badge: "🏅 CẦU THỦ XUẤT SẮC NHẤT",
            badgeColor: "gold",
            category: "individual",
            icon: "🏅"
          });
        }
      }
    }

    tourney.awards = {
      topScorer: {
        title: scorerTitle,
        winnerName: wonScorer ? `${player.name} (BẠN)` : "Siêu Sao Quốc Tế",
        stat: wonScorer ? tGoals : baselineScorerGoals,
        isPlayer: wonScorer
      },
      topPlaymaker: {
        title: playmakerTitle,
        winnerName: wonPlaymaker ? `${player.name} (BẠN)` : "Nhạc Trưởng Quốc Tế",
        stat: wonPlaymaker ? tAssists : baselineAssistGoals,
        isPlayer: wonPlaymaker
      },
      mvp: {
        title: mvpTitle,
        winnerName: wonMvp ? `${player.name} (BẠN)` : "Cầu Thủ Xuất Sắc Nhất",
        stat: wonMvp ? `${intlMvpScore}đ` : `${aiBenchmarkMvp}đ`,
        isPlayer: wonMvp
      }
    };
  }

  // Hồi phục thể lực giữa các trận đấu giải mùa hè
  const recoveryInfo = recoverStaminaBetweenMatches(player);

  return {
    homeScore,
    awayScore,
    playerGoals: pGoals,
    playerAssists: pAssists,
    rating: matchRating,
    tourney,
    recoveryInfo
  };
}

export {
  awardCupVictory,
  recordCupMatchResult,
  advanceCupStage,
  processAnnualSponsorshipPayout
};

