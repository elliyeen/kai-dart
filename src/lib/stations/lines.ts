import type { LineId } from "./types";

export interface LineInfo { id: LineId; name: string; short: string; color: string; text: string; terminals: string }

// Colors follow the original app's line palette. Terminals are the original app's labels.
export const LINES: LineInfo[] = [
  { id: "red",    name: "Red Line",    short: "Red",    color: "#DA291C", text: "#B01E13", terminals: "Westmoreland — Parker Rd" },
  { id: "green",  name: "Green Line",  short: "Green",  color: "#00A84F", text: "#00703A", terminals: "Buckner — N. Carrollton/Frankford" },
  { id: "blue",   name: "Blue Line",   short: "Blue",   color: "#0076CE", text: "#005A9C", terminals: "UNT Dallas — Downtown Rowlett" },
  { id: "orange", name: "Orange Line", short: "Orange", color: "#F77F00", text: "#A85500", terminals: "Parker Road — DFW Airport" },
  { id: "silver", name: "Silver Line", short: "Silver", color: "#8C9BAB", text: "#505C69", terminals: "Shiloh Rd — DFW Terminal B" },
];
export const LINE_BY_ID = Object.fromEntries(LINES.map((l) => [l.id, l])) as Record<LineId, LineInfo>;
