import assert from 'assert';
import { createInitialPlayer } from '../js/state.js';
import { loadGame, saveGame, _migrate } from '../js/storage.js';
import { 
    calculateEarnedSkillPoints, 
    allocateSubStatPoint, 
    calculateDynamicGrowth,
    syncFaceStatsFromSubStats
} from '../js/playerEngine.js';

console.log('--- Testing Manual Skill Points Allocation System ---');

// Mock localStorage if in node environment
if (typeof localStorage === 'undefined') {
    global.localStorage = {
        store: {},
        getItem(key) { return this.store[key] || null; },
        setItem(key, value) { this.store[key] = String(value); },
        removeItem(key) { delete this.store[key]; },
        clear() { this.store = {}; }
    };
}

// 1. Test createInitialPlayer has skillPoints & totalSkillPointsEarned
const player = createInitialPlayer('Test Striker', 'ST');
assert.strictEqual(player.skillPoints, 0, 'New player starts with 0 SP');
assert.strictEqual(player.totalSkillPointsEarned, 0, 'New player starts with 0 total SP earned');
console.log('✓ createInitialPlayer fields validated.');

// 2. Test calculateEarnedSkillPoints rating tiers
assert.strictEqual(calculateEarnedSkillPoints({ rating: 5.5, goals: 0, assists: 0, cleanSheet: false }, player).totalSP, 0, 'Rating < 6.0 gives 0 SP');
assert.strictEqual(calculateEarnedSkillPoints({ rating: 6.5, goals: 0, assists: 0, cleanSheet: false }, player).totalSP, 1, 'Rating 6.0-6.9 gives 1 SP');
assert.strictEqual(calculateEarnedSkillPoints({ rating: 7.4, goals: 0, assists: 0, cleanSheet: false }, player).totalSP, 2, 'Rating 7.0-7.9 gives 2 SP');
assert.strictEqual(calculateEarnedSkillPoints({ rating: 8.5, goals: 0, assists: 0, cleanSheet: false }, player).totalSP, 3, 'Rating 8.0-8.9 gives 3 SP');
assert.strictEqual(calculateEarnedSkillPoints({ rating: 9.2, goals: 0, assists: 0, cleanSheet: false }, player).totalSP, 5, 'Rating 9.0-9.9 gives 5 SP');
assert.strictEqual(calculateEarnedSkillPoints({ rating: 10.0, goals: 0, assists: 0, cleanSheet: false }, player).totalSP, 8, 'Rating 10.0 gives 8 SP');
console.log('✓ Rating tier calculation validated.');

// 3. Test bonus milestones (goals, hattrick, assists, clean sheet)
// 1 goal = +1 SP (e.g. 7.5 rating -> 2 base + 1 goal = 3 SP)
assert.strictEqual(calculateEarnedSkillPoints({ rating: 7.5, goals: 1, assists: 0, cleanSheet: false }, player).totalSP, 3);
// 2 goals, 1 assist = 2 + 2 + 1 = 5 SP
assert.strictEqual(calculateEarnedSkillPoints({ rating: 7.5, goals: 2, assists: 1, cleanSheet: false }, player).totalSP, 5);
// Hat-trick (3 goals): 2 base + 3 goals + 1 bonus = 6 SP
const hattrickRes = calculateEarnedSkillPoints({ rating: 7.5, goals: 3, assists: 0, cleanSheet: false }, player);
assert.strictEqual(hattrickRes.totalSP, 6);
assert.strictEqual(hattrickRes.goalSP, 4, 'Hat-trick gives 4 SP from goals');

// Clean sheet for forward -> 0 extra bonus
assert.strictEqual(calculateEarnedSkillPoints({ rating: 7.5, goals: 0, assists: 0, cleanSheet: true }, player).totalSP, 2);
// Clean sheet for Defender/GK -> +2 bonus
const defender = createInitialPlayer('Test CB', 'VN', 'CB');
const defRes = calculateEarnedSkillPoints({ rating: 7.5, goals: 0, assists: 0, cleanSheet: true }, defender);
assert.strictEqual(defRes.totalSP, 4);
assert.strictEqual(defRes.cleanSheetSP, 2, 'Clean sheet bonus for defender is 2 SP');

