/* =========================================================================
   UI CONTRACTS — AGENTS & BRAND SPONSORSHIPS TAB RENDERING
   Extracted from ui.js
   ========================================================================= */
import { SPONSORSHIPS_DATA, SPONSORSHIP_CATEGORIES, SPONSORSHIP_BRANDS, AGENTS_DATA } from './data.js';
import { formatCurrency, formatMoney, formatSalary, showToast } from './uiCore.js';
import { getPlayer } from './state.js';
import { getFameTier, generateSponsorshipOffers, getActiveSponsorshipStats } from './playerEngine.js';
export function renderContractsTab(player, onSignSponsor, onHireAgent) {
  if (!player) return;
  const agentsContainer = document.getElementById('agentsListContainer');
  const sponsorsContainer = document.getElementById('sponsorshipsListContainer');
  const activeAgentId = player.activeAgent || "agent_family";

  // ── PHẦN 0: THẺ HỢP ĐỒNG CLB HIỆN TẠI (CURRENT CLUB CONTRACT CARD) ───
  const clubContractContainer = document.getElementById('clubContractCardContainer');
  if (clubContractContainer) {
    const isAcademy = Boolean(player.isAcademyStage);
    const clubName = isAcademy ? (player.academy?.name || 'Học Viện Đào Tạo') : (player.currentClub?.name || 'Cầu Thủ Tự Do');
    const clubIcon = isAcademy ? (player.academy?.icon || '🌱') : (player.currentClub?.icon || '⚽');
    const clubFlag = isAcademy ? (player.academy?.flag || '🚩') : (player.currentClub?.league?.flag || '🚩');
    const leagueName = isAcademy ? `${player.academy?.country || ''} • Giải U19 Đào Tạo Trẻ` : (player.currentClub?.league?.name || 'Giải VĐQG');
    const roleText = player.squadRole === 'ROTATION' ? 'Xoay tua đội hình' : (player.squadRole === 'BENCH' ? 'Dự bị chiến lược' : 'Trụ cột đá chính (Key Player)');

    const pos = String(player.position || 'ST').toUpperCase();
    const pLine = (player.positionGroup || '').toUpperCase();
    const isAttacker = ['ST', 'CF', 'LW', 'RW'].includes(pos) || ['ATTACKER', 'FW'].includes(pLine);
    const isMidfielder = ['CAM', 'CM', 'CDM', 'LM', 'RM'].includes(pos) || ['MIDFIELDER', 'MF'].includes(pLine);

    let bonusDesc = '';
    if (isAttacker) {
      bonusDesc = '⚽ Bàn thắng: <strong>10% lương tuần</strong> • 🎯 Kiến tạo: <strong>5% lương tuần</strong>';
    } else if (isMidfielder) {
      bonusDesc = '🎯 Kiến tạo: <strong>10% lương tuần</strong> • ⚽ Bàn thắng: <strong>5% lương tuần</strong>';
    } else {
      bonusDesc = '🛡️ Giữ sạch lưới: <strong>10% lương tuần</strong>' + (pos === 'GK' ? ' • 🧤 Cứu thua: <strong>1% lương tuần/pha</strong>' : ' • ⚽/🎯 Ghi bàn/Kiến tạo: <strong>5% lương tuần</strong>');
    }

    clubContractContainer.innerHTML = `
      <div class="card" style="background: linear-gradient(135deg, rgba(30, 41, 59, 0.7), rgba(15, 23, 42, 0.9)); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 12px; padding: 18px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="font-size: 2.4rem; background: rgba(255,255,255,0.06); padding: 8px 12px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);">${clubIcon}</div>
            <div>
              <div style="font-size: 1.15rem; font-weight: 800; color: #fff; display: flex; align-items: center; gap: 8px;">
                ${clubName}
                <span style="font-size: 0.75rem; background: rgba(16, 185, 129, 0.2); color: var(--accent-green); padding: 2px 8px; border-radius: 4px; font-weight: 700;">HỢP ĐỒNG HIỆN TẠI</span>
              </div>
              <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 3px;">
                ${clubFlag} ${leagueName} • Vai trò: <span style="color: var(--accent-gold); font-weight: 700;">${roleText}</span>
              </div>
            </div>
          </div>
          <div style="text-align: right;">
            <div style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Đãi Ngộ Chính Thức</div>
            <div style="font-size: 1.4rem; font-weight: 900; color: var(--accent-green); font-family: 'JetBrains Mono', monospace; text-shadow: 0 0 12px rgba(16, 185, 129, 0.3);">
              ${formatSalary(player.salary)}
            </div>
            <div style="font-size: 0.75rem; color: #94a3b8; margin-top: 2px;">(Chi trả đều đặn sau mỗi vòng đấu)</div>
          </div>
        </div>

        <div style="margin-top: 14px; padding: 10px 14px; background: rgba(0,0,0,0.25); border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div style="font-size: 0.82rem; color: #cbd5e1;">
            🎁 <strong>Chế độ thưởng trận đấu (% Lương Tuần):</strong> ${bonusDesc}
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" onclick="if(window.openTransferMarketModal) window.openTransferMarketModal();" style="padding: 6px 12px; font-size: 0.8rem; font-weight: 700;">
              💼 Thị Trường Chuyển Nhượng
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // ── PHẦN 1: ĐẠI DIỆN CẦU THỦ (AGENTS) ───────────────────
  if (agentsContainer) {
    agentsContainer.innerHTML = '';
    AGENTS_DATA.forEach(agent => {
      const isCurrent = agent.id === activeAgentId;
      const canAfford = player.money >= agent.fee;
      const card = document.createElement('div');
      card.className = `lifestyle-card ${isCurrent ? 'active' : ''}`;
      if (isCurrent) {
        card.style.borderColor = "var(--accent-green)";
        card.style.boxShadow = "0 0 16px rgba(16, 185, 129, 0.25)";
      }

      card.innerHTML = `
        <div class="lifestyle-card-header">
          <div class="lifestyle-card-icon">${agent.icon}</div>
          <div class="lifestyle-card-title-wrap">
            <div class="lifestyle-card-title">${agent.name}</div>
            <div style="font-size:0.75rem; color:var(--accent-blue); font-weight:700;">Hạng: ${agent.tier}</div>
          </div>
        </div>
        <div class="lifestyle-card-desc">${agent.desc}</div>
        <div style="margin-top:8px; padding:6px 8px; background:rgba(0,0,0,0.3); border-radius:6px; font-size:0.78rem;">
          <div style="color:var(--accent-green); font-weight:700;">💼 Đàm phán lương: +${Math.round(agent.salaryBoost * 100)}%</div>
          <div style="color:var(--accent-gold); font-weight:700; margin-top:2px;">💰 Thưởng tài trợ: +${Math.round(agent.sponsorBoost * 100)}%</div>
        </div>
        <div class="lifestyle-card-footer" style="margin-top:10px;">
          <span class="lifestyle-card-price">${agent.fee === 0 ? 'Miễn phí' : formatMoney(agent.fee)}</span>
          <button class="btn ${isCurrent ? 'btn-secondary' : 'btn-primary'}" style="padding:6px 14px; font-size:0.8rem;" ${isCurrent ? 'disabled' : ''}>
            ${isCurrent ? '✅ Đang Đại Diện' : (canAfford ? 'Thuê Đại Diện' : 'Không Đủ Tiền')}
          </button>
        </div>
      `;

      if (!isCurrent) {
        const btn = card.querySelector('button');
        if (btn && canAfford && onHireAgent) {
          btn.onclick = () => onHireAgent(agent.id);
        }
      }
      agentsContainer.appendChild(card);
    });
  }

  // ── PHẦN 2: HỆ THỐNG TÀI TRỢ THƯƠNG MẠI ĐA TẦNG (COMMERCIAL SPONSORSHIPS) ────
  if (sponsorsContainer) {
    sponsorsContainer.innerHTML = '';

    const activeStats = getActiveSponsorshipStats(player);
    const offers = generateSponsorshipOffers(player);
    const fameTier = getFameTier(player.fame || 0);

    const wrapper = document.createElement('div');
    wrapper.className = 'sponsorship-system-wrapper';

    // ── KHU VỰC 1: HỢP ĐỒNG TÀI TRỢ HIỆU LỰC (ACTIVE DEALS) ─────────────────
    let activeDealsHtml = '';
    if (activeStats.activeDeals.length === 0) {
      activeDealsHtml = `
        <div class="active-deals-empty">
          <div style="font-size: 1.8rem; margin-bottom: 8px;">🤝</div>
          <div style="font-weight: 700; color: #fff; margin-bottom: 4px;">Hiện chưa có hợp đồng tài trợ nào đang hiệu lực</div>
          <div>Hãy khám phá danh sách đề nghị bên dưới và ký kết hợp đồng thương mại để nhận doanh thu thụ động hàng năm!</div>
        </div>
      `;
    } else {
      activeDealsHtml = activeStats.activeDeals.map(deal => {
        const isLifetime = deal.isLifetime || deal.durationYears === 'LIFETIME' || deal.yearsRemaining === 'LIFETIME';
        const durationBadge = isLifetime
          ? `<span class="badge-lifetime-shimmer">🌌 TRỌN ĐỜI / LIFETIME</span>`
          : `<span class="badge-duration">⏳ Còn ${deal.yearsRemaining} năm</span>`;

        return `
          <div class="active-deal-card ${isLifetime ? 'lifetime-card' : ''}">
            <div class="active-deal-header">
              <div class="active-deal-icon">${deal.icon || '🏷️'}</div>
              <div class="active-deal-info">
                <div class="active-deal-brand">${deal.name || deal.brand}</div>
                <div class="active-deal-category-badge">🏷️ ${deal.categoryName || deal.category}</div>
              </div>
              <div style="flex-shrink:0;">
                ${durationBadge}
              </div>
            </div>

            <div class="active-deal-payout">
              <span class="active-deal-payout-num">+${formatMoney(deal.annualPayout)}</span>
              <span class="active-deal-payout-sub">/năm (quyết toán đầu mùa)</span>
            </div>

            <div class="active-deal-perk">
              <span class="active-deal-perk-icon">✨</span>
              <span>${deal.perkBonus || 'Hợp đồng thương mại độc quyền'}</span>
            </div>
          </div>
        `;
      }).join('');
    }

    const activeSectionHtml = `
      <div class="sponsorship-active-section">
        <div class="sponsorship-summary-banner">
          <div class="sponsorship-summary-left">
            <div class="sponsorship-summary-title">
              <span>⭐ HỢP ĐỒNG TÀI TRỢ HIỆU LỰC (ACTIVE DEALS)</span>
              <span style="font-size:0.75rem; background:rgba(16,185,129,0.2); border:1px solid rgba(16,185,129,0.4); color:#34d399; padding:2px 8px; border-radius:20px; font-weight:800;">
                ${activeStats.count}/5 Danh Mục
              </span>
            </div>
            <div class="sponsorship-summary-subtitle">
              Mỗi danh mục tối đa 1 nhãn hàng độc quyền song song. Tiền tài trợ được quyết toán tự động vào đầu mỗi mùa giải mới.
            </div>
          </div>
          <div class="sponsorship-summary-right">
            <div class="sponsorship-income-label">TỔNG THU NHẬP THỤ ĐỘNG MỖI MÙA</div>
            <div class="sponsorship-income-value">+${formatMoney(activeStats.totalAnnualIncome)}<span class="sponsorship-income-unit">/mùa</span></div>
          </div>
        </div>

        <div class="active-deals-grid">
          ${activeDealsHtml}
        </div>
      </div>
    `;

    // ── KHU VỰC 2: LỜI MỜI TÀI TRỢ MỚI (SPONSORSHIP OFFERS) ─────────────────
    const offersSectionHtml = `
      <div class="sponsorship-offers-section" style="margin-top: 24px;">
        <div class="sponsorship-offers-header">
          <div class="sponsorship-offers-title-wrap">
            <div class="sponsorship-section-title">
              💼 LỜI MỜI TÀI TRỢ THƯƠNG MẠI MỚI (OFFERS)
            </div>
            <div class="sponsorship-player-tier-badge">
              Danh Vọng: ${fameTier.badge} <strong>${fameTier.title}</strong> (${(player.fame || 0).toLocaleString()} pts)
            </div>
          </div>

          <div class="sponsorship-category-filters" id="sponsorCategoryFilters">
            <button class="sponsor-filter-btn active" data-cat="ALL">Tất Cả (${offers.length})</button>
            <button class="sponsor-filter-btn" data-cat="BOOTS">👟 Giày & Trang Phục</button>
            <button class="sponsor-filter-btn" data-cat="BEVERAGE">⚡ Đồ Uống</button>
            <button class="sponsor-filter-btn" data-cat="LUXURY">💎 Xa Xỉ Phẩm</button>
            <button class="sponsor-filter-btn" data-cat="TECH_GAMING">🎮 Công Nghệ</button>
            <button class="sponsor-filter-btn" data-cat="GLOBAL_AMBASSADOR">✈️ Đại Sứ</button>
          </div>
        </div>

        <div class="sponsorship-offers-grid" id="sponsorOffersGrid"></div>
      </div>
    `;

    wrapper.innerHTML = activeSectionHtml + offersSectionHtml;
    sponsorsContainer.appendChild(wrapper);

    // Render các thẻ đề nghị trong Offers Grid
    const offersGrid = wrapper.querySelector('#sponsorOffersGrid');
    if (offersGrid) {
      offers.forEach(offer => {
        const card = document.createElement('div');
        const isLocked = !offer.isUnlocked;
        const isSigned = offer.isSigned;
        const hasExisting = Boolean(offer.existingCategoryDeal);

        card.className = `sponsor-offer-card ${isSigned ? 'signed' : ''} ${isLocked ? 'locked' : ''}`;
        card.dataset.category = offer.category;

        const durationBadge = offer.isLifetime
          ? `<span class="badge-lifetime-shimmer">🌌 TRỌN ĐỜI / LIFETIME</span>`
          : `<span class="badge-duration">⏳ ${offer.durationYears} năm</span>`;

        let actionBtnHtml = '';
        if (isSigned) {
          actionBtnHtml = `
            <button class="btn btn-secondary" disabled style="padding:7px 16px; font-size:0.8rem; font-weight:800; cursor:default;">
              ✅ Đang Hiệu Lực
            </button>
          `;
        } else if (isLocked) {
          actionBtnHtml = `
            <button class="btn" disabled style="padding:7px 16px; font-size:0.8rem; opacity:0.6; cursor:not-allowed; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.15); color:var(--text-dim);">
              🔒 Chưa Đủ Danh Tiếng
            </button>
          `;
        } else if (hasExisting) {
          actionBtnHtml = `
            <button class="btn-sponsor-replace" data-offer-id="${offer.id}">
              🔄 Thay Thế Hợp Đồng Cũ
            </button>
          `;
        } else {
          actionBtnHtml = `
            <button class="btn-sponsor-sign" data-offer-id="${offer.id}">
              ✍️ Ký Hợp Đồng
            </button>
          `;
        }

        const conflictWarning = (!isSigned && !isLocked && hasExisting)
          ? `<div style="font-size:0.72rem; color:var(--accent-gold); font-weight:700; margin-top:4px;">⚠️ Sẽ thay thế hợp đồng "${offer.existingCategoryDeal.name}"</div>`
          : '';

        const lockedBanner = isLocked
          ? `<div class="sponsor-locked-banner">🔒 Cần đạt ${offer.tierBadge} ${offer.tierTitle} (${offer.minFame.toLocaleString()} pts) để mở khóa</div>`
          : '';

        card.innerHTML = `
          <div class="sponsor-card-top">
            <div style="display:flex; align-items:center; gap:10px;">
              <div style="font-size:28px;">${offer.icon}</div>
              <div>
                <div class="sponsor-card-brand-title">${offer.name}</div>
                <div style="font-size:0.72rem; color:var(--accent-blue); font-weight:700;">🏷️ ${offer.categoryName}</div>
              </div>
            </div>
            <div style="text-align:right;">
              ${durationBadge}
              <div class="sponsor-card-tier-badge" style="margin-top:2px;">Yêu cầu: ${offer.tierBadge} ${offer.tierTitle}</div>
            </div>
          </div>

          <div class="sponsor-card-desc">${offer.desc}</div>

          <div class="sponsor-card-metrics">
            <div class="sponsor-metric-row">
              <span class="sponsor-metric-label">💵 Thu nhập hàng năm:</span>
              <span class="sponsor-metric-val" style="color:#34d399; font-size:0.92rem;">+${formatMoney(offer.annualPayout)}/năm</span>
            </div>
            <div class="sponsor-metric-row">
              <span class="sponsor-metric-label">🤝 Phí lót tay ký kết:</span>
              <span class="sponsor-metric-val" style="color:var(--accent-gold);">+${formatMoney(offer.signingBonus)}</span>
            </div>
          </div>

          <div class="sponsor-card-perk">
            <span style="color:var(--accent-gold); margin-right:4px;">✨</span>${offer.perkBonus}
          </div>

          ${lockedBanner}
          ${conflictWarning}

          <div class="sponsor-card-footer">
            <span style="font-size:0.8rem; font-weight:800; color:var(--accent-gold);">
              ${offer.isLifetime ? '🌌 Hợp Đồng Trọn Đời' : `Thời hạn ${offer.durationYears} năm`}
            </span>
            ${actionBtnHtml}
          </div>
        `;

        // Wire event handlers
        if (!isLocked && !isSigned) {
          const actionBtn = card.querySelector('button');
          if (actionBtn && onSignSponsor) {
            actionBtn.onclick = () => {
              if (hasExisting) {
                const confirmed = window.confirm(
                  `🔄 THAY THẾ NHÀ TÀI TRỢ ĐỘC QUYỀN?\n\n` +
                  `Bạn hiện đang có hợp đồng độc quyền danh mục ${offer.categoryName} với "${offer.existingCategoryDeal.name}" (+${formatMoney(offer.existingCategoryDeal.annualPayout)}/năm).\n\n` +
                  `Bạn có chắc chắn muốn hủy hợp đồng cũ để ký siêu hợp đồng mới với "${offer.name}" (+${formatMoney(offer.annualPayout)}/năm, Phí lót tay: +${formatMoney(offer.signingBonus)})?`
                );
                if (!confirmed) return;
              }
              onSignSponsor(offer.id);
            };
          }
        }

        offersGrid.appendChild(card);
      });

      // Filter tabs handler
      const filterBtns = wrapper.querySelectorAll('.sponsor-filter-btn');
      filterBtns.forEach(btn => {
        btn.onclick = () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const cat = btn.dataset.cat;
          const allCards = offersGrid.querySelectorAll('.sponsor-offer-card');
          allCards.forEach(c => {
            if (cat === 'ALL' || c.dataset.category === cat) {
              c.style.display = '';
            } else {
              c.style.display = 'none';
            }
          });
        };
      });
    }
  }
}

/* =========================================================================
   17. INTERACTIVE MATCH CENTER & LIVE TEXT MATCH EVENTS
   ========================================================================= */
/* =========================================================================
   17. INTERACTIVE MATCH CENTER & DEEP TICK-BASED MATCH ENGINE
   ========================================================================= */

/* --- Radar Pitch Helpers --- */
function _setRadarDot(el, leftPct, topPct) {
  if (!el) return;
  el.style.left = `${Math.max(2, Math.min(98, leftPct))}%`;
  el.style.top = `${Math.max(5, Math.min(95, topPct))}%`;
}

// Theo dõi số bàn trước đó để phát hiện bàn thắng mới
let _prevHomeScore = 0;
let _prevAwayScore = 0;

function updateRadarPitch(sim, radarBall, radarPlayer, radarOpp1, radarOpp2, radarMate, radarGoalFlash, radarPitch) {
  if (!sim) return;

  const pct = sim.ballPitchPercent || 50;       // 0 (home goal) → 100 (away goal)
  const zone = sim.currentZone || 'MIDFIELD';    // DEFENSIVE_THIRD | MIDFIELD | ATTACKING_THIRD
  const isPlayerHome = sim.isPlayerHome;

  // === Ball position ===
  // pct là phần trăm từ trái → phải, phía HOME là trái (0-50), phía AWAY là phải (50-100)
  const ballLeft = pct;
  const ballTop = 35 + Math.sin((pct / 100) * Math.PI) * 30;  // di chuyển theo đường cong nhẹ
  _setRadarDot(radarBall, ballLeft, 50);

  // === Player dot ===
  // Cầu thủ bám theo bóng với offset nhỏ tùy zone
  let playerLeft, playerTop;
  if (zone === 'ATTACKING_THIRD') {
    // Tấn công → player dồn lên trên
    playerLeft = isPlayerHome ? pct - 8 - Math.random() * 4 : pct + 8 + Math.random() * 4;
    playerTop = 40 + Math.random() * 20;
  } else if (zone === 'DEFENSIVE_THIRD') {
    // Phòng thủ → player lùi về
    playerLeft = isPlayerHome ? 15 + Math.random() * 10 : 75 + Math.random() * 10;
    playerTop = 40 + Math.random() * 20;
  } else {
    // Giữa sân
    playerLeft = isPlayerHome ? pct - 5 : pct + 5;
    playerTop = 45 + Math.random() * 10;
  }
  _setRadarDot(radarPlayer, playerLeft, playerTop);

  // === Opponents dots (2 chấm đỏ đối diện) ===
  const oppBase = isPlayerHome ? pct + 10 : pct - 10;
  _setRadarDot(radarOpp1, Math.max(10, Math.min(90, oppBase + Math.random() * 8 - 4)), 30 + Math.random() * 15);
  _setRadarDot(radarOpp2, Math.max(10, Math.min(90, oppBase + Math.random() * 8 - 4)), 55 + Math.random() * 15);

  // === Teammate dot (xanh dương) ===
  const mateLeft = isPlayerHome ? playerLeft - 6 - Math.random() * 8 : playerLeft + 6 + Math.random() * 8;
  _setRadarDot(radarMate, Math.max(5, Math.min(95, mateLeft)), 35 + Math.random() * 30);

  // === Goal Flash effect ===
  const curHome = sim.homeScore || 0;
  const curAway = sim.awayScore || 0;

  if (curHome > _prevHomeScore) {
    // Bàn thắng phía Home (trái sân)
    _prevHomeScore = curHome;
    if (radarGoalFlash) {
      radarGoalFlash.className = 'radar-goal-flash';
      void radarGoalFlash.offsetWidth; // force reflow
      radarGoalFlash.className = 'radar-goal-flash flash-home';
      if (radarPitch) {
        radarPitch.classList.add('radar-pitch-shake');
        setTimeout(() => radarPitch.classList.remove('radar-pitch-shake'), 650);
      }
    }
  } else if (curAway > _prevAwayScore) {
    // Bàn thắng phía Away (phải sân)
    _prevAwayScore = curAway;
    if (radarGoalFlash) {
      radarGoalFlash.className = 'radar-goal-flash';
      void radarGoalFlash.offsetWidth;
      radarGoalFlash.className = 'radar-goal-flash flash-away';
      if (radarPitch) {
        radarPitch.classList.add('radar-pitch-shake');
        setTimeout(() => radarPitch.classList.remove('radar-pitch-shake'), 650);
      }
    }
  }
}

