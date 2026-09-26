import assert from 'assert';
import { createInitialPlayer, MAX_STAT_LIMIT } from '../js/state.js';
import { loadGame, saveGame, _migrate } from '../js/storage.js';
import { 
    getStatUpgradeCost, 
    allocateSubStatPoint, 
    getSpecialTraitUpgradeCost, 
    upgradeSpecialTraitWithSP,
    SPECIAL_TRAIT_UPGRADE_COSTS,
    calculateOVR,
    syncFaceStatsFromSubStats
} from '../js/playerEngine.js';

console.log('=== TEST SUITE: LIMIT BREAKTHROUGH (>99) & TRAITS SP SYSTEM ===');

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

// -------------------------------------------------------------
// 1. Kiểm tra Bậc Thang Chi Phí SP (getStatUpgradeCost)
// -------------------------------------------------------------
console.log('\n--- 1. Testing SP Upgrade Cost Scaling ---');
assert.strictEqual(getStatUpgradeCost(50), 1, 'Cost <= 98 is 1 SP');
assert.strictEqual(getStatUpgradeCost(98), 1, 'Cost at 98 -> 99 is 1 SP');
assert.strictEqual(getStatUpgradeCost(99), 5, 'Cost at 99 -> 100 (Breakthrough) is 5 SP');
assert.strictEqual(getStatUpgradeCost(100), 7, 'Cost at 100 -> 101 is 7 SP');
assert.strictEqual(getStatUpgradeCost(101), 10, 'Cost at 101 -> 102 is 10 SP');
assert.strictEqual(getStatUpgradeCost(102), 14, 'Cost at 102 -> 103 is 14 SP');
assert.strictEqual(getStatUpgradeCost(103), 18, 'Cost at 103 -> 104 is 18 SP');
assert.strictEqual(getStatUpgradeCost(104), 24, 'Cost at 104 -> 105 is 24 SP');
assert.strictEqual(getStatUpgradeCost(105), 30, 'Cost at 105 -> 106 is 30 SP');
assert.strictEqual(getStatUpgradeCost(109), 30, 'Cost at 109 -> 110 is 30 SP');
assert.strictEqual(getStatUpgradeCost(110), Infinity, 'Cost at 110 (Max) is Infinity');
console.log('✓ SP Upgrade Cost Scaling validated for all tiers up to 110.');

// -------------------------------------------------------------
// 2. Kiểm tra Phân Bổ Điểm & Đột Phá Trần (allocateSubStatPoint)
// -------------------------------------------------------------
console.log('\n--- 2. Testing Limit Breakthrough Allocation ---');
const player = createInitialPlayer('Test Breakthrough', 'VN', 'ST');
player.skillPoints = 100;
player.subStats.finishing = 98;

// 98 -> 99: tốn 1 SP
let res = allocateSubStatPoint(player, 'finishing');
assert.strictEqual(res.success, true);
assert.strictEqual(player.subStats.finishing, 99);
assert.strictEqual(player.skillPoints, 99);
assert.strictEqual(res.cost, 1);
assert.strictEqual(res.isBreakthrough, false);

// 99 -> 100: Đột Phá Cảnh Giới! Tốn 5 SP
res = allocateSubStatPoint(player, 'finishing');
assert.strictEqual(res.success, true);
assert.strictEqual(player.subStats.finishing, 100);
assert.strictEqual(player.skillPoints, 94);
assert.strictEqual(res.cost, 5);
assert.strictEqual(res.isBreakthrough, true);

// 100 -> 101: Tốn 7 SP
res = allocateSubStatPoint(player, 'finishing');
assert.strictEqual(res.success, true);
assert.strictEqual(player.subStats.finishing, 101);
assert.strictEqual(player.skillPoints, 87);
assert.strictEqual(res.cost, 7);

// Thử khi không đủ SP
player.skillPoints = 5; // Cần 10 SP cho 101 -> 102
res = allocateSubStatPoint(player, 'finishing');
assert.strictEqual(res.success, false);
assert(res.reason.includes('không đủ Điểm Tiềm Năng'));
assert.strictEqual(player.subStats.finishing, 101); // Không tăng
assert.strictEqual(player.skillPoints, 5); // Không bị trừ

// Thử chạm trần tối thượng 110
player.skillPoints = 1000;
player.subStats.finishing = 110;
res = allocateSubStatPoint(player, 'finishing');
assert.strictEqual(res.success, false);
assert(res.reason.includes('tối đa'));
assert.strictEqual(player.subStats.finishing, 110);
assert.strictEqual(player.skillPoints, 1000);

console.log('✓ Limit Breakthrough allocation, costs and clamping validated.');

