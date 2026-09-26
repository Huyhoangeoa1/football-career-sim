/**
 * PLAYER ENGINE
 * Quản lý chỉ số cầu thủ, OVR, thể lực, chấn thương, hợp đồng,
 * tăng trưởng động (dynamic growth), tác động sau trận và GOAT score.
 */

import {
  POSITION_CONFIG,
  LIFESTYLE_CATALOG,
  FIFA_STATS,
  getInitialStatsForPosition,
  SPONSORSHIP_CATEGORIES,
  SPONSORSHIP_BRANDS,
  AGENTS_DATA,
  SUB_STATS_CONFIG,
  generateSubStatsFromFaceStats,
  generateInitialSubStats,
  rollInitialFootAndSkills,
  syncFaceStatsFromSubStats,
  syncSubStatsFromFaceStats,
  getSubStat,
  MAX_STAT_LIMIT
} from './data.js';

export {
  SUB_STATS_CONFIG,
  generateSubStatsFromFaceStats,
  generateInitialSubStats,
  rollInitialFootAndSkills,
  syncFaceStatsFromSubStats,
  syncSubStatsFromFaceStats,
  getSubStat,
  MAX_STAT_LIMIT
};
import { logCareerEvent } from './mediaEngine.js';
import { saveGame } from './storage.js';

/* =========================================================================
   FAME TIERS & MILESTONES SYSTEM (Hệ Thống Mốc Danh Vọng Không Giới Hạn)
   ========================================================================= */
export const FAME_TIERS = [
  { tierIndex: 1, min: 0, max: 199, badge: '⚪', title: 'Tân Binh Vô Danh', label: '⚪ Tân Binh Vô Danh' },
  { tierIndex: 2, min: 200, max: 499, badge: '🟢', title: 'Mầm Non Triển Vọng', label: '🟢 Mầm Non Triển Vọng' },
  { tierIndex: 3, min: 500, max: 999, badge: '🔵', title: 'Thần Đồng Trẻ Tuổi', label: '🔵 Thần Đồng Trẻ Tuổi' },
  { tierIndex: 4, min: 1000, max: 1999, badge: '🟣', title: 'Ngôi Sao Quốc Nội', label: '🟣 Ngôi Sao Quốc Nội' },
  { tierIndex: 5, min: 2000, max: 3999, badge: '🟡', title: 'Tên Tuổi Châu Lục', label: '🟡 Tên Tuổi Châu Lục' },
  { tierIndex: 6, min: 4000, max: 6999, badge: '🟠', title: 'Đẳng Cấp Thế Giới', label: '🟠 Đẳng Cấp Thế Giới' },
  { tierIndex: 7, min: 7000, max: 11999, badge: '🔴', title: 'Siêu Sao Toàn Cầu', label: '🔴 Siêu Sao Toàn Cầu' },
  { tierIndex: 8, min: 12000, max: 19999, badge: '👑', title: 'Biểu Tượng Đương Đại', label: '👑 Biểu Tượng Đương Đại' },
  { tierIndex: 9, min: 20000, max: Infinity, badge: '🌌', title: 'Huyền Thoại Bất Tử (GOAT)', label: '🌌 Huyền Thoại Bất Tử (GOAT)' }
];

/**
 * Trả về thông tin phân tầng Danh Vọng chi tiết theo điểm tích lũy
 * @param {number} famePoints 
 * @returns {{ tierIndex: number, title: string, badge: string, min: number, max: number, nextTierTitle: string|null, nextTierPoints: number|null, progressPercent: number, currentPoints: number, label: string }}
 */
export function getFameTier(famePoints = 0) {
  const pts = Math.max(0, Number(famePoints) || 0);
  const tierIndex = FAME_TIERS.findIndex(t => pts >= t.min && pts <= t.max);
  const currentTier = tierIndex !== -1 ? FAME_TIERS[tierIndex] : FAME_TIERS[FAME_TIERS.length - 1];
  const nextTier = tierIndex !== -1 && tierIndex < FAME_TIERS.length - 1 ? FAME_TIERS[tierIndex + 1] : null;

  let progressPercent = 100;
  let nextTierTitle = null;
  let nextTierPoints = null;

  if (nextTier) {
    nextTierTitle = nextTier.title;
    nextTierPoints = nextTier.min;
    const tierRange = nextTier.min - currentTier.min;
    const progressInTier = pts - currentTier.min;
    progressPercent = Math.min(100, Math.max(0, Math.round((progressInTier / tierRange) * 100)));
  }

  return {
    tierIndex: currentTier.tierIndex,
    title: currentTier.title,
    badge: currentTier.badge,
    min: currentTier.min,
    max: currentTier.max,
    nextTierTitle,
    nextTierPoints,
    progressPercent,
    currentPoints: pts,
    label: `${currentTier.badge} ${currentTier.title}`
  };
}

export const TACTIC_CONFIG = {
  ATTACKING: {
    id: 'ATTACKING',
    name: '⚔️ Tấn Công Áp Đặt',
    ratingBonus: +6,    // ratingBonus: +6
    stamCostMult: 1.30,  // stamCostMult: 1.30
    cleanSheetMult: 0.80,  // cleanSheetMult: 0.80
    goalMult: 1.15,
    assistMult: 1.15,
    injuryRiskAdd: 0.08,
    winChanceAdd: 0.05,
    tackleMult: 0.90,
  },
  GEGENPRESSING: {
    id: 'GEGENPRESSING',
    name: '🔥 Gegenpressing',
    ratingBonus: +9,    // ratingBonus: +9
    stamCostMult: 1.45,  // stamCostMult: 1.45
    cleanSheetMult: 0.90,  // cleanSheetMult: 0.90
    goalMult: 1.25,
    assistMult: 1.25,
    injuryRiskAdd: 0.15,  // Tiêu hao thể lực rất cao, rủi ro chấn thương cao
    winChanceAdd: 0.08,
    tackleMult: 1.30,  // Tăng mạnh cơ hội tắc bóng
  },
  BALANCED: {
    id: 'BALANCED',
    name: '⚖️ Cân Bằng',
    ratingBonus: 0,     // ratingBonus: 0
    stamCostMult: 1.00,  // stamCostMult: 1.00
    cleanSheetMult: 1.00,  // cleanSheetMult: 1.00
    goalMult: 1.0,
    assistMult: 1.0,
    injuryRiskAdd: 0,
    winChanceAdd: 0,
    tackleMult: 1.0,
  },
  DEFENSIVE_COUNTER: {
    id: 'DEFENSIVE_COUNTER',
    name: '🛡️ Phản Công Nhanh',
    ratingBonus: -3,    // ratingBonus: -3
    stamCostMult: 0.70,  // stamCostMult: 0.70
    cleanSheetMult: 1.35,  // cleanSheetMult: 1.35
    goalMult: 0.85,
    assistMult: 0.90,
    injuryRiskAdd: -0.05,
    winChanceAdd: 0.06,
    tackleMult: 1.10,
  },
  PARK_THE_BUS: {
    id: 'PARK_THE_BUS',
    name: '🚌 Dựng Xe Buýt',
    ratingBonus: -6,    // ratingBonus: -6
    stamCostMult: 0.55,  // stamCostMult: 0.55
    cleanSheetMult: 1.60,  // cleanSheetMult: 1.60 (Bảo toàn thể lực tối đa, giữ sạch lưới)
    goalMult: 0.65,
    assistMult: 0.70,
    injuryRiskAdd: -0.08,
    winChanceAdd: 0.02,
    tackleMult: 1.25,
  },
};

/**
 * Áp dụng hệ số chiến thuật lên `combinedRating` và trả về object modifiers.
 * @param {object} player
 * @param {number} baseCombinedRating
 * @returns {{ adjustedRating: number, cfg: object }}
 */
export function applyTacticalModifiers(player, baseCombinedRating) {
  const tactic = player.tactic || 'BALANCED';
  const cfg = TACTIC_CONFIG[tactic] || TACTIC_CONFIG.BALANCED;
  const adjustedRating = Math.min(99, Math.max(30, baseCombinedRating + cfg.ratingBonus));
  return { adjustedRating, cfg };
}

export const INJURY_TYPES = {
  LIGHT: [
    { name: 'Đau Cơ Đùi Trước', severity: 'LIGHT', phasesRemaining: 1, riskOfRecurrence: 0.08 },
    { name: 'Bong Gân Mắt Cá Chân', severity: 'LIGHT', phasesRemaining: 1, riskOfRecurrence: 0.10 },
    { name: 'Bầm Tím Cơ Khép', severity: 'LIGHT', phasesRemaining: 1, riskOfRecurrence: 0.06 },
  ],
  MEDIUM: [
    { name: 'Căng Cơ Bắp Chân', severity: 'MEDIUM', phasesRemaining: 2, riskOfRecurrence: 0.16 },
    { name: 'Rách Cơ Gân Kheo (Hamstring)', severity: 'MEDIUM', phasesRemaining: 2, riskOfRecurrence: 0.18 },
    { name: 'Giãn Dây Chằng Cổ Chân', severity: 'MEDIUM', phasesRemaining: 2, riskOfRecurrence: 0.15 },
  ],
  CRITICAL: [
    { name: 'Đứt Dây Chằng Chéo Trước (ACL)', severity: 'CRITICAL', phasesRemaining: 4, riskOfRecurrence: 0.30 },
    { name: 'Nứt Xương Bàn Chân (Metatarsal)', severity: 'CRITICAL', phasesRemaining: 3, riskOfRecurrence: 0.22 },
    { name: 'Rách Sụn Chêm Khớp Gối', severity: 'CRITICAL', phasesRemaining: 3, riskOfRecurrence: 0.25 },
  ]
};

