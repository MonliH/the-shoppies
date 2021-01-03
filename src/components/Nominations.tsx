import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import {
  to,
  useTransition,
  useSpring,
  animated,
  useSprings,
  SpringStartFn,
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

interface NominationsProps extends MovieInteraction {
  removeOnClick: (movie: Movie, callback?: () => void) => void;
  nominations: NominationsStore;
  modifiedOrder: ModifiedOrder;
}

interface NominationsInnerProps extends NominationsProps {
  setParentStyle: SpringStartFn<{
    opacity: number;
    height: number;
    width: number;
  }>;
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
  /* Disable selecting because dragging causes it to be buggy */
  user-select: none;
`;

const totalHeight = cardDimensions.height + cardDimensions.TBMargin - 10;

const adjust = (
  order: ModifiedOrder,
  down?: boolean,
  originalIndex?: number,
  curIndex?: number,
  y?: number
) => (index: number) =>
  down && curIndex !== undefined && y !== undefined && index === originalIndex
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

const instant = (heights: Array<number>) => (index: number) => ({
  y: heights[index],
  scale: 1,
  zIndex: "0",
  shadow: 1,
  immediate: true,
});

const NominationsCards = ({
  removeOnClick,
  movieOnInfo,
  modifiedOrder,
  nominations,
  setParentStyle,
}: NominationsInnerProps) => {
  const [previousOrder, setPreviousOrder] = useState<ModifiedOrder>([]);
  const removedMovie = useRef<string>("");

  setParentStyle({
    opacity: previousOrder.length ? 1 : 0,
    height:
      previousOrder.length * totalHeight + (previousOrder.length ? 90 : 0),
    // 40px of margin
    width: (previousOrder.length ? cardDimensions.width : 0) + 40,
  });

  const [springs, setSprings] = useSprings(
    previousOrder.length,
    adjust(previousOrder),
    [previousOrder]
  );

  useEffect(() => {
    setSprings(adjust(previousOrder));
  }, [previousOrder]);

  const transition = useTransition(
    modifiedOrder.map(
      ([dbId, idx], _) => [nominations[dbId], idx] as [Movie, number]
    ),
    {
      from: {
        left: -400,
        opacity: 0,
      },
      enter: ([movie, idx]) => async (next) => {
        setPreviousOrder((ord) => [...ord, [movie.id, idx]]);
        await next({
          left: 0,
          opacity: 1,
        });
      },
      leave: ([movie]) => async (next) => {
        const idIdx = previousOrder.findIndex(([dbId]) => movie.id === dbId);
        const removedIdx = previousOrder[idIdx][1];

        const newOrder = previousOrder
          .filter(([id]) => id !== movie.id)
          .map(
            ([dbId, idx]) =>
              [dbId, idx > removedIdx ? idx - 1 : idx] as [omdbId, number]
          );

        const values = new Array(newOrder.length).fill(0);
        for (const [idx, [, originalIdx]] of newOrder.entries()) {
          values[originalIdx] =
            idx * totalHeight + (idx >= idIdx ? totalHeight : 0);
        }

        newOrder.push([previousOrder[idIdx][0], newOrder.length]);
        values.push(idIdx * totalHeight);

        removedMovie.current = movie.id;

        await setSprings(instant(values));
        setPreviousOrder(newOrder);

        await next({
          left: -400,
          opacity: 0,
        });

        removedMovie.current = "";

        setPreviousOrder(newOrder.slice(0, newOrder.length - 1));
      },
      keys: ([{ id }]: [Movie, number]) => id,
      config: { mass: 1, tension: 170, friction: 26 },
    }
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
      setPreviousOrder((ord) => getNewModifiedOrder(ord));
    } else {
      getNewModifiedOrder(previousOrder);
    }
  }, {});

  return (
    <SelectionsWrapper>
      {transition((style, [movie, idx]) => {
        let props = {};

        const prevIndex = previousOrder.findIndex(([mov]) => mov === movie.id);
        if (
          prevIndex !== -1 &&
          previousOrder[prevIndex][1] !== idx &&
          removedMovie.current === movie.id
        ) {
          idx = previousOrder[prevIndex][1];
        }

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
          props = {
            opacity: 0,
          };
        }

        return (
          <CardWrapper
            {...bindGesture(idx)}
            style={
              {
                ...props,
                ...style,
                left: style.left.to((left) => `${left}px`),
              } as any // Again, a bug in react spring: https://github.com/react-spring/react-spring/issues/1102
            }
            key={movie.id}
          >
            <MovieCard movie={movie} cursor={"grab"}>
              <Button
                onClick={() => {
                  movieOnInfo(movie);
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
  // Make the element invisible if there are no nominations
  const [style, set] = useSpring(() => ({
    opacity: 0,
    height: 0,
    // 40px of margin
    width: 0,
  }));

  return (
    <NominationsDiv
      style={
        style as any // Again, a bug in react spring: https://github.com/react-spring/react-spring/issues/1102
      }
    >
      <Label>Nominated Movies</Label>
      <HelpText>Drag Movies to Rearrange</HelpText>
      <NominationsCards {...props} setParentStyle={set} />
    </NominationsDiv>
  );
};

export default Nominations;
