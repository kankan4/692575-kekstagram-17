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
  var NameTemplates = {
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
        name: createRandomName(NameTemplates)
      };
      comments.push(comment);
    }

    return comments;
  }

  /**
   * Генерация моков с изображениями и их комментариями для кекстаграмма
   * @param {function} onSuccess callback, в который передаются сгенерированые данные
   */
  function mock(onSuccess) {
    var picturesInfo = [];
    for (var i = 1; i <= PHOTOS_NUMBER; i++) {
      var picture = {
        url: 'photos/' + i + '.jpg',
        likes: deps.util.getRandomInteger(15, 200),
        comments: createRandomComments(deps.util.getRandomInteger(0, 8))
      };
      picturesInfo.push(picture);
    }
    onSuccess(picturesInfo);
  }

  /**
   * Получение данных с сервера
   * @param {string} url адрес сервиса, предоставляющего данные
   * @param {function} onSuccess callback, в который передаются успешно полученные данные
   * @param {function} onError callback, в который передается текст ошибки
   */
  function load(url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 15000;

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError(new Error('Ошибка соединения'));
    });
    xhr.addEventListener('timeout', function () {
      onError(new Error('Таймаут соединения: ' + xhr.timeout + 'мс'));
    });

    xhr.open('GET', url);
    xhr.send();
  }

  window.data = {
    mock: mock,
    load: load,
  };
})();
