import fs from 'fs';

let content = fs.readFileSync('./js/engine.js', 'utf8');

// 1. Export isClubMatch and getActiveClub
const helperFunctions = `
/**
 * Chuẩn hóa và so khớp định danh câu lạc bộ / học viện (ID, Alias, Tên, Từ khóa)
 */
export function isClubMatch(team, clubOrId) {
  if (!team || !clubOrId) return false;
  const teamId = (team.clubId || team.id || "").toLowerCase();
  const teamName = (team.clubName || team.name || "").toLowerCase();
  const teamAlias = (team.idAlias || "").toLowerCase();
  
  if (typeof clubOrId === 'string') {
    const target = clubOrId.toLowerCase();
    if (teamId === target || teamAlias === target || teamName === target) return true;
    if (target.includes("bayern") && (teamId.includes("bayern") || teamName.includes("bayern"))) return true;
    if (target.includes("masia") && (teamId.includes("masia") || teamName.includes("masia"))) return true;
    if (target.includes("castilla") && (teamId.includes("castilla") || teamName.includes("castilla"))) return true;
    if (target.includes("carrington") && (teamId.includes("carrington") || teamName.includes("carrington"))) return true;
    if (target.includes("cobham") && (teamId.includes("cobham") || teamName.includes("cobham"))) return true;
    if ((target.includes("ajax") || target.includes("toekomst")) && (teamId.includes("ajax") || teamName.includes("ajax") || teamName.includes("toekomst"))) return true;
    if (target.includes("benfica") && (teamId.includes("benfica") || teamName.includes("benfica"))) return true;
    if (target.includes("sporting") && (teamId.includes("sporting") || teamName.includes("sporting"))) return true;
    if (target.includes("clairefontaine") && (teamId.includes("clairefontaine") || teamName.includes("clairefontaine"))) return true;
    if (target.includes("pvf") && (teamId.includes("pvf") || teamName.includes("pvf"))) return true;
    return false;
  }
  
  const cId = (clubOrId.id || clubOrId.clubId || "").toLowerCase();
  const cAlias = (clubOrId.idAlias || "").toLowerCase();
  const cName = (clubOrId.name || clubOrId.clubName || "").toLowerCase();

  // Direct matches
  if (cId && (teamId === cId || teamAlias === cId || teamId === cAlias)) return true;
  if (team.id && (team.id.toLowerCase() === cId || team.id.toLowerCase() === cAlias)) return true;
  if (cName && teamName && (teamName === cName || teamName.includes(cName) || cName.includes(teamName))) return true;

  // Keyword-based Academy matching
  const keywords = ["bayern", "masia", "castilla", "carrington", "cobham", "ajax", "toekomst", "benfica", "sporting", "clairefontaine", "pvf"];
  for (const kw of keywords) {
    const teamHas = teamId.includes(kw) || teamAlias.includes(kw) || teamName.includes(kw);
    const clubHas = cId.includes(kw) || cAlias.includes(kw) || cName.includes(kw);
    if (teamHas && clubHas) return true;
  }

  return false;
}

/**
 * Lấy CLB hoạt động hiện tại của người chơi (Học viện trẻ hoặc CLB chuyên nghiệp)
 */
export function getPlayerActiveClub(player) {
  if (!player) return null;
  const isYouth = Boolean(player.isAcademyStage || (player.age <= 16 && !player.currentClub));
  return isYouth ? (player.academy || player.club || { id: "bayern_junior", idAlias: "bayern_campus", name: "FC Bayern Campus", code: "BAY", icon: "🔴" }) 
                 : (player.currentClub || player.club || null);
}
`;

// 2. Replace initLeagueTable and updateLeagueTable
const tableSectionStart = '/**\n * Khởi tạo Bảng xếp hạng 20 (hoặc 18) đội của giải VĐQG\n */';
const tableSectionEnd = '/**\n * Mô phỏng kết quả trận đấu giữa 2 CLB máy (AI vs AI)';

