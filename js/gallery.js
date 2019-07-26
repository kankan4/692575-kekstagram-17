'use strict';

(function () {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  /**
   * Создание HTML элемента с изображением на основе html template
   * @param {Object} picture объект с информацией об изображении
   * @return {Object} HTML элемент с изображением для главной страницы
   * @private
   */
  function createPictureElement(picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    var img = pictureElement.querySelector('.picture__img');
    img.src = picture.url;

    var commentsElement = pictureElement.querySelector('.picture__comments');
    commentsElement.textContent = picture.comments.length;

    var likesElement = pictureElement.querySelector('.picture__likes');
    likesElement.textContent = picture.likes;

    return pictureElement;
  }

  /**
   * Добавление сгенерированных изображений на главную страницу
   * @param {array} picturesInfo массив объектов с информацией об изображениях
   */
  function init(picturesInfo) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < picturesInfo.length; i++) {
      var pictureElement = createPictureElement(picturesInfo[i]);
      fragment.appendChild(pictureElement);
    }

    var picturesList = document.querySelector('.pictures');
    picturesList.appendChild(fragment);
  }

  window.gallery = {
    init: init
  };
})();
