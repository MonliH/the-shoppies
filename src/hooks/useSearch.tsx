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
  const [timer, setTimer] = useState<null | NodeJS.Timeout>(null);

  useEffect(() => {
    if (!query.length) {
      // Clear results
      set_results([]);
    } else {
      // Debouncing
      const later = async () => {
        setTimer(null);
        set_results(await searchMovies(query));
      };

      if (timer) {
        clearTimeout(timer);
      }

      setTimer(setTimeout(later, 300));
    }
  }, [query]);

  useEffect(() => {
    if (!query.length && results.length !== 0) {
      // Clear results when search bar is empty
      set_results([]);
    }
  }, [results]);

  return [query, set_query, results];
};

export default useSearch;
