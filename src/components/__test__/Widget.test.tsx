import React from "react";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { Button } from "components/Widget";

describe("Button", () => {
  it("should display children", () => {
    render(<Button>Test</Button>);

    const text = screen.queryByText("Test");
    expect(text).toBeInTheDocument();
  });

  it("should animate on hover", () => {
    render(<Button>Test</Button>);

    const button = screen.getByText("Test");
    const originalColor = button.style.backgroundColor;
    userEvent.hover(button);
    setTimeout(() => {
      expect(originalColor).not.toEqual(button.style.backgroundColor);
      userEvent.unhover(button);
      setTimeout(() => {
        expect(originalColor).toEqual(button.style.backgroundColor);
      }, 500);
    }, 500);
  });
});
