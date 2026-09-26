import { 
  generateRichMatchNarrative,
  generateMediaInteractionNarrative,
  generateSkillBreakthroughNarrative,
  getRandomAcademyLifeSnippet,
  logCareerEvent,
  addCareerLog,
  simulateMatchdayRound,
  initSeasonScheduleAndTable
} from '../js/engine.js';
import { createInitialPlayer } from '../js/state.js';

console.log('=== TEST 1: MATCH MILESTONES (NHÓM 1) ===');
const player = createInitialPlayer('Nguyễn Văn Trọng', 'VN', 'ST');
player.academy = { id: 'barca_academy', name: 'La Masia', country: 'Tây Ban Nha' };
player.isAcademyStage = true;

// 1.1 Rating >= 9.0 (Rực sáng / Masterclass)
const masterclassContext = {
  homeScore: 3,
  awayScore: 1,
  matchRating: 10.0,
  playerGoals: 2,
  playerAssists: 2,
  isPlayerWin: true,
  roundData: { competitionName: 'Giải Trẻ U19 Quốc Gia', stageName: 'Vòng 5' }
};
const log1 = generateRichMatchNarrative(player, masterclassContext);
console.log('Masterclass Log:', log1.body);
if (!log1.body.includes('Đêm kỳ ảo tại') && !log1.body.includes('Sân khấu đỉnh cao') && !log1.body.includes('Một buổi tối xuất thần') && !log1.body.includes('Cơn địa chấn') && !log1.body.includes('Kiệt tác bóng đá')) {
  throw new Error('Masterclass template did not match expected narrative!');
}

// 1.2 Clutch Winner (Ghi bàn quyết định phút cuối)
const clutchContext = {
  homeScore: 2,
  awayScore: 1,
  matchRating: 7.8,
  playerGoals: 1,
  playerAssists: 0,
  isPlayerWin: true,
  roundData: { competitionName: 'Cúp Quốc Gia Trẻ', stageName: 'Tứ Kết' },
  isKnockoutMatch: true
};
const log2 = generateRichMatchNarrative(player, clutchContext);
console.log('Clutch Winner Log:', log2.body);
if (!log2.body.includes('Khoảnh khắc vỡ òa') && !log2.body.includes('Trái tim người hâm mộ') && !log2.body.includes('Bản lĩnh của một sát thủ') && !log2.body.includes('Thời khắc lịch sử') && !log2.body.includes('Một kịch bản nghẹt thở')) {
  throw new Error('Clutch winner template did not match expected narrative!');
}

// 1.3 Poor performance / Thua trận
const poorContext = {
  homeScore: 0,
  awayScore: 2,
  matchRating: 5.5,
  playerGoals: 0,
  isPlayerWin: false,
  roundData: { competitionName: 'Giải Vô Địch Trẻ', stageName: 'Vòng 8' }
};
const log3 = generateRichMatchNarrative(player, poorContext);
console.log('Poor/Defeat Log:', log3.body);
if (!log3.body.includes('Một ngày thi đấu dưới sức') && !log3.body.includes('Cảm giác bất lực') && !log3.body.includes('Sân cỏ đỉnh cao không có chỗ') && !log3.body.includes('Cú sảy chân đắt giá') && !log3.body.includes('Trận đấu đáng quên')) {
  throw new Error('Poor performance template did not match expected narrative!');
}

// 1.4 Kiểm tra chống lặp lại nguyên văn (Anti-repetition test)
console.log('\n=== TEST ANTI-REPETITION (CHỐNG LẶP NGUYÊN VĂN) ===');
let lastText = '';
for (let i = 0; i < 6; i++) {
  const narrative = generateRichMatchNarrative(player, masterclassContext);
  console.log(`Match ${i + 1} Masterclass Log:`, narrative.body.slice(0, 60) + '...');
  if (lastText && lastText === narrative.body) {
    throw new Error(`Duplicate consecutive template detected on iteration ${i + 1}!`);
  }
  lastText = narrative.body;
}
console.log('✅ Anti-repetition test PASSED: Consecutive logs never repeat verbatim.');

console.log('\n=== TEST 2: MEDIA & DRESSING ROOM (NHÓM 2) ===');
const humbleMedia = generateMediaInteractionNarrative(player, 'HUMBLE', { matchTitle: 'El Clasico Trẻ' });
console.log('Humble Press Conference:', humbleMedia.body);
if (!humbleMedia.body.includes('rừng ống kính máy quay') && !humbleMedia.body.includes('tôn vinh nỗ lực của tập thể') && !humbleMedia.body.includes('Chiến thắng này thuộc về tất cả') && !humbleMedia.body.includes('mảnh ghép nhỏ')) {
  throw new Error('Humble media template did not match expected narrative!');
}

const starMedia = generateMediaInteractionNarrative(player, 'STAR', { matchTitle: 'Trận Cầu Đinh' });
console.log('Star Press Conference:', starMedia.body);
if (!starMedia.body.includes('Tuyên bố đanh thép') && !starMedia.body.includes('Tôi sinh ra để tỏa sáng') && !starMedia.body.includes('nụ cười ngạo nghễ') && !starMedia.body.includes('Tuyên bố không khoan nhượng')) {
  throw new Error('Star media template did not match expected narrative!');
}

console.log('\n=== TEST 3: SKILL BREAKTHROUGH & TRAINING (NHÓM 3) ===');
const finishGrowth = generateSkillBreakthroughNarrative(player, {
  stat: 'finishing',
  statName: 'Dứt điểm',
  currentValue: 57,
  delta: 1,
  isMilestone: true
});
console.log('Finishing Breakthrough:', finishGrowth.body);
if (!finishGrowth.body.includes('Dứt điểm chạm mốc 57') && !finishGrowth.body.includes('Dứt điểm vươn lên mốc 57')) {
  throw new Error('Finishing breakthrough narrative did not format correctly!');
}

const paceGrowth = generateSkillBreakthroughNarrative(player, {
  stat: 'pace',
  statName: 'Tốc độ',
  currentValue: 62,
  delta: 1
});
console.log('Pace Breakthrough:', paceGrowth.body);

const levelUp = generateSkillBreakthroughNarrative(player, {
  isLevelUp: true,
  growthLevel: 3
});
console.log('Level Up Breakthrough:', levelUp.body);

console.log('\n=== TEST 4: ACADEMY LIFE & ROOKIE PSYCHOLOGY (NHÓM 4) ===');
for (let i = 0; i < 4; i++) {
  const snippet = getRandomAcademyLifeSnippet(player);
  console.log(`Academy Snippet ${i + 1}:`, snippet);
  if (!snippet || snippet.length < 20) throw new Error('Invalid academy life snippet');
}

console.log('\n=== TEST 5: SIMULATE MATCHDAY ROUND INTEGRATION ===');
initSeasonScheduleAndTable(player);
const simResult = simulateMatchdayRound(player, false, {
  homeScore: 2,
  awayScore: 1,
  rating: 9.5,
  playerGoals: 2,
  playerAssists: 0
});

console.log('simResult.matchDesc:', simResult.matchDesc);
console.log('simResult.academyLifeSnippet:', simResult.academyLifeSnippet);
if (!simResult.matchDesc || simResult.matchDesc.startsWith('Trận cầu kết thúc với tỷ số')) {
  throw new Error('simulateMatchdayRound still returning old dry template!');
}

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY!');
