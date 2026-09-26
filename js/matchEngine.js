/* =========================================================================
   FOOTBALL CAREER SIMULATOR — MATCH ENGINE & LIVE ARENA SIMULATION (ES6 Module)
   ========================================================================= */

import { 
  getPositionGroup, 
  getEligibleMatchEventTemplates 
} from './data.js';

import { 
  generateCommentary,
  getRandomGoalCommentary,
  getRandomAssistCommentary
} from './commentaryData.js';

/**
 * Lấy tuyến thi đấu của cầu thủ (FW, MF, DF, GK)
 */
export function getPlayerLine(player) {
  if (!player) return 'FW';
  return player.positionGroup || getPositionGroup(player.position);
}

export const XG_VALUES = {
  PENALTY: 0.79,
  ONE_ON_ONE: 0.65,
  CLOSE_TAP_IN: 0.50,
  BOX_HEADER: 0.20,
  LONG_RANGE: 0.07
};

export const RATING_DELTAS = {
  PASS_FAIL: -0.2,
  TACKLE_SUCCESS: +0.3,
  KEY_PASS: +0.5,
  GOAL: +1.2,
  ASSIST: +0.7,
  BLUNDER_GOAL: -1.5,
  YELLOW_CARD: -0.3,
  RED_CARD: -2.0
};

export function applyLiveRatingDelta(currentRating, delta) {
  const newRating = Math.max(1.0, Math.min(10.0, Number((currentRating + delta).toFixed(1))));
  return newRating;
}

// =========================================================================
// AI PLAYERS & GOALKEEPERS DATABASE FOR COMMENTARY & REALISTIC TIMELINE
// =========================================================================
const ACADEMY_PLAYERS_MAP = {
  'barcelona': ['Marc Guiu', 'Toni Fernández', 'Guille Fernández', 'Pau Prim', 'Dani Rodríguez', 'Quim Junyent'],
  'la masia': ['Marc Guiu', 'Toni Fernández', 'Guille Fernández', 'Pau Prim', 'Dani Rodríguez', 'Quim Junyent'],
  'real madrid': ['Nico Paz', 'Gonzalo García', 'Álvaro Rodríguez', 'Jacobo Ramón', 'Pol Fortuny', 'César Palacios'],
  'castilla': ['Nico Paz', 'Gonzalo García', 'Álvaro Rodríguez', 'Jacobo Ramón', 'Pol Fortuny', 'César Palacios'],
  'manchester united': ['Ethan Wheatley', 'Shea Lacey', 'Gabriele Biancheri', 'Jack Fletcher', 'Harry Amass', 'James Scanlon'],
  'chelsea': ['Tyrique George', 'Josh Acheampong', 'Kiano Dyer', 'Deivid Washington', 'Ato Ampah', 'Shumaira Mheuka'],
  'manchester city': ['Justin Oboavwoduo', 'Jaden Heskey', 'Joel Ndala', 'Mahamadou Susoho', 'Farid Alfa-Ruprecht', 'Jacob Wright'],
  'arsenal': ['Ethan Nwaneri', 'Myles Lewis-Skelly', 'Chido Obi', 'Amario Cozier-Duberry', 'Ismeal Kabia', 'Ayden Heaven'],
  'bayern': ['Paul Wanner', 'Nestory Irankunda', 'Gabriel Vidović', 'Javier Fernández', 'Adam Aznou', 'Noel Aseko Nkili'],
  'dortmund': ['Paris Brunner', 'Cole Campbell', 'Kjell Wätjen', 'Almugera Kabar', 'Julian Hencke', 'Vincenzo Onofrietti'],
  'psg': ['Senny Mayulu', 'Ibrahim Mbaye', 'Yoram Zague', 'Joane Gadou', 'Ethan Mbappé', 'Ayman Kari'],
  'ajax': ['Mika Godts', 'Julian Rijkhoff', 'Silvano Vos', 'Jaydon Banel', 'Jan Faberski', 'Rayane Bounida'],
  'sporting': ['Rodrigo Ribeiro', 'Geovany Quenda', 'Afonso Moreira', 'Mauro Couto', 'Manuel Mendonça', 'Rafael Nel'],
  'benfica': ['Gianluca Prestianni', 'João Rego', 'Gustavo Varela', 'Hugo Félix', 'José Melro', 'Diogo Prioste'],
  'juventus': ['Kenan Yıldız', 'Samuel Mbangula', 'Lorenzo Anghelè', 'Tommaso Mancini', 'Luis Hasa', 'Joseph Nonge'],
  'milan': ['Francesco Camarda', 'Kevin Zeroli', 'Diego Sia', 'Chaka Traorè', 'Mattia Liberali', 'Filippo Scotti'],
  'river plate': ['Franco Mastantuono', 'Agustín Ruberto', 'Ian Subiabre', 'Claudio Echeverri', 'Tobías Leiva', 'Santiago Lencina'],
  'santos': ['Gabriel Mec', 'Luca Meirelles', 'Enzo Monteiro', 'Miguelito', 'Hyan', 'Bernardo']
};

const GENERAL_TALENT_POOL = [
  'Marc Guiu', 'Ethan Wheatley', 'Nico Paz', 'Francesco Camarda',
  'Franco Mastantuono', 'Paul Wanner', 'Mika Godts', 'Rodrigo Ribeiro',
  'Kenan Yıldız', 'Tyrique George', 'Senny Mayulu', 'Geovany Quenda',
  'Paris Brunner', 'Ethan Nwaneri', 'Agustín Ruberto', 'Gianluca Prestianni'
];

const ACADEMY_GK_MAP = {
  'barcelona': 'Diego Kochen',
  'la masia': 'Diego Kochen',
  'real madrid': 'Fran González',
  'castilla': 'Fran González',
  'manchester united': 'Elyh Harrison',
  'chelsea': 'Teddy Sharman-Lowe',
  'manchester city': 'True Grant',
  'arsenal': 'Tommy Setford',
  'bayern': 'Max Schmitt',
  'dortmund': 'Robin Lisewski',
  'psg': 'Bilal Laurendon',
  'ajax': 'Charlie Setford',
  'sporting': 'Francisco Silva',
  'benfica': 'André Gomes',
  'juventus': 'Giovanni Daffara',
  'milan': 'Lorenzo Torriani',
  'river plate': 'Lucas Lavagnino',
  'santos': 'Gustavo Jundi'
};

export function getRandomAiPlayerName(clubName) {
  if (!clubName) {
    return GENERAL_TALENT_POOL[Math.floor(Math.random() * GENERAL_TALENT_POOL.length)];
  }
  const cName = String(clubName).toLowerCase();
  for (const [key, players] of Object.entries(ACADEMY_PLAYERS_MAP)) {
    if (cName.includes(key)) {
      return players[Math.floor(Math.random() * players.length)];
    }
  }
  return GENERAL_TALENT_POOL[Math.floor(Math.random() * GENERAL_TALENT_POOL.length)];
}

