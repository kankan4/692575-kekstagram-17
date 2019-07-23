'use strict';

// Генерация моков и добавление фотографий на страницу
(function () {

  var deps = {
    util: window.util
  };

  var PHOTOS_NUMBER = 25;
  var AVATARS_NUMBER = 6;
  var COMMENT_TEMPLATES = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];
  var nameTemplates = {
    FIRST_PART: ['Пе', 'Ар', 'Па', 'Ма', 'Ва', 'Ки'],
    LAST_PART: ['тур', 'вел', 'зик', 'силий', 'тя']
  };

  /**
   * Генерация случайного имени из двух частей, переданных в виде массивов с вариантами
   * @param {Object} templates объект с массивами, содержащими возможные части имени
   * @return {string} сгенерированное имя
   * @private
   */
  function createRandomName(templates) {
    return deps.util.getRandomItemFromArray(templates.FIRST_PART) + deps.util.getRandomItemFromArray(templates.LAST_PART);
  }

  /**
   * Генерация случайного комментария на основе хранящихся в модуле шаблонов
   * @param {number} number количество комментариев
   * @return {array} массив объектов с комментариями
   * @private
   */
  function createRandomComments(number) {
    var comments = [];

    for (var i = 1; i <= number; i++) {
      var commentText = deps.util.getRandomItemFromArray(COMMENT_TEMPLATES);

      // Случайное добавление дополнительного текста к комментарию
      if (deps.util.getRandomInteger(0, 1)) {
        var additionalText = deps.util.getRandomItemFromArray(COMMENT_TEMPLATES);
        // Исключение повторного использования того же текста
        while (additionalText === commentText) {
          additionalText = deps.util.getRandomItemFromArray(COMMENT_TEMPLATES);
        }
        commentText += ' ' + additionalText;
      }

      var comment = {
        avatar: 'img/avatar-' + deps.util.getRandomInteger(1, AVATARS_NUMBER) + '.svg',
        message: commentText,
        name: createRandomName(nameTemplates)
      };
      comments.push(comment);
    }

    return comments;
  }

  /**
   * Генерация моков с изображениями и их комментариями для кекстаграмма
   * @return {array} массив объектов с информацией об изображениях
   */
  function generateMocks() {
    var picturesInfo = [];
    for (var i = 1; i <= PHOTOS_NUMBER; i++) {
      var picture = {
        url: 'photos/' + i + '.jpg',
        likes: deps.util.getRandomInteger(15, 200),
        comments: createRandomComments(deps.util.getRandomInteger(0, 8))
      };
      picturesInfo.push(picture);
    }
    return picturesInfo;
  }

  window.data = {
    generateMocks: generateMocks
  };

})();
