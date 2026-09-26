import fs from 'fs';

// 1. Update storage.js
let storageContent = fs.readFileSync('./js/storage.js', 'utf8');

const storageMigrationOld = `  // Migration: Sửa triệt để lỗi người chơi ở Học Viện Trẻ U19 nhưng Vua phá lưới hoặc BXH bị gán Premier League
  if (data.isAcademyStage) {
    const hasPremierScorer = data.leagueTopScorers && data.leagueTopScorers.some(s => 
      s.name === "Erling Haaland" || s.name === "Bukayo Saka" || s.name === "Cole Palmer" || s.clubId === "man_city"
    );
    if (hasPremierScorer) {
      const pItem = data.leagueTopScorers.find(s => s.isPlayer);
      const playerGoals = pItem ? pItem.goals : (data.currentSeasonStats?.goals || 0);
      const youthPool = REAL_RIVAL_SCORERS.YOUTH_LEAGUE || [];
      const playerClub = data.academy || { id: "player_youth", name: "Học Viện Trẻ", code: "YTH", icon: "🌱" };
      data.leagueTopScorers = [
        {
          name: \`\${data.name} (BẠN)\`,
          clubId: playerClub.id,
          clubName: playerClub.name,
          clubCode: playerClub.code || "YTH",
          clubIcon: playerClub.icon || "🌱",
          goals: playerGoals,
          isPlayer: true
        },
        ...youthPool.map(star => ({
          name: star.name,
          clubId: star.clubId,
          clubName: star.clubName,
          clubCode: star.clubCode,
          clubIcon: star.clubIcon,
          goals: 0,
          isPlayer: false,
          avgGPR: star.avgGPR || 0.6
        }))
      ];
    }

    const hasEplTable = data.leagueTable && data.leagueTable.some(t => t.clubId === 'man_city' || t.clubId === 'arsenal');
    if (hasEplTable) {
      const activeClub = data.academy;
      data.leagueTable = YOUTH_LEAGUE_CLUBS.map(club => ({
        clubId: club.id,
        clubName: club.name,
        clubCode: club.code || club.name.substring(0, 3).toUpperCase(),
        clubIcon: club.icon || "⚽",
        power: club.power || 75,
        isPlayerClub: Boolean(activeClub && (club.id === activeClub.id || club.name === activeClub.name)),
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
        recentForm: []
      }));
    }
  }`;

const storageMigrationNew = `  // Migration: Sửa triệt để lỗi người chơi ở Học Viện Trẻ U19 nhưng Vua phá lưới hoặc BXH bị gán Premier League
  if (data.isAcademyStage) {
    const hasPremierScorer = data.leagueTopScorers && data.leagueTopScorers.some(s => 
      !s.isPlayer && (s.name === "Erling Haaland" || s.name === "Bukayo Saka" || s.name === "Cole Palmer" || s.name === "Mohamed Salah" || s.name === "Alexander Isak" || s.clubId === "man_city" || s.clubId === "arsenal")
    );
    if (hasPremierScorer || !data.leagueTopScorers || data.leagueTopScorers.length <= 1) {
      const pItem = (data.leagueTopScorers || []).find(s => s.isPlayer);
      const playerGoals = pItem ? pItem.goals : (data.currentSeasonStats?.goals || 0);
      const youthPool = REAL_RIVAL_SCORERS.YOUTH_LEAGUE || [];
      const playerClub = data.academy || data.club || { id: "bayern_junior", name: "FC Bayern Campus", code: "BAY", icon: "🔴" };
      data.leagueTopScorers = [
        {
          name: \`\${data.name} (BẠN)\`,
          clubId: playerClub.id || "bayern_junior",
          clubName: playerClub.name || "FC Bayern Campus",
          clubCode: playerClub.code || "BAY",
          clubIcon: playerClub.icon || "🔴",
          goals: playerGoals,
          isPlayer: true
        },
        ...youthPool.map(star => ({
          name: star.name,
          clubId: star.clubId,
          clubName: star.clubName,
          clubCode: star.clubCode,
          clubIcon: star.clubIcon,
          goals: 0,
          isPlayer: false,
          avgGPR: star.avgGPR || 0.6
        }))
      ];
    }

    if (Array.isArray(data.leagueTable)) {
      data.leagueTable.forEach(team => {
        if (!team.clubId && team.id) team.clubId = team.id;
        if (!team.id && team.clubId) team.id = team.clubId;
        if (!team.clubName && team.name) team.clubName = team.name;
        if (!team.name && team.clubName) team.name = team.clubName;
        if (team.matches === undefined) team.matches = team.played || 0;
        if (team.played === undefined) team.played = team.matches || 0;
      });
    }

    const hasEplTable = data.leagueTable && data.leagueTable.some(t => t.clubId === 'man_city' || t.clubId === 'arsenal');
    if (hasEplTable || !data.leagueTable || data.leagueTable.length === 0) {
      const activeClub = data.academy || data.club;
      data.leagueTable = YOUTH_LEAGUE_CLUBS.map(club => ({
        clubId: club.id,
        id: club.id,
        clubName: club.name,
        name: club.name,
        clubCode: club.code || club.name.substring(0, 3).toUpperCase(),
        clubIcon: club.icon || "⚽",
        power: club.power || 75,
        isPlayerClub: Boolean(activeClub && (club.id === activeClub.id || club.name === activeClub.name || (activeClub.name && activeClub.name.includes("Bayern")))),
        played: 0,
        matches: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        points: 0,
        recentForm: []
      }));
    }
  }`;

