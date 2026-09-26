/* =========================================================================
   UI TOURNAMENT — SUMMER TOURNAMENT MODAL & OVERWRITE WARNING MODAL
   Extracted from ui.js
   ========================================================================= */
import { formatCurrency } from './uiCore.js';
import { showToast } from './uiCore.js';
import { getPlayer } from './state.js';
export function renderSummerTournamentModal(player, onPlayInteractive, onQuickSim) {
  const modal = document.getElementById('summerTournamentModal');
  if (!modal) return;

  const tourney = player.summerTournament;
  if (!tourney) return;

  const badgeEl = document.getElementById('stModalBadge');
  const titleEl = document.getElementById('stModalTitle');
  const descEl = document.getElementById('stModalDesc');
  const clashContainer = document.getElementById('stMatchClashContainer');
  const standingsContainer = document.getElementById('stStandingsContainer');
  const actionsContainer = document.getElementById('stActionsContainer');

  if (badgeEl) badgeEl.innerText = `${tourney.icon || '🌍'} ${tourney.tourneyName.toUpperCase()}`;
  if (titleEl) titleEl.innerText = `${tourney.tourneyName} ${tourney.isFinished ? (tourney.wonTrophy ? '🏆 VÔ ĐỊCH!' : '🏁 KẾT THÚC') : '🏆'}`;

  const stageLabels = {
    'GROUP_STAGE': `Vòng Bảng (Trận ${tourney.currentMatchIndex + 1}/3)`,
    'QUARTER_FINAL': 'Vòng Tứ Kết (Knock-out)',
    'SEMI_FINAL': 'Vòng Bán Kết (Knock-out)',
    'FINAL': 'TRẬN CHUNG KẾT TRANH CÚP VÀNG',
    'FINISHED': 'Đã hoàn tất hành trình giải đấu'
  };

  if (descEl) {
    if (tourney.isFinished) {
      descEl.innerHTML = tourney.wonTrophy 
        ? `<strong style="color:var(--accent-gold); font-size:1rem;">🎉 CHÚC MỪNG! BẠN VÀ ĐTQG ĐÃ ĐOẠT CÚP VÔ ĐỊCH ${tourney.tourneyName}!</strong><br>Vinh quang bất diệt ghi danh vào lịch sử bóng đá dân tộc.`
        : `<span style="color:#ef4444;">Hành trình tại ${tourney.tourneyName} đã khép lại. Dù dừng bước nhưng toàn đội đã chiến đấu hết mình!</span>`;
    } else {
      descEl.innerText = `Giai đoạn: ${stageLabels[tourney.stage] || tourney.stage}. Giữ vững phong độ cao nhất để đưa màu cờ sắc áo lên đỉnh vinh quang!`;
    }
  }

  // 1. Clash Container
  if (clashContainer) {
    if (!tourney.isFinished && tourney.currentFixture) {
      const pMatch = tourney.currentFixture.playerMatch;
      clashContainer.innerHTML = `
        <div style="font-size:0.78rem; font-weight:800; color:var(--accent-gold); text-transform:uppercase; margin-bottom:8px;">
          ${tourney.currentFixture.stageName} • 🏟️ ${pMatch.stadium || 'Sân Vận Động Quốc Tế'}
        </div>
        <div style="display:flex; justify-content:space-around; align-items:center;">
          <div style="text-align:center; flex:1;">
            <div style="font-size:2.4rem;">${pMatch.homeClub.flag || pMatch.homeClub.icon || '🚩'}</div>
            <div style="font-weight:800; font-size:1.05rem; color:#fff; margin-top:4px;">${pMatch.homeClub.name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Sức mạnh: ${pMatch.homeClub.power || 82}</div>
          </div>
          <div style="font-size:1.3rem; font-weight:900; color:var(--accent-gold); padding:0 12px;">VS</div>
          <div style="text-align:center; flex:1;">
            <div style="font-size:2.4rem;">${pMatch.awayClub.flag || pMatch.awayClub.icon || '🚩'}</div>
            <div style="font-weight:800; font-size:1.05rem; color:#fff; margin-top:4px;">${pMatch.awayClub.name}</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Sức mạnh: ${pMatch.awayClub.power || 80}</div>
          </div>
        </div>
      `;
    } else {
      clashContainer.innerHTML = `
        <div style="padding:15px; text-align:center;">
          <div style="font-size:3rem; margin-bottom:8px;">${tourney.wonTrophy ? '🏆' : '🎖️'}</div>
          <div style="font-size:1.15rem; font-weight:800; color:#fff;">
            ${tourney.wonTrophy ? 'Nhà Vô Địch Mùa Hè Rực Rỡ!' : 'Hành Trình Mùa Hè Đã Khép Lại'}
          </div>
          <div style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">
            Số lần khoác áo ĐTQG: ${player.intlCaps || 0} trận • ${player.intlGoals || 0} bàn thắng
          </div>
        </div>
      `;
    }
  }

  // 2. Standings Container
  if (standingsContainer) {
    if (tourney.stage === 'GROUP_STAGE' || tourney.groupTable) {
      let rows = (tourney.groupTable || []).map((t, idx) => `
        <tr style="border-bottom:1px solid rgba(255,255,255,0.06); ${t.isPlayer ? 'background:rgba(245,158,11,0.12); font-weight:800;' : ''}">
          <td style="padding:6px 8px; text-align:center;">${idx + 1}</td>
          <td style="padding:6px 8px; text-align:left;">${t.flag || t.icon || '🚩'} ${t.name} ${t.isPlayer ? '⭐' : ''}</td>
          <td style="padding:6px 8px; text-align:center;">${t.played}</td>
          <td style="padding:6px 8px; text-align:center;">${t.won}</td>
          <td style="padding:6px 8px; text-align:center;">${t.drawn}</td>
          <td style="padding:6px 8px; text-align:center;">${t.lost}</td>
          <td style="padding:6px 8px; text-align:center;">${t.gf}-${t.ga}</td>
          <td style="padding:6px 8px; text-align:center; font-weight:800; color:var(--accent-gold);">${t.points}</td>
        </tr>
      `).join('');

      standingsContainer.innerHTML = `
        <table style="width:100%; font-size:0.78rem; border-collapse:collapse; background:rgba(0,0,0,0.25); border-radius:8px; overflow:hidden;">
          <thead>
            <tr style="background:rgba(255,255,255,0.08); color:var(--text-muted); text-align:center;">
              <th style="padding:6px;">#</th>
              <th style="padding:6px; text-align:left;">Đội Tuyển</th>
              <th style="padding:6px;">Trận</th>
              <th style="padding:6px;">T</th>
              <th style="padding:6px;">H</th>
              <th style="padding:6px;">B</th>
              <th style="padding:6px;">BT/BB</th>
              <th style="padding:6px;">Điểm</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
      `;
    }
  }

  // 3. Actions Container
  if (actionsContainer) {
    if (!tourney.isFinished) {
      actionsContainer.innerHTML = `
        <button class="btn btn-primary" id="btnPlaySummerMatchInteractive" style="padding: 11px 22px; font-weight: 800;">
          ⚔️ Ra Sân Đá Trực Tiếp
        </button>
        <button class="btn btn-secondary" id="btnQuickSimSummerMatch" style="padding: 11px 20px; font-weight: 800;">
          ⚡ Mô Phỏng Nhanh
        </button>
      `;
      const btnPlay = document.getElementById('btnPlaySummerMatchInteractive');
      const btnSim = document.getElementById('btnQuickSimSummerMatch');
      if (btnPlay) btnPlay.onclick = () => {
        if (onPlayInteractive) onPlayInteractive();
      };
      if (btnSim) btnSim.onclick = () => {
        if (onQuickSim) onQuickSim();
      };
    } else {
      actionsContainer.innerHTML = `
        <button class="btn btn-primary" id="btnFinishSummerTournament" style="padding: 12px 28px; font-weight: 800; font-size:0.95rem;">
          🎉 Hoàn Tất Mùa Hè &amp; Tổng Kết Mùa Giải
        </button>
      `;
      const btnDone = document.getElementById('btnFinishSummerTournament');
      if (btnDone) btnDone.onclick = () => {
        closeSummerTournamentModal();
        if (window.onSummerTournamentCompleted) {
          window.onSummerTournamentCompleted();
        }
      };
    }
  }

  modal.classList.add('active');
}

