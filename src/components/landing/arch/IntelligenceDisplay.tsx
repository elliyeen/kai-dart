import { Box, C, Ground, Scene, makeIso } from "./iso";

export default function IntelligenceDisplay() {
  const iso = makeIso(86, 20);
  // Screen sits on the right face (plane x = X). Face-local u runs along +y, v runs up.
  const X = 6, Y0 = 4, Z0 = 26, D = 70, H = 52;
  const [ex, ey] = iso(X, Y0, Z0);
  const m = `matrix(-0.866 0.5 0 -1 ${ex} ${ey})`;
  return (
    <Scene title="Operations screen showing a network map with an alert" cx={91}>
      <Ground cx={86} cy={84} rx={58} ry={9} />
      <Box iso={iso} x={0} y={0} z={0} w={54} d={74} h={5} top={C.white} left={C.wr} right={C.wl} />
      <Box iso={iso} x={0} y={34} z={5} w={6} d={10} h={21} top={C.grey} left={C.grey} right="#9AA6B5" />
      <Box iso={iso} x={0} y={Y0} z={Z0} w={X} d={D} h={H} top={C.navyL} left={C.navy} right={C.navy} />
      <g transform={m}>
        <rect x="4" y="4" width={D - 8} height={H - 8} rx="2" fill="#16314D" />
        <path d="M10 38 L28 26 L44 32 L58 14" stroke={C.yellow} strokeWidth="1.8" fill="none" />
        <path d="M28 26 L32 42 M44 32 L52 44" stroke="#4F7FB0" strokeWidth="1.2" fill="none" />
        {[[10, 38], [28, 26], [44, 32], [58, 14], [32, 42], [52, 44]].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" fill={C.yellow} />)}
        <polygon points="46,10 60,34 32,34" fill={C.yellow} transform="translate(0 4)" />
        <rect x="45" y="19" width="2.4" height="8" fill={C.navy} transform="translate(0 4)" />
        <circle cx="46.2" cy="31" r="1.5" fill={C.navy} transform="translate(0 4)" />
      </g>
    </Scene>
  );
}
