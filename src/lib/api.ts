import { FullMovie, Movie, omdbId } from "lib/movieModel";
import { Result } from "lib/result";

const API_KEY = "8c26a0ae";
const BASE_URL = `http://www.omdbapi.com/?apikey=${API_KEY}&`;

export const getLinkHighRes = (url: string | null): string | undefined =>
  url?.replace(/^(.*@)(.*)$/, "$1");

export const isEmpty = (item: string): boolean =>
  item.toLowerCase() === "not rated" || item.toLowerCase() === "n/a";

export const addAnd = (csvs: string | null): string | undefined =>
  csvs?.replace(/,([^,]*)$/, " and$1");

export const searchMovies = async (
  query: string
): Promise<Result<Array<Movie>>> => {
  // Trim the query because leading and trailing whitespace are evil
  const res = await fetch(`${BASE_URL}s=${query.trim()}&type=movie`);
  const json = await res.json();
  if (json.Response && json.Response !== "True") {
    return json.Error as string;
  }

  return json.Search.map((movie: any) => ({
    id: movie.imdbID,
    releaseYear: Number.parseInt(movie.Year, 10),
    posterUrl: movie.Poster,
    title: movie.Title,
  }));
};

export const getFullMovie = async (movieId: omdbId): Promise<FullMovie> => {
  const res = await fetch(`${BASE_URL}i=${movieId}&type=movie&plot=full`);
  const json = await res.json();

  const fullMovie = {
    id: json.imdbID,
    imdbRating: json.imdbRating,
    imdbVotes: json.imdbVotes,
    posterUrl: json.Poster,
    title: json.Title,
    actors: json.Actors,
    ageRating: json.Rated,
    boxOffice: json.BoxOffice,
    country: json.Country,
    director: json.Director,
    genre: json.Genre,
    language: json.Language,
    plot: json.Plot,
    productionCompany: json.Production,
    releaseDate: json.Released,
    runtime: json.Runtime,
    releaseYear: json.Year,
  };

  return Object.fromEntries(
    Object.entries(fullMovie).map(([key, value]) => [
      key,
      isEmpty(value) ? null : value,
    ])
  ) as FullMovie;
};
