/* =========================================================================
   FOOTBALL CAREER SIMULATOR — CUP TOURNAMENT UI & BRACKET VIEWER (ES6 Module)
   ========================================================================= */

import {
  ALL_CLUBS,
  YOUTH_LEAGUE_CLUBS,
  UEFA_YOUTH_LEAGUE_CLUBS
} from './data.js';

import {
  isSameClub,
  isClubMatch,
  simulateAIFixture,
  getPlayerActiveClub
} from './cupEngine.js';

import { getCurrentSaveSlot } from './storage.js';

/**
 * So khớp chính xác CLB với CLB người chơi (chống dính dữ liệu giữa các slot)
 */
export function isPlayerClubCheck(c, activeClub) {
  if (!c || !activeClub) return false;

  const name = String(c.name || c.clubName || '').trim();
  const id = String(c.id || c.clubId || '').trim();
  const code = String(c.code || c.clubCode || '').trim();

  if (!id && !name) return false;

  const lowerName = name.toLowerCase();
  const lowerId = id.toLowerCase();
  const lowerCode = code.toLowerCase();

  const placeholderKeywords = [
    "nhất bảng",
    "nhat bang",
    "nhì bảng",
    "nhi bang",
    "chờ xác định",
    "cho xac dinh",
    "tbd",
    "winner",
    "?",
    "chờ đối thủ",
    "cho doi thu",
    "đang cập nhật",
    "placeholder"
  ];
  if (placeholderKeywords.some(kw => lowerName.includes(kw) || lowerId.includes(kw) || lowerCode.includes(kw))) {
    return false;
  }

  const actId = String(activeClub.id || activeClub.clubId || '').toLowerCase().trim();
  const actName = String(activeClub.name || activeClub.clubName || '').toLowerCase().trim();
  const actAlias = String(activeClub.idAlias || '').toLowerCase().trim();

  if (actId && (lowerId === actId || (c.idAlias && String(c.idAlias).toLowerCase().trim() === actId))) return true;
  if (actAlias && (lowerId === actAlias || (c.idAlias && String(c.idAlias).toLowerCase().trim() === actAlias))) return true;
  if (actName && lowerName === actName) return true;

  if (id && actId && (isClubMatch(c, activeClub) || isSameClub(c, activeClub))) {
    return true;
  }

  return false;
}

/**
 * Đảm bảo dữ liệu Cúp Quốc Gia (Domestic Cup) hỗ trợ đầy đủ từ Vòng 1/8 -> Tứ Kết -> Bán Kết -> Chung Kết
 */