/**
 * Kiểm tra nguy cơ chấn thương theo chiến thuật và thể lực với Cơ chế Bảo vệ Tân thủ và Cooldown.
 * Trả về đối tượng chấn thương hoặc null.
 * @param {object} player
 * @returns {{ name: string, severity: string, phasesRemaining: number, riskOfRecurrence: number } | null}
 */
export function rollInjuryChance(player) {
  if (!player) return null;

  // 1. COOLDOWN MIỄN NHIỄM: Sau khi vừa khỏi chấn thương, miễn nhiễm hoàn toàn ít nhất 2 chặng
  if (player.injuryCooldown && player.injuryCooldown > 0) {
    return null;
  }

  // 2. CƠ CHẾ TÂN THỦ (ROOKIE GRACE PERIOD):
  // Trong suốt Mùa giải 1 hoặc khi cầu thủ <= 18 tuổi hoặc đang ở Học viện, tỷ lệ chấn thương tuyệt đối bằng 0%
  const isRookie = Boolean(
    player.isAcademyStage ||
    (player.age && player.age <= 18) ||
    (player.seasonsPlayed !== undefined && player.seasonsPlayed <= 1) ||
    (player.seasonCount !== undefined && player.seasonCount <= 1)
  );
  if (isRookie) {
    return null;
  }

  // Nếu đang chấn thương chưa khỏi thì không dính chấn thương chồng
  if (player.injury && player.injury.isInjured && player.injury.phasesRemaining > 0) {
    return null;
  }

  const stam = player.stam !== undefined ? player.stam : 100;
  const tactic = player.tactic || 'BALANCED';
  const cfg = TACTIC_CONFIG[tactic] || TACTIC_CONFIG.BALANCED;
  const hasGuard = player.equipment && player.equipment.includes('eq_shinguards');
  const guardBonus = hasGuard ? 0.02 : 0; // Giảm 2% rủi ro chấn thương

  // 3. ĐIỀU KIỆN KÍCH HOẠT THEO THỂ LỰC (STAMINA-BASED RISK CURVE):
  let injuryChance = 0;
  if (stam >= 70) {
    // Stamina >= 70%: Miễn nhiễm hoặc tỷ lệ tối đa 1% (tùy mức độ rủi ro chiến thuật)
    injuryChance = hasGuard ? 0.0 : 0.006;
    if (cfg.injuryRiskAdd) injuryChance += cfg.injuryRiskAdd * 0.04;
  } else if (stam >= 35) {
    // 35% <= Stamina < 70%: Tỷ lệ cơ bản 2 - 5% (tăng/giảm theo rủi ro chiến thuật)
    const ratio = (70 - stam) / 35; // 0.0 -> 1.0
    injuryChance = 0.02 + ratio * 0.03; // Dao động 2% -> 5%
    if (cfg.injuryRiskAdd) {
      injuryChance += cfg.injuryRiskAdd * 0.15;
    }
    injuryChance = Math.max(0.005, injuryChance - guardBonus);
  } else {
    // Stamina < 35%: Báo động kiệt sức nguy hiểm, tỷ lệ chấn thương tăng vọt lên 15 - 25%
    const ratio = (35 - Math.max(0, stam)) / 35; // 0.0 -> 1.0
    injuryChance = 0.15 + ratio * 0.10; // Dao động 15% -> 25%
    if (cfg.injuryRiskAdd) {
      injuryChance += cfg.injuryRiskAdd * 0.20;
    }
    injuryChance = Math.max(0.10, injuryChance - guardBonus);
  }

  const roll = Math.random();
  if (roll >= injuryChance) {
    return null; // Không bị thương
  }

  let pool = INJURY_TYPES.LIGHT;
  if (stam < 35) {
    pool = Math.random() < 0.65 ? INJURY_TYPES.CRITICAL : INJURY_TYPES.MEDIUM;
  } else if (stam < 50 || roll < 0.02) {
    pool = Math.random() < 0.70 ? INJURY_TYPES.MEDIUM : INJURY_TYPES.LIGHT;
  } else {
    pool = INJURY_TYPES.LIGHT;
  }

  const chosen = pool[Math.floor(Math.random() * pool.length)];
  return { ...chosen };
}

/**
 * Đồng bộ các trường chỉ số phụ attr1..attr4 cho các module cũ
 * @param {object} player 
 */
export function syncLegacyAttrs(player) {
  if (!player || !player.stats) return;
  const p = (player.position || 'ST').toUpperCase();
  if (p === 'GK') {
    player.attr1 = player.stats.def;
    player.attr2 = player.stats.phy;
    player.attr3 = player.stats.pas;
    player.attr4 = player.stats.dri;
  } else if (p === 'CB' || p === 'DF') {
    player.attr1 = player.stats.def;
    player.attr2 = player.stats.phy;
    player.attr3 = player.stats.pac;
    player.attr4 = player.stats.pas;
  } else if (p === 'LB' || p === 'RB') {
    player.attr1 = player.stats.pac;
    player.attr2 = player.stats.def;
    player.attr3 = player.stats.pas;
    player.attr4 = player.stats.phy;
  } else if (p === 'CDM') {
    player.attr1 = player.stats.def;
    player.attr2 = player.stats.phy;
    player.attr3 = player.stats.pas;
    player.attr4 = player.stats.dri;
  } else if (p === 'CM' || p === 'MF') {
    player.attr1 = player.stats.pas;
    player.attr2 = player.stats.dri;
    player.attr3 = player.stats.sho;
    player.attr4 = player.stats.phy;
  } else if (p === 'CAM') {
    player.attr1 = player.stats.pas;
    player.attr2 = player.stats.dri;
    player.attr3 = player.stats.sho;
    player.attr4 = player.stats.pac;
  } else if (p === 'LM' || p === 'RM') {
    player.attr1 = player.stats.pac;
    player.attr2 = player.stats.pas;
    player.attr3 = player.stats.dri;
    player.attr4 = player.stats.sho;
  } else if (p === 'LW' || p === 'RW') {
    player.attr1 = player.stats.pac;
    player.attr2 = player.stats.dri;
    player.attr3 = player.stats.sho;
    player.attr4 = player.stats.pas;
  } else {
    // ST / CF / FW
    player.attr1 = player.stats.sho;
    player.attr2 = player.stats.pac;
    player.attr3 = player.stats.pas;
    player.attr4 = player.stats.dri;
  }
}

/**
 * Đảm bảo player.stats có đủ 6 chỉ số chuẩn FIFA: pac, sho, pas, dri, def, phy
 * @param {object} player 
 * @returns {object}
 */
export function ensurePlayerStats(player) {
  if (!player) return null;
  const pUpper = String(player.position || "ST").toUpperCase();
  const defStats = getInitialStatsForPosition ? getInitialStatsForPosition(pUpper) : {
    pac: 55, sho: 55, pas: 55, dri: 55, def: 55, phy: 55
  };

  if (!player.stats || typeof player.stats !== 'object') {
    player.stats = { ...defStats };
  }

  const statKeys = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
  statKeys.forEach(k => {
    if (player.stats[k] === undefined || player.stats[k] === null || isNaN(Number(player.stats[k]))) {
      player.stats[k] = defStats[k] !== undefined ? defStats[k] : 55;
    } else {
      player.stats[k] = parseFloat(Number(player.stats[k]).toFixed(2));
    }
  });

  // Đảm bảo cấu trúc 29 chỉ số con (subStats) luôn đầy đủ và hợp lệ
  if (!player.subStats || typeof player.subStats !== 'object') {
    player.subStats = generateSubStatsFromFaceStats(player.stats, player.position);
  } else {
    for (const [groupKey, groupConf] of Object.entries(SUB_STATS_CONFIG)) {
      const baseFace = Number(player.stats[groupKey]) || 55;
      groupConf.stats.forEach(s => {
        if (player.subStats[s.key] === undefined || player.subStats[s.key] === null || isNaN(Number(player.subStats[s.key]))) {
          player.subStats[s.key] = Math.max(1, Math.min(MAX_STAT_LIMIT, Math.round(baseFace)));
        } else {
          player.subStats[s.key] = Math.max(1, Math.min(MAX_STAT_LIMIT, Math.round(Number(player.subStats[s.key]))));
        }
      });
    }
  }

  syncLegacyAttrs(player);
  return player.stats;
}

/**
 * Tính toán OVR tổng thể dựa trên trọng số chuẩn của 6 chỉ số FIFA theo vị trí thi đấu
 * @param {object} player 
 * @returns {number}
 */
export function calculateOVR(player) {
  if (!player) return 50;
  ensurePlayerStats(player);
  const pUpper = String(player.position || "ST").toUpperCase();
  const posConf = POSITION_CONFIG[pUpper] || POSITION_CONFIG.ST;
  const weights = posConf.statWeights || {
    pac: 0.166, sho: 0.167, pas: 0.167, dri: 0.167, def: 0.166, phy: 0.167
  };
  const s = player.stats;
  const weighted = (
    (s.pac || 50) * (weights.pac || 0.166) +
    (s.sho || 50) * (weights.sho || 0.167) +
    (s.pas || 50) * (weights.pas || 0.167) +
    (s.dri || 50) * (weights.dri || 0.167) +
    (s.def || 50) * (weights.def || 0.166) +
    (s.phy || 50) * (weights.phy || 0.167)
  );
  return Math.max(10, Math.min(MAX_STAT_LIMIT, Math.round(weighted)));
}

