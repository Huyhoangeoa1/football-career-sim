/* =========================================================================
   FOOTBALL CAREER SIMULATOR — LIFESTYLE STORE & INVESTMENT LOGIC
   ========================================================================= */

import { LIFESTYLE_CATALOG } from './data.js';

export function buyEquipment(player, itemId) {
  if (player.equipment.includes(itemId)) {
    return { success: false, message: "Trang bị này đã được sở hữu!" };
  }

  const item = LIFESTYLE_CATALOG.equipment.find(e => e.id === itemId);
  if (!item) {
    return { success: false, message: "Không tìm thấy vật phẩm!" };
  }

  if (player.money < item.cost) {
    return { 
      success: false, 
      message: `Bạn không đủ tiền mặt để mua trang bị này! Cần $${item.cost.toLocaleString()} (Hiện có $${player.money.toLocaleString()}).` 
    };
  }

  player.money -= item.cost;
  player.equipment.push(item.id);

  if (item.attr1Buff) player.attr1 = Math.min(99, player.attr1 + item.attr1Buff);
  if (item.attr2Buff) player.attr2 = Math.min(99, player.attr2 + item.attr2Buff);
  if (item.stamBuff) player.stam = Math.min(99, player.stam + item.stamBuff);

  return {
    success: true,
    item,
    logTitle: "Trang Bị Mới",
    logBody: `Bạn đã sắm ${item.name}! Hiệu năng thi đấu được gia tăng vượt trội (${item.buffSummary}).`
  };
}

export function toggleSubscription(player, subId, enable) {
  const sub = LIFESTYLE_CATALOG.subscriptions.find(s => s.id === subId);
  if (!sub) {
    return { success: false, message: "Không tìm thấy gói dịch vụ!" };
  }

  if (enable) {
    if (player.subscriptions.includes(subId)) {
      return { success: false, message: "Đang duy trì gói dịch vụ này!" };
    }

    if (player.money < sub.costYearly) {
      return { 
        success: false, 
        message: `Bạn không đủ tiền mặt để thanh toán phí năm đầu! Cần $${sub.costYearly.toLocaleString()}.` 
      };
    }
    player.money -= sub.costYearly;
    player.subscriptions.push(sub.id);
    if (sub.id === "sub_psychologist") player.morale = Math.max(85, player.morale + 15);
    if (sub.id === "sub_freestyle_coach") {
      player.skillMoves = 6;
      player.skillMovesTrainProgress = 0;
    }

    return {
      success: true,
      sub,
      action: "SUBSCRIBED",
      logTitle: "Ký Hợp Đồng Dịch Vụ",
      logBody: `Bạn đã kích hoạt gói ${sub.name}! (${sub.buffSummary}). Phí thường niên $${sub.costYearly.toLocaleString()}/năm.`
    };
  } else {
    player.subscriptions = player.subscriptions.filter(id => id !== sub.id);
    if (sub.id === "sub_freestyle_coach") {
      if (player.skillMoves > 5) player.skillMoves = 5;
    }
    return {
      success: true,
      sub,
      action: "CANCELLED",
      logTitle: "Hủy Dịch Vụ",
      logBody: `Bạn đã dừng gia hạn dịch vụ ${sub.name}.`
    };
  }
}

export function buyAsset(player, assetId) {
  if (player.assets.includes(assetId)) {
    return { success: false, message: "Tài sản này đã được sở hữu!" };
  }

  const ast = LIFESTYLE_CATALOG.assets.find(a => a.id === assetId);
  if (!ast) {
    return { success: false, message: "Không tìm thấy tài sản!" };
  }

  if (player.money < ast.cost) {
    return { 
      success: false, 
      message: `Bạn không đủ tiền mặt để mua tài sản này! Cần $${ast.cost.toLocaleString()} (Hiện có $${player.money.toLocaleString()}).` 
    };
  }

  player.money -= ast.cost;
  player.assets.push(ast.id);

  if (ast.fameBonus) player.fame = Math.max(0, (player.fame || 0) + ast.fameBonus);
  if (ast.moraleBonus) player.morale = Math.min(100, player.morale + ast.moraleBonus);

  return {
    success: true,
    asset: ast,
    logTitle: "Sở Hữu Tài Sản & Bất Động Sản",
    logBody: `Chúc mừng bạn chính thức sở hữu ${ast.name}! Khối tài sản ròng và vị thế xã hội tăng vọt.`
  };
}
