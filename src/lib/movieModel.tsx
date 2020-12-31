export type omdbId = string;

export interface Movie {
  id: omdbId;
  releaseYear: number;
  title: string;
  posterUrl: string;
}

export interface FullMovie extends Movie {
  releaseDate: Date;
  actors: string;
  director: string;
  productionCompany: string;
}
