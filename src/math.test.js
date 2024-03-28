import { clamp } from "./math";

describe("Utility functions", () => {
  describe("Clamp function", () => {
    test("Returns value as is if it's whitin boundaries", () => {
      expect(clamp(5, 0, 10)).toEqual(5);
    });

    test("Returns max value if passed value is bigger than max", () => {
      expect(clamp(15, 0, 10)).toEqual(10);
    });

    test("Returns min value if passed value is lower than min", () => {
      expect(clamp(-5, 0, 10)).toEqual(0);
    });
  });
});
