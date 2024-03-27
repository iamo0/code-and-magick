import { 
  createGameObject,
  objectsIntersect,
  objectsIntersectionRect,
} from './index';

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
