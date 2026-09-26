/* =========================================================================
   FOOTBALL CAREER SIMULATOR — MAIN CONTROLLER & ENTRY POINT
   ========================================================================= */

import {
  NATIONALITIES_DATA,
  POSITION_CONFIG,
  PHASE_NARRATIVES,
  SPONSORSHIPS_DATA,
  AGENTS_DATA,
  getGoldenShoeRankings,
  YOUTH_ACADEMIES
} from './data.js';
import { gameState, getPlayer, resetPlayerState } from './state.js';
export { getPlayer };
import { renderCareerLogs } from './uiLogs.js';
import {
  simulateSeasonRound,
  simulateAcademyRound,
  getPhase2MatchOpponent,
  rollInjuryChance,
  recordChronicleMilestone,
  updateCompetitionTier,
  initSeasonScheduleAndTable,
  simulateMatchdayRound,
  checkSummerTournamentEligibility,
  initSummerTournament,
  advanceSummerTournamentMatch,
  generateRichMatchNarrative,
  generateMediaInteractionNarrative,
  generateSkillBreakthroughNarrative,
  getRandomAcademyLifeSnippet,
  addCareerLog,
  logCareerEvent,
  recoverStaminaBetweenMatches
} from './engine.js';
import { signSponsorship as engineSignSponsorship } from './playerEngine.js';
import {
  buyEquipment as storeBuyEquip,
  toggleSubscription as storeToggleSub,
  buyAsset as storeBuyAsset
} from './store.js';
import {
  rollRandomEvent,
  rollSuperstarMoment,
  checkAndTriggerKeyMatchMoment,
  openTransferMarketModal as eventsOpenTransferModal,
  closeTransferModal as eventsCloseTransferModal,
  acceptTransferOffer,
  showBallonDorWinnerModal,
  launchInteractiveMatchCenter,
  showInjuryDilemmaModal,
  triggerPostMatchPressConference
} from './events.js';
import {
  updateUI,
  renderLiveLeagueTable,
  renderTopScorers,
  renderFixturesList,
  renderNationalityOptions,
  renderPositionOptions,
  renderAcademyOptions,
  updateRookieCardPreview,
  renderLifestyleStore,
  renderRecordsTab,
  renderSignatureTraits,
  renderContractsTab,
  renderCareerChronicleTab,
  filterCareerChronicle,
  renderMediaFeedTab,
  openMatchCenterModal,
  addLog,
  addFullSeasonStructuredLog,
  showSeasonSummaryModal,
  checkAndAwardRecords,
  renderRetirementScreen,
  selectPostRetirementPath as uiSelectPostRetirementPath,
  triggerConfetti,
  formatMoney,
  formatSalary,
  showToast,
  renderSummerTournamentModal,
  closeSummerTournamentModal,
  showOverwriteWarningModal,
  closeOverwriteWarningModal,
  renderFcsUltimateCard
} from './ui.js';
import {
  saveGame,
  loadGame,
  hasSaveFile,
  hasAnySaveFile,
  deleteSaveFile,
  deleteSaveSlot,
  getSaveSummary,
  getSaveSlotsInfo,
  currentSaveSlot,
  setCurrentSaveSlot,
  getCurrentSaveSlot,
  getLastActiveSlot,
  autoSave,
  initNewSlot,
  loadSlot,
  saveSlot,
  clearCupCache,
  getFirstAvailableSlot
} from './storage.js';
export { getFirstAvailableSlot };

/* =========================================================================
   1. NAVIGATION & SCREEN / TAB CONTROLLERS
   ========================================================================= */
export function switchScreen(screenId) {
  document.querySelectorAll('.view-screen').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });

  // Support alias names (screenSetup / screenCreate / characterCreationScreen, screenDashboard / screenMain / mainDashboard, screenEnd)
  let target = document.getElementById(screenId);
  if (!target) {
    if (screenId === 'screenCreate' || screenId === 'screenSetup' || screenId === 'characterCreationScreen') {
      target = document.getElementById('screenSetup') || document.getElementById('characterCreationScreen') || document.getElementById('screenCreate');
    } else if (screenId === 'screenMain' || screenId === 'screenDashboard' || screenId === 'mainDashboard') {
      target = document.getElementById('screenDashboard') || document.getElementById('mainDashboard') || document.getElementById('screenMain');
    } else if (screenId === 'screenEnd') {
      target = document.getElementById('screenEnd');
    }
  }

  if (target) {
    target.classList.add('active');
    target.style.display = 'flex';

    if (screenId === 'screenDashboard' || screenId === 'screenMain' || screenId === 'mainDashboard') {
      const p = getPlayer();
      if (p) {
        updateUI(p);
        renderFcsUltimateCard(p);
      }
    }
  }
}

/* =========================================================================
   1.1 5-SLOT MULTI-SAVE CONTROLLERS & START SCREEN CONTROLS
   ========================================================================= */

export function renderSaveSlotsSelectorBar() {
  const container = document.getElementById('saveSlotsPillsBar');
  if (!container) return;

  const slots = getSaveSlotsInfo();
  container.innerHTML = slots.map(slot => {
    const isActive = slot.slotId === currentSaveSlot;
    const hasSave = !slot.isEmpty;
    const shortTitle = hasSave ? `Slot ${slot.slotId} - ${slot.name}` : `Slot ${slot.slotId} - Trống`;
    const statusText = hasSave ? `${slot.name} (${slot.club})` : 'Trống (Empty)';
    const statusClass = hasSave ? 'has-save' : '';
    const activeClass = isActive ? 'active' : '';

    return `
      <div class="slot-pill-compact slot-pill ${activeClass} ${statusClass}" onclick="window.selectSaveSlot && selectSaveSlot(${slot.slotId})" title="Slot ${slot.slotId}: ${statusText}">
        <span>${isActive ? '★ ' : ''}${shortTitle}</span>
      </div>
    `;
  }).join('');

  const noteEl = document.getElementById('slotActiveStatusNote');
  if (noteEl) {
    const activeSlotInfo = slots.find(s => s.slotId === currentSaveSlot);
    if (activeSlotInfo && !activeSlotInfo.isEmpty) {
      noteEl.innerHTML = `<span style="color:var(--accent-gold); font-weight:700;">⚠️ Slot ${currentSaveSlot}</span> đang lưu sự nghiệp của <strong style="color:#fff;">${activeSlotInfo.name}</strong> (${activeSlotInfo.club} • ${activeSlotInfo.season} • Lưu lúc ${activeSlotInfo.savedAt}). Bấm ký hợp đồng sẽ ghi đè slot này!`;
    } else {
      noteEl.innerHTML = `<span style="color:var(--accent-green); font-weight:700;">✨ Slot ${currentSaveSlot}</span> đang trống (sẵn sàng khởi tạo sự nghiệp mới an toàn).`;
    }
  }

  // Cập nhật text nút xác nhận tạo cầu thủ
  const btnConfirm = document.getElementById('btnConfirmCreatePlayer');
  if (btnConfirm) {
    btnConfirm.textContent = `✍️ KÝ HỢP ĐỒNG GIA NHẬP ACADEMY & BẮT ĐẦU (SLOT ${currentSaveSlot})`;
  }
}

export function selectSaveSlot(slotId) {
  setCurrentSaveSlot(slotId);
  renderSaveSlotsSelectorBar();
}

export function openSaveSlotsModal() {
  const modal = document.getElementById('modalSaveSlots');
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
    renderSaveSlotsModal();
  }
}

