// Existing repository photography only (public/images/dart). No new or generated imagery.
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const img = (file: string) => `${basePath}/images/dart/${file}`;

export const IMAGES = {
  hero: { file: "20260314_083035.jpg", alt: "Yellow-and-white DART train at a station platform with its doors open" },
  observe: { file: "20260223_191302.jpg", alt: "Park Lane Station platform shelter, benches and signage in close view" },
  understand: { file: "20260223_191335.jpg", alt: "Park Lane Station platform at night, looking along the track" },
  coordinate: { file: "20260304_135142.jpg", alt: "DART light rail train on an elevated guideway between concrete structures" },
  verify: { file: "20260227_124144.jpg", alt: "Park Lane Station sign with a DART train arriving on a clear day" },
  capabilities: { file: "20260223_191335.jpg", alt: "Park Lane Station platform at night" },
  cta: { file: "20260227_124144.jpg", alt: "Park Lane DART Station" },
} as const;
