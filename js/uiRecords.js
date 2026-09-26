/* =========================================================================
   UI RECORDS — RECORDS TAB, RETIREMENT & HALL OF FAME
   Extracted from ui.js
   ========================================================================= */
import { ALL_TIME_RECORDS, ALL_TIME_LEGENDS } from './data.js';
import { calculatePlayerGoatScore } from './engine.js';
import { formatCurrency, triggerConfetti } from './uiCore.js';
import { showToast } from './uiCore.js';
import { getPlayer } from './state.js';
import { getFameTier, calculateOVR } from './playerEngine.js';
export function renderRecordsTab(player) {
  const container = document.getElementById('recordsListContainer');
  const badgeEl = document.getElementById('recordsBrokenCountBadge');
  if (!container) return;

  container.innerHTML = '';
  let brokenCount = 0;

  ALL_TIME_RECORDS.forEach(rec => {
    const curVal = rec.checkFn(player);
    const isBroken = rec.isAchieved(player);
    if (isBroken) brokenCount++;

    const percent = Math.min(100, Math.round((curVal / rec.target) * 100));
    
    let dispCurrent = curVal;
    let dispTarget = rec.target;
    if (rec.formatVal) {
      dispCurrent = rec.formatVal(curVal);
      dispTarget = rec.formatVal(rec.target);
    } else {
      dispCurrent = `${curVal} ${rec.unit}`;
      dispTarget = `${rec.target} ${rec.unit}`;
    }

    const card = document.createElement('div');
    card.className = `record-card ${isBroken ? 'broken' : ''}`;
    card.innerHTML = `
      <div class="record-card-top">
        <div class="record-card-icon">${rec.icon}</div>
        <div class="record-card-title-wrap">
          <div class="record-card-title">${rec.title}</div>
          <div class="record-card-holder">👑 Giữ kỷ lục: ${rec.holder}</div>
        </div>
        <div>
          ${isBroken 
            ? `<span class="record-status-pill achieved">🏅 ĐÃ PHÁ VỠ</span>` 
            : `<span class="record-status-pill">🎯 ĐANG CHINH PHỤC</span>`}
        </div>
      </div>
      <div class="record-card-desc">${rec.desc}</div>
      <div class="record-progress-container">
        <div class="record-progress-label">
          <span>Tiến độ: ${dispCurrent} / ${dispTarget}</span>
          <span style="${isBroken ? 'color:var(--accent-gold);' : ''}">${percent}%</span>
        </div>
        <div class="record-progress-bar-bg">
          <div class="record-progress-bar-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  if (badgeEl) {
    badgeEl.innerText = `${brokenCount}/${ALL_TIME_RECORDS.length} Kỷ Lục Đã Chinh Phục`;
  }
}

export function checkAndAwardRecords(player, onRecordBroken) {
  if (!player.brokenRecords) player.brokenRecords = [];
  let newlyBroken = [];

  ALL_TIME_RECORDS.forEach(rec => {
    if (!player.brokenRecords.includes(rec.id) && rec.isAchieved(player)) {
      player.brokenRecords.push(rec.id);
      newlyBroken.push(rec);
      player.fame = Math.max(0, (player.fame || 0) + 300);
      player.morale = 100;
    }
  });

  if (newlyBroken.length > 0) {
    triggerConfetti();
    newlyBroken.forEach(rec => {
      if (onRecordBroken) onRecordBroken(rec);
    });
  }
}

/* =========================================================================
   10. RETIREMENT & HALL OF FAME SCREEN
   ========================================================================= */
export function renderRetirementScreen(player) {
  if (!player) return;
  player.isRetired = true;

  player.trophiesTally = player.trophiesTally || {};
  player.equipment = player.equipment || [];
  player.subscriptions = player.subscriptions || [];
  player.assets = player.assets || [];
  player.clubsHistory = player.clubsHistory || [];

  let rankTitle = "";
  let rankDesc = "";

  const hasUCL = player.trophiesTally["UEFA Champions League (C1)"] || 0;
  const hasBallonDor = player.ballonDorWins || 0;
  const hasWorldCup = player.trophiesTally["FIFA World Cup"] || 0;
  const totalTrophies = player.trophiesTotal || player.careerTrophies || 0;
  const totalMatches = player.totalCareerMatches || 0;
  const totalGoals = player.totalCareerGoals || 0;
  const totalAssists = player.totalCareerAssists || 0;
  const netWorth = calculateNetWorth(player);

  if ((hasBallonDor >= 1 || hasUCL >= 2 || hasWorldCup >= 1) && totalTrophies >= 8) {
    rankTitle = "👑 VĨ ĐẠI NHẤT LỊCH SỬ (G.O.A.T)";
    rankDesc = `Tên tuổi của bạn sánh ngang với Pele, Maradona, Messi và Cristiano Ronaldo! Bạn thi đấu tổng cộng ${totalMatches} trận đỉnh cao, ghi ${totalGoals} bàn, giành ${hasBallonDor} Quả Bóng Vàng và sở hữu khối tài sản ròng ${formatMoney(netWorth)}!`;
  } else if (hasUCL >= 1 || totalTrophies >= 5 || (player.fame || 0) >= 4000) {
    rankTitle = "🌟 SIÊU SAO ĐẲNG CẤP THẾ GIỚI (WORLD-CLASS)";
    rankDesc = "Bạn là biểu tượng tại Champions League và ĐTQG, trụ cột không thể thay thế đưa bóng đá thế giới đến những xúc cảm đỉnh cao.";
  } else if (totalTrophies >= 2 || (player.intlCaps || 0) >= 30) {
    rankTitle = "🎖️ DANH THỦ XUẤT SẮC QUỐC GIA & CHÂU LỤC";
    rankDesc = "Một sự nghiệp rực rỡ đầy tự hào, người hùng dân tộc và tấm gương sáng cho hàng triệu tài năng trẻ noi theo.";
  } else if ((player.seasonsPlayed || 0) >= 10) {
    rankTitle = "⚽ CẦU THỦ CHUYÊN NGHIỆP BỀN BỈ";
    rankDesc = "Bạn đã có một chặng đường thi đấu kiên cường, gặt hái nhiều thành công và tích lũy khối tài sản đáng mơ ước.";
  } else {
    rankTitle = "🥀 TIỀM NĂNG CHƯA TRỌN VẸN";
    rankDesc = "Những chấn thương và vận may không mỉm cười đã ngăn cản bạn chạm tay tới đỉnh vinh quang cao nhất.";
  }

  const endLegacyRank = document.getElementById('endLegacyRank');
  if (endLegacyRank) endLegacyRank.innerText = rankTitle;
  const endLegacyDesc = document.getElementById('endLegacyDesc');
  if (endLegacyDesc) endLegacyDesc.innerText = rankDesc;

  const endAge = document.getElementById('endAge');
  if (endAge) endAge.innerText = player.age || 40;
  const endTotalMatches = document.getElementById('endTotalMatches');
  if (endTotalMatches) endTotalMatches.innerText = totalMatches;
  const endNetWorth = document.getElementById('endNetWorth');
  if (endNetWorth) endNetWorth.innerText = formatMoney(netWorth);
  const endPeakMarketVal = document.getElementById('endPeakMarketVal');
  if (endPeakMarketVal) endPeakMarketVal.innerText = formatCurrency(player.peakMarketValue || player.marketValue || 0, "€");
  const endTrophies = document.getElementById('endTrophies');
  if (endTrophies) endTrophies.innerText = `${totalTrophies} 🏆`;

  const endStat1Lbl = document.getElementById('endStat1Lbl');
  const endStat1Val = document.getElementById('endStat1Val');
  const endStat2Lbl = document.getElementById('endStat2Lbl');
  const endStat2Val = document.getElementById('endStat2Val');

  if (player.position === 'GK') {
    if (endStat1Lbl) endStat1Lbl.innerText = "Trận Sạch Lưới (Tổng)";
    if (endStat1Val) endStat1Val.innerText = player.totalCareerCleanSheets || 0;
    if (endStat2Lbl) endStat2Lbl.innerText = "Số Pha Cứu Thua";
    if (endStat2Val) endStat2Val.innerText = player.totalCareerSaves || 0;
  } else if (player.position === 'DF') {
    if (endStat1Lbl) endStat1Lbl.innerText = "Tắc Bóng & Cắt Bóng";
    if (endStat1Val) endStat1Val.innerText = player.totalCareerTackles || 0;
    if (endStat2Lbl) endStat2Lbl.innerText = "Trận Sạch Lưới (Tổng)";
    if (endStat2Val) endStat2Val.innerText = player.totalCareerCleanSheets || 0;
  } else {
    if (endStat1Lbl) endStat1Lbl.innerText = "Tổng Bàn Thắng";
    if (endStat1Val) endStat1Val.innerText = totalGoals;
    if (endStat2Lbl) endStat2Lbl.innerText = "Tổng Kiến Tạo";
    if (endStat2Val) endStat2Val.innerText = totalAssists;
  }

  const endUclGoals = document.getElementById('endUclGoals');
  if (endUclGoals) endUclGoals.innerText = player.uclGoals || 0;

  const endBallonDorWins = document.getElementById('endBallonDorWins');
  if (endBallonDorWins) endBallonDorWins.innerText = hasBallonDor;
  const endBallonDorTop3 = document.getElementById('endBallonDorTop3');
  if (endBallonDorTop3) endBallonDorTop3.innerText = player.ballonDorTop3 || 0;
  const endBallonDorTop30 = document.getElementById('endBallonDorTop30');
  if (endBallonDorTop30) endBallonDorTop30.innerText = player.ballonDorTop30 || 0;

  const endIntlCaps = document.getElementById('endIntlCaps');
  if (endIntlCaps) endIntlCaps.innerText = player.intlCaps || 0;
  const endIntlStatsLbl = document.getElementById('endIntlStatsLbl');
  const endIntlStatsVal = document.getElementById('endIntlStatsVal');

  if (player.position === 'GK' || player.position === 'DF') {
    if (endIntlStatsLbl) endIntlStatsLbl.innerText = "Sạch Lưới ĐTQG";
    if (endIntlStatsVal) endIntlStatsVal.innerText = player.intlCleanSheets || 0;
  } else {
    if (endIntlStatsLbl) endIntlStatsLbl.innerText = "Bàn Thắng ĐTQG";
    if (endIntlStatsVal) endIntlStatsVal.innerText = `${player.intlGoals || 0} ⚽`;
  }

  try { renderMilestonesHallOfFame(player); } catch (e) { console.error(e); }
  try { renderGoatComparisonTable(player); } catch (e) { console.error(e); }
  try { renderEndRecordsList(player); } catch (e) { console.error(e); }

  // Render Clean Unified Trophy Breakdown
  const breakdownEl = document.getElementById('endTrophyBreakdown');
  if (breakdownEl) {
    breakdownEl.innerHTML = '';
    const trophyKeys = Object.keys(player.trophiesTally || {});

    if (trophyKeys.length === 0) {
      breakdownEl.innerHTML = `<span style="color:var(--text-dim); font-size:0.85rem;">Không có danh hiệu chính thức nào trong sự nghiệp.</span>`;
    } else {
      trophyKeys.forEach(tName => {
        const isBallonDor = tName.includes("Quả Bóng Vàng");
        const isScorer = tName.includes("Vua Phá Lưới") || tName.includes("Chiếc Giày Vàng");
        const isPlaymaker = tName.includes("Vua Kiến Tạo");
        const isAward = isBallonDor || isScorer || isPlaymaker || tName.includes("FIFA The Best") || tName.includes("Găng Tay Vàng");
        const icon = isBallonDor ? '👑' : (isScorer ? '👟' : (isPlaymaker ? '🎯' : (isAward ? '🌟' : '🏆')));
        const item = document.createElement('div');
        item.className = `trophy-breakdown-item ${isAward ? 'award-item' : ''}`;
        item.innerHTML = `<span>${icon} ${tName}</span> <span class="t-count" style="${isAward ? 'color:var(--accent-gold); font-size:1.05rem;' : ''}">x${player.trophiesTally[tName]}</span>`;
        breakdownEl.appendChild(item);
      });
    }
  }

  // Render Portfolio Breakdown in Retirement
  const portEl = document.getElementById('endPortfolioList');
  if (portEl) {
    portEl.innerHTML = '';
    const ownedEquip = (player.equipment || []).map(id => (LIFESTYLE_CATALOG.equipment || []).find(e => e.id === id)).filter(Boolean);
    const ownedSubs = (player.subscriptions || []).map(id => (LIFESTYLE_CATALOG.subscriptions || []).find(s => s.id === id)).filter(Boolean);
    const ownedAssets = (player.assets || []).map(id => (LIFESTYLE_CATALOG.assets || []).find(a => a.id === id)).filter(Boolean);

    if (ownedEquip.length === 0 && ownedSubs.length === 0 && ownedAssets.length === 0) {
      portEl.innerHTML = `<span style="color:var(--text-dim); font-size:0.85rem;">Không sở hữu danh mục đầu tư hay trang thiết bị lớn nào.</span>`;
    } else {
      ownedEquip.forEach(i => {
        const p = document.createElement('span');
        p.className = 'club-pill';
        p.style.borderColor = 'rgba(56, 189, 248, 0.4)';
        p.innerText = `${i.icon} ${i.name}`;
        portEl.appendChild(p);
      });
      ownedSubs.forEach(s => {
        const p = document.createElement('span');
        p.className = 'club-pill';
        p.style.borderColor = 'rgba(168, 85, 247, 0.4)';
        p.innerText = `${s.icon} ${s.name}`;
        portEl.appendChild(p);
      });
      ownedAssets.forEach(a => {
        const p = document.createElement('span');
        p.className = 'club-pill';
        p.style.borderColor = 'rgba(245, 158, 11, 0.4)';
        p.innerText = `${a.icon} ${a.name}`;
        portEl.appendChild(p);
      });
    }
  }

  // Render Clubs History
  const clubsListEl = document.getElementById('endClubsList');
  if (clubsListEl) {
    clubsListEl.innerHTML = '';
    (player.clubsHistory || []).forEach(club => {
      const pill = document.createElement('span');
      pill.className = 'club-pill';
      pill.innerText = club;
      clubsListEl.appendChild(pill);
    });
  }
}

export function renderMilestonesHallOfFame(player) {
  const container = document.getElementById('endMilestonesGrid');
  const legendBadge = document.getElementById('milestoneLegendBadge');
  if (!container) return;

  const milestones = [
    {
      id: "season_bomber",
      name: "🔥 Vua Dội Bom 1 Mùa",
      desc: "Ghi trên 50 bàn thắng trong 1 mùa giải (Mốc Messi 50)",
      achieved: (player.seasonMaxGoals || 0) >= 50,
      val: `${player.seasonMaxGoals || 0} bàn`
    },
    {
      id: "ucl_legend",
      name: "⭐ Huyền Thoại Champions League",
      desc: "Ghi trên 140 bàn tại Cúp C1 Châu Âu (Mốc Ronaldo 140)",
      achieved: (player.uclGoals || 0) >= 140,
      val: `${player.uclGoals || 0} bàn C1`
    },
    {
      id: "intl_master",
      name: "🚩 Kỷ Lục Bàn Thắng ĐTQG Mọi Thời Đại",
      desc: "Cán mốc 130+ bàn thắng cho ĐTQG (Phá kỷ lục CR7 130+)",
      achieved: (player.intlGoals || 0) >= 130,
      val: `${player.intlGoals || 0} bàn ĐTQG`
    },
    {
      id: "ballondor_record",
      name: "👑 Kỷ Lục Quả Bóng Vàng Lịch Sử",
      desc: "Đoạt từ 8 Quả Bóng Vàng trở lên (Mốc Messi 8 QBV)",
      achieved: player.ballonDorWins >= 8,
      val: `${player.ballonDorWins} Quả Bóng Vàng`
    }
  ];

  let anyAchieved = milestones.some(m => m.achieved);
  if (legendBadge) {
    legendBadge.style.display = anyAchieved ? "inline-block" : "none";
  }

  container.innerHTML = '';
  milestones.forEach(m => {
    const div = document.createElement('div');
    div.className = `milestone-item ${m.achieved ? 'achieved' : ''}`;
    div.innerHTML = `
      <div class="milestone-icon">${m.achieved ? '🏅' : '⏳'}</div>
      <div class="milestone-info">
        <div class="milestone-name">${m.name}</div>
        <div class="milestone-desc">${m.desc} (Đạt được: ${m.val})</div>
      </div>
      <div>
        ${m.achieved 
          ? `<span style="color:var(--accent-gold); font-size:0.75rem; font-weight:900;">ĐÃ MỞ KHÓA</span>` 
          : `<span style="color:var(--text-dim); font-size:0.75rem;">CHƯA ĐẠT</span>`}
      </div>
    `;
    container.appendChild(div);
  });
}

export function renderGoatComparisonTable(player) {
  const container = document.getElementById('goatLeaderboardBody');
  if (!container) return;

  const playerGoatScore = calculatePlayerGoatScore(player);
  const playerUcl = player.trophiesTally["UEFA Champions League (C1)"] || 0;
  const playerWc = player.trophiesTally["FIFA World Cup"] || 0;

  const playerLegendEntry = {
    name: `${player.name} (BẠN)`,
    flag: player.nationality.flag,
    goals: player.totalCareerGoals,
    ucl: playerUcl,
    wc: playerWc,
    ballonDor: player.ballonDorWins,
    goatScore: playerGoatScore,
    icon: playerGoatScore >= 97.0 ? "🐐" : (playerGoatScore >= 93.0 ? "👑" : "🌟"),
    isPlayer: true
  };

  const allLegends = [...ALL_TIME_LEGENDS, playerLegendEntry];
  allLegends.sort((a, b) => b.goatScore - a.goatScore);

  container.innerHTML = '';
  allLegends.forEach((item, index) => {
    const tr = document.createElement('tr');
    tr.className = item.isPlayer ? 'goat-row player-row' : 'goat-row';
    
    let rankBadge = `${index + 1}`;
    if (index === 0) rankBadge = "🥇 1";
    else if (index === 1) rankBadge = "🥈 2";
    else if (index === 2) rankBadge = "🥉 3";

    tr.innerHTML = `
      <td><span class="rank-pill">${rankBadge}</span></td>
      <td><strong>${item.icon} ${item.name}</strong> ${item.flag}</td>
      <td>${item.goals}</td>
      <td>${item.ucl} 🏆</td>
      <td>${item.wc} 🏆</td>
      <td><strong style="color:var(--accent-gold);">${item.ballonDor} 👑</strong></td>
      <td><strong style="color:var(--accent-green); font-size:1rem; font-family:'JetBrains Mono',monospace;">${item.goatScore.toFixed(1)}</strong></td>
    `;
    container.appendChild(tr);
  });
}

export function renderEndRecordsList(player) {
  const container = document.getElementById('endRecordsList');
  if (!container) return;
  container.innerHTML = '';

  ALL_TIME_RECORDS.forEach(rec => {
    const isBroken = rec.isAchieved(player);
    const curVal = rec.checkFn(player);
    const percent = Math.min(100, Math.round((curVal / rec.target) * 100));

    let dispCurrent = curVal;
    let dispTarget = rec.target;
    if (rec.formatVal) {
      dispCurrent = rec.formatVal(curVal);
      dispTarget = rec.formatVal(rec.target);
    } else {
      dispCurrent = `${curVal} ${rec.unit}`;
      dispTarget = `${rec.target} ${rec.unit}`;
    }

    const card = document.createElement('div');
    card.className = `record-card ${isBroken ? 'broken' : ''}`;
    card.innerHTML = `
      <div class="record-card-top">
        <div class="record-card-icon">${rec.icon}</div>
        <div class="record-card-title-wrap">
          <div class="record-card-title">${rec.title}</div>
          <div class="record-card-holder">${rec.holder}</div>
        </div>
        <div>
          ${isBroken 
            ? `<span class="record-status-pill achieved">🏅 ĐÃ PHÁ VỠ</span>` 
            : `<span class="record-status-pill">❌ CHƯA ĐẠT</span>`}
        </div>
      </div>
      <div class="record-progress-container">
        <div class="record-progress-label">
          <span>Thành tích: ${dispCurrent} (Mốc: ${dispTarget})</span>
          <span>${percent}%</span>
        </div>
        <div class="record-progress-bar-bg">
          <div class="record-progress-bar-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

export function selectPostRetirementPath(pathType, player) {
  player.selectedPostCareer = pathType;

  document.querySelectorAll('.career-path-card').forEach(c => c.classList.remove('selected'));
  const targetCard = document.getElementById(`path${pathType.charAt(0).toUpperCase() + pathType.slice(1).toLowerCase()}`);
  if (targetCard) targetCard.classList.add('selected');

  const certBox = document.getElementById('postCareerCertificate');
  if (!certBox) return;

  certBox.style.display = "block";
  const netWorth = calculateNetWorth(player);

  if (pathType === 'MANAGER') {
    certBox.innerHTML = `
      <div class="career-certificate-title">👔 BỔ NHIỆM: TÂN HUẤN LUYỆN VIÊN TRƯỞNG QUYỀN LỰC</div>
      <div class="career-certificate-desc">
        Chủ tịch CLB hàng đầu châu Âu chính thức ký hợp đồng 5 năm với bạn với mức lương <strong>$12,000,000/năm</strong>. Tư duy chiến thuật thiên tài và uy tín lẫy lừng của bạn thu hút hàng loạt siêu sao cập bến, mở ra một triều đại thống trị mới tại UEFA Champions League!
      </div>
    `;
  } else if (pathType === 'PUNDIT') {
    certBox.innerHTML = `
      <div class="career-certificate-title">🎙️ KÝ KẾT: CHUYÊN GIA BÌNH LUẬN TRUYỀN HÌNH ĐỘC QUYỀN</div>
      <div class="career-certificate-desc">
        Đài truyền hình quốc tế Sky Sports & BBC ký hợp đồng độc quyền trị giá <strong>$25,000,000</strong>. Góc nhìn sắc sảo cùng vị thế huyền thoại biến các chương trình phân tích chiến thuật của bạn thành tâm điểm thu hút hàng chục triệu người xem toàn cầu!
      </div>
    `;
  } else {
    // OWNER
    certBox.innerHTML = `
      <div class="career-certificate-title">👑 CHÍNH THỨC: TÂN CHỦ TỊCH & ĐỒNG SỞ HỮU CÂU LẠC BỘ</div>
      <div class="career-certificate-desc">
        Sử dụng khối tài sản ròng <strong>${formatMoney(netWorth)}</strong> tích lũy từ sự nghiệp, bạn chính thức thâu tóm 65% cổ phần chi phối câu lạc bộ bóng đá chuyên nghiệp. Bạn bổ nhiệm ban huấn luyện mới, khánh thành sân vận động hiện đại và xây dựng một đế chế bóng đá trường tồn!
      </div>
    `;
  }

  triggerConfetti();
}


