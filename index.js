'use strict';

var through = require('through2'),
    gutil = require('gulp-util'),
    transform = require('es6-module-jstransform'),
    PluginError = gutil.PluginError,
    PLUGIN_NAME = 'gulp-es6-module-jstransform',
    ERR_TPL = '<%= lineNumber %>:<%= column %>: <%= description %>';

function gulpEs6ModuleJsTransform() {
  return through.obj(function(file, enc, callback) {
    var src,
        data,
        tpl;

    if (file.isNull()) {
      this.push(file);
      return callback();
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return callback();
    }

    if (file.isBuffer()) {
      src = file.contents.toString('utf8');
      try {
        data = transform(src);
        file.contents = new Buffer(data.code);
      } catch (err) {
        err.file = file;
        tpl = (file.path ? '<%= file.path %>:' : '') + ERR_TPL;
        this.emit('error', new PluginError(PLUGIN_NAME, gutil.template(tpl, err)));
      }
      this.push(file);
      return callback();
    }

  });
};

module.exports = gulpEs6ModuleJsTransform;
