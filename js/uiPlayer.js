/* =========================================================================
   UI PLAYER — PLAYER CARD, BUFFS, RIVALRY, TROPHY SHOWCASE & CARD MODALS
   Extracted from ui.js
   ========================================================================= */
import { LIFESTYLE_CATALOG, SIGNATURE_TRAITS, SUB_STATS_CONFIG } from './data.js';
import { CARD_AVATARS, getAvatarById } from './cardAvatars.js';
import { CARD_THEMES, getThemeById, checkThemeUnlocked } from './cardThemes.js';
import { getPlayer } from './state.js';
import { ensurePlayerStats, calculateOVR, getFameTier, allocateSubStatPoint } from './playerEngine.js';
import { formatCurrency } from './uiCore.js';
/* =========================================================================
   4. ACTIVE BUFFS STRIP
   ========================================================================= */
export function renderActiveBuffsBar(player) {
  const container = document.getElementById('activeBuffsContainer');
  if (!container) return;
  container.innerHTML = '';

  const allActiveBuffs = [];

  player.equipment.forEach(id => {
    const item = LIFESTYLE_CATALOG.equipment.find(e => e.id === id);
    if (item) allActiveBuffs.push({ name: item.name, icon: item.icon, type: 'equip' });
  });

  player.subscriptions.forEach(id => {
    const sub = LIFESTYLE_CATALOG.subscriptions.find(s => s.id === id);
    if (sub) allActiveBuffs.push({ name: sub.name, icon: sub.icon, type: 'sub' });
  });

  player.assets.forEach(id => {
    const asset = LIFESTYLE_CATALOG.assets.find(a => a.id === id);
    if (asset) allActiveBuffs.push({ name: asset.name, icon: asset.icon, type: 'asset' });
  });

  if (allActiveBuffs.length === 0) {
    container.innerHTML = `<span style="font-size:0.75rem; color:var(--text-dim);">Chưa trang bị vật phẩm hoặc dịch vụ hỗ trợ nào.</span>`;
    return;
  }

  allActiveBuffs.forEach(b => {
    const pill = document.createElement('span');
    pill.className = `buff-pill ${b.type}`;
    pill.innerHTML = `${b.icon} ${b.name}`;
    container.appendChild(pill);
  });
}

/* =========================================================================
   5. RIVALRY WIDGET
   ========================================================================= */
export function renderRivalWidget(player) {
  const rivalCard = document.getElementById('rivalWidgetBox');
  if (!rivalCard || !player.rival) return;

  const rGoals = (player.rival.careerGoals || 0) + (player.rival.seasonGoals || 0);
  const rTrophies = player.rival.careerTrophies || 0;
  const rBallonDor = player.rival.careerBallonDor || player.rival.ballonDor || 0;

  rivalCard.innerHTML = `
    <div class="rival-header">
      <span style="font-size:1.4rem;">${player.rival.avatar}</span>
      <div>
        <div style="font-weight:900; color:#fff; font-size:0.95rem;">${player.rival.name} ${player.rival.flag}</div>
        <div style="font-size:0.75rem; color:var(--text-muted);">${player.rival.club} • OVR ${player.rival.rating}</div>
      </div>
    </div>
    <div class="rival-stats-grid">
      <div class="r-stat">
        <div class="r-val" style="color:var(--accent-green);">${rGoals}</div>
        <div class="r-lbl">Bàn Thắng</div>
      </div>
      <div class="r-stat">
        <div class="r-val" style="color:var(--accent-gold);">${rTrophies} 🏆</div>
        <div class="r-lbl">Danh Hiệu</div>
      </div>
      <div class="r-stat">
        <div class="r-val" style="color:var(--accent-blue);">${rBallonDor} 👑</div>
        <div class="r-lbl">Quả Bóng Vàng</div>
      </div>
    </div>
  `;
}

/* =========================================================================
   6. TROPHY SHOWCASE
   ========================================================================= */
export function renderTrophyShowcase(player) {
  const showcase = document.getElementById('trophyShowcaseList');
  if (!showcase) return;
  showcase.innerHTML = '';

  const trophyKeys = Object.keys(player.trophiesTally);

  if (trophyKeys.length === 0) {
    showcase.innerHTML = `<span style="font-size: 0.85rem; color: var(--text-dim);">Chưa có danh hiệu nào. Hãy nỗ lực thi đấu để nâng cúp!</span>`;
    return;
  }

  trophyKeys.forEach(tName => {
    const isBallonDor = tName.includes("Quả Bóng Vàng");
    const isScorer = tName.includes("Vua Phá Lưới") || tName.includes("Chiếc Giày Vàng");
    const isPlaymaker = tName.includes("Vua Kiến Tạo");
    const isMvp = tName.includes("Cầu Thủ Xuất Sắc Nhất") || tName.includes("Best Player") || tName.includes("Player of the Season") || tName.includes("MVP");
    const isAward = isBallonDor || isScorer || isPlaymaker || isMvp || tName.includes("FIFA The Best") || tName.includes("Găng Tay Vàng");
    const icon = isBallonDor ? '👑' : (isMvp ? '🏅' : (isScorer ? '👟' : (isPlaymaker ? '🎯' : (isAward ? '🌟' : '🏆'))));
    const badge = document.createElement('div');
    badge.className = `trophy-badge ${isAward ? 'award-badge' : ''}`;
    badge.innerHTML = `${icon} ${tName} <strong style="color:#fff;">x${player.trophiesTally[tName]}</strong>`;
    showcase.appendChild(badge);
  });
}

