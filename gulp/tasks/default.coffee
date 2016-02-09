gulp = require "gulp"
gutil = require "gulp-util"
runSequence = require "run-sequence"

gulp.task "stylesDependences", ->
	runSequence ["sprite", "icons", "styles"]

gulp.task "default", ["del"], ->
	runSequence [
			"watch"
			"stylesDependences",
			"scripts"
			"template"
			"copy"
		], "server"

gulp.task "build", ["del"], ->
	gulp.start(
		"stylesDependences"
		"scripts"
		"template"
		"copy"
	)