// Vector illustrations for the architecture page. Illustrative only: not photographs, not real DART assets.

export function IntelligenceScene() {
  return (
    <svg viewBox="0 0 300 250" role="img" aria-label="Glowing operations panel showing a network line with a location pin" className="w-full h-full">
      <defs>
        <linearGradient id="ip-screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#0A3C86" /><stop offset="1" stopColor="#06193F" /></linearGradient>
        <radialGradient id="ip-glow" cx="50%" cy="60%" r="60%"><stop offset="0" stopColor="#1FB6FF" stopOpacity=".55" /><stop offset="1" stopColor="#1FB6FF" stopOpacity="0" /></radialGradient>
        <filter id="ip-blur"><feGaussianBlur stdDeviation="6" /></filter>
      </defs>
      <ellipse cx="150" cy="222" rx="118" ry="20" fill="#E9EEF5" />
      <ellipse cx="150" cy="218" rx="96" ry="14" fill="#1FB6FF" opacity=".18" filter="url(#ip-blur)" />
      <g transform="translate(150 118) skewY(-6)">
        <rect x="-102" y="-98" width="204" height="170" rx="22" fill="#0B1F33" opacity=".18" transform="translate(8 10)" />
        <rect x="-102" y="-98" width="204" height="170" rx="22" fill="url(#ip-screen)" stroke="#CFE3FF" strokeWidth="3" />
        <rect x="-102" y="-98" width="204" height="170" rx="22" fill="url(#ip-glow)" />
        <path d="M-80 36 C-55 36 -50 8 -30 10 S0 40 20 20 S45 -18 78 -8" fill="none" stroke="#4FD1FF" strokeWidth="5" strokeLinecap="round" />
        <path d="M-80 36 C-55 36 -50 8 -30 10 S0 40 20 20 S45 -18 78 -8" fill="none" stroke="#9BE7FF" strokeWidth="1.5" strokeLinecap="round" />
        {[[-52, 24], [-6, 28], [32, 8], [78, -8]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="5" fill="#fff" stroke="#4FD1FF" strokeWidth="2" />)}
        <path d="M22 -46c-13 0-22 9-22 21 0 15 22 36 22 36s22-21 22-36c0-12-9-21-22-21z" fill="#FFC21A" stroke="#fff" strokeWidth="2" />
        <circle cx="22" cy="-25" r="8" fill="#0B1F33" />
      </g>
    </svg>
  );
}

export function AkardScene({ state }: { state: "before" | "after" }) {
  const after = state === "after";
  const label = after
    ? "Illustration of Akard Station after: clean platform, lighting restored, bench repaired, accessible path"
    : "Illustration of Akard Station before: litter, dim lighting, worn bench, blocked accessible path";
  return (
    <svg viewBox="0 0 320 200" role="img" aria-label={label} className="w-full h-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id={`wall-${state}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={after ? "#C9D3DC" : "#6F7A82"} /><stop offset="1" stopColor={after ? "#E4E9EE" : "#8C959B"} />
        </linearGradient>
        <radialGradient id={`lamp-${state}`} cx="50%" cy="0%" r="90%"><stop offset="0" stopColor="#FFE9A8" stopOpacity={after ? 0.9 : 0.15} /><stop offset="1" stopColor="#FFE9A8" stopOpacity="0" /></radialGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#wall-${state})`} />
      <rect y="0" width="320" height="36" fill={after ? "#2C4A66" : "#26323C"} />
      <rect x="196" y="9" width="104" height="22" rx="3" fill={after ? "#1F3F63" : "#2D3A45"} />
      <text x="248" y="25" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff" fontFamily="system-ui, sans-serif">Akard Station</text>
      {[60, 160, 260].map((x) => <g key={x}><rect x={x - 22} y="36" width="44" height="6" rx="3" fill={after ? "#FFF3C4" : "#4B5359"} /><polygon points={`${x - 22},42 ${x + 22},42 ${x + 60},200 ${x - 60},200`} fill={`url(#lamp-${state})`} /></g>)}
      {[40, 150, 270].map((x) => <rect key={x} x={x} y="42" width="14" height="118" fill={after ? "#A7B3BE" : "#59636B"} />)}
      <rect y="160" width="320" height="40" fill={after ? "#D6DCE2" : "#7B8388"} />
      <rect y="186" width="320" height="14" fill="#FFC21A" opacity={after ? 1 : 0.55} />
      {after ? (
        <g>
          <rect x="190" y="124" width="84" height="8" rx="2" fill="#7A5230" /><rect x="190" y="136" width="84" height="6" rx="2" fill="#7A5230" />
          <rect x="196" y="142" width="6" height="22" fill="#4B3420" /><rect x="262" y="142" width="6" height="22" fill="#4B3420" />
          <rect x="82" y="128" width="26" height="34" rx="4" fill="#586570" /><rect x="80" y="124" width="30" height="6" rx="2" fill="#3E4A54" />
          <g fill="none" stroke="#2E9E43" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="146" cy="118" r="13" fill="#fff" /><path d="M140 118l5 5 9-10" /></g>
        </g>
      ) : (
        <g>
          <rect x="188" y="126" width="84" height="8" rx="2" fill="#5E4A38" transform="rotate(-2 230 130)" /><rect x="192" y="140" width="76" height="4" rx="2" fill="#4B3A2C" />
          <rect x="196" y="144" width="6" height="20" fill="#3A2C20" /><rect x="262" y="146" width="6" height="18" fill="#3A2C20" transform="rotate(8 265 155)" />
          <rect x="76" y="118" width="34" height="46" rx="4" fill="#3C454C" /><rect x="72" y="112" width="42" height="8" rx="3" fill="#2B3238" />
          <path d="M80 112l-8-10 10 4 3-9 6 9 8-7-2 11z" fill="#C9C2B4" />
          {[[130, 176, -20], [150, 182, 15], [58, 178, 30], [120, 190, 0], [226, 178, -15], [292, 184, 25]].map(([x, y, r]) => <rect key={`${x}${y}`} x={x} y={y} width="12" height="7" rx="1.5" fill="#E9E4D8" transform={`rotate(${r} ${x} ${y})`} />)}
          <g transform="translate(150 150)"><polygon points="0,-24 14,0 -14,0" fill="#FF6A13" /><rect x="-16" y="0" width="32" height="5" rx="2" fill="#2B3238" /><rect x="-7" y="-12" width="14" height="4" fill="#fff" /></g>
        </g>
      )}
    </svg>
  );
}
