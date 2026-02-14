"use client";

import { useEffect, useState } from "react";

const frames = [
  "     ",
  "     ",
  "     ",
  "     ",
  "t    ",
  "te   ",
  "tex  ",
  "text ",
  "Text ",
  "eTxt ",
  "exTt ",
  "extT ",
  "extt ",
  "extt.",
];

export const ExttLogo = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((frame) => {
        if (frame === frames.length - 1) {
          clearInterval(interval);
          return frame;
        }
        return (frame + 1) % frames.length;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-4xl font-semibold">
      {(frames[frame] ?? "").split("").map((c, i) => (
        <span key={i} className={c === "T" ? "bg-blue-400 text-white" : ""}>
          {c === " " ? "_" : c}
        </span>
      ))}
    </div>
  );
};
