'use strict';

var deps = {
  data: window.data,
  gallery: window.gallery,
  form: window.form
};

var picturesInfo = deps.data.generateMocks();
deps.gallery.addPicturesToPage(picturesInfo);
deps.form.addFormHandlers();