const tableSectionReplacement = `/**
 * Khởi tạo Bảng xếp hạng 20 (hoặc 18) đội của giải VĐQG
 */
export function initLeagueTable(clubsList, playerClub) {
  if (!clubsList || !Array.isArray(clubsList)) return [];

  const table = clubsList.map(club => ({
    clubId: club.id,
    id: club.id,
    clubName: club.name,
    name: club.name,
    clubCode: club.code || club.name.substring(0, 3).toUpperCase(),
    clubIcon: club.icon || "⚽",
    power: club.power || 75,
    isPlayerClub: Boolean(playerClub && (club.id === playerClub.id || club.name === playerClub.name || isClubMatch(club, playerClub))),
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
  table.sort((a, b) => b.power - a.power);
  return table;
}

/**
 * Cập nhật bảng xếp hạng sau mỗi trận đấu
 */
export function updateLeagueTable(table, homeClubOrId, awayClubOrId, homeScore, awayScore) {
  if (!table || !Array.isArray(table)) return;

  const findTeam = (clubOrId) => {
    if (!clubOrId) return null;
    return table.find(t => isClubMatch(t, clubOrId));
  };

  const home = findTeam(homeClubOrId);
  const away = findTeam(awayClubOrId);
  if (!home || !away) {
    console.warn("updateLeagueTable: could not match clubs", { homeClubOrId, awayClubOrId, home, away });
    return;
  }

  home.played = (home.played || home.matches || 0) + 1;
  home.matches = home.played;
  away.played = (away.played || away.matches || 0) + 1;
  away.matches = away.played;

  home.gf = (home.gf || 0) + homeScore;
  home.ga = (home.ga || 0) + awayScore;
  home.gd = home.gf - home.ga;

  away.gf = (away.gf || 0) + awayScore;
  away.ga = (away.ga || 0) + homeScore;
  away.gd = away.gf - away.ga;

  home.recentForm = home.recentForm || [];
  away.recentForm = away.recentForm || [];

  if (homeScore > awayScore) {
    home.won = (home.won || 0) + 1;
    home.points = (home.points || 0) + 3;
    home.recentForm.push('W');
    away.lost = (away.lost || 0) + 1;
    away.recentForm.push('L');
  } else if (homeScore < awayScore) {
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

`;

// 3. Replace initLeagueTopScorers and updateLeagueTopScorers
const scorersSectionStart = '/**\n * Khởi tạo danh sách Vua Phá Lưới (Top Scorers) của giải đấu ngoài đời thực\n */';
const scorersSectionEnd = '/**\n * Khởi tạo Sơ đồ phân nhánh Cúp Quốc Gia và Cúp Châu Âu';

const scorersSectionReplacement = `/**
 * Khởi tạo danh sách Vua Phá Lưới (Top Scorers) của giải đấu ngoài đời thực
 */
export function initLeagueTopScorers(leagueId, player) {
  const isYouth = Boolean(player && (player.isAcademyStage || player.age <= 16 || player.competitionTier?.currentTier === 3 || leagueId === "YOUTH_LEAGUE"));
  
  // Tuyệt đối không fallback về PREMIER_LEAGUE nếu đang ở giải trẻ
  let key = isYouth ? "YOUTH_LEAGUE" : (leagueId || player.currentLeagueId || player.currentClub?.league?.id || "PREMIER_LEAGUE");
  if (isYouth) {
    key = "YOUTH_LEAGUE";
  } else if (!REAL_RIVAL_SCORERS[key]) {
    key = "PREMIER_LEAGUE";
  }
  const pool = REAL_RIVAL_SCORERS[key] || [];

  const playerClub = getPlayerActiveClub(player) || (isYouth ? { id: "bayern_junior", name: "FC Bayern Campus", code: "BAY", icon: "🔴" } : { id: "player_club", name: "CLB Chủ Quản", code: "CLB", icon: "⭐" });
  const playerClubName = playerClub.name || "CLB Chủ Quản";
  const playerClubCode = playerClub.code || (playerClub.name ? playerClub.name.substring(0, 3).toUpperCase() : "CLB");
  const playerClubIcon = playerClub.icon || (isYouth ? "🌱" : "⭐");
  const playerClubId = playerClub.id || (isYouth ? "bayern_junior" : "player_club");

  const playerGoals = player.currentSeasonStats?.goals || 0;

  const list = [
    {
      name: \`\${player.name} (BẠN)\`,
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
      name: star.name,
      clubId: star.clubId || "",
      clubName: star.clubName,
      clubCode: star.clubCode,
      clubIcon: star.clubIcon,
      goals: 0,
      isPlayer: false,
      avgGPR: star.avgGPR || 0.6
    });
  });

  return list;
}

/**
 * Cập nhật bảng Vua Phá Lưới sau mỗi vòng đấu (Real-time Match Sync)
 */
export function updateLeagueTopScorers(topScorers, playerGoalsAdded = 0, roundScorerEvents = [], player = null) {
  if (!topScorers || !Array.isArray(topScorers)) return;

  // 1. Cập nhật bàn thắng của người chơi
  const playerItem = topScorers.find(s => s.isPlayer);
  if (playerItem) {
    if (playerGoalsAdded > 0) {
      playerItem.goals += playerGoalsAdded;
    }
    if (player && player.currentSeasonStats && player.currentSeasonStats.goals > playerItem.goals) {
      playerItem.goals = player.currentSeasonStats.goals;
    }
  }

  // 2. Phân bổ bàn thắng thực tế từ các trận đấu AI vừa kết thúc trong vòng
  if (roundScorerEvents && roundScorerEvents.length > 0) {
    roundScorerEvents.forEach(evt => {
      const clubId = evt.club?.id || "";
      const clubAlias = evt.club?.idAlias || "";
      const clubName = evt.club?.name || "";
      const clubCode = evt.club?.code || "";

      // Tìm tiền đạo thuộc CLB ghi bàn
      const clubScorers = topScorers.filter(s => 
        !s.isPlayer && (
          (s.clubId && (s.clubId === clubId || (clubAlias && s.clubId === clubAlias))) ||
          (s.clubName && clubName && (s.clubName === clubName || s.clubName.includes(clubName) || clubName.includes(s.clubName))) ||
          (s.clubCode && clubCode && s.clubCode === clubCode) ||
          isClubMatch(s, evt.club)
        )
      );

      let goalsLeft = evt.goals || 0;
      if (clubScorers.length > 0) {
        clubScorers.sort((a, b) => (b.avgGPR || 0.6) - (a.avgGPR || 0.6));
        while (goalsLeft > 0) {
          const chosen = (clubScorers.length > 1 && Math.random() < 0.35) ? clubScorers[1] : clubScorers[0];
          chosen.goals += 1;
          goalsLeft--;
        }
      }
    });
  } else {
    // Fallback nếu không có sự kiện chi tiết
    topScorers.forEach(star => {
      if (!star.isPlayer) {
        const gpr = star.avgGPR || 0.6;
        const roll = Math.random();
        if (roll < gpr * 0.25) star.goals += 2;
        else if (roll < gpr) star.goals += 1;
      }
    });
  }

  // Sắp xếp BXH Vua phá lưới: Số bàn thắng giảm dần -> Người chơi ưu tiên đứng trên nếu bằng bàn
  topScorers.sort((a, b) => {
    if (b.goals !== a.goals) return b.goals - a.goals;
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return a.name.localeCompare(b.name);
  });

  topScorers.forEach((item, idx) => {
    item.rank = idx + 1;
  });
}

`;

