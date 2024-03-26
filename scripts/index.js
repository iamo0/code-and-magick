'use strict';


window.Game = (function () {
  /**
   * Отрисовывает на заданном канвасе с 2D контекстом облачко заданного размера
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} width
   * @param {number} height
   */
  var drawCloud = function (ctx, x, y, width, height) {
    var offset = 10;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + offset, y + height / 2);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + width / 2, y + height - offset);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width - offset, y + height / 2);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width / 2, y + offset);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.closePath();
    ctx.fill();
  };


  /**
   * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
   * и показывает приветственный экран.
   * @param {Element} container
   * @constructor
   */
  var Game = function (container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.container.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
    this._pauseListener = this._pauseListener.bind(this);

    this.setDeactivated(false);
  };

  Game.prototype = {
    /**
     * Текущий уровень игры.
     * @type {Level}
     */
    level: INITIAL_LEVEL,

    /** @param {boolean} deactivated */
    setDeactivated: function (deactivated) {
      if (this._deactivated === deactivated) {
        return;
      }

      this._deactivated = deactivated;

      if (deactivated) {
        this._removeGameListeners();
      } else {
        this._initializeGameListeners();
      }
    },

    /**
     * Состояние игры. Описывает местоположение всех объектов на игровой карте
     * и время проведенное на уровне и в игре.
     * @return {Object}
     */
    getInitialState: function () {
      return {
        // Статус игры. Если CONTINUE, то игра продолжается.
        currentStatus: Verdict.CONTINUE,

        // Объекты, удаленные на последнем кадре.
        garbage: [],

        // Время с момента отрисовки предыдущего кадра.
        lastUpdated: null,

        // Состояние нажатых клавиш.
        keysPressed: {
          ESC: false,
          LEFT: false,
          RIGHT: false,
          SPACE: false,
          UP: false
        },

        // Время начала прохождения уровня.
        levelStartTime: null,

        // Все объекты на карте.
        objects: [],

        // Время начала прохождения игры.
        startTime: null
      };
    },

    /**
     * Начальные проверки и запуск текущего уровня.
     * @param {boolean=} restart
     */
    initializeLevelAndStart: function (restart) {
      restart = typeof restart === 'undefined' ? true : restart;

      if (restart || !this.state) {
        // сбросить кэш при перезагрузке уровня
        this._imagesArePreloaded = void 0;

        // При перезапуске уровня, происходит полная перезапись состояния
        // игры из изначального состояния.
        this.state = this.getInitialState();
        this.state = LevelsInitialize[this.level](this.state);
      } else {
        // При продолжении уровня состояние сохраняется, кроме записи о том,
        // что состояние уровня изменилось с паузы на продолжение игры.
        this.state.currentStatus = Verdict.CONTINUE;
      }

      this._drawMessage('Игра загружается...');

      this._preloadImagesForLevel(function () {
        // Запись времени начала игры и времени начала уровня.
        this.state.levelStartTime = Date.now();
        if (!this.state.startTime) {
          this.state.startTime = this.state.levelStartTime;
        }

        // Предварительная отрисовка игрового экрана.
        this.render();

        // Установка обработчиков событий.
        this._initializeGameListeners();

        // Запуск игрового цикла.
        this.update();
      }.bind(this));
    },

    /**
     * Временная остановка игры.
     * @param {Verdict=} verdict
     */
    pauseLevel: function (verdict) {
      if (verdict) {
        this.state.currentStatus = verdict;
      }

      this.state.keysPressed.ESC = false;
      this.state.lastUpdated = null;

      this._removeGameListeners();
      window.addEventListener('keydown', this._pauseListener);

      this._drawPauseScreen();
    },

    /**
     * Обработчик событий клавиатуры во время паузы.
     * @param {KeyboardsEvent} evt
     * @private
     * @private
     */
    _pauseListener: function (evt) {
      if (evt.keyCode === 32 && !this._deactivated) {
        evt.preventDefault();
        var needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
          this.state.currentStatus === Verdict.FAIL;
        this.initializeLevelAndStart(needToRestartTheGame);

        window.removeEventListener('keydown', this._pauseListener);
      }
    },

    /**
     * Отрисовка экрана паузы.
     */
    _drawPauseScreen: function () {
      var message;
      switch (this.state.currentStatus) {
        case Verdict.WIN:
          message = 'Вы победили Газебо! Ура!\nНажмите пробел для перезапуска';
          break;
        case Verdict.FAIL:
          message = 'Время вышло!\nНажмите пробел чтобы начать сначала';
          break;
        case Verdict.PAUSE:
          message = 'Игра на паузе!\nНажмите Пробел, чтобы продолжить';
          break;
        case Verdict.INTRO:
          message = 'У вас есть три минуты на игру.\nНажмите пробел чтобы начать';
          break;
      }

      this._drawMessage(message);
    },

    /**
     * Отрисовка текстового сообщения на экране
     * @param {string} message
     */
    _drawMessage: function (message) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      drawCloud(this.ctx, 190, 40, 320, 100);

      this.ctx.fillStyle = 'rgba(256, 256, 256, 1.0)';
      drawCloud(this.ctx, 180, 30, 320, 100);

      this.ctx.fillStyle = '#000';
      this.ctx.font = '16px PT Mono';

      message.split('\n').forEach(function (line, i) {
        this.ctx.fillText(line, 200, 80 + 20 * i);
      }, this);
    },

    /**
     * Предзагрузка необходимых изображений для уровня.
     * @param {function} callback
     * @private
     */
    _preloadImagesForLevel: function (callback) {
      if (typeof this._imagesArePreloaded === 'undefined') {
        this._imagesArePreloaded = [];
      }

      if (this._imagesArePreloaded[this.level]) {
        callback();
        return;
      }

      var keys = Object.keys(SpriteMap);
      var imagesToGo = keys.length;

      var loadSprite = function (sprite) {
        var image = new Image(sprite.width, sprite.height);
        image.onload = function () {
          sprite.image = image;
          if (--imagesToGo === 0) {
            this._imagesArePreloaded[this.level] = true;
            callback();
          }
        }.bind(this);
        image.src = sprite.url;
      }.bind(this);

      for (var i = 0; i < keys.length; i++) {
        loadSprite(SpriteMap[keys[i]]);
      }
    },

    /**
     * Обновление статуса объектов на экране. Добавляет объекты, которые должны
     * появиться, выполняет проверку поведения всех объектов и удаляет те, которые
     * должны исчезнуть.
     * @param {number} delta Время, прошеднее с отрисовки прошлого кадра.
     */
    updateObjects: function (delta) {
      // Персонаж.
      var me = this.state.objects.filter(function (object) {
        return object.type === ObjectType.ME;
      })[0];

      // Добавляет на карту файрбол по нажатию на Shift.
      if (this.state.keysPressed.SHIFT) {
        this.state.objects.push({
          direction: me.direction,
          height: GameConstants.Fireball.size,
          speed: GameConstants.Fireball.speed(!!(me.direction & Direction.LEFT)),
          sprite: SpriteMap[ObjectType.FIREBALL],
          type: ObjectType.FIREBALL,
          width: GameConstants.Fireball.size,
          x: me.direction & Direction.RIGHT ? me.x + me.width : me.x - GameConstants.Fireball.size,
          y: me.y + me.height / 2
        });

        this.state.keysPressed.SHIFT = false;
      }

      this.state.garbage = [];

      // Убирает в garbage не используемые на карте объекты.
      var remainingObjects = this.state.objects.filter(function (object) {
        ObjectsBehaviour[object.type](object, this.state, delta);

        if (object.state === ObjectState.DISPOSED) {
          this.state.garbage.push(object);
          return false;
        }

        return true;
      }, this);

      this.state.objects = remainingObjects;
    },

    /**
     * Проверка статуса текущего уровня.
     */
    checkStatus: function () {
      // Нет нужны запускать проверку, нужно ли останавливать уровень, если
      // заранее известно, что да.
      if (this.state.currentStatus !== Verdict.CONTINUE) {
        return;
      }

      if (!this.commonRules) {
        // Проверки, не зависящие от уровня, но влияющие на его состояние.
        this.commonRules = [

          /**
           * Если персонаж мертв, игра прекращается.
           * @param {Object} state
           * @return {Verdict}
           */
          function (state) {
            var me = state.objects.filter(function (object) {
              return object.type === ObjectType.ME;
            })[0];

            return me.state === ObjectState.DISPOSED ?
              Verdict.FAIL :
              Verdict.CONTINUE;
          },

          /**
           * Если нажата клавиша Esc игра ставится на паузу.
           * @param {Object} state
           * @return {Verdict}
           */
          function (state) {
            return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
          },

          /**
           * Игра прекращается если игрок продолжает играть в нее три минуты подряд.
           * @param {Object} state
           * @return {Verdict}
           */
          function (state) {
            return Date.now() - state.startTime > 3 * 60 * 1000 ?
              Verdict.FAIL :
              Verdict.CONTINUE;
          }
        ];
      }

      // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
      // по всем универсальным проверкам и проверкам конкретного уровня.
      // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
      // любое другое состояние кроме CONTINUE или пока не пройдут все
      // проверки. После этого состояние сохраняется.
      var allChecks = this.commonRules.concat(LevelsRules[this.level]);
      var currentCheck = Verdict.CONTINUE;
      var currentRule;

      while (currentCheck === Verdict.CONTINUE && allChecks.length) {
        currentRule = allChecks.shift();
        currentCheck = currentRule(this.state);
      }

      this.state.currentStatus = currentCheck;
    },

    /**
     * Принудительная установка состояния игры. Используется для изменения
     * состояния игры от внешних условий, например, когда необходимо остановить
     * игру, если она находится вне области видимости и установить вводный
     * экран.
     * @param {Verdict} status
     */
    setGameStatus: function (status) {
      if (this.state.currentStatus !== status) {
        this.state.currentStatus = status;
      }
    },

    /**
     * Отрисовка всех объектов на экране.
     */
    render: function () {
      // Удаление всех отрисованных на странице элементов.
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Выставление всех элементов, оставшихся в this.state.objects согласно
      // их координатам и направлению.
      this.state.objects.forEach(function (object) {
        if (object.sprite) {
          var reversed = object.direction & Direction.LEFT;
          var sprite = SpriteMap[object.type + (reversed ? REVERSED : '')] || SpriteMap[object.type];
          this.ctx.drawImage(sprite.image, object.x, object.y, object.width, object.height);
        }
      }, this);
    },

    /**
     * Основной игровой цикл. Сначала проверяет состояние всех объектов игры
     * и обновляет их согласно правилам их поведения, а затем запускает
     * проверку текущего раунда. Рекурсивно продолжается до тех пор, пока
     * проверка не вернет состояние FAIL, WIN или PAUSE.
     */
    update: function () {
      if (!this.state.lastUpdated) {
        this.state.lastUpdated = Date.now();
      }

      var delta = (Date.now() - this.state.lastUpdated) / 10;
      this.updateObjects(delta);
      this.checkStatus();

      switch (this.state.currentStatus) {
        case Verdict.CONTINUE:
          this.state.lastUpdated = Date.now();
          this.render();
          requestAnimationFrame(function () {
            this.update();
          }.bind(this));
          break;

        case Verdict.WIN:
        case Verdict.FAIL:
        case Verdict.PAUSE:
        case Verdict.INTRO:
          this.pauseLevel();
          break;
      }
    },

    /**
     * @param {KeyboardEvent} evt [description]
     * @private
     */
    _onKeyDown: function (evt) {
      switch (evt.keyCode) {
        case 37:
          this.state.keysPressed.LEFT = true;
          break;
        case 39:
          this.state.keysPressed.RIGHT = true;
          break;
        case 38:
          this.state.keysPressed.UP = true;
          break;
        case 27:
          this.state.keysPressed.ESC = true;
          break;
      }

      if (evt.shiftKey) {
        this.state.keysPressed.SHIFT = true;
      }
    },

    /**
     * @param {KeyboardEvent} evt [description]
     * @private
     */
    _onKeyUp: function (evt) {
      switch (evt.keyCode) {
        case 37:
          this.state.keysPressed.LEFT = false;
          break;
        case 39:
          this.state.keysPressed.RIGHT = false;
          break;
        case 38:
          this.state.keysPressed.UP = false;
          break;
        case 27:
          this.state.keysPressed.ESC = false;
          break;
      }

      if (evt.shiftKey) {
        this.state.keysPressed.SHIFT = false;
      }
    },

    /** @private */
    _initializeGameListeners: function () {
      window.addEventListener('keydown', this._onKeyDown);
      window.addEventListener('keyup', this._onKeyUp);
    },

    /** @private */
    _removeGameListeners: function () {
      window.removeEventListener('keydown', this._onKeyDown);
      window.removeEventListener('keyup', this._onKeyUp);
    }
  };

  Game.Verdict = Verdict;

  var game = new Game(document.querySelector('.demo'));

  window.restartGame = function (wizardRightImage, wizardLeftImage) {
    SpriteMap[ObjectType.ME].url = wizardRightImage;
    SpriteMap[ObjectType.ME + REVERSED].url = wizardLeftImage;

    game.initializeLevelAndStart();
    game.setGameStatus(Verdict.INTRO);
  };

  window.restartGame('img/wizard.gif', 'img/wizard-reversed.gif');

  return game;
})();
