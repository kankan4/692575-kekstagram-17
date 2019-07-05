'use strict';

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


// @see https://learn.javascript.ru/task/random-int-min-max
function randomInteger(min, max) {
  var rand = min + Math.random() * (max + 1 - min);
  rand = Math.floor(rand);
  return rand;
}

function getRandomItemFromArray(arr) {
  return arr[randomInteger(0, arr.length - 1)];
}

function createUserName(nameTemplates) {
  return getRandomItemFromArray(nameTemplates.FIRST_PART) + getRandomItemFromArray(nameTemplates.LAST_PART);
}

function createRandomComments(number) {
  var comments = [];

  for (var i = 1; i <= number; i++) {
    var commentText = getRandomItemFromArray(COMMENT_TEMPLATES);

    // Случайное добавление дополнительного текста к комментарию
    if (randomInteger(0, 1)) {
      var additionalText = getRandomItemFromArray(COMMENT_TEMPLATES);
      // Исключение повторного использования того же текста
      while (additionalText === commentText) {
        additionalText = getRandomItemFromArray(COMMENT_TEMPLATES);
      }
      commentText += ' ' + additionalText;
    }

    var comment = {
      avatar: 'img/avatar-' + randomInteger(1, AVATARS_NUMBER) + '.svg',
      message: commentText,
      name: createUserName(NameTemplates)
    };
    comments.push(comment);
  }

  return comments;
}

function generateMocks() {
  var pictures = [];
  for (var i = 1; i <= PHOTOS_NUMBER; i++) {
    var picture = {
      url: 'photos/' + i + '.jpg',
      likes: randomInteger(15, 200),
      comments: createRandomComments(randomInteger(0, 8))
    };
    pictures.push(picture);
  }

  return pictures;
}

function createPictureElement(picture) {
  var pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
  var pictureElement = pictureTemplate.cloneNode(true);

  var img = pictureElement.querySelector('.picture__img');
  img.src = picture.url;

  var commentsElement = pictureElement.querySelector('.picture__comments');
  commentsElement.textContent = picture.comments.length;

  var likesElement = pictureElement.querySelector('.picture__likes');
  likesElement.textContent = picture.likes;

  return pictureElement;
}

function addPicturesToPage(pictures) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pictures.length; i++) {
    var pictureElement = createPictureElement(pictures[i]);
    fragment.appendChild(pictureElement);
  }

  var picturesList = document.querySelector('.pictures');
  picturesList.appendChild(fragment);
}

var pictures = generateMocks();
addPicturesToPage(pictures);
