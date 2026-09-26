/* =========================================================================
   UI MATCHDAY — MATCHDAY CENTER HUB RENDERING (FIXTURE, LIVE TABLE & TOP SCORERS)
   Extracted from ui.js
   ========================================================================= */
import { ALL_CLUBS, YOUTH_LEAGUE_CLUBS, UEFA_YOUTH_LEAGUE_CLUBS } from './data.js';
import {
  initSeasonScheduleAndTable, getTransferWindowStatus, isClubMatch, getPlayerActiveClub
} from './engine.js';
import { formatCurrency } from './uiCore.js';
import { renderTournamentBrackets } from './uiCup.js';

/**
 * Tạo seed băm số nguyên ổn định từ chuỗi ký tự (Deterministic Hash Seed)
 */
function getClubDeterministicSeed(str) {
  let hash = 0;
  if (!str) return 42;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/**
 * Tính toán trinh sát chỉ số sức mạnh đối thủ & nhận định chiến thuật động
 * @param {Object} fixture Vòng đấu hiện tại
 * @param {Object} player Dữ liệu người chơi
 */
export function getOpponentScoutingData(fixture, player) {
  const pMatch = fixture?.playerMatch;
  let opp = pMatch?.opponent;
  if (!opp && pMatch) {
    opp = pMatch.isPlayerHome ? pMatch.awayClub : pMatch.homeClub;
  }
  if (!opp) {
    opp = { name: "Đối Thủ", id: "unknown_opp", icon: "⚽" };
  }

  // 1. Xác định sức mạnh CLB của người chơi (myPower)
  const isPlayerHome = pMatch?.isPlayerHome ?? true;
  const playerTeam = pMatch ? (isPlayerHome ? pMatch.homeClub : pMatch.awayClub) : null;
  const activeClub = (typeof getPlayerActiveClub === 'function' ? getPlayerActiveClub(player) : null) || player?.club;

  let myPower = Number(playerTeam?.power) || Number(activeClub?.power) || 0;
  if (myPower <= 0) {
    const pTeamId = playerTeam?.id || activeClub?.id;
    const pTeamName = playerTeam?.name || activeClub?.name;
    const matchedMyClub = (typeof ALL_CLUBS !== 'undefined' ? ALL_CLUBS : []).find(c => (pTeamId && c.id === pTeamId) || (pTeamName && c.name === pTeamName))
      || (typeof YOUTH_LEAGUE_CLUBS !== 'undefined' ? YOUTH_LEAGUE_CLUBS : []).find(c => (pTeamId && (c.id === pTeamId || c.idAlias === pTeamId)) || (pTeamName && c.name === pTeamName))
      || (typeof UEFA_YOUTH_LEAGUE_CLUBS !== 'undefined' ? UEFA_YOUTH_LEAGUE_CLUBS : []).find(c => (pTeamId && (c.id === pTeamId || c.idAlias === pTeamId)) || (pTeamName && c.name === pTeamName));

    if (matchedMyClub?.power) {
      myPower = Number(matchedMyClub.power);
    } else {
      const isYouth = (player?.age && player.age <= 16) || fixture?.competitionName?.includes('U19') || fixture?.competitionName?.includes('Trẻ');
      myPower = isYouth ? 76 : 80;
    }
  }

  // 2. Xác định sức mạnh CLB đối thủ (oppPower)
  const oppId = opp?.id || opp?.clubId || "";
  const oppName = opp?.name || opp?.clubName || "";
  let oppPower = Number(opp?.power) || Number(opp?.rating) || Number(opp?.overall) || 0;

  if (oppPower <= 0) {
    const matchedOpp = (typeof ALL_CLUBS !== 'undefined' ? ALL_CLUBS : []).find(c => (oppId && c.id === oppId) || (oppName && c.name === oppName))
      || (typeof YOUTH_LEAGUE_CLUBS !== 'undefined' ? YOUTH_LEAGUE_CLUBS : []).find(c => (oppId && (c.id === oppId || c.idAlias === oppId)) || (oppName && c.name === oppName))
      || (typeof UEFA_YOUTH_LEAGUE_CLUBS !== 'undefined' ? UEFA_YOUTH_LEAGUE_CLUBS : []).find(c => (oppId && (c.id === oppId || c.idAlias === oppId)) || (oppName && c.name === oppName));

    if (matchedOpp?.power) {
      oppPower = Number(matchedOpp.power);
    } else {
      // Fallback hợp lý theo tier: U19: 68-78, Chuyên nghiệp: 75-88
      const isYouthTier = (player?.age && player.age <= 16) ||
        fixture?.competitionName?.includes('U19') ||
        fixture?.competitionName?.includes('Trẻ') ||
        fixture?.competitionName?.includes('Youth') ||
        (oppId && (oppId.includes('youth') || oppId.includes('acad') || oppId.includes('masia') || oppId.includes('castilla')));

      const seedVal = getClubDeterministicSeed(oppId || oppName || 'opp');
      if (isYouthTier) {
        oppPower = 68 + (seedVal % 11); // 68 đến 78
      } else {
        oppPower = 75 + (seedVal % 14); // 75 đến 88
      }
    }
  }

  // 3. Tính toán động 3 chỉ số (Công: power ±3, Tuyến giữa: power ±2, Thủ: power ±3)
  // Seed ổn định từ tên/id CLB đối thủ để giữ nguyên chỉ số giữa các lần re-render
  const seed = getClubDeterministicSeed(`${oppId}_${oppName}_${oppPower}`);
  const attOffset = (seed % 7) - 3;                    // -3 đến +3
  const midOffset = (Math.floor(seed / 7) % 5) - 2;   // -2 đến +2
  const defOffset = (Math.floor(seed / 35) % 7) - 3;  // -3 đến +3

  let att = (opp?.attPower !== undefined && opp.attPower !== oppPower)
    ? Math.min(oppPower + 3, Math.max(oppPower - 3, opp.attPower))
    : (oppPower + attOffset);

  let mid = (opp?.midPower !== undefined && opp.midPower !== oppPower)
    ? Math.min(oppPower + 2, Math.max(oppPower - 2, opp.midPower))
    : (oppPower + midOffset);

  let def = (opp?.defPower !== undefined && opp.defPower !== oppPower)
    ? Math.min(oppPower + 3, Math.max(oppPower - 3, opp.defPower))
    : (oppPower + defOffset);

  // Tránh trường hợp cả 3 chỉ số phẳng hoàn toàn
  if (att === mid && mid === def) {
    att = oppPower + 1;
    def = oppPower - 1;
  }

  // Giới hạn trong khoảng hợp lệ
  att = Math.min(99, Math.max(50, att));
  mid = Math.min(99, Math.max(50, mid));
  def = Math.min(99, Math.max(50, def));

  // 4. Động hóa câu ⭐ Nhận định (Scouting Report)
  const powerDiff = myPower - oppPower;
  let scoutingDesc = "";
  if (powerDiff > 5) {
    scoutingDesc = "Đối thủ chiếu dưới, cơ hội tuyệt vời để bùng nổ bàn thắng!";
  } else if (powerDiff < -5) {
    scoutingDesc = "Thử thách cực đại trước đối thủ vượt trội! Cần tận dụng tối đa từng cơ hội phản công.";
  } else {
    scoutingDesc = "Trận đại chiến cân não! Cần duy trì tập trung tối đa suốt 90 phút.";
  }

  return {
    opp,
    oppPower,
    myPower,
    powerDiff,
    att,
    mid,
    def,
    scoutingDesc
  };
}

/* =========================================================================
   3.1 MATCHDAY CENTER HUB RENDERING (FIXTURE, LIVE TABLE & TOP SCORERS)
   ========================================================================= */
export function renderMatchdayHub(player) {
  if (!player.currentSeasonFixtures || player.currentSeasonFixtures.length === 0) {
    if (typeof initSeasonScheduleAndTable === 'function') {
      initSeasonScheduleAndTable(player);
    }
  }

  let curIdx = player.currentFixtureIndex || 0;
  const fixtures = player.currentSeasonFixtures || [];

  // 1. TỰ ĐỘNG PHÁ BẪY KẸT VÒNG ĐẤU MÙA CŨ (SELF-HEALING)
  // Kiểm tra xem mùa giải mới này đã có trận nào thực sự được đá chưa
  const curStats = player.currentSeasonStats || {};
  const hasPlayedMatches = (curStats.matches && curStats.matches > 0) ||
    (player.leagueTable && player.leagueTable.some(t => (t.won || t.draw || t.lost || t.points || 0) > 0));

  // Nếu mùa giải mới tinh (chưa đá trận nào) mà curIdx lại >= số trận -> chắc chắn kẹt từ mùa cũ, ép về 0 ngay!
  if (fixtures.length > 0 && curIdx >= fixtures.length && !hasPlayedMatches) {
    player.currentFixtureIndex = 0;
    curIdx = 0;
    player.isSeasonEnded = false;
    player.seasonEnded = false;
  }

  // CHỈ COI LÀ KẾT THÚC KHI: Có lịch thi đấu VÀ đã đá hết VÀ thực tế trong mùa ĐÃ CÓ TRẬN ĐƯỢC ĐÁ!
  const isFinished = fixtures.length > 0 && curIdx >= fixtures.length && hasPlayedMatches;

  const bannerCard = document.getElementById('matchdayBannerCard');
  if (!bannerCard) return;

  if (isFinished) {
    bannerCard.innerHTML = `
      <div style="text-align:center; padding: 24px 10px;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🏆</div>
        <h2 style="font-size: 1.4rem; color: var(--accent-gold); font-weight: 900; margin-bottom: 6px;">
          MÙA GIẢI ĐÃ CHÍNH THỨC KHÉP LẠI!
        </h2>
        <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 500px; margin: 0 auto 18px auto;">
          Bạn đã hoàn thành trọn vẹn tất cả ${fixtures.length} vòng đấu của mùa giải. Hãy tổng kết thành tích, nhận giải thưởng cá nhân và danh hiệu tập thể!
        </p>
        <button class="btn btn-primary btn-season-summary" id="btn-season-end-awards" data-legacy-id="btnFinishSeasonAndRollover" style="font-size: 1rem; font-weight: 800; padding: 12px 28px; cursor: pointer;">
          🎉 Tổng Kết Mùa Giải &amp; Lễ Trao Giải
        </button>
      </div>
    `;
    const btnEnd = document.getElementById('btn-season-end-awards') || document.getElementById('btnFinishSeasonAndRollover');
    if (btnEnd) {
      btnEnd.onclick = (e) => {
        if (e) e.preventDefault();
        if (typeof window !== 'undefined' && typeof window.openSeasonAwardsModal === 'function') {
          window.openSeasonAwardsModal();
        } else if (typeof window !== 'undefined' && typeof window.onSeasonCompletedRollover === 'function') {
          window.onSeasonCompletedRollover();
        }
      };
    }
    renderLiveLeagueTable(player);
    renderTopScorers(player);
    renderFixturesList(player);
    return;
  }

  // 2. KHÔI PHỤC LẠI GIAO DIỆN SÀN ĐẤU NẾU TRƯỚC ĐÓ BỊ BANNER KẾT THÚC MÙA ĐÈ MẤT
  if (!document.getElementById('bannerHomeName')) {
    bannerCard.innerHTML = `
      <div class="matchday-banner-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <div style="display:flex; gap:8px; align-items:center;">
          <span id="bannerCompBadge" style="font-size:0.75rem; font-weight:800; color:var(--accent-gold);"></span>
          <span id="bannerRoundBadge" style="font-size:0.72rem; color:var(--text-muted);"></span>
          <span id="bannerStadiumBadge" style="font-size:0.72rem; color:var(--text-muted);"></span>
        </div>
        <div id="bannerTagsContainer" style="display:flex; gap:6px;"></div>
      </div>

      <div class="matchday-banner-clash" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span id="bannerHomeIcon" style="font-size:1.8rem;">⚽</span>
          <div>
            <div id="bannerHomeName" style="font-size:1.1rem; font-weight:900; color:#fff;">Đội Nhà</div>
            <div id="bannerHomeRank" style="font-size:0.72rem; color:var(--text-muted);">Hạng # -</div>
            <div id="bannerHomeForm" style="display:flex; gap:2px; margin-top:3px;"></div>
          </div>
        </div>

        <div style="text-align:center;">
          <div style="background:#ef4444; color:#fff; font-weight:900; font-size:0.85rem; padding:4px 12px; border-radius:6px; display:inline-block;">VS</div>
          <div id="bannerDifficultyBadge" style="font-size:0.7rem; color:var(--accent-gold); margin-top:4px;"></div>
        </div>

        <div style="display:flex; align-items:center; gap:10px; flex-direction:row-reverse; text-align:right;">
          <span id="bannerAwayIcon" style="font-size:1.8rem;">⚽</span>
          <div>
            <div id="bannerAwayName" style="font-size:1.1rem; font-weight:900; color:#fff;">Đội Khách</div>
            <div id="bannerAwayRank" style="font-size:0.72rem; color:var(--text-muted);">Hạng # -</div>
            <div id="bannerAwayForm" style="display:flex; gap:2px; margin-top:3px; justify-content:flex-end;"></div>
          </div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(0,0,0,0.3); padding:8px 12px; border-radius:8px; margin-bottom:12px; font-size:0.75rem;">
        <div style="display:flex; gap:12px;">
          <span>⚔️ Công: <strong id="scoutAtt">--</strong></span>
          <span>⚡ Tuyến giữa: <strong id="scoutMid">--</strong></span>
          <span>🛡️ Thủ: <strong id="scoutDef">--</strong></span>
        </div>
        <div id="scoutDesc" style="color:var(--accent-gold); font-size:0.72rem;"></div>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px; margin-bottom:14px;">
        <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
          <span style="font-size:0.72rem; font-weight:800; color:var(--text-muted);">⚔️ CHIẾN THUẬT:</span>
          <button class="tactic-pill" data-tactic="ATTACKING">⚔️ Tấn Công Áp Đặt</button>
          <button class="tactic-pill" data-tactic="GEGENPRESSING">🔥 Gegenpressing</button>
          <button class="tactic-pill active" data-tactic="BALANCED">⚖️ Cân Bằng</button>
          <button class="tactic-pill" data-tactic="COUNTER">⚡ Phản Công Nhanh</button>
          <button class="tactic-pill" data-tactic="PARK_THE_BUS">🚌 Dựng Xe Buýt</button>
        </div>
        <div style="display:flex; gap:6px; align-items:center; flex-wrap:wrap;">
          <span style="font-size:0.72rem; font-weight:800; color:var(--text-muted);">⚡ CHUẨN BỊ:</span>
          <button class="btn-prep" id="btnPrepRest" data-prep="REST">☕ Dưỡng Sức (+28% Stam)</button>
          <button class="btn-prep" id="btnPrepVideo" data-prep="VIDEO_ANALYSIS">📺 Soi Băng Hình (+0.3 Rating)</button>
          <button class="btn-prep" id="btnPrepTrain" data-prep="LIGHT_TRAIN">🏃 Khởi Động (+10 Form)</button>
          <button class="btn-prep" id="btnPrepIntense" data-prep="INTENSE_DRILL">🏋️ Tập Nặng (+20 Form, -18% Stam)</button>
        </div>
      </div>

      <div style="display:flex; gap:10px;">
        <button id="btnPlayMatchArena" class="btn btn-success" style="flex:2; padding:12px; font-weight:900; font-size:0.95rem; border-radius:8px; background:linear-gradient(135deg, #10b981, #059669); color:#fff; border:none; cursor:pointer;">
          ⚽ RA SÂN THI ĐẤU (MATCH ARENA)
        </button>
        <button id="btnQuickSimMatch" class="btn btn-outline" style="flex:1; padding:12px; font-weight:700; font-size:0.82rem; border-radius:8px; cursor:pointer;">
          ⚡ Mô Phỏng Nhanh (Quick Sim)
        </button>
        <button id="btnSimulate5Matches" class="btn btn-outline" style="flex:1; padding:12px; font-weight:700; font-size:0.82rem; border-radius:8px; cursor:pointer;">
          ⏩ Mô Phỏng 5 Vòng Tiếp
        </button>
      </div>
    `;
  }

  const fixture = fixtures[curIdx];
  const pMatch = fixture?.playerMatch;
  let opp = pMatch?.opponent;
  if (!opp && pMatch) {
    opp = pMatch.isPlayerHome ? pMatch.awayClub : pMatch.homeClub;
  }
  if (!opp) {
    opp = { name: "Đối Thủ", id: "unknown_opp", icon: "⚽" };
  }

  // 1. Meta Badges
  const compBadge = document.getElementById('bannerCompBadge');
  const roundBadge = document.getElementById('bannerRoundBadge');
  const stadiumBadge = document.getElementById('bannerStadiumBadge');
  const tagsContainer = document.getElementById('bannerTagsContainer');

  const isNationalMatch = fixture.competitionType === 'NATIONAL_TEAM' || pMatch?.isNationalTeam;
  if (compBadge) {
    if (isNationalMatch) {
      compBadge.innerText = `🚩 ${fixture.competitionName}`;
      compBadge.style.color = '#34d399';
    } else {
      compBadge.innerText = `🏆 ${fixture.competitionName}`;
      compBadge.style.color = '';
    }
  }
  if (roundBadge) roundBadge.innerText = fixture.stageName;
  if (stadiumBadge) stadiumBadge.innerText = `🏟️ ${pMatch?.stadium || 'Sân Vận Động'}`;

  if (tagsContainer) {
    let tagsHtml = '';
    if (isNationalMatch) {
      tagsHtml += `<span style="background:linear-gradient(135deg, #10b981, #059669); color:#fff; padding:3px 10px; border-radius:12px; font-size:0.74rem; font-weight:800; box-shadow:0 0 10px rgba(16,185,129,0.4);">🚩 FIFA DAYS QUỐC TẾ</span>`;
    }
    if (pMatch?.isDerby) {
      tagsHtml += `<span style="background:#ef4444; color:#fff; padding:3px 9px; border-radius:12px; font-size:0.72rem; font-weight:800; box-shadow:0 0 10px rgba(239,68,68,0.4);">🔥 DERBY TRUYỀN KIẾP</span>`;
    } else if (pMatch?.isBigMatch) {
      tagsHtml += `<span style="background:#f59e0b; color:#000; padding:3px 9px; border-radius:12px; font-size:0.72rem; font-weight:800; box-shadow:0 0 10px rgba(245,158,11,0.4);">⚔️ ĐẠI CHIẾN ĐỈNH CAO</span>`;
    }
    if (fixture.stageName && fixture.stageName.includes('Chung Kết')) {
      tagsHtml += `<span style="background:linear-gradient(135deg, #ffd700, #f59e0b); color:#000; padding:3px 10px; border-radius:12px; font-size:0.75rem; font-weight:900; margin-left:4px;">👑 CHUNG KẾT TRANH CÚP</span>`;
    }
    tagsContainer.innerHTML = tagsHtml;
  }

  // 2. Clubs Display
  const homeIcon = document.getElementById('bannerHomeIcon');
  const homeName = document.getElementById('bannerHomeName');
  const homeRank = document.getElementById('bannerHomeRank');
  const homeForm = document.getElementById('bannerHomeForm');

  const awayIcon = document.getElementById('bannerAwayIcon');
  const awayName = document.getElementById('bannerAwayName');
  const awayRank = document.getElementById('bannerAwayRank');
  const awayForm = document.getElementById('bannerAwayForm');

  if (homeIcon) homeIcon.innerText = pMatch?.homeClub?.icon || pMatch?.homeClub?.flag || "⚽";
  if (homeName) homeName.innerText = pMatch?.homeClub?.name || "Đội Nhà";
  if (awayIcon) awayIcon.innerText = pMatch?.awayClub?.icon || pMatch?.awayClub?.flag || "⚽";
  if (awayName) awayName.innerText = pMatch?.awayClub?.name || "Đội Khách";

  if (isNationalMatch) {
    if (homeRank) homeRank.innerText = pMatch?.homeClub?.flag ? `${pMatch.homeClub.flag} ĐTQG ${pMatch.homeClub.name}` : "Đội Tuyển Quốc Gia";
    if (awayRank) awayRank.innerText = pMatch?.awayClub?.flag ? `${pMatch.awayClub.flag} ĐTQG ${pMatch.awayClub.name}` : "Đội Tuyển Quốc Gia";
    if (homeForm) homeForm.innerHTML = `<span style="font-size:0.68rem; color:#10b981; font-weight:700;">★ FIFA Ranking ★</span>`;
    if (awayForm) awayForm.innerHTML = `<span style="font-size:0.68rem; color:#10b981; font-weight:700;">★ FIFA Ranking ★</span>`;
  } else {
    const table = player.leagueTable || [];
    const homeClubId = pMatch?.homeClub?.id;
    const awayClubId = pMatch?.awayClub?.id;
    const homeEntry = homeClubId ? table.find(t => t.clubId === homeClubId) : null;
    const awayEntry = awayClubId ? table.find(t => t.clubId === awayClubId) : null;

    const homeRankIdx = homeEntry ? table.indexOf(homeEntry) + 1 : "-";
    const awayRankIdx = awayEntry ? table.indexOf(awayEntry) + 1 : "-";

    if (homeRank) homeRank.innerText = homeEntry ? `Hạng #${homeRankIdx} • ${homeEntry.points} Điểm` : (pMatch?.isPlayerHome ? "Đội Bạn" : "Khách Mời");
    if (awayRank) awayRank.innerText = awayEntry ? `Hạng #${awayRankIdx} • ${awayEntry.points} Điểm` : (!pMatch?.isPlayerHome ? "Đội Bạn" : "Khách Mời");

    if (homeForm) {
      const rf = homeEntry?.recentForm || [];
      homeForm.innerHTML = rf.length > 0
        ? rf.map(f => `<span class="form-pill ${f.toLowerCase()}">${f}</span>`).join('')
        : '<span style="font-size:0.65rem; color:var(--text-muted);">Mới bắt đầu</span>';
    }
    if (awayForm) {
      const rf = awayEntry?.recentForm || [];
      awayForm.innerHTML = rf.length > 0
        ? rf.map(f => `<span class="form-pill ${f.toLowerCase()}">${f}</span>`).join('')
        : '<span style="font-size:0.65rem; color:var(--text-muted);">Mới bắt đầu</span>';
    }
  }

  // 3. Difficulty & Scouting
  if (typeof getOpponentScoutingData === 'function') {
    const scouting = getOpponentScoutingData(fixture, player) || {};
    const oppPower = scouting.oppPower || 75;

    const diffBadge = document.getElementById('bannerDifficultyBadge');
    let stars = "★★★☆☆";
    if (oppPower >= 90) stars = "★★★★★ (Cực Đại)";
    else if (oppPower >= 83) stars = "★★★★☆ (Khó)";
    else if (oppPower >= 75) stars = "★★★☆☆ (Trung Bình)";
    else stars = "★★☆☆☆ (Dễ)";
    if (diffBadge) diffBadge.innerText = `Độ khó: ${stars}`;

    const scoutAtt = document.getElementById('scoutAtt');
    const scoutMid = document.getElementById('scoutMid');
    const scoutDef = document.getElementById('scoutDef');
    const scoutDesc = document.getElementById('scoutDesc');

    if (scoutAtt) scoutAtt.innerText = scouting.att || '--';
    if (scoutMid) scoutMid.innerText = scouting.mid || '--';
    if (scoutDef) scoutDef.innerText = scouting.def || '--';
    if (scoutDesc) scoutDesc.innerText = scouting.scoutingDesc || '';
  }

  // 4. Pre-match preparation button states
  const currentPrep = player.preMatchPrep || 'NONE';
  document.querySelectorAll('.btn-prep').forEach(btn => {
    const pType = btn.dataset.prep || (
      btn.id === 'btnPrepRest' ? 'REST' :
        btn.id === 'btnPrepVideo' ? 'VIDEO_ANALYSIS' :
          btn.id === 'btnPrepTrain' ? 'LIGHT_TRAIN' :
            btn.id === 'btnPrepIntense' ? 'INTENSE_DRILL' : ''
    );
    btn.classList.toggle('active-prep', pType === currentPrep && currentPrep !== 'NONE');
  });

  document.querySelectorAll('.tactic-pill').forEach(btn => {
    const isActive = btn.dataset.tactic === (player.tactic || 'BALANCED');
    btn.classList.toggle('active', isActive);
  });

  // 5. Render Tables and Sub-panels
  if (typeof renderLiveLeagueTable === 'function') renderLiveLeagueTable(player);
  if (typeof renderTopScorers === 'function') renderTopScorers(player);
  if (typeof renderFixturesList === 'function') renderFixturesList(player);
  if (typeof renderTournamentBrackets === 'function') renderTournamentBrackets(player);

  const isBracketActive = Boolean(
    document.getElementById('btnTabBrackets')?.classList.contains('active') ||
    document.getElementById('sidePanelBrackets')?.style.display === 'block'
  );
  const matchdayGrid = document.querySelector('.matchday-grid-two-col');
  if (matchdayGrid) {
    matchdayGrid.classList.toggle('brackets-fullwidth', isBracketActive);
  }
}

/**
 * Hiển thị Bảng Xếp Hạng Trực Tiếp 20 đội bóng
 */
export function renderLiveLeagueTable(player) {
  player = player || (typeof getPlayer === 'function' ? getPlayer() : window._player || window.player);
  const container = document.getElementById('liveLeagueTableContainer');
  const titleEl = document.getElementById('leagueTableTitle');
  const btnLeague = document.getElementById('btnFilterLeague');
  const btnContinental = document.getElementById('btnFilterContinental');
  if (!container || !player) return;

  const currentFilter = player.activeLeagueTableFilter || 'LEAGUE';

  if (btnLeague) {
    btnLeague.className = `league-filter-btn ${currentFilter === 'LEAGUE' ? 'active' : ''}`;
    btnLeague.onclick = (e) => {
      e.preventDefault();
      player.activeLeagueTableFilter = 'LEAGUE';
      renderLiveLeagueTable(player);
      if (typeof window.autoSave === 'function') window.autoSave(player);
    };
  }
  if (btnContinental) {
    btnContinental.className = `league-filter-btn ${currentFilter === 'CONTINENTAL' ? 'active' : ''}`;
    btnContinental.onclick = (e) => {
      e.preventDefault();
      player.activeLeagueTableFilter = 'CONTINENTAL';
      renderLiveLeagueTable(player);
      if (typeof window.autoSave === 'function') window.autoSave(player);
    };
  }

  // 1. NẾU CHỌN TAB CÚP CHÂU ÂU (UCL/UEL)
  if (currentFilter === 'CONTINENTAL') {
    const euroTourneyName = player.currentEuroStatus === "C1"
      ? "UEFA Champions League (Cúp C1)"
      : (player.currentEuroStatus === "C2" ? "UEFA Europa League (Cúp C2)" : "Cúp Châu Âu");
    if (titleEl) titleEl.innerText = `Bảng Đấu ${euroTourneyName}`;

    const contTable = player.continentalGroupTable || [];
    if (contTable.length === 0) {
      container.innerHTML = `
        <div style="padding: 28px 16px; text-align: center; color: var(--text-muted); line-height: 1.6;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🌍</div>
          <strong style="color: #fff; font-size: 1rem;">Chưa Tham Dự Vòng Bảng Cúp Châu Âu</strong><br>
          <span style="font-size:0.85rem;">CLB hiện tại chưa có vé tham dự đấu trường Champions League / Europa League mùa này.</span><br>
          <div style="margin-top: 10px; color: var(--accent-gold); font-size: 0.82rem; font-weight: 700;">
            💡 Hãy thi đấu xuất sắc lọt vào Top 4 giải VĐQG để giành vé bước ra sân chơi Champions League mùa sau!
          </div>
        </div>
      `;
      return;
    }

    let rowsHtml = '';
    const isYouth = Boolean(player.isAcademyStage);
    const requiredMatches = isYouth ? 3 : 6;
    const isFinished = contTable.length >= 4 && contTable.every(t => (t.played !== undefined ? t.played : (t.matches || 0)) >= requiredMatches);

    contTable.forEach((team, idx) => {
      const rank = idx + 1;
      const isPlayer = team.isPlayer;

      let statusBadge = '';
      let rankBorderClass = '';
      if (!isFinished) {
        statusBadge = '<span style="color:var(--text-muted); font-size:0.75rem;">Đang thi đấu</span>';
      } else {
        if (rank <= 2) {
          statusBadge = isYouth
            ? '<span class="cont-status-badge cont-badge-advance">🟢 Vé Tứ Kết</span>'
            : '<span class="cont-status-badge cont-badge-advance">🟢 Vé Vòng 1/8 C1</span>';
          rankBorderClass = 'rank-ucl';
        } else if (rank === 3) {
          statusBadge = isYouth
            ? '<span class="cont-status-badge cont-badge-out">🔴 Bị Loại</span>'
            : '<span class="cont-status-badge cont-badge-uel">🟠 Xuống C2</span>';
          rankBorderClass = isYouth ? 'rank-relegation' : 'rank-uel';
        } else {
          statusBadge = '<span class="cont-status-badge cont-badge-out">🔴 Bị Loại</span>';
          rankBorderClass = 'rank-relegation';
        }
      }

      rowsHtml += `
        <tr class="${isPlayer ? 'table-row-player' : ''} ${rankBorderClass}">
          <td class="table-rank-cell" style="font-weight:800;">${rank}</td>
          <td>
            <span style="margin-right:6px;">${team.clubIcon || '⚽'}</span>
            <strong>${team.clubName}</strong>
            ${isPlayer ? ' <span style="font-size:0.68rem; color:var(--accent-gold); font-weight:900;">(BẠN)</span>' : ''}
          </td>
          <td style="text-align:center;">${team.played !== undefined ? team.played : (team.matches || 0)}</td>
          <td style="text-align:center; color:#10b981;">${team.won || 0}</td>
          <td style="text-align:center; color:#94a3b8;">${team.drawn || 0}</td>
          <td style="text-align:center; color:#ef4444;">${team.lost || 0}</td>
          <td style="text-align:center;">${team.gf || 0}</td>
          <td style="text-align:center;">${team.ga || 0}</td>
          <td style="text-align:center; font-weight:700; color:${(team.gd || 0) > 0 ? '#10b981' : ((team.gd || 0) < 0 ? '#ef4444' : '#94a3b8')};">${(team.gd || 0) > 0 ? '+' + team.gd : (team.gd || 0)}</td>
          <td style="text-align:center; font-weight:900; color:var(--accent-gold); font-size:0.9rem;">${team.points || 0}</td>
          <td style="text-align:center;">${statusBadge}</td>
        </tr>
      `;
    });

    container.innerHTML = `
      <table class="league-table-view">
        <thead>
          <tr>
            <th style="width:32px; text-align:center;">#</th>
            <th>Câu Lạc Bộ</th>
            <th style="text-align:center;">Trận</th>
            <th style="text-align:center;">T</th>
            <th style="text-align:center;">H</th>
            <th style="text-align:center;">B</th>
            <th style="text-align:center;">BT</th>
            <th style="text-align:center;">BB</th>
            <th style="text-align:center;">HS</th>
            <th style="text-align:center; color:var(--accent-gold);">Điểm</th>
            <th style="text-align:center;">Suất Đi Tiếp</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    `;
    return;
  }

  // 2. NẾU CHỌN TAB GIẢI VĐQG
  const isYouth = Boolean(player.isAcademyStage);
  const activeClub = isYouth ? player.academy : player.currentClub;
  const leagueName = isYouth ? "Giải Trẻ U19 Academy" : (activeClub?.league?.name || "Premier League");
  if (titleEl) titleEl.innerText = `Bảng Xếp Hạng ${leagueName}`;

  const table = player.leagueTable || [];
  if (table.length === 0) {
    container.innerHTML = '<div style="padding:15px; color:var(--text-muted); text-align:center;">Chưa có dữ liệu bảng xếp hạng.</div>';
    return;
  }

  const totalTeams = table.length;
  let rowsHtml = '';

  table.forEach((team, idx) => {
    const rank = idx + 1;
    const isPlayer = team.isPlayerClub || isClubMatch(team, activeClub);

    // Phân vùng Cúp & Xuống hạng (Tách biệt logic giải Trẻ 16 đội và giải Chuyên Nghiệp)
    let rankClass = '';
    let zoneIcon = '';

    if (isYouth) {
      if (rank <= 4) {
        rankClass = 'rank-ucl';
        zoneIcon = '<span style="font-size:0.68rem; color:#10b981; margin-right:3px;" title="Suất Hạt Giống UEFA Youth League">⭐</span>';
      } else {
        rankClass = 'rank-mid';
        zoneIcon = '<span style="font-size:0.68rem; color:#64748b; margin-right:3px;" title="Vị Trí An Toàn">•</span>';
      }
    } else {
      if (rank <= 4) {
        rankClass = 'rank-ucl';
        zoneIcon = '<span style="font-size:0.68rem; color:#10b981; margin-right:3px;" title="UEFA Champions League">★</span>';
      } else if (rank <= 6) {
        rankClass = 'rank-uel';
        zoneIcon = '<span style="font-size:0.68rem; color:#38bdf8; margin-right:3px;" title="UEFA Europa League">◆</span>';
      } else if (rank >= totalTeams - 2) {
        rankClass = 'rank-relegation';
        zoneIcon = '<span style="font-size:0.68rem; color:#ef4444; margin-right:3px;" title="Xuống Hạng">▼</span>';
      } else {
        rankClass = 'rank-mid';
        zoneIcon = '<span style="font-size:0.68rem; color:#64748b; margin-right:3px;">•</span>';
      }
    }

    const formHtml = (team.recentForm || []).slice(-5).map(f =>
      `<span class="form-pill ${f.toLowerCase()}">${f}</span>`
    ).join('');

    rowsHtml += `
      <tr class="${isPlayer ? 'table-row-player' : ''} ${rankClass}">
        <td class="table-rank-cell">${zoneIcon}${rank}</td>
        <td>
          <span style="margin-right:6px;">${team.clubIcon || '⚽'}</span>
          <strong>${team.clubName}</strong>
          ${isPlayer ? ' <span style="font-size:0.68rem; color:var(--accent-gold); font-weight:900;">(BẠN)</span>' : ''}
        </td>
        <td style="text-align:center;">${team.played}</td>
        <td style="text-align:center; color:#10b981;">${team.won}</td>
        <td style="text-align:center; color:#94a3b8;">${team.drawn}</td>
        <td style="text-align:center; color:#ef4444;">${team.lost}</td>
        <td style="text-align:center;">${team.gf}</td>
        <td style="text-align:center;">${team.ga}</td>
        <td style="text-align:center; font-weight:700; color:${team.gd > 0 ? '#10b981' : (team.gd < 0 ? '#ef4444' : '#94a3b8')};">${team.gd > 0 ? '+' + team.gd : team.gd}</td>
        <td style="text-align:center; font-weight:900; color:var(--accent-gold); font-size:0.85rem;">${team.points}</td>
        <td style="text-align:center;">
          <div class="clash-form-pills" style="justify-content:center;">${formHtml || '<span style="color:#64748b; font-size:0.65rem;">-</span>'}</div>
        </td>
      </tr>
    `;
  });

  const legendHtml = isYouth ? `
    <div class="league-table-legend" style="margin-top: 8px; font-size: 0.72rem; color: #94a3b8; display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: flex-end; padding: 4px 8px;">
      <span style="display:inline-flex; align-items:center; gap:4px;"><span style="color:#10b981; font-weight:bold;">⭐ Top 1 - 4:</span> Suất Hạt Giống UEFA Youth League</span>
      <span style="display:inline-flex; align-items:center; gap:4px;"><span style="color:#64748b; font-weight:bold;">• 5 - 16:</span> Vị Trí An Toàn</span>
    </div>
  ` : `
    <div class="league-table-legend" style="margin-top: 8px; font-size: 0.72rem; color: #94a3b8; display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: flex-end; padding: 4px 8px;">
      <span style="display:inline-flex; align-items:center; gap:4px;"><span style="color:#10b981; font-weight:bold;">★ 1 - 4:</span> UEFA Champions League</span>
      <span style="display:inline-flex; align-items:center; gap:4px;"><span style="color:#38bdf8; font-weight:bold;">◆ 5 - 6:</span> UEFA Europa League</span>
      <span style="display:inline-flex; align-items:center; gap:4px;"><span style="color:#ef4444; font-weight:bold;">▼ Xuống hạng</span></span>
    </div>
  `;

  container.innerHTML = `
    <table class="league-table-view">
      <thead>
        <tr>
          <th style="width:34px; text-align:center;">#</th>
          <th>Câu Lạc Bộ</th>
          <th style="text-align:center;">Trận</th>
          <th style="text-align:center;">T</th>
          <th style="text-align:center;">H</th>
          <th style="text-align:center;">B</th>
          <th style="text-align:center;">BT</th>
          <th style="text-align:center;">BB</th>
          <th style="text-align:center;">HS</th>
          <th style="text-align:center; color:var(--accent-gold);">Điểm</th>
          <th style="text-align:center;">5 Trận Gần Nhất</th>
        </tr>
      </thead>
      <tbody>
        ${rowsHtml}
      </tbody>
    </table>
    ${legendHtml}
  `;
}

/**
 * Hiển thị Cuộc đua Vua Phá Lưới & Vua Kiến Tạo (Top Scorers & Top Playmakers)
 */
export function renderTopScorers(player) {
  player = player || (typeof getPlayer === 'function' ? getPlayer() : window._player || window.player);
  const container = document.getElementById('topScorersContainer');
  if (!container || !player) return;

  const isYouth = Boolean(player.isAcademyStage || (player.age <= 16 && !player.currentClub));
  const activeClub = getPlayerActiveClub(player);
  const leagueName = isYouth ? "Giải Trẻ U19 Academy" : (activeClub?.league?.name || "Premier League");
  const domesticCupName = isYouth ? "Cúp Trẻ Quốc Gia U19" : (activeClub?.league?.domesticCup || "Cúp Quốc Gia");
  const continentalCupName = isYouth ? "UEFA Youth League (C1 Trẻ)" : "UEFA Champions League";

  const isStartOfSeason = (player.currentFixtureIndex === 0 || !player.currentSeasonStats || player.currentSeasonStats.matches === 0);

  // 1. Trạng thái lựa chọn giải đấu & loại thống kê (State)
  let activeScorerTab = window._activeScorerTab || 'goals';
  let activeScorerComp = window._activeScorerComp || 'league';
  if (!['league', 'domestic', 'continental'].includes(activeScorerComp)) {
    activeScorerComp = 'league';
    window._activeScorerComp = 'league';
  }

  // Đảm bảo cấu trúc cupTrackers sẵn sàng
  if (!player.cupTrackers) {
    player.cupTrackers = {
      domestic: { scorers: [], assists: [] },
      continental: { scorers: [], assists: [] }
    };
  }

  const isGoals = activeScorerTab === 'goals';
  let currentCompTitle = "";
  let compIcon = "🏆";
  let displayList = [];

  if (activeScorerComp === 'league') {
    currentCompTitle = leagueName;
    compIcon = "🏆";

    // 2. Dữ liệu Vua Phá Lưới giải VĐQG
    if (isYouth && Array.isArray(player.leagueTopScorers)) {
      const hasSeniorScorer = player.leagueTopScorers.some(s =>
        !s.isPlayer && (s.name === "Erling Haaland" || s.name === "Bukayo Saka" || s.name === "Cole Palmer" || s.name === "Mohamed Salah" || s.name === "Alexander Isak")
      );
      if (hasSeniorScorer || player.leagueTopScorers.length <= 1) {
        player.leagueTopScorers = initLeagueTopScorers("YOUTH_LEAGUE", player);
      }
    }

    let scorers = player.leagueTopScorers || [];
    if (scorers.length === 0) {
      player.leagueTopScorers = initLeagueTopScorers(isYouth ? "YOUTH_LEAGUE" : (activeClub?.league?.id || "PREMIER_LEAGUE"), player);
      scorers = player.leagueTopScorers;
    }

    // Đầu mùa tất cả bắt đầu từ 0 bàn
    if (isStartOfSeason) {
      scorers.forEach(s => { s.goals = 0; });
    }

    // Đồng bộ số bàn thắng của người chơi với currentSeasonStats
    const playerItem = scorers.find(s => s.isPlayer);
    if (playerItem) {
      const curGoals = isStartOfSeason ? 0 : (player.currentSeasonStats?.goals !== undefined ? player.currentSeasonStats.goals : (player.goals || 0));
      playerItem.goals = curGoals;
      playerItem.name = `${player.name} (BẠN)`;
      if (activeClub) {
        playerItem.clubName = activeClub.name || playerItem.clubName;
        playerItem.clubIcon = activeClub.icon || playerItem.clubIcon;
        playerItem.clubId = activeClub.id || playerItem.clubId;
      }
    }

    // Sắp xếp lại bảng Vua phá lưới
    scorers.sort((a, b) => {
      if (b.goals !== a.goals) return b.goals - a.goals;
      if (a.isPlayer) return -1;
      if (b.isPlayer) return 1;
      const aName = a.name || "";
      const bName = b.name || "";
      return aName.localeCompare(bName);
    });

    scorers.forEach((s, idx) => { s.rank = idx + 1; });

    // Dữ liệu Vua Kiến Tạo giải VĐQG
    const u19Rivals = [
      { id: 'alvaro_rodriguez', name: 'Álvaro Rodríguez', clubName: 'Real Madrid Castilla', clubIcon: '⚪' },
      { id: 'marc_guiu', name: 'Marc Guiu', clubName: 'FC Barcelona La Masia', clubIcon: '🔵🔴' },
      { id: 'ethan_wheatley', name: 'Ethan Wheatley', clubName: 'Man United Carrington', clubIcon: '🔴' },
      { id: 'jonah_kusi', name: 'Jonah Kusi-Asare', clubName: 'FC Bayern Campus', clubIcon: '🔴' },
      { id: 'tyrique_george', name: 'Tyrique George', clubName: 'Chelsea Cobham Academy', clubIcon: '🔵' },
      { id: 'don_konadu', name: 'Don-Angelo Konadu', clubName: 'Ajax De Toekomst', clubIcon: '⚪🔴' },
      { id: 'gustavo_varela', name: 'Gustavo Varela', clubName: 'Benfica Seixal Campus', clubIcon: '🦅' },
      { id: 'gabriel_silva', name: 'Gabriel Silva', clubName: 'Sporting Academy', clubIcon: '🦁' }
    ];

    if (!player.leagueTopAssists || !Array.isArray(player.leagueTopAssists) || player.leagueTopAssists.length === 0) {
      player.leagueTopAssists = u19Rivals.map(r => ({
        id: r.id,
        name: r.name,
        clubName: r.clubName,
        clubIcon: r.clubIcon || "⚽",
        assists: 0,
        isPlayer: false
      }));
    } else if (isStartOfSeason) {
      player.leagueTopAssists.forEach(r => {
        r.assists = 0;
      });
    }

    const playerAssists = isStartOfSeason ? 0 : (player.currentSeasonStats?.assists !== undefined ? player.currentSeasonStats.assists : (player.assists || 0));
    const pName = `${player.name || 'Hoàng Sơn'} (BẠN)`;
    const pClubName = activeClub?.name || player.academy?.name || player.club?.name || "FC Bayern Campus";
    const pClubIcon = activeClub?.icon || "⭐";

    let playerAssistRow = player.leagueTopAssists.find(s => s.isPlayer);
    if (!playerAssistRow) {
      playerAssistRow = {
        id: 'player',
        name: pName,
        clubName: pClubName,
        clubIcon: pClubIcon,
        assists: playerAssists,
        isPlayer: true
      };
      player.leagueTopAssists.push(playerAssistRow);
    } else {
      playerAssistRow.name = pName;
      playerAssistRow.clubName = pClubName;
      playerAssistRow.clubIcon = pClubIcon;
      playerAssistRow.assists = playerAssists;
    }

    player.leagueTopAssists.sort((a, b) => {
      if (b.assists !== a.assists) return b.assists - a.assists;
      if (a.isPlayer) return -1;
      if (b.isPlayer) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });

    player.leagueTopAssists.forEach((s, idx) => { s.rank = idx + 1; });

    displayList = isGoals ? scorers.slice(0, 8) : player.leagueTopAssists.slice(0, 8);

  } else if (activeScorerComp === 'domestic') {
    currentCompTitle = domesticCupName;
    compIcon = "🛡️";

    // Khởi tạo nếu danh sách rỗng
    if (!player.cupTrackers?.domestic?.scorers || player.cupTrackers.domestic.scorers.length === 0) {
      if (typeof initCupIndividualTrackers === 'function') {
        initCupIndividualTrackers(player, 'domestic');
      }
    }

    const domTrackers = player.cupTrackers?.domestic || { scorers: [], assists: [] };
    const rawList = isGoals ? (domTrackers.scorers || []) : (domTrackers.assists || []);
    rawList.sort((a, b) => {
      const cntA = a.count !== undefined ? a.count : (isGoals ? (a.goals || 0) : (a.assists || 0));
      const cntB = b.count !== undefined ? b.count : (isGoals ? (b.goals || 0) : (b.assists || 0));
      if (cntB !== cntA) return cntB - cntA;
      if (a.isPlayer) return -1;
      if (b.isPlayer) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
    rawList.forEach((s, idx) => { s.rank = idx + 1; });
    displayList = rawList.slice(0, 8);

  } else if (activeScorerComp === 'continental') {
    currentCompTitle = continentalCupName;
    compIcon = "🌍";

    // Khởi tạo nếu danh sách rỗng
    if (!player.cupTrackers?.continental?.scorers || player.cupTrackers.continental.scorers.length === 0) {
      if (typeof initCupIndividualTrackers === 'function') {
        initCupIndividualTrackers(player, 'continental');
      }
    }

    const contTrackers = player.cupTrackers?.continental || { scorers: [], assists: [] };
    const rawList = isGoals ? (contTrackers.scorers || []) : (contTrackers.assists || []);
    rawList.sort((a, b) => {
      const cntA = a.count !== undefined ? a.count : (isGoals ? (a.goals || 0) : (a.assists || 0));
      const cntB = b.count !== undefined ? b.count : (isGoals ? (b.goals || 0) : (b.assists || 0));
      if (cntB !== cntA) return cntB - cntA;
      if (a.isPlayer) return -1;
      if (b.isPlayer) return 1;
      return (a.name || "").localeCompare(b.name || "");
    });
    rawList.forEach((s, idx) => { s.rank = idx + 1; });
    displayList = rawList.slice(0, 8);
  }

  // 4. Render HTML hoàn chỉnh
  let html = `
    <!-- HÀNG TRÊN (Hàng 1 - Bộ chọn Giải đấu): [ 🏆 Giải VĐQG / Trẻ ]  [ 🛡️ Cúp QG ]  [ 🌍 C1 Trẻ / Cúp C1 ] -->
    <div style="display: flex; gap: 5px; margin-bottom: 6px;">
      <button id="btnCompLeague" class="${activeScorerComp === 'league' ? 'active' : ''}" style="flex: 1; padding: 6px 4px; border-radius: 6px; font-size: 0.72rem; font-weight: ${activeScorerComp === 'league' ? '800' : '600'}; cursor: pointer; border: 1px solid ${activeScorerComp === 'league' ? 'var(--accent-blue, #38bdf8)' : 'rgba(255,255,255,0.08)'}; background: ${activeScorerComp === 'league' ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.03)'}; color: ${activeScorerComp === 'league' ? 'var(--accent-blue, #38bdf8)' : 'var(--text-muted, #94a3b8)'}; transition: all 0.2s ease; text-align: center;">
        🏆 ${isYouth ? 'Giải Trẻ' : 'Giải VĐQG'}
      </button>
      <button id="btnCompDomestic" class="${activeScorerComp === 'domestic' ? 'active' : ''}" style="flex: 1; padding: 6px 4px; border-radius: 6px; font-size: 0.72rem; font-weight: ${activeScorerComp === 'domestic' ? '800' : '600'}; cursor: pointer; border: 1px solid ${activeScorerComp === 'domestic' ? 'var(--accent-gold, #f59e0b)' : 'rgba(255,255,255,0.08)'}; background: ${activeScorerComp === 'domestic' ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.03)'}; color: ${activeScorerComp === 'domestic' ? 'var(--accent-gold, #f59e0b)' : 'var(--text-muted, #94a3b8)'}; transition: all 0.2s ease; text-align: center;">
        🛡️ Cúp QG
      </button>
      <button id="btnCompContinental" class="${activeScorerComp === 'continental' ? 'active' : ''}" style="flex: 1; padding: 6px 4px; border-radius: 6px; font-size: 0.72rem; font-weight: ${activeScorerComp === 'continental' ? '800' : '600'}; cursor: pointer; border: 1px solid ${activeScorerComp === 'continental' ? 'var(--accent-purple, #a855f7)' : 'rgba(255,255,255,0.08)'}; background: ${activeScorerComp === 'continental' ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.03)'}; color: ${activeScorerComp === 'continental' ? 'var(--accent-purple, #a855f7)' : 'var(--text-muted, #94a3b8)'}; transition: all 0.2s ease; text-align: center;">
        🌍 ${isYouth ? 'C1 Trẻ' : 'Cúp C1'}
      </button>
    </div>

    <!-- HÀNG DƯỚI (Hàng 2 - Bộ chọn Chỉ số): [ ⚽ Vua Phá Lưới ]  [ 🎯 Vua Kiến Tạo ] -->
    <div style="display: flex; gap: 6px; margin-bottom: 8px;">
      <button id="btnTabGoals" class="${isGoals ? 'active' : ''}" style="flex: 1; padding: 6px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; cursor: pointer; border: 1px solid ${isGoals ? 'var(--accent-gold, #f59e0b)' : 'rgba(255,255,255,0.1)'}; background: ${isGoals ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.03)'}; color: ${isGoals ? 'var(--accent-gold, #f59e0b)' : 'var(--text-muted, #94a3b8)'}; transition: all 0.2s ease;">
        ⚽ Vua Phá Lưới
      </button>
      <button id="btnTabAssists" class="${!isGoals ? 'active' : ''}" style="flex: 1; padding: 6px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; cursor: pointer; border: 1px solid ${!isGoals ? 'var(--accent-purple, #a855f7)' : 'rgba(255,255,255,0.1)'}; background: ${!isGoals ? 'rgba(168,85,247,0.2)' : 'rgba(255,255,255,0.03)'}; color: ${!isGoals ? 'var(--accent-purple, #a855f7)' : 'var(--text-muted, #94a3b8)'}; transition: all 0.2s ease;">
        🎯 Vua Kiến Tạo
      </button>
    </div>

    <!-- Hàng 3: Banner tiêu đề giải đấu hiện tại -->
    <div style="padding: 6px 12px; margin-bottom: 8px; font-size: 0.74rem; font-weight: 700; color: ${isGoals ? 'var(--accent-gold, #f59e0b)' : 'var(--accent-purple, #a855f7)'}; background: ${isGoals ? 'rgba(245, 158, 11, 0.1)' : 'rgba(168, 85, 247, 0.1)'}; border-radius: 6px; border: 1px solid ${isGoals ? 'rgba(245, 158, 11, 0.2)' : 'rgba(168, 85, 247, 0.2)'}; display: flex; justify-content: space-between; align-items: center;">
      <span>${compIcon} ${currentCompTitle}</span>
      <span style="color: var(--text-muted, #94a3b8); font-size: 0.7rem;">${isGoals ? 'Top 8 Chân Sút' : 'Top 8 Chân Chuyền'}</span>
    </div>
  `;

  if (displayList.length === 0) {
    html += `
      <div style="text-align: center; padding: 28px 12px; color: var(--text-muted, #94a3b8); font-size: 0.8rem;">
        <div style="font-size: 1.5rem; margin-bottom: 6px;">📋</div>
        Chưa có dữ liệu thống kê cho ${currentCompTitle}.
      </div>
    `;
  } else {
    displayList.forEach((s, idx) => {
      const isPlayer = Boolean(s.isPlayer);
      const name = s.name || (isPlayer ? `${player.name} (BẠN)` : "Cầu thủ");
      const clubIcon = s.clubIcon || "⚽";
      const clubName = s.clubName || s.club || s.clubCode || "";
      const count = s.count !== undefined
        ? s.count
        : (isGoals ? (s.goals || 0) : (s.assists || 0));

      html += `
        <div class="top-scorer-item ${isPlayer ? 'is-player' : ''}">
          <div class="scorer-left">
            <div class="scorer-rank" style="color:${idx === 0 ? 'var(--accent-gold)' : (idx === 1 ? '#cbd5e1' : (idx === 2 ? '#b45309' : 'var(--text-muted)'))};">
              ${idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : idx + 1))}
            </div>
            <div>
              <div style="font-weight:800; color:${isPlayer ? (isGoals ? 'var(--accent-gold)' : 'var(--accent-purple)') : '#fff'};">
                ${name} ${isPlayer ? '⭐' : ''}
              </div>
              <div style="font-size:0.7rem; color:var(--text-muted);">
                ${clubIcon} ${clubName}
              </div>
            </div>
          </div>
          <div class="scorer-goals" style="color:${isGoals ? 'var(--accent-green, #10b981)' : 'var(--accent-purple, #a855f7)'};">
            ${isGoals
          ? `⚽ ${count} <small style="font-size:0.65rem; color:var(--text-muted); font-weight:normal;">bàn</small>`
          : `🎯 ${count} <small style="font-size:0.65rem; color:var(--text-muted); font-weight:normal;">kiến tạo</small>`}
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = html;

  // Gán sự kiện click: cập nhật trạng thái và gọi lại renderTopScorers(player)
  const btnG = document.getElementById('btnTabGoals');
  const btnA = document.getElementById('btnTabAssists');
  const btnCompL = document.getElementById('btnCompLeague');
  const btnCompD = document.getElementById('btnCompDomestic');
  const btnCompC = document.getElementById('btnCompContinental');

  if (btnG) {
    btnG.onclick = (e) => {
      e.preventDefault();
      window._activeScorerTab = 'goals';
      renderTopScorers(player);
    };
  }
  if (btnA) {
    btnA.onclick = (e) => {
      e.preventDefault();
      window._activeScorerTab = 'assists';
      renderTopScorers(player);
    };
  }
  if (btnCompL) {
    btnCompL.onclick = (e) => {
      e.preventDefault();
      window._activeScorerComp = 'league';
      renderTopScorers(player);
    };
  }
  if (btnCompD) {
    btnCompD.onclick = (e) => {
      e.preventDefault();
      window._activeScorerComp = 'domestic';
      renderTopScorers(player);
    };
  }
  if (btnCompC) {
    btnCompC.onclick = (e) => {
      e.preventDefault();
      window._activeScorerComp = 'continental';
      renderTopScorers(player);
    };
  }
}

/**
 * Hiển thị Danh Sách Lịch Thi Đấu & Kết Quả Toàn Mùa
 * Hỗ trợ Bộ lọc: [Tất Cả] | [CLB] | [Đội Tuyển QG]
 */
export function renderFixturesList(player) {
  const container = document.getElementById('fixturesListContainer');
  if (!container) return;

  const fixtures = player.currentSeasonFixtures || [];
  const curIdx = player.currentFixtureIndex || 0;
  const isYouth = Boolean(player.isAcademyStage || (player.age <= 16 && !player.currentClub));
  const activeClub = getPlayerActiveClub(player);

  if (!player.fixturesSubFilter || player.fixturesSubFilter === 'MY_CLUB') {
    player.fixturesSubFilter = 'ALL';
  }

  const subFilter = player.fixturesSubFilter; // 'ALL' | 'CLUB' | 'NATIONAL_TEAM'

  // Header 3 nút bộ lọc con
  let filterBarHtml = `
    <div class="fixtures-subfilter-tabs" style="display: flex; gap: 6px; margin-bottom: 12px; background: rgba(0,0,0,0.3); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
      <button type="button" id="btnFixturesFilterAll" class="fixtures-filter-btn ${subFilter === 'ALL' ? 'active' : ''}" style="flex: 1; padding: 6px 8px; font-size: 0.74rem; font-weight: 800; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s ease; background: ${subFilter === 'ALL' ? 'var(--accent-gold)' : 'transparent'}; color: ${subFilter === 'ALL' ? '#000' : 'var(--text-muted)'};">
        📅 Tất Cả
      </button>
      <button type="button" id="btnFixturesFilterClub" class="fixtures-filter-btn ${subFilter === 'CLUB' ? 'active' : ''}" style="flex: 1; padding: 6px 8px; font-size: 0.74rem; font-weight: 800; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s ease; background: ${subFilter === 'CLUB' ? '#3b82f6' : 'transparent'}; color: ${subFilter === 'CLUB' ? '#fff' : 'var(--text-muted)'};">
        🏟️ CLB
      </button>
      <button type="button" id="btnFixturesFilterNational" class="fixtures-filter-btn ${subFilter === 'NATIONAL_TEAM' ? 'active' : ''}" style="flex: 1; padding: 6px 8px; font-size: 0.74rem; font-weight: 800; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s ease; background: ${subFilter === 'NATIONAL_TEAM' ? '#10b981' : 'transparent'}; color: ${subFilter === 'NATIONAL_TEAM' ? '#fff' : 'var(--text-muted)'};">
        🚩 Đội Tuyển QG
      </button>
    </div>
  `;

  if (fixtures.length === 0) {
    container.innerHTML = filterBarHtml + '<div style="padding:15px; color:var(--text-muted); text-align:center;">Chưa tạo lịch thi đấu mùa giải.</div>';
    bindFixturesFilterButtons(player);
    return;
  }

  let contentHtml = '';

  // 1. BỘ LỌC ĐỘI TUYỂN QUỐC GIA (NATIONAL TEAM)
  if (subFilter === 'NATIONAL_TEAM') {
    const natMatches = fixtures.filter(f =>
      f.type === 'NATIONAL_TEAM' ||
      f.competitionType === 'NATIONAL_TEAM' ||
      f.isNationalTeam ||
      f.playerMatch?.type === 'NATIONAL_TEAM' ||
      f.playerMatch?.isNationalTeam
    );

    if (natMatches.length === 0) {
      contentHtml = `
        <div style="padding: 32px 16px; color: var(--text-muted); text-align: center; font-weight: 600; line-height: 1.6; background: rgba(16, 185, 129, 0.05); border-radius: 12px; border: 1px dashed rgba(16, 185, 129, 0.3); margin: 8px 0;">
          <div style="font-size: 2.2rem; margin-bottom: 8px;">🚩</div>
          <div style="color: #10b981; font-size: 0.95rem; font-weight: 800; margin-bottom: 4px;">CHƯA CÓ LỊCH ĐẤU ĐỘI TUYỂN QUỐC GIA</div>
          <div style="font-size: 0.76rem; color: #94a3b8; max-width: 380px; margin: 0 auto;">
            Cầu thủ ở độ tuổi 16 chỉ thi đấu cấp CLB Trẻ (U19).<br>
            Cơ hội triệu tập lên ĐTQG sẽ chính thức mở ra ở <strong style="color:#f59e0b;">tuổi 17</strong> khi đạt <strong style="color:#10b981;">OVR ≥ 65</strong> hoặc phong độ mùa trước xuất sắc!
          </div>
        </div>
      `;
    } else {
      contentHtml = '<div style="display:flex; flex-direction:column; gap:8px;">';
      natMatches.forEach(f => {
        const pMatch = f.playerMatch || {};
        const isCompleted = Boolean(f.isCompleted || pMatch.isPlayed);
        const res = pMatch.result || {};
        const isCurrent = (fixtures.indexOf(f) === curIdx);

        const homeFlag = pMatch.homeClub?.flag || '🚩';
        const awayFlag = pMatch.awayClub?.flag || '🚩';
        const homeName = pMatch.homeClub?.name || 'Đội Tuyển Nhà';
        const awayName = pMatch.awayClub?.name || 'Đội Tuyển Khách';

        let statusBadgeHtml = '';
        if (isCompleted) {
          const scoreText = res.scoreStr || `${res.homeScore ?? f.homeScore ?? 0} - ${res.awayScore ?? f.awayScore ?? 0}`;
          statusBadgeHtml = `
            <span style="font-weight: 900; color: #10b981; background: rgba(0,0,0,0.5); padding: 3px 10px; border-radius: 6px; font-size: 0.88rem; border: 1px solid rgba(16,185,129,0.4); letter-spacing: 0.5px;">
              ${scoreText}
            </span>
          `;
        } else if (isCurrent) {
          statusBadgeHtml = `
            <span style="font-weight: 900; color: #000; background: #10b981; padding: 3px 9px; border-radius: 6px; font-size: 0.72rem; box-shadow: 0 0 10px rgba(16,185,129,0.5);">
              SẮP ĐÁ
            </span>
          `;
        } else {
          statusBadgeHtml = `
            <span style="color: #94a3b8; font-size: 0.7rem; background: rgba(255,255,255,0.06); padding: 2px 7px; border-radius: 4px;">
              Chưa diễn ra
            </span>
          `;
        }

        const playerGoals = res.playerGoals || 0;
        const playerAssists = res.playerAssists || 0;
        const rating = res.rating !== undefined ? Number(res.rating).toFixed(1) : null;

        contentHtml += `
          <div class="national-fixture-card ${isCurrent ? 'is-current current-upcoming-match' : ''}" style="border: 1px solid rgba(16, 185, 129, 0.4); background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(6, 78, 59, 0.45)); border-radius: 10px; padding: 10px 14px; box-shadow: 0 4px 12px rgba(6,78,59,0.25);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
              <span style="background: linear-gradient(135deg, #059669, #10b981); color:#fff; font-size:0.65rem; font-weight:900; padding:2px 8px; border-radius:4px; text-transform:uppercase; letter-spacing:0.5px;">
                🚩 ĐTQG • ${f.competitionName}
              </span>
              <span style="font-size:0.7rem; color:#a7f3d0; font-weight:700;">
                ${f.stageName}
              </span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
              <span style="color:#fff; font-weight:800; font-size:0.88rem; display:flex; align-items:center; gap:5px;">
                <span>${homeFlag}</span> <span>${homeName}</span>
              </span>
              <div>
                ${statusBadgeHtml}
              </div>
              <span style="color:#fff; font-weight:800; font-size:0.88rem; display:flex; align-items:center; gap:5px;">
                <span>${awayFlag}</span> <span>${awayName}</span>
              </span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.72rem; color:#cbd5e1; border-top:1px dashed rgba(255,255,255,0.1); padding-top:5px; margin-top:2px;">
              <span style="color:#6ee7b7;">🏟️ ${pMatch.stadium || 'Sân Vận Động Quốc Gia'}</span>
              ${isCompleted && (playerGoals > 0 || playerAssists > 0 || rating) ? `
                <span style="color:#fde047; font-weight:700;">
                  ${playerGoals > 0 ? `⚽ ${playerGoals} Bàn ` : ''}
                  ${playerAssists > 0 ? `👟 ${playerAssists} Kiến tạo ` : ''}
                  ${rating ? `⭐ ${rating}` : ''}
                </span>
              ` : ''}
            </div>
          </div>
        `;
      });
      contentHtml += '</div>';
    }

    // 2. BỘ LỌC CLB (CLUB FIXTURES)
  } else if (subFilter === 'CLUB') {
    const clubMatches = fixtures.filter(f =>
      f.type === 'CLUB' ||
      (!f.isNationalTeam && f.type !== 'NATIONAL_TEAM' && f.competitionType !== 'NATIONAL_TEAM' && f.playerMatch?.type !== 'NATIONAL_TEAM')
    );

    if (clubMatches.length === 0) {
      contentHtml = '<div style="padding:20px; color:var(--text-muted); text-align:center;">Chưa có lịch đấu CLB nào.</div>';
    } else {
      contentHtml = '<div style="display:flex; flex-direction:column; gap:6px;">';
      clubMatches.forEach(f => {
        const isCurrent = (fixtures.indexOf(f) === curIdx);
        const pMatch = f.playerMatch || {};
        const isPlayed = Boolean(f.isCompleted || pMatch.isPlayed);

        let resultBadge = '';
        if (isPlayed && pMatch.result) {
          resultBadge = `<span style="font-weight:900; color:#fff; background:rgba(0,0,0,0.4); padding:2px 8px; border-radius:6px; font-size:0.8rem;">${pMatch.result.scoreStr || (pMatch.result.homeScore + ' - ' + pMatch.result.awayScore)}</span>`;
        } else if (isCurrent) {
          resultBadge = `<span style="font-weight:800; color:#000; background:var(--accent-gold); padding:2px 8px; border-radius:6px; font-size:0.7rem;">SẮP ĐÁ</span>`;
        } else {
          resultBadge = `<span style="color:var(--text-muted); font-size:0.7rem;">Chưa đá</span>`;
        }

        const compColor = f.competitionType === 'UCL'
          ? 'var(--accent-blue)'
          : (f.competitionType === 'DOMESTIC_CUP' ? 'var(--accent-purple)' : 'var(--accent-gold)');

        contentHtml += `
          <div class="fixture-card-row ${isCurrent ? 'is-current current-upcoming-match' : ''}">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span style="font-size:0.68rem; color:${compColor}; font-weight:800;">
                ${f.stageName} • ${f.competitionName}
              </span>
              <span style="color:#fff; font-weight:700;">
                ${pMatch.homeClub?.name || 'Đội Nhà'} vs ${pMatch.awayClub?.name || 'Đội Khách'}
              </span>
            </div>
            <div>
              ${resultBadge}
            </div>
          </div>
        `;
      });
      contentHtml += '</div>';
    }

    // 3. BỘ LỌC TẤT CẢ (ALL FIXTURES)
  } else {
    contentHtml = '<div style="display:flex; flex-direction:column; gap:6px;">';
    fixtures.forEach((f, idx) => {
      const isCurrent = (idx === curIdx);
      const pMatch = f.playerMatch || {};
      const isPlayed = Boolean(f.isCompleted || pMatch.isPlayed);
      const isNat = Boolean(f.type === 'NATIONAL_TEAM' || f.isNationalTeam || f.competitionType === 'NATIONAL_TEAM');

      let resultBadge = '';
      if (isPlayed && pMatch.result) {
        resultBadge = `<span style="font-weight:900; color:#fff; background:rgba(0,0,0,0.4); padding:2px 8px; border-radius:6px; font-size:0.8rem;">${pMatch.result.scoreStr || (pMatch.result.homeScore + ' - ' + pMatch.result.awayScore)}</span>`;
      } else if (isCurrent) {
        resultBadge = `<span style="font-weight:800; color:#000; background:${isNat ? '#10b981' : 'var(--accent-gold)'}; padding:2px 8px; border-radius:6px; font-size:0.7rem;">SẮP ĐÁ</span>`;
      } else {
        resultBadge = `<span style="color:var(--text-muted); font-size:0.7rem;">Chưa đá</span>`;
      }

      const compColor = isNat
        ? '#10b981'
        : (f.competitionType === 'UCL' ? 'var(--accent-blue)' : (f.competitionType === 'DOMESTIC_CUP' ? 'var(--accent-purple)' : 'var(--accent-gold)'));

      contentHtml += `
        <div class="fixture-card-row ${isCurrent ? 'is-current current-upcoming-match' : ''}" style="${isNat ? 'border-left: 3px solid #10b981; background: rgba(16, 185, 129, 0.08);' : ''}">
          <div style="display:flex; flex-direction:column; gap:2px;">
            <span style="font-size:0.68rem; color:${compColor}; font-weight:800;">
              ${isNat ? '🚩 ĐTQG • ' : ''}${f.stageName} • ${f.competitionName}
            </span>
            <span style="color:#fff; font-weight:700;">
              ${isNat ? `${pMatch.homeClub?.flag || '🚩'} ` : ''}${pMatch.homeClub?.name || 'Đội Nhà'} vs ${isNat ? `${pMatch.awayClub?.flag || '🚩'} ` : ''}${pMatch.awayClub?.name || 'Đội Khách'}
            </span>
          </div>
          <div>
            ${resultBadge}
          </div>
        </div>
      `;
    });
    contentHtml += '</div>';
  }

  container.innerHTML = filterBarHtml + contentHtml;
  bindFixturesFilterButtons(player);

  // Tự động cuộn đến trận SẮP ĐÁ và căn giữa khung nhìn
  setTimeout(() => {
    const upcomingEl = container.querySelector('.current-upcoming-match') || container.querySelector('.is-current');
    if (upcomingEl) {
      upcomingEl.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, 100);
}

function bindFixturesFilterButtons(player) {
  const btnAll = document.getElementById('btnFixturesFilterAll');
  const btnClub = document.getElementById('btnFixturesFilterClub');
  const btnNational = document.getElementById('btnFixturesFilterNational');

  if (btnAll) {
    btnAll.onclick = (e) => {
      e.preventDefault();
      player.fixturesSubFilter = 'ALL';
      renderFixturesList(player);
    };
  }
  if (btnClub) {
    btnClub.onclick = (e) => {
      e.preventDefault();
      player.fixturesSubFilter = 'CLUB';
      renderFixturesList(player);
    };
  }
  if (btnNational) {
    btnNational.onclick = (e) => {
      e.preventDefault();
      player.fixturesSubFilter = 'NATIONAL_TEAM';
      renderFixturesList(player);
    };
  }
}

/* =========================================================================
   CUP TOURNAMENT UI (TÁCH SANG js/uiCup.js)
   ========================================================================= */

/**
 * Chuyển đổi tab phụ ở cột bên phải Matchday (Vua Phá Lưới vs Lịch Thi Đấu vs Sơ Đồ Cúp)
 */
export function switchMatchdaySideTab(tabName, player) {
  const panelScorers = document.getElementById('sidePanelScorers');
  const panelFixtures = document.getElementById('sidePanelFixtures');
  const panelBrackets = document.getElementById('sidePanelBrackets');
  const btnScorers = document.getElementById('btnTabTopScorers');
  const btnFixtures = document.getElementById('btnTabFixturesList');
  const btnBrackets = document.getElementById('btnTabBrackets');
  const matchdayGrid = document.querySelector('.matchday-grid-two-col');

  const p = player || (typeof getPlayer === 'function' ? getPlayer() : window._player || window.player);

  if (panelScorers) panelScorers.style.display = 'none';
  if (panelFixtures) panelFixtures.style.display = 'none';
  if (panelBrackets) panelBrackets.style.display = 'none';
  if (btnScorers) btnScorers.classList.remove('active');
  if (btnFixtures) btnFixtures.classList.remove('active');
  if (btnBrackets) btnBrackets.classList.remove('active');

  if (tabName === 'brackets') {
    if (matchdayGrid) matchdayGrid.classList.add('brackets-fullwidth');
    if (panelBrackets) panelBrackets.style.display = 'block';
    if (btnBrackets) btnBrackets.classList.add('active');
    if (p) renderTournamentBrackets(p);
  } else {
    if (matchdayGrid) matchdayGrid.classList.remove('brackets-fullwidth');
    if (tabName === 'scorers') {
      if (panelScorers) panelScorers.style.display = 'block';
      if (btnScorers) btnScorers.classList.add('active');
      if (p) renderTopScorers(p);
    } else if (tabName === 'fixtures') {
      if (panelFixtures) panelFixtures.style.display = 'block';
      if (btnFixtures) btnFixtures.classList.add('active');
      if (p) renderFixturesList(p);
    }
  }
}
if (typeof window !== 'undefined') {
  window.switchMatchdaySideTab = switchMatchdaySideTab;
  window.renderLiveLeagueTable = renderLiveLeagueTable;
  window.renderTopScorers = renderTopScorers;
  window.renderFixturesList = renderFixturesList;
  window.renderMatchdayHub = renderMatchdayHub;
}



