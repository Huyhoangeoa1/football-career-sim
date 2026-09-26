/* =========================================================================
   FOOTBALL CAREER SIMULATOR — SAVE / LOAD MODULE (localStorage)
   ========================================================================= */

import { 
  REAL_RIVAL_SCORERS, 
  YOUTH_LEAGUE_CLUBS,
  SUB_STATS_CONFIG,
  generateSubStatsFromFaceStats,
  getInitialStatsForPosition,
  MAX_STAT_LIMIT
} from './data.js';

const SAVE_KEY    = 'fcs_save_v1';
const VERSION_KEY = 'fcs_version';
const SAVE_VERSION = 5;   // bump khi schema player thay đổi lớn (v5: Commercial Sponsorships System)

/* ─────────────────────────────────────────────────────────────────────────
   INTERNAL HELPERS
───────────────────────────────────────────────────────────────────────── */
function _validate(data) {
  if (!data || typeof data !== 'object') return false;
  const required = ['name', 'age', 'position', 'careerStats', 'currentSeasonStats', 'injury', 'tactic'];
  return required.every(k => k in data);
}

export function _migrate(data) {
  // Từ schema cũ (chưa có careerStats, currentSeasonStats, injury, tactic)
  if (!data.careerStats) {
    data.careerStats = {
      matches:     data.totalCareerMatches  || 0,
      goals:       data.totalCareerGoals    || 0,
      assists:     data.totalCareerAssists  || 0,
      cleanSheets: data.totalCareerCleanSheets || 0,
      saves:       data.totalCareerSaves    || 0,
      tackles:     data.totalCareerTackles  || 0,
    };
  }
  if (!data.currentSeasonStats) {
    data.currentSeasonStats = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 };
  }
  if (!data.seasonHistory) {
    data.seasonHistory = [];
  }
  if (!data.injury) {
    data.injury = { isInjured: false, name: null, severity: 'LIGHT', phasesRemaining: 0, riskOfRecurrence: 0 };
  }
  if (data.injuryCooldown === undefined) {
    data.injuryCooldown = 0;
  }
  if (!data.careerChronicleLog) {
    data.careerChronicleLog = [];
  }
  if (!data.achievedMilestones) {
    data.achievedMilestones = {};
  }
  if (!data.mediaFeed || !Array.isArray(data.mediaFeed)) {
    data.mediaFeed = [];
  }
  if (!data.competitionTier) {
    data.competitionTier = {
      currentTier: data.isAcademyStage ? 3 : (data.currentClub?.league?.tierLevel === 4 ? 1 : 2),
      tierName: data.isAcademyStage ? 'Tier 3: Giải Trẻ & Đào Tạo' : (data.currentClub?.league?.tierLevel === 4 ? 'Tier 1: Đỉnh Cao Châu Âu' : 'Tier 2: Hạng Nhất Châu Âu'),
      clubPrestige: data.isAcademyStage ? 35 : (data.currentClub?.power || 65),
      qualificationStatus: data.isAcademyStage ? 'YOUTH_LEAGUE' : (data.currentEuroStatus || 'DOMESTIC'),
      relegationThreat: false,
      tierDifficultyFactor: data.isAcademyStage ? 0.8 : (data.currentClub?.league?.tierLevel === 4 ? 1.25 : 1.0)
    };
  }
  if (!data.tactic) {
    data.tactic = 'BALANCED';
  }
  if (!data.currentSeasonFixtures) {
    data.currentSeasonFixtures = [];
  }
  if (data.currentFixtureIndex === undefined) {
    data.currentFixtureIndex = 0;
  }
  if (!data.leagueTable) {
    data.leagueTable = [];
  }
  if (!data.leagueTopScorers) {
    data.leagueTopScorers = [];
  }
  if (!data.preMatchPrep) {
    data.preMatchPrep = 'NONE';
  }
  if (!data.tournamentBrackets) {
    data.tournamentBrackets = { domesticCup: null, continentalCup: null };
  }
  if (!data.continentalGroupTable) {
    data.continentalGroupTable = [];
  }
  if (!data.activeLeagueTableFilter) {
    data.activeLeagueTableFilter = 'LEAGUE';
  }
  if (data.managerTrust === undefined) {
    data.managerTrust = 70;
  }
  if (!data.squadRole) {
    data.squadRole = 'KEY_PLAYER';
  }
  if (data.consecutiveBadMatches === undefined) {
    data.consecutiveBadMatches = 0;
  }
  if (data.summerTournament === undefined) {
    data.summerTournament = null;
  }
  if (!data.cardTheme) {
    data.cardTheme = 'gold';
  }
  if (!data.cardAvatar) {
    data.cardAvatar = 'avatar_fade';
  }
  if (data.customAvatarUrl === undefined) {
    data.customAvatarUrl = '';
  }
  data.preferredFootSide = data.preferredFootSide || data.preferredFoot || 'Right';
  data.preferredFoot = data.preferredFootSide;
  if (!data.preferredFootStars) {
    data.preferredFootStars = (data.ovr && data.ovr >= 85) ? 5 : 4;
  }
  data.preferredFootStars = Math.max(1, Math.min(5, Number(data.preferredFootStars) || 4));

  if (!data.weakFoot) {
    const p = String(data.position || 'ST').toUpperCase();
    data.weakFoot = p === 'GK' ? 2 : (['CB', 'DF', 'LB', 'RB'].includes(p) ? 3 : 4);
  }
  // Đảm bảo chân nghịch không bao giờ vượt quá cấp sao chân thuận
  data.weakFoot = Math.max(1, Math.min(data.preferredFootStars, Number(data.weakFoot) || 3));

  if (!data.skillMoves) {
    const p = String(data.position || 'ST').toUpperCase();
    data.skillMoves = p === 'GK' ? 1 : (['CB', 'DF', 'LB', 'RB'].includes(p) ? 2 : 3);
  }
  data.skillMoves = Math.max(1, Math.min(6, Number(data.skillMoves) || 3));

  if (data.weakFootTrainProgress === undefined) {
    data.weakFootTrainProgress = 0;
  }
  if (data.skillMovesTrainProgress === undefined) {
    data.skillMovesTrainProgress = 0;
  }

  // Migration: Ensure Skill Points (SP) exist
  if (data.skillPoints === undefined || !Number.isInteger(data.skillPoints)) {
    data.skillPoints = 10; // Tặng kèm 10 SP khởi đầu cho save cũ để trải nghiệm cộng tay ngay
  }
  if (data.totalSkillPointsEarned === undefined || !Number.isInteger(data.totalSkillPointsEarned)) {
    data.totalSkillPointsEarned = data.skillPoints;
  }

  // Migration: Ensure 6 Face Stats exist
  if (!data.stats || typeof data.stats !== 'object') {
    const pos = data.position || 'ST';
    data.stats = getInitialStatsForPosition ? getInitialStatsForPosition(pos) : {
      pac: 55, sho: 55, pas: 55, dri: 55, def: 55, phy: 55
    };
    if (data.statPac !== undefined) data.stats.pac = Math.round(Number(data.statPac) || 55);
    if (data.statSho !== undefined) data.stats.sho = Math.round(Number(data.statSho) || 55);
    if (data.statPas !== undefined) data.stats.pas = Math.round(Number(data.statPas) || 55);
    if (data.statDri !== undefined) data.stats.dri = Math.round(Number(data.statDri) || 55);
    if (data.statDef !== undefined) data.stats.def = Math.round(Number(data.statDef) || 55);
    if (data.statPhy !== undefined) data.stats.phy = Math.round(Number(data.statPhy) || 55);

    if (data.attr1 !== undefined && data.statSho === undefined) {
      const p = String(pos).toUpperCase();
      if (['ST', 'CF', 'FW'].includes(p)) {
        data.stats.sho = Math.round(Number(data.attr1) || 55);
        data.stats.pac = Math.round(Number(data.attr2) || 58);
        data.stats.pas = Math.round(Number(data.attr3) || 51);
        data.stats.dri = Math.round(Number(data.attr4) || 56);
      }
    }
  }

  // Keep legacy statPac, statSho, etc. aligned with data.stats
  if (data.stats) {
    if (data.statPac === undefined || data.statPac === null) data.statPac = data.stats.pac;
    if (data.statSho === undefined || data.statSho === null) data.statSho = data.stats.sho;
    if (data.statPas === undefined || data.statPas === null) data.statPas = data.stats.pas;
    if (data.statDri === undefined || data.statDri === null) data.statDri = data.stats.dri;
    if (data.statDef === undefined || data.statDef === null) data.statDef = data.stats.def;
    if (data.statPhy === undefined || data.statPhy === null) data.statPhy = data.stats.phy;
  }

  // Migration: Ensure 29 Detailed Sub-Attributes exist (EA FC Detailed Attributes)
  if (!data.subStats || typeof data.subStats !== 'object') {
    data.subStats = generateSubStatsFromFaceStats(data.stats, data.position);
  } else {
    for (const [groupKey, groupConf] of Object.entries(SUB_STATS_CONFIG)) {
      const baseFace = Number(data.stats[groupKey]) || 55;
      groupConf.stats.forEach(s => {
        if (data.subStats[s.key] === undefined || data.subStats[s.key] === null || isNaN(Number(data.subStats[s.key]))) {
          data.subStats[s.key] = Math.max(1, Math.min(MAX_STAT_LIMIT, Math.round(baseFace)));
        } else {
          data.subStats[s.key] = Math.max(1, Math.min(MAX_STAT_LIMIT, Math.round(Number(data.subStats[s.key]))));
        }
      });
    }
  }

  // Ensure attributes are floats
  if (data.attr1 !== undefined) data.attr1 = parseFloat(Number(data.attr1).toFixed(2));
  if (data.attr2 !== undefined) data.attr2 = parseFloat(Number(data.attr2).toFixed(2));
  if (data.attr3 !== undefined) data.attr3 = parseFloat(Number(data.attr3).toFixed(2));
  if (data.attr4 !== undefined) data.attr4 = parseFloat(Number(data.attr4).toFixed(2));

  // Migration: Tự động migrate điểm fame cho save game cũ (nếu fame <= 100 thì nhân x10 để tương thích ngay với hệ thống mới)
  if (data.fame !== undefined && typeof data.fame === 'number' && data.fame <= 100) {
    data.fame = Math.max(0, Math.round(data.fame * 10));
  }

  // Migration: Đảm bảo player.activeSponsorships luôn là mảng hợp lệ
  if (!Array.isArray(data.activeSponsorships)) {
    data.activeSponsorships = [];
    if (data.activeSponsor) {
      const legacyId = data.activeSponsor;
      data.activeSponsorships.push({
        id: legacyId,
        brandId: legacyId,
        brand: legacyId.includes("nike") ? "Nike" : legacyId.includes("adidas") ? "Adidas" : "Puma",
        name: legacyId.includes("nike") ? "Nike Mercurial Superfly Elite" : legacyId.includes("adidas") ? "Adidas Predator Elite" : "Puma Future Ultimate",
        category: "BOOTS",
        categoryName: "Giày & Trang Phục",
        icon: "👟",
        annualPayout: legacyId.includes("nike") ? 15000000 : legacyId.includes("adidas") ? 5500000 : 800000,
        signingBonus: 1000000,
        durationYears: 3,
        yearsRemaining: 3,
        isLifetime: false,
        perkBonus: "Hợp đồng tài trợ giày thi đấu kế thừa từ bản lưu trước",
        signedAtYear: data.year || 2026,
        signedAtAge: data.age || 16
      });
    }
  }

  // Migration: Sửa triệt để lỗi người chơi ở Học Viện Trẻ U19 nhưng Vua phá lưới hoặc BXH bị gán Premier League
  if (data.isAcademyStage) {
    const hasPremierScorer = data.leagueTopScorers && data.leagueTopScorers.some(s => 
      !s.isPlayer && (s.name === "Erling Haaland" || s.name === "Bukayo Saka" || s.name === "Cole Palmer" || s.name === "Mohamed Salah" || s.name === "Alexander Isak" || s.clubId === "man_city" || s.clubId === "arsenal")
    );
    if (hasPremierScorer || !data.leagueTopScorers || data.leagueTopScorers.length <= 1) {
      const pItem = (data.leagueTopScorers || []).find(s => s.isPlayer);
      const playerGoals = pItem ? pItem.goals : (data.currentSeasonStats?.goals || 0);
      const youthPool = REAL_RIVAL_SCORERS.YOUTH_LEAGUE || [];
      const playerClub = data.academy || data.club || { id: "bayern_junior", name: "FC Bayern Campus", code: "BAY", icon: "🔴" };
      data.leagueTopScorers = [
        {
          name: `${data.name} (BẠN)`,
          clubId: playerClub.id || "bayern_junior",
          clubName: playerClub.name || "FC Bayern Campus",
          clubCode: playerClub.code || "BAY",
          clubIcon: playerClub.icon || "🔴",
          goals: playerGoals,
          isPlayer: true
        },
        ...youthPool.map(star => ({
          name: star.name,
          clubId: star.clubId,
          clubName: star.clubName,
          clubCode: star.clubCode,
          clubIcon: star.clubIcon,
          goals: 0,
          isPlayer: false,
          avgGPR: star.avgGPR || 0.6
        }))
      ];
    }

    if (Array.isArray(data.leagueTable)) {
      data.leagueTable.forEach(team => {
        if (!team.clubId && team.id) team.clubId = team.id;
        if (!team.id && team.clubId) team.id = team.clubId;
        if (!team.clubName && team.name) team.clubName = team.name;
        if (!team.name && team.clubName) team.name = team.clubName;
        if (team.matches === undefined) team.matches = team.played || 0;
        if (team.played === undefined) team.played = team.matches || 0;
      });
    }

    const hasEplTable = data.leagueTable && data.leagueTable.some(t => t.clubId === 'man_city' || t.clubId === 'arsenal');
    if (hasEplTable || !data.leagueTable || data.leagueTable.length === 0) {
      const activeClub = data.academy || data.club;
      data.leagueTable = YOUTH_LEAGUE_CLUBS.map(club => ({
        clubId: club.id,
        id: club.id,
        clubName: club.name,
        name: club.name,
        clubCode: club.code || club.name.substring(0, 3).toUpperCase(),
        clubIcon: club.icon || "⚽",
        power: club.power || 75,
        isPlayerClub: Boolean(activeClub && (club.id === activeClub.id || club.name === activeClub.name || (activeClub.name && activeClub.name.includes("Bayern")))),
        played: 0,
        matches: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
        recentForm: []
      }));
    }
  }

  return data;
}

