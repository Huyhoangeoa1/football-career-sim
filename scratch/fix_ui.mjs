import fs from 'fs';

let content = fs.readFileSync('./js/ui.js', 'utf8');

// 1. Add imports to ui.js
const importEngineOld = `import { 
  calculateTransfermarktValue, 
  calculateNetWorth, 
  clampStats, 
  calculatePlayerGoatScore, 
  updateCompetitionTier,
  createDeepMatchSimulation,
  simulateTickProgress,
  calculatePostMatchImpact,
  initSeasonScheduleAndTable,
  getTransferWindowStatus,
  XG_VALUES,
  RATING_DELTAS
} from './engine.js';`;

const importEngineNew = `import { 
  calculateTransfermarktValue, 
  calculateNetWorth, 
  clampStats, 
  calculatePlayerGoatScore, 
  updateCompetitionTier,
  createDeepMatchSimulation,
  simulateTickProgress,
  calculatePostMatchImpact,
  initSeasonScheduleAndTable,
  getTransferWindowStatus,
  isClubMatch,
  getPlayerActiveClub,
  initLeagueTopScorers,
  XG_VALUES,
  RATING_DELTAS
} from './engine.js';`;

if (!content.includes(importEngineOld)) {
  console.error("Could not find importEngineOld");
  process.exit(1);
}
content = content.replace(importEngineOld, importEngineNew);

// 2. Update renderLiveLeagueTable LEAGUE part
const leagueRowOld = `  table.forEach((team, idx) => {
    const rank = idx + 1;
    const isPlayer = team.isPlayerClub || (activeClub && (team.clubId === activeClub.id || team.clubName === activeClub.name));`;

const leagueRowNew = `  table.forEach((team, idx) => {
    const rank = idx + 1;
    const isPlayer = team.isPlayerClub || isClubMatch(team, activeClub);`;

if (!content.includes(leagueRowOld)) {
  console.error("Could not find leagueRowOld");
  process.exit(1);
}
content = content.replace(leagueRowOld, leagueRowNew);

const playedCellOld = `        <td style="text-align:center;">\${team.played}</td>`;
const playedCellNew = `        <td style="text-align:center;">\${team.played !== undefined ? team.played : (team.matches || 0)}</td>`;
content = content.replace(playedCellOld, playedCellNew);

// 3. Replace renderTopScorers and renderFixturesList
const topScorersStart = `/**
 * Hiển thị Cuộc đua Vua Phá Lưới (Top Scorers Leaderboard)
 */`;
const fixturesEnd = `/**
 * Hiển thị Sơ Đồ Phân Nhánh Cúp (Tournament Bracket Tree)
 */`;

const idxTopScorers = content.indexOf(topScorersStart);
const idxFixturesEnd = content.indexOf(fixturesEnd);

if (idxTopScorers === -1 || idxFixturesEnd === -1) {
  console.error("Could not find topScorersStart or fixturesEnd");
  process.exit(1);
}

