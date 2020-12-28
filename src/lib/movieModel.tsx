export type imdbId = string;

export interface Movie {
  id: imdbId;
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