export function closeSaveSlotsModal() {
  const modal = document.getElementById('modalSaveSlots');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

export function renderSaveSlotsModal() {
  const container = document.getElementById('saveSlotsModalList');
  if (!container) return;

  const slots = getSaveSlotsInfo();
  container.innerHTML = slots.map(slot => {
    const isActive = slot.slotId === currentSaveSlot;
    if (!slot.isEmpty) {
      return `
        <div class="save-slot-card ${isActive ? 'active-slot' : ''}">
          <div class="slot-card-left">
            <div class="slot-badge-num">SLOT ${slot.slotId} ${isActive ? '★' : ''}</div>
            <div class="slot-card-info">
              <div class="slot-card-name">
                <span>⚡ ${slot.name}</span>
                <span style="font-size:0.75rem; background:rgba(255,255,255,0.1); padding:2px 6px; border-radius:4px; font-weight:700;">${slot.position}</span>
              </div>
              <div class="slot-card-details">
                <span>🛡️ ${slot.club}</span>
                <span>🗓️ ${slot.season} (${slot.age} tuổi)</span>
                <span class="slot-card-date">🕒 ${slot.savedAt}</span>
              </div>
            </div>
          </div>
          <div class="slot-card-actions">
            <button type="button" class="btn btn-primary btn-sm" onclick="window.loadCareer && loadCareer(${slot.slotId})" title="Tiếp tục chơi với file lưu này">
              ▶ Chơi Tiếp
            </button>
            <button type="button" class="btn btn-secondary btn-sm" onclick="window.deleteSlotWithConfirm && deleteSlotWithConfirm(${slot.slotId})" style="color:var(--accent-red); border-color:rgba(239,68,68,0.4);" title="Xóa file lưu">
              🗑️ Xóa
            </button>
          </div>
        </div>
      `;
    } else {
      return `
        <div class="save-slot-card empty-slot ${isActive ? 'active-slot' : ''}">
          <div class="slot-card-left">
            <div class="slot-badge-num">SLOT ${slot.slotId} ${isActive ? '★' : ''}</div>
            <div class="slot-card-info">
              <div class="slot-card-name" style="color:var(--text-muted);">
                <span>⚪ Trống (Empty Slot)</span>
              </div>
              <div class="slot-card-details">
                <span>Chưa có dữ liệu sự nghiệp</span>
              </div>
            </div>
          </div>
          <div class="slot-card-actions">
            <button type="button" class="btn btn-primary btn-sm" onclick="window.prepareNewCareer && prepareNewCareer(${slot.slotId})">
              ➕ Tạo Mới Tại Slot Này
            </button>
          </div>
        </div>
      `;
    }
  }).join('');
}

export function deleteSlotWithConfirm(slotId) {
  const confirmFn = (typeof window !== 'undefined' && window.confirm) ? window.confirm.bind(window) : () => true;
  const confirmed = confirmFn(`⚠️ Bạn có chắc chắn muốn xóa vĩnh viễn dữ liệu ở Slot ${slotId} không? Thao tác này không thể hoàn tác!`);
  if (!confirmed) return;

  deleteSaveSlot(slotId);
  showToast(`🗑️ Đã xóa dữ liệu ở Slot ${slotId}!`, 'info');
  renderSaveSlotsModal();
  renderSaveSlotsSelectorBar();
  updateStartScreenButtons();
}

export function updateStartScreenButtons() {
  renderSaveSlotsSelectorBar();
  const hasSave = hasAnySaveFile();
  const lastSlot = getLastActiveSlot();
  const lastSlotInfo = getSaveSlotsInfo().find(s => s.slotId === lastSlot && !s.isEmpty);

  const btnLoad = document.getElementById('btnLoadCareer') ||
    document.getElementById('btnContinueCareer') ||
    document.getElementById('btnLoadGame');
  const btnShowSlots = document.getElementById('btnShowSlotsList') ||
    document.getElementById('btnOpenSaveSlotsModal');
  const btnConfirm = document.getElementById('btnConfirmCreatePlayer') ||
    document.getElementById('btnStartCareer');

  if (btnLoad) {
    if (hasSave) {
      btnLoad.style.display = 'flex';
      btnLoad.style.opacity = '1';
      btnLoad.style.pointerEvents = 'auto';
      btnLoad.removeAttribute('disabled');
      if (lastSlotInfo) {
        btnLoad.innerHTML = `💾 Tiếp Tục Sự Nghiệp (Slot ${lastSlot}: ${lastSlotInfo.name})`;
        btnLoad.title = `Slot ${lastSlot}: ${lastSlotInfo.name} | ${lastSlotInfo.club} | ${lastSlotInfo.season} | Lưu: ${lastSlotInfo.savedAt}`;
      } else {
        btnLoad.innerHTML = `💾 Tiếp Tục Sự Nghiệp (Gần Nhất)`;
      }
      btnLoad.onclick = (e) => {
        if (e) e.preventDefault();
        loadCareer(lastSlot);
      };
    } else {
      btnLoad.style.display = 'none';
      btnLoad.style.opacity = '0.5';
      btnLoad.style.pointerEvents = 'none';
      btnLoad.setAttribute('disabled', 'true');
      btnLoad.onclick = (e) => {
        if (e) e.preventDefault();
        return false;
      };
    }
  }

  if (btnShowSlots) {
    btnShowSlots.style.display = 'flex';
    btnShowSlots.onclick = (e) => {
      if (e) e.preventDefault();
      openSaveSlotsModal();
    };
  }

  if (btnConfirm) {
    btnConfirm.textContent = `✍️ KÝ HỢP ĐỒNG GIA NHẬP ACADEMY & BẮT ĐẦU (SLOT ${currentSaveSlot})`;
    btnConfirm.onclick = (e) => {
      if (e) e.preventDefault();
      confirmAndStartCareer();
    };
  }

  renderSaveSlotsSelectorBar();
}

export function loadCareer(targetSlotId) {
  let slotToLoad = (targetSlotId !== undefined && targetSlotId !== null)
    ? Number(targetSlotId)
    : getLastActiveSlot();

  const data = loadGame(slotToLoad);
  if (!data || !data.player) {
    showToast(`Không tìm thấy file lưu ở Slot ${slotToLoad}!`, 'error');
    updateStartScreenButtons();
    return;
  }

  // Restore player into gameState
  resetPlayerState();
  const { player } = gameState;
  Object.assign(player, data.player);

  // === CHỐT BẢO VỆ TRÁNH KẸT VÒNG LẶP KẾT THÚC MÙA ===
  const totalFixtures = player.currentSeasonFixtures ? player.currentSeasonFixtures.length : 0;
  // Nếu là đầu mùa giải mới (chưa đá trận nào) nhưng vòng đấu bị kẹt số cũ hoặc cờ kết thúc còn bật:
  if ((!player.currentSeasonStats || player.currentSeasonStats.matches === 0) && player.currentFixtureIndex > 0) {
    player.currentFixtureIndex = 0;
    player.isSeasonEnded = false;
    player.seasonEnded = false;
  }



  // Guard: ensure new state fields exist (for old saves)
  if (!player.careerStats) player.careerStats = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 };
  if (!player.currentSeasonStats) player.currentSeasonStats = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 };
  if (!player.seasonHistory) player.seasonHistory = [];
  if (!player.seasonLogs) player.seasonLogs = [];
  if (!player.injury) player.injury = { isInjured: false, name: null, severity: 'LIGHT', phasesRemaining: 0, riskOfRecurrence: 0 };
  if (!player.tactic) player.tactic = 'BALANCED';
  if (!player.preMatchPrep) player.preMatchPrep = 'NONE';
  if (!player.cardTheme) player.cardTheme = 'future';
  if (!player.cardAvatar) player.cardAvatar = 'avatar_fade';
  if (player.customAvatarUrl === undefined) player.customAvatarUrl = '';
  if (!player.currentSeasonFixtures || player.currentSeasonFixtures.length === 0) {
    initSeasonScheduleAndTable(player);
  }

  closeSaveSlotsModal();

  // BƯỚC 3: Vào Game & Kích hoạt màn hình chính xác theo ID thực tế
  const creationScreen = document.getElementById('characterCreationScreen') ||
    document.getElementById('screenSetup') ||
    document.getElementById('screenCreate');
  const dashboardScreen = document.getElementById('mainDashboard') ||
    document.getElementById('screenDashboard') ||
    document.getElementById('screenMain');

  if (creationScreen) {
    creationScreen.classList.remove('active');
    creationScreen.style.display = 'none';
  }

  if (dashboardScreen) {
    dashboardScreen.classList.add('active');
    dashboardScreen.style.display = 'flex';
    // Chuyển màn hình an toàn theo đúng ID tìm được
    if (typeof switchScreen === 'function') {
      switchScreen(dashboardScreen.id);
    }
  }

  if (typeof initCareerDashboard === 'function') {
    initCareerDashboard(player);
  }
  if (typeof renderDashboard === 'function') {
    renderDashboard();
  }

  const savedAt = data.savedAt ? new Date(data.savedAt).toLocaleDateString('vi-VN') : '';
  showToast(`💾 Đã tải Slot ${data.slotId || slotToLoad}! Chào mừng trở lại sân cỏ, ${player.name}! (Lưu lúc: ${savedAt})`, 'success');

  // 1. Phục hồi toàn bộ nhật ký cũ của mùa giải này ra màn hình
  if (typeof renderCareerLogs === 'function') {
    renderCareerLogs(player);
  }

  // 2. Thêm dòng thông báo tải game thành công vào tiếp sau
  if (typeof addLog === 'function') {
    addLog(player, "TẢI GAME THÀNH CÔNG", `Bạn tiếp tục hành trình vĩ đại tại CLB - Mùa ${player.season || 1} (${player.age || 16} tuổi) [Slot ${slotToLoad}].`);
  }
}

/* =========================================================================
   1.2 TACTICAL STANCE SELECTOR
   ========================================================================= */
export function setTactic(tacticId) {
  const player = getPlayer();
  if (!player) return;
  const valid = ['ATTACKING', 'GEGENPRESSING', 'BALANCED', 'DEFENSIVE_COUNTER', 'PARK_THE_BUS'];
  if (!valid.includes(tacticId)) return;

  player.tactic = tacticId;

  const labels = {
    ATTACKING: '⚔️ Tấn Công Áp Đặt',
    GEGENPRESSING: '🔥 Gegenpressing',
    BALANCED: '⚖️ Cân Bằng',
    DEFENSIVE_COUNTER: '🛡️ Phản Công Nhanh',
    PARK_THE_BUS: '🚌 Dựng Xe Buýt'
  };
  showToast(`⚔️ Đã đổi chiến thuật: ${labels[tacticId]}`, 'success');
  updateUI(player);
  autoSave(player);

  // Update tactic pill UI
  document.querySelectorAll('.tactic-pill').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tactic === tacticId);
  });
}

export function setPreMatchPrep(prepType) {
  const player = getPlayer();
  if (!player) return;
  const valid = ['REST', 'VIDEO_ANALYSIS', 'LIGHT_TRAIN', 'INTENSE_DRILL'];
  if (!valid.includes(prepType)) return;

  // Toggle nếu bấm lại vào phương án đang chọn
  player.preMatchPrep = (player.preMatchPrep === prepType) ? 'NONE' : prepType;

  const labels = {
    REST: '🛏️ Dưỡng Sức (+28% Thể lực)',
    VIDEO_ANALYSIS: '📹 Soi Băng Hình (+0.3 Match Rating, tăng sắc bén)',
    LIGHT_TRAIN: '🏃 Khởi Động (+10 Phong độ, -8% Thể lực)',
    INTENSE_DRILL: '🎯 Tập Chuyên Sâu (+20 Phong độ, +15 Tinh thần, -18% Thể lực)'
  };

  if (player.preMatchPrep === 'NONE') {
    showToast('⚡ Đã hủy phương án chuẩn bị trước trận', 'info');
  } else {
    showToast(`⚡ Đã chọn: ${labels[prepType]}`, 'success');
  }

  updateUI(player);
  autoSave(player);
}

export function bindTacticButtons() {
  document.querySelectorAll('.tactic-pill').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      setTactic(btn.dataset.tactic);
    });
  });

  // Sync initial active state
  const player = getPlayer();
  if (player) {
    document.querySelectorAll('.tactic-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tactic === (player.tactic || 'BALANCED'));
    });
  }
}

export function switchTab(tabId) {
  gameState.currentActiveTab = tabId;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.tab-content-panel').forEach(panel => panel.classList.remove('active'));

  const activeBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
  const activePanel = document.getElementById(tabId);
  if (activeBtn) activeBtn.classList.add('active');
  if (activePanel) activePanel.classList.add('active');

  const player = getPlayer();
  if (tabId === 'tabLifestyle') {
    renderLifestyleStore(player, buyEquipment, toggleSubscription, buyAsset);
  } else if (tabId === 'tabRecords') {
    renderRecordsTab(player);
  } else if (tabId === 'tabTraits') {
    renderSignatureTraits(player);
  } else if (tabId === 'tabContracts') {
    renderContractsTab(player, signSponsorship, hireAgent);
  } else if (tabId === 'tabChronicle') {
    renderCareerChronicleTab(player);
  } else if (tabId === 'tabMatchday') {
    renderMediaFeedTab(player);
  }
}

export function signSponsorship(sponsorId) {
  const player = getPlayer();
  if (!player) return;

  const result = engineSignSponsorship(player, sponsorId);
  if (!result.success) {
    if (result.reason === "NOT_UNLOCKED") {
      showToast(`🔒 Chưa mở khóa thương hiệu này! Cần đạt ${result.requiredTier || 'mốc danh tiếng'} (${(result.requiredFame || 0).toLocaleString()} pts)!`, "error");
    } else if (result.reason === "ALREADY_SIGNED") {
      showToast("⚠️ Bạn đã ký kết hợp đồng tài trợ này rồi!", "warning");
    } else {
      showToast("❌ Không thể ký hợp đồng tài trợ này!", "error");
    }
    return;
  }

  const bonusText = result.signingBonus > 0 ? ` (+${formatMoney(result.signingBonus)} Lót tay)` : '';
  const replaceMsg = result.replacedDeal ? ` (Thay thế hợp đồng với ${result.replacedDeal.name})` : '';
  showToast(`⭐ Ký hợp đồng thành công với ${result.deal.name}!${bonusText}${replaceMsg}`, "success");

  triggerConfetti();
  updateUI(player);
  renderContractsTab(player, signSponsorship, hireAgent);
  autoSave(player);
}

