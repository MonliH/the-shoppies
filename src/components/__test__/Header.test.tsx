import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "components/Header";

describe("Header", () => {
  it("should display basic info", () => {
    render(<Header />);
    const shoppies = screen.getAllByText(/the shoppies/i);
    expect(shoppies).toHaveLength(2);

    const nominate = screen.getByText(/nominate/i);
    expect(nominate).toBeInTheDocument();
  });

  it("should have a logo", () => {
    render(<Header />);
    const image = screen.getByAltText("Logo");
    expect(image).toBeInTheDocument();
    expect(image).toHaveProperty("width");
    expect(image).toHaveProperty("height");
  });
});
