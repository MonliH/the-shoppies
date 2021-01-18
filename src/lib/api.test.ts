import {
  getLinkHighRes,
  addAnd,
  isEmpty,
  modifyError,
  intoUrlFormat,
} from "lib/api";

test("API: getLinkHighRes", () => {
  // The matrix cover
  const baseLink =
    "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@";
  const originalLink = `${baseLink}._V1_SX300.jpg`;
  expect(getLinkHighRes(originalLink)).toBe(baseLink);
});

describe("API: modifyError", () => {
  it("should modify movie not found", () => {
    expect(modifyError("Movie not found!")).toBe("No movies found!");
  });

  it("should not modify anything else", () => {
    expect(modifyError("something not error")).toBe("something not error");
  });
});

test("API: intoUrlFormat", () => {
  expect(intoUrlFormat({ myKey: "value test", "other vale": "10" })).toBe(
    "myKey=value%20test&other%20vale=10"
  );
});

describe("API: isEmpty", () => {
  it("should reject not rated", () => {
    expect(isEmpty("not rated")).toBe(true);
  });
  it("should reject not rated (any case)", () => {
    expect(isEmpty("nOT RateD")).toBe(true);
  });
  it("should reject n/a", () => {
    expect(isEmpty("n/a")).toBe(true);
  });
  it("should reject N/A (uppercase)", () => {
    expect(isEmpty("N/A")).toBe(true);
  });
  it("should not reject legitimate string", () => {
    expect(isEmpty("This is a real string")).toBe(false);
  });
});

describe("API: addAnd", () => {
  it('should add "and" to two item clause', () => {
    expect(addAnd("Hello, Hello")).toBe("Hello and Hello");
  });
  it('should add "and" to a multiple item clause', () => {
    expect(addAnd("Hello, Hello, Hello, Test, AD@*JDOAWjd")).toBe(
      "Hello, Hello, Hello, Test and AD@*JDOAWjd"
    );
  });
  it('should not "add" and with one item', () => {
    expect(addAnd("Test string!")).toBe("Test string!");
  });

  it("should not add and with one item", () => {
    expect(addAnd("Test string!")).toBe("Test string!");
  });
});