export function hireAgent(agentId) {
  const player = getPlayer();
  if (!player) return;
  const agent = AGENTS_DATA.find(a => a.id === agentId);
  if (!agent) return;

  if (player.money < agent.fee) {
    showToast("❌ Số dư tiền mặt không đủ để trả phí ký kết đại diện!", "error");
    return;
  }

  player.money -= agent.fee;
  player.activeAgent = agentId;

  showToast(`🤝 Ký kết thành công với ${agent.name}!`, "success");
  addLog(
    player,
    `🤝 [Bổ Nhiệm Người Đại Diện - ${agent.name}]`,
    `Bạn ký hợp đồng với ${agent.name} (Hạng ${agent.tier})! Từ nay mức lương trong các đàm phán hợp đồng được tăng thêm +${Math.round(agent.salaryBoost * 100)}% và tiền thưởng tài trợ tăng thêm +${Math.round(agent.sponsorBoost * 100)}%!`,
    "reward"
  );
  triggerConfetti();
  updateUI(player);
  renderContractsTab(player, signSponsorship, hireAgent);
}

export function selectPosition(pos, element) {
  gameState.selectedPos = pos || "ST";
  window.selectedPosition = gameState.selectedPos;
  document.querySelectorAll('.position-option').forEach(el => {
    el.classList.remove('selected', 'active');
  });

  if (element) {
    element.classList.add('selected', 'active');
  } else {
    const matchingEl = document.querySelector(`.position-option[data-pos="${gameState.selectedPos}"]`) ||
      Array.from(document.querySelectorAll('.position-option')).find(el => el.textContent.includes(gameState.selectedPos));
    if (matchingEl) matchingEl.classList.add('selected', 'active');
  }
  updateRookieCardPreview({ pos: gameState.selectedPos });
}

export function selectNationality(natId, element) {
  const chosenNat = natId || "VN";
  gameState.selectedNatId = chosenNat;
  window.selectedNationality = chosenNat;

  document.querySelectorAll('.nationality-option').forEach(el => {
    el.classList.remove('selected', 'active');
  });

  if (element) {
    element.classList.add('selected', 'active');
  } else {
    const matchingEl = document.querySelector(`.nationality-option[data-nat="${chosenNat}"]`) ||
      Array.from(document.querySelectorAll('.nationality-option')).find(el => el.textContent.includes(chosenNat));
    if (matchingEl) matchingEl.classList.add('selected', 'active');
  }
  updateRookieCardPreview({ natId: chosenNat });
}

export function selectAcademy(academyId, element) {
  const chosenAcademy = academyId || "pvf_academy";
  gameState.selectedAcademyId = chosenAcademy;
  window.selectedAcademyId = chosenAcademy;

  document.querySelectorAll('.academy-option').forEach(el => {
    el.classList.remove('selected', 'active');
  });

  if (element) {
    element.classList.add('selected', 'active');
  } else {
    const matchingEl = document.querySelector(`.academy-option[data-academy="${chosenAcademy}"]`);
    if (matchingEl) matchingEl.classList.add('selected', 'active');
  }
  updateRookieCardPreview({ academyId: chosenAcademy });
}

/* =========================================================================
   2. CAREER INITIALIZATION & RESTART
   ========================================================================= */
export function createNewPlayer(name = "", nation = "VN", position = "ST", academyId = null) {
  const player = resetPlayerState(name, nation, position, academyId);
  player.cardTheme = 'future';
  initSeasonScheduleAndTable(player);

  const logContainer = document.getElementById('careerLog');
  if (logContainer) logContainer.innerHTML = '';

  addLog(
    player,
    "Gia Nhập Lò Đào Tạo Trẻ",
    `Bạn chính thức trúng tuyển vào ${player.academy.name} (${player.academy.flag} ${player.academy.country}) ở vị trí ${POSITION_CONFIG[player.position]?.name || player.position}. Kình địch cùng thời của bạn là ${player.rival.name} (${player.rival.club})!`
  );
  return player;
}

export function saveGameState(player) {
  const saveRes = saveGame(player);
  try {
    const raw = JSON.stringify({
      version: 3,
      savedAt: new Date().toISOString(),
      player: player
    });
    localStorage.setItem('football_career_save', raw);
    localStorage.setItem('playerSave', raw);
  } catch (err) {
    console.warn('[Storage] saveGameState backup error:', err);
  }
  return saveRes;
}

export function initCareerDashboard(player) {
  const p = player || getPlayer();
  if (!p) return;
  switchTab('tabMatchday');
  updateUI(p);
  renderFcsUltimateCard(p);
  bindSeasonActionButtons();
  bindTacticButtons();
}

/* =========================================================================
   2.1 3-STEP CHARACTER CREATION WORKFLOW (FLOW CONTROL)
   ========================================================================= */

/**
 * BƯỚC 1 (Menu/Setup): Khi người chơi bấm "Sự Nghiệp Mới" hoặc chọn slot mới:
 * - Cho phép chọn Slot lưu (Slot 1 - 5).
 * - Nếu slot đã có dữ liệu thì hiện confirm hỏi có muốn ghi đè lên slot đó không.
 * - MỞ MÀN HÌNH TẠO CẦU THỦ (#screenSetup / #characterCreationScreen), reset các trường nhập liệu.
 * - GIỮ NGUYÊN màn hình này để người chơi chỉnh sửa, KHÔNG ĐƯỢC tự ý nhảy vào game.
 * @param {number} [targetSlotId]
 * @returns {boolean}
 */
export function prepareNewCareer(targetSlotId) {
  let slotId;
  if (targetSlotId !== undefined && targetSlotId !== null && !isNaN(Number(targetSlotId))) {
    const parsed = Number(targetSlotId);
    if (parsed >= 1 && parsed <= 5) {
      slotId = parsed;
    }
  }

  // Nếu không truyền slotId hoặc slotId không hợp lệ: tự động tìm slot trống đầu tiên (1 -> 5)
  if (!slotId) {
    slotId = getFirstAvailableSlot();
  }

  const slots = getSaveSlotsInfo();
  const currentSlotInfo = slots.find(s => s.slotId === slotId);

  if (currentSlotInfo && !currentSlotInfo.isEmpty) {
    const confirmFn = (typeof window !== 'undefined' && window.confirm) ? window.confirm.bind(window) : () => true;
    const confirmed = confirmFn(`⚠️ CẢNH BÁO QUAN TRỌNG: Ô lưu Slot ${slotId} đang có sự nghiệp của:\n- Cầu thủ: ${currentSlotInfo.name}\n- CLB: ${currentSlotInfo.club} (${currentSlotInfo.season})\n- Ngày lưu: ${currentSlotInfo.savedAt}\n\nTạo sự nghiệp mới sẽ XÓA VĨNH VIỄN file lưu cũ này. Bạn có chắc chắn muốn ghi đè lên Slot ${slotId} không?`);
    if (!confirmed) {
      return false; // Người chơi bấm Cancel thì dừng lại
    }
  }

  setCurrentSaveSlot(slotId);

  // Mở màn hình tạo cầu thủ
  switchScreen('screenSetup');

  // Reset các trường nhập liệu về mặc định (Tên, Quốc tịch, Vị trí, Lò đào tạo)
  const nameInput = document.getElementById('inputPlayerName') ||
    document.getElementById('playerName') ||
    document.querySelector('input[name="playerName"]');
  if (nameInput) {
    nameInput.value = "";
    nameInput.placeholder = "Nhập họ và tên cầu thủ...";
  }
  selectNationality('VN');
  selectPosition('ST');
  selectAcademy('pvf_academy');
  updateRookieCardPreview({ name: "", natId: 'VN', pos: 'ST', academyId: 'pvf_academy' });

  // Đóng modal 5 slots nếu đang mở
  closeSaveSlotsModal();

  // GIỮ NGUYÊN màn hình này để người chơi chỉnh sửa, KHÔNG ĐƯỢC tự ý nhảy vào game!
  renderSaveSlotsSelectorBar();
  updateStartScreenButtons();

  if (typeof window !== 'undefined' && window.scrollTo) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showToast(`📝 Đang cấu hình sự nghiệp mới tại Slot ${slotId}. Hãy nhập tên, chọn vị trí và lò đào tạo, sau đó bấm Xác Nhận!`, 'info');
  return true;
}

/**
 * BƯỚC 2 & BƯỚC 3: Xác nhận tạo cầu thủ & Vào game:
 * - Người chơi bấm nút xác nhận cuối form.
 * - Đọc form (Tên đã nhập, Quốc tịch, Vị trí sở trường, Lò đào tạo).
 * - Khởi tạo nhân vật mới, lưu vào đúng currentSaveSlot.
 * - Ẩn màn hình tạo nhân vật, mở Dashboard chính của game và nạp dữ liệu.
 */
/**
 * BƯỚC 2 & BƯỚC 3: Xác nhận tạo cầu thủ & Vào game:
 * - Người chơi bấm nút xác nhận cuối form ("✍️ KÝ HỢP ĐỒNG GIA NHẬP ACADEMY & BẮT ĐẦU").
 * - Kiểm tra trạng thái Slot trước khi tạo:
 *   + NẾU slot còn trống (Empty): Tiếp tục tiến trình khởi tạo bình thường.
 *   + NẾU slot ĐÃ CÓ DỮ LIỆU: Dừng tiến trình ngay lập tức và mở Modal Xác Nhận Ghi Đè.
 *     Khi người chơi xác nhận ghi đè: gọi clearCupCache(slotId) và tiến hành tạo mới.
 *     Khi người chơi bấm hủy: giữ nguyên màn hình Setup để chọn slot khác.
 */
export function confirmAndStartCareer() {
  const slotId = currentSaveSlot || 1;
  const slots = getSaveSlotsInfo();
  const currentSlotInfo = slots.find(s => s.slotId === slotId);

  // 1. Kiểm tra trạng thái Slot trước khi tạo:
  // NẾU slot ĐÃ CÓ DỮ LIỆU: Dừng tiến trình ngay lập tức và mở Modal Xác Nhận Ghi Đè
  if (currentSlotInfo && !currentSlotInfo.isEmpty) {
    showOverwriteWarningModal(
      currentSlotInfo,
      // Nút xác nhận: [ ⚠️ XÁC NHẬN GHI ĐÈ & BẮT ĐẦU ]
      () => {
        // BẮT BUỘC gọi clearCupCache(slotId) khi người chơi xác nhận ghi đè để xóa sạch cache Cúp cũ
        clearCupCache(slotId);
        executeCareerCreation(slotId);
      },
      // Nút hủy bỏ: [ ❌ HỦY BỎ / CHỌN SLOT KHÁC ]
      () => {
        showToast(`Đã hủy ghi đè. Bạn có thể chọn slot khác để lưu sự nghiệp mới.`, 'info');
      }
    );
    return;
  }

  // NẾU slot còn trống (Empty): Tiếp tục tiến trình khởi tạo bình thường
  executeCareerCreation(slotId);
}

