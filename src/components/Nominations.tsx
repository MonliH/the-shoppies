import React from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import { X } from "react-feather";

import { Movie } from "lib/movieModel";

import MovieCard, {
  cardDimensions,
  MovieInteraction,
} from "components/MovieCard";
import { Button, AnimatedStyledPadding, RemoveButton } from "components/Widget";
import { Label, NormalText } from "components/Text";

interface NominationsKV {
  [key: string]: Movie;
}

export interface NominationsStore {
  nominations: NominationsKV;
  len: number;
}

interface NominationsProps extends MovieInteraction {
  nominations: NominationsStore;
  removeOnClick: (movie: Movie) => void;
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

const NominationsCards = ({
  nominations: { nominations },
  removeOnClick,
  movieOnClick,
}: NominationsProps) => {
  return (
    <animated.div>
      {Object.keys(nominations).map((movieId) => {
        const movie = nominations[movieId];
        return (
          <MovieCard
            key={movieId}
            movie={movie}
            movieOnClick={() => {}}
            cursor={"grab"}
          >
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
              <X size={22} />
            </RemoveButton>
          </MovieCard>
        );
      })}
    </animated.div>
  );
};

const Nominations = ({
  nominations,
  movieOnClick,
  removeOnClick,
}: NominationsProps) => {
  // Make the element invisible if there are no nominations
  const style = useSpring({
    opacity: nominations.len ? 1 : 0,
    height:
      nominations.len * (cardDimensions.height + cardDimensions.TBMargin) +
      (nominations.len ? 90 : 0),
    // 40px of margin
    width: (nominations.len ? cardDimensions.width : 0) + 40,
  });

  return (
    <NominationsDiv style={style as any}>
      <Label>Nominated Movies</Label>
      <HelpText>Drag Movies to Rearrange</HelpText>
      <NominationsCards
        nominations={nominations}
        movieOnClick={movieOnClick}
        removeOnClick={removeOnClick}
      />
    </NominationsDiv>
  );
};

export default Nominations;
