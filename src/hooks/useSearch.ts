import { useState, useEffect } from "react";

import { searchMovies } from "lib/api";
import { Movie } from "lib/movieModel";
import { Result, isOk } from "lib/result";

import useDebounce from "hooks/useDebounce";

const defaultResults: [Array<Movie>, number] = [[], 0];

const useSearch = (
  query: string,
  dateFilter: string,
  pageNumber: number
): Result<[Array<Movie>, number]> => {
  const [results, setResults] = useState<Result<[Array<Movie>, number]>>(
    defaultResults
  );

  const updateMovies = async () => {
    const res = (await searchMovies(query, dateFilter, pageNumber)) as Result<
      [Array<Movie>, number]
    >;
    if (isOk(res)) {
      // If it's not error, convert the number of movies to pages
      setResults([res[0], Math.ceil(res[1] / 10)] as [Array<Movie>, number]);
    } else {
      // Otherwise, just set the error
      setResults(res);
    }
  };

  // Query updates have 300ms of debounce time
  const updateMoviesFromQuery = useDebounce(updateMovies, 300);
  // Page changes only have 200ms of debounce time
  const changePageNumber = useDebounce(updateMovies, 200);

  useEffect(() => {
    if (!query.length) {
      // Clear results
      setResults(defaultResults);
    } else {
      updateMoviesFromQuery();
    }
  }, [query, dateFilter]);

  useEffect(() => {
    changePageNumber();
  }, [pageNumber]);

  useEffect(() => {
    if (!query.length && results.length !== 0) {
      // Clear results when search bar is empty
      setResults(defaultResults);
    }
  }, [results]);

  return results;
};

export default useSearch;