/**
 * Thực thi tạo mới cầu thủ và lưu vào slot chỉ định:
 * - Đọc form (Tên đã nhập, Quốc tịch, Vị trí sở trường, Lò đào tạo).
 * - Khởi tạo nhân vật mới, lưu vào đúng slotId (đồng thời dọn cache Cúp).
 * - Ẩn màn hình tạo nhân vật, mở Dashboard chính của game và nạp dữ liệu.
 * @param {number} [targetSlotId]
 */
export function executeCareerCreation(targetSlotId) {
  const slotId = Number(targetSlotId) || currentSaveSlot || 1;
  const btnConfirm = document.getElementById('btnConfirmCreatePlayer') ||
    document.getElementById('btnStartCareer') ||
    document.getElementById('btnStartNewCareer');
  const originalBtnText = btnConfirm ? btnConfirm.textContent : '';

  try {
    // 1. Phản hồi trực quan: Animation ký hợp đồng trên nút bấm
    if (btnConfirm) {
      btnConfirm.disabled = true;
      btnConfirm.style.pointerEvents = 'none';
      btnConfirm.innerHTML = `✍️ <span class="spinner-inline"></span> Đang Đặt Bút Ký Hợp Đồng & Khởi Tạo Hồ Sơ...`;
    }

    // 2. Đọc dữ liệu từ form tạo cầu thủ
    const nameInput = document.getElementById('inputPlayerName') ||
      document.getElementById('playerName') ||
      document.querySelector('input[name="playerName"]');
    const playerName = (nameInput && nameInput.value && nameInput.value.trim())
      ? nameInput.value.trim()
      : ""; // Tự sinh tên nếu để trống

    const selectedNatEl = document.querySelector('.nationality-option.selected') ||
      document.querySelector('#nationalityGrid .selected');
    const nation = selectedNatEl?.dataset?.nat ||
      gameState.selectedNatId ||
      window.selectedNationality ||
      "VN";

    const selectedPosEl = document.querySelector('.position-option.selected') ||
      document.querySelector('#positionGrid .selected') ||
      document.querySelector('.position-grid .selected');
    const position = selectedPosEl?.dataset?.pos ||
      gameState.selectedPos ||
      window.selectedPosition ||
      "ST";

    const selectedAcadEl = document.querySelector('.academy-option.selected') ||
      document.querySelector('#academyGrid .selected');
    const academyId = selectedAcadEl?.dataset?.academy ||
      gameState.selectedAcademyId ||
      window.selectedAcademyId ||
      null;

    // 3. Khởi tạo đối tượng player mới hoàn chỉnh
    const player = createNewPlayer(playerName, nation, position, academyId);
    if (!player) {
      throw new Error("Không thể khởi tạo đối tượng cầu thủ mới.");
    }

    // Đảm bảo các thuộc tính nền tảng không bị undefined khi render
    if (!player.careerStats) player.careerStats = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 };
    if (!player.currentSeasonStats) player.currentSeasonStats = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 };
    if (!player.seasonHistory) player.seasonHistory = [];
    if (!player.trophiesTally) player.trophiesTally = {};
    if (!player.chronicle) player.chronicle = [];
    if (!player.careerLogs) player.careerLogs = [];
    if (!player.tactic) player.tactic = 'BALANCED';
    if (!player.preMatchPrep) player.preMatchPrep = 'NONE';
    if (!player.cardTheme) player.cardTheme = 'future';
    if (!player.cardAvatar) player.cardAvatar = 'avatar_fade';

    // 4. Khởi tạo slot mới sạch sẽ và lưu vào slot chỉ định (xóa trắng cache Cúp cũ)
    try {
      const slotRes = initNewSlot(slotId, player);
      console.log(`[Storage] initNewSlot hoàn tất tại Slot ${slotId}:`, slotRes);
    } catch (slotErr) {
      console.error(`[Storage] Lỗi khi lưu vào Slot ${slotId} (vẫn tiếp tục vào game):`, slotErr);
    }

    // 5. Chuyển giao màn hình: Ẩn form tạo / modal ký hợp đồng, hiện Dashboard chính
    const creationScreenSelectors = [
      '#screenSetup',
      '#characterCreationScreen',
      '#screenCreate',
      '#create-character-screen',
      '#academy-selection-modal'
    ];
    creationScreenSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.remove('active');
        el.classList.add('hidden');
        el.style.display = 'none';
      });
    });

    const dashboardScreenSelectors = [
      '#screenDashboard',
      '#mainDashboard',
      '#screenMain',
      '#game-screen',
      '#main-dashboard'
    ];
    dashboardScreenSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.classList.remove('hidden');
        el.classList.add('active');
        el.style.display = 'flex';
      });
    });

    // Gọi hàm định tuyến điều hướng chính
    switchScreen('screenDashboard');

    // 6. Cập nhật Dashboard và Giao Diện
    try {
      initCareerDashboard(player);
      renderDashboard();
    } catch (uiErr) {
      console.error("❌ [UI] Lỗi khi render Dashboard ban đầu:", uiErr);
      // Fallback: ít nhất vẫn cập nhật các bảng cơ bản
      try { updateUI(player); } catch (e) { console.error("[UI Fallback]", e); }
    }

    const academyTitle = player.academy?.name || 'Học viện';
    showToast(`🎉 Khởi tạo sự nghiệp thành công! Chào mừng ${player.name} gia nhập ${academyTitle} (Đã lưu tại Slot ${slotId})!`, 'success');
    updateStartScreenButtons();

    // Cuộn mượt lên đầu trang để sẵn sàng trải nghiệm
    if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

  } catch (err) {
    console.error("❌ [confirmAndStartCareer] Lỗi nghiêm trọng khi ký hợp đồng và bắt đầu sự nghiệp:", err);
    console.error("Stack trace:", err.stack);
    showToast(`❌ Không thể bắt đầu sự nghiệp: ${err.message || 'Lỗi không xác định'}`, 'error');

    // Khôi phục lại trạng thái nút bấm nếu gặp lỗi
    if (btnConfirm) {
      btnConfirm.disabled = false;
      btnConfirm.style.pointerEvents = 'auto';
      btnConfirm.textContent = originalBtnText || `✍️ KÝ HỢP ĐỒNG GIA NHẬP ACADEMY & BẮT ĐẦU (SLOT ${slotId})`;
    }
  }
}

// Backward compatibility alias
export function newCareerWithSaveWarning() {
  return prepareNewCareer();
}

export function startCareer() {
  return confirmAndStartCareer();
}

export function renderDashboard() {
  const player = getPlayer();
  if (player) {
    updateUI(player);
    renderFcsUltimateCard(player);
  }
}