/* =========================================================================
   6b. FCS ULTIMATE CARD (FC-26 STYLE ULTIMATE TEAM PLAYER CARD)
   ========================================================================= */

export function renderFcsUltimateCard(player = getPlayer()) {
  if (!player) player = getPlayer();
  if (!player) return;

  const cardEl = document.getElementById('fcsCardContainer') || document.getElementById('fcsUltimateCard');
  if (!cardEl) return;

  // 1. Tính OVR tổng quát
  ensurePlayerStats(player);
  const ovr = calculateOVR(player);

  // 2. Lấy Theme mùa thẻ hiện tại
  const themeId = player.cardTheme || 'gold';
  const theme = getThemeById(themeId);

  // Cập nhật nhãn mùa thẻ trên header nếu có
  const editionBadgeEl = document.getElementById('fcsCurrentEditionBadge');
  if (editionBadgeEl) {
    editionBadgeEl.innerText = theme.editionBadge;
    editionBadgeEl.style.color = theme.colorAccent;
    editionBadgeEl.style.borderColor = theme.colorAccent;
  }

  // 3. Mapping vị trí chuẩn Ultimate Team: ST, CAM, CB, GK
  const posDisplay = {
    'FW': 'ST',
    'MF': 'CAM',
    'DF': 'CB',
    'GK': 'GK'
  }[player.position] || player.position || 'ST';

  // 4. Lấy 6 chỉ số Ultimate Team đọc trực tiếp từ player.stats (ĐỒNG BỘ 100% VỚI CỘT BÊN PHẢI)
  const pac = Math.floor(player.stats.pac !== undefined ? player.stats.pac : 50);
  const sho = Math.floor(player.stats.sho !== undefined ? player.stats.sho : 50);
  const pas = Math.floor(player.stats.pas !== undefined ? player.stats.pas : 50);
  const dri = Math.floor(player.stats.dri !== undefined ? player.stats.dri : 50);
  const def = Math.floor(player.stats.def !== undefined ? player.stats.def : 50);
  const phy = Math.floor(player.stats.phy !== undefined ? player.stats.phy : 50);

  // Thẻ EA FC gồm 2 cột x 3 hàng:
  // Cột trái: PAC (statsData[0]), SHO (statsData[2]), PAS (statsData[4])
  // Cột phải: DRI (statsData[1]), DEF (statsData[3]), PHY (statsData[5])
  const statsData = [
    { num: pac, lbl: 'PAC' }, { num: dri, lbl: 'DRI' },
    { num: sho, lbl: 'SHO' }, { num: def, lbl: 'DEF' },
    { num: pas, lbl: 'PAS' }, { num: phy, lbl: 'PHY' }
  ];


  // 5. Lấy Avatar Render (Ảnh cắt nền hoặc SVG vector)
  let avatarMarkup = '';
  if (player.customAvatarUrl && player.customAvatarUrl.trim()) {
    const safeUrl = player.customAvatarUrl.trim().replace(/"/g, '&quot;');
    const fallbackSvg = getAvatarById(player.cardAvatar || 'avatar_fade').svg;
    avatarMarkup = `<img src="${safeUrl}" alt="${player.name}" style="width:100%; height:100%; object-fit:contain;" onerror="this.onerror=null; this.parentElement.innerHTML='${fallbackSvg.replace(/'/g, "\\'")}';" />`;
  } else {
    const av = getAvatarById(player.cardAvatar || 'avatar_fade');
    avatarMarkup = av.svg;
  }

  // 6. Quốc tịch & CLB & Giải đấu
  const natFlag = player.nationality?.flag || '🌍';
  const clubIcon = player.isAcademyStage ? (player.academy?.icon || '🌱') : (player.currentClub?.icon || '🏟️');
  const leagueFlag = player.isAcademyStage ? '🌱' : (player.currentClub?.league?.flag || '🌍');

  // Gradient màu cho viền kim loại đôi SVG theo từng mùa thẻ
  const isFuture = theme.id === 'future' || theme.id === 'future_stars';
  let strokeColorMain = isFuture ? '#f43f5e' : '#fef08a';
  let strokeColorMid = isFuture ? '#ec4899' : '#eab308';
  let strokeColorEnd = isFuture ? '#38bdf8' : '#ca8a04';

  if (theme.id === 'ballon_dor') {
    strokeColorMain = '#ffd700';
    strokeColorMid = '#fffbeb';
    strokeColorEnd = '#d97706';
  } else if (theme.id === 'treble') {
    strokeColorMain = '#f8fafc';
    strokeColorMid = '#94a3b8';
    strokeColorEnd = '#38bdf8';
  } else if (theme.id === 'world_champion') {
    strokeColorMain = '#fbbf24';
    strokeColorMid = '#fef08a';
    strokeColorEnd = '#1d4ed8';
  } else if (theme.id === 'goat_immortal') {
    strokeColorMain = '#c084fc';
    strokeColorMid = '#f472b6';
    strokeColorEnd = '#38bdf8';
  } else if (theme.id === 'totw') {
    strokeColorMain = '#fef08a';
    strokeColorMid = '#eab308';
    strokeColorEnd = '#854d0e';
  } else if (theme.id === 'potm') {
    strokeColorMain = '#e9d5ff';
    strokeColorMid = '#a855f7';
    strokeColorEnd = '#6b21a8';
  } else if (theme.id === 'record_breaker') {
    strokeColorMain = '#fca5a5';
    strokeColorMid = '#dc2626';
    strokeColorEnd = '#2563eb';
  } else if (theme.id === 'ucl_common') {
    strokeColorMain = '#93c5fd';
    strokeColorMid = '#3b82f6';
    strokeColorEnd = '#1d4ed8';
  } else if (theme.id === 'heroes') {
    strokeColorMain = '#6ee7b7';
    strokeColorMid = '#10b981';
    strokeColorEnd = '#eab308';
  } else if (theme.id === 'icon') {
    strokeColorMain = '#ffd700';
    strokeColorMid = '#ffffff';
    strokeColorEnd = '#d4af37';
  } else if (theme.id === 'toty') {
    strokeColorMain = '#38bdf8';
    strokeColorMid = '#818cf8';
    strokeColorEnd = '#0284c7';
  }

  // 7. Dựng cấu trúc HTML thẻ FC 26
  cardEl.innerHTML = `
    <div class="fc26-card-outer theme-${theme.id} ${isFuture ? 'theme-future theme-future_stars' : ''}" id="fc26CardElement">
      <div class="fc26-card-inner">
        <!-- Viền vector kim loại đôi sắc nét theo dáng khiên 3 đỉnh -->
        <svg class="fc26-shield-svg" viewBox="0 0 256 386" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="shieldStroke_${theme.id}" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="${strokeColorMain}"/>
              <stop offset="30%" stop-color="${strokeColorMid}"/>
              <stop offset="70%" stop-color="${strokeColorEnd}"/>
              <stop offset="100%" stop-color="${strokeColorMain}"/>
            </linearGradient>
          </defs>
          <!-- Viền kim loại lớp ngoài -->
          <polygon points="46,0 90,13.5 128,3 166,13.5 210,0 256,27 256,293 215,341 128,386 41,341 0,293 0,27" 
            fill="none" stroke="url(#shieldStroke_${theme.id})" stroke-width="2.5" />
          <!-- Viền kim loại lớp trong song song (Double Rim Gold Lining) -->
          <polygon points="48,7 90,19 128,10 166,19 208,7 248,32 248,288 210,332 128,374 46,332 8,288 8,32" 
            fill="none" stroke="url(#shieldStroke_${theme.id})" stroke-width="1.2" opacity="0.8" />
        </svg>

        <!-- Hàng thân trên: OVR/POS cột trái & Chân dung cầu thủ bên phải -->
        <div class="fc26-top-row">
          <div class="fc26-left-badge">
            <div class="fc26-ovr">${ovr}</div>
            <div class="fc26-pos">${posDisplay}</div>
            <div class="fc26-meta-icons">
              <span class="fc26-icon-circle" title="${player.nationality?.name || 'Quốc gia'}">${natFlag}</span>
              <span class="fc26-icon-circle" title="${player.isAcademyStage ? (player.academy?.name || 'Học viện') : (player.currentClub?.name || 'CLB')}">${clubIcon}</span>
            </div>
          </div>

          <div class="fc26-portrait-glow"></div>
          <div class="fc26-portrait-box">
            ${avatarMarkup}
          </div>
        </div>

        <!-- Hàng thân dưới: Tên cầu thủ, vạch phân cách, 6 Stats Grid & Footer -->
        <div class="fc26-bottom-panel">
          <div class="fc26-name-ribbon">
            ${player.name}
          </div>

          <div class="fc26-divider">
            <span class="fc26-divider-line"></span>
            <span class="fc26-divider-crest">✦</span>
            <span class="fc26-divider-line"></span>
          </div>

          <div class="fc26-stats-grid">
            <div class="fc26-stat-col">
              <div class="fc26-stat-row"><span class="fc26-stat-num">${statsData[0].num}</span><span class="fc26-stat-label">${statsData[0].lbl}</span></div>
              <div class="fc26-stat-row"><span class="fc26-stat-num">${statsData[2].num}</span><span class="fc26-stat-label">${statsData[2].lbl}</span></div>
              <div class="fc26-stat-row"><span class="fc26-stat-num">${statsData[4].num}</span><span class="fc26-stat-label">${statsData[4].lbl}</span></div>
            </div>
            <div class="fc26-stats-v-divider"></div>
            <div class="fc26-stat-col">
              <div class="fc26-stat-row"><span class="fc26-stat-num">${statsData[1].num}</span><span class="fc26-stat-label">${statsData[1].lbl}</span></div>
              <div class="fc26-stat-row"><span class="fc26-stat-num">${statsData[3].num}</span><span class="fc26-stat-label">${statsData[3].lbl}</span></div>
              <div class="fc26-stat-row"><span class="fc26-stat-num">${statsData[5].num}</span><span class="fc26-stat-label">${statsData[5].lbl}</span></div>
            </div>
          </div>

          <div class="fc26-footer-row">
            <span class="fc26-footer-item" title="Quốc tịch">${natFlag}</span>
            <span class="fc26-footer-item" title="Câu lạc bộ">${clubIcon}</span>
            <span class="fc26-footer-item" title="Giải đấu / FCS">${leagueFlag}</span>
            <span class="fc26-badge-tag">${theme.editionBadge}</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // 8. Gắn sự kiện các nút điều khiển dưới chân khung thẻ
  const actionsEl = document.getElementById('fcsCardActions');
  if (actionsEl) {
    actionsEl.style.display = 'grid';

    const btnOpenTheme = document.getElementById('btnOpenThemeModal');
    const btnOpenAvatar = document.getElementById('btnOpenAvatarModal');
    const btnPng = document.getElementById('btnExportCardPng');
    const outerCardEl = document.getElementById('fc26CardElement');

    if (btnOpenTheme) {
      btnOpenTheme.onclick = (e) => {
        e.preventDefault();
        openCardThemeModal(player);
      };
    }
    if (btnOpenAvatar) {
      btnOpenAvatar.onclick = (e) => {
        e.preventDefault();
        openCardAvatarModal(player);
      };
    }
    if (btnPng) {
      btnPng.onclick = (e) => {
        e.preventDefault();
        exportFcsCardPng(outerCardEl || cardEl, player);
      };
    }
  }
}

/* =========================================================================
   HỆ THỐNG MODAL ĐỔI MÙA THẺ (CARD THEMES MODAL)
   ========================================================================= */

export function openCardThemeModal(player) {
  const modal = document.getElementById('cardThemeModal');
  if (!modal) return;
  modal.classList.add('active');

  const closeBtn = document.getElementById('btnCloseThemeModal');
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.remove('active');
  }

  // Đóng khi click ngoài overlay
  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove('active');
  };

  renderCardThemesList(player);
}

function renderCardThemesList(player) {
  const container = document.getElementById('cardThemesListContainer');
  if (!container) return;
  container.innerHTML = '';

  const curThemeId = player.cardTheme || 'gold';

  CARD_THEMES.forEach(theme => {
    const { isUnlocked, reason } = checkThemeUnlocked(theme.id, player);
    const isCurrent = theme.id === curThemeId;

    const itemEl = document.createElement('div');
    itemEl.className = `theme-card-option ${isCurrent ? 'active' : ''} ${!isUnlocked ? 'locked' : ''}`;

    itemEl.innerHTML = `
      <div>
        <div class="theme-option-header">
          <div class="theme-option-name" style="color:${theme.colorAccent};">${theme.nameVi} <span style="font-size:0.75rem; color:var(--text-muted);">(${theme.name})</span></div>
          <div class="theme-option-badge" style="background:${theme.tagColor};">${theme.editionBadge}</div>
        </div>
        <div style="font-size:0.72rem; color:${theme.colorAccent}; font-weight:700; margin:2px 0 6px 0;">${theme.subtitle}</div>
        <div class="theme-option-desc">${theme.desc}</div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <div class="theme-option-status ${isUnlocked ? 'status-unlocked' : 'status-locked'}">
          ${isUnlocked ? '✨ ' + reason : '🔒 ' + reason}
        </div>
        <button class="theme-btn-select ${isCurrent ? 'btn-secondary' : 'btn-primary'}" ${!isUnlocked || isCurrent ? 'disabled' : ''} style="${isCurrent ? 'opacity:0.8; cursor:default;' : ''}">
          ${isCurrent ? '✓ Đang Sử Dụng' : (isUnlocked ? 'Kích Hoạt Phôi Này' : 'Chưa Mở Khóa')}
        </button>
      </div>
    `;

    if (isUnlocked && !isCurrent) {
      const btn = itemEl.querySelector('.theme-btn-select');
      if (btn) {
        btn.onclick = () => {
          player.cardTheme = theme.id;
          renderFcsUltimateCard(player);
          renderCardThemesList(player);
          _showFcsToast(`🎨 Đã kích hoạt phôi thẻ: ${theme.nameVi}!`);
        };
      }
    }

    container.appendChild(itemEl);
  });
}

/* =========================================================================
   HỆ THỐNG MODAL ĐỔI ẢNH ĐẠI DIỆN CẦU THỦ (PLAYER AVATAR PICKER)
   ========================================================================= */

export function openCardAvatarModal(player) {
  const modal = document.getElementById('cardAvatarModal');
  if (!modal) return;
  modal.classList.add('active');

  const closeBtn = document.getElementById('btnCloseAvatarModal');
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.remove('active');
  }

  modal.onclick = (e) => {
    if (e.target === modal) modal.classList.remove('active');
  };

  const inputUrl = document.getElementById('inputCustomAvatarUrl');
  if (inputUrl) {
    inputUrl.value = player.customAvatarUrl || '';
  }

  const btnApply = document.getElementById('btnApplyCustomAvatar');
  if (btnApply) {
    btnApply.onclick = () => {
      const val = (inputUrl?.value || '').trim();
      if (!val) {
        alert('Vui lòng dán đường dẫn (URL) ảnh hợp lệ.');
        return;
      }
      player.customAvatarUrl = val;
      renderFcsUltimateCard(player);
      renderCardAvatarsList(player);
      _showFcsToast('✅ Đã áp dụng ảnh avatar tùy chọn!');
    };
  }

  const btnClear = document.getElementById('btnClearCustomAvatar');
  if (btnClear) {
    btnClear.onclick = () => {
      player.customAvatarUrl = '';
      if (inputUrl) inputUrl.value = '';
      renderFcsUltimateCard(player);
      renderCardAvatarsList(player);
      _showFcsToast('✅ Đã xóa URL và dùng avatar mặc định');
    };
  }

  renderCardAvatarsList(player);
}

function renderCardAvatarsList(player) {
  const container = document.getElementById('cardAvatarsListContainer');
  if (!container) return;
  container.innerHTML = '';

  const curAvatarId = player.cardAvatar || 'avatar_fade';
  const hasCustomUrl = !!(player.customAvatarUrl && player.customAvatarUrl.trim());

  CARD_AVATARS.forEach(av => {
    const isSelected = (!hasCustomUrl && av.id === curAvatarId);
    const cardEl = document.createElement('div');
    cardEl.className = `avatar-pick-card ${isSelected ? 'active' : ''}`;
    cardEl.title = av.desc;

    cardEl.innerHTML = `
      <div class="avatar-pick-thumb">
        ${av.svg}
      </div>
      <div class="avatar-pick-name">${av.name}</div>
      <div class="avatar-pick-style">${av.style}</div>
      ${isSelected ? `<span style="font-size:0.6rem; color:var(--accent-gold); font-weight:800; margin-top:2px;">● Đang Chọn</span>` : ''}
    `;

    cardEl.onclick = () => {
      player.cardAvatar = av.id;
      player.customAvatarUrl = '';
      const inputUrl = document.getElementById('inputCustomAvatarUrl');
      if (inputUrl) inputUrl.value = '';
      renderFcsUltimateCard(player);
      renderCardAvatarsList(player);
      _showFcsToast(`👤 Đã chọn avatar: ${av.name}`);
    };

    container.appendChild(cardEl);
  });
}

/* =========================================================================
   XUẤT THẺ RA ẢNH PNG BẰNG HTML2CANVAS
   ========================================================================= */

export async function exportFcsCardPng(cardEl, player) {
  if (typeof html2canvas === 'undefined') {
    alert('Thư viện html2canvas chưa tải xong. Vui lòng kiểm tra lại kết nối mạng.');
    return;
  }
  try {
    _showFcsToast('📸 Đang kết xuất ảnh thẻ FCS độ nét cao...');
    const targetElement = document.getElementById('fc26CardElement') || cardEl;
    const canvas = await html2canvas(targetElement, {
      backgroundColor: null,
      scale: 3,
      useCORS: true,
      logging: false
    });
    const link = document.createElement('a');
    const safeName = (player.name || 'player').replace(/\s+/g, '_');
    link.download = `FC26_Card_${safeName}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    _showFcsToast('✅ Đã tải xuống thẻ PNG thành công!');
  } catch (err) {
    console.error('[FCS Card Export] Lỗi:', err);
    alert('Có lỗi khi tạo ảnh thẻ. Hãy thử lại hoặc dùng trình duyệt hiện đại.');
  }
}

