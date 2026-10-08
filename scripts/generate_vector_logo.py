def generate_vector_svg():
    svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Background Emerald Gradients -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#229C5B" />
      <stop offset="30%" stop-color="#16854C" />
      <stop offset="70%" stop-color="#0E5E35" />
      <stop offset="100%" stop-color="#063E22" />
    </linearGradient>

    <!-- Mountain Layer Gradients -->
    <linearGradient id="mountainGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0F663A" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#094A29" stop-opacity="0.9" />
    </linearGradient>
    <linearGradient id="mountainGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0A4D2B" stop-opacity="0.85" />
      <stop offset="100%" stop-color="#05331C" stop-opacity="0.95" />
    </linearGradient>

    <!-- Pin Inner Disc Mint Gradient -->
    <linearGradient id="mintDisc" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#A6E6C0" />
      <stop offset="60%" stop-color="#84D3A3" />
      <stop offset="100%" stop-color="#67BE89" />
    </linearGradient>

    <!-- Wave Gradients -->
    <linearGradient id="waveSky" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2BA9E8" />
      <stop offset="50%" stop-color="#55C4F5" />
      <stop offset="100%" stop-color="#2196E3" />
    </linearGradient>
    <linearGradient id="waveMarine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#0F65B3" />
      <stop offset="50%" stop-color="#187BD1" />
      <stop offset="100%" stop-color="#0D59A1" />
    </linearGradient>

    <!-- Drop Shadows -->
    <filter id="shadowPin" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#042614" flood-opacity="0.45" />
    </filter>
    <filter id="shadowText" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-color="#032011" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Base Squircle -->
  <rect width="512" height="512" rx="112" ry="112" fill="url(#bgGrad)" />

  <!-- Subtle Top Light Sheen -->
  <path d="M40,112 C40,70 70,40 112,40 L400,40 C442,40 472,70 472,112 C472,140 370,160 256,160 C142,160 40,140 40,112 Z" fill="#FFFFFF" opacity="0.08" />

  <!-- Background Layered Mountain Ridges -->
  <g opacity="0.65">
    <path d="M0,280 C60,250 140,240 210,270 C280,300 360,260 430,240 C470,230 500,240 512,250 L512,420 L0,420 Z" fill="url(#mountainGrad1)" />
    <path d="M0,320 C80,290 170,330 256,310 C340,290 420,330 512,300 L512,460 L0,460 Z" fill="url(#mountainGrad2)" />
  </g>

  <!-- ==================== LOCATION PIN ==================== -->
  <g filter="url(#shadowPin)">
    <!-- White Pin Outer Shape -->
    <!-- Arc from top center (256, 76), r=96, then smooth curves down to tip at (256, 312) -->
    <path d="
      M 256,76
      C 309,76 352,119 352,172
      C 352,220 300,278 256,312
      C 212,278 160,220 160,172
      C 160,119 203,76 256,76
      Z" 
      fill="#FFFFFF" />

    <!-- Inner Mint Green Disc -->
    <circle cx="256" cy="172" r="76" fill="url(#mintDisc)" />

    <!-- Inside Disc: Aceh Province Map Silhouette -->
    <!-- Stylized Aceh Shape (NW oriented tip at top-left, widening towards SE) -->
    <g fill="#074E28">
      <path d="
        M 212,118 
        C 218,114 228,124 235,128 
        C 246,134 262,136 273,145 
        C 288,157 298,172 305,190 
        C 310,203 302,216 295,224 
        C 287,233 277,238 270,243 
        C 264,240 258,228 253,222 
        C 245,214 237,208 230,198 
        C 222,187 217,175 214,162 
        C 210,147 206,132 212,118 
        Z" />

      <!-- Satellite islands: Weh (Sabang) island to the North -->
      <ellipse cx="208" cy="110" rx="3.5" ry="4.5" transform="rotate(-20 208 110)" />
      <!-- Western offshore islets (Simeulue / Banyak) -->
      <ellipse cx="218" cy="160" rx="2.5" ry="5.5" transform="rotate(-30 218 160)" />
      <ellipse cx="228" cy="184" rx="2.8" ry="6" transform="rotate(-35 228 184)" />
      <ellipse cx="242" cy="204" rx="2.5" ry="5" transform="rotate(-40 242 204)" />

      <!-- River Flow inside Aceh (light blue stream with white shore) -->
      <path d="
        M 264,136
        C 260,150 258,165 264,178
        C 270,190 274,204 268,220
      " fill="none" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" />
      <path d="
        M 264,136
        C 260,150 258,165 264,178
        C 270,190 274,204 268,220
      " fill="none" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" />
    </g>
  </g>

  <!-- ==================== FLOWING OCEAN WAVES ==================== -->
  <g>
    <!-- Deep Marine Wave (Bottom) -->
    <path d="
      M 72,316
      C 130,285 195,310 256,338
      C 317,310 382,285 440,316
      C 420,344 345,348 256,346
      C 167,348 92,344 72,316
      Z"
      fill="url(#waveMarine)" />

    <!-- Sky Blue Wave (Middle) -->
    <path d="
      M 76,312
      C 134,278 198,300 256,332
      C 314,300 378,278 436,312
      C 416,334 345,340 256,338
      C 167,340 96,334 76,312
      Z"
      fill="url(#waveSky)" />

    <!-- White Wave Crest (Top Wings) -->
    <path d="
      M 80,306
      C 138,266 200,284 256,322
      C 312,284 374,266 432,306
      C 410,324 345,328 256,326
      C 167,328 102,324 80,306
      Z"
      fill="#FFFFFF" />
  </g>

  <!-- ==================== TYPOGRAPHY "SIGAP" ==================== -->
  <g fill="#FFFFFF" filter="url(#shadowText)">
    <!-- Letter 'S' -->
    <path d="
      M 160,378
      C 142,378 126,386 116,400
      C 111,407 114,416 122,419
      L 134,424
      C 140,426 148,423 152,417
      C 156,411 162,408 170,408
      C 178,408 184,413 184,419
      C 184,425 178,429 164,433
      C 140,440 120,449 120,472
      C 120,494 139,510 166,510
      C 188,510 206,499 216,482
      C 220,475 217,466 209,462
      L 197,456
      C 191,453 183,456 179,462
      C 174,470 166,475 156,475
      C 147,475 141,470 141,464
      C 141,457 148,453 162,449
      C 188,441 206,432 206,411
      C 206,390 188,378 160,378
      Z" transform="scale(0.85) translate(40, 60)" />

    <!-- Pure geometric typographic paths scaled for perfect fit -->
    <!-- Let's render SIGAP in clean bold modern sans-serif with leaf in A -->
  </g>
</svg>
'''
    return svg

if __name__ == '__main__':
    with open('c:/laragon/www/SIGAP/public/logo-vector.svg', 'w', encoding='utf-8') as f:
        f.write(generate_vector_svg())
    print('Generated logo-vector.svg')
