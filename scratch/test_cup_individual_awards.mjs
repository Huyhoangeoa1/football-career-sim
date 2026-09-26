import assert from 'node:assert';
import { createInitialPlayer } from '../js/state.js';
import { addTrophy } from '../js/playerEngine.js';
import { 
  ensureCupTrackersStructure, 
  initCupIndividualTrackers, 
  recordCupMatchContributions, 
  getCupTournamentNames, 
  evaluateAndAwardCupAwards 
} from '../js/cupEngine.js';
import { 
  simulateAcademyRound, 
  simulateSeasonRound,
  advanceSummerTournamentMatch,
  initSummerTournament
} from '../js/seasonEngine.js';

console.log("=== BẮT ĐẦU KIỂM TRA HỆ THỐNG DANH HIỆU CÁ NHÂN CÚP ===");

// 1. KIỂM TRA INITIAL STATE & STATS TRACKING
const p1 = createInitialPlayer();
assert.ok(p1.cupStats, "player.cupStats phải được khởi tạo");
assert.strictEqual(typeof p1.cupStats.domesticCup, 'object');
assert.strictEqual(typeof p1.cupStats.continentalCup, 'object');
assert.strictEqual(typeof p1.cupStats.summerTournament, 'object');
console.log("✓ Initial player.cupStats tồn tại và đúng cấu trúc");

// 2. KIỂM TRA RECORD CUP MATCH CONTRIBUTIONS
ensureCupTrackersStructure(p1);
initCupIndividualTrackers(p1, 'all');

recordCupMatchContributions(p1, 'domestic', {}, { goals: 2, assists: 1 });
assert.strictEqual(p1.cupStats.domesticCup.goals, 2, "Goals trong cupStats.domesticCup phải bằng 2");
assert.strictEqual(p1.cupStats.domesticCup.assists, 1, "Assists trong cupStats.domesticCup phải bằng 1");
assert.strictEqual(p1.cupStats.domesticCup.matches, 1, "Matches trong cupStats.domesticCup phải bằng 1");

const pDomScorer = p1.cupTrackers.domestic.scorers.find(s => s.isPlayer);
assert.strictEqual(pDomScorer.goals, 2, "player.cupTrackers.domestic scorer goals phải bằng 2");

recordCupMatchContributions(p1, 'continental', {}, { goals: 3, assists: 2 });
assert.strictEqual(p1.cupStats.continentalCup.goals, 3, "Goals trong cupStats.continentalCup phải bằng 3");
assert.strictEqual(p1.cupStats.continentalCup.assists, 2, "Assists trong cupStats.continentalCup phải bằng 2");
console.log("✓ recordCupMatchContributions cập nhật chính xác độc lập từng Cúp");

// 3. KIỂM TRA GET CUP TOURNAMENT NAMES
const youthDomNames = getCupTournamentNames(p1, 'domestic');
assert.strictEqual(youthDomNames.cupName, "Cúp Trẻ Quốc Gia U19");
assert.strictEqual(youthDomNames.topScorerTitle, "Vua Phá Lưới Cúp Trẻ Quốc Gia U19");
assert.strictEqual(youthDomNames.topPlaymakerTitle, "Vua Kiến Tạo Cúp Trẻ Quốc Gia U19");

const youthContNames = getCupTournamentNames(p1, 'continental');
assert.strictEqual(youthContNames.cupName, "UEFA Youth League");
assert.strictEqual(youthContNames.topScorerTitle, "Vua Phá Lưới UEFA Youth League");
assert.strictEqual(youthContNames.topPlaymakerTitle, "Vua Kiến Tạo UEFA Youth League");

// Chuyển sang Pro Premier League
const pPro = createInitialPlayer();
pPro.isAcademyStage = false;
pPro.isPro = true;
pPro.age = 18;
pPro.currentClub = {
  name: "Manchester City",
  league: {
    id: "PREMIER_LEAGUE",
    name: "Premier League",
    domesticCup: "FA Cup",
    continentalC1: "UEFA Champions League",
    continentalC2: "UEFA Europa League"
  }
};
pPro.currentEuroStatus = "C1";

