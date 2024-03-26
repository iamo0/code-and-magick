
(function() {
  /**
   * Допустимые виды объектов на карте.
   * @enum {number}
   */
  var ObjectType = {
    ME: 0,
    FIREBALL: 1
  };

  /**
   * Допустимые состояния объектов.
   * @enum {number}
   */
  var ObjectState = {
    OK: 0,
    DISPOSED: 1
  };

  /**
   * Карта спрайтов игры.
   * @type {Object.<ObjectType, Object>}
   */
  var SpriteMap = {};
  var REVERSED = '-reversed';

  SpriteMap[ObjectType.ME] = {
    width: 61,
    height: 84,
    url: 'img/wizard.gif'
  };

  // TODO: Find a clever way
  SpriteMap[ObjectType.ME + REVERSED] = {
    width: 61,
    height: 84,
    url: 'img/wizard-reversed.gif'
  };

  SpriteMap[ObjectType.FIREBALL] = {
    width: 24,
    height: 24,
    url: 'img/fireball.gif'
  };

  var GameConstants = {
    Fireball: {
      size: window.fireballSize || 24,
      speed: window.getFireballSpeed || function (movingLeft) {
        return movingLeft ? 2 : 5;
      }
    },

    Wizard: {
      speed: window.wizardSpeed || 2,
      width: window.wizardWidth || 61,
      getHeight: window.getWizardHeight || function (width) {
        return 1.377 * width;
      },
      getX: window.getWizardX || function (width) {
        return width / 3;
      },
      getY: window.getWizardY || function (height) {
        return height - 100;
      }
    }
  };



  /**
   * Правила перерисовки объектов в зависимости от состояния игры.
   * @type {Object.<ObjectType, function(Object, Object, number): Object>}
   */
  var ObjectsBehaviour = {};

  /**
   * Обновление движения мага. Движение мага зависит от нажатых в данный момент
   * стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
   * На движение мага влияет его пересечение с препятствиями.
   * @param {Object} object
   * @param {Object} state
   * @param {number} timeframe
   */
  ObjectsBehaviour[ObjectType.ME] = function (object, state, timeframe) {
    // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
    // в воздухе на определенной высоте.
    // NB! Сложность заключается в том, что поведение описано в координатах
    // канваса, а не координатах, относительно нижней границы игры.
    if (state.keysPressed.UP && object.y > 0) {
      object.direction = object.direction & ~Direction.DOWN;
      object.direction = object.direction | Direction.UP;
      object.y -= object.speed * timeframe * 2;
    }

    // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
    // опускается на землю.
    if (!state.keysPressed.UP) {
      if (object.y < HEIGHT - object.height) {
        object.direction = object.direction & ~Direction.UP;
        object.direction = object.direction | Direction.DOWN;
        object.y += object.speed * timeframe / 3;
      }
    }

    // Если зажата стрелка влево, маг перемещается влево.
    if (state.keysPressed.LEFT) {
      object.direction = object.direction & ~Direction.RIGHT;
      object.direction = object.direction | Direction.LEFT;
      object.x -= object.speed * timeframe;
    }

    // Если зажата стрелка вправо, маг перемещается вправо.
    if (state.keysPressed.RIGHT) {
      object.direction = object.direction & ~Direction.LEFT;
      object.direction = object.direction | Direction.RIGHT;
      object.x += object.speed * timeframe;
    }

    // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
    if (object.y < 0) {
      object.y = 0;
    }

    if (object.y > HEIGHT - object.height) {
      object.y = HEIGHT - object.height;
    }

    if (object.x < 0) {
      object.x = 0;
    }

    if (object.x > WIDTH - object.width) {
      object.x = WIDTH - object.width;
    }
  };

  /**
   * Обновление движения файрбола. Файрбол выпускается в определенном направлении
   * и после этого неуправляемо движется по прямой в заданном направлении. Если
   * он пролетает весь экран насквозь, он исчезает.
   * @param {Object} object
   * @param {Object} _state
   * @param {number} timeframe
   */
  ObjectsBehaviour[ObjectType.FIREBALL] = function (object, _state, timeframe) {
    if (object.direction & Direction.LEFT) {
      object.x -= object.speed * timeframe;
    }

    if (object.direction & Direction.RIGHT) {
      object.x += object.speed * timeframe;
    }

    if (object.x < 0 || object.x > WIDTH) {
      object.state = ObjectState.DISPOSED;
    }
  };

  window.GameConstants = GameConstants;
  window.ObjectsBehaviour = ObjectsBehaviour;
  window.ObjectState = ObjectState;
  window.ObjectType = ObjectType;
  window.REVERSED = REVERSED;
  window.SpriteMap = SpriteMap;
})();
