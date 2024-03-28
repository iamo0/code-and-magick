import { updateObject } from "./index";
import { 
  createGameObject, 
  Direction 
} from "./objects";

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
