/* =========================================================================
   FOOTBALL CAREER SIMULATOR — EVENTS & MODALS MODULE
   ========================================================================= */

import { EVENT_POOL, KEY_MATCH_MOMENTS, ALL_CLUBS, getSubStat } from './data.js';
import { getOverallPower, rollInjuryChance, recordChronicleMilestone, getTransferWindowStatus } from './engine.js';

/* =========================================================================
   1. RANDOM EVENT TRIGGER & MODAL
   ========================================================================= */
export function rollRandomEvent(player, onChoiceCallback, onFinishCallback) {
  if (Math.random() < 0.5) {
    let event = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
    showEventModal(event, player, onChoiceCallback);
  } else {
    if (onFinishCallback) onFinishCallback();
  }
}

export function showEventModal(event, player, onChoiceCallback) {
  const modal = document.getElementById('eventModal');
  const badge = document.getElementById('modalBadge');
  if (!modal || !badge) return;

  badge.className = `modal-badge ${event.badge || 'badge-event'}`;

  document.getElementById('modalTitle').innerText = event.title;
  document.getElementById('modalDesc').innerText = event.desc;

  const choicesContainer = document.getElementById('modalChoices');
  choicesContainer.innerHTML = '';

  event.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'modal-choice-btn';
    btn.type = 'button';
    btn.innerHTML = `<span>${choice.text}</span> <span>➔</span>`;
    
    btn.onclick = function(e) {
      e.stopPropagation();
      executeEventChoice(choice.actionId, player, onChoiceCallback);
      modal.classList.remove('active');
    };
    choicesContainer.appendChild(btn);
  });

  modal.classList.add('active');
}

function executeEventChoice(actionId, player, onChoiceCallback) {
  let logTitle = "";
  let logBody = "";
  let logType = "normal";

  switch (actionId) {
    case "PARTY":
      player.morale = Math.min(100, player.morale + 15);
      player.form = Math.min(99, player.form + 10);
      player.fame = (player.fame || 0) + 60;
      logTitle = "Thủ Lĩnh Truyền Cảm Hứng";
      logBody = "Bữa tiệc gắn kết tinh thần giúp toàn đội thi đấu bùng nổ, bầu không khí phòng thay đồ đoàn kết hơn bao giờ hết!";
      logType = "trophy-win";
      break;

    case "HARDWORK":
      player.attr1 = Math.min(99, player.attr1 + 2);
      player.attr2 = Math.min(99, player.attr2 + 2);
      player.fame = (player.fame || 0) + 50;
      player.form = Math.min(99, player.form + 8);
      logTitle = "Tấm Gương Mẫu Mực";
      logBody = "Sự chuyên nghiệp kỷ luật của bạn trở thành nguồn cảm hứng lớn cho các đồng đội trẻ noi theo.";
      break;

    case "CHARITY_DONATE":
      if (player.money >= 5000000) {
        player.money -= 5000000;
        player.fame = (player.fame || 0) + 200;
        player.morale = 100;
        player.charityBoost = true;
        logTitle = "Trái Tim Nhân Ái";
        logBody = "Hành động cao đẹp tài trợ $5,000,000 cho bóng đá trẻ giúp bạn nhận cơn mưa lời khen trên toàn thế giới, gia tăng uy tín Quả Bóng Vàng!";
        logType = "trophy-win";
      } else {
        player.fame = (player.fame || 0) + 100;
        player.morale = Math.min(100, player.morale + 10);
        logTitle = "Đại Sứ Toàn Cầu";
        logBody = "Bạn tham gia các sự kiện thiện nguyện truyền cảm hứng cho hàng triệu trẻ em đam mê bóng đá.";
      }
      break;

    case "MEDIA_CAMPAIGN":
      player.money += 15000000;
      player.fame = (player.fame || 0) + 100;
      player.morale = Math.min(100, player.morale + 8);
      logTitle = "Chiến Dịch Toàn Cầu Thành Công";
      logBody = "Bạn xuất hiện trên truyền thông khắp các châu lục, thu về hợp đồng tài trợ béo bở trị giá $15,000,000!";
      logType = "transfer";
      break;

    case "SURGERY_GERMANY":
      if (player.money >= 500000) {
        player.money -= 500000;
        player.stam -= 4;
        logTitle = "Hồi Phục Thần Kỳ Tại Đức";
        logBody = "Ca phẫu thuật thành công mỹ mãn giúp bạn giữ nguyên phản xạ và sự linh hoạt.";
        logType = "transfer";
      } else {
        player.stam -= 16;
        player.attr1 = Math.max(20, player.attr1 - 5);
        logTitle = "Chấn Thương Dai Dẳng";
        logBody = "Không đủ kinh phí điều trị cao cấp, bạn mất đi một phần tốc độ bùng nổ vốn có.";
        logType = "injury";
      }
      break;

    case "PLAY_THROUGH_PAIN":
      {
        const injuryPenalty = (player.subscriptions.includes("sub_cryo") || player.equipment.includes("eq_shinguards")) ? 10 : 22;
        if (Math.random() < 0.35) {
          player.stam -= injuryPenalty;
          player.attr1 = Math.max(20, player.attr1 - 6);
          logTitle = "Bi Kịch Nén Đau Thi Đấu";
          logBody = "Dây chằng bị tổn thương! Bạn phải nghỉ thi đấu và giảm sút thể lực.";
          logType = "injury";
        } else {
          player.form += 8;
          logTitle = "Người Hùng Quả Cảm";
          logBody = "Ý chí thép của bạn giúp đội bóng vượt qua nghịch cảnh!";
        }
      }
      break;

    case "SIGN_MEGA_SPONSOR":
      {
        let reward = 15000000;
        if (player.subscriptions.includes("sub_pr")) reward = 19500000;
        player.money += reward;
        player.fame = (player.fame || 0) + 100;
        player.morale = Math.min(100, player.morale + 10);
        logTitle = "Hợp Đồng Thương Mại Thế Kỷ";
        logBody = `Bạn trở thành gương mặt đại diện toàn cầu, đút túi thêm $${(reward / 1000000).toFixed(1)}M tiền mặt!`;
        logType = "transfer";
      }
      break;
  }

  if (onChoiceCallback) {
    onChoiceCallback(logTitle, logBody, logType);
  }
}

/* =========================================================================
   2. KEY MATCH CHOICES DISPATCHER
   ========================================================================= */
export function checkAndTriggerKeyMatchMoment(player, callback, onMomentResolved) {
  const isBigStage = (player.currentEuroStatus === "C1" || (player.fame || 0) >= 2000 || (player.year % 4 === 0 && player.intlCaps >= 10));
  
  if (isBigStage && Math.random() < 0.70) {
    let momentPool = [...KEY_MATCH_MOMENTS];
    if (player.position === "GK") {
      const gkMoments = KEY_MATCH_MOMENTS.filter(m => m.stage === "GK_MOMENT");
      if (gkMoments.length > 0) momentPool = gkMoments;
    }
    const moment = momentPool[Math.floor(Math.random() * momentPool.length)];
    showKeyMatchModal(moment, player, callback, onMomentResolved);
  } else {
    callback();
  }
}

export function showKeyMatchModal(moment, player, callback, onMomentResolved) {
  const modal = document.getElementById('keyMatchModal');
  if (!modal) {
    callback();
    return;
  }

  const badgeEl = document.getElementById('keyMatchBadge');
  if (badgeEl) badgeEl.innerText = "🔥 TRẬN ĐẤU TÂM ĐIỂM";

  document.getElementById('keyMatchTitle').innerText = moment.matchTitle;
  document.getElementById('keyMatchDesc').innerText = moment.desc;

  const choicesContainer = document.getElementById('keyMatchChoices');
  choicesContainer.innerHTML = '';

  moment.choices.forEach((choice) => {
    const winRate = Math.round(choice.successChance(player) * 100);
    const card = document.createElement('div');
    card.className = 'key-match-choice-card';
    card.innerHTML = `
      <div class="key-match-choice-title">
        <span>${choice.text}</span>
        <span class="key-match-choice-rate">⚡ Tỷ lệ thành công: ${winRate}%</span>
      </div>
      <div style="font-size:0.78rem; color:var(--text-muted);">
        Thành công: Vinh quang tột đỉnh, nâng cúp / ghi điểm quyết định | Thất bại: Giảm phong độ & tinh thần
      </div>
    `;

    card.onclick = function() {
      const roll = Math.random();
      const chance = choice.successChance(player);
      modal.classList.remove('active');

      if (roll <= chance) {
        choice.onSuccess(player);
        if (onMomentResolved) onMomentResolved(true, "BƯỚC NGOẶT LỊCH SỬ (THÀNH CÔNG)", choice.successText);
      } else {
        choice.onFailure(player);
        if (onMomentResolved) onMomentResolved(false, "BƯỚC NGOẶT ĐÁNG TIẾC", choice.failureText);
      }

      callback();
    };

    choicesContainer.appendChild(card);
  });

  modal.classList.add('active');
}

/* =========================================================================
   3. TRANSFER OFFERS & MARKET MODAL
   ========================================================================= */
