import { GameStatus } from "../index";
import {
  BaseLevelObject,
  getLevelStatus,
} from "./levels";


describe("Level status check", () => {
  test("Default status for level is to CONTINUE", () => {
    const randomLevel = { 
      ...BaseLevelObject,
      objectives: new Map(),
    };
    expect(getLevelStatus(randomLevel)).toBe(GameStatus.CONTINUE);
  });

  test("If one of status checks returns true, this status is returned", () => {
    const randomLevel = { 
      ...BaseLevelObject,
      objectives: new Map([
        [GameStatus.WIN, (_objects, _garbage) => true],
      ]),
    };

    expect(getLevelStatus(randomLevel)).toBe(GameStatus.WIN);
  });

  test("If several status checks return true, first one is used", () => {
    const randomLevel = { 
      ...BaseLevelObject,
      objectives: new Map([
        [GameStatus.WIN, (_objects, _garbage) => true],
        [GameStatus.LOOSE, (_objects, _garbage) => true],
      ]),
    };

    expect(getLevelStatus(randomLevel)).toBe(GameStatus.WIN);
  });

  test("If none of status checks return true, CONTINUE is used", () => {
    const randomLevel = { 
      ...BaseLevelObject,
      objectives: new Map([
        [GameStatus.WIN, (_objects, _garbage) => false],
        [GameStatus.LOOSE, (_objects, _garbage) => false],
      ]),
    };

    expect(getLevelStatus(randomLevel)).toBe(GameStatus.CONTINUE);
  });
});