// Perform replacements
let tIdxStart = content.indexOf(tableSectionStart);
let tIdxEnd = content.indexOf(tableSectionEnd);
if (tIdxStart === -1 || tIdxEnd === -1) {
  console.error("Could not find table section boundaries", { tIdxStart, tIdxEnd });
  process.exit(1);
}
content = content.slice(0, tIdxStart) + helperFunctions + tableSectionReplacement + content.slice(tIdxEnd);

let sIdxStart = content.indexOf(scorersSectionStart);
let sIdxEnd = content.indexOf(scorersSectionEnd);
if (sIdxStart === -1 || sIdxEnd === -1) {
  console.error("Could not find scorers section boundaries", { sIdxStart, sIdxEnd });
  process.exit(1);
}
content = content.slice(0, sIdxStart) + scorersSectionReplacement + content.slice(sIdxEnd);

// 4. Update simulateMatchdayRound interactiveResult handling
const interactiveOld = `  if (interactiveResult) {
    // Kết quả trả về từ Match Center Arena tương tác 90 phút
    homeScore = interactiveResult.homeScore;
    awayScore = interactiveResult.awayScore;
    playerTeamGoals = pMatch.isPlayerHome ? homeScore : awayScore;
    oppTeamGoals = pMatch.isPlayerHome ? awayScore : homeScore;
    isPlayerWin = playerTeamGoals > oppTeamGoals;
    isDraw = playerTeamGoals === oppTeamGoals;

    pGoals = interactiveResult.playerStats?.goals || 0;
    pAssists = interactiveResult.playerStats?.assists || 0;
    pCS = interactiveResult.playerStats?.cleanSheets || (pMatch.isPlayerHome ? (awayScore === 0 ? 1 : 0) : (homeScore === 0 ? 1 : 0));
    pSaves = interactiveResult.playerStats?.saves || 0;
    pTackles = interactiveResult.playerStats?.tackles || 0;
    matchRating = interactiveResult.impact?.rating || 7.2;
    matchXG = interactiveResult.impact?.xG || 0.45;
    matchDesc = \`Trận cầu kết thúc với tỷ số \${homeScore} - \${awayScore}. Live Rating: \${matchRating.toFixed(1)}.\`;
  }`;