export function getRandomAiOpponentName(opponentClubName) {
  return getRandomAiPlayerName(opponentClubName);
}

export function getRandomAiTeammateName(teamClubName) {
  return getRandomAiPlayerName(teamClubName);
}

export function getAiGoalkeeperName(clubName) {
  if (!clubName) return 'Thủ môn đối phương';
  const cName = String(clubName).toLowerCase();
  for (const [key, gk] of Object.entries(ACADEMY_GK_MAP)) {
    if (cName.includes(key)) {
      return `${gk} (Thủ môn ${clubName})`;
    }
  }
  return `Thủ môn ${clubName}`;
}

export function getHomeGoalkeeperName(sim, player) {
  if (player && (player.position === 'GK' || getPlayerLine(player) === 'GK')) {
    return `${player.name} (BẠN) ⭐`;
  }
  if (player?.currentClub?.squad && Array.isArray(player.currentClub.squad)) {
    const gk = player.currentClub.squad.find(m => m.pos === 'GK' || m.position === 'GK');
    if (gk && gk.name) return `${gk.name} (Thủ môn ${sim?.playerClubName || sim?.playerTeamName || 'đội nhà'})`;
  }
  const clubName = sim?.playerClubName || sim?.playerTeamName || player?.academy?.name || 'đội nhà';
  return getAiGoalkeeperName(clubName);
}

/**
 * Thuật toán xác định số lượng và thời gian sự kiện trong trận đấu (Match Arena Timeline & Events)
 * 1. Phân phối xác suất số lượng sự kiện:
 *    - 25% cơ hội: 4 - 5 sự kiện (trận đấu giằng co)
 *    - 60% cơ hội: 5 - 7 sự kiện (phổ biến)
 *    - 15% cơ hội: 8 - 12 sự kiện (đôi công rực lửa)
 * 2. Phân bổ thời gian rải đều từ phút 5 đến 90+
 */
export function initMatchTimeline(customEventsCount = null) {
  let totalEventsCount = customEventsCount;
  if (!totalEventsCount) {
    const rand = Math.random();
    if (rand < 0.25) {
      totalEventsCount = Math.floor(Math.random() * 2) + 4; // 4 - 5
    } else if (rand < 0.85) {
      totalEventsCount = Math.floor(Math.random() * 3) + 5; // 5 - 7
    } else {
      totalEventsCount = Math.floor(Math.random() * 5) + 8; // 8 - 12
    }
  }

  const N = totalEventsCount;
  const startMin = 5;
  const endMin = 90;
  const step = (endMin - startMin) / N;
  const tickMinutes = [];

  let lastMin = startMin - 1;
  for (let i = 0; i < N; i++) {
    const slotStart = startMin + i * step;
    const offset = Math.random() * (step * 0.75);
    let m = Math.round(slotStart + offset);
    if (m <= lastMin) {
      m = lastMin + 1;
    }
    if (i === N - 1 && m < 88) {
      m = Math.min(94, 89 + Math.floor(Math.random() * 5)); // 89 - 93 (phút 90+)
    }
    m = Math.min(94, Math.max(5, m));
    if (m <= lastMin) m = lastMin + 1;
    lastMin = m;
    tickMinutes.push(m);
  }

  return { totalEventsCount, tickMinutes };
}

export const generateMatchEvents = initMatchTimeline;

/**
 * Khởi tạo phiên mô phỏng trận đấu chuyên sâu theo nhịp ticks (Deep Match Simulation)
 * @param {object} player 
 * @param {object} matchData 
 * @returns {object}
 */
export function createDeepMatchSimulation(player, matchData = {}) {
  const isPlayerHome = matchData.isPlayerHome !== undefined ? matchData.isPlayerHome : true;
  const currentFix = player?.currentSeasonFixtures ? player.currentSeasonFixtures[player.currentFixtureIndex || 0] : null;
  const isNational = Boolean(
    matchData.isNationalTeam || 
    matchData.type === 'NATIONAL_TEAM' || 
    matchData.competitionType === 'NATIONAL_TEAM' ||
    (currentFix && (currentFix.isNationalTeam || currentFix.type === 'NATIONAL_TEAM' || currentFix.competitionType === 'NATIONAL_TEAM'))
  );
  const playerClub = player.isAcademyStage ? player.academy : player.currentClub;
  const playerClubName = isNational 
    ? (player.nationality?.name || "Đội Tuyển Quốc Gia")
    : (playerClub ? playerClub.name : (player.isAcademyStage ? "Học Viện Trẻ" : "CLB Chủ Quản"));
  const playerClubIcon = isNational 
    ? (player.nationality?.flag || "🚩")
    : (playerClub ? playerClub.icon : (player.isAcademyStage ? "🌱" : "🛡️"));

  const opponentName = matchData.opponentName || "Đại Kình Địch";
  const opponentIcon = matchData.opponentIcon || "⚔️";

  const homeName = isPlayerHome ? playerClubName : opponentName;
  const homeIcon = isPlayerHome ? playerClubIcon : opponentIcon;
  const awayName = isPlayerHome ? opponentName : playerClubName;
  const awayIcon = isPlayerHome ? opponentIcon : playerClubIcon;

  // Vai trò đội hình dựa theo Niềm tin HLV (Manager Trust)
  const squadRole = player.squadRole || 'KEY_PLAYER';
  const isBench = squadRole === 'BENCH';
  const isTransferListed = squadRole === 'TRANSFER_LISTED';

  // Tính toán sức mạnh tuyến giữa (Midfield Power) & tổng lực
  const playerOvr = Math.round((player.attr1 + player.attr2 + player.attr3 + player.attr4) / 4);
  const isYouthTier = Boolean(player.isAcademyStage || player.competitionTier?.currentTier === 3);

  const playerMidfieldPower = getPlayerLine(player) === 'MF' 
    ? Math.round(playerOvr * 1.1) 
    : (isNational ? (player.nationality?.power || 80) : (isYouthTier ? 54 : (player.currentClub?.power || 78)));
  
  // Tự động cân bằng độ khó theo cấp độ giải đấu (Tier-based Difficulty Scaling)
  let opponentPower = matchData.opponentPower;
  if (!opponentPower) {
    if (isNational) {
      opponentPower = 82;
    } else if (isYouthTier) {
      // Ở cấp độ Giải trẻ (Tier 3 / Youth Academy): Chỉ số đối thủ chỉ dao động 50 - 56
      opponentPower = 50 + Math.floor(Math.random() * 7);
    } else {
      opponentPower = Math.max(62, (player.currentClub?.power || 75) + Math.floor(Math.random() * 9 - 4));
    }
  } else if (isYouthTier) {
    // Nếu matchData truyền vào chỉ số quá cao, tự động scale theo Tier 3
    opponentPower = Math.min(58, Math.max(50, opponentPower));
  }
  const opponentMidfieldPower = Math.round(opponentPower * (0.95 + Math.random() * 0.1));

  // Lịch trình sự kiện tương tác của người chơi rải đều từ phút 5 đến 90+
  const timeline = initMatchTimeline();
  const tickMinutes = timeline.tickMinutes;
  const totalEventsCount = timeline.totalEventsCount;

  const sim = {
    isPlayerHome,
    homeName,
    homeIcon,
    awayName,
    awayIcon,
    playerClubName,
    playerTeamName: isPlayerHome ? homeName : awayName,
    opponentName,
    playerMidfieldPower,
    opponentMidfieldPower,
    currentTickIndex: 0,
    totalTicks: tickMinutes.length,
    tickMinutes,
    totalEventsCount,
    targetMoments: totalEventsCount,
    homeScore: 0,
    awayScore: 0,
    liveRating: 6.5, // Khởi điểm điểm số tích cực hơn (6.5 thay vì điểm chết 6.0)
    decisionMomentsCount: 0, // Bộ đếm đảm bảo cơ hội can thiệp
    inMatchStamina: (() => {
      let s = player.stam !== undefined ? player.stam : 80;
      if (player.preMatchPrep === 'REST') s = Math.min(100, s + 28);
      else if (player.preMatchPrep === 'LIGHT_TRAIN') s = Math.max(15, s - 8);
      else if (player.preMatchPrep === 'INTENSE_DRILL') s = Math.max(15, s - 18);
      return s;
    })(),
    videoAnalysisActive: player.preMatchPrep === 'VIDEO_ANALYSIS',
    squadRole,
    isPlayerOnBench: isBench,
    isPlayerSubbedOff: false,
    isTransferListed,
    xG: {
      player: 0.0,
      homeTeam: 0.0,
      awayTeam: 0.0
    },
    playerStats: {
      goals: 0,
      assists: 0,
      shots: 0,
      onTarget: 0,
      passesCompleted: 0,
      passesFailed: 0,
      tackles: 0,
      saves: 0,
      yellowCards: 0,
      redCards: 0,
      bigChancesCreated: 0,
      blunders: 0
    },
    ballPitchPercent: 50,
    currentZone: 'MIDFIELD', // 'DEFENSIVE_THIRD' | 'MIDFIELD' | 'ATTACKING_THIRD'
    eventsFeed: [],
    isFinished: false
  };

  return sim;
}

