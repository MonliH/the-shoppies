import { FullMovie, Movie, omdbId } from "lib/movieModel";
import { Result } from "lib/result";

const API_KEY = "8c26a0ae";
// Fetch url
const BASE_URL = `//www.omdbapi.com/?apikey=${API_KEY}&v=1&`;

export const getLinkHighRes = (url: string | null): string | undefined =>
  url?.replace(/^(.*@)(.*)$/, "$1");

export const isEmpty = (item: string): boolean =>
  item.toLowerCase() === "not rated" || item.toLowerCase() === "n/a";

export const addAnd = (csvs: string | null): string | undefined =>
  csvs?.replace(/,([^,]*)$/, " and$1");

export const intoUrlFormat = (params: Record<string, string>) =>
  Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
    )
    .join("&");

export const modifyError = (err: string) => {
  switch (err) {
    case "Movie not found!":
      return "No movies found!";
    default:
      return err;
  }
};

export const searchMovies = async (
  query: string,
  dateFilter?: string,
  pageNumber: number = 1
): Promise<Result<[Array<Movie>, number]>> => {
  // Trim the query because leading and trailing whitespace are evil
  const params = {
    s: query.trim(),
    type: "movie",
    page: pageNumber.toString(),
    ...(dateFilter ? { y: dateFilter } : {}),
  };
  const res = await fetch(BASE_URL + intoUrlFormat(params));

  const json = await res.json();
  if (json.Response && json.Response !== "True") {
    return modifyError(json.Error as string);
  }

  return [
    json.Search.map((movie: any) => ({
      id: movie.imdbID,
      releaseYear: Number.parseInt(movie.Year, 10),
      posterUrl: movie.Poster,
      title: movie.Title,
    })),
    Number.parseInt(json.totalResults, 10),
  ];
};

export const getFullMovie = async (movieId: omdbId): Promise<FullMovie> => {
  const params = {
    type: "movie",
    plot: "full",
    i: movieId,
  };
  const res = await fetch(BASE_URL + intoUrlFormat(params));
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