export function restartGame() {
  const bestSlot = getFirstAvailableSlot();
  setCurrentSaveSlot(bestSlot);

  const nameInput = document.getElementById('inputPlayerName');
  if (nameInput) {
    nameInput.value = "";
    nameInput.placeholder = "Nhập họ và tên cầu thủ...";
  }
  selectPosition('ST');
  selectNationality('VN');
  selectAcademy('pvf_academy');
  updateRookieCardPreview({ name: "", natId: 'VN', pos: 'ST', academyId: 'pvf_academy' });
  switchScreen('screenSetup');
  renderSaveSlotsSelectorBar();
  updateStartScreenButtons();
  if (typeof window !== 'undefined' && window.scrollTo) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* =========================================================================
   3. FIXTURE-BY-FIXTURE MATCHDAY SIMULATION CONTROLLERS
   ========================================================================= */
let isActionRunning = false;

/**
 * Điều phối lượt thi đấu vòng tiếp theo:
 * - isQuickSim = false: Mở Match Center Arena (90 phút tick-based, commentary, live rating, xG)
 * - isQuickSim = true: Mô phỏng nhanh kết quả trận đấu của người chơi
 */
export function playMatchday(isQuickSim = false) {
  if (isActionRunning) return;
  const player = getPlayer();

  const isGK = player.position === 'GK';
  const maxRetireAge = isGK ? 44 : 42;
  if (player.isRetired || player.age >= maxRetireAge) {
    triggerRetirement();
    return;
  }

  if (!player.currentSeasonFixtures || player.currentSeasonFixtures.length === 0) {
    initSeasonScheduleAndTable(player);
  }

  const curIdx = player.currentFixtureIndex || 0;
  if (curIdx >= player.currentSeasonFixtures.length) {
    handleSeasonEndRollover(player);
    return;
  }

  // Kiểm tra chấn thương
  if (player.injury && player.injury.isInjured && player.injury.phasesRemaining > 0) {
    showToast(`🚑 Bạn đang dính chấn thương (${player.injury.name})! Vui lòng chọn Điều Trị / Rehab để hồi phục trước khi ra sân.`, "error");
    return;
  }

  // Đảm bảo không bao giờ để thể lực bắt đầu trận bị kẹt ở mức 10%
  if ((player.stam || 100) <= 20 || (player.stamina || 100) <= 20) {
    recoverStaminaBetweenMatches(player);
    updateUI(player);
  }

  const fixture = player.currentSeasonFixtures[curIdx];
  const pMatch = fixture.playerMatch;

  if (isQuickSim) {
    isActionRunning = true;
    try {
      const outcome = simulateMatchdayRound(player, true, null);
      handlePostMatchOutcome(player, outcome, false);
      renderLiveLeagueTable(player);
      renderTopScorers(player);
      renderFixturesList(player);
    } catch (err) {
      console.error("Lỗi khi mô phỏng nhanh:", err);
    } finally {
      isActionRunning = false;
    }
  } else {
    // Mở Match Center Arena trực tiếp
    openMatchCenterModal(
      player,
      {
        tourneyTitle: `${fixture.stageName} • ${fixture.competitionName}`,
        stadium: pMatch.stadium,
        opponentName: pMatch.opponent.name,
        opponentIcon: pMatch.opponent.icon || "⚔️",
        opponentPower: pMatch.opponent.power || 78,
        isPlayerHome: pMatch.isPlayerHome
      },
      (matchResult) => {
        isActionRunning = true;
        try {
          const outcome = simulateMatchdayRound(player, false, matchResult);
          handlePostMatchOutcome(player, outcome, false);
          renderLiveLeagueTable(player);
          renderTopScorers(player);
          renderFixturesList(player);
        } catch (err) {
          console.error("Lỗi khi hoàn tất trận đấu Arena:", err);
        } finally {
          isActionRunning = false;
        }
      }
    );
  }
}

/**
 * Mô phỏng nhanh 5 vòng đấu tiếp theo liên tiếp
 */
export function quickSimNext5Matches() {
  if (isActionRunning) return;
  const player = getPlayer();

  if (!player.currentSeasonFixtures || player.currentSeasonFixtures.length === 0) {
    initSeasonScheduleAndTable(player);
  }

  if (player.injury && player.injury.isInjured && player.injury.phasesRemaining > 0) {
    showToast(`🚑 Bạn đang dính chấn thương (${player.injury.name})!`, "error");
    return;
  }

  isActionRunning = true;
  let matchesSimulated = 0;
  let lastOutcome = null;

  try {
    for (let i = 0; i < 5; i++) {
      if ((player.currentFixtureIndex || 0) >= player.currentSeasonFixtures.length) break;
      if (player.injury && player.injury.isInjured && player.injury.phasesRemaining > 0) break;

      lastOutcome = simulateMatchdayRound(player, true, null);
      matchesSimulated++;
      if (lastOutcome.isSeasonFinished) break;
    }

    if (lastOutcome) {
      handlePostMatchOutcome(player, lastOutcome, true, matchesSimulated);
    }
  } catch (err) {
    console.error("Lỗi khi mô phỏng 5 vòng:", err);
  } finally {
    isActionRunning = false;
  }
}

/**
 * Xử lý kết quả sau mỗi vòng đấu
 */
function handlePostMatchOutcome(player, outcome, isBatch = false, count = 1) {
  const roundData = outcome.roundData;
  renderLiveLeagueTable(player);
  renderTopScorers(player);
  renderFixturesList(player);

  if (isBatch) {
    showToast(`⚡ Đã mô phỏng nhanh ${count} vòng đấu liên tiếp!`, "success");
    addLog(
      player,
      `[Mô Phỏng Nhanh ${count} Vòng]`,
      `Hoàn thành ${count} vòng đấu. Hiện đang ở vòng ${player.currentFixtureIndex}/${player.currentSeasonFixtures.length}.`,
      "normal"
    );
  } else {
    showToast(`🏁 ${roundData.stageName}: ${roundData.playerMatch.homeClub.name} ${outcome.homeScore} - ${outcome.awayScore} ${roundData.playerMatch.awayClub.name}`, "success");

    let statSummary = "";
    if (player.position === "GK") {
      statSummary = `${outcome.playerCleanSheets > 0 ? '🧤 Sạch lưới' : 'Bị thủng lưới'}, 🧤 ${outcome.playerSaves} cứu thua`;
    } else if (player.position === "DF") {
      statSummary = `🛡️ ${outcome.playerTackles} tắc bóng, ${outcome.playerCleanSheets > 0 ? '🧤 Sạch lưới' : ''}`;
    } else {
      statSummary = `⚽ ${outcome.playerGoals} bàn, 🎯 ${outcome.playerAssists} kiến tạo`;
    }

    addLog(
      player,
      `[${roundData.competitionName} — ${roundData.stageName}]`,
      `${outcome.matchDesc} ${outcome.prepMsg ? outcome.prepMsg + ' ' : ''}`,
      outcome.playerGoals > 0 ? "trophy-win" : "normal"
    );

    // Bổ sung xen kẽ các mẩu nhật ký sinh hoạt nhỏ ngẫu nhiên theo tuần/tháng (Nhóm 4: Academy Life)
    if (outcome.academyLifeSnippet) {
      addLog(
        player,
        player.isAcademyStage ? "📖 Nhật Ký Tân Binh Học Viện" : "📖 Đời Thường & Tâm Lý Cầu Thủ",
        outcome.academyLifeSnippet,
        "normal"
      );
    }
  }

  // Thông báo & Ghi log hồi phục thể lực sau kỳ nghỉ giữa 2 vòng đấu (Between-Match Stamina Recovery)
  if (outcome.recoveryInfo && outcome.recoveryInfo.recoveredAmount > 0) {
    if (!isBatch) {
      showToast(outcome.recoveryInfo.msg, "success");
    }
    addLog(
      player,
      "⚡ Hồi Phục Thể Lực Giữa Trận",
      outcome.recoveryInfo.msg,
      "normal"
    );
  }

  // Cột mốc Chronicle
  recordChronicleMilestone(player, 'DEBUT', {
    desc: `Chính thức ra mắt màu áo ${player.isAcademyStage ? (player.academy?.name || 'Học viện') : (player.currentClub?.name || 'CLB')}!`
  });
  if (player.totalCareerGoals > 0) {
    recordChronicleMilestone(player, 'FIRST_GOAL', {
      desc: `Pha lập công mở tài khoản bàn thắng cá nhân đầu tiên trong sự nghiệp cầu thủ chuyên nghiệp!`
    });
  }
  if (outcome.playerGoals >= 3) {
    recordChronicleMilestone(player, 'FIRST_HATTRICK', {
      desc: `Cú Hattrick siêu đẳng làm nổ tung cầu trường!`
    });
  }

  // Phản hồi tăng trưởng động theo phong độ (Dynamic Growth - Nhóm 3: Skill Breakthrough)
  if (outcome.growth) {
    const g = outcome.growth;
    if (g.isLevelUp) {
      showToast(`🎉 ĐỘT PHÁ TIỀM NĂNG! Bạn đã đạt Cấp Tăng Trưởng ${g.growthLevel}!`, "success");
      const lvlNarrative = generateSkillBreakthroughNarrative(player, { isLevelUp: true, growthLevel: g.growthLevel });
      addLog(player, lvlNarrative.title, lvlNarrative.body, "trophy-win");
    }
    if (g.statChanges && g.statChanges.length > 0) {
      g.statChanges.forEach(sc => {
        if (sc.isMilestone || sc.delta > 0) {
          const scNarrative = generateSkillBreakthroughNarrative(player, sc);
          if (sc.isMilestone) {
            showToast(`🎯 CHÚC MỪNG: ${sc.statName || sc.stat.toUpperCase()} chính thức thăng cấp lên ${sc.currentValue}!`, "gold");
            addLog(player, scNarrative.title, scNarrative.body, "trophy-win");
          } else {
            showToast(`⚡ ${sc.reason}: +${sc.delta} ${sc.statName || sc.stat.toUpperCase()}!`, "success");
            addLog(player, scNarrative.title, scNarrative.body, "trophy-win");
          }
        } else {
          showToast(`📉 ${sc.reason}: ${sc.delta} ${sc.statName || sc.stat.toUpperCase()}!`, "error");
          addLog(player, `[Sa Sút Kỹ Năng: ${sc.statName || sc.stat.toUpperCase()}]`, `${sc.reason} (${sc.delta} điểm).`, "normal");
        }
      });
    }
  }

  const proceedToNextStep = () => {
    // Xử lý chấn thương nếu dính
    if (outcome.injuryData && !(player.injury && player.injury.isInjured)) {
      showInjuryDilemmaModal(player, outcome.injuryData, (decision) => {
        addLog(
          player,
          `🚑 BÁO CÁO Y TẾ: ${outcome.injuryData.name}`,
          `Quyết định: ${decision === 'REST' ? 'Nghỉ ngơi tĩnh dưỡng và vật lý trị liệu' : 'Nén đau tiêm thuốc tiếp tục chiến đấu'}.`,
          'normal'
        );
        autoSave(player);
        updateUI(player);
        if (outcome.isSeasonFinished || (player.currentFixtureIndex >= player.currentSeasonFixtures.length)) {
          handleSeasonEndRollover(player);
        }
      });
    } else {
      autoSave(player);
      // Kiểm tra nếu mùa giải đã kết thúc
      if (outcome.isSeasonFinished || (player.currentFixtureIndex >= player.currentSeasonFixtures.length)) {
        handleSeasonEndRollover(player);
      } else {
        updateUI(player);
      }
    }
  };

  // KÍCH HOẠT HỌP BÁO SAU TRẬN ĐẤU (POST-MATCH PRESS CONFERENCE - Nhóm 2: Dressing Room & Media)
  if (!isBatch && player.pressConferencePending) {
    const pcData = player.pressConferencePending;
    triggerPostMatchPressConference(player, pcData, (res) => {
      const mediaNarrative = generateMediaInteractionNarrative(player, res?.type || 'HUMBLE', pcData);
      addLog(
        player,
        mediaNarrative.title,
        mediaNarrative.body,
        res?.type === 'BLAME' ? 'injury' : (res?.type === 'STAR' ? 'trophy-win' : 'normal')
      );
      autoSave(player);
      updateUI(player);
      proceedToNextStep();
    });
  } else {
    proceedToNextStep();
  }
}

/**
 * Xử lý khi kết thúc mùa giải (Rollover sang mùa giải mới)
 */
export function handleSeasonEndRollover(player) {
  const isYouth = Boolean(player.isAcademyStage || player.age === 16);
  if (isYouth) {
    simulateAcademySeason(
      "Tốt Nghiệp Lò Đào Tạo Trẻ",
      "Sau mùa giải thi đấu trọn vẹn và cống hiến hết mình tại giải U19 Academy, bạn chính thức hoàn thành khóa đào tạo và được đôn lên đội một!"
    );
    return;
  }

  // 1. Kiểm tra VCK Mùa Hè (Summer Tournament)
  const summerEligible = checkSummerTournamentEligibility(player);
  if (summerEligible) {
    if (!player.summerTournament) {
      initSummerTournament(player);
    }

    if (player.summerTournament && !player.summerTournament.isFinished) {
      window.onSummerTournamentCompleted = () => {
        simulateSeason(
          "Tổng Kết Mùa Giải & Đỉnh Cao Danh Hiệu",
          "Bạn thi đấu trọn vẹn toàn bộ các vòng đấu của giải VĐQG và các đấu trường cúp đỉnh cao của năm!"
        );
      };

      const startInteractive = () => {
        const tourney = player.summerTournament;
        if (!tourney || !tourney.currentFixture) return;
        const pMatch = tourney.currentFixture.playerMatch;
        closeSummerTournamentModal();
        openMatchCenterModal(
          player,
          {
            tourneyTitle: `${tourney.currentFixture.stageName} • ${tourney.tourneyName}`,
            stadium: pMatch.stadium,
            opponentName: pMatch.opponent.name,
            opponentIcon: pMatch.opponent.flag || pMatch.opponent.icon || "🚩",
            opponentPower: pMatch.opponent.power || 80,
            isPlayerHome: pMatch.isPlayerHome,
            isNationalTeam: true
          },
          (matchResult) => {
            const simRes = advanceSummerTournamentMatch(player, false, matchResult);
            addLog(
              player,
              `[${tourney.tourneyName} — ${tourney.currentFixture ? tourney.currentFixture.stageName : 'VCK Mùa Hè'}]`,
              `Tỷ số: ${simRes.homeScore}-${simRes.awayScore} | Bàn thắng: ${simRes.playerGoals} | Kiến tạo: ${simRes.playerAssists} | Đánh giá: ${simRes.rating}.`,
              simRes.playerGoals > 0 ? "trophy-win" : "normal"
            );
            autoSave(player);
            updateUI(player);
            renderSummerTournamentModal(player, startInteractive, runQuickSim);
          }
        );
      };

      const runQuickSim = () => {
        const tourney = player.summerTournament;
        if (!tourney || !tourney.currentFixture) return;
        const simRes = advanceSummerTournamentMatch(player, true, null);
        addLog(
          player,
          `[${tourney.tourneyName} — ${tourney.currentFixture ? tourney.currentFixture.stageName : 'VCK Mùa Hè'}]`,
          `Tỷ số: ${simRes.homeScore}-${simRes.awayScore} | Bàn thắng: ${simRes.playerGoals} | Kiến tạo: ${simRes.playerAssists} | Đánh giá: ${simRes.rating}.`,
          simRes.playerGoals > 0 ? "trophy-win" : "normal"
        );
        autoSave(player);
        updateUI(player);
        renderSummerTournamentModal(player, startInteractive, runQuickSim);
      };

      renderSummerTournamentModal(player, startInteractive, runQuickSim);
      return;
    }
  }

  // Kết thúc mùa giải bình thường
  simulateSeason(
    "Tổng Kết Mùa Giải & Đỉnh Cao Danh Hiệu",
    "Bạn thi đấu trọn vẹn toàn bộ các vòng đấu của giải VĐQG và các đấu trường cúp đỉnh cao của năm!"
  );
}
export function openSeasonAwardsModal() {
  const player = getPlayer();
  if (player) {
    handleSeasonEndRollover(player);
  } else if (typeof window !== 'undefined' && typeof window.onSeasonCompletedRollover === 'function') {
    window.onSeasonCompletedRollover();
  }
}
window.openSeasonAwardsModal = openSeasonAwardsModal;

window.onSeasonCompletedRollover = () => {
  openSeasonAwardsModal();
};

// Event delegation bắt click nút Tổng Kết Mùa Giải & Lễ Trao Giải
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (
      e.target.closest('#btn-season-end-awards') ||
      e.target.closest('.btn-season-summary') ||
      e.target.closest('#btnFinishSeasonAndRollover')
    ) {
      openSeasonAwardsModal();
    }
  });
}