export function openTransferMarketModal(player, onTransferAccept) {
  if (player.isAcademyStage || player.age <= 16) {
    alert("🎓 Bạn đang trong giai đoạn đào tạo trẻ tại học viện (16 tuổi). Hãy hoàn thành mùa giải đầu tiên để ký hợp đồng thi đấu chuyên nghiệp!");
    return;
  }

  const winStatus = getTransferWindowStatus(player);
  if (!winStatus.isOpen) {
    alert(`🔒 THỊ TRƯỜNG CHUYỂN NHƯỢNG HIỆN ĐANG ĐÓNG CỬA!\n\n${winStatus.message}`);
    return;
  }

  const modal = document.getElementById('transferModal');
  const container = document.getElementById('transferOffersContainer');
  const descEl = document.getElementById('transferModalDesc');
  if (!modal || !container) return;

  if (descEl) {
    descEl.innerHTML = `🟢 <strong>${winStatus.windowName}</strong> đang mở! (${winStatus.message})<br>Các câu lạc bộ dưới đây đã gửi lời mời chính thức. Bạn có thể ký ngay hoặc bước vào bàn đàm phán để nâng cao đãi ngộ:`;
  }

  container.innerHTML = '';

  const ovr = getOverallPower(player);
  let offers = [];

  if (player.age >= 33 || (player.fame || 0) >= 4000) {
    const saudiClubs = ALL_CLUBS.filter(c => c.isSaudiMLS && (player.currentClub ? c.id !== player.currentClub.id : true));
    saudiClubs.sort(() => 0.5 - Math.random());
    offers.push(...saudiClubs.slice(0, 1));
  }

  let availableClubs = [];
  if (ovr >= 80) {
    availableClubs = ALL_CLUBS.filter(c => {
      if (player.currentClub && c.id === player.currentClub.id) return false;
      if (offers.some(o => o.id === c.id)) return false;
      return c.league.tierLevel >= 3 && ovr >= c.skillReq - 6;
    });
  } else {
    availableClubs = ALL_CLUBS.filter(c => {
      if (player.currentClub && c.id === player.currentClub.id) return false;
      if (offers.some(o => o.id === c.id)) return false;
      return (c.league.tierLevel <= 2 || c.skillReq <= 78) && !c.isSaudiMLS;
    });
  }

  availableClubs.sort(() => 0.5 - Math.random());
  offers.push(...availableClubs.slice(0, 4 - offers.length));

  if (offers.length === 0) {
    offers = ALL_CLUBS.filter(c => (player.currentClub ? c.id !== player.currentClub.id : true) && c.league.tierLevel <= 2).slice(0, 3);
  }

  offers.forEach(club => {
    let offerSalary = Math.floor(club.salary * (0.95 + Math.min(1.0, Math.sqrt(player.fame || 0) / 60) * 0.45));
    if (club.isSaudiMLS) {
      offerSalary = Math.max(offerSalary, club.salary);
    }

    const signingBonus = Math.floor(offerSalary * 6 + (player.marketValue || 5000000) * 0.05 + 500000);

    let role = "⭐ Trụ cột đá chính";
    if (ovr < club.skillReq) role = "Dự bị tiềm năng / Xoay tua";
    else if (ovr >= club.skillReq + 6) role = "👑 Siêu sao gánh đội (Key Player)";
    if (club.isSaudiMLS) role = "💎 Đại Sứ Toàn Cầu & Lương Kỷ Lục";

    let euroStatusDesc = "Giải Quốc Nội";
    if (club.defaultEuro === "C1") euroStatusDesc = "⭐ Suất dự Cúp C1 Châu Lục";
    else if (club.defaultEuro === "C2") euroStatusDesc = "🥈 Suất dự Cúp C2 Châu Lục";

    const offerCard = document.createElement('div');
    offerCard.className = 'transfer-offer-card';
    if (club.isSaudiMLS) offerCard.style.borderColor = "var(--accent-gold)";

    offerCard.innerHTML = `
      <div class="offer-info-left" style="flex: 1;">
        <div class="offer-club-name" style="font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
          <span>${club.icon}</span> <strong>${club.name}</strong> ${club.isSaudiMLS ? '<span style="background:rgba(245,158,11,0.25); color:var(--accent-gold); font-size:0.7rem; padding:2px 6px; border-radius:4px; font-weight:800;">💰 SIÊU HỢP ĐỒNG</span>' : ''}
        </div>
        <div class="offer-league-tag" style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
          ${club.league.flag} ${club.league.name} • <span style="color: var(--accent-blue); font-weight: 600;">${euroStatusDesc}</span>
        </div>
        <div class="offer-role-tag" style="font-size: 0.82rem; margin-top: 4px;">
          Vai trò: <strong style="color: #fff;">${role}</strong>
        </div>
        <div style="display: flex; gap: 16px; margin-top: 6px; flex-wrap: wrap;">
          <div class="offer-salary" style="color: var(--accent-green); font-weight: 800;">
            Lương: €${offerSalary.toLocaleString()} / week
          </div>
          <div style="color: var(--accent-gold); font-weight: 800;">
            🎁 Phí lót tay: +$${signingBonus.toLocaleString()}
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px; align-self: center;">
        <button class="btn btn-secondary" id="btnNegTransfer_${club.id}" style="padding: 8px 14px; font-weight: 700; white-space: nowrap; font-size: 0.85rem; border-color: var(--accent-gold); color: var(--accent-gold);">
          💼 Đàm Phán Lương
        </button>
        <button class="btn btn-primary" id="btnAcceptTransfer_${club.id}" style="padding: 8px 14px; font-weight: 800; white-space: nowrap; font-size: 0.85rem;">
          ✍️ Ký Ngay
        </button>
      </div>
    `;

    const btnAccept = offerCard.querySelector(`#btnAcceptTransfer_${club.id}`);
    if (btnAccept) {
      btnAccept.onclick = () => {
        closeTransferModal();
        if (onTransferAccept) onTransferAccept(club.id, offerSalary, signingBonus);
      };
    }

    const btnNeg = offerCard.querySelector(`#btnNegTransfer_${club.id}`);
    if (btnNeg) {
      btnNeg.onclick = () => {
        openContractNegotiationModal(player, club, { offerSalary, signingBonus, role }, onTransferAccept);
      };
    }

    container.appendChild(offerCard);
  });

  modal.classList.add('active');
}

export function closeTransferModal() {
  const modal = document.getElementById('transferModal');
  if (modal) modal.classList.remove('active');
}

/**
 * Mini-game Đàm Phán Hợp Đồng Chuyển Nhượng (Contract Negotiation Minigame)
 */
export function openContractNegotiationModal(player, club, baseOffer, onTransferAccept) {
  const modal = document.getElementById('contractNegotiationModal');
  if (!modal) return;

  closeTransferModal();

  let patience = 100;
  let currentRound = 1;
  const maxRounds = 3;
  let curSalary = baseOffer.offerSalary;
  let curBonus = baseOffer.signingBonus;
  const role = baseOffer.role;
  const ovr = getOverallPower(player);

  const directorTitle = `GĐTT ${club.name}`;
  let dialogue = `Chào ${player.name}, chúng tôi đánh giá rất cao năng lực của bạn. Mức lương khởi điểm €${curSalary.toLocaleString()} / week cùng phí lót tay $${curBonus.toLocaleString()} thể hiện trọn vẹn sự tôn trọng từ phía ban lãnh đạo!`;

  function renderNegotiationUI(statusMsg = "") {
    const titleEl = document.getElementById('negModalClubTitle');
    const patienceBar = document.getElementById('negPatienceBar');
    const patienceVal = document.getElementById('negPatienceVal');
    const dialogueEl = document.getElementById('negDialogueText');
    const currentSalaryEl = document.getElementById('negCurrentSalary');
    const currentBonusEl = document.getElementById('negCurrentBonus');
    const roundEl = document.getElementById('negRoundBadge');
    const statusMsgEl = document.getElementById('negStatusMessage');

    if (titleEl) titleEl.innerHTML = `${club.icon} ${club.name} — ${directorTitle}`;
    if (patienceVal) patienceVal.innerText = `${patience}%`;
    if (patienceBar) {
      patienceBar.style.width = `${patience}%`;
      if (patience >= 60) patienceBar.style.background = 'linear-gradient(90deg, #10b981, #34d399)';
      else if (patience >= 30) patienceBar.style.background = 'linear-gradient(90deg, #f59e0b, #fbbf24)';
      else patienceBar.style.background = 'linear-gradient(90deg, #ef4444, #f87171)';
    }
    if (dialogueEl) dialogueEl.innerText = dialogue;
    if (currentSalaryEl) currentSalaryEl.innerText = `€${curSalary.toLocaleString()} / week`;
    if (currentBonusEl) currentBonusEl.innerText = `+$${curBonus.toLocaleString()}`;
    if (roundEl) roundEl.innerText = `Vòng đàm phán ${Math.min(currentRound, maxRounds)}/${maxRounds}`;
    if (statusMsgEl) statusMsgEl.innerHTML = statusMsg;

    const btnSuperstar = document.getElementById('btnNegSuperstar');
    const btnBalanced = document.getElementById('btnNegBalanced');
    const btnAccept = document.getElementById('btnNegAccept');

    if (patience <= 0) {
      if (btnSuperstar) btnSuperstar.disabled = true;
      if (btnBalanced) btnBalanced.disabled = true;
      if (btnAccept) {
        btnAccept.disabled = false;
        btnAccept.innerText = "❌ Rời Bàn Đàm Phán";
        btnAccept.className = "btn btn-secondary";
        btnAccept.onclick = () => closeContractNegotiationModal();
      }
    }
  }

  // Bind actions
  const btnSuperstar = document.getElementById('btnNegSuperstar');
  const btnBalanced = document.getElementById('btnNegBalanced');
  const btnAccept = document.getElementById('btnNegAccept');

  if (btnSuperstar) {
    btnSuperstar.disabled = false;
    btnSuperstar.onclick = () => {
      // Yêu sách Lương Siêu Sao (+35% đến +50%)
      const reqDiff = ovr - (club.skillReq || 75);
      const fameBonus = Math.min(1.0, Math.sqrt(player.fame || 0) / 60);
      const successChance = Math.min(0.85, Math.max(0.18, 0.42 + (reqDiff * 0.05) + (fameBonus * 0.25)));

      if (Math.random() < successChance) {
        const raisePercent = 0.35 + Math.random() * 0.15;
        curSalary = Math.round(curSalary * (1 + raisePercent));
        curBonus = Math.round(curBonus * 1.25);
        patience = Math.min(100, patience + 5);
        dialogue = `GĐTT suy ngẫm rồi thốt lên: "Đòi hỏi rất bạo dạn! Nhưng với đẳng cấp của bạn, CLB quyết định phá lệ phê duyệt mức đãi ngộ siêu sao này!"`;
        renderNegotiationUI(`<span style="color:#10b981; font-weight:800;">🎉 Yêu sách thành công! Lương tăng vọt +${Math.round(raisePercent*100)}%!</span>`);
      } else {
        patience = Math.max(0, patience - 35);
        dialogue = `GĐTT cau mày đập bàn: "Đòi hỏi quá đà! Mức lương đó vượt trần ngân sách CLB, chúng tôi không thể chấp thuận!"`;
        if (patience <= 0) {
          dialogue = `GĐTT đứng dậy rời đi: "Buổi đàm phán chính thức đổ vỡ! Chúng tôi sẽ không ký hợp đồng với cầu thủ thiếu thực tế!"`;
          renderNegotiationUI(`<span style="color:#ef4444; font-weight:800;">💥 Đàm phán đổ vỡ! Lòng kiên nhẫn tụt về 0%.</span>`);
          return;
        }
        renderNegotiationUI(`<span style="color:#ef4444; font-weight:800;">⚠️ CLB từ chối yêu sách! Lòng kiên nhẫn giảm -35%.</span>`);
      }
      currentRound++;
      if (currentRound > maxRounds && patience > 0) {
        if (btnSuperstar) btnSuperstar.disabled = true;
        if (btnBalanced) btnBalanced.disabled = true;
        dialogue = `GĐTT nói: "Đây là đề nghị cuối cùng trước khi đóng bàn đàm phán. Bạn đồng ý ký chứ?"`;
        renderNegotiationUI(`<span style="color:#f59e0b; font-weight:800;">⏳ Đã hết 3 vòng đàm phán! Hãy đưa ra quyết định chốt.</span>`);
      }
    };
  }

  if (btnBalanced) {
    btnBalanced.disabled = false;
    btnBalanced.onclick = () => {
      // Cân bằng Lương + Thưởng (+15%)
      const reqDiff = ovr - (club.skillReq || 75);
      const successChance = Math.min(0.92, Math.max(0.35, 0.65 + (reqDiff * 0.04)));

      if (Math.random() < successChance) {
        curSalary = Math.round(curSalary * 1.15);
        curBonus = Math.round(curBonus * 1.25);
        dialogue = `GĐTT mỉm cười gật đầu: "Một đề xuất rất thiện chí và chuyên nghiệp. Chúng tôi sẵn sàng tăng thêm 15% lương và thưởng lót tay cho bạn!"`;
        renderNegotiationUI(`<span style="color:#10b981; font-weight:800;">✅ CLB đồng thuận! Lương tăng +15%, lót tay tăng +25%.</span>`);
      } else {
        patience = Math.max(0, patience - 15);
        dialogue = `GĐTT thở dài: "Khoản ngân sách hiện tại rất eo hẹp, chúng tôi không thể nhích thêm được lúc này."`;
        if (patience <= 0) {
          dialogue = `GĐTT: "Đàm phán thất bại. Chúc bạn tìm được bến đỗ phù hợp hơn!"`;
          renderNegotiationUI(`<span style="color:#ef4444; font-weight:800;">💥 Đàm phán đổ vỡ!</span>`);
          return;
        }
        renderNegotiationUI(`<span style="color:#f59e0b; font-weight:800;">⚠️ CLB giữ nguyên mức cũ! Lòng kiên nhẫn giảm -15%.</span>`);
      }
      currentRound++;
      if (currentRound > maxRounds && patience > 0) {
        if (btnSuperstar) btnSuperstar.disabled = true;
        if (btnBalanced) btnBalanced.disabled = true;
        dialogue = `GĐTT nói: "Đây là đề xuất tốt nhất của chúng tôi. Hãy đưa ra quyết định cuối cùng!"`;
        renderNegotiationUI(`<span style="color:#f59e0b; font-weight:800;">⏳ Đã hết 3 vòng đàm phán! Hãy đưa ra quyết định chốt.</span>`);
      }
    };
  }

  if (btnAccept) {
    btnAccept.disabled = false;
    btnAccept.innerText = "✍️ Chấp Nhận & Đặt Bút Ký Hợp Đồng";
    btnAccept.className = "btn btn-primary";
    btnAccept.onclick = () => {
      closeContractNegotiationModal();
      if (onTransferAccept) {
        onTransferAccept(club.id, curSalary, curBonus);
      }
    };
  }

  renderNegotiationUI();
  modal.classList.add('active');
}

