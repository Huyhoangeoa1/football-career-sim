/* =========================================================================
   UI STATS — SIGNATURE TRAITS, GOLDEN SHOE & BALLON D'OR TRACKERS
   Extracted from ui.js
   ========================================================================= */
import { SIGNATURE_TRAITS, getGoldenShoeRankings, getBallonDorPowerRankings } from './data.js';
import { formatCurrency } from './uiCore.js';
import { getFameTier } from './playerEngine.js';
export function renderSignatureTraits(player) {
  const container = document.getElementById('traitsListContainer');
  const badgeEl = document.getElementById('traitsUnlockedCountBadge');
  if (!container) return;

  container.innerHTML = '';
  let unlockedCount = 0;

  SIGNATURE_TRAITS.forEach(trait => {
    const isUnlocked = trait.checkFn(player);
    if (isUnlocked) unlockedCount++;

    const card = document.createElement('div');
    card.className = `record-card ${isUnlocked ? 'broken' : ''}`;
    if (isUnlocked) {
      card.style.borderColor = "var(--accent-gold)";
      card.style.boxShadow = "0 0 16px rgba(245, 158, 11, 0.25)";
    }

    card.innerHTML = `
      <div class="record-header">
        <span class="record-icon">${trait.icon}</span>
        <span class="record-badge ${isUnlocked ? 'badge-broken' : 'badge-unbroken'}">
          ${isUnlocked ? '✅ ĐÃ KÍCH HOẠT' : '🔒 CHƯA ĐẠT'}
        </span>
      </div>
      <div class="record-title" style="color: ${isUnlocked ? 'var(--accent-gold)' : '#fff'}; font-size: 1.05rem;">
        ${trait.name}
      </div>
      <div class="record-desc" style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">
        ${trait.desc}
      </div>
      <div style="margin-top: 10px; padding: 8px 10px; background: rgba(0,0,0,0.3); border-radius: 6px; font-size: 0.8rem;">
        <div style="color: var(--accent-green); font-weight: 700;">⚡ Hiệu ứng: ${trait.buffDesc}</div>
        <div style="color: var(--text-muted); margin-top: 2px;">🎯 Yêu cầu: ${trait.progressText(player)}</div>
      </div>
    `;

    container.appendChild(card);
  });

  if (badgeEl) {
    badgeEl.innerText = `${unlockedCount}/${SIGNATURE_TRAITS.length} Tuyệt Kỹ Đã Mở Khóa`;
  }
}

/* =========================================================================
   15. LIVE INDIVIDUAL RIVALRY & GOLDEN SHOE / BALLON D'OR TRACKER
   ========================================================================= */
export function renderGoldenShoeTracker(player) {
  player = player || (typeof getPlayer === 'function' ? getPlayer() : window._player || window.player);
  if (!player) return;
  const shoeContainer = document.getElementById('liveGoldenShoeList');
  if (!shoeContainer) return;

  shoeContainer.innerHTML = '';
  const shoeList = (player.goldenShoeTracker && player.goldenShoeTracker.length > 0)
    ? player.goldenShoeTracker
    : (typeof getGoldenShoeRankings === 'function' ? getGoldenShoeRankings(player) : []);

  if (!shoeList || !Array.isArray(shoeList)) return;

  shoeList.slice(0, 5).forEach((item, idx) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.padding = '6px 8px';
    row.style.marginBottom = '4px';
    row.style.borderRadius = '6px';
    row.style.fontSize = '0.8rem';
    row.style.background = item.isPlayer ? 'rgba(245, 158, 11, 0.18)' : (item.isRival ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)');
    if (item.isPlayer) row.style.border = '1px solid rgba(245, 158, 11, 0.5)';
    
    row.innerHTML = `
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-weight:900; font-family:'JetBrains Mono',monospace; color:${idx === 0 ? 'var(--accent-gold)' : 'var(--text-muted)'}; width:16px;">#${idx+1}</span>
        <span style="font-weight:700; color:${item.isPlayer ? 'var(--accent-gold)' : '#fff'};">${item.name}</span>
        <span style="color:var(--text-dim); font-size:0.72rem;">(${item.club})</span>
      </div>
      <div style="font-weight:800; font-family:'JetBrains Mono',monospace; color:var(--accent-green);">
        ${item.goals} ⚽ <span style="color:var(--text-muted); font-size:0.72rem;">(${item.points} pts)</span>
      </div>
    `;
    shoeContainer.appendChild(row);
  });
}

export function renderBallonDorTracker(player) {
  player = player || (typeof getPlayer === 'function' ? getPlayer() : window._player || window.player);
  if (!player) return;
  const bdorContainer = document.getElementById('liveBallonDorList');
  if (!bdorContainer) return;

  bdorContainer.innerHTML = '';
  const bdorList = (player.ballonDorRankings && player.ballonDorRankings.length > 0)
    ? player.ballonDorRankings
    : (typeof getBallonDorPowerRankings === 'function' ? getBallonDorPowerRankings(player) : []);

  if (!bdorList || !Array.isArray(bdorList)) return;

  bdorList.slice(0, 5).forEach((item, idx) => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.justifyContent = 'space-between';
    row.style.alignItems = 'center';
    row.style.padding = '6px 8px';
    row.style.marginBottom = '4px';
    row.style.borderRadius = '6px';
    row.style.fontSize = '0.8rem';
    row.style.background = item.isPlayer ? 'rgba(168, 85, 247, 0.18)' : (item.isRival ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255, 255, 255, 0.03)');
    if (item.isPlayer) row.style.border = '1px solid rgba(168, 85, 247, 0.5)';
    
    row.innerHTML = `
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="font-weight:900; font-family:'JetBrains Mono',monospace; color:${idx === 0 ? 'var(--accent-gold)' : 'var(--text-muted)'}; width:16px;">#${idx+1}</span>
        <span style="font-weight:700; color:${item.isPlayer ? 'var(--accent-purple)' : '#fff'};">${item.name}</span>
        <span style="color:var(--text-dim); font-size:0.72rem;">(${item.club})</span>
      </div>
      <div style="font-weight:800; font-family:'JetBrains Mono',monospace; color:var(--accent-gold);">
        ${item.score} <span style="color:var(--text-muted); font-size:0.72rem;">pts</span>
      </div>
    `;
    bdorContainer.appendChild(row);
  });
}

export function renderLiveIndividualTracker(player) {
  renderGoldenShoeTracker(player);
  renderBallonDorTracker(player);
}

if (typeof window !== 'undefined') {
  window.renderSignatureTraits = renderSignatureTraits;
  window.renderGoldenShoeTracker = renderGoldenShoeTracker;
  window.renderBallonDorTracker = renderBallonDorTracker;
  window.renderLiveIndividualTracker = renderLiveIndividualTracker;
}


