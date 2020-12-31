import React from "react";
import styled from "styled-components";
import {
  to,
  useTransition,
  useSpring,
  animated,
  SpringStartFn,
  useSprings,
} from "react-spring";
import { useDrag } from "react-use-gesture";
import { X } from "react-feather";

import { Movie, omdbId } from "lib/movieModel";

import MovieCard, {
  cardDimensions,
  MovieInteraction,
} from "components/MovieCard";
import { Button, AnimatedStyledPadding, RemoveButton } from "components/Widget";
import { Label, NormalText } from "components/Text";

export interface NominationsStore {
  [id: string]: Movie;
}

export type ModifiedOrder = Array<[omdbId, number]>;

interface AnimatedProps {
  y: number;
  scale: number;
  zIndex: string;
  shadow: number;
  immediate: any;
}

export type Springs = Array<
  [AnimatedProps, SpringStartFn<AnimatedProps>, () => {}]
>;

interface NominationsProps extends MovieInteraction {
  removeOnClick: (movie: Movie, callback?: () => void) => void;
  nominations: NominationsStore;
  modifiedOrder: ModifiedOrder;
  setModifiedOrder: (mut: (newVal: ModifiedOrder) => ModifiedOrder) => void;
}

const NominationsDiv = styled(AnimatedStyledPadding)`
  background-color: #f0f0f0;
  width: 0px;
  z-index: 5;
  margin-top: 20px;
  /* Hide because we're animating width */
  overflow: hidden;
`;

const HelpText = styled(NormalText)`
  font-size: 14px;
`;

const CardWrapper = styled(animated.div)`
  overflow: hidden;
  position: absolute;
  top: 0;
  left: 0;
`;

const SelectionsWrapper = styled.div`
  position: relative;
`;

const totalHeight = cardDimensions.height + cardDimensions.TBMargin - 10;

const adjust = (
  order: ModifiedOrder,
  down?: boolean,
  originalIndex?: number,
  curIndex?: number,
  y?: number
) => (index: number) =>
  down && curIndex && y && index === originalIndex
    ? {
        y: curIndex * totalHeight + y,
        scale: 1.1,
        zIndex: "1",
        shadow: 15,
        // We don't need to update y because it's delt with by react-use-gesture
        // We don't need to animate z-index either
        immediate: (n: string) => n === "y" || n === "zIndex",
      }
    : {
        y: order.findIndex(([, idx]) => idx === index) * totalHeight,
        scale: 1,
        zIndex: "0",
        shadow: 1,
        immediate: false,
      };

const NominationsCards = ({
  removeOnClick,
  movieOnClick,
  modifiedOrder,
  setModifiedOrder,
  nominations,
}: NominationsProps) => {
  const transition = useTransition(
    modifiedOrder.map(
      ([dbId, idx], _) => [nominations[dbId], idx] as [Movie, number]
    ),
    {
      from: {
        height: 0,
        opacity: 0,
      },
      enter: {
        height: cardDimensions.height,
        opacity: 1,
      },
      leave: {
        height: 0,
        opacity: 0,
      },
      keys: ([{ id }]: [Movie, number]) => id,
      config: { mass: 1, tension: 170, friction: 26 },
    }
  );

  const [springs, setSprings] = useSprings(
    modifiedOrder.length,
    adjust(modifiedOrder),
    [modifiedOrder]
  );

  const bindGesture = useDrag((props) => {
    const getNewModifiedOrder = (modifiedOrd: ModifiedOrder) => {
      const {
        args,
        down,
        movement: [, y],
      } = props;
      const curIndex = modifiedOrd.findIndex(([, idx]) => idx === args[0]);
      const curRow = Math.min(
        Math.max(Math.round((curIndex * totalHeight + y) / totalHeight), 0),
        modifiedOrd.length - 1
      );
      let newModifiedOrder = [...modifiedOrd];

      // Move element at curIndex to curRow;
      const element = newModifiedOrder[curIndex]; // Copy the element
      if (!element) return [];
      newModifiedOrder.splice(curIndex, 1); // Remove it from the array
      newModifiedOrder.splice(curRow, 0, element); // Insert at curRow

      setSprings(adjust(newModifiedOrder, down, args[0], curIndex, y));
      return newModifiedOrder;
    };

    if (!props.down) {
      setModifiedOrder((modifiedOrd: ModifiedOrder) =>
        getNewModifiedOrder(modifiedOrd)
      );
    } else {
      getNewModifiedOrder(modifiedOrder);
    }
  });

  return (
    <SelectionsWrapper>
      {transition((style, [movie, idx]) => {
        let props = {};
        if (springs[idx]) {
          const { zIndex, shadow, y, scale } = springs[idx];
          props = {
            zIndex,
            boxShadow: shadow.to(
              (s: number) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
            ),
            transform: to(
              [y, scale],
              (y, s) => `translate3d(0, ${y}px, 0) scale(${s})`
            ),
          };
        } else {
          const y =
            modifiedOrder.findIndex((val) => val[0] === movie.id) * totalHeight;
          props = {
            transform: `translate3d(0, ${y}, 0)`,
          };
        }

        return (
          <CardWrapper
            {...bindGesture(idx)}
            style={
              {
                ...style,
                ...props,
              } as any // Again, a bug in react spring: https://github.com/react-spring/react-spring/issues/1102
            }
            key={movie.id}
          >
            <MovieCard movie={movie} movieOnClick={() => {}} cursor={"grab"}>
              <Button
                onClick={() => {
                  movieOnClick(movie);
                }}
              >
                More Info
              </Button>
              <RemoveButton
                onClick={() => {
                  removeOnClick(movie);
                }}
                marginTop={7}
                marginRight={7}
              >
                <X size={20} />
              </RemoveButton>
            </MovieCard>
          </CardWrapper>
        );
      })}
    </SelectionsWrapper>
  );
};

const Nominations = (props: NominationsProps) => {
  const len = props.modifiedOrder.length;
  // Make the element invisible if there are no nominations
  const style = useSpring({
    opacity: len ? 1 : 0,
    height: len * totalHeight + (len ? 90 : 0),
    // 40px of margin
    width: (len ? cardDimensions.width : 0) + 40,
  });

  return (
    <NominationsDiv
      style={
        style as any // Again, a bug in react spring: https://github.com/react-spring/react-spring/issues/1102
      }
    >
      <Label>Nominated Movies</Label>
      <HelpText>Drag Movies to Rearrange</HelpText>
      <NominationsCards {...props} />
    </NominationsDiv>
  );
};

export default Nominations;
