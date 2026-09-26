/* =========================================================================
   UI LIFESTYLE — LIFESTYLE STORE RENDERING
   Extracted from ui.js
   ========================================================================= */
import { LIFESTYLE_CATALOG } from './data.js';
import { formatCurrency, formatMoney } from './uiCore.js';
import { showToast } from './uiCore.js';
export function renderLifestyleStore(player, onBuyEquip, onToggleSub, onBuyAsset) {
  const equipContainer = document.getElementById('lifestyleEquipContainer');
  const subsContainer = document.getElementById('lifestyleSubsContainer');
  const assetsContainer = document.getElementById('lifestyleAssetsContainer');
  if (!equipContainer || !subsContainer || !assetsContainer) return;

  const currentCash = (player.cash !== undefined ? player.cash : player.money) || 0;
  const playerPos = (player.position || 'ST').toUpperCase();

  // Đảm bảo đặc quyền duy trì Morale nếu đang thuê dịch vụ
  if (Array.isArray(player.subscriptions)) {
    if (player.subscriptions.includes('sub_nutrition_plan')) {
      player.morale = Math.max(75, player.morale || 75);
    } else if (player.subscriptions.includes('sub_mini_apt')) {
      player.morale = Math.max(65, player.morale || 65);
    }
  }

  // 1. Equipment Section
  equipContainer.innerHTML = '';
  (LIFESTYLE_CATALOG.equipment || []).forEach(item => {
    const isOwned = !item.consumable && (player.equipment || []).includes(item.id);
    const isGkItem = item.id === 'eq_gloves' || item.requiredPosition === 'GK';
    const isPosMismatch = isGkItem && playerPos !== 'GK';
    const canAfford = currentCash >= item.cost;

    const card = document.createElement('div');
    card.className = `lifestyle-item-card ${isOwned ? 'owned' : ''} ${isPosMismatch ? 'pos-locked' : ''}`;
    if (isPosMismatch) {
      card.style.opacity = '0.72';
    }

    let actionBtnHtml = '';
    if (isOwned) {
      actionBtnHtml = `<button class="btn-lifestyle disabled" disabled>✅ Đã Trang Bị</button>`;
    } else if (isPosMismatch) {
      actionBtnHtml = `<button class="btn-lifestyle disabled pos-locked" disabled style="background: rgba(100, 116, 139, 0.18) !important; color: #94a3b8 !important; border: 1px solid rgba(148, 163, 184, 0.3) !important; cursor: not-allowed; opacity: 0.85;" title="Vật phẩm chuyên dụng chỉ dành cho Thủ Môn (GK). Vị trí của bạn: ${playerPos}">🚫 Chỉ Dành Cho GK</button>`;
    } else if (!canAfford) {
      actionBtnHtml = `<button class="btn-lifestyle disabled not-enough-cash" disabled style="background: rgba(239, 68, 68, 0.12) !important; color: #fca5a5 !important; border: 1px solid rgba(239, 68, 68, 0.35) !important; cursor: not-allowed;" title="Không đủ tiền mặt! Cần ${formatMoney(item.cost)} (Bạn hiện có ${formatMoney(currentCash)})">💸 Không Đủ Tiền</button>`;
    } else if (item.consumable) {
      actionBtnHtml = `<button class="btn-lifestyle consumable" id="btnBuyEquip_${item.id}" style="background: linear-gradient(135deg, #0ea5e9, #0284c7);">⚡ Mua & Dùng</button>`;
    } else {
      actionBtnHtml = `<button class="btn-lifestyle" id="btnBuyEquip_${item.id}">🛒 Mua Ngay</button>`;
    }

    card.innerHTML = `
      <div class="lifestyle-card-icon">${item.icon}</div>
      <div class="lifestyle-card-info">
        <div class="lifestyle-card-title">${item.name} <span class="badge-tag-sm">${item.badgeText}</span>${isPosMismatch ? ' <span class="badge-tag-sm" style="background:rgba(239,68,68,0.2);color:#fca5a5;border:1px solid rgba(239,68,68,0.4);">🧤 Chỉ GK</span>' : ''}</div>
        <div class="lifestyle-card-desc">${item.desc}</div>
        <div class="lifestyle-card-buff"><strong style="color:var(--accent-green);">⚡ Hiệu ứng:</strong> ${item.buffSummary}</div>
        <div class="lifestyle-card-cost">Giá mua: <span style="color:#fff;">${formatMoney(item.cost)}</span></div>
      </div>
      <div>
        ${actionBtnHtml}
      </div>
    `;

    const btn = card.querySelector(`#btnBuyEquip_${item.id}`);
    if (btn && onBuyEquip) {
      btn.onclick = () => {
        // Áp dụng ngay hiệu ứng thể lực cho consumable
        if (item.consumable && item.stamInstant) {
          player.stam = Math.min(100, (player.stam || 80) + item.stamInstant);
        }
        // Áp dụng tăng thể lực tối đa / vĩnh viễn (stamBuff)
        if (item.stamBuff) {
          player.stam = Math.min(100, (player.stam || 80) + item.stamBuff);
        }
        // Áp dụng stats 6 chỉ số FIFA (PAC, SHO, PAS, DRI, DEF, PHY)
        if (item.statsBuff && player.stats) {
          for (const [st, val] of Object.entries(item.statsBuff)) {
            if (player.stats[st] !== undefined) {
              player.stats[st] = Math.min(99, player.stats[st] + val);
            }
          }
          if (typeof player.syncLegacyAttrs === 'function') player.syncLegacyAttrs();
        }
        // Áp dụng buff exp
        if (item.expGrowthBonus) {
          player.expGrowthBonus = (player.expGrowthBonus || 0) + item.expGrowthBonus;
          player.videoAnalysisBuff = true;
        }

        onBuyEquip(item.id);

        // Vật phẩm tiêu hao thì xóa khỏi mảng equipment để người chơi có thể mua tiếp
        if (item.consumable && Array.isArray(player.equipment)) {
          player.equipment = player.equipment.filter(eqId => eqId !== item.id);
        }
      };
    }
    equipContainer.appendChild(card);
  });

  // 2. Subscriptions Section
  subsContainer.innerHTML = '';
  (LIFESTYLE_CATALOG.subscriptions || []).forEach(sub => {
    const isSubscribed = (player.subscriptions || []).includes(sub.id);
    const costForCheck = sub.costMonthly || sub.costYearly;
    const canAfford = currentCash >= costForCheck;

    const card = document.createElement('div');
    card.className = `lifestyle-item-card ${isSubscribed ? 'owned' : ''}`;

    let subBtnHtml = '';
    if (isSubscribed) {
      subBtnHtml = `<button class="btn-lifestyle owned" id="btnToggleSub_${sub.id}">✅ Đang Thuê (Hủy)</button>`;
    } else if (!canAfford) {
      subBtnHtml = `<button class="btn-lifestyle disabled not-enough-cash" disabled style="background: rgba(239, 68, 68, 0.12) !important; color: #fca5a5 !important; border: 1px solid rgba(239, 68, 68, 0.35) !important; cursor: not-allowed;" title="Không đủ tiền mặt để ký hợp đồng dịch vụ! Cần ${formatMoney(costForCheck)} (Bạn hiện có ${formatMoney(currentCash)})">💸 Không Đủ Tiền</button>`;
    } else {
      subBtnHtml = `<button class="btn-lifestyle" id="btnToggleSub_${sub.id}">🤝 Ký Hợp Đồng</button>`;
    }

    const costLabel = sub.costMonthly 
      ? `Phí thuê: <span style="color:#fff;">${formatMoney(sub.costMonthly)}/tháng</span> <span style="color:var(--text-dim);font-size:0.75rem;">(${formatMoney(sub.costYearly)}/năm)</span>`
      : `Phí thuê: <span style="color:#fff;">${formatMoney(sub.costYearly)}/năm</span>`;

    card.innerHTML = `
      <div class="lifestyle-card-icon">${sub.icon}</div>
      <div class="lifestyle-card-info">
        <div class="lifestyle-card-title">${sub.name} <span class="badge-tag-sm sub">${sub.badgeText}</span></div>
        <div class="lifestyle-card-desc">${sub.desc}</div>
        <div class="lifestyle-card-buff"><strong style="color:var(--accent-blue);">⚡ Đặc quyền:</strong> ${sub.buffSummary}</div>
        <div class="lifestyle-card-cost">${costLabel}</div>
      </div>
      <div>
        ${subBtnHtml}
      </div>
    `;

    const btn = card.querySelector(`#btnToggleSub_${sub.id}`);
    if (btn && onToggleSub) {
      btn.onclick = () => {
        if (!isSubscribed && sub.minMorale) {
          player.morale = Math.max(sub.minMorale, player.morale || 65);
        }
        onToggleSub(sub.id, !isSubscribed);
      };
    }
    subsContainer.appendChild(card);
  });

  // 3. Assets Section
  assetsContainer.innerHTML = '';
  (LIFESTYLE_CATALOG.assets || []).forEach(ast => {
    const isOwned = (player.assets || []).includes(ast.id);
    const canAfford = currentCash >= ast.cost;

    const card = document.createElement('div');
    card.className = `lifestyle-item-card ${isOwned ? 'owned' : ''}`;

    let assetBtnHtml = '';
    if (isOwned) {
      assetBtnHtml = `<button class="btn-lifestyle disabled" disabled>🏢 Đã Sở Hữu</button>`;
    } else if (!canAfford) {
      assetBtnHtml = `<button class="btn-lifestyle disabled not-enough-cash" disabled style="background: rgba(239, 68, 68, 0.12) !important; color: #fca5a5 !important; border: 1px solid rgba(239, 68, 68, 0.35) !important; cursor: not-allowed;" title="Không đủ tiền mặt để sở hữu tài sản này! Cần ${formatMoney(ast.cost)} (Bạn hiện có ${formatMoney(currentCash)})">💸 Không Đủ Tiền</button>`;
    } else {
      assetBtnHtml = `<button class="btn-lifestyle" id="btnBuyAsset_${ast.id}">💰 Sở Hữu Ngay</button>`;
    }

    card.innerHTML = `
      <div class="lifestyle-card-icon">${ast.icon}</div>
      <div class="lifestyle-card-info">
        <div class="lifestyle-card-title">${ast.name} <span class="badge-tag-sm gold">${ast.badgeText}</span></div>
        <div class="lifestyle-card-desc">${ast.desc}</div>
        <div class="lifestyle-card-buff"><strong style="color:var(--accent-gold);">⚡ Lợi ích:</strong> ${ast.buffSummary}</div>
        <div class="lifestyle-card-cost">Giá đầu tư: <span style="color:#fff;">${formatMoney(ast.cost)}</span></div>
      </div>
      <div>
        ${assetBtnHtml}
      </div>
    `;

    const btn = card.querySelector(`#btnBuyAsset_${ast.id}`);
    if (btn && onBuyAsset) {
      btn.onclick = () => {
        if (ast.fameBonus) player.fame = Math.max(0, (player.fame || 0) + ast.fameBonus);
        if (ast.moraleBonus) player.morale = Math.min(100, (player.morale || 70) + ast.moraleBonus);
        onBuyAsset(ast.id);
      };
    }
    assetsContainer.appendChild(card);
  });
}

/* =========================================================================
   9. RECORDS TAB & CHECKING
   ========================================================================= */
