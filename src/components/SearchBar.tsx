import styled from "styled-components";
import React, { useRef } from "react";

import { Paper } from "components/Widget";
import { Label, fontSans } from "components/Text";
import { HorizontalWrapper } from "components/Wrappers";

const SearchBarInput = styled.input`
  width: 60vw;
  /* We don't want it to be too long */
  max-width: 550px;
  /* Make it look good on mobile */
  @media (max-width: 550px) {
    width: 60vw;
  }

  font: 15px ${fontSans};
  line-height: 1.4;

  border: 1px solid #c8c8c8;
  border-radius: 2px;

  padding: 9px;
  /* Account for magnifying glass icon */
  padding-left: 33px;

  &:focus {
    outline: 0;
    /* Fake the outline, becuase outline can't provide rounded corners */
    box-shadow: 0 0 0 1px #3d73ff;
  }
`;

const DateInput = styled(SearchBarInput)`
  width: 125px;
  padding-left: 0;
  padding: 9px;
  @media (max-width: 550px) {
    width: 20vw;
    min-width: 100px;
  }
`;

const Search = ({ className }: { className?: string }) => (
  // SVG is from icons8
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 50 50"
    width="22px"
    height="22px"
    className={className}
  >
    <g id="surface3527088">
      <path
        style={{
          stroke: "none",
          fillRule: "nonzero",
          fill: "#464646",
          fillOpacity: 1,
        }}
        d="M 21 3 C 11.601562 3 4 10.601562 4 20 C 4 29.398438 11.601562 37 21 37 C 24.355469 37 27.460938 36.015625 30.09375 34.34375 L 42.375 46.625 L 46.625 42.375 L 34.5 30.28125 C 36.679688 27.421875 38 23.878906 38 20 C 38 10.601562 30.398438 3 21 3 Z M 21 7 C 28.199219 7 34 12.800781 34 20 C 34 27.199219 28.199219 33 21 33 C 13.800781 33 8 27.199219 8 20 C 8 12.800781 13.800781 7 21 7 Z M 21 7 "
      />
    </g>
  </svg>
);

const SearchIcon = styled(Search)`
  position: absolute;
  top: 9px;
  left: 7px;
`;

const SearchHorizontalWrapper = styled(HorizontalWrapper)`
  position: relative;
`;

const FilterMargin = styled.span`
  margin-left: 10px;
`;

const SearchBar = ({
  setQuery,
  query,
  setDateQuery,
  date,
}: {
  setQuery: (query: string) => void;
  query: string;
  setDateQuery: (query: string) => void;
  date: string;
}) => {
  const searchBarRef = useRef<HTMLInputElement>(null);

  // Focus on hover
  const onMouseEnter = () => {
    if (searchBarRef.current) {
      searchBarRef.current.focus();
    }
  };

  return (
    <Paper onMouseEnter={onMouseEnter}>
      <form onSubmit={(e) => e.preventDefault()}>
        <HorizontalWrapper>
          <span>
            <Label htmlFor="searchbar">Search for a Movie</Label>
            <SearchHorizontalWrapper>
              <SearchIcon />
              <SearchBarInput
                type="search"
                id="searchbar"
                data-testid="searchbar"
                ref={searchBarRef}
                placeholder="e.g. the matrix"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
              />
            </SearchHorizontalWrapper>
          </span>
          <FilterMargin>
            <Label htmlFor="datefilter">Filter by Year</Label>
            <DateInput
              type="text"
              id="datefilter"
              placeholder="e.g. 1997"
              onChange={(e) => setDateQuery(e.target.value)}
              value={date}
            />
          </FilterMargin>
        </HorizontalWrapper>
      </form>
    </Paper>
  );
};

export default SearchBar;
