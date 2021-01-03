export type omdbId = string;

export interface Movie {
  id: omdbId;
  releaseYear: string;
  title: string;
  posterUrl: string;
}

export interface FullMovie extends Movie {
  actors: string | null;
  ageRating: string | null;
  boxOffice: string | null;
  country: string | null;
  director: string | null;
  genre: string | null;
  language: string | null;
  plot: string | null;
  productionCompany: string | null;
  releaseDate: string | null;
  runtime: string | null;
  imdbRating: string | null;
  imdbVotes: string | null;
}
