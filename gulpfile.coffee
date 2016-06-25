gulp = require 'gulp'

gulp.task 'example', ->
	propertyMerge = require './lib/index'
	gulp.src('example/src/**/*.html')
		.pipe propertyMerge
			properties:
				version: '2.0.1'
				author:
					name: 'Gary'
		.pipe gulp.dest('example/dest')

gulp.task 'default', ['compile']