export function closeContractNegotiationModal() {
  const modal = document.getElementById('contractNegotiationModal');
  if (modal) modal.classList.remove('active');
}

export function acceptTransferOffer(player, clubId, newSalary, signingBonus = 0) {
  const targetClub = ALL_CLUBS.find(c => c.id === clubId);
  if (!targetClub) return null;

  const oldClubName = player.isAcademyStage ? player.academy.name : player.currentClub.name;
  player.isAcademyStage = false;
  player.currentClub = targetClub;
  player.salary = newSalary;
  player.money += signingBonus;
  player.currentEuroStatus = targetClub.defaultEuro || "NONE";

  const clubTag = `${targetClub.icon} ${targetClub.name} (${targetClub.league.flag} ${targetClub.league.name})`;
  if (!player.clubsHistory.includes(clubTag)) {
    player.clubsHistory.push(clubTag);
  }

  player.fame = (player.fame || 0) + 100;
  player.form = Math.min(99, player.form + 8);
  player.morale = 100;

  return {
    oldClubName,
    targetClub,
    signingBonus
  };
}

/* =========================================================================
   3.5 SUPERSTAR MOMENTS (Khoảnh Khắc Siêu Sao - 100% Tích Cực)
   ========================================================================= */
export function rollSuperstarMoment(player) {
  // 20% Chance per phase
  if (Math.random() > 0.20) return null;

  const moments = [
    {
      id: "puskas_goal",
      icon: "🚀",
      title: "SIÊU PHẨM ĐỂ ĐỜI (Puskás Award Nominee)",
      desc: "Cú sút xa đại bác từ cự ly 35m hình cầu vồng găm thẳng vào góc chữ A khiến toàn bộ cầu trường nổ tung! Bàn thắng chính thức lọt vào danh sách đề cử Bàn Thắng Đẹp Nhất Năm (FIFA Puskás Award)!",
      buffDesc: "Tăng +15 Phong độ, Fame +5, Morale 100%",
      apply: (p) => {
        p.form = Math.min(99, p.form + 15);
        p.fame = Math.min(99, p.fame + 5);
        p.morale = 100;
      }
    },
    {
      id: "hattrick_hero",
      icon: "🎩",
      title: "CÚ HAT-TRICK LỊCH SỬ / MÀN TRÌNH DIỄN ĐỂ ĐỜI",
      desc: "Một màn trình diễn thượng thừa làm say đắm hàng triệu người hâm mộ! Chủ tịch câu lạc bộ xuống tận phòng thay đồ trao phong bao THƯỞNG NÓNG tiền mặt đặc quyền!",
      buffDesc: "Thưởng nóng +$650,000 tiền mặt, Phong độ đạt 99",
      apply: (p) => {
        const bonus = 650000;
        p.money += bonus;
        p.form = 99;
        p.morale = 100;
      }
    },
    {
      id: "captain_band",
      icon: "🎖️",
      title: "VINH DỰ TRAO BĂNG ĐỘI TRƯỞNG",
      desc: "Ban huấn luyện và toàn thể phòng thay đồ đồng lòng tín nhiệm trao cho bạn chiếc băng ĐỘI TRƯỞNG của câu lạc bộ! Vị thế thủ lĩnh tuyệt đối giúp toàn đội vững vàng!",
      buffDesc: "Morale 100%, Thể lực hồi +15, Danh tiếng +4",
      apply: (p) => {
        p.morale = 100;
        p.stam = Math.min(100, p.stam + 15);
        p.fame = Math.min(99, p.fame + 4);
      }
    },
    {
      id: "golden_boot_sponsor",
      icon: "👟",
      title: "HỢP ĐỒNG TÀI TRỢ GIÀY VÀNG TOÀN CẦU",
      desc: "Tập đoàn thể thao hàng đầu thế giới ký hợp đồng đại sứ thương hiệu độc quyền và ra mắt dòng giày thi đấu mang tên bạn trên toàn cầu!",
      buffDesc: "Nhận ngay +$1,200,000 tiền mặt, Fame +6",
      apply: (p) => {
        p.money += 1200000;
        p.fame = Math.min(99, p.fame + 6);
        p.morale = 100;
      }
    },
    {
      id: "potm_award",
      icon: "🌟",
      title: "CẦU THỦ XUẤT SẮC NHẤT THÁNG (POTM)",
      desc: "Hiệp hội Cầu thủ Quốc tế chính thức trao giải thưởng CẦU THỦ XUẤT SẮC NHẤT THÁNG (Player of the Month) cho bạn sau chuỗi trận hủy diệt!",
      buffDesc: "Phong độ 99, Fame +4, Kỹ năng chuyên môn +1",
      apply: (p) => {
        p.form = 99;
        p.fame = Math.min(99, p.fame + 4);
        p.attr1 = Math.min(99, p.attr1 + 1);
        p.morale = 100;
      }
    }
  ];

  const moment = moments[Math.floor(Math.random() * moments.length)];
  moment.apply(player);
  return moment;
}

/* =========================================================================
   4. BALLON D'OR WINNER GALA MODAL
   ========================================================================= */
export function showBallonDorWinnerModal(player, onConfirm) {
  const modal = document.getElementById('eventModal');
  const badge = document.getElementById('modalBadge');
  if (!modal || !badge) return;

  badge.className = 'modal-badge badge-award';

  document.getElementById('modalTitle').innerText = "👑 Lễ Trao Giải Quả Bóng Vàng (Ballon d'Or)";
  document.getElementById('modalDesc').innerText = `Toàn bộ khán phòng tại Paris đứng dậy vỗ tay vang dội khi tên của bạn được xướng lên ở vị trí số 1 thế giới! Bạn chính thức đoạt QUẢ BÓNG VÀNG thứ ${player.ballonDorWins} trong sự nghiệp!`;

  const choicesContainer = document.getElementById('modalChoices');
  choicesContainer.innerHTML = '';

  const btn = document.createElement('button');
  btn.className = 'modal-choice-btn';
  btn.type = 'button';
  btn.innerHTML = `<span>🏆 Bước lên bục vinh quang nâng cao Quả Bóng Vàng</span> <span>➔</span>`;
  btn.onclick = function(e) {
    e.stopPropagation();
    modal.classList.remove('active');
    if (onConfirm) onConfirm();
  };
  choicesContainer.appendChild(btn);

  modal.classList.add('active');
}

/* =========================================================================
   5. INTERACTIVE MATCH CENTER (TRẬN CẦU TRỌNG TÂM TRỰC TIẾP)
   ========================================================================= */
