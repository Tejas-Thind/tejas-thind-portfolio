"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const SYMBOLS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ03579@#%&*+∆ΩΣΦΨπλ∞≈◆◇●○■□▲△▽✦✧⬡⬢";
const PUNCTUATION_SYMBOLS: Record<string, string> = {
  ",": ",.;·",
  "'": "'’`ˊ˙",
};
const INITIAL_PRE_ROLL = 180;
const INITIAL_CYCLE_INTERVAL = 72;
const COLORS = [
  "var(--scramble-cyan)",
  "var(--scramble-blue)",
  "var(--scramble-coral)",
  "var(--scramble-violet)",
  "var(--scramble-amber)",
  "var(--scramble-green)",
];
const TYPE_VARIANTS = [
  {
    fontFamily: "var(--font-geist-mono)",
    fontStyle: "normal",
    fontWeight: 400,
  },
  {
    fontFamily: "var(--font-rubik)",
    fontStyle: "normal",
    fontWeight: 400,
  },
  {
    fontFamily: "var(--font-newsreader)",
    fontStyle: "italic",
    fontWeight: 500,
  },
  {
    fontFamily: "var(--font-geist-mono)",
    fontStyle: "normal",
    fontWeight: 500,
  },
] as const;

type LetterState = {
  char: string;
  colorIndex: number | null;
  variantIndex: number | null;
  settled: boolean;
};

function settledLetter(char: string): LetterState {
  return {
    char,
    colorIndex: null,
    variantIndex: null,
    settled: true,
  };
}

function symbolSetFor(char: string) {
  return PUNCTUATION_SYMBOLS[char] ?? SYMBOLS;
}

function initialLetters(text: string): LetterState[] {
  return Array.from(text).map((char, index) => {
    if (char === " ") return settledLetter(char);
    const symbolSet = symbolSetFor(char);
    return {
      char: symbolSet[(index * 11 + text.length * 5) % symbolSet.length],
      colorIndex: (index * 3 + text.length) % COLORS.length,
      variantIndex: (index * 5 + text.length) % TYPE_VARIANTS.length,
      settled: false,
    };
  });
}

function randomLetter(symbolSet = SYMBOLS): LetterState {
  return {
    char: symbolSet[Math.floor(Math.random() * symbolSet.length)],
    colorIndex: Math.floor(Math.random() * COLORS.length),
    variantIndex: Math.floor(Math.random() * TYPE_VARIANTS.length),
    settled: false,
  };
}

