global.window = { addEventListener: () => {} };
let elMap = {};
function createMockEl(id) {
  return {
    id,
    innerHTML: '',
    innerText: '',
    style: {},
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    querySelector: (sel) => ({ onclick: null }),
    querySelectorAll: () => [],
    scrollIntoView: () => {}
  };
}
global.document = {
  getElementById: (id) => {
    if (!elMap[id]) elMap[id] = createMockEl(id);
    return elMap[id];
  },
  querySelector: () => null,
  querySelectorAll: () => []
};

Promise.all([import('../js/uiCup.js'), import('../js/ui.js')]).then(([uiCup, ui]) => {
  const { isPlayerClubCheck, renderMatchCard, renderTournamentBrackets } = uiCup;
  const { renderTopScorers } = ui;
  console.log('Testing isPlayerClubCheck:');

  const activeClub = { id: 'la_masia', name: 'FC Barcelona La Masia', code: 'MAS' };

  // Test 1: Placeholders MUST return false
  const placeholders = [
    { name: 'Nhất Bảng A', code: '1A' },
    { name: 'Nhì Bảng B', code: '2B' },
    { name: 'Chờ xác định', icon: '❓' },
    { name: 'TBD', code: 'TBD' },
    { name: 'Winner QF1' },
    { name: '?' },
    null,
    undefined,
    {},
    { name: '' }
  ];

  for (const ph of placeholders) {
    const res = isPlayerClubCheck(ph, activeClub);
    if (res !== false) {
      throw new Error('Placeholder check failed! Expected false for: ' + JSON.stringify(ph) + ' but got ' + res);
    }
  }
  console.log('Test 1 PASSED: All placeholders returned false.');

  // Test 2: Active club matches return true
  if (!isPlayerClubCheck({ id: 'la_masia', name: 'FC Barcelona La Masia' }, activeClub)) {
    throw new Error('Active club direct match failed!');
  }
  if (!isPlayerClubCheck({ id: 'la_masia' }, activeClub)) {
    throw new Error('Active club id match failed!');
  }
  if (!isPlayerClubCheck({ name: 'FC Barcelona La Masia' }, activeClub)) {
    throw new Error('Active club name match failed!');
  }
  if (isPlayerClubCheck({ id: 'castilla', name: 'Real Madrid Castilla' }, activeClub)) {
    throw new Error('Rival club falsely returned true!');
  }
  console.log('Test 2 PASSED: Active club accurately identified.');

  // Test 3: renderMatchCard does not add ★ BẠN to placeholder matches
  const phMatch = {
    id: 'youth_qf1',
    club1: { name: 'Nhất Bảng A', code: '1A', icon: '🥇' },
    club2: { name: 'Nhì Bảng B', code: '2B', icon: '🥈' },
    isPlayerMatch: false
  };
  const phHtml = renderMatchCard(phMatch, 'Tứ Kết 1', activeClub);
  if (phHtml.includes('★ BẠN')) {
    throw new Error('renderMatchCard included ★ BẠN for placeholder match!');
  }
  if (phHtml.includes('player-match')) {
    throw new Error('renderMatchCard included player-match class for placeholder match!');
  }
  console.log('Test 3 PASSED: renderMatchCard for placeholder has no ★ BẠN and no player-match class.');

  // Test 4: renderTopScorers row ordering
  const player = {
    name: 'Hoàng Sơn',
    age: 16,
    isAcademyStage: true,
    currentFixtureIndex: 1,
    currentSeasonStats: { matches: 1, goals: 2, assists: 1 },
    leagueTopScorers: [{ isPlayer: true, name: 'Hoàng Sơn', goals: 2 }],
    leagueTopAssists: [{ isPlayer: true, name: 'Hoàng Sơn', assists: 1 }],
    cupTrackers: {
      domestic: { scorers: [], assists: [] },
      continental: { scorers: [], assists: [] }
    }
  };
  const container = document.getElementById('topScorersContainer');
  renderTopScorers(player);
  const html = container.innerHTML;

  const idxLeague = html.indexOf('id="btnCompLeague"');
  const idxGoals = html.indexOf('id="btnTabGoals"');
  if (idxLeague === -1 || idxGoals === -1) {
    throw new Error('Buttons not found in renderTopScorers HTML!');
  }
  if (idxLeague > idxGoals) {
    throw new Error('Row ordering incorrect! Tournament selector (btnCompLeague) must appear BEFORE Stat selector (btnTabGoals)');
  }
  console.log('Test 4 PASSED: renderTopScorers has Tournament selector on Row 1 and Stat selector on Row 2.');

  // Test 5: UEFA Youth League bracket when !isGroupFinished
  const mockBracketContainer = createMockEl('tournamentBracketsContainer');
  elMap['tournamentBracketsContainer'] = mockBracketContainer;
  mockBracketContainer.querySelector = (sel) => ({ onclick: null });

  const pYouth = {
    ...player,
    activeCupTab: 'UCL',
    tournamentBrackets: {
      continentalCup: {
        name: 'UEFA Youth League',
        type: 'UCL',
        quarterFinals: [
          { id: 'youth_qf1', matchId: 'QF1', club1: { name: 'Nhất Bảng A' }, club2: { name: 'Nhì Bảng B' }, isPlayerMatch: false }
        ]
      }
    },
    continentalGroupTable: [
      { clubId: 'la_masia', clubName: 'FC Barcelona La Masia', played: 1, points: 3 },
      { clubId: 'cobham', clubName: 'Chelsea Cobham', played: 1, points: 1 },
      { clubId: 'ajax', clubName: 'Ajax De Toekomst', played: 1, points: 1 },
      { clubId: 'pvf', clubName: 'PVF Football Academy', played: 1, points: 0 }
    ]
  };

  renderTournamentBrackets(pYouth, 'UCL');
  const bracketHtml = mockBracketContainer.innerHTML;

  if (!bracketHtml.includes('VÒNG BẢNG ĐANG DIỄN RA')) {
    throw new Error('Notification banner for ongoing group stage missing!');
  }
  if (!bracketHtml.includes('btnViewUylStandings')) {
    throw new Error('btnViewUylStandings button missing in ongoing group stage view!');
  }

  // Verify that in the bracket grid for QF, there is NO ★ BẠN
  const qfSection = bracketHtml.slice(bracketHtml.indexOf('bracket-grid-container'));
  if (qfSection.includes('★ BẠN')) {
    throw new Error('★ BẠN tag found in QF bracket while group stage is ongoing!');
  }
  console.log('Test 5 PASSED: Bracket correctly shows ongoing banner and neutral QF nodes with zero ★ BẠN in bracket tree.');

  console.log('\nALL 5 VERIFICATION TESTS PASSED PERFECTLY!');
}).catch(err => {
  console.error(err);
  process.exit(1);
});