// Legacy compatibility wrapper
export function performSeasonAction(actionType) {
  playMatchday(actionType === 'quick_sim');
}

/* =========================================================================
   3.1 SIMULATE FULL SEASON & ANNUAL REWARDS
   ========================================================================= */
export function simulateSeason(actionTitle = "Thi Đấu Mùa Giải Mới", actionReport = "Bạn nỗ lực thi đấu và cống hiến hết mình cho đội bóng.") {
  const player = getPlayer();

  if (player.isAcademyStage) {
    simulateAcademySeason(actionTitle, actionReport);
    return;
  }

  const result = simulateSeasonRound(player, actionTitle, actionReport);
  const isBallonDorWon = Boolean(result.ballonDorResult && result.ballonDorResult.won);

  showSeasonSummaryModal(
    player,
    actionTitle,
    result.finalActionReport,
    result.seasonReportRows,
    result.seasonTotalSummary,
    result.seasonMatches,
    result.seasonGoals,
    result.seasonAssists,
    result.seasonCleanSheets,
    result.seasonSaves,
    result.seasonTackles,
    (result.seasonTrophiesWonList || []).length,
    isBallonDorWon,
    () => {
      const proceedSeasonRollover = () => {
        // BƯỚC 1: TĂNG TUỔI VÀ NĂM MÙA GIẢI SAU KHI XÁC NHẬN TỔNG KẾT
        player.age = (player.age || 16) + 1;
        player.year = (player.year || 2026) + 1;
        player.seasonCount = (player.seasonCount || 1) + 1;
        player.seasonsPlayed = (player.seasonsPlayed || 0) + 1;

        if (player.age > 30) {
          let decayFactor = player.subscriptions.includes("sub_cryo") ? 0.75 : 1.5;
          const decay = Math.floor((player.age - 29) * decayFactor);
          player.stam = Math.max(15, player.stam - decay);
          if (player.age > 33) {
            const attrDecay = player.subscriptions.includes("sub_cryo") ? 1 : 2;
            player.attr1 = Math.max(25, player.attr1 - attrDecay);
            player.attr2 = Math.max(25, player.attr2 - attrDecay);
          }
        }

        // Callback SAU KHI người chơi bấm nút "BƯỚC SANG MÙA GIẢI MỚI"
        if (isBallonDorWon) {
          addLog(player, "QUẢ BÓNG VÀNG THẾ GIỚI", `🥇 Khoảnh khắc lịch sử! Bạn chính thức nhận danh hiệu QUẢ BÓNG VÀNG (Ballon d'Or) thứ ${player.ballonDorWins} danh giá nhất thế giới!`, "trophy-win");
        }

        const goldenShoeList = getGoldenShoeRankings(player);
        if (goldenShoeList.length > 0 && goldenShoeList[0].isPlayer) {
          addLog(player, "CHIẾC GIÀY VÀNG CHÂU ÂU", `👟 VUA PHÁ LƯỚI CHÂU ÂU! Bạn chính thức nhận danh hiệu CHIẾC GIÀY VÀNG CHÂU ÂU (European Golden Shoe) với ${goldenShoeList[0].goals} bàn thắng!`, "trophy-win");
        }

        addFullSeasonStructuredLog(
          player,
          actionTitle,
          result.finalActionReport,
          result.seasonReportRows,
          result.seasonTotalSummary,
          result.isTrophyWin
        );

        checkAndAwardRecords(player, (rec) => {
          addLog(
            player,
            "KỶ LỤC LỊCH SỬ BỊ PHÁ VỠ!",
            `🚨 LỊCH SỬ SANG TRANG! Bạn chính thức phá vỡ kỷ lục "${rec.title}" với thành tích vô tiền khoáng hậu (Vượt qua cột mốc của ${rec.holder})!`,
            "trophy-win"
          );
        });

        // Reset toàn bộ accumulator & bảng điểm mùa giải cũ về 0 cho mùa giải mới
        player.seasonAccumulator = { matches: 0, goals: 0, assists: 0, cs: 0, saves: 0, tackles: 0 };
        player.currentSeasonGoals = 0;
        player.seasonRatingsSum = 0;
        player.seasonRatingsCount = 0;
        player.avgRating = 0;
        if (player.currentSeasonStats) {
          player.currentSeasonStats.avgRating = 0;
        }
        if (player.rival) player.rival.seasonGoals = 0;

        // Bắt buộc đặt lại currentPhase = 1 cho mùa giải mới
        player.currentSeasonPhase = 1;
        gameState.currentPhase = 1;
        initSeasonScheduleAndTable(player);

        // KIỂM TRA ĐIỀU KIỆN GIẢI NGHỆ NGAY SAU KHI BẤM CHUYỂN MÙA
        const isRetired = checkRetirementConditions();
        if (isRetired) {
          return; // Đã giải nghệ -> Dừng lại và hiển thị Đại Sảnh Danh Vọng
        }

        addLog(
          player,
          "BAT DAU MUA GIAI MOI",
          `Bat dau mua giai moi (Nam ${player.year} - ${player.age} Tuoi)! Toan doi buoc vao Chang 1 chuan bi cho cuoc dua vo dich tai ${player.currentClub?.name || 'CLB'}!`,
          "normal"
        );

        autoSave(player);  // AUTO-SAVE at start of new season
        updateUI(player);

        rollRandomEvent(player, (logTitle, logBody, logType) => {
          addLog(player, logTitle, logBody, logType);
          autoSave(player);
          updateUI(player);
          checkRetirementConditions();
        }, () => {
          checkRetirementConditions();
        });
      };

      if (isBallonDorWon) {
        showBallonDorWinnerModal(player, () => {
          proceedSeasonRollover();
        });
      } else {
        proceedSeasonRollover();
      }
    }
  );
}

export function simulateAcademySeason(actionTitle, actionReport) {
  const player = getPlayer();
  const result = simulateAcademyRound(player, actionTitle, actionReport);

  showSeasonSummaryModal(
    player,
    "Tốt Nghiệp Lò Đào Tạo Trẻ",
    `Sau mùa giải tân binh rực sáng tại giải U19, bạn tốt nghiệp xuất sắc học viện ${player.academy?.name || 'đào tạo trẻ'} và chính thức bước lên sân chơi chuyên nghiệp đỉnh cao!`,
    result.reportRows,
    `Đã thi đấu ${result.academyStatText} | Đoạt ${result.seasonTrophiesWon} danh hiệu`,
    result.academyMatches,
    result.academyGoals,
    result.academyAssists,
    result.academyCS,
    result.academySaves,
    result.academyTackles,
    result.seasonTrophiesWon,
    false,
    () => {
      // 1. TĂNG TUỔI VÀ NĂM KHI TỐT NGHIỆP HỌC VIỆN
      player.age = (player.age || 16) + 1;
      player.year = (player.year || 2026) + 1;
      player.season = (player.season || 1) + 1;
      player.seasonCount = (player.seasonCount || 1) + 1;
      player.seasonsPlayed = (player.seasonsPlayed || 0) + 1;

      // 2. RESET CHỈ SỐ MÙA GIẢI MỚI VỀ 0
      player.currentSeasonStats = { matches: 0, goals: 0, assists: 0, cleanSheets: 0, saves: 0, tackles: 0 };
      player.seasonAccumulator = { matches: 0, goals: 0, assists: 0, cs: 0, saves: 0, tackles: 0 };
      player.currentSeasonGoals = 0;
      if (player.rival) player.rival.seasonGoals = 0;

      // 3. MẤU CHỐT SỬA LỖI: RESET VÒNG ĐẤU VÀ TẮT CỜ KẾT THÚC MÙA GIẢI
      player.currentFixtureIndex = 0;
      player.isSeasonEnded = false;
      player.seasonEnded = false;

      // Xóa log mùa cũ để bảng log gọn gàng bước vào mùa giải mới
      if (typeof clearSeasonLogs === 'function') {
        clearSeasonLogs(player);
      }

      addFullSeasonStructuredLog(
        player,
        "Tốt Nghiệp Lò Đào Tạo Trẻ",
        `Sau mùa giải tân binh rực sáng tại giải U19, bạn tốt nghiệp xuất sắc học viện ${player.academy?.name || 'đào tạo trẻ'} và chính thức bước lên sân chơi chuyên nghiệp đỉnh cao!`,
        result.reportRows,
        `Đã thi đấu ${result.academyStatText} | Đoạt ${result.seasonTrophiesWon} danh hiệu`,
        true
      );

      addLog(
        player,
        "Ký Hợp Đồng Chuyên Nghiệp Đầu Tiên",
        `Ban lãnh đạo ${result.parentClub.name} chính thức ký hợp đồng thi đấu chuyên nghiệp với bạn với mức lương ${formatSalary(player.salary)}!`,
        "transfer"
      );

      checkAndAwardRecords(player, (rec) => {
        addLog(
          player,
          "KỶ LỤC LỊCH SỬ BỊ PHÁ VỠ!",
          `🚨 LỊCH SỬ SANG TRANG! Bạn chính thức phá vỡ kỷ lục "${rec.title}" với thành tích vô tiền khoáng hậu (Vượt qua cột mốc của ${rec.holder})!`,
          "trophy-win"
        );
      });

      player.currentSeasonPhase = 1;
      gameState.currentPhase = 1;

      // Tạo mới lịch thi đấu và bảng xếp hạng cho Bundesliga
      initSeasonScheduleAndTable(player);

      addLog(
        player,
        "🎉 BẮT ĐẦU MÙA GIẢI MỚI",
        `Bắt đầu mùa giải mới (Năm ${player.year} - ${player.age} Tuổi)! Hãy chuẩn bị cho các vòng đấu chuyên nghiệp tại ${player.currentClub.name}!`,
        "normal"
      );

      // Cập nhật giao diện toàn diện
      updateUI(player);
      if (typeof renderDashboard === 'function') {
        renderDashboard();
      }
      if (typeof renderFixturesList === 'function') {
        renderFixturesList(player);
      }

      // Tự động lưu tiến trình
      if (typeof autoSaveCareer === 'function') {
        autoSaveCareer();
      }

      rollRandomEvent(player, (logTitle, logBody, logType) => {
        addLog(player, logTitle, logBody, logType);
        updateUI(player);
        checkRetirementConditions();
      }, () => {
        checkRetirementConditions();
      });
    }
  );
}

