import { 
  clamp,
  createGameObject,
  Direction,
  objectsIntersect,
  objectsIntersectionRect,
  updateObject,
} from './index';

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

describe("Objects intersection", () => {
  test("Objects intersection rectangle is correctly detected", () => {
    const obj1 = createGameObject(0, 0, 100, 100);
    const obj2 = createGameObject(75, 75, 100, 100);

    expect(objectsIntersectionRect(obj1, obj2)).toEqual({
      x: 75,
      y: 75,
      width: 25,
      height: 25,
    });
  });

  test("Correctly detected whether objects intersect or not", () => {
    const obj1 = createGameObject(0, 0, 100, 100);
    const obj2 = createGameObject(75, 75, 100, 100);

    expect(objectsIntersect(obj1, obj2)).toBe(true);
  });
});

describe("Movement tests", () => {
  describe("Gravity tests", () => {
    test("Object moves down with its vertical speed when it's not staying on the ground", () => {
      const initialObject = createGameObject(
        0, 10, 10, 10, 
        Direction.RIGHT | Direction.DOWN,
        0, 5
      );
      expect(updateObject(initialObject).y).toEqual(5);
    });

    test("Object doesn't move down if it stays on the ground (y = 0)", () => {
      const initialObject = createGameObject(
        0, 0, 10, 10, 
        Direction.RIGHT | Direction.DOWN,
        0, 5
      );
      expect(updateObject(initialObject).y).toEqual(0);
    });

    test("It is impossible for the object to fall below ground: negative Y coord is turned to 0", () => {
      const initialObject = createGameObject(
        0, -5, 10, 10, 
        Direction.RIGHT | Direction.DOWN,
        0, 5
      );

      expect(updateObject(initialObject).y).toEqual(0);
    });
  });
});
