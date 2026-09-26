/* =========================================================================
   FOOTBALL CAREER SIMULATOR — DYNAMIC COMMENTARY ENGINE
   ========================================================================= */

/**
 * Ngân hàng bình luận truyền hình động phong phú, đa ngữ cảnh.
 * Chứa các kịch bản tường thuật nhiều nhịp thay vì câu ngắn khô khan.
 */

export const COMMENTARY_BANK = {
  // ── 1. Khai cuộc & Nhịp độ ban đầu ──────────────────────────────────────
  KICKOFF: [
    (ctx) => `Trọng tài chính nổi hồi còi khai cuộc! Trận đại chiến giữa <strong>${ctx.homeName}</strong> và <strong>${ctx.awayName}</strong> chính thức bắt đầu trong bầu không khí cuồng nhiệt của hơn 80,000 khán giả!`,
    (ctx) => `Bóng đã lăn trên thảm cỏ xanh! Cả hai đội nhập cuộc với tốc độ chóng mặt, sẵn sàng cho 90 phút nảy lửa định đoạt danh vọng!`,
    (ctx) => `Tiếng còi bắt đầu vang lên! <strong>${ctx.homeName}</strong> lập tức dâng cao đội hình áp sát, tạo nên thế trận pressing nghẹt thở ngay từ những giây đầu tiên.`
  ],

  // ── 2. Khu vực Sân nhà / Thoát pressing ─────────────────────────────────
  DEFENSIVE_THIRD: [
    (ctx) => `Đối phương tổ chức pressing tầm cao cực kỳ rát. ${ctx.playerName} chủ động lùi sâu nhận bóng, dùng động tác giả xoay người điềm tĩnh giải tỏa áp lực cho hàng thủ!`,
    (ctx) => `Tình huống che chắn bóng mẫu mực ngay trước vòng cấm đội nhà. ${ctx.playerName} chuyền một chạm chuẩn xác mở ra đường thoát pressing thanh thoát.`,
    (ctx) => `Hàng thủ ${ctx.teamName} vừa phải căng mình chống đỡ đợt hãm thành liên hoàn. ${ctx.playerName} can thiệp dũng mãnh, đoạt lại quyền kiểm soát bóng!`
  ],

  // ── 3. Khu vực Trung lộ / Tranh chấp & Điều phối ────────────────────────
  MIDFIELD_BATTLE: [
    (ctx) => `Pha tranh chấp nảy lửa ở khu vực giữa sân! ${ctx.playerName} cài người thông minh, cướp bóng trong chân đối thủ rồi tung đường chuyền chọc khe xuyên tuyến cực kỳ hiểm hóc!`,
    (ctx) => `${ctx.playerName} thể hiện nhãn quan chiến thuật thượng thừa, xoay compa 360 độ loại bỏ tiền vệ đánh chặn đối phương trước khi mở bóng sang hành lang cánh!`,
    (ctx) => `Nhịp độ trận đấu được đẩy lên nghẹt thở. Tuyến giữa của ${ctx.teamName} đang làm chủ hoàn toàn vòng tròn trung tâm nhờ khả năng phân phối bóng đỉnh cao.`
  ],

  // ── 4. Khu vực Tấn công / Cận kề vòng cấm ────────────────────────────────
  ATTACKING_THIRD: [
    (ctx) => `Tấn công dồn dập! Bóng được luân chuyển nhanh vào nách trung lộ. ${ctx.playerName} bứt tốc như một chiếc F1 xé toang bẫy việt vị, áp sát cầu môn!`,
    (ctx) => `Cơ hội mười mươi xuất hiện! ${ctx.playerName} đón bóng hai sau pha phá bóng lúng túng của hậu vệ đối phương, góc sút đang mở toang trước mắt!`,
    (ctx) => `Phối hợp đập nhả tam giác mê hồn ngay trước vòng cấm địa! ${ctx.playerName} xâm nhập vòng cấm với một tư thế vô cùng thuận lợi!`
  ],

  // ── 5. Cú sút & Bàn thắng đa phong cách (Goal Templates) ────────────────
  GOAL_SCORED: [
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⚽ ⚽ VÀOOO! Cú vẽ đường cong hoàn mỹ từ rìa vòng cấm của ${s}, bóng lượn qua tầm với thủ môn rồi găm thẳng vào góc xa, mở tỷ số cho ${c}!`;
    },
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⚽ ⚽ SIÊU PHẨM SẤM SÉT! Cú nã đại bác uy lực của ${s} găm thẳng vào góc chữ A, làm nổ tung cầu trường cho ${c}!`;
    },
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⚽ ⚽ ĐÁNH ĐẦU TUNG LƯỚI! ${s} bật cao đè mặt trung vệ đối phương, lắc đầu hiểm hóc đưa bóng đập đất bay vào lưới cho ${c}!`;
    },
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⚽ ⚽ BÀN THẮNG ĐẲNG CẤP! Pha bứt tốc xé gió của ${s} loại bỏ hàng thủ rồi lạnh lùng đánh bại thủ môn trong thế đối mặt, lập công cho ${c}!`;
    },
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⚽ ⚽ BÀN THẮNG! Khả năng đánh hơi khoảng trống tuyệt vời của ${s}! Cú ra chân một chạm cận thành đầy sắc bén làm rung mành lưới đối phương cho ${c}!`;
    },
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⚽ ⚽ KHÔNG THỂ NGĂN CẢN! ${s} độc diễn qua hai trung vệ rồi lạnh lùng dứt điểm chìm đánh lừa người gác đền! Khoảnh khắc thiên tài ghi bàn cho ${c}!`;
    },
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      const a = ctx.assistName ? ` sau pha dọn cỗ mẫu mực của ${ctx.assistName}` : '';
      return `⚽ ⚽ BÀN THẮNG TUYỆT VĨ! Pha xử lý đẳng cấp siêu sao! ${s} đệm bóng cận thành tinh tế${a}, làm nổ tung cầu trường cho ${c}!`;
    }
  ],

  // ── 6. Bàn thắng trận cầu hủy diệt (khi cách biệt >= 4 bàn) ─────────────
  BLOWOUT_GOAL: [
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⚽ ⚽ CƠN LỐC TẤN CÔNG KHÔNG THỂ NGĂN CHẶN! ${s} tiếp tục điền tên lên bảng tỷ số cho ${c}! Hàng thủ đối phương sụp đổ hoàn toàn trước sức ép nghẹt thở!`;
    },
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⚽ ⚽ MỘT NGÀY THI ĐẤU ÁC MỘNG! ${s} lập công đào sâu cách biệt cho ${c}! Đối phương hoàn toàn vỡ trận trước sức ép dồn dập!`;
    },
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⚽ ⚽ CƠN ĐỊA CHẤN HỦY DIỆT! Bàn thắng tiếp theo của ${s} cho ${c}! Trận đấu đã hoàn toàn an bài với sự vượt trội đến tàn nhẫn trên từng mét vuông cỏ!`;
    },
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⚽ ⚽ MÀN HỦY DIỆT KHÔNG THƯƠNG TIẾC! ${s} nổ súng rực sáng cho ${c}! Cơn mưa bàn thắng không có dấu hiệu dừng lại, khán đài đang mở hội ăn mừng!`;
    }
  ],

  // ── 7. Kiến tạo & Phối hợp (Assist Templates) ──────────────────────────
  ASSIST_SCORED: [
    (ctx) => {
      const p = ctx.playerName || 'Bạn';
      const s = ctx.scorerName || 'đồng đội';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `🎯 ⚽ ĐƯỜNG CHUYỀN THIÊN TÀI! ${p} chọc khe xuyên tuyến loại bỏ toàn bộ hệ thống phòng ngự, ${s} ập vào dứt điểm mười mươi ghi bàn cho ${c}!`;
    },
    (ctx) => {
      const p = ctx.playerName || 'Bạn';
      const s = ctx.scorerName || 'đồng đội';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `🎯 ⚽ DỌN CỖ KHÔNG TƯỞNG! ${p} đi bóng vặn sườn hậu vệ biên rồi tạt điểm rơi như đặt vào vòng cấm, ${s} chỉ việc đệm bóng vào lưới trống cho ${c}!`;
    },
    (ctx) => {
      const p = ctx.playerName || 'Bạn';
      const s = ctx.scorerName || 'đồng đội';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `🎯 ⚽ BAN BẬT MÊ HOẶC! ${p} phối hợp một-hai xé toang trung lộ, đường nhả bóng tinh tế vừa tầm băng lên để ${s} dứt điểm thành bàn cho ${c}!`;
    },
    (ctx) => {
      const p = ctx.playerName || 'Bạn';
      const s = ctx.scorerName || 'đồng đội';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `🎯 ⚽ ĐƯỜNG BẤM BÓNG ĐẲNG CẤP! Cú bấm mu điệu nghệ của ${p} đưa bóng rót qua đầu hàng thủ, ${s} ập vào dứt điểm tung nóc lưới cho ${c}!`;
    },
    (ctx) => {
      const p = ctx.playerName || 'Bạn';
      const s = ctx.scorerName || 'đồng đội';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `🎯 ⚽ TẠT BÓNG ĐIỂM RƠI XUẤT THẦN! Quả tạt có độ cuộn và điểm rơi mẫu mực của ${p} loại bỏ hoàn toàn cặp trung vệ cho ${s} đệm bóng cận thành cho ${c}!`;
    },
    (ctx) => {
      const p = ctx.playerName || 'Bạn';
      const s = ctx.scorerName || 'đồng đội';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `🎯 ⚽ NHẠC TRƯỞNG BẬC THẦY! Nhịp chạm bóng tinh tế của ${p} mở toang hành lang tấn công, đường chuyền quyết định giúp ${s} lập công cho ${c}!`;
    }
  ],

  // ── 8. Bỏ lỡ cơ hội / Thủ môn cứu thua ──────────────────────────────────
  MISSED_CHANCE: [
    (ctx) => `KHÔNG VÀO!! Cú dứt điểm hiểm hóc của ${ctx.playerName} đã vượt qua tầm với thủ môn nhưng bóng lại liếm mép ngoài cột dọc bay ra ngoài! Quá đáng tiếc!`,
    (ctx) => `CỨU THUA XUẤT THẦN! Pha đánh đầu dũng mãnh của ${ctx.playerName} tưởng chừng đã thành bàn nhưng thủ thành đối phương đã tung người đẩy bóng bằng những đầu ngón tay!`,
    (ctx) => `Pha sút bóng đi vọt xà ngang trong gang tấc! Áp lực từ hậu vệ bám đuổi đã khiến cú chạm bóng cuối cùng của ${ctx.playerName} thiếu đi một chút nắn nót.`
  ],

  // ── 9. Ngữ cảnh đặc biệt: Đại Chiến Derby & Chung Kết Cúp ────────────────
  DERBY_SPECIAL: [
    (ctx) => `🔥 ĐẠI CHIẾN NẢY LỬA: Khán đài rực đỏ pháo sáng và những tiếng hò reo inh tai nhức óc! Cầu thủ hai bên không ngần ngại vào bóng quyết liệt trong từng mét vuông cỏ!`,
    (ctx) => `🔥 BẦU KHÔNG KHÍ NGHẸT THỞ: Đây không chỉ là một trận bóng thông thường, đây là danh dự và niềm kiêu hãnh của cả thành phố! Không ai muốn chịu lùi bước dù chỉ một nhịp!`,
    (ctx) => `🔥 ĐỈNH ĐIỂM CĂNG THẲNG: Một pha va chạm nảy lửa khiến cầu thủ hai đội lao vào nhau tranh cãi! Trọng tài phải can thiệp để làm nguội những cái đầu nóng!`
  ],

  // ── 10. Bàn thắng phút bù giờ định đoạt (Clutch 90+) ─────────────────────
  CLUTCH_MOMENT_GOAL: [
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⏱️ ⚽ VÀOOOOOOOO ĐIÊN RỒ! CẢ SÂN VẬN ĐỘNG NỔ TUNG! Đúng những giây bù giờ cuối cùng, ${s} tỏa sáng rực rỡ với bàn thắng vàng ấn định chiến thắng cho ${c}! Cảm xúc vỡ òa không thể kìm nén!`;
    },
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⏱️ ⚽ KỊCH BẢN KHÔNG TƯỞNG! Bàn thắng định đoạt số phận trận đấu ở phút bù giờ! ${s} đã khắc tên mình vào lịch sử với pha lập công quý hơn vàng ròng cho ${c}!`;
    },
    (ctx) => {
      const s = ctx.scorerName || ctx.playerName || 'Cầu thủ';
      const c = ctx.clubName || ctx.teamName || 'đội nhà';
      return `⏱️ ⚽ KHOẢNH KHẮC HUYỀN THOẠI! Nước mắt và nụ cười hòa quyện trên khán đài! Một pha xử lý lạnh như băng của ${s} đánh gục hy vọng của đối thủ, mang về chiến thắng nghẹt thở cho ${c}!`;
    }
  ],

  // ── 11. Tâm lý sa sút & Căng thẳng kỷ luật ──────────────────────────────
  FRUSTRATION_AND_CARDS: [
    (ctx) => `⚠️ CĂNG THẲNG LEO THANG: Tinh thần sa sút khi đội nhà bị dẫn trước. Một pha vào bóng quá mức cần thiết dẫn đến chiếc THẺ VÀNG cảnh cáo từ trọng tài!`,
    (ctx) => `⚠️ BẤT LỰC & ỨC CHẾ: Trọng tài cắt còi sau pha phạm lỗi kéo áo lộ liễu của ${ctx.playerName}. Cần phải giữ được sự bình tĩnh nếu không muốn nhận hậu quả nặng hơn!`,
    (ctx) => `⚠️ VA CHẠM NẢY LỬA: Pha tranh cãi quyết liệt với trọng tài biên vì một quả ném biên gây tranh cãi. Không khí trận đấu đang trở nên cực kỳ độc hại!`
  ],

  // ── 12. Kiệt sức sau phút 70 ───────────────────────────────────────────
  FATIGUE_WARNING: [
    (ctx) => `💤 BÁO ĐỘNG THỂ LỰC: ${ctx.playerName} có dấu hiệu hụt hơi sau quãng đường di chuyển liên tục. Những bước chạy đã trở nên nặng trĩu, độ chính xác xử lý bóng giảm rõ rệt.`,
    (ctx) => `💤 THỂ LỰC SUY GIẢM: Đôi chân mỏi mệt khiến nhịp xử lý bóng của ${ctx.playerName} dài hơn thường lệ, tạo cơ hội cho hậu vệ đối phương can thiệp cướp bóng.`
  ]
};

