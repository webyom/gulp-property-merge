gulp = require 'gulp'
coffee = require 'gulp-coffee'

gulp.task 'compile', ->
	gulp.src('src/**/*.coffee')
		.pipe coffee()
		.pipe gulp.dest('lib')

gulp.task 'example', ->
	propertyMerge = require './lib/index'
	gulp.src('example/src/**/*.html')
		.pipe propertyMerge
			properties:
				version: '1.0.1'
				author:
					name: 'Gary'
		.pipe gulp.dest('example/dest')

gulp.task 'default', ['compile']