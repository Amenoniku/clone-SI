gulp = require "gulp"
stylus = require "gulp-stylus"
plumber = require "gulp-plumber"
autoprefixer = require "autoprefixer-stylus"
minifyCss = require "gulp-minify-css"
rename = require "gulp-rename"
paths = require "../paths"
pkg = require "../../package.json"
browsers = pkg.browsers

gulp.task "styles", ->
	gulp.src "*.styl", cwd: "content/styles", nonull: true
		.pipe do plumber
		.pipe stylus
			errors: true
			use: [
				autoprefixer(
					"Android >= " + browsers.android
					"Chrome >= " + browsers.chrome
					"Firefox >= " + browsers.firefox
					"Explorer >= " + browsers.ie
					"iOS >= " + browsers.ios
					"Opera >= " + browsers.opera
					"Safari >= " + browsers.safari
				)
			]
		.pipe do minifyCss
		.pipe rename suffix: ".min"
		.pipe gulp.dest paths.styles