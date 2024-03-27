import { clamp } from "../math";

const ObjectType = {
  // NB! Mule is an empty object that allows to create any type of temporary
  // object on a map with either testing purposes or to create one-time objects
  MULE: 0,
  WIZARD: 1,
  FIREBALL: 2,
  FENCE: 3,
  PLATFORM: 4,
};

const ObjectState = {
  OK: 0,
  DISPOSED: 1,
};

// NB!
// Object always have a direction. In this example object is always moving.
// On X axis object is always oriented either to left or to right. Right is
// a default direction, so when there's no flag it's implied that object is
// oriented to right.
// Same thing with Y axis. If object is not moving up, it's falling
// down due to gravity. If it stays on a surface it's falling on this surface.
const Direction = {
  // NB! RIGHT and DOWN masks are given to enable testing of all directions
  RIGHT: 0b00,
  DOWN: 0b00,
  LEFT: 0b01,
  UP: 0b10,
};

const createGameObject = (
  x,
  y,
  width,
  height,
  direction = Direction.RIGHT | Direction.DOWN,
  xSpeed = 0,
  ySpeed = 0,
  state = ObjectState.OK,
  sprite = null,
  type = ObjectType.MULE,
) => ({
  type,
  state,
  x,
  y,
  width,
  height,
  direction,
  xSpeed,
  ySpeed,
  sprite,
});


const objectsIntersectionRect = (obj1, obj2) => ({
  x: obj2.x - obj1.x,
  y: obj2.y - obj1.y,
  width: obj1.x + obj1.width - obj2.x,
  height: obj1.y + obj1.height - obj2.y,
});


const objectsIntersect = (obj1, obj2) => {
  const intersectionRect = objectsIntersectionRect(obj1, obj2);
  return (
    intersectionRect.x >= 0 &&
    intersectionRect.y >= 0 &&
    intersectionRect.width >= 0 &&
    intersectionRect.height >= 0
  );
};


const updateObject = (obj1) => {
  obj1.y = clamp(obj1.y - obj1.ySpeed, 0, Infinity);
  return obj1;
};


export {
  createGameObject,
  Direction,
  objectsIntersect,
  objectsIntersectionRect,
  updateObject,
};
