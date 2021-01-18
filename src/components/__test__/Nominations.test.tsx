import React from "react";

import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import Nominations from "components/Nominations";

const sharedProps = {
  modifiedOrder: [
    ["tt1986180", 0],
    ["tt2616114", 1],
  ] as Array<[string, number]>,
  nominations: {
    tt1986180: {
      id: "tt1986180",
      posterUrl:
        "https://m.media-amazon.com/images/M/MV5BMTYwNTgzMjM5M15BMl5BanBnXkFtZTcwNDUzMTE1OA@@._V1_SX300.jpg",
      releaseYear: "2012",
      title: "The Test",
    },
    tt2616114: {
      id: "tt2616114",
      posterUrl:
        "https://m.media-amazon.com/images/M/MV5BMjMzMDQwMzM2M15BMl5BanBnXkFtZTcwMzA1OTg1OQ@@._V1_SX300.jpg",
      releaseYear: "2013",
      title: "The Test",
    },
  },
};

describe("Nominations", () => {
  it("be able to remove elements", (done) => {
    render(
      <Nominations
        removeOnClick={() => done()}
        movieOnInfo={() => {}}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...sharedProps}
      />
    );
    const remove = screen.getByTestId(
      `remove-button-${sharedProps.modifiedOrder[0][0]}`
    );
    userEvent.click(remove);
  });

  it("be able to get more info on elements", (done) => {
    render(
      <Nominations
        removeOnClick={() => {}}
        movieOnInfo={() => done()}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...sharedProps}
      />
    );
    const remove = screen.getByTestId(
      `more-info-${sharedProps.modifiedOrder[0][0]}`
    );
    userEvent.click(remove);
  });
});
