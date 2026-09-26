/* =========================================================================
   UI MATCH ARENA — INTERACTIVE MATCH CENTER & DEEP TICK-BASED MATCH ENGINE
   Extracted from ui.js
   ========================================================================= */
import { XG_VALUES, RATING_DELTAS, createDeepMatchSimulation, simulateTickProgress, calculatePostMatchImpact } from './engine.js';
import { formatCurrency, formatSalary, showToast, triggerConfetti } from './uiCore.js';
import { getPlayer } from './state.js';
import { getFameTier, calculateOVR } from './playerEngine.js';
import { addLog } from './uiLogs.js';

// Hằng số thời gian hiển thị banner ăn mừng cố định (2.4s thực tế - chuẩn yêu cầu 2.0s - 2.5s)
const CELEBRATION_BANNER_DURATION = 2400;
const CELEBRATION_FADE_BUFFER = 400;

// Biến toàn cục theo dõi tỉ số & timer bàn thắng / kiến tạo
let _prevHomeScore = 0;
let _prevAwayScore = 0;
let _prevPlayerGoals = 0;
let _prevPlayerAssists = 0;

let _bannerTimeoutId = null;
let _shakeTimeoutId = null;
let _goalFlashTimeoutId = null;

// Helper định vị toạ độ chấm bóng và cầu thủ trên Radar sân bóng (x%, y%)
function _setRadarDot(el, x, y) {
  if (!el) return;
  el.style.left = `${x}%`;
  el.style.top = `${y}%`;
}

// Hàm cập nhật toạ độ di chuyển Radar Pitch 2D
function updateRadarPitch(sim, ball, player, opp1, opp2, mate, goalFlash, pitch) {
  if (!sim) return;

  const isHome = sim.isPlayerHome;
  let ballX = 50, ballY = 50;
  let plyX = 50, plyY = 50;
  let opp1X = 50, opp1Y = 35;
  let opp2X = 50, opp2Y = 65;
  let mateX = 45, mateY = 40;

  if (sim.currentZone === 'DEFENSIVE_THIRD') {
    ballX = isHome ? 25 + (Math.random() * 8 - 4) : 75 + (Math.random() * 8 - 4);
    plyX = isHome ? 28 : 72;
    opp1X = isHome ? 26 : 74;
    opp2X = isHome ? 20 : 80;
    mateX = isHome ? 18 : 82;
  } else if (sim.currentZone === 'ATTACKING_THIRD') {
    ballX = isHome ? 80 + (Math.random() * 8 - 4) : 20 + (Math.random() * 8 - 4);
    plyX = isHome ? 78 : 22;
    opp1X = isHome ? 85 : 15;
    opp2X = isHome ? 82 : 18;
    mateX = isHome ? 70 : 30;
  } else {
    ballX = 50 + (Math.random() * 10 - 5);
    plyX = isHome ? 52 : 48;
    opp1X = isHome ? 56 : 44;
    opp2X = isHome ? 46 : 54;
    mateX = isHome ? 44 : 56;
  }

  ballY = Math.max(15, Math.min(85, 50 + (Math.random() * 30 - 15)));
  plyY = Math.max(15, Math.min(85, ballY + (Math.random() * 12 - 6)));
  opp1Y = Math.max(15, Math.min(85, ballY + (Math.random() * 16 - 8)));
  opp2Y = Math.max(15, Math.min(85, 100 - opp1Y));
  mateY = Math.max(15, Math.min(85, 50 + (Math.random() * 20 - 10)));

  _setRadarDot(ball, ballX, ballY);
  _setRadarDot(player, plyX, plyY);
  _setRadarDot(opp1, opp1X, opp1Y);
  _setRadarDot(opp2, opp2X, opp2Y);
  _setRadarDot(mate, mateX, mateY);

  if (goalFlash && (sim.homeScore > _prevHomeScore || sim.awayScore > _prevAwayScore)) {
    _prevHomeScore = sim.homeScore;
    _prevAwayScore = sim.awayScore;
    if (_goalFlashTimeoutId) {
      clearTimeout(_goalFlashTimeoutId);
      _goalFlashTimeoutId = null;
    }
    goalFlash.classList.add('active');
    _goalFlashTimeoutId = setTimeout(() => {
      if (goalFlash) goalFlash.classList.remove('active');
      _goalFlashTimeoutId = null;
    }, 1200);
  }
}

