import { clamp } from "./math";

const updateObject = (obj1) => {
  obj1.y = clamp(obj1.y - obj1.ySpeed, 0, Infinity);
  return obj1;
};

export { updateObject };