/* ─────────────────────────────────────────────────────────────────────────
   PUBLIC API: 5-SLOT MULTI-SAVE ARCHITECTURE
───────────────────────────────────────────────────────────────────────── */

export const TOTAL_SAVE_SLOTS = 5;
export const SLOT_KEY_PREFIX = 'football_career_save_slot_';
export const LAST_ACTIVE_SLOT_KEY = 'fcs_last_active_slot';
export let currentSaveSlot = 1;

/**
 * Thiết lập slot lưu hiện tại (1 - 5).
 * @param {number|string} slotId
 */
export function setCurrentSaveSlot(slotId) {
  const parsed = Number(slotId);
  currentSaveSlot = (parsed >= 1 && parsed <= TOTAL_SAVE_SLOTS) ? parsed : 1;
  try {
    localStorage.setItem(LAST_ACTIVE_SLOT_KEY, String(currentSaveSlot));
  } catch (err) {
    console.warn('[Storage] Could not persist last active slot:', err);
  }
}

/**
 * Lấy chỉ số slot lưu hiện tại.
 * @returns {number}
 */
export function getCurrentSaveSlot() {
  return currentSaveSlot;
}

/**
 * Lấy slot được chơi gần nhất.
 * @returns {number}
 */
export function getLastActiveSlot() {
  try {
    const raw = localStorage.getItem(LAST_ACTIVE_SLOT_KEY);
    if (raw) {
      const parsed = Number(raw);
      if (parsed >= 1 && parsed <= TOTAL_SAVE_SLOTS) return parsed;
    }
  } catch (err) {}

  // Nếu chưa có, tìm slot đầu tiên có dữ liệu
  for (let i = 1; i <= TOTAL_SAVE_SLOTS; i++) {
    if (localStorage.getItem(`${SLOT_KEY_PREFIX}${i}`)) return i;
  }
  return 1;
}

