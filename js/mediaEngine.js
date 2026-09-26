/**
 * MEDIA & NARRATIVE ENGINE
 * Quản lý tin tức báo chí, họp báo sau trận đấu, tường thuật,
 * biên niên sử sự nghiệp (Career Chronicle) và thăng hạng đấu trường.
 */
import { getPlayerLine } from './matchEngine.js';
/**
 * Chọn ngẫu nhiên template trong pool sao cho không bao giờ lặp lại nguyên văn
 * giữa các trận/sự kiện liên tiếp của người chơi.
 */
function pickNonRepeatingTemplate(player, key, templatePool) {
  if (!player || !Array.isArray(templatePool) || templatePool.length === 0) {
    return templatePool?.[0] || "";
  }
  if (!player._recentNarrativeHistory) player._recentNarrativeHistory = {};
  const recent = player._recentNarrativeHistory[key] || [];

  // Lọc các template chưa xuất hiện trong 2-3 lần gần nhất
  const availableIndices = templatePool
    .map((_, idx) => idx)
    .filter(idx => !recent.includes(idx));

  const chosenIndex = availableIndices.length > 0
    ? availableIndices[Math.floor(Math.random() * availableIndices.length)]
    : Math.floor(Math.random() * templatePool.length);

  // Lưu lịch sử gần nhất (giữ tối đa 3 index gần nhất)
  player._recentNarrativeHistory[key] = [chosenIndex, ...recent.filter(i => i !== chosenIndex)].slice(0, 3);
  return templatePool[chosenIndex];
}

/**
 * Xác định tên sân đấu và khu vực địa lý mang tính nhập vai cao
 */
function getMatchVenueAndRegion(player, pMatch = {}) {
  let stadium = "Sân Vận Động";
  let regionName = "làng túc cầu";

  if (player.isAcademyStage) {
    const acId = (player.academy?.id || "").toLowerCase();
    if (acId.includes("barca") || acId.includes("masia")) {
      stadium = "Ciutat Esportiva Joan Gamper";
      regionName = "xứ Catalunya";
    } else if (acId.includes("real") || acId.includes("fabrica")) {
      stadium = "Khu liên hợp Valdebebas";
      regionName = "thủ đô Madrid";
    } else if (acId.includes("man_utd") || acId.includes("carrington")) {
      stadium = "Khu huấn luyện Carrington";
      regionName = "xứ sương mù";
    } else if (acId.includes("pvf")) {
      stadium = "Trung tâm Đào tạo Trẻ PVF";
      regionName = "nước nhà";
    } else if (acId.includes("ajax")) {
      stadium = "Khu liên hợp De Toekomst";
      regionName = "xứ sở hoa Tulip";
    } else {
      stadium = player.academy?.stadium || player.academy?.name || pMatch.stadium || "Sân Học Viện";
      regionName = player.academy?.country || "học viện";
    }
  } else {
    stadium = pMatch.stadium || player.currentClub?.stadium || (player.currentClub ? `${player.currentClub.name} Arena` : "Thánh địa sân nhà");
    const leagueName = player.currentClub?.league?.name || "";
    if (leagueName.includes("La Liga")) regionName = "xứ sở bò tót";
    else if (leagueName.includes("Premier League")) regionName = "xứ sở sương mù";
    else if (leagueName.includes("Serie A")) regionName = "đất nước hình chiếc ủng";
    else if (leagueName.includes("Bundesliga")) regionName = "nước Đức";
    else if (leagueName.includes("Ligue 1")) regionName = "xứ lục lăng";
    else if (leagueName.includes("V-League")) regionName = "nước nhà";
    else regionName = player.currentClub?.country || "quốc nội";
  }

  return { stadium, regionName };
}

/**
 * Định dạng văn xuôi tự nhiên cho đóng góp cá nhân của cầu thủ
 */
function formatPlayerStatProse(player, { pGoals = 0, pAssists = 0, pCS = 0, pSaves = 0, pTackles = 0 } = {}) {
  const pLine = getPlayerLine(player);
  if (pLine === "GK") {
    if (pCS > 0 && pSaves >= 5) return `giữ sạch mành lưới cùng ${pSaves} pha cứu thua không tưởng`;
    if (pCS > 0) return `màn trình diễn sạch lưới xuất thần với ${pSaves} pha phản xạ cứu thua`;
    if (pSaves >= 6) return `${pSaves} pha bay lượn cứu thua ngoạn mục làm nản lòng chân sút đối phương`;
    return `${pSaves} pha cản phá vững chắc`;
  }
  if (pLine === "DF") {
    if (pCS > 0 && pTackles >= 4) return `${pTackles} pha tắc bóng chuẩn xác và bảo toàn trọn vẹn mành lưới nhà`;
    if (pTackles >= 4) return `${pTackles} pha can thiệp dũng mãnh bẻ gãy mọi đợt hãm thành`;
    if (pGoals > 0) return `dâng cao ghi 1 bàn thắng quý giá và ${pTackles} pha truy cản mẫu mực`;
    return `${pTackles} pha cắt bóng then chốt`;
  }

  // FW & MF
  if (pGoals >= 3) return `cú hat-trick lịch sử ${pGoals} bàn thắng đỉnh cao`;
  if (pGoals >= 2 && pAssists >= 2) return `${pGoals} bàn thắng cùng ${pAssists} đường dọn cỗ xé toang hàng thủ`;
  if (pGoals >= 2 && pAssists === 1) return `cú đúp ${pGoals} bàn thắng cùng 1 đường kiến tạo sắc như dao cạo`;
  if (pGoals >= 2) return `cú đúp ${pGoals} bàn thắng đẳng cấp làm nổ tung cầu trường`;
  if (pGoals === 1 && pAssists >= 2) return `1 pha lập công cùng ${pAssists} đường kiến tạo dọn cỗ xé toang hàng thủ`;
  if (pGoals === 1 && pAssists === 1) return `1 bàn thắng và 1 đường dọn cỗ mẫu mực`;
  if (pGoals === 1) return `bàn thắng quyết định xé toang mành lưới`;
  if (pAssists >= 2) return `${pAssists} đường kiến tạo đẳng cấp thế giới xé toang hàng thủ`;
  if (pAssists === 1) return `đường kiến tạo dọn cỗ sắc bén`;
  return `những pha xử lý kỹ thuật đỉnh cao và nhãn quan chiến thuật bậc thầy`;
}

/**
 * 1. KẾT QUẢ THI ĐẤU & PHONG ĐỘ (MATCH MILESTONES)
 * Tạo đoạn văn xuôi giàu cảm xúc thay thế thông báo khô khan cũ
 */