/**
 * Tính toán hệ số phạt/bù của Chân Nghịch (Weak Foot)
 * @param {number} weakFootRating (1 đến 5 sao)
 * @param {boolean} isWeakFootSituation Có phải tình huống sút/chuyền bằng chân nghịch không
 * @returns {number} Hệ số điều chỉnh (+0.0, -0.05, -0.10, -0.25)
 */
export function getWeakFootModifier(weakFootRating = 3, isWeakFootSituation = false) {
  if (!isWeakFootSituation) return 0;
  const wf = Math.max(1, Math.min(5, Number(weakFootRating) || 3));
  if (wf >= 5) return 0;       // Hai chân như một: 100% uy lực, xóa bỏ hoàn toàn điểm phạt
  if (wf === 4) return -0.05;  // Giảm nhẹ 5%
  if (wf === 3) return -0.10;  // Giảm nhẹ 10%
  return -0.25;                // Dưới 3 sao: Giảm 25% tỷ lệ thành công
}

/**
 * Tính toán điểm cộng tỷ lệ thành công của Kỹ Thuật (Skill Moves)
 * @param {number} skillMovesRating (1 đến 6 sao)
 * @returns {number} Tỷ lệ cộng thêm (+0.0, +0.10, +0.15, +0.25)
 */
export function getSkillMovesBonus(skillMovesRating = 3) {
  const sm = Math.max(1, Math.min(6, Number(skillMovesRating) || 3));
  if (sm >= 6) return 0.25;    // 6⭐ Trickster+ Tối Thượng: +25%
  if (sm === 5) return 0.15;    // 5⭐: +15%
  if (sm === 4) return 0.10;    // 4⭐: +10%
  return 0.0;                  // 1⭐ - 3⭐: Lựa chọn cơ bản
}

/**
 * Sinh tình huống lựa chọn bước ngoặt (Decision Moment) cho người chơi
 * Bốc ngẫu nhiên từ danh sách sự kiện hợp lệ theo vị trí thi đấu (MATCH_EVENT_TEMPLATES)
 */
