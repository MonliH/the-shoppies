import React from "react";
import styled from "styled-components";

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
  width: ${cardDimensions.width + 40}px;
  z-index: 5;
  margin-top: 20px;
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
  return (
    <NominationsDiv>
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
