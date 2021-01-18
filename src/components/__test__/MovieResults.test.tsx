import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import MovieResults from "components/MovieResults";

const theMatrix = {
  id: "tt0133093",
  posterUrl:
    "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00…NkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  releaseYear: "1999",
  title: "The Matrix",
};

describe("MovieResult", () => {
  it("should be able to activate popup", (done) => {
    render(
      <MovieResults
        movieOnInfo={() => done()}
        movieOnNominate={() => {}}
        movies={[theMatrix]}
        nominated={{}}
        nominatedDisabled={false}
      />
    );

    const moreInfoButton = screen.getByText(/More Info/);
    userEvent.click(moreInfoButton);
  });

  it("should run on nominate", (done) => {
    render(
      <MovieResults
        movieOnInfo={() => {}}
        movieOnNominate={() => done()}
        movies={[theMatrix]}
        nominated={{}}
        nominatedDisabled={false}
      />
    );

    const nominateButton = screen.getByText(/Nominate/);
    userEvent.click(nominateButton);
  });

  it("shouldn't nominate anymore", () => {
    render(
      <MovieResults
        movieOnInfo={() => {
          throw new Error("Shouldn't be here");
        }}
        movieOnNominate={() => {
          throw new Error("Shouldn't be here");
        }}
        movies={[theMatrix]}
        nominated={{}}
        nominatedDisabled
      />
    );

    const nominateButton = screen.getByText(/Nominate/);
    userEvent.click(nominateButton);
  });
});
