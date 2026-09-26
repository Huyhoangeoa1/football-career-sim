/* =========================================================================
   FOOTBALL CAREER SIMULATOR — CARD THEMES / EDITIONS
   Quản lý 5 Phôi Mùa Thẻ Kinh Điển EA FC / FIFA & Cơ Chế Tự Động Mở Khóa
   ========================================================================= */

export const CARD_THEMES = [
  {
    id: "gold",
    name: "Standard Gold",
    nameVi: "Vàng Hoàng Gia",
    editionBadge: "GOLD",
    subtitle: "Mùa Giải Chính Thức",
    desc: "Nền vân kim loại vàng kim hoàng gia, viền vàng 24K ánh kim nổi 3D, dành cho các chiến dịch đỉnh cao.",
    colorAccent: "#f59e0b",
    tagColor: "linear-gradient(135deg, #f59e0b, #d97706)",
    defaultUnlocked: true,
    conditionDesc: "Mặc định mở khóa cho mọi cầu thủ"
  },
  {
    id: "totw",
    name: "Team of the Week",
    nameVi: "Đội Hình Xuất Sắc Tuần (In-Form)",
    editionBadge: "TOTW",
    subtitle: "Đen Carbon & Chỉ Vàng Kinh Điển",
    desc: "Phôi thẻ đen huyền thoại vinh danh màn trình diễn bùng nổ cuối tuần.",
    colorAccent: "#eab308",
    tagColor: "linear-gradient(135deg, #09090b, #d4af37)",
    defaultUnlocked: false,
    conditionDesc: "Có ít nhất 1 trận đạt Rating >= 9.5 hoặc lập Hat-trick trong mùa giải hiện tại"
  },
  {
    id: "potm",
    name: "Player of the Month",
    nameVi: "Cầu Thủ Xuất Sắc Nhất Tháng",
    editionBadge: "POTM",
    subtitle: "Tím Hoàng Gia Premier League",
    desc: "Màu tím danh giá của danh hiệu Cầu thủ xuất sắc nhất tháng tại giải VĐQG.",
    colorAccent: "#a855f7",
    tagColor: "linear-gradient(135deg, #581c87, #c084fc)",
    defaultUnlocked: false,
    conditionDesc: "Đoạt ít nhất 1 danh hiệu Cầu thủ xuất sắc nhất giải đấu, hoặc ghi >= 10 bàn trong chuỗi 5 trận liên tiếp"
  },
  {
    id: "record_breaker",
    name: "Record Breaker",
    nameVi: "Kỷ Lục Gia Lịch Sử",
    editionBadge: "RECORD",
    subtitle: "Đỏ Rực & Xanh Sapphire Phá Kỷ Lục",
    desc: "Phôi thẻ huyền thoại dành cho những quái kiệt xô đổ các cột mốc lịch sử vĩ đại nhất của bóng đá thế giới.",
    colorAccent: "#dc2626",
    tagColor: "linear-gradient(135deg, #991b1b, #2563eb)",
    defaultUnlocked: false,
    conditionDesc: "Tổng số bàn thắng sự nghiệp đạt >= 100 bàn (hoặc phá kỷ lục ghi bàn một mùa giải)"
  },
  {
    id: "ucl_common",
    name: "UEFA Champions League",
    nameVi: "Đấu Trường Danh Giá C1",
    editionBadge: "UCL",
    subtitle: "Xanh Lam UEFA & Họa Tiết Quả Bóng Sao",
    desc: "Phôi thẻ xanh thẫm mang hơi thở của những đêm nhạc hiệu Champions League rực lửa.",
    colorAccent: "#2563eb",
    tagColor: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    defaultUnlocked: false,
    conditionDesc: "Đang thi đấu tại UEFA Champions League hoặc đã từng ghi bàn tại Cúp C1"
  },
  {
    id: "heroes",
    name: "Club Heroes",
    nameVi: "Tượng Đài Đội Bóng",
    editionBadge: "HERO",
    subtitle: "Xanh Lá & Vàng Gold Siêu Cường",
    desc: "Vinh danh những người hùng phòng thay đồ, chỗ dựa tinh thần không thể thay thế của người hâm mộ.",
    colorAccent: "#10b981",
    tagColor: "linear-gradient(135deg, #065f46, #eab308)",
    defaultUnlocked: false,
    conditionDesc: "Thi đấu >= 50 trận cho CLB hiện tại và có vai trò Trụ Cột (Key Player / Captain)"
  }
];

export function getThemeById(themeId) {
  if (!themeId) return CARD_THEMES[0];
  // Khả năng tương thích ngược với các ID thẻ cũ (icon, toty, tots, future, future_stars)
  const legacyMap = {
    future: 'gold',
    future_stars: 'gold',
    icon: 'record_breaker',
    toty: 'ucl_common',
    tots: 'totw'
  };
  const resolvedId = legacyMap[themeId] || themeId;
  return CARD_THEMES.find(t => t.id === resolvedId || t.id === themeId) || CARD_THEMES[0];
}

