'use strict';

(function () {
  // Компоненты слайдера в HTML
  var sliderPin = document.querySelector('.effect-level__pin');
  var sliderLineDepth = document.querySelector('.effect-level__depth');
  var sliderValueControl = document.querySelector('.effect-level__value');

  function init(callback) {
    /**
     * Управление слайдером
     * @param {Event} evt
     * @private
     */
    function onSliderUse(evt) {
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

      var sliderLinePosition = sliderPin.offsetParent.getBoundingClientRect();
      var sliderPinPosition = sliderPin.getBoundingClientRect();
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
        callback(sliderValueControl.value);
      }

      function onMouseUp() {
        setSliderValue();
        callback(sliderValueControl.value);
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      }
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
    sliderPin.addEventListener('mousedown', onSliderUse);
  }

  /**
   * Установка позиции слайдера на основе value из контрола effect-level__value
   * @param {number} value
   * @private
   */
  function setStateByValue(value) {
    sliderValueControl.value = value;
    var valueInPixels = Math.floor(sliderLineDepth.offsetParent.clientWidth * value / 100);
    sliderPin.style.left = valueInPixels + 'px';
    sliderLineDepth.style.width = valueInPixels + 'px';
  }

  window.slider = {
    init: init,
    setStateByValue: setStateByValue
  };
})();
