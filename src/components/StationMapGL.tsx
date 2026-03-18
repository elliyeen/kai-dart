"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface Props {
  lat: number;
  lng: number;
  stationName: string;
  lineColor: string;
  token: string;
}

export default function StationMapGL({ lat, lng, stationName, lineColor, token }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef      = useRef<mapboxgl.Map | null>(null);
  const markerRef   = useRef<mapboxgl.Marker | null>(null);

  /* ── Init map once ───────────────────────────────── */
  useEffect(() => {
    if (!containerRef.current || !token) return;
    mapboxgl.accessToken = token;

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [lng, lat],
      zoom: 15.5,
      pitch: 50,
      bearing: -15,
      antialias: true,
    });

    map.addControl(
      new mapboxgl.NavigationControl({ showCompass: true, visualizePitch: true }),
      "bottom-right"
    );

    /* Custom coloured marker */
    const el = Object.assign(document.createElement("div"), {
      title: stationName,
    });
    el.style.cssText = `
      width:16px; height:16px; border-radius:50%;
      background:${lineColor}; border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.45); cursor:pointer;
    `;

    const marker = new mapboxgl.Marker({ element: el })
      .setLngLat([lng, lat])
      .setPopup(
        new mapboxgl.Popup({ offset: 18, closeButton: false, className: "kai-map-popup" })
          .setHTML(`<span style="font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:.04em">${stationName}</span>`)
      )
      .addTo(map);

    mapRef.current    = map;
    markerRef.current = marker;

    return () => {
      marker.remove();
      map.remove();
      mapRef.current    = null;
      markerRef.current = null;
    };
  // token is stable — only init once
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  /* ── Fly to new station when selection changes ────── */
  useEffect(() => {
    const map    = mapRef.current;
    const marker = markerRef.current;
    if (!map || !marker) return;

    map.flyTo({
      center: [lng, lat],
      zoom: 15.5,
      pitch: 50,
      bearing: -15,
      duration: 1100,
      essential: true,
    });
    marker.setLngLat([lng, lat]);
    marker.getElement().style.background = lineColor;
    marker.getPopup()?.setHTML(
      `<span style="font-family:'Barlow Condensed',sans-serif;font-size:12px;font-weight:600;letter-spacing:.04em">${stationName}</span>`
    );
  }, [lat, lng, lineColor, stationName]);

  return <div ref={containerRef} style={{ width: "100%", height: 240 }} />;
}
