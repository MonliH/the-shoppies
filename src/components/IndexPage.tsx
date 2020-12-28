import React, { useState } from "react";

import { CenteredWrapper, HorizontalWrapper } from "components/Wrappers";
import { LargeHeading, NormalText } from "components/Text";
import SearchBar from "components/SearchBar";
import MovieResults from "components/MovieResult";

import useSearch from "hooks/useSearch";

import { isOk } from "lib/result";

const IndexPage = () => {
  const [query, set_query, search_results] = useSearch();
  const [alt, setAlt] = useState(true);
  return (
    <CenteredWrapper>
      <HorizontalWrapper>
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
      <MovieResults movies={isOk(search_results) ? search_results : []} />
      {!isOk(search_results) ? (
        <NormalText>{search_results}</NormalText>
      ) : (
        <></>
      )}
    </CenteredWrapper>
  );
};

export default IndexPage;
