import fs from 'fs';

const content = fs.readFileSync('js/engine.js', 'utf8');
const lines = content.split('\n');

const header = `/**
 * SEASON ENGINE
 * Quản lý chuyển giao mùa giải (Season Transition), tăng tuổi, đôn lên Đội 1 (First Team),
 * trao giải thưởng cuối mùa (Golden Boy, Quả bóng vàng, Chiếc giày vàng),
 * tạo lịch thi đấu mới và quản lý giải đấu quốc tế mùa hè (Summer Tournament).
 */

import { ALL_CLUBS, LEAGUE_TEAMS_MAP, REAL_RIVAL_SCORERS, YOUTH_RIVAL_SCORERS, NATIONAL_TEAMS_DATA } from './data.js';
import { getOverallPower, addTrophy, clampStats } from './playerEngine.js';
import { calculateTransfermarktValue } from './transferEngine.js';
import { logCareerEvent, addCareerLog, recordChronicleMilestone, updateCompetitionTier } from './mediaEngine.js';
import { isSameClub, simulateAIFixture, initCupCompetition, resetAllCupCompetitions } from './cupEngine.js';
`;

const part1 = lines.slice(968, 1233).join('\n'); // getPhase2MatchOpponent, updateRivalStats
const part2 = lines.slice(1535, 1617).join('\n'); // evaluateBallonDor, evaluateAnnualAwards
const part3 = lines.slice(1639, 4084).join('\n'); // simulateSeasonRound to syncIndividualTrackersDOM
const part4 = lines.slice(4144, 4268).join('\n'); // initSeasonScheduleAndTable
const part5 = lines.slice(5061, 5297).join('\n'); // summer tournament functions

const fullSeasonCode = `${header}\n${part1}\n\n${part2}\n\n${part3}\n\n${part4}\n\n${part5}\n`;

fs.writeFileSync('js/seasonEngine.js', fullSeasonCode, 'utf8');
console.log('Successfully created js/seasonEngine.js with lines:', fullSeasonCode.split('\n').length);
