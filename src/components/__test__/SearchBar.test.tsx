import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import SearchBar from "components/SearchBar";

describe("Component: SearchBar", () => {
  it("should focus on hover", () => {
    render(
      <SearchBar
        setQuery={() => {}}
        query=""
        setDateQuery={() => {}}
        date="2000"
      />
    );
    const searchbar = screen.queryByTestId("searchbar");
    expect(searchbar).toBeInTheDocument();
    userEvent.hover(searchbar!);
    expect(document.activeElement?.id).toBe("searchbar");
  });
});
