import { calculateTournamentMvpScore, getCupTournamentNames, evaluateAndAwardCupAwards } from '../js/cupEngine.js';
import { addTrophy } from '../js/playerEngine.js';

console.log("=== BẮT ĐẦU TEST HỆ THỐNG GIẢI THƯỞNG MVP ĐA VỊ TRÍ ===");

// 1. Test tính điểm MVP cho cả 4 vị trí FW, MF, DF, GK trong League
console.log("\n--- 1. Kiểm tra độ công bằng đa vị trí tại League ---");
const fwLeagueStats = { matches: 36, goals: 28, assists: 9, avgRating: 7.9 };
const mfLeagueStats = { matches: 36, goals: 12, assists: 16, tackles: 65, avgRating: 7.9 };
const dfLeagueStats = { matches: 36, goals: 3, assists: 5, cleanSheets: 18, tackles: 85, avgRating: 7.9 };
const gkLeagueStats = { matches: 36, cleanSheets: 19, saves: 95, penaltySaves: 2, avgRating: 7.8 };

const fwScore = calculateTournamentMvpScore(fwLeagueStats, 'FW', true, false, { isLeague: true });
const mfScore = calculateTournamentMvpScore(mfLeagueStats, 'MF', true, false, { isLeague: true });
const dfScore = calculateTournamentMvpScore(dfLeagueStats, 'DF', true, false, { isLeague: true });
const gkScore = calculateTournamentMvpScore(gkLeagueStats, 'GK', true, false, { isLeague: true });

console.log(`FW MVP Score: ${fwScore}`);
console.log(`MF MVP Score: ${mfScore}`);
console.log(`DF MVP Score: ${dfScore}`);
console.log(`GK MVP Score: ${gkScore}`);

if (fwScore > 130 && mfScore > 130 && dfScore > 130 && gkScore > 130) {
  console.log("✅ Cả 4 vị trí đều đạt điểm cạnh tranh xuất sắc (> 130 điểm tại League)!");
} else {
  console.error("❌ Điểm số bị lệch!");
}

// 2. Test tính điểm MVP cho giải Cúp ngắn ngày
console.log("\n--- 2. Kiểm tra tính điểm MVP cho giải Cúp ngắn ngày ---");
const fwCupStats = { matches: 6, goals: 7, assists: 2, avgRating: 7.8 };
const mfCupStats = { matches: 6, goals: 3, assists: 5, tackles: 18, avgRating: 7.8 };
const dfCupStats = { matches: 6, cleanSheets: 4, tackles: 22, goals: 1, assists: 1, avgRating: 7.8 };
const gkCupStats = { matches: 6, cleanSheets: 4, saves: 25, penaltySaves: 1, avgRating: 7.8 };

const fwCupScore = calculateTournamentMvpScore(fwCupStats, 'ST', true, false, { isCup: true });
const mfCupScore = calculateTournamentMvpScore(mfCupStats, 'CAM', true, false, { isCup: true });
const dfCupScore = calculateTournamentMvpScore(dfCupStats, 'CB', true, false, { isCup: true });
const gkCupScore = calculateTournamentMvpScore(gkCupStats, 'GK', true, false, { isCup: true });

console.log(`FW Cup Score: ${fwCupScore}`);
console.log(`MF Cup Score: ${mfCupScore}`);
console.log(`DF Cup Score: ${dfCupScore}`);
console.log(`GK Cup Score: ${gkCupScore}`);

if (fwCupScore >= 95 && mfCupScore >= 95 && dfCupScore >= 95 && gkCupScore >= 95) {
  console.log("✅ Tất cả các vị trí đều vượt ngưỡng benchmark cúp (>= 90 điểm) khi thi đấu xuất sắc!");
} else {
  console.error("❌ Điểm số cúp chưa chuẩn!");
}

// 3. Test getCupTournamentNames
console.log("\n--- 3. Kiểm tra cấu hình getCupTournamentNames ---");
const mockPlayerPro = {
  isPro: true,
  age: 18,
  currentEuroStatus: "C1",
  currentClub: {
    name: "Real Madrid",
    league: {
      name: "La Liga",
      domesticCup: "Copa del Rey",
      continentalC1: "UEFA Champions League"
    }
  }
};

const domNames = getCupTournamentNames(mockPlayerPro, 'domestic');
const euroNames = getCupTournamentNames(mockPlayerPro, 'continental');

console.log("Domestic Cup Config:", domNames);
console.log("UCL Config:", euroNames);

if (domNames.mvpTitle.includes("Copa del Rey") && euroNames.mvpTitle.includes("UEFA Champions League")) {
  console.log("✅ Tên danh hiệu MVP chuẩn hóa chính xác!");
} else {
  console.error("❌ Tên danh hiệu chưa đúng!");
}

// 4. Test evaluateAndAwardCupAwards
console.log("\n--- 4. Kiểm tra evaluateAndAwardCupAwards ---");
const testPlayer = {
  name: "Nguyen Hoang",
  position: "ST",
  isPro: true,
  age: 18,
  year: 2027,
  fame: 1000,
  morale: 75,
  currentEuroStatus: "C1",
  currentClub: {
    name: "Arsenal",
    league: {
      name: "Premier League",
      domesticCup: "FA Cup",
      continentalC1: "UEFA Champions League"
    }
  },
  cupStats: {
    domesticCup: {
      goals: 6,
      assists: 3,
      matches: 5,
      avgRating: 8.1
    }
  },
  tournamentBrackets: {
    domesticCup: {
      name: "FA Cup",
      champion: { name: "Arsenal" },
      playerStats: { goals: 6, assists: 3, matches: 5, avgRating: 8.1 }
    }
  }
};

const awardRes = evaluateAndAwardCupAwards(testPlayer, 'domestic');
console.log("Award Evaluation Result:", awardRes);
console.log("Trophies Won List:", testPlayer.seasonTrophiesWonThisYear);
console.log("Trophies Total:", testPlayer.trophiesTotal);
console.log("Individual Awards:", testPlayer.individualAwards);
console.log("Bracket Awards:", testPlayer.tournamentBrackets.domesticCup.awards);

const wonMvp = awardRes.domestic.wonMvp;
const hasMvpTrophy = testPlayer.seasonTrophiesWonThisYear.includes("Cầu Thủ Xuất Sắc Nhất FA Cup");
const bracketHasMvp = Boolean(testPlayer.tournamentBrackets.domesticCup.awards.mvp);

if (wonMvp && hasMvpTrophy && bracketHasMvp) {
  console.log("✅ evaluateAndAwardCupAwards hoạt động hoàn hảo, đã trao Cầu Thủ Xuất Sắc Nhất FA Cup!");
} else {
  console.error("❌ Lỗi trao giải thưởng Cup MVP!");
}

console.log("\n=== HOÀN TẤT TEST ===");
