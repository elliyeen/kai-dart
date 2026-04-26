"use client";

import { useState, useEffect } from "react";

const WORDS = [
  "Mobility",
  "Customer Service",
  "Station Readiness",
  "Profitability",
  "Safety",
];

const INTERVAL    = 2600; // ms between flips
const FLIP_HALF   = 320;  // ms for each half of the flip

export default function FlipText() {
  const [index, setIndex]         = useState(0);
  const [animClass, setAnimClass] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      // Flip current word out
      setAnimClass("flip-out");
      setTimeout(() => {
        // Swap word, then flip in
        setIndex(i => (i + 1) % WORDS.length);
        setAnimClass("flip-in");
      }, FLIP_HALF);
    }, INTERVAL);

    return () => clearInterval(timer);
  }, []);

  return (
    <span className="inline-block overflow-hidden" style={{ verticalAlign: "bottom" }}>
      <span
        key={index}
        className={animClass}
        style={{
          display: "inline-block",
          color: "white",
        }}
      >
        {WORDS[index]}
      </span>
    </span>
  );
}
