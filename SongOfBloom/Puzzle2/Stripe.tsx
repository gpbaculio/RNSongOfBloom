import type { SkRect, SkiaValue, Vector } from "@shopify/react-native-skia";
import {
  rect,
  runTiming,
  useComputedValue,
  Easing,
  runSpring,
  mix,
  Vertices,
  useValue,
  vec,
} from "@shopify/react-native-skia";
import { createNoise2D, createNoise3D } from "simplex-noise";

import { Skeleton } from "./Skeleton";
import { Skia } from "@shopify/react-native-skia/lib/typescript/src/skia/types";

const pad = 6;

const generateTrianglePointsAndIndices = (
  rct: SkRect,
  triangleNumberHeight: number
) => {
  const vertices: Vector[] = [];
  const textures: Vector[] = [];
  const indices: number[] = [];

  // Calculate the size of the triangles based on the given number
  const triangleWidth = rct.width;
  const triangleHeight = rct.height / triangleNumberHeight;

  // Generate the list of points
  for (let i = 0; i <= triangleNumberHeight; i++) {
    for (let j = 0; j <= 1; j++) {
      const point: Vector = vec(
        rct.x + j * triangleWidth,
        rct.y + i * triangleHeight
      );
      textures.push(point);
      vertices.push(point);
    }
  }

  // Generate the list of triangle indices
  for (let i = 0; i < triangleNumberHeight; i++) {
    const topLeftIndex = i * 2;
    const topRightIndex = topLeftIndex + 1;
    const bottomLeftIndex = topLeftIndex + 2;
    const bottomRightIndex = bottomLeftIndex + 1;

    // Create two triangles for each square and add their indices to the list
    indices.push(topLeftIndex, topRightIndex, bottomLeftIndex);
    indices.push(bottomLeftIndex, topRightIndex, bottomRightIndex);
  }

  return { vertices, indices, textures };
};

interface StripeProps {
  index: number;
  clock: SkiaValue<number>;
  stripeWidth: number;
  numberOfStripes: number;
  height: number;
  amplitude: SkiaValue<number>;
  previousIndex: SkiaValue<number>;
  currentIndex: SkiaValue<number>;
}

export const Stripe = ({
  index,
  clock,
  stripeWidth,
  numberOfStripes,
  height,
  amplitude,
  currentIndex,
  previousIndex,
}: StripeProps) => {
  const f = useValue(1);
  const noise = createNoise2D();
  const x = index * stripeWidth;
  const rct = rect(x, 0, stripeWidth - 5, height);
  const { vertices, indices, textures } = generateTrianglePointsAndIndices(
    rct,
    20
  );
  const animatedVertices = useComputedValue(() => {
    if (
      currentIndex.current === index &&
      currentIndex.current !== previousIndex.current
    ) {
      runTiming(f, 2, { duration: 100 }, () => {
        runSpring(f, 1);
      });
    }

    return vertices.map((vertex, i) => {
      const A = 5;
      const fx = 50;
      const fy = 0.0005;
      const F = 1;
      const d =
        amplitude.current *
        A *
        noise((fx * i) / vertices.length, f.current * fy * clock.current);
      return vec(vertex.x + d, vertex.y + d);
    });
  }, [clock]);
  return (
    <>
      <Vertices
        vertices={animatedVertices}
        textures={textures}
        indices={indices}
      />
      {/* <Skeleton vertices={vertices} indices={indices} /> */}
    </>
  );
};