// -------------------------------------------------------------
// 3. Kiểm tra Đồng Bộ Face Stats & OVR khi vượt 99
// -------------------------------------------------------------
console.log('\n--- 3. Testing Face Stats & OVR synchronization > 99 ---');
// Tăng toàn bộ subStats của shooting lên 105
player.subStats.positioning = 105;
player.subStats.finishing = 105;
player.subStats.shotPower = 105;
player.subStats.longShots = 105;
player.subStats.volleys = 105;
player.subStats.penalties = 105;
syncFaceStatsFromSubStats(player);

assert.strictEqual(player.stats.sho, 105, 'Face stat SHO synchronized to 105');
assert.strictEqual(player.statSho, 105, 'statSho synchronized to 105');
const ovr = calculateOVR(player);
assert(ovr > 55, 'OVR successfully calculated without NaN');
console.log(`✓ Face stat SHO is ${player.stats.sho}, OVR calculated: ${ovr}.`);

// -------------------------------------------------------------
// 4. Kiểm tra Khởi Tạo & Ràng Buộc Kèo Chân & Sao Kỹ Thuật
// -------------------------------------------------------------
console.log('\n--- 4. Testing Preferred Foot, Weak Foot & Skill Moves Constraints ---');
const pDefault = createInitialPlayer('ST Player', 'VN', 'ST');
assert(pDefault.preferredFootStars >= 3 && pDefault.preferredFootStars <= 5, 'preferredFootStars in range 3-5');
assert(pDefault.weakFoot <= pDefault.preferredFootStars, 'Initial weakFoot <= preferredFootStars');
assert.strictEqual(pDefault.preferredFootSide, 'Right', 'preferredFootSide is Right');
assert.strictEqual(pDefault.preferredFoot, 'Right', 'preferredFoot alias is Right');

const pGK = createInitialPlayer('GK Player', 'VN', 'GK');
assert.strictEqual(pGK.preferredFootStars, 3, 'GK preferredFootStars is 3');
assert.strictEqual(pGK.weakFoot, 2, 'GK weakFoot is 2');
assert.strictEqual(pGK.skillMoves, 1, 'GK skillMoves is 1');
assert(pGK.weakFoot <= pGK.preferredFootStars, 'GK weakFoot <= preferredFootStars');

const pDF = createInitialPlayer('DF Player', 'VN', 'CB');
assert.strictEqual(pDF.preferredFootStars, 3, 'CB preferredFootStars is 3');
assert.strictEqual(pDF.weakFoot, 3, 'CB weakFoot is 3');
assert.strictEqual(pDF.skillMoves, 2, 'CB skillMoves is 2');
assert(pDF.weakFoot <= pDF.preferredFootStars, 'CB weakFoot <= preferredFootStars');
console.log('✓ Initial traits and position-based defaults validated.');

// -------------------------------------------------------------
// 5. Kiểm tra Nâng Cấp Kỹ Năng Bằng SP (upgradeSpecialTraitWithSP)
// -------------------------------------------------------------
console.log('\n--- 5. Testing upgradeSpecialTraitWithSP ---');
const pTrait = createInitialPlayer('Trait Tester', 'VN', 'ST');
pTrait.skillPoints = 150;
pTrait.preferredFootStars = 3;
pTrait.weakFoot = 3;
pTrait.skillMoves = 3;

// Test 5.1: Không cho phép nâng Chân Nghịch khi weakFoot == preferredFootStars (3 == 3)
let traitRes = upgradeSpecialTraitWithSP(pTrait, 'weakFoot');
assert.strictEqual(traitRes.success, false, 'Cannot upgrade weakFoot when equal to preferredFootStars');
assert(traitRes.reason.includes('Chân Thuận'), 'Reason states preferred foot must be upgraded first');

// Test 5.2: Nâng Chân Thuận 3⭐ -> 4⭐ (tốn 15 SP)
traitRes = upgradeSpecialTraitWithSP(pTrait, 'preferredFootStars');
assert.strictEqual(traitRes.success, true, 'Upgrade preferredFootStars 3 -> 4 succeeds');
assert.strictEqual(pTrait.preferredFootStars, 4);
assert.strictEqual(traitRes.cost, 15);
assert.strictEqual(pTrait.skillPoints, 135);

// Test 5.3: Giờ đã nâng Chân Thuận lên 4⭐, có thể nâng Chân Nghịch 3⭐ -> 4⭐ (tốn 20 SP)
traitRes = upgradeSpecialTraitWithSP(pTrait, 'weakFoot');
assert.strictEqual(traitRes.success, true, 'Upgrade weakFoot 3 -> 4 succeeds');
assert.strictEqual(pTrait.weakFoot, 4);
assert.strictEqual(traitRes.cost, 20);
assert.strictEqual(pTrait.skillPoints, 115);