export function generateRichMatchNarrative(player, context = {}) {
  const {
    homeScore = 0,
    awayScore = 0,
    matchRating = 7.0,
    playerGoals = 0,
    playerAssists = 0,
    playerCleanSheets = 0,
    playerSaves = 0,
    playerTackles = 0,
    isPlayerWin = false,
    isDraw = false,
    isKnockoutMatch = false,
    roundData = {},
    pMatch = {}
  } = context;

  const { stadium, regionName } = getMatchVenueAndRegion(player, pMatch);
  const scoreStr = `${homeScore} - ${awayScore}`;
  const oppName = pMatch?.opponent?.name || (pMatch?.homeClub?.name === (player.currentClub?.name || player.academy?.name) ? pMatch?.awayClub?.name : pMatch?.homeClub?.name) || "đối thủ";
  const ratingStr = matchRating >= 9.9 ? "10" : matchRating.toFixed(1);
  const statProse = formatPlayerStatProse(player, {
    pGoals: playerGoals,
    pAssists: playerAssists,
    pCS: playerCleanSheets,
    pSaves: playerSaves,
    pTackles: playerTackles
  });

  const isMasterclass = matchRating >= 9.0;
  const isClutchWinner = (isPlayerWin || (!isDraw && homeScore !== awayScore)) &&
    (playerGoals > 0 || playerAssists > 0) &&
    (Math.abs(homeScore - awayScore) === 1 || isKnockoutMatch || context.isPenalties);
  const isPoorOrLoss = matchRating < 6.0 || (!isPlayerWin && !isDraw);
  const isSolidWin = isPlayerWin && matchRating >= 6.8;

  let categoryKey = "SOLID_WIN";
  let templatePool = [];
  let logType = "normal";

  if (isMasterclass) {
    categoryKey = "MASTERCLASS";
    logType = "trophy-win";
    templatePool = [
      `Đêm kỳ ảo tại ${stadium}! Màn trình diễn điểm ${ratingStr} hoàn hảo trước hàng ngàn khán giả: ${statProse} xé toang hàng thủ đối phương. Báo giới ${regionName} bắt đầu nhắc đến cái tên của bạn như một viên ngọc thô sáng giá nhất học viện.`,
      `Sân khấu đỉnh cao tại ${stadium} thuộc về riêng bạn! Từng pha xử lý bóng ma thuật với rating ${ratingStr} làm say đắm toàn bộ cầu trường (${statProse}). Những tràng pháo tay không ngớt từ khán đài báo hiệu sự trỗi dậy của một siêu sao tương lai.`,
      `Một buổi tối xuất thần lay động cầu trường ${stadium}! Đạt rating không tưởng ${ratingStr}, bạn làm lu mờ hoàn toàn dàn sao ${oppName} bằng ${statProse}. Giới chuyên môn đồng loạt ngả mũ thán phục trước đẳng cấp vượt tầm lứa tuổi.`,
      `Cơn địa chấn mang tên bạn! Với điểm số ${ratingStr} rực sáng (${statProse}), cả SVĐ như phát cuồng sau từng pha chạm bóng đầy mê hoặc. Các tuyển trạch viên danh tiếng không ngừng ghi chép những mỹ từ hoa mỹ nhất về bạn.`,
      `Kiệt tác bóng đá được dệt nên từ đôi chân bạn (${ratingStr} điểm)! Hàng thủ ${oppName} bất lực hoàn toàn trước ${statProse}. Đêm nay, tên bạn sẽ ngập tràn trên khắp các trang bìa thể thao danh giá nhất ${regionName}.`
    ];
  } else if (isClutchWinner) {
    categoryKey = "CLUTCH_WINNER";
    logType = "trophy-win";
    templatePool = [
      `Khoảnh khắc vỡ òa ở phút cuối! Cú ra chân lạnh lùng khiến cả khán đài nín lặng trước khi bùng nổ trong tiếng reo hò. Ba điểm trọn vẹn (${scoreStr}) mang đậm dấu ấn cá nhân.`,
      `Trái tim người hâm mộ tại ${stadium} như ngừng đập khi đồng hồ trôi về những giây cuối! Pha tỏa sáng quý hơn vàng của bạn đã định đoạt số phận trận đại chiến (${scoreStr}), biến bạn thành người hùng cứu rỗi đội bóng.`,
      `Bản lĩnh của một sát thủ xuất hiện đúng lúc ngặt nghèo nhất! Cú vung chân sắc lẹm xé toang mành lưới ở phút bù giờ, đem lại chiến thắng nghẹt thở ${scoreStr} trước ${oppName} trong tiếng gầm vang khắp cầu trường.`,
      `Thời khắc lịch sử thuộc về bạn! Giữa sức ép nghẹt thở của những phút cuối, bạn lạnh lùng ra đòn kết liễu, đưa toàn đội bay bổng với chiến thắng vàng ${scoreStr}.`,
      `Một kịch bản nghẹt thở đến điên rồ! Pha tỏa sáng rực rỡ ở thời khắc sinh tử đã dập tắt mọi hy vọng của ${oppName}, mang về chiến thắng quý giá tựa ngàn vàng (${scoreStr}).`
    ];
  } else if (isPoorOrLoss) {
    categoryKey = "POOR_DEFEAT";
    logType = "normal";
    templatePool = [
      `Một ngày thi đấu dưới sức đầy áp lực. Tiếng còi mãn cuộc vang lên như gáo nước lạnh, nhắc nhở bài học khắc nghiệt về sự tập trung ở đấu trường đỉnh cao.`,
      `Cảm giác bất lực bao trùm khi đôi chân không tuân theo ý muốn. Trận thua muối mặt (${scoreStr}) trước ${oppName} để lại nỗi thất vọng nặng nề, nhưng cũng hun đúc thêm ngọn lửa phục thù cho lần tái đấu.`,
      `Sân cỏ đỉnh cao không có chỗ cho sự lơ là. Đối phương trừng phạt mọi sai lầm và bạn phải nhận về điểm số cay đắng (${ratingStr}). Một nốt trầm bắt buộc phải vượt qua trên con đường trở thành huyền thoại.`,
      `Cú sảy chân đắt giá trước sức ép khủng khiếp của ${oppName}. Tiếng la ó từ khán đài chính là liều thuốc đắng, nhắc nhở bạn rằng con đường tới đỉnh vinh quang không bao giờ trải hoa hồng.`,
      `Trận đấu đáng quên khi mọi phương án chiến thuật đều rơi vào bế tắc. Thất bại cay đắng ${scoreStr} đè nặng lên tâm trí, nhưng những chiến binh thực thụ luôn biết cách đứng dậy từ vấp ngã.`
    ];
  } else if (isSolidWin) {
    categoryKey = "SOLID_WIN";
    logType = playerGoals > 0 ? "trophy-win" : "normal";
    templatePool = [
      `Một ngày thi đấu thăng hoa và tràn đầy năng lượng (${scoreStr}). Với đóng góp cá nhân ấn tượng (${statProse}, Rating ${ratingStr}), bạn cùng đồng đội bỏ túi 3 điểm đầy thuyết phục trước ${oppName}.`,
      `Khúc khải hoàn giòn giã tại ${stadium}! Lối chơi kỷ luật cùng những pha xử lý thanh thoát (${statProse}, điểm ${ratingStr}) giúp bạn chiếm trọn niềm tin từ ban huấn luyện.`,
      `Chiến thắng ngọt ngào ${scoreStr} khẳng định bản lĩnh vững vàng của đội bóng. Phong độ ổn định và đĩnh đạc (Rating ${ratingStr}) giúp bạn làm chủ thế trận từ đầu đến cuối.`,
      `Thêm một bước tiến vững chắc trên bảng xếp hạng! Màn trình diễn ấn tượng (${statProse}) với điểm số ${ratingStr} tiếp tục khẳng định tầm ảnh hưởng không thể thiếu của bạn trong đội hình.`
    ];
  } else {
    // DRAW
    categoryKey = "HARD_DRAW";
    logType = "normal";
    templatePool = [
      `Cuộc chiến giằng co đến nghẹt thở khép lại với tỷ số hòa ${scoreStr}. Điểm số ${ratingStr} phản ánh 90 phút chiến đấu kiên cường không khoan nhượng trước ${oppName}.`,
      `Một điểm nhọc nhằn nhưng đầy quả cảm tại ${stadium} (${scoreStr}). Dù không thể giành trọn chiến thắng, màn trình diễn chắc chắn (${statProse}) vẫn ghi dấu ấn bản lĩnh của bạn.`,
      `Thế trận đôi công rực lửa kết thúc bất phân thắng bại (${scoreStr}). 90 phút căng thẳng tột độ tôi rèn thêm ý chí và kinh nghiệm trận mạc quý giá (Rating ${ratingStr}).`
    ];
  }

  const selectedText = pickNonRepeatingTemplate(player, `MATCH_${categoryKey}`, templatePool);
  const stageTitle = roundData.competitionName && roundData.stageName
    ? `[${roundData.competitionName} — ${roundData.stageName}]`
    : `[Trận Cầu: ${scoreStr}]`;

  return {
    title: stageTitle,
    body: selectedText,
    type: logType,
    categoryKey
  };
}

