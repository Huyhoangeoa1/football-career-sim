import fs from 'fs';

const content = fs.readFileSync('js/engine.js', 'utf8');
const lines = content.split('\n');

const header = `/**
 * PLAYER ENGINE
 * Quản lý chỉ số cầu thủ, OVR, thể lực, chấn thương, hợp đồng,
 * tăng trưởng động (dynamic growth), tác động sau trận và GOAT score.
 */

import { POSITION_CONFIG, LIFESTYLE_CATALOG } from './data.js';
`;

const part1 = lines.slice(82, 224).join('\n');
const part2 = lines.slice(858, 879).join('\n');
const part3 = lines.slice(917, 968).join('\n');
const part4 = lines.slice(1233, 1535).join('\n');
const part5 = lines.slice(1617, 1639).join('\n');
const part6 = lines.slice(5013, 5061).join('\n');

const fullPlayerCode = `${header}\n${part1}\n\n${part2}\n\n${part3}\n\n${part4}\n\n${part5}\n\n${part6}\n`;

fs.writeFileSync('js/playerEngine.js', fullPlayerCode, 'utf8');
console.log('Successfully created js/playerEngine.js with lines:', fullPlayerCode.split('\n').length);
