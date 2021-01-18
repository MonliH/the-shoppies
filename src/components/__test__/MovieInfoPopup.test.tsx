import React from "react";

import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

import MovieInfoPopup from "components/MovieInfoPopup";

const info = {
  actors: "Manu Bennett, Larenz Tate, Linden Ashby, Kevon Stover",
  ageRating: null,
  boxOffice: "$10,104",
  country: "USA",
  director: "Nicholas Gyeney",
  genre: "Action, Sci-Fi, Thriller",
  id: "tt4244162",
  imdbRating: "5.7",
  imdbVotes: "10,354",
  language: "English",
  plot: "Shorted",
  posterUrl:
    "https://m.media-amazon.com/images/M/MV5BODdlMjU0MDYtMWQ1NC00…QtNDYxNTg2ZjJjZDFiXkEyXkFqcGdeQXVyMTU2NTcxNDg@._V1_SX300.jpg",
  productionCompany: null,
  releaseDate: "22 Jul 2016",
  releaseYear: "2016",
  runtime: "88 min",
  title: "Beta Test",
};

describe("Component: MovieInfoPopup", () => {
  it("should run onClose on close", (done) => {
    render(
      <MovieInfoPopup
        fullInfo={info}
        visible
        nominated={false}
        onClose={() => done()}
        onRemove={() => {}}
        onNominate={() => {}}
        onFade={() => {}}
      />
    );
    const closeButton = screen.getByTestId("close-modal");
    userEvent.click(closeButton);
  });

  it("should run onNominate on nominate", (done) => {
    render(
      <MovieInfoPopup
        fullInfo={info}
        visible
        nominated={false}
        onClose={() => {}}
        onRemove={() => {}}
        onNominate={() => done()}
        onFade={() => {}}
      />
    );
    const nominateButton = screen.getByText(/Nominate/);
    userEvent.click(nominateButton);
  });

  it("should run onRemove on remove", (done) => {
    render(
      <MovieInfoPopup
        fullInfo={info}
        visible
        nominated
        onClose={() => {}}
        onRemove={() => done()}
        onNominate={() => {}}
        onFade={() => {}}
      />
    );
    const nominateButton = screen.getByText(/Remove/);
    userEvent.click(nominateButton);
  });
});