/**
 * Kiểm tra trạng thái mở khóa của mùa thẻ theo thành tích của player
 * @param {string} themeId
 * @param {object} player
 * @returns {{ isUnlocked: boolean, reason: string }}
 */
export function checkThemeUnlocked(themeId, player) {
  if (!player) {
    return { 
      isUnlocked: themeId === 'gold' || themeId === 'future' || themeId === 'future_stars', 
      reason: '' 
    };
  }

  // 1. Phôi Vàng Cơ Bản (Standard Gold)
  if (themeId === 'gold' || themeId === 'future' || themeId === 'future_stars') {
    return { isUnlocked: true, reason: 'Đã mở khóa (Mặc định cho mọi cầu thủ)' };
  }

  // 2. TOTW / In-Form: Rating >= 9.5 hoặc Lập Hat-trick trong mùa hiện tại
  if (themeId === 'totw' || themeId === 'tots') {
    const fixtures = player.currentSeasonFixtures || [];
    
    // Kiểm tra có trận nào đạt Rating >= 9.5
    const has95InSeason = fixtures.some(f => {
      const res = f.playerMatch?.result || f.result || {};
      const r = Number(res.rating !== undefined ? res.rating : (f.rating || 0));
      return r >= 9.5;
    }) || Number(player.lastMatchRating || 0) >= 9.5 || Number(player.seasonBestRating || 0) >= 9.5;

    // Kiểm tra có trận nào ghi >= 3 bàn (Hat-trick)
    const hasHatTrickInSeason = fixtures.some(f => {
      const res = f.playerMatch?.result || f.result || {};
      const g = Number(res.playerGoals !== undefined ? res.playerGoals : (f.playerGoals || 0));
      return g >= 3;
    }) || Number(player.seasonHattricks || player.seasonHatTricks || 0) > 0;

    // Kiểm tra thêm các mốc hattrick sự nghiệp đã ghi nhận
    const hasCareerHatTrick = Number(player.totalCareerHattricks || player.careerHattricks || 0) > 0 || 
      !!player.achievedMilestones?.FIRST_HATTRICK;

    const isUnlocked = has95InSeason || hasHatTrickInSeason || hasCareerHatTrick;
    return {
      isUnlocked,
      reason: isUnlocked
        ? `Đã mở khóa (${has95InSeason ? 'Rating ≥ 9.5 ⭐' : 'Cú Hat-trick bùng nổ 🎩'})`
        : 'Yêu cầu: Có ít nhất 1 trận đạt Rating ≥ 9.5 hoặc lập Hat-trick trong mùa giải hiện tại'
    };
  }

  // 3. POTM: Đoạt danh hiệu Cầu thủ xuất sắc nhất giải đấu (MVP) hoặc ghi >= 10 bàn / chuỗi 5 trận
  if (themeId === 'potm') {
    // 3.1. Danh hiệu MVP / Cầu thủ xuất sắc nhất
    const hasMvpAward = 
      (player.individualAwards || []).some(a => {
        const n = a.name || a.title || '';
        return n.includes('Xuất Sắc Nhất') || n.includes('MVP') || n.includes('Player of the');
      }) ||
      Object.keys(player.trophiesTally || {}).some(k => k.includes('Xuất Sắc Nhất') || k.includes('MVP')) ||
      (player.seasonTrophiesWonThisYear || []).some(t => t.includes('Xuất Sắc Nhất') || t.includes('MVP')) ||
      !!player.achievedMilestones?.MVP_AWARD ||
      (player.records || []).some(r => {
        const t = r.title || '';
        return t.includes('Xuất Sắc Nhất') || t.includes('MVP');
      }) ||
      Number(player.tournamentMvpWins || player.leagueMvpWins || 0) > 0;

    // 3.2. Chuỗi 5 trận liên tiếp ghi >= 10 bàn
    const fixtures = player.currentSeasonFixtures || [];
    const completedFixtures = fixtures.filter(f => f.playerMatch?.isPlayed || f.isCompleted || f.completed);
    let has10GoalsIn5 = false;

    if (completedFixtures.length >= 5) {
      for (let i = 0; i <= completedFixtures.length - 5; i++) {
        const goals5 = completedFixtures.slice(i, i + 5).reduce((sum, f) => {
          const res = f.playerMatch?.result || f.result || {};
          return sum + (Number(res.playerGoals) || 0);
        }, 0);
        if (goals5 >= 10) {
          has10GoalsIn5 = true;
          break;
        }
      }
    } else if (completedFixtures.length > 0) {
      const sumRecent = completedFixtures.reduce((sum, f) => {
        const res = f.playerMatch?.result || f.result || {};
        return sum + (Number(res.playerGoals) || 0);
      }, 0);
      if (sumRecent >= 10) has10GoalsIn5 = true;
    }

    const isUnlocked = hasMvpAward || has10GoalsIn5;
    return {
      isUnlocked,
      reason: isUnlocked
        ? `Đã mở khóa (${hasMvpAward ? 'Cầu Thủ Xuất Sắc Nhất Giải (MVP) 🏅' : 'Ghi ≥ 10 bàn / 5 trận liên tiếp 🔥'})`
        : 'Yêu cầu: Đoạt ít nhất 1 danh hiệu Cầu thủ xuất sắc nhất giải đấu, hoặc ghi ≥ 10 bàn trong chuỗi 5 trận'
    };
  }

  // 4. Record Breaker: Tổng số bàn thắng sự nghiệp >= 100 bàn (hoặc phá kỷ lục ghi bàn)
  if (themeId === 'record_breaker' || themeId === 'icon') {
    const totalGoals = Number(player.totalCareerGoals || 0) || 
      (Number(player.clubGoals || 0) + Number(player.intlGoals || 0)) || 
      Number(player.careerStats?.goals || 0) || 
      Number(player.stats?.goals || 0);

    const hasBrokenGoalRecord = (player.brokenRecords || []).some(r => {
      const str = String(r).toLowerCase();
      return str.includes('goal') || str.includes('score') || str.includes('record');
    }) || Number(player.seasonMaxGoals || 0) >= 35 || Number(player.seasonAccumulator?.goals || 0) >= 35;

    const isUnlocked = totalGoals >= 100 || hasBrokenGoalRecord;
    return {
      isUnlocked,
      reason: isUnlocked
        ? `Đã mở khóa (${totalGoals >= 100 ? `${totalGoals} bàn thắng sự nghiệp 🎯` : 'Xô đổ kỷ lục ghi bàn lịch sử 💥'})`
        : `Yêu cầu: Tổng số bàn thắng sự nghiệp đạt ≥ 100 bàn (Hiện tại: ${totalGoals}/100) hoặc phá kỷ lục ghi bàn`
    };
  }

  // 5. UCL Standard: Đang thi đấu tại UEFA Champions League hoặc đã từng ghi bàn tại Cúp C1
  if (themeId === 'ucl_common' || themeId === 'toty') {
    const uclGoals = Number(player.uclGoals || 0) || 
      Number(player.cupStats?.continentalCup?.goals || 0) ||
      Number(player.continentalGoals || 0);
    const hasScoredUcl = uclGoals > 0;

    const fixtures = player.currentSeasonFixtures || [];
    const isInUcl = fixtures.some(f => 
      f.competitionType === 'CONTINENTAL_C1' || 
      (f.competitionName && (f.competitionName.includes('Champions League') || f.competitionName.includes('Cúp C1') || f.competitionName.includes('C1'))) ||
      (f.cupName && f.cupName.includes('Champions League'))
    ) || 
    player.competitionTier?.qualificationStatus === 'UCL' ||
    String(player.competitionTier?.tierName || '').includes('C1') ||
    player.activeContinentalCompetition === 'UCL' ||
    player.continentalCupType === 'UCL' ||
    String(player.tournamentBrackets?.continentalCup?.tourneyName || '').includes('Champions League') ||
    Object.keys(player.trophiesTally || {}).some(k => k.includes('Champions League') || k.includes('Cúp C1'));

    const isUnlocked = hasScoredUcl || isInUcl;
    return {
      isUnlocked,
      reason: isUnlocked
        ? `Đã mở khóa (${hasScoredUcl ? `Đã ghi ${uclGoals} bàn C1 ⚽` : 'Đang tranh tài tại UEFA Champions League 🌟'})`
        : 'Yêu cầu: Đang thi đấu tại UEFA Champions League hoặc đã từng ghi bàn tại Cúp C1'
    };
  }

  // 6. Heroes: Thi đấu >= 50 trận cho CLB hiện tại và có vai trò Trụ Cột (Key Player / Captain)
  if (themeId === 'heroes') {
    const clubMatches = Number(player.clubMatches || 0) || 
      Number(player.currentClubMatches || 0) || 
      Number(player.totalCareerMatches || 0) || 
      Number(player.careerStats?.matches || 0);

    const isKeyOrCaptain = player.squadRole === 'KEY_PLAYER' || 
      player.squadRole === 'CAPTAIN' || 
      player.squadRole === 'STAR' || 
      !!player.isCaptain;

    const isUnlocked = clubMatches >= 50 && isKeyOrCaptain;
    return {
      isUnlocked,
      reason: isUnlocked
        ? `Đã mở khóa (${clubMatches} trận cho CLB • Trụ Cột Đội Bóng 🛡️)`
        : `Yêu cầu: Thi đấu ≥ 50 trận cho CLB hiện tại (${clubMatches}/50) và có vai trò Trụ Cột (Key Player / Captain)`
    };
  }

  return { isUnlocked: true, reason: '' };
}