export function launchInteractiveMatchCenter(matchInfo, player, onFinishCallback) {
  const modal = document.getElementById('matchCenterModal');
  if (!modal) {
    if (onFinishCallback) onFinishCallback({ homeScore: 2, awayScore: 1, isWin: true });
    return;
  }

  // Setup match state
  const isPlayerHome = Math.random() < 0.55;
  const playerClubName = player.isAcademyStage ? player.academy.name : player.currentClub.name;
  const playerClubIcon = player.isAcademyStage ? player.academy.icon : player.currentClub.icon;
  
  let opponentName = matchInfo.opponentName || (player.rival ? `${player.rival.club}` : "Manchester City");
  let opponentIcon = matchInfo.opponentIcon || (player.rival ? player.rival.avatar : "🔵");

  const homeName = isPlayerHome ? playerClubName : opponentName;
  const homeIcon = isPlayerHome ? playerClubIcon : opponentIcon;
  const awayName = isPlayerHome ? opponentName : playerClubName;
  const awayIcon = isPlayerHome ? opponentIcon : playerClubIcon;

  let homeScore = 0;
  let awayScore = 0;
  let currentStep = 0;
  
  const matchResultStats = {
    goals: 0,
    assists: 0,
    saves: 0,
    cleanSheets: 0,
    tackles: 0,
    isWin: false,
    homeScore: 0,
    awayScore: 0,
    opponentName: opponentName,
    tourneyTitle: matchInfo.tourneyTitle || "Đại Chiến Trọng Tâm"
  };

  // DOM Elements
  const tourneyBadgeEl = document.getElementById('mcTourneyBadge');
  const stadiumInfoEl = document.getElementById('mcStadiumInfo');
  const homeLogoEl = document.getElementById('mcHomeLogo');
  const homeNameEl = document.getElementById('mcHomeName');
  const awayLogoEl = document.getElementById('mcAwayLogo');
  const awayNameEl = document.getElementById('mcAwayName');
  const homeScoreEl = document.getElementById('mcHomeScore');
  const awayScoreEl = document.getElementById('mcAwayScore');
  const timeBadgeEl = document.getElementById('mcTimeBadge');
  const statusTagEl = document.getElementById('mcStatusTag');
  const ballIndicatorEl = document.getElementById('mcBallIndicator');
  const situationCardEl = document.getElementById('mcSituationCard');
  const momentTitleEl = document.getElementById('mcMomentTitle');
  const momentDescEl = document.getElementById('mcMomentDesc');
  const choicesContainerEl = document.getElementById('mcChoicesContainer');
  const eventsFeedEl = document.getElementById('mcEventsFeed');
  const btnSkipEl = document.getElementById('mcBtnSkipMatch');

  if (tourneyBadgeEl) tourneyBadgeEl.innerText = matchInfo.tourneyTitle || "🔥 ĐẠI CHIẾN TRỌNG TÂM";
  if (stadiumInfoEl) stadiumInfoEl.innerText = `🏟️ ${matchInfo.stadium || "Sân Vận Động Quốc Tế"} — 82,500 Khán Giả`;
  
  if (homeLogoEl) homeLogoEl.innerText = homeIcon;
  if (homeNameEl) homeNameEl.innerText = homeName;
  if (awayLogoEl) awayLogoEl.innerText = awayIcon;
  if (awayNameEl) awayNameEl.innerText = awayName;

  if (homeScoreEl) homeScoreEl.innerText = "0";
  if (awayScoreEl) awayScoreEl.innerText = "0";
  if (timeBadgeEl) timeBadgeEl.innerText = "⏱️ Phút 1'";
  if (statusTagEl) statusTagEl.innerText = "⚡ Hiệp 1 Bắt Đầu";
  if (ballIndicatorEl) ballIndicatorEl.style.left = "50%";
  if (eventsFeedEl) eventsFeedEl.innerHTML = `<div class="mc-event-item"><span class="ev-min">0'</span> <span>Trọng tài nổi hồi còi khai cuộc! Khán đài bùng nổ âm thanh.</span></div>`;

  const moments = generateMomentsForMatch(player, matchInfo);

  function addMatchEvent(minute, icon, text) {
    if (!eventsFeedEl) return;
    const item = document.createElement('div');
    item.className = 'mc-event-item';
    item.innerHTML = `<span class="ev-min">${minute}'</span> <span>${icon} ${text}</span>`;
    eventsFeedEl.insertBefore(item, eventsFeedEl.firstChild);
  }

  function updateScoreboard() {
    if (homeScoreEl) homeScoreEl.innerText = homeScore;
    if (awayScoreEl) awayScoreEl.innerText = awayScore;
  }

  function renderMoment(index) {
    if (index >= moments.length) {
      finishMatch();
      return;
    }

    const m = moments[index];
    if (timeBadgeEl) timeBadgeEl.innerText = `⏱️ Phút ${m.minute}'`;
    if (momentTitleEl) momentTitleEl.innerText = `⚡ Phút ${m.minute}: ${m.title}`;
    if (momentDescEl) momentDescEl.innerText = m.desc;
    if (ballIndicatorEl) ballIndicatorEl.style.left = isPlayerHome ? `${m.ballPitchPercent}%` : `${100 - m.ballPitchPercent}%`;

    choicesContainerEl.innerHTML = '';

    m.choices.forEach(choice => {
      const choiceText = typeof choice.text === 'function' ? choice.text(player) : choice.text;
      let statHintText = typeof choice.statHint === 'function' ? choice.statHint(player) : choice.statHint;
      const baseChance = choice.successChance(player);

      const isDribble = choice.isDribble || /rê|lừa|Elastico|Rabona/i.test(choiceText);
      const isShooting = choice.isShooting || /sút|dứt điểm|cứa lòng|đại bác|lốp bóng|vô-lê/i.test(choiceText);
      const dribbleStat = Math.max(Number(player.stats?.dri) || 0, Number(player.subStats?.dribbling) || 0);
      const shootingStat = Math.max(Number(player.stats?.sho) || 0, Number(player.subStats?.finishing) || 0, Number(player.subStats?.shotPower) || 0);
      const isBreakthroughCritical = (isDribble && dribbleStat >= 100) || (isShooting && shootingStat >= 100);

      const finalChance = isBreakthroughCritical ? Math.min(0.99, baseChance + 0.12) : baseChance;
      const winRate = Math.round(finalChance * 100);

      if (isBreakthroughCritical) {
        statHintText += ` | ⚡ Đột Phá Thần Thoại: Tỷ lệ chí mạng, bỏ qua cản phá!`;
      }

      const card = document.createElement('div');
      card.className = `mc-choice-card ${isBreakthroughCritical ? 'mc-choice-breakthrough' : ''}`;
      card.innerHTML = `
        <div class="mc-choice-top">
          <span class="mc-choice-label">${choiceText}</span>
          <span class="mc-choice-rate">⚡ Tỷ lệ: ${winRate}%</span>
        </div>
        <div class="mc-choice-req">
          ${statHintText}
        </div>
      `;

      card.onclick = () => {
        const roll = Math.random();
        const isSuccess = roll <= finalChance;

        if (isSuccess) {
          choice.onSuccess(player, matchResultStats);
          if (isPlayerHome) homeScore++; else awayScore++;
          updateScoreboard();
          let sText = typeof choice.successText === 'function' ? choice.successText(player) : choice.successText;
          if (isShooting && shootingStat >= 100) {
            sText = '⚡ SIÊU PHẨM THẦN THOẠI! Quỹ đạo bóng xé gió vượt ngưỡng con người, thủ môn chỉ có thể đứng nhìn trong tuyệt vọng!';
          } else if (isDribble && dribbleStat >= 100) {
            sText = '⚡ VŨ ĐIỆU BẤT KHẢ XÂM PHẠM! Pha rê bóng đạt cảnh giới thần thoại khiến mọi pha tắc bóng đều bị hóa giải hoàn toàn!';
          }
          addMatchEvent(m.minute, "⚽", sText);
        } else {
          choice.onFailure(player, matchResultStats);
          if (isDribble && (player.skillMoves >= 6 || dribbleStat >= 100)) {
            addMatchEvent(m.minute, "🪄", `Đối thủ cố phạm lỗi truy cản nhưng đôi chân đạt cảnh giới thần thoại thoăn thoắt né đòn an toàn!`);
          }
          // Opponent might score on counter
          if (Math.random() < 0.4) {
            if (isPlayerHome) awayScore++; else homeScore++;
            updateScoreboard();
            addMatchEvent(m.minute, "⚠️", `Đối phương phản công nhanh và ghi bàn gỡ!`);
          } else {
            addMatchEvent(m.minute, "❌", choice.failureText);
          }
        }

        currentStep++;
        setTimeout(() => {
          renderMoment(currentStep);
        }, 1200);
      };

      choicesContainerEl.appendChild(card);
    });
  }

  function finishMatch() {
    if (timeBadgeEl) timeBadgeEl.innerText = "⏱️ HẾT GIỜ (90+4')";
    if (statusTagEl) statusTagEl.innerText = "🏁 TRẬN ĐẤU KẾT THÚC";
    if (ballIndicatorEl) ballIndicatorEl.style.left = "50%";

    const playerScore = isPlayerHome ? homeScore : awayScore;
    const oppScore = isPlayerHome ? awayScore : homeScore;
    const isPlayerWin = playerScore >= oppScore;

    matchResultStats.homeScore = homeScore;
    matchResultStats.awayScore = awayScore;
    matchResultStats.isWin = isPlayerWin;

    // Clean sheet check for GK/DF
    if (oppScore === 0) {
      matchResultStats.cleanSheets = 1;
      player.totalCareerCleanSheets += 1;
    }

    situationCardEl.innerHTML = `
      <div class="mc-celebration-banner">
        <div class="mc-celebration-title">
          ${isPlayerWin ? '🏆 CHIẾN THẮNG VANG DỘI!' : '🥈 TRẬN ĐẤU CỐNG HIẾN KHÉP LẠI'}
        </div>
        <div class="mc-celebration-desc">
          Tỷ số chung cuộc: <strong>${homeName} ${homeScore} - ${awayScore} ${awayName}</strong>.<br>
          Màn trình diễn của bạn: ⚽ ${matchResultStats.goals} bàn, 🎯 ${matchResultStats.assists} kiến tạo, 🧤 ${matchResultStats.saves} cứu thua!
        </div>
        <button class="btn-lifestyle gold" id="mcBtnProceedNext" style="margin-top:10px; width:100%; justify-content:center;">
          ➔ Tiếp Tục Hành Trình Mùa Giải
        </button>
      </div>
    `;

    const btnProceed = document.getElementById('mcBtnProceedNext');
    if (btnProceed) {
      btnProceed.onclick = () => {
        modal.classList.remove('active');
        if (onFinishCallback) onFinishCallback(matchResultStats);
      };
    }
  }

  // Skip / Quick simulate
  if (btnSkipEl) {
    btnSkipEl.onclick = () => {
      // Auto resolve remaining moments
      for (let i = currentStep; i < moments.length; i++) {
        const m = moments[i];
        if (Math.random() < 0.65) {
          if (isPlayerHome) homeScore++; else awayScore++;
          if (player.position === "GK") matchResultStats.saves += 2;
          else { matchResultStats.goals += 1; player.totalCareerGoals += 1; }
        } else if (Math.random() < 0.35) {
          if (isPlayerHome) awayScore++; else homeScore++;
        }
      }
      updateScoreboard();
      finishMatch();
    };
  }

  modal.classList.add('active');
  renderMoment(0);
}

/* =========================================================================
   EVENTS MODULE ADDITIONS — INJURY DILEMMA + DYNAMIC MATCH MOMENTS
   Append this content after line 887 of events.js
   ========================================================================= */

/* =========================================================================
   6. INJURY DILEMMA MODAL
   ========================================================================= */
export function showInjuryDilemmaModal(player, injuryData, onDecide) {
  const modal = document.getElementById('eventModal');
  const badge = document.getElementById('modalBadge');
  if (!modal || !badge) {
    if (onDecide) onDecide('REST');
    return;
  }

  const sevLabel = { 
    LIGHT: 'Nhẹ (Cần tĩnh dưỡng ngắn hạn)', 
    MEDIUM: 'Trung Bình (Căng cơ / tổn thương gân)', 
    CRITICAL: 'Rất Nặng (Nguy cơ biến chứng lâu dài)' 
  };

  badge.className = 'modal-badge badge-injury';
  document.getElementById('modalTitle').innerText = `🚑 BÁO CÁO Y TẾ: ${injuryData.name.toUpperCase()}`;
  document.getElementById('modalDesc').innerText =
    `• Mức độ tổn thương: ${sevLabel[injuryData.severity] || injuryData.severity}\n` +
    `• Thời gian dự kiến hồi phục: Cần tĩnh dưỡng ${injuryData.phasesRemaining} chặng thi đấu.\n\n` +
    `⚠️ CẢNH BÁO TỪ BÁC SĨ CLB: Nếu cố tình tiêm thuốc giảm đau để nén đau ra sân, bạn có 60% nguy cơ gặp biến chứng chấn thương nặng hơn và phải nghỉ thi đấu thêm ${Math.round(injuryData.phasesRemaining * 1.5)} chặng!`;

  const container = document.getElementById('modalChoices');
  container.innerHTML = '';

  const choices = [
    { text: '🛌 Nghỉ Ngơi & Vật Lý Trị Liệu (Khuyên Dùng - An Toàn Tuyệt Đối)', action: 'REST' },
    { text: '💉 Tiêm Thuốc Giảm Đau Nén Đau Ra Sân (Rủi Ro Cực Cao)', action: 'PLAY_THROUGH' },
  ];

  choices.forEach(ch => {
    const btn = document.createElement('button');
    btn.className = 'modal-choice-btn';
    btn.type = 'button';
    btn.innerHTML = `<span>${ch.text}</span><span>&#x27A4;</span>`;
    btn.onclick = (e) => {
      e.stopPropagation();
      modal.classList.remove('active');

      if (ch.action === 'PLAY_THROUGH') {
        const roll = Math.random();
        if (roll < 0.60) {
          injuryData.severity = 'CRITICAL';
          injuryData.phasesRemaining = Math.round(injuryData.phasesRemaining * 1.5) + 1;
          injuryData.riskOfRecurrence = Math.min(0.9, injuryData.riskOfRecurrence + 0.25);
          player.stam = Math.max(5, (player.stam || 60) - 25);
        } else {
          player.fame = (player.fame || 0) + 50;
          player.morale = Math.min(100, (player.morale || 80) + 10);
        }
      }

      player.injury = {
        isInjured:        true,
        name:             injuryData.name,
        severity:         injuryData.severity,
        phasesRemaining:  injuryData.phasesRemaining,
        riskOfRecurrence: injuryData.riskOfRecurrence,
      };
      const formPenalty = injuryData.severity === 'CRITICAL' ? 20 : injuryData.severity === 'MEDIUM' ? 12 : 6;
      player.form = Math.max(20, (player.form || 60) - formPenalty);

      if (onDecide) onDecide(ch.action);
    };
    container.appendChild(btn);
  });

  modal.classList.add('active');
}

/* =========================================================================
   7. DYNAMIC MATCH MOMENT BANK — 15+ moments theo vị trí (Chuẩn tiếng Việt có dấu)
   ========================================================================= */

