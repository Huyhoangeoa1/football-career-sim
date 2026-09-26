/* =========================================================================
   FOOTBALL CAREER SIMULATOR — CUP & TOURNAMENT ENGINE (ES6 Module)
   ========================================================================= */

import { 
  ALL_CLUBS, 
  LEAGUE_TEAMS_MAP, 
  YOUTH_LEAGUE_CLUBS, 
  UEFA_YOUTH_LEAGUE_CLUBS,
  REAL_RIVAL_SCORERS,
  YOUTH_RIVAL_SCORERS
} from './data.js';
import { addTrophy } from './playerEngine.js';
import { recordChronicleMilestone } from './mediaEngine.js';
import { getPlayer } from './state.js';

/**
 * Chuẩn hóa và so khớp định danh câu lạc bộ / học viện
 */
export function isSameClub(c1, c2) {
  if (!c1 || !c2) return false;
  const s1 = (c1.id || c1.name || c1).toString().toLowerCase().replace(/[^a-z0-9]/g, '');
  const s2 = (c2.id || c2.name || c2).toString().toLowerCase().replace(/[^a-z0-9]/g, '');
  if (s1.includes(s2) || s2.includes(s1)) return true;
  const str1 = ((c1.name || '') + ' ' + (c1.id || '') + ' ' + (c1.clubName || '')).toLowerCase().replace(/[^a-z0-9]/g, '');
  const str2 = ((c2.name || '') + ' ' + (c2.id || '') + ' ' + (c2.clubName || '')).toLowerCase().replace(/[^a-z0-9]/g, '');
  return str1.includes(s2) || str2.includes(s1) || (str1 && str2 && (str1.includes(str2) || str2.includes(str1)));
}

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

/**
 * Mô phỏng kết quả trận đấu giữa 2 CLB máy (AI vs AI)
 * Dựa vào tương quan attPower vs defPower và lợi thế sân nhà.
 */
export function simulateAIFixture(homeClub, awayClub) {
  const homeAtt = homeClub?.attPower || homeClub?.power || 75;
  const homeDef = homeClub?.defPower || homeClub?.power || 75;
  const awayAtt = awayClub?.attPower || awayClub?.power || 75;
  const awayDef = awayClub?.defPower || awayClub?.power || 75;

  // Lợi thế sân nhà +3.5 điểm sức mạnh
  const homeAdvDiff = (homeAtt + 3.5) - awayDef;
  const awayAdvDiff = awayAtt - homeDef;

  // Tính bàn thắng kỳ vọng (Expected Goals)
  let homeExp = 1.30 + (homeAdvDiff * 0.05) + (Math.random() * 0.5 - 0.25);
  let awayExp = 1.05 + (awayAdvDiff * 0.05) + (Math.random() * 0.5 - 0.25);

  homeExp = Math.max(0.2, Math.min(4.2, homeExp));
  awayExp = Math.max(0.1, Math.min(3.8, awayExp));

  let homeScore = 0;
  let awayScore = 0;

  for (let i = 0; i < 4; i++) {
    if (Math.random() < (homeExp / (i + 1.6))) homeScore++;
    if (Math.random() < (awayExp / (i + 1.6))) awayScore++;
  }

  // Tăng tính đột biến cho các đội siêu cường
  if (homeAtt >= 92 && Math.random() < 0.25) homeScore++;
  if (awayAtt >= 92 && Math.random() < 0.20) awayScore++;

  return { homeScore, awayScore };
}

/**
 * Khởi tạo hệ thống 4 Bảng đấu (16 đội - 4 bảng A, B, C, D) cho UEFA Youth League.
 * Đội của người chơi luôn nằm ở Bảng A (vị trí đầu tiên).
 */
export function initYouthLeagueGroups(playerClub) {
  const sourcePool = (typeof UEFA_YOUTH_LEAGUE_CLUBS !== 'undefined' && Array.isArray(UEFA_YOUTH_LEAGUE_CLUBS) && UEFA_YOUTH_LEAGUE_CLUBS.length >= 16)
    ? UEFA_YOUTH_LEAGUE_CLUBS.map(c => ({ ...c }))
    : [
        { id: "la_masia", name: "FC Barcelona La Masia", code: "MAS", icon: "🔵🔴", power: 78, stadium: "Ciutat Esportiva Joan Gamper" },
        { id: "castilla", name: "Real Madrid Castilla", code: "CAS", icon: "👑", power: 78, stadium: "Estadio Alfredo Di Stéfano" },
        { id: "carrington", name: "Man United Carrington", code: "CAR", icon: "👹", power: 75, stadium: "Carrington Training Ground" },
        { id: "cobham", name: "Chelsea Cobham Academy", code: "COB", icon: "🔵", power: 76, stadium: "Cobham Training Centre" },
        { id: "hale_end", name: "Arsenal Hale End Academy", code: "ARS", icon: "🔴⚪", power: 76, stadium: "Hale End Ground" },
        { id: "city_cfa", name: "Man City CFA Academy", code: "MCI", icon: "🩵", power: 77, stadium: "City Football Academy" },
        { id: "ajax_academy", name: "Ajax De Toekomst", code: "AJX", icon: "⚪🔴", power: 76, stadium: "Sportpark De Toekomst" },
        { id: "bayern_junior", name: "FC Bayern Campus", code: "BAY", icon: "🔴", power: 77, stadium: "FC Bayern Campus" },
        { id: "dortmund_youth", name: "Borussia Dortmund Youth", code: "BVB", icon: "🟡⚫", power: 76, stadium: "BVB Nachwuchszentrum" },
        { id: "clairefontaine", name: "INF Clairefontaine", code: "CLA", icon: "🇫🇷", power: 76, stadium: "Centre Technique National" },
        { id: "benfica_campus", name: "Benfica Seixal Campus", code: "SLB", icon: "🦅", power: 75, stadium: "Benfica Campus" },
        { id: "sporting_acad", name: "Sporting CP Academy", code: "SCP", icon: "🟢⚪", power: 75, stadium: "Academia Cristiano Ronaldo" },
        { id: "juventus_youth", name: "Juventus Primavera", code: "JUV", icon: "⚪⚫", power: 75, stadium: "Juventus Training Center" },
        { id: "milan_youth", name: "AC Milan Primavera", code: "MIL", icon: "🔴⚫", power: 75, stadium: "Centro Sportivo Vismara" },
        { id: "inter_youth", name: "Inter Milan Primavera", code: "INT", icon: "🔵⚫", power: 76, stadium: "Suning Training Centre" },
        { id: "pvf_academy", name: "PVF Football Academy", code: "PVF", icon: "🇻🇳", power: 72, stadium: "Trung Tâm Đào Tạo PVF" }
      ];

  // Đảm bảo đội học viện của người chơi có mặt trong danh sách
  let pClub = playerClub || { id: "la_masia", name: "FC Barcelona La Masia", code: "MAS", icon: "🔵🔴", power: 78 };
  let found = sourcePool.find(c => c.id === pClub.id || isSameClub(c, pClub) || c.name === pClub.name);
  if (!found) {
    found = {
      id: pClub.id || "player_youth_club",
      name: pClub.name || "Học Viện Người Chơi",
      code: pClub.code || "YOU",
      icon: pClub.icon || "⭐",
      power: pClub.power || 76,
      attPower: pClub.attPower || 78,
      defPower: pClub.defPower || 74,
      midPower: pClub.midPower || 76,
      stadium: pClub.stadium || "Sân Nhà Học Viện"
    };
    sourcePool[sourcePool.length - 1] = found;
  }

  // Tách đội người chơi và 15 học viện còn lại
  const others = sourcePool.filter(c => c.id !== found.id && !isSameClub(c, found));

  // Phân chia 16 đội vào 4 bảng (A, B, C, D)
  const teamA = [found, others[0], others[1], others[2]];
  const teamB = [others[3], others[4], others[5], others[6]];
  const teamC = [others[7], others[8], others[9], others[10]];
  const teamD = [others[11], others[12], others[13], others[14]];

  const toRow = (c, isP = false, slotIdx = 0) => ({
    clubId: c.id,
    clubName: c.name,
    clubCode: c.code || "CLB",
    clubIcon: c.icon || "⚽",
    slotIdx: slotIdx,
    power: c.power || 75,
    attPower: c.attPower || c.power || 75,
    defPower: c.defPower || c.power || 75,
    midPower: c.midPower || c.power || 75,
    stadium: c.stadium || "Sân Vận Động",
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    gf: 0,
    ga: 0,
    gd: 0,
    points: 0,
    recentForm: [],
    isPlayer: isP,
    status: 'Đang thi đấu'
  });

  return {
    A: teamA.map((c, idx) => toRow(c, idx === 0, idx)),
    B: teamB.map((c, idx) => toRow(c, false, idx)),
    C: teamC.map((c, idx) => toRow(c, false, idx)),
    D: teamD.map((c, idx) => toRow(c, false, idx))
  };
}

export function updateGroupRow(row, gf, ga) {
  if (!row) return;
  row.played += 1;
  row.gf += gf;
  row.ga += ga;
  row.gd = row.gf - row.ga;
  if (gf > ga) {
    row.won += 1;
    row.points += 3;
    row.recentForm.push('W');
  } else if (gf < ga) {
    row.lost += 1;
    row.recentForm.push('L');
  } else {
    row.drawn += 1;
    row.points += 1;
    row.recentForm.push('D');
  }
  if (row.recentForm.length > 5) row.recentForm = row.recentForm.slice(-5);
}

export function sortGroupTable(table) {
  if (!table || !Array.isArray(table)) return;
  table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    return a.clubName.localeCompare(b.clubName);
  });
}

/**
 * Xử lý mô phỏng và cập nhật kết quả 1 lượt đấu vòng bảng UEFA Youth League (Lượt 1, 2, 3)
 * Tự động mô phỏng các trận AI còn lại của cả 4 bảng và phân nhánh Knockout sau Lượt 3.
 */