if (!storageContent.includes(storageMigrationOld)) {
  console.error("Could not find storageMigrationOld in storage.js");
  process.exit(1);
}
storageContent = storageContent.replace(storageMigrationOld, storageMigrationNew);
fs.writeFileSync('./js/storage.js', storageContent, 'utf8');
console.log("Successfully updated storage.js!");

// 2. Update main.js
let mainContent = fs.readFileSync('./js/main.js', 'utf8');

// Ensure renderLiveLeagueTable and renderTopScorers and renderFixturesList are imported in main.js
const uiImportTarget = `  updateUI, \n  renderNationalityOptions, `;
const uiImportReplacement = `  updateUI, \n  renderLiveLeagueTable,\n  renderTopScorers,\n  renderFixturesList,\n  renderNationalityOptions, `;

if (!mainContent.includes(uiImportReplacement) && mainContent.includes(uiImportTarget)) {
  mainContent = mainContent.replace(uiImportTarget, uiImportReplacement);
}

// In playNextFixtureRound arena callback and quick sim
const quickSimCallOld = `      const outcome = simulateMatchdayRound(player, true, null);
      handlePostMatchOutcome(player, outcome, false);`;

const quickSimCallNew = `      const outcome = simulateMatchdayRound(player, true, null);
      handlePostMatchOutcome(player, outcome, false);
      renderLiveLeagueTable(player);
      renderTopScorers(player);
      renderFixturesList(player);`;

if (mainContent.includes(quickSimCallOld)) {
  mainContent = mainContent.replace(quickSimCallOld, quickSimCallNew);
}

const arenaCallOld = `          const outcome = simulateMatchdayRound(player, false, matchResult);
          handlePostMatchOutcome(player, outcome, false);`;

const arenaCallNew = `          const outcome = simulateMatchdayRound(player, false, matchResult);
          handlePostMatchOutcome(player, outcome, false);
          renderLiveLeagueTable(player);
          renderTopScorers(player);
          renderFixturesList(player);`;

if (mainContent.includes(arenaCallOld)) {
  mainContent = mainContent.replace(arenaCallOld, arenaCallNew);
}

// In handlePostMatchOutcome at the beginning
const handleOutcomeStart = `function handlePostMatchOutcome(player, outcome, isBatch = false, count = 1) {
  const roundData = outcome.roundData;`;

const handleOutcomeStartNew = `function handlePostMatchOutcome(player, outcome, isBatch = false, count = 1) {
  const roundData = outcome.roundData;
  renderLiveLeagueTable(player);
  renderTopScorers(player);
  renderFixturesList(player);`;

if (mainContent.includes(handleOutcomeStart)) {
  mainContent = mainContent.replace(handleOutcomeStart, handleOutcomeStartNew);
}

fs.writeFileSync('./js/main.js', mainContent, 'utf8');
console.log("Successfully updated main.js!");
