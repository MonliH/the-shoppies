import React, { useState } from "react";
import { animated, useTransition, useSpring } from "react-spring";
import styled from "styled-components";

import { Movie } from "lib/movieModel";

import { VerticalWrapper, HorizontalWrapper } from "components/Wrappers";
import { SmallHeading, NormalText } from "components/Text";
import { StyledPadding } from "components/Widget";

import useWindowDimensions from "hooks/useWindowDimensions";

// Card width
const cardw = 300;
// Card height
const cardh = 120;

// Card left and right margin
const cardwm = 20;
// Card top and bottom margin
const cardhm = 20;

const MovieImage = styled.img`
  width: 60px;
  height: 95px;
  border-radius: 3px;
  object-fit: cover;
`;

const MovieFallback = styled(MovieImage).attrs({ as: "div" })`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background-color: #efefef;
  min-width: 60px;
  min-height: 95px;
`;

const MoviePadding = styled(StyledPadding)`
  width: ${cardw}px !important;
  height: ${cardh}px !important;
  padding: 15px !important;
  display: flex;
  align-items: center;
  margin: 0;
`;

const SearchResultsWrapper = styled(animated.div)`
  position: relative;
  margin-top: 20px;
  flex-shrink: 0 !important;
`;

const MovieHW = styled(HorizontalWrapper)`
  align-items: center;
`;

const MovieVW = styled(VerticalWrapper)`
  margin-left: 10px;
`;

const DateText = styled(NormalText)`
  margin: 0;
  font-size: 15px;
`;

const MovieHeading = styled(SmallHeading)`
  margin: 0;
  margin-bottom: 3px;
  font-size: 17px;
`;

const MovieImageFallback = ({ title }: { title: string }) => (
  <MovieFallback>
    <SmallHeading>
      {
        // Put initials of movie
        title
          .split(" ")
          .slice(0, 3) // Up to three initials
          .map((n) => n[0].toUpperCase())
          .join("")
      }
    </SmallHeading>
    <img alt="No Poster" src="/no-image.svg" width={20} height={20} />
  </MovieFallback>
);

const MovieCard = ({ movie }: { movie: Movie }) => {
  const [isErr, setIsErr] = useState(false);
  return (
    <MoviePadding>
      <MovieHW>
        {isErr ? (
          <MovieImageFallback title={movie.title} />
        ) : (
          <MovieImage
            alt="Movie Poster"
            onError={() => {
              setIsErr(true);
            }}
            src={movie.posterUrl}
          />
        )}
        <MovieVW>
          <MovieHeading>
            {movie.title.length > 50
              ? `${movie.title.slice(0, 30)}...`
              : movie.title}
          </MovieHeading>
          <DateText>Released in {movie.releaseYear}</DateText>
        </MovieVW>
      </MovieHW>
    </MoviePadding>
  );
};

interface MoviePosition {
  xy: [number, number];
  movie: Movie;
}

const MovieResults = ({ movies }: { movies: Array<Movie> }) => {
  const dims = useWindowDimensions();
  // Use 60% of screen
  const width = dims.width * 0.6;

  // Approximate the number of comlumns (without margin)
  const approxCols = Math.floor(width / cardw) || 1;

  // Account for margin after approximating number of columns
  let columns =
    approxCols !== 1 ? Math.floor((width - cardwm * approxCols) / cardw) : 1;

  // Make sure movies.length is not 0
  if (movies.length && movies.length < columns) {
    // We want to center them, otherwise it looks weird
    columns = movies.length;
  }

  let counterCol = 0;
  let counterRow = 0;

  // Calculate positions of each movie preview
  let gridItems: Array<MoviePosition> = movies.map((child, i) => {
    counterCol++;

    if (i % columns === 0) {
      if (i !== 0) {
        // New row
        counterRow++;
      }
      // Reset column
      counterCol = 0;
    }

    return {
      xy: [(cardw + cardwm) * counterCol, counterRow * (cardh + cardhm)],
      movie: child,
    };
  });

  counterRow += 1;

  // Create transition group
  const transitions = useTransition(gridItems, {
    from: ({ xy }) => ({
      xy: [xy[0], 0],
      width: cardw,
      height: cardh,
      opacity: 0,
    }),
    enter: ({ xy }) => ({
      xy,
      width: cardw,
      height: cardh,
      opacity: 1,
    }),
    update: ({ xy }) => ({
      xy,
      width: cardw,
      height: cardh,
      opacity: 1,
    }),
    // If we don't do the `as any` cast here, this bug shows up:
    // https://github.com/pmndrs/react-spring/issues/1060
    leave: ({ xy }) => ({ xy: [xy[0], 0] as any, height: 0, opacity: 0 }),
    keys: (item: MoviePosition) => item.movie.id,
  });

  const fragment = transitions((style, item: MoviePosition) => {
    let { xy, ...others } = style;
    return (
      <animated.div
        key={item.movie.id}
        style={
          {
            position: "absolute",
            transform: xy.to(
              (x: number, y: number) => `translate3d(${x}px, ${y}px, 0px)`
            ),
            ...others,
          } as any
          // The `as any` cast is required because of a bug in react-spring.
          // See this https://github.com/react-spring/react-spring/issues/1102
        }
      >
        <MovieCard movie={item.movie}></MovieCard>
      </animated.div>
    );
  });

  const wrapperStyles = useSpring({
    // Calculate height
    // First, get number of rows then multiply by total height of one card
    // Also, if the number of movies is zero, we want zero
    height: Math.ceil(movies.length ? movies.length / columns : 0) * (cardh + cardhm),
    width: columns * (cardw + cardwm),
    config: { mass: 2, tension: 100, friction: 30 },
  });

  return (
    <SearchResultsWrapper style={wrapperStyles}>
      {fragment}
    </SearchResultsWrapper>
  );
};

export default MovieResults;
