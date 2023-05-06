import type { SkRect, Vector } from "@shopify/react-native-skia";
import { rect, Skia, vec } from "@shopify/react-native-skia";
import { createNoise2D } from "simplex-noise";

const pointOnRect = (t: number, rct: SkRect) => {
  const { x, y, width, height } = rct;
  if (t < 0.25) {
    return vec(x + width * (t * 4), y);
  } else if (t < 0.5) {
    return vec(x + width, y + height * ((t - 0.25) * 4));
  } else if (t < 0.75) {
    return vec(x + width - width * ((t - 0.5) * 4), y + height);
  } else {
    return vec(x, y + height - height * ((t - 0.75) * 4));
  }
};

export const drawNoisyRect = (rct: SkRect) => {
  const sample = 20;
  const F = 1;
  const A = 5;
  const noise = createNoise2D();
  const path = Skia.Path.Make();
  for (let i = 0; i < sample; i++) {
    const t = i / sample;
    const point = pointOnRect(t, rct);
    //  const rPoint =
    const d = A * noise(F * t, 0);
    if (i === 0) {
      path.moveTo(point.x + d, point.y + d);
    } else {
      path.lineTo(point.x + d, point.y + d);
    }
  }
  return path;
};
const TAU = Math.PI * 2

export const drawCircle = (c: Vector) => {
  const noise = createNoise2D()
  const points = 20;
  const r = 30;
  const path = Skia.Path.Make();
  for (let i = 0; i < points; i++) {
    const t = i / points;
    const theta = t * TAU;
    const point = vec(c.x + r * Math.cos(theta), c.y + r * Math.sin(theta));
    const A = 20;
    const F = 3;
    const d = A * noise(F *t, 0)
    if (i === 0) {
      path.moveTo(point.x + d, point.y + d);
    } else {
      path.lineTo(point.x + d, point.y + d);
    }
  }
  // path.addCircle(c.x, c.y, r);
  return path;
};

export const deflate = (rct: SkRect, amount: number) => {
  return rect(
    rct.x + amount,
    rct.y + amount,
    rct.width - amount * 2,
    rct.height - amount * 2
  );
};