const GK_MOMENT_BANK = [
  {
    title: 'Phản Xạ Cận Thành',
    desc: 'Tiền đạo đối phương nhận đường chuyền xé toang hàng thủ và dứt điểm cận thành từ cự ly 5 mét!',
    ballPitchPercent: 12,
    choices: [
      { text: 'Thu hẹp góc sút, hạ trọng tâm tạo thành bức tường sống',
        statHint: 'Yêu cầu: Phản Xạ + Chọn Vị Trí',
        successChance: (p) => Math.min(0.88, (p.attr1 * 0.006) + (p.attr4 * 0.003) + (p.form * 0.001)),
        successText: 'CỨU THUA XUẤT THẦN! Chọn vị trí chuẩn xác khiến cú sút dội ngược ra ngoài!',
        failureText: 'Bóng đi hiểm hóc qua nách bay thẳng vào lưới!',
        onSuccess: (p, r) => { r.saves += 2; p.totalCareerSaves = (p.totalCareerSaves || 0) + 2; p.form = Math.min(99, p.form + 5); },
        onFailure: (p) => { p.morale = Math.max(40, p.morale - 7); p.form = Math.max(30, p.form - 5); } },
      { text: 'Bay người cản phá bằng những đầu ngón tay',
        statHint: 'Yêu cầu: Phản Xạ + Sải Tay',
        successChance: (p) => Math.min(0.85, (p.attr1 * 0.007) + (p.form * 0.002)),
        successText: 'BAY NGƯỜI CỨU THUA KHÔNG TƯỞNG! Đầu ngón tay đẩy bóng chạm mép xà ngang đổi hướng!',
        failureText: 'Bóng đập tay bay thẳng vào lưới!',
        onSuccess: (p, r) => { r.saves += 1; p.totalCareerSaves = (p.totalCareerSaves || 0) + 1; },
        onFailure: (p) => { p.morale = Math.max(40, p.morale - 5); } }
    ]
  },
  {
    title: 'Bắt Phạt Đền 11m Trong Hiệp Phụ',
    desc: 'Trận đấu bước vào những phút sinh tử, trọng tài chỉ tay vào chấm 11m! Tất cả kỳ vọng đè nặng lên đôi găng của bạn!',
    ballPitchPercent: 10,
    choices: [
      { text: 'Bắt bài hướng sút, đổ người dứt khoát',
        statHint: 'Yêu cầu: Bản Lĩnh (Fame) + Phản Xạ',
        successChance: (p) => Math.min(0.82, (p.attr1 * 0.005) + (p.fame * 0.003) + (p.morale * 0.001)),
        successText: 'ĐẨY PHẠT ĐỀN THẦN SẦU! Đổ người chính xác giữ vững tỷ số nghẹt thở cho đội nhà!',
        failureText: 'Cú sút hiểm hóc đánh lừa hướng phán đoán!',
        onSuccess: (p, r) => { 
          r.saves += 3; 
          p.totalCareerSaves = (p.totalCareerSaves || 0) + 3; 
          p.fame = Math.min(99, p.fame + 8); 
          p.form = 99; 
          recordChronicleMilestone(p, 'CLUTCH_MOMENT', { desc: 'Cản phá xuất thần quả phạt đền ở phút cuối, cứu rỗi trận cầu đỉnh cao!' });
        },
        onFailure: (p) => { p.morale = Math.max(30, p.morale - 12); } }
    ]
  },
  {
    title: 'Phát Bóng Nhanh Mở Đường Phản Công',
    desc: 'Bạn ôm gọn quả tạt của đối phương. Cơ hội tung ra đường chuyền dài phản công chớp nhoáng!',
    ballPitchPercent: 20,
    choices: [
      { text: 'Phát bóng dài chuẩn xác vào khoảng trống cho tiền đạo',
        statHint: 'Yêu cầu: Phát Bóng (Kicking)',
        successChance: (p) => Math.min(0.84, (p.attr3 * 0.006) + (p.stam * 0.002)),
        successText: 'KHỞI NGUỒN BÀN THẮNG KINH ĐIỂN! Đường phát bóng dài chuẩn từng milimet xé toang đội hình đối thủ!',
        failureText: 'Đường chuyền đi quá sâu bị hậu vệ đối phương đánh chặn.',
        onSuccess: (p, r) => { r.assists += 1; p.totalCareerAssists = (p.totalCareerAssists || 0) + 1; p.fame = Math.min(99, p.fame + 3); },
        onFailure: (p) => { p.form = Math.max(35, p.form - 4); } }
    ]
  },
  {
    title: 'Không Chiến Tranh Chấp Bóng Bổng',
    desc: 'Đối phương rót bóng bổng vào khu vực 5m50 cho tiền đạo cao kều băng vào đánh đầu!',
    ballPitchPercent: 15,
    choices: [
      { text: 'Bật cao đấm bóng ra xa dứt khoát',
        statHint: 'Yêu cầu: Bắt Bóng (Handling) + Thể Lực',
        successChance: (p) => Math.min(0.87, (p.attr2 * 0.007) + (p.stam * 0.002)),
        successText: 'LÀM CHỦ KHÔNG GIAN HOÀN HẢO! Bật cao đấm bóng giải tỏa toàn bộ sức ép!',
        failureText: 'Bóng trượt tay suýt chút nữa dẫn đến bàn thua.',
        onSuccess: (p, r) => { r.saves += 1; p.totalCareerSaves = (p.totalCareerSaves || 0) + 1; },
        onFailure: (p) => { p.morale = Math.max(40, p.morale - 6); } }
    ]
  },
  {
    title: 'Đối Mặt Sức Ép Pressing Tầm Cao',
    desc: 'Tiền đạo đối phương dâng cao vây ráp gắt gao ngay trong vòng cấm!',
    ballPitchPercent: 18,
    choices: [
      { text: 'Bình tĩnh quan sát, điều tiết nhịp chuyền bóng thoát vây',
        statHint: 'Yêu cầu: Chọn Vị Trí + Bản Lĩnh',
        successChance: (p) => Math.min(0.86, (p.attr4 * 0.006) + (p.morale * 0.003)),
        successText: 'BẢN LĨNH ĐẲNG CẤP! Thoát pressing xuất sắc giúp đồng đội mở ra hướng tấn công mới!',
        failureText: 'Bóng bị cướp ngay sát rìa vòng cấm địa nguy hiểm!',
        onSuccess: (p, r) => { r.saves += 1; p.totalCareerSaves = (p.totalCareerSaves || 0) + 1; p.morale = Math.min(100, p.morale + 6); },
        onFailure: (p) => { p.morale = Math.max(35, p.morale - 8); p.form = Math.max(30, p.form - 6); } }
    ]
  }
];

const DF_MOMENT_BANK = [
  {
    title: 'Phản Công Tốc Độ Bọc Lót Cánh',
    desc: 'Tiền đạo cánh đối phương vượt qua hậu vệ biên, chuẩn bị căng ngang nguy hiểm!',
    ballPitchPercent: 30,
    choices: [
      { text: 'Xoạc bóng cắt đường căng ngang chuẩn xác',
        statHint: 'Yêu cầu: Tắc Bóng + Đọc Tình Huống',
        successChance: (p) => Math.min(0.88, (p.attr1 * 0.007) + (p.attr4 * 0.003)),
        successText: 'CÚ XOẠC BÓNG ĐẲNG CẤP! Phá bóng chịu phạt góc an toàn tuyệt đối!',
        failureText: 'Pha xoạc hụt mở ra khoảng trống mênh mông cho đối thủ!',
        onSuccess: (p, r) => { r.tackles += 3; p.totalCareerTackles = (p.totalCareerTackles || 0) + 3; },
        onFailure: (p) => { p.form = Math.max(30, p.form - 6); } },
      { text: 'Dùng sức mạnh tì đè ép đối phương ra sát đường biên',
        statHint: 'Yêu cầu: Sức Mạnh + Tắc Bóng',
        successChance: (p) => Math.min(0.84, (p.attr2 * 0.006) + (p.attr1 * 0.003)),
        successText: 'HÒN ĐÁ TẢNG PHÒNG NGỰ! Khóa chặt ngòi nổ đối phương bằng sức mạnh vượt trội!',
        failureText: 'Phạm lỗi trong vòng cấm, trọng tài thổi phạt đền!',
        onSuccess: (p, r) => { r.tackles += 2; p.totalCareerTackles = (p.totalCareerTackles || 0) + 2; },
        onFailure: (p) => { p.morale = Math.max(35, p.morale - 8); } }
    ]
  },
  {
    title: 'Chỉ Huy Bẫy Việt Vị',
    desc: 'Hàng thủ đội nhà tổ chức dâng cao, bạn là chốt chặn chỉ huy bẫy việt vị!',
    ballPitchPercent: 28,
    choices: [
      { text: 'Dâng cao đúng nhịp, đẩy tiền đạo đối phương vào thế việt vị',
        statHint: 'Yêu cầu: Đọc Tình Huống + Tinh Thần',
        successChance: (p) => Math.min(0.87, (p.attr4 * 0.007) + (p.morale * 0.002)),
        successText: 'BẪY VIỆT VỊ MẪU MỰC! Trọng tài biên lập tức phất cờ báo lỗi!',
        failureText: 'Tính toán sai thời điểm, tiền đạo đối phương thoát xuống ở tư thế hợp lệ!',
        onSuccess: (p, r) => { r.tackles += 2; p.totalCareerTackles = (p.totalCareerTackles || 0) + 2; p.morale = Math.min(100, p.morale + 5); },
        onFailure: (p) => { p.form = Math.max(30, p.form - 5); } }
    ]
  },
  {
    title: 'Không Chiến Đánh Đầu Phá Bóng',
    desc: 'Đối phương treo bóng bổng vào vòng 16m50 tìm kiếm tiền đạo mục tiêu!',
    ballPitchPercent: 25,
    choices: [
      { text: 'Bật cao tì đè đánh đầu giải vây dũng mãnh',
        statHint: 'Yêu cầu: Không Chiến + Sức Mạnh',
        successChance: (p) => Math.min(0.88, (p.attr3 * 0.007) + (p.attr2 * 0.003)),
        successText: 'THỐNG TRỊ KHÔNG CHIẾN! Đánh đầu phá bóng ngay trên tầm với của đối thủ!',
        failureText: 'Thua thiệt trong pha tranh chấp dẫn tới tình huống lộn xộn!',
        onSuccess: (p, r) => { r.tackles += 2; p.totalCareerTackles = (p.totalCareerTackles || 0) + 2; },
        onFailure: (p) => { p.morale = Math.max(40, p.morale - 6); } }
    ]
  },
  {
    title: 'Phất Bóng Dài Kiến Thiết Từ Sân Nhà',
    desc: 'Cướp được bóng sau pha phòng ngự, bạn phát hiện tiền đạo đội nhà đang bứt tốc trống trải!',
    ballPitchPercent: 40,
    choices: [
      { text: 'Phất bóng dài vượt tuyến xé toang hàng phòng ngự đối phương',
        statHint: 'Yêu cầu: Đọc Tình Huống + Thể Lực',
        successChance: (p) => Math.min(0.85, (p.attr4 * 0.006) + (p.stam * 0.002)),
        successText: 'ĐƯỜNG KIẾN TẠO NGOẠN MỤC! Bóng rót thẳng vào đà chạy của tiền đạo lập công!',
        failureText: 'Đường phất bóng thiếu lực bị tiền vệ đối phương chặn đứng.',
        onSuccess: (p, r) => { r.assists += 1; p.totalCareerAssists = (p.totalCareerAssists || 0) + 1; p.morale = Math.min(100, p.morale + 5); },
        onFailure: (p) => { p.form = Math.max(30, p.form - 5); } },
      { text: 'Chuyền an toàn duy trì quyền kiểm soát',
        statHint: 'Yêu cầu: Chuyền Bóng + Bản Lĩnh',
        successChance: (p) => Math.min(0.92, (p.attr1 * 0.005) + (p.morale * 0.003)),
        successText: 'BẢO TOÀN THẾ TRẬN! Điều tiết nhịp độ trận đấu khôn ngoan.',
        failureText: 'Đường chuyền ngang bất cẩn bị đối phương áp sát!',
        onSuccess: (p, r) => { r.tackles += 1; },
        onFailure: (p) => { p.morale = Math.max(40, p.morale - 4); } }
    ]
  },
  {
    title: 'Dâng Cao Tham Gia Phạt Góc Phút Bù Giờ',
    desc: 'Phút 90+2, tỷ số đang hòa! Bạn dâng cao vào vòng cấm đối phương đón quả phạt góc quyết định!',
    ballPitchPercent: 85,
    choices: [
      { text: 'Bật cao đánh đầu dũng mãnh vào góc xa',
        statHint: 'Yêu cầu: Không Chiến + Bản Lĩnh',
        successChance: (p) => Math.min(0.84, (p.attr3 * 0.007) + (p.morale * 0.003)),
        successText: 'VÀOOOOO! CÚ ĐÁNH ĐẦU ĐỊNH ĐOẠT TRẬN ĐẤU Ở PHÚT BÙ GIỜ!',
        failureText: 'Cú đánh đầu đi chệch cột dọc trong gang tấc!',
        onSuccess: (p, r) => { 
          r.goals += 1; 
          p.totalCareerGoals = (p.totalCareerGoals || 0) + 1; 
          p.fame = Math.min(99, p.fame + 10);
          recordChronicleMilestone(p, 'CLUTCH_MOMENT', { desc: 'Dâng cao đánh đầu ghi bàn quyết định phút bù giờ, mang về chiến thắng nghẹt thở!' });
        },
        onFailure: (p) => { p.form = Math.max(40, p.form - 4); } }
    ]
  }
];

