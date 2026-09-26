/* =========================================================================
   UI DASHBOARD — DASHBOARD & TOP PROFILE SYNCHRONIZATION
   Extracted from ui.js
   ========================================================================= */
import { POSITION_CONFIG, ALL_CLUBS, YOUTH_LEAGUE_CLUBS, UEFA_YOUTH_LEAGUE_CLUBS } from './data.js';
import { 
  calculateTransfermarktValue, calculateNetWorth, clampStats, getPlayerActiveClub
} from './engine.js';
import { ensurePlayerStats, getFameTier } from './playerEngine.js';
import { formatCurrency, formatMoney, formatSalary, getEuroBadgeText } from './uiCore.js';
import { renderActiveBuffsBar, renderRivalWidget, renderTrophyShowcase, renderFcsUltimateCard, renderPlayerTraits, renderDetailedSubStats } from './uiPlayer.js';
import { renderLiveIndividualTracker, renderSignatureTraits } from './uiStats.js';
import { renderRecordsTab } from './uiRecords.js';
import { renderCompetitionTierWidget } from './uiCompetition.js';
import { renderCareerChronicleTab } from './uiCareer.js';
import { renderMediaFeedTab } from './uiMediaFeed.js';
import { renderMatchdayHub } from './uiMatchday.js';
/* =========================================================================
   3. DASHBOARD & TOP PROFILE SYNCHRONIZATION
   ========================================================================= */
