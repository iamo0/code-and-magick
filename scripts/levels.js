(function() {
  /**
   * ID уровней.
   * @enum {number}
   */
  var Level = {
    INTRO: 0,
    MOVE_LEFT: 1,
    MOVE_RIGHT: 2,
    LEVITATE: 3,
    HIT_THE_MARK: 4
  };

  /**
   * Порядок прохождения уровней.
   * @type {Array.<Level>}
   */
  var LevelSequence = [
    Level.INTRO
  ];

  /**
   * Начальный уровень.
   * @type {Level}
   */
  var INITIAL_LEVEL = LevelSequence[0];

  /**
   * Правила завершения уровня. Ключами служат ID уровней, значениями функции
   * принимающие на вход состояние уровня и возвращающие true, если раунд
   * можно завершать или false если нет.
   * @type {Object.<Level, function(Object):boolean>}
   */
  var LevelsRules = {};

  /**
   * Уровень считается пройденным, если был выпущен файлболл и он улетел
   * за экран.
   * @param {Object} state
   * @return {Verdict}
   */
  LevelsRules[Level.INTRO] = function (state) {
    var deletedFireballs = state.garbage.filter(function (object) {
      return object.type === ObjectType.FIREBALL;
    });

    var fenceHit = deletedFireballs.filter(function (fireball) {
      // Did we hit the fence?
      return fireball.x < 10 && fireball.y > 240;
    })[0];

    return fenceHit ? Verdict.WIN : Verdict.CONTINUE;
  };

  /**
   * Начальные условия для уровней.
   * @enum {Object.<Level, function>}
   */
  var LevelsInitialize = {};

  /**
   * Первый уровень.
   * @param {Object} state
   * @return {Object}
   */
  LevelsInitialize[Level.INTRO] = function (state) {
    state.objects.push(
        // Установка персонажа в начальное положение. Он стоит в крайнем левом
        // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
        // уровне равна 2px за кадр.
        {
          direction: Direction.RIGHT,
          height: GameConstants.Wizard.getHeight(GameConstants.Wizard.width),
          speed: GameConstants.Wizard.speed,
          sprite: SpriteMap[ObjectType.ME],
          state: ObjectState.OK,
          type: ObjectType.ME,
          width: GameConstants.Wizard.width,
          x: GameConstants.Wizard.getX(WIDTH),
          y: GameConstants.Wizard.getY(HEIGHT)
        }
    );

    return state;
  };

  window.Level = Level;
  window.LevelSequence = LevelSequence;
  window.LevelsInitialize = LevelsInitialize;
  window.LevelsRules = LevelsRules;
  window.INITIAL_LEVEL = INITIAL_LEVEL;
})();
