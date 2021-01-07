import React from "react";
import { animated, useTransition, useSpring } from "react-spring";
import styled from "styled-components";

import MovieCard, {
  MovieInteraction,
  cardDimensions,
} from "components/MovieCard";
import { Button } from "components/Widget";
import { HorizontalWrapper } from "components/Wrappers";

import { NominationsStore } from "components/Nominations";

import { Movie } from "lib/movieModel";

import useWindowDimensions from "hooks/useWindowDimensions";

const SearchResultsWrapper = styled(animated.div)`
  position: relative;
  margin-top: 5px;
`;

interface MoviePosition {
  xy: [number, number];
  movie: Movie;
}

interface MovieResultsProps extends MovieInteraction {
  movies: Array<Movie>;
  movieOnNominate: (movie: Movie) => void;
  nominated: NominationsStore;
  nominatedDisabled: boolean;
}

const NominateButton = styled(Button)`
  margin-right: 10px;
`;

const MovieResults = ({
  movies,
  movieOnInfo,
  movieOnNominate,
  nominated,
  nominatedDisabled,
}: MovieResultsProps) => {
  const dims = useWindowDimensions();
  // Use 60% of screen
  const width = dims.width * 0.6;

  // Approximate the number of comlumns (without margin)
  const approxCols = Math.floor(width / cardDimensions.width) || 1;

  // Account for margin after approximating number of columns
  let columns =
    approxCols !== 1
      ? Math.floor(
          (width - cardDimensions.LRMargin * approxCols) / cardDimensions.width
        )
      : 1;

  // Make sure movies.length is not 0
  if (movies.length && movies.length < columns) {
    // We want to center them, otherwise it looks weird
    columns = movies.length;
  }

  let counterCol = 0;
  let counterRow = 0;

  // Calculate positions of each movie preview
  const gridItems: Array<MoviePosition> = movies.map((child, i) => {
    counterCol += 1;

    if (i % columns === 0) {
      if (i !== 0) {
        // New row
        counterRow += 1;
      }
      // Reset column
      counterCol = 0;
    }

    return {
      xy: [
        (cardDimensions.width + cardDimensions.LRMargin) * counterCol,
        counterRow * (cardDimensions.height + cardDimensions.TBMargin),
      ],
      movie: child,
    };
  });

  counterRow += 1;

  // Create transition group
  const transitions = useTransition(gridItems, {
    from: ({ xy }) => ({
      xy: [xy[0], 0],
      width: cardDimensions.width,
      height: cardDimensions.height,
      opacity: 0,
    }),
    enter: ({ xy }) => ({
      xy,
      width: cardDimensions.width,
      height: cardDimensions.height,
      opacity: 1,
    }),
    update: ({ xy }) => ({
      xy,
      width: cardDimensions.width,
      height: cardDimensions.height,
      opacity: 1,
    }),
    leave: { height: 0, opacity: 0 },
    keys: (item: MoviePosition) => item.movie.id,
  });

  const fragment = transitions((style, item: MoviePosition) => {
    const { xy, ...others } = style;
    const alreadyNominated = Object.prototype.hasOwnProperty.call(
      nominated,
      item.movie.id
    );

    return (
      <MovieCard
        movie={item.movie}
        otherProps={{
          style: {
            position: "absolute",
            transform: xy.to(
              (x: number, y: number) => `translate3d(${x}px, ${y}px, 0px)`
            ),
            ...others,
          } as any,

          // The `as any` cast is required because of a bug in react-spring.
          // See this https://github.com/react-spring/react-spring/issues/1102
        }}
        key={item.movie.id}
      >
        <HorizontalWrapper style={{ marginTop: "2px" }}>
          <NominateButton
            onClick={(e) => {
              // Prevent onclick from being activated on the card, too
              e.stopPropagation();
              movieOnNominate(item.movie);
            }}
            // Disabled if it's already been nominated, or if everything is disabled
            // becuase there are over 5 nominations
            disabled={alreadyNominated || nominatedDisabled}
            style={{
              cursor:
                alreadyNominated || nominatedDisabled
                  ? "not-allowed"
                  : "default",
              fontWeight:
                alreadyNominated || nominatedDisabled ? "normal" : 600,
            }}
          >
            {alreadyNominated ? "Nominated" : "Nominate"}
          </NominateButton>
          <Button
            onClick={() => {
              movieOnInfo(item.movie);
            }}
          >
            More Info
          </Button>
        </HorizontalWrapper>
      </MovieCard>
    );
  });

  const wrapperStyles = useSpring({
    // Calculate height
    // First, get number of rows then multiply by total height of one card
    // Also, if the number of movies is zero, we want zero
    height:
      Math.ceil(movies.length ? movies.length / columns : 0) *
      (cardDimensions.height + cardDimensions.TBMargin),

    // Make the width 0 with no results
    width: movies.length
      ? columns * (cardDimensions.width + cardDimensions.LRMargin)
      : 0,
    config: { mass: 2, tension: 100, friction: 30 },
  });

  return (
    <SearchResultsWrapper style={wrapperStyles}>
      {fragment}
    </SearchResultsWrapper>
  );
};

export default MovieResults;
