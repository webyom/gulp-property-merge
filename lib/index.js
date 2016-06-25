var fs, getProperty, gutil, path, replaceProperties, through;
fs = require('fs');
path = require('path');
gutil = require('gulp-util');
through = require('through2');

getProperty = function(propName, properties) {
  with (properties) {
    return eval(propName);
  }
};

replaceProperties = function(content, opt, _lang_) {
  var gt, lt, properties, tmp;
  properties = opt.properties || {};
  properties._lang_ = _lang_;
  lt = opt.lt || '%{{';
  gt = opt.gt || '}}%';
  content = content.split(lt).map(function(part, i) {
    var p;
    if (part.indexOf(gt) > 0) {
      part = part.split(gt);
      p = getProperty(part.shift(), properties);
      return p + part.join(gt);
    } else if (i === 0) {
      return part;
    } else {
      return lt + part;
    }
  }).join('');
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
