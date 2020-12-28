import React, { useState, useEffect } from "react";

import { CenteredWrapper, HorizontalWrapper } from "components/Wrappers";
import { LargeHeading, NormalText } from "components/Text";
import SearchBar from "components/SearchBar";
import MovieResults from "components/MovieResult";
import AnimatedElement from "components/AnimatedElement";

import useSearch from "hooks/useSearch";

import { isOk } from "lib/result";
import { Movie } from "lib/movieModel";

const IndexPage = () => {
  const [query, set_query, search_results] = useSearch();

  // For smoother error message fades
  // (edge case during query clear)
  const [prev_err, set_prev_err] = useState<string>("");

  // We want to "persist" some search results so when the user
  // enters something the searching doesn't look janky
  const [persistant, setPersistant] = useState<Array<Movie>>([]);

  useEffect(() => {
    if (query !== "") {
      if (!isOk(search_results)) {
        set_prev_err(search_results);
      }

      const results = isOk(search_results) ? search_results : persistant;
      setPersistant(
        results.filter((movie) =>
          movie.title.toLowerCase().includes(query.toLowerCase())
        )
      );
    } else {
      // Empty query
      setPersistant([]);
    }
  }, [search_results, query]);

  // If set to true, we render the emoji
  // If false, we render the svg logo
  // We use this for a fallback for the logo, so it always
  // shows a trophy of some sort
  const [alt, setAlt] = useState(true);

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
      <AnimatedElement visible={!isOk(search_results) && !persistant.length}>
        <NormalText>
          {!isOk(search_results) ? search_results : prev_err}
        </NormalText>
      </AnimatedElement>
      <MovieResults
        movies={
          isOk(search_results)
            ? search_results
            : persistant.length // If no search results
            ? persistant // fallback to persistant
            : [] // then error
        }
      />
    </CenteredWrapper>
  );
};

export default IndexPage;