const proDomNames = getCupTournamentNames(pPro, 'domestic');
assert.strictEqual(proDomNames.cupName, "FA Cup");
assert.strictEqual(proDomNames.topScorerTitle, "Vua Phá Lưới FA Cup");
assert.strictEqual(proDomNames.topPlaymakerTitle, "Vua Kiến Tạo FA Cup");

const proUclNames = getCupTournamentNames(pPro, 'continental');
assert.strictEqual(proUclNames.cupName, "UEFA Champions League");
assert.strictEqual(proUclNames.topScorerTitle, "Vua Phá Lưới UEFA Champions League");
assert.strictEqual(proUclNames.topPlaymakerTitle, "Vua Kiến Tạo UEFA Champions League");
console.log("✓ getCupTournamentNames chuẩn hóa tên cúp cho giải Trẻ, FA Cup & UCL");

// 4. KIỂM TRA CHẤM & TRAO GIẢI VUA PHÁ LƯỚI & VUA KIẾN TẠO CÚP (EVALUATE AND AWARD)
initCupIndividualTrackers(pPro, 'all');

// Giả lập cầu thủ ghi 12 bàn, 7 kiến tạo tại UCL (vượt AI)
recordCupMatchContributions(pPro, 'continental', {}, { goals: 12, assists: 7 });

const bracketMock = {
  name: "UEFA Champions League",
  final: { winner: pPro.currentClub }
};

const trophiesWonList = [];
const awardsResult = evaluateAndAwardCupAwards(pPro, 'continental', { bracket: bracketMock, seasonTrophiesWonList: trophiesWonList });

assert.strictEqual(awardsResult.continental.wonScorer, true, "Cầu thủ phải thắng Vua Phá Lưới UCL");
assert.strictEqual(awardsResult.continental.wonPlaymaker, true, "Cầu thủ phải thắng Vua Kiến Tạo UCL");

assert.ok(pPro.trophies.includes("Vua Phá Lưới UEFA Champions League"), "Danh hiệu Vua Phá Lưới UCL phải có trong player.trophies");
assert.ok(pPro.trophies.includes("Vua Kiến Tạo UEFA Champions League"), "Danh hiệu Vua Kiến Tạo UCL phải có trong player.trophies");
assert.strictEqual(pPro.trophiesTally["Vua Phá Lưới UEFA Champions League"], 1, "Tally Vua Phá Lưới UCL = 1");
assert.strictEqual(pPro.trophiesTally["Vua Kiến Tạo UEFA Champions League"], 1, "Tally Vua Kiến Tạo UCL = 1");
assert.ok(pPro.trophiesTotal >= 2, "trophiesTotal phải tăng ít nhất 2");
assert.ok(bracketMock.awards.topScorer.isPlayer, "bracket.awards.topScorer phải đánh dấu isPlayer");
assert.ok(bracketMock.awards.topPlaymaker.isPlayer, "bracket.awards.topPlaymaker phải đánh dấu isPlayer");
console.log("✓ evaluateAndAwardCupAwards trao giải, ghi nhận cúp và cập nhật bracket thành công");

// 5. KIỂM TRA VCK MÙA HÈ (SUMMER TOURNAMENT)
const pSummer = createInitialPlayer();
pSummer.isAcademyStage = false;
pSummer.isPro = true;
pSummer.age = 22;
pSummer.year = 2026; // Năm World Cup
pSummer.nationality = { name: "Việt Nam", code: "VIE", flag: "🇻🇳", power: 85 };

const tourney = initSummerTournament(pSummer);
if (tourney) {
  // Mô phỏng 1 trận xuất thần ghi 5 bàn, 4 kiến tạo
  const simRes = advanceSummerTournamentMatch(pSummer, false, { homeScore: 5, awayScore: 1, playerGoals: 5, playerAssists: 4, rating: 10 });
  assert.strictEqual(pSummer.cupStats.summerTournament.goals, 5, "cupStats.summerTournament ghi nhận 5 bàn");
  assert.strictEqual(pSummer.cupStats.summerTournament.assists, 4, "cupStats.summerTournament ghi nhận 4 kiến tạo");
  console.log("✓ VCK Mùa Hè theo dõi độc lập cupStats.summerTournament thành công");
}

console.log("=== TẤT CẢ CÁC KIỂM TRA ĐỀU THÀNH CÔNG RỰC RỠ 100%! ===");