/**
 * Lấy key localStorage của một slot.
 * @param {number} [slotId]
 * @returns {string}
 */
export function getSaveSlotKey(slotId = currentSaveSlot) {
  const s = (slotId !== undefined && slotId !== null) ? Number(slotId) : currentSaveSlot;
  return `${SLOT_KEY_PREFIX}${s || 1}`;
}

/**
 * Tự động migrate file save cũ vào Slot 1 nếu Slot 1 đang trống.
 */
export function migrateLegacySavesIfNeeded() {
  try {
    const slot1Key = `${SLOT_KEY_PREFIX}1`;
    if (!localStorage.getItem(slot1Key)) {
      const legacyRaw = localStorage.getItem('fcs_save_v1') || 
                        localStorage.getItem('football_career_save') || 
                        localStorage.getItem('playerSave');
      if (legacyRaw) {
        localStorage.setItem(slot1Key, legacyRaw);
        localStorage.setItem(LAST_ACTIVE_SLOT_KEY, '1');
      }
    }
  } catch (e) {
    console.warn('[Storage] Legacy migration warning:', e);
  }
}

/**
 * Lấy thông tin tóm tắt 5 ô lưu trữ.
 * Duyệt qua 5 slot, trả về thông tin (Tên cầu thủ, CLB, Mùa giải, Ngày lưu) nếu slot có dữ liệu;
 * hoặc ghi "Trống (Empty Slot)" nếu chưa có save.
 * @returns {Array<{ slotId: number, isEmpty: boolean, name: string, club: string, season: string, age: number|null, position: string, savedAt: string, rawSavedAt: string }>}
 */