/* =========================================================================
   COPY TÓM TẮT SỰ NGHIỆP EMOJI
   ========================================================================= */

export function copyCareerSummaryText(player) {
  ensurePlayerStats(player);
  const ovr = calculateOVR(player);

  const trophies = Object.entries(player.trophiesTally || {})
    .map(([name, count]) => `🏆 ${name} x${count}`)
    .join(' | ');

  const posEmoji = { FW: '⚡', MF: '🔵', DF: '🛡️', GK: '🧤' }[player.position] || '⚽';
  const natFlag = player.nationality?.flag || '🌍';
  const clubName = player.isAcademyStage ? (player.academy?.name || 'Lò Đào Tạo') : (player.currentClub?.name || 'CLB');

  const lines = [
    `⚽ FOOTBALL CAREER SIMULATOR — SỰ NGHIỆP ${(player.name || '').toUpperCase()}`,
    ``,
    `${posEmoji} Vị trí: ${player.position} | ${natFlag} ${player.nationality?.name || ''}`,
    `🏟️ CLB: ${clubName} | 📅 Tuổi: ${player.age} | ⭐ OVR: ${ovr}`,
    `💰 Tài sản: $${((player.money || 0) / 1000000).toFixed(1)}M`,
    ``,
    `📊 THÀNH TÍCH SỰ NGHIỆP:`,
    `⚽ Bàn thắng: ${player.totalCareerGoals || player.careerStats?.goals || 0} | 🎯 Kiến tạo: ${player.totalCareerAssists || player.careerStats?.assists || 0}`,
    `🎽 Số trận: ${player.totalCareerMatches || player.careerStats?.matches || 0} | 🌍 ĐTQG: ${player.intlCaps || 0} caps / ${player.intlGoals || 0} bàn`,
    ``,
    trophies ? `🏆 DANH HIỆU: ${trophies}` : `🏆 Chưa có danh hiệu`,
    ``,
    `🎮 Chơi Football Career Simulator ngay!`
  ];

  const text = lines.join('\n');

  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      _showFcsToast('✅ Đã copy tóm tắt sự nghiệp!');
    }).catch(() => {
      _fallbackCopy(text);
    });
  } else {
    _fallbackCopy(text);
  }
}

