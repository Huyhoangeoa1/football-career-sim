/* =========================================================================
   FOOTBALL CAREER SIMULATOR — STATE MANAGEMENT MODULE
   ========================================================================= */

import { 
  NATIONALITIES_DATA, 
  YOUTH_ACADEMIES, 
  RIVALS_DATA, 
  getPositionGroup, 
  getRandomPlayerNameByNat,
  getInitialStatsForPosition,
  generateSubStatsFromFaceStats 
} from './data.js';

export function createInitialPlayer(customName = "", natId = "VN", pos = "ST", academyId = null) {
  const nationality = NATIONALITIES_DATA.find(n => n.id === natId || n.idAlias === natId || n.code === natId) || NATIONALITIES_DATA[0];
  
  let academy = null;
  if (academyId) {
    academy = YOUTH_ACADEMIES.find(a => a.id === academyId);
  }
  if (!academy) {
    let matchingAcademies = YOUTH_ACADEMIES.filter(a => a.country === nationality.name);
    academy = matchingAcademies.length > 0 
      ? matchingAcademies[0] 
      : YOUTH_ACADEMIES[Math.floor(Math.random() * YOUTH_ACADEMIES.length)];
  }

  const randomRival = RIVALS_DATA[Math.floor(Math.random() * RIVALS_DATA.length)];
  const rival = {
    ...randomRival,
    careerGoals: 0,
    careerAssists: 0,
    careerTrophies: 0,
    careerBallonDor: 0,
    ballonDor: 0
  };

  // Base attributes by specific position (11 positions) - Centered at Starting OVR 55
  let attr1 = 55, attr2 = 58, attr3 = 51, attr4 = 56;
  let stam = 55, form = 58;

  const pUpper = String(pos || "ST").toUpperCase();

  if (pUpper === "GK") {
    // Thủ môn: Phản xạ (Reflexes), Bắt bóng (Handling), Phát bóng (Kicking), Chọn vị trí (Positioning)
    attr1 = 56; attr2 = 55; attr3 = 54; attr4 = 55;
    stam = 55; form = 58;
  } else if (pUpper === "CB") {
    // Trung vệ: Tăng DEF & PHY (Tắc bóng, Sức mạnh/PHY, Không chiến, Đọc tình huống)
    attr1 = 58; attr2 = 56; attr3 = 54; attr4 = 52;
    stam = 56; form = 58;
  } else if (pUpper === "LB" || pUpper === "RB") {
    // Hậu vệ cánh: Tăng PAC, Crossing, DEF, Thể lực
    attr1 = 60; attr2 = 54; attr3 = 52; attr4 = 54;
    stam = 58; form = 58;
  } else if (pUpper === "CDM") {
    // Tiền vệ phòng ngự: Tăng DEF, PHY, Chuyền dài
    attr1 = 56; attr2 = 56; attr3 = 54; attr4 = 54;
    stam = 56; form = 58;
  } else if (pUpper === "CM") {
    // Tiền vệ trung tâm: Tăng PAS, DRI, Nhãn quan
    attr1 = 56; attr2 = 54; attr3 = 55; attr4 = 55;
    stam = 56; form = 58;
  } else if (pUpper === "CAM") {
    // Tiền vệ công: Tăng PAS, DRI, Nhãn quan, Sút xa
    attr1 = 57; attr2 = 56; attr3 = 54; attr4 = 53;
    stam = 54; form = 58;
  } else if (pUpper === "LM" || pUpper === "RM") {
    // Tiền vệ cánh: Tăng PAC, DRI, Tạt bóng
    attr1 = 60; attr2 = 54; attr3 = 54; attr4 = 52;
    stam = 56; form = 58;
  } else if (pUpper === "LW" || pUpper === "RW") {
    // Tiền đạo cánh: Tăng PAC, DRI, Dứt điểm
    attr1 = 60; attr2 = 56; attr3 = 54; attr4 = 50;
    stam = 55; form = 58;
  } else if (pUpper === "ST" || pUpper === "CF") {
    // Tiền đạo cắm: Tăng SHO (55), Tốc độ (58), Chuyền/Rê (51), Phòng thủ/Thể chất (56)
    attr1 = 55; attr2 = 58; attr3 = 51; attr4 = 56;
    stam = 55; form = 58;
  } else if (pUpper === "DF") {
    attr1 = 57; attr2 = 55; attr3 = 55; attr4 = 53;
    stam = 56; form = 58;
  } else if (pUpper === "MF") {
    attr1 = 56; attr2 = 55; attr3 = 55; attr4 = 54;
    stam = 56; form = 58;
  } else {
    // Default FW
    attr1 = 55; attr2 = 58; attr3 = 51; attr4 = 56;
    stam = 55; form = 58;
  }

  const finalName = (customName && customName.trim()) 
    ? customName.trim() 
    : (getRandomPlayerNameByNat(nationality.id) || "Tân Binh Vô Danh");

  const initialFaceStats = getInitialStatsForPosition ? getInitialStatsForPosition(pos) : {
    pac: 55, sho: 55, pas: 55, dri: 55, def: 55, phy: 55
  };
  const initialSubStats = generateSubStatsFromFaceStats(initialFaceStats, pos);

  return {
    name: finalName,
    nationality: nationality,
    academy: academy,
    position: pos || "ST", // GK, CB, LB, RB, CDM, CM, CAM, LM, RM, LW, RW, ST
    positionGroup: getPositionGroup(pos),
    age: 16,
    year: 2026,
    seasonCount: 1,
    seasonsPlayed: 0,
    
    // 6 Face Stats (FIFA / EA FC standard)
    stats: initialFaceStats,

    // 29 Detailed Sub-Attributes (EA FC 26 standard)
    subStats: initialSubStats,

    // Hệ thống Điểm Tiềm Năng Thủ Công (Manual Skill Points Allocation)
    skillPoints: 0,
    totalSkillPointsEarned: 0,

    // 4 Position-specific core attributes (0-99)
    attr1,
    attr2,
    attr3,
    attr4,

    // General attributes
    stam,        // Thể lực (Fitness)
    form,        // Phong độ (Form)
    fame: 10,    // Danh tiếng (Fame)
    morale: 85,  // Tinh thần (Morale)
    
    // Transfermarkt Market Value (€)
    marketValue: 15000000,    // €15M starting value at 16
    peakMarketValue: 15000000,// Peak market value achieved in career

    money: 10000,
    salary: 300, // Lương tuần (€ / week) ở học viện
    currentClub: null,
    isAcademyStage: true,
    currentEuroStatus: "NONE", // "C1", "C2", "C3", "NONE"
    nextSeasonEuroStatus: "NONE",

    // Qualification flags for Super Cups & Club World Cup
    wonLeagueLastSeason: false,
    wonMainCupLastSeason: false,
    wonEuroC1LastSeason: false,
    wonEuroC2LastSeason: false,
    lastSeasonLeagueRank: 10,

    // ── SINGLE SOURCE OF TRUTH: Career Totals ──────────────────────────────
    careerStats: {
      matches:     0,
      goals:       0,
      assists:     0,
      cleanSheets: 0,
      saves:       0,
      tackles:     0,
    },

    // ── Per-Season Stats (reset to 0 every new season) ──────────────────────
    currentSeasonStats: {
      matches:     0,
      goals:       0,
      assists:     0,
      cleanSheets: 0,
      saves:       0,
      tackles:     0,
    },

    // ── Season-by-season history snapshots ─────────────────────────────────
    seasonHistory: [],

    // ── Legacy aliases (kept for backward-compat with ui.js display calls) ─
    totalCareerMatches: 0,
    totalCareerGoals: 0,
    totalCareerAssists: 0,
    totalCareerCleanSheets: 0,
    totalCareerSaves: 0,
    totalCareerTackles: 0,

    // Records & Milestones tracking
    uclGoals: 0,           // Total goals in UEFA Champions League
    seasonMaxGoals: 0,     // Highest goals in a single season
    brokenRecords: [],     // Array of broken record IDs: ['rec_ballondor', ...]
    selectedPostCareer: null, // 'MANAGER', 'PUNDIT', 'OWNER'

    // Club & International Split
    clubMatches: 0,
    clubGoals: 0,
    clubAssists: 0,
    intlCaps: 0,
    intlGoals: 0,
    intlCleanSheets: 0,

    // Individual Annual Awards tracking
    goldenShoeWins: 0,
    fifaTheBestWins: 0,
    goldenGloveWins: 0,
    fifproWorld11Wins: 0,

    // Ballon d'Or Statistics
    ballonDorWins: 0,
    ballonDorTop3: 0,
    ballonDorTop30: 0,

    // Rivalry System (Strictly initialized at 0)
    rival: rival,

    // Lifestyle, Equipment, Subscriptions & Assets (Buff System)
    equipment: [],       // Array of item IDs: ['eq_boots', 'eq_shinguards', ...]
    subscriptions: [],   // Array of active subscription IDs: ['sub_psychologist', ...]
    assets: [],          // Array of asset IDs: ['ast_villa', 'ast_apt_london', ...]
    activeSponsor: null, // Legacy ID of active sponsorship contract
    activeSponsorships: [], // Array of active commercial sponsorship contracts
    activeAgent: "agent_family", // ID of active player agent

    // ── Tactical Stance: 'ATTACKING' | 'BALANCED' | 'DEFENSIVE_COUNTER' ────
    tactic: 'BALANCED',

    // ── Long-term Injury State & Cooldown Immunity ─────────────────────────
    injury: {
      isInjured:         false,
      name:              null,
      severity:          'LIGHT',   // 'LIGHT' | 'MEDIUM' | 'CRITICAL'
      phasesRemaining:   0,
      riskOfRecurrence:  0,         // 0.0 – 1.0 probability
    },
    injuryCooldown:      0,         // Số chặng được miễn nhiễm hoàn toàn sau khi khỏi chấn thương

    // ── Career Chronicle (Nhật Ký Sự Nghiệp & Timeline Badges) ─────────────
    careerChronicleLog:  [],        // Mảng các sự kiện cột mốc có cấu trúc & huy hiệu
    achievedMilestones:  {},        // Bản đồ ghi nhận các cột mốc đã mở khóa (first_goal, first_hattrick, ...)

    // ── Media & Fan Reaction Hub (Dư Luận & Mạng Xã Hội) ─────────────────────
    mediaFeed:           [],        // Mảng tin tức truyền thông, phản ứng fan và trích dẫn phỏng vấn (tối đa 40-50 tin)

    // ── Multi-Tier Competition System (Đấu Trường Đa Cấp Độ) ────────────────
    competitionTier: {
      currentTier:          3,      // 1: Top 5 & C1 | 2: Hạng Nhất & C2 | 3: Giải trẻ / MLS / Saudi
      tierName:             'Tier 3: Giải Trẻ & Đào Tạo',
      clubPrestige:         35,     // Thang danh vọng CLB: 0 - 100
      qualificationStatus:  'YOUTH_LEAGUE',
      relegationThreat:     false,
      tierDifficultyFactor: 0.80
    },

    // ── Fixture-by-Fixture League & Cup Simulation System ─────────────────
    currentSeasonFixtures: [], // Mảng danh sách các vòng đấu/trận đấu trọn vẹn của mùa giải
    currentFixtureIndex:   0,  // Chỉ số vòng/trận đấu hiện tại trong mùa (0, 1, 2, ... N)
    leagueTable:           [], // Bảng xếp hạng trực tiếp của giải VĐQG (20 hoặc 18 đội)
    leagueTopScorers:      [], // Bảng xếp hạng Vua phá lưới toàn giải (so kè trực tiếp với siêu sao)
    preMatchPrep:          'NONE', // 'NONE' | 'REST' | 'VIDEO_ANALYSIS' | 'LIGHT_TRAIN' | 'INTENSE_DRILL'
    tactic:                'BALANCED', // 'ATTACKING' | 'GEGENPRESSING' | 'BALANCED' | 'DEFENSIVE_COUNTER' | 'PARK_THE_BUS'

    // ── Tournament Brackets & Continental Group Table ───────────────────────
    tournamentBrackets: {
      domesticCup: null,    // Sơ đồ phân nhánh Cúp Quốc Gia (Tứ kết -> Bán kết -> Chung kết)
      continentalCup: null  // Sơ đồ phân nhánh Cúp Châu Âu (UCL / UEL)
    },
    cupStats: {
      domesticCup: { goals: 0, assists: 0, matches: 0 },
      continentalCup: { goals: 0, assists: 0, matches: 0 },
      summerTournament: { goals: 0, assists: 0, matches: 0 }
    },
    continentalGroupTable: [], // Bảng xếp hạng 4 đội vòng bảng Cúp C1/C2
    activeLeagueTableFilter: 'LEAGUE', // 'LEAGUE' | 'CONTINENTAL'

    // ── Manager Trust & Squad Role System (Niềm Tin HLV & Phòng Thay Đồ) ─
    managerTrust: 70, // 0 - 100 (Khởi điểm 70 tín nhiệm)
    squadRole: 'KEY_PLAYER', // 'KEY_PLAYER' | 'ROTATION' | 'BENCH' | 'TRANSFER_LISTED'
    consecutiveBadMatches: 0, // Đếm số trận liên tiếp rating < 6.0
    pressConferencePending: null, // Sự kiện họp báo sau trận đang chờ phản hồi

    // ── Summer Tournament Mode (Vòng Chung Kết Mùa Hè World Cup / Cúp Châu Lục) ─
    summerTournament: null, // { tourneyName, type, groupStage, brackets, currentMatchIndex, isFinished }


    // Trophies & Honors (Unified Map)
    trophiesTotal: 0,
    trophiesTally: {},
    top4Finishes: 0,
    clubsHistory: [`${academy.icon} ${academy.name} (${academy.flag} Lò Trẻ)`],
    isRetired: false,

    // ── FCS Ultimate Card (FC 26 Style) ──────────────────────────────────
    baseRating: 55,
    ovr: 55,
    cardTheme: 'future', // 'future' | 'future_stars' | 'gold' | 'icon' | 'toty' | 'tots'
    cardAvatar: 'avatar_fade', // ID trong CARD_AVATARS (cardAvatars.js)
    customAvatarUrl: '', // URL ảnh khuôn mặt cầu thủ tự chọn (PNG trong suốt)

    // ── Player Traits: Foot, Weak Foot & Skill Moves (EA FC Style) ───────
    preferredFoot: 'Right', // 'Right' | 'Left'
    weakFoot: (pos === 'GK' ? 2 : (['CB', 'DF', 'LB', 'RB'].includes(pos) ? 3 : 4)), // 1 - 5 ⭐
    skillMoves: (pos === 'GK' ? 1 : (['CB', 'DF', 'LB', 'RB'].includes(pos) ? 2 : 3)), // 1 - 6 ⭐ (6 = Trickster+)
    weakFootTrainProgress: 0,   // Số buổi tập tích lũy để thăng cấp sao chân nghịch (cần 5)
    skillMovesTrainProgress: 0,  // Số buổi tập tích lũy để thăng cấp sao kỹ thuật (cần 6)

    // ── Dynamic Performance Growth (FC Style) ────────────────────────────
    growthExp: 0,              // Điểm EXP tăng trưởng tích lũy hiện tại (0 - 1000)
    growthExpTarget: 1000,      // Ngưỡng EXP để thăng cấp chỉ số
    growthLevel: 1,            // Cấp độ phát triển cầu thủ
    consecutiveGoodMatches: 0, // Chuỗi trận thăng hoa (Rating >= 7.5)
    consecutiveBadMatches: 0   // Chuỗi trận sa sút (Rating < 6.0)
  };
}

export const gameState = {
  player: createInitialPlayer(),
  selectedPos: "ST",
  selectedNatId: "VN",
  selectedAcademyId: "pvf_academy",
  currentActiveTab: "tabMatchday",
  isSimulating: false
};

export function getPlayer() {
  return gameState.player;
}

export function setPlayer(newPlayer) {
  gameState.player = newPlayer;
}

export function resetPlayerState(name, natId, pos = "ST", academyId = null) {
  gameState.player = createInitialPlayer(name, natId, pos, academyId);
  gameState.player.cardTheme = 'future';
  gameState.player.baseRating = 55;
  gameState.player.ovr = 55;
  gameState.selectedPos = pos || "ST";
  gameState.selectedNatId = natId || "VN";
  gameState.selectedAcademyId = academyId || (gameState.player.academy ? gameState.player.academy.id : null);
  gameState.currentActiveTab = "tabMatchday";
  gameState.isSimulating = false;
  return gameState.player;
}