export const FW_MF_MOMENT_BANK = [
  {
    title: 'Phản Công Thần Tốc Góc Rộng',
    category: 'HYBRID',
    weights: { FW: 20, MF: 12 },
    desc: 'Bạn nhận đường chuyền vượt tuyến và bứt tốc băng xuống đối mặt cặp trung vệ đối phương!',
    ballPitchPercent: 75,
    choices: [
      { text: 'Tự dứt điểm cứa lòng kỹ thuật vào góc xa',
        statHint: 'Yêu cầu: Dứt Điểm + Tốc Độ',
        successChance: (p) => Math.min(0.89, (p.attr1 * 0.007) + (p.attr2 * 0.003)),
        successText: 'SIÊU PHẨM CỨA LÒNG! Quả bóng vẽ đường cong hoàn mỹ găm thẳng vào góc chữ A!',
        failureText: 'Cú sút đi hơi nhẹ bị thủ môn ôm gọn.',
        onSuccess: (p, r) => { r.goals += 1; p.totalCareerGoals = (p.totalCareerGoals || 0) + 1; p.fame = Math.min(99, p.fame + 4); },
        onFailure: (p) => { p.form = Math.max(40, p.form - 4); } },
      { text: 'Chọc khe dọn cỗ cho đồng đội băng vào đệm bóng',
        statHint: 'Yêu cầu: Nhãn Quan + Chuyền Bóng',
        successChance: (p) => Math.min(0.88, (p.attr3 * 0.005) + (p.attr4 * 0.005)),
        successText: 'KIẾN TẠO THẦN SẦU! Đường chuyền loại bỏ toàn bộ hàng thủ cho đồng đội ghi bàn!',
        failureText: 'Đường chuyền bị trung vệ đối phương rướn chân cắt được.',
        onSuccess: (p, r) => { r.assists += 1; p.totalCareerAssists = (p.totalCareerAssists || 0) + 1; p.fame = Math.min(99, p.fame + 3); },
        onFailure: (p) => { p.morale = Math.max(40, p.morale - 4); } }
    ]
  },
  {
    title: 'Rê Bóng Đột Phá Nách Trung Lộ',
    category: 'GOAL',
    weights: { FW: 22, MF: 10 },
    desc: 'Trận đấu đang ở thế giằng co, bạn cầm bóng trước rìa vòng cấm địa!',
    ballPitchPercent: 80,
    choices: [
      { text: (p) => (p && p.skillMoves >= 6) ? '🪄 [Trickster+] Đảo chân Elastico kép xâu kim qua 2 hậu vệ xộc thẳng vào cấm địa' : 'Đi bóng lắt léo vượt qua 2 hậu vệ xộc thẳng vào cấm địa',
        statHint: (p) => (p && p.skillMoves >= 6) ? 'Trickster+ (6⭐): +25% Tỷ lệ qua người [Rê Bóng + Khéo Léo + Thăng Bằng]' : ((p && p.skillMoves >= 4) ? `Kỹ thuật ${p.skillMoves}⭐ (+${p.skillMoves === 5 ? 15 : 10}% tỷ lệ) [Rê Bóng + Khéo Léo + Thăng Bằng]` : 'Yêu cầu: Rê Bóng + Khéo Léo + Thăng Bằng (DRI + AGI + BAL)'),
        isDribble: true,
        successChance: (p) => {
          const sm = p?.skillMoves || 3;
          const smBonus = sm >= 6 ? 0.25 : (sm === 5 ? 0.15 : (sm === 4 ? 0.10 : 0));
          const drib = getSubStat(p, 'dribbling', 'dri');
          const agi = getSubStat(p, 'agility', 'dri');
          const bal = getSubStat(p, 'balance', 'dri');
          return Math.min(0.95, (drib * 0.004) + (agi * 0.003) + (bal * 0.002) + smBonus);
        },
        successText: (p) => (p && p.skillMoves >= 6) ? 'ẢO THUẬT GIA TRICKSTER+! Cú Elastico kép xâu kim 2 hậu vệ không thể tin nổi trước khi nã đại bác tung nóc lưới!' : 'VŨ ĐIỆU SÂN CỎ! Nhảy múa qua 2 hậu vệ rồi dứt điểm tung nóc lưới!',
        failureText: 'Hậu vệ đối phương phạm lỗi kín lấy bóng.',
        onSuccess: (p, r) => { r.goals += 1; p.totalCareerGoals = (p.totalCareerGoals || 0) + 1; p.form = Math.min(99, p.form + 6); },
        onFailure: (p) => { p.morale = Math.max(40, p.morale - 5); } },
      { text: 'Nã đại bác sút xa từ cự ly 25 mét',
        statHint: 'Yêu cầu: Sút Xa + Lực Sút (Long Shots + Shot Power)',
        successChance: (p) => {
          const lShot = getSubStat(p, 'longShots', 'sho');
          const sPow = getSubStat(p, 'shotPower', 'sho');
          return Math.min(0.88, (lShot * 0.005) + (sPow * 0.004) + ((p.morale || 70) * 0.001));
        },
        successText: 'BÀN THẮNG ĐỂ ĐỜI! Cú sút như trái phá với vận tốc 115 km/h không thể cản phá!',
        failureText: 'Cú sút đập trúng xà ngang nảy ra ngoài!',
        onSuccess: (p, r) => { r.goals += 1; p.totalCareerGoals = (p.totalCareerGoals || 0) + 1; p.fame = Math.min(99, p.fame + 6); },
        onFailure: (p) => { p.form = Math.max(35, p.form - 5); } }
    ]
  },
  {
    title: 'Đá Phạt Trực Tiếp Nguy Hiểm',
    category: 'PLAYMAKING',
    weights: { FW: 10, MF: 24 },
    desc: 'Đội nhà được hưởng quả phạt hàng rào cự ly 22 mét. Hàng rào đối phương đang dựng đặc quánh!',
    ballPitchPercent: 85,
    choices: [
      { text: 'Sút xoáy hình quả chuối vượt qua hàng rào vào góc chết',
        statHint: 'Yêu cầu: Đá Phạt + Độ Xoáy + Lực Sút (FK + Curve + Shot Power)',
        successChance: (p) => {
          const fk = getSubStat(p, 'freeKick', 'pas');
          const crv = getSubStat(p, 'curve', 'pas');
          const pow = getSubStat(p, 'shotPower', 'sho');
          return Math.min(0.92, (fk * 0.004) + (crv * 0.003) + (pow * 0.002) + ((p.form || 70) * 0.001));
        },
        successText: 'SIÊU PHẨM SÚT PHẠT! Bóng lượn qua hàng rào găm thẳng vào góc chữ A tuyệt mỹ!',
        failureText: 'Bóng dội trúng hàng rào bật ra ngoài.',
        onSuccess: (p, r) => { r.goals += 1; p.totalCareerGoals = (p.totalCareerGoals || 0) + 1; p.fame = Math.min(99, p.fame + 5); p.form = 99; },
        onFailure: (p) => { p.form = Math.max(35, p.form - 6); } },
      { text: 'Sút chìm hiểm hóc dưới chân hàng rào nhảy lên',
        statHint: 'Yêu cầu: Đá Phạt + Nhãn Quan (Free Kick + Vision)',
        successChance: (p) => {
          const fk = getSubStat(p, 'freeKick', 'pas');
          const vis = getSubStat(p, 'vision', 'pas');
          return Math.min(0.86, (fk * 0.005) + (vis * 0.004) + ((p.attr2 || 70) * 0.001));
        },
        successText: 'QUÁ TINH QUÁI! Cú sút chìm qua chân hàng rào khiến thủ môn hoàn toàn đứng chôn chân!',
        failureText: 'Cú sút bị hậu vệ kịp thời khép góc chặn lại.',
        onSuccess: (p, r) => { r.goals += 1; p.totalCareerGoals = (p.totalCareerGoals || 0) + 1; p.morale = 100; },
        onFailure: (p) => { p.morale = Math.max(40, p.morale - 5); } }
    ]
  },
  {
    title: 'Thống Trị Nhịp Độ Tuyến Giữa',
    category: 'PLAYMAKING',
    weights: { FW: 4, MF: 32 },
    desc: 'Trận đại chiến đang diễn ra căng thẳng. Bạn nắm vai trò nhạc trưởng điều tiết thế trận!',
    ballPitchPercent: 65,
    choices: [
      { text: 'Chọc khe xẻ nách hàng thủ mở toang cơ hội ghi bàn',
        statHint: 'Yêu cầu: Nhãn Quan + Chuyền Ngắn (Vision + Short Passing)',
        successChance: (p) => {
          const vis = getSubStat(p, 'vision', 'pas');
          const sp = getSubStat(p, 'shortPassing', 'pas');
          return Math.min(0.90, (vis * 0.005) + (sp * 0.004) + ((p.attr4 || 70) * 0.001));
        },
        successText: 'NHẠC TRƯỞNG BẬC THẦY! Đường chuyền dọn cỗ không thể chối từ để đồng đội lập công!',
        failureText: 'Đường chuyền bị đối phương bắt bài phản công.',
        onSuccess: (p, r) => { r.assists += 1; p.totalCareerAssists = (p.totalCareerAssists || 0) + 1; },
        onFailure: (p) => { p.morale = Math.max(40, p.morale - 4); } }
    ]
  },
  {
    title: 'Penalty Định Đoạt Danh Hiệu',
    category: 'GOAL',
    weights: { FW: 24, MF: 8 },
    desc: 'Phút 90+2, bạn bước lên chấm 11m trước sức ép nghẹt thở của hơn 80.000 khán giả!',
    ballPitchPercent: 90,
    choices: [
      { text: 'Sút Panenka điệu nghệ phong cách GOAT',
        statHint: 'Yêu cầu: Phạt Đền + Điềm Tĩnh Dưới Áp Lực (Penalties + Composure)',
        successChance: (p) => {
          const pen = getSubStat(p, 'penalties', 'sho');
          const comp = getSubStat(p, 'composure', 'dri');
          return Math.min(0.92, (pen * 0.005) + (comp * 0.004) + ((p.fame || 70) * 0.001));
        },
        successText: 'PANENKA ĐẲNG CẤP VĨ ĐẠI! Trái bóng nhẹ nhàng bay vào lưới giữa tiếng hò reo vang dội!',
        failureText: 'Thủ môn đứng yên ôm gọn cú sút!',
        onSuccess: (p, r) => { 
          r.goals += 1; 
          p.totalCareerGoals = (p.totalCareerGoals || 0) + 1; 
          p.fame = Math.min(99, p.fame + 10); 
          p.form = 99;
          recordChronicleMilestone(p, 'CLUTCH_MOMENT', { desc: 'Cú Panenka định mệnh phút bù giờ mang về chức vô địch lịch sử!' });
        },
        onFailure: (p) => { p.morale = Math.max(30, p.morale - 15); p.form = Math.max(30, p.form - 10); } },
      { text: 'Sút căng hiểm hóc găm thẳng vào góc chữ A',
        statHint: 'Yêu cầu: Phạt Đền + Lực Sút + Điềm Tĩnh (Penalties + Shot Power)',
        successChance: (p) => {
          const pen = getSubStat(p, 'penalties', 'sho');
          const pow = getSubStat(p, 'shotPower', 'sho');
          const comp = getSubStat(p, 'composure', 'dri');
          return Math.min(0.93, (pen * 0.005) + (pow * 0.003) + (comp * 0.002));
        },
        successText: 'BÀN THẮNG VÀNG! Cú sút không thể cản phá mang về chiến thắng lịch sử!',
        failureText: 'Trái bóng liếm mép cột dọc đi ra ngoài!',
        onSuccess: (p, r) => { 
          r.goals += 1; 
          p.totalCareerGoals = (p.totalCareerGoals || 0) + 1; 
          p.fame = Math.min(99, p.fame + 8); 
          recordChronicleMilestone(p, 'CLUTCH_MOMENT', { desc: 'Cú nã đại bác 11m phút 90+ đem về thắng lợi nghẹt thở!' });
        },
        onFailure: (p) => { p.form = Math.max(30, p.form - 10); } }
    ]
  },
  {
    title: 'Đối Mặt 1 vs 1 Thủ Môn',
    category: 'GOAL',
    weights: { FW: 28, MF: 6 },
    desc: 'Phá bẫy việt vị thành công! Bạn thoát xuống đối mặt trực tiếp với thủ môn!',
    ballPitchPercent: 88,
    choices: [
      { text: 'Căn chỉnh góc dứt điểm chìm hiểm hóc đánh bại thủ môn',
        statHint: 'Yêu cầu: Dứt Điểm + Điềm Tĩnh (Finishing + Composure)',
        successChance: (p) => {
          const fin = getSubStat(p, 'finishing', 'sho');
          const comp = getSubStat(p, 'composure', 'dri');
          return Math.min(0.92, (fin * 0.006) + (comp * 0.004));
        },
        successText: 'SÁT THỦ LẠNH LÙNG! Pha dứt điểm chìm hiểm hóc lạnh như băng đánh lừa thủ môn đưa bóng vào lưới!',
        failureText: 'Thủ môn đối phương khép góc xuất sắc đẩy bóng ra!',
        onSuccess: (p, r) => { r.goals += 1; p.totalCareerGoals = (p.totalCareerGoals || 0) + 1; p.form = Math.min(99, p.form + 8); p.fame = Math.min(99, p.fame + 5); },
        onFailure: (p) => { p.morale = Math.max(35, p.morale - 8); } },
      { text: (p) => (p && p.skillMoves >= 6) ? '🪄 [Trickster+] Hất bóng cầu vồng Rabona đỉnh cao qua đầu thủ môn' : 'Đảo chân lừa qua thủ môn rồi đưa bóng vào lưới trống',
        statHint: (p) => (p && p.skillMoves >= 6) ? 'Trickster+ (6⭐): +25% Tỷ lệ thành công & Giảm 50% rủi ro' : ((p && p.skillMoves >= 4) ? `Kỹ thuật ${p.skillMoves}⭐ (+${p.skillMoves === 5 ? 15 : 10}% tỷ lệ)` : 'Yêu cầu: Rê Bóng + Điềm Tĩnh (Dribbling + Composure)'),
        isDribble: true,
        successChance: (p) => {
          const sm = p?.skillMoves || 3;
          const smBonus = sm >= 6 ? 0.25 : (sm === 5 ? 0.15 : (sm === 4 ? 0.10 : 0));
          const dri = getSubStat(p, 'dribbling', 'dri');
          const comp = getSubStat(p, 'composure', 'dri');
          return Math.min(0.95, (dri * 0.005) + (comp * 0.004) + smBonus);
        },
        successText: (p) => (p && p.skillMoves >= 6) ? 'SIÊU PHẨM RABONA CẦU VỒNG! Cú vắt chân hất bóng cầu vồng không tưởng qua đầu thủ môn găm thẳng vào lưới trống!' : 'VŨ ĐIỆU SÂN CỎ! Đảo bóng qua thủ môn rồi dễ dàng đệm vào lưới trống!',
        failureText: 'Thủ môn đối phương băng ra cực nhanh cản phá!',
        onSuccess: (p, r) => { r.goals += 1; p.totalCareerGoals = (p.totalCareerGoals || 0) + 1; p.form = Math.min(99, p.form + 8); p.fame = Math.min(99, p.fame + 5); },
        onFailure: (p) => { p.morale = Math.max(35, p.morale - 8); } }
    ]
  },
  {
    id: 'MOMENT_TRICKSTER_MASTER',
    title: '🪄 Tuyệt Kỹ Trickster+: Siêu Phẩm Elastico Kép',
    category: 'GOAL',
    minSkillMoves: 6,
    weights: { FW: 35, MF: 28 },
    desc: 'Bị hai hậu vệ to cao đối phương kèm chặt sát đường biên ngang! Đã đến lúc kích hoạt bản năng ảo thuật gia Trickster+!',
    ballPitchPercent: 88,
    choices: [
      {
        text: '🪄 Đảo chân Elastico kép xâu kim qua 2 hậu vệ xộc thẳng vào cấm địa',
        statHint: 'Đặc quyền Trickster+ (6⭐): +25% Tỷ lệ đột phá [Rê Bóng + Khéo Léo]',
        isDribble: true,
        successChance: (p) => {
          const sm = p?.skillMoves || 3;
          const bonus = sm >= 6 ? 0.25 : (sm === 5 ? 0.15 : (sm === 4 ? 0.10 : 0));
          const dri = getSubStat(p, 'dribbling', 'dri');
          const agi = getSubStat(p, 'agility', 'dri');
          return Math.min(0.95, (dri * 0.005) + (agi * 0.003) + ((p.stam || 70) * 0.001) + bonus);
        },
        successText: 'ẢO THUẬT GIA SÂN CỎ! Cú đảo chân Elastico kép biến 2 hậu vệ thành tượng gỗ, xâu kim điệu nghệ rồi dứt điểm sấm sét tung nóc lưới!',
        failureText: 'Động tác siêu khó khiến hàng thủ đối phương một phen hoảng sợ thót tim.',
        onSuccess: (p, r) => {
          r.goals += 1;
          p.totalCareerGoals = (p.totalCareerGoals || 0) + 1;
          p.form = 99;
          p.fame = Math.min(99, p.fame + 8);
          recordChronicleMilestone(p, 'CLUTCH_MOMENT', { desc: 'Biểu diễn siêu phẩm Elastico kép xâu kim qua 2 hậu vệ ghi bàn kinh điển!' });
        },
        onFailure: (p) => { p.morale = Math.max(45, p.morale - 3); }
      },
      {
        text: '🪄 Hất bóng cầu vồng Rabona đỉnh cao qua đầu thủ môn',
        statHint: 'Kỹ thuật Rabona thượng thừa (6⭐): +25% Thành công [Rê Bóng + Khéo Léo + Dứt Điểm]',
        isDribble: true,
        successChance: (p) => {
          const sm = p?.skillMoves || 3;
          const bonus = sm >= 6 ? 0.25 : (sm === 5 ? 0.15 : (sm === 4 ? 0.10 : 0));
          const dri = getSubStat(p, 'dribbling', 'dri');
          const fin = getSubStat(p, 'finishing', 'sho');
          return Math.min(0.94, (dri * 0.005) + (fin * 0.003) + bonus);
        },
        successText: 'SIÊU PHẨM CẦU VỒNG RABONA! Cú hất chân chéo Rabona vẽ nên đường cong không tưởng qua đầu thủ môn găm vào lưới!',
        failureText: 'Pha vắt chân hơi sâu đưa bóng đi chệch khung thành trong gang tấc.',
        onSuccess: (p, r) => {
          r.goals += 1;
          p.totalCareerGoals = (p.totalCareerGoals || 0) + 1;
          p.fame = Math.min(99, p.fame + 10);
          p.morale = 100;
          recordChronicleMilestone(p, 'CLUTCH_MOMENT', { desc: 'Lập siêu phẩm Rabona cầu vồng để đời làm chấn động thế giới!' });
        },
        onFailure: (p) => { p.morale = Math.max(45, p.morale - 3); }
      }
    ]
  },
  {
    id: 'MOMENT_WEAK_FOOT_FINISH',
    title: '👟 Dứt Điểm Chân Nghịch Trong Vòng Cấm',
    category: 'GOAL',
    weights: { FW: 25, MF: 18 },
    desc: 'Đường căng ngang dội ngược sang phía chân không thuận! Góc sút hẹp đòi hỏi bản lĩnh và độ thuần thục của chân nghịch.',
    ballPitchPercent: 85,
    choices: [
      {
        text: 'Vung chân sút ngay bằng chân không thuận vào góc hiểm',
        statHint: (p) => (p && p.weakFoot >= 5) ? '✨ Hai Chân Như Một (5⭐): 100% Uy lực, 0% điểm phạt' : `👟 Chân Nghịch (${p?.weakFoot || 3}⭐): ${(p?.weakFoot || 3) < 3 ? '-25%' : ((p?.weakFoot || 3) === 3 ? '-10%' : '-5%')} tỷ lệ`,
        isWeakFoot: true,
        successChance: (p) => {
          const wf = p?.weakFoot || 3;
          let penalty = 0;
          if (wf >= 5) penalty = 0;
          else if (wf === 4) penalty = -0.05;
          else if (wf === 3) penalty = -0.10;
          else penalty = -0.25;
          const fin = getSubStat(p, 'finishing', 'sho');
          return Math.max(0.35, Math.min(0.92, (fin * 0.007) + ((p.form || 70) * 0.003) + penalty));
        },
        successText: 'HAI CHÂN NHƯ MỘT! Cú ra chân bằng chân nghịch sấm sét găm thẳng vào góc chữ A khiến thủ môn bó tay!',
        failureText: 'Cú sút bằng chân không thuận đi thiếu chính xác ra ngoài đường biên.',
        onSuccess: (p, r) => {
          r.goals += 1;
          p.totalCareerGoals = (p.totalCareerGoals || 0) + 1;
          p.fame = Math.min(99, p.fame + 5);
          p.form = Math.min(99, p.form + 5);
        },
        onFailure: (p) => { p.morale = Math.max(40, p.morale - 4); }
      },
      {
        text: 'Khống chế gạt bóng về chân thuận rồi mới cứa lòng',
        statHint: 'Yêu cầu: Khống Chế Bóng + Dứt Điểm (Ball Control + Finishing)',
        successChance: (p) => {
          const bc = getSubStat(p, 'ballControl', 'dri');
          const fin = getSubStat(p, 'finishing', 'sho');
          return Math.min(0.88, (bc * 0.005) + (fin * 0.004));
        },
        successText: 'BÌNH TĨNH ĐẲNG CẤP! Pha sửa bóng về chân thuận hoàn hảo mở ra góc sút cứa lòng không thể cản phá!',
        failureText: 'Hậu vệ đối phương kịp thời ập vào can thiệp trước khi kịp vung chân thuận.',
        onSuccess: (p, r) => {
          r.goals += 1;
          p.totalCareerGoals = (p.totalCareerGoals || 0) + 1;
          p.fame = Math.min(99, p.fame + 4);
        },
        onFailure: (p) => { p.morale = Math.max(40, p.morale - 4); }
      }
    ]
  },
  {
    title: '"Clutch Moment" Phút 90+ Định Đoạt Trận Đấu',
    category: 'PLAYMAKING',
    weights: { FW: 16, MF: 24 },
    desc: 'Phút 90, trận đấu bước vào thời gian bù giờ nghẹt thở! Bạn nhận bóng trước vòng cấm!',
    ballPitchPercent: 82,
    choices: [
      { text: 'Bấm bóng thông minh cho đồng đội đánh đầu cận thành',
        statHint: 'Yêu cầu: Nhãn Quan + Chuyền Ngắn/Dài (Vision + Passing)',
        successChance: (p) => {
          const vis = getSubStat(p, 'vision', 'pas');
          const sp = getSubStat(p, 'shortPassing', 'pas');
          const lp = getSubStat(p, 'longPassing', 'pas');
          const pass = Math.max(sp, lp);
          return Math.min(0.92, (vis * 0.005) + (pass * 0.004) + ((p.morale || 70) * 0.001));
        },
        successText: 'KIẾN TẠO VÀNG PHÚT BÙ GIỜ! Đường bấm bóng điệu nghệ giúp đồng đội ghi bàn định đoạt!',
        failureText: 'Bóng đi hơi sâu trôi hết đường biên ngang.',
        onSuccess: (p, r) => { 
          r.assists += 1; 
          p.totalCareerAssists = (p.totalCareerAssists || 0) + 1; 
          p.fame = Math.min(99, p.fame + 8); 
          p.morale = 100;
          recordChronicleMilestone(p, 'CLUTCH_MOMENT', { desc: 'Pha kiến tạo vàng phút bù giờ định đoạt trận cầu kinh điển!' });
        },
        onFailure: (p) => { p.morale = Math.max(30, p.morale - 10); p.form = Math.max(30, p.form - 8); } },
      { text: 'Sút xa bất ngờ găm bóng vào góc chữ A',
        statHint: 'Yêu cầu: Sút Xa + Lực Sút + Điềm Tĩnh (Long Shots + Composure)',
        successChance: (p) => {
          const ls = getSubStat(p, 'longShots', 'sho');
          const pow = getSubStat(p, 'shotPower', 'sho');
          const comp = getSubStat(p, 'composure', 'dri');
          return Math.min(0.90, (ls * 0.004) + (pow * 0.003) + (comp * 0.002) + ((p.fame || 70) * 0.001));
        },
        successText: 'SIÊU PHẨM ĐỊNH ĐOẠT TRẬN ĐẤU! Bàn thắng vàng phút 90+3 làm nổ tung cầu trường!',
        failureText: 'Cú sút bay vọt xà ngang!',
        onSuccess: (p, r) => { 
          r.goals += 1; 
          p.totalCareerGoals = (p.totalCareerGoals || 0) + 1; 
          p.fame = Math.min(99, p.fame + 12); 
          p.morale = 100; 
          p.form = 99;
          recordChronicleMilestone(p, 'CLUTCH_MOMENT', { desc: 'Bàn thắng vàng phút 90+3 đưa đội nhà bước lên đỉnh vinh quang!' });
        },
        onFailure: (p) => { p.form = Math.max(25, p.form - 12); p.morale = Math.max(25, p.morale - 12); } }
    ]
  }
];