const replacementScorersAndFixtures = `/**
 * Hiển thị Cuộc đua Vua Phá Lưới (Top Scorers Leaderboard)
 */
export function renderTopScorers(player) {
  const container = document.getElementById('topScorersContainer');
  if (!container) return;

  const isYouth = Boolean(player.isAcademyStage || (player.age <= 16 && !player.currentClub));
  const activeClub = getPlayerActiveClub(player);
  const leagueName = isYouth ? "Giải Trẻ U19 Academy" : (activeClub?.league?.name || "Premier League");

  // Tự động kiểm tra và làm sạch nếu giải trẻ bị lẫn sao Premier League từ save cũ
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

  // Đồng bộ số bàn thắng của người chơi với currentSeasonStats
  const playerItem = scorers.find(s => s.isPlayer);
  if (playerItem) {
    const curGoals = player.currentSeasonStats?.goals || 0;
    if (curGoals > playerItem.goals) {
      playerItem.goals = curGoals;
    }
    // Cập nhật tên/CLB người chơi nếu cần
    playerItem.name = \`\${player.name} (BẠN)\`;
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

  let html = \`
    <div style="padding: 6px 12px; margin-bottom: 8px; font-size: 0.74rem; font-weight: 700; color: var(--accent-gold); background: rgba(245, 158, 11, 0.1); border-radius: 6px; border: 1px solid rgba(245, 158, 11, 0.2); display: flex; justify-content: space-between; align-items: center;">
      <span>🏆 \${leagueName}</span>
      <span style="color: var(--text-muted); font-size: 0.7rem;">Top 8 Chân Sút</span>
    </div>
  \`;
  scorers.slice(0, 8).forEach((s, idx) => {
    const isPlayer = s.isPlayer;
    html += \`
      <div class="top-scorer-item \${isPlayer ? 'is-player' : ''}">
        <div class="scorer-left">
          <div class="scorer-rank" style="color:\${idx === 0 ? 'var(--accent-gold)' : (idx === 1 ? '#cbd5e1' : (idx === 2 ? '#b45309' : 'var(--text-muted)'))};">
            \${idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : idx + 1))}
          </div>
          <div>
            <div style="font-weight:800; color:\${isPlayer ? 'var(--accent-gold)' : '#fff'};">
              \${s.name} \${isPlayer ? '⭐' : ''}
            </div>
            <div style="font-size:0.7rem; color:var(--text-muted);">
              \${s.clubIcon || ''} \${s.clubName || s.clubCode}
            </div>
          </div>
        </div>
        <div class="scorer-goals">
          ⚽ \${s.goals} <small style="font-size:0.65rem; color:var(--text-muted); font-weight:normal;">bàn</small>
        </div>
      </div>
    \`;
  });

  container.innerHTML = html;
}

/**
 * Hiển thị Danh Sách Lịch Thi Đấu & Kết Quả Toàn Mùa
 * Hỗ trợ Bộ lọc: [📅 Tất Cả Các Trận] | [⭐ Lịch Sử Đấu Của Đội Mình]
 */
export function renderFixturesList(player) {
  const container = document.getElementById('fixturesListContainer');
  if (!container) return;

  const fixtures = player.currentSeasonFixtures || [];
  const curIdx = player.currentFixtureIndex || 0;
  const isYouth = Boolean(player.isAcademyStage || (player.age <= 16 && !player.currentClub));
  const activeClub = getPlayerActiveClub(player);

  player.fixturesSubFilter = player.fixturesSubFilter || 'ALL'; // 'ALL' | 'MY_CLUB'

  // Header bộ lọc tab con
  let filterBarHtml = \`
    <div class="fixtures-subfilter-tabs" style="display: flex; gap: 8px; margin-bottom: 12px; background: rgba(0,0,0,0.3); padding: 4px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);">
      <button type="button" id="btnFixturesFilterAll" class="fixtures-filter-btn \${player.fixturesSubFilter === 'ALL' ? 'active' : ''}" style="flex: 1; padding: 6px 10px; font-size: 0.74rem; font-weight: 800; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s ease; background: \${player.fixturesSubFilter === 'ALL' ? 'var(--accent-gold)' : 'transparent'}; color: \${player.fixturesSubFilter === 'ALL' ? '#000' : 'var(--text-muted)'};">
        📅 Tất Cả Các Trận
      </button>
      <button type="button" id="btnFixturesFilterMyClub" class="fixtures-filter-btn \${player.fixturesSubFilter === 'MY_CLUB' ? 'active' : ''}" style="flex: 1; padding: 6px 10px; font-size: 0.74rem; font-weight: 800; border-radius: 6px; border: none; cursor: pointer; transition: all 0.2s ease; background: \${player.fixturesSubFilter === 'MY_CLUB' ? 'var(--accent-gold)' : 'transparent'}; color: \${player.fixturesSubFilter === 'MY_CLUB' ? '#000' : 'var(--text-muted)'};">
        ⭐ Lịch Sử Đấu Của Đội Mình
      </button>
    </div>
  \`;

  if (fixtures.length === 0) {
    container.innerHTML = filterBarHtml + '<div style="padding:15px; color:var(--text-muted); text-align:center;">Chưa tạo lịch thi đấu.</div>';
    bindFixturesFilterButtons(player);
    return;
  }

  let contentHtml = '';

  if (player.fixturesSubFilter === 'MY_CLUB') {
    // Lọc các trận có CLB người chơi tham gia và ĐÃ ĐÁ
    const myClubMatches = fixtures.filter(f => {
      const pMatch = f.playerMatch;
      if (!pMatch) return false;
      const hasMyClub = isClubMatch(pMatch.homeClub, activeClub) || isClubMatch(pMatch.awayClub, activeClub) || pMatch.isPlayerHome !== undefined;
      const isPlayed = Boolean(f.isCompleted || pMatch.isPlayed || pMatch.result);
      return hasMyClub && isPlayed;
    });

    if (myClubMatches.length === 0) {
      contentHtml = \`
        <div style="padding: 28px 16px; color: var(--text-muted); text-align: center; font-weight: 600; line-height: 1.6; background: rgba(0,0,0,0.2); border-radius: 10px; border: 1px dashed rgba(255,255,255,0.1); margin: 8px 0;">
          <div style="font-size: 1.8rem; margin-bottom: 6px;">📋</div>
          Chưa có trận đấu nào diễn ra trong mùa này.
        </div>
      \`;
    } else {
      contentHtml = '<div style="display:flex; flex-direction:column; gap:8px;">';
      myClubMatches.forEach(f => {
        const pMatch = f.playerMatch;
        const res = pMatch.result || {};
        const homeScore = res.homeScore !== undefined ? res.homeScore : 0;
        const awayScore = res.awayScore !== undefined ? res.awayScore : 0;

        const isHome = pMatch.isPlayerHome !== undefined ? pMatch.isPlayerHome : isClubMatch(pMatch.homeClub, activeClub);
        let outcome = 'D'; // 'W' | 'D' | 'L'
        if (homeScore > awayScore) outcome = isHome ? 'W' : 'L';
        else if (homeScore < awayScore) outcome = isHome ? 'L' : 'W';
        else outcome = 'D';

        let badgeBg = '#64748b';
        let badgeText = 'HÒA';
        let borderColor = 'rgba(148, 163, 184, 0.35)';
        let cardBg = 'linear-gradient(135deg, rgba(148, 163, 184, 0.08), rgba(15, 23, 42, 0.6))';
        let scoreColor = '#cbd5e1';

        if (outcome === 'W') {
          badgeBg = '#10b981';
          badgeText = 'THẮNG';
          borderColor = 'rgba(16, 185, 129, 0.5)';
          cardBg = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(15, 23, 42, 0.7))';
          scoreColor = '#10b981';
        } else if (outcome === 'L') {
          badgeBg = '#ef4444';
          badgeText = 'THUA';
          borderColor = 'rgba(239, 68, 68, 0.5)';
          cardBg = 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(15, 23, 42, 0.7))';
          scoreColor = '#f87171';
        }

        const pGoals = res.playerGoals || 0;
        const pAssists = res.playerAssists || 0;
        const rating = res.rating !== undefined ? Number(res.rating).toFixed(1) : "7.0";

        contentHtml += \`
          <div class="my-club-match-card" style="border: 1px solid \${borderColor}; background: \${cardBg}; border-radius: 10px; padding: 10px 14px; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
              <span style="font-size:0.7rem; font-weight:800; color:var(--accent-gold); text-transform:uppercase; letter-spacing:0.5px;">
                \${f.stageName} • \${f.competitionName}
              </span>
              <span style="background:\${badgeBg}; color:#fff; font-size:0.65rem; font-weight:900; padding:2px 8px; border-radius:4px; text-transform:uppercase;">
                \${badgeText}
              </span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px;">
              <span style="color:#fff; font-weight:800; font-size:0.85rem;">
                \${pMatch.homeClub?.name || 'Đội Nhà'}
              </span>
              <span style="font-size:1rem; font-weight:900; color:\${scoreColor}; background:rgba(0,0,0,0.4); padding:2px 10px; border-radius:6px; letter-spacing:1px;">
                \${homeScore} - \${awayScore}
              </span>
              <span style="color:#fff; font-weight:800; font-size:0.85rem;">
                \${pMatch.awayClub?.name || 'Đội Khách'}
              </span>
            </div>

            <div style="font-size:0.75rem; color:#cbd5e1; font-weight:600; padding-top:4px; border-top:1px dashed rgba(255,255,255,0.1); display:flex; justify-content:center; gap:8px;">
              <span>⚽ <strong>\${pGoals}</strong> Bàn thắng</span>
              <span style="color:rgba(255,255,255,0.2);">|</span>
              <span>👟 <strong>\${pAssists}</strong> Kiến tạo</span>
              <span style="color:rgba(255,255,255,0.2);">|</span>
              <span>⭐ Rating: <strong style="color:var(--accent-gold);">\${rating}</strong></span>
            </div>
          </div>
        \`;
      });
      contentHtml += '</div>';
    }
  } else {
    // Tab Tất Cả Các Trận
    contentHtml = '<div style="display:flex; flex-direction:column; gap:6px;">';
    fixtures.forEach((f, idx) => {
      const isCurrent = idx === curIdx;
      const isPlayed = f.isCompleted || (f.playerMatch && f.playerMatch.isPlayed);
      const pMatch = f.playerMatch;
      
      let resultBadge = '';
      if (isPlayed && pMatch.result) {
        resultBadge = \`<span style="font-weight:900; color:#fff; background:rgba(0,0,0,0.4); padding:2px 8px; border-radius:6px;">\${pMatch.result.scoreStr || (pMatch.result.homeScore + ' - ' + pMatch.result.awayScore)}</span>\`;
      } else if (isCurrent) {
        resultBadge = \`<span style="font-weight:800; color:#000; background:var(--accent-gold); padding:2px 8px; border-radius:6px; font-size:0.7rem;">SẮP ĐÁ</span>\`;
      } else {
        resultBadge = \`<span style="color:var(--text-muted); font-size:0.7rem;">Chưa đá</span>\`;
      }

      contentHtml += \`
        <div class="fixture-card-row \${isCurrent ? 'is-current' : ''}">
          <div style="display:flex; flex-direction:column; gap:2px;">
            <span style="font-size:0.68rem; color:\${f.competitionType === 'NATIONAL_TEAM' ? '#10b981' : (f.competitionType === 'UCL' ? 'var(--accent-blue)' : (f.competitionType === 'DOMESTIC_CUP' ? 'var(--accent-purple)' : 'var(--accent-gold)'))}; font-weight:800;">
              \${f.stageName} • \${f.competitionName}
            </span>
            <span style="color:#fff; font-weight:700;">
              \${pMatch.homeClub?.name || 'Đội Nhà'} vs \${pMatch.awayClub?.name || 'Đội Khách'}
            </span>
          </div>
          <div>
            \${resultBadge}
          </div>
        </div>
      \`;
    });
    contentHtml += '</div>';
  }

  container.innerHTML = filterBarHtml + contentHtml;
  bindFixturesFilterButtons(player);
}

function bindFixturesFilterButtons(player) {
  const btnAll = document.getElementById('btnFixturesFilterAll');
  const btnMyClub = document.getElementById('btnFixturesFilterMyClub');
  if (btnAll) {
    btnAll.onclick = (e) => {
      e.preventDefault();
      player.fixturesSubFilter = 'ALL';
      renderFixturesList(player);
    };
  }
  if (btnMyClub) {
    btnMyClub.onclick = (e) => {
      e.preventDefault();
      player.fixturesSubFilter = 'MY_CLUB';
      renderFixturesList(player);
    };
  }
}

`;

