(function() {
  /**
   * @const
   * @type {number}
   */
  var HEIGHT = 400;

  /**
   * @const
   * @type {number}
   */
  var WIDTH = 700;

  /**
   * Коды направлений.
   * @enum {number}
   */
  var Direction = {
    NULL: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 4,
    DOWN: 8
  };


  /**
   * ID возможных ответов функций, проверяющих успех прохождения уровня.
   * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
   * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
   * нужно прервать.
   * @enum {number}
   */
  var Verdict = {
    CONTINUE: 0,
    WIN: 1,
    FAIL: 2,
    PAUSE: 3,
    INTRO: 4
  };


  window.Direction = Direction;
  window.HEIGHT = HEIGHT;
  window.Verdict = Verdict;
  window.WIDTH = WIDTH;
})();
