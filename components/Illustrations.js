// Kumpulan ilustrasi SVG bertema konstruksi (dipakai di sidebar, kartu ringkasan, dan halaman login)

// Bentuk roda gigi (cog) dibuat dari perhitungan supaya rapi
const COG_PATH = (() => {
  const teeth = 8
  const outer = 10.4
  const inner = 8
  const step = (Math.PI * 2) / teeth
  const shape = [
    [inner, -0.3],
    [outer, -0.16],
    [outer, 0.16],
    [inner, 0.3],
  ]
  const pts = []
  for (let i = 0; i < teeth; i++) {
    for (const [r, k] of shape) {
      const a = i * step + k * step
      pts.push(`${(12 + r * Math.cos(a)).toFixed(2)} ${(12 + r * Math.sin(a)).toFixed(2)}`)
    }
  }
  return `M${pts.join('L')}Z`
})()

export function GearIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" {...props}>
      <path d={COG_PATH} />
      <circle cx="12" cy="12" r="3.2" />
    </svg>
  )
}

// Sketsa denah tipis untuk dekorasi sidebar
export function BlueprintSketch(props) {
  return (
    <svg viewBox="0 0 180 130" fill="none" stroke="#cfe3ef" strokeWidth="0.9" opacity="0.5" {...props}>
      <path d="M10 20 L150 8 L170 100 L30 118 Z" />
      <path d="M22 34 L138 24 L152 92 L36 104 Z" />
      <line x1="70" y1="30" x2="80" y2="98" />
      <line x1="22" y1="66" x2="150" y2="58" />
      <path d="M100 60 a14 14 0 0 1 12 -12" />
      <rect x="40" y="44" width="18" height="14" />
      <line x1="112" y1="42" x2="118" y2="90" />
      <circle cx="158" cy="112" r="8" />
      <line x1="158" y1="100" x2="158" y2="124" />
    </svg>
  )
}

// ---------- Dekorasi kartu ringkasan ----------

const CRANE_LATTICE = Array.from({ length: 7 }, (_, i) => {
  const t1 = i / 7
  const t2 = (i + 0.5) / 7
  return [4 + 86 * t1, 78 - 72 * t1, 14 + 85 * t2, 92 - 77 * t2]
})