function hideCelebrationBanner() {
  if (_bannerTimeoutId) {
    clearTimeout(_bannerTimeoutId);
    _bannerTimeoutId = null;
  }
  const overlay = document.getElementById('mcCelebrationOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}

function triggerMatchCelebration(type, title, subtitle, duration = CELEBRATION_BANNER_DURATION) {
  let overlay = document.getElementById('mcCelebrationOverlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'mcCelebrationOverlay';
    document.body.appendChild(overlay);
  }

  // 1. Quản lý timer an toàn: Huỷ các timer cũ đang chạy để tránh xung đột / race condition
  if (_bannerTimeoutId) {
    clearTimeout(_bannerTimeoutId);
    _bannerTimeoutId = null;
  }
  if (_shakeTimeoutId) {
    clearTimeout(_shakeTimeoutId);
    _shakeTimeoutId = null;
  }

  // 2. Hiệu ứng rung toàn màn hình (Screen Shake)
  document.body.classList.remove('mc-screen-shake');
  void document.body.offsetWidth; // Buộc trình duyệt reflow
  document.body.classList.add('mc-screen-shake');
  _shakeTimeoutId = setTimeout(() => {
    document.body.classList.remove('mc-screen-shake');
    _shakeTimeoutId = null;
  }, 450);

  // 3. Hiển thị banner hoạt ảnh với nội dung tương ứng
  overlay.className = `mc-celebration-overlay ${type} active`;
  overlay.innerHTML = `
    <div class="mc-celebration-badge">${title}</div>
    <div class="mc-celebration-sub">${subtitle}</div>
  `;

  if (type === 'goal') {
    triggerConfetti();
  }

  // 4. Timer độc lập đóng banner sau thời gian duration (tối thiểu 2.0s - 2.5s thực tế)
  _bannerTimeoutId = setTimeout(() => {
    if (overlay) {
      overlay.classList.remove('active');
    }
    _bannerTimeoutId = null;
  }, duration);
}

export function openMatchCenterModal(player, matchData, onComplete) {
  const modal = document.getElementById('matchCenterModal');
  if (!modal) {
    if (onComplete) onComplete({ success: true, homeScore: 2, awayScore: 1, score: "2-1", playerGoals: 1, playerAssists: 1, playerStats: { goals: 1, assists: 1, cleanSheets: 0, saves: 0, tackles: 0 } });
    return;
  }

  const sim = createDeepMatchSimulation(player, matchData);

  const tourneyBadge = document.getElementById('mcTourneyBadge');
  const stadiumInfo = document.getElementById('mcStadiumInfo');
  const homeLogo = document.getElementById('mcHomeLogo');
  const homeName = document.getElementById('mcHomeName');
  const homeScoreEl = document.getElementById('mcHomeScore');
  const awayLogo = document.getElementById('mcAwayLogo');
  const awayName = document.getElementById('mcAwayName');
  const awayScoreEl = document.getElementById('mcAwayScore');
  const timeBadge = document.getElementById('mcTimeBadge');
  const statusTag = document.getElementById('mcStatusTag');
  const ballIndicator = document.getElementById('mcBallIndicator');
  const situationCard = document.getElementById('mcSituationCard');
  const momentTitle = document.getElementById('mcMomentTitle');
  const momentDesc = document.getElementById('mcMomentDesc');
  const choicesContainer = document.getElementById('mcChoicesContainer');
  const eventsFeed = document.getElementById('mcEventsFeed');
  const btnSkip = document.getElementById('mcBtnSkipMatch');
  const postMatchSummary = document.getElementById('mcPostMatchSummary');
  const footerActions = document.getElementById('mcFooterActions');

  const liveRatingVal = document.getElementById('mcLiveRatingVal');
  const inMatchStaminaVal = document.getElementById('mcInMatchStaminaVal');
  const homeXGVal = document.getElementById('mcHomeXGVal');
  const awayXGVal = document.getElementById('mcAwayXGVal');
  const playerXgBadge = document.getElementById('mcPlayerXgBadge');
  const xgBarHome = document.getElementById('mcXgBarHome');
  const xgBarAway = document.getElementById('mcXgBarAway');
  const xgLabelHome = document.getElementById('mcXgLabelHome');
  const xgLabelAway = document.getElementById('mcXgLabelAway');

  const radarBall = document.getElementById('radarBall');
  const radarPlayer = document.getElementById('radarPlayer');
  const radarOpp1 = document.getElementById('radarOpp1');
  const radarOpp2 = document.getElementById('radarOpp2');
  const radarMate = document.getElementById('radarMate');
  const radarGoalFlash = document.getElementById('radarGoalFlash');
  const radarPitch = document.getElementById('mcRadarPitch');
  const radarLblHome = document.getElementById('radarLblHome');
  const radarLblAway = document.getElementById('radarLblAway');

  if (tourneyBadge) tourneyBadge.innerText = matchData.tourneyTitle || "TRẬN CẦU ĐINH ĐỈNH CAO";
  if (stadiumInfo) stadiumInfo.innerText = `${matchData.stadium || 'Sân Vận Động Quốc Gia'} — 82,500 Khán Giả`;
  if (homeLogo) homeLogo.innerText = sim.homeIcon;
  if (homeName) homeName.innerText = sim.homeName;
  if (awayLogo) awayLogo.innerText = sim.awayIcon;
  if (awayName) awayName.innerText = sim.awayName;

  if (homeScoreEl) homeScoreEl.innerText = "0";
  if (awayScoreEl) awayScoreEl.innerText = "0";
  if (timeBadge) timeBadge.innerText = "Phút 1'";
  if (statusTag) statusTag.innerText = "Hiệp 1 Bắt Đầu";
  if (situationCard) situationCard.style.display = "none";
  if (postMatchSummary) postMatchSummary.style.display = "none";
  if (eventsFeed) eventsFeed.style.display = "flex";
  if (btnSkip) btnSkip.style.display = "block";

  if (radarLblHome) radarLblHome.innerText = sim.isPlayerHome ? sim.homeName.slice(0, 6) : sim.awayName.slice(0, 6);
  if (radarLblAway) radarLblAway.innerText = sim.isPlayerHome ? sim.awayName.slice(0, 6) : sim.homeName.slice(0, 6);

  _prevHomeScore = sim.homeScore || 0;
  _prevAwayScore = sim.awayScore || 0;
  _prevPlayerGoals = sim.playerStats?.goals || sim.playerGoals || 0;
  _prevPlayerAssists = sim.playerStats?.assists || sim.playerAssists || 0;

  _setRadarDot(radarBall, 50, 50);
  _setRadarDot(radarPlayer, sim.isPlayerHome ? 45 : 55, 50);
  _setRadarDot(radarOpp1, sim.isPlayerHome ? 55 : 45, 35);
  _setRadarDot(radarOpp2, sim.isPlayerHome ? 58 : 42, 65);
  _setRadarDot(radarMate, sim.isPlayerHome ? 40 : 60, 40);
  if (radarGoalFlash) radarGoalFlash.className = 'radar-goal-flash';

  const matchLogs = [];
  matchLogs.push({
    min: "01",
    icon: "[Khai Cuoc]",
    text: `Trọng tài chính thổi còi khai cuộc! Trận đại chiến nảy lửa giữa <strong>${sim.homeName}</strong> và <strong>${sim.awayName}</strong> bắt đầu!`
  });

  if (eventsFeed) {
    eventsFeed.innerHTML = `
      <div class="mc-event-item">
        <span class="ev-min">01'</span> 
        <span>Trọng tài chính thổi còi khai cuộc! Trận đại chiến nảy lửa giữa <strong>${sim.homeName}</strong> và <strong>${sim.awayName}</strong> bắt đầu!</span>
      </div>
    `;
  }

  modal.classList.add('active');

  let isResolved = false;
  let isWaitingDecision = false;
  let tickTimeoutId = null;

  function clearMatchTimers() {
    if (tickTimeoutId) {
      clearTimeout(tickTimeoutId);
      tickTimeoutId = null;
    }
    hideCelebrationBanner();
    if (_shakeTimeoutId) {
      clearTimeout(_shakeTimeoutId);
      _shakeTimeoutId = null;
      document.body.classList.remove('mc-screen-shake');
    }
    if (_goalFlashTimeoutId) {
      clearTimeout(_goalFlashTimeoutId);
      _goalFlashTimeoutId = null;
    }
    if (radarGoalFlash) {
      radarGoalFlash.classList.remove('active');
    }
  }

  // Dọn dẹp an toàn các timer trước khi bắt đầu trận mới
  clearMatchTimers();

  function updateMatchHUD() {
    if (homeScoreEl) homeScoreEl.innerText = sim.homeScore;
    if (awayScoreEl) awayScoreEl.innerText = sim.awayScore;

    const currentMin = sim.tickMinutes[Math.min(sim.currentTickIndex, sim.totalTicks - 1)] || 90;
    if (timeBadge && !sim.isFinished) {
      timeBadge.innerText = `Phút ${currentMin}'`;
    }

    if (statusTag && !sim.isFinished) {
      if (sim.currentZone === 'DEFENSIVE_THIRD') statusTag.innerText = 'Phòng Ngự Sân Nhà';
      else if (sim.currentZone === 'MIDFIELD') statusTag.innerText = 'Tranh Chấp Tuyến Giữa';
      else statusTag.innerText = 'Hãm Thành Nguy Hiểm';
    }

    updateRadarPitch(sim, radarBall, radarPlayer, radarOpp1, radarOpp2, radarMate, radarGoalFlash, radarPitch);

    if (liveRatingVal) {
      liveRatingVal.innerText = sim.liveRating.toFixed(1);
      liveRatingVal.className = 'mc-hud-val ' + (
        sim.liveRating >= 8.0 ? 'rating-high' : (sim.liveRating >= 6.0 ? 'rating-normal' : 'rating-low')
      );
    }

    if (inMatchStaminaVal) {
      const stamInt = Math.round(sim.inMatchStamina);
      inMatchStaminaVal.innerText = `${stamInt}%`;
      inMatchStaminaVal.style.color = stamInt < 40 ? '#ef4444' : (stamInt < 65 ? '#f59e0b' : '#10b981');
    }

    if (homeXGVal) homeXGVal.innerText = sim.xG.homeTeam.toFixed(2);
    if (awayXGVal) awayXGVal.innerText = sim.xG.awayTeam.toFixed(2);
    if (playerXgBadge) playerXgBadge.innerText = `xG Cầu Thủ: ${sim.xG.player.toFixed(2)}`;
    if (xgLabelHome) xgLabelHome.innerText = `${sim.homeName} xG: ${sim.xG.homeTeam.toFixed(2)}`;
    if (xgLabelAway) xgLabelAway.innerText = `${sim.awayName} xG: ${sim.xG.awayTeam.toFixed(2)}`;

    const totalXG = sim.xG.homeTeam + sim.xG.awayTeam;
    const homePercent = totalXG > 0 ? Math.round((sim.xG.homeTeam / totalXG) * 100) : 50;
    if (xgBarHome) xgBarHome.style.width = `${homePercent}%`;
    if (xgBarAway) xgBarAway.style.width = `${100 - homePercent}%`;
  }

  function appendCommentaryEvent(event) {
    if (!event) return;
    matchLogs.push(event);
    if (!eventsFeed) return;
    const item = document.createElement('div');
    item.className = 'mc-event-item';
    item.innerHTML = `<span class="ev-min">${event.min}'</span> <span>${event.icon} ${event.text}</span>`;
    eventsFeed.appendChild(item);
    eventsFeed.scrollTop = eventsFeed.scrollHeight;
  }

  function showInteractiveDecision(decision) {
    if (!situationCard || !choicesContainer) return;
    isWaitingDecision = true;
    situationCard.style.display = "flex";

    if (momentTitle) momentTitle.innerText = decision.title;
    if (momentDesc) momentDesc.innerText = decision.desc;

    choicesContainer.innerHTML = '';
    decision.choices.forEach((choice) => {
      const card = document.createElement('div');
      card.className = 'mc-choice-card';
      const ratePct = Math.round(choice.successChance * 100);
      card.innerHTML = `
        <div class="mc-choice-top">
          <span class="mc-choice-label">${choice.text}</span>
          <span class="mc-choice-rate">${ratePct}% cơ hội</span>
        </div>
        <div class="mc-choice-req" style="color:var(--accent-gold); font-size:0.75rem;">
          ${choice.statHint}
        </div>
      `;

      card.onclick = () => {
        if (!isWaitingDecision) return;
        isWaitingDecision = false;
        situationCard.style.display = "none";

        const roll = Math.random();
        const isSuccess = roll <= choice.successChance;
        const actionResult = {
          actionType: isSuccess ? choice.successType : choice.failType,
          xG: choice.xG || 0.5
        };

        runNextTick(actionResult);
      };

      choicesContainer.appendChild(card);
    });
  }

  function runNextTick(choiceResult = null) {
    if (isResolved || isWaitingDecision) return;

    // Xoá timer tick trước đó nếu còn tồn đọng
    if (tickTimeoutId) {
      clearTimeout(tickTimeoutId);
      tickTimeoutId = null;
    }

    const result = simulateTickProgress(sim, player, choiceResult);
    updateMatchHUD();

    // === KIỂM TRA ĐỂ BẮT HOẠT ẢNH BÀN THẮNG / KIẾN TẠO ===
    const currentGoals = sim.playerStats?.goals || sim.playerGoals || 0;
    const currentAssists = sim.playerStats?.assists || sim.playerAssists || 0;

    let hasCelebration = false;
    if (currentGoals > _prevPlayerGoals) {
      _prevPlayerGoals = currentGoals;
      const subtitle = currentGoals >= 3
        ? `CÚ HAT-TRICK THẦN THÁNH! ${player.name} bùng nổ rực rỡ!`
        : `${player.name} vừa xé toang mành lưới!`;
      triggerMatchCelebration('goal', '⚽ VÀOOOO! BÀN THẮNG!', subtitle, CELEBRATION_BANNER_DURATION);
      hasCelebration = true;
    } else if (currentAssists > _prevPlayerAssists) {
      _prevPlayerAssists = currentAssists;
      triggerMatchCelebration('assist', '🎯 KIẾN TẠO ĐẲNG CẤP!', `Đường chuyền thành bàn của ${player.name}!`, CELEBRATION_BANNER_DURATION);
      hasCelebration = true;
    }

    if (result.tickEvent) {
      appendCommentaryEvent(result.tickEvent);
    }

    // Thời gian tạm dừng khi có highlight để người chơi kịp đọc & ăn mừng:
    // CELEBRATION_BANNER_DURATION (2.4s) + CELEBRATION_FADE_BUFFER (0.4s)
    const pauseDuration = hasCelebration ? (CELEBRATION_BANNER_DURATION + CELEBRATION_FADE_BUFFER) : 0;

    // 1. Tình huống quyết định tương tác (Interactive Decision)
    if (result.isDecisionMoment && result.decisionData) {
      if (hasCelebration) {
        tickTimeoutId = setTimeout(() => {
          tickTimeoutId = null;
          if (isResolved) return;
          showInteractiveDecision(result.decisionData);
        }, pauseDuration);
      } else {
        showInteractiveDecision(result.decisionData);
      }
      return;
    }

    // 2. Trận đấu đã kết thúc
    if (result.isFinished) {
      if (hasCelebration) {
        tickTimeoutId = setTimeout(() => {
          tickTimeoutId = null;
          if (isResolved) return;
          finishMatch();
        }, pauseDuration);
      } else {
        finishMatch();
      }
      return;
    }

    // 3. Tiến sang tick tiếp theo sau khoảng nghỉ tương ứng
    const nextTickDelay = hasCelebration ? pauseDuration : 1200;
    tickTimeoutId = setTimeout(() => {
      tickTimeoutId = null;
      runNextTick(null);
    }, nextTickDelay);
  }

  function finishMatch() {
    if (isResolved) return;
    isResolved = true;

    if (tickTimeoutId) {
      clearTimeout(tickTimeoutId);
      tickTimeoutId = null;
    }
    hideCelebrationBanner();

    if (timeBadge) timeBadge.innerText = "HẾT GIỜ (90+4')";
    if (statusTag) statusTag.innerText = "TRẬN ĐẤU KẾT THÚC";
    if (ballIndicator) ballIndicator.style.left = "50%";
    if (situationCard) situationCard.style.display = "none";
    if (eventsFeed) eventsFeed.style.display = "none";
    if (btnSkip) btnSkip.style.display = "none";

    matchLogs.push({
      min: "90+4",
      icon: "[Ket Thuc]",
      text: `Hết giờ! Trọng tài nổi còi kết thúc trận đấu. Tỷ số chung cuộc: <strong>${sim.homeName} ${sim.homeScore} - ${sim.awayScore} ${sim.awayName}</strong>.`
    });

    const isWin = sim.isPlayerHome ? sim.homeScore > sim.awayScore : sim.awayScore > sim.homeScore;
    const isPlayerWin = isWin;
    const isDraw = sim.homeScore === sim.awayScore;
    const isLoss = !isWin && !isDraw;

    sim.outcome = isWin ? 'W' : (isDraw ? 'D' : 'L');
    if (!sim.playerStats) sim.playerStats = {};
    if (sim.playerStats.cleanSheets === undefined) {
      const oppGoals = sim.isPlayerHome ? (sim.awayScore ?? 0) : (sim.homeScore ?? 0);
      sim.playerStats.cleanSheets = (oppGoals === 0 && !sim.isPlayerOnBench) ? 1 : 0;
    }

    if (isWin) triggerConfetti();

    const impact = calculatePostMatchImpact(sim, player);
    if (typeof window !== 'undefined' && typeof window.updateUI === 'function') {
      window.updateUI(player);
    }

    if (postMatchSummary) {
      postMatchSummary.style.display = "flex";

      const earn = impact.matchEarnings;
      let earningsHtml = '';
      if (earn) {
        earningsHtml = `
          <div class="mc-earnings-box">
            <div class="mc-earnings-header">
              <div class="mc-earnings-title">
                <span>TIỀN THƯỞNG HIỆU SUẤT TRẬN ĐẤU</span>
              </div>
              <div class="mc-earnings-total">
                +${formatCurrency(earn.totalEarned, "€")}
              </div>
            </div>

            <div class="mc-earnings-grid">
              <div class="mc-earnings-item">
                <span style="color: #94a3b8;">Ra sân:</span> <strong style="color:#fff;">+${formatCurrency(earn.baseFee, "€")}</strong>
              </div>
              ${earn.goalsCount > 0 ? `
              <div class="mc-earnings-item goal">
                <span style="color: #93c5fd;">Bàn thắng (x${earn.goalsCount} -${earn.goalRatePercent}% lương tuần):</span> <strong style="color:#60a5fa;">+${formatCurrency(earn.goalBonus, "€")}</strong>
              </div>
              ` : ''}
              ${earn.assistsCount > 0 ? `
              <div class="mc-earnings-item assist">
                <span style="color: #d8b4fe;">Kiến tạo (x${earn.assistsCount} -${earn.assistRatePercent}% lương tuần):</span> <strong style="color:#c084fc;">+${formatCurrency(earn.assistBonus, "€")}</strong>
              </div>
              ` : ''}
              ${earn.hatTrickBonus > 0 ? `
              <div class="mc-earnings-item hat-trick">
                <span style="color: #fde047;">Hat-trick (+10% lương tuần):</span> <strong style="color:#fbbf24;">+${formatCurrency(earn.hatTrickBonus, "€")}</strong>
              </div>
              ` : ''}
              ${earn.hasCleanSheet ? `
              <div class="mc-earnings-item clean-sheet">
                <span style="color: #6ee7b7;">Giữ sạch lưới (10% lương tuần):</span> <strong style="color:#34d399;">+${formatCurrency(earn.cleanSheetBonus, "€")}</strong>
              </div>
              ` : ''}
              ${earn.savesCount > 0 ? `
              <div class="mc-earnings-item save">
                <span style="color: #7dd3fc;">Cứu thua (x${earn.savesCount} - 1% lương tuần):</span> <strong style="color:#38bdf8;">+${formatCurrency(earn.saveBonus, "€")}</strong>
              </div>
              ` : ''}
              <div class="mc-earnings-item" style="border-left: 3px solid var(--accent-green); background: rgba(16, 185, 129, 0.1);">
                <span style="color: #6ee7b7;">Lương Matchday:</span> <strong style="color:#34d399;">+${formatSalary(earn.weeklyWage || player.salary)}</strong>
              </div>
            </div>

            <div class="mc-fame-buff-row">
              <div style="display: flex; align-items: center; gap: 6px; flex-wrap: wrap;">
                <span style="color: #cbd5e1;">Buff Danh Tiếng (${earn.fameBadge || ''} <strong>${earn.fameTierTitle || ''}</strong>):</span>
                <span class="mc-fame-badge-pill">x${(earn.fameMultiplier || 1).toFixed(2)} (+${earn.fameBonusPercent || 0}%)</span>
              </div>
              <div style="color: #fbbf24; font-weight: 800; font-size: 0.92rem;">
                +${formatCurrency(earn.fameBonusAmount || 0, "€")}
              </div>
            </div>
          </div>
        `;
      }

      const g = impact.growth || {
        earnedExp: 0,
        expPercent: 50,
        currentExp: 0,
        targetExp: 1000,
        growthLevel: 1,
        summaryText: "Tăng trưởng ổn định",
        statChanges: [],
        isLevelUp: false
      };

      const statChangesHtml = (g.statChanges && g.statChanges.length > 0) ? `
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed rgba(255,255,255,0.15); display: flex; flex-wrap: wrap; gap: 6px;">
          ${g.statChanges.map(sc => {
        const statLabel = sc.statName || (sc.stat ? sc.stat.toUpperCase() : '');
        const valText = sc.currentValue !== undefined ? sc.currentValue : (sc.delta > 0 ? '+' : '') + sc.delta;
        return `
              <div style="background: ${sc.isMilestone ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.35), rgba(16, 185, 129, 0.35))' : (sc.delta > 0 ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.25)')}; border: 1px solid ${sc.isMilestone ? '#fbbf24' : (sc.delta > 0 ? '#10b981' : '#ef4444')}; color: ${sc.isMilestone ? '#fef08a' : (sc.delta > 0 ? '#34d399' : '#f87171')}; border-radius: 6px; padding: 4px 10px; font-size: 0.78rem; font-weight: 800;">
                ${sc.isMilestone ? '[MỐC] ' : (sc.delta > 0 ? '[+] ' : '[-] ')} ${sc.reason} (${statLabel}:${valText})
              </div>
            `;
      }).join('')}
        </div>
      ` : '';

      const levelUpHtml = g.isLevelUp ? `
        <div style="margin-top: 8px; background: linear-gradient(90deg, rgba(245,158,11,0.25), rgba(16,185,129,0.25)); border: 1px solid #f59e0b; border-radius: 8px; padding: 6px 10px; font-size: 0.8rem; font-weight: 800; color: #fef08a; text-align: center;">
          ĐỘT PHÁ TIỀM NĂNG! Cầu thủ đã thăng cấp phát triển lên Cấp ${g.growthLevel}!
        </div>
      ` : '';

      const growthHtml = `
        <div class="mc-growth-box" style="margin-top: 14px; background: rgba(15, 23, 42, 0.85); border: 1px solid rgba(245, 158, 11, 0.4); border-radius: 12px; padding: 12px 16px; text-align: left; box-shadow: 0 4px 16px rgba(0,0,0,0.3);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <div style="font-size: 0.82rem; font-weight: 800; color: #fbbf24; text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px;">
              <span>TIẾN TRÌNH PHÁT TRIỂN CHỈ SỐ (CẤP ${g.growthLevel})</span>
            </div>
            <div style="font-size: 0.85rem; font-weight: 800; color: #38bdf8;">
              ${g.earnedExp > 0 ? `+${g.earnedExp} EXP` : '<span style="color:#ef4444;">Đóng Băng (0 EXP)</span>'}
            </div>
          </div>

          <div style="font-size: 0.82rem; color: #cbd5e1; margin-bottom: 8px;">
            ${g.summaryText}
          </div>

          <div style="background: rgba(255,255,255,0.08); border-radius: 999px; height: 10px; overflow: hidden; position: relative; border: 1px solid rgba(255,255,255,0.12);">
            <div style="background: linear-gradient(90deg, #f59e0b, #10b981); height: 100%; width: ${g.expPercent}%; border-radius: 999px; transition: width 1s ease;"></div>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.74rem; color: #94a3b8; margin-top: 4px; font-weight: 600;">
            <span>${g.currentExp} / ${g.targetExp} EXP</span>
            <span>${g.expPercent}%</span>
          </div>

          ${statChangesHtml}
          ${levelUpHtml}
        </div>
      `;

      const logsList = (matchLogs && matchLogs.length > 0 ? matchLogs : [
        { min: "01", icon: "[Bat Dau]", text: `Trận đấu giữa ${sim.homeName} và ${sim.awayName} bắt đầu!` },
        { min: "90+4", icon: "[Ket Thuc]", text: `Hết giờ! Tỷ số: ${sim.homeName} ${sim.homeScore} - ${sim.awayScore} ${sim.awayName}` }
      ]);

      const logsItemsHtml = logsList.map(log => {
        const minText = String(log.min).endsWith("'") ? log.min : `${log.min}'`;
        return `
          <div class="mc-event-item" style="padding: 8px 10px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 8px; display: flex; align-items: flex-start; gap: 10px; font-size: 0.82rem; line-height: 1.4; color: #e2e8f0;">
            <span class="ev-min" style="font-weight: 800; font-family: 'JetBrains Mono', monospace; color: var(--accent-gold); min-width: 38px; white-space: nowrap;">${minText}</span>
            <span style="flex: 1;">${log.icon ? log.icon + ' ' : ''}${log.text}</span>
          </div>
        `;
      }).join('');

      postMatchSummary.innerHTML = `
        <style>
          .summary-tab-buttons {
            display: flex;
            gap: 8px;
            justify-content: center;
            margin: 12px 0;
          }
          .btn-summary-tab {
            background: rgba(30, 41, 59, 0.7);
            color: #94a3b8;
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 8px;
            padding: 8px 16px;
            font-size: 0.85rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s ease;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .btn-summary-tab:hover {
            color: #fff;
            background: rgba(51, 65, 85, 0.9);
            border-color: rgba(255, 255, 255, 0.25);
          }
          .btn-summary-tab.active {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(16, 185, 129, 0.25));
            color: #fef08a;
            border-color: #f59e0b;
            box-shadow: 0 0 12px rgba(245, 158, 11, 0.25);
          }
        </style>

        <div class="mc-post-title-row">
          <div class="mc-post-title">
            ${isWin ? 'CHIẾN THẮNG VANG DỘI!' : 'TRẬN ĐẤU CỐNG HIẾN KHÉP LẠI'}
          </div>
          ${impact.isMOTM ? '<div class="mc-motm-badge">CẦU THỦ XUẤT SẮC NHẤT TRẬN (MOTM)</div>' : ''}
        </div>

        <div style="font-size:0.92rem; color:#fff; text-align:center;">
          Tỷ số chung cuộc: <strong>${sim.homeName} ${sim.homeScore} - ${sim.awayScore} ${sim.awayName}</strong>
        </div>

        <div class="summary-tab-buttons">
          <button id="btnTabSummary" class="btn-summary-tab active">Tổng Kết & Đánh Giá</button>
          <button id="btnTabLogs" class="btn-summary-tab">Diễn Biến Trận Đấu</button>
        </div>

        <div id="tabSummaryContent" style="display:block; width:100%;">
          <div class="mc-post-stats-grid">
            <div class="mc-post-stat-box">
              <span class="mc-post-stat-val" style="color:${impact.rating >= 8 ? '#10b981' : '#f59e0b'};">${impact.rating.toFixed(1)}</span>
              <span class="mc-post-stat-lbl">Live Rating</span>
            </div>
            <div class="mc-post-stat-box">
              <span class="mc-post-stat-val" style="color:var(--accent-blue);">${sim.playerStats.goals}</span>
              <span class="mc-post-stat-lbl">Bàn Thắng</span>
            </div>
            <div class="mc-post-stat-box">
              <span class="mc-post-stat-val" style="color:var(--accent-purple);">${sim.playerStats.assists}</span>
              <span class="mc-post-stat-lbl">Kiến Tạo</span>
            </div>
            <div class="mc-post-stat-box">
              <span class="mc-post-stat-val" style="color:var(--accent-green);">${sim.playerStats.tackles + sim.playerStats.saves}</span>
              <span class="mc-post-stat-lbl">Can Thiệp / Cứu Thua</span>
            </div>
            <div class="mc-post-stat-box">
              <span class="mc-post-stat-val" style="color:var(--accent-gold);">${impact.xG.toFixed(2)}</span>
              <span class="mc-post-stat-lbl">Bàn Kỳ Vọng (xG)</span>
            </div>
          </div>

          <div class="mc-xg-analytics-box">
            <div class="mc-xg-eval-title">Đánh Giá Hiệu Suất Dứt Điểm (xG Shot Performance):</div>
            <div class="mc-xg-eval-desc">
              Bàn thắng thực tế: <strong>${sim.playerStats.goals} bàn</strong> so với kỳ vọng: <strong>${impact.xG.toFixed(2)} xG</strong> (Chênh lệch: <strong>${impact.xGDiff > 0 ? '+' + impact.xGDiff : impact.xGDiff}</strong>).<br>
              Nhận định chuyên môn: <strong style="color:var(--accent-gold);">${impact.shotEfficiencyComment}</strong>.
            </div>
          </div>

          <div class="mc-rewards-strip">
            <div class="mc-reward-pill">Tinh thần: ${impact.deltaMorale >= 0 ? '+' + impact.deltaMorale : impact.deltaMorale} Morale</div>
            <div class="mc-reward-pill">Danh tiếng: ${impact.deltaFame >= 0 ? '+' + impact.deltaFame : impact.deltaFame} Fame</div>
            ${impact.deltaMarketValuePercent !== 0 ? `<div class="mc-reward-pill">Định giá: ${impact.deltaMarketValuePercent > 0 ? '+' : ''}${Math.round(impact.deltaMarketValuePercent * 100)}%</div>` : ''}
          </div>

          ${earningsHtml}
          ${growthHtml}
        </div>

        <div id="tabLogsContent" style="display: none; max-height: 320px; overflow-y: auto; text-align: left; padding: 10px; width: 100%; box-sizing: border-box; background: rgba(15, 23, 42, 0.65); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px;">
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${logsItemsHtml}
          </div>
        </div>
      `;

      const btnTabSummary = document.getElementById('btnTabSummary');
      const btnTabLogs = document.getElementById('btnTabLogs');
      const tabSummaryContent = document.getElementById('tabSummaryContent');
      const tabLogsContent = document.getElementById('tabLogsContent');

      if (btnTabSummary && btnTabLogs && tabSummaryContent && tabLogsContent) {
        btnTabSummary.onclick = () => {
          btnTabSummary.classList.add('active');
          btnTabLogs.classList.remove('active');
          tabSummaryContent.style.display = 'block';
          tabLogsContent.style.display = 'none';
        };

        btnTabLogs.onclick = () => {
          btnTabLogs.classList.add('active');
          btnTabSummary.classList.remove('active');
          tabSummaryContent.style.display = 'none';
          tabLogsContent.style.display = 'block';
        };
      }
    }

    if (footerActions) {
      footerActions.style.display = 'block';
      footerActions.innerHTML = `
        <button class="btn btn-primary" id="btnFinishMatchCenter" style="padding: 12px 28px; font-weight: 800; font-size: 1rem;">
          Hoàn Tất Trận Đấu & Nhận Thưởng
        </button>
      `;
      const btnFinish = document.getElementById('btnFinishMatchCenter');
      if (btnFinish) {
        btnFinish.onclick = () => {
          clearMatchTimers();
          modal.classList.remove('active');
          if (onComplete) {
            onComplete({
              success: true,
              homeScore: sim.homeScore,
              awayScore: sim.awayScore,
              playerGoals: sim.playerStats.goals,
              playerAssists: sim.playerStats.assists,
              playerStats: { ...sim.playerStats },
              choiceNum: 1,
              sim,
              impact
            });
          }
        };
      }
    }
  }

  if (btnSkip) {
    btnSkip.onclick = () => {
      if (isResolved) return;
      clearMatchTimers();
      isWaitingDecision = false;
      while (!sim.isFinished && sim.currentTickIndex < sim.totalTicks) {
        const res = simulateTickProgress(sim, player, null);
        if (res && res.tickEvent) {
          appendCommentaryEvent(res.tickEvent);
        }
      }
      finishMatch();
    };
  }

  tickTimeoutId = setTimeout(() => {
    tickTimeoutId = null;
    runNextTick(null);
  }, 600);
}