function _fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  _showFcsToast('✅ Đã copy tóm tắt sự nghiệp!');
}

function _showFcsToast(msg) {
  const existing = document.querySelector('.fcs-copied-toast');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  const t = document.createElement('div');
  t.className = 'fcs-copied-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 2600);
}

/* =========================================================================
   HỆ THỐNG HIỂN THỊ CHÂN THUẬN, CHÂN NGHỊCH (WEAK FOOT) & KỸ THUẬT (SKILL MOVES)
   ========================================================================= */

function _renderWfStars(count) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= count 
      ? '<span class="star filled gold">★</span>' 
      : '<span class="star empty">☆</span>';
  }
  return html;
}

function _renderSmStars(count) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    html += i <= count 
      ? '<span class="star filled gold">★</span>' 
      : '<span class="star empty">☆</span>';
  }
  // Ngôi sao thứ 6 đặc biệt (Trickster+ Master)
  if (count >= 6) {
    html += '<span class="star filled trickster-star" title="Trickster+ 6th Star">★</span>';
  } else {
    html += '<span class="star empty trickster-empty" title="Khóa 6⭐ Trickster+ (Cần Thuê Chuyên Gia Freestyle)">☆</span>';
  }
  return html;
}

export function renderPlayerTraits(player = getPlayer(), onUpdate = null) {
  const container = document.getElementById('playerSpecialTraitsContainer');
  if (!container) return;

  const prefFoot = player.preferredFoot || 'Right';
  const wf = Math.min(5, Math.max(1, Number(player.weakFoot) || 3));
  const sm = Math.min(6, Math.max(1, Number(player.skillMoves) || 3));
  const wfProg = Number(player.weakFootTrainProgress) || 0;
  const smProg = Number(player.skillMovesTrainProgress) || 0;

  const isWfMax = wf >= 5;
  const isSmMax = sm >= 6;

  container.innerHTML = `
    <div class="traits-grid-3">
      <!-- 1. Chân Thuận (Preferred Foot) -->
      <div class="trait-card trait-card-foot" id="cardPrefFoot" title="Nhấp để chuyển đổi Chân Thuận (Phải / Trái)">
        <div class="trait-header">
          <span class="trait-icon">🦶</span>
          <span class="trait-title">Chân Thuận</span>
        </div>
        <div class="trait-value foot-val">
          <span class="foot-badge ${prefFoot === 'Left' ? 'foot-left' : 'foot-right'}" id="btnToggleFoot">
            ${prefFoot === 'Left' ? 'Trái (Left) 👟' : 'Phải (Right) 👟'}
          </span>
        </div>
        <div class="trait-subtext">${prefFoot === 'Left' ? 'Kèo trái khéo léo & xoáy hiểm' : 'Kèo phải uy lực & chính xác'}</div>
      </div>

      <!-- 2. Chân Nghịch (Weak Foot) -->
      <div class="trait-card trait-card-wf ${isWfMax ? 'wf-five-stars' : ''}" title="Chân không thuận (Độ hiểm & lực sút khi góc sút bất lợi)">
        <div class="trait-header">
          <span class="trait-icon">👟</span>
          <span class="trait-title">Chân Nghịch</span>
        </div>
        <div class="trait-value stars-val">
          <span class="stars-display">${_renderWfStars(wf)}</span>
          <span class="stars-counter">(${wf}/5)</span>
        </div>
        <div class="trait-subtext ${isWfMax ? 'golden-glow-text' : ''}">
          ${isWfMax ? '✨ Hai chân như một (100% Lực)' : (wf === 4 ? 'Rất thuần thục (-5% phạt)' : (wf === 3 ? 'Khá đồng đều (-10% phạt)' : 'Hạn chế (-25% lực/chính xác)'))}
        </div>
        ${!isWfMax ? `
          <button class="btn-trait-train" id="btnTrainWeakFoot" title="Luyện tập sút chân nghịch (-10% Thể lực)">
            🎯 Luyện Sút (${wfProg}/5)
          </button>
        ` : `
          <div class="trait-maxed-badge">MAX 5⭐ TOÀN DIỆN</div>
        `}
      </div>

      <!-- 3. Kỹ Thuật (Skill Moves) -->
      <div class="trait-card trait-card-sm ${sm === 6 ? 'sm-six-stars-trickster' : (sm === 5 ? 'sm-five-stars' : '')}" title="Kỹ thuật cá nhân (Tỷ lệ qua người 1v1 & Chiêu thức độc quyền)">
        <div class="trait-header">
          <span class="trait-icon">🪄</span>
          <span class="trait-title">Kỹ Thuật</span>
        </div>
        <div class="trait-value stars-val">
          <span class="stars-display">${_renderSmStars(sm)}</span>
          <span class="stars-counter">(${sm}/6)</span>
        </div>
        <div class="trait-subtext ${sm === 6 ? 'neon-purple-glow-text' : ''}">
          ${sm === 6 ? '🔮 6⭐ Trickster+ Tối Thượng' : (sm === 5 ? '5⭐ Ảo thuật gia (+15% rê)' : (sm === 4 ? '4⭐ Điêu luyện (+10% rê)' : 'Kỹ thuật cơ bản'))}
        </div>
        ${sm < 5 ? `
          <button class="btn-trait-train" id="btnTrainSkillMoves" title="Luyện tập đảo chân qua người (-10% Thể lực)">
            🪄 Luyện Kỹ Thuật (${smProg}/6)
          </button>
        ` : (sm === 5 ? `
          <div class="trait-upgrade-hint" title="Cần Thuê Chuyên Gia Kỹ Thuật Freestyle tại Cửa Hàng để đạt cảnh giới 6⭐">
            ⭐ Thuê Chuyên Gia (Cửa Hàng)
          </div>
        ` : `
          <div class="trait-maxed-badge trickster-badge">TRICKSTER+ 6⭐ MASTER</div>
        `)}
      </div>
    </div>
  `;

  // Gán sự kiện đổi chân thuận
  const btnFoot = container.querySelector('#btnToggleFoot');
  if (btnFoot) {
    btnFoot.onclick = () => {
      player.preferredFoot = player.preferredFoot === 'Left' ? 'Right' : 'Left';
      _showFcsToast(`🦶 Đã chuyển chân thuận thành: ${player.preferredFoot === 'Left' ? 'Kèo Trái (Left)' : 'Kèo Phải (Right)'}!`);
      renderPlayerTraits(player, onUpdate);
      if (typeof onUpdate === 'function') onUpdate(player);
    };
  }

  // Gán sự kiện tập chân nghịch
  const btnTrainWf = container.querySelector('#btnTrainWeakFoot');
  if (btnTrainWf) {
    btnTrainWf.onclick = () => {
      const curStam = player.stam !== undefined ? player.stam : (player.stamina || 80);
      if (curStam < 10) {
        _showFcsToast('⚠️ Bạn quá kiệt sức! Cần ít nhất 10% thể lực để luyện chân nghịch.');
        return;
      }
      player.stam = Math.max(5, curStam - 10);
      player.stamina = player.stam;
      player.weakFootTrainProgress = (player.weakFootTrainProgress || 0) + 1;

      if (player.weakFootTrainProgress >= 5) {
        player.weakFoot = Math.min(5, (Number(player.weakFoot) || 3) + 1);
        player.weakFootTrainProgress = 0;
        _showFcsToast(`👟 ĐỈNH CAO! Kỹ năng Chân Nghịch đã thăng cấp lên ${player.weakFoot}⭐!`);
      } else {
        _showFcsToast(`🎯 Hoàn thành buổi tập sút chân không thuận (${player.weakFootTrainProgress}/5) (-10 Stam)`);
      }

      renderPlayerTraits(player, onUpdate);
      if (typeof onUpdate === 'function') onUpdate(player);
    };
  }

  // Gán sự kiện tập kỹ thuật Skill Moves
  const btnTrainSm = container.querySelector('#btnTrainSkillMoves');
  if (btnTrainSm) {
    btnTrainSm.onclick = () => {
      const curStam = player.stam !== undefined ? player.stam : (player.stamina || 80);
      if (curStam < 10) {
        _showFcsToast('⚠️ Bạn quá kiệt sức! Cần ít nhất 10% thể lực để tập luyện kỹ thuật.');
        return;
      }
      player.stam = Math.max(5, curStam - 10);
      player.stamina = player.stam;
      player.skillMovesTrainProgress = (player.skillMovesTrainProgress || 0) + 1;

      if (player.skillMovesTrainProgress >= 6) {
        player.skillMoves = Math.min(5, (Number(player.skillMoves) || 3) + 1);
        player.skillMovesTrainProgress = 0;
        _showFcsToast(`🪄 TUYỆT KỸ! Kỹ năng Kỹ Thuật (Skill Moves) thăng cấp lên ${player.skillMoves}⭐!`);
      } else {
        _showFcsToast(`🪄 Hoàn thành bài tập rê bóng và qua người (${player.skillMovesTrainProgress}/6) (-10 Stam)`);
      }

      renderPlayerTraits(player, onUpdate);
      if (typeof onUpdate === 'function') onUpdate(player);
    };
  }
}