export function closeSummerTournamentModal() {
  const modal = document.getElementById('summerTournamentModal');
  if (modal) modal.classList.remove('active');
}
if (typeof window !== 'undefined') {
  window.closeSummerTournamentModal = closeSummerTournamentModal;
}

/**
 * Hiển thị Modal Cảnh Báo Ghi Đè Sự Nghiệp khi người chơi bấm ký hợp đồng vào một slot đã có dữ liệu.
 * @param {object} slotInfo - Thông tin chi tiết slot từ getSaveSlotsInfo()
 * @param {Function} onConfirm - Callback khi người chơi nhấn "Xác nhận ghi đè & Bắt đầu"
 * @param {Function} [onCancel] - Callback khi người chơi nhấn "Hủy bỏ / Chọn slot khác"
 */
export function showOverwriteWarningModal(slotInfo, onConfirm, onCancel) {
  const modal = document.getElementById('modalOverwriteWarning');
  if (!modal) {
    // Fallback an toàn nếu modal chưa gắn trong DOM
    const confirmed = (typeof window !== 'undefined' && window.confirm)
      ? window.confirm(`⚠️ CẢNH BÁO GHI ĐÈ: Slot ${slotInfo.slotId} đang có dữ liệu sự nghiệp của ${slotInfo.name} (${slotInfo.club}).\n\nHành động này sẽ XÓA VĨNH VIỄN sự nghiệp cũ trên Slot ${slotInfo.slotId} và không thể hoàn tác. Bạn có chắc chắn muốn ghi đè?`)
      : true;
    if (confirmed) {
      if (typeof onConfirm === 'function') onConfirm();
    } else {
      if (typeof onCancel === 'function') onCancel();
    }
    return;
  }

  // Cập nhật thông tin vào modal
  const slotNumEl = document.getElementById('overwriteSlotNumText');
  if (slotNumEl) slotNumEl.textContent = `Slot ${slotInfo.slotId}`;

  const nameEl = document.getElementById('overwriteOldName');
  if (nameEl) nameEl.textContent = slotInfo.name || 'Không rõ';

  const clubEl = document.getElementById('overwriteOldClub');
  if (clubEl) clubEl.textContent = slotInfo.club || '---';

  const ageEl = document.getElementById('overwriteOldAge');
  if (ageEl) ageEl.textContent = slotInfo.age ? `${slotInfo.age} tuổi` : '16 tuổi';

  const seasonEl = document.getElementById('overwriteOldSeason');
  if (seasonEl) seasonEl.textContent = slotInfo.season || 'Mùa 1';

  const savedAtEl = document.getElementById('overwriteOldSavedAt');
  if (savedAtEl) savedAtEl.textContent = slotInfo.savedAt || 'Không rõ ngày';

  // Handler hủy bỏ
  const handleCancel = () => {
    closeOverwriteWarningModal();
    if (typeof onCancel === 'function') onCancel();
  };

  // Handler xác nhận ghi đè
  const handleConfirm = () => {
    closeOverwriteWarningModal();
    if (typeof onConfirm === 'function') onConfirm();
  };

  const btnCancel = document.getElementById('btnCancelOverwrite');
  if (btnCancel) {
    btnCancel.onclick = (e) => {
      e.preventDefault();
      handleCancel();
    };
  }

  const btnCancelX = document.getElementById('btnCancelOverwriteX');
  if (btnCancelX) {
    btnCancelX.onclick = (e) => {
      e.preventDefault();
      handleCancel();
    };
  }

  const btnConfirm = document.getElementById('btnConfirmOverwrite');
  if (btnConfirm) {
    btnConfirm.onclick = (e) => {
      e.preventDefault();
      handleConfirm();
    };
  }

  // Click vào vùng nền đen mờ ngoài modal để hủy
  modal.onclick = (e) => {
    if (e.target === modal) {
      handleCancel();
    }
  };

  modal.classList.add('active');
  modal.style.display = 'flex';
}

/**
 * Đóng Modal Cảnh Báo Ghi Đè Sự Nghiệp.
 */
export function closeOverwriteWarningModal() {
  const modal = document.getElementById('modalOverwriteWarning');
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

if (typeof window !== 'undefined') {
  window.showOverwriteWarningModal = showOverwriteWarningModal;
  window.closeOverwriteWarningModal = closeOverwriteWarningModal;
}


