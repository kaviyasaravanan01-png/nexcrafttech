"use client";

import { useRef } from "react";
import Lottie from "lottie-react";

// Minimal Lottie animations for service icons — self-contained JSON data
// Each animation is a simple geometric shape animation using shape layers

const pulseCircle = (color) => ({
  v: "5.7.0",
  fr: 30,
  ip: 0,
  op: 60,
  w: 64,
  h: 64,
  layers: [
    {
      ty: 4,
      nm: "ring",
      sr: 1,
      ks: {
        o: { a: 1, k: [{ t: 0, s: [60] }, { t: 30, s: [20] }, { t: 60, s: [60] }] },
        s: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 30, s: [120, 120] }, { t: 60, s: [100, 100] }] },
        p: { a: 0, k: [32, 32] },
        a: { a: 0, k: [0, 0] },
        r: { a: 0, k: 0 },
      },
      shapes: [
        {
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [40, 40] },
        },
        {
          ty: "st",
          c: { a: 0, k: hexToLottie(color) },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 2 },
        },
      ],
      ip: 0,
      op: 60,
    },
    {
      ty: 4,
      nm: "dot",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        s: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 15, s: [110, 110] }, { t: 30, s: [100, 100] }] },
        p: { a: 0, k: [32, 32] },
        a: { a: 0, k: [0, 0] },
        r: { a: 0, k: 0 },
      },
      shapes: [
        {
          ty: "el",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [16, 16] },
        },
        {
          ty: "fl",
          c: { a: 0, k: hexToLottie(color) },
          o: { a: 0, k: 100 },
        },
      ],
      ip: 0,
      op: 60,
    },
  ],
});

const spinSquare = (color) => ({
  v: "5.7.0",
  fr: 30,
  ip: 0,
  op: 90,
  w: 64,
  h: 64,
  layers: [
    {
      ty: 4,
      nm: "sq",
      sr: 1,
      ks: {
        o: { a: 0, k: 80 },
        s: { a: 1, k: [{ t: 0, s: [100, 100] }, { t: 45, s: [85, 85] }, { t: 90, s: [100, 100] }] },
        p: { a: 0, k: [32, 32] },
        a: { a: 0, k: [0, 0] },
        r: { a: 1, k: [{ t: 0, s: [0] }, { t: 90, s: [360] }] },
      },
      shapes: [
        {
          ty: "rc",
          p: { a: 0, k: [0, 0] },
          s: { a: 0, k: [24, 24] },
          r: { a: 0, k: 4 },
        },
        {
          ty: "st",
          c: { a: 0, k: hexToLottie(color) },
          o: { a: 0, k: 100 },
          w: { a: 0, k: 2 },
        },
      ],
      ip: 0,
      op: 90,
    },
  ],
});

function hexToLottie(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return [r, g, b, 1];
}

const animations = {
  globe: (color) => pulseCircle(color),
  chart: (color) => spinSquare(color),
  chip: (color) => pulseCircle(color),
  cloud: (color) => spinSquare(color),
  phone: (color) => pulseCircle(color),
  wrench: (color) => spinSquare(color),
};

export default function LottieIcon({ type, color = "#c9a96e", size = 24 }) {
  const lottieRef = useRef(null);
  const animFn = animations[type] || animations.globe;
  const animData = animFn(color);

  return (
    <div
      style={{ width: size, height: size }}
      onMouseEnter={() => lottieRef.current?.goToAndPlay(0)}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animData}
        loop
        autoplay
        style={{ width: size, height: size }}
      />
    </div>
  );
}