/**
 * 2. TƯƠNG TÁC PHÒNG THAY ĐỒ & TRUYỀN THÔNG (DRESSING ROOM & MEDIA)
 */
export function generateMediaInteractionNarrative(player, choiceType = "HUMBLE", context = {}) {
  let templatePool = [];
  let logType = "normal";
  const typeKey = (choiceType || "HUMBLE").toUpperCase();

  if (typeKey === "HUMBLE") {
    logType = "normal";
    templatePool = [
      `Đứng trước rừng ống kính máy quay, bạn chọn cách lùi lại để tôn vinh nỗ lực của tập thể. Lời phát biểu chín chắn trước tuổi khiến HLV trưởng mỉm cười gật đầu, phòng thay đồ ngày càng dành cho bạn sự nể trọng đặc biệt.`,
      `Từ chối những lời tung hô cá nhân, bạn khẳng định: 'Chiến thắng này thuộc về tất cả anh em trong đội'. Thái độ khiêm nhường chuẩn mực của bạn nhận được cơn mưa lời khen từ các cựu danh thủ trên sóng truyền hình.`,
      `Cử chỉ ấm áp và sự biết ơn chân thành dành cho ban huấn luyện cùng người hâm mộ sau trận đấu. Sự trưởng thành vượt bậc trong tư duy giúp bạn trở thành chỗ dựa tinh thần đáng tin cậy trong phòng thay đồ.`,
      `Nụ cười điềm đạm trước truyền thông: 'Tôi chỉ là một mảnh ghép nhỏ trong cỗ máy tập thể'. Lời lẽ mẫu mực ấy dập tắt mọi sóng gió báo chí và thắt chặt tình đoàn kết giữa các cầu thủ.`
    ];
  } else if (typeKey === "STAR") {
    logType = "trophy-win";
    templatePool = [
      `Tuyên bố đanh thép với truyền thông thổi bùng lên làn sóng tranh luận trên mạng xã hội. Một chút kiêu hãnh của tuổi trẻ, gia tăng áp lực nhưng cũng chứng minh bản lĩnh không sợ hãi.`,
      `'Tôi sinh ra để tỏa sáng ở những trận cầu lớn!' — Phát ngôn bùng nổ của bạn làm dậy sóng làng túc cầu. Báo giới chia nửa khen chê, nhưng không ai có thể phủ nhận sức hút và cá tính ngút trời của bạn.`,
      `Một nụ cười ngạo nghễ trước máy quay và lời khẳng định vị thế ngôi sao số một. Áp lực từ dư luận lập tức tăng vọt, nhưng đó chính là ngọn lửa đốt cháy khát khao khẳng định mình của bạn.`,
      `Tuyên bố không khoan nhượng khiến dư luận bùng nổ dữ dội. Bản lĩnh thép của một kẻ chinh phục: dám nhận lấy mọi ánh nhìn săm soi để bước lên nấc thang vinh quang cao nhất.`
    ];
  } else {
    // BLAME / TACTICAL TENSION
    logType = "injury";
    templatePool = [
      `Phát biểu gai góc về chiến thuật khiến không khí phòng thay đồ chùng xuống rõ rệt. Những lời nói thật mất lòng tạo ra làn sóng tranh cãi nội bộ, đặt bạn vào tâm bão chỉ trích nhưng cũng gióng lên hồi chuông cảnh tỉnh.`,
      `Cơn thịnh nộ bộc phát trước truyền thông! Sự thẳng thắn quá mức khiến ban huấn luyện không hài lòng, những ánh nhìn e dè bắt đầu xuất hiện trong buổi tập tiếp theo.`,
      `Công khai chỉ trích chiến thuật trước ống kính phóng viên! Căng thẳng leo thang trong phòng thay đồ, một bài học đắt giá về sự khéo léo trong giao tiếp nội bộ.`
    ];
  }

  const selectedText = pickNonRepeatingTemplate(player, `MEDIA_${typeKey}`, templatePool);
  const title = `🎙️ HỌP BÁO TRUYỀN THÔNG (${context.matchTitle || context.stageName || "Sau Trận Đại Chiến"})`;

  return {
    title,
    body: selectedText,
    type: logType
  };
}

/**
 * 3. CỘT MỐC PHÁT TRIỂN & TẬP LUYỆN (SKILL BREAKTHROUGH)
 */
export function generateSkillBreakthroughNarrative(player, statChange = {}) {
  if (statChange.isLevelUp) {
    const level = statChange.growthLevel || statChange.level || 2;
    const pool = [
      `Màn bứt phá thần tốc vượt qua mọi giới hạn bản thân! Bạn chính thức bước lên một nấc thang phát triển mới (Cấp Tăng Trưởng ${level}), phong thái của một ngôi sao lớn ngày càng lộ rõ.`,
      `Thời khắc thăng hoa biến tiềm năng thô ráp thành vũ khí sát thương thượng hạng! Năng lực toàn diện được nâng tầm vượt bậc (Tiềm năng Cấp ${level}).`,
      `Sự kiên trì bền bỉ qua từng giáo án huấn luyện khắc nghiệt đã được đền đáp. Bước nhảy vọt lên Cấp Tăng Trưởng ${level} mở ra chân trời mới cho sự nghiệp.`
    ];
    return {
      title: `[Đột Phá Tiềm Năng Cấp ${level}]`,
      body: pickNonRepeatingTemplate(player, "SKILL_LEVEL_UP", pool),
      type: "trophy-win"
    };
  }

  const statKey = (statChange.stat || statChange.statKey || "").toLowerCase();
  const statName = statChange.statName || statChange.stat?.toUpperCase() || "KỸ NĂNG";
  const val = statChange.currentValue ?? (statChange.newValue ?? 55);
  let pool = [];

  if (statKey.includes("finish") || statKey.includes("shoot") || statKey.includes("sút") || statKey === "attr1") {
    pool = [
      `Những buổi tập tăng cường dưới ánh đèn sân tập muộn cuối cùng đã đơm hoa kết trái. Cảm giác bóng và độ chuẩn xác trong từng cú vung chân đã được nâng lên một tầm cao mới (Dứt điểm chạm mốc ${val}).`,
      `Hàng trăm cú sút lặp đi lặp lại vào góc chết khung thành sau mỗi buổi tập chính. Bản năng sát thủ nay đã đạt độ sắc lẹm đáng sợ (Dứt điểm vươn lên mốc ${val}).`,
      `Độ hiểm hóc và sự lạnh lùng trong các tình huống đối mặt thủ môn được nâng tầm rõ rệt. Giờ đây mỗi pha vung chân đều mang tính sát thương tuyệt đối (Dứt điểm chạm mốc ${val}).`
    ];
  } else if (statKey.includes("pace") || statKey.includes("speed") || statKey.includes("stam") || statKey.includes("tốc") || statKey === "attr2") {
    pool = [
      `Những vòng chạy bền không biết mệt mỏi trong màn sương sớm mang lại kết quả ngọt ngào. Khả năng bứt tốc và sức rướn bùng nổ nay đã bỏ xa các đối thủ cùng trang lứa (Tốc độ đạt mốc ${val}).`,
      `Giọt mồ hôi ướt đẫm phòng gym và những bài tập biến tốc cường độ cao. Thể trạng phi thường cùng sải chân thanh thoát được tôi rèn lên tầm cao mới (Tốc độ chạm ngưỡng ${val}).`,
      `Sải chân bùng nổ cùng khả năng xé gió bên hành lang cánh đã đạt bước tiến vượt bậc. Không hậu vệ nào có thể dễ dàng bắt kịp guồng chân ma quái của bạn (Tốc độ đạt ${val}).`
    ];
  } else if (statKey.includes("pass") || statKey.includes("vision") || statKey.includes("chuyền") || statKey === "attr3") {
    pool = [
      `Hàng giờ miệt mài nghiên cứu băng hình chiến thuật cùng những bài tập chuyền bóng điểm rơi. Nhãn quan chiến thuật nay đã mở rộng thênh thang, từng đường chọc khe đạt độ chuẩn xác từng milimét (Chuyền bóng chạm mốc ${val}).`,
      `Khả năng đọc trận đấu và cảm quan không gian nâng tầm vượt bậc. Giờ đây chỉ một cái liếc mắt, bạn đã có thể tung ra đường dọn cỗ xé toang hàng phòng ngự (Chuyền bóng đạt ${val}).`,
      `Độ xoáy và quỹ đạo của những đường chuyền dài đã đạt tới độ chín muồi. Trái bóng nghe lời răm rắp theo từng ý đồ triển khai tấn công (Chuyền bóng chạm mốc ${val}).`
    ];
  } else if (statKey.includes("drib") || statKey.includes("tech") || statKey.includes("rê") || statKey === "attr4") {
    pool = [
      `Đôi chân như múa trên sân tập với những bài luồn cọc tốc độ cao. Cảm giác dính bóng như keo và những cú lắc hông mềm mại đã được mài giũa hoàn hảo (Rê bóng chạm mốc ${val}).`,
      `Sự tự tin trong từng pha chạm bóng một và những động tác giả ma thuật nay đã đạt độ nhuần nhuyễn đáng kinh ngạc (Kỹ thuật vươn lên ${val}).`,
      `Khả năng xử lý bóng trong không gian hẹp nay đã trở thành bản năng tự nhiên. Từng nhịp chạm bóng tinh tế khiến đối phương luôn rơi vào thế bị động (Rê bóng đạt ${val}).`
    ];
  } else if (statKey.includes("def") || statKey.includes("tackle") || statKey.includes("gk") || statKey.includes("save") || statKey.includes("thủ")) {
    pool = [
      `Sự tập trung cao độ và phản xạ xuất thần được trui rèn qua hàng ngàn pha cản phá quyết liệt. Bạn trở thành tấm lá chắn thép không thể xuyên phá trước khung thành (${statName} chạm mốc ${val}).`,
      `Những cú xoạc bóng chuẩn xác từng tấc đất và khả năng phán đoán hướng bóng xuất thần đã được mài giũa sắc bén (${statName} vươn lên mốc ${val}).`,
      `Khả năng đọc trước ý đồ dứt điểm của đối phương cùng phản xạ không tưởng giúp bạn làm chủ hoàn toàn khu vực cấm địa (${statName} chạm mốc ${val}).`
    ];
  } else {
    pool = [
      `Những giọt mồ hôi trên sân tập cùng kỷ luật thép mỗi ngày đã được đền đáp xứng đáng. Chỉ số ${statName} được nâng lên một tầm cao mới (${val}).`,
      `Nỗ lực không ngừng nghỉ trong từng giáo án tập luyện giúp năng lực ${statName} thăng hoa vượt bậc (Chạm mốc ${val}).`
    ];
  }

  const selectedText = pickNonRepeatingTemplate(player, `SKILL_${statKey || "GENERAL"}`, pool);
  const title = statChange.isMilestone
    ? `[Cột Mốc Thăng Cấp: ${statName}]`
    : `[Tăng Trưởng Kỹ Năng: ${statName}]`;

  return {
    title,
    body: selectedText,
    type: "trophy-win"
  };
}

