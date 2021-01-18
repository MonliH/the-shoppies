import { isOk } from "lib/result";

test("isOk on ok value", () => {
  expect(isOk(["This is not a string"])).toBe(true);
});

test("isOk on non-ok value", () => {
  expect(isOk("This is a string")).toBe(false);
});
