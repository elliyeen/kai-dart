import { Box, C, Ground, Scene, makeIso, pts, type P3 } from "./iso";

export default function IsometricRail() {
  const iso = makeIso(92, 24);
  const poly = (l: P3[], fill: string) => <polygon points={pts(iso, l)} fill={fill} />;
  // Train long along x: side face is plane y = Y, cap face is plane x = X.
  const X0 = 6, Y0 = 30, Z0 = 9, L = 88, W = 20, H = 24, Y = Y0 + W, X = X0 + L;
  const side = (u0: number, u1: number, v0: number, v1: number): P3[] => [[X0 + u0, Y, Z0 + v0], [X0 + u1, Y, Z0 + v0], [X0 + u1, Y, Z0 + v1], [X0 + u0, Y, Z0 + v1]];
  const cap = (u0: number, u1: number, v0: number, v1: number): P3[] => [[X, Y0 + u0, Z0 + v0], [X, Y0 + u1, Z0 + v0], [X, Y0 + u1, Z0 + v1], [X, Y0 + u0, Z0 + v1]];
  return (
    <Scene title="Light-rail vehicle stopped at a station platform" cx={96}>
      <Ground cx={92} cy={104} rx={78} ry={11} />
      {/* ground slab and raised platform */}
      <Box iso={iso} x={0} y={0} z={0} w={104} h={5} d={74} top={C.wl} left={C.grey} right={C.wr} />
      <Box iso={iso} x={0} y={0} z={5} w={104} h={4} d={26} top={C.white} left={C.wr} right={C.grey} />
      {/* track bed */}
      {poly([[0, 34, 5], [104, 34, 5], [104, 52, 5], [0, 52, 5]], "#9AA6B5")}
      {poly([[0, 37, 5.2], [104, 37, 5.2], [104, 39, 5.2], [0, 39, 5.2]], "#667385")}
      {poly([[0, 46, 5.2], [104, 46, 5.2], [104, 48, 5.2], [0, 48, 5.2]], "#667385")}
      {/* canopy posts and roof */}
      <Box iso={iso} x={8} y={4} z={9} w={2.5} d={2.5} h={30} top={C.grey} left={C.grey} right="#9AA6B5" />
      <Box iso={iso} x={70} y={4} z={9} w={2.5} d={2.5} h={30} top={C.grey} left={C.grey} right="#9AA6B5" />
      <Box iso={iso} x={4} y={0} z={39} w={74} d={26} h={3.5} top={C.navyL} left={C.navy} right={C.navyR} />
      {poly([[4, 26, 39], [78, 26, 39], [78, 26, 42.5], [4, 26, 42.5]], C.yellow)}
      {/* train body */}
      <Box iso={iso} x={X0} y={Y0} z={Z0} w={L} d={W} h={H} top={C.wl} left={C.white} right={C.wl} />
      <polygon points={pts(iso, side(0, L, 0, 5))} fill={C.navy} />
      <polygon points={pts(iso, side(0, L, 5, 9))} fill={C.yellow} />
      {[8, 26, 44, 62].map((u) => <polygon key={u} points={pts(iso, side(u, u + 12, 12, 21))} fill={C.glass} stroke={C.glassD} strokeWidth="0.5" />)}
      <polygon points={pts(iso, side(80, 87, 12, 21))} fill={C.glass} stroke={C.glassD} strokeWidth="0.5" />
      {/* front cap */}
      <polygon points={pts(iso, cap(0, W, 0, 5))} fill={C.navyR} />
      <polygon points={pts(iso, cap(0, W, 5, 9))} fill={C.yellowD} />
      <polygon points={pts(iso, cap(2.5, W - 2.5, 12, 21))} fill={C.glassD} stroke="#6E97C2" strokeWidth="0.5" />
      <polygon points={pts(iso, cap(W / 2 - 3, W / 2 + 3, 22.5, 23.5))} fill={C.yellow} />
      {/* roof equipment */}
      <Box iso={iso} x={30} y={34} z={Z0 + H} w={20} d={10} h={2.5} top={C.wr} left={C.grey} right={C.grey} />
    </Scene>
  );
}
