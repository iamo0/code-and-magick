import { GameStatus } from "../index";
import { 
  BaseGameObject,
  Direction,
  GameObjectType,
  getObjectsIntersectionType,
  ObjectsIntersectionType,
} from "../objects/objects";
import { createWizard } from "../objects/objects-wizard";
import { BaseLevelObject } from "./levels";


const IntroLevelObject = Object.seal({
  ...BaseLevelObject,

  objects: [
    // Wizard is situated somewhat at the left in the air and it's faced left
    createWizard({
      x: 100,
      y: 10,
      direction: Direction.LEFT,
    }),

    // Fence as a target
    {
      ...BaseGameObject,
      type: GameObjectType.FENCE,
      x: 0,
      y: 0,
      width: 50,
      height: 100,
    },
  ],

  objectives: new Map([
    // Level is won when wizard successfully managed 
    // to hit a fence with fireball
    [GameStatus.WIN, (objects, _garbage) => {
      const fb = objects.find((it) => it.type === GameObjectType.FIREBALL);

      if (fb === undefined) {
        return false;
      }

      const fence = objects.find((it) => it.type === GameObjectType.FENCE);

      if (fence === undefined) {
        throw new Error("There should be a fence on a map");
      }

      const intersectionType = getObjectsIntersectionType(fb, fence);

      return new Set([
        ObjectsIntersectionType.COLLIDE,
        ObjectsIntersectionType.WITHIN,
      ]).has(intersectionType);
    }],
    
    // Level is lost when fireball hits wizard
    [GameStatus.LOOSE, (objects, _garbage) => {
      const fb = objects.find((it) => it.type === GameObjectType.FIREBALL);

      if (fb === undefined) {
        return false;
      }

      const me = objects.find((it) => it.type === GameObjectType.WIZARD);

      if (me === undefined) {
        throw new Error("There should be a wizard on a map");
      }

      const intersectionType = getObjectsIntersectionType(fb, me);

      return new Set([
        ObjectsIntersectionType.COLLIDE,
        ObjectsIntersectionType.WITHIN,
      ]).has(intersectionType);
    }],
  ]),
});


export {
  IntroLevelObject,
}
