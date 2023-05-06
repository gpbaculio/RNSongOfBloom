/* eslint-disable @typescript-eslint/no-var-requires */
import {
  Shadow,
  rect,
  useImage,
  PathOp,
  Canvas,
  Path,
  Skia,
  useTouchHandler,
  useValue,
  Image,
} from "@shopify/react-native-skia";
import React from "react";
import { Dimensions } from "react-native";
import { drawCircle } from "./Tools";

const { width, height } = Dimensions.get("window");
const rct = rect(0, 0, width, height);

export const Puzzle1 = () => {
  const path = useValue(Skia.Path.Make());
  const bg = useImage(require("./assets/bg.png"));
  const mask = useImage(require("./assets/mask.png"));
  const onTouch = useTouchHandler({
    onActive: (e) => {
      path.current = Skia.Path.MakeFromOp(
        path.current,
        drawCircle(e),
        PathOp.Union
      )!;
    },
  });
  if (!bg || !mask) {
    return null;
  }
  return (
    <Canvas style={{ width, height }} onTouch={onTouch}>
      <Image image={bg} rect={rct} />
      <Path path={path} color='white'>
        <Shadow dx={0} dy={0} color='black' blur={3} inner />
      </Path>
      <Image image={mask} rect={rct} />
    </Canvas>
  );
};
