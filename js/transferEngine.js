/**
 * TRANSFER ENGINE
 * Quản lý thị trường chuyển nhượng, định giá Transfermarkt, đàm phán hợp đồng,
 * đề nghị cho mượn (loan) và lời mời từ các CLB lớn.
 */

import { ALL_CLUBS } from './data.js';
import { getOverallPower } from './playerEngine.js';

/**
 * Định giá thị trường Transfermarkt dựa trên tuổi tác, OVR, phong độ và danh tiếng
 */
export function calculateTransfermarktValue(player) {
  if (!player) return 1000000;
  const ovr = getOverallPower(player);
  let baseVal = 0;

  if (player.age <= 18) {
    baseVal = 10000000 + Math.max(0, (ovr - 45)) * 900000;
  } else if (player.age <= 20) {
    baseVal = 25000000 + Math.max(0, (ovr - 55)) * 1600000;
  } else if (player.age <= 28) {
    if (ovr >= 90) {
      baseVal = 160000000 + (ovr - 90) * 14000000;
    } else if (ovr >= 80) {
      baseVal = 75000000 + (ovr - 80) * 8500000;
    } else {
      baseVal = 25000000 + (ovr - 60) * 2500000;
    }
  } else if (player.age <= 33) {
    const ageDrop = (player.age - 28) * 16000000;
    let primeEquivalent = 160000000 + Math.max(0, (ovr - 88) * 9000000);
    baseVal = Math.max(80000000, primeEquivalent - ageDrop);
  } else if (player.age <= 35) {
    baseVal = Math.max(20000000, 52000000 - (player.age - 33) * 15000000 + Math.max(0, ovr - 75) * 1200000);
  } else {
    baseVal = Math.max(1000000, 15000000 - (player.age - 35) * 4000000 + Math.max(0, ovr - 70) * 500000);
  }

  if (player.form >= 85) baseVal *= 1.10;

  // Chuẩn hóa hệ số danh tiếng (Fame multiplier) theo hệ thống Uncapped Fame
  const famePoints = Math.max(0, player.fame || 0);
  const fameMultiplier = 1 + Math.min(1.4, Math.sqrt(famePoints) / 55);
  baseVal *= fameMultiplier;

  // Phụ phí giá trị thương mại danh tiếng hợp lý (tối đa ~35M Euro)
  const commercialVal = Math.min(35000000, Math.round(Math.sqrt(famePoints) * 250000));
  baseVal += commercialVal;

  // Hard Cap: Max €350M
  baseVal = Math.min(350000000, Math.max(1000000, baseVal));

  let calculated = Math.round(baseVal / 500000) * 500000;
  player.marketValue = calculated;
  player.peakMarketValue = Math.max(player.peakMarketValue || 0, calculated);
  return calculated;
}

/**
 * Kiểm tra trạng thái kỳ chuyển nhượng (Hè vs Đông vs Đóng cửa)
 */
export function getTransferWindowStatus(player) {
  if (!player) return { isOpen: false, windowName: "Đã Khóa", message: "Chưa bắt đầu", roundsRemaining: 0 };
  if (player.isAcademyStage || player.age <= 16) {
    return {
      isOpen: false,
      windowName: "Giai Đoạn Đào Tạo Trẻ",
      message: "Học viện trẻ: Hoàn tất mùa giải đầu tiên để ký hợp đồng chuyên nghiệp.",
      roundsRemaining: Math.max(0, (player.currentSeasonFixtures?.length || 18) - (player.currentFixtureIndex || 0))
    };
  }

  const curIdx = player.currentFixtureIndex || 0;
  // Kỳ Chuyển Nhượng Hè: Vòng 0 đến hết vòng 3
  if (curIdx <= 3) {
    const rem = 4 - curIdx;
    return {
      isOpen: true,
      windowName: "Kỳ Chuyển Nhượng Hè (Summer Window)",
      message: `Thị trường đang mở! Đóng sau ${rem} vòng nữa.`,
      roundsRemaining: rem
    };
  }
  // Kỳ Chuyển Nhượng Đông: Vòng 18 đến hết vòng 21
  if (curIdx >= 18 && curIdx <= 21) {
    const rem = 22 - curIdx;
    return {
      isOpen: true,
      windowName: "Kỳ Chuyển Nhượng Mùa Đông (Winter Window)",
      message: `Thị trường mùa đông đang mở! Đóng sau ${rem} vòng nữa.`,
      roundsRemaining: rem
    };
  }

  // Đóng cửa
  if (curIdx < 18) {
    const rem = 18 - curIdx;
    return {
      isOpen: false,
      windowName: "Thị Trường Đóng Cửa",
      message: `Kỳ chuyển nhượng mùa đông sẽ mở sau ${rem} vòng đấu nữa.`,
      roundsRemaining: rem
    };
  } else {
    const total = player.currentSeasonFixtures?.length || 38;
    const rem = Math.max(1, total - curIdx);
    return {
      isOpen: false,
      windowName: "Thị Trường Đóng Cửa",
      message: `Kỳ chuyển nhượng hè sẽ mở khi bắt đầu mùa giải mới (sau ${rem} vòng nữa).`,
      roundsRemaining: rem
    };
  }
}

/**
 * Sinh danh sách các lời mời chuyển nhượng (Transfer Offers) từ các CLB phù hợp với OVR, danh tiếng
 */
