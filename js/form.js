'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var EFFECT_CLASSNAME_PREFIX = 'effects__preview--';
  var EFFECT_NONE_NAME = 'none';
  var EFFECT_NONE_CLASS = EFFECT_CLASSNAME_PREFIX + EFFECT_NONE_NAME;
  var SCALE_STEP = 25;
  var SLIDER_DEFAULT_VALUE = 100;
  var EFFECTS_INFO = [
    {
      type: 'chrome',
      filter: 'grayscale',
      minValue: 0,
      maxValue: 1,
      unit: ''
    },
    {
      type: 'sepia',
      filter: 'sepia',
      minValue: 0,
      maxValue: 1,
      unit: ''
    },
    {
      type: 'marvin',
      filter: 'invert',
      minValue: 0,
      maxValue: 100,
      unit: '%'
    },
    {
      type: 'phobos',
      filter: 'blur',
      minValue: 0,
      maxValue: 3,
      unit: 'px'
    },
    {
      type: 'heat',
      filter: 'brightness',
      minValue: 1,
      maxValue: 3,
      unit: ''
    }
  ];


  var uploadButton = document.querySelector('#upload-file');
  // Компоненты формы настройки изображения
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
      if (image.classList[j].startsWith(EFFECT_CLASSNAME_PREFIX)) {
        image.classList.remove(image.classList[j]);
      }
    }
  }

  /**
   * Установка интенсивности эффекта изображения. Обнуляет текущий эффект, если указанный тип не найден
   * @param {string} effectType Тип эффекта
   * @param {number} value Интенсивность в %
   */
  function setImageStyle(effectType, value) {
    for (var j = 0; j < EFFECTS_INFO.length; j++) {
      var currentEffect = EFFECTS_INFO[j];
      if (currentEffect.type === effectType) {
        var styleValue = currentEffect.maxValue * +value / 100;
        if (styleValue < currentEffect.minValue) {
          styleValue = currentEffect.minValue;
        }
        var styleString = currentEffect.filter + '(' + styleValue + currentEffect.unit + ')';
        uploadedImage.style.filter = styleString;
        return;
      }
    }
    uploadedImage.style.filter = '';
  }

  /**
   * Установка позиции слайдера на основе value из контрола effect-level__value
   * @param {number} value
   * @private
   */
  function setSliderPositionByValue(value) {
    var valueInPixels = Math.floor(sliderLineDepth.offsetParent.clientWidth * value / 100);
    sliderPin.style.left = valueInPixels + 'px';
    sliderLineDepth.style.width = valueInPixels + 'px';
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
        sliderValueControl.value = SLIDER_DEFAULT_VALUE;
        setSliderPositionByValue(SLIDER_DEFAULT_VALUE);
      }
      currentEffectName = evt.target.value;
      setImageStyle(currentEffectName, SLIDER_DEFAULT_VALUE);
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

  /**
   * Управление слайдером, регулирующим интенсивность эффекта изображения
   * @param {Event} evt
   * @private
   */
  function onSliderUse(evt) {
    var sliderLinePosition = sliderPin.offsetParent.getBoundingClientRect();
    var sliderPinPosition = sliderPin.getBoundingClientRect();

    /**
     * Установка value слайдера на основе текущей позиции пина
     */
    function setSliderValue() {
      // Преобразование позиции на слайдере в %
      var sliderValue = Math.floor(sliderPin.offsetLeft / sliderLineDepth.offsetParent.clientWidth * 100);
      // Приведение к int, т.к. input всегда возвращает value с типом string
      if (+sliderValueControl.value !== sliderValue) {
        sliderValueControl.value = sliderValue;
      }
    }

    /**
     * Корректировка координаты с учетом наличия у пина размеров
     * @param {HTMLElement} pinPosition позиция пина слайдера
     * @param {number} currentX позиция нажатия на пин
     * @return {number}
     */
    function getSliderPinCorrectionX(pinPosition, currentX) {
      var pinCenterX = pinPosition.left + pinPosition.width / 2;
      var pinCorrectionX = pinCenterX - currentX;
      return pinCorrectionX;
    }

    var pinCorrectionX = getSliderPinCorrectionX(sliderPinPosition, evt.clientX);
    var startPinPositionX = evt.clientX + pinCorrectionX;

    function onMouseMove(moveEvt) {
      var newPinPositionX = moveEvt.clientX + pinCorrectionX;
      if (newPinPositionX > sliderLinePosition.right) {
        newPinPositionX = sliderLinePosition.right;
      } else if (newPinPositionX < sliderLinePosition.left) {
        newPinPositionX = sliderLinePosition.left;
      }
      var shift = newPinPositionX - startPinPositionX;
      startPinPositionX = newPinPositionX;

      sliderPin.style.left = (sliderPin.offsetLeft + shift) + 'px';
      sliderLineDepth.style.width = (sliderLineDepth.offsetWidth + shift) + 'px';
      setSliderValue();
      setImageStyle(currentEffectName, sliderValueControl.value);
    }

    function onMouseUp() {
      setSliderValue();
      setImageStyle(currentEffectName, sliderValueControl.value);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  function addFormHandlers() {
    uploadButton.addEventListener('change', openPopup);
    sliderPin.addEventListener('mousedown', onSliderUse);
    for (var i = 0; i < imageEffectsList.length; i++) {
      addEffectClickHandler(imageEffectsList[i], uploadedImage);
    }
  }

  window.form = {
    addFormHandlers: addFormHandlers
  };
})();
