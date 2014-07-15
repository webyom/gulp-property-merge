(function() {
  var fs, getProperty, gutil, path, replaceProperties, through;

  fs = require('fs');

  path = require('path');

  gutil = require('gulp-util');

  through = require('through2');

  getProperty = function(propName, properties) {
    var res, tmp;
    tmp = propName.split('.');
    res = properties;
    while (tmp.length && res) {
      res = res[tmp.shift()];
    }
    return res;
  };

  replaceProperties = function(content, opt, _lang_) {
    var gt, lt, properties;
    properties = opt.properties || {};
    properties._lang_ = _lang_;
    lt = opt.lt || '%{{';
    gt = opt.gt || '}}%';
    content = content.replace(new RegExp(lt + '([\\w\\-\\.]+)' + gt, 'g'), function(full, propName) {
      var res;
      res = getProperty(propName, properties);
      if (typeof res === 'string') {
        return res;
      } else {
        return full;
      }
    });
    delete properties._lang_;
    return content;
  };

  module.exports = function(opt) {
    if (opt == null) {
      opt = {};
    }
    return through.obj(function(file, enc, next) {
      var content;
      if (file.isNull()) {
        return this.emit('error', new gutil.PluginError('gulp-property-merge', 'File can\'t be null'));
      }
      if (file.isStream()) {
        return this.emit('error', new gutil.PluginError('gulp-property-merge', 'Streams not supported'));
      }
      content = replaceProperties(file.contents.toString(), opt, file._lang_);
      file.contents = new Buffer(content);
      this.push(file);
      return next();
    });
  };

}).call(this);
