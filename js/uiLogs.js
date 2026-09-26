/* =========================================================================
   UI LOGS — CAREER LOGS & SEASON SUMMARY MODAL
   Extracted from ui.js
   ========================================================================= */
import { formatCurrency } from './uiCore.js';
import { triggerConfetti } from './uiCore.js';
import { getPlayer } from './state.js';
import { getFameTier } from './playerEngine.js';
/* =========================================================================
   7. CAREER LOGS — QUẢN LÝ NHẬT KÝ MÙA GIẢI
   ========================================================================= */

// Hàm phụ trợ tạo khung HTML cho từng dòng log
function createLogEntryElement(logData) {
  const entry = document.createElement('div');
  entry.className = `log-entry ${logData.type || 'normal'}`;
  entry.innerHTML = `
    <div class="log-head">
      <span class="log-age">NĂM ${logData.age} TUỔI (NĂM ${logData.year})</span>
      <span class="log-club">${logData.clubTitle}</span>
    </div>
    <div class="log-body"><strong>${logData.title}</strong> — ${logData.body}</div>
  `;
  return entry;
}

// 1. Thêm log mới: Vừa hiển thị lên màn hình vừa lưu vào player.seasonLogs
export function addLog(player, title, body, type = 'normal') {
  if (!player) return;
  if (!player.seasonLogs) player.seasonLogs = [];

  const clubTitle = player.isAcademyStage
    ? `${player.academy ? player.academy.icon + ' ' + player.academy.name : 'Học viện'}`
    : `${player.currentClub ? player.currentClub.icon + ' ' + player.currentClub.name + ' (' + (player.currentClub.league?.name || '') + ')' : 'CLB'}`;

  const curYearLog = player.year || 2026;
  const logData = {
    age: player.age || 16,
    year: curYearLog,
    clubTitle,
    title,
    body,
    type
  };

  // Lưu bản ghi mới nhất lên đầu danh sách
  player.seasonLogs.unshift(logData);

  const logContainer = document.getElementById('careerLog');
  if (logContainer) {
    const entry = createLogEntryElement(logData);
    logContainer.insertBefore(entry, logContainer.firstChild);
  }
}

// 2. Vẽ lại toàn bộ nhật ký đã lưu khi bấm Tải Game (Load Slot)
export function renderCareerLogs(player) {
  const logContainer = document.getElementById('careerLog');
  if (!logContainer || !player) return;

  logContainer.innerHTML = '';
  if (!player.seasonLogs || !Array.isArray(player.seasonLogs)) {
    player.seasonLogs = [];
    return;
  }

  // Duyệt và vẽ lại toàn bộ nhật ký đã lưu của mùa hiện tại
  player.seasonLogs.forEach(logData => {
    const entry = createLogEntryElement(logData);
    logContainer.appendChild(entry);
  });
}

// 3. Xóa trắng nhật ký mùa cũ khi bước sang mùa giải mới
export function clearSeasonLogs(player) {
  if (!player) return;
  player.seasonLogs = [];
  const logContainer = document.getElementById('careerLog');
  if (logContainer) {
    logContainer.innerHTML = '';
  }
}

