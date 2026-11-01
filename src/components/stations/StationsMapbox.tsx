"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef } from "react";
import { linesGeoJSON, stationBounds, stationsGeoJSON } from "@/lib/stations/geojson";
import type { LineId } from "@/lib/stations";

/** Real Mapbox base map (light style) with KAI station + rollout layers. Needs NEXT_PUBLIC_MAPBOX_TOKEN. */
export default function StationsMapbox({ token, mode, line, selectedKey, onSelect }: {
  token: string; mode: "network" | "rollout"; line?: LineId | null; selectedKey?: string | null; onSelect?: (key: string) => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const onSelectRef = useRef(onSelect);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  const rollout = mode === "rollout";

  useEffect(() => {
    if (!box.current) return;
    mapboxgl.accessToken = token;
    const map = new mapboxgl.Map({
      container: box.current, style: "mapbox://styles/mapbox/light-v11", bounds: stationBounds(), fitBoundsOptions: { padding: 48 },
      attributionControl: true, cooperativeGestures: true, dragRotate: false, pitchWithRotate: false, customAttribution: "KAI station positions",
    });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), "bottom-right");
    const popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false, offset: 12 });

    map.on("load", () => {
      map.addSource("lines", { type: "geojson", data: linesGeoJSON() });
      map.addSource("stations", { type: "geojson", data: stationsGeoJSON() });
      map.addLayer({ id: "lines", type: "line", source: "lines", layout: { "line-join": "round", "line-cap": "round" }, paint: { "line-color": ["get", "color"], "line-width": 3, "line-opacity": rollout ? 0.35 : 0.85 } });
      map.addLayer({
        id: "stations", type: "circle", source: "stations",
        paint: rollout ? {
          "circle-radius": ["match", ["get", "rollout"], "demo", 9, "connected", 7, "pilot-planned", 9, "public-data", 5.5, 4.5],
          "circle-color": ["match", ["get", "rollout"], "demo", "#F59E0B", "connected", "#0057A8", "public-data", "#0E7490", "#FFFFFF"],
          "circle-stroke-color": ["match", ["get", "rollout"], "demo", "#0B1F33", "connected", "#FFFFFF", "public-data", "#FFFFFF", "pilot-planned", "#0057A8", "#6B7280"],
          "circle-stroke-width": ["match", ["get", "rollout"], "demo", 2.5, "pilot-planned", 3.5, 1.6],
        } : { "circle-radius": 4.5, "circle-color": "#FFFFFF", "circle-stroke-color": "#0B1F33", "circle-stroke-width": 1.6 },
      });
      map.addLayer({ id: "selected", type: "circle", source: "stations", filter: ["==", ["get", "key"], ""], paint: { "circle-radius": 9, "circle-color": "#0B1F33", "circle-stroke-color": "#FFFFFF", "circle-stroke-width": 2 } });
      map.addLayer({
        id: "labels", type: "symbol", source: "stations", filter: rollout ? ["in", ["get", "rollout"], ["literal", ["demo", "pilot-planned"]]] : ["==", ["get", "key"], ""],
        layout: { "text-field": ["get", "name"], "text-size": 13, "text-offset": [0, -1.4], "text-anchor": "bottom", "text-font": ["DIN Pro Bold", "Arial Unicode MS Bold"] },
        paint: { "text-color": "#0B1F33", "text-halo-color": "#FFFFFF", "text-halo-width": 2 },
      });

      map.on("mousemove", "stations", (e) => {
        const f = e.features?.[0]; if (!f) return;
        map.getCanvas().style.cursor = onSelectRef.current ? "pointer" : "";
        const el = document.createElement("div");
        const b = document.createElement("strong"); b.textContent = String(f.properties?.name);
        const s = document.createElement("div"); s.textContent = rollout ? String(f.properties?.rolloutLabel) : String(f.properties?.lines).replace(/,/g, " · ");
        el.append(b, s);
        popup.setLngLat((f.geometry as GeoJSON.Point).coordinates as [number, number]).setDOMContent(el).addTo(map);
      });
      map.on("mouseleave", "stations", () => { map.getCanvas().style.cursor = ""; popup.remove(); });
      map.on("click", "stations", (e) => { const k = e.features?.[0]?.properties?.key; if (k && onSelectRef.current) onSelectRef.current(String(k)); });
    });
    return () => { popup.remove(); map.remove(); mapRef.current = null; };
  }, [token, rollout]);

  // line filter + selection (network mode)
  useEffect(() => {
    const map = mapRef.current; if (!map) return;
    const apply = () => {
      if (!map.getLayer("stations")) return;
      // `lines` is a comma-joined string ("red,blue"), so match with index-of.
      const f = line ? ([">=", ["index-of", line, ["get", "lines"]], 0] as mapboxgl.ExpressionSpecification) : null;
      map.setFilter("stations", f);
      map.setPaintProperty("lines", "line-opacity", rollout ? 0.35 : line ? ["case", ["==", ["get", "line"], line], 0.9, 0.1] : 0.85);
      map.setFilter("selected", ["==", ["get", "key"], selectedKey ?? ""]);
      if (!rollout) map.setFilter("labels", ["==", ["get", "key"], selectedKey ?? ""]);
    };
    if (map.isStyleLoaded() && map.getLayer("stations")) apply(); else map.once("idle", apply);
  }, [line, selectedKey, rollout]);

  return <div ref={box} role="region" aria-label={rollout ? "Interactive map of KAI rollout status by station. Use the station directory for a text list." : "Interactive map of DART rail stations. Use the station list for keyboard access."} data-testid={`mapbox-${mode}`} className="w-full aspect-[16/14] rounded-2xl overflow-hidden border border-gray-200" />;
}
