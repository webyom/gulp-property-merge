fs = require 'fs'
path = require 'path'
gutil = require 'gulp-util'
through = require 'through2'

getProperty = (propName, properties) ->
	tmp = propName.split '.'
	res = properties
	while tmp.length and res
		res = res[tmp.shift()]
	res

replaceProperties = (content, opt, _lang_) ->
	properties = opt.properties || {}
	properties._lang_ = _lang_
	lt = opt.lt || '%{{'
	gt = opt.gt || '}}%'
	content = content.replace new RegExp(lt + '([\\w\\-\\.]+)' + gt, 'g'), (full, propName) ->
		res = getProperty propName, properties
		if typeof res is 'string' then res else full
	delete properties._lang_
	content

module.exports = (opt = {}) ->
	through.obj (file, enc, next) ->
		return @emit 'error', new gutil.PluginError('gulp-property-merge', 'File can\'t be null') if file.isNull()
		return @emit 'error', new gutil.PluginError('gulp-property-merge', 'Streams not supported') if file.isStream()
		content = replaceProperties file.contents.toString('utf-8'), opt, file._lang_
		file.contents = new Buffer content
		@push file
		next()