export function DecoCrane(props) {
  return (
    <svg viewBox="0 0 120 100" {...props}>
      <path d="M4 78 L90 6 L99 15 L14 92 Z" fill="#f2b632" stroke="#7a5c12" strokeWidth="1.6" strokeLinejoin="round" />
      <g stroke="#7a5c12" strokeWidth="1.2">
        {CRANE_LATTICE.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>
      <rect x="0" y="80" width="30" height="14" rx="3" fill="#f2b632" stroke="#7a5c12" strokeWidth="1.6" />
      <rect x="0" y="94" width="30" height="5" rx="2.5" fill="#333" />
      <g className="hook-swing">
        <line x1="95" y1="12" x2="95" y2="62" stroke="#3a3f43" strokeWidth="1.6" />
        <path d="M95 62 v6 a4 4 0 1 1 -4 -4" fill="none" stroke="#3a3f43" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  )
}

export function DecoCompass(props) {
  return (
    <svg viewBox="0 0 70 90" {...props}>
      <defs>
        <linearGradient id="decoCmpA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3f4f5" />
          <stop offset="1" stopColor="#8d949a" />
        </linearGradient>
      </defs>
      <path d="M35 14 L12 84 L18 86 L38 26 Z" fill="url(#decoCmpA)" stroke="#5f666b" strokeWidth="1" />
      <path d="M35 14 L58 84 L52 86 L32 26 Z" fill="url(#decoCmpA)" stroke="#5f666b" strokeWidth="1" />
      <path d="M22 58 Q35 50 48 58" fill="none" stroke="#6b7278" strokeWidth="3" strokeLinecap="round" />
      <circle cx="35" cy="14" r="7" fill="url(#decoCmpA)" stroke="#5f666b" />
      <rect x="32" y="2" width="6" height="8" rx="2" fill="#7c848a" />
      <circle cx="35" cy="14" r="2.2" fill="#4c5358" />
    </svg>
  )
}

export function DecoBlueprintCheck(props) {
  return (
    <svg viewBox="0 0 130 90" {...props}>
      <g transform="rotate(-4 56 47)">
        <rect x="6" y="14" width="100" height="66" rx="3" fill="#2b6d9b" stroke="#1c4a6b" strokeWidth="2" />
        <g stroke="#8fc0e0" strokeWidth="0.8" opacity="0.7">
          {[26, 38, 50, 62, 74, 86].map((x) => (
            <line key={x} x1={x} y1="16" x2={x} y2="78" />
          ))}
          {[28, 42, 56, 70].map((y) => (
            <line key={y} x1="8" y1={y} x2="104" y2={y} />
          ))}
        </g>
      </g>
      <path d="M32 46 L52 66 L92 24" fill="none" stroke="#1b2a33" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" transform="translate(2 3)" />
      <path d="M32 46 L52 66 L92 24" fill="none" stroke="#e9ecee" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M32 46 L52 66 L92 24" fill="none" stroke="#9aa2a8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="108" y="46" width="9" height="16" rx="2.5" fill="#f28a2e" />
      <rect x="108" y="61" width="9" height="12" fill="#33485a" />
      <circle cx="112.5" cy="40" r="5" fill="#f0c39a" />
      <path d="M107 39.5 a5.5 5.5 0 0 1 11 0z" fill="#f2b632" />
    </svg>
  )
}

function CoinStack({ cx, count, withSign }) {
  const coins = []
  for (let i = 0; i < count; i++) {
    const y = 72 - i * 11
    coins.push(
      <g key={i}>
        <ellipse cx={cx} cy={y + 10} rx="22" ry="6" fill="url(#decoCoinA)" stroke="#5f666b" strokeWidth="1" />
        <rect x={cx - 22} y={y} width="44" height="10" fill="url(#decoCoinA)" />
        <line x1={cx - 22} y1={y} x2={cx - 22} y2={y + 10} stroke="#5f666b" strokeWidth="1" />
        <line x1={cx + 22} y1={y} x2={cx + 22} y2={y + 10} stroke="#5f666b" strokeWidth="1" />
        <ellipse cx={cx} cy={y} rx="22" ry="6" fill="#e6e9eb" stroke="#5f666b" strokeWidth="1" />
      </g>
    )
  }
  const topY = 72 - (count - 1) * 11
  return (
    <g>
      {coins}
      {withSign && (
        <text x={cx} y={topY + 3.5} textAnchor="middle" fontSize="10" fontWeight="700" fill="#5f666b" fontFamily="Arial, sans-serif">
          $
        </text>
      )}
    </g>
  )
}

export function DecoCoins(props) {
  return (
    <svg viewBox="0 0 130 90" {...props}>
      <defs>
        <linearGradient id="decoCoinA" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8b9298" />
          <stop offset="0.5" stopColor="#f1f3f4" />
          <stop offset="1" stopColor="#8b9298" />
        </linearGradient>
        <linearGradient id="decoArrowA" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d3d7da" />
          <stop offset="1" stopColor="#7a8288" />
        </linearGradient>
      </defs>
      <CoinStack cx={30} count={4} withSign />
      <CoinStack cx={68} count={2} />
      <path d="M90 36 h18 v-11 l22 21 -22 21 v-11 h-18 z" fill="url(#decoArrowA)" stroke="#5f666b" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  )
}

export function DecoTruck(props) {
  return (
    <svg viewBox="0 0 120 80" {...props}>
      <path d="M22 28 l10 -10 l14 4 l10 -8 l14 6 l6 12 z" fill="#5fae5a" stroke="#356b33" strokeWidth="1" strokeLinejoin="round" />
      <path d="M14 30 L82 30 L78 52 L18 52 Z" fill="#f2b632" stroke="#7a5c12" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M82 36 L100 36 L108 50 L108 58 L82 58 Z" fill="#f2b632" stroke="#7a5c12" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M88 40 L98 40 L103 50 L88 50 Z" fill="#bfe3f2" stroke="#4a6b7a" strokeWidth="1" />
      <rect x="14" y="52" width="94" height="8" rx="2" fill="#444c52" />
      <circle cx="34" cy="64" r="10" fill="#2b2f33" />
      <circle cx="34" cy="64" r="4" fill="#9aa2a8" />
      <circle cx="90" cy="64" r="10" fill="#2b2f33" />
      <circle cx="90" cy="64" r="4" fill="#9aa2a8" />
    </svg>
  )
}

// ---------- Ilustrasi tahapan pembangunan (dipakai di Ringkasan & Login) ----------

function Worker({ x, y, s = 1.3 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="-15" width="6" height="10" rx="1.5" fill="#f28a2e" />
      <rect x="-3" y="-5" width="6" height="7" fill="#33485a" />
      <circle cx="0" cy="-18.5" r="3" fill="#f0c39a" />
      <path d="M-3.4 -19a3.4 3.4 0 0 1 6.8 0z" fill="#f2b632" />
    </g>
  )
}

const BRICK = '#b5573a'
const BRICK_DARK = '#8f4128'
const CONCRETE = '#9aa0a4'
const CONCRETE_DARK = '#6f767a'
const SLAB = '#b8bcbf'
const REBAR = '#5c5147'

export function ConstructionScene(props) {
  const stage = (i) => ({ className: 'scene-stage', style: { animationDelay: `${0.18 * i}s` } })

  return (
    <svg viewBox="0 0 1000 275" preserveAspectRatio="xMidYMax meet" {...props}>
      {/* garis denah samar di belakang */}
      <g fill="none" stroke="#6b8aa3" strokeWidth="1" opacity="0.32">
        <rect x="20" y="30" width="200" height="150" />
        <line x1="20" y1="90" x2="220" y2="90" />
        <line x1="120" y1="30" x2="120" y2="180" />
        <line x1="70" y1="90" x2="70" y2="180" />
        <path d="M120 90 a24 24 0 0 1 24 -24" />
        <rect x="300" y="60" width="180" height="120" />
        <line x1="300" y1="120" x2="480" y2="120" />
        <line x1="390" y1="60" x2="390" y2="180" />
        <rect x="700" y="30" width="200" height="170" />
        <line x1="700" y1="115" x2="900" y2="115" />
        <line x1="800" y1="30" x2="800" y2="200" />
      </g>

      {/* jalur */}
      <rect x="110" y="234" width="850" height="9" rx="4.5" fill="#1d5a6b" />

      {/* Tahap 1 - galian & pondasi */}
      <g {...stage(0)}>
        <path d="M14 234 Q22 262 58 262 L138 262 Q160 262 168 234 Z" fill="#8b6a4a" />
        <rect x="46" y="246" width="100" height="14" fill={BRICK} stroke={BRICK_DARK} />
        <rect x="58" y="220" width="10" height="28" fill={CONCRETE} stroke={CONCRETE_DARK} strokeWidth="0.8" />
        <rect x="118" y="220" width="10" height="28" fill={CONCRETE} stroke={CONCRETE_DARK} strokeWidth="0.8" />
        <line x1="63" y1="202" x2="63" y2="220" stroke={REBAR} strokeWidth="1.4" />
        <line x1="123" y1="202" x2="123" y2="220" stroke={REBAR} strokeWidth="1.4" />
        <Worker x={176} y={232} />
        <Worker x={183} y={232} />
      </g>

      {/* Tahap 2 - dinding bata rendah */}
      <g {...stage(1)}>
        <rect x="188" y="230" width="118" height="4" fill="#8b9297" />
        <rect x="192" y="212" width="110" height="18" fill={BRICK} />
        {[192, 220, 248, 276].map((x) => (
          <rect key={x} x={x} y="202" width="16" height="10" fill={BRICK} />
        ))}
        {[200, 242, 288].map((x) => (
          <line key={x} x1={x} y1="182" x2={x} y2="202" stroke={REBAR} strokeWidth="1.4" />
        ))}
      </g>

      {/* Tahap 3 - kolom & dinding */}
      <g {...stage(2)}>
        {[332, 370, 408].map((x) => (
          <rect key={x} x={x} y="160" width="9" height="74" fill={CONCRETE} stroke={CONCRETE_DARK} strokeWidth="0.8" />
        ))}
        <rect x="326" y="156" width="98" height="6" fill="#8b9297" />
        <rect x="341" y="200" width="67" height="34" fill={BRICK} />
        <rect x="376" y="208" width="18" height="14" fill="#cfd4d6" />
        {[336, 374, 412].map((x) => (
          <line key={x} x1={x} y1="136" x2={x} y2="156" stroke={REBAR} strokeWidth="1.4" />
        ))}
      </g>

      {/* Ekskavator */}
      <g {...stage(3)}>
        <rect x="482" y="226" width="56" height="8" rx="4" fill="#33383c" />
        <rect x="488" y="212" width="40" height="15" rx="3" fill="#f2b632" stroke="#7a5c12" />
        <rect x="500" y="198" width="20" height="15" rx="2" fill="#f2b632" stroke="#7a5c12" />
        <rect x="504" y="202" width="12" height="8" fill="#bfe3f2" />
        <path d="M490 216 L470 196 L458 214" fill="none" stroke="#e0a21f" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M452 212 L466 212 L462 224 L450 222 Z" fill="#7a5c12" />
      </g>

      {/* Tahap 4 - rangka 3 lantai */}
      <g {...stage(4)}>
        {[572, 606, 640, 674].map((x) => (
          <rect key={x} x={x} y="120" width="9" height="114" fill={CONCRETE} stroke={CONCRETE_DARK} strokeWidth="0.8" />
        ))}
        {[196, 158, 120].map((y) => (
          <rect key={y} x="566" y={y} width="124" height="6" fill={SLAB} stroke="#8b9297" strokeWidth="0.8" />
        ))}
        <rect x="581" y="202" width="93" height="32" fill={BRICK} />
        <rect x="614" y="212" width="16" height="22" fill="#6b3a25" />
        <rect x="581" y="176" width="25" height="20" fill={BRICK} />
        {[576, 610, 644, 678].map((x) => (
          <line key={x} x1={x + 4} y1="100" x2={x + 4} y2="120" stroke={REBAR} strokeWidth="1.4" />
        ))}
        <Worker x={598} y={118} />
        <Worker x={626} y={118} />
        <Worker x={655} y={156} />
        <g stroke="#8a6a3a" strokeWidth="1.4">
          <line x1="696" y1="196" x2="704" y2="234" />
          <line x1="708" y1="196" x2="716" y2="234" />
          {[204, 214, 224].map((y, i) => (
            <line key={y} x1={697 + i * 0.8} y1={y} x2={709 + i * 0.8} y2={y} />
          ))}
        </g>
      </g>

      {/* Tahap 5 - gedung jadi */}
      <g {...stage(5)}>
        <rect x="740" y="78" width="120" height="156" fill="#a3adb3" stroke="#7b868d" strokeWidth="1" />
        <rect x="740" y="78" width="22" height="156" fill={BRICK} />
        <rect x="838" y="78" width="22" height="156" fill={BRICK} />
        <rect x="734" y="70" width="132" height="9" fill={BRICK_DARK} />
        <rect x="772" y="60" width="32" height="10" fill="#8b9297" />
        {[0, 1, 2, 3, 4].map((r) =>
          [770, 794, 818].map((cx) => (
            <rect key={`${r}-${cx}`} x={cx} y={88 + r * 24} width="16" height="13" fill="#2f5f78" stroke="#d3dadd" strokeWidth="1" />
          ))
        )}
        {[770, 818].map((cx) => (
          <rect key={cx} x={cx} y="212" width="16" height="13" fill="#2f5f78" stroke="#d3dadd" strokeWidth="1" />
        ))}
        <rect x="790" y="210" width="20" height="24" fill="#234a5c" />
        <rect x="734" y="228" width="132" height="6" fill="#8b9297" />
      </g>

      {/* Pohon & pekerja */}
      <g {...stage(6)}>
        <rect x="886" y="214" width="5" height="20" fill="#7a5a3a" />
        <circle cx="888" cy="206" r="14" fill="#4f9a4a" />
        <rect x="918" y="220" width="5" height="14" fill="#7a5a3a" />
        <circle cx="920" cy="212" r="12" fill="#3f8a45" />
        <Worker x={870} y={232} />
        <Worker x={878} y={232} />
      </g>
    </svg>
  )
}
