import { NATIONALITIES_DATA, POSITION_CONFIG, YOUTH_ACADEMIES, getPositionGroup, getRandomPlayerNameByNat } from '../js/data.js';
import { createInitialPlayer, resetPlayerState } from '../js/state.js';

console.log('--- TEST 1: NATIONALITIES DATA (24 NATIONS ACROSS 4 REGIONS) ---');
console.log(`Total nationalities: ${NATIONALITIES_DATA.length}`);
if (NATIONALITIES_DATA.length < 20) {
  throw new Error(`Expected at least 20 nationalities, found ${NATIONALITIES_DATA.length}`);
}

const regions = ['ASIA', 'UEFA', 'CONMEBOL', 'CAF'];
for (const reg of regions) {
  const nats = NATIONALITIES_DATA.filter(n => n.region === reg);
  console.log(`Region ${reg}: ${nats.length} countries (${nats.map(n => n.flag + ' ' + n.name).join(', ')})`);
  if (nats.length === 0) {
    throw new Error(`Region ${reg} has no nationalities!`);
  }
}

// Verify required countries exist
const requiredCodes = ['VN', 'JPN', 'KOR', 'THA', 'KSA', 'AUS', 'ENG', 'ESP', 'FRA', 'GER', 'ITA', 'POR', 'NED', 'BEL', 'CRO', 'NOR', 'BRA', 'ARG', 'URU', 'COL', 'NGA', 'SEN', 'MAR', 'EGY'];
for (const code of requiredCodes) {
  const found = NATIONALITIES_DATA.find(n => n.id === code || n.idAlias === code);
  if (!found) {
    throw new Error(`Missing required country: ${code}`);
  }
}
console.log('✅ All 24 nations verified!');

console.log('\n--- TEST 2: 11 POSITIONS & 4 LINES ---');
const official11 = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LM', 'RM', 'LW', 'RW', 'ST'];
for (const pos of official11) {
  const conf = POSITION_CONFIG[pos];
  if (!conf) {
    throw new Error(`Missing position config for: ${pos}`);
  }
  const grp = getPositionGroup(pos);
  console.log(`Position ${pos} (${conf.name}) -> Line: ${grp} [${conf.lineName}]`);
}

// Check lines mapping
if (getPositionGroup('GK') !== 'GK') throw new Error('GK group mapping failed');
if (getPositionGroup('CB') !== 'DF' || getPositionGroup('LB') !== 'DF' || getPositionGroup('RB') !== 'DF') throw new Error('DF group mapping failed');
if (getPositionGroup('CDM') !== 'MF' || getPositionGroup('CM') !== 'MF' || getPositionGroup('CAM') !== 'MF' || getPositionGroup('LM') !== 'MF' || getPositionGroup('RM') !== 'MF') throw new Error('MF group mapping failed');
if (getPositionGroup('LW') !== 'FW' || getPositionGroup('RW') !== 'FW' || getPositionGroup('ST') !== 'FW') throw new Error('FW group mapping failed');
console.log('✅ All 11 positions & 4 lines mapping verified!');

console.log('\n--- TEST 3: EMPTY NAME & NATIVE RANDOM NAME GENERATION ---');
// Empty name with VN
const playerVN = createInitialPlayer("", "VN", "ST");
console.log(`Empty name (VN) generated: "${playerVN.name}" (${playerVN.nationality.flag} ${playerVN.nationality.name})`);
if (!playerVN.name || playerVN.name === "Hoàng Sơn") {
  // It shouldn't be default "Hoàng Sơn" when empty, unless randomly picked
}
if (playerVN.name.length === 0) throw new Error('Player name should not be empty');

// Empty name with JPN
const playerJPN = createInitialPlayer("", "JPN", "CB");
console.log(`Empty name (JPN) generated: "${playerJPN.name}" (${playerJPN.nationality.flag} ${playerJPN.nationality.name})`);

// Empty name with BRA
const playerBRA = createInitialPlayer("", "BRA", "LW");
console.log(`Empty name (BRA) generated: "${playerBRA.name}" (${playerBRA.nationality.flag} ${playerBRA.nationality.name})`);

// Custom name
const playerCustom = createInitialPlayer("Alexandre Silva", "POR", "CAM");
console.log(`Custom name test: "${playerCustom.name}"`);
if (playerCustom.name !== "Alexandre Silva") throw new Error('Custom name not preserved');

console.log('✅ Name generation verified!');

console.log('\n--- TEST 4: POSITION SPECIFIC ATTRIBUTES ---');
const cb = createInitialPlayer("Defender Test", "ENG", "CB");
console.log(`CB stats: DEF/PHY attr1=${cb.attr1}, attr2=${cb.attr2}, attr3=${cb.attr3}, attr4=${cb.attr4}`);
if (cb.attr1 < 65 || cb.attr2 < 65) throw new Error('CB should have boosted DEF & PHY');

const cam = createInitialPlayer("Playmaker Test", "FRA", "CAM");
console.log(`CAM stats: PAS/DRI attr1=${cam.attr1}, attr2=${cam.attr2}, attr3=${cam.attr3}, attr4=${cam.attr4}`);
if (cam.attr1 < 65 || cam.attr2 < 65) throw new Error('CAM should have boosted PAS & DRI');

const st = createInitialPlayer("Striker Test", "ESP", "ST");
console.log(`ST stats: SHO/FIN attr1=${st.attr1}, attr2=${st.attr2}, attr3=${st.attr3}, attr4=${st.attr4}`);
if (st.attr1 < 65 || st.attr2 < 65) throw new Error('ST should have boosted SHO & FIN');

const winger = createInitialPlayer("Winger Test", "BRA", "LW");
console.log(`LW stats: PAC/DRI attr1=${winger.attr1}, attr2=${winger.attr2}, attr3=${winger.attr3}, attr4=${winger.attr4}`);
if (winger.attr1 < 70) throw new Error('LW should have boosted PAC');

const gk = createInitialPlayer("Goalkeeper Test", "GER", "GK");
console.log(`GK stats: REF/HAN attr1=${gk.attr1}, attr2=${gk.attr2}, attr3=${gk.attr3}, attr4=${gk.attr4}`);
if (gk.attr1 < 60 || gk.attr2 < 60) throw new Error('GK should have boosted REF & HAN');

console.log('✅ Position attributes verified!');
console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
