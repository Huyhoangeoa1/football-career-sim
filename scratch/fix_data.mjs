import fs from 'fs';

let content = fs.readFileSync('./js/data.js', 'utf8');

const targetStart = '  MF: {\n    name: "Tiền Vệ (MF)"';
const targetEnd = '/* =========================================================================\n   6. COMPREHENSIVE LEAGUES DATABASE';

const idxStart = content.indexOf(targetStart);
const idxEnd = content.indexOf(targetEnd);

if (idxStart === -1 || idxEnd === -1) {
  console.error("Could not find start or end marker", { idxStart, idxEnd });
  process.exit(1);
}

const middle = `  MF: {
    name: "Tiền Vệ (MF)",
    icon: "🎯",
    desc: "Nhạc trưởng kiến thiết, điều tiết lối chơi và kiểm soát tuyến giữa",
    attributes: [
      { key: "attr1", name: "Chuyền Bóng (Passing)", icon: "🎯" },
      { key: "attr2", name: "Nhãn Quan (Vision)", icon: "👁️" },
      { key: "attr3", name: "Kiểm Soát Bóng (Control)", icon: "⚽" },
      { key: "attr4", name: "Thể Lực / Tranh Chấp (Stamina)", icon: "💪" }
    ],
    stat1Label: "Bàn Thắng (Goals)",
    stat2Label: "Kiến Tạo / Chuyền Quyết Định"
  },
  DF: {
    name: "Hậu Vệ (DF)",
    icon: "🛡️",
    desc: "Hòn đá tảng phòng ngự, tắc bóng chính xác và không chiến dũng mãnh",
    attributes: [
      { key: "attr1", name: "Tắc Bóng (Tackling)", icon: "🛡️" },
      { key: "attr2", name: "Sức Mạnh (Strength)", icon: "💪" },
      { key: "attr3", name: "Không Chiến (Aerial/Heading)", icon: "🦘" },
      { key: "attr4", name: "Đọc Tình Huống (Interceptions)", icon: "🧠" }
    ],
    stat1Label: "Tắc Bóng & Cắt Bóng",
    stat2Label: "Trận Sạch Lưới (Clean Sheets)"
  }
};

/* =========================================================================
   5. YOUTH ACADEMIES DATABASE
   ========================================================================= */
export const YOUTH_ACADEMIES = [
  {
    id: "la_masia",
    name: "La Masia (FC Barcelona Youth)",
    parentClubId: "barca",
    country: "Tây Ban Nha",
    flag: "🇪🇸",
    icon: "🔵🔴",
    desc: "Cái nôi sản sinh ra Messi, Xavi, Iniesta, Casillas, Lamine Yamal"
  },
  {
    id: "castilla",
    name: "La Fabrica (Real Madrid Youth)",
    parentClubId: "real_madrid",
    country: "Tây Ban Nha",
    flag: "🇪🇸",
    icon: "👑",
    desc: "Lò đào tạo hoàng gia đẳng cấp hàng đầu châu Âu (Raul, Casillas, Carvajal)"
  },
  {
    id: "carrington",
    name: "Carrington Academy (Man Utd Youth)",
    parentClubId: "man_utd",
    country: "Anh",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    icon: "👹",
    desc: "Nơi trui rèn thế hệ vàng Class of '92, Beckham, Scholes, Rashford"
  },
  {
    id: "cobham",
    name: "Cobham Training Centre (Chelsea Youth)",
    parentClubId: "chelsea",
    country: "Anh",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    icon: "🔵",
    desc: "Học viện trẻ giàu thành tích nhất bóng đá Anh (Terry, James, Mount)"
  },
  {
    id: "clairefontaine",
    name: "INF Clairefontaine / PSG Youth",
    parentClubId: "psg",
    country: "Pháp",
    flag: "🇫🇷",
    icon: "🇫🇷",
    desc: "Thánh địa đào tạo tài năng trẻ nước Pháp (Mbappe, Henry, Maignan)"
  },
  {
    id: "ajax_academy",
    name: "De Toekomst (Ajax Amsterdam Youth)",
    parentClubId: "ajax",
    country: "Hà Lan",
    flag: "🇳🇱",
    icon: "⚪🔴",
    desc: "Lò đào tạo trứ danh với triết lý bóng đá tổng lực (Van der Sar, Cruyff)"
  },
  {
    id: "bayern_junior",
    idAlias: "bayern_campus",
    name: "FC Bayern Campus",
    parentClubId: "bayern",
    country: "Đức",
    flag: "🇩🇪",
    icon: "🔴",
    desc: "Lò đào tạo thủ môn & cầu thủ kỷ luật thép nước Đức (Neuer, Muller, Musiala)"
  },
  {
    id: "benfica_campus",
    name: "Benfica Campus (Seixal)",
    parentClubId: "benfica",
    country: "Bồ Đào Nha",
    flag: "🇵🇹",
    icon: "🦅",
    desc: "Học viện đào tạo & xuất khẩu siêu sao số một thế giới (Oblak, Dias, Felix)"
  },
  {
    id: "sporting_acad",
    name: "Sporting CP Academy",
    parentClubId: "sporting",
    country: "Bồ Đào Nha",
    flag: "🇵🇹",
    icon: "🟢⚪",
    desc: "Lò đào tạo danh tiếng sản sinh ra Cristiano Ronaldo, Figo, Bruno Fernandes"
  },
  {
    id: "pvf_academy",
    name: "Học Viện Trẻ PVF Football Academy",
    parentClubId: "sporting",
    country: "Việt Nam",
    flag: "🇻🇳",
    icon: "🇻🇳",
    desc: "Trung tâm đào tạo bóng đá trẻ hiện đại số một Việt Nam"
  }
];

export const YOUTH_LEAGUE_CLUBS = [
  { id: "la_masia", idAlias: "barca", name: "FC Barcelona La Masia", code: "MAS", icon: "🔵🔴", power: 78, attPower: 82, defPower: 74, midPower: 80, stadium: "Ciutat Esportiva Joan Gamper" },
  { id: "castilla", idAlias: "real_madrid", name: "Real Madrid Castilla", code: "CAS", icon: "👑", power: 78, attPower: 80, defPower: 75, midPower: 79, stadium: "Estadio Alfredo Di Stéfano" },
  { id: "carrington", idAlias: "man_utd", name: "Man United Carrington", code: "CAR", icon: "👹", power: 75, attPower: 78, defPower: 73, midPower: 76, stadium: "Carrington Training Ground" },
  { id: "cobham", idAlias: "chelsea", name: "Chelsea Cobham Academy", code: "COB", icon: "🔵", power: 76, attPower: 78, defPower: 74, midPower: 76, stadium: "Cobham Training Centre" },
  { id: "ajax_academy", idAlias: "de_toekomst", name: "Ajax De Toekomst", code: "AJX", icon: "⚪🔴", power: 76, attPower: 79, defPower: 73, midPower: 77, stadium: "Sportpark De Toekomst" },
  { id: "bayern_junior", idAlias: "bayern_campus", name: "FC Bayern Campus", code: "BAY", icon: "🔴", power: 77, attPower: 80, defPower: 75, midPower: 77, stadium: "FC Bayern Campus" },
  { id: "benfica_campus", idAlias: "benfica_seixal", name: "Benfica Seixal Campus", code: "SLB", icon: "🦅", power: 75, attPower: 77, defPower: 74, midPower: 75, stadium: "Benfica Campus" },
  { id: "sporting_acad", idAlias: "sporting", name: "Sporting CP Academy", code: "SCP", icon: "🟢⚪", power: 75, attPower: 77, defPower: 73, midPower: 76, stadium: "Academia Cristiano Ronaldo" },
  { id: "clairefontaine", idAlias: "psg", name: "INF Clairefontaine", code: "CLA", icon: "🇫🇷", power: 76, attPower: 78, defPower: 74, midPower: 76, stadium: "Centre Technique National" },
  { id: "pvf_academy", idAlias: "pvf_youth", name: "PVF Football Academy", code: "PVF", icon: "🇻🇳", power: 72, attPower: 74, defPower: 71, midPower: 73, stadium: "Trung Tâm Đào Tạo PVF" }
];

`;

