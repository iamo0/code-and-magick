import { GameStatus } from "../index";


const BaseLevelObject = Object.seal({
  garbage: [],
  objects: [],
  objectives: new Map([
    [GameStatus.WIN, (_objects, _garbage) => false],
    [GameStatus.LOOSE, (_objects, _garbage) => false],
  ]),
});


const getLevelStatus = (level) => {
  for (const [gameStatus, checkFn] of level.objectives) {
    if (checkFn(level.objects, level.garbage)) {
      return gameStatus;
    }
  }

  return GameStatus.CONTINUE;
};


export {
  BaseLevelObject,
  getLevelStatus,
};