export function updateUI(player) {
  const dispName = document.getElementById('dispName');
  if (dispName) dispName.innerText = `${player.name} ${player.nationality.flag}`;

  const dispAge = document.getElementById('dispAge');
  if (dispAge) dispAge.innerText = player.age;
  const playerAgeEl = document.getElementById('playerAge');
  if (playerAgeEl) playerAgeEl.innerText = `${player.age} Tuổi`;

  const dispPos = document.getElementById('dispPos');
  if (dispPos) dispPos.innerText = player.position;

  const posConf = POSITION_CONFIG[player.position];
  const playerAvatar = document.getElementById('playerAvatar');
  if (playerAvatar) playerAvatar.innerText = posConf.icon;

  const dispClubName = document.getElementById('dispClubName');
  const dispClubIcon = document.getElementById('dispClubIcon');
  const dispLeagueName = document.getElementById('dispLeagueName');

  if (player.isAcademyStage) {
    if (dispClubName) dispClubName.innerText = player.academy.name;
    if (dispClubIcon) dispClubIcon.innerText = player.academy.icon;
    if (dispLeagueName) dispLeagueName.innerText = `🌱 Lò Đào Tạo Trẻ (${player.academy.country})`;
  } else {
    if (dispClubName) dispClubName.innerText = player.currentClub.name;
    if (dispClubIcon) dispClubIcon.innerText = player.currentClub.icon;
    if (dispLeagueName) dispLeagueName.innerText = `${player.currentClub.league.flag} ${player.currentClub.league.name}`;
  }
  
  const euroBadge = document.getElementById('dispEuropeStatus');
  if (euroBadge) {
    if (player.isAcademyStage) {
      euroBadge.innerText = "🌱 Cúp Trẻ & Đào Tạo";
      euroBadge.style.color = "var(--accent-green)";
      euroBadge.style.borderColor = "rgba(16, 185, 129, 0.4)";
      euroBadge.style.background = "rgba(16, 185, 129, 0.15)";
    } else {
      euroBadge.innerText = getEuroBadgeText(player.currentEuroStatus, player.currentClub.league.id);
      if (player.currentEuroStatus === "C1") {
        euroBadge.style.color = "var(--accent-gold)";
        euroBadge.style.borderColor = "rgba(245, 158, 11, 0.4)";
        euroBadge.style.background = "rgba(245, 158, 11, 0.15)";
      } else if (player.currentEuroStatus === "C2") {
        euroBadge.style.color = "var(--accent-purple)";
        euroBadge.style.borderColor = "rgba(168, 85, 247, 0.4)";
        euroBadge.style.background = "rgba(168, 85, 247, 0.15)";
      } else {
        euroBadge.style.color = "var(--text-muted)";
        euroBadge.style.borderColor = "var(--border-color)";
        euroBadge.style.background = "var(--bg-dark)";
      }
    }
  }

  const dispSalary = document.getElementById('dispSalary');
  if (dispSalary) dispSalary.innerText = formatSalary(player.salary);
  const dispMoney = document.getElementById('dispMoney');
  if (dispMoney) dispMoney.innerText = formatMoney(player.money);
  
  calculateTransfermarktValue(player);
  const mktEl = document.getElementById('dispMarketValue');
  if (mktEl) mktEl.innerText = formatCurrency(player.marketValue, "€");

  const nwDisp = document.getElementById('dispNetWorthLive');
  if (nwDisp) nwDisp.innerText = formatMoney(calculateNetWorth(player));

  const matchesEl = document.getElementById('dispClubMatches');
  if (matchesEl) matchesEl.innerText = player.totalCareerMatches;

  const dispStat1Label = document.getElementById('dispStat1Label');
  const dispStat1Val = document.getElementById('dispStat1Val');
  const dispStat2Label = document.getElementById('dispStat2Label');
  const dispStat2Val = document.getElementById('dispStat2Val');

  if (player.position === 'GK') {
    if (dispStat1Label) dispStat1Label.innerText = "Trận Sạch Lưới";
    if (dispStat1Val) dispStat1Val.innerText = player.totalCareerCleanSheets;
    if (dispStat2Label) dispStat2Label.innerText = "Số Pha Cứu Thua";
    if (dispStat2Val) dispStat2Val.innerText = player.totalCareerSaves;
  } else if (player.position === 'DF') {
    if (dispStat1Label) dispStat1Label.innerText = "Tắc Bóng & Cắt Bóng";
    if (dispStat1Val) dispStat1Val.innerText = player.totalCareerTackles;
    if (dispStat2Label) dispStat2Label.innerText = "Trận Sạch Lưới";
    if (dispStat2Val) dispStat2Val.innerText = player.totalCareerCleanSheets;
  } else if (player.position === 'MF') {
    if (dispStat1Label) dispStat1Label.innerText = "Bàn Thắng";
    if (dispStat1Val) dispStat1Val.innerText = player.totalCareerGoals;
    if (dispStat2Label) dispStat2Label.innerText = "Kiến Tạo / Chuyền";
    if (dispStat2Val) dispStat2Val.innerText = player.totalCareerAssists;
  } else {
    // FW
    if (dispStat1Label) dispStat1Label.innerText = "Bàn Thắng";
    if (dispStat1Val) dispStat1Val.innerText = player.totalCareerGoals;
    if (dispStat2Label) dispStat2Label.innerText = "Kiến Tạo";
    if (dispStat2Val) dispStat2Val.innerText = player.totalCareerAssists;
  }

  const dispTrophies = document.getElementById('dispTrophies');
  if (dispTrophies) dispTrophies.innerText = `${player.trophiesTotal} 🏆`;

  // \u2500\u2500\u2500 INJURY BADGE UPDATE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const injuryBadge = document.getElementById('injuryStatusBadge');
  const injuryText  = document.getElementById('injuryStatusText');
  const rehabBtn    = document.getElementById('btnActionRehab');
  const trainBtn    = document.getElementById('btnActionTrain');
  if (player.injury && player.injury.isInjured && player.injury.phasesRemaining > 0) {
    const sevEmoji = { LIGHT: '🟡', MEDIUM: '🟠', CRITICAL: '🔴' };
    if (injuryBadge) {
      injuryBadge.style.display = 'block';
    }
    if (injuryText) {
      injuryText.innerText = `${sevEmoji[player.injury.severity] || '🔴'} Chấn Thương: ${player.injury.name} | Còn ${player.injury.phasesRemaining} chặng phục hồi`;
    }
    if (rehabBtn) rehabBtn.style.display = '';
    if (trainBtn) trainBtn.style.opacity = '0.45';
  } else {
    if (injuryBadge) injuryBadge.style.display = 'none';
    if (rehabBtn) rehabBtn.style.display = 'none';
    if (trainBtn) trainBtn.style.opacity = '1';
  }

  // \u2500\u2500\u2500 TACTIC PILL ACTIVE STATE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  document.querySelectorAll('.tactic-pill').forEach(btn => {
    const isActive = btn.dataset.tactic === (player.tactic || 'BALANCED');
    btn.classList.toggle('active', isActive);
    btn.style.opacity = isActive ? '1' : '0.65';
    btn.style.fontWeight = isActive ? '800' : '600';
    btn.style.boxShadow = isActive ? '0 0 10px rgba(59, 130, 246, 0.3)' : 'none';
  });

  const currentPrep = player.preMatchPrep || 'NONE';
  document.querySelectorAll('.btn-prep').forEach(btn => {
    const pType = btn.dataset.prep || (
      btn.id === 'btnPrepRest' ? 'REST' :
      btn.id === 'btnPrepVideo' ? 'VIDEO_ANALYSIS' :
      btn.id === 'btnPrepTrain' ? 'LIGHT_TRAIN' :
      btn.id === 'btnPrepIntense' ? 'INTENSE_DRILL' : ''
    );
    btn.classList.toggle('active-prep', pType === currentPrep && currentPrep !== 'NONE');
  });

  // Đặc quyền duy trì Morale từ các gói dịch vụ thuê
  if (Array.isArray(player.subscriptions)) {
    if (player.subscriptions.includes('sub_nutrition_plan')) {
      player.morale = Math.max(75, player.morale || 75);
    } else if (player.subscriptions.includes('sub_mini_apt')) {
      player.morale = Math.max(65, player.morale || 65);
    }
  }

  clampStats(player);
  ensurePlayerStats(player);

  const statsRenderList = [
    { key: 'pac', lbl: '⚡ Tốc Độ (PAC)', valId: 'valStatPac', barId: 'barStatPac', lblId: 'lblStatPac', legacyValId: 'valAttr2', legacyBarId: 'barAttr2', legacyLblId: 'lblAttr2' },
    { key: 'sho', lbl: '🎯 Dứt Điểm / Sút (SHO)', valId: 'valStatSho', barId: 'barStatSho', lblId: 'lblStatSho', legacyValId: 'valAttr1', legacyBarId: 'barAttr1', legacyLblId: 'lblAttr1' },
    { key: 'pas', lbl: '👟 Chuyền Bóng (PAS)', valId: 'valStatPas', barId: 'barStatPas', lblId: 'lblStatPas', legacyValId: 'valAttr3', legacyBarId: 'barAttr3', legacyLblId: 'lblAttr3' },
    { key: 'dri', lbl: '🪄 Rê Bóng / Xử Lý (DRI)', valId: 'valStatDri', barId: 'barStatDri', lblId: 'lblStatDri', legacyValId: 'valAttr4', legacyBarId: 'barAttr4', legacyLblId: 'lblAttr4' },
    { key: 'def', lbl: '🛡️ Phòng Ngự (DEF)', valId: 'valStatDef', barId: 'barStatDef', lblId: 'lblStatDef' },
    { key: 'phy', lbl: '💪 Thể Chất / Tì Đè (PHY)', valId: 'valStatPhy', barId: 'barStatPhy', lblId: 'lblStatPhy' }
  ];

  statsRenderList.forEach(item => {
    const val = Math.floor(player.stats[item.key] !== undefined ? player.stats[item.key] : 50);
    const valEl = document.getElementById(item.valId) || (item.legacyValId ? document.getElementById(item.legacyValId) : null);
    const barEl = document.getElementById(item.barId) || (item.legacyBarId ? document.getElementById(item.legacyBarId) : null);
    const lblEl = document.getElementById(item.lblId) || (item.legacyLblId ? document.getElementById(item.legacyLblId) : null);
    if (valEl) valEl.innerText = val;
    if (barEl) barEl.style.width = `${Math.min(100, Math.max(5, val))}%`;
    if (lblEl) lblEl.innerText = item.lbl;
  });

  // Render danh sách 29 chỉ số con chuyên sâu theo chuẩn EA FC
  renderDetailedSubStats(player);

  const stamVal = Math.max(5, Math.min(100, Math.round(player.stam !== undefined ? player.stam : (player.stamina !== undefined ? player.stamina : 80))));
  const valStam = document.getElementById('valStam');
  const barStam = document.getElementById('barStam');
  if (valStam) {
    valStam.innerText = `${stamVal}%`;
    valStam.style.color = stamVal < 40 ? '#ef4444' : (stamVal < 65 ? '#f59e0b' : '#34d399');
  }
  if (barStam) {
    barStam.style.width = `${stamVal}%`;
    if (stamVal < 40) {
      barStam.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
    } else if (stamVal < 65) {
      barStam.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    } else {
      barStam.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
    }
  }

  const valForm = document.getElementById('valForm');
  const barForm = document.getElementById('barForm');
  if (valForm) valForm.innerText = player.form;
  if (barForm) barForm.style.width = `${player.form}%`;

  const valFame = document.getElementById('valFame');
  const barFame = document.getElementById('barFame');
  const lblFameTitle = document.getElementById('lblFameTitle');
  const fameInfo = getFameTier(player.fame || 0);

  if (lblFameTitle) {
    lblFameTitle.innerText = `🌟 Danh Tiếng: ${fameInfo.badge} ${fameInfo.title}`;
  }
  if (valFame) {
    if (fameInfo.tierIndex === 9) {
      valFame.innerText = `${(player.fame || 0).toLocaleString()} pts (GOAT)`;
    } else {
      valFame.innerText = `${(player.fame || 0).toLocaleString()} / ${fameInfo.nextTierPoints.toLocaleString()} pts`;
    }
  }
  if (barFame) {
    barFame.style.width = `${fameInfo.progressPercent}%`;
    if (fameInfo.tierIndex >= 7) {
      barFame.classList.add('fame-bar-shimmer');
    } else {
      barFame.classList.remove('fame-bar-shimmer');
    }
  }

  const valMorale = document.getElementById('valMorale');
  const barMorale = document.getElementById('barMorale');
  if (valMorale) valMorale.innerText = player.morale;
  if (barMorale) barMorale.style.width = `${player.morale}%`;

  // \u2500\u2500\u2500 MANAGER TRUST & SQUAD ROLE \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
  const valManagerTrust = document.getElementById('valManagerTrust');
  const barManagerTrust = document.getElementById('barManagerTrust');
  const dispSquadRoleBadge = document.getElementById('dispSquadRoleBadge');
  const trustVal = player.managerTrust !== undefined ? player.managerTrust : 70;
  if (valManagerTrust) valManagerTrust.innerText = trustVal;
  if (barManagerTrust) {
    barManagerTrust.style.width = `${trustVal}%`;
    if (trustVal >= 75) {
      barManagerTrust.style.background = 'linear-gradient(90deg, #3b82f6, #60a5fa)';
    } else if (trustVal >= 40) {
      barManagerTrust.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
    } else if (trustVal >= 20) {
      barManagerTrust.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
    } else {
      barManagerTrust.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
    }
  }

  if (dispSquadRoleBadge) {
    const role = player.squadRole || 'KEY_PLAYER';
    if (role === 'KEY_PLAYER') {
      dispSquadRoleBadge.innerText = '👑 Trụ Cột (Key Player)';
      dispSquadRoleBadge.style.background = 'rgba(59, 130, 246, 0.2)';
      dispSquadRoleBadge.style.color = '#60a5fa';
      dispSquadRoleBadge.style.borderColor = 'rgba(59, 130, 246, 0.4)';
    } else if (role === 'ROTATION') {
      dispSquadRoleBadge.innerText = '🔄 Xoay Tua (Rotation)';
      dispSquadRoleBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      dispSquadRoleBadge.style.color = '#34d399';
      dispSquadRoleBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
    } else if (role === 'BENCH') {
      dispSquadRoleBadge.innerText = '🪑 Ghế Dự Bị (Sub/Bench)';
      dispSquadRoleBadge.style.background = 'rgba(245, 158, 11, 0.2)';
      dispSquadRoleBadge.style.color = '#fbbf24';
      dispSquadRoleBadge.style.borderColor = 'rgba(245, 158, 11, 0.4)';
    } else {
      dispSquadRoleBadge.innerText = '⚠️ Danh Sách Thanh Lý (Listed)';
      dispSquadRoleBadge.style.background = 'rgba(239, 68, 68, 0.2)';
      dispSquadRoleBadge.style.color = '#f87171';
      dispSquadRoleBadge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
    }
  }

  const curYear = player.year || (2026 + (player.seasonsPlayed || 0));
  const curSeason = player.seasonCount || ((player.seasonsPlayed || 0) + 1);

  const dispYearEl = document.getElementById('dispCurrentYear');
  if (dispYearEl) dispYearEl.innerText = curYear;
  const currentYearEl = document.getElementById('currentYear');
  if (currentYearEl) currentYearEl.innerText = `Mùa giải ${curYear}`;

  const headerSeasonEl = document.getElementById('headerSeason');
  if (headerSeasonEl) {
    headerSeasonEl.innerHTML = `<span>🗓️</span> Mùa ${curSeason} (${player.age} tuổi - Năm ${curYear})`;
  }

  renderActiveBuffsBar(player);
  renderRivalWidget(player);
  renderLiveIndividualTracker(player);
  renderTrophyShowcase(player);
  renderFcsUltimateCard(player);
  renderPlayerTraits(player, updateUI);
  renderRecordsTab(player);
  renderSignatureTraits(player);
  renderCompetitionTierWidget(player);
  renderCareerChronicleTab(player);
  renderMediaFeedTab(player);
  renderMatchdayHub(player);
}

export const renderDashboard = updateUI;