export function createDecisionMoment(player, minute, isFatigued, zone = 'ATTACKING_THIRD') {
  const isYouthTier = Boolean(player.isAcademyStage || player.competitionTier?.currentTier === 3);
  const penaltyAccuracyMult = isFatigued ? 0.80 : 1.0;
  const tierSuccessBonus = isYouthTier ? 0.22 : 0.08;

  // 1. Lấy danh sách sự kiện hợp lệ theo vị trí của người chơi
  const playerPos = player.position || 'ST';
  const availableTemplates = getEligibleMatchEventTemplates(playerPos);

  if (availableTemplates && availableTemplates.length > 0) {
    // 2. Bốc ngẫu nhiên (random) từ availableTemplates (bao gồm Penalty Kick, Free Kick, Corner Kick...)
    const tpl = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    const title = typeof tpl.title === 'function' 
      ? tpl.title(minute) 
      : `${tpl.title || tpl.name} Phút ${minute}`;

    return {
      minute,
      title,
      desc: tpl.desc,
      // 3. Truyền thẳng các tùy chọn (options/choices) của template vào giao diện Match Arena
      choices: tpl.choices.map(c => {
        const statVal = (c.statKey && player.subStats && player.subStats[c.statKey] !== undefined)
          ? player.subStats[c.statKey]
          : ((c.statKey && player.stats && player.stats[c.statKey] !== undefined)
            ? player.stats[c.statKey]
            : ((c.statKey && player[c.statKey] !== undefined)
              ? player[c.statKey]
              : (player.attr1 || 60)));
        const baseChance = c.baseSuccessChance || 0.75;
        const statBonus = ((statVal - 50) / 100) * 0.35;
        const videoBonus = (player.preMatchPrep === 'VIDEO_ANALYSIS' || player._tacticalPrepBonus) ? 0.05 : 0;

        // --- HỆ THỐNG CHÂN NGHỊCH (WEAK FOOT) & KỸ THUẬT (SKILL MOVES) ---
        const smRating = Math.max(1, Math.min(6, Number(player.skillMoves) || 3));
        const wfRating = Math.max(1, Math.min(5, Number(player.weakFoot) || 3));

        const isDribbleAction = Boolean(
          c.id?.includes('DRIBBLE') || 
          c.id?.includes('PANENKA') || 
          c.id?.includes('SKILL') || 
          c.statKey === 'attr4' || 
          /rê|lừa|đột phá|qua người|trivela/i.test(c.text || '') || 
          /take-on|dribbl/i.test(tpl.name || '')
        );

        const isWeakFootAction = Boolean(
          c.isWeakFoot || 
          c.id?.includes('WEAK_FOOT') || 
          /chân nghịch|chân không thuận|góc bất lợi/i.test(c.text || '') || 
          /chân nghịch/i.test(tpl.name || '')
        );

        let skillBonus = 0;
        let wfPenalty = 0;
        let choiceText = typeof c.text === 'function' ? c.text(player) : c.text;

        if (isDribbleAction) {
          skillBonus = getSkillMovesBonus(smRating);
          if (smRating >= 6) {
            if (/biểu diễn|vượt qua|lừa qua/i.test(choiceText)) {
              choiceText = '🪄 [Trickster+ 6⭐] Đảo chân Elastico kép xâu kim qua 2 hậu vệ xộc thẳng vào cấm địa';
            }
          }
        }

        if (isWeakFootAction) {
          wfPenalty = getWeakFootModifier(wfRating, true);
        }

        const isShootingAction = Boolean(
          c.id?.includes('SHOOT') || 
          c.id?.includes('FINISH') || 
          c.statKey === 'sho' || 
          /sút|dứt điểm|cứa lòng|đại bác|lốp bóng|vô-lê/i.test(c.text || '')
        );

        const isBreakthrough = statVal >= 100;
        let breakthroughCriticalBonus = 0;
        if (isBreakthrough) {
          // Mở khóa tỷ lệ chí mạng (Critical Success Chance): Bỏ qua hoàn toàn chỉ số cản phá của thủ môn/hậu vệ AI
          breakthroughCriticalBonus = 0.10 + Math.min(0.08, (statVal - 100) * 0.01);
        }

        const calcChance = Math.max(0.30, Math.min(0.99, (baseChance + statBonus + skillBonus + wfPenalty + breakthroughCriticalBonus) * penaltyAccuracyMult + tierSuccessBonus + videoBonus));

        let statHintText = typeof c.statHint === 'function' ? c.statHint(player) : c.statHint;
        if (!statHintText) {
          statHintText = `Dựa vào ${c.statName || 'Chỉ số'} (${statVal})`;
        }
        if (isBreakthrough) {
          statHintText += ` | ⚡ Đột Phá Thần Thoại (${statVal}): Tỷ lệ chí mạng, xuyên thủng hàng thủ!`;
        }
        if (isDribbleAction) {
          if (smRating >= 6) {
            statHintText += ` | 🪄 Trickster+ (+25% tỷ lệ, -50% rủi ro phạm lỗi)`;
          } else if (smRating >= 4) {
            statHintText += ` | ⭐ Kỹ Thuật ${smRating}⭐ (+${Math.round(skillBonus * 100)}% tỷ lệ)`;
          }
        }
        if (isWeakFootAction) {
          if (wfRating >= 5) {
            statHintText += ` | ✨ Hai Chân Như Một (5⭐, 100% Uy Lực)`;
          } else {
            statHintText += ` | 👟 Chân Nghịch (${wfRating}⭐, ${Math.round(wfPenalty * 100)}% tỷ lệ)`;
          }
        }

        // Rê bóng / Kỹ thuật >= 100: Miễn nhiễm hoàn toàn với các pha tắc bóng thông thường
        let cardRiskVal = (c.cardRisk || 0) * (isDribbleAction && smRating >= 6 ? 0.5 : 1.0);
        if (isDribbleAction && (statVal >= 100 || (player.stats?.dri || 0) >= 100)) {
          cardRiskVal = 0;
        }

        let customSuccessText = c.successText || null;
        if (isBreakthrough && isShootingAction) {
          customSuccessText = '⚡ SIÊU PHẨM THẦN THOẠI! Quỹ đạo bóng xé gió vượt ngưỡng con người, thủ môn chỉ có thể đứng nhìn trong tuyệt vọng!';
        } else if (isBreakthrough && isDribbleAction) {
          customSuccessText = '⚡ VŨ ĐIỆU BẤT KHẢ XÂM PHẠM! Pha rê bóng đạt cảnh giới thần thoại khiến mọi pha tắc bóng đều bị hóa giải hoàn toàn!';
        }

        return {
          text: choiceText,
          statHint: statHintText,
          xG: c.xG || 0.50,
          successChance: calcChance,
          successType: c.successType || 'GOAL',
          failType: c.failType || 'MISS',
          fameBonus: c.fameBonus || 0,
          ratingBonus: c.ratingBonus || 0,
          cardRisk: cardRiskVal,
          successText: customSuccessText
        };
      })
    };
  }

  // Fallback
  return {
    minute,
    title: `Cơ Hội Mở Toang Khung Thành Phút ${minute}`,
    desc: `Bạn nhận được bóng ở cự ly thuận lợi trước vòng cấm! Cơ hội tạo nên bàn thắng đầu đời đang nằm trong chân bạn!`,
    choices: [
      {
        text: '⚽ Tự mình dứt điểm hiểm hóc',
        statHint: `Dựa vào Dứt Điểm (${player.attr1 || 60}) | xG: 0.65`,
        xG: XG_VALUES.ONE_ON_ONE,
        successChance: Math.min(0.92, ((player.attr1 || 60) / 85) * penaltyAccuracyMult + tierSuccessBonus),
        successType: 'GOAL',
        failType: 'MISS'
      },
      {
        text: '🎯 Chọc khe dọn cỗ cho đồng đội',
        statHint: `Dựa vào Chuyền Bóng & Kiến Thiết (${player.attr2 || 60}) | xG: 0.50`,
        xG: XG_VALUES.CLOSE_TAP_IN,
        successChance: Math.min(0.90, ((player.attr2 || 60) / 88) * penaltyAccuracyMult + tierSuccessBonus),
        successType: 'ASSIST',
        failType: 'PASS_FAIL'
      }
    ]
  };
}

export const rollArenaEvent = createDecisionMoment;

/**
 * Mô phỏng tiến trình 1 tick trong trận đấu
 * @param {object} sim 
 * @param {object} player 
 * @param {object|null} choiceResult 
 * @returns {object}
 */
