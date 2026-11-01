import { Box, C, Ground, Scene, makeIso, pts, type P3 } from "./iso";

export default function MaintenanceDispatch() {
  const iso = makeIso(82, 22);
  const X0 = 8, Y0 = 20, Z0 = 8, Y = Y0 + 26;
  const side = (u0: number, u1: number, v0: number, v1: number): P3[] => [[X0 + u0, Y, Z0 + v0], [X0 + u1, Y, Z0 + v0], [X0 + u1, Y, Z0 + v1], [X0 + u0, Y, Z0 + v1]];
  const [w1x, w1y] = iso(X0 + 16, Y, Z0);
  const [w2x, w2y] = iso(X0 + 70, Y, Z0);
  const [fx, fy] = iso(X0 + 98, Y + 18, 8);
  return (
    <Scene title="Maintenance van and technician on a station platform" cx={90}>
      <Ground cx={82} cy={110} rx={78} ry={11} />
      <Box iso={iso} x={0} y={0} z={0} w={118} d={70} h={5} top={C.wl} left={C.grey} right={C.wr} />
      {/* van body and cab */}
      <Box iso={iso} x={X0} y={Y0} z={Z0} w={62} d={26} h={26} top={C.white} left={C.white} right={C.wl} />
      <Box iso={iso} x={X0 + 62} y={Y0} z={Z0} w={24} d={26} h={16} top={C.white} left={C.white} right={C.wl} />
      <polygon points={pts(iso, side(0, 86, 0, 5))} fill={C.navy} />
      <polygon points={pts(iso, side(0, 86, 5, 9))} fill={C.yellow} />
      <polygon points={pts(iso, [[X0 + 86, Y0 + 3, Z0 + 7], [X0 + 86, Y0 + 23, Z0 + 7], [X0 + 86, Y0 + 23, Z0 + 14], [X0 + 86, Y0 + 3, Z0 + 14]])} fill={C.glassD} />
      <polygon points={pts(iso, side(64, 82, 9, 15))} fill={C.glass} stroke={C.glassD} strokeWidth="0.5" />
      <polygon points={pts(iso, side(10, 38, 14, 22))} fill={C.wr} />
      {/* beacon */}
      <Box iso={iso} x={X0 + 40} y={Y0 + 10} z={Z0 + 26} w={6} d={6} h={4} top={C.yellowL} left={C.yellow} right={C.yellowD} />
      {/* wheels */}
      {[[w1x, w1y], [w2x, w2y]].map(([x, y], i) => (
        <g key={i} transform={`matrix(0.866 0.5 0 -1 ${x} ${y})`}><circle cx="0" cy="0" r="7" fill="#232830" /><circle cx="0" cy="0" r="3" fill={C.grey} /></g>
      ))}
      {/* technician */}
      <g transform={`translate(${fx} ${fy})`}>
        <rect x="-4" y="-20" width="3" height="13" rx="1.5" fill={C.navy} /><rect x="1" y="-20" width="3" height="13" rx="1.5" fill={C.navy} />
        <rect x="-6" y="-36" width="12" height="18" rx="4" fill={C.yellow} stroke={C.yellowD} strokeWidth="0.6" /><rect x="-6" y="-29" width="12" height="2.2" fill={C.white} opacity="0.85" />
        <circle cx="0" cy="-41" r="4.6" fill={C.skin2} /><path d="M-5 -42 A5 5 0 0 1 5 -42 Z" fill={C.yellowD} />
        <rect x="6" y="-24" width="7" height="6" rx="1" fill={C.navyL} />
      </g>
    </Scene>
  );
}