export function addFullSeasonStructuredLog(player, title, actionReport, reportRows, seasonTotalSummary, isTrophyWin = false) {
  const logContainer = document.getElementById('careerLog');
  if (!logContainer) return;
  const entry = document.createElement('div');
  entry.className = `log-entry ${isTrophyWin ? 'trophy-win' : 'normal'}`;

  const clubTitle = player.isAcademyStage
    ? `${player.academy.icon} ${player.academy.name} (${player.academy.flag} Học viện trẻ)`
    : `${player.currentClub.icon} ${player.currentClub.name} (${player.currentClub.league.flag} ${player.currentClub.league.name})`;

  let rowsHtml = "";
  reportRows.forEach(r => {
    if (r.text) {
      let customStyle = "";
      if (r.title.includes("Quả Bóng Vàng")) customStyle = "color:var(--accent-gold); font-weight:700;";
      else if (r.title.includes("Giải Thưởng Cá Nhân")) customStyle = "color:#ec4899; font-weight:700;";
      else if (r.title.includes("Kỳ Tích")) customStyle = "color:#f59e0b; font-weight:800; background:rgba(245,158,11,0.1); padding:4px 8px; border-radius:4px;";
      else if (r.title.includes("Transfermarkt")) customStyle = "color:var(--accent-blue); font-weight:600;";
      else if (r.title.includes("Kình Địch")) customStyle = "color:var(--accent-purple); font-weight:600;";

      rowsHtml += `<div class="report-row" style="${customStyle}"><span class="rep-icon">${r.icon}</span> <strong>${r.title}:</strong> ${r.text}</div>`;
    }
  });

  const completedSeasonAge = Math.max(16, (player.age || 17) - 1);
  const completedSeasonYear = Math.max(2026, (player.year || 2027) - 1);
  const completedSeasonNum = Math.max(1, (player.seasonCount || 2) - 1);

  entry.innerHTML = `
    <div class="log-head">
      <span class="log-age">📊 TỔNG KẾT MÙA GIẢI: ${completedSeasonAge} TUỔI (MÙA ${completedSeasonNum} - NĂM ${completedSeasonYear})</span>
      <span class="log-club">${clubTitle}</span>
    </div>
    <div class="log-body"><strong>${title}</strong>: ${actionReport}</div>
    
    <div class="structured-report-box">
      ${rowsHtml}
      <div class="report-row" style="color:#38bdf8; font-weight:800; background:rgba(56,189,248,0.08); padding:6px 10px; border-radius:6px; margin-top:2px;">
        <span class="rep-icon">🔥</span> <strong>[TỔNG KẾT MÙA GIẢI]:</strong> ${seasonTotalSummary}
      </div>
    </div>
  `;

  logContainer.insertBefore(entry, logContainer.firstChild);
}