export function simulateTickProgress(sim, player, choiceResult = null) {
  if (sim.isFinished || sim.currentTickIndex >= sim.totalTicks) {
    sim.isFinished = true;
    return { isFinished: true, isDecisionMoment: false, decisionData: null, tickEvent: null, sim };
  }

  // Nếu đang tua nhanh (Skip) mà gặp Decision Moment chưa resolve: tự động mô phỏng kết quả
  if (!choiceResult && sim.pendingDecisionTick === sim.currentTickIndex) {
    const isSuccess = Math.random() < 0.65;
    choiceResult = {
      actionType: isSuccess ? 'GOAL' : 'MISS',
      xG: 0.5
    };
    sim.pendingDecisionTick = null;
  }

  const minute = sim.tickMinutes[sim.currentTickIndex];
  const tactic = player.tactic || 'BALANCED';

  // 1. Thể lực suy giảm mỗi tick theo chiến thuật
  let stamDecay = 2.2;
  if (tactic === 'GEGENPRESSING') stamDecay = 3.3;
  else if (tactic === 'ATTACKING') stamDecay = 2.9;
  else if (tactic === 'DEFENSIVE_COUNTER') stamDecay = 1.5;
  else if (tactic === 'PARK_THE_BUS') stamDecay = 1.2;
  sim.inMatchStamina = Math.max(10, Number((sim.inMatchStamina - stamDecay).toFixed(1)));

  // Cảnh báo kiệt sức sau phút 70
  const isFatigued = minute >= 70 && sim.inMatchStamina < 40;

  // 2. Field Zone Progression dựa trên Midfield Power, Tactic & Form
  let playerTeamMomentum = sim.playerMidfieldPower * (player.form / 60);
  if (tactic === 'GEGENPRESSING') playerTeamMomentum *= 1.25;
  else if (tactic === 'ATTACKING') playerTeamMomentum *= 1.15;
  else if (tactic === 'DEFENSIVE_COUNTER') playerTeamMomentum *= 0.88;
  else if (tactic === 'PARK_THE_BUS') playerTeamMomentum *= 0.75;

  const opponentMomentum = sim.opponentMidfieldPower * (0.9 + Math.random() * 0.25);
  const totalMomentum = playerTeamMomentum + opponentMomentum;
  const playerControlRatio = playerTeamMomentum / totalMomentum; // 0.35 - 0.70

  // Tính vị trí bóng trên sân từ góc nhìn của đội người chơi (0% = gôn nhà, 100% = gôn đối phương)
  let baseBallPos = 35 + Math.round(playerControlRatio * 40) + Math.floor(Math.random() * 21 - 10);
  baseBallPos = Math.max(15, Math.min(88, baseBallPos));

  sim.ballPitchPercent = sim.isPlayerHome ? baseBallPos : (100 - baseBallPos);

  if (baseBallPos < 38) {
    sim.currentZone = 'DEFENSIVE_THIRD';
  } else if (baseBallPos <= 68) {
    sim.currentZone = 'MIDFIELD';
  } else {
    sim.currentZone = 'ATTACKING_THIRD';
  }

  const context = {
    min: minute,
    homeName: sim.homeName,
    awayName: sim.awayName,
    teamName: sim.playerTeamName,
    playerName: player.name,
    opponentName: sim.opponentName
  };

  let tickEvent = null;
  let isDecisionMoment = false;
  let decisionData = null;

  const pLine = getPlayerLine(player);
  const isGoalkeeper = (player.position === 'GK' || pLine === 'GK');

  // Nếu người chơi vừa đưa ra quyết định ở tick này
  if (choiceResult) {
    if (choiceResult.actionType === 'GOAL') {
      const xGVal = choiceResult.xG || XG_VALUES.ONE_ON_ONE;
      sim.xG.player = Number((sim.xG.player + xGVal).toFixed(2));
      if (sim.isPlayerHome) {
        sim.xG.homeTeam = Number((sim.xG.homeTeam + xGVal).toFixed(2));
        sim.homeScore += 1;
      } else {
        sim.xG.awayTeam = Number((sim.xG.awayTeam + xGVal).toFixed(2));
        sim.awayScore += 1;
      }
      sim.playerStats.goals += 1;
      sim.playerStats.shots += 1;
      sim.playerStats.onTarget += 1;
      sim.liveRating = applyLiveRatingDelta(sim.liveRating, RATING_DELTAS.GOAL);

      const isBlowout = Math.abs(sim.homeScore - sim.awayScore) >= 4;
      const scorerName = `${player.name} (BẠN) ⭐`;
      const clubName = sim.playerTeamName;
      const assistName = getRandomAiTeammateName(sim.playerTeamName);

      const commentaryText = getRandomGoalCommentary({
        ...context,
        scorerName,
        clubName,
        assistName,
        playerName: scorerName,
        teamName: clubName,
        isBlowout,
        isClutch: minute >= 90
      });
      tickEvent = {
        min: minute,
        icon: '⚽',
        type: 'GOAL',
        text: commentaryText,
        scorerName,
        clubName,
        assistName,
        ratingDelta: RATING_DELTAS.GOAL
      };
    } else if (choiceResult.actionType === 'ASSIST') {
      const xGVal = XG_VALUES.CLOSE_TAP_IN;
      if (sim.isPlayerHome) {
        sim.xG.homeTeam = Number((sim.xG.homeTeam + xGVal).toFixed(2));
        sim.homeScore += 1;
      } else {
        sim.xG.awayTeam = Number((sim.xG.awayTeam + xGVal).toFixed(2));
        sim.awayScore += 1;
      }
      sim.playerStats.assists += 1;
      sim.playerStats.bigChancesCreated += 1;
      sim.playerStats.passesCompleted += 1;
      sim.liveRating = applyLiveRatingDelta(sim.liveRating, RATING_DELTAS.ASSIST);

      const teammateScorer = getRandomAiTeammateName(sim.playerTeamName);
      const assistText = getRandomAssistCommentary({
        ...context,
        playerName: `${player.name} (BẠN) ⭐`,
        scorerName: teammateScorer,
        clubName: sim.playerTeamName,
        teamName: sim.playerTeamName
      });
      tickEvent = {
        min: minute,
        icon: '🎯',
        type: 'ASSIST',
        text: assistText,
        scorerName: teammateScorer,
        assistName: `${player.name} (BẠN) ⭐`,
        clubName: sim.playerTeamName,
        ratingDelta: RATING_DELTAS.ASSIST
      };
    } else if (choiceResult.actionType === 'TACKLE') {
      sim.playerStats.tackles += 1;
      sim.liveRating = applyLiveRatingDelta(sim.liveRating, RATING_DELTAS.TACKLE_SUCCESS);
      tickEvent = {
        min: minute,
        icon: '🛡️',
        type: 'TACKLE',
        text: `Pha xoạc bóng quyết đoán và chuẩn xác đến từng milimet của ${player.name} chặn đứng cơ hội đối mặt của đối phương!`,
        ratingDelta: RATING_DELTAS.TACKLE_SUCCESS
      };
    } else if (choiceResult.actionType === 'SAVE') {
      if (isGoalkeeper) {
        sim.playerStats.saves = (sim.playerStats.saves || 0) + 1;
        sim.liveRating = applyLiveRatingDelta(sim.liveRating, +0.6);
        const saveMsg = choiceResult.successText 
          ? choiceResult.successText.replace(/^Phút \d+':?\s*/i, '')
          : `Phản xạ thần sầu! ${player.name} (BẠN) ⭐ bay người hết cỡ cản phá cú dứt điểm hiểm hóc, cứu thua trông thấy!`;
        tickEvent = {
          min: minute,
          icon: '🧤',
          type: 'SAVE',
          text: saveMsg,
          ratingDelta: +0.6
        };
      } else {
        // Cầu thủ không phải thủ môn (Tiền đạo ST/CF/LW/RW, Tiền vệ, Hậu vệ):
        // Đây là tình huống sút phạt/dứt điểm của người chơi bị thủ môn đối phương cản phá!
        sim.playerStats.shots = (sim.playerStats.shots || 0) + 1;
        sim.playerStats.onTarget = (sim.playerStats.onTarget || 0) + 1;
        sim.liveRating = applyLiveRatingDelta(sim.liveRating, -0.1);
        const oppGk = getAiGoalkeeperName(sim.opponentName);
        tickEvent = {
          min: minute,
          icon: '🧤',
          type: 'SHOT_SAVED',
          text: `CÚ ĐÁ BỊ CẢN PHÁ! Cú dứt điểm hiểm hóc của ${player.name} (BẠN) không thắng được phản xạ bay người xuất thần của ${oppGk}!`,
          ratingDelta: -0.1
        };
      }
    } else if (choiceResult.actionType === 'MISS') {
      const xGVal = choiceResult.xG || XG_VALUES.ONE_ON_ONE;
      sim.xG.player = Number((sim.xG.player + xGVal).toFixed(2));
      if (sim.isPlayerHome) {
        sim.xG.homeTeam = Number((sim.xG.homeTeam + xGVal).toFixed(2));
      } else {
        sim.xG.awayTeam = Number((sim.xG.awayTeam + xGVal).toFixed(2));
      }
      sim.playerStats.shots += 1;
      tickEvent = {
        min: minute,
        icon: '❌',
        type: 'MISS',
        text: generateCommentary('MISSED_CHANCE', context),
        ratingDelta: 0
      };
    } else if (choiceResult.actionType === 'PASS_FAIL') {
      sim.playerStats.passesFailed += 1;
      sim.liveRating = applyLiveRatingDelta(sim.liveRating, RATING_DELTAS.PASS_FAIL);
      tickEvent = {
        min: minute,
        icon: '⚠️',
        type: 'PASS_FAIL',
        text: `Đường chuyền non lực của ${player.name} bị đối phương bắt bài cắt bóng phản công nguy hiểm!`,
        ratingDelta: RATING_DELTAS.PASS_FAIL
      };
    } else if (choiceResult.actionType === 'OPP_GOAL') {
      const oppXG = 0.50;
      if (sim.isPlayerHome) {
        sim.xG.awayTeam = Number((sim.xG.awayTeam + oppXG).toFixed(2));
        sim.awayScore += 1;
      } else {
        sim.xG.homeTeam = Number((sim.xG.homeTeam + oppXG).toFixed(2));
        sim.homeScore += 1;
      }
      sim.liveRating = applyLiveRatingDelta(sim.liveRating, -0.4);
      const oppScorer = getRandomAiOpponentName(sim.opponentName);
      const isBlowout = Math.abs(sim.homeScore - sim.awayScore) >= 4;
      const oppGoalMsg = isBlowout
        ? `⚽ ⚽ MÀN HỦY DIỆT! ${oppScorer} (${sim.opponentName}) dứt điểm tung lưới đào sâu cách biệt trước sự bất lực của hàng thủ!`
        : `⚽ ⚽ BÀN THUA! ${oppScorer} (${sim.opponentName}) tung cú dứt điểm hiểm hóc làm rung mành lưới!`;
      tickEvent = {
        min: minute,
        icon: '⚠️',
        type: 'OPP_GOAL',
        text: oppGoalMsg,
        scorerName: oppScorer,
        clubName: sim.opponentName,
        ratingDelta: -0.4
      };
    }

    if (choiceResult.cardRisk && Math.random() < choiceResult.cardRisk && sim.playerStats.yellowCards === 0) {
      sim.playerStats.yellowCards = 1;
      sim.liveRating = applyLiveRatingDelta(sim.liveRating, RATING_DELTAS.YELLOW_CARD);
      if (tickEvent) {
        tickEvent.text += ` (🟨 ${player.name} phải nhận thẻ vàng cảnh cáo!)`;
      }
    }
    if (choiceResult.ratingBonus && tickEvent) {
      sim.liveRating = applyLiveRatingDelta(sim.liveRating, choiceResult.ratingBonus);
    }
    if (choiceResult.fameBonus && typeof player.fame === 'number') {
      player.fame = Math.max(0, (player.fame || 0) + choiceResult.fameBonus);
    }
    if (choiceResult.successText && tickEvent && (choiceResult.actionType === 'TACKLE' || (choiceResult.actionType === 'SAVE' && isGoalkeeper))) {
      tickEvent.text = choiceResult.successText.replace(/^Phút \d+':?\s*/i, '');
    }
  } else {
    // 3. Xử lý trạng thái Dự Bị (BENCH) & Xoay Tua (ROTATION)
    if (sim.isPlayerOnBench) {
      if (minute < 60 && sim.currentTickIndex < Math.floor(sim.totalTicks * 0.7)) {
        // Cầu thủ ngồi dự bị trong 60 phút đầu
        const oppGoalChance = sim.currentZone === 'DEFENSIVE_THIRD' ? 0.25 : 0.08;
        if (Math.random() < oppGoalChance) {
          if (sim.isPlayerHome) sim.awayScore += 1; else sim.homeScore += 1;
          const oppScorer = getRandomAiOpponentName(sim.opponentName);
          const isBlowout = Math.abs(sim.homeScore - sim.awayScore) >= 4;
          const benchOppText = isBlowout
            ? `⚽ ⚽ CƠN LỐC TẤN CÔNG! ${oppScorer} (${sim.opponentName}) ghi bàn nâng cách biệt lên 4 bàn trong khi bạn vẫn đang ngồi ngoài đường biên!`
            : `⚽ ⚽ BÀN THUA! ${oppScorer} (${sim.opponentName}) chớp thời cơ dứt điểm mở tỷ số! Bạn đang sốt ruột khởi động ngoài đường biên.`;
          tickEvent = {
            min: minute, icon: '⚽', type: 'GOAL',
            text: benchOppText,
            scorerName: oppScorer,
            clubName: sim.opponentName,
            ratingDelta: 0
          };
        } else if (Math.random() < 0.18) {
          if (sim.isPlayerHome) sim.homeScore += 1; else sim.awayScore += 1;
          const teammateScorer = getRandomAiTeammateName(sim.playerTeamName);
          const isBlowout = Math.abs(sim.homeScore - sim.awayScore) >= 4;
          const benchTeamText = isBlowout
            ? `⚽ ⚽ MÀN HỦY DIỆT! ${teammateScorer} (${sim.playerTeamName}) lập công tạo ra cách biệt 4 bàn áp đảo hoàn toàn!`
            : `⚽ ⚽ BÀN THẮNG! ${teammateScorer} (${sim.playerTeamName}) tung cú dứt điểm hiểm hóc làm rung mành lưới đối phương!`;
          tickEvent = {
            min: minute, icon: '⚽', type: 'GOAL',
            text: benchTeamText,
            scorerName: teammateScorer,
            clubName: sim.playerTeamName,
            ratingDelta: 0
          };
        } else {
          tickEvent = {
            min: minute, icon: '🪑', type: 'BENCH',
            text: `[Băng Ghế Dự Bị] Bạn đang chăm chú quan sát thế trận và chờ đợi cơ hội.`,
            ratingDelta: 0
          };
        }
      } else {
        // Phút 60+: HLV tung vào sân
        sim.isPlayerOnBench = false;
        tickEvent = {
          min: minute, icon: '🔁', type: 'SUB_IN',
          text: `THAY NGƯỜI CHIẾN THUẬT! HLV tung ${player.name} vào sân! Cơ hội khẳng định bản lĩnh!`,
          ratingDelta: 0
        };
      }
    } else if (sim.isPlayerSubbedOff) {
      // Cầu thủ đã bị thay ra nghỉ
      isDecisionMoment = false;
    } else if (sim.squadRole === 'ROTATION' && minute >= 75 && sim.inMatchStamina < 35 && !sim.isPlayerSubbedOff) {
      sim.isPlayerSubbedOff = true;
      tickEvent = {
        min: minute, icon: '🔁', type: 'SUB_OUT',
        text: `Thể lực suy giảm (<35%), HLV rút ${player.name} ra nghỉ giữ sức!`,
        ratingDelta: 0
      };
    } else {
      // Cầu thủ đang thi đấu trên sân: Xử lý Decision Moments theo targetMoments
      const ticksRemaining = sim.totalTicks - sim.currentTickIndex;
      const momentsDone = sim.decisionMomentsCount || 0;
      const targetMoments = sim.targetMoments || sim.totalEventsCount || 5;
      const mustTrigger = (ticksRemaining <= (targetMoments - momentsDone)) || (momentsDone < targetMoments);

      if (mustTrigger || (sim.currentZone === 'ATTACKING_THIRD' && Math.random() < (isFatigued ? 0.75 : 0.90)) || (sim.currentZone === 'MIDFIELD' && Math.random() < 0.60) || (sim.currentZone === 'DEFENSIVE_THIRD' && (pLine === 'DF' || pLine === 'GK') && Math.random() < 0.80)) {
        isDecisionMoment = true;
        sim.decisionMomentsCount = momentsDone + 1;
        decisionData = createDecisionMoment(player, minute, isFatigued, sim.currentZone);
        sim.pendingDecisionTick = sim.currentTickIndex;
      }
    }

    if (!tickEvent && !isDecisionMoment) {
      // Kiểm tra thẻ phạt / ức chế tâm lý nếu Morale < 50 hoặc đang bị dẫn
      const isTrailing = sim.isPlayerHome ? sim.awayScore > sim.homeScore : sim.homeScore > sim.awayScore;
      if (!sim.isPlayerOnBench && !sim.isPlayerSubbedOff && (player.morale < 50 || isTrailing) && Math.random() < 0.22 && sim.playerStats.yellowCards === 0) {
        sim.playerStats.yellowCards = 1;
        sim.liveRating = applyLiveRatingDelta(sim.liveRating, RATING_DELTAS.YELLOW_CARD);
        tickEvent = {
          min: minute,
          icon: '🟨',
          type: 'CARD',
          text: generateCommentary('FRUSTRATION_AND_CARDS', context),
          ratingDelta: RATING_DELTAS.YELLOW_CARD
        };
      } else if (isFatigued && Math.random() < 0.35) {
        sim.playerStats.passesFailed += 1;
        sim.liveRating = applyLiveRatingDelta(sim.liveRating, RATING_DELTAS.PASS_FAIL);
        tickEvent = {
          min: minute,
          icon: '💤',
          type: 'FATIGUE',
          text: generateCommentary('FATIGUE_WARNING', context),
          ratingDelta: RATING_DELTAS.PASS_FAIL
        };
      } else {
        const oppGoalChance = sim.currentZone === 'DEFENSIVE_THIRD' ? 0.28 : 0.08;
        const oppAttackRoll = Math.random();
        if (oppAttackRoll < oppGoalChance) {
          const oppXG = 0.45;
          if (sim.isPlayerHome) {
            sim.xG.awayTeam = Number((sim.xG.awayTeam + oppXG).toFixed(2));
            sim.awayScore += 1;
          } else {
            sim.xG.homeTeam = Number((sim.xG.homeTeam + oppXG).toFixed(2));
            sim.homeScore += 1;
          }
          const oppScorer = getRandomAiOpponentName(sim.opponentName);
          const isBlowout = Math.abs(sim.homeScore - sim.awayScore) >= 4;
          const oppText = isBlowout
            ? `⚽ ⚽ MÀN HỦY DIỆT! ${oppScorer} (${sim.opponentName}) tiếp tục dứt điểm tung lưới trước sức ép dồn dập của đối phương!`
            : `⚽ ⚽ BÀN THẮNG! ${oppScorer} (${sim.opponentName}) tung cú dứt điểm hiểm hóc làm rung mành lưới!`;
          tickEvent = {
            min: minute,
            icon: '⚠️',
            type: 'OPP_GOAL',
            text: oppText,
            scorerName: oppScorer,
            clubName: sim.opponentName,
            ratingDelta: 0
          };
        } else if (sim.currentZone === 'DEFENSIVE_THIRD' && oppAttackRoll < oppGoalChance + 0.22) {
          // Tình huống cứu thua cho đội nhà
          if (isGoalkeeper) {
            sim.playerStats.saves = (sim.playerStats.saves || 0) + 1;
            const saveDelta = +(0.20 + Math.random() * 0.10).toFixed(2);
            sim.liveRating = applyLiveRatingDelta(sim.liveRating, saveDelta);
            tickEvent = {
              min: minute,
              icon: '🧤',
              type: 'SAVE',
              text: `PHẢN XẠ THẦN THÁNH! ${player.name} (BẠN) ⭐ bay người hết cỡ cản phá cú dứt điểm hiểm hóc, cứu thua trông thấy! (+${saveDelta} điểm)`,
              ratingDelta: saveDelta
            };
          } else {
            // Người chơi là Tiền đạo / Tiền vệ / Hậu vệ: Thủ môn đội nhà cứu thua, TUYỆT ĐỐI KHÔNG gán saves cho người chơi
            const homeGk = getHomeGoalkeeperName(sim, player);
            tickEvent = {
              min: minute,
              icon: '🧤',
              type: 'TEAM_SAVE',
              text: `CỨU THUA XUẤT SẮC! ${homeGk} phản xạ xuất thần cản phá cú dứt điểm uy lực của đối phương, giữ sạch mành lưới cho ${sim.playerClubName}!`,
              ratingDelta: 0
            };
          }
        } else {
          let flowRatingDelta = 0;
          let flowIcon = '⚡';
          let flowType = 'FLOW';
          let flowText = '';

          if (!sim.isPlayerOnBench && !sim.isPlayerSubbedOff) {
            const flowRoll = Math.random();
            if (pLine === 'FW') {
              // Tiền đạo (ST, CF, LW, RW): Dứt điểm, Ghi bàn, Kiến tạo, Rê bóng, Chọc khe, Bứt tốc, Bị phạm lỗi, Tranh chấp bóng hoặc Việt vị
              if (flowRoll < 0.20) {
                // Rê bóng / Bứt tốc
                flowRatingDelta = +(0.12 + Math.random() * 0.06).toFixed(2);
                flowIcon = '⚡';
                flowType = 'DRIBBLE';
                flowText = `${player.name} bứt tốc xé gió loại bỏ hậu vệ biên, thực hiện pha rê dắt bóng kỹ thuật đầy tự tin! (+${flowRatingDelta} điểm)`;
              } else if (flowRoll < 0.40) {
                // Chọc khe / Phối hợp ban bật
                sim.playerStats.passesCompleted = (sim.playerStats.passesCompleted || 0) + 1;
                flowRatingDelta = +(0.10 + Math.random() * 0.06).toFixed(2);
                flowIcon = '👟';
                flowType = 'PASS';
                flowText = `${player.name} di chuyển khôn ngoan, tung đường chọc khe sắc lẹm mở toang hướng tấn công sáng sủa! (+${flowRatingDelta} điểm)`;
              } else if (flowRoll < 0.60) {
                // Tranh chấp bóng / Tì đè
                flowRatingDelta = +(0.10 + Math.random() * 0.05).toFixed(2);
                flowIcon = '💪';
                flowType = 'DUEL';
                flowText = `${player.name} cài người dũng mãnh, tì đè trung vệ đối phương đoạt bóng hai mở ra thời cơ! (+${flowRatingDelta} điểm)`;
              } else if (flowRoll < 0.78) {
                // Dứt điểm suýt thành bàn / Bị phạm lỗi
                const subRoll = Math.random();
                if (subRoll < 0.5) {
                  sim.playerStats.shots = (sim.playerStats.shots || 0) + 1;
                  flowRatingDelta = +(0.08 + Math.random() * 0.06).toFixed(2);
                  flowIcon = '🎯';
                  flowType = 'SHOT';
                  flowText = `${player.name} xoay người dứt điểm nhanh như chớp trong vòng cấm, bóng liếm mép cột dọc trong gang tấc! (+${flowRatingDelta} điểm)`;
                } else {
                  flowRatingDelta = +(0.10 + Math.random() * 0.05).toFixed(2);
                  flowIcon = '⚠️';
                  flowType = 'FOUL_DRAWN';
                  flowText = `${player.name} bị hậu vệ đối phương kéo người phạm lỗi chiến thuật ngay trước vòng cấm địa! (+${flowRatingDelta} điểm)`;
                }
              } else if (flowRoll < 0.88) {
                // Việt vị nhẹ
                flowRatingDelta = -0.05;
                flowIcon = '🚩';
                flowType = 'OFFSIDE';
                flowText = `Tiếc nuối! ${player.name} bứt tốc đón đường chuyền vượt tuyến nhưng trọng tài biên đã căng cờ báo việt vị trong gang tấc.`;
              } else {
                flowText = generateCommentary(sim.currentZone === 'DEFENSIVE_THIRD' ? 'DEFENSIVE_THIRD' : (sim.currentZone === 'ATTACKING_THIRD' ? 'ATTACKING_THIRD' : 'MIDFIELD_BATTLE'), context);
              }
            } else if (pLine === 'DF' || pLine === 'MF') {
              if (flowRoll < 0.50) {
                sim.playerStats.passesCompleted = (sim.playerStats.passesCompleted || 0) + 1;
                flowRatingDelta = +(0.10 + Math.random() * 0.06).toFixed(2);
                flowIcon = '👟';
                flowText = `${player.name} di chuyển khôn ngoan, ban bật nhịp nhàng mở ra hướng tấn công sáng sủa! (+${flowRatingDelta} điểm)`;
              } else if (flowRoll < 0.80) {
                sim.playerStats.tacklesSuccessful = (sim.playerStats.tacklesSuccessful || 0) + 1;
                flowRatingDelta = +(0.12 + Math.random() * 0.08).toFixed(2);
                flowIcon = '🛡️';
                flowText = `${player.name} áp sát quyết liệt, cắt đường chuyền và đánh chặn thành công! (+${flowRatingDelta} điểm)`;
              } else {
                flowText = generateCommentary(sim.currentZone === 'DEFENSIVE_THIRD' ? 'DEFENSIVE_THIRD' : (sim.currentZone === 'ATTACKING_THIRD' ? 'ATTACKING_THIRD' : 'MIDFIELD_BATTLE'), context);
              }
            } else {
              // Thủ môn (GK)
              if (flowRoll < 0.50) {
                flowRatingDelta = +(0.10 + Math.random() * 0.05).toFixed(2);
                flowIcon = '🧤';
                flowText = `${player.name} ra vào hợp lý, ôm gọn bóng bổng hóa giải pha treo bóng bổng của đối phương! (+${flowRatingDelta} điểm)`;
              } else {
                flowText = generateCommentary(sim.currentZone === 'DEFENSIVE_THIRD' ? 'DEFENSIVE_THIRD' : 'MIDFIELD_BATTLE', context);
              }
            }

            if (flowRatingDelta !== 0) {
              sim.liveRating = applyLiveRatingDelta(sim.liveRating, flowRatingDelta);
            }
          } else {
            flowText = generateCommentary(sim.currentZone === 'DEFENSIVE_THIRD' ? 'DEFENSIVE_THIRD' : (sim.currentZone === 'ATTACKING_THIRD' ? 'ATTACKING_THIRD' : 'MIDFIELD_BATTLE'), context);
          }

          tickEvent = {
            min: minute,
            icon: flowIcon,
            type: flowType,
            text: flowText,
            ratingDelta: flowRatingDelta
          };
        }
      }
    }
  }

  if (tickEvent) {
    sim.eventsFeed.unshift(tickEvent);
  }

  // Chỉ chuyển sang tick kế tiếp khi tick hiện tại đã hoàn tất (không bị dừng chờ quyết định)
  if (!isDecisionMoment) {
    sim.pendingDecisionTick = null;
    sim.currentTickIndex += 1;
    if (sim.currentTickIndex >= sim.totalTicks) {
      sim.isFinished = true;
    }
  }

  return {
    isFinished: sim.isFinished,
    isDecisionMoment,
    decisionData,
    tickEvent,
    sim
  };
}
