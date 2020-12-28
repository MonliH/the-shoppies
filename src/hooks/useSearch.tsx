import { useState, useEffect } from "react";

import { searchMovies } from "lib/api";
import { Movie } from "lib/movieModel";
import { Result } from "lib/result";

const useSearch = (): [
  string,
  (query: string) => void,
  Result<Array<Movie>>
] => {
  const [query, set_query] = useState<string>("");
  const [results, set_results] = useState<Result<Array<Movie>>>([]);
  useEffect(() => {
    (async () => {
      if (query && query !== "") {
        set_results(await searchMovies(query));
      } else {
        // Empty query
        set_results([]);
      }
    })();
  }, [query]);
  return [query, set_query, results];
};

export default useSearch;