/**
 * 4. ĐỜI THƯỜNG & TÂM LÝ TÂN BINH (ACADEMY LIFE)
 * Bổ sung xen kẽ các mẩu nhật ký sinh hoạt nhỏ ngẫu nhiên theo tuần/tháng
 */
export function getRandomAcademyLifeSnippet(player) {
  const pool = [
    "Ngồi ngắm nhìn phòng truyền thống với những chiếc cúp Champions League danh giá, khát khao bước ra sân khấu lớn chưa bao giờ cháy bỏng đến thế.",
    "Chuyến xe buýt trở về sau trận sân khách rộn rã tiếng cười của những đồng đội cùng trang lứa.",
    "Một buổi chiều mưa rơi trên sân tập học viện. Đôi giày lấm lem bùn đất nhưng ánh mắt vẫn rực sáng niềm đam mê thuở ban đầu.",
    "Bữa cơm đạm bạc cùng các đồng đội trẻ ở căng tin ký túc xá, rôm rả bàn tán về giấc mơ một ngày được khoác áo đội tuyển quốc gia.",
    "Lặng lẽ gấp chiếc áo đấu mới giặt mang số áo mơ ước trong tủ đồ cá nhân. Tự dặn lòng ngày mai phải nỗ lực gấp đôi ngày hôm nay.",
    "Cuộc gọi ngắn về cho gia đình sau giờ tập muộn. Nghe tiếng mẹ động viên, bao mệt mỏi thể xác dường như tan biến không còn dấu vết.",
    "Đứng bên đường pitch sân vận động chính nhìn các đàn anh đội một thi đấu dưới ánh đèn rực rỡ, tự nhủ chiếc áo đó sớm muộn cũng sẽ thuộc về mình.",
    "Một buổi tối yên tĩnh trong phòng ký túc xá, tỉ mỉ ghi chép những nhận xét khắt khe của HLV vào cuốn sổ tay cá nhân để khắc phục từng lỗi nhỏ.",
    "Bước vào phòng gym vắng tanh lúc sáng sớm khi sương mù còn chưa tan hết. Mỗi giọt mồ hôi rơi xuống hôm nay là một bước đệm cho ngày mai tỏa sáng.",
    "Khoảnh khắc được một danh thủ kỳ cựu của đội một nán lại vỗ vai khích lệ sau buổi tập chung khiến trái tim đập rộn ràng suốt cả buổi tối."
  ];

  return pickNonRepeatingTemplate(player, "ACADEMY_LIFE", pool);
}

/**
 * Hàm ghi nhật ký sự nghiệp cốt lõi (Core Career Log Handler)
 * Hỗ trợ ghi nhật ký có cấu trúc và render trực tiếp vào DOM nếu có giao diện
 */
export function logCareerEvent(player, eventCategory, eventData = {}, logType = "normal") {
  if (!player) return null;
  if (!player.careerLogs) player.careerLogs = [];

  let title = eventData.title || "NHẬT KÝ SỰ NGHIỆP";
  let body = eventData.body || "";
  let type = logType || eventData.type || "normal";

  if (eventCategory === "MATCH") {
    const narrative = generateRichMatchNarrative(player, eventData);
    title = narrative.title;
    body = narrative.body;
    type = narrative.type;
  } else if (eventCategory === "MEDIA") {
    const narrative = generateMediaInteractionNarrative(player, eventData.choiceType || eventData.type, eventData);
    title = narrative.title;
    body = narrative.body;
    type = narrative.type;
  } else if (eventCategory === "SKILL_BREAKTHROUGH") {
    const narrative = generateSkillBreakthroughNarrative(player, eventData.statChange || eventData);
    title = narrative.title;
    body = narrative.body;
    type = narrative.type;
  } else if (eventCategory === "ACADEMY_LIFE") {
    title = player.isAcademyStage ? "📖 Nhật Ký Tân Binh Học Viện" : "📖 Đời Thường & Tâm Lý Cầu Thủ";
    body = eventData.text || getRandomAcademyLifeSnippet(player);
    type = "normal";
  }

  const logItem = {
    title,
    body,
    type,
    category: eventCategory,
    age: player.age || 16,
    year: player.year || 2026,
    club: player.isAcademyStage ? (player.academy?.name || "Học viện") : (player.currentClub?.name || "CLB"),
    timestamp: Date.now()
  };
  player.careerLogs.unshift(logItem);
  if (player.careerLogs.length > 200) player.careerLogs.pop();

  if (typeof document !== "undefined") {
    const logContainer = document.getElementById("careerLog");
    if (logContainer) {
      const entry = document.createElement("div");
      entry.className = `log-entry ${type}`;
      const clubTitle = player.isAcademyStage 
        ? `${player.academy?.icon || "🏫"} ${player.academy?.name || "Học viện"}` 
        : `${player.currentClub?.icon || "⚽"} ${player.currentClub?.name || "CLB"} (${player.currentClub?.league?.name || ""})`;
      const curYearLog = player.year || 2026;
      entry.innerHTML = `
        <div class="log-head">
          <span class="log-age">NĂM ${player.age || 16} TUỔI (NĂM ${curYearLog})</span>
          <span class="log-club">${clubTitle}</span>
        </div>
        <div class="log-body"><strong>${title}</strong> — ${body}</div>
      `;
      logContainer.insertBefore(entry, logContainer.firstChild);
    }
  }

  return logItem;
}

