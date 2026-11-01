import { Box, C, Ground, Scene, makeIso } from "./iso";

const Person = ({ x, y, skin, top, bag }: { x: number; y: number; skin: string; top: string; bag?: string }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x="-5.5" y="-18" width="4.2" height="16" rx="2" fill={C.navy} /><rect x="1.3" y="-18" width="4.2" height="16" rx="2" fill={C.navy} />
    <rect x="-8" y="-42" width="16" height="26" rx="6" fill={top} />
    {bag && <rect x="6" y="-36" width="6" height="14" rx="2" fill={bag} />}
    <circle cx="0" cy="-49" r="6.6" fill={skin} />
    <path d="M-3 -47 Q0 -44 3 -47" stroke={C.navy} strokeWidth="1" fill="none" strokeLinecap="round" />
  </g>
);

export default function PassengerOutcome() {
  const iso = makeIso(100, 26);
  return (
    <Scene title="Smiling riders at a clean station, heading to work, school and play" cx={88}>
      <Ground cx={100} cy={104} rx={70} ry={10} />
      <Box iso={iso} x={0} y={0} z={0} w={96} d={70} h={5} top={C.wl} left={C.grey} right={C.wr} />
      <Box iso={iso} x={6} y={6} z={5} w={3} d={3} h={44} top={C.grey} left={C.grey} right="#9AA6B5" />
      <Box iso={iso} x={6} y={58} z={5} w={3} d={3} h={44} top={C.grey} left={C.grey} right="#9AA6B5" />
      <Box iso={iso} x={2} y={2} z={49} w={36} d={64} h={3.5} top={C.navyL} left={C.navy} right={C.navyR} />
      <polygon points="43,86 156,86 156,89 43,89" fill="none" />
      <Person x={70} y={104} skin={C.skin1} top="#0057A8" bag={C.navy} />
      <Person x={102} y={108} skin={C.skin2} top={C.navy} />
      <Person x={132} y={104} skin={C.skin3} top="#6F86A3" bag={C.yellow} />
    </Scene>
  );
}
