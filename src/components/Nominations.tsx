import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import {
  to,
  useTransition,
  useSpring,
  useSprings,
  animated,
} from "react-spring";
import { useDrag } from "react-use-gesture";
import { X } from "react-feather";

import { Movie, omdbId } from "lib/movieModel";

import MovieCard, {
  cardDimensions,
  MovieInteraction,
} from "components/MovieCard";
import { Button, AnimatedStyledPadding, RemoveButton } from "components/Widget";
import { Label, NormalText, NormalTextSmall } from "components/Text";
import { HorizontalWrapper } from "components/Wrappers";

export interface NominationsStore {
  [id: string]: Movie;
}

export type ModifiedOrder = Array<[omdbId, number]>;

interface NominationsProps extends MovieInteraction {
  removeOnClick: (movie: Movie, callback?: () => void) => void;
  nominations: NominationsStore;
  modifiedOrder: ModifiedOrder;
}

const HelpText = styled(NormalText)`
  font-size: 14px;
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
  }
  return {
    y: deleted[index],
    scale: 1,
    zIndex: "0",
    shadow: 1,
    immediate: false,
  };
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
}: NominationsProps) => {
  const [previousOrder, setPreviousOrder] = useState<ModifiedOrder>([]);
  const removedMovie = useRef<[string, Array<number>]>(["", []]);
  const changing = useRef<boolean>(false);

  const [springs, setSprings] = useSprings(
    previousOrder.length,
    adjust(previousOrder, removedMovie.current[1], changing.current),
    [previousOrder]
  );

  useEffect(() => {
    setSprings(
      adjust(previousOrder, removedMovie.current[1], changing.current)
    );
  }, [previousOrder]);

  const transition = useTransition(
    modifiedOrder.map(
      ([dbId, idx]) => [nominations[dbId], idx] as [Movie, number]
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
        newOrder.forEach(([, originalIdx], idx) => {
          newHeights[originalIdx] =
            idx * totalHeight + (idx >= idIdx ? totalHeight : 0);
          updateHeights[originalIdx] = idx * totalHeight;
        });

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

        setPreviousOrder((old) => old.slice(0, old.length - 1));
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
      const newModifiedOrder = [...modifiedOrd];

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
        let newIdx = idx;

        const prevIndex = previousOrder.findIndex(([mov]) => mov === movie.id);
        const changedIdx =
          prevIndex !== -1 &&
          previousOrder[prevIndex][1] !== newIdx &&
          removedMovie.current[0] === movie.id;

        if (changedIdx) {
          const [, originalIdx] = previousOrder[prevIndex];
          newIdx = originalIdx;
        }

        if (springs[newIdx]) {
          const { zIndex, shadow, y, scale } = springs[newIdx];
          props = {
            zIndex,
            boxShadow: shadow.to(
              (s: number) => `rgba(0, 0, 0, 0.15) 0px ${s}px ${2 * s}px 0px`
            ),
            transform: to(
              [y, scale],
              // Use translate because it is much more performant than setting top
              // (the 3d part in translate3d speeds up the transitions sometimes
              // because it uses the GPU, even though we're not setting the z
              // translation)
              (yp, s) => `translate3d(10px, ${yp}px, 0) scale(${s})`
            ),
          };
        }

        return (
          <MovieCard
            key={movie.id}
            movie={movie}
            cursor="grab"
            otherProps={{
              ...bindGesture(newIdx),
              style: {
                top: 0,
                left: 0,
                position: "absolute",
                padding: 15,
                ...props,
                ...style,
                height: style.height.to((height) => `${height}px`),
              } as any,
              // The `as any` cast is required because of a bug in react-spring.
              // See this https://github.com/react-spring/react-spring/issues/1102
            }}
          >
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
        );
      })}
    </SelectionsWrapper>
  );
};

const MovieRankNumber = animated(styled(NormalTextSmall)`
  display: block;
  margin: 0;
  padding-top: 3px;
  font-size: 13px;
  font-weight: 600;
`);

const NominationsNumbers = ({ length }: { length: number }) => {
  const orderNumbers = Array.from(Array(length).keys());
  const hidden = { opacity: 0, height: 0 };
  const transition = useTransition(orderNumbers, {
    from: hidden,
    enter: { opacity: 1, height: totalHeight },
    leave: hidden,
    keys: (idx: number) => idx,
  });

  return (
    <div>
      {transition((style, idx) => {
        return (
          <MovieRankNumber style={{ ...style } as any}>
            {idx + 1}.
          </MovieRankNumber>
        );
      })}
    </div>
  );
};

const NumbersWrapper = styled(HorizontalWrapper)`
  margin: 0;
  width: ${21 + cardDimensions.width}px;
`;

const LabelWrapper = styled.div`
  margin: 0;
  margin-left: 21px;
  width: ${cardDimensions.width}px;
`;

const NominationsDiv = styled(AnimatedStyledPadding)`
  background-color: #f0f0f0;
  width: 0px;
  z-index: 5;
  margin-top: 20px;
  /* Hide because we're animating width */
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerWrapper = styled.div`
  margin-left: -6px;
`;

const Nominations = ({
  removeOnClick,
  nominations,
  modifiedOrder,
  movieOnInfo,
}: NominationsProps) => {
  // Make the element invisible if there are no nominations
  const style = useSpring({
    opacity: modifiedOrder.length ? 1 : 0,
    height:
      modifiedOrder.length * totalHeight + (modifiedOrder.length ? 130 : 0),
    width:
      (modifiedOrder.length ? cardDimensions.width : 0) +
      (modifiedOrder.length ? 60 : 0), // 75px of margin
  });

  return (
    <NominationsDiv
      style={
        style as any // Again, a bug in react spring: https://github.com/react-spring/react-spring/issues/1102
      }
    >
      <InnerWrapper>
        <LabelWrapper>
          <Label>Nominated Movies</Label>
          <HelpText>Drag Movies to Rearrange</HelpText>
        </LabelWrapper>
        <NumbersWrapper>
          <NominationsNumbers length={modifiedOrder.length} />
          <NominationsCards
            removeOnClick={removeOnClick}
            nominations={nominations}
            modifiedOrder={modifiedOrder}
            movieOnInfo={movieOnInfo}
          />
        </NumbersWrapper>
      </InnerWrapper>
    </NominationsDiv>
  );
};

export default Nominations;