const interactiveNew = `  if (interactiveResult) {
    // Kết quả trả về từ Match Center Arena tương tác 90 phút
    homeScore = interactiveResult.homeScore;
    awayScore = interactiveResult.awayScore;
    playerTeamGoals = pMatch.isPlayerHome ? homeScore : awayScore;
    oppTeamGoals = pMatch.isPlayerHome ? awayScore : homeScore;
    isPlayerWin = playerTeamGoals > oppTeamGoals;
    isDraw = playerTeamGoals === oppTeamGoals;

    const pStats = interactiveResult.playerStats || interactiveResult.sim?.playerStats || {};
    pGoals = pStats.goals !== undefined ? pStats.goals : (interactiveResult.playerGoals !== undefined ? interactiveResult.playerGoals : 0);
    pAssists = pStats.assists !== undefined ? pStats.assists : (interactiveResult.playerAssists !== undefined ? interactiveResult.playerAssists : 0);
    pCS = pStats.cleanSheets !== undefined ? pStats.cleanSheets : (pMatch.isPlayerHome ? (awayScore === 0 ? 1 : 0) : (homeScore === 0 ? 1 : 0));
    pSaves = pStats.saves !== undefined ? pStats.saves : (interactiveResult.playerSaves || 0);
    pTackles = pStats.tackles !== undefined ? pStats.tackles : (interactiveResult.playerTackles || 0);
    matchRating = interactiveResult.impact?.rating || 7.2;
    matchXG = interactiveResult.impact?.xG || 0.45;
    matchDesc = \`Trận cầu kết thúc với tỷ số \${homeScore} - \${awayScore}. Live Rating: \${matchRating.toFixed(1)}.\`;
  }`;

if (!content.includes(interactiveOld)) {
  console.error("Could not find interactiveOld snippet in simulateMatchdayRound");
  process.exit(1);
}
content = content.replace(interactiveOld, interactiveNew);

// 5. Update updateLeagueTopScorers call in simulateMatchdayRound
const updateScorersOld = `  if (player.leagueTopScorers && roundData.competitionType === 'LEAGUE') {
    updateLeagueTopScorers(player.leagueTopScorers, pGoals, roundScorerEvents);
  }`;
const updateScorersNew = `  if (player.leagueTopScorers && roundData.competitionType === 'LEAGUE') {
    updateLeagueTopScorers(player.leagueTopScorers, pGoals, roundScorerEvents, player);
  }`;
content = content.replace(updateScorersOld, updateScorersNew);

// 6. Update careerStats & seasonStats inside simulateMatchdayRound
const statsOld = `  if (!player.currentSeasonStats) {
    player.currentSeasonStats = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 };
  }
  player.currentSeasonStats.matches += 1;
  player.currentSeasonStats.goals += pGoals;
  player.currentSeasonStats.assists += pAssists;
  player.currentSeasonStats.cleanSheets += pCS;
  player.currentSeasonStats.saves += pSaves;
  player.currentSeasonStats.tackles += pTackles;`;

const statsNew = `  if (!player.currentSeasonStats) {
    player.currentSeasonStats = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 };
  }
  player.currentSeasonStats.matches = (player.currentSeasonStats.matches || 0) + 1;
  player.currentSeasonStats.goals = (player.currentSeasonStats.goals || 0) + pGoals;
  player.currentSeasonStats.assists = (player.currentSeasonStats.assists || 0) + pAssists;
  player.currentSeasonStats.cleanSheets = (player.currentSeasonStats.cleanSheets || 0) + pCS;
  player.currentSeasonStats.saves = (player.currentSeasonStats.saves || 0) + pSaves;
  player.currentSeasonStats.tackles = (player.currentSeasonStats.tackles || 0) + pTackles;

  if (player.careerStats) {
    player.careerStats.matches = player.totalCareerMatches;
    player.careerStats.goals = player.totalCareerGoals;
    player.careerStats.assists = player.totalCareerAssists;
    player.careerStats.cleanSheets = player.totalCareerCleanSheets;
    player.careerStats.saves = player.totalCareerSaves;
    player.careerStats.tackles = player.totalCareerTackles;
  }`;

if (!content.includes(statsOld)) {
  console.error("Could not find statsOld in simulateMatchdayRound");
  process.exit(1);
}
content = content.replace(statsOld, statsNew);

fs.writeFileSync('./js/engine.js', content, 'utf8');
console.log("Successfully updated engine.js!");