export function getSaveSlotsInfo() {
  migrateLegacySavesIfNeeded();
  const list = [];
  for (let slotId = 1; slotId <= TOTAL_SAVE_SLOTS; slotId++) {
    const key = `${SLOT_KEY_PREFIX}${slotId}`;
    let raw = localStorage.getItem(key);
    if (!raw && slotId === 1) {
      raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem('football_career_save') || localStorage.getItem('playerSave');
      if (raw) {
        try { localStorage.setItem(key, raw); } catch (e) {}
      }
    }

    if (!raw) {
      list.push({
        slotId,
        isEmpty: true,
        name: 'Trống (Empty Slot)',
        club: '---',
        season: '---',
        age: null,
        position: '---',
        savedAt: 'Trống (Empty Slot)',
        rawSavedAt: ''
      });
      continue;
    }

    try {
      const payload = JSON.parse(raw);
      const p = payload?.player;
      if (!p || !p.name) {
        list.push({
          slotId,
          isEmpty: true,
          name: 'Trống (Empty Slot)',
          club: '---',
          season: '---',
          age: null,
          position: '---',
          savedAt: 'Trống (Empty Slot)',
          rawSavedAt: ''
        });
        continue;
      }

      const formattedDate = payload.savedAt ? new Date(payload.savedAt).toLocaleString('vi-VN') : 'Không rõ ngày';
      const seasonText = p.seasonsPlayed ? `Mùa ${p.seasonsPlayed + 1}` : 'Mùa 1 (Khởi đầu)';
      const clubName = p.currentClub?.name || p.academy?.name || 'Học viện trẻ';

      list.push({
        slotId,
        isEmpty: false,
        name: p.name,
        club: clubName,
        season: seasonText,
        age: p.age || 16,
        position: p.position || 'FW',
        money: p.money || 0,
        savedAt: formattedDate,
        rawSavedAt: payload.savedAt || ''
      });
    } catch {
      list.push({
        slotId,
        isEmpty: true,
        name: 'Trống (Empty Slot)',
        club: '---',
        season: '---',
        age: null,
        position: '---',
        savedAt: 'Trống (Empty Slot)',
        rawSavedAt: ''
      });
    }
  }
  return list;
}

