const GameStatus = {
  INTRO: 0,
  PAUSE: 1,
  CONTINUE: 2,
  WIN: 3,
  LOOSE: 4,
};


const createLevel = () => ({
  garbage: [],
  objects: [],
  objectives: new Set([
    [GameStatus.WIN, (objects, garbage) => {}],
    [GameStatus.LOOSE, (objects, garbage) => {}],
  ]),
});


const GameControls = {
  NULL:  0b000000,
  UP:    0b000001,
  DOWN:  0b000010,
  LEFT:  0b000100,
  RIGHT: 0b001000,
  PAUSE: 0b010000,
  FIRE:  0b100000,
};


const getGame = (currentStatus = GameStatus.INTRO) => ({
  activeControls: GameControls.NULL,
  currentLevel: null,
  currentStatus,
  levelSequence: [],
});


const getNextGameStatus = (prevTimestamp, game) => {
  return game.currentStatus;
};


const initializeGame = () => {
  const game = getGame();
  
  updateGame(game);
};


const updateGame = (game) => {
  const nextStatus = getNextGameStatus(Date.now(), game);
  if (nextStatus === GameStatus.CONTINUE) {
    updateGame(game);
  }
};

export {
  GameControls,
};
