/* =========================================================================
   FOOTBALL CAREER SIMULATOR — CARD THEMES / EDITIONS
   Quản lý 5 Phôi Mùa Thẻ FC 26 & Cơ Chế Tự Động Mở Khóa Thành Tích
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
    id: "icon",
    name: "Icon / Prime",
    nameVi: "Huyền Thoại Bạch Kim",
    editionBadge: "ICON",
    subtitle: "Đá Cẩm Thạch & Vàng Kim",
    desc: "Chuẩn phong cách EA FC Icon: Nền đá cẩm thạch trắng Carrara vân xám viền vàng kim lấp lánh, vinh danh những bậc thầy bóng đá bất tử.",
    colorAccent: "#eab308",
    tagColor: "linear-gradient(135deg, #ffffff, #d4af37)",
    defaultUnlocked: false,
    conditionDesc: "Đoạt Quả Bóng Vàng (Ballon d'Or) hoặc OVR đạt 90+"
  },
  {
    id: "toty",
    name: "TOTY / Blue Neon",
    nameVi: "Đội Hình Tiêu Biểu",
    editionBadge: "TOTY",
    subtitle: "Xanh Sapphire Neon",
    desc: "Nền xanh dương đá quý sapphire pha tím neon ánh kim, hoa văn tinh thể cắt vát phản quang đa chiều.",
    colorAccent: "#38bdf8",
    tagColor: "linear-gradient(135deg, #0284c7, #9333ea)",
    defaultUnlocked: false,
    conditionDesc: "Vô địch Cúp C1 Châu Âu (Champions League) hoặc đạt FIFPRO World 11 / The Best"
  },
  {
    id: "tots",
    name: "TOTS / Black & Gold",
    nameVi: "Ngôi Sao Mùa Giải",
    editionBadge: "TOTS",
    subtitle: "Đen Carbon & Chỉ Vàng",
    desc: "Nền đen carbon xước cao cấp vân đá Obsidian, viền chỉ vàng kim loại nguyên khối cực kỳ sang trọng.",
    colorAccent: "#ffd700",
    tagColor: "linear-gradient(135deg, #18181b, #eab308)",
    defaultUnlocked: false,
    conditionDesc: "Vô địch Giải VĐQG bất kỳ hoặc đoạt Vua Phá Lưới (Chiếc Giày Vàng)"
  },
  {
    id: "future",
    alias: "future_stars",
    name: "Future Stars",
    nameVi: "Sao Mai Học Viện",
    editionBadge: "FUTURE",
    subtitle: "Hồng Tím Cyberpunk",
    desc: "Nền hồng cánh sen pha tím cyberpunk rực sáng, biểu tượng của thế hệ vàng tương lai bóng đá thế giới.",
    colorAccent: "#f43f5e",
    tagColor: "linear-gradient(135deg, #ec4899, #8b5cf6)",
    defaultUnlocked: true,
    conditionDesc: "Cầu thủ từ 21 tuổi trở xuống hoặc đang ở Lò Đào Tạo Trẻ"
  }
];

export function getThemeById(themeId) {
  if (themeId === 'future' || themeId === 'future_stars') {
    return CARD_THEMES.find(t => t.id === 'future' || t.id === 'future_stars') || CARD_THEMES[0];
  }
  return CARD_THEMES.find(t => t.id === themeId) || CARD_THEMES[0];
}

/**
 * Kiểm tra trạng thái mở khóa của mùa thẻ theo thành tích của player
 */