export function ensureDomesticBracketData(player, isYouth, activeClub, domesticName) {
  if (!player.tournamentBrackets) {
    player.tournamentBrackets = {};
  }
  if (!player.tournamentBrackets.domesticCup) {
    player.tournamentBrackets.domesticCup = {
      name: domesticName,
      type: "DOMESTIC_CUP",
      roundOf16: [],
      quarterFinals: [],
      semiFinals: [],
      final: null,
      champion: null
    };
  }

  const b = player.tournamentBrackets.domesticCup;
  b.name = domesticName;

  const isPlayerClub = (c) => isPlayerClubCheck(c, activeClub);

  const m1 = b.roundOf16 && b.roundOf16[0];
  const isMatch1PlayerClub = m1 && (
    (m1.club1 && isPlayerClub(m1.club1)) || (m1.club2 && isPlayerClub(m1.club2))
  );

  if (!b.roundOf16 || b.roundOf16.length !== 8 || !isMatch1PlayerClub) {
    let pool = [];
    if (isYouth) {
      const youthPool = (typeof UEFA_YOUTH_LEAGUE_CLUBS !== 'undefined' && UEFA_YOUTH_LEAGUE_CLUBS.length >= 16)
        ? UEFA_YOUTH_LEAGUE_CLUBS.map(c => ({ ...c }))
        : (typeof YOUTH_LEAGUE_CLUBS !== 'undefined' ? YOUTH_LEAGUE_CLUBS.map(c => ({ ...c })) : []);
      pool = youthPool.filter(c => c.id !== activeClub?.id && !isSameClub(c, activeClub));
    } else {
      const allList = (typeof ALL_CLUBS !== 'undefined' ? ALL_CLUBS : []).map(c => ({ ...c }));
      pool = allList.filter(c => c.id !== activeClub?.id && !isSameClub(c, activeClub));
    }

    const domesticTeams = [activeClub];
    for (const c of pool) {
      if (domesticTeams.length >= 16) break;
      if (!domesticTeams.some(t => t.id === c.id || isSameClub(t, c))) {
        domesticTeams.push(c);
      }
    }
    let fillerIdx = 0;
    const fillerSource = isYouth
      ? ((typeof UEFA_YOUTH_LEAGUE_CLUBS !== 'undefined' && UEFA_YOUTH_LEAGUE_CLUBS.length >= 16) ? UEFA_YOUTH_LEAGUE_CLUBS : (typeof YOUTH_LEAGUE_CLUBS !== 'undefined' ? YOUTH_LEAGUE_CLUBS : []))
      : (typeof ALL_CLUBS !== 'undefined' ? ALL_CLUBS : []);
    while (domesticTeams.length < 16 && fillerIdx < fillerSource.length) {
      const f = fillerSource[fillerIdx++];
      if (!domesticTeams.some(t => t.id === f.id || isSameClub(t, f))) {
        domesticTeams.push(f);
      }
    }

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

    b.roundOf16 = [];
    for (let i = 0; i < 8; i++) {
      const c1 = domesticTeams[i * 2] || { name: `CLB ${i * 2 + 1}`, code: "CLB", icon: "⚽" };
      const c2 = domesticTeams[i * 2 + 1] || { name: `CLB ${i * 2 + 2}`, code: "CLB", icon: "⚽" };
      b.roundOf16.push({
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

    b.quarterFinals = [
      { id: "dom_qf1", matchId: "QF1", name: "Tứ Kết 1", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
      { id: "dom_qf2", matchId: "QF2", name: "Tứ Kết 2", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
      { id: "dom_qf3", matchId: "QF3", name: "Tứ Kết 3", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
      { id: "dom_qf4", matchId: "QF4", name: "Tứ Kết 4", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false }
    ];

    b.semiFinals = [
      { id: "dom_sf1", matchId: "SF1", name: "Bán Kết 1", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
      { id: "dom_sf2", matchId: "SF2", name: "Bán Kết 2", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false }
    ];

    b.final = { id: "dom_f", matchId: "FINAL", name: "Chung Kết Cúp Quốc Gia", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false };
    b.champion = null;
  }

  if (!b.quarterFinals || b.quarterFinals.length !== 4) {
    b.quarterFinals = [
      { id: "dom_qf1", matchId: "QF1", name: "Tứ Kết 1", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
      { id: "dom_qf2", matchId: "QF2", name: "Tứ Kết 2", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
      { id: "dom_qf3", matchId: "QF3", name: "Tứ Kết 3", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
      { id: "dom_qf4", matchId: "QF4", name: "Tứ Kết 4", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false }
    ];
  }
  if (!b.semiFinals || b.semiFinals.length !== 2) {
    b.semiFinals = [
      { id: "dom_sf1", matchId: "SF1", name: "Bán Kết 1", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false },
      { id: "dom_sf2", matchId: "SF2", name: "Bán Kết 2", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayed: false, isPlayerMatch: false }
    ];
  }
  if (!b.final) {
    b.final = { id: "dom_f", matchId: "FINAL", name: "Chung Kết Cúp Quốc Gia", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false };
  }

  if (player.currentSeasonFixtures && Array.isArray(player.currentSeasonFixtures)) {
    player.currentSeasonFixtures.forEach(f => {
      if (!f.isPlayed && !f.completed) return;
      const sName = f.stageName || f.stage || "";
      const isDomestic = f.competitionType === 'DOMESTIC_CUP' || f.isCup || sName.includes("Cúp Trẻ") || sName.includes("Cúp Quốc Gia");
      if (!isDomestic) return;

      const isPHome = Boolean(
        f.isPlayerHome ??
        f.playerMatch?.isPlayerHome ??
        (f.playerMatch?.homeClub && isPlayerClub(f.playerMatch.homeClub)) ??
        (f.homeClub && isPlayerClub(f.homeClub)) ??
        true
      );
      const hS = Number(f.homeScore ?? (f.playerMatch?.homeScore ?? 0));
      const aS = Number(f.awayScore ?? (f.playerMatch?.awayScore ?? 0));

      if (sName.includes("Vòng 1/8")) {
        const pm = b.roundOf16.find(m => m.isPlayerMatch || isPlayerClub(m.club1) || isPlayerClub(m.club2)) || b.roundOf16[0];
        if (pm) {
          const isP1 = isPlayerClub(pm.club1);
          pm.score1 = isP1 ? (isPHome ? hS : aS) : (isPHome ? aS : hS);
          pm.score2 = isP1 ? (isPHome ? aS : hS) : (isPHome ? hS : aS);
          pm.winner = pm.score1 >= pm.score2 ? pm.club1 : pm.club2;
        }
        b.roundOf16.forEach(m => {
          if (!m.winner && m.score1 === null) {
            const res = simulateAIFixture(m.club1, m.club2);
            m.score1 = res.homeScore;
            m.score2 = res.awayScore;
            if (m.score1 === m.score2) {
              if (Math.random() < 0.5) m.score1 += 1; else m.score2 += 1;
              m.isPenalties = true;
            }
            m.winner = m.score1 > m.score2 ? m.club1 : m.club2;
          }
        });
        b.quarterFinals[0].club1 = b.roundOf16[0]?.winner || b.quarterFinals[0].club1;
        b.quarterFinals[0].club2 = b.roundOf16[1]?.winner || b.quarterFinals[0].club2;
        b.quarterFinals[1].club1 = b.roundOf16[2]?.winner || b.quarterFinals[1].club1;
        b.quarterFinals[1].club2 = b.roundOf16[3]?.winner || b.quarterFinals[1].club2;
        b.quarterFinals[2].club1 = b.roundOf16[4]?.winner || b.quarterFinals[2].club1;
        b.quarterFinals[2].club2 = b.roundOf16[5]?.winner || b.quarterFinals[2].club2;
        b.quarterFinals[3].club1 = b.roundOf16[6]?.winner || b.quarterFinals[3].club1;
        b.quarterFinals[3].club2 = b.roundOf16[7]?.winner || b.quarterFinals[3].club2;
        b.quarterFinals.forEach(qf => {
          qf.isPlayerMatch = Boolean(isPlayerClub(qf.club1) || isPlayerClub(qf.club2));
        });
      } else if (sName.includes("Tứ Kết")) {
        const pm = b.quarterFinals.find(m => m.isPlayerMatch || isPlayerClub(m.club1) || isPlayerClub(m.club2));
        if (pm) {
          const isP1 = isPlayerClub(pm.club1);
          pm.score1 = isP1 ? (isPHome ? hS : aS) : (isPHome ? aS : hS);
          pm.score2 = isP1 ? (isPHome ? aS : hS) : (isPHome ? hS : aS);
          pm.winner = pm.score1 >= pm.score2 ? pm.club1 : pm.club2;
        }
        b.quarterFinals.forEach(m => {
          if (!m.winner && m.score1 === null && m.club1 && m.club2) {
            const res = simulateAIFixture(m.club1, m.club2);
            m.score1 = res.homeScore;
            m.score2 = res.awayScore;
            if (m.score1 === m.score2) {
              if (Math.random() < 0.5) m.score1 += 1; else m.score2 += 1;
              m.isPenalties = true;
            }
            m.winner = m.score1 > m.score2 ? m.club1 : m.club2;
          }
        });
        b.semiFinals[0].club1 = b.quarterFinals[0]?.winner || b.semiFinals[0].club1;
        b.semiFinals[0].club2 = b.quarterFinals[1]?.winner || b.semiFinals[0].club2;
        b.semiFinals[1].club1 = b.quarterFinals[2]?.winner || b.semiFinals[1].club1;
        b.semiFinals[1].club2 = b.quarterFinals[3]?.winner || b.semiFinals[1].club2;
        b.semiFinals.forEach(sf => {
          sf.isPlayerMatch = Boolean(isPlayerClub(sf.club1) || isPlayerClub(sf.club2));
        });
      } else if (sName.includes("Bán Kết")) {
        const pm = b.semiFinals.find(m => m.isPlayerMatch || isPlayerClub(m.club1) || isPlayerClub(m.club2));
        if (pm) {
          const isP1 = isPlayerClub(pm.club1);
          pm.score1 = isP1 ? (isPHome ? hS : aS) : (isPHome ? aS : hS);
          pm.score2 = isP1 ? (isPHome ? aS : hS) : (isPHome ? hS : aS);
          pm.winner = pm.score1 >= pm.score2 ? pm.club1 : pm.club2;
        }
        b.semiFinals.forEach(m => {
          if (!m.winner && m.score1 === null && m.club1 && m.club2) {
            const res = simulateAIFixture(m.club1, m.club2);
            m.score1 = res.homeScore;
            m.score2 = res.awayScore;
            if (m.score1 === m.score2) {
              if (Math.random() < 0.5) m.score1 += 1; else m.score2 += 1;
              m.isPenalties = true;
            }
            m.winner = m.score1 > m.score2 ? m.club1 : m.club2;
          }
        });
        b.final.club1 = b.semiFinals[0]?.winner || b.final.club1;
        b.final.club2 = b.semiFinals[1]?.winner || b.final.club2;
        b.final.isPlayerMatch = Boolean(isPlayerClub(b.final.club1) || isPlayerClub(b.final.club2));
      } else if (sName.includes("Chung Kết")) {
        if (b.final) {
          const isP1 = isPlayerClub(b.final.club1);
          b.final.score1 = isP1 ? (isPHome ? hS : aS) : (isPHome ? aS : hS);
          b.final.score2 = isP1 ? (isPHome ? aS : hS) : (isPHome ? hS : aS);
          b.final.winner = b.final.score1 >= b.final.score2 ? b.final.club1 : b.final.club2;
          b.champion = b.final.winner;
        }
      }
    });
  }
}

/**
 * Đảm bảo dữ liệu Cúp Châu Âu / UEFA Youth League (Vòng Bảng 16 Đội + Knockout)
 */
export function ensureContinentalBracketData(player, isYouth, activeClub, continentalName) {
  if (!player.tournamentBrackets) {
    player.tournamentBrackets = {};
  }
  if (!player.tournamentBrackets.continentalCup) {
    player.tournamentBrackets.continentalCup = {
      name: continentalName,
      type: "UCL",
      groupStage: null,
      quarterFinals: [],
      semiFinals: [],
      final: null,
      champion: null
    };
  }

  const b = player.tournamentBrackets.continentalCup;
  b.name = continentalName;

  const isPlayerClub = (c) => isPlayerClubCheck(c, activeClub);

  // Khởi tạo 16 CLB chia 4 Bảng (A, B, C, D) cho cả Giải Trẻ lẫn Đội Một
  let groupsObj = isYouth ? (player.youthLeagueGroups || player.continentalCupGroups) : (player.continentalCupGroups || player.youthLeagueGroups);
  if (!groupsObj || !groupsObj.A || groupsObj.A.length < 4) {
    let pool = [];
    if (isYouth) {
      pool = (typeof UEFA_YOUTH_LEAGUE_CLUBS !== 'undefined' && UEFA_YOUTH_LEAGUE_CLUBS.length >= 16)
        ? UEFA_YOUTH_LEAGUE_CLUBS.map(c => ({ ...c }))
        : (typeof YOUTH_LEAGUE_CLUBS !== 'undefined' ? YOUTH_LEAGUE_CLUBS.map(c => ({ ...c })) : []);
    } else {
      pool = (typeof ALL_CLUBS !== 'undefined' && ALL_CLUBS.length >= 16)
        ? ALL_CLUBS.map(c => ({ ...c }))
        : [];
    }

    const filteredPool = pool.filter(c => c.id !== activeClub?.id && !isSameClub(c, activeClub)).sort(() => 0.5 - Math.random());
    const selected = [activeClub, ...filteredPool.slice(0, 15)];

    while (selected.length < 16) {
      selected.push({ id: `club_fill_${selected.length + 1}`, name: `CLB Châu Âu ${selected.length + 1}`, code: `EU${selected.length + 1}`, icon: '⚽' });
    }

    groupsObj = {
      A: selected.slice(0, 4).map(c => ({ clubId: c.id, clubName: c.name, icon: c.icon || '⚽', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, isPlayer: isPlayerClub(c) })),
      B: selected.slice(4, 8).map(c => ({ clubId: c.id, clubName: c.name, icon: c.icon || '⚽', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, isPlayer: false })),
      C: selected.slice(8, 12).map(c => ({ clubId: c.id, clubName: c.name, icon: c.icon || '⚽', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, isPlayer: false })),
      D: selected.slice(12, 16).map(c => ({ clubId: c.id, clubName: c.name, icon: c.icon || '⚽', played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, points: 0, isPlayer: false }))
    };

    if (isYouth) {
      player.youthLeagueGroups = groupsObj;
    }
    player.continentalCupGroups = groupsObj;
  }

  // Khởi tạo cấu trúc Tứ Kết / Bán Kết / Chung Kết (Placeholder: Nhất A vs Nhì B...)
  if (!b.quarterFinals || b.quarterFinals.length !== 4) {
    b.quarterFinals = [
      { id: "euro_qf1", matchId: "QF1", name: "Tứ Kết 1 (Nhất A vs Nhì B)", club1: { name: "Nhất Bảng A", code: "1A", icon: "🥇" }, club2: { name: "Nhì Bảng B", code: "2B", icon: "🥈" }, score1: null, score2: null, winner: null, isPlayerMatch: false },
      { id: "euro_qf2", matchId: "QF2", name: "Tứ Kết 2 (Nhất C vs Nhì D)", club1: { name: "Nhất Bảng C", code: "1C", icon: "🥇" }, club2: { name: "Nhì Bảng D", code: "2D", icon: "🥈" }, score1: null, score2: null, winner: null, isPlayerMatch: false },
      { id: "euro_qf3", matchId: "QF3", name: "Tứ Kết 3 (Nhất B vs Nhì A)", club1: { name: "Nhất Bảng B", code: "1B", icon: "🥇" }, club2: { name: "Nhì Bảng A", code: "2A", icon: "🥈" }, score1: null, score2: null, winner: null, isPlayerMatch: false },
      { id: "euro_qf4", matchId: "QF4", name: "Tứ Kết 4 (Nhất D vs Nhì C)", club1: { name: "Nhất Bảng D", code: "1D", icon: "🥇" }, club2: { name: "Nhì Bảng C", code: "2C", icon: "🥈" }, score1: null, score2: null, winner: null, isPlayerMatch: false }
    ];
  } else {
    b.quarterFinals.forEach(qf => {
      if (!isPlayerClub(qf.club1) && !isPlayerClub(qf.club2)) {
        qf.isPlayerMatch = false;
      }
    });
  }

  if (!b.semiFinals || b.semiFinals.length !== 2) {
    b.semiFinals = [
      { id: "euro_sf1", matchId: "SF1", name: "Bán Kết 1 (Thắng QF1 vs Thắng QF2)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false },
      { id: "euro_sf2", matchId: "SF2", name: "Bán Kết 2 (Thắng QF3 vs Thắng QF4)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false }
    ];
  }

  if (!b.final) {
    b.final = { id: "euro_f", matchId: "FINAL", name: `Chung Kết ${continentalName}`, club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false };
  }

  // Đồng bộ kết quả thực tế từ lịch thi đấu
  if (player.currentSeasonFixtures && Array.isArray(player.currentSeasonFixtures)) {
    player.currentSeasonFixtures.forEach(f => {
      if (!f.isPlayed && !f.completed) return;
      const sName = f.stageName || f.stage || "";
      const isUcl = f.competitionType === 'UCL' || f.competitionType === 'CONTINENTAL_CUP' || f.isContinental || sName.includes("Youth League") || sName.includes("Europa") || sName.includes("Champions") || sName.includes("Cúp C1") || sName.includes("Cúp C2");
      if (!isUcl) return;

      const hS = Number(f.homeScore ?? (f.playerMatch?.homeScore ?? 0));
      const aS = Number(f.awayScore ?? (f.playerMatch?.awayScore ?? 0));
      const isPHome = Boolean(
        f.isPlayerHome ??
        f.playerMatch?.isPlayerHome ??
        (f.playerMatch?.homeClub && isPlayerClub(f.playerMatch.homeClub)) ??
        (f.homeClub && isPlayerClub(f.homeClub)) ??
        true
      );

      if (sName.includes("Tứ Kết")) {
        const pm = b.quarterFinals.find(m => m.isPlayerMatch || isPlayerClub(m.club1) || isPlayerClub(m.club2)) || b.quarterFinals[0];
        if (pm) {
          const isP1 = isPlayerClub(pm.club1);
          pm.score1 = isP1 ? (isPHome ? hS : aS) : (isPHome ? aS : hS);
          pm.score2 = isP1 ? (isPHome ? aS : hS) : (isPHome ? hS : aS);
          pm.winner = pm.score1 >= pm.score2 ? pm.club1 : pm.club2;
        }
      } else if (sName.includes("Bán Kết")) {
        const pm = b.semiFinals.find(m => m.isPlayerMatch || isPlayerClub(m.club1) || isPlayerClub(m.club2)) || b.semiFinals[0];
        if (pm) {
          const isP1 = isPlayerClub(pm.club1);
          pm.score1 = isP1 ? (isPHome ? hS : aS) : (isPHome ? aS : hS);
          pm.score2 = isP1 ? (isPHome ? aS : hS) : (isPHome ? hS : aS);
          pm.winner = pm.score1 >= pm.score2 ? pm.club1 : pm.club2;
          b.final.club1 = pm.winner;
          b.final.isPlayerMatch = Boolean(isPlayerClub(pm.winner));
        }
      } else if (sName.includes("Chung Kết")) {
        if (b.final) {
          const isP1 = isPlayerClub(b.final.club1);
          b.final.score1 = isP1 ? (isPHome ? hS : aS) : (isPHome ? aS : hS);
          b.final.score2 = isP1 ? (isPHome ? aS : hS) : (isPHome ? hS : aS);
          b.final.winner = b.final.score1 >= b.final.score2 ? b.final.club1 : b.final.club2;
          b.champion = b.final.winner;
        }
      }
    });
  }
}

/**
 * Helper render 1 thẻ trận đấu bracket chuẩn kích thước (cao 70px, min-width: 190px)
 */
export function renderMatchCard(m, label, activeClub) {
  const isPlayerClub = (c) => isPlayerClubCheck(c, activeClub);

  if (!m) {
    return `
      <div class="bracket-match-card" style="opacity:0.4; min-width:190px; width:190px; height:70px; min-height:70px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:center; padding:5px 7px;">
        <div style="font-size:0.64rem; color:var(--text-muted); margin-bottom:2px; font-weight:700;">${label}</div>
        <div class="bracket-team-row" style="height:20px; padding:1px 5px; display:flex; align-items:center;"><span>Chờ đối thủ...</span></div>
        <div class="bracket-team-row" style="height:20px; padding:1px 5px; display:flex; align-items:center;"><span>Chờ đối thủ...</span></div>
      </div>
    `;
  }

  const c1 = m.club1 || { name: "Chờ xác định", icon: "❓" };
  const c2 = m.club2 || { name: "Chờ xác định", icon: "❓" };
  const isP1 = isPlayerClub(c1);
  const isP2 = isPlayerClub(c2);
  const isPlayerM = Boolean(isP1 || isP2);

  let s1 = '-';
  let s2 = '-';
  const hasBeenPlayed = Boolean(m.isPlayed || m.completed || (m.winner && m.score1 !== null && m.score2 !== null));
  if (hasBeenPlayed) {
    s1 = (m.score1 !== null && m.score1 !== undefined) ? m.score1 : (m.homeScore !== undefined ? m.homeScore : '-');
    s2 = (m.score2 !== null && m.score2 !== undefined) ? m.score2 : (m.awayScore !== undefined ? m.awayScore : '-');
    if (m.score1 === undefined && m.score2 === undefined && m.homeScore !== undefined && m.awayScore !== undefined) {
      if (m.homeClub && (m.homeClub.id === c2.id || m.homeClub.name === c2.name)) {
        s1 = m.awayScore;
        s2 = m.homeScore;
      }
    }
  }

  let isP1Won = Boolean(hasBeenPlayed && m.winner && (m.winner.id === c1.id || m.winner.name === c1.name));
  let isP2Won = Boolean(hasBeenPlayed && m.winner && (m.winner.id === c2.id || m.winner.name === c2.name));
  if (hasBeenPlayed && s1 !== '-' && s2 !== '-') {
    if (Number(s1) > Number(s2)) { isP1Won = true; isP2Won = false; }
    else if (Number(s2) > Number(s1)) { isP2Won = true; isP1Won = false; }
  }

  return `
    <div class="bracket-match-card ${isPlayerM ? 'player-match' : ''}" style="min-width:190px; width:190px; height:70px; min-height:70px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between; padding:5px 7px;">
      <div style="font-size:0.64rem; color:var(--text-muted); font-weight:700; display:flex; justify-content:space-between; align-items:center; line-height:1;">
        <span>${label}</span>
        ${m.isPenalties ? '<span style="color:var(--accent-gold); font-size:0.6rem;">(Pen)</span>' : ''}
      </div>
      <div class="bracket-team-row ${isP1Won ? 'winner' : ''}" style="display:flex; justify-content:space-between; align-items:center; height:22px; padding:1px 5px; box-sizing:border-box; border-radius:4px; font-size:0.75rem;">
        <span class="bracket-team-name" title="${c1.name || ''}" style="max-width:142px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; gap:4px;">
          <span style="font-size:0.8rem;">${c1.icon || '⚽'}</span>
          <strong style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:0.73rem;">${c1.name || c1.code || 'CLB 1'}</strong>
          ${isP1 ? '<span style="font-size:0.68rem; color:var(--accent-gold); margin-left:2px; flex-shrink:0;" title="Đội của bạn">⭐</span>' : ''}
        </span>
        <span class="bracket-team-score" style="font-size:0.85rem; font-weight:800; min-width:16px; text-align:right;">${s1}</span>
      </div>
      <div class="bracket-team-row ${isP2Won ? 'winner' : ''}" style="display:flex; justify-content:space-between; align-items:center; height:22px; padding:1px 5px; box-sizing:border-box; border-radius:4px; font-size:0.75rem;">
        <span class="bracket-team-name" title="${c2.name || ''}" style="max-width:142px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; gap:4px;">
          <span style="font-size:0.8rem;">${c2.icon || '⚽'}</span>
          <strong style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-size:0.73rem;">${c2.name || c2.code || 'CLB 2'}</strong>
          ${isP2 ? '<span style="font-size:0.68rem; color:var(--accent-gold); margin-left:2px; flex-shrink:0;" title="Đội của bạn">⭐</span>' : ''}
        </span>
        <span class="bracket-team-score" style="font-size:0.85rem; font-weight:800; min-width:16px; text-align:right;">${s2}</span>
      </div>
    </div>
  `;
}

/**
 * Hiển thị Sơ Đồ Phân Nhánh Cúp (Tournament Bracket Tree)
 */
export function renderTournamentBrackets(player, activeType = null) {
  const container = document.getElementById('tournamentBracketsContainer');
  if (!container || !player) return;

  container.innerHTML = '';

  if (activeType) {
    player.activeCupTab = activeType;
  } else if (!player.activeCupTab) {
    player.activeCupTab = 'DOMESTIC_CUP';
  }
  const currentTab = player.activeCupTab;

  const isYouth = Boolean(player.isAcademyStage);
  const activeClub = isYouth
    ? (player.academy || getPlayerActiveClub(player))
    : (player.currentClub || player.club || getPlayerActiveClub(player));

  if (!player.tournamentBrackets && player.tournamentData?.brackets) {
    player.tournamentBrackets = player.tournamentData.brackets;
  }
  if (!player.tournamentBrackets) {
    player.tournamentBrackets = {};
  }
  if (!player.tournamentData || typeof player.tournamentData !== 'object') {
    player.tournamentData = {};
  }

  const domesticName = isYouth
    ? (player.age && player.age <= 16 ? "Cúp Trẻ Quốc Gia U16" : "Cúp Trẻ Quốc Gia U19")
    : (player.tournamentBrackets.domesticCup?.name || "Cúp Quốc Gia");

  const continentalName = isYouth
    ? "UEFA Youth League (C1 Trẻ)"
    : (player.tournamentBrackets.continentalCup?.name || (player.currentEuroStatus === "C2" ? "UEFA Europa League" : "UEFA Champions League"));

  ensureDomesticBracketData(player, isYouth, activeClub, domesticName);
  ensureContinentalBracketData(player, isYouth, activeClub, continentalName);

  player.tournamentData.domesticCup = player.tournamentBrackets.domesticCup;
  player.tournamentData.continentalCup = player.tournamentBrackets.continentalCup;

  if (typeof localStorage !== 'undefined') {
    try {
      const slotId = player.slotId || (typeof window !== 'undefined' && window.currentSaveSlot) || getCurrentSaveSlot() || 1;
      localStorage.setItem(`save_slot_${slotId}_cup`, JSON.stringify(player.tournamentData));
    } catch (e) { }
  }

  const currentBracket = (currentTab === 'UCL')
    ? player.tournamentBrackets.continentalCup
    : player.tournamentBrackets.domesticCup;

  if (currentTab === 'DOMESTIC_CUP') {
    const r16 = currentBracket.roundOf16 || [];
    const qf = currentBracket.quarterFinals || [];
    const sf = currentBracket.semiFinals || [];
    const finalMatch = currentBracket.final;

    const r16Html = [
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 1; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(r16[0], 'Vòng 1/8 - Trận 1', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 2; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(r16[1], 'Vòng 1/8 - Trận 2', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 3; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(r16[2], 'Vòng 1/8 - Trận 3', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 4; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(r16[3], 'Vòng 1/8 - Trận 4', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 5; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(r16[4], 'Vòng 1/8 - Trận 5', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 6; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(r16[5], 'Vòng 1/8 - Trận 6', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 7; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(r16[6], 'Vòng 1/8 - Trận 7', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 8; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(r16[7], 'Vòng 1/8 - Trận 8', activeClub)}</div>`
    ].join('\n');

    const qfHtml = [
      `<div class="bracket-match-node" style="grid-column: 2; grid-row: 1 / span 2; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(qf[0], 'Tứ Kết 1', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 2; grid-row: 3 / span 2; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(qf[1], 'Tứ Kết 2', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 2; grid-row: 5 / span 2; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(qf[2], 'Tứ Kết 3', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 2; grid-row: 7 / span 2; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(qf[3], 'Tứ Kết 4', activeClub)}</div>`
    ].join('\n');

    const sfHtml = [
      `<div class="bracket-match-node" style="grid-column: 3; grid-row: 1 / span 4; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(sf[0], 'Bán Kết 1', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 3; grid-row: 5 / span 4; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(sf[1], 'Bán Kết 2', activeClub)}</div>`
    ].join('\n');

    const finalHtml = `
      <div class="bracket-match-node final-match" style="grid-column: 4; grid-row: 1 / span 8; width: 190px; min-width: 190px; position: relative; box-sizing: border-box;">
        ${renderMatchCard(finalMatch, 'Chung Kết', activeClub)}
        ${currentBracket.champion ? `
          <div class="bracket-champion-box" style="position: absolute; top: calc(100% + 10px); left: 0; width: 190px; min-width: 190px; box-sizing: border-box; z-index: 5;">
            <div style="font-size:0.72rem; font-weight:800; color:var(--accent-gold);">🏆 VÔ ĐỊCH ${currentBracket.name ? currentBracket.name.toUpperCase() : 'CÚP QUỐC GIA'}</div>
            <div style="font-size:0.95rem; font-weight:900; color:#fff; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${currentBracket.champion.icon ? currentBracket.champion.icon : '👑'} ${currentBracket.champion.name}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    container.innerHTML = `
      <div class="bracket-wrapper">
        <div class="bracket-type-selector" style="display:flex; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
          <button class="bracket-type-btn active" id="btnBracketDom" style="padding:6px 14px; border-radius:6px; font-weight:700; cursor:pointer; background:rgba(245,158,11,0.2); border-color:var(--accent-gold); color:var(--accent-gold);">
            🏆 ${domesticName}
          </button>
          <button class="bracket-type-btn" id="btnBracketEuro" style="padding:6px 14px; border-radius:6px; font-weight:700; cursor:pointer;">
            ⭐ ${continentalName}
          </button>
        </div>

        <div style="font-size:0.82rem; font-weight:800; color:#fff; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:6px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
          <span>🌿 Nhánh Đấu: <strong style="color:var(--accent-gold);">${currentBracket.name}</strong></span>
          <span style="font-size:0.72rem; color:var(--text-muted);">Vòng 1/8 ➔ Tứ Kết ➔ Bán Kết ➔ Chung Kết</span>
        </div>

        <div class="bracket-scroll-wrapper" style="overflow-x: auto; padding-bottom: 12px;">
          <div style="min-width: 820px; width: max-content;">
            <div class="bracket-headers-row" style="display: grid; grid-template-columns: repeat(4, 190px); gap: 20px; padding: 0 10px; margin-bottom: 8px;">
              <div class="bracket-round-header" style="text-align: center; font-weight: 800; font-size: 0.76rem; color: var(--accent-gold); padding: 5px 0; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">Vòng 1/8 (16 Đội)</div>
              <div class="bracket-round-header" style="text-align: center; font-weight: 800; font-size: 0.76rem; color: var(--accent-gold); padding: 5px 0; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">Tứ Kết (8 Đội)</div>
              <div class="bracket-round-header" style="text-align: center; font-weight: 800; font-size: 0.76rem; color: var(--accent-gold); padding: 5px 0; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">Bán Kết (4 Đội)</div>
              <div class="bracket-round-header" style="text-align: center; font-weight: 800; font-size: 0.76rem; color: var(--accent-gold); padding: 5px 0; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">Chung Kết</div>
            </div>

            <div class="bracket-grid-container" style="display: grid; grid-template-columns: repeat(4, 190px); grid-template-rows: repeat(8, minmax(68px, auto)); gap: 14px 20px; align-items: center; overflow-x: auto; padding: 12px 10px 20px 10px;">
              ${r16Html}
              ${qfHtml}
              ${sfHtml}
              ${finalHtml}
            </div>
          </div>
        </div>
      </div>
    `;

  } else {
    // ── VÒNG BẢNG & KNOCKOUT CÚP CHÂU ÂU (DÙNG CHUNG CẢ U19 VÀ ĐỘI MỘT) ──
    const groupsObj = player.continentalCupGroups || player.youthLeagueGroups;
    let groupAData = (groupsObj && groupsObj.A) ||
      (Array.isArray(player.continentalGroupTable) && player.continentalGroupTable.length >= 4 ? player.continentalGroupTable : null) ||
      (currentBracket.groupStage?.standings) ||
      [];

    if (!groupAData || groupAData.length === 0) {
      const otherClubs = (ALL_CLUBS || []).filter(c => c.id !== activeClub.id);
      groupAData = [
        { clubId: activeClub.id, clubName: activeClub.name, icon: activeClub.icon || '⭐', played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isPlayer: true },
        { clubId: otherClubs[0]?.id || 'opp1', clubName: otherClubs[0]?.name || 'Bayern Munich', icon: otherClubs[0]?.icon || '⚽', played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isPlayer: false },
        { clubId: otherClubs[1]?.id || 'opp2', clubName: otherClubs[1]?.name || 'Inter Milan', icon: otherClubs[1]?.icon || '⚽', played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isPlayer: false },
        { clubId: otherClubs[2]?.id || 'opp3', clubName: otherClubs[2]?.name || 'Paris Saint-Germain', icon: otherClubs[2]?.icon || '⚽', played: 0, won: 0, drawn: 0, lost: 0, gd: 0, points: 0, isPlayer: false }
      ];
      if (!player.continentalCupGroups) player.continentalCupGroups = {};
      player.continentalCupGroups.A = groupAData;
    }

    const isGroupFinished = groupAData.length >= 4 && groupAData.every(t => (t.played !== undefined ? t.played : 0) >= 3);

    const groupRows = groupAData.map((row, idx) => {
      const isPlayer = row.isPlayer || isPlayerClubCheck({ id: row.clubId, name: row.clubName }, activeClub);
      const rank = idx + 1;
      let statusBadge = '';
      if (!isGroupFinished) {
        statusBadge = '<span style="color:var(--text-muted); font-size:0.72rem;">Đang thi đấu</span>';
      } else {
        statusBadge = rank <= 2
          ? '<span style="color:#34d399; font-weight:800; font-size:0.72rem;">🟢 Vé Tứ Kết</span>'
          : '<span style="color:var(--text-muted); font-size:0.72rem;">🔴 Bị loại</span>';
      }
      const gdVal = row.gd !== undefined ? row.gd : 0;
      const gdStr = gdVal > 0 ? `+${gdVal}` : `${gdVal}`;

      return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.04); ${isPlayer ? 'background:rgba(245,158,11,0.08); font-weight:800;' : ''}">
          <td style="text-align: left; padding: 5px;">
            <span>${row.clubIcon || row.icon || '⚽'}</span>
            <strong style="${isPlayer ? 'color:var(--accent-gold);' : ''}">${row.clubName || row.name || row.clubCode || 'CLB'}</strong>
            ${isPlayer ? '<span style="color:var(--accent-gold); font-size:0.65rem; font-weight:800;">★ BẠN</span>' : ''}
          </td>
          <td style="padding: 5px;">${row.played ?? 0}</td>
          <td style="padding: 5px; color:#10b981;">${row.won ?? 0}</td>
          <td style="padding: 5px; color:#94a3b8;">${row.drawn ?? 0}</td>
          <td style="padding: 5px; color:#ef4444;">${row.lost ?? 0}</td>
          <td style="padding: 5px; font-weight:700;">${gdStr}</td>
          <td style="padding: 5px; color:var(--accent-gold); font-weight:900;">${row.points ?? 0}</td>
          <td style="text-align: right; padding: 5px;">${statusBadge}</td>
        </tr>
      `;
    }).join('');

    const groupFixtures = (player.currentSeasonFixtures || []).filter(f =>
      (f.competitionType === 'UCL' || f.competitionType === 'EUROPA_LEAGUE' || f.competitionType === 'CONTINENTAL_CUP' || f.isContinental || Boolean(f.stageName && (f.stageName.includes("Youth League") || f.stageName.includes("Europa") || f.stageName.includes("Champions")))) &&
      ((f.stageName && f.stageName.includes("Vòng Bảng")) || (f.stage && f.stage.includes("Vòng Bảng")))
    );
    const groupMatchesHtml = (groupFixtures.length > 0)
      ? groupFixtures.map(f => {
        const pm = f.playerMatch;
        const hClub = pm?.homeClub || f.homeClub || activeClub;
        const aClub = pm?.awayClub || f.awayClub || pm?.opponent || { name: "Đối Thủ", icon: "⚽" };
        const isPlayed = Boolean(f.isPlayed || f.completed || (pm && (pm.isPlayed || pm.completed)));
        const scoreText = isPlayed
          ? `${pm?.homeScore ?? f.homeScore ?? 0} - ${pm?.awayScore ?? f.awayScore ?? 0}`
          : 'vs';
        const sName = f.stageName || f.stage || "Vòng Bảng";
        return `
            <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.25); padding:5px 8px; border-radius:4px; font-size:0.75rem; border:1px solid rgba(255,255,255,0.06);">
              <span style="font-size:0.68rem; color:var(--accent-blue); font-weight:700; width:70px;">${sName}</span>
              <span>${hClub.icon ? hClub.icon : '⚽'} ${hClub.name ? hClub.name : 'CLB Nhà'}</span>
              <strong style="color:var(--accent-gold); font-size:0.85rem; padding: 0 8px;">${scoreText}</strong>
              <span>${aClub.name ? aClub.name : 'CLB Khách'} ${aClub.icon ? aClub.icon : '⚽'}</span>
            </div>
          `;
      }).join('')
      : `<div style="font-size:0.72rem; color:var(--text-muted); text-align:center; padding:6px;">Chưa có lịch thi đấu vòng bảng.</div>`;

    let uylQf = currentBracket.quarterFinals || [];
    let uylSf = currentBracket.semiFinals || [];
    let uylFinalMatch = currentBracket.final;

    if (!isGroupFinished) {
      uylQf = [
        { id: "euro_qf1", matchId: "QF1", name: "Tứ Kết 1 (Nhất A vs Nhì B)", club1: { name: "Nhất Bảng A", code: "1A", icon: "🥇" }, club2: { name: "Nhì Bảng B", code: "2B", icon: "🥈" }, score1: null, score2: null, winner: null, isPlayerMatch: false },
        { id: "euro_qf2", matchId: "QF2", name: "Tứ Kết 2 (Nhất C vs Nhì D)", club1: { name: "Nhất Bảng C", code: "1C", icon: "🥇" }, club2: { name: "Nhì Bảng D", code: "2D", icon: "🥈" }, score1: null, score2: null, winner: null, isPlayerMatch: false },
        { id: "euro_qf3", matchId: "QF3", name: "Tứ Kết 3 (Nhất B vs Nhì A)", club1: { name: "Nhất Bảng B", code: "1B", icon: "🥇" }, club2: { name: "Nhì Bảng A", code: "2A", icon: "🥈" }, score1: null, score2: null, winner: null, isPlayerMatch: false },
        { id: "euro_qf4", matchId: "QF4", name: "Tứ Kết 4 (Nhất D vs Nhì C)", club1: { name: "Nhất Bảng D", code: "1D", icon: "🥇" }, club2: { name: "Nhì Bảng C", code: "2C", icon: "🥈" }, score1: null, score2: null, winner: null, isPlayerMatch: false }
      ];
      uylSf = [
        { id: "euro_sf1", matchId: "SF1", name: "Bán Kết 1 (Thắng QF1 vs Thắng QF2)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false },
        { id: "euro_sf2", matchId: "SF2", name: "Bán Kết 2 (Thắng QF3 vs Thắng QF4)", club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false }
      ];
      uylFinalMatch = { id: "euro_f", matchId: "FINAL", name: `Chung Kết ${currentBracket.name}`, club1: null, club2: null, score1: null, score2: null, winner: null, isPlayerMatch: false };
    }

    const uylQfHtml = [
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 1; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(uylQf[0], 'Tứ Kết 1 (Nhất A vs Nhì B)', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 2; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(uylQf[1], 'Tứ Kết 2 (Nhất C vs Nhì D)', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 3; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(uylQf[2], 'Tứ Kết 3 (Nhất B vs Nhì A)', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 1; grid-row: 4; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(uylQf[3], 'Tứ Kết 4 (Nhất D vs Nhì C)', activeClub)}</div>`
    ].join('\n');

    const uylSfHtml = [
      `<div class="bracket-match-node" style="grid-column: 2; grid-row: 1 / span 2; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(uylSf[0], 'Bán Kết 1', activeClub)}</div>`,
      `<div class="bracket-match-node" style="grid-column: 2; grid-row: 3 / span 2; width: 190px; min-width: 190px; box-sizing: border-box;">${renderMatchCard(uylSf[1], 'Bán Kết 2', activeClub)}</div>`
    ].join('\n');

    const uylFinalHtml = `
      <div class="bracket-match-node final-match" style="grid-column: 3; grid-row: 1 / span 4; width: 190px; min-width: 190px; position: relative; box-sizing: border-box;">
        ${renderMatchCard(uylFinalMatch, 'Chung Kết', activeClub)}
        ${(isGroupFinished && currentBracket.champion) ? `
          <div class="bracket-champion-box" style="position: absolute; top: calc(100% + 10px); left: 0; width: 190px; min-width: 190px; box-sizing: border-box; z-index: 5;">
            <div style="font-size:0.72rem; font-weight:800; color:var(--accent-gold);">🏆 VÔ ĐỊCH ${currentBracket.name ? currentBracket.name.toUpperCase() : 'CÚP CHÂU ÂU'}</div>
            <div style="font-size:0.95rem; font-weight:900; color:#fff; margin-top:2px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${currentBracket.champion.icon ? currentBracket.champion.icon : '👑'} ${currentBracket.champion.name}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    container.innerHTML = `
      <div class="bracket-wrapper">
        <div class="bracket-type-selector" style="display:flex; gap:8px; margin-bottom:10px; flex-wrap:wrap;">
          <button class="bracket-type-btn" id="btnBracketDom" style="padding:6px 14px; border-radius:6px; font-weight:700; cursor:pointer;">
            🏆 ${domesticName}
          </button>
          <button class="bracket-type-btn active" id="btnBracketEuro" style="padding:6px 14px; border-radius:6px; font-weight:700; cursor:pointer; background:rgba(56,189,248,0.2); border-color:var(--accent-blue); color:var(--accent-blue);">
            ⭐ ${continentalName}
          </button>
        </div>

        <div style="font-size:0.82rem; font-weight:800; color:#fff; margin-bottom:8px; display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.03); padding:6px 10px; border-radius:6px; border:1px solid rgba(255,255,255,0.06);">
          <span>🌿 Giải Đấu: <strong style="color:var(--accent-blue);">${currentBracket.name}</strong></span>
          <span style="font-size:0.72rem; color:var(--text-muted);">Vòng Bảng (3 Lượt) ➔ Tứ Kết ➔ Bán Kết ➔ Chung Kết</span>
        </div>

        ${!isGroupFinished ? `
          <div style="background: linear-gradient(135deg, rgba(56, 189, 248, 0.12), rgba(14, 165, 233, 0.05)); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 8px; padding: 10px 14px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 0.78rem; flex-wrap: wrap; gap: 10px;">
            <div style="display:flex; align-items:center; gap:10px;">
              <span style="font-size:1.3rem;">ℹ️</span>
              <div>
                <div style="font-weight: 800; color: #38bdf8;">VÒNG BẢNG ĐANG DIỄN RA — CHƯA XÁC ĐỊNH NHÁNH ĐẤU TỨ KẾT</div>
                <div style="color: var(--text-muted, #94a3b8); font-size: 0.72rem; margin-top: 2px;">
                  Cần hoàn thành trọn vẹn 3 lượt trận vòng bảng. Top 2 đội dẫn đầu sẽ giành vé vào vòng Tứ Kết Knock-out!
                </div>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="uyl-group-card" style="background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 8px; padding: 10px; margin-bottom: 12px;">
          <div style="font-size: 0.78rem; font-weight: 800; color: #38bdf8; display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;">
            <span>⭐ BẢNG ĐẤU VÒNG BẢNG - BẢNG A (${currentBracket.name ? currentBracket.name.toUpperCase() : 'CÚP CHÂU ÂU'})</span>
            <span style="font-size: 0.68rem; color: var(--text-muted);">${isGroupFinished ? 'Đã hoàn tất 3 lượt trận (Top 2 đi tiếp)' : 'Đá đủ 3 lượt trận ➔ Top 2 Vào Tứ Kết'}</span>
          </div>
          <table style="width: 100%; border-collapse: collapse; font-size: 0.75rem; text-align: center;">
            <thead>
              <tr style="color: var(--text-muted); font-size: 0.68rem; border-bottom: 1px solid rgba(255,255,255,0.08);">
                <th style="text-align: left; padding: 4px;"># CLB</th>
                <th style="padding: 4px;">TR</th>
                <th style="padding: 4px;">T</th>
                <th style="padding: 4px;">H</th>
                <th style="padding: 4px;">B</th>
                <th style="padding: 4px;">HS</th>
                <th style="padding: 4px; color: var(--accent-gold);">Đ</th>
                <th style="text-align: right; padding: 4px;">Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              ${groupRows}
            </tbody>
          </table>
          <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 4px;">
            <div style="font-size: 0.68rem; font-weight: 700; color: var(--text-muted);">Lượt trận Vòng Bảng:</div>
            ${groupMatchesHtml}
          </div>
        </div>

        <div style="font-size: 0.78rem; font-weight: 800; color: #fff; margin-bottom: 6px;">
          <span>🌿 Sơ Đồ Loại Trực Tiếp (Tứ Kết ➔ Bán Kết ➔ Chung Kết)</span>
        </div>
        <div class="bracket-scroll-wrapper" style="overflow-x: auto; padding-bottom: 12px;">
          <div style="min-width: 620px; width: max-content;">
            <div class="bracket-headers-row" style="display: grid; grid-template-columns: repeat(3, 190px); gap: 24px; padding: 0 10px; margin-bottom: 8px;">
              <div class="bracket-round-header" style="text-align: center; font-weight: 800; font-size: 0.76rem; color: var(--accent-blue); padding: 5px 0; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">Tứ Kết (8 Đội)</div>
              <div class="bracket-round-header" style="text-align: center; font-weight: 800; font-size: 0.76rem; color: var(--accent-blue); padding: 5px 0; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">Bán Kết (4 Đội)</div>
              <div class="bracket-round-header" style="text-align: center; font-weight: 800; font-size: 0.76rem; color: var(--accent-blue); padding: 5px 0; background: rgba(255,255,255,0.03); border-radius: 6px; border: 1px solid rgba(255,255,255,0.06);">Chung Kết</div>
            </div>
            <div class="bracket-grid-container uyl-grid" style="display: grid; grid-template-columns: repeat(3, 190px); grid-template-rows: repeat(4, minmax(68px, auto)); gap: 14px 24px; align-items: center; overflow-x: auto; padding: 12px 10px 20px 10px;">
              ${uylQfHtml}
              ${uylSfHtml}
              ${uylFinalHtml}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  const btnDom = container.querySelector('#btnBracketDom');
  if (btnDom) {
    btnDom.onclick = () => renderTournamentBrackets(player, 'DOMESTIC_CUP');
  }
  const btnEuro = container.querySelector('#btnBracketEuro');
  if (btnEuro) {
    btnEuro.onclick = () => renderTournamentBrackets(player, 'UCL');
  }

  const btnUylStandings = container.querySelector('#btnViewUylStandings');
  if (btnUylStandings) {
    btnUylStandings.onclick = (e) => {
      e.preventDefault();
      const groupEl = container.querySelector('.uyl-group-card');
      if (groupEl) {
        groupEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
  }
}

/**
 * Alias cho renderTournamentBrackets theo yêu cầu
 */
export function renderCupBracket(player, activeType = 'DOMESTIC_CUP') {
  return renderTournamentBrackets(player, activeType);
}

/**
 * Bộ chuyển tab giải đấu cúp
 */
export function switchCupViewTab(player, activeType) {
  return renderTournamentBrackets(player, activeType);
}

/**
 * Render bảng xếp hạng Vòng bảng UEFA Youth League vào container chỉ định
 */
export function renderYouthLeagueGroupStandings(player, containerId = 'tournamentBracketsContainer') {
  return renderTournamentBrackets(player, 'UCL');
}