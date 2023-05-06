/* eslint-disable @typescript-eslint/no-var-requires */

import {
  runTiming,
  Fill,
  Image,
  useComputedValue,
  useClockValue,
  useValue,
  Canvas,
  Group,
  ImageShader,
  rect,
  useImage,
  useTouchHandler,
} from '@shopify/react-native-skia';
import React from 'react';
import {Dimensions} from 'react-native';

import {Stripe} from './Stripe';

const screen = Dimensions.get('screen');
const frameAspectRatio = 1621 / 1244;
const frameWidth = 350;
const frameRect = rect(
  (screen.width - frameWidth) / 2,
  64,
  frameWidth,
  frameWidth * frameAspectRatio,
);

const width = 225;
const aspectRatio = 1317 / 783;
const height = width * aspectRatio;
const pictureRect = rect((screen.width - width) / 2, 100, width, height);
const numberOfStripes = 10;
const stripeWidth = width / numberOfStripes;
const stripes = new Array(numberOfStripes).fill(0).map((_, i) => i);

export const Puzzle2 = () => {
  const y = useValue(0);
  const offset = useValue(0);
  const amplitude = useValue(1);
  const currentIndex = useValue(-1);
  const previousIndex = useValue(-1);

  const background = useImage(require('../assets/bg.jpg'));
  const frame = useImage(require('../assets/frame.png'));
  const picture = useImage(require('../assets/art1.jpg'));
  const clock = useClockValue();
  const onTouch = useTouchHandler({
    onStart: e => {
      offset.current = y.current - e.y;
    },
    onActive: e => {
      previousIndex.current = currentIndex.current;
      currentIndex.current = Math.round((e.x - pictureRect.x) / stripeWidth);
      const newY = offset.current + e.y;
      if (newY > y.current) {
        y.current = newY;
      }
    },
    onEnd: e => {
      if (y.current + pictureRect.y > frameRect.y + frameRect.height - 40) {
        runTiming(y, screen.height, {duration: 650});
        runTiming(amplitude, 8);
      }
      previousIndex.current = -1;
      currentIndex.current = -1;
    },
  });
  const transform = useComputedValue(() => [{translateY: y.current}], [y]);
  if (!picture || !frame || !background) {
    return null;
  }
  return (
    <Canvas style={{flex: 1}} onTouch={onTouch}>
      <Fill color="#FDF8F7" />
      <Image image={background} rect={pictureRect} fit="cover" />
      <Group transform={transform}>
        <Group
          transform={[
            {translateX: pictureRect.x},
            {translateY: pictureRect.y + 10},
          ]}>
          <ImageShader
            image={picture}
            rect={rect(0, 0, width, height)}
            fit="fill"
          />
          {stripes.map(index => (
            <Stripe
              key={index}
              index={index}
              clock={clock}
              stripeWidth={stripeWidth}
              height={height}
              numberOfStripes={numberOfStripes}
              amplitude={amplitude}
              previousIndex={previousIndex}
              currentIndex={currentIndex}
            />
          ))}
        </Group>
      </Group>
      <Group
        clip={rect(
          frameRect.x,
          frameRect.y,
          frameRect.width,
          frameRect.height - 10,
        )}>
        <Group transform={transform}>
          <Image
            image={picture}
            rect={rect(pictureRect.x, pictureRect.y, width, height)}
            fit="fill"
          />
        </Group>
      </Group>
      <Image image={frame} rect={frameRect} />
    </Canvas>
  );
};