content = content.slice(0, idxStart) + middle + content.slice(idxEnd);

// Now update REAL_RIVAL_SCORERS.YOUTH_LEAGUE
const youthScorersReplacement = `  YOUTH_LEAGUE: [
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
    // INF Clairefontaine
    { name: "Eli Junior Kroupi", clubId: "clairefontaine", clubName: "INF Clairefontaine", clubCode: "CLA", clubIcon: "🇫🇷", rating: 76, avgGPR: 0.68 },
    { name: "Mathis Lambourde", clubId: "clairefontaine", clubName: "INF Clairefontaine", clubCode: "CLA", clubIcon: "🇫🇷", rating: 74, avgGPR: 0.58 },
    // PVF Football Academy
    { name: "Nguyễn Lê Phát", clubId: "pvf_academy", clubName: "PVF Football Academy", clubCode: "PVF", clubIcon: "🇻🇳", rating: 74, avgGPR: 0.60 },
    { name: "Phùng Quang Tú", clubId: "pvf_academy", clubName: "PVF Football Academy", clubCode: "PVF", clubIcon: "🇻🇳", rating: 73, avgGPR: 0.55 }
  ],`;

const youthPoolRegex = /  YOUTH_LEAGUE: \[[\s\S]*?\],/;
if (!youthPoolRegex.test(content)) {
  console.error("Could not find YOUTH_LEAGUE in REAL_RIVAL_SCORERS");
  process.exit(1);
}
content = content.replace(youthPoolRegex, youthScorersReplacement);

fs.writeFileSync('./js/data.js', content, 'utf8');
console.log("Successfully updated data.js!");
