import fs from 'fs';

const content = fs.readFileSync('js/engine.js', 'utf8');
const lines = content.split('\n');

function findLine(str) {
  return lines.findIndex(l => l.includes(str)) + 1;
}

console.log('applyTacticalModifiers:', findLine('export function applyTacticalModifiers'));
console.log('generateRichMatchNarrative:', findLine('export function generateRichMatchNarrative'));
console.log('recordChronicleMilestone:', findLine('export function recordChronicleMilestone'));
console.log('getOverallPower:', findLine('export function getOverallPower'));
console.log('getPhase2MatchOpponent:', findLine('export function getPhase2MatchOpponent'));
console.log('calculateDynamicGrowth:', findLine('export function calculateDynamicGrowth'));
console.log('evaluateBallonDor:', findLine('export function evaluateBallonDor'));
console.log('simulateSeasonRound:', findLine('export function simulateSeasonRound'));
console.log('simulateAcademyRound:', findLine('export function simulateAcademyRound'));
console.log('generateSeasonFixtures:', findLine('export function generateSeasonFixtures'));
console.log('getTransferWindowStatus:', findLine('export function getTransferWindowStatus'));
console.log('initSeasonScheduleAndTable:', findLine('export function initSeasonScheduleAndTable'));
console.log('simulateMatchdayRound:', findLine('export function simulateMatchdayRound'));
console.log('updateManagerTrustAndRole:', findLine('export function updateManagerTrustAndRole'));
console.log('checkSummerTournamentEligibility:', findLine('export function checkSummerTournamentEligibility'));
