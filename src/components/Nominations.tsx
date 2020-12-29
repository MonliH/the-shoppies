import React from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";

import { Movie } from "lib/movieModel";

import MovieCard, {
  cardDimensions,
  MovieInteraction,
} from "components/MovieCard";
import { Button, AnimatedStyledPadding } from "components/Widget";
import { Label, NormalText, fontSans } from "components/Text";

export interface NominationsStore {
  [key: string]: Movie;
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

const RemoveButton = styled.button`
  font: 25px ${fontSans};
  border: none;
  background-color: white;
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 7px;
  margin-right: 7px;
`;

const Nominations = ({
  nominations,
  movieOnClick,
  removeOnClick,
}: NominationsProps) => {
  // This technically is O(n), but we only have max 5 elements,
  // so it's cheaper than keeping a seperate counter that might cause rerenders.
  const length = Object.keys(nominations).length;

  // Make the element invisible if there are no nominations
  const style = useSpring({
    opacity: length ? 1 : 0,
    height: length * cardDimensions.height + (length ? 90 : 0),
    // Add 40 for padding
    width: length ? cardDimensions.width + 40 : 0,
  });
  return (
    <NominationsDiv style={style as any}>
      <Label>Nominated Movies</Label>
      <HelpText>Drag Movies to Rearrange</HelpText>
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
            >
              &times;
            </RemoveButton>
          </MovieCard>
        );
      })}
    </NominationsDiv>
  );
};

export default Nominations;
