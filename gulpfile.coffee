gulp = require 'gulp'

gulp.task 'example', ->
	propertyMerge = require './lib/index'
	gulp.src('example/src/**/*.html')
		.pipe propertyMerge
			properties:
				version: '2.0.1'
				author:
					name: 'Gary'
			fallback: (key) ->
				if key is 'x'
					''
				else if key is 'y'
					false
				else
					key
		.pipe gulp.dest('example/dest')

gulp.task 'default', ['example']
