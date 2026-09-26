/* =========================================================================
   FOOTBALL CAREER SIMULATOR — STATIC DATA MODULE
   ========================================================================= */

/* =========================================================================
   1. NATIONALITIES DATABASE & REGIONAL CONFEDERATIONS
   ========================================================================= */
export const NATIONALITIES_DATA = [
  // Châu Á (ASIA)
  { id: "VN", idAlias: "VIE", name: "Việt Nam", flag: "🇻🇳", region: "ASIA", tourneyName: "AFC Asian Cup", subTourney: "AFF Cup / Vòng loại Châu Á" },
  { id: "JPN", idAlias: "JP", name: "Nhật Bản", flag: "🇯🇵", region: "ASIA", tourneyName: "AFC Asian Cup", subTourney: "Vòng loại World Cup Châu Á" },
  { id: "KOR", idAlias: "KR", name: "Hàn Quốc", flag: "🇰🇷", region: "ASIA", tourneyName: "AFC Asian Cup", subTourney: "Vòng loại World Cup Châu Á" },
  { id: "THA", idAlias: "TH", name: "Thái Lan", flag: "🇹🇭", region: "ASIA", tourneyName: "AFC Asian Cup", subTourney: "AFF Cup / Vòng loại Châu Á" },
  { id: "KSA", idAlias: "SA", name: "Ả Rập Xê Út", flag: "🇸🇦", region: "ASIA", tourneyName: "AFC Asian Cup", subTourney: "Vòng loại World Cup Châu Á" },
  { id: "AUS", idAlias: "AU", name: "Úc", flag: "🇦🇺", region: "ASIA", tourneyName: "AFC Asian Cup", subTourney: "Vòng loại World Cup Châu Á" },

  // Châu Âu (UEFA)
  { id: "ENG", name: "Anh", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", region: "UEFA", tourneyName: "UEFA European Championship (Euro)", subTourney: "UEFA Nations League" },
  { id: "ESP", name: "Tây Ban Nha", flag: "🇪🇸", region: "UEFA", tourneyName: "UEFA European Championship (Euro)", subTourney: "UEFA Nations League" },
  { id: "FRA", name: "Pháp", flag: "🇫🇷", region: "UEFA", tourneyName: "UEFA European Championship (Euro)", subTourney: "UEFA Nations League" },
  { id: "GER", name: "Đức", flag: "🇩🇪", region: "UEFA", tourneyName: "UEFA European Championship (Euro)", subTourney: "UEFA Nations League" },
  { id: "ITA", name: "Ý", flag: "🇮🇹", region: "UEFA", tourneyName: "UEFA European Championship (Euro)", subTourney: "UEFA Nations League" },
  { id: "POR", name: "Bồ Đào Nha", flag: "🇵🇹", region: "UEFA", tourneyName: "UEFA European Championship (Euro)", subTourney: "UEFA Nations League" },
  { id: "NED", name: "Hà Lan", flag: "🇳🇱", region: "UEFA", tourneyName: "UEFA European Championship (Euro)", subTourney: "UEFA Nations League" },
  { id: "BEL", name: "Bỉ", flag: "🇧🇪", region: "UEFA", tourneyName: "UEFA European Championship (Euro)", subTourney: "UEFA Nations League" },
  { id: "CRO", name: "Croatia", flag: "🇭🇷", region: "UEFA", tourneyName: "UEFA European Championship (Euro)", subTourney: "UEFA Nations League" },
  { id: "NOR", name: "Na Uy", flag: "🇳🇴", region: "UEFA", tourneyName: "UEFA European Championship (Euro)", subTourney: "UEFA Nations League" },

  // Nam Mỹ (CONMEBOL)
  { id: "BRA", name: "Brazil", flag: "🇧🇷", region: "CONMEBOL", tourneyName: "Copa América", subTourney: "Vòng loại World Cup Nam Mỹ" },
  { id: "ARG", name: "Argentina", flag: "🇦🇷", region: "CONMEBOL", tourneyName: "Copa América", subTourney: "Finalissima / Vòng loại Nam Mỹ" },
  { id: "URU", name: "Uruguay", flag: "🇺🇾", region: "CONMEBOL", tourneyName: "Copa América", subTourney: "Vòng loại World Cup Nam Mỹ" },
  { id: "COL", name: "Colombia", flag: "🇨🇴", region: "CONMEBOL", tourneyName: "Copa América", subTourney: "Vòng loại World Cup Nam Mỹ" },

  // Châu Phi (CAF)
  { id: "NGA", name: "Nigeria", flag: "🇳🇬", region: "CAF", tourneyName: "Africa Cup of Nations (AFCON)", subTourney: "Vòng loại World Cup Châu Phi" },
  { id: "SEN", name: "Senegal", flag: "🇸🇳", region: "CAF", tourneyName: "Africa Cup of Nations (AFCON)", subTourney: "Vòng loại World Cup Châu Phi" },
  { id: "MAR", name: "Ma-rốc", flag: "🇲🇦", region: "CAF", tourneyName: "Africa Cup of Nations (AFCON)", subTourney: "Vòng loại World Cup Châu Phi" },
  { id: "EGY", name: "Ai Cập", flag: "🇪🇬", region: "CAF", tourneyName: "Africa Cup of Nations (AFCON)", subTourney: "Vòng loại World Cup Châu Phi" }
];

export const NATION_NAMES_POOLS = {
  VN: ["Nguyễn Minh Khang", "Trần Tuấn Anh", "Lê Hoàng Nam", "Phạm Quang Hải", "Vũ Đình Trọng", "Đoàn Văn Hậu", "Bùi Tiến Dũng", "Nguyễn Tuấn Tài", "Đỗ Hùng Dũng"],
  JPN: ["Ren Tanaka", "Haruto Takahashi", "Yuto Watanabe", "Kaito Kobayashi", "Sora Nakamura", "Takefusa Endo"],
  JP: ["Ren Tanaka", "Haruto Takahashi", "Yuto Watanabe", "Kaito Kobayashi", "Sora Nakamura"],
  KOR: ["Kim Min-jun", "Lee Do-hyun", "Park Ji-won", "Jung Woo-jin", "Choi Hyun-woo", "Son Heung-min"],
  KR: ["Kim Min-jun", "Lee Do-hyun", "Park Ji-won", "Jung Woo-jin", "Choi Hyun-woo"],
  THA: ["Chaiyawat Somchai", "Teerasil Bunmathan", "Supachok Sarachat", "Chanathip Songkrasin"],
  TH: ["Chaiyawat Somchai", "Teerasil Bunmathan", "Supachok Sarachat", "Chanathip Songkrasin"],
  KSA: ["Salem Al-Dawsari", "Fahad Al-Muwallad", "Sultan Al-Ghannam", "Saud Abdulhamid"],
  SA: ["Salem Al-Dawsari", "Fahad Al-Muwallad", "Sultan Al-Ghannam", "Saud Abdulhamid"],
  AUS: ["Oliver Miller", "Liam Smith", "Noah Wilson", "Cooper Brown", "Harry Souttar"],
  AU: ["Oliver Miller", "Liam Smith", "Noah Wilson", "Cooper Brown"],
  ENG: ["Jack Sterling", "Leo Bennett", "Harry Walker", "Oliver Edwards", "Marcus Cole", "Cole Palmer"],
  ESP: ["Mateo Ruiz", "Alejandro Gómez", "Iker Morales", "Lucas Navarro", "Pablo Torres", "Lamine Valiente"],
  FRA: ["Kylian Dupont", "Mathis Laurent", "Lucas Moreau", "Enzo Bernard", "Theo Marchand", "Bradley Barcola"],
  GER: ["Felix Weber", "Jonas Schmidt", "Maximilian Meyer", "Lukas Wagner", "Niklas Becker", "Florian Wirtz"],
  ITA: ["Matteo Rossi", "Lorenzo Ricci", "Leonardo Bianchi", "Alessandro Ferrari", "Marco De Luca"],
  POR: ["Tiago Silva", "Gonçalo Ferreira", "Rodrigo Santos", "Diogo Costa", "Bernardo Neves", "Rafael Leao"],
  NED: ["Daan van Dijk", "Lars de Jong", "Milan Jansen", "Sven Bakker", "Thijs Meijer", "Xavi Simons"],
  BEL: ["Arthur Wouters", "Noah Peeters", "Lucas Maes", "Milan Jacobs", "Liam De Smet", "Jeremy Doku"],
  CRO: ["Luka Kovac", "Ivan Horvat", "Marko Babic", "Mateo Juric", "Filip Lovric", "Josko Gvardiol"],
  NOR: ["Henrik Hansen", "Magnus Olsen", "Oskar Berg", "Elias Dahl", "Tobias Johansen", "Erling Lind"],
  BRA: ["Lucas Silva", "Gabriel Santos", "Matheus Oliveira", "Felipe Costa", "Vinicius Lima", "Endrick Felipe"],
  ARG: ["Lautaro Martinez", "Thiago Benitez", "Mateo Romero", "Nicolas Alvarez", "Julian Diaz", "Alejandro Garnacho"],
  URU: ["Rodrigo Suarez", "Facundo Gomez", "Matias Fernandez", "Agustin Rodriguez", "Darwin Nunez"],
  COL: ["Santiago Rodriguez", "Camilo Gutierrez", "Daniel Muriel", "Sebastian Vargas", "Luis Diaz"],
  NGA: ["Victor Okafor", "Chinedu Eze", "Emmanuel Chukwueze", "Kelechi Iheanacho", "Ademola Lookman"],
  SEN: ["Sadio Diop", "Cheikh Ndiaye", "Moussa Sarr", "Babacar Fall", "Nicolas Jackson"],
  MAR: ["Achraf Hakimi", "Hakim Ziyech", "Yassine Bounou", "Sofyan Amrabat", "Brahim Diaz"],
  EGY: ["Mohamed Zaki", "Ahmed Mansour", "Omar Hassan", "Mostafa Fathi", "Omar Marmoush"]
};

export function getRandomPlayerNameByNat(natId) {
  if (!natId) return "Tân Binh Vô Danh";
  const pool = NATION_NAMES_POOLS[natId] || NATION_NAMES_POOLS[String(natId).toUpperCase()];
  if (pool && pool.length > 0) {
    return pool[Math.floor(Math.random() * pool.length)];
  }
  return "Tân Binh Vô Danh";
}

/* =========================================================================
   1.1 NATIONAL TEAMS DATABASE (ĐTQG Theo Khu Vực & Châu Lục)
   ========================================================================= */
export const NATIONAL_TEAMS_DATA = {
  UEFA: [
    { id: "england", name: "Tuyển Anh", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", power: 92, region: "UEFA", stadium: "Wembley Stadium" },
    { id: "france", name: "Tuyển Pháp", code: "FRA", flag: "🇫🇷", power: 93, region: "UEFA", stadium: "Stade de France" },
    { id: "spain", name: "Tuyển Tây Ban Nha", code: "ESP", flag: "🇪🇸", power: 93, region: "UEFA", stadium: "Santiago Bernabéu" },
    { id: "germany", name: "Tuyển Đức", code: "GER", flag: "🇩🇪", power: 90, region: "UEFA", stadium: "Allianz Arena" },
    { id: "portugal", name: "Tuyển Bồ Đào Nha", code: "POR", flag: "🇵🇹", power: 90, region: "UEFA", stadium: "Estádio da Luz" },
    { id: "italy", name: "Tuyển Ý", code: "ITA", flag: "🇮🇹", power: 88, region: "UEFA", stadium: "Stadio Olimpico" },
    { id: "netherlands", name: "Tuyển Hà Lan", code: "NED", flag: "🇳🇱", power: 89, region: "UEFA", stadium: "Johan Cruyff Arena" },
    { id: "belgium", name: "Tuyển Bỉ", code: "BEL", flag: "🇧🇪", power: 86, region: "UEFA", stadium: "King Baudouin Stadium" },
    { id: "croatia", name: "Tuyển Croatia", code: "CRO", flag: "🇭🇷", power: 85, region: "UEFA", stadium: "Stadion Maksimir" },
    { id: "denmark", name: "Tuyển Đan Mạch", code: "DEN", flag: "🇩🇰", power: 83, region: "UEFA", stadium: "Parken Stadium" },
    { id: "switzerland", name: "Tuyển Thụy Sĩ", code: "SUI", flag: "🇨🇭", power: 84, region: "UEFA", stadium: "St. Jakob-Park" },
    { id: "austria", name: "Tuyển Áo", code: "AUT", flag: "🇦🇹", power: 83, region: "UEFA", stadium: "Ernst-Happel-Stadion" }
  ],
  ASIA: [
    { id: "vietnam", name: "Tuyển Việt Nam", code: "VIE", flag: "🇻🇳", power: 74, region: "ASIA", stadium: "Sân Vận Động Quốc Gia Mỹ Đình" },
    { id: "japan", name: "Tuyển Nhật Bản", code: "JPN", flag: "🇯🇵", power: 86, region: "ASIA", stadium: "Sân Vận Động Quốc Gia Nhật Bản" },
    { id: "south_korea", name: "Tuyển Hàn Quốc", code: "KOR", flag: "🇰🇷", power: 85, region: "ASIA", stadium: "Seoul World Cup Stadium" },
    { id: "australia", name: "Tuyển Úc", code: "AUS", flag: "🇦🇺", power: 82, region: "ASIA", stadium: "Accor Stadium" },
    { id: "saudi_arabia", name: "Tuyển Ả Rập Xê Út", code: "KSA", flag: "🇸🇦", power: 81, region: "ASIA", stadium: "King Fahd Stadium" },
    { id: "iran", name: "Tuyển Iran", code: "IRN", flag: "🇮🇷", power: 83, region: "ASIA", stadium: "Azadi Stadium" },
    { id: "qatar", name: "Tuyển Qatar", code: "QAT", flag: "🇶🇦", power: 80, region: "ASIA", stadium: "Lusail Stadium" },
    { id: "uzbekistan", name: "Tuyển Uzbekistan", code: "UZB", flag: "🇺🇿", power: 79, region: "ASIA", stadium: "Bunyodkor Stadium" },
    { id: "thailand", name: "Tuyển Thái Lan", code: "THA", flag: "🇹🇭", power: 75, region: "ASIA", stadium: "Rajamangala Stadium" },
    { id: "indonesia", name: "Tuyển Indonesia", code: "IDN", flag: "🇮🇩", power: 76, region: "ASIA", stadium: "Gelora Bung Karno" },
    { id: "iraq", name: "Tuyển Iraq", code: "IRQ", flag: "🇮🇶", power: 78, region: "ASIA", stadium: "Basra International Stadium" },
    { id: "uae", name: "Tuyển UAE", code: "UAE", flag: "🇦🇪", power: 78, region: "ASIA", stadium: "Zayed Sports City Stadium" }
  ],
  CONMEBOL: [
    { id: "argentina", name: "Tuyển Argentina", code: "ARG", flag: "🇦🇷", power: 94, region: "CONMEBOL", stadium: "Estadio Monumental" },
    { id: "brazil", name: "Tuyển Brazil", code: "BRA", flag: "🇧🇷", power: 93, region: "CONMEBOL", stadium: "Maracanã" },
    { id: "uruguay", name: "Tuyển Uruguay", code: "URU", flag: "🇺🇾", power: 88, region: "CONMEBOL", stadium: "Estadio Centenario" },
    { id: "colombia", name: "Tuyển Colombia", code: "COL", flag: "🇨🇴", power: 87, region: "CONMEBOL", stadium: "Estadio Metropolitano" },
    { id: "ecuador", name: "Tuyển Ecuador", code: "ECU", flag: "🇪🇨", power: 82, region: "CONMEBOL", stadium: "Estadio Rodrigo Paz Delgado" },
    { id: "chile", name: "Tuyển Chile", code: "CHI", flag: "🇨🇱", power: 80, region: "CONMEBOL", stadium: "Estadio Nacional de Chile" },
    { id: "paraguay", name: "Tuyển Paraguay", code: "PAR", flag: "🇵🇾", power: 79, region: "CONMEBOL", stadium: "Defensores del Chaco" },
    { id: "peru", name: "Tuyển Peru", code: "PER", flag: "🇵🇪", power: 78, region: "CONMEBOL", stadium: "Estadio Nacional del Perú" }
  ],
  GLOBAL_OTHER: [
    { id: "morocco", name: "Tuyển Ma-rốc", code: "MAR", flag: "🇲🇦", power: 86, region: "CAF", stadium: "Stade Mohammed V" },
    { id: "senegal", name: "Tuyển Senegal", code: "SEN", flag: "🇸🇳", power: 84, region: "CAF", stadium: "Stade Abdoulaye Wade" },
    { id: "nigeria", name: "Tuyển Nigeria", code: "NGA", flag: "🇳🇬", power: 82, region: "CAF", stadium: "Moshood Abiola Stadium" },
    { id: "usa", name: "Tuyển Mỹ", code: "USA", flag: "🇺🇸", power: 83, region: "CONCACAF", stadium: "Mercedes-Benz Stadium" },
    { id: "mexico", name: "Tuyển Mexico", code: "MEX", flag: "🇲🇽", power: 82, region: "CONCACAF", stadium: "Estadio Azteca" },
    { id: "canada", name: "Tuyển Canada", code: "CAN", flag: "🇨🇦", power: 81, region: "CONCACAF", stadium: "BMO Field" }
  ]
};

/* =========================================================================
   2. RIVALS DATABASE (Kình Địch Thế Kỷ)
   ========================================================================= */
export const RIVALS_DATA = [
  { id: "haaland", name: "Erling Haaland", flag: "🇳🇴", club: "Manchester City", pos: "FW", rating: 94, avatar: "🤖" },
  { id: "mbappe", name: "Kylian Mbappé", flag: "🇫🇷", club: "Real Madrid CF", pos: "FW", rating: 94, avatar: "🐢" },
  { id: "vinicius", name: "Vinicius Jr", flag: "🇧🇷", club: "Real Madrid CF", pos: "FW", rating: 92, avatar: "⚡" },
  { id: "yamal", name: "Lamine Yamal", flag: "🇪🇸", club: "FC Barcelona", pos: "FW", rating: 91, avatar: "🪄" },
  { id: "bellingham", name: "Jude Bellingham", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", club: "Real Madrid CF", pos: "MF", rating: 92, avatar: "🎯" },
  { id: "musiala", name: "Jamal Musiala", flag: "🇩🇪", club: "Bayern Munich", pos: "MF", rating: 91, avatar: "🪄" }
];

/* =========================================================================
   3. ALL-TIME GOAT LEGENDS DATABASE
   ========================================================================= */
export const ALL_TIME_LEGENDS = [
  { name: "Lionel Messi", flag: "🇦🇷", goals: 838, ucl: 4, wc: 1, ballonDor: 8, goatScore: 98.8, icon: "🐐" },
  { name: "Cristiano Ronaldo", flag: "🇵🇹", goals: 905, ucl: 5, wc: 0, ballonDor: 5, goatScore: 97.4, icon: "🐐" },
  { name: "Pelé", flag: "🇧🇷", goals: 762, ucl: 0, wc: 3, ballonDor: 0, goatScore: 96.2, icon: "👑" },
  { name: "Diego Maradona", flag: "🇦🇷", goals: 345, ucl: 0, wc: 1, ballonDor: 0, goatScore: 94.5, icon: "👑" },
  { name: "Ronaldo Nazário", flag: "🇧🇷", goals: 414, ucl: 0, wc: 2, ballonDor: 2, goatScore: 93.0, icon: "⚡" },
  { name: "Zinedine Zidane", flag: "🇫🇷", goals: 156, ucl: 1, wc: 1, ballonDor: 1, goatScore: 92.0, icon: "🪄" }
];

/* =========================================================================
   4. POSITION ATTRIBUTES CONFIGURATION
   ========================================================================= */
export function getPositionGroup(pos) {
  if (!pos) return 'FW';
  const p = String(pos).toUpperCase();
  if (p === 'GK') return 'GK';
  if (['CB', 'LB', 'RB', 'DF'].includes(p)) return 'DF';
  if (['CDM', 'CM', 'CAM', 'LM', 'RM', 'MF'].includes(p)) return 'MF';
  if (['LW', 'RW', 'ST', 'CF', 'FW'].includes(p)) return 'FW';
  return 'FW';
}

export const FIFA_STATS = [
  { key: 'pac', name: 'Tốc Độ', code: 'PAC', icon: '⚡', label: '⚡ Tốc Độ (PAC)' },
  { key: 'sho', name: 'Dứt Điểm / Sút', code: 'SHO', icon: '🎯', label: '🎯 Dứt Điểm / Sút (SHO)' },
  { key: 'pas', name: 'Chuyền Bóng', code: 'PAS', icon: '👟', label: '👟 Chuyền Bóng (PAS)' },
  { key: 'dri', name: 'Rê Bóng / Xử Lý', code: 'DRI', icon: '🪄', label: '🪄 Rê Bóng / Xử Lý (DRI)' },
  { key: 'def', name: 'Phòng Ngự', code: 'DEF', icon: '🛡️', label: '🛡️ Phòng Ngự (DEF)' },
  { key: 'phy', name: 'Thể Chất / Tì Đè', code: 'PHY', icon: '💪', label: '💪 Thể Chất / Tì Đè (PHY)' }
];

export const POSITION_CONFIG = {
  // 1. THỦ MÔN
  GK: {
    id: "GK",
    group: "GK",
    name: "Thủ Môn (GK)",
    lineName: "Thủ Môn",
    icon: "🧤",
    desc: "Người gác đền, cứu thua xuất thần, bắt bóng & chỉ huy hàng phòng ngự",
    initialStats: { pac: 48, sho: 35, pas: 56, dri: 55, def: 62, phy: 58 },
    statWeights: { pac: 0.08, sho: 0.04, pas: 0.18, dri: 0.10, def: 0.35, phy: 0.25 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Trận Sạch Lưới (Clean Sheets)",
    stat2Label: "Số Pha Cứu Thua (Saves)"
  },

  // 2. HẬU VỆ
  CB: {
    id: "CB",
    group: "DF",
    name: "Trung Vệ (CB)",
    lineName: "Hậu Vệ",
    icon: "🛡️",
    desc: "Hòn đá tảng trung tâm, tắc bóng, tranh chấp & không chiến dũng mãnh",
    initialStats: { pac: 52, sho: 30, pas: 48, dri: 46, def: 64, phy: 64 },
    statWeights: { pac: 0.15, sho: 0.02, pas: 0.08, dri: 0.05, def: 0.40, phy: 0.30 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Tắc Bóng & Cắt Bóng",
    stat2Label: "Trận Sạch Lưới (Clean Sheets)"
  },
  LB: {
    id: "LB",
    group: "DF",
    name: "Hậu Vệ Cánh Trái (LB)",
    lineName: "Hậu Vệ",
    icon: "🏃‍♂️",
    desc: "Hậu vệ biên cơ động, bám biên trái, tạt bóng & bọc lót cánh",
    initialStats: { pac: 62, sho: 38, pas: 54, dri: 54, def: 58, phy: 58 },
    statWeights: { pac: 0.28, sho: 0.02, pas: 0.14, dri: 0.10, def: 0.28, phy: 0.18 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Tắc Bóng & Đánh Chặn",
    stat2Label: "Trận Sạch Lưới & Tạt Bóng"
  },
  RB: {
    id: "RB",
    group: "DF",
    name: "Hậu Vệ Cánh Phải (RB)",
    lineName: "Hậu Vệ",
    icon: "⚡",
    desc: "Hậu vệ biên tốc độ cao, phòng ngự cánh phải & hỗ trợ tấn công",
    initialStats: { pac: 62, sho: 38, pas: 54, dri: 54, def: 58, phy: 58 },
    statWeights: { pac: 0.28, sho: 0.02, pas: 0.14, dri: 0.10, def: 0.28, phy: 0.18 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Tắc Bóng & Đánh Chặn",
    stat2Label: "Trận Sạch Lưới & Tạt Bóng"
  },

  // 3. TIỀN VỆ
  CDM: {
    id: "CDM",
    group: "MF",
    name: "Tiền Vệ Phòng Ngự (CDM)",
    lineName: "Tiền Vệ",
    icon: "⚓",
    desc: "Máy quét mỏ neo, đánh chặn từ xa, thu hồi bóng & phát động phản công",
    initialStats: { pac: 52, sho: 42, pas: 56, dri: 52, def: 62, phy: 62 },
    statWeights: { pac: 0.10, sho: 0.04, pas: 0.20, dri: 0.08, def: 0.32, phy: 0.26 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Thu Hồi Bóng & Cắt Bóng",
    stat2Label: "Trận Sạch Lưới & Kiến Tạo"
  },
  CM: {
    id: "CM",
    group: "MF",
    name: "Tiền Vệ Trung Tâm (CM)",
    lineName: "Tiền Vệ",
    icon: "🎯",
    desc: "Nhạc trưởng Box-to-box con thoi, điều tiết nhịp độ & phân phối bóng",
    initialStats: { pac: 55, sho: 50, pas: 60, dri: 58, def: 52, phy: 56 },
    statWeights: { pac: 0.10, sho: 0.10, pas: 0.28, dri: 0.20, def: 0.16, phy: 0.16 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Bàn Thắng (Goals)",
    stat2Label: "Kiến Tạo (Assists)"
  },
  CAM: {
    id: "CAM",
    group: "MF",
    name: "Tiền Vệ Tấn Công (CAM)",
    lineName: "Tiền Vệ",
    icon: "🪄",
    desc: "Số 10 hiện đại, chọc khe xé toang hàng thủ & sút xa hiểm hóc",
    initialStats: { pac: 56, sho: 54, pas: 62, dri: 60, def: 36, phy: 48 },
    statWeights: { pac: 0.12, sho: 0.20, pas: 0.30, dri: 0.25, def: 0.05, phy: 0.08 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Bàn Thắng (Goals)",
    stat2Label: "Kiến Tạo (Assists)"
  },
  LM: {
    id: "LM",
    group: "MF",
    name: "Tiền Vệ Cánh Trái (LM)",
    lineName: "Tiền Vệ",
    icon: "🌪️",
    desc: "Tiền vệ dạt biên trái, lên công về thủ nhịp nhàng, tạt cánh chuẩn xác",
    initialStats: { pac: 62, sho: 52, pas: 56, dri: 60, def: 38, phy: 52 },
    statWeights: { pac: 0.25, sho: 0.15, pas: 0.22, dri: 0.22, def: 0.06, phy: 0.10 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Bàn Thắng (Goals)",
    stat2Label: "Kiến Tạo (Assists)"
  },
  RM: {
    id: "RM",
    group: "MF",
    name: "Tiền Vệ Cánh Phải (RM)",
    lineName: "Tiền Vệ",
    icon: "⚡",
    desc: "Tiền vệ dạt biên phải, bứt tốc biên phải, phối hợp nhanh & tạt bóng",
    initialStats: { pac: 62, sho: 52, pas: 56, dri: 60, def: 38, phy: 52 },
    statWeights: { pac: 0.25, sho: 0.15, pas: 0.22, dri: 0.22, def: 0.06, phy: 0.10 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Bàn Thắng (Goals)",
    stat2Label: "Kiến Tạo (Assists)"
  },

  // 4. TIỀN ĐẠO
  LW: {
    id: "LW",
    group: "FW",
    name: "Tiền Đạo Cánh Trái (LW)",
    lineName: "Tiền Đạo",
    icon: "🔥",
    desc: "Mũi khoan cánh trái, rê dắt tốc độ cao, đột phá vòng cấm & cứa lòng",
    initialStats: { pac: 65, sho: 56, pas: 54, dri: 62, def: 30, phy: 48 },
    statWeights: { pac: 0.28, sho: 0.20, pas: 0.15, dri: 0.25, def: 0.04, phy: 0.08 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Bàn Thắng (Goals)",
    stat2Label: "Kiến Tạo (Assists)"
  },
  RW: {
    id: "RW",
    group: "FW",
    name: "Tiền Đạo Cánh Phải (RW)",
    lineName: "Tiền Đạo",
    icon: "⚡",
    desc: "Mũi khoan cánh phải, đi bóng lắt léo, rẽ vào trung lộ & dứt điểm",
    initialStats: { pac: 65, sho: 56, pas: 54, dri: 62, def: 30, phy: 48 },
    statWeights: { pac: 0.28, sho: 0.20, pas: 0.15, dri: 0.25, def: 0.04, phy: 0.08 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Bàn Thắng (Goals)",
    stat2Label: "Kiến Tạo (Assists)"
  },
  ST: {
    id: "ST",
    group: "FW",
    name: "Tiền Đạo Cắm (ST/CF)",
    lineName: "Tiền Đạo",
    icon: "⚽",
    desc: "Sát thủ săn bàn 40-75+ bàn/mùa, Chiếc giày vàng & Quả bóng vàng",
    initialStats: { pac: 60, sho: 62, pas: 52, dri: 58, def: 32, phy: 54 },
    statWeights: { pac: 0.20, sho: 0.35, pas: 0.10, dri: 0.18, def: 0.05, phy: 0.12 },
    attributes: [
      { key: "pac", name: "Tốc Độ (PAC)", code: "PAC", icon: "⚡" },
      { key: "sho", name: "Dứt Điểm / Sút (SHO)", code: "SHO", icon: "🎯" },
      { key: "pas", name: "Chuyền Bóng (PAS)", code: "PAS", icon: "👟" },
      { key: "dri", name: "Rê Bóng / Xử Lý (DRI)", code: "DRI", icon: "🪄" },
      { key: "def", name: "Phòng Ngự (DEF)", code: "DEF", icon: "🛡️" },
      { key: "phy", name: "Thể Chất / Tì Đè (PHY)", code: "PHY", icon: "💪" }
    ],
    stat1Label: "Bàn Thắng (Goals)",
    stat2Label: "Kiến Tạo (Assists)"
  }
};

// Aliases for backward compatibility
POSITION_CONFIG.FW = POSITION_CONFIG.ST;
POSITION_CONFIG.MF = POSITION_CONFIG.CM;
POSITION_CONFIG.DF = POSITION_CONFIG.CB;
POSITION_CONFIG.CF = POSITION_CONFIG.ST;

export function getInitialStatsForPosition(pos) {
  const pUpper = String(pos || "ST").toUpperCase();
  const cfg = POSITION_CONFIG[pUpper] || POSITION_CONFIG.ST;
  return { ...cfg.initialStats };
}

/* =========================================================================
   5. YOUTH ACADEMIES DATABASE
   ========================================================================= */
export const YOUTH_ACADEMIES = [
  {
    id: "castilla",
    idAlias: "real_madrid",
    name: "Real Madrid Castilla",
    parentClubId: "real_madrid",
    code: "CAS",
    icon: "👑",
    flag: "🇪🇸",
    country: "Tây Ban Nha",
    power: 78,
    reputation: 80,
    stadium: "Estadio Alfredo Di Stéfano",
    desc: "Lò đào tạo hoàng gia La Fabrica danh tiếng (Raúl, Iker Casillas, Dani Carvajal)",
    philosophy: "Bản lĩnh nhà vua, bóng đá tấn công áp đặt và khát vọng chiến thắng tột cùng"
  },
  {
    id: "la_masia",
    idAlias: "barca",
    name: "FC Barcelona La Masia",
    parentClubId: "barca",
    code: "MAS",
    icon: "🔵🔴",
    flag: "🇪🇸",
    country: "Tây Ban Nha",
    power: 78,
    reputation: 80,
    stadium: "Ciutat Esportiva Joan Gamper",
    desc: "Thánh đường bóng đá kiểm soát trứ danh (Lionel Messi, Andrés Iniesta, Lamine Yamal)",
    philosophy: "Tiki-taka kiểm soát bóng đỉnh cao, tư duy không gian và kỹ thuật chạm một điêu luyện"
  },
  {
    id: "sporting_acad",
    idAlias: "sporting",
    name: "Sporting CP Academy",
    parentClubId: "sporting",
    code: "SCP",
    icon: "🟢⚪",
    flag: "🇵🇹",
    country: "Bồ Đào Nha",
    power: 75,
    reputation: 75,
    stadium: "Academia Cristiano Ronaldo",
    desc: "Lò đào tạo danh tiếng sản sinh ra Cristiano Ronaldo, Luís Figo, Bruno Fernandes",
    philosophy: "Tốc độ biên bùng nổ, kỹ thuật rê dắt cá nhân và ý chí vươn tầm thế giới"
  },
  {
    id: "benfica_campus",
    idAlias: "benfica_seixal",
    name: "Benfica Seixal Campus",
    parentClubId: "benfica",
    code: "SLB",
    icon: "🦅",
    flag: "🇵🇹",
    country: "Bồ Đào Nha",
    power: 75,
    reputation: 76,
    stadium: "Benfica Campus",
    desc: "Trung tâm phát triển và xuất khẩu siêu sao số một châu Âu (Bernardo Silva, Rúben Dias, João Félix)",
    philosophy: "Bóng đá hiện đại, công nghệ phân tích dữ liệu và tư duy chiến thuật toàn diện"
  },
  {
    id: "ajax_academy",
    idAlias: "de_toekomst",
    name: "Ajax De Toekomst",
    parentClubId: "ajax",
    code: "AJX",
    icon: "⚪🔴",
    flag: "🇳🇱",
    country: "Hà Lan",
    power: 76,
    reputation: 77,
    stadium: "Sportpark De Toekomst",
    desc: "Cái nôi triết lý bóng đá tổng lực Total Football (Johan Cruyff, Van Basten, Matthijs de Ligt)",
    philosophy: "Sơ đồ 4-3-3 tấn công mở rộng, tư duy sáng tạo và khả năng luân chuyển bóng nhịp nhàng"
  },
  {
    id: "bayern_junior",
    idAlias: "bayern_campus",
    name: "FC Bayern Campus",
    parentClubId: "bayern",
    code: "BAY",
    icon: "🔴",
    flag: "🇩🇪",
    country: "Đức",
    power: 77,
    reputation: 78,
    stadium: "FC Bayern Campus",
    desc: "Trung tâm trui rèn kỷ luật thép và thể chất đỉnh cao xứ Bavaria (Thomas Müller, Schweinsteiger, Jamal Musiala)",
    philosophy: "Tinh thần Mia San Mia, pressing cường độ cao và thể lực bền bỉ đến phút cuối"
  },
  {
    id: "dortmund_youth",
    idAlias: "dortmund",
    name: "Borussia Dortmund Youth",
    parentClubId: "dortmund",
    code: "BVB",
    icon: "🟡⚫",
    flag: "🇩🇪",
    country: "Đức",
    power: 76,
    reputation: 76,
    stadium: "BVB Nachwuchszentrum",
    desc: "Bệ phóng vàng cho các thần đồng trẻ thế giới (Mario Götze, Marco Reus, Christian Pulisic)",
    philosophy: "Gegenpressing dồn ép trực diện, chuyển đổi trạng thái thần tốc và khát khao tấn công"
  },
  {
    id: "carrington",
    idAlias: "man_utd",
    name: "Man United Carrington",
    parentClubId: "man_utd",
    code: "CAR",
    icon: "👹",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    country: "Anh",
    power: 75,
    reputation: 76,
    stadium: "Carrington Training Ground",
    desc: "Nơi trui rèn thế hệ vàng Class of '92 huyền thoại (David Beckham, Paul Scholes, Marcus Rashford)",
    philosophy: "Truyền thống trao cơ hội cho cầu thủ trẻ, tinh thần quả cảm và tấn công cống hiến"
  },
  {
    id: "cobham",
    idAlias: "chelsea",
    name: "Chelsea Cobham Academy",
    parentClubId: "chelsea",
    code: "COB",
    icon: "🔵",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    country: "Anh",
    power: 76,
    reputation: 76,
    stadium: "Cobham Training Centre",
    desc: "Học viện giàu thành tích bậc nhất nước Anh với vô số cúp FA Youth Cup (John Terry, Reece James, Mason Mount)",
    philosophy: "Kỹ chiến thuật hiện đại, tính thực dụng và thể hình - thể lực vượt trội"
  },
  {
    id: "hale_end",
    idAlias: "arsenal",
    name: "Arsenal Hale End",
    parentClubId: "arsenal",
    code: "ARS",
    icon: "🔴⚪",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    country: "Anh",
    power: 76,
    reputation: 76,
    stadium: "Hale End Academy Ground",
    desc: "Cái nôi của lối chơi đẹp mắt quyến rũ Bắc London (Cesc Fàbregas, Bukayo Saka, Ethan Nwaneri)",
    philosophy: "Bóng đá ban bật cự ly ngắn tinh tế, sáng tạo không giới hạn và kỷ luật vị trí"
  },
  {
    id: "city_cfa",
    idAlias: "man_city",
    name: "Man City CFA",
    parentClubId: "man_city",
    code: "MCI",
    icon: "🩵",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    country: "Anh",
    power: 77,
    reputation: 77,
    stadium: "City Football Academy",
    desc: "Khu phức hợp thể thao tối tân hàng đầu thế giới (Phil Foden, Cole Palmer, Rico Lewis)",
    philosophy: "Kiểm soát bóng vị trí Position Play, định hướng không gian và làm chủ trận địa"
  },
  {
    id: "juventus_youth",
    idAlias: "juventus",
    name: "Juventus Primavera",
    parentClubId: "juventus",
    code: "JUV",
    icon: "⚪⚫",
    flag: "🇮🇹",
    country: "Ý",
    power: 75,
    reputation: 75,
    stadium: "Juventus Training Center",
    desc: "Học viện hàng đầu bóng đá Ý với chiều sâu phòng ngự và kỷ luật thép (Claudio Marchisio, Sebastian Giovinco)",
    philosophy: "Nghệ thuật phòng ngự Catenaccio hiện đại, tính tổ chức chặt chẽ và chớp cơ hội sắc bén"
  },
  {
    id: "inter_youth",
    idAlias: "inter",
    name: "Inter Milan Youth",
    parentClubId: "inter",
    code: "INT",
    icon: "🔵⚫",
    flag: "🇮🇹",
    country: "Ý",
    power: 76,
    reputation: 75,
    stadium: "Suning Training Centre",
    desc: "Đội trẻ Nerazzurri sở hữu kỷ lục vô địch giải trẻ Primavera nước Ý (Mario Balotelli, Leonardo Bonucci, Federico Dimarco)",
    philosophy: "Thể lực bền bỉ, tính cơ bắp kết hợp chiến thuật thực dụng đỉnh cao Serie A"
  },
  {
    id: "psg_youth",
    idAlias: "psg_acad",
    name: "PSG Youth Academy",
    parentClubId: "psg",
    code: "PSG",
    icon: "🔵🔴",
    flag: "🇫🇷",
    country: "Pháp",
    power: 76,
    reputation: 76,
    stadium: "Campus PSG",
    desc: "Khai thác nguồn tài năng bóng đá đường phố dồi dào bậc nhất châu Âu từ Île-de-France (Kingsley Coman, Presnel Kimpembe, Warren Zaïre-Emery)",
    philosophy: "Tốc độ vũ bão, kỹ thuật ngẫu hứng đường phố và thể chất bùng nổ"
  },
  {
    id: "clairefontaine",
    idAlias: "claire",
    name: "INF Clairefontaine",
    parentClubId: "clairefontaine",
    code: "CLA",
    icon: "🇫🇷",
    flag: "🇫🇷",
    country: "Pháp",
    power: 76,
    reputation: 77,
    stadium: "Centre Technique National",
    desc: "Trung tâm kỹ thuật quốc gia trứ danh nuôi dưỡng những nhà vô địch World Cup (Thierry Henry, Kylian Mbappé, Nicolas Anelka)",
    philosophy: "Đào tạo kỹ thuật cơ bản hoàn mỹ, tốc độ bứt phá và tư duy ra quyết định trong không gian hẹp"
  },
  {
    id: "pvf_academy",
    idAlias: "pvf_youth",
    name: "PVF Football Academy",
    parentClubId: "pvf_academy",
    code: "PVF",
    icon: "🇻🇳",
    flag: "🇻🇳",
    country: "Việt Nam",
    power: 72,
    reputation: 70,
    stadium: "Trung Tâm Đào Tạo PVF",
    desc: "Trung tâm đào tạo bóng đá trẻ hiện đại số một Việt Nam đạt chuẩn 3 sao AFC (Nguyễn Quang Hải, Đoàn Văn Hậu, Bùi Hoàng Việt Anh)",
    philosophy: "Ý chí kiên cường Việt Nam, lối chơi phối hợp nhỏ nhanh nhẹn và tinh thần tập thể gắn kết"
  }
];

export const YOUTH_LEAGUE_CLUBS = [
  { id: "castilla", idAlias: "real_madrid", name: "Real Madrid Castilla", code: "CAS", icon: "👑", power: 78, attPower: 80, defPower: 75, midPower: 79, reputation: 80, country: "Tây Ban Nha", stadium: "Estadio Alfredo Di Stéfano" },
  { id: "la_masia", idAlias: "barca", name: "FC Barcelona La Masia", code: "MAS", icon: "🔵🔴", power: 78, attPower: 82, defPower: 74, midPower: 80, reputation: 80, country: "Tây Ban Nha", stadium: "Ciutat Esportiva Joan Gamper" },
  { id: "sporting_acad", idAlias: "sporting", name: "Sporting CP Academy", code: "SCP", icon: "🟢⚪", power: 75, attPower: 77, defPower: 73, midPower: 76, reputation: 75, country: "Bồ Đào Nha", stadium: "Academia Cristiano Ronaldo" },
  { id: "benfica_campus", idAlias: "benfica_seixal", name: "Benfica Seixal Campus", code: "SLB", icon: "🦅", power: 75, attPower: 77, defPower: 74, midPower: 75, reputation: 76, country: "Bồ Đào Nha", stadium: "Benfica Campus" },
  { id: "ajax_academy", idAlias: "de_toekomst", name: "Ajax De Toekomst", code: "AJX", icon: "⚪🔴", power: 76, attPower: 79, defPower: 73, midPower: 77, reputation: 77, country: "Hà Lan", stadium: "Sportpark De Toekomst" },
  { id: "bayern_junior", idAlias: "bayern_campus", name: "FC Bayern Campus", code: "BAY", icon: "🔴", power: 77, attPower: 80, defPower: 75, midPower: 77, reputation: 78, country: "Đức", stadium: "FC Bayern Campus" },
  { id: "dortmund_youth", idAlias: "dortmund", name: "Borussia Dortmund Youth", code: "BVB", icon: "🟡⚫", power: 76, attPower: 79, defPower: 73, midPower: 76, reputation: 76, country: "Đức", stadium: "BVB Nachwuchszentrum" },
  { id: "carrington", idAlias: "man_utd", name: "Man United Carrington", code: "CAR", icon: "👹", power: 75, attPower: 78, defPower: 73, midPower: 76, reputation: 76, country: "Anh", stadium: "Carrington Training Ground" },
  { id: "cobham", idAlias: "chelsea", name: "Chelsea Cobham Academy", code: "COB", icon: "🔵", power: 76, attPower: 78, defPower: 74, midPower: 76, reputation: 76, country: "Anh", stadium: "Cobham Training Centre" },
  { id: "hale_end", idAlias: "arsenal", name: "Arsenal Hale End", code: "ARS", icon: "🔴⚪", power: 76, attPower: 78, defPower: 74, midPower: 76, reputation: 76, country: "Anh", stadium: "Hale End Academy Ground" },
  { id: "city_cfa", idAlias: "man_city", name: "Man City CFA", code: "MCI", icon: "🩵", power: 77, attPower: 79, defPower: 75, midPower: 78, reputation: 77, country: "Anh", stadium: "City Football Academy" },
  { id: "juventus_youth", idAlias: "juventus", name: "Juventus Primavera", code: "JUV", icon: "⚪⚫", power: 75, attPower: 76, defPower: 76, midPower: 75, reputation: 75, country: "Ý", stadium: "Juventus Training Center" },
  { id: "inter_youth", idAlias: "inter", name: "Inter Milan Youth", code: "INT", icon: "🔵⚫", power: 76, attPower: 77, defPower: 75, midPower: 76, reputation: 75, country: "Ý", stadium: "Suning Training Centre" },
  { id: "psg_youth", idAlias: "psg_acad", name: "PSG Youth Academy", code: "PSG", icon: "🔵🔴", power: 76, attPower: 78, defPower: 74, midPower: 76, reputation: 76, country: "Pháp", stadium: "Campus PSG" },
  { id: "clairefontaine", idAlias: "claire", name: "INF Clairefontaine", code: "CLA", icon: "🇫🇷", power: 76, attPower: 78, defPower: 74, midPower: 76, reputation: 77, country: "Pháp", stadium: "Centre Technique National" },
  { id: "pvf_academy", idAlias: "pvf_youth", name: "PVF Football Academy", code: "PVF", icon: "🇻🇳", power: 72, attPower: 74, defPower: 71, midPower: 73, reputation: 70, country: "Việt Nam", stadium: "Trung Tâm Đào Tạo PVF" }
];

/* Danh sách 16 Học viện Hàng Đầu Tham Dự UEFA Youth League (Cúp C1 Trẻ) */
export const UEFA_YOUTH_LEAGUE_CLUBS = YOUTH_LEAGUE_CLUBS;

export const UEFA_YOUTH_LEAGUE_CONFIG = {
  id: "UEFA_YOUTH_LEAGUE",
  name: "UEFA Youth League (C1 Trẻ)",
  shortName: "Youth League",
  icon: "🌍",
  totalTeams: 16,
  totalGroups: 4,
  teamsPerGroup: 4,
  groupNames: ["Bảng A", "Bảng B", "Bảng C", "Bảng D"],
  groupMatchesCount: 3,
  knockoutStages: ["Tứ Kết", "Bán Kết", "Chung Kết"]
};

/* =========================================================================
   6. COMPREHENSIVE LEAGUES DATABASE
   ========================================================================= */
export const LEAGUES_DATA = {
  PREMIER_LEAGUE: {
    id: "PREMIER_LEAGUE",
    name: "Premier League",
    country: "Anh",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    domesticLeagueCup: "Vô Địch Ngoại Hạng Anh (Premier League)",
    domesticCup: "Cúp FA (FA Cup)",
    leagueCup: "Cúp Liên Đoàn Anh (Carabao Cup)",
    domesticSuperCup: "Siêu Cúp Anh (FA Community Shield)",
    continentalC1: "UEFA Champions League (C1)",
    continentalC2: "UEFA Europa League (C2)",
    continentalC3: "UEFA Europa Conference League (C3)",
    totalTeams: 20,
    tierLevel: 4
  },
  LA_LIGA: {
    id: "LA_LIGA",
    name: "La Liga",
    country: "Tây Ban Nha",
    flag: "🇪🇸",
    domesticLeagueCup: "Vô Địch La Liga",
    domesticCup: "Cúp Nhà Vua (Copa del Rey)",
    leagueCup: null,
    domesticSuperCup: "Siêu Cúp Tây Ban Nha (Supercopa de España)",
    continentalC1: "UEFA Champions League (C1)",
    continentalC2: "UEFA Europa League (C2)",
    continentalC3: "UEFA Europa Conference League (C3)",
    totalTeams: 20,
    tierLevel: 4
  },
  SERIE_A: {
    id: "SERIE_A",
    name: "Serie A",
    country: "Ý",
    flag: "🇮🇹",
    domesticLeagueCup: "Vô Địch Serie A (Scudetto)",
    domesticCup: "Cúp Quốc Gia Ý (Coppa Italia)",
    leagueCup: null,
    domesticSuperCup: "Siêu Cúp Quốc Gia Ý (Supercoppa Italiana)",
    continentalC1: "UEFA Champions League (C1)",
    continentalC2: "UEFA Europa League (C2)",
    continentalC3: "UEFA Europa Conference League (C3)",
    totalTeams: 20,
    tierLevel: 4
  },
  BUNDESLIGA: {
    id: "BUNDESLIGA",
    name: "Bundesliga",
    country: "Đức",
    flag: "🇩🇪",
    domesticLeagueCup: "Vô Địch Bundesliga (Đĩa Bạc)",
    domesticCup: "Cúp Quốc Gia Đức (DFB-Pokal)",
    leagueCup: null,
    domesticSuperCup: "Siêu Cúp Quốc Gia Đức (DFL-Supercup)",
    continentalC1: "UEFA Champions League (C1)",
    continentalC2: "UEFA Europa League (C2)",
    continentalC3: "UEFA Europa Conference League (C3)",
    totalTeams: 18,
    tierLevel: 4
  },
  LIGUE_1: {
    id: "LIGUE_1",
    name: "Ligue 1",
    country: "Pháp",
    flag: "🇫🇷",
    domesticLeagueCup: "Vô Địch Ligue 1",
    domesticCup: "Cúp Quốc Gia Pháp (Coupe de France)",
    leagueCup: "Cúp Liên Đoàn Pháp (Coupe de la Ligue)",
    domesticSuperCup: "Siêu Cúp Quốc Gia Pháp (Trophée des Champions)",
    continentalC1: "UEFA Champions League (C1)",
    continentalC2: "UEFA Europa League (C2)",
    continentalC3: "UEFA Europa Conference League (C3)",
    totalTeams: 18,
    tierLevel: 3
  },
  EURO_SUB: {
    id: "EURO_SUB",
    name: "Giải VĐQG Châu Âu Hạng Trung (Hà Lan, Bồ Đào Nha, Bỉ, Scotland...)",
    country: "Châu Âu",
    flag: "🇪🇺",
    domesticLeagueCup: "Vô Địch Quốc Gia Châu Âu",
    domesticCup: "Cúp Quốc Gia Châu Âu",
    leagueCup: null,
    domesticSuperCup: "Siêu Cúp Quốc Gia",
    continentalC1: "UEFA Champions League (C1)",
    continentalC2: "UEFA Europa League (C2)",
    continentalC3: "UEFA Europa Conference League (C3)",
    totalTeams: 18,
    tierLevel: 2
  },
  SAUDI_PRO: {
    id: "SAUDI_PRO",
    name: "Saudi Pro League",
    country: "Ả Rập Xê Út",
    flag: "🇸🇦",
    domesticLeagueCup: "Vô Địch Saudi Pro League",
    domesticCup: "Cúp Nhà Vua Ả Rập (King Cup)",
    leagueCup: null,
    domesticSuperCup: "Siêu Cúp Ả Rập Xê Út",
    continentalC1: "AFC Champions League Elite",
    continentalC2: "AFC Champions League Two",
    continentalC3: "AFC Challenge League",
    totalTeams: 18,
    tierLevel: 3
  },
  MLS_AMERICAS: {
    id: "MLS_AMERICAS",
    name: "MLS & Nam Mỹ (Americas)",
    country: "Châu Mỹ",
    flag: "🌎",
    domesticLeagueCup: "Vô Địch MLS / Copa Libertadores",
    domesticCup: "Cúp Quốc Gia Châu Mỹ",
    leagueCup: "Leagues Cup",
    domesticSuperCup: "Siêu Cúp Châu Mỹ",
    continentalC1: "CONCACAF Champions Cup / Libertadores",
    continentalC2: "Copa Sudamericana",
    continentalC3: "Leagues Cup",
    totalTeams: 20,
    tierLevel: 2
  }
};

/* =========================================================================
   7. COMPREHENSIVE CLUBS DATABASE (Tier 1 Top 5, Tier 2 Mid-Europe & Global)
/* =========================================================================
   7. COMPREHENSIVE CLUBS DATABASE (Full 20/18 Real-World Teams per League)
   ========================================================================= */

export const PREMIER_LEAGUE_CLUBS = [
  { id: "man_city", name: "Manchester City", code: "MCI", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 88, skillReq: 88, salary: 600000, attPower: 95, defPower: 92, midPower: 94, power: 94, icon: "👑", derbyRivals: ["man_utd", "liverpool", "arsenal"], stadium: "Etihad Stadium", defaultEuro: "C1" },
  { id: "arsenal", name: "Arsenal FC", code: "ARS", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 84, skillReq: 86, salary: 400000, attPower: 92, defPower: 93, midPower: 91, power: 92, icon: "🔴", derbyRivals: ["tottenham", "chelsea", "man_city"], stadium: "Emirates Stadium", defaultEuro: "C1" },
  { id: "liverpool", name: "Liverpool FC", code: "LIV", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 84, skillReq: 86, salary: 412500, attPower: 93, defPower: 90, midPower: 91, power: 91, icon: "🔴", derbyRivals: ["man_utd", "everton", "man_city"], stadium: "Anfield", defaultEuro: "C1" },
  { id: "aston_villa", name: "Aston Villa", code: "AVL", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 65, skillReq: 76, salary: 95000, attPower: 83, defPower: 81, midPower: 82, power: 82, icon: "🦁", derbyRivals: ["wolves"], stadium: "Villa Park", defaultEuro: "C1" },
  { id: "tottenham", name: "Tottenham Hotspur", code: "TOT", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 72, skillReq: 80, salary: 175000, attPower: 85, defPower: 81, midPower: 83, power: 83, icon: "⚪", derbyRivals: ["arsenal", "chelsea"], stadium: "Tottenham Hotspur Stadium", defaultEuro: "C2" },
  { id: "chelsea", name: "Chelsea FC", code: "CHE", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 78, skillReq: 82, salary: 250000, attPower: 85, defPower: 83, midPower: 85, power: 84, icon: "🔵", derbyRivals: ["arsenal", "tottenham", "fulham"], stadium: "Stamford Bridge", defaultEuro: "C2" },
  { id: "newcastle", name: "Newcastle United", code: "NEW", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 75, skillReq: 80, salary: 137500, attPower: 84, defPower: 82, midPower: 83, power: 83, icon: "⚪⚫", derbyRivals: ["sunderland"], stadium: "St. James' Park", defaultEuro: "C3" },
  { id: "man_utd", name: "Manchester United", code: "MUN", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 80, skillReq: 83, salary: 337500, attPower: 86, defPower: 83, midPower: 84, power: 84, icon: "👹", derbyRivals: ["man_city", "liverpool", "leeds"], stadium: "Old Trafford", defaultEuro: "C2" },
  { id: "west_ham", name: "West Ham United", code: "WHU", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 60, skillReq: 74, salary: 62500, attPower: 79, defPower: 78, midPower: 79, power: 79, icon: "⚒️", derbyRivals: ["chelsea", "tottenham"], stadium: "London Stadium", defaultEuro: "NONE" },
  { id: "brighton", name: "Brighton & Hove Albion", code: "BHA", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 58, skillReq: 73, salary: 50000, attPower: 80, defPower: 77, midPower: 80, power: 79, icon: "🕊️", derbyRivals: ["crystal_palace"], stadium: "Amex Stadium", defaultEuro: "NONE" },
  { id: "bournemouth", name: "AFC Bournemouth", code: "BOU", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 45, skillReq: 68, salary: 35000, attPower: 76, defPower: 75, midPower: 76, power: 76, icon: "🍒", derbyRivals: ["southampton"], stadium: "Vitality Stadium", defaultEuro: "NONE" },
  { id: "crystal_palace", name: "Crystal Palace", code: "CRY", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 50, skillReq: 70, salary: 40000, attPower: 78, defPower: 77, midPower: 77, power: 77, icon: "🦅", derbyRivals: ["brighton"], stadium: "Selhurst Park", defaultEuro: "NONE" },
  { id: "wolves", name: "Wolverhampton Wanderers", code: "WOL", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 48, skillReq: 69, salary: 37500, attPower: 76, defPower: 76, midPower: 77, power: 76, icon: "🐺", derbyRivals: ["aston_villa"], stadium: "Molineux Stadium", defaultEuro: "NONE" },
  { id: "fulham", name: "Fulham FC", code: "FUL", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 50, skillReq: 70, salary: 40000, attPower: 77, defPower: 76, midPower: 77, power: 77, icon: "⚪", derbyRivals: ["chelsea", "brentford"], stadium: "Craven Cottage", defaultEuro: "NONE" },
  { id: "everton", name: "Everton FC", code: "EVE", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 52, skillReq: 71, salary: 45000, attPower: 76, defPower: 78, midPower: 76, power: 77, icon: "🔵", derbyRivals: ["liverpool"], stadium: "Goodison Park", defaultEuro: "NONE" },
  { id: "brentford", name: "Brentford FC", code: "BRE", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 46, skillReq: 68, salary: 35000, attPower: 77, defPower: 75, midPower: 76, power: 76, icon: "🐝", derbyRivals: ["fulham", "chelsea"], stadium: "Gtech Community Stadium", defaultEuro: "NONE" },
  { id: "nottingham", name: "Nottingham Forest", code: "NFO", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 45, skillReq: 67, salary: 32500, attPower: 75, defPower: 76, midPower: 75, power: 75, icon: "🌳", derbyRivals: ["leicester"], stadium: "City Ground", defaultEuro: "NONE" },
  { id: "leicester", name: "Leicester City", code: "LEI", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 44, skillReq: 66, salary: 30000, attPower: 74, defPower: 73, midPower: 74, power: 74, icon: "🦊", derbyRivals: ["nottingham"], stadium: "King Power Stadium", defaultEuro: "NONE" },
  { id: "southampton", name: "Southampton FC", code: "SOU", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 40, skillReq: 64, salary: 22500, attPower: 72, defPower: 71, midPower: 73, power: 72, icon: "🔴⚪", derbyRivals: ["bournemouth"], stadium: "St. Mary's Stadium", defaultEuro: "NONE" },
  { id: "ipswich", name: "Ipswich Town", code: "IPS", league: LEAGUES_DATA.PREMIER_LEAGUE, repReq: 35, skillReq: 62, salary: 18750, attPower: 70, defPower: 70, midPower: 71, power: 70, icon: "🚜", derbyRivals: ["norwich"], stadium: "Portman Road", defaultEuro: "NONE" }
];

export const LA_LIGA_CLUBS = [
  { id: "real_madrid", name: "Real Madrid CF", code: "RMA", league: LEAGUES_DATA.LA_LIGA, repReq: 88, skillReq: 88, salary: 650000, attPower: 96, defPower: 94, midPower: 95, power: 95, icon: "👑", derbyRivals: ["barca", "atletico"], stadium: "Santiago Bernabéu", defaultEuro: "C1" },
  { id: "barca", name: "FC Barcelona", code: "BAR", league: LEAGUES_DATA.LA_LIGA, repReq: 85, skillReq: 87, salary: 500000, attPower: 94, defPower: 90, midPower: 93, power: 92, icon: "🔵🔴", derbyRivals: ["real_madrid", "espanyol"], stadium: "Spotify Camp Nou", defaultEuro: "C1" },
  { id: "atletico", name: "Atletico Madrid", code: "ATM", league: LEAGUES_DATA.LA_LIGA, repReq: 78, skillReq: 82, salary: 275000, attPower: 88, defPower: 90, midPower: 88, power: 89, icon: "🔴⚪", derbyRivals: ["real_madrid"], stadium: "Riyadh Air Metropolitano", defaultEuro: "C1" },
  { id: "girona", name: "Girona FC", code: "GIR", league: LEAGUES_DATA.LA_LIGA, repReq: 65, skillReq: 76, salary: 62500, attPower: 82, defPower: 79, midPower: 81, power: 81, icon: "🔴⚪", derbyRivals: ["barca", "espanyol"], stadium: "Montilivi", defaultEuro: "C1" },
  { id: "athletic_bilbao", name: "Athletic Bilbao", code: "ATH", league: LEAGUES_DATA.LA_LIGA, repReq: 68, skillReq: 78, salary: 80000, attPower: 82, defPower: 83, midPower: 82, power: 82, icon: "🦁", derbyRivals: ["sociedad"], stadium: "San Mamés", defaultEuro: "C2" },
  { id: "sociedad", name: "Real Sociedad", code: "RSO", league: LEAGUES_DATA.LA_LIGA, repReq: 65, skillReq: 76, salary: 70000, attPower: 80, defPower: 81, midPower: 82, power: 81, icon: "🔵⚪", derbyRivals: ["athletic_bilbao"], stadium: "Reale Arena", defaultEuro: "C2" },
  { id: "real_betis", name: "Real Betis", code: "BET", league: LEAGUES_DATA.LA_LIGA, repReq: 62, skillReq: 75, salary: 65000, attPower: 80, defPower: 79, midPower: 80, power: 80, icon: "🟢⚪", derbyRivals: ["sevilla"], stadium: "Benito Villamarín", defaultEuro: "C3" },
  { id: "villarreal", name: "Villarreal CF", code: "VIL", league: LEAGUES_DATA.LA_LIGA, repReq: 64, skillReq: 76, salary: 67500, attPower: 81, defPower: 79, midPower: 81, power: 80, icon: "🟡", derbyRivals: ["valencia"], stadium: "Estadio de la Cerámica", defaultEuro: "NONE" },
  { id: "valencia", name: "Valencia CF", code: "VAL", league: LEAGUES_DATA.LA_LIGA, repReq: 55, skillReq: 72, salary: 50000, attPower: 77, defPower: 78, midPower: 77, power: 77, icon: "🦇", derbyRivals: ["villarreal"], stadium: "Mestalla", defaultEuro: "NONE" },
  { id: "sevilla", name: "Sevilla FC", code: "SEV", league: LEAGUES_DATA.LA_LIGA, repReq: 58, skillReq: 73, salary: 57500, attPower: 78, defPower: 77, midPower: 78, power: 78, icon: "⚪🔴", derbyRivals: ["real_betis"], stadium: "Ramón Sánchez-Pizjuán", defaultEuro: "NONE" },
  { id: "osasuna", name: "CA Osasuna", code: "OSA", league: LEAGUES_DATA.LA_LIGA, repReq: 48, skillReq: 68, salary: 37500, attPower: 76, defPower: 77, midPower: 76, power: 76, icon: "🔴", derbyRivals: ["athletic_bilbao"], stadium: "El Sadar", defaultEuro: "NONE" },
  { id: "getafe", name: "Getafe CF", code: "GET", league: LEAGUES_DATA.LA_LIGA, repReq: 46, skillReq: 68, salary: 35000, attPower: 74, defPower: 78, midPower: 75, power: 76, icon: "🔵", derbyRivals: ["leganes", "rayo_vallecano"], stadium: "Coliseum", defaultEuro: "NONE" },
  { id: "celta_vigo", name: "Celta Vigo", code: "CEL", league: LEAGUES_DATA.LA_LIGA, repReq: 48, skillReq: 69, salary: 40000, attPower: 77, defPower: 75, midPower: 76, power: 76, icon: "🩵", derbyRivals: ["deportivo"], stadium: "Abanca-Balaídos", defaultEuro: "NONE" },
  { id: "mallorca", name: "RCD Mallorca", code: "MLL", league: LEAGUES_DATA.LA_LIGA, repReq: 46, skillReq: 67, salary: 35000, attPower: 75, defPower: 77, midPower: 75, power: 76, icon: "🔴", derbyRivals: ["valencia"], stadium: "Son Moix", defaultEuro: "NONE" },
  { id: "rayo_vallecano", name: "Rayo Vallecano", code: "RAY", league: LEAGUES_DATA.LA_LIGA, repReq: 44, skillReq: 66, salary: 32500, attPower: 75, defPower: 74, midPower: 75, power: 75, icon: "⚡", derbyRivals: ["getafe", "atletico"], stadium: "Vallecas", defaultEuro: "NONE" },
  { id: "las_palmas", name: "UD Las Palmas", code: "LPA", league: LEAGUES_DATA.LA_LIGA, repReq: 42, skillReq: 65, salary: 30000, attPower: 74, defPower: 74, midPower: 75, power: 74, icon: "🟡", derbyRivals: ["tenerife"], stadium: "Gran Canaria", defaultEuro: "NONE" },
  { id: "alaves", name: "Deportivo Alaves", code: "ALA", league: LEAGUES_DATA.LA_LIGA, repReq: 40, skillReq: 64, salary: 27500, attPower: 73, defPower: 75, midPower: 74, power: 74, icon: "🔵⚪", derbyRivals: ["athletic_bilbao"], stadium: "Mendizorrotza", defaultEuro: "NONE" },
  { id: "espanyol", name: "RCD Espanyol", code: "ESP", league: LEAGUES_DATA.LA_LIGA, repReq: 40, skillReq: 64, salary: 25000, attPower: 73, defPower: 73, midPower: 73, power: 73, icon: "🔵⚪", derbyRivals: ["barca"], stadium: "RCDE Stadium", defaultEuro: "NONE" },
  { id: "leganes", name: "CD Leganes", code: "LEG", league: LEAGUES_DATA.LA_LIGA, repReq: 35, skillReq: 62, salary: 20000, attPower: 71, defPower: 72, midPower: 71, power: 71, icon: "🥒", derbyRivals: ["getafe"], stadium: "Butarque", defaultEuro: "NONE" },
  { id: "valladolid", name: "Real Valladolid", code: "VLL", league: LEAGUES_DATA.LA_LIGA, repReq: 34, skillReq: 61, salary: 18750, attPower: 70, defPower: 71, midPower: 70, power: 70, icon: "🟣⚪", derbyRivals: ["celta_vigo"], stadium: "José Zorrilla", defaultEuro: "NONE" }
];

export const SERIE_A_CLUBS = [
  { id: "inter", name: "Inter Milan", code: "INT", league: LEAGUES_DATA.SERIE_A, repReq: 84, skillReq: 86, salary: 350000, attPower: 92, defPower: 93, midPower: 93, power: 93, icon: "⚫🔵", derbyRivals: ["ac_milan", "juventus"], stadium: "San Siro / Giuseppe Meazza", defaultEuro: "C1" },
  { id: "ac_milan", name: "AC Milan", code: "MIL", league: LEAGUES_DATA.SERIE_A, repReq: 80, skillReq: 83, salary: 237500, attPower: 88, defPower: 86, midPower: 87, power: 87, icon: "🔴⚫", derbyRivals: ["inter", "juventus"], stadium: "San Siro", defaultEuro: "C1" },
  { id: "juventus", name: "Juventus FC", code: "JUV", league: LEAGUES_DATA.SERIE_A, repReq: 82, skillReq: 85, salary: 312500, attPower: 87, defPower: 88, midPower: 87, power: 87, icon: "⚪⚫", derbyRivals: ["inter", "torino"], stadium: "Allianz Stadium (Torino)", defaultEuro: "C1" },
  { id: "atalanta", name: "Atalanta BC", code: "ATA", league: LEAGUES_DATA.SERIE_A, repReq: 76, skillReq: 81, salary: 150000, attPower: 88, defPower: 83, midPower: 86, power: 86, icon: "🔵⚫", derbyRivals: ["brescia", "inter"], stadium: "Gewiss Stadium", defaultEuro: "C1" },
  { id: "roma", name: "AS Roma", code: "ROM", league: LEAGUES_DATA.SERIE_A, repReq: 68, skillReq: 76, salary: 87500, attPower: 82, defPower: 81, midPower: 82, power: 82, icon: "🐺", derbyRivals: ["lazio", "juventus"], stadium: "Stadio Olimpico", defaultEuro: "C2" },
  { id: "lazio", name: "SS Lazio", code: "LAZ", league: LEAGUES_DATA.SERIE_A, repReq: 66, skillReq: 75, salary: 80000, attPower: 81, defPower: 81, midPower: 82, power: 81, icon: "🦅", derbyRivals: ["roma"], stadium: "Stadio Olimpico", defaultEuro: "C2" },
  { id: "napoli", name: "SSC Napoli", code: "NAP", league: LEAGUES_DATA.SERIE_A, repReq: 75, skillReq: 80, salary: 200000, attPower: 87, defPower: 85, midPower: 86, power: 86, icon: "🔵", derbyRivals: ["juventus", "roma"], stadium: "Diego Armando Maradona", defaultEuro: "NONE" },
  { id: "fiorentina", name: "ACF Fiorentina", code: "FIO", league: LEAGUES_DATA.SERIE_A, repReq: 60, skillReq: 73, salary: 65000, attPower: 80, defPower: 79, midPower: 80, power: 80, icon: "💜", derbyRivals: ["juventus"], stadium: "Artemio Franchi", defaultEuro: "C3" },
  { id: "bologna", name: "Bologna FC", code: "BOL", league: LEAGUES_DATA.SERIE_A, repReq: 62, skillReq: 74, salary: 60000, attPower: 79, defPower: 80, midPower: 80, power: 80, icon: "🔴🔵", derbyRivals: ["fiorentina"], stadium: "Renato Dall'Ara", defaultEuro: "C1" },
  { id: "torino", name: "Torino FC", code: "TOR", league: LEAGUES_DATA.SERIE_A, repReq: 52, skillReq: 70, salary: 50000, attPower: 77, defPower: 79, midPower: 78, power: 78, icon: "🐂", derbyRivals: ["juventus"], stadium: "Stadio Olimpico Grande Torino", defaultEuro: "NONE" },
  { id: "monza", name: "AC Monza", code: "MON", league: LEAGUES_DATA.SERIE_A, repReq: 45, skillReq: 68, salary: 37500, attPower: 75, defPower: 76, midPower: 76, power: 76, icon: "🔴", derbyRivals: ["ac_milan"], stadium: "U-Power Stadium", defaultEuro: "NONE" },
  { id: "genoa", name: "Genoa CFC", code: "GEN", league: LEAGUES_DATA.SERIE_A, repReq: 48, skillReq: 69, salary: 40000, attPower: 76, defPower: 77, midPower: 76, power: 76, icon: "🔴🔵", derbyRivals: ["sampdoria"], stadium: "Luigi Ferraris", defaultEuro: "NONE" },
  { id: "lecce", name: "US Lecce", code: "LEC", league: LEAGUES_DATA.SERIE_A, repReq: 42, skillReq: 66, salary: 30000, attPower: 74, defPower: 75, midPower: 74, power: 74, icon: "🟡🔴", derbyRivals: ["bari"], stadium: "Via del Mare", defaultEuro: "NONE" },
  { id: "verona", name: "Hellas Verona", code: "VER", league: LEAGUES_DATA.SERIE_A, repReq: 42, skillReq: 65, salary: 30000, attPower: 74, defPower: 74, midPower: 74, power: 74, icon: "🟡🔵", derbyRivals: ["chievo"], stadium: "Marcantonio Bentegodi", defaultEuro: "NONE" },
  { id: "udinese", name: "Udinese Calcio", code: "UDI", league: LEAGUES_DATA.SERIE_A, repReq: 46, skillReq: 67, salary: 35000, attPower: 75, defPower: 75, midPower: 75, power: 75, icon: "⚪⚫", derbyRivals: ["triestina"], stadium: "Bluenergy Stadium", defaultEuro: "NONE" },
  { id: "cagliari", name: "Cagliari Calcio", code: "CAG", league: LEAGUES_DATA.SERIE_A, repReq: 40, skillReq: 65, salary: 27500, attPower: 73, defPower: 74, midPower: 74, power: 74, icon: "🔴🔵", derbyRivals: ["torres"], stadium: "Unipol Domus", defaultEuro: "NONE" },
  { id: "empoli", name: "Empoli FC", code: "EMP", league: LEAGUES_DATA.SERIE_A, repReq: 38, skillReq: 64, salary: 25000, attPower: 73, defPower: 74, midPower: 73, power: 73, icon: "🔵", derbyRivals: ["fiorentina"], stadium: "Carlo Castellani", defaultEuro: "NONE" },
  { id: "parma", name: "Parma Calcio", code: "PAR", league: LEAGUES_DATA.SERIE_A, repReq: 36, skillReq: 63, salary: 23750, attPower: 73, defPower: 72, midPower: 73, power: 73, icon: "🟡🔵", derbyRivals: ["reggiana"], stadium: "Ennio Tardini", defaultEuro: "NONE" },
  { id: "como", name: "Como 1907", code: "COM", league: LEAGUES_DATA.SERIE_A, repReq: 40, skillReq: 65, salary: 27500, attPower: 74, defPower: 72, midPower: 74, power: 73, icon: "🔵", derbyRivals: ["varese"], stadium: "Giuseppe Sinigaglia", defaultEuro: "NONE" },
  { id: "venezia", name: "Venezia FC", code: "VEN", league: LEAGUES_DATA.SERIE_A, repReq: 34, skillReq: 62, salary: 20000, attPower: 70, defPower: 71, midPower: 71, power: 71, icon: "🦁", derbyRivals: ["padova"], stadium: "Pier Luigi Penzo", defaultEuro: "NONE" }
];

export const BUNDESLIGA_CLUBS = [
  { id: "bayern", name: "Bayern Munich", code: "BAY", league: LEAGUES_DATA.BUNDESLIGA, repReq: 88, skillReq: 88, salary: 600000, attPower: 95, defPower: 92, midPower: 94, power: 94, icon: "👑", derbyRivals: ["dortmund", "leverkusen"], stadium: "Allianz Arena", defaultEuro: "C1" },
  { id: "leverkusen", name: "Bayer Leverkusen", code: "B04", league: LEAGUES_DATA.BUNDESLIGA, repReq: 82, skillReq: 85, salary: 300000, attPower: 91, defPower: 90, midPower: 91, power: 91, icon: "🔴⚫", derbyRivals: ["koln", "bayern"], stadium: "BayArena", defaultEuro: "C1" },
  { id: "dortmund", name: "Borussia Dortmund", code: "BVB", league: LEAGUES_DATA.BUNDESLIGA, repReq: 78, skillReq: 83, salary: 250000, attPower: 88, defPower: 86, midPower: 88, power: 87, icon: "🟡⚫", derbyRivals: ["bayern", "schalke"], stadium: "Signal Iduna Park", defaultEuro: "C1" },
  { id: "leipzig", name: "RB Leipzig", code: "RBL", league: LEAGUES_DATA.BUNDESLIGA, repReq: 74, skillReq: 80, salary: 162500, attPower: 86, defPower: 84, midPower: 86, power: 85, icon: "🐂", derbyRivals: ["dortmund"], stadium: "Red Bull Arena", defaultEuro: "C1" },
  { id: "stuttgart", name: "VfB Stuttgart", code: "VFB", league: LEAGUES_DATA.BUNDESLIGA, repReq: 68, skillReq: 77, salary: 105000, attPower: 84, defPower: 82, midPower: 83, power: 83, icon: "⚪🔴", derbyRivals: ["karlsruhe"], stadium: "MHPArena", defaultEuro: "C1" },
  { id: "frankfurt", name: "Eintracht Frankfurt", code: "SGE", league: LEAGUES_DATA.BUNDESLIGA, repReq: 62, skillReq: 74, salary: 80000, attPower: 82, defPower: 80, midPower: 81, power: 81, icon: "🦅", derbyRivals: ["offenbach"], stadium: "Deutsche Bank Park", defaultEuro: "C2" },
  { id: "hoffenheim", name: "TSG Hoffenheim", code: "TSG", league: LEAGUES_DATA.BUNDESLIGA, repReq: 55, skillReq: 71, salary: 62500, attPower: 80, defPower: 78, midPower: 79, power: 79, icon: "🔵⚪", derbyRivals: ["stuttgart"], stadium: "PreZero Arena", defaultEuro: "C2" },
  { id: "freiburg", name: "SC Freiburg", code: "SCF", league: LEAGUES_DATA.BUNDESLIGA, repReq: 56, skillReq: 72, salary: 55000, attPower: 79, defPower: 80, midPower: 79, power: 79, icon: "⚫⚪", derbyRivals: ["stuttgart"], stadium: "Europa-Park Stadion", defaultEuro: "NONE" },
  { id: "werder_bremen", name: "Werder Bremen", code: "SVW", league: LEAGUES_DATA.BUNDESLIGA, repReq: 50, skillReq: 70, salary: 47500, attPower: 78, defPower: 77, midPower: 78, power: 78, icon: "🟢⚪", derbyRivals: ["hamburg"], stadium: "Weserstadion", defaultEuro: "NONE" },
  { id: "heidenheim", name: "1. FC Heidenheim", code: "FCH", league: LEAGUES_DATA.BUNDESLIGA, repReq: 46, skillReq: 68, salary: 35000, attPower: 76, defPower: 77, midPower: 76, power: 76, icon: "🔴🔵", derbyRivals: ["ulm"], stadium: "Voith-Arena", defaultEuro: "C3" },
  { id: "augsburg", name: "FC Augsburg", code: "FCA", league: LEAGUES_DATA.BUNDESLIGA, repReq: 45, skillReq: 68, salary: 37500, attPower: 76, defPower: 76, midPower: 76, power: 76, icon: "🔴🟢", derbyRivals: ["bayern"], stadium: "WWK Arena", defaultEuro: "NONE" },
  { id: "wolfsburg", name: "VfL Wolfsburg", code: "WOB", league: LEAGUES_DATA.BUNDESLIGA, repReq: 52, skillReq: 70, salary: 45000, attPower: 77, defPower: 76, midPower: 77, power: 77, icon: "🐺", derbyRivals: ["hannover"], stadium: "Volkswagen Arena", defaultEuro: "NONE" },
  { id: "gladbach", name: "Borussia Monchengladbach", code: "BMG", league: LEAGUES_DATA.BUNDESLIGA, repReq: 52, skillReq: 71, salary: 47500, attPower: 77, defPower: 76, midPower: 77, power: 77, icon: "🐎", derbyRivals: ["koln"], stadium: "Borussia-Park", defaultEuro: "NONE" },
  { id: "union_berlin", name: "Union Berlin", code: "FCU", league: LEAGUES_DATA.BUNDESLIGA, repReq: 48, skillReq: 69, salary: 40000, attPower: 75, defPower: 77, midPower: 75, power: 76, icon: "🔴⚪", derbyRivals: ["hertha"], stadium: "Stadion An der Alten Försterei", defaultEuro: "NONE" },
  { id: "bochum", name: "VfL Bochum", code: "BOC", league: LEAGUES_DATA.BUNDESLIGA, repReq: 40, skillReq: 65, salary: 30000, attPower: 73, defPower: 74, midPower: 73, power: 73, icon: "🔵⚪", derbyRivals: ["dortmund"], stadium: "Vonovia Ruhrstadion", defaultEuro: "NONE" },
  { id: "mainz", name: "Mainz 05", code: "M05", league: LEAGUES_DATA.BUNDESLIGA, repReq: 42, skillReq: 66, salary: 32500, attPower: 74, defPower: 74, midPower: 74, power: 74, icon: "🔴⚪", derbyRivals: ["frankfurt"], stadium: "Mewa Arena", defaultEuro: "NONE" },
  { id: "st_pauli", name: "FC St. Pauli", code: "STP", league: LEAGUES_DATA.BUNDESLIGA, repReq: 36, skillReq: 63, salary: 22500, attPower: 72, defPower: 73, midPower: 72, power: 72, icon: "🏴‍☠️", derbyRivals: ["hamburg"], stadium: "Millerntor-Stadion", defaultEuro: "NONE" },
  { id: "holstein_kiel", name: "Holstein Kiel", code: "KIE", league: LEAGUES_DATA.BUNDESLIGA, repReq: 34, skillReq: 61, salary: 18750, attPower: 70, defPower: 71, midPower: 70, power: 71, icon: "🔵⚪", derbyRivals: ["lubeck"], stadium: "Holstein-Stadion", defaultEuro: "NONE" }
];

export const LIGUE_1_CLUBS = [
  { id: "psg", name: "Paris Saint-Germain", code: "PSG", league: LEAGUES_DATA.LIGUE_1, repReq: 85, skillReq: 87, salary: 625000, attPower: 95, defPower: 92, midPower: 93, power: 93, icon: "👑", derbyRivals: ["marseille"], stadium: "Parc des Princes", defaultEuro: "C1" },
  { id: "monaco", name: "AS Monaco", code: "ASM", league: LEAGUES_DATA.LIGUE_1, repReq: 72, skillReq: 78, salary: 162500, attPower: 86, defPower: 83, midPower: 85, power: 85, icon: "🇲🇨", derbyRivals: ["nice"], stadium: "Stade Louis II", defaultEuro: "C1" },
  { id: "brest", name: "Stade Brestois 29", code: "SB29", league: LEAGUES_DATA.LIGUE_1, repReq: 60, skillReq: 74, salary: 55000, attPower: 80, defPower: 81, midPower: 81, power: 81, icon: "⚪🔴", derbyRivals: ["rennes"], stadium: "Stade Francis-Le Blé", defaultEuro: "C1" },
  { id: "lille", name: "Lille OSC", code: "LOSC", league: LEAGUES_DATA.LIGUE_1, repReq: 65, skillReq: 76, salary: 80000, attPower: 83, defPower: 82, midPower: 83, power: 83, icon: "🐶", derbyRivals: ["lens"], stadium: "Decathlon Arena", defaultEuro: "C1" },
  { id: "nice", name: "OGC Nice", code: "OGCN", league: LEAGUES_DATA.LIGUE_1, repReq: 62, skillReq: 75, salary: 70000, attPower: 80, defPower: 83, midPower: 81, power: 81, icon: "🦅", derbyRivals: ["monaco"], stadium: "Allianz Riviera", defaultEuro: "C2" },
  { id: "lyon", name: "Olympique Lyonnais", code: "OL", league: LEAGUES_DATA.LIGUE_1, repReq: 70, skillReq: 77, salary: 112500, attPower: 84, defPower: 80, midPower: 83, power: 82, icon: "🦁", derbyRivals: ["saint_etienne", "marseille"], stadium: "Groupama Stadium", defaultEuro: "C2" },
  { id: "lens", name: "RC Lens", code: "RCL", league: LEAGUES_DATA.LIGUE_1, repReq: 62, skillReq: 74, salary: 65000, attPower: 81, defPower: 81, midPower: 81, power: 81, icon: "🔴🟡", derbyRivals: ["lille"], stadium: "Stade Bollaert-Delelis", defaultEuro: "C3" },
  { id: "marseille", name: "Olympique Marseille", code: "OM", league: LEAGUES_DATA.LIGUE_1, repReq: 72, skillReq: 78, salary: 137500, attPower: 84, defPower: 82, midPower: 83, power: 83, icon: "⚪🔵", derbyRivals: ["psg", "lyon"], stadium: "Orange Vélodrome", defaultEuro: "NONE" },
  { id: "reims", name: "Stade de Reims", code: "SDR", league: LEAGUES_DATA.LIGUE_1, repReq: 48, skillReq: 69, salary: 42500, attPower: 77, defPower: 77, midPower: 77, power: 77, icon: "🔴⚪", derbyRivals: ["troyes"], stadium: "Stade Auguste-Delaune", defaultEuro: "NONE" },
  { id: "rennes", name: "Stade Rennais", code: "SRFC", league: LEAGUES_DATA.LIGUE_1, repReq: 60, skillReq: 73, salary: 62500, attPower: 80, defPower: 78, midPower: 80, power: 79, icon: "🔴⚫", derbyRivals: ["nantes"], stadium: "Roazhon Park", defaultEuro: "NONE" },
  { id: "toulouse", name: "Toulouse FC", code: "TFC", league: LEAGUES_DATA.LIGUE_1, repReq: 45, skillReq: 68, salary: 37500, attPower: 76, defPower: 76, midPower: 76, power: 76, icon: "🟣⚪", derbyRivals: ["bordeaux"], stadium: "Stadium de Toulouse", defaultEuro: "NONE" },
  { id: "montpellier", name: "Montpellier HSC", code: "MHSC", league: LEAGUES_DATA.LIGUE_1, repReq: 45, skillReq: 67, salary: 37500, attPower: 76, defPower: 75, midPower: 75, power: 75, icon: "🟠🔵", derbyRivals: ["nimes"], stadium: "Stade de la Mosson", defaultEuro: "NONE" },
  { id: "strasbourg", name: "RC Strasbourg", code: "RCSA", league: LEAGUES_DATA.LIGUE_1, repReq: 46, skillReq: 68, salary: 40000, attPower: 75, defPower: 75, midPower: 76, power: 75, icon: "🔵⚪", derbyRivals: ["metz"], stadium: "Stade de la Meinau", defaultEuro: "NONE" },
  { id: "nantes", name: "FC Nantes", code: "FCN", league: LEAGUES_DATA.LIGUE_1, repReq: 45, skillReq: 67, salary: 37500, attPower: 74, defPower: 76, midPower: 75, power: 75, icon: "🟡🟢", derbyRivals: ["rennes"], stadium: "Stade de la Beaujoire", defaultEuro: "NONE" },
  { id: "le_havre", name: "Le Havre AC", code: "HAC", league: LEAGUES_DATA.LIGUE_1, repReq: 38, skillReq: 64, salary: 27500, attPower: 72, defPower: 73, midPower: 72, power: 72, icon: "🩵💙", derbyRivals: ["caen"], stadium: "Stade Océane", defaultEuro: "NONE" },
  { id: "auxerre", name: "AJ Auxerre", code: "AJA", league: LEAGUES_DATA.LIGUE_1, repReq: 36, skillReq: 63, salary: 23750, attPower: 72, defPower: 72, midPower: 72, power: 72, icon: "⚪🔵", derbyRivals: ["dijon"], stadium: "Stade de l'Abbé-Deschamps", defaultEuro: "NONE" },
  { id: "angers", name: "Angers SCO", code: "SCO", league: LEAGUES_DATA.LIGUE_1, repReq: 35, skillReq: 62, salary: 21250, attPower: 71, defPower: 71, midPower: 71, power: 71, icon: "⚪⚫", derbyRivals: ["nantes"], stadium: "Stade Raymond Kopa", defaultEuro: "NONE" },
  { id: "saint_etienne", name: "AS Saint-Etienne", code: "ASSE", league: LEAGUES_DATA.LIGUE_1, repReq: 36, skillReq: 63, salary: 22500, attPower: 71, defPower: 72, midPower: 71, power: 71, icon: "🟢⚪", derbyRivals: ["lyon"], stadium: "Stade Geoffroy-Guichard", defaultEuro: "NONE" }
];

export const EURO_SUB_CLUBS = [
  { id: "feyenoord", name: "Feyenoord Rotterdam", code: "FEY", league: LEAGUES_DATA.EURO_SUB, repReq: 25, skillReq: 62, salary: 13750, attPower: 73, defPower: 71, midPower: 72, power: 72, icon: "🔴⚪", defaultEuro: "C2" },
  { id: "az_alkmaar", name: "AZ Alkmaar", code: "AZ", league: LEAGUES_DATA.EURO_SUB, repReq: 20, skillReq: 58, salary: 10000, attPower: 70, defPower: 68, midPower: 69, power: 69, icon: "🔴", defaultEuro: "C3" },
  { id: "ajax", name: "Ajax Amsterdam", code: "AJX", league: LEAGUES_DATA.EURO_SUB, repReq: 40, skillReq: 68, salary: 21250, attPower: 78, defPower: 75, midPower: 76, power: 76, icon: "⚪🔴", defaultEuro: "C1" },
  { id: "sporting", name: "Sporting CP", code: "SCP", league: LEAGUES_DATA.EURO_SUB, repReq: 42, skillReq: 70, salary: 23750, attPower: 80, defPower: 76, midPower: 78, power: 78, icon: "🟢⚪", defaultEuro: "C1" },
  { id: "benfica", name: "SL Benfica", code: "SLB", league: LEAGUES_DATA.EURO_SUB, repReq: 48, skillReq: 73, salary: 27500, attPower: 81, defPower: 78, midPower: 80, power: 79, icon: "🦅", defaultEuro: "C1" },
  { id: "braga", name: "SC Braga", code: "SCB", league: LEAGUES_DATA.EURO_SUB, repReq: 25, skillReq: 62, salary: 11250, attPower: 71, defPower: 69, midPower: 70, power: 70, icon: "🔴⚪", defaultEuro: "C2" },
  { id: "club_brugge", name: "Club Brugge", code: "CLU", league: LEAGUES_DATA.EURO_SUB, repReq: 28, skillReq: 63, salary: 12500, attPower: 72, defPower: 71, midPower: 71, power: 71, icon: "🔵⚫", defaultEuro: "C2" },
  { id: "genk", name: "KRC Genk", code: "GNK", league: LEAGUES_DATA.EURO_SUB, repReq: 18, skillReq: 56, salary: 8750, attPower: 68, defPower: 66, midPower: 67, power: 67, icon: "🔵", defaultEuro: "C3" },
  { id: "celtic", name: "Celtic FC", code: "CEL", league: LEAGUES_DATA.EURO_SUB, repReq: 32, skillReq: 65, salary: 15000, attPower: 74, defPower: 71, midPower: 72, power: 72, icon: "🍀", defaultEuro: "C2" },
  { id: "rangers", name: "Rangers FC", code: "RAN", league: LEAGUES_DATA.EURO_SUB, repReq: 28, skillReq: 62, salary: 12500, attPower: 71, defPower: 70, midPower: 70, power: 70, icon: "🔵", defaultEuro: "C3" },
  { id: "young_boys", name: "BSC Young Boys", code: "YBB", league: LEAGUES_DATA.EURO_SUB, repReq: 20, skillReq: 58, salary: 9500, attPower: 69, defPower: 68, midPower: 68, power: 68, icon: "🟡⚫", defaultEuro: "C3" },
  { id: "basel", name: "FC Basel", code: "BAS", league: LEAGUES_DATA.EURO_SUB, repReq: 18, skillReq: 55, salary: 8000, attPower: 67, defPower: 66, midPower: 66, power: 66, icon: "🔴🔵", defaultEuro: "NONE" },
  { id: "leeds", name: "Leeds United", code: "LEE", league: LEAGUES_DATA.EURO_SUB, repReq: 30, skillReq: 64, salary: 16250, attPower: 72, defPower: 70, midPower: 71, power: 71, icon: "⚪", defaultEuro: "NONE" },
  { id: "sunderland", name: "Sunderland AFC", code: "SUN", league: LEAGUES_DATA.EURO_SUB, repReq: 18, skillReq: 56, salary: 8750, attPower: 67, defPower: 66, midPower: 66, power: 66, icon: "🔴⚪", defaultEuro: "NONE" }
];

export const SAUDI_PRO_CLUBS = [
  { id: "al_hilal", name: "Al-Hilal SFC", code: "HIL", league: LEAGUES_DATA.SAUDI_PRO, repReq: 70, skillReq: 72, salary: 2625000, attPower: 88, defPower: 83, midPower: 86, power: 86, icon: "🔵", defaultEuro: "C1", isSaudiMLS: true, stadium: "Kingdom Arena", derbyRivals: ["al_nassr", "al_ittihad"] },
  { id: "al_nassr", name: "Al-Nassr FC", code: "NAS", league: LEAGUES_DATA.SAUDI_PRO, repReq: 65, skillReq: 70, salary: 2125000, attPower: 86, defPower: 79, midPower: 83, power: 83, icon: "🟡", defaultEuro: "NONE", isSaudiMLS: true, stadium: "Al-Awwal Park", derbyRivals: ["al_hilal", "al_shabab"] },
  { id: "al_ittihad", name: "Al-Ittihad Club", code: "ITT", league: LEAGUES_DATA.SAUDI_PRO, repReq: 65, skillReq: 70, salary: 1875000, attPower: 83, defPower: 79, midPower: 81, power: 81, icon: "🟡", defaultEuro: "NONE", isSaudiMLS: true, stadium: "King Abdullah Sports City", derbyRivals: ["al_ahli", "al_hilal"] },
  { id: "al_ahli", name: "Al-Ahli Saudi FC", code: "AHL", league: LEAGUES_DATA.SAUDI_PRO, repReq: 62, skillReq: 68, salary: 1625000, attPower: 84, defPower: 78, midPower: 81, power: 81, icon: "🟢⚪", defaultEuro: "C1", isSaudiMLS: true, stadium: "King Abdullah Sports City", derbyRivals: ["al_ittihad"] },
  { id: "al_shabab", name: "Al-Shabab FC", code: "SHB", league: LEAGUES_DATA.SAUDI_PRO, repReq: 25, skillReq: 62, salary: 37500, attPower: 76, defPower: 74, midPower: 75, power: 75, icon: "⚪⚫", defaultEuro: "NONE", stadium: "Al-Shabab Club Stadium", derbyRivals: ["al_nassr"] },
  { id: "al_ettifaq", name: "Al-Ettifaq FC", code: "ETF", league: LEAGUES_DATA.SAUDI_PRO, repReq: 22, skillReq: 60, salary: 30000, attPower: 76, defPower: 74, midPower: 75, power: 75, icon: "🟢🔴", defaultEuro: "NONE", stadium: "Ettifaq Club Stadium", derbyRivals: ["al_qadsiah"] },
  { id: "al_qadsiah", name: "Al-Qadsiah FC", code: "QAD", league: LEAGUES_DATA.SAUDI_PRO, repReq: 30, skillReq: 64, salary: 70000, attPower: 78, defPower: 76, midPower: 77, power: 77, icon: "🔴🟡", defaultEuro: "NONE", stadium: "Prince Saud bin Jalawi Stadium", derbyRivals: ["al_ettifaq"] },
  { id: "al_taawoun", name: "Al-Taawoun FC", code: "TAA", league: LEAGUES_DATA.SAUDI_PRO, repReq: 20, skillReq: 58, salary: 22500, attPower: 74, defPower: 73, midPower: 73, power: 73, icon: "🟡", defaultEuro: "NONE", stadium: "King Abdullah Sport City Stadium", derbyRivals: ["al_raed"] },
  { id: "al_fateh", name: "Al-Fateh SC", code: "FAT", league: LEAGUES_DATA.SAUDI_PRO, repReq: 18, skillReq: 56, salary: 20000, attPower: 73, defPower: 72, midPower: 72, power: 72, icon: "🔵🟢", defaultEuro: "NONE", stadium: "Prince Abdullah bin Jalawi Stadium", derbyRivals: ["al_ettifaq"] },
  { id: "damac", name: "Damac FC", code: "DAM", league: LEAGUES_DATA.SAUDI_PRO, repReq: 16, skillReq: 55, salary: 18750, attPower: 72, defPower: 71, midPower: 71, power: 71, icon: "🔴🟡", defaultEuro: "NONE", stadium: "Prince Sultan bin Abdul Aziz Stadium", derbyRivals: ["al_okhdood"] },
  { id: "al_khaleej", name: "Al-Khaleej FC", code: "KHL", league: LEAGUES_DATA.SAUDI_PRO, repReq: 16, skillReq: 55, salary: 17500, attPower: 71, defPower: 71, midPower: 71, power: 71, icon: "🟡🟢", defaultEuro: "NONE", stadium: "Prince Nayef bin Abdulaziz Stadium", derbyRivals: ["al_ettifaq"] },
  { id: "al_fayha", name: "Al-Fayha FC", code: "FAY", league: LEAGUES_DATA.SAUDI_PRO, repReq: 16, skillReq: 55, salary: 17500, attPower: 71, defPower: 71, midPower: 71, power: 71, icon: "🟠🔵", defaultEuro: "NONE", stadium: "Al Majma'ah Sports City", derbyRivals: ["al_taawoun"] },
  { id: "al_riyadh", name: "Al-Riyadh SC", code: "RIY", league: LEAGUES_DATA.SAUDI_PRO, repReq: 15, skillReq: 54, salary: 16250, attPower: 70, defPower: 70, midPower: 70, power: 70, icon: "🔴⚫", defaultEuro: "NONE", stadium: "Prince Turki bin Abdul Aziz Stadium", derbyRivals: ["al_shabab"] },
  { id: "al_raed", name: "Al-Raed FC", code: "RAE", league: LEAGUES_DATA.SAUDI_PRO, repReq: 15, skillReq: 54, salary: 16250, attPower: 70, defPower: 70, midPower: 70, power: 70, icon: "🔴⚫", defaultEuro: "NONE", stadium: "King Abdullah Sport City Stadium", derbyRivals: ["al_taawoun"] },
  { id: "al_wehda", name: "Al-Wehda FC", code: "WEH", league: LEAGUES_DATA.SAUDI_PRO, repReq: 15, skillReq: 54, salary: 16250, attPower: 70, defPower: 70, midPower: 70, power: 70, icon: "🔴⚪", defaultEuro: "NONE", stadium: "King Abdulaziz Sports City", derbyRivals: ["al_ittihad"] },
  { id: "al_okhdood", name: "Al-Okhdood Club", code: "OKH", league: LEAGUES_DATA.SAUDI_PRO, repReq: 14, skillReq: 53, salary: 15000, attPower: 69, defPower: 69, midPower: 69, power: 69, icon: "🔵⚪", defaultEuro: "NONE", stadium: "Prince Hathloul Stadium", derbyRivals: ["damac"] },
  { id: "al_orobah", name: "Al-Orobah FC", code: "ORO", league: LEAGUES_DATA.SAUDI_PRO, repReq: 14, skillReq: 52, salary: 13750, attPower: 68, defPower: 68, midPower: 68, power: 68, icon: "🟡🟢", defaultEuro: "NONE", stadium: "Al-Orubah Club Stadium", derbyRivals: ["al_fayha"] },
  { id: "al_kholood", name: "Al-Kholood Club", code: "KHO", league: LEAGUES_DATA.SAUDI_PRO, repReq: 14, skillReq: 52, salary: 13750, attPower: 68, defPower: 68, midPower: 68, power: 68, icon: "🔴⚪", defaultEuro: "NONE", stadium: "Al-Hazem Club Stadium", derbyRivals: ["al_taawoun"] }
];

export const MLS_CLUBS = [
  { id: "inter_miami", name: "Inter Miami CF", code: "MIA", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 60, skillReq: 68, salary: 1125000, attPower: 83, defPower: 74, midPower: 80, power: 79, icon: "🦩", defaultEuro: "C1", isSaudiMLS: true, stadium: "Chase Stadium", derbyRivals: ["orlando_city"] },
  { id: "la_galaxy", name: "LA Galaxy", code: "LAG", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 55, skillReq: 65, salary: 800000, attPower: 80, defPower: 74, midPower: 77, power: 77, icon: "⭐", defaultEuro: "NONE", isSaudiMLS: true, stadium: "Dignity Health Sports Park", derbyRivals: ["lafc"] },
  { id: "lafc", name: "Los Angeles FC (LAFC)", code: "LFC", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 45, skillReq: 64, salary: 300000, attPower: 79, defPower: 76, midPower: 77, power: 77, icon: "🖤💛", defaultEuro: "C2", stadium: "BMO Stadium", derbyRivals: ["la_galaxy"] },
  { id: "columbus_crew", name: "Columbus Crew", code: "CLB", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 35, skillReq: 63, salary: 87500, attPower: 78, defPower: 76, midPower: 77, power: 77, icon: "🟡⚫", defaultEuro: "C1", stadium: "Lower.com Field", derbyRivals: ["fc_cincinnati"] },
  { id: "fc_cincinnati", name: "FC Cincinnati", code: "CIN", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 32, skillReq: 62, salary: 75000, attPower: 77, defPower: 75, midPower: 76, power: 76, icon: "🟠🔵", defaultEuro: "NONE", stadium: "TQL Stadium", derbyRivals: ["columbus_crew"] },
  { id: "philadelphia_union", name: "Philadelphia Union", code: "PHI", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 28, skillReq: 60, salary: 62500, attPower: 75, defPower: 75, midPower: 75, power: 75, icon: "🔵🟡", defaultEuro: "NONE", stadium: "Subaru Park", derbyRivals: ["ny_red_bulls"] },
  { id: "atlanta_united", name: "Atlanta United FC", code: "ATL", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 30, skillReq: 62, salary: 80000, attPower: 76, defPower: 74, midPower: 75, power: 75, icon: "🔴⚫", defaultEuro: "NONE", stadium: "Mercedes-Benz Stadium", derbyRivals: ["orlando_city", "nashville_sc"] },
  { id: "ny_red_bulls", name: "New York Red Bulls", code: "RBNY", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 28, skillReq: 60, salary: 60000, attPower: 74, defPower: 75, midPower: 75, power: 75, icon: "🔴🐂", defaultEuro: "NONE", stadium: "Red Bull Arena", derbyRivals: ["new_york_city_fc"] },
  { id: "new_york_city_fc", name: "New York City FC", code: "NYC", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 28, skillReq: 60, salary: 62500, attPower: 75, defPower: 74, midPower: 75, power: 75, icon: "🔵", defaultEuro: "NONE", stadium: "Yankee Stadium", derbyRivals: ["ny_red_bulls"] },
  { id: "seattle_sounders", name: "Seattle Sounders FC", code: "SEA", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 30, skillReq: 62, salary: 70000, attPower: 75, defPower: 75, midPower: 75, power: 75, icon: "🟢🔵", defaultEuro: "NONE", stadium: "Lumen Field", derbyRivals: ["portland_timbers"] },
  { id: "portland_timbers", name: "Portland Timbers", code: "POR", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 25, skillReq: 60, salary: 55000, attPower: 75, defPower: 73, midPower: 74, power: 74, icon: "🌲", defaultEuro: "NONE", stadium: "Providence Park", derbyRivals: ["seattle_sounders"] },
  { id: "houston_dynamo", name: "Houston Dynamo FC", code: "HOU", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 22, skillReq: 58, salary: 45000, attPower: 74, defPower: 74, midPower: 74, power: 74, icon: "🟠", defaultEuro: "NONE", stadium: "Shell Energy Stadium", derbyRivals: ["austin_fc"] },
  { id: "orlando_city", name: "Orlando City SC", code: "ORL", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 25, skillReq: 60, salary: 55000, attPower: 75, defPower: 73, midPower: 74, power: 74, icon: "🟣🦁", defaultEuro: "NONE", stadium: "Inter&Co Stadium", derbyRivals: ["inter_miami"] },
  { id: "toronto_fc", name: "Toronto FC", code: "TOR", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 24, skillReq: 59, salary: 50000, attPower: 73, defPower: 72, midPower: 73, power: 73, icon: "🔴🍁", defaultEuro: "NONE", stadium: "BMO Field", derbyRivals: ["cf_montreal"] },
  { id: "cf_montreal", name: "CF Montréal", code: "MTL", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 20, skillReq: 57, salary: 40000, attPower: 72, defPower: 72, midPower: 72, power: 72, icon: "🔵⚫", defaultEuro: "NONE", stadium: "Stade Saputo", derbyRivals: ["toronto_fc"] },
  { id: "sporting_kc", name: "Sporting Kansas City", code: "SKC", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 22, skillReq: 58, salary: 42500, attPower: 73, defPower: 72, midPower: 72, power: 72, icon: "🔵", defaultEuro: "NONE", stadium: "Children's Mercy Park", derbyRivals: ["st_louis_city"] },
  { id: "austin_fc", name: "Austin FC", code: "ATX", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 22, skillReq: 58, salary: 42500, attPower: 73, defPower: 72, midPower: 72, power: 72, icon: "🟢🌳", defaultEuro: "NONE", stadium: "Q2 Stadium", derbyRivals: ["houston_dynamo"] },
  { id: "minnesota_united", name: "Minnesota United FC", code: "MIN", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 22, skillReq: 58, salary: 42500, attPower: 73, defPower: 72, midPower: 73, power: 73, icon: "🔵🦅", defaultEuro: "NONE", stadium: "Allianz Field", derbyRivals: ["sporting_kc"] },
  { id: "nashville_sc", name: "Nashville SC", code: "NSH", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 24, skillReq: 59, salary: 47500, attPower: 74, defPower: 74, midPower: 74, power: 74, icon: "🟡", defaultEuro: "NONE", stadium: "GEODIS Park", derbyRivals: ["atlanta_united"] },
  { id: "st_louis_city", name: "St. Louis City SC", code: "STL", league: LEAGUES_DATA.MLS_AMERICAS, repReq: 22, skillReq: 58, salary: 42500, attPower: 73, defPower: 73, midPower: 73, power: 73, icon: "🔴🔵", defaultEuro: "NONE", stadium: "Energizer Park", derbyRivals: ["sporting_kc"] }
];

export const SAUDI_MLS_CLUBS = [...SAUDI_PRO_CLUBS, ...MLS_CLUBS];

export const LEAGUE_TEAMS_MAP = {
  PREMIER_LEAGUE: PREMIER_LEAGUE_CLUBS,
  LA_LIGA: LA_LIGA_CLUBS,
  SERIE_A: SERIE_A_CLUBS,
  BUNDESLIGA: BUNDESLIGA_CLUBS,
  LIGUE_1: LIGUE_1_CLUBS,
  EURO_SUB: EURO_SUB_CLUBS,
  SAUDI_PRO: SAUDI_PRO_CLUBS,
  MLS_AMERICAS: MLS_CLUBS
};

export const ALL_CLUBS = [
  ...PREMIER_LEAGUE_CLUBS,
  ...LA_LIGA_CLUBS,
  ...SERIE_A_CLUBS,
  ...BUNDESLIGA_CLUBS,
  ...LIGUE_1_CLUBS,
  ...EURO_SUB_CLUBS,
  ...SAUDI_PRO_CLUBS,
  ...MLS_CLUBS
];

/**
 * Ngân hàng các siêu sao cạnh tranh Vua Phá Lưới (Top Scorers Pool) theo từng giải đấu
 */
export const REAL_RIVAL_SCORERS = {
  YOUTH_LEAGUE: [
    // Real Madrid Castilla
    { name: "Álvaro Rodríguez", clubId: "castilla", clubName: "Real Madrid Castilla", clubCode: "CAS", clubIcon: "👑", rating: 77, avgGPR: 0.72 },
    { name: "Nico Paz", clubId: "castilla", clubName: "Real Madrid Castilla", clubCode: "CAS", clubIcon: "👑", rating: 76, avgGPR: 0.65 },
    { name: "Gonzalo García", clubId: "castilla", clubName: "Real Madrid Castilla", clubCode: "CAS", clubIcon: "👑", rating: 75, avgGPR: 0.62 },
    // Barcelona La Masia
    { name: "Marc Guiu", clubId: "la_masia", clubName: "FC Barcelona La Masia", clubCode: "MAS", clubIcon: "🔵🔴", rating: 77, avgGPR: 0.70 },
    { name: "Dani Rodríguez", clubId: "la_masia", clubName: "FC Barcelona La Masia", clubCode: "MAS", clubIcon: "🔵🔴", rating: 75, avgGPR: 0.60 },
    { name: "Toni Fernández", clubId: "la_masia", clubName: "FC Barcelona La Masia", clubCode: "MAS", clubIcon: "🔵🔴", rating: 74, avgGPR: 0.58 },
    // Man United Carrington
    { name: "Ethan Wheatley", clubId: "carrington", clubName: "Man United Carrington", clubCode: "CAR", clubIcon: "👹", rating: 75, avgGPR: 0.68 },
    { name: "Gabriele Biancheri", clubId: "carrington", clubName: "Man United Carrington", clubCode: "CAR", clubIcon: "👹", rating: 74, avgGPR: 0.62 },
    // Bayern Campus
    { name: "Jonah Kusi-Asare", clubId: "bayern_junior", clubName: "FC Bayern Campus", clubCode: "BAY", clubIcon: "🔴", rating: 76, avgGPR: 0.68 },
    { name: "Javier Fernández", clubId: "bayern_junior", clubName: "FC Bayern Campus", clubCode: "BAY", clubIcon: "🔴", rating: 75, avgGPR: 0.60 },
    // Chelsea Cobham
    { name: "Tyrique George", clubId: "cobham", clubName: "Chelsea Cobham Academy", clubCode: "COB", clubIcon: "🔵", rating: 76, avgGPR: 0.65 },
    { name: "Shim Mheuka", clubId: "cobham", clubName: "Chelsea Cobham Academy", clubCode: "COB", clubIcon: "🔵", rating: 74, avgGPR: 0.58 },
    // Ajax De Toekomst
    { name: "Don-Angelo Konadu", clubId: "ajax_academy", clubName: "Ajax De Toekomst", clubCode: "AJX", clubIcon: "⚪🔴", rating: 75, avgGPR: 0.62 },
    { name: "Jan Faberski", clubId: "ajax_academy", clubName: "Ajax De Toekomst", clubCode: "AJX", clubIcon: "⚪🔴", rating: 75, avgGPR: 0.60 },
    // Benfica Campus
    { name: "Gustavo Varela", clubId: "benfica_campus", clubName: "Benfica Seixal Campus", clubCode: "SLB", clubIcon: "🦅", rating: 75, avgGPR: 0.64 },
    { name: "José Melro", clubId: "benfica_campus", clubName: "Benfica Seixal Campus", clubCode: "SLB", clubIcon: "🦅", rating: 75, avgGPR: 0.62 },
    // Sporting Academy
    { name: "Gabriel Silva", clubId: "sporting_acad", clubName: "Sporting CP Academy", clubCode: "SCP", clubIcon: "🟢⚪", rating: 75, avgGPR: 0.63 },
    { name: "Afonso Moreira", clubId: "sporting_acad", clubName: "Sporting CP Academy", clubCode: "SCP", clubIcon: "🟢⚪", rating: 75, avgGPR: 0.61 },
    // Borussia Dortmund Youth
    { name: "Paris Brunner", clubId: "dortmund_youth", clubName: "Borussia Dortmund Youth", clubCode: "BVB", clubIcon: "🟡⚫", rating: 76, avgGPR: 0.66 },
    { name: "Cole Campbell", clubId: "dortmund_youth", clubName: "Borussia Dortmund Youth", clubCode: "BVB", clubIcon: "🟡⚫", rating: 74, avgGPR: 0.58 },
    // Arsenal Hale End
    { name: "Ethan Nwaneri", clubId: "hale_end", clubName: "Arsenal Hale End", clubCode: "ARS", clubIcon: "🔴⚪", rating: 77, avgGPR: 0.68 },
    { name: "Chido Obi-Martin", clubId: "hale_end", clubName: "Arsenal Hale End", clubCode: "ARS", clubIcon: "🔴⚪", rating: 76, avgGPR: 0.65 },
    // Man City CFA
    { name: "Justin Oboavwoduo", clubId: "city_cfa", clubName: "Man City CFA", clubCode: "MCI", clubIcon: "🩵", rating: 76, avgGPR: 0.65 },
    { name: "Joel Ndala", clubId: "city_cfa", clubName: "Man City CFA", clubCode: "MCI", clubIcon: "🩵", rating: 75, avgGPR: 0.60 },
    // Juventus Primavera
    { name: "Lorenzo Anghelè", clubId: "juventus_youth", clubName: "Juventus Primavera", clubCode: "JUV", clubIcon: "⚪⚫", rating: 75, avgGPR: 0.62 },
    { name: "Tommaso Mancini", clubId: "juventus_youth", clubName: "Juventus Primavera", clubCode: "JUV", clubIcon: "⚪⚫", rating: 74, avgGPR: 0.58 },
    // Inter Milan Youth
    { name: "Issiaka Kamate", clubId: "inter_youth", clubName: "Inter Milan Youth", clubCode: "INT", clubIcon: "🔵⚫", rating: 75, avgGPR: 0.63 },
    { name: "Amadou Sarr", clubId: "inter_youth", clubName: "Inter Milan Youth", clubCode: "INT", clubIcon: "🔵⚫", rating: 74, avgGPR: 0.58 },
    // PSG Youth Academy
    { name: "Senny Mayulu", clubId: "psg_youth", clubName: "PSG Youth Academy", clubCode: "PSG", clubIcon: "🔵🔴", rating: 76, avgGPR: 0.66 },
    { name: "Mahamadou Sangaré", clubId: "psg_youth", clubName: "PSG Youth Academy", clubCode: "PSG", clubIcon: "🔵🔴", rating: 75, avgGPR: 0.61 },
    // INF Clairefontaine
    { name: "Eli Junior Kroupi", clubId: "clairefontaine", clubName: "INF Clairefontaine", clubCode: "CLA", clubIcon: "🇫🇷", rating: 76, avgGPR: 0.68 },
    { name: "Mathis Lambourde", clubId: "clairefontaine", clubName: "INF Clairefontaine", clubCode: "CLA", clubIcon: "🇫🇷", rating: 74, avgGPR: 0.58 },
    // PVF Football Academy
    { name: "Nguyễn Lê Phát", clubId: "pvf_academy", clubName: "PVF Football Academy", clubCode: "PVF", clubIcon: "🇻🇳", rating: 74, avgGPR: 0.60 },
    { name: "Phùng Quang Tú", clubId: "pvf_academy", clubName: "PVF Football Academy", clubCode: "PVF", clubIcon: "🇻🇳", rating: 73, avgGPR: 0.55 }
  ],
  PREMIER_LEAGUE: [
    { name: "Erling Haaland", clubId: "man_city", clubName: "Manchester City", clubCode: "MCI", clubIcon: "👑", rating: 91, avgGPR: 0.85 },
    { name: "Mohamed Salah", clubId: "liverpool", clubName: "Liverpool FC", clubCode: "LIV", clubIcon: "🔴", rating: 89, avgGPR: 0.65 },
    { name: "Bukayo Saka", clubId: "arsenal", clubName: "Arsenal FC", clubCode: "ARS", clubIcon: "🔴", rating: 87, avgGPR: 0.50 },
    { name: "Cole Palmer", clubId: "chelsea", clubName: "Chelsea FC", clubCode: "CHE", clubIcon: "🔵", rating: 86, avgGPR: 0.55 },
    { name: "Alexander Isak", clubId: "newcastle", clubName: "Newcastle United", clubCode: "NEW", clubIcon: "⚪⚫", rating: 85, avgGPR: 0.52 },
    { name: "Ollie Watkins", clubId: "aston_villa", clubName: "Aston Villa", clubCode: "AVL", clubIcon: "🦁", rating: 84, avgGPR: 0.48 }
  ],
  LA_LIGA: [
    { name: "Kylian Mbappé", clubId: "real_madrid", clubName: "Real Madrid CF", clubCode: "RMA", clubIcon: "👑", rating: 92, avgGPR: 0.88 },
    { name: "Robert Lewandowski", clubId: "barca", clubName: "FC Barcelona", clubCode: "BAR", clubIcon: "🔵🔴", rating: 89, avgGPR: 0.72 },
    { name: "Vinícius Júnior", clubId: "real_madrid", clubName: "Real Madrid CF", clubCode: "RMA", clubIcon: "👑", rating: 90, avgGPR: 0.62 },
    { name: "Lamine Yamal", clubId: "barca", clubName: "FC Barcelona", clubCode: "BAR", clubIcon: "🔵🔴", rating: 85, avgGPR: 0.45 },
    { name: "Antoine Griezmann", clubId: "atletico", clubName: "Atletico Madrid", clubCode: "ATM", clubIcon: "🔴⚪", rating: 87, avgGPR: 0.52 },
    { name: "Alexander Sørloth", clubId: "atletico", clubName: "Atletico Madrid", clubCode: "ATM", clubIcon: "🔴⚪", rating: 83, avgGPR: 0.46 }
  ],
  SERIE_A: [
    { name: "Lautaro Martínez", clubName: "Inter Milan", clubCode: "INT", clubIcon: "⚫🔵", rating: 89, avgGPR: 0.68 },
    { name: "Dušan Vlahović", clubName: "Juventus FC", clubCode: "JUV", clubIcon: "⚪⚫", rating: 86, avgGPR: 0.55 },
    { name: "Rafael Leão", clubName: "AC Milan", clubCode: "MIL", clubIcon: "🔴⚫", rating: 87, avgGPR: 0.48 },
    { name: "Ademola Lookman", clubName: "Atalanta BC", clubCode: "ATA", clubIcon: "🔵⚫", rating: 84, avgGPR: 0.50 },
    { name: "Romelu Lukaku", clubName: "SSC Napoli", clubCode: "NAP", clubIcon: "🔵", rating: 85, avgGPR: 0.52 }
  ],
  BUNDESLIGA: [
    { name: "Harry Kane", clubName: "Bayern Munich", clubCode: "BAY", clubIcon: "👑", rating: 91, avgGPR: 0.90 },
    { name: "Serhou Guirassy", clubName: "Borussia Dortmund", clubCode: "BVB", clubIcon: "🟡⚫", rating: 85, avgGPR: 0.60 },
    { name: "Florian Wirtz", clubName: "Bayer Leverkusen", clubCode: "B04", clubIcon: "🔴⚫", rating: 88, avgGPR: 0.48 },
    { name: "Loïs Openda", clubName: "RB Leipzig", clubCode: "RBL", clubIcon: "🐂", rating: 84, avgGPR: 0.55 },
    { name: "Victor Boniface", clubName: "Bayer Leverkusen", clubCode: "B04", clubIcon: "🔴⚫", rating: 84, avgGPR: 0.52 }
  ],
  LIGUE_1: [
    { name: "Ousmane Dembélé", clubName: "Paris Saint-Germain", clubCode: "PSG", clubIcon: "👑", rating: 87, avgGPR: 0.45 },
    { name: "Bradley Barcola", clubName: "Paris Saint-Germain", clubCode: "PSG", clubIcon: "👑", rating: 84, avgGPR: 0.50 },
    { name: "Jonathan David", clubName: "Lille OSC", clubCode: "LOSC", clubIcon: "🐶", rating: 83, avgGPR: 0.55 },
    { name: "Pierre-Emerick Aubameyang", clubName: "Olympique Marseille", clubCode: "OM", clubIcon: "⚪🔵", rating: 83, avgGPR: 0.52 },
    { name: "Alexandre Lacazette", clubName: "Olympique Lyonnais", clubCode: "OL", clubIcon: "🦁", rating: 83, avgGPR: 0.50 }
  ],
  SAUDI_PRO: [
    { name: "Cristiano Ronaldo", clubName: "Al-Nassr FC", clubCode: "NAS", clubIcon: "🟡", rating: 91, avgGPR: 0.95 },
    { name: "Aleksandar Mitrović", clubName: "Al-Hilal SFC", clubCode: "HIL", clubIcon: "🔵", rating: 88, avgGPR: 0.85 },
    { name: "Karim Benzema", clubName: "Al-Ittihad Club", clubCode: "ITT", clubIcon: "🟡", rating: 87, avgGPR: 0.65 },
    { name: "Ivan Toney", clubName: "Al-Ahli Saudi FC", clubCode: "AHL", clubIcon: "🟢⚪", rating: 85, avgGPR: 0.60 },
    { name: "Moussa Diaby", clubName: "Al-Ittihad Club", clubCode: "ITT", clubIcon: "🟡", rating: 84, avgGPR: 0.45 }
  ],
  MLS_AMERICAS: [
    { name: "Lionel Messi", clubName: "Inter Miami CF", clubCode: "MIA", clubIcon: "🦩", rating: 92, avgGPR: 0.90 },
    { name: "Luis Suárez", clubName: "Inter Miami CF", clubCode: "MIA", clubIcon: "🦩", rating: 87, avgGPR: 0.70 },
    { name: "Denis Bouanga", clubName: "Los Angeles FC (LAFC)", clubCode: "LFC", clubIcon: "🖤💛", rating: 85, avgGPR: 0.65 },
    { name: "Cucho Hernández", clubName: "Columbus Crew", clubCode: "CLB", clubIcon: "🟡⚫", rating: 84, avgGPR: 0.55 },
    { name: "Gabriel Pec", clubName: "LA Galaxy", clubCode: "LAG", clubIcon: "⭐", rating: 83, avgGPR: 0.50 }
  ],
  EURO_SUB: [
    { name: "Viktor Gyökeres", clubName: "Sporting CP", clubCode: "SCP", clubIcon: "🟢⚪", rating: 88, avgGPR: 0.85 },
    { name: "Brian Brobbey", clubName: "Ajax Amsterdam", clubCode: "AJX", clubIcon: "⚪🔴", rating: 83, avgGPR: 0.55 },
    { name: "Vangelis Pavlidis", clubName: "SL Benfica", clubCode: "SLB", clubIcon: "🦅", rating: 84, avgGPR: 0.60 },
    { name: "Kyogo Furuhashi", clubName: "Celtic FC", clubCode: "CEL", clubIcon: "🍀", rating: 82, avgGPR: 0.52 }
  ]
};

export const YOUTH_RIVAL_SCORERS = [
  { id: 'alvaro_rodriguez', name: 'Álvaro Rodríguez', clubName: 'Real Madrid Castilla', baseGPR: 0.62 },
  { id: 'marc_guiu', name: 'Marc Guiu', clubName: 'FC Barcelona La Masia', baseGPR: 0.58 },
  { id: 'ethan_wheatley', name: 'Ethan Wheatley', clubName: 'Man United Carrington', baseGPR: 0.55 },
  { id: 'jonah_kusi', name: 'Jonah Kusi-Asare', clubName: 'FC Bayern Campus', baseGPR: 0.52 },
  { id: 'tyrique_george', name: 'Tyrique George', clubName: 'Chelsea Cobham Academy', baseGPR: 0.50 },
  { id: 'don_konadu', name: 'Don-Angelo Konadu', clubName: 'Ajax De Toekomst', baseGPR: 0.48 },
  { id: 'gustavo_varela', name: 'Gustavo Varela', clubName: 'Benfica Seixal Campus', baseGPR: 0.46 },
  { id: 'gabriel_silva', name: 'Gabriel Silva', clubName: 'Sporting Academy', baseGPR: 0.44 }
];

/* =========================================================================
   8. RICH LIFESTYLE, BUFF EQUIPMENT, SUBSCRIPTIONS & ASSETS CATALOG
   ========================================================================= */
export const LIFESTYLE_CATALOG = {
  // A. Dụng cụ & Trang thiết bị thi đấu (Equipment & Consumables - Mua 1 lần hoặc Tiêu hao)
  equipment: [
    // --- VẬT PHẨM & TRANG BỊ KHỞI ĐIỂM CHO TÂN BINH ($2k - $10k) ---
    {
      id: "eq_electrolyte_drink",
      name: "Bình Phục Hồi Điện Giải Nhanh",
      category: "CONSUMABLE",
      icon: "🥤",
      cost: 2000,
      badgeText: "Tiêu Hao",
      desc: "Nước uống bổ sung điện giải và khoáng chất hồi phục thể lực tức thì sau các buổi tập nặng.",
      buffSummary: "Hồi ngay +20 Thể lực (Stamina) tức thì",
      consumable: true,
      stamInstant: 20
    },
    {
      id: "eq_academy_boots",
      name: "Giày Tập Academy Bứt Tốc",
      category: "EQUIPMENT",
      icon: "👟",
      cost: 5000,
      badgeText: "Tân Binh",
      desc: "Đôi giày tập cơ bản của học viện, tối ưu khả năng bứt tốc và ra chân dứt điểm.",
      buffSummary: "+1 Tốc độ (PAC), +1 Sút bóng (SHO)",
      statsBuff: { pac: 1, sho: 1 },
      attr1Buff: 1,
      attr2Buff: 1
    },
    {
      id: "eq_video_analysis",
      name: "Khóa Học Phân Tích Băng Hình",
      category: "EQUIPMENT",
      icon: "📹",
      cost: 8000,
      badgeText: "Chiến Thuật",
      desc: "Khóa học đọc băng hình và phân tích dữ liệu đối thủ cùng chuyên gia chiến thuật.",
      buffSummary: "Tăng 10% tốc độ cày chỉ số trận tiếp theo (+10% EXP phát triển)",
      expGrowthBonus: 0.10,
      statsBuff: { pas: 1, dri: 1 }
    },

    // --- NHÓM TRANG BỊ & PHỤ KIỆN BỔ SUNG TRUNG CẤP ($15k - $80k) ---
    {
      id: "eq_gripsox",
      name: "Tất Thi Đấu Chống Trượt GripSox Pro",
      category: "EQUIPMENT",
      icon: "🧦",
      cost: 15000,
      badgeText: "Phụ Kiện",
      desc: "Miếng đệm silicon chống trượt trong giày, tạo điểm tựa vững chắc khi chuyển hướng gấp và rê bóng trên mặt sân trơn.",
      buffSummary: "+1 Rê bóng (DRI), +1 Tốc độ (PAC), giảm 10% tỷ lệ trượt ngã / mất bóng trong điều kiện mưa sân trơn",
      statsBuff: { dri: 1, pac: 1 }
    },
    {
      id: "eq_gps_vest",
      name: "Áo Lót Đo Chỉ Số GPS Cầu Thủ Pro",
      category: "EQUIPMENT",
      icon: "🎽",
      cost: 35000,
      badgeText: "Công Nghệ",
      desc: "Áo nén thông minh gắn chip định vị GPS và cảm biến nhịp tim, theo dõi tải vận động giúp tăng 5% hiệu quả tập luyện.",
      buffSummary: "+2 Thể chất (PHY), theo dõi tải vận động giúp tăng 5% hiệu quả các buổi tập thể lực",
      statsBuff: { phy: 2 },
      trainBuff: 0.05
    },
    {
      id: "eq_theragun",
      name: "Súng Massage Cơ Phục Hồi Cao Cấp Theragun",
      category: "EQUIPMENT",
      icon: "💆",
      cost: 50000,
      badgeText: "Trị Liệu",
      desc: "Thiết bị gõ cơ tần số cao giải phóng axit lactic, thư giãn sâu các nhóm cơ đùi và bắp chân sau trận chiến căng thẳng.",
      buffSummary: "+10 Thể lực tối đa (Stamina limit), tự động hồi thêm +5 Thể lực sau mỗi trận đấu",
      stamBuff: 10,
      postMatchStamBonus: 5
    },
    {
      id: "eq_home_gym",
      name: "Gói Thiết Bị Phòng Gym Gia Đình Mini",
      category: "EQUIPMENT",
      icon: "🏋️",
      cost: 75000,
      badgeText: "Rèn Luyện",
      desc: "Bộ tạ đơn, dây kháng lực và khung gánh tạ đa năng tại nhà, duy trì thể lực và cảm giác cơ bắp hàng ngày.",
      buffSummary: "+1 Sút bóng (SHO), +1 Thể chất (PHY), duy trì Phong độ (Form) không tụt nhanh",
      statsBuff: { sho: 1, phy: 1 },
      formDecayResist: true
    },

    // --- TRANG THIẾT BỊ CHUYÊN NGHIỆP & CAO CẤP ($100k - $500k) ---
    {
      id: "eq_smartwatch",
      name: "Đồng Hồ Sinh Học Biometric Elite",
      category: "EQUIPMENT",
      icon: "⌚",
      cost: 100000,
      badgeText: "Trang Bị",
      desc: "Theo dõi nhịp tim, nồng độ oxy và tự động điều chỉnh chu kỳ giấc ngủ chuẩn khoa học thể thao.",
      buffSummary: "+5 Thể lực (Stamina), +2 Thể chất (PHY), tối ưu hóa tốc độ phục hồi cơ",
      stamBuff: 5,
      statsBuff: { phy: 2 }
    },
    {
      id: "eq_shinguards",
      name: "Bọc Ống Đồng Carbon Pro",
      category: "EQUIPMENT",
      icon: "🛡️",
      cost: 200000,
      badgeText: "Trang Bị",
      desc: "Chống va chạm và phân tán lực tác động từ các pha vào bóng thô bạo của đối phương.",
      buffSummary: "+2 Phòng ngự (DEF), +2 Thể chất (PHY), giảm 25% nguy cơ chấn thương",
      statsBuff: { def: 2, phy: 2 }
    },
    {
      id: "eq_gloves",
      name: "Găng Tay Thủ Môn Độ Dính Cao Pro Grip",
      category: "EQUIPMENT",
      icon: "🧤",
      cost: 300000,
      badgeText: "Chỉ Thủ Môn (GK)",
      desc: "Công nghệ mặt mút dính 4mm chuyên dụng trong mọi điều kiện thời tiết, tăng độ bám và phản xạ bắt bóng.",
      buffSummary: "+5 Phòng ngự (DEF/Cản phá), +4 Thể chất (PHY/Bắt dính) [Chỉ dành cho GK]",
      requiredPosition: "GK",
      statsBuff: { def: 5, phy: 4 },
      attr1Buff: 5,
      attr2Buff: 4
    },
    {
      id: "eq_boots",
      name: "Giày Thi Đấu Next-Gen Carbon",
      category: "EQUIPMENT",
      icon: "⚡",
      cost: 500000,
      badgeText: "Trang Bị",
      desc: "Chất liệu sợi carbon siêu nhẹ tăng lực sút uy lực và tốc độ bứt phá dũng mãnh.",
      buffSummary: "+3 Sút bóng (SHO), +2 Tốc độ (PAC), +5% tỷ lệ ghi bàn từ xa",
      statsBuff: { sho: 3, pac: 2 },
      attr1Buff: 3,
      attr2Buff: 2
    }
  ],

  // B. Dịch vụ chăm sóc & huấn luyện đặc quyền (Subscriptions - Trừ phí hàng năm/hàng tháng)
  subscriptions: [
    // --- GÓI DỊCH VỤ THÁNG KHỞI ĐIỂM & TRUNG CẤP ---
    {
      id: "sub_mini_apt",
      name: "Thuê Chung Cư Mini Gần Sân",
      category: "SUBSCRIPTION",
      icon: "🏢",
      costYearly: 18000,
      costMonthly: 1500,
      badgeText: "Tân Binh ($1.5k/tháng)",
      desc: "Căn hộ mini tiện nghi cách sân tập 5 phút đi bộ, giảm bớt mệt mỏi và ổn định tâm lý cho cầu thủ trẻ.",
      buffSummary: "Duy trì Tinh thần (Morale) luôn >= 65 (Phí $1,500/tháng)",
      minMorale: 65
    },
    {
      id: "sub_physiotherapist",
      name: "Chuyên Viên Xoa Bóp & Vật Lý Trị Liệu Cá Nhân",
      category: "SUBSCRIPTION",
      icon: "🩺",
      costYearly: 60000,
      costMonthly: 5000,
      badgeText: "Y Tế ($5k/tháng)",
      desc: "Chuyên viên vật lý trị liệu túc trực chăm sóc cơ bắp, kéo dãn cơ và xử lý các chấn thương nhẹ ngay tại nhà.",
      buffSummary: "Giảm 40% thời gian phải ngồi ngoài khi dính chấn thương (Phí $5,000/tháng)",
      injuryDurationReduction: 0.40
    },
    {
      id: "sub_nutrition_plan",
      name: "Gói Thực Đơn Suất Ăn Dinh Dưỡng Khoa Học",
      category: "SUBSCRIPTION",
      icon: "🥗",
      costYearly: 120000,
      costMonthly: 10000,
      badgeText: "Dinh Dưỡng ($10k/tháng)",
      desc: "Chế độ ăn sạch giàu protein và vi chất dinh dưỡng theo chuẩn VĐV điền kinh và cầu thủ Ngoại Hạng Anh.",
      buffSummary: "Hồi phục thêm +15 Thể lực mỗi tuần, Tinh thần (Morale) không bao giờ tụt dưới 75 (Phí $10,000/tháng)",
      minMorale: 75,
      weeklyStamBonus: 15
    },

    // --- HỢP ĐỒNG DỊCH VỤ NĂM TRUNG CẤP & CAO CẤP ---
    {
      id: "sub_tactical_coach",
      name: "HLV Cá Nhân Phân Tích Dữ Liệu Chuyên Sâu",
      category: "SUBSCRIPTION",
      icon: "📊",
      costYearly: 250000,
      badgeText: "Chuyên Gia ($250k/năm)",
      desc: "Cựu tuyển thủ và chuyên viên dữ liệu Opta mổ xẻ từng pha chạm bóng, hoàn thiện bộ kỹ năng dứt điểm và kiến tạo.",
      buffSummary: "+1 vào chỉ số Chuyền (PAS) hoặc Sút (SHO) sau mỗi 5 trận đấu phong độ cao (Phí $250,000/năm)",
      periodicStatBuff: { matchThreshold: 5, stats: ['pas', 'sho'] }
    },
    {
      id: "sub_mid_agent",
      name: "Người Đại Diện Cấp Trung (Agency Representative)",
      category: "SUBSCRIPTION",
      icon: "💼",
      costYearly: 500000,
      badgeText: "Đại Diện ($500k/năm)",
      desc: "Đại diện bóng đá châu Âu am hiểu mạng lưới quan hệ, đàm phán hợp đồng chuyên nghiệp và kết nối các CLB top giữa châu Âu.",
      buffSummary: "Tăng 20% lương tuần khi gia hạn hợp đồng, nhận thêm lời mời từ các CLB Top giữa châu Âu (Phí $500,000/năm)",
      wageNegotiationBuff: 0.20
    },
    {
      id: "sub_psychologist",
      name: "Chuyên Gia Tâm Lý Thể Thao",
      category: "SUBSCRIPTION",
      icon: "🧠",
      costYearly: 1000000,
      badgeText: "Dịch Vụ Hàng Năm",
      desc: "Hỗ trợ giải tỏa áp lực truyền thông và duy trì trạng thái tâm lý thép.",
      buffSummary: "Tinh thần (Morale) luôn >= 85, +10% phong độ trong các trận Chung kết lớn"
    },
    {
      id: "sub_coach",
      name: "HLV Kỹ Năng Cá Nhân Riêng",
      category: "SUBSCRIPTION",
      icon: "🏋️",
      costYearly: 1500000,
      badgeText: "Dịch Vụ Hàng Năm",
      desc: "Thiết kế giáo án tập luyện chuyên biệt khắc phục mọi điểm yếu kỹ thuật.",
      buffSummary: "+2 điểm Kỹ năng mỗi khi thực hiện hành động Tập Luyện"
    },
    {
      id: "sub_cryo",
      name: "Đầu Bếp 5 Sao & Buồng Lạnh Cryotherapy",
      category: "SUBSCRIPTION",
      icon: "❄️",
      costYearly: 2000000,
      badgeText: "Dịch Vụ Hàng Năm",
      desc: "Liệu trình phục hồi nhiệt độ âm -110°C và thực đơn dinh dưỡng chuẩn Olympic.",
      buffSummary: "Hồi phục 100% thể lực mỗi mùa, giảm 50% suy giảm chỉ số từ tuổi 32+"
    },
    {
      id: "sub_pr",
      name: "Đội Ngũ Truyền Thông & PR Chuyên Nghiệp",
      category: "SUBSCRIPTION",
      icon: "📢",
      costYearly: 3000000,
      badgeText: "Dịch Vụ Hàng Năm",
      desc: "Quản lý hình ảnh, truyền thông số và tối đa hóa thương hiệu cá nhân trên toàn cầu.",
      buffSummary: "Tự động +5 Danh tiếng (Fame) mỗi năm, tăng 30% giá trị hợp đồng tài trợ"
    },
    {
      id: "sub_freestyle_coach",
      name: "Thuê Chuyên Gia Kỹ Thuật Freestyle & Đôi Chân Ma Thuật",
      category: "SUBSCRIPTION",
      icon: "🪄",
      costYearly: 2500000,
      badgeText: "Kỹ Thuật Tối Thượng",
      desc: "HLV kỹ thuật đường phố & bậc thầy Samba hướng dẫn các tuyệt kỹ ảo thuật gia và kỹ năng Trickster+ đỉnh cao.",
      buffSummary: "Nâng cấp và duy trì Kỹ Thuật lên 6 Sao (⭐ Trickster+ Master), +25% đột phá 1v1, giảm 50% chấn thương khi rê bóng"
    }
  ],

  // C. Vật phẩm lối sống & Bất động sản (Luxury & Assets - Mua 1 lần)
  assets: [
    // --- XE CỘ & ĐẦU TƯ KHỞI ĐIỂM ($150k - $2.5M) ---
    {
      id: "ast_sports_car_entry",
      name: "Xe Thể Thao Đô Thị Nhập Môn (Mercedes / BMW M4)",
      category: "LUXURY",
      icon: "🚗",
      cost: 150000,
      badgeText: "Xe Cá Nhân",
      desc: "Chiếc coupe thể thao sang trọng phong cách trẻ trung dành cho các cầu thủ trẻ mới nổi.",
      buffSummary: "+50 Danh tiếng (Fame), +5 Tinh thần (Morale)",
      fameBonus: 50,
      moraleBonus: 5
    },
    {
      id: "ast_luxury_watches",
      name: "Bộ Sưu Tập Đồng Hồ Xa Xỉ Patek / Rolex",
      category: "LUXURY",
      icon: "💎",
      cost: 800000,
      badgeText: "Tài Sản Giá Trị",
      desc: "Bộ sưu tập đồng hồ cơ học chế tác thủ công tinh xảo, phụ kiện khẳng định vị thế của ngôi sao tiềm năng.",
      buffSummary: "+100 Danh tiếng (Fame), tăng sức hút truyền thông và mạng xã hội",
      fameBonus: 100,
      moraleBonus: 5
    },
    {
      id: "ast_city_penthouse",
      name: "Căn Hộ Penthouse Trung Tâm Thành Phố",
      category: "LUXURY",
      icon: "🏙️",
      cost: 1200000,
      badgeText: "Bất Động Sản",
      desc: "Căn penthouse trên tầng cao nhất nhìn ra toàn cảnh thành phố, đầy đủ tiện nghi nghỉ dưỡng cao cấp.",
      buffSummary: "+80 Danh tiếng (Fame), tự động hồi phục 100% Morale sau mỗi kỳ nghỉ",
      fameBonus: 80,
      moraleBonus: 15
    },
    {
      id: "ast_sports_restaurants",
      name: "Góp Vốn Mở Chuỗi Nhà Hàng Thể Thao",
      category: "INVESTMENT",
      icon: "🍽️",
      cost: 2500000,
      annualYieldRate: 0.08,
      badgeText: "Đầu Tư Sinh Lời",
      desc: "Thương hiệu nhà hàng ẩm thực kết hợp khu thể thao giải trí thu hút đông đảo cổ động viên.",
      buffSummary: "Lợi nhuận thụ động 8%/mùa (+$200,000/năm), +50 Danh tiếng tại địa phương",
      fameBonus: 50
    },

    // --- SIÊU TÀI SẢN & ĐẾ CHẾ ĐẦU TƯ ($8.0M - $50M) ---
    {
      id: "ast_hypercar",
      name: "Gara Siêu Xe Giới Hạn (Ferrari / Bugatti)",
      category: "LUXURY",
      icon: "🏎️",
      cost: 8000000,
      badgeText: "Xe Xa Xỉ",
      desc: "Bộ sưu tập siêu xe triệu đô thể hiện đẳng cấp ngôi sao hàng đầu.",
      buffSummary: "+150 Danh tiếng (Fame), tăng sức hút với các CLB hàng đầu",
      fameBonus: 150,
      moraleBonus: 10
    },
    {
      id: "ast_apt_london",
      name: "Tổ Hợp Căn Hộ Cho Thuê Cao Cấp (London / Madrid)",
      category: "INVESTMENT",
      icon: "🏢",
      cost: 10000000,
      annualYieldRate: 0.10,
      badgeText: "Đầu Tư Sinh Lời",
      desc: "Bất động sản vị trí vàng mang lại dòng tiền thụ động đều đặn mỗi mùa giải.",
      buffSummary: "Sinh lời thụ động 10%/năm (+$1,000,000/mùa)"
    },
    {
      id: "ast_villa",
      name: "Biệt Thự Hoàng Gia Có Sân Tập Riêng",
      category: "LUXURY",
      icon: "🏰",
      cost: 15000000,
      badgeText: "Bất Động Sản",
      desc: "Dinh thự rộng lớn tại khu nhà giàu La Finca có sân bóng mini và phòng gym riêng.",
      buffSummary: "+10 Tinh thần, +100 Fame, tự động hồi phục thể lực tại nhà",
      fameBonus: 100,
      moraleBonus: 10
    },
    {
      id: "ast_resort",
      name: "Khu Nghỉ Dưỡng Biển Cao Cấp (Monaco / Bali)",
      category: "INVESTMENT",
      icon: "🏖️",
      cost: 25000000,
      annualYieldRate: 0.12,
      badgeText: "Đầu Tư Sinh Lời",
      desc: "Tập trung khai thác khách du lịch thượng lưu với công suất phòng luôn đạt đỉnh.",
      buffSummary: "Sinh lời thụ động 12%/năm (+$3,000,000/mùa)"
    },
    {
      id: "ast_jet",
      name: "Chuyên Cơ Riêng Gulfstream G650",
      category: "LUXURY",
      icon: "✈️",
      cost: 25000000,
      badgeText: "Tài Sản Xa Xỉ",
      desc: "Phương tiện di chuyển tối thượng chu du khắp thế giới và phục vụ các kỳ nghỉ.",
      buffSummary: "+300 Danh tiếng (Fame), +20 Tinh thần (Morale)",
      fameBonus: 300,
      moraleBonus: 20
    },
    {
      id: "ast_fashion_brand",
      name: "Đế Chế Thời Trang & Công Nghệ Độc Quyền",
      category: "INVESTMENT",
      icon: "💎",
      cost: 50000000,
      annualYieldRate: 0.15,
      badgeText: "Đầu Tư Sinh Lời",
      desc: "Thương hiệu toàn cầu mang dấu ấn cá nhân phân phối trên 80 quốc gia.",
      buffSummary: "Sinh lời thụ động 15%/năm (+$7,500,000/mùa)"
    }
  ]
};

/* =========================================================================
   9. RANDOM EVENTS DATABASE (Sự Kiện Ngẫu Nhiên Trong Mùa)
   ========================================================================= */
export const EVENT_POOL = [
  {
    id: "CAPTAIN_LEADERSHIP",
    title: "Được Bầu Làm Thủ Lĩnh / Đội Trưởng Tuyệt Đối",
    desc: "Ban huấn luyện và toàn thể phòng thay đồ tín nhiệm trao băng thủ quân cho bạn. Bạn sẽ thể hiện vai trò thủ lĩnh như thế nào?",
    badge: "badge-award",
    choices: [
      {
        text: "🍻 Mở tiệc gắn kết toàn đội & truyền cảm hứng chiến đấu",
        actionId: "PARTY"
      },
      {
        text: "🏋️ Tập trung làm tấm gương chăm chỉ tuyệt đối trên sân tập",
        actionId: "HARDWORK"
      }
    ]
  },
  {
    id: "CHARITY_AMBASSADOR",
    title: "Hợp Tác Quỹ Từ Thiện & Đại Sứ Thiện Chí Toàn Cầu",
    desc: "Tổ chức Liên Hợp Quốc và Quỹ Nhi Đồng mời bạn làm Đại sứ Thiện chí Toàn cầu. Bạn sẽ sử dụng tầm ảnh hưởng của mình ra sao?",
    badge: "badge-award",
    choices: [
      {
        text: "🌱 Trích $5,000,000 tài trợ học viện bóng đá trẻ cộng đồng",
        actionId: "CHARITY_DONATE"
      },
      {
        text: "📸 Tham gia chiến dịch truyền thông toàn cầu (Nhận +$15,000,000)",
        actionId: "MEDIA_CAMPAIGN"
      }
    ]
  },
  {
    id: "BIG_INJURY",
    title: "Chấn Thương Sau Pha Va Chạm Mạnh",
    desc: "Một pha va chạm quyết liệt khiến bạn dính chấn thương. Bạn sẽ chọn phác đồ điều trị nào?",
    badge: "badge-event",
    choices: [
      {
        text: "✈️ Bay sang Đức phẫu thuật chuyên gia hàng đầu (Tốn $500,000)",
        actionId: "SURGERY_GERMANY"
      },
      {
        text: "💊 Nén đau tiêm thuốc giảm đau để đá nốt trận Chung Kết",
        actionId: "PLAY_THROUGH_PAIN"
      }
    ]
  },
  {
    id: "SPONSOR_MEGA_DEAL",
    title: "Hợp Đồng Đại Sứ Toàn Cầu Trị Giá Khủng",
    desc: "Tập đoàn công nghệ và thể thao đa quốc gia gửi lời đề nghị ký hợp đồng độc quyền 3 năm.",
    badge: "badge-award",
    choices: [
      {
        text: "📸 Ký kết hợp đồng thương mại độc quyền (Nhận $15,000,000)",
        actionId: "SIGN_MEGA_SPONSOR"
      }
    ]
  }
];

/* =========================================================================
   10. ALL-TIME FOOTBALL RECORDS DATABASE (Săn Kỷ Lục Lịch Sử)
   ========================================================================= */
export const ALL_TIME_RECORDS = [
  {
    id: "rec_ballondor",
    title: "👑 Kỷ Lục Quả Bóng Vàng (8+ QBV)",
    holder: "Lionel Messi (8 QBV)",
    target: 8,
    unit: "QBV",
    desc: "Chinh phục từ 8 Quả Bóng Vàng trở lên để khẳng định vị thế cầu thủ vĩ đại nhất mọi thời đại.",
    icon: "👑",
    checkFn: (p) => p.ballonDorWins || 0,
    isAchieved: (p) => (p.ballonDorWins || 0) >= 8
  },
  {
    id: "rec_ucl_goals",
    title: "⭐ Huyền Thoại Champions League (140+ Bàn C1)",
    holder: "Cristiano Ronaldo (140 Bàn)",
    target: 140,
    unit: "Bàn C1",
    desc: "Vượt qua mốc 140 bàn thắng tại đấu trường danh giá nhất châu Âu UEFA Champions League.",
    icon: "⚽",
    checkFn: (p) => p.uclGoals || 0,
    isAchieved: (p) => (p.uclGoals || 0) >= 140
  },
  {
    id: "rec_season_goals",
    title: "🔥 Vua Dội Bom 1 Mùa (50+ Bàn/mùa)",
    holder: "Lionel Messi (50 Bàn VĐQG / 73 Bàn Tổng)",
    target: 50,
    unit: "Bàn/mùa",
    desc: "Ghi từ 50 bàn thắng trở lên trong một mùa giải lịch sử phi thường.",
    icon: "🔥",
    checkFn: (p) => p.seasonMaxGoals || 0,
    isAchieved: (p) => (p.seasonMaxGoals || 0) >= 50
  },
  {
    id: "rec_intl_goals",
    title: "🚩 Kỷ Lục Bàn Thắng ĐTQG Mọi Thời Đại (130+ Bàn ĐTQG)",
    holder: "Cristiano Ronaldo (130+ Bàn ĐTQG)",
    target: 130,
    unit: "Bàn ĐTQG",
    desc: "Vượt qua mốc 130 bàn thắng quốc tế của Cristiano Ronaldo để trở thành chân sút vĩ đại nhất lịch sử các ĐTQG.",
    icon: "🚩",
    checkFn: (p) => p.intlGoals || 0,
    isAchieved: (p) => (p.intlGoals || 0) >= 130
  },
  {
    id: "rec_career_trophies",
    title: "🏆 Bộ Sưu Tập Danh Hiệu Đồ Sộ Nhất (44+ Cúp)",
    holder: "Lionel Messi & Dani Alves (44 Cúp)",
    target: 44,
    unit: "Danh hiệu",
    desc: "Chạm mốc 44 danh hiệu vô địch chính thức cấp CLB và ĐTQG.",
    icon: "🏆",
    checkFn: (p) => p.trophiesTotal || 0,
    isAchieved: (p) => (p.trophiesTotal || 0) >= 44
  },
  {
    id: "rec_world_cups",
    title: "🌍 Kỷ Lục Vô Địch FIFA World Cup (3 Cúp Vàng)",
    holder: "Pelé (3 Cúp Vàng)",
    target: 3,
    unit: "Cúp Vàng",
    desc: "Cân bằng hoặc vượt qua huyền thoại Pelé với 3 lần đăng quang World Cup.",
    icon: "🌍",
    checkFn: (p) => (p.trophiesTally && p.trophiesTally["FIFA World Cup"]) ? p.trophiesTally["FIFA World Cup"] : 0,
    isAchieved: (p) => (p.trophiesTally && (p.trophiesTally["FIFA World Cup"] || 0) >= 3)
  },
  {
    id: "rec_career_goals",
    title: "🎯 Cột Mốc 800 Bàn Thắng Sự Nghiệp",
    holder: "Cristiano Ronaldo & Lionel Messi (800+ Bàn)",
    target: 800,
    unit: "Bàn thắng",
    desc: "Gia nhập câu lạc bộ huyền thoại vượt mốc 800 bàn thắng chính thức trong sự nghiệp.",
    icon: "🎯",
    checkFn: (p) => p.totalCareerGoals || 0,
    isAchieved: (p) => (p.totalCareerGoals || 0) >= 800
  },
  {
    id: "rec_market_value",
    title: "💶 Kỷ Lục Định Giá Chuyển Nhượng (€200M+)",
    holder: "Kylian Mbappé & Erling Haaland (€200M)",
    target: 200000000,
    unit: "€",
    desc: "Chạm ngưỡng định giá chuyển nhượng Transfermarkt từ €200,000,000 trở lên.",
    icon: "🏷️",
    checkFn: (p) => p.peakMarketValue || p.marketValue || 0,
    isAchieved: (p) => (p.peakMarketValue || p.marketValue || 0) >= 200000000,
    formatVal: (val) => `${(val / 1000000).toFixed(0)}M €`
  },
  {
    id: "rec_clean_sheets",
    title: "🧤 Kỷ Lục Giữ Sạch Lưới Mọi Thời Đại (250+ Trận GK/DF)",
    holder: "Gianluigi Buffon & Iker Casillas (250+ Trận)",
    target: 250,
    unit: "Trận",
    desc: "Dành riêng cho Thủ Môn & Hậu Vệ: Đạt 250 trận giữ sạch lưới chính thức.",
    icon: "🧤",
    checkFn: (p) => p.totalCareerCleanSheets || 0,
    isAchieved: (p) => (p.totalCareerCleanSheets || 0) >= 250
  },
  // 1. Vua Dội Bom Năm Dương Lịch (Lionel Messi - 91 Bàn)
  {
    id: "calendar_year_goals_record",
    title: "Vua Dội Bom Năm Dương Lịch (91 Bàn)",
    icon: "🔥",
    holder: "Lionel Messi (91 Bàn - 2012)",
    desc: "Xô đổ kỷ lục 85 bàn của Gerd Müller thiết lập năm 1972 bằng 91 bàn thắng trong 1 năm dương lịch.",
    target: 91,
    unit: "Bàn",
    checkFn: (player) => player.calendarYearMaxGoals || player.seasonMaxGoals || 0,
    isAchieved: (player) => ((player.calendarYearMaxGoals || player.seasonMaxGoals || 0) >= 91)
  },

  // 2. Vua Kiến Tạo Mọi Thời Đại (Lionel Messi - 350+ Kiến tạo)
  {
    id: "all_time_assists_record",
    title: "Vua Kiến Tạo Lịch Sử (350+ Kiến Tạo)",
    icon: "🎯",
    holder: "Lionel Messi (370+ Kiến Tạo)",
    desc: "Trở thành chân chuyền số 1 trong biên niên sử bóng đá với 350 đường dọn cỗ thành bàn.",
    target: 350,
    unit: "Kiến Tạo",
    checkFn: (player) => player.totalCareerAssists || player.careerAssists || 0,
    isAchieved: (player) => ((player.totalCareerAssists || player.careerAssists || 0) >= 350)
  },

  // 3. Vua Hat-trick Đương Đại (Cristiano Ronaldo - 65+ Hat-trick)
  {
    id: "all_time_hattricks_record",
    title: "Vua Hat-trick Đương Đại (65+ Lần)",
    icon: "🎩",
    holder: "Cristiano Ronaldo (66 Hat-trick)",
    desc: "Cán mốc 65 trận đấu chính thức ghi từ 3 bàn thắng trở lên trong sự nghiệp thi đấu.",
    target: 65,
    unit: "Hat-trick",
    checkFn: (player) => player.totalCareerHattricks || player.careerHattricks || (player.stats && player.stats.hattricks) || 0,
    isAchieved: (player) => ((player.totalCareerHattricks || player.careerHattricks || (player.stats && player.stats.hattricks) || 0) >= 65)
  },

  // 4. Bậc Thầy Sút Phạt Trực Tiếp (Juninho Pernambucano - 77 Bàn)
  {
    id: "freekick_master_record",
    title: "Bậc Thầy Sút Phạt Trực Tiếp (77 Bàn)",
    icon: "☄️",
    holder: "Juninho Pernambucano (77 Bàn)",
    desc: "Vượt qua các chuyên gia bóng chết vĩ đại nhất lịch sử để chạm mốc 77 bàn thắng từ chấm đá phạt.",
    target: 77,
    unit: "Bàn Phạt",
    checkFn: (player) => player.totalCareerFreekicks || player.careerFreekicks || (player.stats && player.stats.freekicks) || 0,
    isAchieved: (player) => ((player.totalCareerFreekicks || player.careerFreekicks || (player.stats && player.stats.freekicks) || 0) >= 77)
  },

  // 5. Kỷ Lục Chiếc Giày Vàng Châu Âu (Lionel Messi - 6 Lần)
  {
    id: "european_golden_shoes_record",
    title: "Kỷ Lục Chiếc Giày Vàng Châu Âu (6 Lần)",
    icon: "👟",
    holder: "Lionel Messi (6 Lần)",
    desc: "6 mùa giải thống trị danh hiệu Cầu thủ ghi bàn xuất sắc nhất các giải VĐQG hàng đầu Châu Âu.",
    target: 6,
    unit: "Giày Vàng",
    checkFn: (player) => player.goldenShoeWins || (player.trophiesTally && (player.trophiesTally["Chiếc Giày Vàng Châu Âu"] || player.trophiesTally["Chiếc Giày Vàng"])) || 0,
    isAchieved: (player) => ((player.goldenShoeWins || (player.trophiesTally && (player.trophiesTally["Chiếc Giày Vàng Châu Âu"] || player.trophiesTally["Chiếc Giày Vàng"])) || 0) >= 6)
  },

  // 6. Mr. Champions League (Paco Gento, Modrić, Carvajal - 6 Cúp C1)
  {
    id: "ucl_titles_king_record",
    title: "Mr. Champions League (6 Cúp C1)",
    icon: "👑",
    holder: "Paco Gento, Modrić, Carvajal (6 Cúp)",
    desc: "Chạm tay vào chiếc cúp tai voi UEFA Champions League danh giá đủ 6 lần trong sự nghiệp.",
    target: 6,
    unit: "Cúp C1",
    checkFn: (player) => (player.trophiesTally && (player.trophiesTally["UEFA Champions League (C1)"] || player.trophiesTally["UEFA Champions League"] || player.trophiesTally["Champions League"])) || 0,
    isAchieved: (player) => (((player.trophiesTally && (player.trophiesTally["UEFA Champions League (C1)"] || player.trophiesTally["UEFA Champions League"] || player.trophiesTally["Champions League"])) || 0) >= 6)
  },

  // 7. Cỗ Máy Bàn Thắng 1 Kỳ World Cup (Just Fontaine - 13 Bàn)
  {
    id: "world_cup_tournament_goals_record",
    title: "Cỗ Máy Bàn Thắng 1 Kỳ World Cup (13 Bàn)",
    icon: "🏆",
    holder: "Just Fontaine (13 Bàn - 1958)",
    desc: "Tạo nên điều không tưởng khi nổ súng từ 13 bàn thắng trở lên chỉ trong duy nhất một vòng chung kết World Cup.",
    target: 13,
    unit: "Bàn / Kỳ",
    checkFn: (player) => player.worldCupMaxGoalsSingleTournament || player.wcSingleTournamentGoals || 0,
    isAchieved: (player) => ((player.worldCupMaxGoalsSingleTournament || player.wcSingleTournamentGoals || 0) >= 13)
  },

  // 8. Chuỗi Trận Nổ Súng Bất Tận (Lionel Messi - 21 Trận liên tiếp)
  {
    id: "scoring_streak_record",
    title: "Chuỗi Trận Nổ Súng Bất Tận (21 Trận)",
    icon: "⚡",
    holder: "Lionel Messi (21 Trận - 2012/13)",
    desc: "Ghi bàn liên tục không ngừng nghỉ trong 21 vòng đấu chính thức liên tiếp tại giải VĐQG.",
    target: 21,
    unit: "Trận Liên Tiếp",
    checkFn: (player) => player.longestScoringStreak || player.scoringStreak || 0,
    isAchieved: (player) => ((player.longestScoringStreak || player.scoringStreak || 0) >= 21)
  }
];

/* =========================================================================
   11. KEY MATCH CHOICES DATABASE (Sự Kiện Bước Ngoặt Trận Đấu Lớn)
   ========================================================================= */
export const KEY_MATCH_MOMENTS = [
  {
    id: "moment_elclasico_hattrick",
    stage: "EL_CLASICO",
    matchTitle: "🔥 TRẬN CẦU SIÊU KINH ĐIỂN (El Clásico) - HAT-TRICK THẾ KỶ",
    desc: "Tỷ số đang là 2-2 ở phút 88! Bạn đã ghi 2 bàn và đang đứng trước cơ hội lập Hat-trick lịch sử để nhấn chìm đại kình địch truyền kiếp!",
    choices: [
      {
        text: "⚡ Đi bóng solo qua 2 trung vệ đối phương rồi nã đại bác",
        statCheck: "attr1",
        successChance: (p) => Math.min(0.92, (p.attr1 * 0.007) + (p.form * 0.003)),
        successText: "HAT-TRICK THẾ KỶ! Bạn vượt qua 2 hậu vệ rồi tung cú sút sấm sét vào góc thượng! Cả sân vận động dậy sóng, bạn trở thành người hùng bất tử của trận Siêu Kinh Điển!",
        failureText: "Cú sút đi sạt mép ngoài cột dọc trong gang tấc! Trận đại chiến khép lại với tỷ số hòa 2-2 nghẹt thở.",
        onSuccess: (p) => {
          p.totalCareerGoals += 3;
          p.clubGoals += 3;
          p.form = Math.min(99, p.form + 18);
          p.fame = Math.min(99, p.fame + 15);
          p.morale = 100;
        },
        onFailure: (p) => {
          p.totalCareerGoals += 2;
          p.clubGoals += 2;
          p.form = Math.min(99, p.form + 5);
        }
      },
      {
        text: "🤝 Chuyền bóng xé toang nách trung lộ tạo cơ hội mười mươi cho đồng đội",
        statCheck: "attr4",
        successChance: (p) => Math.min(0.88, (p.attr4 * 0.008) + (p.morale * 0.002)),
        successText: "ĐƯỜNG CHUYỀN THIÊN TÀI! Đồng đội băng xuống đệm bóng cận thành ấn định thắng lợi 3-2 nghẹt thở!",
        failureText: "Thủ môn đối phương đã kịp lao ra bắt bài đường chuyền.",
        onSuccess: (p) => {
          p.totalCareerGoals += 2;
          p.totalCareerAssists += 1;
          p.fame = Math.min(99, p.fame + 10);
          p.morale = 100;
        },
        onFailure: (p) => {
          p.totalCareerGoals += 2;
        }
      }
    ]
  },
  {
    id: "moment_ucl_stoppage_winner",
    stage: "CHAMPIONS_LEAGUE_FINAL",
    matchTitle: "⭐ CHUNG KẾT CÚP C1 CHÂU ÂU - BÀN THẮNG PHÚT 90+3",
    desc: "Phút 93 bù giờ, tỷ số hòa 1-1! Đội bạn được hưởng quả phạt góc cuối cùng của trận đấu. Bạn chọn vị trí nào trong vòng cấm địa?",
    choices: [
      {
        text: "🚀 Bật cao đánh đầu dũng mãnh đè bẹp trung vệ cao to đối phương",
        statCheck: "attr1",
        successChance: (p) => Math.min(0.90, (p.attr1 * 0.007) + (p.form * 0.003)),
        successText: "BÀN THẮNG VÀNG PHÚT 93! Cú lắc đầu uy lực đưa quả bóng găm thẳng nóc lưới! Bạn mang về chiếc Cúp C1 Champions League danh giá!",
        failureText: "Cú đánh đầu chạm xà ngang nảy ra! Trận đấu phải bước vào hiệp phụ.",
        onSuccess: (p) => {
          p.totalCareerGoals += 1;
          p.uclGoals = (p.uclGoals || 0) + 1;
          p.form = Math.min(99, p.form + 16);
          p.fame = Math.min(99, p.fame + 15);
          p.morale = 100;
        },
        onFailure: (p) => {
          p.form = Math.max(30, p.form - 5);
        }
      },
      {
        text: "🪄 Đón bóng hai bên ngoài vòng 16m50 rồi volley mu lai má ngoài",
        statCheck: "attr2",
        successChance: (p) => Math.min(0.86, (p.attr2 * 0.007) + (p.attr3 * 0.003)),
        successText: "SIÊU PHẨM VOLLEY THẾ KỶ! Quả bóng vẽ đường cong hoàn mỹ găm thẳng góc chữ A làm nổ tung cầu trường!",
        failureText: "Bóng ăn nhiều ra má ngoài và đi vọt xà ngang trong tiếc nuối.",
        onSuccess: (p) => {
          p.totalCareerGoals += 1;
          p.uclGoals = (p.uclGoals || 0) + 1;
          p.form = Math.min(99, p.form + 18);
          p.fame = Math.min(99, p.fame + 16);
          p.morale = 100;
        },
        onFailure: (p) => {
          p.form = Math.max(30, p.form - 5);
        }
      }
    ]
  },
  {
    id: "moment_ucl_final_pen",
    stage: "CHAMPIONS_LEAGUE_FINAL",
    matchTitle: "🏆 CHUNG KẾT UEFA CHAMPIONS LEAGUE (Phút 90+2 Penalty)",
    desc: "Tỷ số đang hòa 1-1 nghẹt thở! Đội bạn bất ngờ được hưởng quả phạt đền Penalty ở những giây bù giờ cuối cùng. Cả sân vận động nín thở hướng về bạn!",
    choices: [
      {
        text: "🎯 Tự tin nhận bóng, bước lên chấm 11m sút hiểm hóc vào góc cao",
        statCheck: "attr1",
        successChance: (p) => Math.min(0.92, (p.attr1 * 0.007) + (p.form * 0.003)),
        successText: "GOOOAAALLL! Cú nã đại bác găm thẳng vào góc chữ A! Cả cầu trường vỡ òa, bạn trực tiếp mang cúp C1 về phòng truyền thống!",
        failureText: "KHÔNG VÀO! Thủ môn đối phương đã đoán đúng hướng và đẩy bóng ra! Trận đấu phải bước vào hiệp phụ căng thẳng.",
        onSuccess: (p) => {
          p.totalCareerGoals += 1;
          p.uclGoals = (p.uclGoals || 0) + 1;
          p.form = Math.min(99, p.form + 15);
          p.fame = Math.min(99, p.fame + 12);
          p.morale = 100;
        },
        onFailure: (p) => {
          p.form = Math.max(20, p.form - 10);
          p.morale = Math.max(30, p.morale - 20);
        }
      },
      {
        text: "🤝 Nhường quyền đá phạt đền cho đội trưởng dày dặn kinh nghiệm",
        statCheck: "morale",
        successChance: () => 0.75,
        successText: "Đội trưởng dứt điểm lạnh lùng thành bàn! Quyết định nhún nhường vì tập thể của bạn được ban huấn luyện ca ngợi hết lời.",
        failureText: "Đội trưởng sút bóng vọt xà ngang đáng tiếc! Đội bóng lỡ mất cơ hội vàng định đoạt trận đấu trong 90 phút.",
        onSuccess: (p) => {
          p.morale = Math.min(100, p.morale + 12);
          p.fame += 5;
        },
        onFailure: (p) => {
          p.morale = Math.max(40, p.morale - 10);
        }
      }
    ]
  },
  {
    id: "moment_wc_final_breakaway",
    stage: "WORLD_CUP_FINAL",
    matchTitle: "🌍 CHUNG KẾT FIFA WORLD CUP (Phút 118 Hiệp Phụ)",
    desc: "Một pha phản công thần tốc! Bạn nhận đường chọc khe bổng xé toang hàng phòng ngự và đối mặt trực diện với thủ môn đối phương!",
    choices: [
      {
        text: "⚡ Bứt tốc vượt qua thủ môn rồi đệm bóng vào lưới trống",
        statCheck: "attr2",
        successChance: (p) => Math.min(0.90, (p.attr2 * 0.007) + (p.stam * 0.003)),
        successText: "LỊCH SỬ ĐÃ GỌI TÊN BẠN! Bạn rê bóng qua thủ môn đối phương rồi dứt điểm nhẹ nhàng, đưa ĐTQG lên đỉnh vinh quang Thế Giới!",
        failureText: "Thủ môn đối phương đã kịp băng ra cản phá bằng đầu ngón tay trong gang tấc!",
        onSuccess: (p) => {
          p.totalCareerGoals += 1;
          p.intlGoals += 1;
          p.fame = Math.min(99, p.fame + 20);
          p.morale = 100;
        },
        onFailure: (p) => {
          p.morale = Math.max(35, p.morale - 15);
        }
      },
      {
        text: "🎯 Tung đường căng ngang dọn cỗ cho đồng đội băng lên đệm bóng",
        statCheck: "attr4",
        successChance: (p) => Math.min(0.88, (p.attr4 * 0.008) + (p.form * 0.002)),
        successText: "KIẾN TẠO VÀNG! Đồng đội băng vào đệm bóng cận thành tung nóc lưới! Một khoảnh khắc đồng đội bất tử.",
        failureText: "Hậu vệ đối phương kịp lùi về xoạc bóng giải nguy trước mũi giày đồng đội!",
        onSuccess: (p) => {
          p.totalCareerAssists += 1;
          p.fame = Math.min(99, p.fame + 15);
          p.morale = 100;
        },
        onFailure: (p) => {
          p.morale = Math.max(40, p.morale - 10);
        }
      }
    ]
  },
  {
    id: "moment_elclasico_freekick",
    stage: "LEAGUE_DECIDER",
    matchTitle: "🔥 ĐẠI CHIẾN QUYẾT ĐỊNH NGÔI VƯƠNG (Phút 89)",
    desc: "Trận Siêu Kinh Điển quyết định chức vô địch mùa giải! Đội bạn được hưởng quả phạt trực tiếp ở cự ly 24 mét chính diện khung thành.",
    choices: [
      {
        text: "🚀 Nã đại bác bóng xoáy hình quả chuối vượt qua hàng rào",
        statCheck: "attr1",
        successChance: (p) => Math.min(0.85, (p.attr1 * 0.006) + (p.form * 0.004)),
        successText: "SIÊU PHẨM KHÔNG TƯỞNG! Quả bóng lượn theo quỹ đạo không thể cản phá găm thẳng góc chết! Khán đài bùng nổ.",
        failureText: "Bóng đập trúng xà ngang bật ra ngoài trong sự tiếc nuối tột cùng!",
        onSuccess: (p) => {
          p.totalCareerGoals += 1;
          p.form = Math.min(99, p.form + 12);
          p.fame = Math.min(99, p.fame + 10);
        },
        onFailure: (p) => {
          p.form = Math.max(30, p.form - 5);
        }
      },
      {
        text: "🪄 Bấm bóng phối hợp chiến thuật bất ngờ cho tiền đạo đánh đầu",
        statCheck: "attr3",
        successChance: (p) => Math.min(0.82, (p.attr3 * 0.007) + (p.attr4 * 0.003)),
        successText: "PHỐI HỢP THIÊN TÀI! Đường chuyền điểm rơi mẫu mực giúp đồng đội đánh đầu tung lưới!",
        failureText: "Thủ môn đối phương đoán được ý đồ và bắt gọn trái bóng trên không.",
        onSuccess: (p) => {
          p.totalCareerAssists += 1;
          p.fame = Math.min(99, p.fame + 8);
        },
        onFailure: (p) => {
          p.morale = Math.max(40, p.morale - 8);
        }
      }
    ]
  },
  {
    id: "moment_gk_crucial_save",
    stage: "GK_MOMENT",
    matchTitle: "🧤 PHA ĐỐI MẶT THỜI KHẮC SINH TỬ (Phút 90+3)",
    desc: "Tiền đạo siêu sao đối phương phá bẫy việt vị thoát xuống đối mặt 1 chọi 1 với bạn ở cự ly chỉ 6 mét!",
    choices: [
      {
        text: "⚡ Băng ra quyết liệt làm hẹp góc sút và dùng cả cơ thể cản phá",
        statCheck: "attr1",
        successChance: (p) => Math.min(0.88, (p.attr1 * 0.007) + (p.form * 0.003)),
        successText: "CỨU THUA XUẤT THẦN! Bạn dang rộng cả thân mình cản phá cú sút như búa bổ, giữ sạch mành lưới và bảo toàn chiến thắng!",
        failureText: "Tiền đạo đối phương đã kịp xâu kim tinh quái ghi bàn thắng gỡ hòa.",
        onSuccess: (p) => {
          p.totalCareerSaves += 3;
          p.totalCareerCleanSheets += 1;
          p.form = Math.min(99, p.form + 15);
          p.fame = Math.min(99, p.fame + 12);
        },
        onFailure: (p) => {
          p.form = Math.max(25, p.form - 10);
        }
      },
      {
        text: "🧭 Trụ vững tâm lý, chờ đợi đối phương ra chân rồi mới đổ người",
        statCheck: "attr4",
        successChance: (p) => Math.min(0.85, (p.attr4 * 0.007) + (p.morale * 0.003)),
        successText: "PHÁN ĐOÁN ĐỈNH CAO! Bạn bắt bài hoàn toàn hướng sút và ôm gọn trái bóng!",
        failureText: "Cú sút quá hiểm hóc vào sát cột dọc khiến bạn không thể với tới!",
        onSuccess: (p) => {
          p.totalCareerSaves += 2;
          p.form = Math.min(99, p.form + 10);
        },
        onFailure: (p) => {
          p.morale = Math.max(30, p.morale - 12);
        }
      }
    ]
  }
];

/* =========================================================================
   12. MATCHDAY PHASES CONFIGURATION (4 Chặng Trong Mùa Giải)
   ========================================================================= */
export const MATCHDAY_PHASES = [
  {
    id: 1,
    title: "Chặng 1: Khởi Đầu & Vòng Phân Hạng",
    icon: "🌱",
    tag: "Vòng 1 - 15",
    desc: "Mở màn mùa giải, thi đấu các trận vòng bảng cúp & phân hạng quốc nội."
  },
  {
    id: 2,
    title: "Chặng 2: Trận Cầu Đinh & Siêu Kinh Điển",
    icon: "🔥",
    tag: "Đại Chiến Derby",
    desc: "Đối đầu đại kình địch truyền kiếp & các đối thủ cạnh tranh trực tiếp ngôi vương."
  },
  {
    id: 3,
    title: "Chặng 3: Knock-out Cúp Châu Lục & Cúp QG",
    icon: "⚡",
    tag: "Tứ Kết & Bán Kết",
    desc: "Các trận cầu sinh tử tại đấu trường cúp Châu Âu và cúp Quốc Gia."
  },
  {
    id: 4,
    title: "Chặng 4: Trận Chung Kết & Gala Quả Bóng Vàng",
    icon: "👑",
    tag: "Trận Chung Kết",
    desc: "Chung kết Champions League, World Cup, vòng 38 quyết định cúp & Lễ trao giải QBV."
  }
];

/* =========================================================================
   13. ICONIC STADIUMS DATABASE
   ========================================================================= */
export const STADIUMS_DATA = [
  { name: "Santiago Bernabéu", city: "Madrid, Tây Ban Nha", capacity: "84,744", icon: "👑" },
  { name: "Camp Nou", city: "Barcelona, Tây Ban Nha", capacity: "99,354", icon: "🔵🔴" },
  { name: "Wembley Stadium", city: "London, Anh", capacity: "90,000", icon: "🏟️" },
  { name: "San Siro / Giuseppe Meazza", city: "Milan, Ý", capacity: "75,817", icon: "🔴⚫" },
  { name: "Allianz Arena", city: "Munich, Đức", capacity: "75,000", icon: "🔴" },
  { name: "Parc des Princes", city: "Paris, Pháp", capacity: "48,583", icon: "🗼" },
  { name: "Lusail Iconic Stadium", city: "Lusail, Qatar", capacity: "88,966", icon: "🌍" },
  { name: "Maracanã Stadium", city: "Rio de Janeiro, Brazil", capacity: "78,838", icon: "🇧🇷" }
];

/* =========================================================================
   14. SIGNATURE TRAITS & SKILL TREE DATABASE (Tuyệt Kỹ Cá Nhân)
   ========================================================================= */
export const SIGNATURE_TRAITS = [
  {
    id: "ice_penalty",
    name: "Vua Sút Phạt Đền 11m",
    icon: "🎯",
    tag: "Tâm Lý Thép",
    desc: "Bản lĩnh lạnh lùng trên chấm 11m, tăng tỷ lệ sút phạt đền và định đoạt các trận Derby thành công 100%.",
    buffDesc: "Tăng 15% tỷ lệ ghi bàn trong các trận Derby.",
    checkFn: (p) => (p.totalCareerGoals || 0) >= 25 || (p.attr1 || 0) >= 72,
    progressText: (p) => `${Math.min(25, p.totalCareerGoals || 0)}/25 Bàn thắng hoặc Kỹ năng 72`
  },
  {
    id: "rocket_pace",
    name: "Bứt Tốc Xé Gió",
    icon: "⚡",
    tag: "Tốc Độ Sấm Sét",
    desc: "Khả năng tăng tốc bứt phá không gian, bỏ lại mọi hậu vệ đối phương phía sau.",
    buffDesc: "Tăng 20% khả năng tạo đột biến ở các trận cầu đinh.",
    checkFn: (p) => (p.totalCareerMatches || 0) >= 40 || (p.attr2 || 0) >= 78,
    progressText: (p) => `${Math.min(40, p.totalCareerMatches || 0)}/40 Trận thi đấu`
  },
  {
    id: "roulette_maestro",
    name: "Xoay Com-pa Roulette",
    icon: "🪄",
    tag: "Nghệ Thuật Xử Lý",
    desc: "Kỹ thuật xoay người 360 độ huyền ảo vượt qua 2 cầu thủ đối phương trong tích tắc.",
    buffDesc: "Tăng 25% tỷ lệ kiến tạo quyết định ở vòng Knock-out Cúp Châu Âu.",
    checkFn: (p) => (p.totalCareerAssists || 0) >= 20 || (p.attr3 || 0) >= 80,
    progressText: (p) => `${Math.min(20, p.totalCareerAssists || 0)}/20 Kiến tạo`
  },
  {
    id: "weak_foot_5star",
    name: "Chân Thuận Tuyệt Đối 5⭐",
    icon: "⭐",
    tag: "Song Cước Hoàn Hảo",
    desc: "Dứt điểm uy lực và hiểm hóc bằng cả 2 chân, không góc chết trong vòng cấm địa.",
    buffDesc: "Tăng cơ hội lập cú đúp và hat-trick trong mùa giải.",
    checkFn: (p) => (p.totalCareerGoals || 0) >= 60,
    progressText: (p) => `${Math.min(60, p.totalCareerGoals || 0)}/60 Bàn thắng sự nghiệp`
  },
  {
    id: "clutch_king",
    name: "Bản Lĩnh Vua Chung Kết",
    icon: "👑",
    tag: "Gen Vô Địch",
    desc: "Tỏa sáng rực rỡ nhất khi chiếc cúp vô địch đang ở trước mắt.",
    buffDesc: "Tăng 35% tỷ lệ vô địch Champions League và nhận Quả Bóng Vàng.",
    checkFn: (p) => (p.trophiesTotal || 0) >= 3,
    progressText: (p) => `${Math.min(3, p.trophiesTotal || 0)}/3 Chiếc Cúp Vô Địch`
  },
  {
    id: "iron_wall",
    name: "Bức Tường Thép Bất Tử",
    icon: "🛡️",
    tag: "Bản Thể Bất Khả Xâm Phạm",
    desc: "Ý chí kiên cường và thể trạng phi phàm trước mọi áp lực đỉnh cao.",
    buffDesc: "Miễn nhiễm suy giảm thể lực và giữ vững 100% phong độ trước kình địch.",
    checkFn: (p) => (p.trophiesTotal || 0) >= 5 || (p.totalCareerMatches || 0) >= 100,
    progressText: (p) => `${Math.min(5, p.trophiesTotal || 0)}/5 Cúp hoặc 100 trận`
  },
  // 7. CR7 - Không Chiến Thần Sầu
  {
    id: "cr7_air_superiority",
    name: "Không Chiến Thần Sầu",
    icon: "🚀",
    tag: "Thống Trị Không Gian",
    desc: "Khả năng dừng trên không trung 1.5 giây và bật cao trên 2.6m, biến mọi quả tạt bổng thành bàn thắng.",
    buffDesc: "Tăng 25% tỷ lệ ghi bàn từ các tình huống phạt góc và không chiến trên không.",
    checkFn: (p) => (p.totalCareerGoals || 0) >= 30,
    progressText: (p) => `${Math.min(30, p.totalCareerGoals || 0)}/30 Bàn thắng sự nghiệp`
  },

  // 8. CR7 - Đại Bác Knuckleball
  {
    id: "cr7_knuckleball",
    name: "Đại Bác Knuckleball",
    icon: "☄️",
    tag: "Hỏa Lực Siêu Xa",
    desc: "Cú mu chính diện tạo quỹ đạo lắc lư ma quái khiến mọi thủ môn phải đứng chôn chân nhìn bóng.",
    buffDesc: "Tăng 30% tỷ lệ ăn bàn khi đưa ra quyết định sút xa ngoài vòng cấm 16m50.",
    checkFn: (p) => (p.totalCareerGoals || 0) >= 45,
    progressText: (p) => `${Math.min(45, p.totalCareerGoals || 0)}/45 Bàn thắng sự nghiệp`
  },

  // 9. M10 - Rê Bóng Dính Chân
  {
    id: "m10_magnet_dribble",
    name: "Rê Bóng Dính Chân",
    icon: "🪄",
    tag: "Ảo Giác Trọng Tâm",
    desc: "Trọng tâm thấp kết hợp nhịp chạm bóng siêu dính biến các hậu vệ hàng đầu thành khán giả bất đắc dĩ.",
    buffDesc: "Tăng 35% tỷ lệ qua người thành công khi đối đầu với 2 cầu thủ vây ráp.",
    checkFn: (p) => (p.totalCareerAssists || 0) >= 30,
    progressText: (p) => `${Math.min(30, p.totalCareerAssists || 0)}/30 Kiến tạo sự nghiệp`
  },

  // 10. M10 - Mắt Thần Kiến Thiết
  {
    id: "m10_godly_vision",
    name: "Mắt Thần Kiến Thiết",
    icon: "👁️",
    tag: "Nhãn Quan Toàn Cảnh",
    desc: "Nhãn quan 360 độ từ trên cao, nhìn thấy trước đường di chuyển của đồng đội trước 2 nhịp.",
    buffDesc: "Tăng 40% xA (Kiến tạo kỳ vọng) và tạo ra các đường chọc khe dọn cỗ không tưởng.",
    checkFn: (p) => (p.totalCareerAssists || 0) >= 50,
    progressText: (p) => `${Math.min(50, p.totalCareerAssists || 0)}/50 Kiến tạo sự nghiệp`
  },

  // 11. R9 - Đảo Chân Ngoài Hành Tinh
  {
    id: "r9_alien_stepover",
    name: "Đảo Chân Ngoài Hành Tinh",
    icon: "🛸",
    tag: "Cơn Lốc Samba",
    desc: "Cú lắc hông đảo chân siêu tốc khiến thủ môn mất đà ngã quỵ, dẫn bóng vào lưới trống.",
    buffDesc: "100% vượt qua thủ môn trong mọi pha đối mặt 1vs1.",
    checkFn: (p) => (p.totalCareerMatches || 0) >= 60 && (p.totalCareerGoals || 0) >= 40,
    progressText: (p) => `${Math.min(60, p.totalCareerMatches || 0)}/60 Trận & ${Math.min(40, p.totalCareerGoals || 0)}/40 Bàn`
  },

  // 12. Ronaldinho - Ảo Thuật Gia Elastico
  {
    id: "r10_samba_magic",
    name: "Ảo Thuật Gia Elastico",
    icon: "🎭",
    tag: "Phù Thủy Sân Cỏ",
    desc: "Mang vũ điệu Samba vào sân cỏ với những pha bẻ cổ chân Elastico và chuyền bóng giấu mắt.",
    buffDesc: "Nhận thêm 50% Fame danh tiếng sau trận thắng và tăng 20% Tinh Thần toàn đội.",
    checkFn: (p) => (p.trophiesTotal || 0) >= 4,
    progressText: (p) => `${Math.min(4, p.trophiesTotal || 0)}/4 Danh hiệu vô địch`
  }
];

/* =========================================================================
   12. RICH NARRATIVE STORYTELLING POOL (10-15 Variations Per Phase & Position)
   ========================================================================= */
export const PHASE_NARRATIVES = {
  PHASE_1: {
    FW: [
      "Thi đấu bùng nổ trong 15 vòng đầu! Khả năng chọn vị trí thông minh và những pha dứt điểm một chạm sắc bén giúp bạn chiếm trọn niềm tin của ban huấn luyện và dẫn đầu danh sách Vua Phá Lưới.",
      "Gây bão truyền thông với cú hat-trick mở màn mùa giải! Tốc độ xé gió cùng sự nhạy bén trong vòng cấm khiến mọi hàng thủ đối phương phải khiếp sợ.",
      "Sự hòa nhập chiến thuật hoàn hảo! Bạn liên tục lập công với những cú sút xa sấm sét và đánh đầu dũng mãnh, đưa đội nhà chễm chệ trên đỉnh bảng xếp hạng.",
      "Phong độ thăng hoa tột đỉnh! Tờ báo thể thao hàng đầu ca ngợi bạn là 'cơn ác mộng của mọi thủ môn' sau chuỗi 6 trận liên tiếp nổ súng.",
      "Tỏa sáng rực rỡ với khả năng độc lập tác chiến đỉnh cao, thường xuyên tự tạo ra cơ hội ghi bàn từ các góc hẹp và mang về những điểm số quý giá.",
      "Hiệu suất săn bàn thượng thừa! Những pha bứt tốc thoát bẫy việt vị hoàn hảo của bạn khiến các chuyên gia bóng đá không tiếc lời khen ngợi.",
      "Khởi đầu mùa giải như mơ! Khả năng dứt điểm hai chân như một cùng sự điềm tĩnh trước khung thành giúp bạn lập liên tiếp 2 cú đúp.",
      "Màn trình diễn mê hoặc lòng người! Không chỉ ghi bàn đều đặn, bạn còn tích cực lùi sâu phối hợp và mở toang khoảng trống cho các đồng đội.",
      "Tâm điểm của mọi ống kính máy quay! Những pha xử lý bóng tinh tế và những bàn thắng đẹp mắt đưa tên tuổi bạn lan tỏa khắp các trang bìa thế giới.",
      "Đẳng cấp sát thủ vòng cấm! Dù bị hậu vệ đối phương theo kèm sát sao, bạn vẫn biết cách lên tiếng đúng lúc với những bàn thắng vàng định đoạt trận đấu.",
      "Cảm hứng bất tận trên hàng công! Bạn liên tục được bình chọn là Cầu thủ xuất sắc nhất tháng (Player of the Month) nhờ chuỗi trận thăng hoa rực rỡ.",
      "Khát khao chiến thắng mãnh liệt! Sự càn lướt và kỹ năng dứt điểm đa dạng giúp bạn bỏ xa các đối thủ trong cuộc đua Chiếc Giày Vàng."
    ],
    MF: [
      "Nhạc trưởng tuyến giữa đích thực! Khả năng điều tiết nhịp độ trận đấu và những đường chuyền chọc khe xuyên tuyến xé toang mọi khối phòng ngự đối phương.",
      "Làm chủ hoàn toàn khu trung tuyến! Khán đài liên tục hô vang tên bạn sau những pha xoay compa thoát pressing và kiến tạo chuẩn xác từng centimet.",
      "Màn trình diễn của một bậc thầy kiến thiết! Bạn sở hữu nhãn quan chiến thuật phi thường, được giới chuyên môn ví như Iniesta và De Bruyne thời kỳ đỉnh cao.",
      "Trái tim trong lối chơi của toàn đội! Những đường phất bóng dài vượt tuyến và khả năng chuyển đổi trạng thái thần tốc giúp đội nhà làm chủ thế trận.",
      "Thăng hoa với những đường chuyền Trivela má ngoài tuyệt mỹ! Bạn dẫn đầu danh sách kiến tạo của giải đấu và liên tục nhận điểm 9.0 từ ban chuyên môn.",
      "Chi phối trận đấu bằng bộ não thiên tài! Bạn luôn đi trước đối thủ một bước trong mọi pha xử lý, biến khu trung tuyến thành sân khấu của riêng mình.",
      "Nguồn cảm hứng bất tận của các đợt tấn công! Những pha tỉa bóng thông minh và sút xa hiểm hóc khiến hàng thủ đối phương hoàn toàn bị động.",
      "Vừa cầm nhịp xuất sắc vừa tích cực thu hồi bóng! Sự toàn diện của bạn giúp tuyến giữa đội nhà áp đảo đối phương trong cả 15 vòng đấu đầu tiên.",
      "Những pha bấm bóng bổng đầy nghệ thuật qua đầu hậu vệ! Bạn tạo ra trung bình 4 cơ hội ngon ăn (Big Chances) mỗi trận cho các tiền đạo dứt điểm.",
      "Điềm tĩnh và chuẩn xác đến kinh ngạc! Tỷ lệ chuyền bóng thành công lên tới 94%, trở thành cầu nối hoàn hảo giữa các tuyến.",
      "Lối đá ma thuật đầy mê hoặc! Những pha vê bóng dính chân và thoát pressing mượt mà khiến các CĐV trên sân không ngớt trầm trồ tán thưởng.",
      "Thủ lĩnh tuyến giữa tương lai! Bạn chỉ huy nhịp độ tấn công như một đạo diễn sân cỏ thực thụ, dẫn dắt đội bóng bay cao trên bảng xếp hạng."
    ],
    DF: [
      "Hòn đá tảng bất khả xâm phạm! Những pha tắc bóng chính xác tuyệt đối và không chiến dũng mãnh biến bạn thành tấm lá chắn kiên cố nhất trước khung thành.",
      "Chỉ huy hàng thủ đẳng cấp thế giới! Khả năng đọc tình huống và bọc lót xuất thần giúp đội nhà giữ sạch lưới ấn tượng trong phần lớn các vòng đấu mở màn.",
      "Bức tường thép trứ danh! Sự dũng cảm và tinh thần lăn xả cứu thua khiến mọi tiền đạo hàng đầu đối phương đều phải nản lòng khi đối đầu.",
      "Phòng ngự thông minh bằng tư duy đỉnh cao! Bạn luôn can thiệp và cắt bóng trước khi đối thủ kịp tung ra đường chuyền nguy hiểm.",
      "Không chiến áp đảo toàn diện! Không chỉ khóa chặt các pha bóng bổng trong vòng cấm, bạn còn thường xuyên dâng cao ghi bàn từ các tình huống phạt góc.",
      "Những cú xoạc bóng chuẩn xác từng mi-li-mét! Khán đài vỗ tay tán thưởng cuồng nhiệt sau những pha truy cản mẫu mực giải nguy cho đội nhà.",
      "Thủ lĩnh tinh thần thép nơi hậu phương! Bạn liên tục hô hào, tổ chức lại cự ly đội hình và truyền sự tự tin tuyệt đối cho toàn đội.",
      "Sự kết hợp hoàn hảo giữa thể chất phi phàm và óc phán đoán sắc sảo! Bạn hoàn toàn phong tỏa các mũi khoan biên nguy hiểm của đối phương.",
      "Điềm tĩnh xử lý thoát áp lực ngay từ vòng cấm địa! Khả năng phát động tấn công bằng những đường chuyền dài của bạn mở ra vô số đợt phản công chớp nhoáng.",
      "Không một ai có thể vượt qua bạn trong các pha tranh chấp tay đôi 1v1! Thành tích phòng ngự chói sáng đưa bạn vào Đội hình tiêu biểu của giải đấu.",
      "Lá chắn vững chãi nơi hậu tuyến! Đội bóng sở hữu số bàn thua ít nhất giải đấu nhờ vào sự ổn định và phong độ đỉnh cao của bạn.",
      "Tắc bóng sắc lẹm, bọc lót kịp thời! Bạn được giới truyền thông ca ngợi là 'trung vệ thép' đáng xem nhất làng túc cầu hiện tại."
    ],
    GK: [
      "Người nhện trong khung gỗ! Phản xạ xuất thần cùng những pha bay người cản phá bóng không tưởng giúp đội nhà liên tục giữ sạch mành lưới.",
      "Người gác đền bất tử! Bạn khiến các chân sút đối phương phải ôm đầu tiếc nuối sau hàng loạt pha cứu thua mười mươi từ cự ly gần.",
      "Làm chủ hoàn toàn không phận vòng cấm! Khả năng phán đoán điểm rơi và lao ra đấm bóng dũng mãnh đập tan mọi cơ hội bóng bổng của đối thủ.",
      "Phong độ siêu phàm với chuỗi 8 trận sạch lưới liên tiếp! Điểm số đánh giá trung bình 8.8 giúp bạn dẫn đầu cuộc đua Găng Tay Vàng.",
      "Phản xạ cực nhanh trên vạch vôi! Khán đài bùng nổ sau pha bay người cứu thua kép ngoạn mục ở những giây cuối cùng của trận đấu.",
      "Khả năng chơi chân và phát động tấn công xuất sắc! Những đường phất bóng chuẩn xác của bạn mở ra bàn thắng phản công chớp nhoáng cho đội nhà.",
      "Điềm tĩnh và chỉ huy hàng phòng ngự như một vị tướng! Bạn truyền sự an tâm tuyệt đối cho các trung vệ phía trên trong mọi đợt vây hãm.",
      "Bức tường thành cuối cùng kiên cố không thể xuyên thủng! Bạn đẩy thành công liên tiếp 2 quả penalty trong các vòng đấu đầu mùa giải.",
      "Thủ môn hiện đại toàn năng! Bạn lao ra ngoài vòng cấm quét bóng như một trung vệ thòng (Sweeper Keeper) thực thụ, bẻ gãy các đợt phản công.",
      "Cản phá không tưởng ở những góc hiểm hóc nhất! Tờ báo bóng đá danh tiếng chấm bạn 10 điểm tuyệt đối sau màn trình diễn siêu nhân.",
      "Đôi bàn tay nhựa dính chặt mọi cú nã đại bác sấm sét! Sự chắc chắn của bạn là điểm tựa vững chãi nhất cho ngôi đầu bảng của đội bóng.",
      "Bản lĩnh phi thường trước áp lực nghẹt thở! Bạn liên tục chiến thắng trong các tình huống đối mặt một đối một với tiền đạo đối phương."
    ]
  },
  PHASE_2: {
    FW: [
      "Bùng nổ trong trận Derby rực lửa! Cú solo ngoạn mục vượt qua 3 hậu vệ trước khi tung cú nã đại bác xé lưới đối phương làm câm lặng 60.000 khán giả đội bạn.",
      "Người hùng trận Siêu Kinh Điển! Pha dứt điểm lạnh lùng vào góc chữ A ở phút 89 mang về chiến thắng nghẹt thở và nhấn chìm kình địch truyền kiếp.",
      "Khoảnh khắc siêu sao định đoạt trận cầu đinh! Cú vô-lê một chạm sấm sét ngoài vòng cấm khiến thủ môn đối phương chỉ biết chôn chân đứng nhìn.",
      "Tỏa sáng rực rỡ giữa bầu không khí thù địch cuồng nhiệt! Bạn lập cú đúp đẳng cấp đưa đội nhà bước lên ngôi đầu trong tiếng reo hò dậy sóng.",
      "Bản lĩnh của cầu thủ của những trận cầu lớn! Cú đánh đầu hiểm hóc ở phút bù giờ đưa cảm xúc của hàng triệu người hâm mộ lên đỉnh điểm vỡ òa.",
      "Pha bứt tốc xé gió vượt qua trung vệ đối phương rồi bấm bóng điệu nghệ qua đầu thủ môn, tạo nên một trong những siêu phẩm Derby đẹp nhất lịch sử.",
      "Cháy hết mình trong đại chiến! Dù bị hậu vệ đối phương phạm lỗi liên tục, bạn vẫn kiên cường đứng dậy và ghi bàn ấn định thắng lợi 3-2 kịch tính.",
      "Màn trình diễn của đẳng cấp thế giới! Khả năng tì đè và dứt điểm uy lực của bạn biến hàng phòng ngự trứ danh của kình địch thành trò hề.",
      "Ghi bàn thắng vàng trong trận cầu sinh tử! Bạn ăn mừng ngạo nghễ trước khán đài đối thủ, khẳng định vị thế ngôi sao số 1 của trận đấu.",
      "Cú sút phạt hàng rào hình quả chuối tuyệt mỹ ở phút 85 đưa bóng găm thẳng góc chết, ấn định chiến thắng lịch sử trong trận Derby.",
      "Tâm lý thép trước chấm 11m giữa tiếng la ó đinh tai nhức óc! Cú sút Panenka tinh tế của bạn khiến cả cầu trường phải ngả mũ thán phục.",
      "Nhấn chìm kình địch bằng cú đúp siêu hạng! Bạn được toàn bộ đồng đội công kênh trên vai trong tiếng hát vang dội của các CĐV nhà."
    ],
    MF: [
      "Nhạc trưởng trận đại chiến! Pha vẩy má ngoài Trivela huyền ảo ở phút 86 xé toang toàn bộ hàng thủ kình địch, dọn cỗ cho đồng đội ghi bàn quyết định.",
      "Làm chủ hoàn toàn không gian tuyến giữa trong trận Derby nghẹt thở! Những pha xoay xở ma thuật của bạn làm phá sản hoàn toàn ý đồ pressing của đối thủ.",
      "Cú nã đại bác từ cự ly 30 mét làm rung chuyển xà ngang rồi bay vào lưới! Cả cầu trường vỡ òa trước siêu phẩm kinh điển của trận đấu.",
      "Kiến tạo cú đúp đỉnh cao trong trận cầu đinh! Nhãn quan chiến thuật thiên tài của bạn biến trận đại chiến thành buổi trình diễn nghệ thuật cá nhân.",
      "Bản lĩnh và đẳng cấp thượng thừa! Bạn cầm nhịp trận đấu cực kỳ điềm tĩnh giữa những pha vào bóng rát bỏng của kình địch, dẫn dắt đội nhà thắng 2-1.",
      "Pha chọc khe xuyên tuyến bằng mắt thần ở phút bù giờ 90+2 đưa tiền đạo vào thế đối mặt, mang về bàn thắng vàng định đoạt trận Siêu Kinh Điển.",
      "Trái tim quả cảm ở khu trung tuyến! Vừa kiến tạo bàn thắng mở tỷ số, bạn vừa có pha tắc bóng cứu thua ngay trước mũi giày tiền đạo đối phương.",
      "Lối đá thông minh và hoa mỹ làm mê đắm lòng người! Bạn khiến hàng tiền vệ triệu đô của đối thủ hoàn toàn lu mờ trong suốt 90 phút thi đấu.",
      "Tung đường chuyền bổng điểm rơi chuẩn xác đến từng milimet, giúp đồng đội dễ dàng đánh đầu tung lưới kình địch trong trận cầu 6 điểm.",
      "Chi phối trận Derby bằng tư duy chơi bóng đỉnh cao! Bạn được trao danh hiệu Cầu thủ xuất sắc nhất trận (Man of the Match) tuyệt đối.",
      "Những pha thoát pressing mềm mại như lụa giữa vòng vây 3 cầu thủ đối phương, mở toang hành lang tấn công mang về chiến thắng giòn giã.",
      "Thủ lĩnh đích thực của trận đấu lớn! Bạn truyền lửa và định đoạt cục diện trận Derby bằng đường chuyền quyết định ở những giây cuối cùng."
    ],
    DF: [
      "Hòn đá tảng huyền thoại của trận Derby! Cú xoạc bóng mẫu mực giải nguy ngay trên vạch vôi ở phút 90+3 bảo toàn chiến thắng 1-0 lịch sử cho đội nhà.",
      "Khóa chặt hoàn toàn siêu tiền đạo của kình địch! Những pha tranh chấp tay đôi dũng mãnh của bạn khiến chân sút hàng đầu đối phương hoàn toàn tắt điện.",
      "Bức tường thép bất khả xâm phạm trong trận cầu đinh! Bạn tả xung hữu đột, đánh đầu phá bóng giải nguy trước hàng loạt quả tạt dồn dập cuối trận.",
      "Pha tắc bóng chuẩn xác đến nghẹt thở trong vòng cấm địa ở phút 88, cản phá cơ hội mười mươi của đối phương mà không hề phạm lỗi.",
      "Thủ lĩnh hàng phòng ngự với tinh thần chiến binh quả cảm! Đầu quấn băng trắng vì va chạm nhưng bạn vẫn thi đấu rực lửa bảo vệ trọn vẹn 3 điểm.",
      "Không chiến áp đảo tuyệt đối trước các tiền đạo cao kều của kình địch! Bạn hóa giải toàn bộ các tình huống bóng bổng và phạt góc của đối thủ.",
      "Đọc tình huống xuất thần! Bạn liên tục cắt đứt các đường chọc khe nguy hiểm, biến các đợt tấn công nguy hiểm của kình địch thành số không.",
      "Màn trình diễn phòng ngự mẫu mực được đưa vào sách giáo khoa bóng đá! Bạn phong tỏa hoàn toàn hành lang cánh, không cho đối thủ tạt bóng.",
      "Dũng cảm lấy thân mình chắn cú sút đại bác ở cự ly gần! Sự quả cảm của bạn thổi bùng ngọn lửa chiến đấu cho toàn bộ 10 cầu thủ trên sân.",
      "Vừa phòng ngự thép vừa dâng cao đánh đầu dũng mãnh ghi bàn mở tỷ số từ quả phạt góc, mở toang cánh cửa chiến thắng trong trận Siêu Kinh Điển.",
      "Bản lĩnh phi thường trong chảo lửa rực lửa pháo sáng! Bạn điềm tĩnh chỉ huy hàng thủ đứng vững trước sức ép nghẹt thở của 7 vạn CĐV đối phương.",
      "Người hùng thầm lặng của trận Derby! Pha bọc lót xuất thần ở phút cuối cùng giúp đội nhà giữ sạch lưới và ngạo nghễ rời sân kình địch với 3 điểm."
    ],
    GK: [
      "Người nhện thăng hoa tột đỉnh trong trận Derby! Pha bay người đẩy thành công quả phạt đền 11m ở phút 89 làm câm lặng hoàn toàn khán đài đối phương.",
      "Màn trình diễn xuất thần nhất sự nghiệp! Bạn cản phá liên tiếp 4 cú sút hiểm hóc trong vòng cấm chỉ trong vòng 30 giây nghẹt thở cuối trận.",
      "Bức tường thành kiên cố bảo vệ trọn vẹn tỷ số 1-0! Pha bay người chạm những đầu ngón tay đẩy bóng liếm xà ngang khiến đối thủ ôm đầu bất lực.",
      "Bản lĩnh thép trong chảo lửa thù địch! Bạn lao ra cản phá dũng mãnh ngay trong chân tiền đạo đối phương, bảo toàn mành lưới đội nhà.",
      "Cứu thua không tưởng ở cự ly 3 mét! Khán đài đội nhà vỡ òa hô vang tên bạn sau pha phản xạ xuất thần cản phá cú đánh đầu hiểm hóc.",
      "Làm chủ tuyệt đối không gian vòng cấm địa! Những pha băng ra bắt dính bóng bổng giải tỏa hoàn toàn áp lực đè nặng lên hàng phòng ngự.",
      "Chiến thắng ngoạn mục trong 3 pha đối mặt một-một! Bạn làm nản lòng toàn bộ các chân sút thượng thặng của kình địch truyền kiếp.",
      "Pha phát động tấn công bằng cú ném bóng chuẩn xác qua nửa sân, châm ngòi cho bàn thắng phản công ấn định chiến thắng 2-0 trong trận Derby.",
      "Đôi bàn tay vàng của trận Siêu Kinh Điển! Bạn được ban tổ chức trao giải Cầu thủ xuất sắc nhất trận đấu với 9 pha cứu thua đẳng cấp thế giới.",
      "Tâm lý vững như bàn thạch! Bạn không hề bị lay chuyển trước những tiếng la ó và pháo sáng rực trời, giữ sạch lưới trận cầu sinh tử.",
      "Cản phá xuất thần cú sút phạt hàng rào hiểm hóc bay vào góc chữ A, bảo toàn thắng lợi lịch sử đưa đội bóng vươn lên độc chiếm ngôi đầu.",
      "Người gác đền huyền thoại! Cả đội bóng lao đến ôm chầm lấy bạn sau tiếng còi mãn cuộc để tri ân màn trình diễn siêu phàm trong trận Derby."
    ]
  },
  PHASE_3: {
    FW: [
      "Màn lội ngược dòng (Remontada) kinh điển ở vòng Knock-out Cúp Châu Âu! Cú hat-trick lịch sử của bạn giúp đội nhà lật ngược thế cờ không tưởng.",
      "Người hùng của vòng Bán Kết! Cú nã đại bác ở phút 118 của hiệp phụ đưa đội bóng hiên ngang bước vào trận Chung Kết trong mơ.",
      "Bản lĩnh của siêu sao tại đấu trường Champions League! Bạn ghi bàn thắng vàng quyết định ở phút 90+2 sau pha solo qua 2 trung vệ đối phương.",
      "Tỏa sáng rực rỡ ở thể thức loại trực tiếp! Khả năng chớp thời cơ nhạy bén giúp bạn ghi bàn ở cả 2 lượt trận đi và về của vòng knock-out.",
      "Phá vỡ thế bế tắc trong trận cầu nghẹt thở! Cú đánh đầu dũng mãnh tung lưới đối thủ mở ra chiến thắng giòn giã đưa đội bóng chạm tay vào vé chung kết.",
      "Thực hiện thành công quả penalty quyết định trong loạt sút luân lưu cân não 11m, đưa toàn đội vỡ òa bước lên thảm cỏ trận Chung Kết.",
      "Màn trình diễn đỉnh cao trước các đại gia hàng đầu châu lục! Tốc độ và những pha dứt điểm hiểm hóc của bạn biến bạn thành nỗi khiếp sợ ở cúp châu Âu.",
      "Đẳng cấp của ứng viên Quả Bóng Vàng! Bạn tự mình kiếm phạt đền và thực hiện thành công, hoàn tất cú đúp đưa đội bóng đi tiếp.",
      "Cháy hết mình suốt 120 phút hiệp phụ! Dù kiệt sức nhưng bạn vẫn bứt tốc ghi bàn thắng quyết định, khiến cả sân vận động bùng nổ trong xúc động.",
      "Cú vô-lê sấm sét từ ngoài vòng cấm ở trận tứ kết lượt về được bình chọn là Bàn thắng đẹp nhất vòng đấu knock-out UEFA Champions League.",
      "Khuấy đảo hoàn toàn hàng thủ đối phương bằng kỹ thuật siêu hạng, liên tục tạo đột biến và trực tiếp ghi 2 bàn thắng then chốt.",
      "Bản lĩnh sát thủ lạnh lùng! Bạn trừng phạt sai lầm duy nhất của hàng thủ đối phương ở phút 88, đưa đội bóng tiến thẳng vào trận chung kết cúp quốc gia."
    ],
    MF: [
      "Nhạc trưởng thiên tài ở vòng Knock-out C1! Cú đúp kiến tạo đẳng cấp cùng 1 siêu phẩm sút xa đưa đội nhà vượt qua đối thủ sừng sỏ sau 2 lượt trận.",
      "Cầm trịch hoàn hảo 120 phút hiệp phụ nghẹt thở! Bạn làm chủ hoàn toàn nhịp độ trận đấu, bẻ gãy mọi đợt vây hãm của đối thủ hùng mạnh.",
      "Pha chọc khe xé toang hàng phòng ngự ở phút 115 của hiệp phụ mang về bàn thắng vàng đưa đội bóng tiến thẳng vào trận Chung Kết vĩ đại.",
      "Bậc thầy điều tiết thế trận ở cúp châu Âu! Bạn khiến hàng tiền vệ siêu sao của đối phương hoàn toàn bất lực trong việc tranh chấp bóng.",
      "Tự tin bước lên thực hiện quả luân lưu 11m quyết định và sút tung nóc lưới, đưa đội nhà vượt qua loạt sút cân não đầy kịch tính.",
      "Màn trình diễn ma thuật ở trận bán kết lượt về! Những pha chuyền bóng điểm rơi tuyệt đỉnh của bạn mở ra liên tiếp 2 bàn thắng then chốt.",
      "Trái tim quả cảm của tập thể! Bạn bao quát từ vòng cấm địa đội nhà sang vòng cấm đối phương, thu hồi bóng và kiến tạo không biết mệt mỏi.",
      "Pha sút phạt hàng rào hình vòng cung tuyệt mỹ ở phút 89 gỡ hòa ngoạn mục, tạo tiền đề cho màn lội ngược dòng kinh điển ở hiệp phụ.",
      "Tư duy chiến thuật vượt trội đẳng cấp thế giới! Bạn kiểm soát nhịp độ, ru ngủ đối phương rồi tung ra đường chuyền sát thủ định đoạt tấm vé chung kết.",
      "Chi phối hoàn toàn trận đại chiến knock-out! Bạn được UEFA trao danh hiệu Cầu thủ xuất sắc nhất trận đấu (Player of the Match).",
      "Những pha xoay compa và bấm bóng điệu nghệ làm nức lòng người hâm mộ, đưa đội nhà vượt qua nhánh đấu tử thần để vào chung kết.",
      "Thủ lĩnh bản lĩnh nơi tuyến giữa! Bạn truyền sự tự tin tuyệt đối cho các đồng đội, giúp toàn đội vượt qua sức ép nghẹt thở của vòng loại trực tiếp."
    ],
    DF: [
      "Bức tường thép bất tử tại vòng Knock-out Champions League! Bạn chỉ huy hàng thủ đứng vững trước cơn bão tấn công dồn dập của đối thủ.",
      "Pha cứu thua ngoạn mục trên vạch vôi ở phút 120 của hiệp phụ, đưa trận bán kết vào loạt luân lưu và mở toang cánh cửa vào chung kết.",
      "Khóa chặt siêu tiền đạo đắt giá nhất thế giới suốt cả 2 lượt trận đi và về! Bạn khiến ngôi sao đối phương hoàn toàn bất lực và ức chế.",
      "Tắc bóng chính xác đến kinh ngạc trong vòng cấm địa ở những phút bù giờ sinh tử, giải nguy cho đội nhà mà không mắc bất kỳ sai lầm nào.",
      "Thủ lĩnh hàng phòng ngự kiên cường! Bạn đánh đầu phá bóng dũng mãnh hóa giải hàng chục quả tạt nguy hiểm của đối phương.",
      "Dũng mãnh lấy thân mình cản phá 3 cú dứt điểm liên tiếp ở cự ly gần, truyền ngọn lửa chiến đấu bất diệt cho toàn đội trong hiệp phụ.",
      "Không chiến áp đảo hoàn toàn các tiền đạo ngoại quốc! Sự chắc chắn của bạn là nền tảng số 1 giúp đội nhà giữ sạch lưới ở bán kết cúp quốc gia.",
      "Đọc tình huống và cắt bóng đỉnh cao! Bạn hóa giải hoàn toàn các đợt phản công nhanh nguy hiểm, bảo vệ thành công tỷ số cách biệt mong manh.",
      "Thực hiện thành công cú sút luân lưu 11m đầy bản lĩnh, trực tiếp đưa đội bóng thân yêu bước vào trận Chung Kết Cúp Châu Âu trong mơ.",
      "Phòng ngự kỷ luật và khoa học đẳng cấp thế giới! Hàng thủ do bạn chỉ huy không để thủng lưới bàn nào trong suốt vòng đấu knock-out.",
      "Pha bọc lót xuất thần cứu nguy cho thủ môn đã bị đánh bại, trở thành bước ngoặt vĩ đại đưa đội nhà lọt vào trận tranh cúp vô địch.",
      "Chiến binh thép nơi hậu tuyến! Màn trình diễn không tì vết của bạn được giới chuyên môn quốc tế ca ngợi là đẳng cấp trung vệ số 1 hành tinh."
    ],
    GK: [
      "Người hùng vĩ đại của loạt sút luân lưu 11m cân não! Bạn xuất sắc cản phá 2 quả penalty quyết định, đưa đội nhà thẳng tiến vào Chung Kết C1.",
      "Màn trình diễn siêu phàm trong suốt 120 phút hiệp phụ! Bạn liên tục cứu thua mười mươi trước sức ép nghẹt thở của dàn sao đối phương.",
      "Pha bay người cản phá cú đánh đầu hiểm hóc ở phút 90+4 được bình chọn là Pha Cứu Thua Hay Nhất Mùa Giải của UEFA Champions League.",
      "Bức tường thành bất khả xâm phạm ở vòng bán kết! Bạn giữ sạch lưới cả 2 lượt trận đi và về trước hàng công ghi nhiều bàn nhất giải đấu.",
      "Phản xạ xuất thần cản phá cú sút cận thành ở cự ly 2 mét! Cả sân vận động đứng dậy vỗ tay tán thưởng màn trình diễn siêu nhân của bạn.",
      "Làm chủ hoàn toàn không gian vòng cấm địa dưới áp lực khổng lồ! Bạn bắt dính bóng giải tỏa toàn bộ các tình huống phạt góc cuối trận.",
      "Chiến thắng trong 4 pha đối mặt nghẹt thở với tiền đạo đối phương, trực tiếp bảo toàn tấm vé vào chơi trận Chung Kết danh giá.",
      "Tâm lý thép vững như bàn thạch trên chấm 11m! Bạn dùng ánh mắt và phản xạ xuất thần khuất phục hoàn toàn các chân sút kình địch.",
      "Đôi bàn tay vàng đưa đội bóng vào lịch sử! Bạn được bình chọn là Cầu thủ xuất sắc nhất trận Bán Kết Cúp Châu Âu.",
      "Hóa giải cú sút phạt hàng rào bay thẳng vào góc chết ở phút 119 của hiệp phụ, dập tắt hy vọng lật ngược thế cờ của đối thủ hùng mạnh.",
      "Người gác đền huyền thoại của những trận cầu sinh tử! Bạn là điểm tựa vững chãi nhất đưa đội nhà chạm tay vào trận tranh cúp vô địch.",
      "Phản xạ nhanh như chớp cản phá cú đá bồi cận thành, tạo nên khoảnh khắc cứu thua kỳ diệu nhất trong lịch sử các kỳ cúp quốc gia."
    ]
  },
  PHASE_4: {
    FW: [
      "Bàn thắng vàng phút 89 định đoạt chiếc Cúp Vô Địch danh giá! Pháo hoa rực sáng trời đêm khi bạn nâng cao cúp trong tiếng hô vang của hàng vạn CĐV.",
      "Khoảnh khắc lịch sử của sự nghiệp! Cú đúp siêu phẩm trong trận Chung Kết giúp đội nhà bước lên đỉnh vinh quang và chạm tay vào Quả Bóng Vàng.",
      "Vua của trận Chung Kết! Bạn solo qua 2 hậu vệ trước khi dứt điểm tung nóc lưới, khép lại mùa giải trong những giọt nước mắt vinh quang hạnh phúc.",
      "Màn trình diễn đưa bạn vào ngôi đền huyền thoại! Chiếc Cúp Vô Địch danh giá được trao vào tay bạn trong tiếng reo hò dậy sóng của biển người hâm mộ.",
      "Ghi bàn thắng duy nhất của trận Chung Kết lịch sử! Bạn chính thức trở thành người hùng bất tử trong lòng hàng triệu người hâm mộ đội bóng.",
      "Khép lại mùa giải hoàn hảo với danh hiệu Cầu Thủ Xuất Sắc Nhất Trận Chung Kết (Final MVP) và nâng cao chiếc cúp vô địch châu lục danh giá.",
      "Bàn thắng ở phút bù giờ đưa cảm xúc của cả quốc gia vỡ òa! Bạn hoàn tất cú đúp danh hiệu mùa giải và khẳng định vị thế ngôi sao số 1 hành tinh.",
      "Đỉnh cao danh vọng và vinh quang tột cùng! Bạn lập cú hat-trick lịch sử trong trận Chung Kết, tạo nên chiến thắng vĩ đại nhất lịch sử CLB.",
      "Nâng cao chiếc cúp vô địch danh giá trong pháo hoa rực rỡ và những tràng vỗ tay không ngớt, ghi tên mình vào trang vàng lịch sử bóng đá thế giới.",
      "Cú sút phạt thần sầu ở trận Chung Kết mang về chiếc cúp vô địch mà CLB đã mòn mỏi chờ đợi suốt hàng chục năm qua.",
      "Mùa giải đại thành công rực rỡ! Bạn hoàn tất bộ sưu tập danh hiệu cao quý và nhận được sự tôn sùng tuyệt đối từ người hâm mộ toàn cầu.",
      "Bản lĩnh của nhà vô địch vĩ đại! Bạn dẫn dắt hàng công bùng nổ, khép lại một mùa giải huyền thoại với vô số kỷ lục bàn thắng bị xô đổ."
    ],
    MF: [
      "Kiến tạo siêu phẩm quyết định chức Vô Địch trong trận Chung Kết! Bạn được trao danh hiệu Cầu thủ xuất sắc nhất trận đấu và nâng cao chiếc cúp danh giá.",
      "Làm chủ hoàn toàn trận Chung Kết đỉnh cao bằng nhãn quan thiên tài! Chiếc cúp vô địch danh giá chính thức thuộc về đội bóng của bạn trong vinh quang rực rỡ.",
      "Nhạc trưởng thiên tài đưa đội bóng bước lên đỉnh vinh quang! Bạn điều tiết trận Chung Kết mẫu mực và tung đường chuyền vàng định đoạt ngôi vương.",
      "Cú nã đại bác sấm sét từ cự ly 25 mét mở toang cánh cửa vô địch! Pháo hoa và cúp vàng rực rỡ trên thảm cỏ trong đêm chung kết lịch sử.",
      "Màn trình diễn của một bậc thầy kiến thiết vĩ đại! Bạn nâng cao chiếc cúp danh giá nhất mùa giải trong sự ngả mũ thán phục của toàn thế giới.",
      "Khép lại mùa giải hoàn hảo với danh hiệu Vua Kiến Tạo và chiếc Cúp Vô Địch! Tên tuổi bạn được khắc trang trọng lên thân cúp danh giá.",
      "Thủ lĩnh tuyến giữa đưa đội bóng hoàn tất cú ăn ba vĩ đại! Bạn ôm chầm lấy chiếc cúp vô địch trong tiếng hát vang dội của các CĐV cuồng nhiệt.",
      "Bản lĩnh và đẳng cấp thượng thừa trong trận Chung Kết! Bạn chỉ huy toàn đội đứng vững và nâng cao chiếc cúp vô địch danh giá trong niềm tự hào.",
      "Pha kiến tạo không tưởng ở phút 88 định đoạt trận Chung Kết! Bạn được tôn vinh là linh hồn đưa đội bóng bước lên ngai vàng bóng đá.",
      "Chiếc cúp vô địch lấp lánh trên tay nhạc trưởng tài hoa! Một mùa giải siêu phàm kết thúc trọn vẹn với những phần thưởng cá nhân cao quý nhất.",
      "Đỉnh cao nghệ thuật bóng đá! Những pha xử lý mê hoặc của bạn trong trận Chung Kết giúp đội nhà giành chiến thắng lịch sử và nâng cao cúp vàng.",
      "Mùa giải trong mơ khép lại hoàn mỹ! Bạn bước lên bục vinh quang nhận huy chương vàng và chiếc cúp vô địch danh giá nhất sự nghiệp."
    ],
    DF: [
      "Hòn đá tảng đưa đội bóng bước lên ngôi Vô Địch! Màn trình diễn phòng ngự thép ở trận Chung Kết giúp đội nhà giữ sạch lưới và nâng cao cúp vàng.",
      "Khóa chặt hoàn toàn hàng công đối thủ suốt 90 phút Chung Kết! Bạn giương cao chiếc cúp vô địch danh giá trong tiếng reo hò bất tận của biển người.",
      "Thủ lĩnh hàng phòng ngự với pha cản phá xuất thần cứu thua trên vạch vôi ở phút cuối, trực tiếp mang về chiếc Cúp Vô Địch lịch sử cho đội nhà.",
      "Bức tường thép bất tử trong đêm Chung Kết huyền diệu! Bạn nâng cao chiếc cúp vô địch trong pháo hoa rực sáng trời đêm và niềm tự hào vô bờ.",
      "Đánh đầu dũng mãnh ghi bàn thắng duy nhất của trận Chung Kết từ quả phạt góc, trở thành người hùng lịch sử đưa đội bóng chạm tay vào cúp vàng.",
      "Màn trình diễn phòng ngự không tì vết đẳng cấp thế giới! Bạn được bầu chọn là Cầu thủ xuất sắc nhất trận Chung Kết và nâng cao chiếc cúp vô địch.",
      "Bảo vệ thành công mành lưới trong trận tranh cúp sinh tử! Chiếc cúp vô địch danh giá chính thức được trao vào tay thủ lĩnh phòng ngự thép.",
      "Khép lại mùa giải hoàn hảo với chức Vô Địch và danh hiệu Hàng Thủ Xuất Sắc Nhất! Tên tuổi bạn trở thành biểu tượng trung vệ huyền thoại của CLB.",
      "Lăn xả kiên cường bảo vệ tỷ số 1-0 đến những giây cuối cùng! Bạn ôm chặt chiếc cúp vô địch trong niềm xúc động vỡ òa của hàng vạn người hâm mộ.",
      "Bản lĩnh phi thường nơi hậu tuyến đưa đội nhà chạm tới đỉnh cao vinh quang! Đêm Chung Kết lịch sử khép lại với chiếc cúp vàng danh giá trên tay bạn.",
      "Không chiến áp đảo và tắc bóng mẫu mực! Bạn dẫn dắt hàng phòng ngự tạo nên kỳ tích vô địch được lưu danh muôn thuở trong lịch sử bóng đá.",
      "Chiếc cúp vô địch cao quý được nâng cao bởi hòn đá tảng kiên cường! Mùa giải đại thành công khép lại với những phần thưởng xứng đáng nhất."
    ],
    GK: [
      "Người gác đền huyền thoại của trận Chung Kết! Pha cản phá quả penalty ở phút bù giờ 90+2 trực tiếp mang về chiếc Cúp Vô Địch vĩ đại cho đội nhà.",
      "Bức tường thành bất tử giữ sạch lưới trận Chung Kết lịch sử! Bạn nâng cao chiếc cúp vô địch danh giá trong tiếng vỗ tay tán thưởng của toàn thế giới.",
      "Người hùng trận Chung Kết với 8 pha cứu thua siêu phàm! Chiếc cúp vô địch danh giá chính thức thuộc về bạn trong pháo hoa rực sáng trời đêm.",
      "Màn trình diễn siêu đẳng đưa bạn vào ngôi đền huyền thoại! Đôi bàn tay nhựa giữ chặt chiếc cúp vô địch danh giá trong niềm xúc động tột cùng.",
      "Xuất sắc cản phá 2 quả luân lưu 11m trong trận Chung Kết kịch tính, đưa toàn đội bước lên đỉnh vinh quang của bóng đá châu lục.",
      "Khép lại mùa giải hoàn hảo với danh hiệu Găng Tay Vàng và chiếc Cúp Vô Địch danh giá! Bạn được tôn vinh là thủ môn số 1 hành tinh.",
      "Pha phản xạ xuất thần cản phá cú sút cận thành ở phút 89 bảo toàn tỷ số 1-0, đưa đội nhà bước lên ngôi vương vô địch trong niềm tự hào vô bờ.",
      "Bản lĩnh phi thường trước chấm 11m đưa đội bóng chạm tay vào chiếc cúp vô địch hằng mơ ước sau bao năm tháng chờ đợi.",
      "Chiếc cúp vàng lấp lánh trong đôi bàn tay của người nhện tài hoa! Một mùa giải kỳ diệu khép lại trọn vẹn với ngôi vương vô địch lịch sử.",
      "Điểm tựa vững chãi nhất đưa đội nhà vượt qua mọi sóng gió để chạm tay vào cúp vàng! Bạn ăn mừng ngập tràn hạnh phúc cùng hàng vạn người hâm mộ.",
      "Màn trình diễn 10 điểm tuyệt đối trong đêm Chung Kết! Bạn nâng cao chiếc cúp vô địch danh giá trong những tràng pháo tay không ngớt của cả cầu trường.",
      "Người nhện bất tử khép lại mùa giải bằng chiếc Cúp Vô Địch danh giá và sự ngưỡng mộ tuyệt đối từ giới chuyên môn bóng đá toàn cầu."
    ]
  }
};

/* =========================================================================
   14. BRAND SPONSORSHIPS & AGENT CONTRACTS DATABASE
   ========================================================================= */
export const SPONSORSHIP_CATEGORIES = {
  BOOTS: {
    id: "BOOTS",
    name: "Giày & Trang Phục",
    icon: "👟",
    desc: "Hợp đồng trang phục thi đấu độc quyền, cung cấp giày và đồ thể thao."
  },
  BEVERAGE: {
    id: "BEVERAGE",
    name: "Đồ Uống & Dinh Dưỡng",
    icon: "⚡",
    desc: "Đại diện thương hiệu nước tăng lực, thể thao và thực phẩm phục hồi thể lực."
  },
  LUXURY: {
    id: "LUXURY",
    name: "Đồng Hồ & Xa Xỉ Phẩm",
    icon: "💎",
    desc: "Đại diện cho các nhãn hàng xa hoa, đồng hồ Thụy Sĩ và thời trang cao cấp."
  },
  TECH_GAMING: {
    id: "TECH_GAMING",
    name: "Công Nghệ & Game",
    icon: "🎮",
    desc: "Gương mặt bìa game bóng đá, đại sứ thiết bị di động & console toàn cầu."
  },
  GLOBAL_AMBASSADOR: {
    id: "GLOBAL_AMBASSADOR",
    name: "Đại Sứ Toàn Cầu",
    icon: "✈️",
    desc: "Hợp đồng đại sứ du lịch, hàng không 5 sao và siêu xe thể thao đỉnh cao."
  }
};

export const SPONSORSHIP_BRANDS = [
  // ── 1. BOOTS (Giày & Trang Phục) ───────────────────────
  {
    id: "sp_mizuno",
    brand: "Mizuno",
    name: "Mizuno Morelia Neo IV",
    category: "BOOTS",
    icon: "👟",
    minTier: 1,
    minFame: 50,
    baseAnnualPayout: 35000,
    baseSigningBonus: 15000,
    baseDurationYears: 1,
    perkBonus: "Tài trợ giày da thủ công Nhật Bản, buff +1 Tốc độ & Thể lực ban đầu",
    desc: "Hợp đồng tân binh khởi đầu sự nghiệp cùng thương hiệu Morelia danh tiếng."
  },
  {
    id: "sp_under_armour",
    brand: "Under Armour",
    name: "Under Armour Shadow Pro",
    category: "BOOTS",
    icon: "🛡️",
    minTier: 2,
    minFame: 250,
    baseAnnualPayout: 75000,
    baseSigningBonus: 30000,
    baseDurationYears: 2,
    perkBonus: "Trang bị nén cơ HeatGear giảm mệt mỏi sau các trận đấu căng thẳng",
    desc: "Thương hiệu thể thao Mỹ hàng đầu về trang bị hỗ trợ thể lực và cơ bắp."
  },
  {
    id: "sp_puma",
    brand: "Puma",
    name: "Puma Future Ultimate",
    category: "BOOTS",
    icon: "🐆",
    minTier: 4,
    minFame: 1000,
    baseAnnualPayout: 800000,
    baseSigningBonus: 350000,
    baseDurationYears: 3,
    perkBonus: "Tăng 5% tốc độ bứt phá và độ nhạy xử lý bóng trong vòng cấm",
    desc: "Đại diện thế hệ tấn công mới cùng dòng giày báo săn bùng nổ của Puma."
  },
  {
    id: "sp_adidas",
    brand: "Adidas",
    name: "Adidas Predator Elite",
    category: "BOOTS",
    icon: "⚡",
    minTier: 6,
    minFame: 4000,
    baseAnnualPayout: 5500000,
    baseSigningBonus: 2000000,
    baseDurationYears: 4,
    perkBonus: "+5% Tăng trưởng danh tiếng và độ chính xác những pha dứt điểm",
    desc: "Biểu tượng Ba Sọc huyền thoại trao cho bạn vị thế nhạc trưởng sân cỏ."
  },
  {
    id: "sp_nike",
    brand: "Nike",
    name: "Nike Mercurial Superfly Elite",
    category: "BOOTS",
    icon: "💫",
    minTier: 7,
    minFame: 7000,
    baseAnnualPayout: 15000000,
    baseSigningBonus: 6000000,
    baseDurationYears: 5,
    perkBonus: "Dòng giày thửa riêng theo chữ ký cá nhân, nâng tầm thương hiệu siêu sao",
    desc: "Bản hợp đồng siêu sao toàn cầu của Nike Swoosh, ghi tên bạn vào đền thờ danh vọng."
  },
  {
    id: "sp_nike_lifetime",
    brand: "Nike / Jordan",
    name: "Nike & Jordan Lifetime Heritage",
    category: "BOOTS",
    icon: "👑",
    minTier: 8,
    minFame: 12000,
    baseAnnualPayout: 25000000,
    baseSigningBonus: 15000000,
    baseDurationYears: "LIFETIME",
    isLifetime: true,
    perkBonus: "Hợp đồng TRỌN ĐỜI vĩnh cửu! Logo cá nhân in trên trang phục toàn cầu",
    desc: "Đẳng cấp hợp đồng TRỌN ĐỜI vĩ đại sánh ngang Michael Jordan, CR7 và LeBron James!"
  },

  // ── 2. BEVERAGE (Đồ Uống & Dinh Dưỡng) ─────────────────
  {
    id: "sp_prime",
    brand: "Prime Hydration",
    name: "Prime Hydration Energy Fuel",
    category: "BEVERAGE",
    icon: "🥤",
    minTier: 2,
    minFame: 200,
    baseAnnualPayout: 60000,
    baseSigningBonus: 25000,
    baseDurationYears: 2,
    perkBonus: "Điện giải bù khoáng cấp tốc, duy trì độ sung mãn giữa các hiệp",
    desc: "Thương hiệu nước uống thể thao thế hệ mới gây sốt toàn cầu."
  },
  {
    id: "sp_monster",
    brand: "Monster Energy",
    name: "Monster Energy Hydro Sport",
    category: "BEVERAGE",
    icon: "⚡",
    minTier: 3,
    minFame: 600,
    baseAnnualPayout: 400000,
    baseSigningBonus: 150000,
    baseDurationYears: 2,
    perkBonus: "Buff tinh thần thi đấu bốc lửa và khả năng pressing nghẹt thở",
    desc: "Nước tăng lực năng lượng cao dành cho những chiến binh sân cỏ không biết mệt mỏi."
  },
  {
    id: "sp_gatorade",
    brand: "Gatorade",
    name: "Gatorade GX Elite Science",
    category: "BEVERAGE",
    icon: "🧪",
    minTier: 5,
    minFame: 2200,
    baseAnnualPayout: 3200000,
    baseSigningBonus: 1200000,
    baseDurationYears: 3,
    perkBonus: "Hệ thống xét nghiệm mồ hôi tối ưu hóa thể lực, giảm 15% nguy cơ chấn thương",
    desc: "Học viện dinh dưỡng thể thao đỉnh cao của PepsiCo đồng hành cùng bạn."
  },
  {
    id: "sp_redbull",
    brand: "Red Bull",
    name: "Red Bull Athlete Global",
    category: "BEVERAGE",
    icon: "🐂",
    minTier: 7,
    minFame: 8000,
    baseAnnualPayout: 14000000,
    baseSigningBonus: 5000000,
    baseDurationYears: 5,
    perkBonus: "Gia nhập hội Vận Động Viên Đỉnh Cao Red Bull, chuyên cơ đưa đón thi đấu",
    desc: "Đặc quyền tối thượng cùng tập đoàn thể thao mạo hiểm và năng lượng lớn nhất hành tinh."
  },

  // ── 3. LUXURY (Đồng Hồ & Xa Xỉ Phẩm) ────────────────────
  {
    id: "sp_tag_heuer",
    brand: "Tag Heuer",
    name: "TAG Heuer Carrera Chronograph",
    category: "LUXURY",
    icon: "⌚",
    minTier: 4,
    minFame: 1200,
    baseAnnualPayout: 900000,
    baseSigningBonus: 350000,
    baseDurationYears: 2,
    perkBonus: "Phong cách quý ông sân cỏ thanh lịch, nâng cao uy tín với truyền thông",
    desc: "Thương hiệu đồng hồ bấm giờ Thụy Sĩ lừng danh với triết lý 'Don't Crack Under Pressure'."
  },
  {
    id: "sp_hublot",
    brand: "Hublot",
    name: "Hublot Big Bang Football Icon",
    category: "LUXURY",
    icon: "🕰️",
    minTier: 6,
    minFame: 4200,
    baseAnnualPayout: 5800000,
    baseSigningBonus: 2200000,
    baseDurationYears: 4,
    perkBonus: "Sở hữu phiên bản giới hạn khắc tên riêng và số áo trên mặt đá Sapphire",
    desc: "Đồng hồ biểu tượng của UEFA Champions League và các siêu sao đương đại."
  },
  {
    id: "sp_rolex",
    brand: "Rolex",
    name: "Rolex Cosmograph Daytona",
    category: "LUXURY",
    icon: "👑",
    minTier: 7,
    minFame: 8500,
    baseAnnualPayout: 16000000,
    baseSigningBonus: 6500000,
    baseDurationYears: 6,
    perkBonus: "Bảo chứng vị thế giới thượng lưu và giá trị thương hiệu trường tồn",
    desc: "Đỉnh cao chế tác đồng hồ Thụy Sĩ - biểu tượng bất biến của sự hoàn mỹ."
  },
  {
    id: "sp_louis_vuitton",
    brand: "Louis Vuitton",
    name: "Louis Vuitton Maison Legend",
    category: "LUXURY",
    icon: "💎",
    minTier: 8,
    minFame: 13000,
    baseAnnualPayout: 23000000,
    baseSigningBonus: 9000000,
    baseDurationYears: 6,
    perkBonus: "Chiến dịch hình ảnh thế kỷ bên rương cờ LV cùng các huyền thoại vĩ đại nhất",
    desc: "Đế chế thời trang xa xỉ số một thế giới chọn bạn làm đại sứ văn hóa thượng đỉnh."
  },

  // ── 4. TECH_GAMING (Công Nghệ & Game) ─────────────────
  {
    id: "sp_ea_sports",
    brand: "EA Sports",
    name: "EA SPORTS FC Global Ambassador",
    category: "TECH_GAMING",
    icon: "🎮",
    minTier: 3,
    minFame: 500,
    baseAnnualPayout: 350000,
    baseSigningBonus: 150000,
    baseDurationYears: 2,
    perkBonus: "Hình ảnh bìa đĩa game và chỉ số ingame được ưu ái buff hoạt ảnh độc quyền",
    desc: "Tựa game bóng đá có lượng người chơi lớn nhất hành tinh đưa bạn lên trang bìa."
  },
  {
    id: "sp_playstation",
    brand: "PlayStation",
    name: "PlayStation Pro Global Ambassador",
    category: "TECH_GAMING",
    icon: "🕹️",
    minTier: 5,
    minFame: 2200,
    baseAnnualPayout: 2800000,
    baseSigningBonus: 1000000,
    baseDurationYears: 3,
    perkBonus: "Đối tác giải trí Champions League của Sony, phủ sóng trên toàn bộ hệ máy console",
    desc: "Cùng PlayStation kết nối hàng triệu người hâm mộ thể thao điện tử khắp các châu lục."
  },
  {
    id: "sp_samsung",
    brand: "Samsung",
    name: "Samsung Galaxy Ultra Flagship",
    category: "TECH_GAMING",
    icon: "📱",
    minTier: 6,
    minFame: 5000,
    baseAnnualPayout: 6500000,
    baseSigningBonus: 2500000,
    baseDurationYears: 4,
    perkBonus: "Dẫn đầu chiến dịch quảng bá công nghệ AI và thiết bị di động thế hệ mới",
    desc: "Tập đoàn công nghệ khổng lồ châu Á đưa bạn làm gương mặt đại diện toàn cầu."
  },
  {
    id: "sp_apple",
    brand: "Apple",
    name: "Apple Worldwide Ecosystem Icon",
    category: "TECH_GAMING",
    icon: "🍏",
    minTier: 8,
    minFame: 12500,
    baseAnnualPayout: 22000000,
    baseSigningBonus: 8500000,
    baseDurationYears: 5,
    perkBonus: "Phim tài liệu độc quyền sự nghiệp trên Apple TV+ cùng bản quyền âm nhạc Beats",
    desc: "Thương hiệu giá trị nhất hành tinh ký hợp đồng toàn diện với siêu sao bóng đá."
  },

  // ── 5. GLOBAL_AMBASSADOR (Đại Sứ Toàn Cầu) ─────────────
  {
    id: "sp_marriott",
    brand: "Marriott Bonvoy",
    name: "Marriott Bonvoy Luxury Travel",
    category: "GLOBAL_AMBASSADOR",
    icon: "🏨",
    minTier: 4,
    minFame: 1500,
    baseAnnualPayout: 1100000,
    baseSigningBonus: 400000,
    baseDurationYears: 3,
    perkBonus: "Đặc quyền nghỉ dưỡng tại hệ thống khách sạn Ritz-Carlton & St. Regis toàn cầu",
    desc: "Tập đoàn khách sạn và du lịch nghỉ dưỡng thượng lưu số một thế giới."
  },
  {
    id: "sp_qatar_airways",
    brand: "Qatar Airways",
    name: "Qatar Airways World Ambassador",
    category: "GLOBAL_AMBASSADOR",
    icon: "✈️",
    minTier: 6,
    minFame: 4800,
    baseAnnualPayout: 6000000,
    baseSigningBonus: 2200000,
    baseDurationYears: 3,
    perkBonus: "Thẻ thành viên Platinum tối thượng trên tất cả các chặng bay quốc tế",
    desc: "Hãng hàng không 5 sao đối tác chiến lược của FIFA World Cup và bóng đá đỉnh cao."
  },
  {
    id: "sp_emirates",
    brand: "Emirates",
    name: "Emirates Fly Better Ambassador",
    category: "GLOBAL_AMBASSADOR",
    icon: "🛫",
    minTier: 7,
    minFame: 9000,
    baseAnnualPayout: 17000000,
    baseSigningBonus: 6500000,
    baseDurationYears: 5,
    perkBonus: "Xuất hiện trên bảng quảng cáo SVĐ Emirates, Bernabeu và San Siro",
    desc: "Thương hiệu hàng không quyền lực bậc nhất trên ngực áo các CLB huyền thoại."
  },
  {
    id: "sp_porsche",
    brand: "Porsche",
    name: "Porsche Motorsport Heritage",
    category: "GLOBAL_AMBASSADOR",
    icon: "🏎️",
    minTier: 8,
    minFame: 14000,
    baseAnnualPayout: 25000000,
    baseSigningBonus: 10000000,
    baseDurationYears: 5,
    perkBonus: "Sở hữu bộ sưu tập siêu xe thể thao thửa riêng 911 GT3 RS và Porsche Taycan",
    desc: "Biểu tượng tốc độ và kỹ nghệ xe đua thượng thặng nước Đức trao quyền đại sứ."
  }
];

export const SPONSORSHIPS_DATA = [
  {
    id: "sp_puma",
    name: "Puma Future & Under Armour",
    icon: "🐆",
    brand: "Puma / Under Armour",
    tier: "Tài Năng Trẻ",
    minFame: 300,
    minOvr: 60,
    signingBonus: 300000,
    goalBonus: 6000,
    trophyBonus: 60000,
    desc: "Hợp đồng tài trợ giày thi đấu và trang phục tân binh. Thưởng nóng $6,000/bàn và $60,000/cúp vô địch."
  },
  {
    id: "sp_adidas",
    name: "Adidas Predator Elite",
    icon: "👟",
    brand: "Adidas",
    tier: "Trụ Cột Đội Bóng",
    minFame: 1000,
    minOvr: 74,
    signingBonus: 1800000,
    goalBonus: 25000,
    trophyBonus: 300000,
    desc: "Đại diện dòng giày kiểm soát trận đấu huyền thoại của Adidas. Thưởng nóng $25,000/bàn và $300,000/cúp."
  },
  {
    id: "sp_nike",
    name: "Nike Mercurial Superfly",
    icon: "⚡",
    brand: "Nike",
    tier: "Siêu Sao Quốc Tế",
    minFame: 4000,
    minOvr: 84,
    signingBonus: 8500000,
    goalBonus: 70000,
    trophyBonus: 1200000,
    desc: "Hợp đồng gương mặt đại diện toàn cầu cùng mẫu giày đắt giá nhất của Nike. Thưởng $70,000/bàn và $1.2M/cúp."
  },
  {
    id: "sp_jordan",
    name: "Jordan & Global Iconic Ambassador",
    icon: "👑",
    brand: "Jordan / Nike Special",
    tier: "Huyền Thoại Toàn Cầu",
    minFame: 10000,
    minOvr: 90,
    signingBonus: 28000000,
    goalBonus: 200000,
    trophyBonus: 4000000,
    desc: "Hợp đồng biểu tượng toàn cầu với thương hiệu thể thao tối thượng. Thưởng $200,000/bàn và $4,000,000/cúp!"
  }
];

export const AGENTS_DATA = [
  {
    id: "agent_family",
    name: "Đại Diện Gia Đình (Family Agent)",
    icon: "👨‍👩‍👦",
    tier: "Cơ Bản",
    fee: 0,
    salaryBoost: 0,
    sponsorBoost: 0,
    desc: "Người thân trực tiếp hỗ trợ bạn thời mới vào nghề. Không tốn phí đại diện nhưng chưa có mạng lưới quốc tế."
  },
  {
    id: "agent_national",
    name: "Siêu Cò Quốc Gia (National Super Agent)",
    icon: "👔",
    tier: "Chuyên Nghiệp",
    fee: 150000,
    salaryBoost: 0.15,
    sponsorBoost: 0.10,
    desc: "Có quan hệ sâu rộng tại giải quốc nội. Tăng +15% mức lương khi ký hợp đồng và tăng +10% tiền tài trợ."
  },
  {
    id: "agent_continental",
    name: "Đại Diện Cấp Châu Âu (Continental Agency)",
    icon: "💼",
    tier: "Đẳng Cấp Châu Âu",
    fee: 1600000,
    salaryBoost: 0.35,
    sponsorBoost: 0.25,
    desc: "Mạng lưới trải rộng khắp Ngoại Hạng Anh, La Liga, Serie A. Tăng +35% lương và +25% tiền tài trợ."
  },
  {
    id: "agent_legend",
    name: "Siêu Cò Toàn Cầu (World Elite Agency)",
    icon: "👑",
    tier: "Quyền Lực Tối Thượng",
    fee: 6500000,
    salaryBoost: 0.60,
    sponsorBoost: 0.45,
    desc: "Đế chế đại diện quyền lực nhất hành tinh (Mendes / Raiola tier). Tăng +60% lương và +45% tiền tài trợ!"
  }
];

/* =========================================================================
   15. LIVE RIVALRY & GOLDEN SHOE / BALLON D'OR POWER RANKINGS
   ========================================================================= */
const WORLD_STARS_POOL = [
  { id: "mbappe", name: "Kylian Mbappé", flag: "🇫🇷", club: "Real Madrid", ovr: 92, form: 88, goalFactor: 0.95, assistFactor: 0.70 },
  { id: "bellingham", name: "Jude Bellingham", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", club: "Real Madrid", ovr: 90, form: 85, goalFactor: 0.65, assistFactor: 0.90 },
  { id: "vinicius", name: "Vinícius Júnior", flag: "🇧🇷", club: "Real Madrid", ovr: 90, form: 86, goalFactor: 0.85, assistFactor: 0.80 },
  { id: "rodri", name: "Rodri", flag: "🇪🇸", club: "Man City", ovr: 91, form: 88, goalFactor: 0.35, assistFactor: 0.60 },
  { id: "haaland", name: "Erling Haaland", flag: "🇳🇴", club: "Man City", ovr: 91, form: 87, goalFactor: 1.00, assistFactor: 0.40 },
  { id: "yamal", name: "Lamine Yamal", flag: "🇪🇸", club: "FC Barcelona", ovr: 85, form: 88, goalFactor: 0.60, assistFactor: 0.85 },
  { id: "kane", name: "Harry Kane", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", club: "Bayern Munich", ovr: 90, form: 85, goalFactor: 0.90, assistFactor: 0.60 },
  { id: "salah", name: "Mohamed Salah", flag: "🇪🇬", club: "Liverpool", ovr: 89, form: 84, goalFactor: 0.80, assistFactor: 0.75 }
];

function isSamePlayer(name1, name2) {
  if (!name1 || !name2) return false;
  const n1 = name1.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  const n2 = name2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z]/g, "");
  return n1.includes(n2) || n2.includes(n1) || (n1.includes("vinicius") && n2.includes("vinicius")) || (n1.includes("haaland") && n2.includes("haaland"));
}

export function getGoldenShoeRankings(player) {
  if (!player) return [];

  // Số bàn thắng thực tế của người chơi trong mùa giải hiện tại
  let pGoals = 0;
  if (player.seasonAccumulator && typeof player.seasonAccumulator.goals === "number") {
    pGoals = player.seasonAccumulator.goals;
  } else if (typeof player.currentSeasonGoals === "number") {
    pGoals = player.currentSeasonGoals;
  }

  const curPhase = player.currentSeasonPhase || 1;
  const hasPlayedAnyMatch = (player.seasonAccumulator && player.seasonAccumulator.matches > 0) || curPhase > 1;

  // Nếu ở đầu mùa giải và chưa đá trận nào: TẤT CẢ cầu thủ (kể cả máy) đều 0 bàn!
  if (!hasPlayedAnyMatch && curPhase === 1) {
    pGoals = 0;
  }

  let rivalBaseGoals = 0;
  if (hasPlayedAnyMatch) {
    if (curPhase === 1) rivalBaseGoals = 12;
    else if (curPhase === 2) rivalBaseGoals = 16;
    else if (curPhase === 3) rivalBaseGoals = 23;
    else rivalBaseGoals = 29;
  }

  const rivalName = player.rival?.name || "Erling Haaland";
  const rivalClub = player.rival?.club || "Man City";
  const rivalFlag = player.rival?.flag || "🇳🇴";
  const rivalGoals = hasPlayedAnyMatch ? (player.rival?.seasonGoals || rivalBaseGoals) : 0;

  // Lọc sạch toàn bộ ứng viên trùng tên với Kình Địch hoặc Người Chơi
  const filteredCandidates = WORLD_STARS_POOL.filter(c =>
    !isSamePlayer(c.name, rivalName) &&
    !isSamePlayer(c.name, player.name || '')
  );

  const list = [
    {
      name: `${player.name} (BẠN)`,
      flag: player.nationality?.flag || "⭐",
      club: (player.isAcademyStage ? player.academy?.name : player.currentClub?.name) || "CLB",
      goals: pGoals,
      points: (pGoals * 2.0).toFixed(1),
      isPlayer: true
    },
    {
      name: rivalName,
      flag: rivalFlag,
      club: rivalClub,
      goals: rivalGoals,
      points: (rivalGoals * 2.0).toFixed(1),
      isRival: true
    }
  ];

  for (let i = 0; i < 3 && i < filteredCandidates.length; i++) {
    const c = filteredCandidates[i];
    const cGoals = hasPlayedAnyMatch ? Math.max(0, Math.round(rivalBaseGoals * c.goalFactor)) : 0;
    list.push({
      name: c.name,
      flag: c.flag,
      club: c.club,
      goals: cGoals,
      points: (cGoals * 2.0).toFixed(1)
    });
  }

  list.sort((a, b) => parseFloat(b.points) - parseFloat(a.points));
  return list;
}

export function getBallonDorPowerRankings(player) {
  if (!player) return [];

  const curPhase = player.currentSeasonPhase || 1;
  const hasPlayedAnyMatch = (player.seasonAccumulator && player.seasonAccumulator.matches > 0) || curPhase > 1;

  // 1. Điểm chỉ số cá nhân cơ bản: (OVR * 0.5) + (Phong độ * 0.2)
  const ovr = Math.round(((player.attr1 || 50) + (player.attr2 || 50) + (player.attr3 || 50) + (player.attr4 || 50)) / 4);
  const playerBase = (ovr * 0.5) + ((player.form || 50) * 0.2);

  // 2. Điểm đóng góp bàn thắng/kiến tạo thực tế trong mùa
  let pSeasonG = 0, pSeasonA = 0, pSeasonCS = 0, pSeasonSaves = 0, pSeasonTackles = 0;
  if (player.seasonAccumulator) {
    pSeasonG = player.seasonAccumulator.goals || 0;
    pSeasonA = player.seasonAccumulator.assists || 0;
    pSeasonCS = player.seasonAccumulator.cs || 0;
    pSeasonSaves = player.seasonAccumulator.saves || 0;
    pSeasonTackles = player.seasonAccumulator.tackles || 0;
  }

  let playerGoalScore = 0;
  if (player.position === "GK") {
    playerGoalScore = (pSeasonCS * 3) + (pSeasonSaves * 0.2);
  } else if (player.position === "DF") {
    playerGoalScore = (pSeasonCS * 3) + (pSeasonTackles * 0.2) + (pSeasonG * 2);
  } else {
    playerGoalScore = (pSeasonG * 2) + (pSeasonA * 1);
  }

  // 3. Điểm danh hiệu Cúp (chỉ cộng ở Chặng 4 hoặc cuối mùa)
  let playerTrophyScore = 0;
  if (curPhase === 4 || player.seasonCompleted) {
    if (player.currentEuroStatus === "C1") playerTrophyScore += 50;
    else if (player.currentEuroStatus === "C2") playerTrophyScore += 25;
    if (player.leagueStanding === 1 || (!player.isAcademyStage && (player.fame || 10) > 40)) playerTrophyScore += 30;
    if (player.cupStanding === 1) playerTrophyScore += 15;
    if (player.summerTournament && player.summerTournament.wonTrophy) {
      playerTrophyScore += player.summerTournament.type === "WORLD_CUP" ? 80 : 50;
    }
  }

  const playerScore = (playerBase + playerGoalScore + playerTrophyScore).toFixed(1);

  const rivalName = player.rival?.name || "Erling Haaland";
  const rivalClub = player.rival?.club || "Man City";
  const rivalFlag = player.rival?.flag || "🇳🇴";

  // Điểm Kình địch
  const rivalOvr = 91;
  const rivalForm = 86;
  const rivalBase = (rivalOvr * 0.5) + (rivalForm * 0.2);
  let rivalGoalScore = 0;
  let rivalTrophyScore = 0;
  if (hasPlayedAnyMatch) {
    let rGoals = curPhase === 1 ? 12 : (curPhase === 2 ? 16 : (curPhase === 3 ? 23 : 29));
    let rAssists = curPhase === 1 ? 4 : (curPhase === 2 ? 6 : (curPhase === 3 ? 9 : 12));
    rivalGoalScore = (rGoals * 2) + (rAssists * 1);
    if (curPhase === 4) rivalTrophyScore = 40; // Điểm cúp danh hiệu máy
  }
  const rivalScore = (rivalBase + rivalGoalScore + rivalTrophyScore).toFixed(1);

  // Lọc sạch toàn bộ ứng viên trùng tên với Kình Địch hoặc Người Chơi
  const filteredBdor = WORLD_STARS_POOL.filter(c =>
    !isSamePlayer(c.name, rivalName) &&
    !isSamePlayer(c.name, player.name || '')
  );

  const list = [
    {
      name: `${player.name} (BẠN)`,
      flag: player.nationality?.flag || "⭐",
      club: (player.isAcademyStage ? player.academy?.name : player.currentClub?.name) || "CLB",
      score: playerScore,
      isPlayer: true
    },
    {
      name: rivalName,
      flag: rivalFlag,
      club: rivalClub,
      score: rivalScore,
      isRival: true
    }
  ];

  for (let i = 0; i < 3 && i < filteredBdor.length; i++) {
    const c = filteredBdor[i];
    const cBase = (c.ovr * 0.5) + (c.form * 0.2);
    let cGoalScore = 0;
    let cTrophyScore = 0;
    if (hasPlayedAnyMatch) {
      let cGoals = Math.round((curPhase === 1 ? 12 : (curPhase === 2 ? 16 : (curPhase === 3 ? 23 : 29))) * c.goalFactor);
      let cAssists = Math.round((curPhase === 1 ? 4 : (curPhase === 2 ? 6 : (curPhase === 3 ? 9 : 12))) * c.assistFactor);
      cGoalScore = (cGoals * 2) + (cAssists * 1);
      if (curPhase === 4) cTrophyScore = 35;
    }
    const cTotal = (cBase + cGoalScore + cTrophyScore).toFixed(1);
    list.push({
      name: c.name,
      flag: c.flag,
      club: c.club,
      score: cTotal
    });
  }

  list.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
  list.forEach((item, idx) => { item.rank = idx + 1; });
  return list;
}

/* =========================================================================
   12. MATCH EVENT TEMPLATES & ARENA EVENTS (MẪU SỰ KIỆN TƯƠNG TÁC THEO VỊ TRÍ)
   ========================================================================= */

export const MATCH_EVENT_TEMPLATES = [
  // =========================================================================
  // 1. DÀNH CHO TIỀN ĐẠO (FW/ST/Winger) & TIỀN VỆ (MF/CAM/CM/Wing)
  // =========================================================================
  {
    id: 'PENALTY_KICK',
    category: 'ATTACKING',
    name: 'Sút Phạt Đền (Penalty Kick)',
    eligiblePositions: ['FW', 'MF', 'ST', 'WINGER', 'CAM', 'CM', 'WING', 'LW', 'RW', 'CF', 'CDM', 'LM', 'RM'],
    title: '🎯 Cơ Hội Sút Phạt Đền (Penalty Kick)',
    desc: 'Đội nhà được hưởng quả phạt đền 11m sau pha phạm lỗi trong vòng cấm! Bạn bước lên chấm phạt đền với trọng trách định đoạt bàn thắng.',
    choices: [
      {
        id: 'PENALTY_POWER',
        text: '🎯 Sút găm góc hiểm quyết đoán',
        statHint: 'Dựa vào Chỉ số Dứt điểm / Bàn thắng kỳ vọng cao',
        statKey: 'attr1',
        xG: 0.85,
        baseSuccessChance: 0.84,
        successType: 'GOAL',
        failType: 'SAVE',
        successText: 'Cú sút như búa bổ găm thẳng vào góc chết khiến thủ môn chỉ biết đứng nhìn! VÀOOOO!'
      },
      {
        id: 'PENALTY_PANENKA',
        text: '🎩 Cú sút Panenka đánh lừa thủ môn',
        statHint: 'Dựa vào Kỹ thuật / Rủi ro cao nhưng tăng mạnh Danh tiếng và Rating',
        statKey: 'attr4',
        xG: 0.75,
        baseSuccessChance: 0.72,
        successType: 'GOAL',
        failType: 'MISS',
        fameBonus: +30,
        ratingBonus: +0.4,
        successText: 'ĐẲNG CẤP THƯỢNG THỪA! Cú bấm bóng Panenka lạnh lùng rót thẳng vào giữa khung thành khi thủ môn đã đổ người!'
      }
    ]
  },
  {
    id: 'FREE_KICK',
    category: 'ATTACKING',
    name: 'Đá Phạt Trực Tiếp Ngoài Vòng Cấm (Free Kick)',
    eligiblePositions: ['FW', 'MF', 'ST', 'WINGER', 'CAM', 'CM', 'WING', 'LW', 'RW', 'CF', 'CDM', 'LM', 'RM'],
    title: '⚡ Đá Phạt Trực Tiếp Ngoài Vòng Cấm (Free Kick)',
    desc: 'Điểm đá phạt cách khung thành khoảng 22m với góc sút cực kỳ thuận lợi trước hàng rào đối phương.',
    choices: [
      {
        id: 'FREE_KICK_CURL',
        text: '🎯 Cứa lòng qua hàng rào vào góc chết',
        statHint: 'Dựa vào Kỹ thuật / Sút xa',
        statKey: 'attr4',
        xG: 0.45,
        baseSuccessChance: 0.74,
        successType: 'GOAL',
        failType: 'MISS',
        successText: 'SIÊU PHẨM CẦU VỒNG! Trái bóng vẽ nên một đường cong hoàn mỹ vượt qua hàng rào găm vào góc chữ A!'
      },
      {
        id: 'FREE_KICK_CROSS',
        text: '👟 Treo bóng điểm rơi vào cột xa cho đồng đội đánh đầu',
        statHint: 'Dựa vào Chuyền bóng / Nhận Kiến tạo',
        statKey: 'attr2',
        xG: 0.50,
        baseSuccessChance: 0.80,
        successType: 'ASSIST',
        failType: 'PASS_FAIL',
        successText: 'ĐƯỜNG CHUYỀN DỌN CỖ! Pha treo bóng có độ xoáy và điểm rơi chuẩn đến từng milimet để đồng đội ập vào đánh đầu tung lưới đối phương!'
      }
    ]
  },
  {
    id: 'CORNER_KICK_ATTACK',
    category: 'ATTACKING',
    name: 'Phạt Góc (Corner Kick - Tấn công)',
    eligiblePositions: ['FW', 'MF', 'ST', 'WINGER', 'CAM', 'CM', 'WING', 'LW', 'RW', 'CF', 'CDM', 'LM', 'RM'],
    title: '🚩 Phạt Góc (Corner Kick - Tấn công)',
    desc: 'Đội nhà được hưởng quả phạt góc nguy hiểm bên hành lang cánh. Bạn lãnh trọng trách thực hiện pha bóng cố định.',
    choices: [
      {
        id: 'CORNER_INSWING',
        text: '🌀 Tạt xoáy cuộn vào cột gần tạo hỗn loạn',
        statHint: 'Cơ hội tạo kiến tạo',
        statKey: 'attr2',
        xG: 0.40,
        baseSuccessChance: 0.78,
        successType: 'ASSIST',
        failType: 'PASS_FAIL',
        successText: 'BÓNG XOÁY CẮT MẶT KHUNG THÀNH! Đồng đội băng cắt dũng mãnh đệm bóng cận thành tung lưới đối thủ!'
      },
      {
        id: 'CORNER_SHORT',
        text: '🤝 Phối hợp phạt góc ngắn kéo giãn hàng thủ đối phương',
        statHint: 'Phối hợp phạt góc ngắn kéo giãn hàng thủ đối phương',
        statKey: 'attr2',
        xG: 0.35,
        baseSuccessChance: 0.85,
        successType: 'ASSIST',
        failType: 'PASS_FAIL',
        successText: 'PHỐI HỢP CHIẾN THUẬT BẬC THẦY! Pha đập nhả 1-2 xé toang hàng thủ lùi sâu, mở toang góc sút thuận lợi ghi bàn!'
      }
    ]
  },
  {
    id: 'DRIBBLING_TAKEOVER',
    category: 'ATTACKING',
    name: 'Đột Phá 1v1 Nách Trung Lộ (Take-on)',
    eligiblePositions: ['FW', 'MF', 'ST', 'WINGER', 'CAM', 'CM', 'WING', 'LW', 'RW', 'CF', 'LM', 'RM'],
    title: '🪄 Đột Phá 1v1 Nách Trung Lộ (Take-on)',
    desc: 'Bạn nhận bóng ở rìa vòng cấm địa đối phương trong tư thế 1 đối 1 với hậu vệ cuối cùng!',
    choices: [
      {
        id: 'DRIBBLE_SKILL_MOVE',
        text: '🪄 Vung chân biểu diễn kỹ thuật vượt qua hậu vệ',
        statHint: 'Dựa vào Kỹ Thuật (Skill Moves) & Rê bóng',
        statKey: 'attr4',
        xG: 0.65,
        baseSuccessChance: 0.70,
        successType: 'GOAL',
        failType: 'TACKLE',
        cardRisk: 0.08,
        fameBonus: 25,
        ratingBonus: 0.5,
        successText: 'QUA NGƯỜI ĐIỆU NGHỆ! Kỹ thuật cá nhân siêu việt giúp bạn vượt qua sự truy cản của hậu vệ rồi sút bóng tung nóc lưới đối phương!'
      },
      {
        id: 'DRIBBLE_PASS_COMBINE',
        text: '🎯 Đập nhả một chạm với đồng đội rồi thoát xuống',
        statHint: 'Dựa vào Chuyền bóng & Nhãn quan',
        statKey: 'attr2',
        xG: 0.50,
        baseSuccessChance: 0.80,
        successType: 'ASSIST',
        failType: 'PASS_FAIL',
        successText: 'PHA PHỐI HỢP MẪU MỰC! Đập nhả xé toang khối phòng ngự đối phương tạo cơ hội mười mươi ghi bàn!'
      }
    ]
  },
  {
    id: 'WEAK_FOOT_FINISH',
    category: 'ATTACKING',
    name: 'Dứt Điểm Góc Bất Lợi Chân Nghịch (Weak Foot)',
    eligiblePositions: ['FW', 'MF', 'ST', 'WINGER', 'CAM', 'CM', 'WING', 'LW', 'RW', 'CF', 'LM', 'RM'],
    title: '👟 Cơ Hội Dứt Điểm Góc Bất Lợi (Chân Nghịch)',
    desc: 'Bóng bật ra sang phía chân không thuận! Góc sút hẹp đòi hỏi khả năng xử lý bằng chân nghịch hoặc kỹ thuật tinh quái.',
    choices: [
      {
        id: 'WEAK_FOOT_SHOT',
        text: '👟 Vung chân dứt điểm ngay bằng chân không thuận',
        statHint: 'Tác động trực tiếp bởi Chỉ số Chân Nghịch (Weak Foot)',
        statKey: 'attr1',
        isWeakFoot: true,
        xG: 0.60,
        baseSuccessChance: 0.75,
        successType: 'GOAL',
        failType: 'MISS',
        fameBonus: 20,
        ratingBonus: 0.4,
        successText: 'CÚ RA CHÂN BẤT NGỜ! Cú sút bằng chân không thuận cực kỳ hiểm hóc găm thẳng vào góc lưới đối phương!'
      },
      {
        id: 'WEAK_FOOT_OUTSIDE_CURL',
        text: '🪄 Vẩy má ngoài chân thuận (Trivela) vào góc xa',
        statHint: 'Yêu cầu Kỹ thuật xử lý má ngoài điệu nghệ',
        statKey: 'attr4',
        xG: 0.55,
        baseSuccessChance: 0.72,
        successType: 'GOAL',
        failType: 'MISS',
        fameBonus: 30,
        ratingBonus: 0.5,
        successText: 'SIÊU PHẨM TRIVELA! Một cú vẩy má ngoài ảo diệu đưa bóng cuộn vào góc xa trong sự ngỡ ngàng của thủ môn!'
      }
    ]
  },

  // =========================================================================
  // 2. DÀNH CHO HẬU VỆ (DF/CB/LB/RB)
  // =========================================================================
  {
    id: 'DEFENSIVE_CORNER',
    category: 'DEFENSIVE',
    name: 'Phạt Góc (Phòng ngự & Không chiến)',
    eligiblePositions: ['DF', 'CB', 'LB', 'RB'],
    title: '🛡️ Phạt Góc (Phòng ngự & Không chiến)',
    desc: 'Đối phương dàn xếp đá phạt góc tầm cao nhắm thẳng vào điểm mù trước cầu môn! Bạn phải chỉ huy và trực tiếp tranh chấp bóng bổng.',
    choices: [
      {
        id: 'CORNER_HEADER_CLEAR',
        text: '✈️ Bật cao đánh đầu phá bóng dứt khoát giải nguy',
        statHint: 'Dựa vào Phòng ngự / Thể lực, tăng Rating và Điểm can thiệp',
        statKey: 'attr1',
        xG: 0.45,
        baseSuccessChance: 0.82,
        successType: 'TACKLE',
        failType: 'OPP_GOAL',
        ratingBonus: +0.3,
        successText: 'KHÔNG CHIẾN DŨNG MÃNH! Bạn bật cao hơn tất cả, đội đầu dứt khoát đưa trái bóng bay xa khỏi vùng cấm địa giải nguy!'
      },
      {
        id: 'CORNER_FARPOST_COVER',
        text: '🧱 Bọc lót cột hai ngăn đối thủ đệm bóng cận thành',
        statHint: 'Bọc lót cột hai ngăn đối thủ đệm bóng cận thành',
        statKey: 'attr2',
        xG: 0.40,
        baseSuccessChance: 0.85,
        successType: 'TACKLE',
        failType: 'OPP_GOAL',
        ratingBonus: +0.25,
        successText: 'CAN THIỆP XUẤT THẦN TRÊN VẠCH VÔI! Bọc lót cột hai cực kỳ tỉnh táo, phá bóng ngay trước mũi giày tiền đạo đối phương!'
      }
    ]
  },
  {
    id: 'TACTICAL_FOUL',
    category: 'DEFENSIVE',
    name: 'Tranh Chấp Nguy Hiểm & Nguy Cơ Nhận Thẻ Vàng (Tactical Foul)',
    eligiblePositions: ['DF', 'CB', 'LB', 'RB'],
    title: '⚠️ Tranh Chấp Nguy Hiểm & Nguy Cơ Nhận Thẻ Vàng (Tactical Foul)',
    desc: 'Đối phương tổ chức phản công thần tốc 2 đánh 1! Bạn là chốt chặn phòng ngự cuối cùng trước vòng cấm địa.',
    choices: [
      {
        id: 'TACTICAL_SLIDE',
        text: '⚔️ Xoạc bóng quyết liệt chặn đợt phản công nhanh',
        statHint: 'Tỷ lệ 70% cản phá thành công nhưng 30% dính thẻ vàng',
        statKey: 'attr1',
        xG: 0.50,
        baseSuccessChance: 0.70,
        cardRisk: 0.30,
        successType: 'TACKLE',
        failType: 'PASS_FAIL',
        successText: 'PHA XOẠC BÓNG QUẢ CẢM! Cú chuồi bóng chuẩn xác bẻ gãy đợt phản công thần tốc, cứu đội nhà một bàn thua trông thấy!'
      },
      {
        id: 'TACTICAL_CONTAIN',
        text: '🚶 Kèm người thụ động, giữ cự ly an toàn tránh phạm lỗi',
        statHint: 'Kèm người thụ động, giữ cự ly an toàn tránh phạm lỗi',
        statKey: 'attr3',
        xG: 0.40,
        baseSuccessChance: 0.75,
        cardRisk: 0.0,
        successType: 'TACKLE',
        failType: 'OPP_GOAL',
        successText: 'PHÒNG NGỰ KHÔN NGOAN! Giữ cự ly và be góc sút chuẩn xác, ép đối phương phải đẩy bóng ra biên và sút bóng thiếu chính xác.'
      }
    ]
  },

  // =========================================================================
  // 3. DÀNH CHO THỦ MÔN (GK)
  // =========================================================================
  {
    id: 'PENALTY_SAVE',
    category: 'GOALKEEPING',
    name: 'Đối Mặt Quả Phạt Đền (Penalty Save)',
    eligiblePositions: ['GK'],
    title: '🧤 Đối Mặt Quả Phạt Đền (Penalty Save)',
    desc: 'Trọng tài thổi phạt đền 11m! Toàn bộ áp lực và hy vọng của đội bóng đang dồn lên đôi găng của bạn.',
    choices: [
      {
        id: 'PENALTY_READ_DIVE',
        text: '🦅 Đổ người bắt bài góc sút sở trường của tiền đạo',
        statHint: 'Tăng mạnh điểm Cứu thua, Rating nhảy vọt nếu cản phá',
        statKey: 'attr1',
        xG: 0.79,
        baseSuccessChance: 0.65,
        successType: 'SAVE',
        failType: 'OPP_GOAL',
        ratingBonus: +0.8,
        successText: 'CỨU THUA XUẤT THẦN TRÊN CHẤM 11M! Đọc vị hướng sút và bay người hết cỡ đẩy bóng vọt xà trong tiếng hò reo vang dội!'
      },
      {
        id: 'PENALTY_PSYCH_PRESSURE',
        text: '🗿 Đứng vững tâm lý ép đối thủ tự sút hỏng ra ngoài',
        statHint: 'Đứng vững tâm lý ép đối thủ tự sút hỏng ra ngoài',
        statKey: 'attr2',
        xG: 0.79,
        baseSuccessChance: 0.60,
        successType: 'SAVE',
        failType: 'OPP_GOAL',
        ratingBonus: +0.6,
        successText: 'CHIẾN THUẬT TÂM LÝ ĐỈNH CAO! Sự điềm tĩnh vững như bàn thạch khiến tiền đạo đối phương run rẩy sút bóng chệch cột dọc!'
      }
    ]
  }
];

export const ARENA_EVENTS = MATCH_EVENT_TEMPLATES;

/**
 * Lọc danh sách mẫu sự kiện tương tác trận đấu theo vị trí người chơi
 * @param {string} positionOrGroup (Ví dụ: 'FW', 'ST', 'MF', 'DF', 'GK')
 * @returns {Array} Danh sách các mẫu sự kiện phù hợp
 */
export function getEligibleMatchEventTemplates(positionOrGroup) {
  if (!positionOrGroup) return MATCH_EVENT_TEMPLATES;
  const p = String(positionOrGroup).toUpperCase();
  const group = getPositionGroup(p);
  return MATCH_EVENT_TEMPLATES.filter(t =>
    t.eligiblePositions.includes(p) ||
    t.eligiblePositions.includes(group)
  );
}