export function addCareerLog(player, category, eventData = {}, logType = "normal") {
  return logCareerEvent(player, category, eventData, logType);
}

export {
  generateCommentary,
  getRandomGoalCommentary,
  getRandomAssistCommentary
} from './commentaryData.js';

/* =========================================================================
   CAREER CHRONICLE & MULTI-TIER SYSTEM HELPERS
   ========================================================================= */

/**
 * Ghi nhận một mốc son lịch sử vào Nhật Ký Sự Nghiệp (Career Chronicle)
 * @param {object} player
 * @param {string} milestoneId
 * @param {object} customData
 * @returns {object|null}
 */
export function recordChronicleMilestone(player, milestoneId, customData = {}) {
  if (!player) return null;
  if (!player.achievedMilestones) player.achievedMilestones = {};
  if (!player.careerChronicleLog) player.careerChronicleLog = [];

  const MILESTONE_DEFS = {
    DEBUT: {
      title: "Trận Ra Mắt Lịch Sử",
      desc: "Chính thức bước ra ánh sáng trong trận đấu đầu tiên của sự nghiệp quần đùi áo số!",
      badge: "⭐ RA MẮT ĐỘI 1",
      badgeColor: "gold",
      category: "matches",
      icon: "🌟"
    },
    FIRST_GOAL: {
      title: "Bàn Thắng Đầu Tiên",
      desc: "Pha lập công mở tài khoản bàn thắng cá nhân, mở ra trang sử của một sát thủ săn bàn!",
      badge: "⚽ BÀN THẮNG ĐẦU TIÊN",
      badgeColor: "green",
      category: "matches",
      icon: "🎯"
    },
    FIRST_HATTRICK: {
      title: "Hattrick Đầu Tiên Trong Sự Nghiệp",
      desc: "Màn trình diễn bùng nổ hủy diệt hàng phòng ngự đối phương với 3 bàn thắng trong 1 trận đấu!",
      badge: "🎩 HATTRICK LỊCH SỬ",
      badgeColor: "purple",
      category: "matches",
      icon: "🎩"
    },
    CLUTCH_MOMENT: {
      title: "Bàn Thắng Vàng Phút Bù Giờ (Clutch Moment)",
      desc: "Khoảnh khắc xuất thần định đoạt số phận trận đại chiến khi đồng hồ điểm những giây bù giờ cuối cùng!",
      badge: "⏱️ SIÊU SAO ĐỊNH ĐOẠT",
      badgeColor: "red",
      category: "matches",
      icon: "🔥"
    },
    FIRST_LEAGUE_TITLE: {
      title: "Đỉnh Cao Vô Địch Giải Đấu",
      desc: "Chạm tay vào chiếc cúp vô địch danh giá đầu tiên trong sự nghiệp cầu thủ chuyên nghiệp!",
      badge: "🏆 NHÀ VÔ ĐỊCH",
      badgeColor: "gold",
      category: "trophies",
      icon: "🏆"
    },
    FIRST_C1_TITLE: {
      title: "Đỉnh Cao Vinh Quang UEFA Champions League",
      desc: "Vô địch giải đấu danh giá nhất cấp CLB hành tinh, khắc tên vào ngôi đền huyền thoại Châu Âu!",
      badge: "👑 NHÀ VUA CHÂU ÂU",
      badgeColor: "gold",
      category: "trophies",
      icon: "⭐"
    },
    GOLDEN_SHOE: {
      title: "Chiếc Giày Vàng Châu Âu",
      desc: "Vượt qua tất cả những chân sút cự phách nhất lục địa già để giành danh hiệu Vua phá lưới số 1!",
      badge: "👟 VUA PHÁ LƯỚI",
      badgeColor: "gold",
      category: "trophies",
      icon: "👟"
    },
    BALLON_D_OR: {
      title: "Quả Bóng Vàng Thế Giới (Ballon d'Or)",
      desc: "Được vinh danh là Cầu thủ xuất sắc nhất hành tinh, bước lên ngai vàng bóng đá thế giới!",
      badge: "🥇 QUẢ BÓNG VÀNG",
      badgeColor: "gold",
      category: "trophies",
      icon: "👑"
    },
    MEGA_TRANSFER: {
      title: "Bom Tấn Chuyển Nhượng Toàn Cầu",
      desc: "Thực hiện thương vụ chuyển nhượng bom tấn chấn động làng túc cầu thế giới!",
      badge: "✈️ BOM TẤN CHUYỂN NHƯỢNG",
      badgeColor: "cyan",
      category: "transfers",
      icon: "💼"
    },
    OVERCAME_CRITICAL_INJURY: {
      title: "Bản Lĩnh Vượt Qua Chấn Thương Nặng",
      desc: "Chiến thắng bi kịch chấn thương dai dẳng, kiên cường trở lại sân cỏ với ý chí thép!",
      badge: "🛡️ BẢN LĨNH THÉP",
      badgeColor: "blue",
      category: "matches",
      icon: "💪"
    },
    MVP_AWARD: {
      title: "Cầu Thủ Xuất Sắc Nhất Giải Đấu (MVP)",
      desc: "Giành danh hiệu Cầu Thủ Xuất Sắc Nhất Giải Đấu (Tournament MVP / Player of the Season) danh giá!",
      badge: "🏅 CẦU THỦ XUẤT SẮC NHẤT",
      badgeColor: "gold",
      category: "trophies",
      icon: "🏅"
    },
    FIRST_CUP_TITLE: {
      title: "Vô Địch Cúp Quốc Gia",
      desc: "Nâng cao chiếc Cúp Quốc Gia danh giá sau trận chung kết nghẹt thở!",
      badge: "🏆 VÔ ĐỊCH CÚP QUỐC GIA",
      badgeColor: "gold",
      category: "trophies",
      icon: "🏆"
    },
    TIER_PROMOTION: {
      title: "Thăng Hạng Lên Đấu Trường Đỉnh Cao",
      desc: "Đưa đội bóng vượt qua mùa giải kịch tính để chính thức bước lên đẳng cấp thi đấu cao hơn!",
      badge: "🚀 THĂNG HẠNG TIER ĐỈNH CAO",
      badgeColor: "gold",
      category: "trophies",
      icon: "🚀"
    }
  };

  const def = MILESTONE_DEFS[milestoneId];
  if (!def) return null;

  // Với các mốc chỉ đạt 1 lần (First Goal, First Hattrick, Ballon d'Or...): kiểm tra xem đã từng đạt chưa
  const isRepeatable = ['CLUTCH_MOMENT', 'MEGA_TRANSFER', 'OVERCAME_CRITICAL_INJURY', 'MVP_AWARD', 'FIRST_CUP_TITLE'].includes(milestoneId);
  if (!isRepeatable && player.achievedMilestones[milestoneId]) {
    return null;
  }
  player.achievedMilestones[milestoneId] = true;

  const clubName = player.isAcademyStage 
    ? (player.academy?.name || 'Học viện đào tạo trẻ') 
    : (player.currentClub?.name || 'CLB Chuyên Nghiệp');

  const entry = {
    id: `chronicle_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    milestoneId: milestoneId,
    year: player.year || (2026 + (player.seasonsPlayed || 0)),
    age: player.age || 16,
    season: (player.seasonsPlayed || 0) + 1,
    phase: player.currentSeasonPhase || 1,
    club: clubName,
    title: customData.title || def.title,
    desc: customData.desc || def.desc,
    badge: def.badge,
    badgeColor: def.badgeColor,
    category: def.category, // 'matches' | 'transfers' | 'trophies'
    icon: def.icon,
    timestamp: Date.now()
  };

  player.careerChronicleLog.unshift(entry);

  // Kích hoạt phản ứng tương ứng vào Trung Tâm Dư Luận & Mạng Xã Hội (Media Feed)
  try {
    if (milestoneId === 'MVP_AWARD') {
      triggerMvpAwardMedia(player, customData.title || def.title, customData.compName || "Giải Đấu", customData.stat || "");
    } else if (milestoneId === 'FIRST_LEAGUE_TITLE' || milestoneId === 'FIRST_C1_TITLE' || milestoneId === 'FIRST_CUP_TITLE') {
      triggerTrophyWinMedia(player, customData.title || def.title, customData.compName || "Giải Đấu");
    } else if (milestoneId === 'BALLON_D_OR') {
      triggerBallonDorMedia(player, 1);
    } else if (milestoneId === 'CLUTCH_MOMENT') {
      addMediaReaction(player, {
        category: 'PRESS',
        badge: 'PURPLE',
        source: 'Sky Sports Breaking News',
        author: 'Ban Thể Thao Châu Âu',
        role: 'Phân tích trực tiếp',
        avatar: '🔥',
        headline: 'SIÊU SAO ĐỊNH ĐOẠT: BÀN THẮNG VÀNG PHÚT BÙ GIỜ CỦA [Tên Cầu Thủ]!',
        content: 'Khoảnh khắc không tưởng làm nổ tung cầu trường! [Tên Cầu Thủ] một lần nữa chứng minh bản lĩnh của một ngôi sao lớn với pha lập công định đoạt số phận trận đấu khi đồng hồ điểm những giây bù giờ cuối cùng!',
        highlightTag: '⏱️ CLUTCH MOMENT 90+'
      });
      addMediaReaction(player, {
        category: 'FAN',
        badge: 'BLUE',
        source: 'Twitter / X',
        author: '@ClutchKingWatcher',
        role: 'CĐV Cuồng Nhiệt',
        avatar: '💬',
        content: 'TIM TÔI NHƯ RỚT RA NGOÀI! Bàn thắng phút bù giờ của [Tên Cầu Thủ] là khoảnh khắc điên rồ nhất mùa giải này! Đẳng cấp siêu sao không thể phủ nhận! 💥⚽🔥',
        metrics: { likes: '89.4K', retweets: '27.8K', comments: '1.9K' }
      });
    } else if (milestoneId === 'FIRST_HATTRICK') {
      addMediaReaction(player, {
        category: 'PRESS',
        badge: 'PURPLE',
        source: 'The Athletic',
        author: 'James Pearce',
        role: 'Ký giả cấp cao',
        avatar: '🎩',
        headline: 'CÚ HATTRICK ĐỂ ĐỜI: [Tên Cầu Thủ] HỦY DIỆT HÀNG PHÒNG NGỰ ĐỐI PHƯƠNG!',
        content: 'Ba bàn thắng, một đẳng cấp vượt trội. [Tên Cầu Thủ] đã mang đến một bữa tiệc bóng đá thịnh soạn khiến hàng thủ đối phương hoàn toàn bất lực. Trái bóng trận đấu đã thuộc về người xứng đáng nhất!',
        highlightTag: '🎩 HATTRICK LỊCH SỬ'
      });
    }
  } catch (err) {
    console.error("Error triggering milestone media reaction:", err);
  }

  return entry;
}

/**
 * Cập nhật cấp bậc đấu trường và chỉ số danh vọng CLB (Club Prestige)
 * @param {object} player
 * @returns {object}
 */
export function updateCompetitionTier(player) {
  if (!player) return null;
  if (!player.competitionTier) {
    player.competitionTier = {
      currentTier: 3,
      tierName: 'Tier 3: Giải Trẻ & Đào Tạo',
      clubPrestige: 35,
      qualificationStatus: 'YOUTH_LEAGUE',
      relegationThreat: false,
      tierDifficultyFactor: 0.80
    };
  }

  if (player.isAcademyStage || !player.currentClub) {
    player.competitionTier.currentTier = 3;
    player.competitionTier.tierName = 'Tier 3: Giải Trẻ & Đào Tạo';
    player.competitionTier.tierDifficultyFactor = 0.80;
    player.competitionTier.qualificationStatus = 'UEFA Youth League';
    player.competitionTier.relegationThreat = false;
    player.competitionTier.clubPrestige = Math.min(60, 30 + Math.round(Math.min(25, Math.sqrt(player.fame || 0) * 0.8)));
    return player.competitionTier;
  }

  const league = player.currentClub.league;
  const leagueId = league ? league.id : '';
  const top5 = ['PREMIER_LEAGUE', 'LA_LIGA', 'SERIE_A', 'BUNDESLIGA', 'LIGUE_1'];

  if (top5.includes(leagueId)) {
    player.competitionTier.currentTier = 1;
    player.competitionTier.tierName = `Tier 1: Đỉnh Cao Châu Âu (${league.name})`;
    player.competitionTier.tierDifficultyFactor = 1.25;
    player.competitionTier.clubPrestige = Math.max(70, Math.min(99, player.currentClub.power + Math.round(Math.min(10, Math.sqrt(player.fame || 0) * 0.1))));
  } else if (leagueId === 'EURO_SUB') {
    player.competitionTier.currentTier = 2;
    player.competitionTier.tierName = `Tier 2: Hạng Nhất Châu Âu (${league.name})`;
    player.competitionTier.tierDifficultyFactor = 1.00;
    player.competitionTier.clubPrestige = Math.max(50, Math.min(80, player.currentClub.power));
  } else {
    // Saudi Pro, MLS / Americas
    player.competitionTier.currentTier = 3;
    player.competitionTier.tierName = `Tier 3: Giải Đang Phát Triển (${league ? league.name : 'Quốc Tế'})`;
    player.competitionTier.tierDifficultyFactor = 0.85;
    player.competitionTier.clubPrestige = Math.max(40, Math.min(75, player.currentClub.power));
  }

  if (player.currentEuroStatus === 'C1') {
    player.competitionTier.qualificationStatus = '⭐ Vé UEFA Champions League (C1)';
  } else if (player.currentEuroStatus === 'C2') {
    player.competitionTier.qualificationStatus = '🌍 Vé UEFA Europa League (C2)';
  } else if (player.currentEuroStatus === 'C3') {
    player.competitionTier.qualificationStatus = '🌐 Vé UEFA Conference League (C3)';
  } else {
    player.competitionTier.qualificationStatus = 'Đấu trường VĐQG nội địa';
  }

  return player.competitionTier;
}

/* =========================================================================
   MEDIA & FAN REACTION HUB (TRUYỀN THÔNG & DƯ LUẬN)
   ========================================================================= */

/**
 * Đảm bảo mảng mediaFeed luôn tồn tại và có các tin tức khởi đầu (Scout report / Chào đón)
 * @param {object} player 
 */
export function ensurePlayerMediaFeed(player) {
  if (!player) return [];
  if (!Array.isArray(player.mediaFeed)) {
    player.mediaFeed = [];
  }
  if (player.mediaFeed.length === 0) {
    const clubName = player.isAcademyStage 
      ? (player.academy?.name || "Học viện bóng đá") 
      : (player.currentClub?.name || "CLB Chuyên Nghiệp");
    const playerName = player.name || "Tân binh";

    addMediaReaction(player, {
      category: 'PRESS',
      badge: 'BLUE',
      source: 'Báo Bóng Đá & Ký Giả Trẻ',
      author: 'Chuyên trang Tuyển Trạch Toàn Quốc',
      role: 'Báo chí thể thao',
      avatar: '🗞️',
      headline: `BƯỚC RA ÁNH SÁNG: ${playerName.toUpperCase()} CHÍNH THỨC GIA NHẬP ${clubName.toUpperCase()}!`,
      content: `Các chuyên gia tuyển trạch đánh giá rất cao tiềm năng và tố chất bẩm sinh của ${playerName}. Hành trình vươn mình từ học viện trẻ bước ra vũ đài đỉnh cao chính thức bắt đầu!`,
      highlightTag: '🌱 TÀI NĂNG TRẺ'
    });
  }
  return player.mediaFeed;
}

/**
 * Thêm một phản ứng truyền thông / bình luận MXH mới vào feed người chơi (giới hạn 50 tin mới nhất)
 * @param {object} player 
 * @param {object} reaction 
 * @returns {object|null}
 */
export function addMediaReaction(player, reaction = {}) {
  if (!player) return null;
  if (!Array.isArray(player.mediaFeed)) {
    player.mediaFeed = [];
  }

  const playerName = player.name || "Cầu thủ";
  const clubName = player.isAcademyStage 
    ? (player.academy?.name || "Học viện") 
    : (player.currentClub?.name || "CLB");

  const item = {
    id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
    season: player.seasonCount || (player.seasonsPlayed || 0) + 1,
    age: player.age || 16,
    timeLabel: reaction.timeLabel || `Mùa ${player.seasonCount || (player.seasonsPlayed || 0) + 1}${player.currentFixtureIndex != null ? ` • Vòng ${player.currentFixtureIndex + 1}` : ''}`,
    category: reaction.category || 'PRESS', // 'PRESS' | 'FAN' | 'TEAM' | 'AWARDS'
    badge: reaction.badge || 'NORMAL',      // 'GOLD' | 'CHAMPION' | 'PURPLE' | 'BLUE' | 'NORMAL'
    source: reaction.source || "Báo Thể Thao",
    author: reaction.author || "Ký giả thể thao",
    role: reaction.role || "Truyền thông",
    avatar: reaction.avatar || "🗞️",
    verified: reaction.verified !== undefined ? reaction.verified : true,
    headline: (reaction.headline || "")
      .replace(/\[Tên Cầu Thủ\]/g, playerName)
      .replace(/\[CLB\]/g, clubName),
    content: (reaction.content || "")
      .replace(/\[Tên Cầu Thủ\]/g, playerName)
      .replace(/\[CLB\]/g, clubName),
    metrics: reaction.metrics || null,
    highlightTag: reaction.highlightTag || null
  };

  player.mediaFeed.unshift(item);

  // Giới hạn bộ nhớ tối đa 50 tin mới nhất để giữ file save nhẹ
  if (player.mediaFeed.length > 50) {
    player.mediaFeed.length = 50;
  }

  return item;
}

/**
 * Kích hoạt phản ứng truyền thông cho màn trình diễn xuất thần (Match Rating >= 9.0)
 * @param {object} player 
 * @param {object} matchData 
 */
export function triggerMatchRatingMedia(player, matchData = {}) {
  if (!player) return;
  const rating = Number(matchData.rating || 9.0).toFixed(1);
  const roundText = matchData.roundName || `Vòng ${(player.currentFixtureIndex || 0) + 1}`;

  // 1. Bài viết phân tích từ báo chí uy tín quốc tế
  const pressSources = [
    { source: "The Athletic", author: "David Ornstein", role: "Chuyên gia phân tích độc quyền", avatar: "🗞️" },
    { source: "L'Équipe", author: "Vincent Duluc", role: "Trưởng ban túc cầu Châu Âu", avatar: "🗞️" },
    { source: "Sky Sports Football", author: "Gary Neville & Jamie Carragher", role: "Bình luận viên Super Sunday", avatar: "📺" },
    { source: "Marca", author: "José Félix Díaz", role: "Ký giả kỳ cựu", avatar: "🗞️" }
  ];
  const pSrc = pressSources[Math.floor(Math.random() * pressSources.length)];

  addMediaReaction(player, {
    category: 'PRESS',
    badge: 'PURPLE',
    source: pSrc.source,
    author: pSrc.author,
    role: pSrc.role,
    avatar: pSrc.avatar,
    headline: `CƠN CUỒNG PHONG [Tên Cầu Thủ] CUỐN PHĂNG ĐỐI THỦ! CHẤM ĐIỂM ${rating} TUYỆT ĐỐI!`,
    content: `Một màn trình diễn thăng hoa tột đỉnh! [Tên Cầu Thủ] đã biến trận đấu tại ${roundText} thành sân khấu độc diễn của riêng mình. Không một hàng phòng ngự nào có thể ngăn cản bước chạy và sự bùng nổ của siêu sao này hôm nay!`,
    highlightTag: `🔥 ĐIỂM SỐ ${rating} SIÊU THỰC`
  });

  // 2. Tweet / Bình luận mạng xã hội viral từ cộng đồng CĐV
  const fanTweets = [
    {
      author: "@TacticalMastery",
      role: "Nhà phân tích chiến thuật",
      content: `Xem [Tên Cầu Thủ] đá bóng hôm nay đúng là một đặc ân! Hãy trao luôn mọi danh hiệu cá nhân cho cậu ấy đi! 90 phút vừa rồi không phải bóng đá thông thường, đó là một buổi biểu diễn nghệ thuật thuần khiết! ✨⚽`,
      likes: `${(Math.random() * 50 + 100).toFixed(1)}K`,
      retweets: `${(Math.random() * 20 + 25).toFixed(1)}K`,
      comments: `${(Math.random() * 2 + 1).toFixed(1)}K`
    },
    {
      author: "@FootballFanatic_HQ",
      role: "CĐV Toàn Cầu",
      content: `Trời đất ơi, vừa chứng kiến điều kỳ diệu gì thế này?! [Tên Cầu Thủ] đang chơi thứ bóng đá đến từ một hành tinh khác! Cả khán đài đã phải đồng loạt đứng dậy vỗ tay tán thưởng sau hồi còi mãn cuộc! 👏🔥`,
      likes: `${(Math.random() * 40 + 80).toFixed(1)}K`,
      retweets: `${(Math.random() * 15 + 18).toFixed(1)}K`,
      comments: `${(Math.random() * 1.5 + 0.8).toFixed(1)}K`
    }
  ];

  const chosenTweet = fanTweets[Math.floor(Math.random() * fanTweets.length)];
  addMediaReaction(player, {
    category: 'FAN',
    badge: 'PURPLE',
    source: 'Twitter / X',
    author: chosenTweet.author,
    role: chosenTweet.role,
    avatar: '💬',
    content: chosenTweet.content,
    metrics: { likes: chosenTweet.likes, retweets: chosenTweet.retweets, comments: chosenTweet.comments },
    highlightTag: '⚡ VIRAL SOCIAL MEDIA'
  });
}

/**
 * Kích hoạt phản ứng truyền thông khi đoạt danh hiệu Cầu Thủ Xuất Sắc Nhất Giải (MVP)
 * @param {object} player 
 * @param {string} mvpTitle 
 * @param {string} compName 
 * @param {string} mvpScore 
 */
export function triggerMvpAwardMedia(player, mvpTitle = "Cầu Thủ Xuất Sắc Nhất", compName = "Giải Đấu", mvpScore = "") {
  if (!player) return;

  // 1. Phỏng vấn ca ngợi từ Huấn luyện viên trưởng
  addMediaReaction(player, {
    category: 'TEAM',
    badge: 'GOLD',
    source: 'Họp Báo Chính Thức Sau Giải Đấu',
    author: 'Huấn Luyện Viên Trưởng',
    role: 'HLV Trưởng [CLB]',
    avatar: '👔',
    headline: `HLV Trưởng: "Cậu ấy là món quà của bóng đá thế giới"`,
    content: `“Cậu ấy là món quà của bóng đá. Danh hiệu ${mvpTitle} hoàn toàn xứng đáng với những nỗ lực không tưởng trên sân tập mỗi ngày. Ở độ tuổi trẻ như vậy mà gánh vác cả đội bóng trên vai, tôi không còn mỹ từ nào để khen ngợi [Tên Cầu Thủ]!”`,
    highlightTag: '👔 PHÁT BIỂU HLV TRƯỞNG'
  });

  // 2. Trích dẫn xúc động từ Đội trưởng / Đồng đội trong phòng thay đồ
  addMediaReaction(player, {
    category: 'TEAM',
    badge: 'GOLD',
    source: 'Phòng Thay Đồ & Mixed Zone',
    author: 'Đội Trưởng & Toàn Đội',
    role: 'Đại diện cầu thủ [CLB]',
    avatar: '🤝',
    headline: `Đội Trưởng: "Chiếc cúp MVP này là niềm tự hào chung của cả phòng thay đồ"`,
    content: `“Được thi đấu bên cạnh [Tên Cầu Thủ] là một niềm vinh dự lớn. Cậu ấy truyền cảm hứng cho toàn đội mỗi khi bóng chạm chân. Chúng tôi biết khi chuyền bóng cho cậu ấy, điều kỳ diệu sẽ xảy ra. Chiếc cúp MVP này là niềm tự hào chung của toàn đội!”`,
    highlightTag: '🤝 ĐỒNG ĐỘI TÔN VINH'
  });

  // 3. Tin tức Breaking News từ ký giả quốc tế
  addMediaReaction(player, {
    category: 'AWARDS',
    badge: 'GOLD',
    source: 'Fabrizio Romano (Official)',
    author: '@FabrizioRomano',
    role: 'Ký giả tin tức & chuyển nhượng số 1 thế giới',
    avatar: '🌟',
    headline: `CHÍNH THỨC: [Tên Cầu Thủ] THỐNG TRỊ ${compName.toUpperCase()} VỚI DANH HIỆU MVP!`,
    content: `Chính thức: [Tên Cầu Thủ] thống trị ${compName} với danh hiệu Cầu Thủ Xuất Sắc Nhất Giải${mvpScore ? ` (${mvpScore})` : ''}! Một mùa giải đi vào lịch sử túc cầu. Tất cả các tuyển trạch viên hàng đầu thế giới đang dõi theo từng bước chạy của viên ngọc quý này! 🚨💎`,
    metrics: { likes: '342.6K', retweets: '89.4K', comments: '6.8K' },
    highlightTag: '🌟 TOURNAMENT MVP'
  });
}

/**
 * Kích hoạt phản ứng truyền thông khi vô địch giải đấu tập thể
 * @param {object} player 
 * @param {string} trophyName 
 * @param {string} compName 
 */
export function triggerTrophyWinMedia(player, trophyName = "Cúp Vô Địch", compName = "Giải Đấu") {
  if (!player) return;

  // 1. Fan diễu hành ăn mừng cuồng nhiệt trên MXH
  addMediaReaction(player, {
    category: 'FAN',
    badge: 'CHAMPION',
    source: 'Twitter / X Trending #CHAMPIONS',
    author: '@ClubFanbaseGlobal',
    role: 'Cộng đồng CĐV toàn cầu',
    avatar: '🏆',
    headline: `BIỂN NGƯỜI ĐỔ RA ĐƯỜNG ĂN MỪNG CHỨC VÔ ĐỊCH ${trophyName.toUpperCase()}!`,
    content: `Hàng triệu CĐV đang đổ ra đường diễu hành ăn mừng chức vô địch ${trophyName}! [Tên Cầu Thủ] chính là linh hồn và người hùng đưa chúng ta bước lên đỉnh vinh quang sau chiến dịch xưng vương nghẹt thở! 🏆🎉🔴⚪`,
    metrics: { likes: '280.5K', retweets: '64.2K', comments: '5.1K' },
    highlightTag: '🏆 BIỂN NGƯỜI ĂN MỪNG'
  });

  // 2. Huyền thoại CLB lên tiếng trên truyền hình
  addMediaReaction(player, {
    category: 'PRESS',
    badge: 'CHAMPION',
    source: 'BBC Match of the Day',
    author: 'Huyền Thoại CLB',
    role: 'Chuyên gia bình luận bóng đá',
    avatar: '👑',
    headline: `Huyền Thoại CLB: "[Tên Cầu Thủ] sở hữu DNA của một nhà vô địch vĩ đại"`,
    content: `“Đã rất lâu rồi tôi mới thấy một cầu thủ có tầm ảnh hưởng lên lối chơi và tinh thần toàn đội lớn đến như vậy trong chiến dịch xưng vương. Chiếc cúp ${trophyName} này mới chỉ là sự khởi đầu cho một triều đại thống trị!”`,
    highlightTag: '👑 HUYỀN THOẠI LÊN TIẾNG'
  });

  // 3. Trang bìa báo quốc tế
  addMediaReaction(player, {
    category: 'AWARDS',
    badge: 'CHAMPION',
    source: "L'Équipe & Marca Cover",
    author: 'Ban Biên Tập Thể Thao Quốc Tế',
    role: 'Trang nhất nhật báo thể thao',
    avatar: '🗞️',
    headline: `ĐỈNH CAO DANH VỌNG: [Tên Cầu Thủ] BƯỚC LÊN NGAI VÀNG ${trophyName.toUpperCase()}!`,
    content: `Chiến thắng lịch sử! [Tên Cầu Thủ] cùng các đồng đội nâng cao chiếc cúp vô địch ${trophyName} sau một mùa giải áp đảo toàn diện. Lịch sử đã khắc tên những nhà vô địch xứng đáng nhất!`,
    highlightTag: '🏆 NHÀ VÔ ĐỊCH'
  });
}

/**
 * Kích hoạt phản ứng truyền thông khi đoạt Quả Bóng Vàng (Ballon d'Or)
 * @param {object} player 
 * @param {number} rank 
 */
export function triggerBallonDorMedia(player, rank = 1) {
  if (!player) return;

  if (rank === 1) {
    addMediaReaction(player, {
      category: 'AWARDS',
      badge: 'GOLD',
      source: 'France Football (Ballon d\'Or Official)',
      author: 'Ban Tổ Chức Quả Bóng Vàng',
      role: 'Gala Nhà Hát Châtelet Paris',
      avatar: '👑',
      headline: `CHÍNH THỨC: [Tên Cầu Thủ] ĐOẠT QUẢ BÓNG VÀNG THẾ GIỚI (BALLON D'OR)!`,
      content: `Lễ trao giải Ballon d'Or tại Paris chính thức xướng tên [Tên Cầu Thủ] là Cầu Thủ Xuất Sắc Nhất Hành Tinh! Thế giới túc cầu chính thức đón chào một vị vua mới ngự trị trên đỉnh cao nhất của bóng đá thế giới!`,
      metrics: { likes: '1.5M', retweets: '520.4K', comments: '35.6K' },
      highlightTag: '👑 QUẢ BÓNG VÀNG THẾ GIỚI'
    });

    addMediaReaction(player, {
      category: 'FAN',
      badge: 'GOLD',
      source: 'Twitter / X Trending #1 Worldwide',
      author: '@WorldFootballNews',
      role: 'Kênh tin tức bóng đá toàn cầu',
      avatar: '💬',
      content: `Không còn bất kỳ tranh cãi nào nữa: [Tên Cầu Thủ] là CẦU THỦ XUẤT SẮC NHẤT HÀNH TINH! Cả thế giới bóng đá đang nghiêng mình trước thiên tài này! #BallonDor #GOAT 🐐🏆✨`,
      metrics: { likes: '890.2K', retweets: '235.1K', comments: '18.7K' },
      highlightTag: '🐐 #GOAT TRENDING #1'
    });
  }
}