/* =========================================================================
   HỆ THỐNG 29 CHỈ SỐ PHỤ CHUYÊN SÂU (EA FC DETAILED ATTRIBUTES ACCORDION)
   ========================================================================= */

let _isSubStatsAccordionInit = false;

export function renderSkillPointsBadge(player = getPlayer()) {
  const spValEl = document.getElementById('spCountValue');
  const badgeEl = document.getElementById('spTrackerBadge');
  if (!spValEl || !badgeEl) return;
  const sp = Math.max(0, Number(player?.skillPoints) || 0);
  spValEl.innerText = sp;
  badgeEl.classList.toggle('has-sp', sp > 0);
}

export function renderDetailedSubStats(player = getPlayer()) {
  if (!player || !player.subStats) return;

  renderSkillPointsBadge(player);

  const sp = Math.max(0, Number(player.skillPoints) || 0);
  const statGroups = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];

  statGroups.forEach(groupKey => {
    const panel = document.getElementById(`panelSubStats_${groupKey}`);
    if (!panel) return;

    const groupConf = SUB_STATS_CONFIG ? SUB_STATS_CONFIG[groupKey] : null;
    if (!groupConf) return;

    let html = '<div class="substats-grid-inner">';
    groupConf.stats.forEach(s => {
      const val = Math.max(1, Math.min(99, Math.round(Number(player.subStats[s.key]) || 50)));
      const canAdd = sp > 0 && val < 99;

      let badgeClass = 'score-red';
      let fillClass = 'fill-red';
      if (val >= 90) {
        badgeClass = 'score-gold';
        fillClass = 'fill-gold';
      } else if (val >= 80) {
        badgeClass = 'score-green';
        fillClass = 'fill-green';
      } else if (val >= 70) {
        badgeClass = 'score-blue';
        fillClass = 'fill-blue';
      } else if (val >= 60) {
        badgeClass = 'score-orange';
        fillClass = 'fill-orange';
      }

      html += `
        <div class="substat-card-item">
          <div class="substat-card-row">
            <span class="substat-label-vi">
              ${s.nameVi} <span class="substat-label-en">(${s.nameEn})</span>
            </span>
            <div class="substat-actions-row">
              <span class="substat-score ${badgeClass}" id="substatVal_${s.key}">${val}</span>
              <button class="btn-substat-plus ${canAdd ? 'can-add' : 'disabled'}"
                      id="btnSubStatPlus_${s.key}"
                      data-substat-key="${s.key}"
                      type="button"
                      ${!canAdd ? 'disabled' : ''}
                      title="${canAdd ? `Cộng 1 SP vào ${s.nameVi} (${val} ➔ ${val + 1})` : (val >= 99 ? 'Đã đạt tối đa 99' : 'Cần Điểm Tiềm Năng (SP) để nâng cấp')}">
                +
              </button>
            </div>
          </div>
          <div class="substat-bar-mini-bg">
            <div class="substat-bar-mini-fill ${fillClass}" id="substatBar_${s.key}" style="width: ${val}%;"></div>
          </div>
        </div>
      `;
    });
    html += '</div>';

    panel.innerHTML = html;

    // Gắn sự kiện click cho các nút cộng điểm [+]
    const plusButtons = panel.querySelectorAll('.btn-substat-plus');
    plusButtons.forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const key = btn.getAttribute('data-substat-key');
        if (!key) return;

        const res = allocateSubStatPoint(player, key, 1);
        if (res && res.success) {
          const sObj = groupConf.stats.find(item => item.key === key);
          const sName = sObj ? sObj.nameVi : key;
          _showFcsToast(`⚡ +1 ${sName} (${res.newSubStatVal})! Còn ${res.skillPointsRemaining} SP.`);

          // Render lại toàn bộ subStats mà vẫn giữ nguyên trạng thái mở của panel
          renderDetailedSubStats(player);

          // Cập nhật thẻ cầu thủ và Face Stats trên Dashboard theo thời gian thực
          if (typeof window !== 'undefined' && typeof window.updateUI === 'function') {
            window.updateUI(player);
          }
        } else if (res && res.reason) {
          _showFcsToast(`⚠️ ${res.reason}`);
        }
      };
    });
  });

  initSubStatsAccordionListeners();
}