content = content.slice(0, idxTopScorers) + replacementScorersAndFixtures + content.slice(idxFixturesEnd);

// 4. Update openMatchCenterModal onComplete payload
const arenaOnCompleteOld = `      document.getElementById('btnFinishMatchCenter').onclick = () => {
        modal.classList.remove('active');
        if (onComplete) {
          onComplete({
            success: true,
            homeScore: sim.homeScore,
            awayScore: sim.awayScore,
            playerGoals: sim.playerStats.goals,
            playerAssists: sim.playerStats.assists,
            choiceNum: 1,
            sim,
            impact
          });
        }
      };`;

const arenaOnCompleteNew = `      document.getElementById('btnFinishMatchCenter').onclick = () => {
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
      };`;

if (content.includes(arenaOnCompleteOld)) {
  content = content.replace(arenaOnCompleteOld, arenaOnCompleteNew);
}

const noModalOnCompleteOld = `if (onComplete) onComplete({ success: true, score: "2-1", playerGoals: 1, playerAssists: 1 });`;
const noModalOnCompleteNew = `if (onComplete) onComplete({ success: true, homeScore: 2, awayScore: 1, score: "2-1", playerGoals: 1, playerAssists: 1, playerStats: { goals: 1, assists: 1, cleanSheets: 0, saves: 0, tackles: 0 } });`;
if (content.includes(noModalOnCompleteOld)) {
  content = content.replace(noModalOnCompleteOld, noModalOnCompleteNew);
}

fs.writeFileSync('./js/ui.js', content, 'utf8');
console.log("Successfully updated ui.js!");
