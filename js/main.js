'use strict';
(function () {
  var deps = {
    data: window.data,
    gallery: window.gallery,
    form: window.form
  };

  var errors = [];
  function saveError(message) {
    errors.push(message);
  }

  deps.data.load('https://js.dump.academy/kekstagram/data', deps.gallery.init, saveError);
  deps.form.init();
})();