export function getOverallPower(player) {
  if (!player) return 50;
  ensurePlayerStats(player);
  const baseAvg = calculateOVR(player);
  const pForm = Number(player.form ?? 60);
  const pMorale = Number(player.morale ?? 70);
  let formBonus = (pForm - 50) * 0.15;
  let moraleBonus = (pMorale - 50) * 0.1;

  if (Array.isArray(player.subscriptions) && player.subscriptions.includes("sub_psychologist")) {
    moraleBonus += 3;
    formBonus += 2;
  }

  const res = Math.round(baseAvg + formBonus + moraleBonus);
  return Math.max(10, Math.min(MAX_STAT_LIMIT, isNaN(res) ? Math.round(baseAvg) : res));
}

export function calculateNetWorth(player) {
  let totalEquipVal = 0;
  player.equipment.forEach(id => {
    const item = LIFESTYLE_CATALOG.equipment.find(e => e.id === id);
    if (item) totalEquipVal += item.cost;
  });

  let totalAssetsVal = 0;
  player.assets.forEach(id => {
    const asset = LIFESTYLE_CATALOG.assets.find(a => a.id === id);
    if (asset) totalAssetsVal += asset.cost;
  });

  return player.money + totalEquipVal + totalAssetsVal;
}

export function clampStats(player) {
  if (!player) return;
  ensurePlayerStats(player);
  ['pac', 'sho', 'pas', 'dri', 'def', 'phy'].forEach(k => {
    player.stats[k] = Math.max(10, Math.min(MAX_STAT_LIMIT, player.stats[k]));
  });
  syncLegacyAttrs(player);

  player.stam = Math.max(5, Math.min(100, player.stam !== undefined ? player.stam : (player.stamina !== undefined ? player.stamina : 80)));
  player.stamina = player.stam;
  player.fame = Math.max(0, typeof player.fame === 'number' ? player.fame : 0);
  player.form = Math.max(10, Math.min(99, player.form));
  player.morale = Math.max(10, Math.min(99, player.morale));

  if (Array.isArray(player.subscriptions) && player.subscriptions.includes("sub_psychologist")) {
    player.morale = Math.max(85, player.morale);
  }
}

/**
 * HỒI PHỤC THỂ LỰC TỰ NHIÊN GIỮA CÁC TRẬN ĐẤU (BETWEEN-MATCH STAMINA RECOVERY)
 * Lượng hồi phục sau 1 tuần nghỉ ngơi giữa 2 vòng đấu:
 * 1. Cơ bản: +50 thể lực.
 * 2. Thưởng Thể chất (PHY): Math.floor(player.stats.phy * 0.25).
 * 3. Buff trang bị & dịch vụ (Theragun +5, Dinh dưỡng, Đầu bếp, Đồng hồ sinh học...).
 * 4. Giới hạn trần 100%. Không bao giờ để thể lực bắt đầu trận sau bị kẹt ở mức 10%.
 * @param {object} player 
 * @returns {{ recoveredAmount: number, oldStamina: number, newStamina: number, totalRecovery: number, baseRecovery: number, phyBonus: number, gearBonus: number, msg: string }}
 */
export function recoverStaminaBetweenMatches(player) {
  if (!player) {
    return { recoveredAmount: 0, oldStamina: 100, newStamina: 100, totalRecovery: 50, baseRecovery: 50, phyBonus: 0, gearBonus: 0, msg: "" };
  }

  ensurePlayerStats(player);

  // 1. Lượng hồi phục cơ bản sau một tuần nghỉ: +50 thể lực
  const baseRecovery = 50;

  // 2. Thưởng thêm dựa trên chỉ số Thể chất (PHY): Math.floor(player.stats.phy * 0.25)
  const phyVal = Number(player.stats?.phy ?? player.phy ?? player.attr2 ?? 55);
  const phyBonus = Math.floor(phyVal * 0.25);

  // 3. Cộng thêm các buff trang bị & dịch vụ sinh hoạt nếu có (Theragun +5, Khóa học dinh dưỡng, Đầu bếp...)
  let gearBonus = 0;
  const eqList = Array.isArray(player.equipment) ? player.equipment : [];
  const subList = Array.isArray(player.subscriptions) ? player.subscriptions : [];

  // Súng massage Theragun (+5 thể lực hồi phục sau mỗi trận đấu)
  if (eqList.includes('eq_theragun') || eqList.includes('eq_massage_gun') || eqList.includes('eq_massage_gun_pro')) {
    gearBonus += 5;
  }
  // Đồng hồ sinh học Biometric Elite (+3 thể lực phục hồi)
  if (eqList.includes('eq_smartwatch')) {
    gearBonus += 3;
  }
  // Gói thực đơn suất ăn dinh dưỡng khoa học (Nutrition Plan: +10 thể lực)
  if (subList.includes('sub_nutrition_plan')) {
    gearBonus += 10;
  }
  // Đầu bếp 5 sao & Buồng lạnh Cryotherapy (+8 thể lực)
  if (subList.includes('sub_cryo')) {
    gearBonus += 8;
  }
  // Chuyên viên xoa bóp & vật lý trị liệu (+5 thể lực)
  if (subList.includes('sub_physiotherapist')) {
    gearBonus += 5;
  }
  // Thuê chung cư mini gần sân (+3 thể lực)
  if (subList.includes('sub_mini_apt')) {
    gearBonus += 3;
  }

  // Pre-match prep Dưỡng Sức (REST) nếu người chơi kích hoạt (+12 thể lực)
  if (player.preMatchPrep === 'REST') {
    gearBonus += 12;
  }

  const totalRecovery = baseRecovery + phyBonus + gearBonus;

  // Lấy thể lực hiện tại (đồng bộ giữa stam và stamina)
  const currentStamina = Number(player.stamina !== undefined ? player.stamina : (player.stam !== undefined ? player.stam : 80));

  // 4. Đảm bảo giới hạn trần: player.stamina = Math.min(100, player.stamina + totalRecovery)
  let newStamina = Math.min(100, currentStamina + totalRecovery);

  // 5. Đảm bảo không bao giờ để thể lực bắt đầu trận sau bị kẹt ở mức 10%:
  // Cầu thủ luôn có tối thiểu 65% thể lực để sẵn sàng thi đấu vòng kế tiếp
  if (newStamina < 65) {
    newStamina = 65;
  }

  const recoveredAmount = Math.max(0, newStamina - currentStamina);

  // Cập nhật đồng bộ cả hai thuộc tính
  player.stamina = newStamina;
  player.stam = newStamina;

  const msg = `⚡ Đã hồi phục thể lực sau kỳ nghỉ: +${recoveredAmount}% (Hiện tại: ${newStamina}%)`;

  return {
    recoveredAmount,
    oldStamina: currentStamina,
    newStamina,
    totalRecovery,
    baseRecovery,
    phyBonus,
    gearBonus,
    msg
  };
}

export function addTrophy(player, trophyName) {
  if (!player) return;
  if (!player.trophiesTally) player.trophiesTally = {};
  player.trophiesTotal = (player.trophiesTotal || 0) + 1;
  player.careerTrophies = (player.careerTrophies || 0) + 1;
  if (!player.trophies) player.trophies = [];
  if (!player.trophies.includes(trophyName)) {
    player.trophies.push(trophyName);
  }
  if (!player.trophiesTally[trophyName]) {
    player.trophiesTally[trophyName] = 1;
  } else {
    player.trophiesTally[trophyName] += 1;
  }
}

/* =========================================================================
   2. RIVAL DYNAMICS & DERBY OPPONENT MATCHING
   ========================================================================= */

/**
 * 2. CƠ CHẾ ĐIỂM TIỀM NĂNG THỦ CÔNG (MANUAL SKILL POINTS ALLOCATION)
 * Thay thế cơ chế tự động rải điểm ngẫu nhiên sau trận đấu.
 */

/**
 * Tính toán Điểm Tiềm Năng (Skill Points - SP) kiếm được sau trận đấu
 * @param {object} matchResult { rating, goals, assists, cleanSheets }
 * @param {object} player Đối tượng cầu thủ
 * @returns {{ totalSP: number, ratingSP: number, goalSP: number, assistSP: number, cleanSheetSP: number }}
 */
