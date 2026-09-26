import fs from 'fs';
import path from 'path';

console.log('--- TEST 1: Check CSS container widths and rules ---');
const styleCss = fs.readFileSync('css/style.css', 'utf-8');
const dashboardCss = fs.readFileSync('css/dashboard.css', 'utf-8');

if (!styleCss.includes('max-width: 1540px')) {
  throw new Error('css/style.css does not have max-width: 1540px on .app-container');
}
if (!styleCss.includes('.setup-main-card')) {
  throw new Error('css/style.css does not style .setup-main-card');
}
if (!dashboardCss.includes('.matchday-grid-two-col.brackets-fullwidth')) {
  throw new Error('css/dashboard.css does not include .matchday-grid-two-col.brackets-fullwidth');
}
if (!dashboardCss.includes('#tournamentBracketsContainer')) {
  throw new Error('css/dashboard.css does not style #tournamentBracketsContainer');
}
console.log('Test 1 PASSED: CSS files contain all required layout and container rules.');

console.log('--- TEST 2: Check switchMatchdaySideTab full-width toggling ---');
// Mock minimal DOM
const classLists = new Map();
function createMockEl(id, className = '') {
  const classes = new Set(className.split(' ').filter(Boolean));
  const el = {
    id,
    className,
    style: {},
    classList: {
      add: (c) => classes.add(c),
      remove: (c) => classes.delete(c),
      contains: (c) => classes.has(c),
      toggle: (c, val) => {
        if (val === undefined) val = !classes.has(c);
        if (val) classes.add(c); else classes.delete(c);
        return val;
      }
    },
    innerHTML: '',
    querySelector: () => null,
    querySelectorAll: () => []
  };
  classLists.set(id, classes);
  return el;
}

const elMap = {
  sidePanelScorers: createMockEl('sidePanelScorers'),
  sidePanelFixtures: createMockEl('sidePanelFixtures'),
  sidePanelBrackets: createMockEl('sidePanelBrackets'),
  btnTabTopScorers: createMockEl('btnTabTopScorers'),
  btnTabFixturesList: createMockEl('btnTabFixturesList'),
  btnTabBrackets: createMockEl('btnTabBrackets'),
  tournamentBracketsContainer: createMockEl('tournamentBracketsContainer'),
  topScorersContainer: createMockEl('topScorersContainer'),
  fixturesListContainer: createMockEl('fixturesListContainer'),
  liveLeagueTableContainer: createMockEl('liveLeagueTableContainer'),
  leagueTableTitle: createMockEl('leagueTableTitle')
};

const mockGrid = createMockEl('matchdayGrid', 'matchday-grid-two-col');

global.document = {
  getElementById: (id) => elMap[id] || null,
  querySelector: (sel) => {
    if (sel === '.matchday-grid-two-col') return mockGrid;
    if (sel.startsWith('#')) return elMap[sel.slice(1)] || null;
    return null;
  },
  querySelectorAll: () => []
};

global.window = {
  player: { name: 'Player Test', club: 'Hà Nội FC' }
};

const { switchMatchdaySideTab } = await import('../js/ui.js');
const { renderTournamentBrackets } = await import('../js/uiCup.js');

// 1. Switch to brackets
switchMatchdaySideTab('brackets', global.window.player);
if (!mockGrid.classList.contains('brackets-fullwidth')) {
  throw new Error('mockGrid did not receive brackets-fullwidth class!');
}
if (elMap.sidePanelBrackets.style.display !== 'block') {
  throw new Error('sidePanelBrackets is not display: block!');
}
if (elMap.sidePanelScorers.style.display !== 'none') {
  throw new Error('sidePanelScorers was not hidden!');
}
console.log('Test 2A PASSED: switchMatchdaySideTab("brackets") successfully applied brackets-fullwidth');

// 2. Switch back to scorers
switchMatchdaySideTab('scorers', global.window.player);
if (mockGrid.classList.contains('brackets-fullwidth')) {
  throw new Error('mockGrid still has brackets-fullwidth class after switching to scorers!');
}
if (elMap.sidePanelScorers.style.display !== 'block') {
  throw new Error('sidePanelScorers is not display: block!');
}
if (elMap.sidePanelBrackets.style.display !== 'none') {
  throw new Error('sidePanelBrackets was not hidden!');
}
console.log('Test 2B PASSED: switchMatchdaySideTab("scorers") successfully removed brackets-fullwidth');

// 3. Switch to fixtures
switchMatchdaySideTab('fixtures', global.window.player);
if (mockGrid.classList.contains('brackets-fullwidth')) {
  throw new Error('mockGrid still has brackets-fullwidth class after switching to fixtures!');
}
if (elMap.sidePanelFixtures.style.display !== 'block') {
  throw new Error('sidePanelFixtures is not display: block!');
}
console.log('Test 2C PASSED: switchMatchdaySideTab("fixtures") successfully kept normal grid layout');

console.log('--- TEST 3: Check Tournament Brackets Node Widths & Gaps ---');
const testPlayer = {
  name: 'Test Striker',
  club: 'Manchester United',
  activeCupTab: 'DOMESTIC_CUP',
  tournamentBrackets: {
    domesticCup: {
      name: 'FA Cup',
      roundOf16: [
        { id: 'dom_r16_1', club1: { name: 'Man Utd' }, club2: { name: 'Arsenal' }, score1: 2, score2: 1, isPlayed: true }
      ],
      quarterFinals: [],
      semiFinals: [],
      final: null
    }
  }
};

renderTournamentBrackets(testPlayer, 'DOMESTIC_CUP');
const domHtml = elMap.tournamentBracketsContainer.innerHTML;

if (domHtml.includes('210px')) {
  throw new Error('Found deprecated 210px in domestic cup bracket HTML!');
}
if (!domHtml.includes('width: 190px')) {
  throw new Error('Did not find width: 190px in domestic cup bracket match nodes!');
}
if (!domHtml.includes('repeat(4, 190px)')) {
  throw new Error('Did not find repeat(4, 190px) in domestic cup bracket headers/grid!');
}
if (!domHtml.includes('min-width: 820px')) {
  throw new Error('Scroll wrapper min-width is not 820px!');
}
console.log('Test 3 PASSED: Domestic Cup renders with 190px node width and 820px container width.');

// Test Continental Cup Bracket
testPlayer.tournamentBrackets.continentalCup = {
  name: 'UEFA Champions League',
  quarterFinals: [
    { id: 'ucl_qf1', club1: { name: 'Real Madrid' }, club2: { name: 'Bayern' }, score1: null, score2: null }
  ],
  semiFinals: [],
  final: null
};

renderTournamentBrackets(testPlayer, 'UCL');
const euroHtml = elMap.tournamentBracketsContainer.innerHTML;

if (euroHtml.includes('210px')) {
  throw new Error('Found deprecated 210px in European cup bracket HTML!');
}
if (!euroHtml.includes('repeat(3, 190px)')) {
  throw new Error('Did not find repeat(3, 190px) in European cup bracket grid!');
}
if (!euroHtml.includes('min-width: 620px')) {
  throw new Error('Scroll wrapper min-width is not 620px!');
}
console.log('Test 4 PASSED: Continental Cup renders with 190px node width and 620px container width.');

console.log('\n=============================================');
console.log('ALL LAYOUT & CONTAINER VERIFICATION TESTS PASSED!');
console.log('=============================================');
