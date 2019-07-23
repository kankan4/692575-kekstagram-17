'use strict';

(function () {
  /**
   * Возвращение случайного целого в рамках указанного диапазона
   * @param {number} min минимальное значение
   * @param {number} max максимальное значение
   * @see https://learn.javascript.ru/task/random-int-min-max
   * @return {number} случайное целое
   */
  function getRandomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
  }

  /**
   * Возвращает случайный элемент массива
   * @param {array} arr минимальное значение
   * @return {*} элемент массива
   */
  function getRandomItemFromArray(arr) {
    return arr[getRandomInteger(0, arr.length - 1)];
  }

  window.util = {
    getRandomInteger: getRandomInteger,
    getRandomItemFromArray: getRandomItemFromArray
  };
})();
