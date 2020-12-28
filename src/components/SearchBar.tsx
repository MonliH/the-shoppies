import styled from "styled-components";
import React, { useRef } from "react";

import { StyledPadding } from "components/Widget";
import { Label, fontSans } from "components/Text";

const SearchBarInput = styled.input`
  width: 60vw;
  /* We don't want it to be too long */
  max-width: 700px;
  /* Make it look good on mobile */
  media (max-width: 550px) {
    width: 80vw;
  }

  font: 15px ${fontSans};

  border: 1px solid #c8c8c8;
  border-radius: 2px;

  padding: 9px;
  margin-top: 5px;

  &:focus {
    outline: 0;
    /* Fake the outline, becuase outline can't provide rounded corners */
    box-shadow: 0 0 0 1px #3D73FF;
  }
`;

const SearchBar = ({
  set_query,
  query,
}: {
  set_query: (query: string) => void;
  query: string;
}) => {
  const searchBarRef = useRef<HTMLInputElement>(null);

  // Focus on hover
  const onMouseEnter = () => {
    if (searchBarRef.current) {
      searchBarRef.current.focus();
    }
  };

  return (
    <StyledPadding onMouseEnter={onMouseEnter}>
      <form onSubmit={(e) => e.preventDefault()}>
        <Label htmlFor="searchbar">Search for a Movie</Label>
        <br />
        <SearchBarInput
          type="search"
          id="searchbar"
          ref={searchBarRef}
          placeholder="e.g. the matrix"
          onChange={(e) => set_query(e.target.value)}
          value={query}
        />
      </form>
    </StyledPadding>
  );
};

export default SearchBar;
