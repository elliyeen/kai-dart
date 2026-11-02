"use client";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { Box, Layers, Waypoints } from "lucide-react";
import { stationsGeoJSON } from "@/lib/stations/geojson";
import type { Station } from "@/lib/stations";
import MapPanel from "../MapPanel";

const TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

/** Zoomed, interactive map of one station with the 2D / 3D / Layers controls from the design. Falls back to the drawn map without a token. */
export default function StationFocusMap({ station }: { station: Station }) {
  const box = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [three, setThree] = useState(false);
  const [layers, setLayers] = useState(false);
  const [nearby, setNearby] = useState(true);

  useEffect(() => {
    if (!TOKEN || !box.current) return;
    mapboxgl.accessToken = TOKEN;
    const map = new mapboxgl.Map({ container: box.current, style: "mapbox://styles/mapbox/standard", center: [station.lng, station.lat], zoom: 16.2, pitch: 0, cooperativeGestures: true, attributionControl: true });
    mapRef.current = map;
    map.addControl(new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: true }), "bottom-right");
    const el = document.createElement("div");
    el.style.cssText = "width:18px;height:18px;border-radius:50%;background:#0B1F33;border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.45)";
    el.title = station.name;
    new mapboxgl.Marker({ element: el }).setLngLat([station.lng, station.lat]).addTo(map);
    map.on("load", () => {
      map.addSource("stations", { type: "geojson", data: stationsGeoJSON() });
      map.addLayer({ id: "nearby", type: "circle", source: "stations", filter: ["!=", ["get", "key"], station.key], paint: { "circle-radius": 5, "circle-color": "#fff", "circle-stroke-color": "#0E7490", "circle-stroke-width": 2 } });
    });
    return () => { map.remove(); mapRef.current = null; };
  }, [station]);

  useEffect(() => { mapRef.current?.easeTo({ pitch: three ? 58 : 0, bearing: three ? -18 : 0, duration: 600 }); }, [three]);
  useEffect(() => { const m = mapRef.current; if (m?.getLayer("nearby")) m.setLayoutProperty("nearby", "visibility", nearby ? "visible" : "none"); }, [nearby]);

  if (!TOKEN) return <MapPanel selectedKey={station.key} />;
  const pill = "inline-flex items-center gap-1.5 min-h-11 px-4 rounded-md text-sm font-semibold shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]";
  return (
    <div className="relative">
      <div ref={box} role="region" aria-label={`Interactive map centered on ${station.name} station`} data-testid="station-focus-map" className="w-full rounded-2xl overflow-hidden border border-gray-200" style={{ aspectRatio: "1000 / 440" }} />
      <div className="absolute left-3 bottom-3 flex items-center gap-2">
        <button type="button" aria-pressed={!three} onClick={() => setThree(false)} className={`${pill} ${!three ? "bg-[#0057A8] text-white" : "bg-white text-black border border-gray-200"}`}><Waypoints className="w-4 h-4" aria-hidden="true" />2D</button>
        <button type="button" aria-pressed={three} onClick={() => setThree(true)} className={`${pill} ${three ? "bg-[#0057A8] text-white" : "bg-white text-black border border-gray-200"}`}><Box className="w-4 h-4" aria-hidden="true" />3D</button>
        <div className="relative">
          <button type="button" aria-expanded={layers} aria-controls="focus-layers" onClick={() => setLayers((o) => !o)} className={`${pill} bg-white text-black border border-gray-200`}><Layers className="w-4 h-4" aria-hidden="true" />Layers</button>
          {layers && <div id="focus-layers" className="absolute bottom-12 left-0 w-56 rounded-xl bg-white border border-gray-200 shadow-lg p-3"><label className="flex items-center gap-2 min-h-11 text-sm text-black"><input type="checkbox" checked={nearby} onChange={(e) => setNearby(e.target.checked)} className="w-4 h-4" />Nearby stations</label></div>}
        </div>
      </div>
    </div>
  );
}
