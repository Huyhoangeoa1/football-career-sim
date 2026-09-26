import { 
  calculateBallonDorScore, 
  evaluateBallonDor, 
  initBallonDorRankings, 
  advanceBallonDorRound, 
  updateBallonDorRankings 
} from '../js/seasonEngine.js';
import { addTrophy } from '../js/playerEngine.js';

console.log("=== BẮT ĐẦU TEST LOGIC QUẢ BÓNG VÀNG (BALLON D'OR) ===");

// TEST 1: FW Bùng Nổ vs Siêu Sao AI
const fwScore = calculateBallonDorScore({
  line: 'FW',
  avgRating: 8.8,
  goals: 65,
  assists: 18,
  teamWins: 32,
  trophies: ['UEFA Champions League', 'Vô địch Premier League'],
  fame: 800
});

const mbappeScore = calculateBallonDorScore({
  line: 'FW',
  avgRating: 8.1,
  goals: 32,
  assists: 10,
  teamWins: 26,
  trophies: ['Vô địch La Liga'],
  fame: 800
});

console.log(`Test 1 - Điểm Cầu thủ ghi 65 bàn: ${fwScore} pts`);
console.log(`Test 1 - Điểm Mbappé ghi 32 bàn: ${mbappeScore} pts`);
if (fwScore <= mbappeScore) {
  throw new Error("LỖI: Cầu thủ 65 bàn phải vượt trội điểm số so với Mbappé!");
}
console.log("=> TEST 1 THÀNH CÔNG: Cầu thủ ghi bàn vượt trội hoàn toàn áp đảo AI!");

// TEST 2: GK Xuất Sắc (Sạch Lưới + Cứu Thua + Cúp)
const gkScore = calculateBallonDorScore({
  line: 'GK',
  avgRating: 8.3,
  cleanSheets: 22,
  saves: 85,
  teamWins: 30,
  trophies: ['UEFA Champions League', 'Vô địch Ngoại Hạng Anh'],
  fame: 600
});
console.log(`Test 2 - Điểm Thủ Môn vô địch C1 (22 trận sạch lưới, 85 cứu thua): ${gkScore} pts`);
if (gkScore < 160) {
  throw new Error("LỖI: Thủ môn đỉnh cao phải đạt trên 160 điểm!");
}
console.log("=> TEST 2 THÀNH CÔNG: Thủ môn có trọng số tính điểm công bằng!");

// TEST 3: Cầu thủ 17 tuổi vừa lên đội 1 thi đấu bùng nổ
const youngPlayer = {
  name: "Hoàng Sơn",
  age: 17,
  isAcademyStage: false,
  position: "ST",
  avgRating: 8.7,
  seasonRatingsSum: 348,
  seasonRatingsCount: 40,
  fame: 700,
  club: { name: "Manchester City", power: 92 },
  currentClub: { name: "Manchester City", power: 92 },
  currentSeasonStats: {
    matches: 42,
    goals: 58,
    assists: 16,
    cleanSheets: 0,
    saves: 0,
    tackles: 0
  },
  leagueTable: [
    { name: "Manchester City", won: 30, points: 94, isPlayerClub: true },
    { name: "Arsenal", won: 24, points: 78 }
  ],
  tournamentBrackets: {
    domesticCup: { winner: { name: "Manchester City" } },
    continentalCup: { winner: { name: "Manchester City" } }
  },
  trophies: [],
  trophiesTally: {},
  trophiesTotal: 0
};

initBallonDorRankings(youngPlayer);
const wonTrophies = ["Premier League", "FA Cup", "UEFA Champions League"];

const evalResult = evaluateBallonDor(youngPlayer, wonTrophies, 58, 16, 0, 0, false);
console.log("Test 3 - Kết quả bình chọn Quả Bóng Vàng:", evalResult);
console.log("Thứ hạng:", evalResult.rankNumber);
console.log("Cúp trong tủ cúp:", youngPlayer.trophies);
console.log("Tally:", youngPlayer.trophiesTally);
console.log("Số lần đoạt QBV:", youngPlayer.ballonDorWins);

if (!evalResult.won || evalResult.rankNumber !== 1) {
  throw new Error(`LỖI: Cầu thủ 17 tuổi có thành tích 58 bàn + cú ăn 3 phải đoạt QBV số 1! Thứ hạng nhận được: ${evalResult.rankNumber}`);
}

if (youngPlayer.ballonDorWins !== 1) {
  throw new Error("LỖI: youngPlayer.ballonDorWins phải bằng 1!");
}

if (!youngPlayer.trophiesTally["Quả Bóng Vàng (Ballon d'Or)"]) {
  throw new Error("LỖI: trophiesTally phải có Quả Bóng Vàng!");
}

console.log("=> TEST 3 THÀNH CÔNG: Cầu thủ 17 tuổi đoạt Quả Bóng Vàng và cúp được lưu chuẩn vào state!");

console.log("=== TẤT CẢ CÁC BÀI TEST ĐÃ VƯỢT QUA XUẤT SẮC! ===");