export function initSubStatsAccordionListeners() {
  if (_isSubStatsAccordionInit) return;
  _isSubStatsAccordionInit = true;

  const statGroups = [
    { key: 'pac', rowId: 'rowStatPac', arrowId: 'arrowStatPac', panelId: 'panelSubStats_pac' },
    { key: 'sho', rowId: 'rowStatSho', arrowId: 'arrowStatSho', panelId: 'panelSubStats_sho' },
    { key: 'pas', rowId: 'rowStatPas', arrowId: 'arrowStatPas', panelId: 'panelSubStats_pas' },
    { key: 'dri', rowId: 'rowStatDri', arrowId: 'arrowStatDri', panelId: 'panelSubStats_dri' },
    { key: 'def', rowId: 'rowStatDef', arrowId: 'arrowStatDef', panelId: 'panelSubStats_def' },
    { key: 'phy', rowId: 'rowStatPhy', arrowId: 'arrowStatPhy', panelId: 'panelSubStats_phy' }
  ];

  statGroups.forEach(g => {
    const rowEl = document.getElementById(g.rowId);
    if (!rowEl) return;

    rowEl.onclick = (e) => {
      e.stopPropagation();
      const panel = document.getElementById(g.panelId);
      const arrow = document.getElementById(g.arrowId);
      if (!panel) return;

      const isHidden = (panel.style.display === 'none') || (!panel.style.display && window.getComputedStyle(panel).display === 'none');
      panel.style.display = isHidden ? 'block' : 'none';
      if (arrow) {
        arrow.innerText = isHidden ? '▲' : '▼';
        arrow.classList.toggle('arrow-up', isHidden);
      }
      _updateMasterToggleButtonLabel();
    };
  });

  const masterBtn = document.getElementById('btnToggleAllSubStats');
  if (masterBtn) {
    masterBtn.onclick = () => {
      const anyClosed = statGroups.some(g => {
        const p = document.getElementById(g.panelId);
        return !p || (p.style.display === 'none') || (!p.style.display && window.getComputedStyle(p).display === 'none');
      });

      statGroups.forEach(g => {
        const panel = document.getElementById(g.panelId);
        const arrow = document.getElementById(g.arrowId);
        if (panel) panel.style.display = anyClosed ? 'block' : 'none';
        if (arrow) {
          arrow.innerText = anyClosed ? '▲' : '▼';
          arrow.classList.toggle('arrow-up', anyClosed);
        }
      });

      masterBtn.innerText = anyClosed ? '▲ Thu Gọn 29 Chỉ Số' : '🔍 Xem Chi Tiết 29 Chỉ Số';
    };
  }
}

function _updateMasterToggleButtonLabel() {
  const masterBtn = document.getElementById('btnToggleAllSubStats');
  if (!masterBtn) return;
  const statGroups = ['pac', 'sho', 'pas', 'dri', 'def', 'phy'];
  const allOpen = statGroups.every(k => {
    const p = document.getElementById(`panelSubStats_${k}`);
    return p && p.style.display === 'block';
  });
  masterBtn.innerText = allOpen ? '▲ Thu Gọn 29 Chỉ Số' : '🔍 Xem Chi Tiết 29 Chỉ Số';
}


