import type { ReactNode } from "react";

export const C = {
  navy: "#0B1F33", navyL: "#16314D", navyR: "#0E2740", yellow: "#FFD21F", yellowL: "#FFE066", yellowD: "#E6B800",
  white: "#FFFFFF", wl: "#EEF2F7", wr: "#DCE3EC", grey: "#C5CFDC", shadow: "#E8ECF2", glass: "#BCD8F2", glassD: "#8DB3D9", skin1: "#8D5A3B", skin2: "#C58F6A", skin3: "#E3B791",
};

export type P3 = [number, number, number];
export const makeIso = (ox: number, oy: number) => (x: number, y: number, z: number): [number, number] => [ox + (x - y) * 0.866, oy + (x + y) * 0.5 - z];

/** 3D point list to an SVG polygon points string. */
export const pts = (iso: ReturnType<typeof makeIso>, list: P3[]) => list.map(([x, y, z]) => iso(...(([x, y, z]) as P3)).join(",")).join(" ");

type BoxProps = { iso: ReturnType<typeof makeIso>; x: number; y: number; z: number; w: number; d: number; h: number; top: string; left: string; right: string; stroke?: string };
/** Isometric box. Visible faces: top, left (plane y=y+d) and right (plane x=x+w). */
export function Box({ iso, x, y, z, w, d, h, top, left, right, stroke = "rgba(11,31,51,0.14)" }: BoxProps): ReactNode {
  const s = { stroke, strokeWidth: 0.6, strokeLinejoin: "round" as const };
  return (
    <g>
      <polygon points={pts(iso, [[x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={left} {...s} />
      <polygon points={pts(iso, [[x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]])} fill={right} {...s} />
      <polygon points={pts(iso, [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]])} fill={top} {...s} />
    </g>
  );
}

/** Soft ground shadow under an illustration. */
export const Ground = ({ cx = 100, cy = 124, rx = 84, ry = 13 }: { cx?: number; cy?: number; rx?: number; ry?: number }) => <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={C.shadow} />;

/** Wrapper keeping every scene on the same 200x202 canvas centered on the scene. */
export function Scene({ title, cx = 100, children }: { title: string; cx?: number; children: ReactNode }) {
  return (
    <svg viewBox={`${cx - 100} -60 200 202`} className="w-full h-auto" role="img" aria-label={title}>
      <title>{title}</title>
      {children}
    </svg>
  );
}