export function simulateRemainingPhasesAndEndSeason() {
  try {
    const player = getPlayer();
    player.currentSeasonPhase = 1;
    gameState.currentPhase = 1;

    showToast("⚡ Đang mô phỏng nhanh trọn vẹn cả mùa giải...", "success");

    simulateSeason(
      "👑 [Mô Phỏng Nhanh Cả Mùa - Đỉnh Cao & Gala QBV]",
      "Bạn thi đấu xuyên suốt cả 4 chặng với phong độ đỉnh cao và hoàn thành tất cả mục tiêu của năm!"
    );
  } catch (error) {
    console.error("Lỗi khi mô phỏng nhanh cả mùa:", error);
  }
}

export const simulateFullSeasonDirectly = simulateRemainingPhasesAndEndSeason;

export function advanceSeasonPhase() {
  performSeasonAction('TRAIN');
}

export function onPlayBigMatchInteractive() {
  performSeasonAction('TRAIN');
}

/* =========================================================================
   4. STORE ACTIONS
   ========================================================================= */
export function buyEquipment(itemId) {
  const player = getPlayer();
  const res = storeBuyEquip(player, itemId);
  if (!res.success) {
    alert(res.message);
    return;
  }
  addLog(player, res.logTitle, res.logBody, "trophy-win");
  renderLifestyleStore(player, buyEquipment, toggleSubscription, buyAsset);
  autoSave(player);  // AUTO-SAVE after equipment purchase
  updateUI(player);
}

export function toggleSubscription(subId, enable) {
  const player = getPlayer();
  const res = storeToggleSub(player, subId, enable);
  if (!res.success) {
    alert(res.message);
    return;
  }
  addLog(player, res.logTitle, res.logBody, res.action === "SUBSCRIBED" ? "transfer" : "normal");
  renderLifestyleStore(player, buyEquipment, toggleSubscription, buyAsset);
  autoSave(player);  // AUTO-SAVE after subscription change
  updateUI(player);
}

export function buyAsset(assetId) {
  const player = getPlayer();
  const res = storeBuyAsset(player, assetId);
  if (!res.success) {
    alert(res.message);
    return;
  }
  addLog(player, res.logTitle, res.logBody, "trophy-win");
  renderLifestyleStore(player, buyEquipment, toggleSubscription, buyAsset);
  autoSave(player);  // AUTO-SAVE after asset purchase
  updateUI(player);
}

/* =========================================================================
   5. TRANSFER MARKET ACTIONS
   ========================================================================= */
export function openTransferMarketModal() {
  const player = getPlayer();
  eventsOpenTransferModal(player, (clubId, newSalary, signingBonus) => {
    acceptTransfer(clubId, newSalary, signingBonus);
  });
}

export function closeTransferModal() {
  eventsCloseTransferModal();
}

export function acceptTransfer(clubId, newSalary, signingBonus) {
  const player = getPlayer();
  const res = acceptTransferOffer(player, clubId, newSalary, signingBonus);
  if (!res) return;

  addLog(
    player,
    "BOM TAN CHUYEN NHUONG",
    `Chinh thuc gia nhap ${res.targetClub.name} (${res.targetClub.league.name})! Muc luong moi: ${formatSalary(newSalary)} | Nhan phi lot tay ky ket: ${formatMoney(signingBonus)}!`,
    "transfer"
  );
  showToast(`Ky hop dong thanh cong voi ${res.targetClub.name}! (+${formatMoney(signingBonus)})`, "success");
  triggerConfetti();
  closeTransferModal();
  autoSave(player);  // AUTO-SAVE after transfer
  updateUI(player);
}

/* =========================================================================
   6. RETIREMENT & POST-CAREER
   ========================================================================= */
export function checkRetirementConditions() {
  const player = getPlayer();

  const isGK = player.position === 'GK';
  const minRetireAge = isGK ? 40 : 38;
  const maxRetireAge = isGK ? 44 : 42;

  if (player.isRetired || player.age >= maxRetireAge) {
    triggerRetirement();
    return true; // 100% BẮT BUỘC GIẢI NGHỆ
  }

  if (player.age < minRetireAge) {
    return false; // Chưa đến tuổi xét giải nghệ
  }

  // Tỷ lệ giải nghệ ngẫu nhiên tăng mạnh theo từng năm từ 38 tuổi (GK từ 40 tuổi)
  const ageDiff = player.age - minRetireAge; // 0, 1, 2, 3
  let baseRetireRate = 0.35 + (ageDiff * 0.20); // 38 (GK 40): 35%, 39 (GK 41): 55%, 40 (GK 42): 75%, 41 (GK 43): 95%
  if (player.stam < 40) baseRetireRate += 0.25;
  if (player.form < 50) baseRetireRate += 0.20;

  if (Math.random() < Math.min(0.98, baseRetireRate)) {
    triggerRetirement();
    return true;
  }

  return false;
}

export function triggerRetirement() {
  try {
    const player = getPlayer();
    if (player) player.isRetired = true;

    // 1. Đóng toàn bộ popup/modal đang mở
    document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));

    // 2. Chuyển màn hình sang Đại Sảnh Danh Vọng (screenEnd)
    switchScreen('screenEnd');

    // 3. Render dữ liệu chi tiết
    if (player) {
      renderRetirementScreen(player);
    }

    // 4. Scroll mượt mà lên đầu trang
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (err) {
    console.error("Lỗi khi chuyển sang màn hình giải nghệ:", err);
    switchScreen('screenEnd');
  }
}

export function selectPostRetirementPath(pathType) {
  const player = getPlayer();
  uiSelectPostRetirementPath(pathType, player);
}

/* =========================================================================
   7. GLOBAL BINDINGS & SYNCHRONIZED EVENT LISTENERS
   ========================================================================= */
export const handlePhaseAction = performSeasonAction;
export const handleQuickSimSeason = simulateRemainingPhasesAndEndSeason;

window.GameState = window.GameState || { isProcessing: false };

window.renderAllUI = function () {
  const p = getPlayer();
  if (p) updateUI(p);
};

window.executePhaseAction = function (action) {
  performSeasonAction(action);
};

window.skipEntireSeason = function () {
  simulateRemainingPhasesAndEndSeason();
};

window.chooseAction = function (type) {
  window.executePhaseAction(type);
};

window.quickSimSeason = function () {
  window.skipEntireSeason();
};

window.currentSaveSlot = currentSaveSlot;
window.setCurrentSaveSlot = setCurrentSaveSlot;
window.getCurrentSaveSlot = getCurrentSaveSlot;
window.getLastActiveSlot = getLastActiveSlot;
window.getSaveSlotsInfo = getSaveSlotsInfo;
window.getFirstAvailableSlot = getFirstAvailableSlot;
window.saveGame = saveGame;
window.loadGame = loadGame;
window.loadCareer = loadCareer;
window.prepareNewCareer = prepareNewCareer;
window.confirmAndStartCareer = confirmAndStartCareer;
window.executeCareerCreation = executeCareerCreation;
window.showOverwriteWarningModal = showOverwriteWarningModal;
window.closeOverwriteWarningModal = closeOverwriteWarningModal;
window.selectSaveSlot = selectSaveSlot;
window.openSaveSlotsModal = openSaveSlotsModal;
window.closeSaveSlotsModal = closeSaveSlotsModal;
window.renderSaveSlotsModal = renderSaveSlotsModal;
window.deleteSlotWithConfirm = deleteSlotWithConfirm;
window.renderSaveSlotsSelectorBar = renderSaveSlotsSelectorBar;
window.startCareer = startCareer;
window.createNewPlayer = createNewPlayer;
window.saveGameState = saveGameState;
window.initCareerDashboard = initCareerDashboard;
window.updateStartScreenButtons = updateStartScreenButtons;
window.newCareerWithSaveWarning = newCareerWithSaveWarning;
window.renderDashboard = renderDashboard;
window.restartGame = restartGame;
window.switchTab = switchTab;
window.switchScreen = switchScreen;
window.selectPosition = selectPosition;
window.selectNationality = selectNationality;
window.selectAcademy = selectAcademy;
window.updateRookieCardPreview = updateRookieCardPreview;
window.performSeasonAction = performSeasonAction;
window.handlePhaseAction = handlePhaseAction;
window.handleQuickSimSeason = handleQuickSimSeason;
window.simulateSeason = simulateSeason;
window.advanceSeasonPhase = advanceSeasonPhase;
window.onPlayBigMatchInteractive = onPlayBigMatchInteractive;
window.simulateFullSeasonDirectly = simulateFullSeasonDirectly;
window.simulateRemainingPhasesAndEndSeason = simulateRemainingPhasesAndEndSeason;
window.buyEquipment = buyEquipment;
window.toggleSubscription = toggleSubscription;
window.buyAsset = buyAsset;
window.openTransferMarketModal = openTransferMarketModal;
window.closeTransferModal = closeTransferModal;
window.acceptTransfer = acceptTransfer;
window.selectPostRetirementPath = selectPostRetirementPath;
window.triggerRetirement = triggerRetirement;
window.signSponsorship = signSponsorship;
window.hireAgent = hireAgent;
window.getPlayer = getPlayer;
// --- New functions ---
window.playMatchday = playMatchday;
window.quickSimNext5Matches = quickSimNext5Matches;
window.setTactic = setTactic;
window.bindTacticButtons = bindTacticButtons;
window.autoSave = autoSave;

