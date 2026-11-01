import { Box, C, Ground, Scene, makeIso } from "./iso";

export default function KaiLayers() {
  const iso = makeIso(100, 22);
  const [tx, ty] = iso(22, 54, 48);
  return (
    <Scene title="Three layered tiles labelled KAI: ingest, model, analyze" cx={85}>
      <Ground cx={100} cy={84} rx={54} ry={9} />
      <Box iso={iso} x={0} y={0} z={0} w={62} d={62} h={8} top={C.navyL} left={C.navy} right={C.navyR} />
      <Box iso={iso} x={0} y={0} z={20} w={62} d={62} h={8} top={C.yellowL} left={C.yellowD} right={C.yellow} />
      <Box iso={iso} x={0} y={0} z={40} w={62} d={62} h={8} top={C.white} left={C.wr} right={C.wl} stroke="rgba(11,31,51,0.2)" />
      <text transform={`matrix(0.866 -0.5 0.866 0.5 ${tx} ${ty})`} x="0" y="0" fontSize="15" fontWeight="700" letterSpacing="5" fill={C.navy} fontFamily="var(--font-geist-sans), system-ui, sans-serif">KAI</text>
    </Scene>
  );
}
