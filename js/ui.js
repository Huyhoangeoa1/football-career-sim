/* =========================================================================
   FOOTBALL CAREER SIMULATOR — UI BARREL HUB
   =========================================================================
   This file acts as a Façade/Barrel re-exporting ALL UI functions from
   specialized sub-modules. Import from this file to maintain backwards
   compatibility with main.js, engine.js and all test scripts.
   ========================================================================= */

// ── Core Formatters & Animations ─────────────────────────────────────────
export {
  formatCurrency,
  formatMoney,
  formatSalary,
  triggerConfetti,
  showToast,
  getEuroBadgeText
} from './uiCore.js';

// ── Setup Screen Helpers ──────────────────────────────────────────────────
export {
  renderNationalityOptions,
  renderPositionOptions,
  renderAcademyOptions,
  updateRookieCardPreview
} from './uiSetup.js';

// ── Dashboard & Profile Synchronization ──────────────────────────────────
export {
  updateUI,
  renderDashboard
} from './uiDashboard.js';

// ── Matchday Hub (Fixture, League Table, Top Scorers) ─────────────────────
export {
  renderMatchdayHub,
  renderLiveLeagueTable,
  renderTopScorers,
  renderFixturesList,
  switchMatchdaySideTab,
  getOpponentScoutingData
} from './uiMatchday.js';

// ── Player Card, Buffs, Rivalry, Trophy & Card Modals ────────────────────
export {
  renderActiveBuffsBar,
  renderRivalWidget,
  renderTrophyShowcase,
  renderFcsUltimateCard,
  openCardThemeModal,
  openCardAvatarModal,
  exportFcsCardPng,
  copyCareerSummaryText,
  renderDetailedSubStats,
  renderSkillPointsBadge,
  initSubStatsAccordionListeners
} from './uiPlayer.js';

export {
  calculateEarnedSkillPoints,
  allocateSubStatPoint,
  getStatUpgradeCost,
  getSpecialTraitUpgradeCost,
  upgradeSpecialTraitWithSP,
  SPECIAL_TRAIT_UPGRADE_COSTS
} from './playerEngine.js';

// ── Signature Traits, Golden Shoe & Ballon D'Or Trackers ─────────────────
export {
  renderSignatureTraits,
  renderGoldenShoeTracker,
  renderBallonDorTracker,
  renderLiveIndividualTracker
} from './uiStats.js';

// ── Agents & Brand Sponsorships Tab ──────────────────────────────────────
export {
  renderContractsTab
} from './uiContracts.js';

// ── Career Logs & Season Summary Modal ───────────────────────────────────
export {
  addLog,
  addFullSeasonStructuredLog,
  showSeasonSummaryModal,
  renderSeasonEndModal,
  renderSeasonAwardsModal,
  renderTeamOfTheSeasonPitch
} from './uiLogs.js';

// ── Lifestyle Store ───────────────────────────────────────────────────────
export {
  renderLifestyleStore
} from './uiLifestyle.js';

// ── Records Tab, Retirement & Hall of Fame ────────────────────────────────
export {
  renderRecordsTab,
  checkAndAwardRecords,
  renderRetirementScreen,
  renderMilestonesHallOfFame,
  renderGoatComparisonTable,
  renderEndRecordsList,
  selectPostRetirementPath
} from './uiRecords.js';

// ── Interactive Match Center & Tick-based Match Engine ────────────────────
export {
  openMatchCenterModal
} from './uiMatchArena.js';

// ── Career Chronicle (Nhật Ký Sự Nghiệp & Timeline Badges) ───────────────
export {
  filterCareerChronicle,
  renderCareerChronicleTab
} from './uiCareer.js';

// ── Media & Fan Reaction Hub (Truyền Thông & Dư Luận) ────────────────────
export {
  filterMediaFeed,
  renderMediaFeedTab
} from './uiMediaFeed.js';

// ── Multi-Tier Competitions & Club Prestige ───────────────────────────────
export {
  renderCompetitionTierWidget
} from './uiCompetition.js';

// ── Summer Tournament & Overwrite Warning Modals ──────────────────────────
export {
  renderSummerTournamentModal,
  closeSummerTournamentModal,
  showOverwriteWarningModal,
  closeOverwriteWarningModal
} from './uiTournament.js';

// ── Cup Tournament UI (from uiCup.js) ────────────────────────────────────
export {
  isPlayerClubCheck,
  ensureDomesticBracketData,
  ensureContinentalBracketData,
  renderMatchCard,
  renderTournamentBrackets,
  renderCupBracket,
  switchCupViewTab,
  renderYouthLeagueGroupStandings
} from './uiCup.js';

// ── Side Effects: Expose window globals for inline HTML handlers ──────────
import { formatSalary, showToast } from './uiCore.js';
import { filterCareerChronicle } from './uiCareer.js';
import { POSITION_CONFIG } from './data.js';
import { renderNationalityOptions, renderPositionOptions, renderAcademyOptions, updateRookieCardPreview } from './uiSetup.js';
import { renderLiveLeagueTable, renderTopScorers, renderFixturesList, switchMatchdaySideTab } from './uiMatchday.js';

if (typeof window !== 'undefined') {
  window.formatSalary = formatSalary;
  window.showToast = showToast;
  window.filterCareerChronicle = filterCareerChronicle;
  window._POSITION_CONFIG = POSITION_CONFIG;
  window.renderNationalityOptions = renderNationalityOptions;
  window.renderPositionOptions = renderPositionOptions;
  window.renderAcademyOptions = renderAcademyOptions;
  window.updateRookieCardPreview = updateRookieCardPreview;
  window.renderLiveLeagueTable = renderLiveLeagueTable;
  window.renderTopScorers = renderTopScorers;
  window.renderFixturesList = renderFixturesList;
  window.switchMatchdaySideTab = switchMatchdaySideTab;
}