let lastGoalIndex = -1;
let lastAssistIndex = -1;

/**
 * Sinh bình luận bàn thắng đa phong cách ngẫu nhiên, chống lặp liên tiếp
 */
export function getRandomGoalCommentary(context = {}) {
  const isBlowout = Boolean(context.isBlowout);
  const isClutch = Boolean(context.min >= 90 || context.isClutch);

  let pool = COMMENTARY_BANK.GOAL_SCORED;
  if (isBlowout) {
    pool = COMMENTARY_BANK.BLOWOUT_GOAL;
  } else if (isClutch) {
    pool = COMMENTARY_BANK.CLUTCH_MOMENT_GOAL;
  }

  let chosenIndex = Math.floor(Math.random() * pool.length);
  if (pool.length > 1 && chosenIndex === lastGoalIndex) {
    chosenIndex = (chosenIndex + 1) % pool.length;
  }
  lastGoalIndex = chosenIndex;

  const template = pool[chosenIndex];
  return typeof template === 'function' ? template(context) : template;
}

/**
 * Sinh bình luận kiến tạo đa dạng ngẫu nhiên, chống lặp liên tiếp
 */
export function getRandomAssistCommentary(context = {}) {
  const pool = COMMENTARY_BANK.ASSIST_SCORED;
  let chosenIndex = Math.floor(Math.random() * pool.length);
  if (pool.length > 1 && chosenIndex === lastAssistIndex) {
    chosenIndex = (chosenIndex + 1) % pool.length;
  }
  lastAssistIndex = chosenIndex;

  const template = pool[chosenIndex];
  return typeof template === 'function' ? template(context) : template;
}

/**
 * Tạo câu bình luận động theo ngữ cảnh thời gian thực
 * @param {string} category 
 * @param {object} context 
 * @returns {string}
 */
export function generateCommentary(category, context) {
  const pool = COMMENTARY_BANK[category] || COMMENTARY_BANK.MIDFIELD_BATTLE;
  const template = pool[Math.floor(Math.random() * pool.length)];
  return template(context);
}