/**
 * Kiểm tra tồn tại file save hợp lệ ở slot chỉ định hoặc bất kỳ slot nào.
 * @param {number} [slotId]
 * @returns {boolean}
 */
export function hasSaveFile(slotId = currentSaveSlot) {
  try {
    const target = Number(slotId) || currentSaveSlot;
    const key = `${SLOT_KEY_PREFIX}${target}`;
    const raw = localStorage.getItem(key);
    if (!raw) {
      if (target === 1) {
        const legacy = localStorage.getItem(SAVE_KEY) || localStorage.getItem('football_career_save');
        return Boolean(legacy);
      }
      return false;
    }
    const parsed = JSON.parse(raw);
    return Boolean(parsed && parsed.player && parsed.player.name);
  } catch {
    return false;
  }
}

/**
 * Kiểm tra xem có ít nhất một slot có dữ liệu hay không.
 * @returns {boolean}
 */
export function hasAnySaveFile() {
  const slots = getSaveSlotsInfo();
  return slots.some(s => !s.isEmpty);
}

/**
 * Thuật toán tìm ô lưu trữ (Slot) trống đầu tiên theo thứ tự từ thấp đến cao (1 -> 2 -> 3 -> 4 -> 5).
 * - Quét danh sách slot từ 1 đến 5:
 *   + NẾU tìm thấy slot còn trống (isEmpty === true) có số thứ tự nhỏ nhất: trả về slotId đó.
 *   + NẾU cả 5 slot đều đã có dữ liệu: trả về Slot 1 (hoặc currentSaveSlot).
 * @returns {number} slotId (1 - 5)
 */
