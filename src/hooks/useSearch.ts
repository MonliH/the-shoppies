import { useState, useEffect } from "react";

import { searchMovies } from "lib/api";
import { Movie } from "lib/movieModel";
import { Result } from "lib/result";

const useSearch = (): [
  string,
  (query: string) => void,
  Result<Array<Movie>>
] => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<Result<Array<Movie>>>([]);
  const [timer, setTimer] = useState<null | ReturnType<typeof setTimeout>>(
    null
  );

  useEffect(() => {
    if (!query.length) {
      // Clear results
      setResults([]);
    } else {
      // Debouncing
      const later = async () => {
        setTimer(null);
        setResults(await searchMovies(query));
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
      setResults([]);
    }
  }, [results]);

  return [query, setQuery, results];
};

export default useSearch;
