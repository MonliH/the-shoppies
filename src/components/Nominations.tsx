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
  deleted: Array<number>,
  changing: boolean,
  down?: boolean,
  originalIndex?: number,
  curIndex?: number,
  y?: number
) => (index: number) => {
  if (!changing) {
    return down &&
      curIndex !== undefined &&
      y !== undefined &&
      index === originalIndex
      ? {
          y: curIndex * totalHeight + y,
          scale: 1.1,
          zIndex: "1",
          shadow: 15,
          // We don't need to update y because it's dealt with by react-use-gesture
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
  } else {
    return {
      y: deleted[index],
      scale: 1,
      zIndex: "0",
      shadow: 1,
      immediate: false,
    };
  }
};

const instant = (heights: Array<number>) => (index: number) => {
  return {
    y: heights[index],
    scale: 1,
    zIndex: "0",
    shadow: 1,
    immediate: true,
  };
};

const NominationsCards = ({
  removeOnClick,
  movieOnInfo,
  modifiedOrder,
  nominations,
  setParentStyle,
}: NominationsInnerProps) => {
  const [previousOrder, setPreviousOrder] = useState<ModifiedOrder>([]);
  const removedMovie = useRef<[string, Array<number>]>(["", []]);
  const changing = useRef<boolean>(false);

  setParentStyle({
    opacity: modifiedOrder.length ? 1 : 0,
    height:
      modifiedOrder.length * totalHeight + (modifiedOrder.length ? 90 : 0),
    // 40px of margin
    width: (modifiedOrder.length ? cardDimensions.width : 0) + 40,
  });

  const [springs, setSprings] = useSprings(
    previousOrder.length,
    adjust(previousOrder, removedMovie.current[1], changing.current),
    [previousOrder]
  );

  useEffect(() => {
    setSprings(
      adjust(previousOrder, removedMovie.current[1], changing.current)
    );
  }, [previousOrder]); // eslint-disable-line react-hooks/exhaustive-deps

  const transition = useTransition(
    modifiedOrder.map(
      ([dbId, idx], _) => [nominations[dbId], idx] as [Movie, number]
    ),
    {
      from: {
        height: 0,
        opacity: 0,
      },
      enter: ([movie, idx]) => async (next) => {
        setPreviousOrder((ord) => [...ord, [movie.id, idx]]);
        await next({
          height: cardDimensions.height,
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

        const newHeights = new Array(newOrder.length).fill(0);
        const updateHeights = [...newHeights];
        for (const [idx, [, originalIdx]] of newOrder.entries()) {
          newHeights[originalIdx] =
            idx * totalHeight + (idx >= idIdx ? totalHeight : 0);
          updateHeights[originalIdx] = idx * totalHeight;
        }

        newOrder.push([previousOrder[idIdx][0], newOrder.length]);
        newHeights.push(idIdx * totalHeight);

        removedMovie.current = [movie.id, updateHeights];
        changing.current = true;
        await setSprings(instant(newHeights));
        setPreviousOrder(newOrder);

        await next({
          height: 0,
          opacity: 0,
        });

        changing.current = false;

        setPreviousOrder((old) => {
          return old.slice(0, old.length - 1);
        });
        removedMovie.current = ["", []];
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

      setSprings(
        adjust(
          newModifiedOrder,
          removedMovie.current[1],
          changing.current,
          down,
          args[0],
          curIndex,
          y
        )
      );
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
        const changedIdx =
          prevIndex !== -1 &&
          previousOrder[prevIndex][1] !== idx &&
          removedMovie.current[0] === movie.id;

        if (changedIdx) {
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
        }

        return (
          <CardWrapper
            {...bindGesture(idx)}
            style={
              {
                ...props,
                ...style,
                height: style.height.to((height) => `${height}px`),
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
