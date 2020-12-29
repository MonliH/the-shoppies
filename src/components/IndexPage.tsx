import React, { useState, useEffect } from "react";

import { CenteredWrapper, HorizontalWrapper } from "components/Wrappers";
import { LargeHeading, NormalText } from "components/Text";
import SearchBar from "components/SearchBar";
import MovieResults from "components/MovieResults";
import AnimatedElement from "components/AnimatedElement";
import Nominations, { NominationsStore } from "components/Nominations";

import useSearch from "hooks/useSearch";

import { isOk } from "lib/result";
import { Movie } from "lib/movieModel";

const IndexPage = () => {
  const [query, set_query, search_results] = useSearch();

  // For smoother error message fades
  // (edge case during query clear)
  const [prev_err, set_prev_err] = useState<string>("");

  useEffect(() => {
    if (query !== "") {
      if (!isOk(search_results)) {
        set_prev_err(search_results);
      }
    }
  }, [search_results, query]);

  // If set to true, we render the emoji
  // If false, we render the svg logo
  // We use this for a fallback for the logo, so it always
  // shows a trophy of some sort
  const [alt, setAlt] = useState(true);

  const [nominated, setNominated] = useState<NominationsStore>({});

  const displayMovieInfo = () => {};

  return (
    <CenteredWrapper>
      <HorizontalWrapper style={{ marginTop: "50px" }}>
        {alt ? <LargeHeading>🏆</LargeHeading> : <></>}
        <img
          alt="Logo"
          onError={() => setAlt(false)}
          onLoad={() => setAlt(false)}
          style={{ display: alt ? "none" : "block" }}
          src="/logo192.png"
          width={62}
          height={62}
        />
        <LargeHeading style={{ marginLeft: "25px" }}>The Shoppies</LargeHeading>
      </HorizontalWrapper>
      <NormalText>Nominate your top 5 movies for the Shopies award!</NormalText>
      <SearchBar set_query={set_query} query={query} />
      <AnimatedElement height="35px" visible={!isOk(search_results)}>
        <NormalText>
          {!isOk(search_results) ? search_results : prev_err}
        </NormalText>
      </AnimatedElement>
      <HorizontalWrapper>
        <MovieResults
          movies={isOk(search_results) ? search_results : []}
          movieOnClick={displayMovieInfo}
          movieOnNominate={(movie: Movie) =>
            setNominated({ ...nominated, [movie.id]: movie })
          }
          nominated={nominated}
        />
        <Nominations
          nominations={nominated}
          movieOnClick={displayMovieInfo}
          removeOnClick={({ id }) => {
            let newNominated = { ...nominated };
            delete newNominated[id];
            setNominated(newNominated);
          }}
        />
      </HorizontalWrapper>
    </CenteredWrapper>
  );
};

export default IndexPage;
