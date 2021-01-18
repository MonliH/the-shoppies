import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import PageChanger from "components/PageChanger";

describe("Component: PageChanger", () => {
  it("should call nextPage", (done) => {
    render(
      <PageChanger
        onNextPage={() => done()}
        onPreviousPage={() => {}}
        currentPage={1}
        totalPages={10}
      />
    );
    const nextButton = screen.getByTestId("next-page");
    expect(nextButton).toBeInTheDocument();
    userEvent.click(nextButton);
  });

  it("should be disabled next page", () => {
    render(
      <PageChanger
        onNextPage={() => {
          throw new Error("Shouldn't be here");
        }}
        onPreviousPage={() => {
          throw new Error("Shouldn't be here");
        }}
        currentPage={5}
        totalPages={5}
      />
    );

    const nextButton = screen.getByTestId("next-page");
    expect(nextButton).toBeInTheDocument();
    userEvent.click(nextButton);
  });

  it("should call nextPage", (done) => {
    render(
      <PageChanger
        onNextPage={() => {}}
        onPreviousPage={() => done()}
        currentPage={2}
        totalPages={10}
      />
    );

    const prevButton = screen.getByTestId("previous-page");
    expect(prevButton).toBeInTheDocument();
    userEvent.click(prevButton);
  });

  it("should be disabled previous page", () => {
    render(
      <PageChanger
        onNextPage={() => {
          throw new Error("Shouldn't be here");
        }}
        onPreviousPage={() => {
          throw new Error("Shouldn't be here");
        }}
        currentPage={1}
        totalPages={5}
      />
    );
    const prevButton = screen.getByTestId("previous-page");
    expect(prevButton).toBeInTheDocument();
    userEvent.click(prevButton);
  });

  it("should retain the old page number", () => {
    const { rerender } = render(
      <PageChanger
        onNextPage={() => {}}
        onPreviousPage={() => {}}
        currentPage={1}
        totalPages={5}
      />
    );

    const pages = screen.queryByText(/5/);
    expect(pages).toBeInTheDocument();

    rerender(
      <PageChanger
        onNextPage={() => {}}
        onPreviousPage={() => {}}
        currentPage={1}
        totalPages={0}
      />
    );

    const rerenderedPages = screen.queryByText(/5/);
    expect(rerenderedPages).toBeInTheDocument();
  });
});
