import React from "react";

import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import MovieCard, { MovieImage } from "components/MovieCard";

const theMatrix = {
  id: "tt0133093",
  posterUrl:
    "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00…NkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  releaseYear: "1999",
  title: "The Matrix",
};

describe("Component: MovieCard", () => {
  it("should have image if url valid", () => {
    render(<MovieCard movie={theMatrix} />);
    const image = screen.getByAltText(/movie poster/i);
    expect(image).toBeVisible();
  });

  it("should have labe if url not valid", () => {
    render(<MovieImage fallbackTitle="The matrix &7& : Test" iconSize={20} />);

    const image = screen.queryByAltText(/movie poster/i);
    expect(image).toBeNull();
    const text = screen.getByText("TM&");
    expect(text).toBeVisible();
  });

  it("should render children", (done) => {
    render(
      <MovieCard movie={theMatrix}>
        <button type="button" onClick={() => done()}>
          Test Button
        </button>
      </MovieCard>
    );

    const nominateButton = screen.getByText(/Test Button/);
    userEvent.click(nominateButton);
  });
});