export function checkThemeUnlocked(themeId, player) {
  if (!player) return { isUnlocked: themeId === 'gold' || themeId === 'future' || themeId === 'future_stars', reason: '' };
  if (themeId === 'gold') {
    return { isUnlocked: true, reason: 'Đã mở khóa (Mặc định)' };
  }

  // Future Stars: <= 21 tuổi hoặc ở Academy
  if (themeId === 'future_stars' || themeId === 'future') {
    const isUnder21 = (player.age || 16) <= 21 || !!player.isAcademyStage;
    return {
      isUnlocked: true,
      reason: isUnder21 
        ? `Đã mở khóa (${player.age} tuổi / ${player.isAcademyStage ? 'Lò đào tạo' : 'Tài năng trẻ'})`
        : 'Yêu cầu: Cầu thủ từ 21 tuổi trở xuống hoặc ở Lò Trẻ'
    };
  }

  // TOTS: Vô địch VĐQG hoặc Chiếc Giày Vàng hoặc OVR >= 84
  if (themeId === 'tots') {
    const trophies = player.trophiesTally || {};
    const hasLeague = Object.keys(trophies).some(k => 
      k.includes('Vô Địch') || k.includes('Premier League') || k.includes('La Liga') || 
      k.includes('Serie A') || k.includes('Bundesliga') || k.includes('Ligue 1') || k.includes('VĐQG')
    ) || !!player.wonLeagueLastSeason;
    const hasShoe = (player.goldenShoeWins || 0) > 0;
    const ovr = Math.round(((player.attr1 || 50) + (player.attr2 || 50) + (player.attr3 || 50) + (player.attr4 || 50)) / 4);
    const isUnlocked = hasLeague || hasShoe || ovr >= 84;
    return {
      isUnlocked,
      reason: isUnlocked
        ? `Đã mở khóa (${hasLeague ? 'Vô địch Quốc Nội' : (hasShoe ? 'Giày Vàng' : `OVR ${ovr}`)})`
        : 'Yêu cầu: Vô địch Giải VĐQG, đoạt Giày Vàng hoặc OVR 84+'
    };
  }

  // TOTY: Vô địch Champions League / FIFA The Best / FIFPRO World 11 hoặc OVR >= 89
  if (themeId === 'toty') {
    const trophies = player.trophiesTally || {};
    const hasUcl = Object.keys(trophies).some(k => 
      k.includes('Champions League') || k.includes('C1') || k.includes('Cúp C1')
    ) || !!player.wonEuroC1LastSeason;
    const hasAward = (player.fifaTheBestWins || 0) > 0 || (player.fifproWorld11Wins || 0) > 0;
    const ovr = Math.round(((player.attr1 || 50) + (player.attr2 || 50) + (player.attr3 || 50) + (player.attr4 || 50)) / 4);
    const isUnlocked = hasUcl || hasAward || ovr >= 89;
    return {
      isUnlocked,
      reason: isUnlocked
        ? `Đã mở khóa (${hasUcl ? 'Vô địch Cúp C1' : (hasAward ? 'The Best / World 11' : `OVR ${ovr}`)})`
        : 'Yêu cầu: Vô địch Cúp C1 Champions League, The Best hoặc OVR 89+'
    };
  }

  // ICON / PRIME: Ballon d'Or hoặc OVR >= 90 hoặc Giải nghệ có nhiều cúp
  if (themeId === 'icon') {
    const trophies = player.trophiesTally || {};
    const hasBallonDor = (player.ballonDorWins || 0) > 0 || 
      Object.keys(trophies).some(k => k.includes('Quả Bóng Vàng') || k.includes('Ballon d'));
    const ovr = Math.round(((player.attr1 || 50) + (player.attr2 || 50) + (player.attr3 || 50) + (player.attr4 || 50)) / 4);
    const isUnlocked = hasBallonDor || ovr >= 90 || (player.isRetired && (player.trophiesTotal || 0) >= 3);
    return {
      isUnlocked,
      reason: isUnlocked
        ? `Đã mở khóa (${hasBallonDor ? 'Quả Bóng Vàng 👑' : `OVR ${ovr}`})`
        : 'Yêu cầu: Đoạt Quả Bóng Vàng (Ballon d\'Or) hoặc OVR 90+'
    };
  }

  return { isUnlocked: true, reason: '' };
}
