'use strict';

(function () {

  var deps = {
    slider: window.slider
  };

  var ESC_KEYCODE = 27;
  var EFFECT_CLASSNAME_PREFIX = 'effects__preview--';
  var EFFECT_NONE_NAME = 'none';
  var EFFECT_NONE_CLASS = EFFECT_CLASSNAME_PREFIX + EFFECT_NONE_NAME;
  var SCALE_STEP = 25;
  var SLIDER_DEFAULT_VALUE = 100;
  var effectFiltersMap = {
    'chrome': {
      filter: 'grayscale',
      minValue: 0,
      maxValue: 1,
      unit: ''
    },
    'sepia': {
      filter: 'sepia',
      minValue: 0,
      maxValue: 1,
      unit: ''
    },
    'marvin': {
      filter: 'invert',
      minValue: 0,
      maxValue: 100,
      unit: '%'
    },
    'phobos': {
      filter: 'blur',
      minValue: 0,
      maxValue: 3,
      unit: 'px'
    },
    'heat': {
      filter: 'brightness',
      minValue: 1,
      maxValue: 3,
      unit: ''
    }
  };


  var uploadButton = document.querySelector('#upload-file');
  // Компоненты формы настройки изображения
  var uploadedImageForm = document.querySelector('.img-upload__overlay');
  var uploadedImage = uploadedImageForm.querySelector('.img-upload__preview');
  var imageEffectsList = document.querySelectorAll('.effects__list .effects__radio');
  var cancelButton = uploadedImageForm.querySelector('#upload-cancel');
  var effectLevelControls = uploadedImageForm.querySelector('.img-upload__effect-level');
  var descriptionField = document.querySelector('.text__description');
  // Компоненты масштабирования изображения
  var scaleControls = uploadedImageForm.querySelector('.img-upload__scale');
  var scaleControlSmaller = scaleControls.querySelector('.scale__control--smaller');
  var scaleControlBigger = scaleControls.querySelector('.scale__control--bigger');
  var scaleControlValue = scaleControls.querySelector('.scale__control--value');
  // Хранение текущего выбранного эффекта
  var currentEffectName = EFFECT_NONE_NAME;


  /**
   * Изменения масштаба изображения
   * @param {number} changeStep шаг изменения масштаба
   */
  function changeScale(changeStep) {
    var currentValue = parseInt(scaleControlValue.value, 10);
    var newValue = currentValue + changeStep;
    scaleControlValue.value = newValue + '%';
    uploadedImage.style.transform = 'scale(' + newValue / 100 + ')';
  }

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

  /**
   * Удаление фильтров с изображения за счет удаления классов
   * @param {HTMLElement} image
   * @private
   */
  function removeImageFilters(image) {
    for (var j = 0; j < image.classList.length; j++) {
      var currentClass = image.classList[j];
      if (currentClass.startsWith(EFFECT_CLASSNAME_PREFIX)) {
        image.classList.remove(currentClass);
      }
    }
  }

  /**
   * Установка интенсивности эффекта изображения. Обнуляет текущий эффект, если указанный тип не найден
   * @param {number} value Интенсивность в %
   */
  function setImageStyle(value) {
    var filterInfo = effectFiltersMap[currentEffectName];
    if (filterInfo) {
      var styleValue = filterInfo.maxValue * +value / 100;
      if (styleValue < filterInfo.minValue) {
        styleValue = filterInfo.minValue;
      }
      var styleString = filterInfo.filter + '(' + styleValue + filterInfo.unit + ')';

      uploadedImage.style.filter = styleString;
    } else {
      uploadedImage.style.filter = '';
    }
  }

  /**
   * Добавление обработчиков на контролы с выбором эффекта изображения
   * @param {HTMLElement} effect контрол с конкретным эффектом
   * @param {HTMLElement} image изображение, на которое применяется эффект
   * @private
   */
  function addEffectClickHandler(effect, image) {
    effect.addEventListener('click', function (evt) {
      removeImageFilters(image);
      image.classList.add(EFFECT_CLASSNAME_PREFIX + effect.value);
      if (effect.value === EFFECT_NONE_NAME) {
        effectLevelControls.classList.add('hidden');
      } else {
        effectLevelControls.classList.remove('hidden');
        deps.slider.setStateByValue(SLIDER_DEFAULT_VALUE);
      }
      currentEffectName = evt.target.value;
      setImageStyle(SLIDER_DEFAULT_VALUE);
    });
  }

  /**
   * Установка checked атрибута для кнопки с указанным в параметре эффектом
   * @param {array} effectsList массив DOM элементов
   * @param {string} effectValue название эффекта
   * @private
   */
  function setEffectButtonChecked(effectsList, effectValue) {
    for (var j = 0; j < effectsList.length; j++) {
      if (effectsList[j].value === effectValue) {
        effectsList[j].checked = true;
        break;
      }
    }
  }

  /**
   * Установка дефолтных значений при открытии формы редактирования изображения
   * @private
   */
  function setImageFormDefaultState() {
    removeImageFilters(uploadedImage);
    setEffectButtonChecked(imageEffectsList, EFFECT_NONE_NAME);
    uploadedImage.classList.add(EFFECT_NONE_CLASS);
    uploadedImage.style.transform = '';
    uploadedImage.style.filter = '';
    scaleControlValue.value = '100%';
    effectLevelControls.classList.add('hidden');
  }

  /**
   * Набор действий при открытии попапа
   * @private
   */
  function openPopup() {
    function closePopup() {
      uploadedImageForm.classList.add('hidden');
      document.removeEventListener('keydown', onPopupEscPress);
      uploadButton.value = '';
    }

    function onPopupEscPress(evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closePopup();
      }
    }

    document.addEventListener('keydown', onPopupEscPress);
    cancelButton.addEventListener('click', function () {
      closePopup();
    });
    descriptionField.addEventListener('focusin', function () {
      document.removeEventListener('keydown', onPopupEscPress);
    });
    descriptionField.addEventListener('focusout', function () {
      document.addEventListener('keydown', onPopupEscPress);
    });

    setImageFormDefaultState();
    uploadedImageForm.classList.remove('hidden');
  }

  function init() {
    uploadButton.addEventListener('change', openPopup);
    // array foreach для совместиомсти с IE
    Array.prototype.forEach.call(imageEffectsList, function (it) {
      addEffectClickHandler(it, uploadedImage);
    });
    deps.slider.init(setImageStyle);
  }

  window.form = {
    init: init
  };
})();
