gulp = require "gulp"
jade = require "gulp-jade"
plumber = require "gulp-plumber"
paths = require "../paths"

data = 
	title: "clone Space Invaders"

gulp.task "jade", ->
	gulp.src "content/views/root/*.jade"
		.pipe do plumber
		.pipe jade data: data
		.pipe gulp.dest paths.dist

gulp.task "ng-templ", ->
	gulp.src "content/views/ng-views/**/*.jade"
		.pipe do plumber
		.pipe do jade
		.pipe gulp.dest paths.views

gulp.task "template", ["jade", "ng-templ"]