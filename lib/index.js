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

replaceProperties = function(file, opt) {
  var content, gt, lt, properties, tmp;
  content = file.contents.toString()
  properties = opt.properties || {};
  properties._lang_ = file._lang_;
  properties._file_ = {
    base: file.base,
    path: file.path,
    relativePath: path.relative(file.base, file.path),
    basename: path.basename(file.path),
    extname: path.extname(file.path)
  };
  if (properties._file_.extname) {
    properties._file_.name = properties._file_.basename.slice(0, -properties._file_.extname.length);
  } else {
    properties._file_.name = properties._file_.basename;
  }
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
  delete properties._file_;
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
    content = replaceProperties(file, opt);
    file.contents = new Buffer(content);
    this.push(file);
    return next();
  });
};