// Test 5.4: Nâng Chân Thuận 4⭐ -> 5⭐ (tốn 25 SP)
traitRes = upgradeSpecialTraitWithSP(pTrait, 'preferredFootStars');
assert.strictEqual(traitRes.success, true);
assert.strictEqual(pTrait.preferredFootStars, 5);
assert.strictEqual(traitRes.cost, 25);
assert.strictEqual(pTrait.skillPoints, 90);

// Nâng Chân Thuận khi đã 5⭐ -> Từ chối
traitRes = upgradeSpecialTraitWithSP(pTrait, 'preferredFootStars');
assert.strictEqual(traitRes.success, false);
assert(traitRes.reason.includes('tối đa 5⭐'));

// Test 5.5: Nâng Chân Nghịch 4⭐ -> 5⭐ (tốn 35 SP, kích hoạt Hai Chân Như Một)
traitRes = upgradeSpecialTraitWithSP(pTrait, 'weakFoot');
assert.strictEqual(traitRes.success, true);
assert.strictEqual(pTrait.weakFoot, 5);
assert.strictEqual(traitRes.cost, 35);
assert.strictEqual(pTrait.skillPoints, 55);
assert.strictEqual(pTrait.twoFootedMaster, true);
assert(traitRes.title.includes('Hai Chân Như Một'));

// Test 5.6: Nâng Kỹ Thuật Skill Moves:
// 3 -> 4: tốn 15 SP
traitRes = upgradeSpecialTraitWithSP(pTrait, 'skillMoves');
assert.strictEqual(traitRes.success, true);
assert.strictEqual(pTrait.skillMoves, 4);
assert.strictEqual(traitRes.cost, 15);
assert.strictEqual(pTrait.skillPoints, 40);

// 4 -> 5: tốn 25 SP
traitRes = upgradeSpecialTraitWithSP(pTrait, 'skillMoves');
assert.strictEqual(traitRes.success, true);
assert.strictEqual(pTrait.skillMoves, 5);
assert.strictEqual(traitRes.cost, 25);
assert.strictEqual(pTrait.skillPoints, 15);

// 5 -> 6: cần 50 SP nhưng chỉ còn 15 SP -> Từ chối
traitRes = upgradeSpecialTraitWithSP(pTrait, 'skillMoves');
assert.strictEqual(traitRes.success, false);
assert(traitRes.reason.includes('Bạn cần 50 Điểm Tiềm Năng'));

// Nạp thêm SP và nâng lên 6⭐ Trickster+ Master (tốn 50 SP)
pTrait.skillPoints += 50;
traitRes = upgradeSpecialTraitWithSP(pTrait, 'skillMoves');
assert.strictEqual(traitRes.success, true);
assert.strictEqual(pTrait.skillMoves, 6);
assert.strictEqual(traitRes.cost, 50);
assert.strictEqual(pTrait.tricksterMaster, true);
assert(traitRes.title.includes('Trickster+'));

// Đã 6⭐ -> Từ chối nâng thêm
traitRes = upgradeSpecialTraitWithSP(pTrait, 'skillMoves');
assert.strictEqual(traitRes.success, false);
assert(traitRes.reason.includes('tối thượng 6⭐'));

console.log('✓ Trait upgrades via SP with constraints and titles validated 100%.');

// -------------------------------------------------------------
// 6. Kiểm tra Tương Thích Ngược & Di Trú Bản Lưu Cũ (_migrate)
// -------------------------------------------------------------
console.log('\n--- 6. Testing Storage Migration ---');
const legacySave = {
    name: 'Old Star',
    position: 'ST',
    preferredFoot: 'Right',
    weakFoot: 5, // Cũ để 5 mà chưa có preferredFootStars
    ovr: 80
};

_migrate(legacySave);
assert.strictEqual(legacySave.preferredFootSide, 'Right');
assert.strictEqual(legacySave.preferredFoot, 'Right');
assert.strictEqual(legacySave.preferredFootStars, 4, 'OVR < 85 gets 4⭐ preferredFootStars');
assert.strictEqual(legacySave.weakFoot, 4, 'weakFoot clamped to preferredFootStars (4⭐)');
assert.strictEqual(legacySave.skillMoves, 3, 'skillMoves default backfilled to 3⭐');

console.log('✓ Storage migration cleanly backfilled and clamped traits.');

console.log('\n======================================================');
console.log('🎉 ALL LIMIT BREAKTHROUGH & TRAITS TESTS PASSED 100%!');
console.log('======================================================');
