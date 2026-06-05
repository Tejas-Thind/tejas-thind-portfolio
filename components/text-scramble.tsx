"use client";

import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function scrambleText(text: string) {
  return text
    .split("")
    .map((char, index) =>
      char === " " ? " " : CHARS[(index * 7 + text.length * 3) % CHARS.length]
    )
    .join("");
}

export function TextScramble({
  text,
  delay = 0,
  duration = 800,
}: {
  text: string;
  delay?: number;
  duration?: number;
}) {
  const [output, setOutput] = useState(() => scrambleText(text));

  useEffect(() => {
    let raf: number;
    let startTime: number | null = null;
    setOutput(scrambleText(text));

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);

      setOutput(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (progress >= (i + 1) / text.length) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join("")
      );

      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setOutput(text);
      }
    };

    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, duration]);

  return <>{output}</>;
}
