import React from "react";
import { render, screen } from "@testing-library/react";
import AnimatedElement from "components/AnimatedElement";

describe("Component: AnimatedElement", () => {
  it("should have the text", () => {
    const testString = "this is a test string aIOawi92";
    render(
      <AnimatedElement visible height="100px" style={{}}>
        <div>{testString}</div>
      </AnimatedElement>
    );
    const string = screen.getByText(testString);
    expect(string).toBeInTheDocument();
  });

  it("should be invisible", () => {
    const testString = "this is a test string aIOawi92";
    render(
      <AnimatedElement visible={false} height="100px" style={{}}>
        <div>{testString}</div>
      </AnimatedElement>
    );
    const string = screen.getByText(testString);
    expect(string).not.toBeVisible();
  });
});
