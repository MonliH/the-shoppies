import React, { Dispatch } from "react";

import { HorizontalWrapper } from "components/Wrappers";
import MovieResults from "components/MovieResults";
import Nominations from "components/Nominations";

import { Result, isOk } from "lib/result";
import { Movie } from "lib/movieModel";

import {
  NominationActionTypes,
  NominationsAction,
  NominationsState,
} from "reducers/nominationReducer";

const SearchResultLayout = ({
  nominations,
  nominationsDispatch,
  searchResults,
  displayMovieInfo,
}: {
  nominations: NominationsState;
  nominationsDispatch: Dispatch<NominationsAction>;
  searchResults: Result<[Array<Movie>, number]>;
  displayMovieInfo: (movie: Movie) => void;
}) => {
  return (
    <HorizontalWrapper>
      <MovieResults
        movies={isOk(searchResults) ? searchResults[0] : []}
        movieOnInfo={displayMovieInfo}
        movieOnNominate={(movie: Movie) => {
          nominationsDispatch({ type: NominationActionTypes.ADD, movie });
        }}
        nominated={nominations.nominations}
        nominatedDisabled={nominations.nominatedDisabled}
      />
      <Nominations
        movieOnInfo={displayMovieInfo}
        removeOnClick={({ id }) => {
          nominationsDispatch({
            type: NominationActionTypes.REMOVE,
            movieId: id,
          });
        }}
        modifiedOrder={nominations.modifiedOrder}
        nominations={nominations.nominations}
      />
    </HorizontalWrapper>
  );
};

export default SearchResultLayout;