export function processYouthLeagueGroupMatchday(player, roundData, homeScore, awayScore, pMatch) {
  if (!player.youthLeagueGroups) {
    const pClub = player.academy || player.club || player.currentClub;
    player.youthLeagueGroups = initYouthLeagueGroups(pClub);
  }
  const groups = player.youthLeagueGroups;

  // Xác định số lượt trận (1, 2, 3)
  let md = 1;
  const stage = roundData.stageName || roundData.stage || "";
  if (stage.includes("Lượt 2")) md = 2;
  else if (stage.includes("Lượt 3")) md = 3;

  // 1. CẬP NHẬT BẢNG A (BẢNG CỦA NGƯỜI CHƠI)
  const gA = groups.A;
  const matchHomeClub = pMatch.homeClub || pMatch.homeTeam;
  const matchAwayClub = pMatch.awayClub || pMatch.awayTeam || pMatch.opponent;

  const matchClubId = (c) => c?.id || c?.clubId || c?.code || c?.name;
  const pHomeId = matchClubId(matchHomeClub);
  const pAwayId = matchClubId(matchAwayClub);

  let rowHome = gA.find(r => (pHomeId && (r.clubId === pHomeId || r.clubName === pHomeId || r.clubCode === pHomeId)) || isSameClub(r, matchHomeClub));
  if (!rowHome) rowHome = gA.find(r => r.isPlayer) || gA[0];

  let rowAway = gA.find(r => (pAwayId && (r.clubId === pAwayId || r.clubName === pAwayId || r.clubCode === pAwayId)) || isSameClub(r, matchAwayClub));
  if (!rowAway || rowAway.clubId === rowHome.clubId) {
    rowAway = gA.find(r => r.clubId !== rowHome.clubId) || gA[1];
  }

  updateGroupRow(rowHome, homeScore, awayScore);
  updateGroupRow(rowAway, awayScore, homeScore);

  // Trận còn lại của Bảng A là 2 đội chưa thi đấu trong lượt này
  const remainingA = gA.filter(r => r.clubId !== rowHome.clubId && r.clubId !== rowAway.clubId);
  if (remainingA.length >= 2) {
    const res = simulateAIFixture(remainingA[0], remainingA[1]);
    updateGroupRow(remainingA[0], res.homeScore, res.awayScore);
    updateGroupRow(remainingA[1], res.awayScore, res.homeScore);
  }

  // 2. MÔ PHỎNG CÁC TRẬN CỦA BẢNG B, C, D THEO SLOT CỐ ĐỊNH (MỖI ĐỘI ĐÁ ĐÚNG 1 TRẬN/LƯỢT)
  ['B', 'C', 'D'].forEach(gKey => {
    const g = groups[gKey];
    if (!g || g.length < 4) return;
    const team0 = g.find(r => r.slotIdx === 0) || g[0];
    const team1 = g.find(r => r.slotIdx === 1) || g[1];
    const team2 = g.find(r => r.slotIdx === 2) || g[2];
    const team3 = g.find(r => r.slotIdx === 3) || g[3];

    let m1_h, m1_a, m2_h, m2_a;
    if (md === 1) {
      m1_h = team0; m1_a = team1;
      m2_h = team2; m2_a = team3;
    } else if (md === 2) {
      m1_h = team0; m1_a = team2;
      m2_h = team3; m2_a = team1;
    } else {
      m1_h = team0; m1_a = team3;
      m2_h = team1; m2_a = team2;
    }
    const r1 = simulateAIFixture(m1_h, m1_a);
    updateGroupRow(m1_h, r1.homeScore, r1.awayScore);
    updateGroupRow(m1_a, r1.awayScore, r1.homeScore);

    const r2 = simulateAIFixture(m2_h, m2_a);
    updateGroupRow(m2_h, r2.homeScore, r2.awayScore);
    updateGroupRow(m2_a, r2.awayScore, r2.homeScore);
  });

  // Sắp xếp thứ hạng cả 4 bảng
  sortGroupTable(groups.A);
  sortGroupTable(groups.B);
  sortGroupTable(groups.C);
  sortGroupTable(groups.D);

  // Đồng bộ continentalGroupTable để UI hiển thị Bảng A của người chơi
  player.continentalGroupTable = groups.A;

  // 3. KHI KẾT THÚC LƯỢT 3 MỚI XÉT VÉ ĐI TIẾP VÀO SƠ ĐỒ KNOCKOUT (TỨ KẾT)
  if (md < 3) {
    ['A', 'B', 'C', 'D'].forEach(k => {
      if (groups[k] && Array.isArray(groups[k])) {
        groups[k].forEach(row => {
          row.status = 'Đang thi đấu';
        });
      }
    });
  } else if (md === 3) {
    ['A', 'B', 'C', 'D'].forEach(k => {
      if (groups[k][0]) groups[k][0].status = 'ADVANCE';
      if (groups[k][1]) groups[k][1].status = 'ADVANCE';
      if (groups[k][2]) groups[k][2].status = 'OUT';
      if (groups[k][3]) groups[k][3].status = 'OUT';
    });

    const A1 = groups.A[0];
    const A2 = groups.A[1];
    const B1 = groups.B[0];
    const B2 = groups.B[1];
    const C1 = groups.C[0];
    const C2 = groups.C[1];
    const D1 = groups.D[0];
    const D2 = groups.D[1];

    const toClubObj = (row) => ({
      id: row.clubId,
      name: row.clubName,
      code: row.clubCode,
      icon: row.clubIcon,
      power: row.power,
      attPower: row.attPower,
      defPower: row.defPower,
      midPower: row.midPower,
      stadium: row.stadium
    });

    const clubA1 = toClubObj(A1);
    const clubA2 = toClubObj(A2);
    const clubB1 = toClubObj(B1);
    const clubB2 = toClubObj(B2);
    const clubC1 = toClubObj(C1);
    const clubC2 = toClubObj(C2);
    const clubD1 = toClubObj(D1);
    const clubD2 = toClubObj(D2);

    const activeClub = player.academy || player.club || player.currentClub;
    const isPlayerA1 = isSameClub(clubA1, activeClub) || clubA1.id === activeClub?.id;
    const isPlayerA2 = isSameClub(clubA2, activeClub) || clubA2.id === activeClub?.id;
    const isPlayerAdvanced = isPlayerA1 || isPlayerA2;

    // Cập nhật Sơ đồ Knockout Cúp C1 Trẻ:
    // Nhánh đấu Tứ Kết:
    // QF1: Nhất A vs Nhì B
    // QF2: Nhất C vs Nhì D
    // QF3: Nhất B vs Nhì A
    // QF4: Nhất D vs Nhì C
    if (player.tournamentBrackets?.continentalCup) {
      const b = player.tournamentBrackets.continentalCup;
      b.quarterFinals = [
        { id: "youth_qf1", matchId: "QF1", name: "Tứ Kết 1 (Nhất A vs Nhì B)", club1: clubA1, club2: clubB2, score1: null, score2: null, winner: null, isPlayerMatch: isPlayerA1 },
        { id: "youth_qf2", matchId: "QF2", name: "Tứ Kết 2 (Nhất C vs Nhì D)", club1: clubC1, club2: clubD2, score1: null, score2: null, winner: null, isPlayerMatch: false },
        { id: "youth_qf3", matchId: "QF3", name: "Tứ Kết 3 (Nhất B vs Nhì A)", club1: clubB1, club2: clubA2, score1: null, score2: null, winner: null, isPlayerMatch: isPlayerA2 },
        { id: "youth_qf4", matchId: "QF4", name: "Tứ Kết 4 (Nhất D vs Nhì C)", club1: clubD1, club2: clubC2, score1: null, score2: null, winner: null, isPlayerMatch: false }
      ];
      b.semiFinals = [
        { id: "youth_sf1", matchId: "SF1", name: "Bán Kết 1 (Thắng QF1 vs Thắng QF2)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false },
        { id: "youth_sf2", matchId: "SF2", name: "Bán Kết 2 (Thắng QF3 vs Thắng QF4)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false }
      ];
      b.final = { id: "youth_f", matchId: "FINAL", name: "Chung Kết UEFA Youth League", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false };
      b.champion = null;
    }

    // Cập nhật fixture Tứ Kết sắp tới trong lịch thi đấu của người chơi
    const curIdx = player.currentFixtureIndex || 0;
    const qfFixture = (player.currentSeasonFixtures || []).slice(curIdx + 1).find(f => 
      f.competitionType === 'UCL' && 
      ((f.stageName && f.stageName.includes("Tứ Kết")) || (f.stage && f.stage.includes("Tứ Kết")))
    );

    if (isPlayerAdvanced) {
      const qfOpponent = isPlayerA1 ? clubB2 : clubB1;
      const isPlayerHome = isPlayerA1; // Nhất bảng được ưu tiên đá sân nhà
      if (qfFixture && qfFixture.playerMatch) {
        qfFixture.playerMatch.opponent = qfOpponent;
        qfFixture.playerMatch.isPlayerHome = isPlayerHome;
        qfFixture.playerMatch.homeClub = isPlayerHome ? activeClub : qfOpponent;
        qfFixture.playerMatch.awayClub = isPlayerHome ? qfOpponent : activeClub;
        qfFixture.playerMatch.stadium = isPlayerHome ? (activeClub.stadium || "Sân Nhà Học Viện") : (qfOpponent.stadium || "Sân Khách");
        qfFixture.stageName = isPlayerA1 ? "Tứ Kết UEFA Youth League (Nhất A vs Nhì B)" : "Tứ Kết UEFA Youth League (Nhất B vs Nhì A)";
      }
    } else {
      // Người chơi xếp thứ 3 hoặc 4 -> Bị loại sau vòng bảng!
      player.youthLeagueEliminated = true;
      const futureC1Fixtures = (player.currentSeasonFixtures || []).slice(curIdx + 1).filter(f => 
        f.competitionType === 'UCL' && 
        ((f.stageName && (f.stageName.includes("Tứ Kết") || f.stageName.includes("Bán Kết") || f.stageName.includes("Chung Kết"))) ||
         (f.stage && (f.stage.includes("Tứ Kết") || f.stage.includes("Bán Kết") || f.stage.includes("Chung Kết"))))
      );
      futureC1Fixtures.forEach(f => {
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
  }
}

/**
 * Khởi tạo Sơ đồ phân nhánh Cúp Quốc Gia và Cúp Châu Âu (Quarter-Finals 8 đội)
 */
export function initTournamentBrackets(player, activeClub, leagueId, euroStatus, isYouth) {
  // Khởi tạo bảng Vua Phá Lưới & Vua Kiến Tạo cho các giải Cúp nếu có đối tượng player
  if (player) {
    initCupIndividualTrackers(player, 'domestic');
    initCupIndividualTrackers(player, 'continental');
  }

  // 1. Cúp Quốc Gia (Đầy đủ 16 Đội cho Vòng 1/8 ➔ Tứ Kết ➔ Bán Kết ➔ Chung Kết)
  const domesticCupName = isYouth ? "Cúp Trẻ Quốc Gia U19" : (activeClub.league?.domesticCup || "Cúp Quốc Gia");
  let pool = [];
  if (isYouth) {
    const youthClubs = (typeof UEFA_YOUTH_LEAGUE_CLUBS !== 'undefined' && UEFA_YOUTH_LEAGUE_CLUBS.length >= 16)
      ? UEFA_YOUTH_LEAGUE_CLUBS.map(c => ({ ...c }))
      : YOUTH_LEAGUE_CLUBS.map(c => ({ ...c }));
    pool = youthClubs.filter(c => c.id !== activeClub.id && !isSameClub(c, activeClub));
  } else {
    const leaguePool = LEAGUE_TEAMS_MAP[leagueId] || LEAGUE_TEAMS_MAP.PREMIER_LEAGUE || ALL_CLUBS;
    const sorted = [...leaguePool].sort((a, b) => (b.power || 75) - (a.power || 75));
    pool = sorted.filter(c => c.id !== activeClub.id && !isSameClub(c, activeClub));
  }

  const domesticTeams = [activeClub];
  for (const c of pool) {
    if (domesticTeams.length >= 16) break;
    if (!domesticTeams.some(t => t.id === c.id || isSameClub(t, c))) {
      domesticTeams.push(c);
    }
  }
  let fillerIdx = 0;
  const fillerPool = isYouth 
    ? ((typeof UEFA_YOUTH_LEAGUE_CLUBS !== 'undefined' && UEFA_YOUTH_LEAGUE_CLUBS.length >= 16) ? UEFA_YOUTH_LEAGUE_CLUBS : YOUTH_LEAGUE_CLUBS) 
    : ALL_CLUBS;
  while (domesticTeams.length < 16 && fillerIdx < fillerPool.length) {
    const filler = fillerPool[fillerIdx++];
    if (!domesticTeams.some(t => t.id === filler.id || isSameClub(t, filler))) {
      domesticTeams.push(filler);
    }
  }

  // Đảm bảo không có cặp nào trùng nhau (home !== away)
  for (let i = 0; i < domesticTeams.length; i += 2) {
    if (domesticTeams[i] && domesticTeams[i + 1] && (domesticTeams[i].id === domesticTeams[i + 1].id || isSameClub(domesticTeams[i], domesticTeams[i + 1]))) {
      for (let j = 0; j < domesticTeams.length; j++) {
        if (j !== i && j !== i + 1 && !isSameClub(domesticTeams[i], domesticTeams[j])) {
          const temp = domesticTeams[i + 1];
          domesticTeams[i + 1] = domesticTeams[j];
          domesticTeams[j] = temp;
          break;
        }
      }
    }
  }

  // 1. Tạo 8 cặp đấu Vòng 1/8 sạch trắng (chưa đá, tỷ số null, chỉ Trận 1 có CLB người chơi)
  const roundOf16Matches = [];
  for (let i = 0; i < 8; i++) {
    const c1 = domesticTeams[i * 2] || { name: `CLB ${i * 2 + 1}`, code: "CLB", icon: "⚽" };
    const c2 = domesticTeams[i * 2 + 1] || { name: `CLB ${i * 2 + 2}`, code: "CLB", icon: "⚽" };
    roundOf16Matches.push({
      id: `dom_r16_${i + 1}`,
      matchId: `R16_${i + 1}`,
      name: `Vòng 1/8 - Trận ${i + 1}`,
      club1: c1,
      club2: c2,
      score1: null,
      score2: null,
      winner: null,
      isPlayed: false,
      isPlayerMatch: Boolean(i === 0)
    });
  }

  // 2. Tạo 4 trận Tứ Kết sạch trắng (Chờ xác định TBD từ vòng 1/8)
  const quarterFinalMatches = [
    { id: "dom_qf1", matchId: "QF1", name: "Tứ Kết 1 (Thắng Trận 1 vs Thắng Trận 2)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
    { id: "dom_qf2", matchId: "QF2", name: "Tứ Kết 2 (Thắng Trận 3 vs Thắng Trận 4)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
    { id: "dom_qf3", matchId: "QF3", name: "Tứ Kết 3 (Thắng Trận 5 vs Thắng Trận 6)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
    { id: "dom_qf4", matchId: "QF4", name: "Tứ Kết 4 (Thắng Trận 7 vs Thắng Trận 8)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false }
  ];

  // 3. Tạo 2 trận Bán Kết sạch trắng (Chờ xác định TBD)
  const semiFinalMatches = [
    { id: "dom_sf1", matchId: "SF1", name: "Bán Kết 1 (Thắng QF1 vs Thắng QF2)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
    { id: "dom_sf2", matchId: "SF2", name: "Bán Kết 2 (Thắng QF3 vs Thắng QF4)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false }
  ];

  // 4. Tạo 1 trận Chung Kết sạch trắng (Chờ xác định TBD)
  const finalMatch = { id: "dom_f", matchId: "FINAL", name: "Chung Kết Cúp Quốc Gia", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false };

  const domesticBracket = {
    name: domesticCupName,
    type: "DOMESTIC_CUP",
    roundOf16: roundOf16Matches,
    quarterFinals: quarterFinalMatches,
    semiFinals: semiFinalMatches,
    final: finalMatch,
    champion: null
  };

  // 2. Cúp Châu Âu (UEFA Youth League / UCL / UEL)
  let continentalBracket = null;
  if (isYouth) {
    continentalBracket = {
      name: "UEFA Youth League (C1 Trẻ)",
      type: "UCL",
      isYouthLeague: true,
      quarterFinals: [
        { id: "youth_qf1", matchId: "QF1", name: "Tứ Kết 1 (Nhất A vs Nhì B)", club1: { name: "Nhất Bảng A", code: "1A", icon: "🥇", power: 78 }, club2: { name: "Nhì Bảng B", code: "2B", icon: "🥈", power: 76 }, score1: null, score2: null, winner: null, isPlayerMatch: true },
        { id: "youth_qf2", matchId: "QF2", name: "Tứ Kết 2 (Nhất C vs Nhì D)", club1: { name: "Nhất Bảng C", code: "1C", icon: "🥇", power: 77 }, club2: { name: "Nhì Bảng D", code: "2D", icon: "🥈", power: 75 }, score1: null, score2: null, winner: null, isPlayerMatch: false },
        { id: "youth_qf3", matchId: "QF3", name: "Tứ Kết 3 (Nhất B vs Nhì A)", club1: { name: "Nhất Bảng B", code: "1B", icon: "🥇", power: 77 }, club2: { name: "Nhì Bảng A", code: "2A", icon: "🥈", power: 76 }, score1: null, score2: null, winner: null, isPlayerMatch: false },
        { id: "youth_qf4", matchId: "QF4", name: "Tứ Kết 4 (Nhất D vs Nhì C)", club1: { name: "Nhất Bảng D", code: "1D", icon: "🥇", power: 76 }, club2: { name: "Nhì Bảng C", code: "2C", icon: "🥈", power: 75 }, score1: null, score2: null, winner: null, isPlayerMatch: false }
      ],
      semiFinals: [
        { id: "youth_sf1", matchId: "SF1", name: "Bán Kết 1 (Thắng QF1 vs Thắng QF2)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false },
        { id: "youth_sf2", matchId: "SF2", name: "Bán Kết 2 (Thắng QF3 vs Thắng QF4)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false }
      ],
      final: { id: "youth_f", matchId: "FINAL", name: "Chung Kết UEFA Youth League", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false },
      champion: null
    };
  } else {
    const isEuro = euroStatus === "C1" || euroStatus === "C2";
    if (isEuro) {
      const euroTourneyName = euroStatus === "C1" ? "UEFA Champions League" : "UEFA Europa League";
      const topEuropean = ALL_CLUBS.filter(c => (c.power || 75) >= 84 && c.id !== activeClub.id && !isSameClub(c, activeClub))
                                   .sort((a, b) => (b.power || 75) - (a.power || 75))
                                   .slice(0, 7);
      const euroTeams = [activeClub];
      for (const c of topEuropean) {
        if (!euroTeams.some(t => t.id === c.id || isSameClub(t, c))) {
          euroTeams.push(c);
        }
      }
      let euroFillerIdx = 0;
      while (euroTeams.length < 8 && euroFillerIdx < ALL_CLUBS.length) {
        const filler = ALL_CLUBS[euroFillerIdx++];
        if (!euroTeams.some(t => t.id === filler.id || isSameClub(t, filler))) {
          euroTeams.push(filler);
        }
      }

      for (let i = 0; i < euroTeams.length; i += 2) {
        if (euroTeams[i] && euroTeams[i + 1] && (euroTeams[i].id === euroTeams[i + 1].id || isSameClub(euroTeams[i], euroTeams[i + 1]))) {
          for (let j = 0; j < euroTeams.length; j++) {
            if (j !== i && j !== i + 1 && !isSameClub(euroTeams[i], euroTeams[j])) {
              const temp = euroTeams[i + 1];
              euroTeams[i + 1] = euroTeams[j];
              euroTeams[j] = temp;
              break;
            }
          }
        }
      }

      continentalBracket = {
        name: euroTourneyName,
        type: "UCL",
        quarterFinals: [
          { id: "euro_qf1", club1: euroTeams[0], club2: euroTeams[1], score1: null, score2: null, winner: null, isPlayerMatch: true },
          { id: "euro_qf2", club1: euroTeams[2], club2: euroTeams[3], score1: null, score2: null, winner: null, isPlayerMatch: false },
          { id: "euro_qf3", club1: euroTeams[4], club2: euroTeams[5], score1: null, score2: null, winner: null, isPlayerMatch: false },
          { id: "euro_qf4", club1: euroTeams[6], club2: euroTeams[7], score1: null, score2: null, winner: null, isPlayerMatch: false }
        ],
        semiFinals: [
          { id: "euro_sf1", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false },
          { id: "euro_sf2", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false }
        ],
        final: { id: "euro_f", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false },
        champion: null
      };
    }
  }

  return {
    domesticCup: domesticBracket,
    continentalCup: continentalBracket
  };
}

/**
 * Cập nhật và đẩy nhánh đấu cúp (Tứ Kết -> Bán Kết -> Chung Kết)
 */
export function advanceTournamentBracket(bracket, stageName, playerResult, activePlayerClub, player = null) {
  if (!bracket) return;
  const playerClubId = activePlayerClub?.id || activePlayerClub?.name;

  function resolveMatchWinner(m) {
    if (!m) return null;
    if (!m.club1) m.club1 = { name: "Đối Thủ 1", code: "DT1", icon: "⚽", power: 80 };
    if (!m.club2) m.club2 = { name: "Đối Thủ 2", code: "DT2", icon: "⚽", power: 80 };
    if (m.score1 === null || m.score2 === null) {
      const res = simulateAIFixture(m.club1, m.club2);
      m.score1 = res.homeScore;
      m.score2 = res.awayScore;
      if (m.score1 === m.score2) {
        if (Math.random() < 0.5) m.score1 += 1;
        else m.score2 += 1;
        m.isPenalties = true;
      }
    }
    m.winner = m.score1 > m.score2 ? m.club1 : m.club2;
    return m.winner;
  }

  const isPlayerClub = (c) => Boolean(
    c && activePlayerClub &&
    (c.id === playerClubId || c.name === playerClubId || isSameClub(c, activePlayerClub) || isClubMatch(c, playerClubId) || isClubMatch(c, activePlayerClub.name))
  );

  // Đồng bộ sơ đồ cúp khi vào các vòng sâu hơn
  if (bracket.roundOf16 && Array.isArray(bracket.roundOf16) && (stageName.includes("Tứ Kết") || stageName.includes("Bán Kết") || stageName.includes("Chung Kết"))) {
    bracket.roundOf16.forEach(m => {
      if (!m.winner) resolveMatchWinner(m);
    });
    if (bracket.quarterFinals && bracket.quarterFinals.length === 4) {
      if (!bracket.quarterFinals[0].club1) bracket.quarterFinals[0].club1 = bracket.roundOf16[0]?.winner;
      if (!bracket.quarterFinals[0].club2) bracket.quarterFinals[0].club2 = bracket.roundOf16[1]?.winner;
      if (!bracket.quarterFinals[1].club1) bracket.quarterFinals[1].club1 = bracket.roundOf16[2]?.winner;
      if (!bracket.quarterFinals[1].club2) bracket.quarterFinals[1].club2 = bracket.roundOf16[3]?.winner;
      if (!bracket.quarterFinals[2].club1) bracket.quarterFinals[2].club1 = bracket.roundOf16[4]?.winner;
      if (!bracket.quarterFinals[2].club2) bracket.quarterFinals[2].club2 = bracket.roundOf16[5]?.winner;
      if (!bracket.quarterFinals[3].club1) bracket.quarterFinals[3].club1 = bracket.roundOf16[6]?.winner;
      if (!bracket.quarterFinals[3].club2) bracket.quarterFinals[3].club2 = bracket.roundOf16[7]?.winner;
      bracket.quarterFinals.forEach(qf => {
        qf.isPlayerMatch = Boolean(isPlayerClub(qf.club1) || isPlayerClub(qf.club2));
      });
    }
  }

  if (stageName.includes("Bán Kết") || stageName.includes("Chung Kết")) {
    if (bracket.quarterFinals && Array.isArray(bracket.quarterFinals)) {
      bracket.quarterFinals.forEach(m => {
        if (!m.winner) resolveMatchWinner(m);
      });
      if (!bracket.semiFinals[0].club1 || !bracket.semiFinals[0].club2) {
        bracket.semiFinals[0].club1 = bracket.quarterFinals[0]?.winner || bracket.quarterFinals[0]?.club1;
        bracket.semiFinals[0].club2 = bracket.quarterFinals[1]?.winner || bracket.quarterFinals[1]?.club1;
        bracket.semiFinals[1].club1 = bracket.quarterFinals[2]?.winner || bracket.quarterFinals[2]?.club1;
        bracket.semiFinals[1].club2 = bracket.quarterFinals[3]?.winner || bracket.quarterFinals[3]?.club1;

        if (bracket.semiFinals[0].club1 && bracket.semiFinals[0].club2 && 
            (bracket.semiFinals[0].club1.id === bracket.semiFinals[0].club2.id || isSameClub(bracket.semiFinals[0].club1, bracket.semiFinals[0].club2))) {
          const temp = bracket.semiFinals[0].club2;
          bracket.semiFinals[0].club2 = bracket.semiFinals[1].club2;
          bracket.semiFinals[1].club2 = temp;
        }
      }
      bracket.semiFinals[0].isPlayerMatch = Boolean(
        isPlayerClub(bracket.semiFinals[0].club1) ||
        isPlayerClub(bracket.semiFinals[0].club2)
      );
      bracket.semiFinals[1].isPlayerMatch = Boolean(
        isPlayerClub(bracket.semiFinals[1].club1) ||
        isPlayerClub(bracket.semiFinals[1].club2)
      );
      if (!bracket.semiFinals[0].isPlayerMatch && !bracket.semiFinals[1].isPlayerMatch) {
        bracket.semiFinals[0].club1 = activePlayerClub;
        bracket.semiFinals[0].isPlayerMatch = true;
      }
    }
  }

  if (stageName.includes("Vòng 1/8")) {
    if (bracket.roundOf16 && Array.isArray(bracket.roundOf16)) {
      const pM = bracket.roundOf16.find(m => m.isPlayerMatch || isPlayerClub(m.club1) || isPlayerClub(m.club2));
      if (pM && playerResult) {
        const isP1 = isPlayerClub(pM.club1);
        const isPHome = Boolean(playerResult.isPlayerHome);
        if (isP1) {
          pM.score1 = isPHome ? playerResult.homeScore : playerResult.awayScore;
          pM.score2 = isPHome ? playerResult.awayScore : playerResult.homeScore;
        } else {
          pM.score2 = isPHome ? playerResult.homeScore : playerResult.awayScore;
          pM.score1 = isPHome ? playerResult.awayScore : playerResult.homeScore;
        }
        if (pM.score1 === pM.score2) {
          if (playerResult.isWin) {
            if (isP1) pM.score1 += 1; else pM.score2 += 1;
          } else {
            if (isP1) pM.score2 += 1; else pM.score1 += 1;
          }
          pM.isPenalties = true;
        }
        pM.winner = pM.score1 > pM.score2 ? pM.club1 : pM.club2;
      }
      bracket.roundOf16.forEach(m => {
        if (!m.winner) resolveMatchWinner(m);
      });
      if (bracket.quarterFinals && bracket.quarterFinals.length === 4) {
        bracket.quarterFinals[0].club1 = bracket.roundOf16[0]?.winner || bracket.quarterFinals[0].club1;
        bracket.quarterFinals[0].club2 = bracket.roundOf16[1]?.winner || bracket.quarterFinals[0].club2;
        bracket.quarterFinals[1].club1 = bracket.roundOf16[2]?.winner || bracket.quarterFinals[1].club1;
        bracket.quarterFinals[1].club2 = bracket.roundOf16[3]?.winner || bracket.quarterFinals[1].club2;
        bracket.quarterFinals[2].club1 = bracket.roundOf16[4]?.winner || bracket.quarterFinals[2].club1;
        bracket.quarterFinals[2].club2 = bracket.roundOf16[5]?.winner || bracket.quarterFinals[2].club2;
        bracket.quarterFinals[3].club1 = bracket.roundOf16[6]?.winner || bracket.quarterFinals[3].club1;
        bracket.quarterFinals[3].club2 = bracket.roundOf16[7]?.winner || bracket.quarterFinals[3].club2;
        bracket.quarterFinals.forEach(qf => {
          qf.isPlayerMatch = Boolean(isPlayerClub(qf.club1) || isPlayerClub(qf.club2));
        });
      }
    }
  } else if (stageName.includes("Tứ Kết")) {
    const pM = bracket.quarterFinals.find(m => m.isPlayerMatch || isPlayerClub(m.club1) || isPlayerClub(m.club2));
    if (pM && playerResult) {
      const isP1 = isPlayerClub(pM.club1);
      const isPHome = Boolean(playerResult.isPlayerHome);
      if (isP1) {
        pM.score1 = isPHome ? playerResult.homeScore : playerResult.awayScore;
        pM.score2 = isPHome ? playerResult.awayScore : playerResult.homeScore;
      } else {
        pM.score2 = isPHome ? playerResult.homeScore : playerResult.awayScore;
        pM.score1 = isPHome ? playerResult.awayScore : playerResult.homeScore;
      }
      if (pM.score1 === pM.score2) {
        if (playerResult.isWin) {
          if (isP1) pM.score1 += 1; else pM.score2 += 1;
        } else {
          if (isP1) pM.score2 += 1; else pM.score1 += 1;
        }
        pM.isPenalties = true;
      }
      pM.winner = pM.score1 > pM.score2 ? pM.club1 : pM.club2;
    }
    bracket.quarterFinals.forEach(m => {
      if (!m.winner) resolveMatchWinner(m);
    });

    bracket.semiFinals[0].club1 = bracket.quarterFinals[0].winner;
    bracket.semiFinals[0].club2 = bracket.quarterFinals[1].winner;
    bracket.semiFinals[1].club1 = bracket.quarterFinals[2].winner;
    bracket.semiFinals[1].club2 = bracket.quarterFinals[3].winner;

    if (bracket.semiFinals[0].club1 && bracket.semiFinals[0].club2 && 
        (bracket.semiFinals[0].club1.id === bracket.semiFinals[0].club2.id || isSameClub(bracket.semiFinals[0].club1, bracket.semiFinals[0].club2))) {
      const temp = bracket.semiFinals[0].club2;
      bracket.semiFinals[0].club2 = bracket.semiFinals[1].club2;
      bracket.semiFinals[1].club2 = temp;
    }

    bracket.semiFinals[0].isPlayerMatch = Boolean(
      isPlayerClub(bracket.semiFinals[0].club1) ||
      isPlayerClub(bracket.semiFinals[0].club2)
    );

    bracket.semiFinals[1].isPlayerMatch = Boolean(
      isPlayerClub(bracket.semiFinals[1].club1) ||
      isPlayerClub(bracket.semiFinals[1].club2)
    );
    if (!bracket.semiFinals[0].isPlayerMatch && !bracket.semiFinals[1].isPlayerMatch) {
      bracket.semiFinals[0].club1 = activePlayerClub;
      bracket.semiFinals[0].isPlayerMatch = true;
    }
  } else if (stageName.includes("Bán Kết")) {
    let pM = bracket.semiFinals.find(m => m.isPlayerMatch || isPlayerClub(m.club1) || isPlayerClub(m.club2));
    if (!pM) {
      bracket.semiFinals[0].club1 = activePlayerClub;
      bracket.semiFinals[0].isPlayerMatch = true;
      pM = bracket.semiFinals[0];
    }
    if (pM && playerResult) {
      const isP1 = isPlayerClub(pM.club1);
      const isPHome = Boolean(playerResult.isPlayerHome);
      if (isP1) {
        pM.score1 = isPHome ? playerResult.homeScore : playerResult.awayScore;
        pM.score2 = isPHome ? playerResult.awayScore : playerResult.homeScore;
      } else {
        pM.score2 = isPHome ? playerResult.homeScore : playerResult.awayScore;
        pM.score1 = isPHome ? playerResult.awayScore : playerResult.homeScore;
      }
      if (pM.score1 === pM.score2) {
        if (playerResult.isWin) {
          if (isP1) pM.score1 += 1; else pM.score2 += 1;
        } else {
          if (isP1) pM.score2 += 1; else pM.score1 += 1;
        }
        pM.isPenalties = true;
      }
      pM.winner = pM.score1 > pM.score2 ? pM.club1 : pM.club2;
    }
    bracket.semiFinals.forEach(m => {
      if (!m.winner) resolveMatchWinner(m);
    });

    bracket.final.club1 = bracket.semiFinals[0].winner;
    bracket.final.club2 = bracket.semiFinals[1].winner;

    if (bracket.final.club1 && bracket.final.club2 && 
        (bracket.final.club1.id === bracket.final.club2.id || isSameClub(bracket.final.club1, bracket.final.club2))) {
      const altClub = bracket.semiFinals[1].club1 === bracket.final.club2 ? bracket.semiFinals[1].club2 : bracket.semiFinals[1].club1;
      if (altClub && !isSameClub(bracket.final.club1, altClub)) {
        bracket.final.club2 = altClub;
      }
    }
    bracket.final.isPlayerMatch = Boolean(
      isPlayerClub(bracket.final.club1) ||
      isPlayerClub(bracket.final.club2)
    );
    if (!bracket.final.isPlayerMatch && playerResult?.isWin) {
      bracket.final.club1 = activePlayerClub;
      bracket.final.isPlayerMatch = true;
    }
  } else if (stageName.includes("Chung Kết")) {
    bracket.semiFinals.forEach(m => {
      if (!m.winner) resolveMatchWinner(m);
    });
    if (!bracket.final.club1 || !bracket.final.club2) {
      bracket.final.club1 = bracket.semiFinals[0]?.winner || activePlayerClub;
      bracket.final.club2 = bracket.semiFinals[1]?.winner || { name: "Đối Thủ Chung Kết", icon: "⚔️", power: 85 };
    }
    const fM = bracket.final;
    const isP1 = isPlayerClub(fM.club1);
    const isP2 = isPlayerClub(fM.club2);
    fM.isPlayerMatch = Boolean(fM.isPlayerMatch || isP1 || isP2);

    if (fM.isPlayerMatch && playerResult) {
      const isPHome = Boolean(playerResult.isPlayerHome);
      if (isP1) {
        fM.score1 = isPHome ? playerResult.homeScore : playerResult.awayScore;
        fM.score2 = isPHome ? playerResult.awayScore : playerResult.homeScore;
      } else {
        fM.score2 = isPHome ? playerResult.homeScore : playerResult.awayScore;
        fM.score1 = isPHome ? playerResult.awayScore : playerResult.homeScore;
      }
      if (fM.score1 === fM.score2) {
        if (playerResult.isWin) {
          if (isP1) fM.score1 += 1; else fM.score2 += 1;
        } else {
          if (isP1) fM.score2 += 1; else fM.score1 += 1;
        }
        fM.isPenalties = true;
      }
      fM.winner = fM.score1 > fM.score2 ? fM.club1 : fM.club2;
    } else {
      resolveMatchWinner(fM);
    }
    bracket.champion = fM.winner;

    // 1. GHI NHẬN CÚP NGAY KHI THẮNG CHUNG KẾT (CUP COMPETITIONS)
    const isPlayerWinChampion = Boolean(
      (fM.winner && (isPlayerClub(fM.winner) || isSameClub(fM.winner, activePlayerClub))) ||
      (fM.isPlayerMatch && playerResult?.isWin)
    );

    if (isPlayerWinChampion) {
      let tourneyName = bracket.name || bracket.title || bracket.tournamentName || "";
      const isYouth = Boolean(player?.isAcademyStage || (player?.age && player.age <= 16) || bracket.isYouth || (tourneyName && (tourneyName.includes("Trẻ") || tourneyName.includes("Youth"))));
      
      let resolvedTrophyName = tourneyName;
      if (isYouth) {
        if (tourneyName.includes("Youth League") || tourneyName.includes("C1") || tourneyName.includes("Châu Âu")) {
          resolvedTrophyName = "UEFA Youth League (Cúp C1 Trẻ)";
        } else {
          resolvedTrophyName = "Cúp Trẻ Quốc Gia U19";
        }
      } else {
        if (tourneyName.includes("Champions League") || tourneyName.includes("C1")) {
          resolvedTrophyName = "UEFA Champions League";
        } else if (!resolvedTrophyName) {
          resolvedTrophyName = "Cúp Quốc Gia";
        }
      }

      const pObj = player || playerResult?.player || activePlayerClub?.player || (typeof getPlayer === 'function' ? getPlayer() : null) || (typeof window !== 'undefined' && window.gameState?.player);
      if (pObj) {
        awardCupVictory(pObj, resolvedTrophyName);
      }
    }

    // 2. Chấm và trao giải Vua Phá Lưới & Vua Kiến Tạo của giải đấu Cúp (Individual Cup Awards)
    const pTarget = player || playerResult?.player || activePlayerClub?.player || (typeof getPlayer === 'function' ? getPlayer() : null) || (typeof window !== 'undefined' && window.gameState?.player);
    if (pTarget) {
      const tourneyName = bracket.name || bracket.title || bracket.tournamentName || "";
      const isCont = tourneyName.includes("Youth League") || tourneyName.includes("C1") || tourneyName.includes("Châu Âu") || tourneyName.includes("Champions") || tourneyName.includes("Europa") || tourneyName.includes("Conference");
      const cupType = isCont ? 'continental' : 'domestic';
      evaluateAndAwardCupAwards(pTarget, cupType, { bracket });
    }
  }
}

/**
 * Trao cúp vô địch giải đấu cúp ngay khi chiến thắng trận Chung kết
 * @param {object} player 
 * @param {string} tournamentName 
 */
export function awardCupVictory(player, tournamentName) {
  const p = player || (typeof getPlayer === 'function' ? getPlayer() : null) || (typeof window !== 'undefined' && window.gameState?.player);
  if (!p) return;
  if (!p.seasonTrophiesWonThisYear) p.seasonTrophiesWonThisYear = [];
  if (p.seasonTrophiesWonThisYear.includes(tournamentName)) return; // Tránh add trùng lặp trong cùng 1 mùa
  p.seasonTrophiesWonThisYear.push(tournamentName);

  // 1. Gọi ngay addTrophy(player, tournamentName)
  addTrophy(p, tournamentName);

  // 2. Tăng player.trophiesCount += 1 ngay lập tức
  p.trophiesCount = (p.trophiesCount || 0) + 1;
  p.careerTrophies = (p.careerTrophies || 0) + 1;

  const isC1Tourney = tournamentName.includes("Youth League") || tournamentName.includes("C1");
  const cupFameReward = isC1Tourney ? 500 : 300;
  p.fame = (p.fame || 0) + cupFameReward;

  if (tournamentName.includes("Youth League") || tournamentName.includes("C1 Trẻ")) {
    p.wonYouthC1 = true;
  }
  if (tournamentName.includes("Cúp Trẻ Quốc Gia")) {
    p.wonYouthCup = true;
  }

  // 3. Ghi log sự kiện vào Nhật Ký Sự Nghiệp (player.logs)
  if (!p.logs) p.logs = [];
  p.logs.unshift({
    year: p.year || 2026,
    age: p.age || 16,
    title: `🏆 VÔ ĐỊCH ${tournamentName.toUpperCase()}!`,
    text: `Đội bóng xuất sắc giành thắng lợi trong trận Chung kết kịch tính và chính thức nâng cao chiếc cúp vô địch danh giá ${tournamentName}!`,
    type: "trophy-win",
    timestamp: Date.now()
  });

  // 4. Ghi Biên Niên Sử (Milestones)
  const isC1 = tournamentName.includes("Youth League") || tournamentName.includes("C1");
  const milestoneKey = isC1 ? 'FIRST_C1_TITLE' : 'FIRST_LEAGUE_TITLE';
  recordChronicleMilestone(p, milestoneKey, {
    title: `Vô Địch ${tournamentName}`,
    desc: `Chiến thắng trận Chung kết đỉnh cao và nâng cao chiếc cúp vô địch ${tournamentName}!`,
    badge: "🏆 NHÀ VÔ ĐỊCH CÚP",
    badgeColor: "gold",
    category: "trophies",
    icon: "🏆"
  });
}

/**
 * Xử lý kết quả trận đấu Cúp và trao cúp nếu là trận Chung kết (recordCupMatchResult)
 */
export function recordCupMatchResult(player, tournamentName, isFinal, isWin, matchDetails = {}) {
  const p = player || (typeof getPlayer === 'function' ? getPlayer() : null) || (typeof window !== 'undefined' && window.gameState?.player);
  if (!p) return;
  if (isFinal && isWin) {
    let tName = tournamentName || "Cúp Trẻ Quốc Gia U19";
    if (tName.includes("Youth League") || tName.includes("C1") || tName.includes("Châu Âu")) {
      tName = "UEFA Youth League (Cúp C1 Trẻ)";
    } else if (p.isAcademyStage || (p.age && p.age <= 16)) {
      tName = "Cúp Trẻ Quốc Gia U19";
    }
    awardCupVictory(p, tName);
  }
}

/**
 * Điều phối vòng đấu cúp và xử lý kết quả (advanceCupStage)
 */
export function advanceCupStage(bracket, stageName, playerResult, activePlayerClub, player = null) {
  return advanceTournamentBracket(bracket, stageName, playerResult, activePlayerClub, player);
}

/**
 * Khởi tạo Bảng đấu Vòng Bảng Cúp C1/C2 (4 đội)
 */
export function initContinentalGroupTable(player, activeClub, euroStatus) {
  if (player?.isAcademyStage) {
    const groups = initYouthLeagueGroups(activeClub || player.academy || player.club || player.currentClub);
    player.youthLeagueGroups = groups;
    return groups.A;
  }
  if (euroStatus !== "C1" && euroStatus !== "C2") {
    return [];
  }
  const topEuropean = ALL_CLUBS.filter(c => (c.power || 75) >= 82 && c.id !== activeClub.id && c.name !== activeClub.name)
                               .sort((a, b) => (b.power || 75) - (a.power || 75))
                               .slice(0, 3);
  const list = [
    {
      clubId: activeClub.id,
      clubName: activeClub.name,
      clubCode: activeClub.code || "CLB",
      clubIcon: activeClub.icon || "👑",
      power: activeClub.power || 80,
      played: 0, won: 0, drawn: 0, lost: 0,
      gf: 0, ga: 0, gd: 0, points: 0,
      recentForm: [],
      isPlayer: true,
      status: 'NONE'
    },
    ...topEuropean.map(c => ({
      clubId: c.id,
      clubName: c.name,
      clubCode: c.code || "CLB",
      clubIcon: c.icon || "⭐",
      power: c.power || 82,
      played: 0, won: 0, drawn: 0, lost: 0,
      gf: 0, ga: 0, gd: 0, points: 0,
      recentForm: [],
      isPlayer: false,
      status: 'NONE'
    }))
  ];
  return list;
}

/**
 * Cập nhật bảng đấu Cúp Châu Âu
 */
export function updateContinentalGroupTable(table, homeId, awayId, homeScore, awayScore) {
  if (!table || table.length < 2) return;
  const home = table.find(t => t.clubId === homeId);
  const away = table.find(t => t.clubId === awayId);
  if (!home || !away) return;

  home.played += 1;
  away.played += 1;
  home.gf += homeScore;
  home.ga += awayScore;
  away.gf += awayScore;
  away.ga += homeScore;
  home.gd = home.gf - home.ga;
  away.gd = away.gf - away.ga;

  if (homeScore > awayScore) {
    home.won += 1;
    home.points += 3;
    home.recentForm.push('W');
    away.lost += 1;
    away.recentForm.push('L');
  } else if (homeScore < awayScore) {
    away.won += 1;
    away.points += 3;
    away.recentForm.push('W');
    home.lost += 1;
    home.recentForm.push('L');
  } else {
    home.drawn += 1;
    home.points += 1;
    home.recentForm.push('D');
    away.drawn += 1;
    away.points += 1;
    away.recentForm.push('D');
  }

  if (home.recentForm.length > 5) home.recentForm = home.recentForm.slice(-5);
  if (away.recentForm.length > 5) away.recentForm = away.recentForm.slice(-5);

  table.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.gd !== a.gd) return b.gd - a.gd;
    if (b.gf !== a.gf) return b.gf - a.gf;
    const aName = a.clubName || a.name || "";
    const bName = b.clubName || b.name || "";
    return aName.localeCompare(bName);
  });

  const isGroupFinished = table.length >= 4 && table.every(t => (t.played || 0) >= 3);
  if (isGroupFinished) {
    if (table[0]) table[0].status = 'ADVANCE';
    if (table[1]) table[1].status = 'ADVANCE';
    if (table[2]) table[2].status = 'UEL';
    if (table[3]) table[3].status = 'OUT';
  } else {
    table.forEach(t => {
      t.status = 'Đang thi đấu';
    });
  }
}

/* =========================================================================
   CUP INDIVIDUAL TRACKERS: TOP SCORERS & TOP ASSISTS (DOMESTIC & CONTINENTAL)
   ========================================================================= */

// Danh sách kiến tạo trẻ mặc định (U19 Playmakers Pool)
const YOUTH_CUP_ASSIST_CANDIDATES = [
  { id: 'nico_paz', name: 'Nico Paz', clubName: 'Real Madrid Castilla', clubCode: 'CAS', clubIcon: '👑' },
  { id: 'dani_rodriguez', name: 'Dani Rodríguez', clubName: 'FC Barcelona La Masia', clubCode: 'MAS', clubIcon: '🔵🔴' },
  { id: 'ethan_wheatley', name: 'Ethan Wheatley', clubName: 'Man United Carrington', clubCode: 'CAR', clubIcon: '👹' },
  { id: 'javier_fernandez', name: 'Javier Fernández', clubName: 'FC Bayern Campus', clubCode: 'BAY', clubIcon: '🔴' },
  { id: 'tyrique_george', name: 'Tyrique George', clubName: 'Chelsea Cobham Academy', clubCode: 'COB', clubIcon: '🔵' },
  { id: 'jan_faberski', name: 'Jan Faberski', clubName: 'Ajax De Toekomst', clubCode: 'AJX', clubIcon: '⚪🔴' },
  { id: 'gustavo_varela', name: 'Gustavo Varela', clubName: 'Benfica Seixal Campus', clubCode: 'SLB', clubIcon: '🦅' },
  { id: 'afonso_moreira', name: 'Afonso Moreira', clubName: 'Sporting Academy', clubCode: 'SCP', clubIcon: '🦁' },
  { id: 'phung_quang_tu', name: 'Phùng Quang Tú', clubName: 'PVF Football Academy', clubCode: 'PVF', clubIcon: '🇻🇳' },
  { id: 'eli_kroupi', name: 'Eli Junior Kroupi', clubName: 'INF Clairefontaine', clubCode: 'CLA', clubIcon: '🇫🇷' }
];

// Danh sách kiến tạo Cúp Châu Âu chuyên nghiệp (Pro Continental Playmakers)
const PRO_CONTINENTAL_ASSIST_CANDIDATES = [
  { name: 'Kevin De Bruyne', clubName: 'Manchester City', clubCode: 'MCI', clubIcon: '👑' },
  { name: 'Florian Wirtz', clubName: 'Bayer Leverkusen', clubCode: 'B04', clubIcon: '🔴⚫' },
  { name: 'Lamine Yamal', clubName: 'FC Barcelona', clubCode: 'BAR', clubIcon: '🔵🔴' },
  { name: 'Jude Bellingham', clubName: 'Real Madrid CF', clubCode: 'RMA', clubIcon: '👑' },
  { name: 'Martin Ødegaard', clubName: 'Arsenal FC', clubCode: 'ARS', clubIcon: '🔴' },
  { name: 'Cole Palmer', clubName: 'Chelsea FC', clubCode: 'CHE', clubIcon: '🔵' },
  { name: 'Bruno Fernandes', clubName: 'Manchester United', clubCode: 'MUN', clubIcon: '👹' },
  { name: 'Jamal Musiala', clubName: 'Bayern Munich', clubCode: 'BAY', clubIcon: '👑' },
  { name: 'Antoine Griezmann', clubName: 'Atletico Madrid', clubCode: 'ATM', clubIcon: '🔴⚪' },
  { name: 'Bukayo Saka', clubName: 'Arsenal FC', clubCode: 'ARS', clubIcon: '🔴' }
];

// Danh sách chân sút Cúp Châu Âu chuyên nghiệp (Pro Continental Scorers)
const PRO_CONTINENTAL_SCORER_CANDIDATES = [
  { name: 'Kylian Mbappé', clubName: 'Real Madrid CF', clubCode: 'RMA', clubIcon: '👑' },
  { name: 'Erling Haaland', clubName: 'Manchester City', clubCode: 'MCI', clubIcon: '👑' },
  { name: 'Harry Kane', clubName: 'Bayern Munich', clubCode: 'BAY', clubIcon: '👑' },
  { name: 'Robert Lewandowski', clubName: 'FC Barcelona', clubCode: 'BAR', clubIcon: '🔵🔴' },
  { name: 'Vinícius Júnior', clubName: 'Real Madrid CF', clubCode: 'RMA', clubIcon: '👑' },
  { name: 'Mohamed Salah', clubName: 'Liverpool FC', clubCode: 'LIV', clubIcon: '🔴' },
  { name: 'Lautaro Martínez', clubName: 'Inter Milan', clubCode: 'INT', clubIcon: '⚫🔵' },
  { name: 'Serhou Guirassy', clubName: 'Borussia Dortmund', clubCode: 'BVB', clubIcon: '🟡⚫' },
  { name: 'Viktor Gyökeres', clubName: 'Sporting CP', clubCode: 'SCP', clubIcon: '🟢⚪' },
  { name: 'Ousmane Dembélé', clubName: 'Paris Saint-Germain', clubCode: 'PSG', clubIcon: '👑' }
];

/**
 * Chuẩn hóa định danh loại Cúp: 'domestic' hoặc 'continental'
 */
export function normalizeCupType(cupType) {
  if (!cupType) return 'domestic';
  const str = String(cupType).toLowerCase();
  if (str.includes('cont') || str.includes('ucl') || str.includes('youth') || str.includes('c1') || str.includes('châu âu')) {
    return 'continental';
  }
  return 'domestic';
}

/**
 * Đảm bảo cấu trúc player.cupTrackers tồn tại và tương thích ngược
 */
export function ensureCupTrackersStructure(player) {
  if (!player) return null;
  if (!player.cupTrackers) {
    player.cupTrackers = {
      domestic: { scorers: [], assists: [] },
      continental: { scorers: [], assists: [] }
    };
  }
  if (!player.cupTrackers.domestic) {
    player.cupTrackers.domestic = { scorers: [], assists: [] };
  }
  if (!Array.isArray(player.cupTrackers.domestic.scorers)) {
    player.cupTrackers.domestic.scorers = [];
  }
  if (!Array.isArray(player.cupTrackers.domestic.assists)) {
    player.cupTrackers.domestic.assists = [];
  }
  if (!player.cupTrackers.continental) {
    player.cupTrackers.continental = { scorers: [], assists: [] };
  }
  if (!Array.isArray(player.cupTrackers.continental.scorers)) {
    player.cupTrackers.continental.scorers = [];
  }
  if (!Array.isArray(player.cupTrackers.continental.assists)) {
    player.cupTrackers.continental.assists = [];
  }

  // Khởi tạo alias properties tương thích getter/setter (domesticCup & continentalCup)
  if (!('domesticCup' in player.cupTrackers)) {
    Object.defineProperty(player.cupTrackers, 'domesticCup', {
      get() { return this.domestic; },
      set(val) { this.domestic = val; },
      enumerable: false,
      configurable: true
    });
  }
  if (!('continentalCup' in player.cupTrackers)) {
    Object.defineProperty(player.cupTrackers, 'continentalCup', {
      get() { return this.continental; },
      set(val) { this.continental = val; },
      enumerable: false,
      configurable: true
    });
  }

  // Đảm bảo cấu trúc player.cupStats độc lập
  if (!player.cupStats) {
    player.cupStats = {
      domesticCup: { goals: 0, assists: 0, matches: 0 },
      continentalCup: { goals: 0, assists: 0, matches: 0 },
      summerTournament: { goals: 0, assists: 0, matches: 0 }
    };
  }
  if (!player.cupStats.domesticCup) {
    player.cupStats.domesticCup = { goals: 0, assists: 0, matches: 0 };
  }
  if (!player.cupStats.continentalCup) {
    player.cupStats.continentalCup = { goals: 0, assists: 0, matches: 0 };
  }
  if (!player.cupStats.summerTournament) {
    player.cupStats.summerTournament = { goals: 0, assists: 0, matches: 0 };
  }

  return player.cupTrackers;
}

/**
 * Khởi tạo danh sách ứng viên mặc định cho Vua Phá Lưới & Vua Kiến Tạo của Cúp
 * @param {object} player 
 * @param {string} cupType 'domestic' | 'continental' | 'all'
 */
export function initCupIndividualTrackers(player, cupType = 'all') {
  if (!player) return null;
  ensureCupTrackersStructure(player);

  const typesToInit = (!cupType || cupType === 'all') 
    ? ['domestic', 'continental'] 
    : [normalizeCupType(cupType)];

  const isYouth = Boolean(
    player.isAcademyStage || 
    (player.age && player.age <= 16) || 
    !player.isPro || 
    player.tier === 3 || 
    player.leagueId === 'academy'
  );

  const activeClub = getPlayerActiveClub(player) || player.academy || player.currentClub || player.club || { name: "CLB Của Bạn", code: "CLB", icon: "⭐" };
  const playerName = `${player.name || "Cầu thủ"} (BẠN)`;
  const playerClubName = activeClub.name || activeClub.clubName || "CLB Của Bạn";
  const playerClubIcon = activeClub.icon || (isYouth ? "🔴" : "⭐");
  const playerClubCode = activeClub.code || (playerClubName ? playerClubName.substring(0, 3).toUpperCase() : "CLB");
  const pCleanName = (player.name || "").toLowerCase().trim();

  typesToInit.forEach(type => {
    let aiScorerPool = [];
    let aiAssistPool = [];

    if (type === 'continental') {
      if (isYouth) {
        const youthRivals = (typeof YOUTH_RIVAL_SCORERS !== 'undefined' && Array.isArray(YOUTH_RIVAL_SCORERS) && YOUTH_RIVAL_SCORERS.length > 0)
          ? YOUTH_RIVAL_SCORERS
          : (REAL_RIVAL_SCORERS?.YOUTH_LEAGUE || []);
        aiScorerPool = youthRivals.map(r => ({
          name: r.name,
          club: r.clubName || "Học Viện",
          clubName: r.clubName || "Học Viện",
          clubIcon: r.clubIcon || "⭐",
          clubCode: r.clubCode || ""
        }));
        aiAssistPool = YOUTH_CUP_ASSIST_CANDIDATES.map(r => ({ ...r }));
      } else {
        aiScorerPool = PRO_CONTINENTAL_SCORER_CANDIDATES.map(r => ({ ...r }));
        aiAssistPool = PRO_CONTINENTAL_ASSIST_CANDIDATES.map(r => ({ ...r }));
      }
    } else {
      // Domestic Cup
      if (isYouth) {
        const youthRivals = (typeof YOUTH_RIVAL_SCORERS !== 'undefined' && Array.isArray(YOUTH_RIVAL_SCORERS) && YOUTH_RIVAL_SCORERS.length > 0)
          ? YOUTH_RIVAL_SCORERS
          : (REAL_RIVAL_SCORERS?.YOUTH_LEAGUE || []);
        aiScorerPool = youthRivals.map(r => ({
          name: r.name,
          club: r.clubName || "Học Viện",
          clubName: r.clubName || "Học Viện",
          clubIcon: r.clubIcon || "⭐",
          clubCode: r.clubCode || ""
        }));
        aiAssistPool = YOUTH_CUP_ASSIST_CANDIDATES.map(r => ({ ...r }));
      } else {
        const lKey = player.currentLeagueId || player.currentClub?.league?.id || "PREMIER_LEAGUE";
        const leagueScorers = REAL_RIVAL_SCORERS?.[lKey] || REAL_RIVAL_SCORERS?.PREMIER_LEAGUE || PRO_CONTINENTAL_SCORER_CANDIDATES;
        aiScorerPool = leagueScorers.map(r => ({
          name: r.name,
          club: r.clubName || "CLB",
          clubName: r.clubName || "CLB",
          clubIcon: r.clubIcon || "⚽",
          clubCode: r.clubCode || ""
        }));
        aiAssistPool = PRO_CONTINENTAL_ASSIST_CANDIDATES.map(r => ({ ...r }));
      }
    }

    // Lọc bỏ nếu trùng tên với người chơi
    if (pCleanName) {
      aiScorerPool = aiScorerPool.filter(c => !c.name.toLowerCase().includes(pCleanName));
      aiAssistPool = aiAssistPool.filter(c => !c.name.toLowerCase().includes(pCleanName));
    }

    // 1. Tạo danh sách Top Scorers: Người chơi bắt đầu count = 0
    const scorers = [
      {
        id: 'player',
        name: playerName,
        club: playerClubName,
        clubName: playerClubName,
        clubIcon: playerClubIcon,
        clubCode: playerClubCode,
        count: 0,
        goals: 0,
        isPlayer: true
      },
      ...aiScorerPool.map(c => ({
        id: c.id || c.name,
        name: c.name,
        club: c.club || c.clubName || "CLB",
        clubName: c.clubName || c.club || "CLB",
        clubIcon: c.clubIcon || "⚽",
        clubCode: c.clubCode || "",
        count: 0,
        goals: 0,
        isPlayer: false
      }))
    ];

    // 2. Tạo danh sách Top Assists: Người chơi bắt đầu count = 0
    const assists = [
      {
        id: 'player',
        name: playerName,
        club: playerClubName,
        clubName: playerClubName,
        clubIcon: playerClubIcon,
        clubCode: playerClubCode,
        count: 0,
        assists: 0,
        isPlayer: true
      },
      ...aiAssistPool.map(c => ({
        id: c.id || c.name,
        name: c.name,
        club: c.club || c.clubName || "CLB",
        clubName: c.clubName || c.club || "CLB",
        clubIcon: c.clubIcon || "⚽",
        clubCode: c.clubCode || "",
        count: 0,
        assists: 0,
        isPlayer: false
      }))
    ];

    // Sắp xếp theo thứ tự giảm dần của count
    scorers.sort((a, b) => {
      if ((b.count || 0) !== (a.count || 0)) return (b.count || 0) - (a.count || 0);
      if (a.isPlayer) return -1;
      if (b.isPlayer) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
    scorers.forEach((s, idx) => { s.rank = idx + 1; });

    assists.sort((a, b) => {
      if ((b.count || 0) !== (a.count || 0)) return (b.count || 0) - (a.count || 0);
      if (a.isPlayer) return -1;
      if (b.isPlayer) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
    assists.forEach((a, idx) => { a.rank = idx + 1; });

    player.cupTrackers[type] = { scorers, assists };
  });

  return (!cupType || cupType === 'all') ? player.cupTrackers : player.cupTrackers[normalizeCupType(cupType)];
}

/**
 * Ghi nhận đóng góp bàn thắng và kiến tạo trong trận đấu Cúp
 * @param {object} player 
 * @param {string} cupType 'domestic' | 'continental'
 * @param {object} matchDetails 
 * @param {object} playerPerformance { goals, assists }
 */
export function recordCupMatchContributions(player, cupType, matchDetails = {}, playerPerformance = {}) {
  if (!player) return null;
  ensureCupTrackersStructure(player);
  const normType = normalizeCupType(cupType);

  if (!player.cupTrackers[normType] || 
      !Array.isArray(player.cupTrackers[normType].scorers) || 
      player.cupTrackers[normType].scorers.length === 0) {
    initCupIndividualTrackers(player, normType);
  }

  const tracker = player.cupTrackers[normType];
  const pGoals = Number(playerPerformance?.goals ?? playerPerformance?.playerGoals ?? 0);
  const pAssists = Number(playerPerformance?.assists ?? playerPerformance?.playerAssists ?? 0);

  // 1. CẬP NHẬT BÀN THẮNG & KIẾN TẠO CỦA NGƯỜI CHƠI
  let playerScorer = tracker.scorers.find(s => s.isPlayer);
  if (!playerScorer) {
    const activeClub = getPlayerActiveClub(player) || player.academy || player.currentClub || player.club || { name: "CLB Của Bạn" };
    playerScorer = {
      id: 'player',
      name: `${player.name || "Cầu thủ"} (BẠN)`,
      club: activeClub.name || activeClub.clubName || "CLB Của Bạn",
      clubName: activeClub.name || activeClub.clubName || "CLB Của Bạn",
      clubIcon: activeClub.icon || "⭐",
      clubCode: activeClub.code || "YOU",
      count: 0,
      goals: 0,
      isPlayer: true
    };
    tracker.scorers.push(playerScorer);
  }
  if (pGoals > 0) {
    playerScorer.count = (playerScorer.count || 0) + pGoals;
    playerScorer.goals = playerScorer.count;
  }

  let playerAssist = tracker.assists.find(a => a.isPlayer);
  if (!playerAssist) {
    const activeClub = getPlayerActiveClub(player) || player.academy || player.currentClub || player.club || { name: "CLB Của Bạn" };
    playerAssist = {
      id: 'player',
      name: `${player.name || "Cầu thủ"} (BẠN)`,
      club: activeClub.name || activeClub.clubName || "CLB Của Bạn",
      clubName: activeClub.name || activeClub.clubName || "CLB Của Bạn",
      clubIcon: activeClub.icon || "⭐",
      clubCode: activeClub.code || "YOU",
      count: 0,
      assists: 0,
      isPlayer: true
    };
    tracker.assists.push(playerAssist);
  }
  if (pAssists > 0) {
    playerAssist.count = (playerAssist.count || 0) + pAssists;
    playerAssist.assists = playerAssist.count;
  }

  // Cập nhật đối tượng thống kê độc lập player.cupStats & bracket.playerStats
  const normKey = normType === 'continental' ? 'continentalCup' : 'domesticCup';
  if (!player.cupStats) player.cupStats = {};
  if (!player.cupStats[normKey]) player.cupStats[normKey] = { goals: 0, assists: 0, matches: 0 };
  player.cupStats[normKey].goals = (player.cupStats[normKey].goals || 0) + pGoals;
  player.cupStats[normKey].assists = (player.cupStats[normKey].assists || 0) + pAssists;
  player.cupStats[normKey].matches = (player.cupStats[normKey].matches || 0) + 1;

  if (player.tournamentBrackets && player.tournamentBrackets[normKey]) {
    player.tournamentBrackets[normKey].playerStats = { ...player.cupStats[normKey] };
  }

  // 2. CẬP NHẬT NGẪU NHIÊN HỢP LÝ CHO CÁC CẦU THỦ AI
  // Thu thập các CLB ghi bàn trong vòng đấu cúp này
  const scoringClubsMap = new Map();
  const registerScoringClub = (club, goals) => {
    if (!club || !goals || goals <= 0) return;
    const key = (club.name || club.clubName || club.id || club.clubId || club).toString().toLowerCase();
    scoringClubsMap.set(key, (scoringClubsMap.get(key) || 0) + goals);
  };

  if (Array.isArray(matchDetails.roundScorerEvents)) {
    matchDetails.roundScorerEvents.forEach(ev => registerScoringClub(ev.club, ev.goals));
  }

  const aiList = matchDetails.aiMatches || matchDetails.roundData?.aiMatches || [];
  if (Array.isArray(aiList)) {
    aiList.forEach(m => {
      const hTeam = m.homeClub || m.homeTeam;
      const aTeam = m.awayClub || m.awayTeam;
      if (m.homeScore > 0 && hTeam) registerScoringClub(hTeam, m.homeScore);
      if (m.awayScore > 0 && aTeam) registerScoringClub(aTeam, m.awayScore);
    });
  }

  const pMatch = matchDetails.pMatch;
  if (pMatch) {
    const oppTeam = pMatch.opponent || (pMatch.isPlayerHome ? (pMatch.awayClub || pMatch.awayTeam) : (pMatch.homeClub || pMatch.homeTeam));
    const oppGoals = pMatch.isPlayerHome ? Number(matchDetails.awayScore || 0) : Number(matchDetails.homeScore || 0);
    if (oppGoals > 0 && oppTeam) {
      registerScoringClub(oppTeam, oppGoals);
    }
  }

  const getGoalsForClub = (candidate) => {
    const cName = (candidate.club || candidate.clubName || candidate.clubId || "").toLowerCase();
    if (!cName) return 0;
    for (const [key, goals] of scoringClubsMap.entries()) {
      if (cName.includes(key) || key.includes(cName)) {
        return goals;
      }
    }
    return 0;
  };

  // Cập nhật AI Scorers
  tracker.scorers.forEach(s => {
    if (s.isPlayer) return;
    const clubGoals = getGoalsForClub(s);
    let added = 0;
    if (clubGoals > 0) {
      // CLB của cầu thủ này có thi đấu và ghi bàn trong vòng đấu
      const roll = Math.random();
      if (roll < 0.52) added = 1;
      else if (clubGoals >= 3 && roll < 0.68) added = 2;
      added = Math.min(added, clubGoals);
    } else {
      // Mô phỏng xác suất vòng đấu cúp chuẩn (~28% ghi 1 bàn, ~3% ghi 2 bàn)
      const roll = Math.random();
      if (roll < 0.035) added = 2;
      else if (roll < 0.28) added = 1;
    }
    if (added > 0) {
      s.count = (s.count || 0) + added;
      s.goals = s.count;
    }
  });

  // Cập nhật AI Assists
  tracker.assists.forEach(a => {
    if (a.isPlayer) return;
    const clubGoals = getGoalsForClub(a);
    let added = 0;
    if (clubGoals > 0) {
      const roll = Math.random();
      if (roll < 0.42) added = 1;
      else if (clubGoals >= 3 && roll < 0.56) added = 2;
      added = Math.min(added, clubGoals);
    } else {
      // Mô phỏng xác suất kiến tạo vòng cúp (~22% có 1 kiến tạo, ~2.5% có 2 kiến tạo)
      const roll = Math.random();
      if (roll < 0.025) added = 2;
      else if (roll < 0.22) added = 1;
    }
    if (added > 0) {
      a.count = (a.count || 0) + added;
      a.assists = a.count;
    }
  });

  // 3. SẮP XẾP LẠI DANH SÁCH THEO THỨ TỰ GIẢM DẦN CỦA COUNT
  tracker.scorers.sort((a, b) => {
    if ((b.count || 0) !== (a.count || 0)) return (b.count || 0) - (a.count || 0);
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });
  tracker.scorers.forEach((s, idx) => { s.rank = idx + 1; });

  tracker.assists.sort((a, b) => {
    if ((b.count || 0) !== (a.count || 0)) return (b.count || 0) - (a.count || 0);
    if (a.isPlayer) return -1;
    if (b.isPlayer) return 1;
    return (a.name || "").localeCompare(b.name || "");
  });
  tracker.assists.forEach((a, idx) => { a.rank = idx + 1; });

  return tracker;
}

/**
 * Lấy tên chuẩn hóa của giải đấu Cúp, danh hiệu Vua Phá Lưới và Vua Kiến Tạo
 * @param {object} player 
 * @param {string} cupType 'domestic' | 'continental' | 'summer'
 */
export function getCupTournamentNames(player, cupType = 'domestic') {
  const normType = normalizeCupType(cupType);
  const isYouth = Boolean(
    player?.isAcademyStage || 
    (player?.age && player.age <= 16) || 
    !player?.isPro || 
    player?.tier === 3 || 
    player?.leagueId === 'academy'
  );

  if (normType === 'continental') {
    if (isYouth) {
      return {
        cupName: "UEFA Youth League",
        topScorerTitle: "Vua Phá Lưới UEFA Youth League",
        topPlaymakerTitle: "Vua Kiến Tạo UEFA Youth League",
        fameScorer: 600,
        famePlaymaker: 450,
        moraleBonus: 8,
        minGoals: 4,
        minAssists: 3,
        baselineAiGoals: 7,
        baselineAiAssists: 5
      };
    }
    const euroStatus = player?.currentEuroStatus || "C1";
    if (euroStatus === "C2") {
      const cName = player?.currentClub?.league?.continentalC2 || "UEFA Europa League";
      return {
        cupName: cName,
        topScorerTitle: "Vua Phá Lưới UEFA Europa League",
        topPlaymakerTitle: "Vua Kiến Tạo UEFA Europa League",
        fameScorer: 650,
        famePlaymaker: 500,
        moraleBonus: 8,
        minGoals: 5,
        minAssists: 3,
        baselineAiGoals: 9,
        baselineAiAssists: 6
      };
    } else if (euroStatus === "C3") {
      const cName = player?.currentClub?.league?.continentalC3 || "UEFA Conference League";
      return {
        cupName: cName,
        topScorerTitle: "Vua Phá Lưới UEFA Conference League",
        topPlaymakerTitle: "Vua Kiến Tạo UEFA Conference League",
        fameScorer: 500,
        famePlaymaker: 400,
        moraleBonus: 7,
        minGoals: 5,
        minAssists: 3,
        baselineAiGoals: 8,
        baselineAiAssists: 5
      };
    } else {
      const cName = player?.currentClub?.league?.continentalC1 || "UEFA Champions League";
      return {
        cupName: cName,
        topScorerTitle: "Vua Phá Lưới UEFA Champions League",
        topPlaymakerTitle: "Vua Kiến Tạo UEFA Champions League",
        fameScorer: 800,
        famePlaymaker: 600,
        moraleBonus: 10,
        minGoals: 6,
        minAssists: 4,
        baselineAiGoals: 11,
        baselineAiAssists: 7
      };
    }
  }

  // Domestic Cup
  if (isYouth) {
    return {
      cupName: "Cúp Trẻ Quốc Gia U19",
      topScorerTitle: "Vua Phá Lưới Cúp Trẻ Quốc Gia U19",
      topPlaymakerTitle: "Vua Kiến Tạo Cúp Trẻ Quốc Gia U19",
      fameScorer: 400,
      famePlaymaker: 300,
      moraleBonus: 6,
      minGoals: 3,
      minAssists: 2,
      baselineAiGoals: 5,
      baselineAiAssists: 3
    };
  }

  const curLeague = player?.currentClub?.league;
  const domesticCupName = curLeague?.domesticCup || "Cúp Quốc Gia";
  return {
    cupName: domesticCupName,
    topScorerTitle: `Vua Phá Lưới ${domesticCupName}`,
    topPlaymakerTitle: `Vua Kiến Tạo ${domesticCupName}`,
    fameScorer: 500,
    famePlaymaker: 350,
    moraleBonus: 8,
    minGoals: 4,
    minAssists: 2,
    baselineAiGoals: 6,
    baselineAiAssists: 4
  };
}

/**
 * Chấm và trao giải Vua Phá Lưới & Vua Kiến Tạo cho các giải Cúp
 * @param {object} player 
 * @param {string} cupType 'domestic' | 'continental' | 'all'
 * @param {object} options { bracket, seasonTrophiesWonList, forceEvaluate }
 * @returns {object} { domesticWon: { topScorer: boolean, topPlaymaker: boolean }, continentalWon: { topScorer: boolean, topPlaymaker: boolean } }
 */
export function evaluateAndAwardCupAwards(player, cupType = 'all', options = {}) {
  const p = player || (typeof getPlayer === 'function' ? getPlayer() : null) || (typeof window !== 'undefined' && window.gameState?.player);
  if (!p) return null;

  ensureCupTrackersStructure(p);

  const typesToEval = (!cupType || cupType === 'all')
    ? ['domestic', 'continental']
    : [normalizeCupType(cupType)];

  if (!p.individualAwards) p.individualAwards = [];
  if (!p.records) p.records = [];
  if (!p.seasonTrophiesWonThisYear) p.seasonTrophiesWonThisYear = [];
  if (!p.logs) p.logs = [];

  const results = {};
  const seasonWonList = options.seasonTrophiesWonList || null;

  typesToEval.forEach(type => {
    const config = getCupTournamentNames(p, type);
    const normKey = type === 'continental' ? 'continentalCup' : 'domesticCup';
    const tracker = p.cupTrackers?.[type];

    // Lấy số liệu bàn thắng & kiến tạo của người chơi trong giải cúp này
    const playerScorer = tracker?.scorers?.find(s => s.isPlayer);
    const playerAssist = tracker?.assists?.find(a => a.isPlayer);

    const playerGoals = playerScorer ? (playerScorer.goals || playerScorer.count || 0) : (p.cupStats?.[normKey]?.goals || 0);
    const playerAssists = playerAssist ? (playerAssist.assists || playerAssist.count || 0) : (p.cupStats?.[normKey]?.assists || 0);

    // Tìm cầu thủ AI có số liệu cao nhất
    const aiScorers = tracker?.scorers?.filter(s => !s.isPlayer) || [];
    const aiAssists = tracker?.assists?.filter(a => !a.isPlayer) || [];

    let topAiScorer = aiScorers[0] || null;
    let topAiAssist = aiAssists[0] || null;

    // Áp dụng mốc benchmark thực tế nếu các trận AI mô phỏng chưa đủ cao
    const aiTargetGoals = Math.max(topAiScorer?.count || 0, config.baselineAiGoals);
    const aiTargetAssists = Math.max(topAiAssist?.count || 0, config.baselineAiAssists);

    if (topAiScorer && (topAiScorer.count || 0) < aiTargetGoals) {
      topAiScorer.count = aiTargetGoals;
      topAiScorer.goals = aiTargetGoals;
    }
    if (topAiAssist && (topAiAssist.count || 0) < aiTargetAssists) {
      topAiAssist.count = aiTargetAssists;
      topAiAssist.assists = aiTargetAssists;
    }

    // Xác định người chiến thắng
    const wonScorer = playerGoals >= config.minGoals && playerGoals >= aiTargetGoals;
    const wonAssist = playerAssists >= config.minAssists && playerAssists >= aiTargetAssists;

    // 1. TRAO VUA PHÁ LƯỚI
    if (wonScorer && !p.seasonTrophiesWonThisYear.includes(config.topScorerTitle)) {
      p.seasonTrophiesWonThisYear.push(config.topScorerTitle);
      addTrophy(p, config.topScorerTitle);
      p.trophiesCount = (p.trophiesCount || 0) + 1;
      p.fame = (p.fame || 0) + config.fameScorer;
      p.morale = Math.min(100, (p.morale || 70) + config.moraleBonus);

      if (seasonWonList && !seasonWonList.includes(config.topScorerTitle)) {
        seasonWonList.push(config.topScorerTitle);
      }

      p.individualAwards.push({
        id: `${type}_top_scorer_${p.year || 2026}`,
        name: config.topScorerTitle,
        year: p.year || 2026,
        age: p.age || 16,
        stat: `${playerGoals} bàn thắng`,
        icon: "👟"
      });

      p.records.push({
        id: `${type}_top_scorer_${p.year || 2026}`,
        title: config.topScorerTitle,
        holder: p.name || "Cầu thủ",
        value: `${playerGoals} bàn thắng`,
        year: p.year || 2026
      });

      p.logs.unshift({
        year: p.year || 2026,
        age: p.age || 16,
        title: `🥇 ${config.topScorerTitle.toUpperCase()}!`,
        text: `Xuất sắc dẫn đầu danh sách ghi bàn tại ${config.cupName} với ${playerGoals} bàn thắng! Vinh dự nhận danh hiệu Vua Phá Lưới giải đấu! (+${config.fameScorer} Fame)`,
        type: "trophy-win",
        timestamp: Date.now()
      });

      recordChronicleMilestone(p, 'GOLDEN_SHOE', {
        title: config.topScorerTitle,
        desc: `Giành danh hiệu Vua Phá Lưới ${config.cupName} với ${playerGoals} bàn thắng!`,
        badge: "👟 VUA PHÁ LƯỚI CÚP",
        badgeColor: "gold",
        category: "individual",
        icon: "👟"
      });
    }

    // 2. TRAO VUA KIẾN TẠO
    if (wonAssist && !p.seasonTrophiesWonThisYear.includes(config.topPlaymakerTitle)) {
      p.seasonTrophiesWonThisYear.push(config.topPlaymakerTitle);
      addTrophy(p, config.topPlaymakerTitle);
      p.trophiesCount = (p.trophiesCount || 0) + 1;
      p.fame = (p.fame || 0) + config.famePlaymaker;
      p.morale = Math.min(100, (p.morale || 70) + Math.round(config.moraleBonus * 0.8));

      if (seasonWonList && !seasonWonList.includes(config.topPlaymakerTitle)) {
        seasonWonList.push(config.topPlaymakerTitle);
      }

      p.individualAwards.push({
        id: `${type}_top_playmaker_${p.year || 2026}`,
        name: config.topPlaymakerTitle,
        year: p.year || 2026,
        age: p.age || 16,
        stat: `${playerAssists} kiến tạo`,
        icon: "🎯"
      });

      p.records.push({
        id: `${type}_top_playmaker_${p.year || 2026}`,
        title: config.topPlaymakerTitle,
        holder: p.name || "Cầu thủ",
        value: `${playerAssists} kiến tạo`,
        year: p.year || 2026
      });

      p.logs.unshift({
        year: p.year || 2026,
        age: p.age || 16,
        title: `🎯 ${config.topPlaymakerTitle.toUpperCase()}!`,
        text: `Nhạc trưởng xuất sắc nhất ${config.cupName} với ${playerAssists} đường dọn cỗ thành bàn! Vinh dự nhận danh hiệu Vua Kiến Tạo giải đấu! (+${config.famePlaymaker} Fame)`,
        type: "trophy-win",
        timestamp: Date.now()
      });

      recordChronicleMilestone(p, 'PLAYMAKER_AWARD', {
        title: config.topPlaymakerTitle,
        desc: `Giành danh hiệu Vua Kiến Tạo ${config.cupName} với ${playerAssists} đường kiến tạo thành bàn!`,
        badge: "🎯 VUA KIẾN TẠO CÚP",
        badgeColor: "gold",
        category: "individual",
        icon: "🎯"
      });
    }

    // 3. LƯU METADATA GIẢI THƯỞNG VÀO BRACKET
    const targetBracket = options.bracket || (p.tournamentBrackets ? p.tournamentBrackets[normKey] : null);
    const activeClub = getPlayerActiveClub(p) || { name: "CLB Của Bạn" };
    const pClubName = activeClub.name || activeClub.clubName || "CLB Của Bạn";

    const scorerWinnerInfo = wonScorer ? {
      name: `${p.name || "Cầu thủ"} (BẠN)`,
      club: pClubName,
      goals: playerGoals,
      isPlayer: true
    } : {
      name: topAiScorer ? topAiScorer.name : "Đối Thủ AI",
      club: topAiScorer ? (topAiScorer.club || topAiScorer.clubName || "CLB") : "CLB",
      goals: aiTargetGoals,
      isPlayer: false
    };

    const playmakerWinnerInfo = wonAssist ? {
      name: `${p.name || "Cầu thủ"} (BẠN)`,
      club: pClubName,
      assists: playerAssists,
      isPlayer: true
    } : {
      name: topAiAssist ? topAiAssist.name : "Đối Thủ AI",
      club: topAiAssist ? (topAiAssist.club || topAiAssist.clubName || "CLB") : "CLB",
      assists: aiTargetAssists,
      isPlayer: false
    };

    if (targetBracket) {
      targetBracket.awards = {
        topScorer: scorerWinnerInfo,
        topPlaymaker: playmakerWinnerInfo
      };
    }

    results[type] = {
      wonScorer,
      wonPlaymaker: wonAssist,
      topScorerTitle: config.topScorerTitle,
      topPlaymakerTitle: config.topPlaymakerTitle,
      playerGoals,
      playerAssists,
      aiTargetGoals,
      aiTargetAssists,
      scorerWinnerInfo,
      playmakerWinnerInfo
    };
  });

  return results;
}


