import { Movie } from "lib/movieModel";
import { Result } from "lib/result";

const API_KEY = "8c26a0ae";
const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&`;

export const searchMovies = async (
  query: string
): Promise<Result<Array<Movie>>> => {
  // Trim the query because leading and trailing whitespace are evil
  const res = await fetch(`${BASE_URL}s=${query.trim()}&type=movie`);
  const json = await res.json();
  if (json.Response && json.Response !== "True") {
    return json.Error as string;
  }

  return json.Search.map((r: Response) => movieFromObject(r));
};

interface Response {
  Title: string;
  Year: string;
  imdbID: string;
  Poster: string;
}

const movieFromObject = (obj: Response): Movie => {
  return {
    id: obj.imdbID,
    releaseYear: Number.parseInt(obj.Year),
    posterUrl: obj.Poster,
    title: obj.Title,
  };
};