const goalkeeper = createInitialPlayer('Test GK', 'VN', 'GK');
assert.strictEqual(calculateEarnedSkillPoints({ rating: 7.5, goals: 0, assists: 0, cleanSheet: true }, goalkeeper).totalSP, 4);
console.log('✓ Milestones and clean sheet bonuses validated.');

// 4. Test allocateSubStatPoint
player.skillPoints = 5;
const initialFinishing = player.subStats.finishing;
const initialSho = player.stats.sho;

const allocRes = allocateSubStatPoint(player, 'finishing', 1);
assert.strictEqual(allocRes.success, true, 'Allocation succeeds when SP available');
assert.strictEqual(player.skillPoints, 4, 'SP deducted by 1');
assert.strictEqual(player.subStats.finishing, initialFinishing + 1, 'Sub-stat increased by 1');
console.log('✓ Allocation deduction and sub-stat increment validated.');

// Test capping at 99
player.skillPoints = 10;
player.subStats.finishing = 99;
const capRes = allocateSubStatPoint(player, 'finishing', 1);
assert.strictEqual(capRes.success, false, 'Cannot allocate past 99');
assert(capRes.reason.includes('99'), 'Reason mentions 99 limit');
assert.strictEqual(player.skillPoints, 10, 'SP not deducted when max reached');

// Test insufficient SP
player.skillPoints = 0;
player.subStats.finishing = 90;
const noSpRes = allocateSubStatPoint(player, 'finishing', 1);
assert.strictEqual(noSpRes.success, false, 'Cannot allocate without SP');
assert(noSpRes.reason.includes('Điểm Tiềm Năng'), 'Reason mentions insufficient SP');

// 5. Test calculateDynamicGrowth awards SP and does NOT scatter random attributes
player.skillPoints = 0;
player.growthExp = 0;
player.growthExpTarget = 1000;
player.growthLevel = 1;
const matchResult = {
    rating: 8.5, // 3 SP
    goals: 1,    // +1 SP -> total 4 SP
    assists: 1,  // +1 SP -> total 5 SP
    cleanSheet: false
};

const growthReport = calculateDynamicGrowth(player, matchResult);
assert.strictEqual(player.skillPoints, 5, 'Player awarded 5 SP from match performance');
assert.strictEqual(player.totalSkillPointsEarned, 5, 'Player totalSkillPointsEarned tracked');
assert.strictEqual(growthReport.earnedSP, 5, 'Growth report includes earnedSP');

// Test Level Up bonus SP (+2)
player.growthExp = 950;
player.growthExpTarget = 1000;
const matchResultLvlUp = { rating: 8.0, goals: 0, assists: 0, cleanSheet: false }; // 3 SP + 2 level up SP = 5 SP
const growthReport2 = calculateDynamicGrowth(player, matchResultLvlUp);
assert.strictEqual(player.growthLevel, 2, 'Player leveled up to 2');
assert.strictEqual(growthReport2.levelUpBonusSP, 2, 'Level up bonus SP is 2');
// Previous 5 SP + 3 (match) + 2 (level up) = 10 SP
assert.strictEqual(player.skillPoints, 10, 'Player total skill points updated including level up bonus');

console.log('✓ calculateDynamicGrowth SP awarding and leveling validated.');

// 6. Test storage migration for legacy saves
const legacySave = {
    name: 'Old Save',
    position: 'ST',
    subStats: { ...player.subStats }
    // no skillPoints or totalSkillPointsEarned
};
_migrate(legacySave);
assert.strictEqual(legacySave.skillPoints, 10, 'Legacy save migrated with 10 bonus SP');
assert.strictEqual(legacySave.totalSkillPointsEarned, 10, 'Legacy save totalSkillPointsEarned initialized');
console.log('✓ Legacy storage migration (_migrate) validated with 10 bonus SP.');

// Test saveGame / loadGame roundtrip
player.skillPoints = 7;
saveGame(player, 1);
const loadedResult = loadGame(1);
assert(loadedResult && loadedResult.player, 'Save loaded successfully');
assert.strictEqual(loadedResult.player.skillPoints, 7, 'Loaded player retains skillPoints');
console.log('✓ Storage roundtrip (saveGame -> loadGame) validated.');

console.log('All tests passed successfully!');