export function getFirstAvailableSlot() {
  const slots = getSaveSlotsInfo();
  const emptySlot = slots.find(s => s.isEmpty);
  if (emptySlot) {
    return Number(emptySlot.slotId);
  }
  return currentSaveSlot || 1;
}

/**
 * Lưu game vào slot chỉ định hoặc slot hiện tại.
 * @param {object|number} [playerOrSlot]
 * @param {number} [maybeSlotId]
 * @returns {{ success: boolean, message: string, slotId: number }}
 */
export function saveGame(playerOrSlot, maybeSlotId) {
  let player = playerOrSlot;
  let slotId = maybeSlotId;

  // Hỗ trợ gọi saveGame(slotId)
  if (typeof playerOrSlot === 'number' || (typeof playerOrSlot === 'string' && !isNaN(Number(playerOrSlot)))) {
    slotId = Number(playerOrSlot);
    player = (typeof window !== 'undefined' && window.getPlayer) ? window.getPlayer() : null;
  }

  if (!slotId) {
    slotId = currentSaveSlot || 1;
  }

  if (!player && typeof window !== 'undefined' && window.getPlayer) {
    player = window.getPlayer();
  }

  if (!player) {
    return { success: false, message: 'Không tìm thấy dữ liệu player để lưu!', slotId };
  }

  try {
    const payload = {
      version: SAVE_VERSION,
      savedAt: new Date().toISOString(),
      player: player,
      slotId: slotId
    };

    const key = `${SLOT_KEY_PREFIX}${slotId}`;
    const serialized = JSON.stringify(payload);
    localStorage.setItem(key, serialized);
    setCurrentSaveSlot(slotId);

    // Đồng bộ legacy key cho tương thích
    localStorage.setItem(SAVE_KEY, serialized);
    localStorage.setItem('football_career_save', serialized);
    localStorage.setItem('playerSave', serialized);

    return { success: true, message: `Đã lưu game vào Slot ${slotId}!`, slotId };
  } catch (err) {
    console.error(`[Storage] saveGame error on Slot ${slotId}:`, err);
    return { success: false, message: 'Lưu game thất bại: ' + err.message, slotId };
  }
}