export function bindSeasonActionButtons() {
  // 1. Nút Ra Sân Thi Đấu Trực Tiếp (Match Arena 90 phút)
  const btnPlay = document.getElementById('btnPlayMatchInteractive');
  if (btnPlay) {
    btnPlay.onclick = (e) => {
      e.preventDefault();
      playMatchday(false);
    };
  }

  // 2. Nút Mô Phỏng Nhanh Trận Hiện Tại (Quick Sim)
  const btnQuick = document.getElementById('btnQuickSimMatch');
  if (btnQuick) {
    btnQuick.onclick = (e) => {
      e.preventDefault();
      playMatchday(true);
    };
  }

  // 3. Nút Mô Phỏng Nhanh 5 Vòng Tiếp Theo
  const btnQuick5 = document.getElementById('btnQuickSim5Matches');
  if (btnQuick5) {
    btnQuick5.onclick = (e) => {
      e.preventDefault();
      quickSimNext5Matches();
    };
  }

  // 4. Chuẩn bị trước trận: Dưỡng sức, Soi băng hình, Khởi động & Tập chuyên sâu
  document.querySelectorAll('.btn-prep').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      const prepType = btn.dataset.prep || (
        btn.id === 'btnPrepRest' ? 'REST' :
          btn.id === 'btnPrepVideo' ? 'VIDEO_ANALYSIS' :
            btn.id === 'btnPrepTrain' ? 'LIGHT_TRAIN' :
              btn.id === 'btnPrepIntense' ? 'INTENSE_DRILL' : null
      );
      if (prepType) {
        setPreMatchPrep(prepType);
      }
    };
  });

  // 5. Nút Phục hồi chấn thương (Rehab)
  const btnRehab = document.getElementById('btnActionRehab');
  if (btnRehab) {
    btnRehab.onclick = (e) => {
      e.preventDefault();
      const p = getPlayer();
      if (p.injury && p.injury.isInjured) {
        p.injury.phasesRemaining = Math.max(0, p.injury.phasesRemaining - 1);
        p.stam = Math.min(100, (p.stam || 60) + 15);
        if (p.injury.phasesRemaining <= 0) {
          p.injury.isInjured = false;
          p.injury.name = null;
          p.injuryCooldown = 3;
          showToast('✨ Hoàn toàn phục hồi chấn thương!', 'success');
          addLog(p, 'PHỤC HỒI HOÀN TOÀN', 'Sau quá trình tích cực điều trị, bạn đã hoàn toàn bình phục!', 'normal');
        } else {
          showToast(`🩹 Phục hồi tích cực! Còn ${p.injury.phasesRemaining} trận nữa.`, 'success');
        }
        autoSave(p);
        updateUI(p);
      }
    };
  }

  // 6. Sub-tabs trên cột phụ Matchday (Vua Phá Lưới & Lịch Đấu & Nhánh Cúp)
  const btnScorers = document.getElementById('btnTabTopScorers');
  if (btnScorers) {
    btnScorers.onclick = (e) => {
      e.preventDefault();
      window.switchMatchdaySideTab && window.switchMatchdaySideTab('scorers');
    };
  }
  const btnFixtures = document.getElementById('btnTabFixturesList');
  if (btnFixtures) {
    btnFixtures.onclick = (e) => {
      e.preventDefault();
      window.switchMatchdaySideTab && window.switchMatchdaySideTab('fixtures');
    };
  }
  const btnBrackets = document.getElementById('btnTabBrackets');
  if (btnBrackets) {
    btnBrackets.onclick = (e) => {
      e.preventDefault();
      window.switchMatchdaySideTab && window.switchMatchdaySideTab('brackets');
    };
  }

  // 7. Thị Trường Chuyển Nhượng & Bắt Đầu
  const btnTransfer = document.getElementById('btnOpenTransferMarket');
  if (btnTransfer) {
    btnTransfer.onclick = (e) => {
      e.preventDefault();
      openTransferMarketModal();
    };
  }

  const btnStartCandidates = [
    document.getElementById('btnConfirmCreatePlayer'),
    document.getElementById('btnStartCareer'),
    document.getElementById('btnStartNewCareer'),
    document.getElementById('btnNewGame')
  ].filter(Boolean);

  btnStartCandidates.forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      confirmAndStartCareer();
    };
  });

  // 8. Nút Tổng Kết Mùa Giải & Lễ Trao Giải
  const btnSeasonAwards = document.getElementById('btn-season-end-awards') || document.getElementById('btnFinishSeasonAndRollover');
  if (btnSeasonAwards) {
    btnSeasonAwards.onclick = (e) => {
      e.preventDefault();
      openSeasonAwardsModal();
    };
  }


  const btnOpenSlots = document.getElementById('btnOpenSaveSlotsModal');
  if (btnOpenSlots) {
    btnOpenSlots.onclick = (e) => {
      e.preventDefault();
      openSaveSlotsModal();
    };
  }

  const btnShowSlots = document.getElementById('btnShowSlotsList');
  if (btnShowSlots) {
    btnShowSlots.onclick = (e) => {
      e.preventDefault();
      openSaveSlotsModal();
    };
  }

  bindHeaderLogoNewCareer();
}

/**
 * Xử lý khi click vào Header Logo / Nút New Career:
 * 1. Hiện confirm: "Bạn có chắc muốn tạo cầu thủ mới? Tiến trình hiện tại đã được tự động lưu vào save slot."
 * 2. Lưu lại tiến trình nếu đang có cầu thủ hoạt động.
 * 3. Ẩn màn hình dashboard game chính (#game-screen / #main-dashboard).
 * 4. Hiển thị lại màn hình tạo nhân vật ban đầu (#create-character-screen / #academy-selection-modal / #screenSetup).
 * 5. Reset lại các trường nhập liệu về mặc định ban đầu.
 */
export function handleHeaderNewCareerClick() {
  const confirmFn = (typeof window !== 'undefined' && window.confirm) ? window.confirm.bind(window) : () => true;
  const confirmed = confirmFn("Bạn có chắc muốn tạo cầu thủ mới? Tiến trình hiện tại đã được tự động lưu vào save slot.");
  if (!confirmed) {
    return false;
  }

  // 1. Tự động lưu tiến trình hiện tại nếu đã bắt đầu chơi
  const currentPlayer = getPlayer();
  if (currentPlayer && (currentPlayer.name || currentPlayer.totalCareerMatches > 0)) {
    try {
      autoSave(currentPlayer);
    } catch (err) {
      console.warn('[Header New Career] Auto-save before new career warning:', err);
    }
  }

  // 1.1 Tự động chọn slot trống đầu tiên (1 -> 5)
  const bestSlot = getFirstAvailableSlot();
  setCurrentSaveSlot(bestSlot);

  // 2. Ẩn màn hình dashboard game chính
  const dashboardSelectors = [
    '#screenDashboard',
    '#mainDashboard',
    '#screenMain',
    '#game-screen',
    '#main-dashboard'
  ];
  dashboardSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.remove('active');
      el.classList.add('hidden');
      el.style.display = 'none';
    });
  });

  // 3. Hiển thị lại màn hình tạo nhân vật ban đầu
  const creationScreenSelectors = [
    '#screenSetup',
    '#characterCreationScreen',
    '#screenCreate',
    '#create-character-screen',
    '#academy-selection-modal'
  ];
  creationScreenSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.classList.remove('hidden');
      el.classList.add('active');
      el.style.display = 'flex';
    });
  });

  switchScreen('screenSetup');

  // 4. Reset lại các trường nhập liệu (tên, vị trí, quốc tịch, câu lạc bộ lựa chọn)
  const nameInput = document.getElementById('inputPlayerName') ||
    document.getElementById('playerName') ||
    document.querySelector('input[name="playerName"]');
  if (nameInput) {
    nameInput.value = "";
    nameInput.placeholder = "Nhập họ và tên cầu thủ...";
  }

  selectNationality('VN');
  selectPosition('ST');
  selectAcademy('pvf_academy');
  updateRookieCardPreview({ name: "", natId: 'VN', pos: 'ST', academyId: 'pvf_academy' });

  // Đóng modal quản lý 5 save slots nếu đang mở
  closeSaveSlotsModal();

  // Cập nhật lại thanh chọn save slot và các nút khởi đầu
  renderSaveSlotsSelectorBar();
  updateStartScreenButtons();

  if (typeof window !== 'undefined' && window.scrollTo) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showToast('✨ Sẵn sàng tạo sự nghiệp mới! Hãy nhập tên, chọn vị trí và lò đào tạo.', 'info');
  return true;
}

export function bindHeaderLogoNewCareer() {
  const logoArea = document.getElementById('headerLogoArea') || document.querySelector('.logo-area');
  if (logoArea) {
    logoArea.style.cursor = 'pointer';
    logoArea.style.userSelect = 'none';
    logoArea.title = 'Tạo cầu thủ mới / Bắt đầu sự nghiệp mới';
    if (typeof logoArea.setAttribute === 'function') {
      logoArea.setAttribute('title', 'Tạo cầu thủ mới / Bắt đầu sự nghiệp mới');
    }
    logoArea.onclick = (e) => {
      e.preventDefault();
      handleHeaderNewCareerClick();
    };
  }

  const badgeBtn = document.getElementById('btnHeaderNewCareerBadge');
  if (badgeBtn) {
    badgeBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      handleHeaderNewCareerClick();
    };
  }
}

function initApp() {
  bindSeasonActionButtons();
  bindTacticButtons();
  bindHeaderLogoNewCareer();

  renderNationalityOptions(NATIONALITIES_DATA, gameState.selectedNatId || "VN", (natId) => {
    selectNationality(natId);
  });

  renderPositionOptions(gameState.selectedPos || "ST", (posId) => {
    selectPosition(posId);
  });

  renderAcademyOptions(YOUTH_ACADEMIES, gameState.selectedAcademyId || "pvf_academy", (acadId) => {
    selectAcademy(acadId);
  });

  const inputName = document.getElementById('inputPlayerName');
  if (inputName && typeof inputName.addEventListener === 'function') {
    inputName.addEventListener('input', (e) => {
      updateRookieCardPreview({ name: e.target.value });
    });
  }

  // Khởi tạo hiển thị thẻ Tân Binh (Rookie Card)
  updateRookieCardPreview();

  // Render thẻ FCS sẵn sàng ngay từ ban đầu
  const player = getPlayer();
  if (player) {
    renderFcsUltimateCard(player);
  }

  // Tự động chọn slot trống đầu tiên (1 -> 5) cho người chơi mới
  const defaultSlot = getFirstAvailableSlot();
  setCurrentSaveSlot(defaultSlot);

  // Cập nhật trạng thái hiển thị và hành vi các nút 5 slots
  renderSaveSlotsSelectorBar();
  updateStartScreenButtons();
}

// Global window assignments for onclick handlers in HTML
window.filterCareerChronicle = filterCareerChronicle;
window.switchTab = switchTab;
window.newCareerWithSaveWarning = newCareerWithSaveWarning;
window.confirmAndStartCareer = confirmAndStartCareer;
window.executeCareerCreation = executeCareerCreation;
window.showOverwriteWarningModal = showOverwriteWarningModal;
window.closeOverwriteWarningModal = closeOverwriteWarningModal;
window.prepareNewCareer = prepareNewCareer;
window.getFirstAvailableSlot = getFirstAvailableSlot;
window.openSaveSlotsModal = openSaveSlotsModal;
window.closeSaveSlotsModal = closeSaveSlotsModal;
window.selectPosition = selectPosition;
window.selectNationality = selectNationality;
window.selectAcademy = selectAcademy;
window.renderNationalityOptions = renderNationalityOptions;
window.renderPositionOptions = renderPositionOptions;
window.renderAcademyOptions = renderAcademyOptions;
window.updateRookieCardPreview = updateRookieCardPreview;
window.handleHeaderNewCareerClick = handleHeaderNewCareerClick;
window.bindHeaderLogoNewCareer = bindHeaderLogoNewCareer;
window.openSeasonAwardsModal = openSeasonAwardsModal;
window.setTactic = setTactic;
window.setPreMatchPrep = setPreMatchPrep;


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}


