/* =========================================================================
   FOOTBALL CAREER SIMULATOR — CARD AVATARS REPOSITORY
   Ngân hàng 10 Render Avatar Cầu Thủ SVG sắc nét cắt nền trong suốt (PNG/SVG)
   ========================================================================= */

export const CARD_AVATARS = [
  {
    id: "avatar_fade",
    name: "Tóc Fade Hiện Đại",
    style: "Tiền Đạo Tốc Độ",
    desc: "Phong cách Mbappe / Bellingham với kiểu tóc buzz-cut fade sắc sảo, ánh mắt tập trung cao độ.",
    svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="fc-avatar-svg">
      <defs>
        <linearGradient id="skin_fade" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#b27d53"/>
          <stop offset="100%" stop-color="#8a532b"/>
        </linearGradient>
        <linearGradient id="jersey_fade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#dc2626"/>
          <stop offset="50%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#b91c1c"/>
        </linearGradient>
        <linearGradient id="hair_fade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#1e1814"/>
          <stop offset="100%" stop-color="#0f0c0a"/>
        </linearGradient>
        <filter id="glow_fade" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <!-- Body & Jersey -->
      <g filter="url(#glow_fade)">
        <!-- Shoulders / Jersey -->
        <path d="M 28 240 C 28 185, 62 165, 100 165 C 138 165, 172 185, 172 240 Z" fill="url(#jersey_fade)"/>
        <!-- Jersey Collar & Accents -->
        <path d="M 75 167 Q 100 195 125 167 Q 112 165 100 165 Q 88 165 75 167 Z" fill="#ffffff" opacity="0.9"/>
        <path d="M 85 167 Q 100 188 115 167" stroke="#fbbf24" stroke-width="2.5" fill="none"/>
        <path d="M 28 220 L 45 240 M 172 220 L 155 240" stroke="#fbbf24" stroke-width="3" opacity="0.8"/>
        <!-- Neck -->
        <path d="M 82 142 L 82 172 Q 100 184 118 172 L 118 142 Z" fill="#996035"/>
        <!-- Head -->
        <ellipse cx="100" cy="112" rx="36" ry="44" fill="url(#skin_fade)"/>
        <!-- Ears -->
        <ellipse cx="63" cy="116" rx="6" ry="11" fill="#996035"/>
        <ellipse cx="137" cy="116" rx="6" ry="11" fill="#996035"/>
        <!-- Jaw & Chin Contour -->
        <path d="M 70 120 Q 100 162 130 120" stroke="#7a4620" stroke-width="1.5" fill="none" opacity="0.4"/>
        <!-- Eyes & Brows -->
        <path d="M 78 98 Q 89 95 96 98" stroke="#1c1917" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M 104 98 Q 111 95 122 98" stroke="#1c1917" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <ellipse cx="87" cy="107" rx="4" ry="2.5" fill="#1c1917"/>
        <ellipse cx="113" cy="107" rx="4" ry="2.5" fill="#1c1917"/>
        <circle cx="88.5" cy="106" r="1" fill="#ffffff"/>
        <circle cx="114.5" cy="106" r="1" fill="#ffffff"/>
        <!-- Nose -->
        <path d="M 100 106 L 98 122 Q 100 124 103 122 Z" fill="#7a4620"/>
        <!-- Mouth -->
        <path d="M 88 134 Q 100 140 112 134" stroke="#4a250d" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Hair: Modern Fade -->
        <path d="M 64 105 C 64 70, 75 62, 100 62 C 125 62, 136 70, 136 105 C 136 94, 131 82, 126 77 C 118 70, 82 70, 74 77 C 69 82, 64 94, 64 105 Z" fill="url(#hair_fade)"/>
        <path d="M 66 102 C 67 80, 80 66, 100 66 C 120 66, 133 80, 134 102 C 131 92, 120 86, 100 86 C 80 86, 69 92, 66 102 Z" fill="#110e0c"/>
      </g>
    </svg>`
  },
  {
    id: "avatar_afro",
    name: "Tóc Xù Nam Mỹ",
    style: "Nghệ Sĩ Samba",
    desc: "Phong cách Vinicius Jr / Ronaldinho với mái tóc xù bồng bềnh, thần thái tươi vui nghệ sĩ.",
    svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="fc-avatar-svg">
      <defs>
        <linearGradient id="skin_afro" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#935f37"/>
          <stop offset="100%" stop-color="#6f401f"/>
        </linearGradient>
        <linearGradient id="jersey_afro" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#eab308"/>
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
        <filter id="glow_afro">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <g filter="url(#glow_afro)">
        <path d="M 28 240 C 28 185, 62 165, 100 165 C 138 165, 172 185, 172 240 Z" fill="url(#jersey_afro)"/>
        <path d="M 75 167 Q 100 195 125 167 Q 100 168 75 167 Z" fill="#15803d"/>
        <!-- Neck -->
        <path d="M 83 144 L 83 172 Q 100 182 117 172 L 117 144 Z" fill="#7a4620"/>
        <!-- Head -->
        <ellipse cx="100" cy="114" rx="35" ry="42" fill="url(#skin_afro)"/>
        <ellipse cx="64" cy="116" rx="5.5" ry="10" fill="#7a4620"/>
        <ellipse cx="136" cy="116" rx="5.5" ry="10" fill="#7a4620"/>
        <!-- Eyes & Brows -->
        <path d="M 78 101 Q 88 97 96 100" stroke="#17120e" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 104 100 Q 112 97 122 101" stroke="#17120e" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="87" cy="109" r="3.5" fill="#17120e"/>
        <circle cx="113" cy="109" r="3.5" fill="#17120e"/>
        <circle cx="88" cy="108" r="1.2" fill="#ffffff"/>
        <circle cx="114" cy="108" r="1.2" fill="#ffffff"/>
        <!-- Broad Nose -->
        <path d="M 96 112 L 94 124 Q 100 127 106 124 L 104 112" fill="#673919"/>
        <!-- Big Smile -->
        <path d="M 85 133 Q 100 147 115 133 Z" fill="#ffffff"/>
        <path d="M 85 133 Q 100 147 115 133" stroke="#451e08" stroke-width="2" fill="none"/>
        <!-- Afro Hair Volume -->
        <path d="M 50 105 C 40 70, 55 42, 100 40 C 145 42, 160 70, 150 105 C 145 125, 138 120, 136 105 C 136 78, 122 64, 100 64 C 78 64, 64 78, 64 105 C 62 120, 55 125, 50 105 Z" fill="#1c1611"/>
        <circle cx="58" cy="80" r="16" fill="#1c1611"/>
        <circle cx="80" cy="55" r="18" fill="#241d17"/>
        <circle cx="100" cy="48" r="20" fill="#18130e"/>
        <circle cx="122" cy="54" r="18" fill="#241d17"/>
        <circle cx="142" cy="78" r="16" fill="#1c1611"/>
      </g>
    </svg>`
  },
  {
    id: "avatar_manbun",
    name: "Chiến Binh Man-Bun",
    style: "Tiền Đạo Viking",
    desc: "Phong cách Erling Haaland / Zlatan với mái tóc cột búi cao kiêu hãnh, khuôn mặt góc cạnh.",
    svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="fc-avatar-svg">
      <defs>
        <linearGradient id="skin_viking" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fed7aa"/>
          <stop offset="100%" stop-color="#fba063"/>
        </linearGradient>
        <linearGradient id="hair_blond" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
        <linearGradient id="jersey_sky" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="50%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0369a1"/>
        </linearGradient>
        <filter id="glow_viking">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <g filter="url(#glow_viking)">
        <path d="M 28 240 C 28 185, 62 165, 100 165 C 138 165, 172 185, 172 240 Z" fill="url(#jersey_sky)"/>
        <path d="M 76 167 Q 100 192 124 167" stroke="#ffffff" stroke-width="4" fill="none"/>
        <!-- Man Bun on Top -->
        <circle cx="100" cy="42" r="14" fill="url(#hair_blond)"/>
        <ellipse cx="100" cy="52" rx="6" ry="3" fill="#854d0e"/>
        <!-- Neck -->
        <path d="M 81 140 L 81 170 Q 100 182 119 170 L 119 140 Z" fill="#ea8d4f"/>
        <!-- Sharp Head / Jaw -->
        <path d="M 66 100 C 66 75, 78 60, 100 60 C 122 60, 134 75, 134 100 C 134 125, 126 142, 100 154 C 74 142, 66 125, 66 100 Z" fill="url(#skin_viking)"/>
        <ellipse cx="63" cy="112" rx="5" ry="9" fill="#ea8d4f"/>
        <ellipse cx="137" cy="112" rx="5" ry="9" fill="#ea8d4f"/>
        <!-- Brows & Nordic Eyes -->
        <path d="M 76 96 L 94 94" stroke="#a16207" stroke-width="3" stroke-linecap="round"/>
        <path d="M 106 94 L 124 96" stroke="#a16207" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="85" cy="103" rx="3.5" ry="2.2" fill="#0284c7"/>
        <ellipse cx="115" cy="103" rx="3.5" ry="2.2" fill="#0284c7"/>
        <circle cx="85" cy="103" r="1.5" fill="#0f172a"/>
        <circle cx="115" cy="103" r="1.5" fill="#0f172a"/>
        <!-- Nose -->
        <path d="M 100 97 L 97 118 L 103 118 Z" fill="#e07e3a"/>
        <!-- Firm Mouth -->
        <path d="M 88 132 L 112 132" stroke="#9a3412" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Pulled Back Hair -->
        <path d="M 66 94 C 68 70, 80 58, 100 56 C 120 58, 132 70, 134 94 C 126 78, 116 68, 100 68 C 84 68, 74 78, 66 94 Z" fill="url(#hair_blond)"/>
      </g>
    </svg>`
  },
  {
    id: "avatar_quiff",
    name: "Lãng Tử Bắc Âu",
    style: "Nhạc Trưởng Kiến Tạo",
    desc: "Phong cách De Bruyne / Odegaard với kiểu tóc quiff chải bồng, đôi mắt thông tuệ và đĩnh đạc.",
    svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="fc-avatar-svg">
      <defs>
        <linearGradient id="skin_quiff" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fed7aa"/>
          <stop offset="100%" stop-color="#fca5a5"/>
        </linearGradient>
        <linearGradient id="hair_quiff" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="60%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
        <linearGradient id="jersey_navy" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="50%" stop-color="#312e81"/>
          <stop offset="100%" stop-color="#1e1b4b"/>
        </linearGradient>
        <filter id="glow_quiff">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <g filter="url(#glow_quiff)">
        <path d="M 28 240 C 28 185, 62 165, 100 165 C 138 165, 172 185, 172 240 Z" fill="url(#jersey_navy)"/>
        <path d="M 80 166 L 100 190 L 120 166" fill="#fbbf24"/>
        <path d="M 82 142 L 82 170 Q 100 182 118 170 L 118 142 Z" fill="#f87171"/>
        <ellipse cx="100" cy="114" rx="34" ry="42" fill="url(#skin_quiff)"/>
        <ellipse cx="64" cy="116" rx="5" ry="9" fill="#f87171"/>
        <ellipse cx="136" cy="116" rx="5" ry="9" fill="#f87171"/>
        <!-- Eyes & Brows -->
        <path d="M 77 98 Q 87 95 95 97" stroke="#b45309" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <path d="M 105 97 Q 113 95 123 98" stroke="#b45309" stroke-width="2.8" stroke-linecap="round" fill="none"/>
        <ellipse cx="86" cy="106" rx="3.5" ry="2.2" fill="#0284c7"/>
        <ellipse cx="114" cy="106" rx="3.5" ry="2.2" fill="#0284c7"/>
        <circle cx="86" cy="106" r="1.2" fill="#0f172a"/>
        <circle cx="114" cy="106" r="1.2" fill="#0f172a"/>
        <path d="M 100 102 L 98 120 Q 100 122 103 120 Z" fill="#ef4444" opacity="0.6"/>
        <path d="M 89 133 Q 100 137 111 133" stroke="#b91c1c" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <!-- Big Quiff Hair Swept Up Right -->
        <path d="M 64 96 C 62 65, 78 44, 115 42 C 135 40, 145 52, 138 75 C 132 85, 126 80, 125 72 C 118 56, 85 58, 72 78 C 67 85, 65 92, 64 96 Z" fill="url(#hair_quiff)"/>
        <path d="M 74 72 Q 105 48 135 52" stroke="#fef08a" stroke-width="3" fill="none" opacity="0.8"/>
      </g>
    </svg>`
  },
  {
    id: "avatar_asian",
    name: "Soái Ca Châu Á",
    style: "Đôi Cánh Tốc Độ",
    desc: "Phong cách Son Heung-min / Mitoma với mái tóc rẽ ngôi thanh lịch, đôi mắt sắc sảo và nụ cười rạng rỡ.",
    svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="fc-avatar-svg">
      <defs>
        <linearGradient id="skin_asian" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffedd5"/>
          <stop offset="100%" stop-color="#fed7aa"/>
        </linearGradient>
        <linearGradient id="hair_black" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#262626"/>
          <stop offset="100%" stop-color="#0a0a0a"/>
        </linearGradient>
        <linearGradient id="jersey_white" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="50%" stop-color="#ffffff"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
        <filter id="glow_asian">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <g filter="url(#glow_asian)">
        <path d="M 28 240 C 28 185, 62 165, 100 165 C 138 165, 172 185, 172 240 Z" fill="url(#jersey_white)"/>
        <path d="M 75 167 Q 100 196 125 167" fill="#1e293b"/>
        <path d="M 82 142 L 82 170 Q 100 180 118 170 L 118 142 Z" fill="#fdba74"/>
        <ellipse cx="100" cy="113" rx="33" ry="42" fill="url(#skin_asian)"/>
        <ellipse cx="65" cy="115" rx="5" ry="9" fill="#fdba74"/>
        <ellipse cx="135" cy="115" rx="5" ry="9" fill="#fdba74"/>
        <!-- Eyes & Brows: Sharp Almond Shape -->
        <path d="M 76 98 Q 88 95 96 97" stroke="#0a0a0a" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 104 97 Q 112 95 124 98" stroke="#0a0a0a" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 79 106 Q 88 103 95 106" stroke="#171717" stroke-width="2.5" fill="none"/>
        <circle cx="87" cy="106" r="2.5" fill="#171717"/>
        <path d="M 105 106 Q 112 103 121 106" stroke="#171717" stroke-width="2.5" fill="none"/>
        <circle cx="113" cy="106" r="2.5" fill="#171717"/>
        <path d="M 100 105 L 98 120 L 102 120 Z" fill="#fb923c" opacity="0.6"/>
        <!-- Charming Smile -->
        <path d="M 87 132 Q 100 142 113 132" stroke="#ea580c" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Asian Mid-Parting Hair Style -->
        <path d="M 64 100 C 64 66, 75 54, 96 54 C 98 62, 102 62, 104 54 C 125 54, 136 66, 136 100 C 130 84, 120 74, 106 74 C 104 74, 100 68, 98 74 C 84 74, 72 84, 64 100 Z" fill="url(#hair_black)"/>
        <path d="M 72 82 Q 88 74 98 80 M 128 82 Q 112 74 102 80" stroke="#404040" stroke-width="2" fill="none"/>
      </g>
    </svg>`
  },
  {
    id: "avatar_latin",
    name: "Sát Thủ Nam Mỹ",
    style: "Huyền Thoại Trực Diện",
    desc: "Phong cách Leo Messi / Julian Alvarez với bộ râu quai nón lịch lãm, ánh mắt kiên định của nhà vô địch.",
    svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="fc-avatar-svg">
      <defs>
        <linearGradient id="skin_latin" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fed7aa"/>
          <stop offset="100%" stop-color="#ea580c"/>
        </linearGradient>
        <linearGradient id="hair_brown" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#451a03"/>
          <stop offset="100%" stop-color="#1c1917"/>
        </linearGradient>
        <linearGradient id="jersey_albi" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#7dd3fc"/>
          <stop offset="35%" stop-color="#ffffff"/>
          <stop offset="65%" stop-color="#7dd3fc"/>
          <stop offset="100%" stop-color="#ffffff"/>
        </linearGradient>
        <filter id="glow_latin">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <g filter="url(#glow_latin)">
        <path d="M 28 240 C 28 185, 62 165, 100 165 C 138 165, 172 185, 172 240 Z" fill="url(#jersey_albi)"/>
        <path d="M 75 167 Q 100 192 125 167" stroke="#1e3a8a" stroke-width="3" fill="none"/>
        <path d="M 82 142 L 82 170 Q 100 180 118 170 L 118 142 Z" fill="#c2410c"/>
        <ellipse cx="100" cy="113" rx="34" ry="42" fill="url(#skin_latin)"/>
        <ellipse cx="64" cy="115" rx="5" ry="9" fill="#c2410c"/>
        <ellipse cx="136" cy="115" rx="5" ry="9" fill="#c2410c"/>
        <!-- Eyes & Brows -->
        <path d="M 77 97 Q 88 94 96 97" stroke="#292524" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <path d="M 104 97 Q 112 94 123 97" stroke="#292524" stroke-width="3.5" stroke-linecap="round" fill="none"/>
        <ellipse cx="86" cy="105" rx="3.5" ry="2.2" fill="#451a03"/>
        <ellipse cx="114" cy="105" rx="3.5" ry="2.2" fill="#451a03"/>
        <circle cx="86" cy="105" r="1.5" fill="#0c0a09"/>
        <circle cx="114" cy="105" r="1.5" fill="#0c0a09"/>
        <path d="M 100 102 L 96 120 L 104 120 Z" fill="#9a3412"/>
        <!-- Signature Beard & Mustache -->
        <path d="M 74 122 C 74 146, 88 155, 100 155 C 112 155, 126 146, 126 122 C 122 130, 116 138, 100 138 C 84 138, 78 130, 74 122 Z" fill="#451a03" opacity="0.85"/>
        <path d="M 88 126 Q 100 128 112 126" stroke="#451a03" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 89 133 Q 100 135 111 133" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <!-- Tapered Cut Hair -->
        <path d="M 64 98 C 64 68, 76 58, 100 58 C 124 58, 136 68, 136 98 C 132 84, 122 74, 100 74 C 78 74, 68 84, 64 98 Z" fill="url(#hair_brown)"/>
      </g>
    </svg>`
  },
  {
    id: "avatar_dreadlocks",
    name: "Rastafari / Dreads",
    style: "Tiền Vệ Box-to-Box",
    desc: "Phong cách Camavinga / Gullit với những bím tóc bện dài chuyển động theo từng bước chạy.",
    svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="fc-avatar-svg">
      <defs>
        <linearGradient id="skin_dread" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#854d0e"/>
          <stop offset="100%" stop-color="#543108"/>
        </linearGradient>
        <linearGradient id="jersey_gold_purple" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#581c87"/>
          <stop offset="50%" stop-color="#7e22ce"/>
          <stop offset="100%" stop-color="#3b0764"/>
        </linearGradient>
        <filter id="glow_dread">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <g filter="url(#glow_dread)">
        <path d="M 28 240 C 28 185, 62 165, 100 165 C 138 165, 172 185, 172 240 Z" fill="url(#jersey_gold_purple)"/>
        <path d="M 75 167 Q 100 196 125 167" stroke="#fbbf24" stroke-width="3" fill="none"/>
        <path d="M 83 144 L 83 172 Q 100 182 117 172 L 117 144 Z" fill="#543108"/>
        <ellipse cx="100" cy="115" rx="34" ry="42" fill="url(#skin_dread)"/>
        <ellipse cx="64" cy="117" rx="5" ry="9" fill="#543108"/>
        <ellipse cx="136" cy="117" rx="5" ry="9" fill="#543108"/>
        <!-- Eyes & Brows -->
        <path d="M 78 100 Q 88 97 96 100" stroke="#1c1917" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 104 100 Q 112 97 122 100" stroke="#1c1917" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="87" cy="108" r="3" fill="#1c1917"/>
        <circle cx="113" cy="108" r="3" fill="#1c1917"/>
        <path d="M 100 106 L 97 122 L 103 122 Z" fill="#3f2305"/>
        <path d="M 88 134 Q 100 142 112 134" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Dreadlocks strands hanging down -->
        <path d="M 60 70 Q 42 110 40 160" stroke="#1c1917" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M 68 62 Q 52 105 50 150" stroke="#292524" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M 140 70 Q 158 110 160 160" stroke="#1c1917" stroke-width="6" stroke-linecap="round" fill="none"/>
        <path d="M 132 62 Q 148 105 150 150" stroke="#292524" stroke-width="6" stroke-linecap="round" fill="none"/>
        <!-- Top Dreads Crown -->
        <ellipse cx="100" cy="62" rx="36" ry="18" fill="#1c1917"/>
        <!-- Colored Dread rings -->
        <circle cx="43" cy="130" r="3" fill="#fbbf24"/>
        <circle cx="157" cy="130" r="3" fill="#fbbf24"/>
      </g>
    </svg>`
  },
  {
    id: "avatar_keeper",
    name: "Người Gác Đền",
    style: "Thủ Môn Thép",
    desc: "Phong cách Petr Cech / Buffon với mũ bảo hộ thi đấu hoặc băng đô chuyên nghiệp, ánh mắt phản xạ thần tốc.",
    svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="fc-avatar-svg">
      <defs>
        <linearGradient id="skin_keeper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fed7aa"/>
          <stop offset="100%" stop-color="#fb923c"/>
        </linearGradient>
        <linearGradient id="jersey_gk" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#15803d"/>
          <stop offset="50%" stop-color="#22c55e"/>
          <stop offset="100%" stop-color="#166534"/>
        </linearGradient>
        <filter id="glow_keeper">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <g filter="url(#glow_keeper)">
        <path d="M 28 240 C 28 185, 62 165, 100 165 C 138 165, 172 185, 172 240 Z" fill="url(#jersey_gk)"/>
        <path d="M 75 167 Q 100 196 125 167" stroke="#ffffff" stroke-width="3" fill="none"/>
        <path d="M 82 142 L 82 170 Q 100 180 118 170 L 118 142 Z" fill="#ea580c"/>
        <ellipse cx="100" cy="115" rx="34" ry="42" fill="url(#skin_keeper)"/>
        <!-- Goalkeeper Protective Headgear / Helmet -->
        <path d="M 62 108 C 60 62, 74 48, 100 48 C 126 48, 140 62, 138 108 C 138 126, 134 135, 132 135 L 126 135 C 126 115, 126 95, 100 95 C 74 95, 74 115, 74 135 L 68 135 C 66 135, 62 126, 62 108 Z" fill="#18181b"/>
        <!-- Chin Strap -->
        <path d="M 72 132 Q 100 152 128 132" stroke="#27272a" stroke-width="4" fill="none"/>
        <!-- Eyes: Piercing Reflex Focus -->
        <path d="M 78 100 L 94 98" stroke="#18181b" stroke-width="3" stroke-linecap="round"/>
        <path d="M 106 98 L 122 100" stroke="#18181b" stroke-width="3" stroke-linecap="round"/>
        <circle cx="86" cy="107" r="3.2" fill="#0284c7"/>
        <circle cx="114" cy="107" r="3.2" fill="#0284c7"/>
        <circle cx="86" cy="107" r="1.5" fill="#09090b"/>
        <circle cx="114" cy="107" r="1.5" fill="#09090b"/>
        <path d="M 100 105 L 98 120 L 102 120 Z" fill="#ea580c"/>
        <path d="M 88 131 L 112 131" stroke="#9a3412" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Headgear Padding Lines -->
        <path d="M 100 48 L 100 95 M 82 56 L 82 92 M 118 56 L 118 92" stroke="#3f3f46" stroke-width="1.8"/>
      </g>
    </svg>`
  },
  {
    id: "avatar_icon_pompadour",
    name: "Huyền Thoại Quý Tộc",
    style: "Prime Icon Bất Tử",
    desc: "Phong cách David Beckham / Zinedine Zidane thời đỉnh cao với diện mạo vương giả, chuẩn mực Icon.",
    svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="fc-avatar-svg">
      <defs>
        <linearGradient id="skin_icon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fff1f2"/>
          <stop offset="100%" stop-color="#fed7aa"/>
        </linearGradient>
        <linearGradient id="jersey_icon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="50%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#e2e8f0"/>
        </linearGradient>
        <linearGradient id="gold_accent" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#eab308"/>
          <stop offset="50%" stop-color="#fef08a"/>
          <stop offset="100%" stop-color="#ca8a04"/>
        </linearGradient>
        <filter id="glow_icon">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <g filter="url(#glow_icon)">
        <path d="M 28 240 C 28 185, 62 165, 100 165 C 138 165, 172 185, 172 240 Z" fill="url(#jersey_icon)"/>
        <!-- Golden Collar of Royalty -->
        <path d="M 75 166 Q 100 196 125 166" fill="url(#gold_accent)"/>
        <path d="M 82 142 L 82 170 Q 100 180 118 170 L 118 142 Z" fill="#fb923c"/>
        <ellipse cx="100" cy="113" rx="33" ry="42" fill="url(#skin_icon)"/>
        <ellipse cx="65" cy="115" rx="5" ry="9" fill="#fb923c"/>
        <ellipse cx="135" cy="115" rx="5" ry="9" fill="#fb923c"/>
        <!-- Regal Eyes -->
        <path d="M 77 96 Q 87 93 96 95" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M 104 95 Q 113 93 123 96" stroke="#78350f" stroke-width="3" stroke-linecap="round" fill="none"/>
        <ellipse cx="86" cy="104" rx="3.5" ry="2.2" fill="#15803d"/>
        <ellipse cx="114" cy="104" rx="3.5" ry="2.2" fill="#15803d"/>
        <circle cx="86" cy="104" r="1.2" fill="#0f172a"/>
        <circle cx="114" cy="104" r="1.2" fill="#0f172a"/>
        <path d="M 100 101 L 98 119 L 102 119 Z" fill="#ea580c" opacity="0.6"/>
        <path d="M 88 130 Q 100 135 112 130" stroke="#b45309" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Classic Pompadour Hair -->
        <path d="M 64 96 C 64 62, 74 46, 100 46 C 126 46, 136 62, 136 96 C 130 80, 118 70, 100 70 C 82 70, 70 80, 64 96 Z" fill="#78350f"/>
        <path d="M 74 74 Q 100 56 126 74" stroke="#d97706" stroke-width="3" fill="none"/>
      </g>
    </svg>`
  },
  {
    id: "avatar_cyber_shades",
    name: "Quái Kiệt Kính Thể Thao",
    style: "Tiền Vệ Đột Biến",
    desc: "Phong cách Edgar Davids với chiếc kính thể thao cam neon ấn tượng, nguồn năng lượng vô tận trên sân.",
    svg: `<svg viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg" class="fc-avatar-svg">
      <defs>
        <linearGradient id="skin_cyber" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#9a3412"/>
          <stop offset="100%" stop-color="#7c2d12"/>
        </linearGradient>
        <linearGradient id="jersey_cyber" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0f172a"/>
          <stop offset="50%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="shades_neon" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ea580c"/>
          <stop offset="50%" stop-color="#f97316"/>
          <stop offset="100%" stop-color="#fbbf24"/>
        </linearGradient>
        <filter id="glow_cyber">
          <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000" flood-opacity="0.45"/>
        </filter>
      </defs>
      <g filter="url(#glow_cyber)">
        <path d="M 28 240 C 28 185, 62 165, 100 165 C 138 165, 172 185, 172 240 Z" fill="url(#jersey_cyber)"/>
        <path d="M 75 167 Q 100 196 125 167" stroke="#f97316" stroke-width="2.5" fill="none"/>
        <path d="M 83 144 L 83 172 Q 100 182 117 172 L 117 144 Z" fill="#6c2710"/>
        <ellipse cx="100" cy="115" rx="34" ry="42" fill="url(#skin_cyber)"/>
        <ellipse cx="64" cy="117" rx="5" ry="9" fill="#6c2710"/>
        <ellipse cx="136" cy="117" rx="5" ry="9" fill="#6c2710"/>
        <!-- Neon Sports Goggles / Glasses -->
        <rect x="70" y="98" width="28" height="18" rx="8" fill="url(#shades_neon)" stroke="#0f172a" stroke-width="2"/>
        <rect x="102" y="98" width="28" height="18" rx="8" fill="url(#shades_neon)" stroke="#0f172a" stroke-width="2"/>
        <path d="M 98 105 L 102 105" stroke="#0f172a" stroke-width="3"/>
        <path d="M 64 105 L 70 105 M 130 105 L 136 105" stroke="#0f172a" stroke-width="2.5"/>
        <!-- Glasses Glare reflection -->
        <path d="M 74 102 L 80 112 M 106 102 L 112 112" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
        <path d="M 100 114 L 97 124 L 103 124 Z" fill="#581e0b"/>
        <path d="M 88 134 Q 100 138 112 134" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Dreadlocks tied up -->
        <ellipse cx="100" cy="56" rx="34" ry="20" fill="#18181b"/>
        <path d="M 66 68 Q 50 100 48 130 M 134 68 Q 150 100 152 130" stroke="#18181b" stroke-width="5" stroke-linecap="round"/>
      </g>
    </svg>`
  }
];

export function getAvatarById(id) {
  return CARD_AVATARS.find(a => a.id === id) || CARD_AVATARS[0];
}
