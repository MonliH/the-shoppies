import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import {
  to,
  useTransition,
  useSpring,
  useSprings,
  AnimatedProps,
} from "react-spring";
import { useDrag } from "react-use-gesture";
import { X } from "react-feather";

import { Movie, omdbId } from "lib/movieModel";
import { usePersistedState } from "hooks/usePersisted";

import MovieCard, {
  cardDimensions,
  MovieInteraction,
} from "components/MovieCard";
import { Button, AnimatedStyledPadding, RemoveButton } from "components/Widget";
import { Label, NormalText } from "components/Text";

export type NominationsStore = Record<string, Movie>;

export type ModifiedOrder = Array<[omdbId, number]>;

interface NominationsCardsProps extends MovieInteraction {
  removeOnClick: (movie: Movie, callback?: () => void) => void;
  nominations: NominationsStore;
  modifiedOrder: ModifiedOrder;
}

interface NominationsProps extends NominationsCardsProps {
  customStyle?: AnimatedProps<HTMLDivElement>["style"];
}

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
          scale: 1.08,
          zIndex: "1",
          shadow: 15,
          // We don't need to update y because it's dealt with by react-use-gesture
          // We don't need to animate z-index either
          immediate: (prop: string) => prop === "y" || prop === "zIndex",
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
}: NominationsCardsProps) => {
  const [previousOrder, setPreviousOrder] = usePersistedState<ModifiedOrder>(
    [],
    "previousOrder"
  );

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
        // If the id isn't already in the array
        if (previousOrder.findIndex(([id]) => id === movie.id) === -1) {
          setPreviousOrder(
            (ord: ModifiedOrder) =>
              [...ord, [movie.id, idx]] as Array<[string, number]>
          );
        }
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

  const bindGesture = useDrag(
    (props) => {
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
    },
    { filterTaps: true, axis: "y" }
  );

  return (
    <SelectionsWrapper>
      {transition((style, [movie, idx]) => {
        let props: Record<string, any> = {};
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
              // Use translate because it is much more performant than setting
              // top (the 3d part in translate3d speeds up the transitions
              // because it uses the GPU, even though we're not setting the z
              // translation)
              (yp, s) => `translate3d(0px, ${yp}px, 0) scale(${s})`
            ),
          };
        }

        return (
          <MovieCard
            key={movie.id}
            movie={movie}
            cursor="grab"
            headingStyle={{
              paddingRight: "25px", // This is to give space to the delete button
            }}
            otherProps={{
              ...bindGesture(newIdx),
              style: {
                top: 0,
                left: 0,
                position: "absolute",
                padding: 15,
                touchAction: "pan-x",
                zIndex: removedMovie.current[0] === movie.id ? 20 : 21,
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
              data-testid={`more-info-${movie.id}`}
            >
              More Info
            </Button>
            <RemoveButton
              onClick={() => {
                removeOnClick(movie);
              }}
              marginTop={7}
              marginRight={7}
              data-testid={`remove-button-${movie.id}`}
            >
              <X size={20} />
            </RemoveButton>
          </MovieCard>
        );
      })}
    </SelectionsWrapper>
  );
};

const NominationsDiv = styled(AnimatedStyledPadding)`
  background-color: #f0f0f0;
  width: 0px;
  z-index: 5;
  margin-top: 5px;
  /* Hide because we're animating width */
  overflow: hidden;
`;

export const getWidth = (length: number) => {
  return (length ? cardDimensions.width : 0) + (length ? 40 : 0); // Add 40px of marign
};

const BigLabel = styled(Label)`
  font-size: 17px;
`;

const HelpText = styled(NormalText)`
  font-size: 14px;
  padding-right: 30px;
  line-height: 1.4;
`;

const Nominations = ({
  removeOnClick,
  nominations,
  modifiedOrder,
  movieOnInfo,
  customStyle,
}: NominationsProps) => {
  // Make the element invisible if there are no nominations
  const style = useSpring({
    opacity: modifiedOrder.length ? 1 : 0,
    height:
      modifiedOrder.length * totalHeight + (modifiedOrder.length ? 115 : 0),
    width: getWidth(modifiedOrder.length),
  });

  return (
    <NominationsDiv
      style={
        { ...customStyle, ...style } as any // Again, a bug in react spring: https://github.com/react-spring/react-spring/issues/1102
      }
    >
      <BigLabel>Nominated Movies</BigLabel>
      <HelpText>Drag Movies to Rearrange. Your order will be saved.</HelpText>
      <NominationsCards
        removeOnClick={removeOnClick}
        nominations={nominations}
        modifiedOrder={modifiedOrder}
        movieOnInfo={movieOnInfo}
      />
    </NominationsDiv>
  );
};

export default Nominations;