export function calculateEarnedSkillPoints(matchResult = {}, player = null) {
  const rating = Number(matchResult.rating ?? matchResult.liveRating ?? matchResult.matchRating ?? 6.0);
  const goals = Number(matchResult.playerGoals ?? matchResult.goals ?? 0);
  const assists = Number(matchResult.playerAssists ?? matchResult.assists ?? 0);
  const cleanSheets = Number(
    matchResult.playerCleanSheets ??
    matchResult.cleanSheets ??
    (matchResult.cleanSheet ? 1 : 0) ??
    0
  );

  // 1. Dựa trên Điểm Chấm Trận Đấu (Match Rating)
  let ratingSP = 0;
  if (rating >= 10.0) {
    ratingSP = 8;
  } else if (rating >= 9.0) {
    ratingSP = 5;
  } else if (rating >= 8.0) {
    ratingSP = 3;
  } else if (rating >= 7.0) {
    ratingSP = 2;
  } else if (rating >= 6.0) {
    ratingSP = 1;
  } else {
    ratingSP = 0;
  }

  // 2. Thưởng Đột Biến (Bonus Milestones)
  // Mỗi bàn thắng: +1 SP (Cú Hattrick >= 3 bàn nhận thêm +1 SP bonus = tổng 4 SP cho bàn thắng)
  let goalSP = goals;
  if (goals >= 3) {
    goalSP += 1;
  }

  // Mỗi kiến tạo: +1 SP
  const assistSP = assists;

  // Hậu vệ/Thủ môn giữ sạch lưới (Clean Sheet): +2 SP
  let cleanSheetSP = 0;
  if (player && cleanSheets >= 1) {
    const pUpper = String(player.position || 'ST').toUpperCase();
    const isDefOrGk = ['GK', 'DF', 'CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pUpper);
    if (isDefOrGk) {
      cleanSheetSP = 2;
    }
  }

  const totalSP = ratingSP + goalSP + assistSP + cleanSheetSP;

  return {
    totalSP,
    ratingSP,
    goalSP,
    assistSP,
    cleanSheetSP
  };
}

/**
 * Chi phí SP để nâng cấp chỉ số (hỗ trợ Đột Phá Cảnh Giới > 99 lên tối đa 110)
 * - Giai đoạn thường (<= 98 -> 99): 1 SP / 1 điểm
 * - Giai đoạn Đột Phá Trần (99 -> 100): 5 SP
 * - Giai đoạn Vượt Ngưỡng Thần Thoại (100 -> 110):
 *   + 100 -> 101: 7 SP
 *   + 101 -> 102: 10 SP
 *   + 102 -> 103: 14 SP
 *   + 103 -> 104: 18 SP
 *   + 104 -> 105: 24 SP
 *   + 105 -> 110: 30 SP / mỗi điểm
 * - >= 110: Infinity (Trần cứng tuyệt đối)
 * @param {number} currentValue
 * @returns {number}
 */
export function getStatUpgradeCost(currentValue) {
  const val = Math.floor(Number(currentValue) || 50);
  if (val < 99) return 1;
  if (val === 99) return 5;
  if (val === 100) return 7;
  if (val === 101) return 10;
  if (val === 102) return 14;
  if (val === 103) return 18;
  if (val === 104) return 24;
  if (val >= 105 && val < 110) return 30;
  return Infinity;
}

/**
 * Phân bổ Điểm Tiềm Năng (SP) trực tiếp vào 1 trong 29 chỉ số con
 * @param {object} player
 * @param {string} subStatKey Key của chỉ số con (ví dụ: 'finishing', 'sprintSpeed')
 * @param {number} amount Số điểm cần cộng (mặc định 1)
 * @returns {object} Kết quả phân bổ
 */
export function allocateSubStatPoint(player, subStatKey, amount = 1) {
  if (!player) return { success: false, reason: 'Không tìm thấy dữ liệu cầu thủ.' };
  ensurePlayerStats(player);

  const curVal = Number(player.subStats ? player.subStats[subStatKey] : undefined);
  if (isNaN(curVal)) {
    return { success: false, reason: 'Chỉ số con không hợp lệ.' };
  }
  if (curVal >= MAX_STAT_LIMIT) {
    return { success: false, reason: 'Chỉ số này đã chạm ngưỡng tối đa thần thoại (110).' };
  }

  const cost = getStatUpgradeCost(curVal);
  const currentSP = Math.max(0, Number(player.skillPoints) || 0);
  if (currentSP < cost) {
    return {
      success: false,
      cost,
      reason: `Bạn không đủ Điểm Tiềm Năng (SP). Cần ${cost} SP để nâng cấp (Hiện có: ${currentSP} SP).`
    };
  }

  player.skillPoints -= cost;
  player.subStats[subStatKey] = Math.min(MAX_STAT_LIMIT, curVal + 1);

  // Tìm groupKey cha (pac, sho, pas, dri, def, phy)
  let parentGroupKey = null;
  for (const [gKey, gConf] of Object.entries(SUB_STATS_CONFIG)) {
    if (gConf.stats.some(s => s.key === subStatKey)) {
      parentGroupKey = gKey;
      break;
    }
  }

  // Tự động đồng bộ 2 chiều lên 6 chỉ số mặt thẻ Face Stat và OVR
  syncFaceStatsFromSubStats(player);
  syncLegacyAttrs(player);
  player.ovr = calculateOVR(player);

  // Tự động lưu game
  try {
    saveGame(player);
  } catch (err) {
    console.warn('[allocateSubStatPoint] Save error:', err);
  }

  return {
    success: true,
    subStatKey,
    cost,
    newSubStatVal: player.subStats[subStatKey],
    isBreakthrough: player.subStats[subStatKey] >= 100,
    parentGroupKey,
    newParentFaceVal: parentGroupKey ? player.stats[parentGroupKey] : null,
    skillPointsRemaining: player.skillPoints,
    newOVR: player.ovr
  };
}

/**
 * Bảng chi phí nâng cấp Chân Thuận, Chân Nghịch & Kỹ Thuật bằng SP
 */
export const SPECIAL_TRAIT_UPGRADE_COSTS = {
  preferredFootStars: {
    1: 10,
    2: 12,
    3: 15, // 3 -> 4: 15 SP
    4: 25  // 4 -> 5: 25 SP
  },
  weakFoot: {
    1: 10,
    2: 12, // 2 -> 3: 12 SP
    3: 20, // 3 -> 4: 20 SP
    4: 35  // 4 -> 5: 35 SP
  },
  skillMoves: {
    1: 10,
    2: 12,
    3: 15, // 3 -> 4: 15 SP
    4: 25, // 4 -> 5: 25 SP
    5: 50  // 5 -> 6: 50 SP
  }
};

/**
 * Lấy chi phí và trạng thái nâng cấp Kỹ năng đặc biệt bằng SP
 * @param {object} player 
 * @param {string} traitType 'preferredFootStars' | 'weakFoot' | 'skillMoves'
 * @returns {object|null}
 */
export function getSpecialTraitUpgradeCost(player, traitType) {
  if (!player) return null;
  const currentSP = Math.max(0, Number(player.skillPoints) || 0);

  if (traitType === 'preferredFootStars') {
    const cur = Math.max(1, Math.min(5, Number(player.preferredFootStars) || 4));
    if (cur >= 5) {
      return { canUpgrade: false, isMax: true, cost: 0, reason: 'Chân thuận đã đạt tối đa 5⭐.' };
    }
    const cost = SPECIAL_TRAIT_UPGRADE_COSTS.preferredFootStars[cur] || 25;
    return { canUpgrade: currentSP >= cost, isMax: false, cost, nextLevel: cur + 1 };
  }

  if (traitType === 'weakFoot') {
    const cur = Math.max(1, Math.min(5, Number(player.weakFoot) || 3));
    const prefStars = Math.max(1, Math.min(5, Number(player.preferredFootStars) || 4));
    if (cur >= 5) {
      return { canUpgrade: false, isMax: true, cost: 0, reason: 'Chân nghịch đã đạt tối đa 5⭐.' };
    }
    const cost = SPECIAL_TRAIT_UPGRADE_COSTS.weakFoot[cur] || 35;
    if (cur >= prefStars) {
      return {
        canUpgrade: false,
        isMax: false,
        cost,
        nextLevel: cur + 1,
        blockedByPrefFoot: true,
        reason: 'Chân nghịch không thể vượt quá cấp sao chân thuận. Cần nâng Chân Thuận trước!'
      };
    }
    return { canUpgrade: currentSP >= cost, isMax: false, cost, nextLevel: cur + 1 };
  }

  if (traitType === 'skillMoves') {
    const cur = Math.max(1, Math.min(6, Number(player.skillMoves) || 3));
    if (cur >= 6) {
      return { canUpgrade: false, isMax: true, cost: 0, reason: 'Kỹ thuật đã đạt cảnh giới tối thượng 6⭐ Trickster+.' };
    }
    const cost = SPECIAL_TRAIT_UPGRADE_COSTS.skillMoves[cur] || 50;
    return { canUpgrade: currentSP >= cost, isMax: false, cost, nextLevel: cur + 1 };
  }

  return null;
}

/**
 * Nâng cấp Kỹ năng đặc biệt (Chân Thuận, Chân Nghịch, Kỹ Thuật) bằng Điểm Tiềm Năng (SP)
 * @param {object} player 
 * @param {string} traitType 'preferredFootStars' | 'weakFoot' | 'skillMoves'
 * @returns {object}
 */
export function upgradeSpecialTraitWithSP(player, traitType) {
  if (!player) return { success: false, reason: 'Không tìm thấy dữ liệu cầu thủ.' };
  player.skillPoints = Math.max(0, Number(player.skillPoints) || 0);
  player.preferredFootSide = player.preferredFootSide || player.preferredFoot || 'Right';
  player.preferredFoot = player.preferredFootSide;
  player.preferredFootStars = Math.max(1, Math.min(5, Number(player.preferredFootStars) || 4));
  player.weakFoot = Math.max(1, Math.min(player.preferredFootStars, Number(player.weakFoot) || 3));
  player.skillMoves = Math.max(1, Math.min(6, Number(player.skillMoves) || 3));

  const info = getSpecialTraitUpgradeCost(player, traitType);
  if (!info) return { success: false, reason: 'Loại kỹ năng không hợp lệ.' };
  if (info.isMax) return { success: false, reason: info.reason };
  if (info.blockedByPrefFoot) return { success: false, reason: info.reason };
  if (player.skillPoints < info.cost) {
    return { success: false, reason: `Bạn cần ${info.cost} Điểm Tiềm Năng (SP) để nâng cấp (Hiện có: ${player.skillPoints} SP).` };
  }

  player.skillPoints -= info.cost;

  let title = null;
  if (traitType === 'preferredFootStars') {
    player.preferredFootStars += 1;
  } else if (traitType === 'weakFoot') {
    player.weakFoot += 1;
    player.weakFootTrainProgress = 0;
    if (player.weakFoot === 5) {
      player.twoFootedMaster = true;
      title = 'Hai Chân Như Một (5⭐)';
    }
  } else if (traitType === 'skillMoves') {
    player.skillMoves += 1;
    player.skillMovesTrainProgress = 0;
    if (player.skillMoves === 6) {
      player.tricksterMaster = true;
      title = 'Trickster+ Master (6⭐)';
    }
  }

  try {
    saveGame(player);
  } catch (e) {
    console.warn('[upgradeSpecialTraitWithSP] Save error:', e);
  }

  return {
    success: true,
    traitType,
    newLevel: traitType === 'preferredFootStars' ? player.preferredFootStars : (traitType === 'weakFoot' ? player.weakFoot : player.skillMoves),
    cost: info.cost,
    skillPointsRemaining: player.skillPoints,
    title
  };
}

export function calculateDynamicGrowth(player, matchRatingOrResult, stats = {}) {
  if (!player) return null;
  ensurePlayerStats(player);

  let matchRating = 6.0;
  let statsObj = stats || {};

  if (typeof matchRatingOrResult === 'object' && matchRatingOrResult !== null) {
    matchRating = Number(matchRatingOrResult.rating ?? matchRatingOrResult.liveRating ?? matchRatingOrResult.matchRating ?? 6.0);
    statsObj = {
      goals: matchRatingOrResult.goals ?? matchRatingOrResult.playerGoals ?? stats.goals ?? 0,
      assists: matchRatingOrResult.assists ?? matchRatingOrResult.playerAssists ?? stats.assists ?? 0,
      cleanSheets: matchRatingOrResult.cleanSheets ?? matchRatingOrResult.playerCleanSheets ?? (matchRatingOrResult.cleanSheet ? 1 : 0) ?? stats.cleanSheets ?? 0,
      tackles: matchRatingOrResult.tackles ?? stats.tackles ?? 0,
      saves: matchRatingOrResult.saves ?? stats.saves ?? 0
    };
  } else {
    matchRating = Number(matchRatingOrResult ?? 6.0);
  }

  // Initialize growth fields if missing
  if (player.growthExp === undefined) player.growthExp = 0;
  if (player.growthExpTarget === undefined) player.growthExpTarget = 1000;
  if (player.growthLevel === undefined) player.growthLevel = 1;
  if (player.consecutiveGoodMatches === undefined) player.consecutiveGoodMatches = 0;
  if (player.consecutiveBadMatches === undefined) player.consecutiveBadMatches = 0;
  if (player.skillPoints === undefined) player.skillPoints = 0;
  if (player.totalSkillPointsEarned === undefined) player.totalSkillPointsEarned = 0;

  const goals = Number(statsObj.goals || 0);
  const assists = Number(statsObj.assists || 0);
  const cleanSheets = Number(statsObj.cleanSheets || 0);
  const tackles = Number(statsObj.tackles || 0);
  const saves = Number(statsObj.saves || 0);

  let earnedExp = 0;
  let performanceTier = 'STABLE'; // 'STELLAR', 'GOOD', 'STABLE', 'POOR'
  let summaryText = "";
  let statChanges = [];
  let isLevelUp = false;
  let isRegression = false;

  // 1. Phân loại phong độ & Tính EXP cơ bản
  if (matchRating >= 8.0 || goals >= 2 || (goals >= 1 && assists >= 1) || (saves >= 6) || (tackles >= 5)) {
    performanceTier = 'STELLAR';
    player.consecutiveGoodMatches += 1;
    player.consecutiveBadMatches = 0;
    earnedExp = 380 + Math.floor(Math.random() * 80) + (goals * 40) + (assists * 25) + (tackles * 15) + (saves * 15);
  } else if (matchRating >= 7.0 || goals >= 1 || assists >= 1 || cleanSheets >= 1 || tackles >= 3 || saves >= 3) {
    performanceTier = 'GOOD';
    player.consecutiveGoodMatches += 1;
    player.consecutiveBadMatches = 0;
    earnedExp = 260 + Math.floor(Math.random() * 60) + (goals * 30) + (assists * 20) + (tackles * 10) + (saves * 10);
  } else if (matchRating >= 6.3) {
    performanceTier = 'STABLE';
    player.consecutiveGoodMatches = 0;
    player.consecutiveBadMatches = 0;
    earnedExp = 150 + Math.floor(Math.random() * 50);
  } else {
    // Dưới 6.3: Đóng băng tăng trưởng
    performanceTier = 'POOR';
    player.consecutiveGoodMatches = 0;
    player.consecutiveBadMatches += 1;
    earnedExp = 0;
  }

  // 2. TÍNH ĐIỂM TIỀM NĂNG (SKILL POINTS - SP) THAY THẾ TỰ ĐỘNG RẢI ĐIỂM
  const earnedSPObj = calculateEarnedSkillPoints({
    rating: matchRating,
    goals,
    assists,
    cleanSheets
  }, player);
  const earnedSP = earnedSPObj.totalSP;

  player.skillPoints = (player.skillPoints || 0) + earnedSP;
  player.totalSkillPointsEarned = (player.totalSkillPointsEarned || 0) + earnedSP;

  if (earnedSP > 0) {
    statChanges.push({
      stat: 'sp',
      statName: '⚡ Điểm Tiềm Năng (SP)',
      delta: earnedSP,
      isMilestone: true,
      currentValue: player.skillPoints,
      reason: `Màn trình diễn xuất sắc (${matchRating.toFixed(1)}⭐) đem về +${earnedSP} Điểm Tiềm Năng (SP) để tự do phân bổ!`
    });
  }

  if (matchRating >= 8.0) {
    summaryText = `⚡ Phong độ thăng hoa (${matchRating.toFixed(1)}⭐): Nhận +${earnedSP} Điểm Tiềm Năng (SP) & +${earnedExp} EXP!`;
  } else if (matchRating >= 7.0) {
    summaryText = `🌟 Màn trình diễn ấn tượng (${matchRating.toFixed(1)}⭐): Nhận +${earnedSP} Điểm Tiềm Năng (SP) & +${earnedExp} EXP!`;
  } else if (matchRating >= 6.0) {
    summaryText = `👍 Thi đấu tròn vai (${matchRating.toFixed(1)}⭐): Nhận +${earnedSP} Điểm Tiềm Năng (SP) & +${earnedExp} EXP.`;
  } else {
    summaryText = `⚠️ Dưới phong độ (${matchRating.toFixed(1)}⭐): Không nhận được Điểm Tiềm Năng (0 SP).`;
  }

  // 3. CỘNG DỒN EXP VÀ KIỂM TRA ĐỘT PHÁ CẤP TĂNG TRƯỞNG (LEVEL UP)
  const oldExp = player.growthExp;
  player.growthExp += earnedExp;

  if (player.growthExp >= player.growthExpTarget) {
    isLevelUp = true;
    player.growthLevel += 1;
    player.growthExp -= player.growthExpTarget;
    player.growthExpTarget = Math.round(1000 + (player.growthLevel - 1) * 120);

    // Thưởng đột phá level up: cộng thêm +2 SP vào kho điểm tiềm năng
    const levelUpBonusSP = 2;
    player.skillPoints = (player.skillPoints || 0) + levelUpBonusSP;
    player.totalSkillPointsEarned = (player.totalSkillPointsEarned || 0) + levelUpBonusSP;

    statChanges.push({
      stat: 'sp',
      statName: '⚡ Đột Phá Cấp Độ',
      delta: levelUpBonusSP,
      isMilestone: true,
      currentValue: player.skillPoints,
      reason: `Đột phá Cột mốc Tăng Trưởng Cấp ${player.growthLevel}! Thưởng thêm +${levelUpBonusSP} SP tự do cộng điểm!`
    });
  }

  syncFaceStatsFromSubStats(player);
  syncLegacyAttrs(player);
  player.ovr = calculateOVR(player);

  const expPercent = Math.min(100, Math.round((player.growthExp / player.growthExpTarget) * 100));

  return {
    earnedExp,
    oldExp,
    currentExp: player.growthExp,
    targetExp: player.growthExpTarget,
    expPercent,
    growthLevel: player.growthLevel,
    performanceTier,
    summaryText,
    statChanges,
    isLevelUp,
    levelUpBonusSP: isLevelUp ? 2 : 0,
    isRegression,
    earnedSP,
    earnedSkillPoints: earnedSP,
    earnedSPBreakdown: earnedSPObj,
    totalSkillPoints: player.skillPoints,
    consecutiveGoodMatches: player.consecutiveGoodMatches,
    consecutiveBadMatches: player.consecutiveBadMatches
  };
}

export function updatePostMatchStats(player, matchRating, stats = {}) {
  return calculateDynamicGrowth(player, matchRating, stats);
}

export const FAME_EARNINGS_MULTIPLIERS = {
  1: 1.00, // Buff 0%
  2: 1.10, // Buff +10%
  3: 1.25, // Buff +25%
  4: 1.45, // Buff +45%
  5: 1.70, // Buff +70%
  6: 2.00, // Buff +100%
  7: 2.50, // Buff +150%
  8: 3.00, // Buff +200%
  9: 4.00  // Buff +300% (GOAT)
};

/**
 * Tính toán tiền thưởng trận đấu theo % lương tuần của từng vị trí và hệ số danh tiếng
 * Hỗ trợ linh hoạt cả 2 cú pháp gọi: (sim, player) hoặc (player, stats, outcome)
 * @param {object} simOrPlayer 
 * @param {object} playerOrStats 
 * @param {string} [outcomeArg]
 * @returns {object}
 */
export function calculateMatchPerformanceBonus(simOrPlayer, playerOrStats, outcomeArg) {
  let player, sim;
  if (simOrPlayer && (simOrPlayer.position || simOrPlayer.name || simOrPlayer.careerStats !== undefined)) {
    // Gọi theo cú pháp (player, stats, outcome)
    player = simOrPlayer;
    const stats = playerOrStats || {};
    sim = {
      playerStats: stats,
      outcome: outcomeArg || (stats.isWin ? 'WIN' : (stats.isDraw ? 'DRAW' : 'LOSS')),
      isPlayerHome: stats.isPlayerHome ?? true,
      homeScore: stats.homeScore ?? (stats.goals || 0),
      awayScore: stats.awayScore ?? (stats.oppGoals || 0),
      isPlayerOnBench: Boolean(stats.isPlayerOnBench)
    };
  } else {
    // Gọi theo cú pháp (sim, player)
    sim = simOrPlayer || {};
    player = playerOrStats;
  }

  if (!player) return null;

  const isAcademy = Boolean(player.isAcademyStage);
  // Lấy mức lương tuần hiện tại: tối thiểu €200 - €300/tuần ở học viện
  const weeklyWage = Math.max(isAcademy ? 200 : 500, Number(player.salary) || (isAcademy ? 300 : 3000));
  const pStats = sim?.playerStats || {};

  const actualGoals = Number(pStats.goals || 0);
  const actualAssists = Number(pStats.assists || 0);
  const actualSaves = Number(pStats.saves || 0);

  // Thù lao ra sân cơ bản (Base Appearance Fee): tượng trưng 2% - 5% lương tuần (học viện: ~€20 - €50)
  const baseFee = isAcademy
    ? Math.max(20, Math.min(50, Math.round(weeklyWage * 0.08)))
    : Math.max(50, Math.round(weeklyWage * 0.03));

  // Phân loại nhóm vị trí
  const pos = String(player.position || 'ST').toUpperCase();
  const pLine = (player.positionGroup || '').toUpperCase();

  const isAttacker = ['ST', 'CF', 'LW', 'RW'].includes(pos) || ['ATTACKER', 'FW'].includes(pLine);
  const isMidfielder = ['CAM', 'CM', 'CDM', 'LM', 'RM'].includes(pos) || ['MIDFIELDER', 'MF'].includes(pLine);
  const isDefensiveUnit = ['CB', 'LB', 'RB', 'LWB', 'RWB', 'GK'].includes(pos) || ['DEFENDER', 'DF', 'GK', 'GOALKEEPER'].includes(pLine);
  const isGoalkeeper = pos === 'GK' || pLine === 'GK' || pLine === 'GOALKEEPER';

  // 1. Nhóm Tiền đạo (ST, CF, LW, RW): Bàn thắng: 10% lương tuần, Kiến tạo: 5% lương tuần
  // 2. Nhóm Tiền vệ (CAM, CM, CDM, LM, RM): Kiến tạo: 10% lương tuần, Bàn thắng: 5% lương tuần
  // 3. Nhóm Hậu vệ & Thủ môn: Giữ sạch lưới: 10% lương tuần, Ghi bàn: 5%, Kiến tạo: 5%, GK Cứu thua: 1% / pha
  let goalRatePercent = 5;
  let assistRatePercent = 5;

  if (isAttacker) {
    goalRatePercent = 10;
    assistRatePercent = 5;
  } else if (isMidfielder) {
    goalRatePercent = 5;
    assistRatePercent = 10;
  } else if (isDefensiveUnit) {
    goalRatePercent = 5;
    assistRatePercent = 5;
  }

  const goalRate = Math.round(weeklyWage * (goalRatePercent / 100));
  const assistRate = Math.round(weeklyWage * (assistRatePercent / 100));
  const cleanSheetRate = Math.round(weeklyWage * 0.10);
  const saveRate = Math.round(weeklyWage * 0.01);

  const goalBonus = actualGoals * goalRate;
  const assistBonus = actualAssists * assistRate;

  // Thưởng Hat-trick (ghi từ 3 bàn trở lên): 10% lương tuần
  let hatTrickBonus = 0;
  if (actualGoals >= 3) {
    hatTrickBonus = Math.round(weeklyWage * 0.10);
  }

  // Thưởng Giữ sạch lưới: Dành cho Hậu vệ & Thủ môn (cleanSheets > 0 hoặc đội bạn 0 bàn)
  const oppGoals = sim.isPlayerHome ? (sim.awayScore ?? 0) : (sim.homeScore ?? 0);
  const hasCleanSheet = Boolean((pStats.cleanSheets > 0) || (oppGoals === 0 && !sim.isPlayerOnBench));
  const cleanSheetBonus = (isDefensiveUnit && hasCleanSheet) ? cleanSheetRate : 0;

  // Thưởng Cứu thua cho Thủ môn: 1% lương tuần / pha cứu thua
  const saveBonus = isGoalkeeper ? actualSaves * saveRate : 0;

  // Tổng tiền thưởng thô trước khi nhân hệ số Fame
  const rawEarnings = baseFee + goalBonus + assistBonus + cleanSheetBonus + saveBonus + hatTrickBonus;

  // Hệ số Buff Danh Tiếng (Fame Multiplier) từ 9 Mốc Danh Vọng
  const fameInfo = getFameTier(player.fame || 0);
  const fameMultiplier = FAME_EARNINGS_MULTIPLIERS[fameInfo.tierIndex] || 1.00;
  const fameBonusPercent = Math.round((fameMultiplier - 1) * 100);
  const fameBonusAmount = Math.round(rawEarnings * (fameMultiplier - 1));
  const totalEarned = rawEarnings + fameBonusAmount;

  // Tự động cộng tiền thưởng vào tài khoản cầu thủ
  player.money = (player.money || 0) + totalEarned;

  return {
    weeklyWage,
    baseFee,
    goalBonus,
    goalsCount: actualGoals,
    goalRate,
    goalRatePercent,
    assistBonus,
    assistsCount: actualAssists,
    assistRate,
    assistRatePercent,
    cleanSheetBonus,
    hasCleanSheet: Boolean(isDefensiveUnit && hasCleanSheet),
    cleanSheetRate,
    cleanSheetRatePercent: 10,
    saveBonus,
    savesCount: actualSaves,
    saveRate,
    saveRatePercent: 1,
    hatTrickBonus,
    fameTierIndex: fameInfo.tierIndex,
    fameTierTitle: fameInfo.title,
    fameBadge: fameInfo.badge,
    fameMultiplier,
    fameBonusPercent,
    fameBonusAmount,
    rawEarnings,
    totalEarned
  };
}

/**
 * Tính toán tác động sau trận đấu dựa trên Live Rating và xG Performance
 * @param {object} sim 
 * @param {object} player 
 * @returns {object}
 */
export function calculatePostMatchImpact(sim, player) {
  const rating = sim.liveRating;
  const actualGoals = sim.playerStats?.goals || 0;
  const xG = sim.xG?.player || 0;
  const xGDiff = Number((actualGoals - xG).toFixed(2));

  let deltaMorale = 0;
  let deltaMarketValuePercent = 0;
  let isMOTM = false;

  // Điểm Fame nhận được sau mỗi trận: từ +5 đến +30 Fame Points theo rating và bàn thắng/kiến tạo
  let baseFame = 5;
  if (rating >= 8.5) {
    isMOTM = true;
    deltaMorale = +8;
    baseFame = 20;
    deltaMarketValuePercent = 0.05;
  } else if (rating >= 7.5) {
    deltaMorale = +5;
    baseFame = 14;
    deltaMarketValuePercent = 0.03;
  } else if (rating >= 7.0) {
    deltaMorale = +4;
    baseFame = 10;
    deltaMarketValuePercent = 0.02;
  } else if (rating >= 6.0) {
    deltaMorale = +1;
    baseFame = 6;
    deltaMarketValuePercent = 0.0;
  } else {
    deltaMorale = -6;
    baseFame = 5;
    deltaMarketValuePercent = -0.02;
  }

  const goalFameBonus = (actualGoals || 0) * 4;
  const assistFameBonus = (sim.playerStats?.assists || 0) * 3;
  const deltaFame = Math.min(30, Math.max(5, baseFame + goalFameBonus + assistFameBonus));

  player.morale = Math.max(10, Math.min(99, player.morale + deltaMorale));
  player.fame = Math.max(0, (player.fame || 0) + deltaFame);
  if (deltaMarketValuePercent !== 0) {
    player.marketValue = Math.round(player.marketValue * (1 + deltaMarketValuePercent));
    if (player.marketValue > (player.peakMarketValue || 0)) {
      player.peakMarketValue = player.marketValue;
    }
  }

  if (sim.inMatchStamina !== undefined) {
    player.stam = Math.max(15, Math.round(sim.inMatchStamina));
    player.stamina = player.stam;
  }

  let shotEfficiencyComment = "Bình thường";
  if (xGDiff >= 0.5) shotEfficiencyComment = "🔥 Sát Thủ Lâm Sàng (Vượt trội xG)";
  else if (xGDiff <= -0.5) shotEfficiencyComment = "❄️ Kém Duyên (Thấp hơn kỳ vọng xG)";
  else shotEfficiencyComment = "⚖️ Đúng Với Bàn Thắng Kỳ Vọng";

  // Tính toán tăng trưởng chỉ số theo phong độ (Dynamic Growth - FC Style)
  const growth = calculateDynamicGrowth(player, rating, {
    goals: actualGoals,
    assists: sim.playerStats?.assists || 0,
    cleanSheets: sim.playerStats?.cleanSheets || 0,
    tackles: sim.playerStats?.tackles || 0,
    saves: sim.playerStats?.saves || 0
  });

  // Tính toán tiền thưởng theo hiệu suất và Fame buff
  const matchEarnings = calculateMatchPerformanceBonus(sim, player);

  return {
    rating,
    isMOTM,
    actualGoals,
    xG,
    xGDiff,
    shotEfficiencyComment,
    deltaMorale,
    deltaFame,
    deltaMarketValuePercent,
    growth,
    matchEarnings
  };
}

/* =========================================================================
   3. BALLON D'OR & AWARDS EVALUATION
   ========================================================================= */

export function calculatePlayerGoatScore(player) {
  if (!player) return 50.0;
  const tally = player.trophiesTally || {};
  const goals = player.totalCareerGoals || 0;
  const ucl = tally["UEFA Champions League (C1)"] || 0;
  const wc = (tally["FIFA World Cup"] || 0) + ((tally["UEFA Euro"] || tally["Copa América"] || tally["AFC Asian Cup"] || tally["CONCACAF Gold Cup"] || tally["Africa Cup of Nations"] || 0) * 0.6);
  const bdr = player.ballonDorWins || 0;
  const totalT = player.trophiesTotal || 0;

  let rawScore = 50;
  rawScore += Math.min(25, (goals / 800) * 25);
  rawScore += Math.min(18, ucl * 3.6);
  rawScore += Math.min(20, wc * 10.0);
  rawScore += Math.min(24, bdr * 3.0);
  rawScore += Math.min(10, (totalT / 40) * 10);

  return Math.min(99.9, Math.round(rawScore * 10) / 10);
}

/* =========================================================================
   4. FULL SEASON ROUND SIMULATION (LEAGUE, CUPS, EUROPE, INTL)
   ========================================================================= */

export function updateManagerTrustAndRole(player, matchRating, preMatchPrep = 'NONE') {
  if (!player) return { trustChange: 0, currentTrust: 70, squadRole: 'KEY_PLAYER' };
  if (player.managerTrust === undefined) player.managerTrust = 70;

  let trustChange = 0;
  if (matchRating >= 8.5) {
    trustChange = +5;
    player.consecutiveBadMatches = 0;
  } else if (matchRating >= 7.0) {
    trustChange = +3;
    player.consecutiveBadMatches = 0;
  } else if (matchRating < 6.0) {
    trustChange = -5;
    player.consecutiveBadMatches = (player.consecutiveBadMatches || 0) + 1;
    if (player.consecutiveBadMatches >= 3) {
      trustChange -= 7; // Tổng trừ -12 điểm nếu đá tệ 3 trận liên tiếp!
    }
  } else {
    player.consecutiveBadMatches = 0;
  }

  if (preMatchPrep === 'LIGHT_TRAIN') {
    trustChange += 1;
  } else if (preMatchPrep === 'INTENSE_DRILL') {
    trustChange += 2;
  } else if (preMatchPrep === 'VIDEO_ANALYSIS') {
    trustChange += 1;
  }

  player.managerTrust = Math.max(0, Math.min(100, player.managerTrust + trustChange));

  // Phân cấp vai trò theo mốc Trust
  if (player.managerTrust >= 75) {
    player.squadRole = 'KEY_PLAYER';
  } else if (player.managerTrust >= 40) {
    player.squadRole = 'ROTATION';
  } else if (player.managerTrust >= 20) {
    player.squadRole = 'BENCH';
  } else {
    player.squadRole = 'TRANSFER_LISTED';
  }

  return { trustChange, currentTrust: player.managerTrust, squadRole: player.squadRole };
}

/* =========================================================================
   8. SUMMER TOURNAMENT SYSTEM (FIFA WORLD CUP & CONTINENTAL CUPS)
   ========================================================================= */

/**
 * Kiểm tra xem mùa giải hiện tại có Vòng Chung Kết Mùa Hè không (năm chẵn)
 */

/* =========================================================================
   9. COMMERCIAL SPONSORSHIPS ENGINE (Hệ Thống Tài Trợ Thương Mại Đa Tầng)
   ========================================================================= */

function _formatSponsorCurrency(num) {
  if (num === null || num === undefined) return "€0";
  const n = Math.round(Number(num) || 0);
  if (Math.abs(n) >= 1_000_000_000) return `€${(n / 1_000_000_000).toFixed(2)}B`;
  if (Math.abs(n) >= 1_000_000) return `€${(n / 1_000_000).toFixed(2)}M`;
  if (Math.abs(n) >= 1_000) return `€${(n / 1_000).toFixed(0)}k`;
  return `€${n.toLocaleString()}`;
}

/**
 * Thuật toán sinh danh sách đề nghị tài trợ thương mại theo 9 mốc Danh Tiếng (Fame Tiers)
 * @param {object} player 
 * @returns {Array<object>}
 */
export function generateSponsorshipOffers(player) {
  if (!player) return [];
  if (!Array.isArray(player.activeSponsorships)) {
    player.activeSponsorships = [];
  }

  const fame = Math.max(0, Number(player.fame) || 0);
  const fameTier = getFameTier(fame);
  const curTier = fameTier.tierIndex; // 1 to 9
  const activeAgent = AGENTS_DATA.find(a => a.id === (player.activeAgent || "agent_family"));
  const agentBoost = activeAgent?.sponsorBoost || 0;

  return SPONSORSHIP_BRANDS.map(brand => {
    const isUnlocked = fame >= brand.minFame;
    const categoryInfo = SPONSORSHIP_CATEGORIES[brand.category] || { name: brand.category, icon: "🏷️" };
    const tierMeta = FAME_TIERS.find(t => t.tierIndex === brand.minTier) || FAME_TIERS[0];

    // Thuật toán co giãn giá trị hàng năm (annualPayout) và thời hạn (durationYears)
    let annualPayout = brand.baseAnnualPayout;
    let durationYears = brand.baseDurationYears;
    let isLifetime = Boolean(brand.isLifetime);
    let signingBonus = brand.baseSigningBonus;

    if (isUnlocked) {
      const excessFame = fame - brand.minFame;
      const fameScaling = 1 + Math.min(1.5, excessFame * 0.0001);
      annualPayout = Math.round(annualPayout * fameScaling);
      signingBonus = Math.round(signingBonus * fameScaling);

      if (curTier === 9) {
        // Tier 9 (GOAT): Đề nghị Trọn đời xuất hiện ở nhiều danh mục, giá trị từ €30M - €50M/năm
        if (brand.minTier >= 6) {
          isLifetime = true;
          durationYears = "LIFETIME";
          const goatScaling = Math.min(20000000, Math.floor((fame - 20000) / 2000) * 2000000 + (brand.minTier - 6) * 3000000);
          annualPayout = Math.min(50000000, Math.max(30000000, 30000000 + goatScaling));
          signingBonus = Math.round(annualPayout * 0.5);
        } else {
          annualPayout = Math.round(annualPayout * 2.5);
          durationYears = typeof durationYears === 'number' ? Math.min(5, durationYears + 2) : durationYears;
        }
      } else if (curTier >= 7) {
        // Tier 7 - 8: 5 đến 10 năm, hoặc TRỌN ĐỜI với nhãn hàng Giày (€10M - €25M/năm)
        if (brand.category === "BOOTS" && brand.minTier >= 7) {
          if (curTier === 8 || brand.isLifetime) {
            isLifetime = true;
            durationYears = "LIFETIME";
            annualPayout = Math.max(20000000, Math.min(25000000, annualPayout));
            signingBonus = Math.round(annualPayout * 0.5);
          } else {
            durationYears = Math.min(10, Math.max(5, (brand.baseDurationYears || 5) + (curTier - 7) * 2));
            annualPayout = Math.max(10000000, Math.min(20000000, annualPayout));
          }
        } else if (brand.minTier >= 7) {
          durationYears = Math.min(8, Math.max(5, (brand.baseDurationYears || 4) + 1));
          annualPayout = Math.max(12000000, Math.min(25000000, annualPayout));
        } else {
          durationYears = typeof durationYears === 'number' ? Math.min(5, durationYears + 1) : durationYears;
        }
      } else if (curTier >= 5) {
        // Tier 5 - 6: 3 đến 5 năm (€2.5M - €8M/năm)
        if (brand.minTier >= 5) {
          durationYears = Math.min(5, Math.max(3, brand.baseDurationYears));
          annualPayout = Math.max(2500000, Math.min(8000000, annualPayout));
        }
      } else if (curTier >= 3) {
        // Tier 3 - 4: 2 đến 3 năm (€250k - €1.5M/năm)
        if (brand.minTier >= 3 && brand.minTier <= 4) {
          durationYears = Math.min(3, Math.max(2, brand.baseDurationYears));
          annualPayout = Math.max(250000, Math.min(1500000, annualPayout));
        }
      } else {
        // Tier 1 - 2: 1 đến 2 năm (€20k - €80k/năm)
        if (brand.minTier <= 2) {
          durationYears = Math.min(2, Math.max(1, brand.baseDurationYears));
          annualPayout = Math.max(20000, Math.min(80000, annualPayout));
        }
      }
    }

    // Áp dụng Agent sponsorBoost lên thu nhập
    const boostedAnnualPayout = Math.round(annualPayout * (1 + agentBoost));
    const boostedSigningBonus = Math.round(signingBonus * (1 + agentBoost));

    // Kiểm tra trạng thái hợp đồng hiện tại
    const isSigned = player.activeSponsorships.some(d => d.id === brand.id || d.brandId === brand.id);
    const existingCategoryDeal = player.activeSponsorships.find(d => d.category === brand.category);

    return {
      id: brand.id,
      brandId: brand.id,
      brand: brand.brand,
      name: brand.name,
      category: brand.category,
      categoryName: categoryInfo.name,
      categoryIcon: categoryInfo.icon,
      icon: brand.icon,
      minFame: brand.minFame,
      minTier: brand.minTier,
      tierBadge: tierMeta.badge,
      tierTitle: tierMeta.title,
      annualPayout: boostedAnnualPayout,
      rawAnnualPayout: annualPayout,
      signingBonus: boostedSigningBonus,
      durationYears: isLifetime ? "LIFETIME" : durationYears,
      isLifetime,
      perkBonus: brand.perkBonus,
      desc: brand.desc,
      isUnlocked,
      isSigned,
      existingCategoryDeal: existingCategoryDeal || null,
      canSign: isUnlocked && !isSigned
    };
  });
}

/**
 * Ký kết hợp đồng tài trợ mới (hỗ trợ thay thế hợp đồng cùng danh mục)
 * @param {object} player 
 * @param {string} offerId 
 * @returns {{ success: boolean, deal?: object, replacedDeal?: object, signingBonus?: number, reason?: string }}
 */
export function signSponsorship(player, offerId) {
  if (!player) return { success: false, reason: "NO_PLAYER" };
  if (!Array.isArray(player.activeSponsorships)) {
    player.activeSponsorships = [];
  }

  const offers = generateSponsorshipOffers(player);
  const offer = offers.find(o => o.id === offerId);
  if (!offer) {
    return { success: false, reason: "OFFER_NOT_FOUND" };
  }

  if (!offer.isUnlocked) {
    return { success: false, reason: "NOT_UNLOCKED", requiredTier: offer.tierTitle, requiredFame: offer.minFame };
  }

  if (offer.isSigned) {
    return { success: false, reason: "ALREADY_SIGNED" };
  }

  // Độc quyền danh mục: Thay thế nếu danh mục đã có hợp đồng cũ
  let replacedDeal = null;
  const existingIndex = player.activeSponsorships.findIndex(d => d.category === offer.category);
  if (existingIndex !== -1) {
    replacedDeal = player.activeSponsorships[existingIndex];
    player.activeSponsorships.splice(existingIndex, 1);
  }

  const newContract = {
    id: offer.id,
    brandId: offer.brandId,
    brand: offer.brand,
    name: offer.name,
    category: offer.category,
    categoryName: offer.categoryName,
    icon: offer.icon,
    annualPayout: offer.annualPayout,
    signingBonus: offer.signingBonus,
    durationYears: offer.durationYears,
    yearsRemaining: offer.isLifetime ? "LIFETIME" : offer.durationYears,
    isLifetime: offer.isLifetime,
    perkBonus: offer.perkBonus,
    signedAtYear: player.year || 2026,
    signedAtAge: player.age || 16
  };

  player.activeSponsorships.push(newContract);

  // Backward compatibility với Boots
  if (offer.category === "BOOTS") {
    player.activeSponsor = offer.id;
  }

  // Cộng tiền lót tay
  if (offer.signingBonus > 0) {
    player.money = (player.money || 0) + offer.signingBonus;
  }

  // Ghi nhận nhật ký sự nghiệp
  const durationText = offer.isLifetime ? "🌌 TRỌN ĐỜI (LIFETIME)" : `${offer.durationYears} năm`;
  const replaceMsg = replacedDeal ? ` (thay thế hợp đồng cũ cùng danh mục với ${replacedDeal.name})` : "";
  logCareerEvent(player, "SPONSORSHIP_SIGNED", {
    title: `✍️ Ký Hợp Đồng: ${offer.name}`,
    body: `Chính thức đặt bút ký hợp đồng tài trợ ${durationText} cùng ${offer.brand}${replaceMsg}. Giá trị ${_formatSponsorCurrency(offer.annualPayout)}/năm và nhận nóng ${_formatSponsorCurrency(offer.signingBonus)} phí lót tay!`,
    type: "reward"
  });

  return {
    success: true,
    deal: newContract,
    replacedDeal,
    signingBonus: offer.signingBonus
  };
}

export const signSponsorshipDeal = signSponsorship;

/**
 * Quyết toán tiền tài trợ thương mại hàng năm và giảm thời hạn hợp đồng
 * @param {object} player 
 * @returns {{ totalPayout: number, expiredDeals: Array<object>, remainingDeals: Array<object>, alreadyProcessed?: boolean }}
 */
export function processAnnualSponsorshipPayout(player) {
  if (!player || !Array.isArray(player.activeSponsorships) || player.activeSponsorships.length === 0) {
    return { totalPayout: 0, expiredDeals: [], remainingDeals: [] };
  }

  const currentYear = player.year || 2026;
  if (player.lastSponsorshipPayoutYear === currentYear) {
    return { totalPayout: 0, expiredDeals: [], remainingDeals: player.activeSponsorships, alreadyProcessed: true };
  }
  player.lastSponsorshipPayoutYear = currentYear;

  const activeAgent = AGENTS_DATA.find(a => a.id === (player.activeAgent || "agent_family"));
  const agentBoost = activeAgent?.sponsorBoost || 0;

  let totalPayout = 0;
  const expiredDeals = [];
  const remainingDeals = [];

  player.activeSponsorships.forEach(deal => {
    const payout = Math.round((deal.annualPayout || 0) * (1 + agentBoost));
    totalPayout += payout;

    if (deal.isLifetime || deal.durationYears === "LIFETIME" || deal.yearsRemaining === "LIFETIME") {
      deal.isLifetime = true;
      deal.yearsRemaining = "LIFETIME";
      remainingDeals.push(deal);
    } else {
      let rem = typeof deal.yearsRemaining === 'number' ? deal.yearsRemaining : Number(deal.durationYears);
      rem -= 1;
      deal.yearsRemaining = rem;
      if (rem <= 0) {
        expiredDeals.push(deal);
      } else {
        remainingDeals.push(deal);
      }
    }
  });

  player.activeSponsorships = remainingDeals;

  if (totalPayout > 0) {
    player.money = (player.money || 0) + totalPayout;
    logCareerEvent(player, "SPONSORSHIP", {
      title: "🤝 Quyết Toán Tài Trợ Thương Mại",
      body: `Nhận ${_formatSponsorCurrency(totalPayout)} tiền tài trợ thương mại từ các nhãn hàng cho mùa giải mới.`,
      type: "positive"
    });
  }

  if (expiredDeals.length > 0) {
    const expiredNames = expiredDeals.map(d => `${d.icon || ''} ${d.name || d.brand}`).join(', ');
    logCareerEvent(player, "SPONSORSHIP_EXPIRED", {
      title: "📜 Hết Hạn Hợp Đồng Tài Trợ",
      body: `Hợp đồng tài trợ với ${expiredNames} đã chính thức đáo hạn sau mùa giải vừa qua. Bạn có thể tự do đàm phán hợp đồng tài trợ mới!`,
      type: "warning"
    });

    if (expiredDeals.some(d => d.category === "BOOTS")) {
      const remainingBoots = remainingDeals.find(d => d.category === "BOOTS");
      player.activeSponsor = remainingBoots ? remainingBoots.id : null;
    }
  }

  return { totalPayout, expiredDeals, remainingDeals };
}

/**
 * Lấy tổng hợp thu nhập tài trợ và thông số các hợp đồng đang hiệu lực
 * @param {object} player 
 * @returns {{ totalAnnualIncome: number, count: number, maxCategories: number, activeDeals: Array<object> }}
 */
export function getActiveSponsorshipStats(player) {
  if (!player || !Array.isArray(player.activeSponsorships)) {
    return { totalAnnualIncome: 0, count: 0, maxCategories: 5, activeDeals: [] };
  }
  const activeAgent = AGENTS_DATA.find(a => a.id === (player.activeAgent || "agent_family"));
  const agentBoost = activeAgent?.sponsorBoost || 0;
  const totalAnnualIncome = player.activeSponsorships.reduce((sum, d) => sum + Math.round((d.annualPayout || 0) * (1 + agentBoost)), 0);
  return {
    totalAnnualIncome,
    count: player.activeSponsorships.length,
    maxCategories: 5,
    activeDeals: player.activeSponsorships
  };
}