/**
 * Chọn ngẫu nhiên có trọng số không lặp lại (Weighted Random Sampling without replacement)
 * @param {Array} items Danh sách moment
 * @param {'FW'|'MF'} role Vai trò vị trí ('FW' hoặc 'MF')
 * @param {number} count Số lượng moment cần chọn (mặc định 3)
 * @returns {Array} Danh sách moment đã chọn
 */
export function selectWeightedMoments(items, role = 'FW', count = 3) {
  if (!Array.isArray(items) || items.length === 0) return [];
  const available = [...items];
  const selected = [];
  const targetCount = Math.min(count, available.length);

  for (let step = 0; step < targetCount; step++) {
    const totalWeight = available.reduce((sum, item) => {
      const w = item.weights?.[role] ?? 10;
      return sum + (w > 0 ? w : 1);
    }, 0);

    if (totalWeight <= 0) {
      selected.push(available.splice(0, 1)[0]);
      continue;
    }

    let roll = Math.random() * totalWeight;
    let chosenIndex = 0;
    for (let i = 0; i < available.length; i++) {
      const w = available[i].weights?.[role] ?? 10;
      const weightVal = w > 0 ? w : 1;
      if (roll < weightVal) {
        chosenIndex = i;
        break;
      }
      roll -= weightVal;
    }
    selected.push(available.splice(chosenIndex, 1)[0]);
  }

  return selected;
}