export function showSeasonSummaryModal(player, title, actionReport, reportRows = [], seasonTotalSummary = "", seasonMatches = 0, seasonGoals = 0, seasonAssists = 0, seasonCleanSheets = 0, seasonSaves = 0, seasonTackles = 0, trophiesWonCount = 0, isBallonDorWon = false, onContinue) {
  const modal = document.getElementById('seasonSummaryModal');
  if (!modal) {
    if (onContinue) onContinue();
    return;
  }

  const completedAge = player.age || 16;
  const completedYear = player.year || 2026;
  const nextAge = completedAge + 1;
  const nextYear = completedYear + 1;
  const isYouth = Boolean(player.isAcademyStage || completedAge === 16 || nextAge === 17);

  const badgeEl = document.getElementById('seasonModalBadge');
  if (badgeEl) badgeEl.innerText = `🏆 LỄ TRAO GIẢI & TỔNG KẾT MÙA GIẢI: ${completedAge} TUỔI (NĂM ${completedYear})`;

  const titleEl = document.getElementById('seasonModalTitle');
  if (titleEl) titleEl.innerText = `${player.currentClub ? player.currentClub.name : (player.academy ? player.academy.name : 'CLB')} — ${title}`;

  const descEl = document.getElementById('seasonModalDesc');
  if (descEl) descEl.innerText = actionReport;

  const grid = document.getElementById('seasonModalGrid');
  if (grid) {
    grid.innerHTML = '';
    const safeMatches = seasonMatches || 0;
    const safeGoals = seasonGoals || 0;
    const safeAssists = seasonAssists || 0;
    const safeCleanSheets = seasonCleanSheets || 0;
    const safeSaves = seasonSaves || 0;
    const safeTackles = seasonTackles || 0;
    const safeTrophies = trophiesWonCount || (player.seasonTrophiesWonList ? player.seasonTrophiesWonList.length : 0);

    const stats = [
      { lbl: "Số Trận Ra Sân", val: `${safeMatches} trận`, icon: "👕", color: "#38bdf8" },
      player.position === "GK"
        ? { lbl: "Trận Sạch Lưới", val: `${safeCleanSheets} trận`, icon: "🧤", color: "#10b981" }
        : (player.position === "DF" ? { lbl: "Tắc Bóng Chuẩn", val: `${safeTackles} pha`, icon: "🛡️", color: "#10b981" } : { lbl: "Bàn Thắng Mùa", val: `${safeGoals} ⚽`, icon: "⚽", color: "#f59e0b" }),
      player.position === "GK"
        ? { lbl: "Pha Cứu Thua", val: `${safeSaves} pha`, icon: "🛡️", color: "#f59e0b" }
        : { lbl: "Kiến Tạo Mùa", val: `${safeAssists} 🎯`, icon: "🎯", color: "#a855f7" },
      { lbl: "Danh Hiệu Mùa", val: `${safeTrophies} Cúp 🏆`, icon: "🏆", color: "#ec4899" }
    ];

    stats.forEach(s => {
      const card = document.createElement('div');
      card.style.cssText = "background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; text-align: center;";
      card.innerHTML = `
        <div style="font-size: 1.3rem; margin-bottom: 2px;">${s.icon}</div>
        <div style="font-size: 1.15rem; font-weight: 800; color: ${s.color}; font-family: 'JetBrains Mono', monospace;">${s.val}</div>
        <div style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase; font-weight: 600; margin-top: 2px;">${s.lbl}</div>
      `;
      grid.appendChild(card);
    });
  }

  const rowsContainer = document.getElementById('seasonModalRows');
  if (rowsContainer) {
    rowsContainer.innerHTML = '';
    rowsContainer.style.maxHeight = '340px';
    rowsContainer.style.overflowY = 'auto';
    rowsContainer.style.display = 'flex';
    rowsContainer.style.flexDirection = 'column';
    rowsContainer.style.gap = '10px';

    // 1. Phân loại danh hiệu tập thể mùa này (Team Trophies)
    const trophiesList = player.trophies || [];
    const leagueRow = reportRows.find(r => r.title && (r.title.includes("VĐQG") || r.title.includes("League") || r.title.includes("Giải")));
    const cupRow = reportRows.find(r => r.title && (r.title.includes("Cúp Trẻ") || r.title.includes("Cúp Quốc Gia") || r.title.includes("Cup")));
    const uclRow = reportRows.find(r => r.title && (r.title.includes("Youth League") || r.title.includes("C1") || r.title.includes("Champions") || r.title.includes("Cúp Châu Âu")));

    const wonLeague = Boolean((leagueRow && leagueRow.text && leagueRow.text.includes("VÔ ĐỊCH")) || trophiesList.includes("Giải VĐQG U19 Academy") || trophiesList.some(t => typeof t === 'string' && t.includes("VĐQG")));
    const wonCup = Boolean((cupRow && cupRow.text && cupRow.text.includes("VÔ ĐỊCH")) || trophiesList.includes("Cúp Trẻ Quốc Gia U19") || trophiesList.some(t => typeof t === 'string' && (t.includes("Cúp Quốc Gia") || t.includes("Cúp Trẻ"))));
    const wonYouthC1 = Boolean((uclRow && uclRow.text && uclRow.text.includes("VÔ ĐỊCH")) || trophiesList.includes("UEFA Youth League (Cúp C1 Trẻ)") || trophiesList.some(t => typeof t === 'string' && (t.includes("Youth League") || t.includes("Champions League"))));
    const runnerUpYouthC1 = Boolean(uclRow && uclRow.text && uclRow.text.includes("Á Quân"));

    const teamTrophiesCard = document.createElement('div');
    teamTrophiesCard.style.cssText = "background: linear-gradient(135deg, rgba(245, 158, 11, 0.12), rgba(16, 185, 129, 0.08)); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 8px; padding: 12px 14px; text-align: left;";
    teamTrophiesCard.innerHTML = `
      <div style="font-weight: 800; font-size: 0.95rem; color: var(--accent-gold); display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
        <span>🏆</span> <span>CÁC DANH HIỆU TẬP THỂ ĐẠT ĐƯỢC MÙA NÀY</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.88rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.08);">
          <span>🏆 <strong>${isYouth ? 'Giải VĐQG U19 Academy' : (player.currentClub?.league?.name || 'Giải VĐQG')}:</strong></span>
          <span style="font-weight: 800; ${wonLeague ? 'color: #10b981; background: rgba(16,185,129,0.15); padding: 2px 8px; border-radius: 4px;' : 'color: #94a3b8;'}">
            ${wonLeague ? '🥇 VÔ ĐỊCH' : (leagueRow ? leagueRow.text.replace(/^[🏆🥈🥉]\s*/, '').slice(0, 32) : 'Top BXH')}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.08);">
          <span>🛡️ <strong>${isYouth ? 'Cúp Trẻ Quốc Gia U19' : 'Cúp Quốc Gia'}:</strong></span>
          <span style="font-weight: 800; ${wonCup ? 'color: #10b981; background: rgba(16,185,129,0.15); padding: 2px 8px; border-radius: 4px;' : 'color: #94a3b8;'}">
            ${wonCup ? '🥇 VÔ ĐỊCH' : (cupRow ? cupRow.text.replace(/^[🏆🥈🥉]\s*/, '').slice(0, 32) : 'Tham dự')}
          </span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
          <span>🌍 <strong>${isYouth ? 'UEFA Youth League (Cúp C1 Trẻ)' : 'UEFA Champions League'}:</strong></span>
          <span style="font-weight: 800; ${wonYouthC1 ? 'color: #10b981; background: rgba(16,185,129,0.15); padding: 2px 8px; border-radius: 4px;' : (runnerUpYouthC1 ? 'color: #38bdf8; background: rgba(56,189,248,0.15); padding: 2px 8px; border-radius: 4px;' : 'color: #94a3b8;')}">
            ${wonYouthC1 ? '🥇 VÔ ĐỊCH' : (runnerUpYouthC1 ? '🥈 Á QUÂN' : (uclRow ? uclRow.text.replace(/^[🏆🥈🥉]\s*/, '').slice(0, 32) : 'Vòng Bảng'))}
          </span>
        </div>
      </div>
    `;
    rowsContainer.appendChild(teamTrophiesCard);

    // 2. Phân loại giải thưởng cá nhân (Individual Awards)
    const allWonThisYear = [
      ...(Array.isArray(trophiesList) ? trophiesList : []),
      ...(Array.isArray(player.seasonTrophiesWonThisYear) ? player.seasonTrophiesWonThisYear : [])
    ];
    const uniqueWonTrophies = Array.from(new Set(allWonThisYear));

    // Lọc danh sách Vua Phá Lưới & Vua Kiến Tạo & Cầu Thủ Xuất Sắc Nhất đã đạt được mùa này
    const wonTopScorerTitles = uniqueWonTrophies.filter(t => typeof t === 'string' && (t.includes("Vua Phá Lưới") || t.includes("Top Scorer")));
    const wonTopPlaymakerTitles = uniqueWonTrophies.filter(t => typeof t === 'string' && (t.includes("Vua Kiến Tạo") || t.includes("Top Playmaker")));
    const wonMvpTitles = uniqueWonTrophies.filter(t => typeof t === 'string' && (
      t.includes("Cầu Thủ Xuất Sắc Nhất") ||
      t.includes("World Cup Best Player") ||
      t.includes("Player of the Season") ||
      t.includes("MVP")
    ));
    const wonMajorAnnualAwards = uniqueWonTrophies.filter(t => typeof t === 'string' && (
      t.includes("Quả Bóng Vàng") || 
      t.includes("Chiếc Giày Vàng") || 
      t.includes("FIFA The Best") || 
      t.includes("Găng Tay Vàng")
    ));

    let awardsItemsHtml = '';

    if (wonMvpTitles.length > 0) {
      wonMvpTitles.forEach(title => {
        awardsItemsHtml += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.08);">
            <span>🏅 <strong>${title}:</strong></span>
            <span style="font-weight: 800; color: #38bdf8; background: rgba(56,189,248,0.2); padding: 2px 8px; border-radius: 4px;">
              🥇 CHIẾN THẮNG
            </span>
          </div>
        `;
      });
    }

    if (wonTopScorerTitles.length > 0) {
      wonTopScorerTitles.forEach(title => {
        awardsItemsHtml += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.08);">
            <span>👟 <strong>${title}:</strong></span>
            <span style="font-weight: 800; color: #fbbf24; background: rgba(245,158,11,0.2); padding: 2px 8px; border-radius: 4px;">
              🥇 CHIẾN THẮNG
            </span>
          </div>
        `;
      });
    } else {
      awardsItemsHtml += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.08);">
          <span>👟 <strong>Hiệu suất Ghi Bàn Mùa Giải:</strong></span>
          <span style="font-weight: 700; color: #e2e8f0;">
            ${seasonGoals || player.currentSeasonStats?.goals || 0} bàn thắng
          </span>
        </div>
      `;
    }

    if (wonTopPlaymakerTitles.length > 0) {
      wonTopPlaymakerTitles.forEach(title => {
        awardsItemsHtml += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.08);">
            <span>🎯 <strong>${title}:</strong></span>
            <span style="font-weight: 800; color: #c084fc; background: rgba(168,85,247,0.2); padding: 2px 8px; border-radius: 4px;">
              🎯 CHIẾN THẮNG
            </span>
          </div>
        `;
      });
    } else {
      awardsItemsHtml += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.08);">
          <span>🎯 <strong>Hiệu suất Kiến Tạo Mùa Giải:</strong></span>
          <span style="font-weight: 700; color: #e2e8f0;">
            ${seasonAssists || player.currentSeasonStats?.assists || 0} kiến tạo
          </span>
        </div>
      `;
    }

    if (wonMajorAnnualAwards.length > 0) {
      wonMajorAnnualAwards.forEach(title => {
        const isBdor = title.includes("Quả Bóng Vàng");
        awardsItemsHtml += `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed rgba(255,255,255,0.08);">
            <span>${isBdor ? '👑' : '🌟'} <strong>${title}:</strong></span>
            <span style="font-weight: 900; color: #fbbf24; background: rgba(245,158,11,0.25); padding: 2px 8px; border-radius: 4px;">
              🏆 ĐOẠT GIẢI
            </span>
          </div>
        `;
      });
    } else if (isBallonDorWon) {
      awardsItemsHtml += `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 4px 0;">
          <span>👑 <strong>Quả Bóng Vàng Thế Giới (Ballon d'Or):</strong></span>
          <span style="font-weight: 900; color: #fbbf24; background: rgba(245,158,11,0.25); padding: 2px 8px; border-radius: 4px;">
            🥇 CHIẾN THẮNG
          </span>
        </div>
      `;
    }

    const personalAwardsCard = document.createElement('div');
    personalAwardsCard.style.cssText = "background: linear-gradient(135deg, rgba(168, 85, 247, 0.12), rgba(236, 72, 153, 0.08)); border: 1px solid rgba(168, 85, 247, 0.35); border-radius: 8px; padding: 12px 14px; text-align: left;";
    personalAwardsCard.innerHTML = `
      <div style="font-weight: 800; font-size: 0.95rem; color: #c084fc; display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
        <span>🏅</span> <span>CÁC GIẢI THƯỞNG CÁ NHÂN DANH GIÁ</span>
      </div>
      <div style="display: flex; flex-direction: column; gap: 6px; font-size: 0.88rem;">
        ${awardsItemsHtml}
      </div>
    `;
    rowsContainer.appendChild(personalAwardsCard);

    // 3. Đánh giá mùa giải & Lời chúc mừng từ Ban huấn luyện (Coaching Staff Review)
    const coachingMsg = isYouth
      ? "Thầy và toàn thể Ban huấn luyện vô cùng xúc động và tự hào trước những bước tiến thần tốc cùng chuỗi danh hiệu đỉnh cao của em ở mùa giải U19 Academy vừa qua. Với tài năng kiệt xuất, kỷ luật thép và bản lĩnh chiến đấu ngoan cường, em hoàn toàn xứng đáng bước lên nấc thang mới: ĐÔN LÊN ĐỘI 1 THI ĐẤU CHUYÊN NGHIỆP!"
      : "Ban huấn luyện và CLB ghi nhận trọn vẹn tinh thần thi đấu quả cảm và những đóng góp to lớn của em cho tập thể mùa giải này. Tiếp tục duy trì phong độ đỉnh cao, chăm chỉ rèn luyện và sẵn sàng chinh phục những đỉnh cao mới ở mùa giải tiếp theo!";

    const coachingCard = document.createElement('div');
    coachingCard.style.cssText = "background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 8px; padding: 12px 14px; text-align: left;";
    coachingCard.innerHTML = `
      <div style="font-weight: 800; font-size: 0.95rem; color: #38bdf8; display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
        <span>📈</span> <span>ĐÁNH GIÁ MÙA GIẢI &amp; LỜI CHÚC MỪNG TỪ BAN HUẤN LUYỆN</span>
      </div>
      <div style="font-style: italic; font-size: 0.88rem; color: #f1f5f9; line-height: 1.55; border-left: 3px solid #38bdf8; padding-left: 10px;">
        "${coachingMsg}"
      </div>
    `;
    rowsContainer.appendChild(coachingCard);

    // 4. Các thông tin báo cáo khác (Transfermarkt, Kình địch, v.v.)
    const otherRows = reportRows.filter(r =>
      r.title &&
      !r.title.includes("VĐQG") &&
      !r.title.includes("Cúp Trẻ") &&
      !r.title.includes("Youth League") &&
      !r.title.includes("Vua Phá Lưới") &&
      !r.title.includes("Vua Kiến Tạo")
    );
    if (otherRows.length > 0) {
      const otherContainer = document.createElement('div');
      otherContainer.style.cssText = "display: flex; flex-direction: column; gap: 4px; text-align: left;";
      otherRows.forEach(r => {
        if (r.text) {
          const rowDiv = document.createElement('div');
          rowDiv.className = 'report-row';
          let customStyle = "";
          if (r.title.includes("Quả Bóng Vàng")) customStyle = "color:var(--accent-gold); font-weight:700;";
          else if (r.title.includes("Transfermarkt")) customStyle = "color:var(--accent-blue); font-weight:600;";
          else if (r.title.includes("Kình Địch")) customStyle = "color:var(--accent-purple); font-weight:600;";
          if (customStyle) rowDiv.style.cssText = customStyle;
          rowDiv.innerHTML = `<span class="rep-icon">${r.icon || '📌'}</span> <strong>${r.title}:</strong> ${r.text}`;
          otherContainer.appendChild(rowDiv);
        }
      });
      rowsContainer.appendChild(otherContainer);
    }

    const sumDiv = document.createElement('div');
    sumDiv.className = 'report-row';
    sumDiv.style.cssText = "color:#38bdf8; font-weight:800; background:rgba(56,189,248,0.08); padding:6px 10px; border-radius:6px; margin-top:4px;";
    sumDiv.innerHTML = `<span class="rep-icon">🔥</span> <strong>[TỔNG KẾT MÙA GIẢI]:</strong> ${seasonTotalSummary}`;
    rowsContainer.appendChild(sumDiv);
  }

  const btnContinue = document.getElementById('btnContinueToNewSeason');
  if (btnContinue) {
    if (isYouth || nextAge === 17) {
      btnContinue.innerText = "➡️ Tiến Vào Mùa Giải Mới (Tuổi 17 - Đôn Lên Đội 1)";
    } else {
      btnContinue.innerText = `➡️ Tiến Vào Mùa Giải Mới (Tuổi ${nextAge}) ➔`;
    }
    btnContinue.onclick = (e) => {
      e.preventDefault();
      modal.classList.remove('active');

      // === XÓA TRẮNG NHẬT KÝ MÙA CŨ KHI BẮT ĐẦU MÙA MỚI ===
      clearSeasonLogs(player);

      if (onContinue) onContinue();
    };
  }

  modal.classList.add('active');
  if (trophiesWonCount > 0 || isBallonDorWon) {
    triggerConfetti();
  }
}

export const renderSeasonEndModal = showSeasonSummaryModal;
export const renderSeasonAwardsModal = showSeasonSummaryModal;


/* =========================================================================
   8. LIFESTYLE STORE RENDERING
   ========================================================================= */
