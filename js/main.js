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


var ESC_KEYCODE = 27;
var EFFECT_CLASSNAME_PREFIX = 'effects__preview--';
var EFFECT_NONE_VALUE = 'none';
var EFFECT_NONE_CLASS = EFFECT_CLASSNAME_PREFIX + EFFECT_NONE_VALUE;
var SCALE_STEP = 25;
var SLIDER_DEFAULT_VALUE = 100;

// Генерация моков и добавление фотографий на страницу

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

var uploadButton = document.querySelector('#upload-file');
uploadButton.addEventListener('change', function () {
  openPopup();
});

function openPopup() {
  // Компоненты окна загрузки загрузки изображения
  var uploadedImageForm = document.querySelector('.img-upload__overlay');
  var uploadedImage = uploadedImageForm.querySelector('.img-upload__preview');
  var imageEffectsList = document.querySelectorAll('.effects__list .effects__radio');
  var cancelButton = uploadedImageForm.querySelector('#upload-cancel');
  var effectLevelControls = uploadedImageForm.querySelector('.img-upload__effect-level');
  var descriptionField = document.querySelector('.text__description');

  // Компоненты слайдера
  var sliderPin = effectLevelControls.querySelector('.effect-level__pin');
  var sliderLineDepth = effectLevelControls.querySelector('.effect-level__depth');
  var sliderValueControl = effectLevelControls.querySelector('.effect-level__value');

  // Компоненты масштабирования изображения
  var scaleControls = uploadedImageForm.querySelector('.img-upload__scale');
  var scaleControlSmaller = scaleControls.querySelector('.scale__control--smaller');
  var scaleControlBigger = scaleControls.querySelector('.scale__control--bigger');
  var scaleControlValue = scaleControls.querySelector('.scale__control--value');


  // Набор действий при открытии попапа
  uploadedImageForm.classList.remove('hidden');
  setImageFormDefaultState();

  document.addEventListener('keydown', onPopupEscPress);
  cancelButton.addEventListener('click', function () {
    closePopup();
  });

  for (var i = 0; i < imageEffectsList.length; i++) {
    addEffectClickHandler(imageEffectsList[i], uploadedImage);
  }

  // TODO Это событие не будет срабатывать!
  sliderValueControl.addEventListener('change', function () {
    alert('sdfsdsdf!');
  });

  scaleControlSmaller.addEventListener('click', function () {
    if (parseInt(scaleControlValue.value, 10) > 25) {
      changeScale(-SCALE_STEP);
    }
  });
  scaleControlBigger.addEventListener('click', function () {
    if (parseInt(scaleControlValue.value, 10) < 100) {
      changeScale(SCALE_STEP);
    }
  });

  descriptionField.addEventListener('focusin', function () {
    document.removeEventListener('keydown', onPopupEscPress);
  });
  descriptionField.addEventListener('focusout', function () {
    document.addEventListener('keydown', onPopupEscPress);
  });


  // Функции при открытии попапа
  function setImageFormDefaultState() {
    removeImageFilters(uploadedImage);
    setEffectButtonChecked(imageEffectsList, EFFECT_NONE_VALUE);
    uploadedImage.classList.add(EFFECT_NONE_CLASS);
    uploadedImage.style.transform = '';
    scaleControlValue.value = '100%';
    effectLevelControls.classList.add('hidden');
  }

  function removeImageFilters(image) {
    for (var j = 0; j < image.classList.length; j++) {
      if (image.classList[j].startsWith(EFFECT_CLASSNAME_PREFIX)) {
        image.classList.remove(image.classList[j]);
      }
    }
  }

  function setEffectButtonChecked(effectsList, effectValue) {
    for (var j = 0; j < effectsList.length; j++) {
      if (effectsList[j].value === effectValue) {
        effectsList[j].checked = true;
        break;
      }
    }
  }

  function onPopupEscPress(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closePopup();
    }
  }

  function closePopup() {
    uploadedImageForm.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
    uploadButton.value = '';
  }

  function setImageEffectByValue(value) {
    // TODO менять стили
    console.log('setImageEffectStyle');
  }

  function setSliderPositionByValue(value) {
    var valueInPixels = Math.floor(sliderLineDepth.offsetParent.clientWidth * value / 100);
    sliderPin.style.left = valueInPixels + 'px';
    sliderLineDepth.style.width = valueInPixels + 'px';
  }

  function addEffectClickHandler(effect, image) {
    effect.addEventListener('click', function () {
      removeImageFilters(image);
      image.classList.add(EFFECT_CLASSNAME_PREFIX + effect.value);
      if (effect.value === EFFECT_NONE_VALUE) {
        effectLevelControls.classList.add('hidden');
      } else {
        effectLevelControls.classList.remove('hidden');
        sliderValueControl.value = SLIDER_DEFAULT_VALUE;
        setSliderPositionByValue(SLIDER_DEFAULT_VALUE);
        setImageEffectByValue(SLIDER_DEFAULT_VALUE);
      }
    });
  }

  function changeScale(changeStep) {
    var currentValue = parseInt(scaleControlValue.value, 10);
    var newValue = currentValue + changeStep;
    scaleControlValue.value = newValue + '%';
    uploadedImage.style.transform = 'scale(' + newValue / 100 + ')';
  }

  function setEffectLevel() {
    var pinPosition = sliderPin.offsetLeft;
    var sliderValue = Math.floor(pinPosition / sliderLineDepth.offsetParent.clientWidth * 100);
    // Приведение к int, т.к. input type="number" возвращает value с типом string
    if (+sliderValueControl.value !== sliderValue) {
      sliderValueControl.value = sliderValue;
    }
  }

  // Управление перемещением слайдера
  sliderPin.addEventListener('mousedown', function (evt) {
    var sliderLinePosition = sliderPin.offsetParent.getBoundingClientRect();
    var sliderPinPosition = sliderPin.getBoundingClientRect();

    // Корректировка координаты с учетом наличия у пина размеров
    function getSliderPinCorrectionX(pinPosition, currentX) {
      var pinCenterX = pinPosition.left + pinPosition.width / 2;
      var pinCorrectionX = currentX - pinCenterX;
      return pinCorrectionX;
    }

    var startPositionX = evt.clientX;
    var pinCorrectionX = getSliderPinCorrectionX(sliderPinPosition, evt.clientX);

    function onMouseMove(moveEvt) {
      var newPositionX = moveEvt.clientX;
      if (newPositionX > sliderLinePosition.right + pinCorrectionX) {
        newPositionX = sliderLinePosition.right + pinCorrectionX;
      } else if (newPositionX < sliderLinePosition.left + pinCorrectionX) {
        newPositionX = sliderLinePosition.left + pinCorrectionX;
      }
      var shift = newPositionX - startPositionX;
      startPositionX = newPositionX;

      sliderPin.style.left = (sliderPin.offsetLeft + shift) + 'px';
      sliderLineDepth.style.width = (sliderLineDepth.offsetWidth + shift) + 'px';

      // TODO заполнить value контрола, посчитав %
      // Использовать setSliderPositionByValue?
    }

    function onMouseUp() {
      setEffectLevel();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // sliderPin.addEventListener('mouseup', function () {
  //   setEffectLevel();
  // });
}