/**
 * Rewritten generateMomentsForMatch — pulls from large random pool per position.
 * Selects 3 moments with randomized minutes per period with weighted selection for FW/MF.
 * @param {object} player
 * @param {object} matchInfo
 * @returns {Array}
 */
export function generateMomentsForMatch(player, matchInfo) {
  const pPos = String(player?.position || player?.pos || player?.positionGroup || 'FW').toUpperCase();
  const pGroup = String(player?.positionGroup || '').toUpperCase();

  const isGK = pPos === 'GK' || pGroup === 'GK';
  const isDF = ['DF', 'CB', 'LB', 'RB', 'LWB', 'RWB'].includes(pPos) || pGroup === 'DF';
  const isMF = ['MF', 'CM', 'CAM', 'CDM', 'LM', 'RM'].includes(pPos) || pGroup === 'MF';
  const isFW = !isGK && !isDF && !isMF; // Default to FW (FW, ST, CF, LW, RW...)

  let selected = [];
  if (isGK) {
    const shuffled = [...GK_MOMENT_BANK].sort(() => Math.random() - 0.5);
    selected = shuffled.slice(0, Math.min(3, shuffled.length));
  } else if (isDF) {
    const shuffled = [...DF_MOMENT_BANK].sort(() => Math.random() - 0.5);
    selected = shuffled.slice(0, Math.min(3, shuffled.length));
  } else {
    const role = isMF ? 'MF' : 'FW';
    const sm = Number(player?.skillMoves) || 3;
    const eligiblePool = FW_MF_MOMENT_BANK.filter(m => !m.minSkillMoves || sm >= m.minSkillMoves);
    selected = selectWeightedMoments(eligiblePool, role, 3);
    if (sm >= 6 && !selected.some(s => s.id === 'MOMENT_TRICKSTER_MASTER')) {
      const tricksterM = eligiblePool.find(m => m.id === 'MOMENT_TRICKSTER_MASTER');
      if (tricksterM && Math.random() < 0.70) {
        selected[0] = tricksterM;
      }
    }
  }

  const minuteBands = [
    () => Math.floor(Math.random() * 35) + 10,
    () => Math.floor(Math.random() * 38) + 47,
    () => '90+' + (Math.floor(Math.random() * 5) + 1),
  ];

  return selected.map((m, i) => ({
    ...m,
    minute: minuteBands[Math.min(i, minuteBands.length - 1)](),
  }));
}

if (typeof window !== 'undefined') {
  window.generateMomentsForMatch = generateMomentsForMatch;
  window.selectWeightedMoments = selectWeightedMoments;
  window.FW_MF_MOMENT_BANK = FW_MF_MOMENT_BANK;
}

/* =========================================================================
   6. POST-MATCH PRESS CONFERENCE (HỌP BÁO TRUYỀN THÔNG SAU TRẬN CẦU LỚN)
   ========================================================================= */

/**
 * Mở modal Họp báo Sau trận đấu (Press Conference)
 */
export function triggerPostMatchPressConference(player, matchContext, onAnswer) {
  const modal = document.getElementById('pressConferenceModal');
  if (!modal) {
    if (onAnswer) onAnswer(null);
    return;
  }

  const contextEl = document.getElementById('pcMatchContext');
  const questionEl = document.getElementById('pcJournalistQuestion');
  const choicesEl = document.getElementById('pcChoicesContainer');

  const isWin = matchContext.isWin;
  const isDerby = matchContext.isDerby;
  const isGreat = (matchContext.rating || 6.5) >= 8.0 || (matchContext.goals || 0) >= 2;
  const isPoor = (matchContext.rating || 6.5) < 6.0;

  if (contextEl) {
    contextEl.innerText = `${matchContext.stageName || 'Trận Cầu Đinh'} • ${matchContext.homeName} ${matchContext.homeScore} - ${matchContext.awayScore} ${matchContext.awayName} (Rating: ${(matchContext.rating || 6.5).toFixed(1)})`;
  }

  let journalistQuestion = "";
  if (isGreat) {
    journalistQuestion = "🎤 Phóng viên: 'Một màn trình diễn quá sức bùng nổ của bạn trên sân hôm nay! Bạn cảm thấy thế nào về vai trò đầu tàu quyết định cục diện trận đấu?'";
  } else if (isPoor) {
    journalistQuestion = "🎤 Phóng viên: 'Một trận đấu rất khó khăn và bạn dường như chưa đạt phong độ tốt nhất. Bạn sẽ nói gì với người hâm mộ sau màn thể hiện này?'";
  } else if (isDerby) {
    journalistQuestion = "🎤 Phóng viên: 'Sức nóng trận Derby là không thể bàn cãi. Bạn đánh giá thế nào về tinh thần thi đấu và chiến thuật của cả hai đội hôm nay?'";
  } else {
    journalistQuestion = "🎤 Phóng viên: 'Trận đấu khép lại với nhiều cảm xúc đan xen. Bạn đánh giá thế nào về kết quả và mục tiêu sắp tới của toàn đội?'";
  }

  if (questionEl) questionEl.innerText = journalistQuestion;

  const choices = [
    {
      id: "HUMBLE",
      title: "🙏 1. Khiêm Tốn & Ca Ngợi Tập Thể",
      desc: "Chiến thắng là nỗ lực của toàn đội. Tôi chỉ cố gắng hoàn thành tốt nhất vai trò của mình theo đúng chỉ đạo chiến thuật của Huấn luyện viên.",
      effectHint: "+5 Niềm Tin HLV • +5 Morale Đội • +30 Fame",
      color: "var(--accent-green)",
      apply: () => {
        player.managerTrust = Math.min(100, (player.managerTrust || 70) + 5);
        player.morale = Math.min(100, (player.morale || 70) + 5);
        player.fame = (player.fame || 0) + 30;
        return {
          type: "HUMBLE",
          message: "HLV và toàn thể phòng thay đồ rất hài lòng trước sự chuyên nghiệp và khiêm nhường đặt tập thể lên hàng đầu của bạn! (+5 Niềm Tin HLV, +5 Tinh Thần)"
        };
      }
    },
    {
      id: "STAR",
      title: "🦁 2. Tự Tin Ngôi Sao / Gánh Team",
      desc: "Tôi biết mình có phẩm chất của một ngôi sao lớn và sinh ra để tỏa sáng ở những khoảnh khắc sống còn như thế này.",
      effectHint: "+150 Danh Tiếng (Fame) • -3 Niềm Tin HLV • Chịu áp lực x2",
      color: "var(--accent-gold)",
      apply: () => {
        player.fame = (player.fame || 0) + 150;
        player.managerTrust = Math.max(0, (player.managerTrust || 70) - 3);
        return {
          type: "STAR",
          message: "Tuyên bố ngôi sao bùng nổ trên trang nhất báo chí! Danh tiếng tăng vọt nhưng HLV nhắc nhở bạn cần giữ đôi chân trên mặt đất. (+150 Fame, -3 Niềm Tin HLV)"
        };
      }
    },
    {
      id: "BLAME",
      title: "🔥 3. Thẳng Thắn Chỉ Trích Chiến Thuật & Đồng Đội",
      desc: "Đội hình vận hành còn nhiều bất cập, đồng đội chưa theo kịp nhịp độ chuyền bóng và HLV cần có cách tiếp cận trận đấu táo bạo hơn.",
      effectHint: "+80 Fame • -15 Niềm Tin HLV • -15 Morale • Nguy cơ phạt nội bộ",
      color: "var(--accent-red)",
      apply: () => {
        player.fame = (player.fame || 0) + 80;
        player.managerTrust = Math.max(0, (player.managerTrust || 70) - 15);
        player.morale = Math.max(0, (player.morale || 70) - 15);
        const penalty = Math.random() < 0.25;
        return {
          type: "BLAME",
          penalty,
          message: `Phát biểu chấn động làm rạn nứt phòng thay đồ! HLV cực kỳ giận dữ trước thái độ công khai chỉ trích! (-15 Niềm Tin HLV, -15 Morale${penalty ? ' • Bị cảnh cáo nội bộ!' : ''})`
        };
      }
    }
  ];

  if (choicesEl) {
    choicesEl.innerHTML = '';
    choices.forEach(ch => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.style.cssText = `
        text-align: left;
        display: flex;
        flex-direction: column;
        gap: 4px;
        padding: 12px 16px;
        border-color: ${ch.color};
        background: rgba(255,255,255,0.02);
        cursor: pointer;
        transition: all 0.2s ease;
      `;
      btn.innerHTML = `
        <div style="font-weight: 800; font-size: 0.95rem; color: #fff;">${ch.title}</div>
        <div style="font-size: 0.82rem; color: var(--text-muted); line-height: 1.4;">"${ch.desc}"</div>
        <div style="font-size: 0.76rem; font-weight: 700; color: ${ch.color}; margin-top: 2px;">⚡ Tác động: ${ch.effectHint}</div>
      `;
      btn.onclick = () => {
        const res = ch.apply();
        modal.classList.remove('active');
        player.pressConferencePending = null;
        if (onAnswer) onAnswer(res);
      };
      choicesEl.appendChild(btn);
    });
  }

  modal.classList.add('active');
}

export function closePressConferenceModal() {
  const modal = document.getElementById('pressConferenceModal');
  if (modal) modal.classList.remove('active');
}
if (typeof window !== 'undefined') {
  window.closePressConferenceModal = closePressConferenceModal;
}

/* =========================================================================
   12. SEASON AWARDS MODAL TRIGGER & EVENT DELEGATION
   ========================================================================= */
export function openSeasonAwardsModal() {
  if (typeof window !== 'undefined' && typeof window.openSeasonAwardsModal === 'function' && window.openSeasonAwardsModal !== openSeasonAwardsModal) {
    window.openSeasonAwardsModal();
  } else if (typeof window !== 'undefined' && typeof window.onSeasonCompletedRollover === 'function') {
    window.onSeasonCompletedRollover();
  }
}
if (typeof window !== 'undefined' && !window.openSeasonAwardsModal) {
  window.openSeasonAwardsModal = openSeasonAwardsModal;
}

// Bắt sự kiện bằng Event Delegation đảm bảo không bị liệt nút kể cả khi render động qua innerHTML
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