export function TextScramble({
  text,
  delay = 0,
  duration = 800,
  loopInterval = 0,
  emphasisStart,
}: {
  text: string;
  delay?: number;
  duration?: number;
  loopInterval?: number;
  emphasisStart?: number;
}) {
  const characters = useMemo(() => Array.from(text), [text]);
  const [letters, setLetters] = useState<LetterState[]>(() =>
    initialLetters(text)
  );
  const [hasStarted, setHasStarted] = useState(false);
  const sequenceTimers = useRef<number[]>([]);
  const sequenceIntervals = useRef<number[]>([]);
  const hoverTimers = useRef<Record<number, number>>({});
  const sequenceActive = useRef(false);
  const reducedMotion = useRef(false);
  const initialRun = useRef(true);
  const loopTimer = useRef<number | null>(null);
  const runScrambleRef = useRef<(originIndex?: number) => void>(() => {});

  const clearSequence = useCallback(() => {
    sequenceTimers.current.forEach(window.clearTimeout);
    sequenceTimers.current = [];
    sequenceIntervals.current.forEach(window.clearInterval);
    sequenceIntervals.current = [];
    sequenceActive.current = false;
  }, []);

  const clearHoverTimers = useCallback(() => {
    Object.values(hoverTimers.current).forEach(window.clearInterval);
    hoverTimers.current = {};
  }, []);

  const clearLoop = useCallback(() => {
    if (loopTimer.current !== null) {
      window.clearTimeout(loopTimer.current);
      loopTimer.current = null;
    }
  }, []);

  const setLetter = useCallback((index: number, letter: LetterState) => {
    setLetters((current) => {
      const next = [...current];
      next[index] = letter;
      return next;
    });
  }, []);

  const runScramble = useCallback((originIndex = 0) => {
    if (reducedMotion.current) return;

    const isInitialRun = initialRun.current;
    initialRun.current = false;
    const sequenceDuration = isInitialRun ? duration * 0.88 : duration;
    const staggerStep = isInitialRun ? 70 : 82;
    clearLoop();
    clearSequence();
    clearHoverTimers();
    sequenceActive.current = true;
    if (isInitialRun) {
      setHasStarted(false);
      setLetters(initialLetters(text));
      sequenceTimers.current.push(
        window.setTimeout(() => setHasStarted(true), INITIAL_PRE_ROLL)
      );
    } else {
      setHasStarted(true);
      setLetters(
        characters.map((character, index) => {
          if (character === " ") return settledLetter(character);
          return index === originIndex
            ? randomLetter(symbolSetFor(character))
            : settledLetter(character);
        })
      );
    }

    if (isInitialRun) {
      sequenceIntervals.current.push(
        window.setInterval(() => {
          setLetters((current) =>
            current.map((letter, index) => {
              const character = characters[index];
              if (character === " " || letter.settled) return letter;
              return randomLetter(symbolSetFor(character));
            })
          );
        }, INITIAL_CYCLE_INTERVAL)
      );

      characters.forEach((character, index) => {
        if (character === " ") return;
        sequenceTimers.current.push(
          window.setTimeout(() => {
            setLetter(index, settledLetter(character));
          }, sequenceDuration + index * staggerStep)
        );
      });
    } else {
      characters.forEach((character, index) => {
        if (character === " ") return;

        const steps = 11 + (index % 4);
        const stagger = Math.abs(index - originIndex) * staggerStep;

        for (let step = 0; step < steps; step += 1) {
          const progress = (step + 1) / steps;
          const at =
            stagger + sequenceDuration * Math.pow(progress, 1.55);
          sequenceTimers.current.push(
            window.setTimeout(() => {
              setLetter(index, randomLetter(symbolSetFor(character)));
            }, at)
          );
        }

        sequenceTimers.current.push(
          window.setTimeout(() => {
            setLetter(index, settledLetter(character));
          }, stagger + sequenceDuration + 70)
        );
      });
    }

    const totalDuration =
      sequenceDuration +
      Math.max(0, characters.length - 1) * staggerStep +
      90;
    sequenceTimers.current.push(
      window.setTimeout(() => {
        sequenceIntervals.current.forEach(window.clearInterval);
        sequenceIntervals.current = [];
        sequenceActive.current = false;
      }, totalDuration)
    );
    if (loopInterval > 0) {
      loopTimer.current = window.setTimeout(() => {
        runScrambleRef.current(0);
      }, loopInterval);
    }
  }, [
    characters,
    clearHoverTimers,
    clearLoop,
    clearSequence,
    duration,
    loopInterval,
    setLetter,
    text,
  ]);
  runScrambleRef.current = runScramble;

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    reducedMotion.current = motionQuery.matches;

    if (motionQuery.matches) {
      clearLoop();
      initialRun.current = false;
      setHasStarted(true);
      setLetters(characters.map(settledLetter));
    } else {
      initialRun.current = true;
      setHasStarted(false);
      sequenceTimers.current.push(
        window.setTimeout(
          runScramble,
          Math.max(0, delay - INITIAL_PRE_ROLL)
        )
      );
    }

    const onMotionChange = (event: MediaQueryListEvent) => {
      reducedMotion.current = event.matches;
      clearLoop();
      clearSequence();
      clearHoverTimers();
      if (event.matches) {
        initialRun.current = false;
        setHasStarted(true);
        setLetters(characters.map(settledLetter));
      } else {
        initialRun.current = true;
        runScramble();
      }
    };

    motionQuery.addEventListener("change", onMotionChange);
    return () => {
      motionQuery.removeEventListener("change", onMotionChange);
      clearLoop();
      clearSequence();
      clearHoverTimers();
    };
  }, [
    characters,
    clearHoverTimers,
    clearLoop,
    clearSequence,
    delay,
    runScramble,
  ]);

  const startLetterHover = (index: number) => {
    if (
      reducedMotion.current ||
      sequenceActive.current ||
      characters[index] === " "
    ) {
      return;
    }

    window.clearInterval(hoverTimers.current[index]);
    setLetter(index, randomLetter(symbolSetFor(characters[index])));
    hoverTimers.current[index] = window.setInterval(() => {
      setLetter(index, randomLetter(symbolSetFor(characters[index])));
    }, 84);
  };

  const stopLetterHover = (index: number) => {
    window.clearInterval(hoverTimers.current[index]);
    delete hoverTimers.current[index];
    if (!sequenceActive.current) {
      setLetter(index, settledLetter(characters[index]));
    }
  };

  return (
    <>
      <span className="sr-only">{text}</span>
      <span
        className={`inline-flex cursor-pointer select-none transition-opacity duration-150 ${
          hasStarted ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
        data-scramble-text={text}
        onClick={(event) => {
          const target =
            event.target instanceof Element
              ? event.target.closest<HTMLElement>("[data-scramble-index]")
              : null;
          const originIndex = Number(target?.dataset.scrambleIndex);
          runScramble(Number.isInteger(originIndex) ? originIndex : 0);
        }}
      >
        {letters.map((letter, index) => {
        const character = characters[index];
        if (character === " ") {
          return (
            <span
              key={`${character}-${index}`}
              className="inline-block w-[0.22em]"
              aria-hidden="true"
            />
          );
        }

        const variant =
          letter.variantIndex === null
            ? null
            : TYPE_VARIANTS[letter.variantIndex];
        const isPunctuation =
          character === "," || character === "'";
        const animatedStyle = letter.settled
          ? emphasisStart !== undefined && index >= emphasisStart
            ? { fontWeight: 500 }
            : undefined
          : {
              color:
                letter.colorIndex === null
                  ? undefined
                  : COLORS[letter.colorIndex],
              fontFamily: variant?.fontFamily,
              fontStyle: variant?.fontStyle,
              fontWeight: variant?.fontWeight,
              fontSize: isPunctuation ? "0.62em" : "0.78em",
            };

        return (
          <span
            key={`${character}-${index}`}
            className={`relative inline-block overflow-visible text-center ${
              isPunctuation ? "" : "min-w-[0.42em]"
            } ${letter.settled ? "z-0" : "z-10"
            }`}
            data-scramble-index={index}
            aria-hidden="true"
            onMouseEnter={() => startLetterHover(index)}
            onMouseLeave={() => stopLetterHover(index)}
          >
            <span className="invisible">{character}</span>
            <span
              className="absolute inset-0 flex items-center justify-center whitespace-nowrap transition-colors duration-100"
              style={animatedStyle}
            >
              {letter.char}
            </span>
          </span>
        );
        })}
      </span>
    </>
  );
}
