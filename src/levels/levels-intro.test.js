import { GameStatus } from "..";
import { BaseGameObject, GameObjectType } from "../objects/objects";
import { createWizard } from "../objects/objects-wizard";
import { getLevelStatus } from "./levels";
import { IntroLevelObject } from "./levels-intro";


describe("Intro level status check", () => {
  describe("Winning conditions", () => {
    test("Level is won if there's a fireball object that's within a fence object", () => {
      const introLevel = { 
        ...IntroLevelObject,
        objects: [
          createWizard({
            x: 100,
            y: 100,
          }),
          {
            ...BaseGameObject,
            x: 0, 
            y: 0,
            width: 50,
            height: 100,
            type: GameObjectType.FENCE,
          },
          {
            ...BaseGameObject,
            x: 30,
            y: 50,
            type: GameObjectType.FIREBALL,
          },
        ],
      };


      
      const levelStatus = getLevelStatus(introLevel);
      expect(levelStatus).toBe(GameStatus.WIN);
    });

    test("Level is won if there's a fireball object that's in contact with fence object", () => {
      const introLevel = { 
        ...IntroLevelObject,
        objects: [
          createWizard({
            x: 100,
            y: 100,
          }),
          {
            ...BaseGameObject,
            x: 0, 
            y: 0,
            width: 50,
            height: 100,
            type: GameObjectType.FENCE,
          },
          {
            ...BaseGameObject,
            x: 50,
            y: 50,
            type: GameObjectType.FIREBALL,
          },
        ],
      };
      
      const levelStatus = getLevelStatus(introLevel);
      expect(levelStatus).toBe(GameStatus.WIN);
    });


    test("If fireball is on a map but doesn't concact with fence level is continued", () => {
      const introLevel = { 
        ...IntroLevelObject,
        objects: [
          createWizard({
            x: 100,
            y: 0,
          }),

          {
            ...BaseGameObject,
            x: 0, 
            y: 0,
            width: 50,
            height: 100,
            type: GameObjectType.FENCE,
          },
          {
            ...BaseGameObject,
            x: 300,
            y: 300,
            type: GameObjectType.FIREBALL,
          },
        ],
      };
      
      const levelStatus = getLevelStatus(introLevel);
      expect(levelStatus).toBe(GameStatus.CONTINUE);
    });

    test("If there're several fireballs on a map and at least one of them is contacted with fence, level is won", () => {
      const introLevel = { 
        ...IntroLevelObject,
        objects: [
          createWizard({
            x: 100,
            y: 0,
          }),

          {
            ...BaseGameObject,
            x: 0, 
            y: 0,
            width: 50,
            height: 100,
            type: GameObjectType.FENCE,
          },
          {
            ...BaseGameObject,
            x: 300,
            y: 300,
            type: GameObjectType.FIREBALL,
          },
          {
            ...BaseGameObject,
            x: 50,
            y: 50,
            type: GameObjectType.FIREBALL,
          },
        ],
      };
      
      const levelStatus = getLevelStatus(introLevel);
      expect(levelStatus).toBe(GameStatus.WIN);
    });

    test("If there're several fireballs on a map and none of them is contacted with fence, level is continued", () => {
      const introLevel = { 
        ...IntroLevelObject,
        objects: [
          createWizard({
            x: 100,
            y: 0,
          }),

          {
            ...BaseGameObject,
            x: 0, 
            y: 0,
            width: 50,
            height: 100,
            type: GameObjectType.FENCE,
          },
          {
            ...BaseGameObject,
            x: 300,
            y: 300,
            type: GameObjectType.FIREBALL,
          },
          {
            ...BaseGameObject,
            x: 400,
            y: 400,
            type: GameObjectType.FIREBALL,
          },
        ],
      };
      
      const levelStatus = getLevelStatus(introLevel);
      expect(levelStatus).toBe(GameStatus.CONTINUE);
    });
  });

  describe("Loosing conditions", () => {
    test("Level is lost if there's a fireball that's in concact with player. WITHIN", () => {
      const introLevel = { 
        ...IntroLevelObject,
        objects: [
          createWizard({
            x: 100,
            y: 0,
            width: 100,
            height: 100,
          }),

          {
            ...BaseGameObject,
            x: 0, 
            y: 0,
            width: 50,
            height: 100,
            type: GameObjectType.FENCE,
          },
          {
            ...BaseGameObject,
            x: 150,
            y: 50,
            type: GameObjectType.FIREBALL,
          },
        ],
      };
      
      const levelStatus = getLevelStatus(introLevel);
      expect(levelStatus).toBe(GameStatus.LOOSE);
    });

    test("Level is lost if there're several fireballs and at least one of them is in concact with player. WITHIN", () => {
      const introLevel = { 
        ...IntroLevelObject,
        objects: [
          createWizard({
            x: 100,
            y: 0,
            width: 100,
            height: 100,
          }),

          {
            ...BaseGameObject,
            x: 0, 
            y: 0,
            width: 50,
            height: 100,
            type: GameObjectType.FENCE,
          },
          {
            ...BaseGameObject,
            x: 400,
            y: 400,
            type: GameObjectType.FIREBALL,
          },
          {
            ...BaseGameObject,
            x: 150,
            y: 50,
            type: GameObjectType.FIREBALL,
          },
        ],
      };
      
      const levelStatus = getLevelStatus(introLevel);
      expect(levelStatus).toBe(GameStatus.LOOSE);
    });

    test("Level is lost if there's a fireball that's in concact with player. COLLIDE", () => {
      const introLevel = { 
        ...IntroLevelObject,
        objects: [
          createWizard({
            x: 100,
            y: 0,
            width: 100,
            height: 100,
          }),

          {
            ...BaseGameObject,
            x: 0,
            y: 0,
            width: 50,
            height: 100,
            type: GameObjectType.FENCE,
          },
          {
            ...BaseGameObject,
            x: 200,
            y: 50,
            width: 20,
            height: 20,
            type: GameObjectType.FIREBALL,
          },
        ],
      };
      
      const levelStatus = getLevelStatus(introLevel);
      expect(levelStatus).toBe(GameStatus.LOOSE);
    });

    test("Level is lost if there're several fireballs and at least one of them is in concact with player. COLLIDE", () => {
      const introLevel = { 
        ...IntroLevelObject,
        objects: [
          createWizard({
            x: 100,
            y: 0,
            width: 100,
            height: 100,
          }),

          {
            ...BaseGameObject,
            x: 0,
            y: 0,
            width: 50,
            height: 100,
            type: GameObjectType.FENCE,
          },
          {
            ...BaseGameObject,
            x: 400,
            y: 400,
            type: GameObjectType.FIREBALL,
          },
          {
            ...BaseGameObject,
            x: 200,
            y: 50,
            width: 20,
            height: 20,
            type: GameObjectType.FIREBALL,
          },
        ],
      };
      
      const levelStatus = getLevelStatus(introLevel);
      expect(levelStatus).toBe(GameStatus.LOOSE);
    });
  });
});