/**
 * Tải game từ slot chỉ định (hoặc slot gần nhất).
 * @param {number} [slotId]
 * @returns {{ player: object, savedAt: string, slotId: number } | null}
 */
export function loadGame(slotId) {
  migrateLegacySavesIfNeeded();
  let targetSlot = (slotId !== undefined && slotId !== null) ? Number(slotId) : getLastActiveSlot();
  if (isNaN(targetSlot) || targetSlot < 1 || targetSlot > TOTAL_SAVE_SLOTS) {
    targetSlot = 1;
  }

  const key = `${SLOT_KEY_PREFIX}${targetSlot}`;
  let raw = localStorage.getItem(key);

  if (!raw && targetSlot === 1) {
    raw = localStorage.getItem(SAVE_KEY) || localStorage.getItem('football_career_save') || localStorage.getItem('playerSave');
    if (raw) {
      try { localStorage.setItem(key, raw); } catch (e) {}
    }
  }

  if (!raw) {
    // Nếu slot này trống nhưng có slot khác có save, kiểm tra slot đầu tiên có save
    const firstSaved = getSaveSlotsInfo().find(s => !s.isEmpty);
    if (firstSaved) {
      targetSlot = firstSaved.slotId;
      raw = localStorage.getItem(`${SLOT_KEY_PREFIX}${targetSlot}`);
    }
  }

  if (!raw) return null;

  try {
    const payload = JSON.parse(raw);
    if (!payload || !payload.player) return null;

    let player = payload.player;
    const savedVersion = payload.version || 1;
    if (savedVersion < SAVE_VERSION) {
      player = _migrate(player);
    }

    if (!_validate(player)) {
      console.warn(`[Storage] Save validation failed in Slot ${targetSlot}`);
      return null;
    }

    setCurrentSaveSlot(targetSlot);
    return { player, savedAt: payload.savedAt, slotId: targetSlot };
  } catch (err) {
    console.error(`[Storage] loadGame error for Slot ${targetSlot}:`, err);
    return null;
  }
}

/**
 * Xoá dữ liệu một ô lưu.
 * @param {number} slotId
 */
export function deleteSaveSlot(slotId) {
  try {
    const target = Number(slotId) || currentSaveSlot;
    const key = `${SLOT_KEY_PREFIX}${target}`;
    localStorage.removeItem(key);
    clearCupCache(target);

    // Xoá cả legacy nếu xoá slot 1
    if (target === 1) {
      localStorage.removeItem(SAVE_KEY);
      localStorage.removeItem('football_career_save');
      localStorage.removeItem('playerSave');
    }

    // Nếu slot hiện tại vừa bị xoá, chọn slot gần nhất còn dữ liệu
    if (currentSaveSlot === target) {
      const remainingSlots = getSaveSlotsInfo().filter(s => !s.isEmpty);
      if (remainingSlots.length > 0) {
        setCurrentSaveSlot(remainingSlots[0].slotId);
      }
    }
  } catch (err) {
    console.error(`[Storage] deleteSaveSlot error for Slot ${slotId}:`, err);
  }
}