export function generateTransferOffers(player) {
  if (!player || player.isAcademyStage || player.age <= 16) return [];

  const ovr = getOverallPower(player);
  let offers = [];

  // Ưu tiên đề nghị hấp dẫn từ Saudi Pro League hoặc MLS nếu lớn tuổi hoặc danh tiếng cao (Tier 6 World-Class 4000+ pts)
  if (player.age >= 33 || (player.fame || 0) >= 4000) {
    const saudiClubs = ALL_CLUBS.filter(c => c.isSaudiMLS && (player.currentClub ? c.id !== player.currentClub.id : true));
    saudiClubs.sort(() => 0.5 - Math.random());
    offers.push(...saudiClubs.slice(0, 1));
  }

  let availableClubs = [];
  if (ovr >= 80) {
    availableClubs = ALL_CLUBS.filter(c => {
      if (player.currentClub && c.id === player.currentClub.id) return false;
      if (offers.some(o => o.id === c.id)) return false;
      return c.league.tierLevel >= 3 && ovr >= c.skillReq - 6;
    });
  } else {
    availableClubs = ALL_CLUBS.filter(c => {
      if (player.currentClub && c.id === player.currentClub.id) return false;
      if (offers.some(o => o.id === c.id)) return false;
      return (c.league.tierLevel <= 2 || c.skillReq <= 78) && !c.isSaudiMLS;
    });
  }

  availableClubs.sort(() => 0.5 - Math.random());
  offers.push(...availableClubs.slice(0, 4 - offers.length));

  if (offers.length === 0) {
    offers = ALL_CLUBS.filter(c => (player.currentClub ? c.id !== player.currentClub.id : true) && c.league.tierLevel <= 2).slice(0, 3);
  }

  return offers.map(club => {
    let offerSalary = Math.floor(club.salary * (0.95 + Math.min(1.0, Math.sqrt(player.fame || 0) / 60) * 0.45));
    if (club.isSaudiMLS) {
      offerSalary = Math.max(offerSalary, club.salary);
    }

    const signingBonus = Math.floor(offerSalary * 6 + (player.marketValue || 5000000) * 0.05 + 500000);

    let role = "⭐ Trụ cột đá chính";
    if (ovr < club.skillReq) role = "Dự bị tiềm năng / Xoay tua";
    else if (ovr >= club.skillReq + 6) role = "👑 Siêu sao gánh đội (Key Player)";
    if (club.isSaudiMLS) role = "💎 Đại Sứ Toàn Cầu & Lương Kỷ Lục";

    let contractYears = club.isSaudiMLS ? 2 : (player.age <= 23 ? 5 : (player.age <= 30 ? 4 : 2));

    return {
      club,
      offerSalary,
      signingBonus,
      contractYears,
      role
    };
  });
}

/**
 * Đề xuất các lời mời cho mượn (Loan Offers) cho cầu thủ trẻ cần ra sân
 */
export function generateLoanOffers(player) {
  if (!player || player.age > 24) return [];
  const ovr = getOverallPower(player);

  const loanClubs = ALL_CLUBS.filter(c => {
    if (player.currentClub && c.id === player.currentClub.id) return false;
    return c.league.tierLevel <= 2 && Math.abs(c.skillReq - ovr) <= 6 && !c.isSaudiMLS;
  });

  loanClubs.sort(() => 0.5 - Math.random());
  return loanClubs.slice(0, 3).map(club => ({
    club,
    loanDuration: "1 Mùa Giải",
    wageCoverage: "100%",
    promisedRole: "Đá chính thường xuyên (Key Starter)"
  }));
}

/**
 * Đánh giá kết quả đàm phán hợp đồng (Negotiate Contract)
 */
export function evaluateContractNegotiation(player, targetClub, proposedSalary, proposedYears, negotiationTone = "RESPECTFUL") {
  if (!player || !targetClub) return { accepted: false, reason: "Dữ liệu đàm phán không hợp lệ" };

  const ovr = getOverallPower(player);
  const baseSalary = targetClub.salary;
  const ratio = proposedSalary / Math.max(1, baseSalary);

  let successChance = 0.5;

  if (ratio <= 1.0) successChance = 0.95;
  else if (ratio <= 1.25) successChance = 0.70;
  else if (ratio <= 1.5) successChance = 0.45;
  else if (ratio <= 1.8) successChance = 0.20;
  else successChance = 0.05;

  if (ovr >= targetClub.skillReq + 4) successChance += 0.20;
  if ((player.fame || 0) >= 2000) successChance += 0.15;
  if (negotiationTone === "AGGRESSIVE") successChance -= 0.15;

  const roll = Math.random();
  if (roll <= successChance) {
    return {
      accepted: true,
      counterOffer: null,
      message: `🤝 Ban lãnh đạo ${targetClub.name} đã đồng ý với yêu cầu đãi ngộ €${proposedSalary.toLocaleString()} / week trong ${proposedYears} năm!`
    };
  } else if (roll <= successChance + 0.3) {
    const counterSalary = Math.round((proposedSalary + baseSalary) / 2);
    return {
      accepted: false,
      counterOffer: { salary: counterSalary, years: proposedYears },
      message: `⚖️ ${targetClub.name} không chấp nhận mức đòi hỏi, nhưng sẵn sàng đưa ra mức đề nghị trung gian: €${counterSalary.toLocaleString()} / week.`
    };
  } else {
    return {
      accepted: false,
      counterOffer: null,
      message: `❌ Ban lãnh đạo ${targetClub.name} cảm thấy mức yêu cầu quá xa vời thực tế và đã rút lui khỏi bàn đàm phán!`
    };
  }
}