/**
 * Xóa sạch cache Cúp của một slot (tránh ô nhiễm dữ liệu giữa các slot).
 * @param {number|string} slotId
 */
export function clearCupCache(slotId) {
  try {
    const s = Number(slotId) || currentSaveSlot || 1;
    localStorage.removeItem(`save_slot_${s}_cup`);
    localStorage.removeItem(`fcs_cup_cache_${s}`);
  } catch (err) {
    console.warn(`[Storage] Failed to clear cup cache for slot ${slotId}:`, err);
  }
}

/**
 * Tải dữ liệu Save Slot chỉ định (wrapper chuẩn hóa theo ES6 module).
 * @param {number|string} slotId
 * @returns {{ player: object, savedAt: string, slotId: number } | null}
 */
export function loadSlot(slotId) {
  return loadGame(slotId);
}

/**
 * Lưu dữ liệu vào Save Slot chỉ định (wrapper chuẩn hóa theo ES6 module).
 * @param {object} player
 * @param {number|string} [slotId]
 * @returns {{ success: boolean, message: string, slotId: number }}
 */
export function saveSlot(player, slotId) {
  return saveGame(player, slotId);
}

/**
 * Khởi tạo một Slot mới sạch trắng:
 * - Xóa trắng cache Cúp của slot đó (save_slot_${slotId}_cup)
 * - Thiết lập currentSaveSlot = slotId
 * - Xóa dữ liệu cũ nếu có hoặc lưu dữ liệu nhân vật mới vào slot
 * @param {number|string} slotId
 * @param {object} [initialPlayerData]
 * @returns {{ success: boolean, slotId: number, player: object|null }}
 */
export function initNewSlot(slotId, initialPlayerData = null) {
  const targetSlot = Number(slotId) || 1;
  setCurrentSaveSlot(targetSlot);
  clearCupCache(targetSlot);

  if (initialPlayerData) {
    // Đảm bảo dữ liệu tournament / cup của player mới tinh
    if (initialPlayerData.tournamentBrackets) {
      initialPlayerData.tournamentBrackets = { domesticCup: null, continentalCup: null };
    }
    if (initialPlayerData.tournamentData) {
      initialPlayerData.tournamentData = {};
    }
    initialPlayerData.slotId = targetSlot;
    saveSlot(initialPlayerData, targetSlot);
    return { success: true, slotId: targetSlot, player: initialPlayerData };
  } else {
    // Dọn dẹp key lưu trữ cũ của slot này để sẵn sàng tạo mới
    const key = `${SLOT_KEY_PREFIX}${targetSlot}`;
    localStorage.removeItem(key);
    return { success: true, slotId: targetSlot, player: null };
  }
}

/**
 * Xoá file save (tương thích backward).
 * @param {number} [slotId]
 */
export function deleteSaveFile(slotId = currentSaveSlot) {
  deleteSaveSlot(slotId);
}

/**
 * Lấy thông tin tóm tắt save (để hiển thị trên giao diện).
 * @param {number} [slotId]
 * @returns {{ slotId: number, name: string, age: number, club: string, season: string, savedAt: string } | null}
 */
export function getSaveSummary(slotId = currentSaveSlot) {
  const target = Number(slotId) || getLastActiveSlot();
  const info = getSaveSlotsInfo().find(s => s.slotId === target);
  if (!info || info.isEmpty) return null;
  return {
    slotId: info.slotId,
    name: info.name,
    age: info.age,
    club: info.club,
    season: info.season,
    savedAt: info.savedAt
  };
}

/**
 * Auto-save helper — gọi sau mỗi action quan trọng vào slot hiện tại.
 * @param {object} player
 * @returns {boolean}
 */
export function autoSave(player) {
  const result = saveGame(player, currentSaveSlot);
  if (!result.success) {
    console.warn('[AutoSave] Failed:', result.message);
  }
  return result.success;
}

